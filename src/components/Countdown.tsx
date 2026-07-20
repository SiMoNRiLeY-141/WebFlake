import React, { useState, useEffect } from "react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isChristmas: boolean;
}

export const Countdown: React.FC = () => {
  const calculateTimeLeft = (): TimeRemaining => {
    const now = new Date();
    const currentYear = now.getFullYear();
    let christmasDate = new Date(`December 25, ${currentYear} 00:00:00`);

    // If Christmas has already passed this year, count down to next year's Christmas
    if (now.getTime() > christmasDate.getTime()) {
      christmasDate = new Date(`December 25, ${currentYear + 1} 00:00:00`);
    }

    const difference = christmasDate.getTime() - now.getTime();

    // Check if it's Christmas Day
    const isChristmas = now.getMonth() === 11 && (now.getDate() === 25 || now.getDate() === 26); // Dec 25 & 26 festive days

    if (difference <= 0 || isChristmas) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isChristmas: true };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isChristmas: false,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : `${num}`;
  };

  if (timeLeft.isChristmas) {
    return (
      <div className="countdown-card glass-card is-christmas">
        <div className="christmas-wish text-center">
          <h2 className="wish-title animate-pulse">🎄 Merry Christmas! 🎄</h2>
          <p className="wish-subtitle">Wishing you warmth, joy, and peace this holiday season!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="countdown-container">
      <h3 className="countdown-title festive-text">Countdown to Christmas</h3>
      <div className="countdown-grid">
        <div className="time-block">
          <div className="time-val">{formatNumber(timeLeft.days)}</div>
          <div className="time-label">Days</div>
        </div>
        <div className="time-block">
          <div className="time-val">{formatNumber(timeLeft.hours)}</div>
          <div className="time-label">Hours</div>
        </div>
        <div className="time-block">
          <div className="time-val">{formatNumber(timeLeft.minutes)}</div>
          <div className="time-label">Minutes</div>
        </div>
        <div className="time-block animate-pulse-seconds">
          <div className="time-val">{formatNumber(timeLeft.seconds)}</div>
          <div className="time-label">Seconds</div>
        </div>
      </div>

      <style>{`
        .countdown-container {
          text-align: center;
          padding: 1rem 0;
        }
        .countdown-title {
          font-size: 1.8rem;
          color: var(--gold-primary);
          margin-bottom: 1.5rem;
          letter-spacing: 2px;
          text-shadow: 0 0 10px var(--gold-glow);
        }
        .countdown-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
        }
        .time-block {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1.25rem 0.5rem;
          box-shadow: inset 0 2px 4px rgba(255,255,255,0.05);
          position: relative;
          backdrop-filter: blur(5px);
          transition: transform 0.2s ease;
        }
        .time-block:hover {
          transform: scale(1.05);
          border-color: var(--gold-glow);
        }
        .time-val {
          font-family: var(--font-body);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-main);
          line-height: 1.1;
          text-shadow: 0 0 8px rgba(255,255,255,0.2);
        }
        .time-label {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
          margin-top: 0.5rem;
          font-weight: 500;
        }
        .animate-pulse-seconds {
          border-color: hsla(355, 80%, 52%, 0.2);
        }
        .animate-pulse-seconds .time-val {
          color: var(--crimson-primary);
          text-shadow: 0 0 8px var(--crimson-glow);
        }
        .is-christmas {
          background: linear-gradient(135deg, hsla(355, 80%, 52%, 0.15) 0%, hsla(152, 70%, 45%, 0.15) 100%);
          border: 1.5px solid var(--gold-primary);
          padding: 2.5rem;
          box-shadow: 0 0 30px var(--gold-glow);
        }
        .wish-title {
          font-size: 3rem;
          color: var(--gold-primary);
          text-shadow: 0 0 20px var(--gold-glow);
          margin-bottom: 1rem;
          font-family: var(--font-festive);
        }
        .wish-subtitle {
          font-size: 1.2rem;
          color: var(--text-main);
          font-family: var(--font-body);
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .animate-pulse {
          animation: pulse 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
