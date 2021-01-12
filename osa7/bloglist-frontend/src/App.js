import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, removeBlog, addBlogLike, initializeBlogs } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import './App.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    dispatch(initializeUsers())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      // token was not persisting so enforce from here..
      blogService.setToken(user.token)
    }
  }, [dispatch])

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blogObject))
    dispatch(setNotification(`New blog '${blogObject.title}' created`, 5))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.error(exception)
    }
  }

  const handleLogoutClick = () => {
    dispatch(clearUser())
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
      <br />
      <h2>Users</h2>
      <table>
          <tbody>
          <tr><th>&nbsp;</th><th>blogs created</th></tr>
            {users.map(user => 
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.blogs.length}</td>
            </tr>
            )}
          </tbody>
      </table>
    </div>
  )
}

export default App