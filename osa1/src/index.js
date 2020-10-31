import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Subheader = (props) => {
  console.log(props)
  return (
    <>
      <h2>{props.text}</h2>
    </>
  )
}

const Content = (props) => {
  console.log(props)
  return (
    <div>
      {props.text} {props.value}
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const Statistics = (props) => {
  const { good, neutral, bad } = props
  const statisticsText = 'statistics'

  const sum = () => {
    return (good + neutral + bad)
  }

  const average = () => {
    return (good * 1 + bad * -1) / sum()
  }

  const positive = () => {
    const average = good / sum()
    return average * 100
  }

  if (sum() === 0) {
    return (
      <>
      <Subheader text={statisticsText} />
      <div>
        No feedback given
      </div>
      </>
    )
  }

  return (
    <>
      <Subheader text={statisticsText} />
      <Content text="good" value={good} />
      <Content text="neutral" value={neutral} />
      <Content text="bad" value={bad} />
      <Content text="all" value={sum()} />
      <Content text="average" value={average()} />
      <div>
        positive {positive()} %
      </div>
    </>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedbackText = 'give feedback'

  return (
    <div>
      <Subheader text={feedbackText} />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
