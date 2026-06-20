# Timed Bear Chase

## Goal

Make the Bear Distance meter advance continuously while the game is active, so typing speed affects survival. Correctly completed words push the bear back.

## Rules

- The meter advances from 0% to 100% in 30 seconds while not paused and not game over.
- Each completed word reduces the meter by 12%, never below 0%.
- An incorrect input still advances the meter by 15% and breaks the combo.
- Reaching 100% removes one life and resets the meter to 0%; the existing game-over behavior after the final life remains unchanged.
- Pausing stops the timed advance. Resetting the game clears the meter as it does today.

## Implementation

Add one `useEffect` interval that updates distance at a fixed 100 ms cadence while the game is active. Reuse the existing life-loss and reset behavior by extracting it into a single distance-update path, preventing the timer and wrong-input paths from diverging.

## Validation

Add a focused test for the distance update behavior before implementation, then run it after the change. Run lint and a production build. Manual verification covers timer progression, pause behavior, word completion pushback, wrong-input penalty, and life loss at 100%.
