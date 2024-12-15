import React, { useState, useEffect, useRef } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  color: string;
  rotation: number;
}

interface ParticleSystemProps {
  duration?: number;
  count?: number;
  colors?: string[];
  velocity?: number;
  enabled?: boolean;
  origin?: { x: number; y: number };
  paused?: boolean;
}

export const ParticleSystem = ({
  duration = 2000,
  count = 100,
  colors = ["#ff4d4d", "#ff9e40", "#3b82f6"],
  velocity = 10,
  enabled = true,
  origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 },
  paused = false,
}: ParticleSystemProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const intervalTime = 1000 / count;

    const generateParticle = () => {
      const newParticle: Particle = {
        id: Date.now() + Math.random(),
        x: origin.x,
        y: origin.y,
        velocityX: (Math.random() - 0.5) * velocity,
        velocityY: (Math.random() - 0.5) * velocity,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
      };

      setParticles((prev) => [...prev, newParticle]);

      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, duration);
    };

    const interval = setInterval(generateParticle, intervalTime);

    return () => clearInterval(interval);
  }, [enabled, colors, count, duration, velocity, origin]);

  useEffect(() => {
    if (paused) return;

    let animationFrameId: number;

    const updateParticles = () => {
      setParticles((prevParticles) =>
        prevParticles
          .map((particle) => ({
            ...particle,
            x: particle.x + particle.velocityX,
            y: particle.y + particle.velocityY,
          }))
          .filter(
            (particle) =>
              particle.x > 0 &&
              particle.x < window.innerWidth &&
              particle.y > 0 &&
              particle.y < window.innerHeight
          )
      );

      animationFrameId = requestAnimationFrame(updateParticles);
    };

    animationFrameId = requestAnimationFrame(updateParticles);

    return () => cancelAnimationFrame(animationFrameId);
  }, [paused]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute  w-4 h-4"
          style={{
            left: particle.x,
            top: particle.y,
            backgroundColor: particle.color,
            rotate: `${particle.rotation}deg`,
            animation: `scale-effect ${duration / 1000}s ease-out forwards`,
          }}
        ></div>
      ))}
    </div>
  );
};

export const useParticleSystem = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updatePosition = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, []);

  return { ref, position };
};
