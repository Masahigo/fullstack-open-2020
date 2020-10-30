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
    <>
      <p>{props.type} {props.count}</p>
    </>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedbackText = 'give feedback'
  const statisticsText = 'statistics'

  return (
    <div>
      <Subheader text={feedbackText} />
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Subheader text={statisticsText} />
      <Content type="good" count={good} />
      <Content type="neutral" count={neutral} />
      <Content type="bad" count={bad} />
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
