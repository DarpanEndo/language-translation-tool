import React, { useEffect, useRef } from 'react';

// Include letters from different languages
const letters = [
  ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  ...'あいうえおかきくけこ',
  ...'أبتثجحخدذر',
  ...'अआइईउऊएऐ',
  ...'你好谢谢再见'
].split('');

function SpaceBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 14 + 8; // Larger size for letters
        this.speed = Math.random() * 0.5 + 0.2;
        this.letter = letters[Math.floor(Math.random() * letters.length)];
        this.opacity = Math.random() * 0.5 + 0.1;
        this.rotation = Math.random() * 360;
        this.direction = Math.random() * Math.PI * 2;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 70%)`; // Blue-ish colors
      }

      update() {
        // Move in random directions
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
        this.rotation += 0.2;

        // Wrap around screen
        if (this.x < -50) this.x = canvas.width + 50;
        if (this.x > canvas.width + 50) this.x = -50;
        if (this.y < -50) this.y = canvas.height + 50;
        if (this.y > canvas.height + 50) this.y = -50;

        // Randomly change direction
        if (Math.random() < 0.01) {
          this.direction += (Math.random() - 0.5) * 0.5;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.font = `${this.size}px Arial`;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fillText(this.letter, 0, 0);
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = Array.from({ length: 150 }, () => new Particle());
    };

    const animate = () => {
      // Create a dark, semi-transparent background effect
      ctx.fillStyle = 'rgba(17, 24, 39, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full bg-gray-900"
      style={{ 
        zIndex: 1,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh'
      }}
    />
  );
}

export default SpaceBackground; 