"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { canPlayAudio, type AudioState } from "@/lib/game-audio"

const MUSIC_NOTES = [261.63, 329.63, 392, 329.63]

function playTone(context: AudioContext, frequency: number, duration: number, type: OscillatorType, volume: number) {
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  const start = context.currentTime

  oscillator.type = type
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.001, start + duration)
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start(start)
  oscillator.stop(start + duration)
}

export function useGameAudio(state: AudioState) {
  const contextRef = useRef<AudioContext | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const canPlay = canPlayAudio(state)

  const unlockAudio = useCallback(() => {
    if (!contextRef.current) contextRef.current = new AudioContext()
    void contextRef.current.resume()
    setIsUnlocked(true)
  }, [])

  const playCorrectKey = useCallback(() => {
    if (canPlay && contextRef.current) playTone(contextRef.current, 880, 0.08, "triangle", 0.08)
  }, [canPlay])

  const playWrongKey = useCallback(() => {
    if (canPlay && contextRef.current) playTone(contextRef.current, 180, 0.12, "sawtooth", 0.06)
  }, [canPlay])

  useEffect(() => {
    if (!canPlay || !isUnlocked || !contextRef.current) return

    let noteIndex = 0
    const playMusicNote = () => {
      if (contextRef.current) {
        playTone(contextRef.current, MUSIC_NOTES[noteIndex], 0.45, "sine", 0.025)
        noteIndex = (noteIndex + 1) % MUSIC_NOTES.length
      }
    }

    playMusicNote()
    const interval = window.setInterval(playMusicNote, 500)
    return () => window.clearInterval(interval)
  }, [canPlay, isUnlocked])

  useEffect(() => {
    return () => void contextRef.current?.close()
  }, [])

  return { unlockAudio, playCorrectKey, playWrongKey }
}
