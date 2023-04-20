import React from 'react'
import './App.scss'

const sounds = [
  {
    key: 'Q',
    code: '81',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
  },
  {
    key: 'W',
    code: '87',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
  },
  {
    key: 'E',
    code: '69',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
  },
  {
    key: 'A',
    code: '65',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
  },
  {
    key: 'S',
    code: '83',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
  },
  {
    key: 'D',
    code: '68',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
  },
  {
    key: 'Z',
    code: '90',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
  },
  {
    key: 'X',
    code: '88',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
  },
  {
    key: 'C',
    code: '67',
    src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
  },
]

const App = () => (
  <div className="App" id="drum-machine">
    <h1>Drum Machine</h1>
    <small>
      <a href="https://github.com/vimturtle">Source</a>
    </small>
    <div id="display">Hover over keys!</div>
    <div className="drum">
      {sounds.map((sound, idx) => (
        <DrumPad
          key={idx}
          audio={sound.src}
          text={sound.key}
          code={sound.code}
        />
      ))}
    </div>
  </div>
)

class DrumPad extends React.Component {
  constructor(props) {
    super(props)

    this.audioRef = React.createRef()
  }

  componentDidMount() {
    const keys = Array.from(document.querySelectorAll('.drum-pad'))

    keys.forEach((key) =>
      key.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return
        e.target.classList.remove('active')
      })
    )
  }

  render() {
    const { text, audio, code } = this.props

    return (
      <div id={text}>
        <div
          data-key={code}
          className="drum-pad"
          id={`drumpad-${text}`}
          onClick={this.playSoundOnClick}
          onMouseOver={this.playSoundOnClick}
        >
          <div>{`${text}`}</div>
          <audio
            data-key={`${code}`}
            src={audio}
            className="clip"
            id={text}
            ref={this.audioRef}
          ></audio>
        </div>
      </div>
    )
  }

  playSoundOnClick = () => {
    this.audioRef.current.play()

    document.querySelector(
      '#display'
    ).innerText = `${this.audioRef.current.id} is playing!`
  }
}

document.addEventListener('keydown', (e) => {
  const audio = document.querySelector(`audio[data-key="${e.keyCode}"]`)
  const key = document.querySelector(`div[data-key="${e.keyCode}"]`)

  if (audio) {
    key.classList.add('active')
    audio.currentTime = 0
    audio.play()

    document.querySelector(
      '#display'
    ).innerText = `${e.key.toUpperCase()} is playing!`
  }
})

export default App
