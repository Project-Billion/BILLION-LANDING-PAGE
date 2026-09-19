import { afterEach, describe, expect, it, vi } from "vitest";
import { clientIp } from "./client-ip";

const req = (headers: Record<string, string>) => new Request("http://localhost/", { headers });

afterEach(() => vi.unstubAllEnvs());

describe("clientIp", () => {
  it("prefers x-vercel-forwarded-for over everything else on Vercel", () => {
    vi.stubEnv("VERCEL", "1");
    expect(clientIp(req({ "x-vercel-forwarded-for": "1.1.1.1", "x-forwarded-for": "2.2.2.2", "x-real-ip": "3.3.3.3" }))).toBe("1.1.1.1");
  });
  it("ignores x-vercel-forwarded-for off Vercel, where a client could send it", () => {
    vi.stubEnv("VERCEL", "");
    expect(clientIp(req({ "x-vercel-forwarded-for": "1.1.1.1", "x-forwarded-for": "6.6.6.6, 2.2.2.2" }))).toBe("2.2.2.2");
    expect(clientIp(req({ "x-vercel-forwarded-for": "1.1.1.1", "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(req({ "x-vercel-forwarded-for": "1.1.1.1" }))).toBe("unknown");
  });
  it("uses the rightmost x-forwarded-for entry, not the spoofable leftmost one", () => {
    expect(clientIp(req({ "x-forwarded-for": "6.6.6.6, 7.7.7.7 , 2.2.2.2 " }))).toBe("2.2.2.2");
  });
  it("falls back to x-real-ip, then unknown", () => {
    expect(clientIp(req({ "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(req({ "x-forwarded-for": " ", "x-real-ip": "3.3.3.3" }))).toBe("3.3.3.3");
    expect(clientIp(req({}))).toBe("unknown");
    expect(clientIp(req({ "x-forwarded-for": " " }))).toBe("unknown");
  });
});
