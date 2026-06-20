# Remove Bear Distance UI

## Scope

Remove only the Bear Distance display from `components/typing-game.tsx`: its title, icons, progress bar, and distance labels.

## Behavior

The game continues to maintain `distance` internally. Correct words still push the bear back; incorrect input still moves it closer and can cost lives. No other visual or gameplay behavior changes.

## Implementation

Delete the single Bear Distance JSX block between the typed-word display and the bottom HUD. Do not modify state, handlers, or distance-derived calculations, since they remain part of the game rules.

## Validation

Run lint and a production build. The repository currently has no test command, so no test infrastructure is added for this display-only deletion.
