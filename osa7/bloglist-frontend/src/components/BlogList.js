import React from 'react'
import { Link } from "react-router-dom"

const BlogList = ({ blog }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  
  return(
    <div style={blogStyle}>
      <div className='list-view'>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </div>
    </div>
  )
}

export default BlogList
