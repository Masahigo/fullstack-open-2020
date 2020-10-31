import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const App = (props) => {

  const [selected, setSelected] = useState(0)
  const [points, setVotes] = useState(new Array(anecdotes.length).fill(0))

  //if(selected == anecdotes.length) {
  //  setSelected(0);
  //}

  const addPoint = () => {
    const copy = { ...points }
    // kasvatetaan olion kentän 2 arvoa yhdellä
    copy[selected] += 1
    console.log(copy)
    return copy;
  }

  const getRandomInt = () => {
    const max = anecdotes.length
    const randomInt = Math.floor(Math.random() * Math.floor(max))
    console.log(randomInt)
    return randomInt
  }
  
  return (
    <div>
      {props.anecdotes[selected]}<br />
      has {points[selected]} votes<br />
      <Button handleClick={() => setVotes(addPoint())} text="vote" />
      <Button handleClick={() => setSelected(getRandomInt())} text="next anecdote" />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
