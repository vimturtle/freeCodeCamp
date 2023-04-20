export const secondsToMMSS = (timerSeconds) => {
  let minutes = Math.floor(timerSeconds / 60)
  let seconds = timerSeconds - minutes * 60
  seconds = seconds < 10 ? '0' + seconds : seconds
  minutes = minutes < 10 ? '0' + minutes : minutes
  return minutes + ':' + seconds
}
