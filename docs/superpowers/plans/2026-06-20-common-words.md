# Common Words Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the themed word list with 50 common English typing-practice words.

**Architecture:** Export the existing `WORDS` constant for a focused Vitest assertion. Replace only its array contents; word selection and gameplay remain unchanged.

**Tech Stack:** TypeScript, React 19, Vitest.

## Global Constraints

- Exactly 50 unique lowercase words.
- Each word is 4–10 letters.
- No changes to random selection, scoring, levels, or bear-distance behavior.

---

### Task 1: Validate and replace the word list

**Files:**
- Modify: `components/typing-game.tsx:7-28`
- Create: `components/typing-game.test.ts`

**Interfaces:**
- Produces: `export const WORDS: string[]`

- [ ] **Step 1: Write the failing test**

```ts
import { expect, it } from "vitest"
import { WORDS } from "./typing-game"

it("contains 50 unique common-word entries with valid lengths", () => {
  expect(WORDS).toHaveLength(50)
  expect(new Set(WORDS).size).toBe(50)
  expect(WORDS.every((word) => /^[a-z]{4,10}$/.test(word))).toBe(true)
})
```

- [ ] **Step 2: Run the test and verify failure**

Run: `pnpm test components/typing-game.test.ts`

Expected: FAIL because `WORDS` is not exported and has only 20 entries.

- [ ] **Step 3: Replace the array and export it**

Use exactly these words:

```ts
export const WORDS = [
  "about", "after", "again", "always", "apple", "around", "because", "before", "better", "black",
  "blue", "bring", "brown", "build", "carry", "change", "clean", "close", "color", "come",
  "could", "country", "create", "daily", "dance", "dream", "early", "earth", "enough", "every",
  "family", "first", "follow", "friend", "fruit", "great", "green", "group", "happy", "house",
  "learn", "light", "little", "money", "mother", "music", "night", "other", "people", "place",
]
```

- [ ] **Step 4: Verify the test and application**

Run: `pnpm test && pnpm build`

Expected: all tests pass and the production build exits with status 0.

- [ ] **Step 5: Commit the word list change**

Commit only `components/typing-game.tsx` and `components/typing-game.test.ts` with message `feat: expand common typing words`.
