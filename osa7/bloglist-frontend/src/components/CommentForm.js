import React, { useState } from 'react'
import PropTypes from 'prop-types'

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
          <textarea
            id="new-blog-comment"
            type="text"
            value={newComment}
            name="Comment"
            onChange={({ target }) => setNewComment(target.value)}
          />
        </div>
        <button id="create-button" type="submit">create</button>
      </form>
    </div>
  )
}

CommentForm.propTypes = {
  createComment: PropTypes.func.isRequired
}

export default CommentForm