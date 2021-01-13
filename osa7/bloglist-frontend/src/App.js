import React, { useState, useRef, useEffect } from 'react'
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Toolbar,
  AppBar
} from '@material-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import CommentForm from './components/CommentForm'
import Notification from './components/Notification'
import { setNotification } from './reducers/notificationReducer'
import { createBlog, /* removeBlog, */ addBlogLike, initializeBlogs, addBlogComment } from './reducers/blogReducer'
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
  const commentFormRef = useRef()

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

  const addComment = blog => {
    //console.log('updated blog with comment', blog)
    commentFormRef.current.toggleVisibility()
    dispatch(addBlogComment(blog))
    dispatch(setNotification(`New comment for '${blog.title}' added`, 2))
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
          <TextField
            id='username'
            label='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <TextField
            id='password'
            label='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <Button variant="contained" color="primary" id="login-button" type="submit">login</Button>
      </form>
    </>
  )

  const blogForm = () => (
    <Togglable buttonLabel="Create new" ref={blogFormRef}>
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
          <Button variant="contained" color="secondary" onClick={() => backClick()}>back</Button>
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
        <Button variant="contained" color="secondary" onClick={() => backClick()}>back</Button>
      </div>
    )
  }

  const Blog = ({ blog, addLike, addComment, formRef }) => {
    const history = useHistory()

    const backClick = () => {
      history.push('/')
    }

    //console.log("Blog", blog)

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
                <Button variant="contained" color="secondary" onClick={addLike} className='like-button'>like</Button>
            </span><br />
            <span>added by {blog.user.name}</span>
          </p>
        </div>
        <h3>comments</h3>
        <Togglable buttonLabel="Add comment" ref={formRef}>
          <CommentForm createComment={addComment} blog={blog} />
        </Togglable>
        <ul>
          {blog.comments.map((comment, index) =>
            <li key={index}>
              {comment}
            </li>
          )}

        </ul>
        <Button variant="contained" color="secondary" onClick={() => backClick()}>back</Button>
      </div>
    )
  }

  const UsersList = ({ users }) => (
    <div>
      <h2>Users</h2>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow><th>&nbsp;</th><th>blogs created</th></TableRow>
            {users.map(user =>
              <TableRow key={user.id}>
                <TableCell><Link to={`/users/${user.id}`}>{user.name}</Link></TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )

  const Menu = ({ username, logoutClick }) => {
    /*const padding = {
      paddingRight: 5
    }*/
    return (
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/blogs">blogs</Button>
          <Button color="inherit" component={Link} to="/users">users</Button>
          <span>{username} logged in&nbsp;
            <Button color="inherit" onClick={logoutClick}>
              logout
            </Button>
          </span>
        </Toolbar>
      </AppBar>
    )
  }

  return (
    <Container>
      <div>
        <Menu
          username={loggedUser.name}
          logoutClick={handleLogoutClick}
        />
        <Notification />
        <h2>Blog app</h2>
        <Switch>
          <Route path="/users/:id">
            <User user={user} />
          </Route>
          <Route path="/blogs/:id">
            <Blog
              blog={blog}
              addLike={() => addLike(blog)}
              addComment={() => addComment(blog)}
              formRef={commentFormRef}
            />
          </Route>
          <Route path="/users">
            <UsersList users={users} />
          </Route>
          <Route path="/blogs">
            {blogForm()}
            {blogsSortedByLikes.map(blog =>
              <BlogList
                key={blog.id}
                blog={blog}
              />
            )}
          </Route>
          <Route path="/">
            {blogForm()}
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
    </Container>
  )
}

export default App