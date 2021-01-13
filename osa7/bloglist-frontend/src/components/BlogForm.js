import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  Button,
} from '@material-ui/core'

const BlogForm = ({ createBlog }) => {

  const [newBlog, setNewBlog] = useState({
    title: '', author: '', url: ''
  })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
    <div>
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
                    title:&nbsp;
          <input
            id="title"
            type="text"
            value={newBlog.title}
            name="Title"
            onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
          />
        </div>
        <div>
                    author:&nbsp;
          <input
            id="author"
            type="text"
            value={newBlog.author}
            name="Author"
            onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
          />
        </div>
        <div>
                    url:&nbsp;
          <input
            id="url"
            type="text"
            value={newBlog.url}
            name="Url"
            onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
          />
        </div>
        <Button variant="contained" color="primary" id="create-button" type="submit">create</Button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm