# Player README Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic project README with an appealing English game introduction for players, featuring an original hero illustration.

**Architecture:** The image generator creates a standalone landscape illustration, saved to `public/` and referenced by a centered Markdown image in `README.md`. The README is static, player-facing documentation that describes behavior implemented by `components/typing-game.tsx` and preserves a minimal local launch path.

**Tech Stack:** GPT Images 2, Markdown, Next.js 16, pnpm.

## Global Constraints

- Keep the README entirely in English.
- Store the project-bound hero asset under `public/`.
- Hero artwork is a playful kid-friendly cartoon: an adventurer types glowing letters in an enchanted forest while a friendly, non-scary bear approaches.
- Do not embed text in the generated illustration.
- Describe only existing game behavior.
- Do not include generic Next.js, v0, deployment, or contributor-oriented copy.

---

### Task 1: Generate and store the player-facing hero artwork

**Files:**
- Create: `public/typing-adventure-hero.png`

**Interfaces:**
- Consumes: The approved art direction in `docs/superpowers/specs/2026-06-20-player-readme-design.md`.
- Produces: `public/typing-adventure-hero.png`, a landscape PNG referenced from `/typing-adventure-hero.png`.

- [ ] **Step 1: Generate the illustration with GPT Images 2**

Use the built-in image generator with this prompt:

```text
Use case: illustration-story
Asset type: GitHub README hero image for a browser typing game
Primary request: a playful kid-friendly cartoon illustration of a young fantasy adventurer typing glowing floating letters in an enchanted forest, while a large friendly bear is visible at a safe distance behind them
Scene/backdrop: sunlit storybook forest with soft trees, mushrooms, wildflowers, and magical sparkles
Style/medium: polished 2D children’s game illustration, warm and charming, clean readable shapes
Composition/framing: wide landscape composition with the adventurer centered-left, bear centered-right, ample calm negative space, no cropped characters
Lighting/mood: cheerful magical daylight, adventurous but never threatening
Constraints: bear must look friendly and non-scary; no readable words, letters, logos, UI, watermark, or text in the image
Avoid: dark horror, realism, violence, aggressive poses, clutter, blurred subject
```

- [ ] **Step 2: Inspect and persist the selected image**

Check that the image is a clear landscape illustration; the adventurer, glowing letter motif, and friendly bear are all visible; no text or watermark appears. Copy or move the selected generator output to `public/typing-adventure-hero.png` without overwriting an existing asset.

- [ ] **Step 3: Verify the image artifact**

Run:

```powershell
Get-Item public\typing-adventure-hero.png | Select-Object Name, Length
```

Expected: a non-zero-size file named `typing-adventure-hero.png`.

- [ ] **Step 4: Commit the artwork**

```powershell
git add public\typing-adventure-hero.png
git commit -m "assets: add typing adventure hero"
```

### Task 2: Replace the template README with a player guide

**Files:**
- Modify: `README.md`

**Interfaces:**
- Consumes: `/typing-adventure-hero.png` from Task 1 and actual gameplay behavior in `components/typing-game.tsx`.
- Produces: A player-first `README.md` with a working hero image reference.

- [ ] **Step 1: Write the README content**

Replace the template with these required sections and behavior-backed content:

```markdown
# Typing Adventure

> Type fast, gather magic, and stay ahead of the bear.

![A young adventurer typing glowing letters in an enchanted forest while a friendly bear follows at a distance](./public/typing-adventure-hero.png)

## Your Forest Typing Quest

Type each word before the bear closes in. Every correct word earns points, builds your magic, and pushes the bear back. Keep your three hearts safe, build a combo, and see how far your adventure can go.

## How to Play

1. Start typing the word shown in the center of the screen.
2. Type every letter correctly to score points, increase your combo, and earn magic.
3. Complete a word to move the bear away. The bear also walks closer over time.
4. A wrong key breaks your combo, reduces magic, and brings the bear closer.
5. If the bear reaches you, you lose a heart. Lose all three hearts and the game ends.
6. Finish five words to reach the next level.

## What Makes It Fun

| Feature | What it does |
| --- | --- |
| Points & combos | Correct words earn points; longer streaks earn more. |
| Magic meter | Fill it by completing words correctly. |
| Bear distance | Watch the meter and type quickly to keep the bear away. |
| Levels | Every five completed words raises the level. |
| Sound | Toggle correct- and wrong-key sounds on or off. |
| Pause | Pause anytime, then resume when you are ready. |

## Controls

| Action | Control |
| --- | --- |
| Type a word | Keyboard |
| Pause or resume | Pause button |
| Turn sound on or off | Sound button |
| Start over after game over | Play Again button |

## Play Locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and start your typing quest.
```

- [ ] **Step 2: Verify the README image reference and behavior claims**

Run:

```powershell
rg -n "typing-adventure-hero|three hearts|five words|Sound|Pause" README.md
Test-Path public\typing-adventure-hero.png
```

Expected: all README claims are found and `Test-Path` returns `True`.

- [ ] **Step 3: Run project validation**

Run:

```powershell
pnpm test
pnpm build
```

Expected: Vitest completes successfully and Next.js produces a production build without errors.

- [ ] **Step 4: Commit the README update**

```powershell
git add README.md
git commit -m "docs: add player-focused README"
```

