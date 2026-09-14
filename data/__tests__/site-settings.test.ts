import { describe, expect, it } from "vitest";
import { isApplicationOpen, isValidGoogleFormUrl } from "@/data/site-settings";

describe("isApplicationOpen", () => {
  it("is closed when no open date is configured", () => {
    expect(isApplicationOpen({ openDate: null, closeDate: null })).toBe(false);
  });

  it("is closed before the open date", () => {
    const now = new Date("2026-03-01T10:00:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: "2026-03-10" }, now)).toBe(false);
  });

  it("is open between open and close dates (inclusive)", () => {
    const now = new Date("2026-03-05T10:00:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: "2026-03-10" }, now)).toBe(true);
    const closeDay = new Date("2026-03-10T10:00:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: "2026-03-10" }, closeDay)).toBe(true);
  });

  it("is closed after the close date", () => {
    const now = new Date("2026-03-11T10:00:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: "2026-03-10" }, now)).toBe(false);
  });

  it("stays open indefinitely when no close date is set", () => {
    const now = new Date("2030-01-01T00:00:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: null }, now)).toBe(true);
  });

  it("uses Europe/Rome local time, not UTC, for the day boundary", () => {
    // 2026-03-04 23:30 UTC is already 2026-03-05 00:30 in Rome (UTC+1 in March
    // before DST) — should count as open if openDate is 2026-03-05.
    const now = new Date("2026-03-04T23:30:00.000Z");
    expect(isApplicationOpen({ openDate: "2026-03-05", closeDate: null }, now)).toBe(true);
  });
});

describe("isValidGoogleFormUrl", () => {
  it("rejects null/empty", () => {
    expect(isValidGoogleFormUrl(null)).toBe(false);
  });

  it("rejects non-Google-Forms URLs", () => {
    expect(isValidGoogleFormUrl("https://example.com/form")).toBe(false);
    expect(isValidGoogleFormUrl("not a url")).toBe(false);
  });

  it("rejects non-https URLs", () => {
    expect(isValidGoogleFormUrl("http://docs.google.com/forms/d/abc")).toBe(false);
  });

  it("accepts real Google Forms URLs", () => {
    expect(isValidGoogleFormUrl("https://docs.google.com/forms/d/e/abc/viewform")).toBe(true);
    expect(isValidGoogleFormUrl("https://forms.gle/abc123")).toBe(true);
  });
});
