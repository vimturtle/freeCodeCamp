import React from 'react'

import { secondsToMMSS } from '../utils/secondsToMMSS'

const Timer = ({
  timerType,
  timerState,
  timerSeconds,
  handleStartStop,
  handleReset,
}) => {
  return (
    <div className='flex justify-center'>
      <div className='border border-gray-700 rounded-lg m-4 px-12 py-6 text-center'>
        <div
          id='timer-label'
          className='text-bold text-4xl text-purple-700 mb-3'
        >
          {timerType} Timer
        </div>
        <div id='time-left' className='text-bold text-2xl'>
          <div className='text-bold text-2xl p-3 mb-6 border rounded-lg border-purple-600'>
            <div
              className={`${timerState === 'running' ? 'animate-ping' : ''} ${
                timerSeconds < 61 ? 'text-red-600' : ''
              }`}
            >
              {secondsToMMSS(timerSeconds)}
            </div>
          </div>
        </div>
        <div className='flex justify-center gap-4'>
          <div
            id='start_stop'
            className='flex gap-4'
            title='Start/Pause'
            onClick={handleStartStop}
          >
            {timerState === 'paused' ? (
              <button className='btn btn-purple'>
                <i className='fas fa-play fa-sm animate-bounce'></i>
              </button>
            ) : (
              <button className='btn btn-gray'>
                <i className='fas fa-pause fa-sm'></i>
              </button>
            )}
          </div>
          <button
            id='reset'
            className='btn btn-purple'
            title='Reset'
            onClick={handleReset}
          >
            <i className='fas fa-retweet fa-sm'></i>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Timer
