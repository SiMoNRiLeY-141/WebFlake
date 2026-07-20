import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "../src/App";

describe("WebFlake React Application", () => {
  beforeAll(() => {
    // Mock HTMLCanvasElement.getContext to prevent JSDOM unimplemented error
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      closePath: jest.fn(),
      setLineDash: jest.fn(),
    });
  });

  test("renders WebFlake title and header elements", () => {
    render(<App />);
    const titleElement = screen.getByRole("heading", { name: /WebFlake/i, level: 1 });
    expect(titleElement).toBeInTheDocument();

    const subtitleElement = screen.getByText(/Your cozy Christmas companion & digital wonderland/i);
    expect(subtitleElement).toBeInTheDocument();
  });

  test("contains Christmas countdown title", () => {
    render(<App />);
    const countdownTitle = screen.getByText(/Countdown to Christmas/i);
    expect(countdownTitle).toBeInTheDocument();
  });

  test("can toggle music play state mock button", () => {
    render(<App />);
    const playButton = screen.getByRole("button", { name: /Play Music/i });
    expect(playButton).toBeInTheDocument();

    // Mock AudioContext as window.AudioContext since JSDOM doesn't support Web Audio API natively
    const mockStart = jest.fn();
    const mockStop = jest.fn();
    const mockConnect = jest.fn();

    const mockOscillator = {
      type: "triangle",
      frequency: { setValueAtTime: jest.fn() },
      start: mockStart,
      stop: mockStop,
      connect: mockConnect,
    };

    const mockGainNode = {
      gain: {
        setValueAtTime: jest.fn(),
        linearRampToValueAtTime: jest.fn(),
        exponentialRampToValueAtTime: jest.fn(),
      },
      connect: mockConnect,
    };

    const mockAudioContext = {
      currentTime: 0,
      createOscillator: () => mockOscillator,
      createGain: () => mockGainNode,
      destination: {},
      close: jest.fn(),
    };

    window.AudioContext = jest.fn().mockImplementation(() => mockAudioContext);

    // Click play
    fireEvent.click(playButton);
    expect(screen.getByRole("button", { name: /Stop Music/i })).toBeInTheDocument();

    // Click stop
    const stopButton = screen.getByRole("button", { name: /Stop Music/i });
    fireEvent.click(stopButton);
    expect(screen.getByRole("button", { name: /Play Music/i })).toBeInTheDocument();
  });

  test("can select Gift and DIY recommendations", () => {
    render(<App />);

    // Switch to DIY Recommendations
    const diyToggle = screen.getByRole("button", { name: /DIY Decorations/i });
    fireEvent.click(diyToggle);

    // Press Surprise Me
    const surpriseButton = screen.getByRole("button", { name: /Surprise Me!/i });
    fireEvent.click(surpriseButton);

    // The placeholder text should be replaced by a DIY suggestion
    const placeholder = screen.queryByText(/Click.*Surprise Me/i);
    expect(placeholder).not.toBeInTheDocument();
  });

  test("interacts with RSVP and shows Joined events", () => {
    render(<App />);

    // Select first RSVP button
    const rsvpButtons = screen.getAllByRole("button", { name: /RSVP/i });
    expect(rsvpButtons.length).toBeGreaterThan(0);

    // Click RSVP for Tree Lighting
    fireEvent.click(rsvpButtons[0]);

    // Itinerary should list the event now
    const itineraryTitle = screen.getByText(/My Personal Schedule/i);
    expect(itineraryTitle).toBeInTheDocument();

    // The heading and list item both contain the text, but the heading specifically matches the role
    const eventHeading = screen.getByRole("heading", { name: /Christmas Tree Lighting/i });
    expect(eventHeading).toBeInTheDocument();

    // Clicking it again removes it (since it's toggled, find button that says Scheduled)
    const activeRsvp = screen.getByRole("button", { name: /Scheduled/i });
    fireEvent.click(activeRsvp);

    expect(screen.queryByText(/My Personal Schedule/i)).not.toBeInTheDocument();
  });
});
