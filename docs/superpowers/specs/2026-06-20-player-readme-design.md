# Player README Design

## Goal

Replace the generic Next.js README with an inviting English landing page for people who want to play the typing game.

## Scope

- Add one original, wide hero illustration generated with GPT Images 2 and store it in `public/`.
- Use a playful, kid-friendly cartoon style: an adventurer types glowing letters in an enchanted forest while a friendly, non-scary bear approaches.
- Do not include written words inside the generated image.
- Rewrite `README.md` for players, with the game premise, gameplay instructions, feature highlights, controls, and concise local-play steps.

## Content Structure

1. Title and one-sentence hook.
2. Centered hero image with useful alt text.
3. A brief invitation to type words, build magic, and keep the bear away.
4. "How to Play" covering correct words, mistakes, lives, progression, and the bear-distance meter.
5. "What Makes It Fun" covering combos, magic, levels, sound, pause/resume, and the fantasy setting.
6. A compact controls table.
7. "Play Locally" using the existing `pnpm` workflow, followed by the localhost URL.

## Constraints

- Keep the document entirely in English.
- Avoid generic framework, v0, deployment, and contributor-oriented copy.
- Describe only implemented behavior.
- Preserve a small technical setup section for players who want to run the game locally.

## Validation

- Confirm the hero file is present under `public/` and its README path resolves.
- Confirm the README accurately describes the current game behavior.
- Run the existing test suite and production build after the documentation and asset changes.
