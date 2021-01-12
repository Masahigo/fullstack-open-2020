import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, /* removeBlog, */ addBlogLike, initializeBlogs } from './reducers/blogReducer'
import { setUser, clearUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import {
  useRouteMatch, useHistory,
  Switch, Link, Route
} from "react-router-dom"
import './App.css'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const blogFormRef = useRef()

  const dispatch = useDispatch()
  const blogs = useSelector(state => state.blogs)
  const loggedUser = useSelector(state => state.user)
  const users = useSelector(state => state.users)

  //console.log('users', users)

  const userMatch = useRouteMatch('/users/:id')
  const user = userMatch
    ? users.find(user => user.id === userMatch.params.id)
    : null

  const blogMatch = useRouteMatch('/blogs/:id')
  const blog = blogMatch
    ? blogs.find(blog => blog.id === blogMatch.params.id)
    : null

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

  /*const remove = blog => {
    dispatch(removeBlog(blog.id))
    dispatch(setNotification(`Blog '${blog.title}' removed`, 2))
  }*/

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

  if (loggedUser === null) {
    return (
      <div>
        { loginForm()}
      </div>
    )
  }

  const blogsSortedByLikes = [...blogs].sort((a, b) => b['likes'] - a['likes'])

  const User = ({ user }) => {
    //console.log('User', user)
    const history = useHistory()

    const backClick = () => {
      history.push('/')
    }

    if (!user) {
      return null
    }

    if (user.blogs.length === 0) {
      return (
        <div>
          <h2>{user.name}</h2>
          <p>No blogs added by the user.</p>
          <button onClick={() => backClick()}>back</button>
        </div>
      )
    }

    return (
      <div>
        <h2>{user.name}</h2>
        <h3>Added blogs</h3>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>
              {blog.title}
            </li>
          )}
        </ul>
        <button onClick={() => backClick()}>back</button>
      </div>
    )
  }

  const Blog = ({ blog, addLike }) => {
    const history = useHistory()

    const backClick = () => {
      history.push('/')
    }

    console.log("Blog", blog)

    if (!blog) {
      return null
    }

    return (
      <div>
        <h2>{blog.title}</h2>
        <div key={blog.id}>
          <p>
            <span>{blog.url}</span><br />
            <span>
              {blog.likes} likes&nbsp;
              <button onClick={addLike} className='like-button'>like</button>
            </span><br />
            <span>added by {blog.user.name}</span>
          </p>
        </div>
        <button onClick={() => backClick()}>back</button>
      </div>
    )
  }

  const UsersList = ({ users }) => (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr><th>&nbsp;</th><th>blogs created</th></tr>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )

  return (
    <div>
      <h2>blogs</h2>
      <Notification />
      <p>{loggedUser.name} logged in&nbsp;
          <button onClick={handleLogoutClick}>
          logout
          </button>
      </p>
      { blogForm()}
      <br />
      <Switch>
        <Route path="/users/:id">
          <User user={user} />
        </Route>
        <Route path="/blogs/:id">
          <Blog blog={blog} 
            addLike={() => addLike(blog)} />
        </Route>
        <Route path="/">
          {blogsSortedByLikes.map(blog =>
          <BlogList
              key={blog.id}
              blog={blog}
            />
          )}
          <UsersList users={users} />
        </Route>
      </Switch>
    </div>
  )
}

export default App