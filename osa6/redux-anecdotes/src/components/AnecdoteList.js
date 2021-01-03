import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const anecdotesOrderedByVotes = useSelector(state => state.anecdotes.sort((a,b) => b['votes']-a['votes'])) 
    const filter = useSelector(state => state.filter)

    const anecdotes = filter === 0
    ? anecdotesOrderedByVotes
    : anecdotesOrderedByVotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter))

    const dispatch = useDispatch()

    const vote = (anecdote) => {
        //console.log('vote', anecdote.id)
        dispatch(addVote(anecdote))
        dispatch(setNotification(`you voted '${anecdote.content}'`, 5))
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
              <button onClick={() => vote(anecdote)}>vote</button>
            </div>
          </div>
        )}
      </>
    )
  }
  
export default AnecdoteList