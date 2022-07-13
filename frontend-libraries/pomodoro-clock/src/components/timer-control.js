import React from 'react'

const TimerControl = ({
  label,
  labelId,
  increId,
  decId,
  length,
  lengthId,
  handleLengthChange,
  timerState,
}) => {
  return (
    <div className='mt-5'>
      <div className='text-center border border-gray-700 rounded-lg m-4 p-5'>
        <div id={labelId} className='text-bold text-2xl text-gray-800 mb-4'>
          {label}
        </div>
        <div className='flex flex-wrap justify-center gap-3'>
          <button
            id={increId}
            onClick={handleLengthChange}
            value='+'
            className='btn btn-purple'
          >
            <i
              className={`fa fa-arrow-up ${
                timerState === 'paused' ? 'animate-bounce' : ''
              }`}
            />
          </button>
          <div
            id={lengthId}
            className='p-4 border border-purple-600 rounded-lg'
          >
            {length}
          </div>
          <button
            id={decId}
            onClick={handleLengthChange}
            value='-'
            className='btn btn-gray'
          >
            <i
              className={`fa fa-arrow-down ${
                timerState === 'paused' ? 'animate-bounce' : ''
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

export default TimerControl
