import { describe, expect, it } from "vitest"
import { advanceBearDistance, BEAR_TICK_DISTANCE } from "./bear-distance"

describe("advanceBearDistance", () => {
  it("advances by one timer tick", () => {
    expect(advanceBearDistance(0, BEAR_TICK_DISTANCE)).toEqual({
      distance: 100 / 300,
      bearReached: false,
    })
  })

  it("does not move below zero", () => {
    expect(advanceBearDistance(8, -12)).toEqual({ distance: 0, bearReached: false })
  })

  it("resets and reports a reached bear at 100 percent", () => {
    expect(advanceBearDistance(99, 15)).toEqual({ distance: 0, bearReached: true })
  })

  it("reaches 100 percent after 30 seconds", () => {
    expect(BEAR_TICK_DISTANCE * (30_000 / 100)).toBe(100)
  })
})
