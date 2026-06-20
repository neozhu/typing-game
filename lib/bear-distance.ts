export const BEAR_TICK_MS = 100
export const BEAR_TICK_DISTANCE = 100 / 300

export function advanceBearDistance(distance: number, amount: number) {
  const next = Math.min(100, Math.max(0, distance + amount))

  return next >= 100 ? { distance: 0, bearReached: true } : { distance: next, bearReached: false }
}
