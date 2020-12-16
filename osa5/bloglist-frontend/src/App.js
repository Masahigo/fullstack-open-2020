import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({
    title: '', author: '', url: ''
  })
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  const addBlog = (event) => {
    event.preventDefault()
    //console.log('button clicked', event.target)
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      userId: user.id,
    }

    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setNewBlog({title: '', author: '', url: ''})
      })
  
  }
  
  const handleLogin = async (event) => {
    event.preventDefault()
    //console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username, password,
      })
      //console.log('user', user)
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleLogoutClick = () => {
    //console.log('logout btn clicked')
    setUser(null)
    setUsername('')
    setPassword('')
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        title:&nbsp;
        <input
          type="text"
          value={newBlog.title}
          name="Title"
          onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value})}
        />
      </div>
      <div>
        author:&nbsp;
        <input
          type="text"
          value={newBlog.author}
          name="Author"
          onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value})}
        />
      </div>
      <div>
        url:&nbsp;
        <input
          type="text"
          value={newBlog.url}
          name="Url"
          onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value})}
        />
      </div>
      <button type="submit">create</button>
    </form>
  )

  if (user === null) {
    return (
      <div>
        { loginForm() }
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <p>{user.name} logged in&nbsp;
        <button onClick={handleLogoutClick}>
          logout
        </button>
      </p>
      <h2>create new</h2>
      { blogForm() }
      <br />
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App