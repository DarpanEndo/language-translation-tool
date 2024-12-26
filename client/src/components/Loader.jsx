import React from 'react';
import { BookLoader } from "react-awesome-loaders";

export function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <BookLoader
        background={"linear-gradient(135deg, #6366F1, #4F46E5)"}
        desktopSize={"100px"}
        mobileSize={"80px"}
        textColor={"#4F46E5"}
      />
    </div>
  );
} 