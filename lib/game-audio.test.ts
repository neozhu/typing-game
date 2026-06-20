import { describe, expect, it } from "vitest"
import { canPlayAudio } from "./game-audio"

describe("canPlayAudio", () => {
  it("allows active unmuted games", () => {
    expect(canPlayAudio({ soundOn: true, paused: false, gameOver: false })).toBe(true)
  })

  it("blocks muted, paused, and game-over games", () => {
    expect(canPlayAudio({ soundOn: false, paused: false, gameOver: false })).toBe(false)
    expect(canPlayAudio({ soundOn: true, paused: true, gameOver: false })).toBe(false)
    expect(canPlayAudio({ soundOn: true, paused: false, gameOver: true })).toBe(false)
  })
})
