import { expect, it } from "vitest"
import { WORDS } from "./common-words"

it("contains 50 unique common words with valid lengths", () => {
  expect(WORDS).toHaveLength(50)
  expect(new Set(WORDS).size).toBe(50)
  expect(WORDS.every((word) => /^[a-z]{4,10}$/.test(word))).toBe(true)
})
