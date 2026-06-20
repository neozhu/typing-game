"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Heart, Star, Sparkles, Pause, Play, Volume2, VolumeX, Wand2 } from "lucide-react"
import { advanceBearDistance, BEAR_TICK_DISTANCE, BEAR_TICK_MS } from "@/lib/bear-distance"
import { WORDS } from "@/lib/common-words"
import { useGameAudio } from "@/hooks/use-game-audio"

const MAX_LIVES = 3

function pickWord(exclude?: string) {
  let w = WORDS[Math.floor(Math.random() * WORDS.length)]
  while (w === exclude && WORDS.length > 1) {
    w = WORDS[Math.floor(Math.random() * WORDS.length)]
  }
  return w
}

export function TypingGame() {
  const [word, setWord] = useState("butterfly")
  const [typed, setTyped] = useState("")
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [lives, setLives] = useState(MAX_LIVES)
  const [magic, setMagic] = useState(0) // 0 - 100
  const [level, setLevel] = useState(1)
  const [distance, setDistance] = useState(0) // 0 (FAR) - 100 (NEAR)
  const [paused, setPaused] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [wordsCompleted, setWordsCompleted] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  const { unlockAudio, playCorrectKey, playWrongKey } = useGameAudio({ soundOn, paused, gameOver })

  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => {
    if (!paused && !gameOver) inputRef.current?.focus()
  }, [paused, gameOver])

  useEffect(() => {
    focusInput()
  }, [focusInput, word])

  const nextWord = useCallback(
    (current: string) => {
      setWord(pickWord(current))
      setTyped("")
    },
    [],
  )

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

  const handleChange = (value: string) => {
    if (paused || gameOver) return

    unlockAudio()

    // Only accept input that matches the prefix of the target word.
    if (word.startsWith(value)) {
      setTyped(value)
      if (value) playCorrectKey()

      if (value === word) {
        // Word complete!
        const gained = 50 + combo * 10
        setScore((s) => s + gained)
        setCombo((c) => c + 1)
        setMagic((m) => Math.min(100, m + 20))
        advanceBear(-12)
        setWordsCompleted((w) => {
          const total = w + 1
          if (total % 5 === 0) setLevel((l) => l + 1)
          return total
        })
        nextWord(word)
      }
    } else {
      // Wrong key: break combo, bear gets closer, lose magic.
      playWrongKey()
      setCombo(0)
      setMagic((m) => Math.max(0, m - 10))
      advanceBear(15)
    }
  }

  const resetGame = () => {
    setWord(pickWord())
    setTyped("")
    setScore(0)
    setCombo(0)
    setLives(MAX_LIVES)
    setMagic(0)
    setLevel(1)
    setDistance(0)
    setPaused(false)
    setWordsCompleted(0)
    setGameOver(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const distanceLabel = useMemo(() => {
    if (distance < 33) return "FAR"
    if (distance < 66) return "MID"
    return "NEAR"
  }, [distance])

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden font-sans"
      onClick={focusInput}
    >
      {/* Background */}
      <img
        src="/background.png"
        alt="Enchanted forest with a young archer facing a bear"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[#1a0f2e]/10" aria-hidden="true" />

      {/* Hidden input that captures typing */}
      <input
        ref={inputRef}
        type="text"
        value={typed}
        onChange={(e) => handleChange(e.target.value.toLowerCase())}
        className="sr-only"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type the word shown on screen"
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1400px] flex-col justify-between p-4 sm:p-6">
        {/* Top HUD */}
        <header className="flex items-start justify-between gap-3">
          <StatPill>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#ffd54a] text-[#7a5a00] shadow-inner">
              <Star className="size-5 fill-current" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xs font-semibold text-[#9b6b3f]">Score</span>
              <span className="text-2xl font-extrabold text-[#4a2c6b]">{score}</span>
            </span>
          </StatPill>

          <StatPill>
            <span className="flex size-9 items-center justify-center rounded-full bg-[#a06bd6] text-white shadow-inner">
              <Sparkles className="size-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-xs font-semibold text-[#9b6b3f]">Combo</span>
              <span className="text-2xl font-extrabold text-[#7a3fb0]">x{combo}</span>
            </span>
          </StatPill>

          <StatPill>
            <span className="flex items-center gap-1.5">
              {Array.from({ length: MAX_LIVES }).map((_, i) => (
                <Heart
                  key={i}
                  className={
                    i < lives
                      ? "size-7 fill-[#ff4d8d] text-[#ff4d8d]"
                      : "size-7 fill-[#e4d5cf] text-[#e4d5cf]"
                  }
                />
              ))}
            </span>
          </StatPill>
        </header>

        {/* Center word panel */}
        <section className="mx-auto w-full max-w-2xl">
          <div className="rounded-3xl border-4 border-[#f3c6dc] bg-[#fdf6ee]/90 p-5 shadow-xl backdrop-blur-sm">
            <p className="text-center text-5xl font-extrabold tracking-tight text-[#4a2c6b] sm:text-6xl">
              {word}
            </p>
          </div>

          <div className="mt-4 rounded-3xl border-4 border-dashed border-[#d9c7bb] bg-[#fdf6ee]/85 p-5 shadow-lg backdrop-blur-sm">
            <p className="text-center text-4xl font-bold tracking-tight sm:text-5xl">
              {word.split("").map((char, i) => {
                const isTyped = i < typed.length
                return (
                  <span key={i} className={isTyped ? "text-[#e0277f]" : "text-[#bdb0a8]"}>
                    {i === typed.length && (
                      <span className="mx-[1px] inline-block w-[3px] animate-pulse self-center align-middle text-[#4a2c6b]">
                        |
                      </span>
                    )}
                    {char}
                  </span>
                )
              })}
              {typed.length === word.length && (
                <span className="mx-[1px] inline-block w-[3px] animate-pulse text-[#4a2c6b]">|</span>
              )}
            </p>
          </div>

          {/* Bear distance meter */}
          <div className="mt-6">
            <p className="mb-2 text-center text-lg font-bold text-[#3d6b2f] drop-shadow">
              {"\u{1F33F}"} Bear Distance {"\u{1F33F}"}
            </p>
            <div className="flex items-center gap-3 rounded-full bg-[#fdf6ee]/80 px-3 py-2 backdrop-blur-sm">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#a06bd6] text-lg">
                {"\u{1F43E}"}
              </span>
              <div className="relative h-3 flex-1 rounded-full bg-[#f7b9d0]">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-[#ec5a92] transition-all duration-200"
                  style={{ width: `${distance}%` }}
                />
              </div>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#caa57a] text-lg">
                {"\u{1F43B}"}
              </span>
            </div>
            <div className="mt-1 flex justify-between px-10 text-sm font-bold">
              <span className={distanceLabel === "FAR" ? "text-[#2f8f3d]" : "text-[#2f8f3d]/60"}>
                FAR
              </span>
              <span className={distanceLabel === "MID" ? "text-[#d98a2b]" : "text-[#d98a2b]/60"}>
                MID
              </span>
              <span className={distanceLabel === "NEAR" ? "text-[#d63a3a]" : "text-[#d63a3a]/60"}>
                NEAR
              </span>
            </div>
          </div>
        </section>

        {/* Bottom HUD */}
        <footer className="flex flex-col items-stretch gap-3 rounded-3xl border-4 border-[#ecd9c4] bg-[#fdf6ee]/90 p-4 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Magic */}
          <div className="flex flex-1 items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-[#a06bd6] text-white shadow-inner">
              <Wand2 className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xl font-extrabold text-[#4a2c6b]">Magic</span>
                <div className="relative h-4 flex-1 overflow-hidden rounded-full bg-[#e7dccf]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-[#b48ce0] transition-all duration-200"
                    style={{ width: `${magic}%` }}
                  />
                </div>
                <span className="w-12 text-right text-lg font-bold text-[#7a5a3f]">{magic}%</span>
              </div>
              <p className="mt-0.5 text-sm font-medium text-[#9b6b3f]">
                Type words correctly to fill your magic!
              </p>
            </div>
          </div>

          {/* Level badge */}
          <div className="flex shrink-0 flex-col items-center px-2">
            <span className="flex size-16 flex-col items-center justify-center rounded-2xl border-4 border-[#ffd54a] bg-[#efe6f7] leading-none shadow">
              <span className="text-xs font-bold text-[#7a3fb0]">Level</span>
              <span className="text-2xl font-extrabold text-[#4a2c6b]">{level}</span>
            </span>
          </div>

          {/* Controls */}
          <div className="flex shrink-0 items-center gap-3">
            <ControlButton
              label={paused ? "Resume" : "Pause"}
              onClick={() => {
                setPaused((p) => !p)
                setTimeout(focusInput, 0)
              }}
            >
              {paused ? <Play className="size-6" /> : <Pause className="size-6" />}
            </ControlButton>
            <ControlButton
              label="Sound"
              onClick={() => {
                setSoundOn((s) => !s)
                unlockAudio()
              }}
            >
              {soundOn ? <Volume2 className="size-6" /> : <VolumeX className="size-6" />}
            </ControlButton>
          </div>
        </footer>
      </div>

      {/* Pause overlay */}
      {paused && !gameOver && (
        <Overlay>
          <h2 className="text-3xl font-extrabold text-[#4a2c6b]">Paused</h2>
          <button
            onClick={() => {
              setPaused(false)
              setTimeout(focusInput, 0)
            }}
            className="mt-4 rounded-full bg-[#ec5a92] px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#d63a7c]"
          >
            Resume
          </button>
        </Overlay>
      )}

      {/* Game over overlay */}
      {gameOver && (
        <Overlay>
          <h2 className="text-3xl font-extrabold text-[#4a2c6b]">The bear got you!</h2>
          <p className="mt-2 text-lg font-semibold text-[#9b6b3f]">Final Score: {score}</p>
          <button
            onClick={resetGame}
            className="mt-4 rounded-full bg-[#ec5a92] px-8 py-3 text-lg font-bold text-white shadow-lg transition hover:bg-[#d63a7c]"
          >
            Play Again
          </button>
        </Overlay>
      )}
    </main>
  )
}

function StatPill({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-2xl border-4 border-[#ecd9c4] bg-[#fdf6ee]/90 px-4 py-2 shadow-lg backdrop-blur-sm">
      {children}
    </div>
  )
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-0.5 rounded-2xl border-4 border-[#e4d4e8] bg-[#efe6f7] px-4 py-2 text-[#7a3fb0] shadow transition hover:bg-[#e4d4f0]"
    >
      {children}
      <span className="text-xs font-bold">{label}</span>
    </button>
  )
}

function Overlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#1a0f2e]/50 backdrop-blur-sm">
      <div className="flex flex-col items-center rounded-3xl border-4 border-[#f3c6dc] bg-[#fdf6ee] px-10 py-8 text-center shadow-2xl">
        {children}
      </div>
    </div>
  )
}
