# WebFlake • Winter Wonderland

A premium, interactive Christmas-themed web application designed as a digital winter celebration dashboard. Built with a modern frontend stack using **Vite + React + TypeScript**, styled with **Vanilla CSS (HSL design tokens, Glassmorphism, and 3D transforms)**, and served by a secure **Express** server with built-in rate limiting.

---

## 🌟 Interactive Features

1. **Customizable Canvas Snowfall**: A high-performance particle engine that renders falling snow. Users can adjust snowfall density, drift wind direction, falling speed, and select crystal shapes (Fluffy flakes, Asterisk crystals, or Twinkling stars).
2. **Holiday Music Synthesizer**: A custom audio controller built using the **Web Audio API** (no external media file dependencies). It synthesizes the melody of _"We Wish You a Merry Christmas"_ using triangle-wave oscillators, synced with an animated frequency bar visualizer.
3. **Christmas Countdown**: A live-updating ticking clock panel displaying the remaining Days, Hours, Minutes, and Seconds until Christmas Day.
4. **Interactive Timeline & Itinerary**: View upcoming celebrations (Tree lighting, Santa's workshop, Carol night) and RSVP to join. Joining an event adds it to a customized itinerary synced to the browser's `localStorage`.
5. **Holiday Helper Recommender**: A randomized idea engine suggesting creative gift items and DIY decoration guides (e.g. mason jar snowglobes, customized wreaths) filtered by category tags (easy, creative, budget, family).
6. **Digital Greeting Designer**: A personalized greeting card maker. Select holiday themes, input sender/recipient details, write messages, attach sticker emojis, and click to fold or flip the card using **3D CSS transitions**.
7. **Polaroid Gallery & Lightbox**: A vintage-styled polaroid photo wall with hover tilt effects and a full-screen image lightbox overlay.

---

## 🛠️ Technology Stack

- **Frontend Framework**: [React](https://react.dev) (v19)
- **Language**: [TypeScript](https://www.typescriptlang.org) (v5)
- **Build Tool**: [Vite](https://vite.dev) (v6)
- **Styling**: Scoped Vanilla CSS (using flexible HSL color variables and backdrop-filter blur)
- **Backend Server**: [Express](https://expressjs.com) (v5) with rate-limiting and fallback fallback HTML5 routing
- **Testing Suite**: [Jest](https://jestjs.io) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- **Formatting & Linting**: [Prettier](https://prettier.io) & [ESLint](https://eslint.org) (v9 flat config)

---

## 🚀 Command Reference

Ensure you have [Node.js](https://nodejs.org) (v20+) installed before running commands.

### Development Dev Server

Run the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

### Build & Compilation

Compile TypeScript and bundle code into production-ready static assets:

```bash
npm run build
```

### Production Start

Build the project and run the local Express server on port `3000`:

```bash
npm run build
npm start
```

### Run Tests

Execute the server integration and React component tests:

```bash
npm test
```

### Linting check

Run ESLint check on all source files:

```bash
npm run lint
```

### Automated Code Formatting

Run Prettier check and rewrite matching files:

```bash
npm run format
```

---

## 🧑‍💻 Participant Details

- **Name**: Adhil Jahan M B
- **GitHub Profile**: [SiMoNRiLeY-141](https://github.com/SiMoNRiLeY-141)
- **Live Link**: [WebFlake Deployment](https://simonriley-141.github.io/WebFlake/)
