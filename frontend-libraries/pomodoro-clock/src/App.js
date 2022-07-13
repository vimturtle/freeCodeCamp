import React, { useState, useEffect, useRef } from 'react'

import TimerControl from './components/timer-control'
import Timer from './components/timer'
import Header from './components/header'
import './App.scss'

const App = () => {
  const [breakLength, setBreakLength] = useState(5)
  const [sessionLength, setSessionLength] = useState(25)
  const [timerType, setTimerType] = useState('Session')
  const [timerState, setTimerState] = useState('paused')
  const [timerSeconds, setTimerSeconds] = useState(1500)

  const audioRef = useRef(null)

  useEffect(() => {
    let interval = null

    if (timerState === 'running') {
      interval = setInterval(() => {
        setTimerSeconds((timerSeconds) => timerSeconds - 1)
        phaseControl()
      }, 1000)
      if (timerSeconds === 0) {
        audioRef.current.play()
      }
    } else if (!timerState && timerSeconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  })

  const handleReset = () => {
    setSessionLength(25)
    setBreakLength(5)
    setTimerState('paused')
    setTimerType('Session')
    setTimerSeconds(1500)
    audioRef.current.pause()
    audioRef.current.currentTime = 0
  }

  const handleBreakLengthChange = (e) => {
    handleLengthChange(
      e.currentTarget.value,
      'Break',
      setBreakLength,
      breakLength
    )
  }

  const handleSessionLengthChange = (e) => {
    handleLengthChange(
      e.currentTarget.value,
      'Session',
      setSessionLength,
      sessionLength
    )
  }

  const handleLengthChange = (sign, type, func, currentLength) => {
    if (timerState === 'running') return
    if (timerType !== type) {
      if (sign === '+' && currentLength !== 60) {
        func(currentLength + 1)
      } else if (sign === '-' && currentLength !== 1) {
        func(currentLength - 1)
      }
    } else {
      if (sign === '+' && currentLength !== 60) {
        func(currentLength + 1)
        setTimerSeconds(currentLength * 60 + 60)
      } else if (sign === '-' && currentLength !== 1) {
        func(currentLength - 1)
        setTimerSeconds(currentLength * 60 - 60)
      }
    }
  }

  const handleStartStop = () => {
    if (timerState === 'paused') {
      setTimerState('running')
    } else {
      setTimerState('paused')
    }
  }

  const phaseControl = () => {
    if (timerSeconds === 0) {
      if (timerType === 'Session') {
        switchTimerType(breakLength * 60, 'Break')
      } else {
        switchTimerType(sessionLength * 60, 'Session')
      }
    }
  }

  const switchTimerType = (seconds, type) => {
    setTimerSeconds(seconds)
    setTimerType(type)
  }

  return (
    <div className='h-full'>
      <Header />
      <div className='flex flex-col'>
        <div className='border border-gray-800 rounded-lg p-5 m-auto mt-10'>
          <div className='flex flex-wrap justify-center'>
            <TimerControl
              label='Break Length'
              labelId='break-label'
              increId='break-increment'
              decId='break-decrement'
              length={breakLength}
              lengthId='break-length'
              handleLengthChange={handleBreakLengthChange}
              timerState={timerState}
            />
            <TimerControl
              label='Session Length'
              labelId='session-label'
              increId='session-increment'
              decId='session-decrement'
              length={sessionLength}
              lengthId='session-length'
              handleLengthChange={handleSessionLengthChange}
              timerState={timerState}
            />
          </div>
          <div>
            <Timer
              timerType={timerType}
              timerState={timerState}
              timerSeconds={timerSeconds}
              handleStartStop={handleStartStop}
              handleReset={handleReset}
            />
          </div>
        </div>
      </div>
      <audio
        id='beep'
        preload='auto'
        src='https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav'
        ref={audioRef}
      />
    </div>
  )
}

export default App
