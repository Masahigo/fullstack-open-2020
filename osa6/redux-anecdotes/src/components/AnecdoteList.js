import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotesOrderedByVotes = useSelector(state => state.anecdotes.sort((a,b) => b['votes']-a['votes'])) 
    const filter = useSelector(state => state.filter)

    const anecdotes = filter === 0
    ? anecdotesOrderedByVotes
    : anecdotesOrderedByVotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter))

    const dispatch = useDispatch()

    const vote = (id) => {
        console.log('vote', id)
        dispatch(addVote(id))
        const anecdote = anecdotes.find(a => a.id === id)
        dispatch(setNotification(`You voted '${anecdote.content}'`))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
    }
  
    return(
      <>
        {anecdotes.map(anecdote =>
          <div key={anecdote.id}>
            <div>
              {anecdote.content}
            </div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        )}
      </>
    )
  }
  
export default AnecdoteList