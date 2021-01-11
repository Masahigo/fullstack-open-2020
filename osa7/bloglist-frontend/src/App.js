import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, removeBlog, addBlogLike, initializeBlogs } from './reducers/blogReducer'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)

  /*useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])*/

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      // token was not persisting so enforce from here..
      blogService.setToken(user.token)
    }
  }, [])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`New blog '${blogObject.title}' created`, 5))
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

  const addLike = blog => {
    dispatch(addBlogLike(blog))
    dispatch(setNotification(`New like for '${blog.title}' added`, 2))
  }

  const remove = blog => {
    dispatch(removeBlog(blog.id))
    dispatch(setNotification(`Blog '${blog.title}' removed`, 2))
  }

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">login</button>
      </form>
    </>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  if (user === null) {
    return (
      <div>
        { loginForm()}
      </div>
    )
  }

  const blogsSortedByLikes = [...blogs].sort((a,b) => b['likes']-a['likes'])

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{user.name} logged in&nbsp;
        <button onClick={handleLogoutClick}>
          logout
        </button>
      </p>
      { blogForm()}
      <br />
      {blogsSortedByLikes.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog)}
          remove={() => remove(blog)}
        />
      )}
    </div>
  )
}

export default App