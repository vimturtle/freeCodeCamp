import React from 'react'

const Header = () => {
  return (
    <div className='text-center'>
      <h1 className='text-bold text-center text-gray-800 text-4xl mt-5 mb-1'>
        Pomodoro Clock
      </h1>
      <p>
        Built using React and Tailwind. [
        <a href='https://github.com/vimturtle' className='text-purple-700'>
          Source
        </a>
        ]
      </p>
    </div>
  )
}

export default Header
