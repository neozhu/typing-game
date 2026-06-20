# Common Words Design

## Goal

Replace the themed word list with 50 common English words to reduce repetition and make the game broadly useful for typing practice.

## Scope

- `WORDS` contains exactly 50 unique common English words.
- Words contain 4 to 10 lowercase letters.
- The existing random selection, score, combo, level, and bear-distance behavior remain unchanged.

## Implementation

Replace only the `WORDS` array in `components/typing-game.tsx`. Do not change word selection logic or add categories, levels, or external data.

## Validation

Add a focused test that verifies the word list has 50 unique entries meeting the required length and lowercase-letter constraints. Run all tests and a production build.
