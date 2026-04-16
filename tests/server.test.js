const request = require("supertest");
const path = require("path");
const app = require("../server");

describe("GET /", () => {
  it("responds with 200 and serves index.html", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
  });

  it("response body contains WebFlake title", async () => {
    const res = await request(app).get("/");
    expect(res.text).toContain("WebFlake");
  });
});

describe("Static file serving", () => {
  it("serves styles.css with correct content-type", async () => {
    const res = await request(app).get("/styles.css");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/css/);
  });

  it("serves script.js with correct content-type", async () => {
    const res = await request(app).get("/script.js");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/javascript/);
  });

  it("serves logo.png with correct content-type", async () => {
    const res = await request(app).get("/logo.png");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/image/);
  });

  it("returns 404 for a non-existent file", async () => {
    const res = await request(app).get("/does-not-exist.txt");
    expect(res.status).toBe(404);
  });
});

describe("Rate limiting", () => {
  it("sets RateLimit-Policy header indicating 100 requests per window", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    // express-rate-limit 7+ uses RateLimit-Policy header
    const policy = res.headers["ratelimit-policy"] || res.headers["x-ratelimit-limit"];
    if (policy) {
      expect(policy).toMatch(/100/);
    }
  });

  it("includes rate limit remaining header on valid request", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    // At least one of these headers should be present
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
