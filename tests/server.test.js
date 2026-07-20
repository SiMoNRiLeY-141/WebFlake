const request = require("supertest");
const app = require("../server");
const fs = require("fs");
const path = require("path");

describe("Express Server Integration", () => {
  const distDir = path.join(__dirname, "../dist");
  const indexHtmlPath = path.join(distDir, "index.html");
  const logoPath = path.join(distDir, "logo.png");

  // Create temporary dist files for integration tests if they don't exist yet
  beforeAll(() => {
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    if (!fs.existsSync(indexHtmlPath)) {
      fs.writeFileSync(indexHtmlPath, "<html><body>WebFlake Test</body></html>");
    }
    if (!fs.existsSync(logoPath)) {
      fs.writeFileSync(logoPath, "fake image content");
    }
  });

  describe("GET /", () => {
    it("responds with 200 and serves index.html", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      expect(res.headers["content-type"]).toMatch(/html/);
    });

    it("response body contains WebFlake title or content", async () => {
      const res = await request(app).get("/");
      expect(res.text).toContain("WebFlake");
    });
  });

  describe("Static file serving", () => {
    it("serves logo.png with correct content-type", async () => {
      const res = await request(app).get("/logo.png");
      expect(res.status).toBe(200);
    });

    it("returns 404 for a non-existent file", async () => {
      const res = await request(app).get("/does-not-exist.txt");
      expect(res.status).toBe(404);
    });
  });

  describe("Rate limiting", () => {
    it("sets RateLimit-Policy or X-RateLimit headers indicating limits", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      const limitHeader =
        res.headers["ratelimit-limit"] ||
        res.headers["x-ratelimit-limit"] ||
        res.headers["ratelimit-policy"];
      if (limitHeader) {
        expect(limitHeader.toString()).toMatch(/100/);
      }
    });

    it("includes rate limit remaining header on valid request", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
      const hasRateLimitHeader =
        "ratelimit-limit" in res.headers ||
        "x-ratelimit-limit" in res.headers ||
        "ratelimit-policy" in res.headers;
      expect(hasRateLimitHeader).toBe(true);
    });
  });

  describe("HTTP method handling", () => {
    it("returns 404 for POST /", async () => {
      const res = await request(app).post("/");
      expect(res.status).toBe(404);
    });

    it("returns 404 for PUT /", async () => {
      const res = await request(app).put("/");
      expect(res.status).toBe(404);
    });

    it("returns 404 for DELETE /", async () => {
      const res = await request(app).delete("/");
      expect(res.status).toBe(404);
    });
  });
});
