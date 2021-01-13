import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  TextareaAutosize,
} from '@material-ui/core'

const CommentForm = ({ createComment, blog }) => {

  const [newComment, setNewComment] = useState('')

  const addComment = (event) => {
    event.preventDefault()
    createComment({
      ...blog, 
      comments: blog.comments.push(newComment)
    })

    setNewComment('')
  }

  return (
    <div>
      <h2>add comment</h2>
      <form onSubmit={addComment}>
        <div>
          comment:&nbsp;
          <TextareaAutosize
            id="new-blog-comment"
            type="text"
            value={newComment}
            name="Comment"
            onChange={({ target }) => setNewComment(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" id="create-button" type="submit">create</Button>
      </form>
    </div>
  )
}

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired
}

export default CommentForm