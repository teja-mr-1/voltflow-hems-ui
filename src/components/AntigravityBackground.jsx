import React, { useEffect, useRef } from 'react';
import { useEnergy } from '../context/EnergyContext';

export const AntigravityBackground = () => {
  const canvasRef = useRef(null);
  const { theme } = useEnergy();

  // Floating micro-energy particles drifting weightlessly upwards
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create 45 weightless floating particles
    const particleCount = 45;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(5, 150, 105, ' : 'rgba(217, 119, 6, ',
      alpha: Math.random() * 0.35 + 0.1,
      speedY: - (Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        // Move particle upwards
        p.y += p.speedY;
        p.x += p.speedX;

        // Pulse alpha
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.05, Math.min(0.6, p.alpha));

        // Reset particle when it floats off top
        if (p.y < -10) {
          p.y = canvas.height + 10;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;

        // Draw floating energy particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentAlpha})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <div className="antigravity-bg-wrapper">
      {/* Animated Floating Gradient Orbs */}
      <div className="antigravity-orb orb-emerald" />
      <div className="antigravity-orb orb-cyan" />
      <div className="antigravity-orb orb-violet" />
      <div className="antigravity-orb orb-amber" />

      {/* Floating Energy Particles Canvas Layer */}
      <canvas ref={canvasRef} className="antigravity-canvas" />
    </div>
  );
};
