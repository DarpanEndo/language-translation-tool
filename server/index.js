const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// List of public LibreTranslate instances
const LIBRE_TRANSLATE_SERVERS = [
  "https://translate.argosopentech.com",
  "https://translate.terraprint.co",
  "https://libretranslate.de",
  "https://lt.vern.cc",
];

async function googleTranslate(text, targetLang, sourceLang = "auto") {
  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: sourceLang,
          tl: targetLang,
          dt: "t",
          q: text,
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
        },
        timeout: 10000,
      }
    );

    if (response.data && response.data[0]) {
      const translatedText = response.data[0]
        .map((segment) => segment[0])
        .join("");

      return {
        translatedText,
        detectedLang: response.data[2] || sourceLang,
      };
    }
    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Google Translate error:", error.message);
    throw error;
  }
}

async function detectLanguageGoogle(text) {
  try {
    const response = await axios.get(
      "https://translate.googleapis.com/translate_a/single",
      {
        params: {
          client: "gtx",
          sl: "auto",
          tl: "en",
          dt: "t",
          q: text,
        },
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/94.0.4606.81 Safari/537.36",
        },
        timeout: 5000,
      }
    );

    return response.data[2];
  } catch (error) {
    console.error("Google language detection failed:", error.message);
    throw error;
  }
}

async function translateText(text, targetLang, sourceLang = "auto") {
  if (!text.trim()) return "";

  for (const server of LIBRE_TRANSLATE_SERVERS) {
    try {
      // First detect language if auto
      let detectedLang = sourceLang;
      if (sourceLang === "auto") {
        try {
          const detectResponse = await axios.post(`${server}/detect`, {
            q: text,
          });
          if (detectResponse.data && detectResponse.data[0]) {
            detectedLang = detectResponse.data[0].language;
            console.log(
              `✅ Language detected using LibreTranslate: ${detectedLang}`
            );
          }
        } catch (error) {
          console.log(
            `❌ LibreTranslate language detection failed for ${server}, trying Google...`
          );
          try {
            detectedLang = await detectLanguageGoogle(text);
            console.log(`✅ Google detected language: ${detectedLang}`);
          } catch (googleError) {
            console.log(`❌ Google detection failed, continuing with auto...`);
            continue;
          }
        }
      }

      // Then translate
      const response = await axios.post(
        `${server}/translate`,
        {
          q: text,
          source: detectedLang === "auto" ? "auto" : detectedLang,
          target: targetLang,
          format: "text",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data?.translatedText) {
        console.log("\n=== Translation Successful ===");
        console.log(`🌐 Service: LibreTranslate (${server})`);
        console.log(`📝 Original text: "${text}"`);
        console.log(`🔍 Detected language: ${detectedLang}`);
        console.log(`🎯 Target language: ${targetLang}`);
        console.log(`✨ Translated text: "${response.data.translatedText}"`);
        console.log("===========================\n");

        return {
          translatedText: response.data.translatedText,
          detectedLang: detectedLang,
        };
      }
    } catch (error) {
      console.log(`❌ Failed with server ${server}, trying next...`);
      continue;
    }
  }

  try {
    console.log("🔄 LibreTranslate servers failed, trying Google Translate...");
    const result = await googleTranslate(text, targetLang, sourceLang);

    console.log("\n=== Translation Successful ===");
    console.log(`🌐 Service: Google Translate (Fallback)`);
    console.log(`📝 Original text: "${text}"`);
    console.log(`🔍 Detected language: ${result.detectedLang}`);
    console.log(`🎯 Target language: ${targetLang}`);
    console.log(`✨ Translated text: "${result.translatedText}"`);
    console.log("===========================\n");

    return result;
  } catch (error) {
    console.error("❌ Google Translate fallback failed:", error);
    throw new Error("All translation services failed");
  }
}

app.post("/translate-text", async (req, res) => {
  try {
    let { text, targetLang, sourceLang = "auto" } = req.body;

    if (!text || !targetLang) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const result = await translateText(text, targetLang, sourceLang);

    if (!result.translatedText) {
      throw new Error("Translation failed");
    }

    res.json({
      translatedText: result.translatedText,
      detectedLang: result.detectedLang,
    });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({
      error: "Translation failed",
      details: error.message,
    });
  }
});

// Languages endpoint
app.get("/languages", async (req, res) => {
  try {
    // Try to get languages from any available server
    for (const server of LIBRE_TRANSLATE_SERVERS) {
      try {
        const response = await axios.get(`${server}/languages`);
        if (response.data && Array.isArray(response.data)) {
          const languages = response.data.map((lang) => ({
            code: lang.code,
            name: lang.name,
          }));
          // Add auto detection option
          languages.unshift({ code: "auto", name: "Detect Language" });
          return res.json(languages);
        }
      } catch (error) {
        continue;
      }
    }

    // Fallback static language list
    const languages = [
      { code: "auto", name: "Detect Language" },
      { code: "en", name: "English" },
      { code: "es", name: "Spanish" },
      { code: "fr", name: "French" },
      { code: "de", name: "German" },
      { code: "it", name: "Italian" },
      { code: "pt", name: "Portuguese" },
      { code: "ru", name: "Russian" },
      { code: "ja", name: "Japanese" },
      { code: "ko", name: "Korean" },
      { code: "zh", name: "Chinese" },
      { code: "ar", name: "Arabic" },
      { code: "hi", name: "Hindi" },
    ];
    res.json(languages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch languages" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
