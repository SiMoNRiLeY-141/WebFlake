/**
 * Tests for public/script.js – snowflake animation logic.
 *
 * The script relies on DOMContentLoaded and appends snowflake <div> elements
 * into a #snowfall container. We use Jest's jsdom environment to simulate the
 * browser DOM.
 */

describe("Snowfall animation (script.js)", () => {
  let capturedHandler;

  beforeAll(() => {
    // Spy on addEventListener so we can capture the DOMContentLoaded handler
    // reference and remove it between tests (preventing listener accumulation).
    const original = document.addEventListener.bind(document);
    jest.spyOn(document, "addEventListener").mockImplementation((type, fn, ...rest) => {
      if (type === "DOMContentLoaded") {
        capturedHandler = fn;
      }
      return original(type, fn, ...rest);
    });

    require("../public/script.js");

    document.addEventListener.mockRestore();
  });

  beforeEach(() => {
    document.body.innerHTML = '<div id="snowfall"></div>';
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  describe("DOMContentLoaded handler", () => {
    beforeEach(() => {
      capturedHandler();
    });

    it("creates exactly 50 snowflake elements", () => {
      const snowflakes = document.querySelectorAll(".snowflake");
      expect(snowflakes.length).toBe(50);
    });

    it("each snowflake is a <div> element", () => {
      document.querySelectorAll(".snowflake").forEach((flake) => {
        expect(flake.tagName).toBe("DIV");
      });
    });

    it("each snowflake has the 'snowflake' CSS class", () => {
      document.querySelectorAll(".snowflake").forEach((flake) => {
        expect(flake.classList.contains("snowflake")).toBe(true);
      });
    });

    it("each snowflake has an inline 'left' style within [0, 100)vw", () => {
      document.querySelectorAll(".snowflake").forEach((flake) => {
        const left = flake.style.left;
        expect(left).toMatch(/vw$/);
        const value = parseFloat(left);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(100);
      });
    });

    it("each snowflake has an inline 'animation-duration' between 2s and 5s", () => {
      document.querySelectorAll(".snowflake").forEach((flake) => {
        const duration = flake.style.animationDuration;
        expect(duration).toMatch(/s$/);
        const value = parseFloat(duration);
        expect(value).toBeGreaterThanOrEqual(2);
        expect(value).toBeLessThan(5);
      });
    });

    it("each snowflake has an inline 'animation-delay' between 0s and 1s", () => {
      document.querySelectorAll(".snowflake").forEach((flake) => {
        const delay = flake.style.animationDelay;
        expect(delay).toMatch(/s$/);
        const value = parseFloat(delay);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      });
    });

    it("snowflakes are direct children of the #snowfall container", () => {
      const container = document.getElementById("snowfall");
      expect(container.children.length).toBe(50);
    });

    it("running the handler twice appends another 50 snowflakes", () => {
      capturedHandler();
      const snowflakes = document.querySelectorAll(".snowflake");
      expect(snowflakes.length).toBe(100);
    });
  });

  describe("Edge cases", () => {
    it("does not create snowflakes before the handler is called", () => {
      // beforeEach sets up DOM but does NOT call capturedHandler here
      const snowflakes = document.querySelectorAll(".snowflake");
      expect(snowflakes.length).toBe(0);
    });

    it("does nothing when #snowfall container is absent", () => {
      document.body.innerHTML = "";
      expect(() => capturedHandler()).not.toThrow();
    });

    it("does not append snowflakes when the container is absent", () => {
      document.body.innerHTML = "";
      capturedHandler();
      expect(document.querySelectorAll(".snowflake").length).toBe(0);
    });
  });
});

