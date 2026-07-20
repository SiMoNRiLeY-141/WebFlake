import React, { useState, useEffect, useRef } from "react";
import { Snowfall } from "./components/Snowfall";
import { Countdown } from "./components/Countdown";
import { GreetingCardMaker } from "./components/GreetingCardMaker";

// Types for Events, RSVP, and Recommendations
interface EventItem {
  id: string;
  title: string;
  time: string;
  description: string;
}

interface IdeaItem {
  id: string;
  title: string;
  description: string;
  tag: "easy" | "creative" | "kids" | "budget";
}

const EVENTS_DATA: EventItem[] = [
  {
    id: "evt-1",
    title: "Christmas Tree Lighting",
    time: "Dec 1, 6:00 PM",
    description: "Kick off the festive season with our grand tree lighting ceremony and hot cocoa.",
  },
  {
    id: "evt-2",
    title: "Santa's Workshop for Kids",
    time: "Dec 5, 2:00 PM",
    description: "Bring the little ones to craft custom holiday ornaments and meet Santa Claus.",
  },
  {
    id: "evt-3",
    title: "Christmas Carol Night",
    time: "Dec 10, 7:30 PM",
    description: "Join our choir under the starry sky for a cozy evening of traditional carols.",
  },
];

const GIFT_IDEAS: IdeaItem[] = [
  {
    id: "gift-1",
    title: "Personalized Ornaments",
    description: "Engrave names or special dates on wooden or glass ornaments for a custom touch.",
    tag: "creative",
  },
  {
    id: "gift-2",
    title: "Cozy Winter Blanket",
    description: "A chunky hand-knit throw blanket to keep your loved ones warm all winter.",
    tag: "budget",
  },
  {
    id: "gift-3",
    title: "Homemade Treats Basket",
    description: "Bake a batch of gingerbread cookies, peppermint barks, and roasted nuts.",
    tag: "easy",
  },
  {
    id: "gift-4",
    title: "DIY Candle Making Kit",
    description: "A starter set with soy wax, pine needle essential oils, and holiday mason jars.",
    tag: "creative",
  },
  {
    id: "gift-5",
    title: "Hot Cocoa Marshmallow Mug",
    description: "A festive ceramic mug filled with gourmet cocoa powder and mini mallows.",
    tag: "kids",
  },
];

const DIY_IDEAS: IdeaItem[] = [
  {
    id: "diy-1",
    title: "Handmade Evergreen Wreath",
    description:
      "Gather pine branches, pinecones, and red ribbons to assemble a classic door wreath.",
    tag: "creative",
  },
  {
    id: "diy-2",
    title: "3D Paper Snowflakes",
    description:
      "Simple paper fold-and-cut patterns that form large, beautiful hanging snowflakes.",
    tag: "kids",
  },
  {
    id: "diy-3",
    title: "Crafty Reindeer Corks",
    description: "Transform recycled wine corks into cute reindeer using twigs and red beads.",
    tag: "easy",
  },
  {
    id: "diy-4",
    title: "Mason Jar Snow Globe",
    description:
      "Glue tiny plastic trees to jar lids, fill with water, glycerin, and white glitter.",
    tag: "creative",
  },
  {
    id: "diy-5",
    title: "Cinnamon Stick Candles",
    description:
      "Tie cinnamon sticks around plain pillar candles using twine for a fragrant decoration.",
    tag: "budget",
  },
];

const BASE_URL = window.location.pathname.includes("/WebFlake") ? "/WebFlake/" : "/";

export const App: React.FC = () => {
  // Snowfall controls state
  const [snowDensity, setSnowDensity] = useState(60);
  const [snowSpeed, setSnowSpeed] = useState(1.2);
  const [snowWind, setSnowWind] = useState(0.5);
  const [snowShape, setSnowShape] = useState<"circle" | "crystal" | "star">("circle");

  // Itinerary state (synced with localStorage)
  const [myItinerary, setMyItinerary] = useState<string[]>(() => {
    const saved = localStorage.getItem("webflake_itinerary");
    return saved ? JSON.parse(saved) : [];
  });

  // Audio synthesizer state
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.2);
  const synthIntervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Recommendations state
  const [selectedIdeaType, setSelectedIdeaType] = useState<"gifts" | "diy">("gifts");
  const [ideaFilter, setIdeaFilter] = useState<"all" | "easy" | "creative" | "kids" | "budget">(
    "all"
  );
  const [currentIdea, setCurrentIdea] = useState<IdeaItem | null>(null);

  // Polaroid Lightbox Modal state
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Sync itinerary to localStorage
  useEffect(() => {
    localStorage.setItem("webflake_itinerary", JSON.stringify(myItinerary));
  }, [myItinerary]);

  // Clean up synth on unmount
  useEffect(() => {
    return () => {
      stopMusic();
    };
  }, []);

  const handleRSVP = (eventId: string) => {
    if (myItinerary.includes(eventId)) {
      setMyItinerary(myItinerary.filter((id) => id !== eventId));
    } else {
      setMyItinerary([...myItinerary, eventId]);
    }
  };

  // We Wish You A Merry Christmas synth sequence
  // Note frequencies (Hz)
  const notes = {
    D4: 293.66,
    G4: 392.0,
    A4: 440.0,
    B4: 493.88,
    C5: 523.25,
    D5: 587.33,
    E5: 659.25,
    Fs4: 369.99,
    C4: 261.63,
    E4: 329.63,
    A3: 220.0,
    Fs5: 739.99,
  };

  // [Frequency, Duration (beats)]
  const melody: [number, number][] = [
    [notes.D4, 1],
    [notes.G4, 2],
    [notes.G4, 1 / 2],
    [notes.A4, 1 / 2],
    [notes.G4, 1 / 2],
    [notes.Fs4, 1 / 2],
    [notes.E4, 2],
    [notes.C4, 1],
    [notes.E4, 2],
    [notes.E4, 1 / 2],
    [notes.G4, 1 / 2],
    [notes.Fs4, 1 / 2],
    [notes.E4, 1 / 2],
    [notes.D4, 2],
    [notes.B4, 1],
    [notes.D4, 2],
    [notes.D4, 1 / 2],
    [notes.E5, 1 / 2],
    [notes.D5, 1 / 2],
    [notes.C5, 1 / 2],
    [notes.B4, 2],
    [notes.G4, 1],
    [notes.A4, 2],
    [notes.D4, 1],
    [notes.Fs4, 2],
    [notes.G4, 2],
    // Pause
    [0, 1],
  ];

  const playMusic = () => {
    if (synthIntervalRef.current) return;

    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;

    let currentNoteIdx = 0;
    const tempo = 130; // beats per minute
    const beatDuration = 60 / tempo; // duration of 1 beat in seconds

    const playNextNote = () => {
      if (!ctx || ctx.state === "closed") return;

      const [freq, durationBeats] = melody[currentNoteIdx];
      const durationSeconds = durationBeats * beatDuration;

      if (freq > 0) {
        // Oscillator 1 (Warm Triangle wave for retro flute sound)
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Envelope
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(audioVolume, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSeconds - 0.05);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationSeconds);
      }

      currentNoteIdx = (currentNoteIdx + 1) % melody.length;

      // Schedule next note
      synthIntervalRef.current = window.setTimeout(playNextNote, durationSeconds * 1000);
    };

    setIsPlayingMusic(true);
    playNextNote();
  };

  const stopMusic = () => {
    if (synthIntervalRef.current) {
      clearTimeout(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    setIsPlayingMusic(false);
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  // Handle music volume slider update
  const handleVolumeChange = (newVol: number) => {
    setAudioVolume(newVol);
    // If playing, we might not update active oscillators, but next notes will use this volume
  };

  // Suggest a random idea
  const handleGetIdea = () => {
    const list = selectedIdeaType === "gifts" ? GIFT_IDEAS : DIY_IDEAS;
    const filtered = ideaFilter === "all" ? list : list.filter((item) => item.tag === ideaFilter);

    if (filtered.length > 0) {
      const randIdx = Math.floor(Math.random() * filtered.length);
      setCurrentIdea(filtered[randIdx]);
    } else {
      setCurrentIdea(null);
    }
  };

  return (
    <div className="app-layout">
      {/* High-performance Snowfall backdrop */}
      <Snowfall density={snowDensity} speed={snowSpeed} wind={snowWind} shape={snowShape} />

      <main className="app-container">
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="logo-wrap">
            <img src={`${BASE_URL}logo.png`} alt="WebFlake Logo" className="logo-img" />
            <h1>WebFlake</h1>
          </div>
          <p className="subtitle">Your cozy Christmas companion & digital wonderland</p>

          {/* Ambient Music Control */}
          <div className="music-player-panel glass-card">
            <div className="music-left">
              <button
                className={`music-toggle-btn ${isPlayingMusic ? "playing" : ""}`}
                onClick={toggleMusic}
                aria-label={isPlayingMusic ? "Stop Music" : "Play Music"}
              >
                {isPlayingMusic ? "⏸ Stop Carol" : "▶ Play Carol Synth"}
              </button>
              <div className={`audio-visualizer ${isPlayingMusic ? "playing" : ""}`}>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
            <div className="volume-control">
              <label>Volume: {Math.round(audioVolume * 100)}%</label>
              <input
                type="range"
                min="0.05"
                max="0.5"
                step="0.05"
                value={audioVolume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <div className="dashboard-grid">
          {/* Left Column (Main Features) */}
          <div className="left-column">
            {/* Welcome & Interactive Overview */}
            <section className="glass-card full-width-section section-margin">
              <h2>Welcome to WebFlake!</h2>
              <p className="welcome-intro">
                Step inside our virtual winter wonderland. Celebrate, customize, and plan the most
                wonderful time of the year with our interactive tools below. Customize your
                snowfall, schedule events, generate gift ideas, or send a greetings card!
              </p>
            </section>

            {/* Events Timetable */}
            <section className="glass-card section-margin">
              <h2>Festive Events Timeline</h2>
              <p style={{ marginBottom: "1.5rem" }}>
                Check out our upcoming community celebrations and reserve a spot in your custom
                calendar.
              </p>
              <div className="timeline">
                {EVENTS_DATA.map((evt) => {
                  const isScheduled = myItinerary.includes(evt.id);
                  return (
                    <div key={evt.id} className={`timeline-node ${isScheduled ? "active" : ""}`}>
                      <div className="node-marker"></div>
                      <div className="node-content">
                        <div className="node-header">
                          <span className="node-time">{evt.time}</span>
                          <button
                            className={`btn btn-sm ${isScheduled ? "btn-outline" : "btn-gold"}`}
                            onClick={() => handleRSVP(evt.id)}
                          >
                            {isScheduled ? "✓ Scheduled" : "RSVP"}
                          </button>
                        </div>
                        <h4 className="node-title">{evt.title}</h4>
                        <p className="node-desc">{evt.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {myItinerary.length > 0 && (
                <div className="itinerary-summary">
                  <span className="itinerary-tag">
                    My Personal Schedule ({myItinerary.length} Joined)
                  </span>
                  <ul className="itinerary-list">
                    {EVENTS_DATA.filter((e) => myItinerary.includes(e.id)).map((e) => (
                      <li key={e.id}>
                        🎄 {e.title} - <em>{e.time}</em>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>

            {/* Gift & DIY Planner Recommender */}
            <section className="glass-card section-margin">
              <h2>Gift & DIY Holiday Helper</h2>
              <p style={{ marginBottom: "1.2rem" }}>
                Can't decide what to craft or buy? Use our random idea helper to get instant
                inspiration.
              </p>

              <div className="recommender-controls">
                <div className="idea-type-toggle">
                  <button
                    className={`btn btn-sm ${selectedIdeaType === "gifts" ? "btn-gold" : "btn-outline"}`}
                    onClick={() => {
                      setSelectedIdeaType("gifts");
                      setCurrentIdea(null);
                    }}
                  >
                    🎁 Gift Ideas
                  </button>
                  <button
                    className={`btn btn-sm ${selectedIdeaType === "diy" ? "btn-gold" : "btn-outline"}`}
                    onClick={() => {
                      setSelectedIdeaType("diy");
                      setCurrentIdea(null);
                    }}
                  >
                    ✂️ DIY Decorations
                  </button>
                </div>

                <div className="filter-group">
                  <select
                    className="style-select"
                    value={ideaFilter}
                    onChange={(e) => {
                      setIdeaFilter(e.target.value as any);
                      setCurrentIdea(null);
                    }}
                  >
                    <option value="all">All Styles</option>
                    <option value="easy">Easy to Make</option>
                    <option value="creative">Creative Projects</option>
                    <option value="kids">For Kids & Family</option>
                    <option value="budget">Budget Friendly</option>
                  </select>

                  <button className="btn" onClick={handleGetIdea}>
                    Surprise Me!
                  </button>
                </div>
              </div>

              {currentIdea ? (
                <div className="idea-display-card animate-fade-in">
                  <div className="idea-badge">{currentIdea.tag.toUpperCase()}</div>
                  <h4 className="idea-title">{currentIdea.title}</h4>
                  <p className="idea-desc">{currentIdea.description}</p>
                </div>
              ) : (
                <div className="idea-placeholder">
                  Click <strong>Surprise Me</strong> above to load a{" "}
                  {selectedIdeaType === "gifts" ? "gift idea" : "decor crafting guide"}!
                </div>
              )}
            </section>

            {/* Greeting Card Maker Component */}
            <section className="glass-card section-margin">
              <h2>Digital Greeting Card Maker</h2>
              <p style={{ marginBottom: "1rem" }}>
                Design a personalized Christmas greeting card and preview its front/inside
                dynamically.
              </p>
              <GreetingCardMaker />
            </section>
          </div>

          {/* Right Column (Sidebar Widgets) */}
          <div className="right-column">
            {/* Christmas Countdown */}
            <section className="glass-card sidebar-widget">
              <Countdown />
            </section>

            {/* Snowfall Adjuster */}
            <section className="glass-card sidebar-widget">
              <h3>Snowfall Control Center</h3>
              <p className="widget-desc">Tune your winter scene coordinates in real-time.</p>

              <div className="control-group">
                <label>
                  <span>Snowflake Density</span>
                  <span>{snowDensity} flakes</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={snowDensity}
                  onChange={(e) => setSnowDensity(parseInt(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>
                  <span>Falling Speed</span>
                  <span>{snowSpeed.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.1"
                  value={snowSpeed}
                  onChange={(e) => setSnowSpeed(parseFloat(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>
                  <span>Wind Direction</span>
                  <span>
                    {snowWind > 0
                      ? `Right (+${snowWind})`
                      : snowWind < 0
                        ? `Left (${snowWind})`
                        : "None"}
                  </span>
                </label>
                <input
                  type="range"
                  min="-4"
                  max="4"
                  step="0.5"
                  value={snowWind}
                  onChange={(e) => setSnowWind(parseFloat(e.target.value))}
                />
              </div>

              <div className="control-group">
                <label>Snowflake Crystal Style</label>
                <div className="snowflake-shapes-grid">
                  <button
                    className={`shape-btn ${snowShape === "circle" ? "active" : ""}`}
                    onClick={() => setSnowShape("circle")}
                  >
                    ⚪ Fluffy
                  </button>
                  <button
                    className={`shape-btn ${snowShape === "crystal" ? "active" : ""}`}
                    onClick={() => setSnowShape("crystal")}
                  >
                    ❄️ Crystal
                  </button>
                  <button
                    className={`shape-btn ${snowShape === "star" ? "active" : ""}`}
                    onClick={() => setSnowShape("star")}
                  >
                    ⭐ Star
                  </button>
                </div>
              </div>
            </section>

            {/* Photo Gallery */}
            <section className="glass-card sidebar-widget">
              <h3>Festive Moments</h3>
              <p className="widget-desc">Click any photo below to inspect in high-definition.</p>

              <div className="polaroid-gallery">
                <div
                  className="polaroid-frame"
                  onClick={() => setLightboxImage(`${BASE_URL}ci1.jpg`)}
                >
                  <img
                    src={`${BASE_URL}ci1.jpg`}
                    alt="Winter Hearth Decor"
                    className="gallery-thumbnail"
                  />
                  <div className="polaroid-caption">Winter Hearth</div>
                </div>
                <div
                  className="polaroid-frame"
                  onClick={() => setLightboxImage(`${BASE_URL}ci2.jpg`)}
                >
                  <img
                    src={`${BASE_URL}ci2.jpg`}
                    alt="Cozy Dining Decor"
                    className="gallery-thumbnail"
                  />
                  <div className="polaroid-caption">Holiday Banquet</div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer Card */}
        <footer className="glass-card footer-bar">
          <p>&copy; {new Date().getFullYear()} WebFlake. Cozy Holiday Celebrations.</p>
        </footer>
      </main>

      {/* Polaroid Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content animate-scale-up">
            <span className="lightbox-close" onClick={() => setLightboxImage(null)}>
              &times;
            </span>
            <img src={lightboxImage} alt="Enlarged gallery view" className="lightbox-img" />
          </div>
        </div>
      )}

      {/* Styled React Styles */}
      <style>{`
        .app-layout {
          min-height: 100vh;
          position: relative;
        }

        .subtitle {
          font-size: 1.15rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .music-player-panel {
          margin-top: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          max-width: 500px;
          width: 100%;
          border-radius: 15px;
          gap: 1.5rem;
          background: rgba(15, 23, 42, 0.4);
        }

        .music-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .music-toggle-btn {
          background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-dark) 100%);
          border: none;
          color: var(--sky-dark);
          font-weight: bold;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          cursor: pointer;
          font-family: var(--font-body);
          transition: transform 0.2s;
        }

        .music-toggle-btn:hover {
          transform: scale(1.05);
        }

        .volume-control {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
          flex-grow: 1;
        }

        .volume-control label {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Layout Margins & Widgets */
        .section-margin {
          margin-bottom: 2rem;
        }

        .sidebar-widget {
          margin-bottom: 2rem;
        }

        .widget-desc {
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 1.2rem;
        }

        .welcome-intro {
          font-size: 1.1rem;
          line-height: 1.7;
          color: #f1f1f1;
        }

        /* Event Timeline styling */
        .timeline {
          position: relative;
          padding-left: 24px;
          margin: 1.5rem 0;
        }

        .timeline::before {
          content: '';
          position: absolute;
          left: 6px;
          top: 8px;
          bottom: 8px;
          width: 2px;
          background: rgba(255, 255, 255, 0.1);
        }

        .timeline-node {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .timeline-node:last-child {
          margin-bottom: 0;
        }

        .node-marker {
          position: absolute;
          left: -23px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          border: 2px solid var(--sky-dark);
          transition: background 0.3s, transform 0.3s, box-shadow 0.3s;
        }

        .timeline-node.active .node-marker {
          background: var(--gold-primary);
          transform: scale(1.2);
          box-shadow: 0 0 8px var(--gold-primary);
        }

        .node-content {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 1rem;
          transition: background 0.2s, border-color 0.2s;
        }

        .node-content:hover {
          background: rgba(255,255,255,0.06);
          border-color: rgba(255,255,255,0.1);
        }

        .node-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.4rem;
        }

        .node-time {
          font-size: 0.8rem;
          color: var(--gold-primary);
          font-weight: 600;
        }

        .node-title {
          font-family: var(--font-body);
          font-size: 1.15rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: var(--text-main);
        }

        .node-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
        }

        .btn-sm {
          padding: 0.35rem 0.8rem;
          font-size: 0.8rem;
          border-radius: 8px;
        }

        .itinerary-summary {
          margin-top: 1.5rem;
          background: hsla(152, 70%, 45%, 0.05);
          border: 1px dashed var(--emerald-primary);
          border-radius: 12px;
          padding: 1rem;
        }

        .itinerary-tag {
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--emerald-primary);
          display: block;
          margin-bottom: 0.5rem;
        }

        .itinerary-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .itinerary-list li {
          font-size: 0.9rem;
          color: var(--text-main);
        }

        /* Holiday Helper / Recommender */
        .recommender-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        @media (min-width: 600px) {
          .recommender-controls {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        .idea-type-toggle {
          display: flex;
          gap: 0.5rem;
        }

        .filter-group {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .style-select {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: var(--text-main);
          padding: 0.45rem 1.5rem 0.45rem 0.6rem;
          font-family: var(--font-body);
          outline: none;
          cursor: pointer;
        }

        .idea-display-card {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--gold-glow);
          border-radius: 16px;
          padding: 1.5rem;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .idea-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--gold-primary);
          border: 1px solid var(--gold-primary);
          padding: 0.2rem 0.5rem;
          border-radius: 6px;
          letter-spacing: 0.5px;
        }

        .idea-title {
          font-family: var(--font-body);
          font-size: 1.25rem;
          color: var(--text-main);
          margin-bottom: 0.5rem;
        }

        .idea-desc {
          font-size: 0.95rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .idea-placeholder {
          text-align: center;
          padding: 2rem;
          background: rgba(255,255,255,0.01);
          border: 1px dashed rgba(255,255,255,0.05);
          border-radius: 16px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* Snowflake shape selectors */
        .snowflake-shapes-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
        }

        .shape-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-main);
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.85rem;
          transition: background 0.2s, border-color 0.2s;
        }

        .shape-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        .shape-btn.active {
          background: var(--gold-glow);
          border-color: var(--gold-primary);
          color: var(--gold-primary);
        }

        /* Polaroid Gallery */
        .polaroid-gallery {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          align-items: center;
        }

        .polaroid-frame {
          background: #fff;
          padding: 0.8rem 0.8rem 1.8rem 0.8rem;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
          transform: rotate(-2deg);
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: pointer;
          max-width: 240px;
        }

        .polaroid-frame:nth-child(2) {
          transform: rotate(3deg);
        }

        .polaroid-frame:hover {
          transform: rotate(0deg) scale(1.05);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
          z-index: 10;
        }

        .gallery-thumbnail {
          width: 100%;
          height: auto;
          display: block;
          border: 1px solid #ddd;
        }

        .polaroid-caption {
          font-family: var(--font-festive);
          color: #333;
          font-size: 1.25rem;
          text-align: center;
          margin-top: 0.8rem;
          font-weight: 700;
        }

        /* Footer bar */
        .footer-bar {
          text-align: center;
          padding: 1.5rem;
          margin-top: 3rem;
          font-size: 0.9rem;
        }

        /* Lightbox modal */
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.95);
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: zoom-out;
        }

        .lightbox-content {
          position: relative;
          max-width: 90vw;
          max-height: 80vh;
        }

        .lightbox-img {
          max-width: 100%;
          max-height: 80vh;
          border-radius: 12px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 0 30px rgba(0,0,0,0.8);
        }

        .lightbox-close {
          position: absolute;
          top: -40px;
          right: 0;
          color: #fff;
          font-size: 2.5rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .lightbox-close:hover {
          color: var(--gold-primary);
        }

        /* Fade/Scale Animations */
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }

        .animate-scale-up {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default App;
