import React, { useEffect, useRef } from "react";

interface SnowfallProps {
  density: number; // number of flakes
  speed: number; // fall speed multiplier (0.5 to 5)
  wind: number; // horizontal drift (-5 to 5)
  shape: "circle" | "crystal" | "star";
}

interface Snowflake {
  x: number;
  y: number;
  r: number; // radius
  d: number; // density/weight
  swingSpeed: number;
  swingRange: number;
  swingOffset: number;
}

export const Snowfall: React.FC<SnowfallProps> = ({
  density = 50,
  speed = 1.5,
  wind = 0.5,
  shape = "circle",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-adjust sizes on resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Initialize snowflakes
    const flakes: Snowflake[] = [];
    const createFlakes = (count: number) => {
      flakes.length = 0;
      for (let i = 0; i < count; i++) {
        flakes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 3 + 1.5, // radius between 1.5 and 4.5
          d: Math.random() + 0.2, // fall speed weight
          swingSpeed: Math.random() * 0.02 + 0.005,
          swingRange: Math.random() * 15 + 5,
          swingOffset: Math.random() * Math.PI * 2,
        });
      }
    };

    createFlakes(density);

    // Draw functions
    const drawCircle = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      c.beginPath();
      c.arc(x, y, r, 0, Math.PI * 2, true);
      c.fill();
    };

    const drawCrystal = (c: CanvasRenderingContext2D, x: number, y: number, r: number) => {
      c.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        c.moveTo(x, y);
        c.lineTo(x + Math.cos(angle) * r * 1.5, y + Math.sin(angle) * r * 1.5);
      }
      c.strokeStyle = "rgba(255, 255, 255, 0.85)";
      c.lineWidth = 1;
      c.stroke();
    };

    const drawStar = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number
    ) => {
      let rot = (Math.PI / 2) * 3;
      let sx = cx;
      let sy = cy;
      const step = Math.PI / spikes;

      c.beginPath();
      c.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        sx = cx + Math.cos(rot) * outerRadius;
        sy = cy + Math.sin(rot) * outerRadius;
        c.lineTo(sx, sy);
        rot += step;

        sx = cx + Math.cos(rot) * innerRadius;
        sy = cy + Math.sin(rot) * innerRadius;
        c.lineTo(sx, sy);
        rot += step;
      }
      c.lineTo(cx, cy - outerRadius);
      c.closePath();
      c.fill();
    };

    let tick = 0;
    const updateAndDraw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      tick += 0.01;

      // Adjust density if target changed
      if (flakes.length !== density) {
        createFlakes(density);
      }

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        // Draw snowflake based on shape
        if (shape === "circle") {
          drawCircle(ctx, f.x, f.y, f.r);
        } else if (shape === "crystal") {
          drawCrystal(ctx, f.x, f.y, f.r);
        } else if (shape === "star") {
          drawStar(ctx, f.x, f.y, 5, f.r * 1.5, f.r * 0.7);
        }

        // Update positions
        // Base falling speed + variable weight
        f.y += (speed + f.d * 1.5) * 0.8;
        // Side to side swaying animation
        f.x += Math.sin(tick * f.swingSpeed * 100 + f.swingOffset) * 0.4 + wind * 0.1;

        // Reset if goes off screen
        if (f.y > height + 10) {
          f.y = -10;
          f.x = Math.random() * width;
        }
        if (f.x > width + 10) {
          f.x = -10;
        } else if (f.x < -10) {
          f.x = width + 10;
        }
      }

      animationFrameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [density, speed, wind, shape]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        width: "100vw",
        height: "100vh",
        zIndex: 1,
      }}
    />
  );
};
