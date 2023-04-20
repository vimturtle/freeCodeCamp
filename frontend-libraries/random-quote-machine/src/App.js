import React from 'react'
import './App.scss'

import { quotes } from './quotes'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quote: this.getRandom(quotes),
    }

    this.getRandom = this.getRandom.bind(this)
  }

  getRandom(quotes) {
    return quotes[Math.floor(Math.random() * quotes.length)]
  }

  render() {
    const { quote, author } = this.state.quote
    const tweet_url = `https://twitter.com/intent/tweet?text="${quote}" - ${author}, Breaking Bad`

    return (
      <div className='wrapper'>
        <div id='quote-box'>
          <span id='header'>Breaking Bad Quotes</span>
          <small>
            <a href='https://github.com/timbiles/Breaking-Bad--API/'>API</a>{' '}
            {'// '}
            <a href='https://github.com/vimturtle/'>Source</a>
          </small>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            height='20'
            width='20'
            viewBox='0 0 448 512'
            fill='#f1f1f1'
          >
            <path d='M96 224C84.72 224 74.05 226.3 64 229.9V224c0-35.3 28.7-64 64-64c17.67 0 32-14.33 32-32S145.7 96 128 96C57.42 96 0 153.4 0 224v96c0 53.02 42.98 96 96 96s96-42.98 96-96S149 224 96 224zM352 224c-11.28 0-21.95 2.305-32 5.879V224c0-35.3 28.7-64 64-64c17.67 0 32-14.33 32-32s-14.33-32-32-32c-70.58 0-128 57.42-128 128v96c0 53.02 42.98 96 96 96s96-42.98 96-96S405 224 352 224z' />
          </svg>
          <p id='text'>{quote}</p>
          <p id='author'>
            {'- '}
            {author}
          </p>
          <div>
            <button>
              <a href={tweet_url} id='tweet-quote'>
                Twitter
              </a>
            </button>
            <button
              id='new-quote'
              onClick={() => this.setState({ quote: this.getRandom(quotes) })}
            >
              New quote
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default App
