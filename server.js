const express = require("express");
const rateLimit = require("express-rate-limit");
const app = express();
const port = 3000;

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
});

app.use(limiter);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
