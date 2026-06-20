# Web Audio Design

## Goal

Add generated keyboard sounds and low-volume looping background music without adding audio files.

## Behavior

- The first game interaction creates and resumes a browser `AudioContext`, satisfying autoplay restrictions.
- Each accepted keystroke plays a short, bright magic-key tone.
- Incorrect input plays a short, lower-pitched warning tone.
- A subtle looping synthesized background pattern begins after audio is unlocked.
- Pause silences the background loop; resume restarts it. Keyboard effects do not play while paused or game over.
- The existing sound button mutes or unmutes every effect and the background loop.

## Implementation

Add a focused Web Audio hook that owns the audio context, music scheduling, and mute state. `TypingGame` calls the hook from existing keyboard and pause interactions, keeping gameplay logic unchanged. Use Web Audio oscillators and gain envelopes only; no external assets or packages.

## Validation

Add focused tests for audio scheduling decisions where practical, run lint and a production build, then manually verify unlock, accepted-key tone, error tone, pause/resume, and mute behavior in a browser.
