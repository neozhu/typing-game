export type AudioState = {
  soundOn: boolean
  paused: boolean
  gameOver: boolean
}

export function canPlayAudio({ soundOn, paused, gameOver }: AudioState) {
  return soundOn && !paused && !gameOver
}
