# Timed Bear Chase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make Bear Distance advance continuously over 30 seconds and let correct words push it back.

**Architecture:** Extract distance arithmetic into a pure helper so the tick rate, pushback, penalty, and threshold reset can be tested without React. `TypingGame` owns the interval and life/game-over state.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest.

## Global Constraints

- Move from 0% to 100% in 30 seconds while active.
- Tick every 100 ms at `100 / 300` percent.
- Completed words push back 12%; wrong input advances 15%.
- At 100%, lose one life, reset distance; game over after the final life.
- Pause and game over stop the interval.

---

### Task 1: Add a tested distance helper

**Files:**
- Modify: `package.json`
- Create: `lib/bear-distance.ts`
- Create: `lib/bear-distance.test.ts`

**Interfaces:**
- Produces: `advanceBearDistance(distance: number, amount: number): { distance: number; bearReached: boolean }`
- Produces: `BEAR_TICK_MS = 100`, `BEAR_TICK_DISTANCE = 100 / 300`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, expect, it } from "vitest"
import { advanceBearDistance, BEAR_TICK_DISTANCE } from "./bear-distance"

describe("advanceBearDistance", () => {
  it("advances by one timer tick", () => {
    expect(advanceBearDistance(0, BEAR_TICK_DISTANCE)).toEqual({ distance: 100 / 300, bearReached: false })
  })
  it("does not move below zero", () => {
    expect(advanceBearDistance(8, -12)).toEqual({ distance: 0, bearReached: false })
  })
  it("resets and reports a reached bear at 100 percent", () => {
    expect(advanceBearDistance(99, 15)).toEqual({ distance: 0, bearReached: true })
  })
})
```

- [ ] **Step 2: Configure and run the failing test**

Add `"test": "vitest run"` to `package.json` scripts and `"vitest": "^4.0.0"` to devDependencies.

Run: `pnpm install && pnpm test lib/bear-distance.test.ts`

Expected: FAIL because `lib/bear-distance.ts` has not been created.

- [ ] **Step 3: Implement the helper**

```ts
export const BEAR_TICK_MS = 100
export const BEAR_TICK_DISTANCE = 100 / 300

export function advanceBearDistance(distance: number, amount: number) {
  const next = Math.min(100, Math.max(0, distance + amount))
  return next >= 100 ? { distance: 0, bearReached: true } : { distance: next, bearReached: false }
}
```

- [ ] **Step 4: Verify and commit the helper**

Run: `pnpm test lib/bear-distance.test.ts`

Expected: PASS with three tests.

Commit only `package.json`, `pnpm-lock.yaml`, `lib/bear-distance.ts`, and `lib/bear-distance.test.ts` with message `feat: add timed bear distance helper`.

### Task 2: Integrate the timed chase into the game

**Files:**
- Modify: `components/typing-game.tsx:3, 47, 82-108`
- Modify: `lib/bear-distance.test.ts`

**Interfaces:**
- Consumes: exports from `@/lib/bear-distance`
- Produces: one active-game interval and shared distance update logic

- [ ] **Step 1: Add the rate test**

```ts
it("reaches 100 percent after 30 seconds", () => {
  expect(BEAR_TICK_DISTANCE * (30_000 / 100)).toBe(100)
})
```

- [ ] **Step 2: Run it before the integration change**

Run: `pnpm test lib/bear-distance.test.ts`

Expected: PASS for helper arithmetic; then use the integration implementation below to make `TypingGame` consume the same constants.

- [ ] **Step 3: Implement shared updates and the interval**

```ts
const advanceBear = useCallback((amount: number) => {
  setDistance((current) => {
    const result = advanceBearDistance(current, amount)
    if (result.bearReached) {
      setLives((currentLives) => {
        const remaining = currentLives - 1
        if (remaining <= 0) setGameOver(true)
        return Math.max(0, remaining)
      })
    }
    return result.distance
  })
}, [])

useEffect(() => {
  if (paused || gameOver) return
  const interval = window.setInterval(() => advanceBear(BEAR_TICK_DISTANCE), BEAR_TICK_MS)
  return () => window.clearInterval(interval)
}, [advanceBear, gameOver, paused])
```

Replace completed-word `setDistance` with `advanceBear(-12)` and wrong-input `setDistance` with `advanceBear(15)`. Import the helper and constants from `@/lib/bear-distance`.

- [ ] **Step 4: Verify and commit integration**

Run: `pnpm test lib/bear-distance.test.ts`

Expected: PASS with four tests.

Commit only `components/typing-game.tsx` and `lib/bear-distance.test.ts` with message `feat: make bear approach over time`.

### Task 3: Verify the application

**Files:**
- Modify: none

- [ ] **Step 1: Run automated checks**

Run: `pnpm test && pnpm lint && pnpm build`

Expected: all commands exit with status 0.

- [ ] **Step 2: Verify gameplay manually**

Run: `pnpm dev`

Verify that idle play advances the meter, pause freezes it, a completed word lowers it by 12%, a wrong character raises it by 15%, and 100% consumes a life and resets the meter.
