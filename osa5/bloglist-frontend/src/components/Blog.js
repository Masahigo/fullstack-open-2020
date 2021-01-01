import React, { useState } from 'react'

const Blog = ({ blog, addLike, remove }) => {
  const [detailView, setDetailView] = useState(false)

  const hideWhenDetailView = { display: detailView ? 'none' : '' }
  const showWhenDetailView = { display: detailView ? '' : 'none' }

  const toggleDetailView = () => {
    setDetailView(!detailView)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  return (
    <div style={blogStyle}>
      <div style={hideWhenDetailView} className='list-view'>
        {blog.title} &nbsp;
        <button onClick={toggleDetailView}>view</button>
      </div>
      <div style={showWhenDetailView} className='detail-view'>
        {blog.title} &nbsp;
        <button onClick={toggleDetailView}>hide</button><br />
        {blog.url}<br />
        likes {blog.likes}&nbsp; <button onClick={addLike} className='like-button'>like</button><br />
        {blog.author}<br />
        <button onClick={remove} className='remove-button'>remove</button>
      </div>

    </div>
  )
}

export default Blog
