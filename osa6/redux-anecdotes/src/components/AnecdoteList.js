import React from 'react'
import { connect } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = (props) => {
  const vote = (anecdote) => {
    //console.log('vote', anecdote.id)
    props.addVote(anecdote)
    props.setNotification(`you voted '${anecdote.content}'`, 5)
  }

  return (
    <>
      {props.anecdotes.map(anecdote =>
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

const mapStateToProps = (state) => {
  const anecdotesOrderedByVotes = state.anecdotes.sort((a, b) => b['votes'] - a['votes'])
  if (state.filter.length === 0) {
    return {
      anecdotes: anecdotesOrderedByVotes
    }
  }
  return {
    anecdotes: anecdotesOrderedByVotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter))
  }
}

const mapDispatchToProps = {
  addVote,
  setNotification
}

const ConnectedAnecdotes = connect(
  mapStateToProps,
  mapDispatchToProps
)(AnecdoteList)
export default ConnectedAnecdotes