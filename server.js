const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const app = express();
const port = 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});

app.use(limiter);

// Serve Vite build artifacts from the dist directory (supporting both local root and subpath routes)
app.use("/WebFlake", express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "dist")));

// Serve index.html for the root route
app.get(["/", "/WebFlake"], (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Catch-all route to support client-side routing fallback
app.get(/(.*)/, (req, res) => {
  if (req.path.includes(".")) {
    res.status(404).send("Not Found");
  } else if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    res.status(404).send("Not Found");
  }
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

module.exports = app;
