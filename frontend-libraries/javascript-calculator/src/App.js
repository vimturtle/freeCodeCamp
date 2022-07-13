import React, { useState } from 'react'
import './App.scss'

const numbers = [7, 8, 9, 4, 5, 6, 1, 2, 3, 0, '.', '=']
const numberIds = {
  0: 'zero',
  1: 'one',
  2: 'two',
  3: 'three',
  4: 'four',
  5: 'five',
  6: 'six',
  7: 'seven',
  8: 'eight',
  9: 'nine',
  '.': 'decimal',
  '=': 'equals',
}

const operations = ['/', '*', '-', '+']
const operationIds = {
  '/': 'divide',
  '*': 'multiply',
  '-': 'subtract',
  '+': 'add',
}

function App() {
  const [formula, setFormula] = useState('0')
  const [currentOutput, setCurrentOutput] = useState('0')
  const [lastPressed, setLastPressed] = useState('')

  const handleClick = (e) => {
    const { innerText } = e.target

    switch (innerText) {
      case 'AC': {
        setFormula('0')
        setCurrentOutput('0')
        break
      }

      case '=': {
        const evaluatedValue = eval(currentOutput)
        setFormula(currentOutput + ' = ')
        // round to 10 decimal places
        setCurrentOutput(Math.round(evaluatedValue * 10000000000) / 10000000000)
        break
      }

      case '.': {
        const currentValue = currentOutput.split(/[+\-*/]/).slice(-1)[0]

        if (!currentValue.includes('.')) {
          setFormula(currentOutput + '.')
          setCurrentOutput(currentOutput + '.')
        }
        break
      }

      default: {
        let temp

        if (operations.includes(innerText)) {
          if (operations.includes(lastPressed) && innerText !== '-') {
            const lastNumberIdx = currentOutput
              .split('')
              .reverse()
              .findIndex((char) => char !== ' ' && numbers.includes(+char))
            temp =
              currentOutput.slice(0, currentOutput.length - lastNumberIdx) +
              ` ${innerText} `
          } else {
            temp = `${currentOutput} ${innerText} `
          }
        } else {
          temp = currentOutput === '0' ? innerText : currentOutput + innerText
        }

        setFormula(temp)
        setCurrentOutput(temp)
      }
    }

    setLastPressed(innerText)
  }

  return (
    <div className='h-full w-full'>
      <h1 className='text-center tracking-wide uppercase border text-gray-700 text-3xl mt-3 font-mono'>
        JavaScript Calculator
      </h1>
      <p className='text-center mb-6'>
        Built using React and Tailwind. [
        <a href='https://github.com/vimturtle' className='text-purple-700'>
          Source
        </a>
        ]
      </p>
      <div className='flex justify-center'>
        <div className='border border-gray-500 sm:w-auto xl:w-1/5 p-5 rounded'>
          <div className='border border-gray-400 rounded h-16'>
            <div className='text-gray-600 text-bold uppercase font-mono tracking-wide text-xl pl-2'>
              {formula}
            </div>
            <div
              id='display'
              className='text-black text-bold uppercase font-mono tracking-wide text-xl text-right pr-2'
            >
              {currentOutput}
            </div>
          </div>
          <button
            id='clear'
            className='bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 mb-2 mt-2 w-full border border-gray-400 rounded shadow'
            onClick={handleClick}
          >
            AC
          </button>
          <div className='grid grid-cols-12 gap-3'>
            <div className='grid grid-cols-3 gap-6 col-span-10'>
              {numbers.map((number, idx) => (
                <button
                  id={numberIds[number]}
                  className='bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 border border-gray-400 rounded-full shadow'
                  key={`nums${idx}`}
                  onClick={handleClick}
                >
                  {number}
                </button>
              ))}
            </div>
            <div className='grid grid-cols-1 gap-3 col-span-2'>
              {operations.map((operation, idx) => (
                <button
                  id={operationIds[operation]}
                  className='bg-purple-400 hover:bg-purple-600 text-gray-800 py-2 px-4 border border-gray-400 rounded-full shadow'
                  key={`ops${idx}`}
                  onClick={handleClick}
                >
                  {operation}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
