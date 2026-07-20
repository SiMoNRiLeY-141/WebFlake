import React, { useState } from "react";

type CardStyle = "hearth" | "starry" | "forest" | "sparkles";

export const GreetingCardMaker: React.FC = () => {
  const [recipient, setRecipient] = useState("Friend");
  const [message, setMessage] = useState(
    "Wishing you a season filled with sweet moments, cozy nights, and magical memories. Happy Holidays!"
  );
  const [sender, setSender] = useState("WebFlaker");
  const [cardStyle, setCardStyle] = useState<CardStyle>("hearth");
  const [stickers, setStickers] = useState<string[]>(["🎄", "❄️"]);
  const [isFlipped, setIsFlipped] = useState(false);

  const availableStickers = ["🎄", "🎅", "❄️", "🎁", "⛄", "🔔", "🌟", "🍪"];

  const toggleSticker = (sticker: string) => {
    if (stickers.includes(sticker)) {
      setStickers(stickers.filter((s) => s !== sticker));
    } else {
      if (stickers.length < 5) {
        setStickers([...stickers, sticker]);
      }
    }
  };

  const getStyleBackground = () => {
    switch (cardStyle) {
      case "hearth":
        return "linear-gradient(135deg, hsl(12, 75%, 20%) 0%, hsl(0, 50%, 8%) 100%)";
      case "starry":
        return "linear-gradient(135deg, hsl(230, 70%, 15%) 0%, hsl(240, 60%, 6%) 100%)";
      case "forest":
        return "linear-gradient(135deg, hsl(145, 60%, 14%) 0%, hsl(160, 50%, 5%) 100%)";
      case "sparkles":
        return "linear-gradient(135deg, hsl(38, 50%, 20%) 0%, hsl(20, 40%, 8%) 100%)";
      default:
        return "linear-gradient(135deg, var(--sky-light) 0%, var(--sky-dark) 100%)";
    }
  };

  const getStyleBorder = () => {
    switch (cardStyle) {
      case "sparkles":
      case "hearth":
        return "2px solid var(--gold-primary)";
      case "forest":
        return "2px solid var(--emerald-primary)";
      case "starry":
      default:
        return "2px solid rgba(255, 255, 255, 0.2)";
    }
  };

  return (
    <div className="card-maker-container">
      <div className="card-maker-sidebar">
        <h3 className="sidebar-title">Digital Greeting Designer</h3>

        <div className="control-group">
          <label>To:</label>
          <input
            type="text"
            className="card-input"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            maxLength={25}
          />
        </div>

        <div className="control-group">
          <label>Message:</label>
          <textarea
            className="card-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={180}
            rows={3}
          />
        </div>

        <div className="control-group">
          <label>From:</label>
          <input
            type="text"
            className="card-input"
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            maxLength={25}
          />
        </div>

        <div className="control-group">
          <label>Card Theme:</label>
          <div className="theme-selector">
            <button
              className={`theme-btn hearth ${cardStyle === "hearth" ? "active" : ""}`}
              onClick={() => setCardStyle("hearth")}
              title="Cozy Hearth"
            />
            <button
              className={`theme-btn starry ${cardStyle === "starry" ? "active" : ""}`}
              onClick={() => setCardStyle("starry")}
              title="Starry Night"
            />
            <button
              className={`theme-btn forest ${cardStyle === "forest" ? "active" : ""}`}
              onClick={() => setCardStyle("forest")}
              title="Emerald Forest"
            />
            <button
              className={`theme-btn sparkles ${cardStyle === "sparkles" ? "active" : ""}`}
              onClick={() => setCardStyle("sparkles")}
              title="Golden Sparkles"
            />
          </div>
        </div>

        <div className="control-group">
          <label>Add Stickers (Max 5):</label>
          <div className="sticker-selector">
            {availableStickers.map((sticker) => (
              <button
                key={sticker}
                className={`sticker-btn ${stickers.includes(sticker) ? "selected" : ""}`}
                onClick={() => toggleSticker(sticker)}
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>

        <div className="button-row">
          <button className="btn btn-outline" onClick={() => setIsFlipped(!isFlipped)}>
            {isFlipped ? "Show Front Cover" : "Open Card Inside"}
          </button>
        </div>
      </div>

      <div className="card-preview-area">
        <div className={`card-3d-wrapper ${isFlipped ? "flipped" : ""}`}>
          {/* FRONT OF THE CARD */}
          <div
            className="card-face card-front"
            style={{ background: getStyleBackground(), border: getStyleBorder() }}
            onClick={() => setIsFlipped(true)}
          >
            <div className="card-border-decor"></div>
            <div className="card-front-content">
              <span className="cover-snow">❄️</span>
              <h2 className="cover-title">Warmest Wishes</h2>
              <div className="cover-art">
                {stickers.map((s, idx) => (
                  <span key={idx} className={`cover-sticker sticker-pos-${idx}`}>
                    {s}
                  </span>
                ))}
                {stickers.length === 0 && <span className="cover-sticker">✨</span>}
              </div>
              <p className="cover-footer">Open For Holiday Cheer</p>
            </div>
          </div>

          {/* INSIDE OF THE CARD */}
          <div
            className="card-face card-back"
            style={{ background: getStyleBackground(), border: getStyleBorder() }}
            onClick={() => setIsFlipped(false)}
          >
            <div className="card-border-decor"></div>
            <div className="card-inside-content">
              <div className="card-inside-header">Dear {recipient || "Friend"},</div>
              <div className="card-inside-body">{message || "Happy Holidays!"}</div>
              <div className="card-inside-footer">
                <div>With love,</div>
                <div className="sender-name">{sender || "WebFlaker"}</div>
              </div>
              <div className="card-inside-decorations">
                <span>❄️</span>
                <span>⭐</span>
                <span>❄️</span>
              </div>
            </div>
          </div>
        </div>
        <p className="preview-hint">💡 Click the card to flip and preview both sides!</p>
      </div>

      <style>{`
        .card-maker-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2rem;
          margin-top: 1rem;
        }

        @media (min-width: 768px) {
          .card-maker-container {
            grid-template-columns: 1fr 1fr;
          }
        }

        .card-maker-sidebar {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
        }

        .sidebar-title {
          font-size: 1.5rem;
          color: var(--text-main);
          margin-bottom: 1.2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 0.5rem;
        }

        .card-input, .card-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-main);
          padding: 0.6rem 0.8rem;
          font-family: var(--font-body);
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s ease;
        }

        .card-input:focus, .card-textarea:focus {
          border-color: var(--gold-primary);
        }

        .theme-selector {
          display: flex;
          gap: 0.75rem;
        }

        .theme-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid transparent;
          transition: transform 0.2s, border-color 0.2s;
        }

        .theme-btn.active {
          transform: scale(1.15);
          border-color: #fff;
        }

        .theme-btn.hearth {
          background: linear-gradient(135deg, hsl(12, 75%, 25%) 0%, hsl(0, 50%, 10%) 100%);
        }
        .theme-btn.starry {
          background: linear-gradient(135deg, hsl(230, 70%, 20%) 0%, hsl(240, 60%, 10%) 100%);
        }
        .theme-btn.forest {
          background: linear-gradient(135deg, hsl(145, 60%, 20%) 0%, hsl(160, 50%, 10%) 100%);
        }
        .theme-btn.sparkles {
          background: linear-gradient(135deg, hsl(38, 50%, 25%) 0%, hsl(20, 40%, 12%) 100%);
        }

        .sticker-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .sticker-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          font-size: 1.3rem;
          padding: 0.4rem 0.7rem;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .sticker-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .sticker-btn.selected {
          background: var(--gold-glow);
          border-color: var(--gold-primary);
        }

        .button-row {
          margin-top: 1.5rem;
          display: flex;
          gap: 1rem;
        }

        /* 3D Card Animation CSS */
        .card-preview-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          perspective: 1000px;
          min-height: 320px;
        }

        .card-3d-wrapper {
          width: 320px;
          height: 220px;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          cursor: pointer;
        }

        .card-3d-wrapper.flipped {
          transform: rotateY(180deg);
        }

        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 15px 35px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
        }

        .card-front {
          z-index: 2;
          transform: rotateY(0deg);
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .card-back {
          transform: rotateY(180deg);
          justify-content: space-between;
          text-align: left;
        }

        .card-border-decor {
          position: absolute;
          top: 8px;
          left: 8px;
          right: 8px;
          bottom: 8px;
          border: 1px dashed rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          pointer-events: none;
        }

        /* Front details */
        .cover-snow {
          font-size: 1.8rem;
          animation: float 3s infinite ease-in-out;
        }
        .cover-title {
          font-family: var(--font-festive);
          font-size: 2.2rem;
          color: var(--gold-primary);
          margin: 0.5rem 0;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .cover-art {
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          min-height: 40px;
          align-items: center;
        }
        .cover-sticker {
          font-size: 1.8rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        }
        .cover-footer {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-top: 1rem;
        }

        /* Inside details */
        .card-inside-header {
          font-family: var(--font-festive);
          font-size: 1.4rem;
          color: var(--gold-primary);
        }
        .card-inside-body {
          font-size: 0.95rem;
          line-height: 1.4;
          font-style: italic;
          color: #f1f1f1;
          margin: 0.8rem 0;
          text-align: center;
          word-break: break-word;
        }
        .card-inside-footer {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          font-size: 0.85rem;
          color: var(--text-muted);
        }
        .sender-name {
          font-family: var(--font-festive);
          font-size: 1.2rem;
          color: var(--gold-primary);
          font-weight: 700;
        }
        .card-inside-decorations {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          opacity: 0.4;
        }

        .preview-hint {
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
};
