import blogService from '../services/blogs'

const blogReducer = (state = [], action) => {
  //console.log('ACTION', action)
  switch (action.type) {
    case 'NEW_BLOG':
      return [...state, action.data]
    case 'INIT_BLOGS':
      return action.data
    case 'ADD_LIKE':
        const id = action.data.id
        const blogToChange = state.find(b => b.id === id)
        const changedBlog = { 
          ...blogToChange, 
          likes: blogToChange.likes + 1 
        }
        return state.map(blog =>
          blog.id !== id ? blog : changedBlog
        )
    case 'ADD_COMMENT':
        const blogToChange2 = state.find(b => b.id === action.data.id)
        const changedBlog2 = { 
          ...blogToChange2, 
          comments: action.data.comments
        }
        return state.map(blog =>
          blog.id !== action.data.id ? blog : changedBlog2
        )
    case 'REMOVE_BLOG':
      return state.filter(blog => blog.id !== action.data.id)
    default:
      return state
  }
}

export const createBlog = object => {
  return async dispatch => {
    const newBlog = await blogService.create(object)
    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    })
  }
}

export const removeBlog = id => {
    return async dispatch => {
      await blogService.remove(id)
      dispatch({
        type: 'REMOVE_BLOG',
        data: {
            id: id
          }
      })
    }
  }

  export const addBlogLike = (blog) => {
    return async dispatch => {
      const changedBlog = await blogService.update(blog.id, blog)
      dispatch ({
        type: 'ADD_LIKE',
        data: { 
          id: changedBlog.id
        }
      })
    }
  }

  export const addBlogComment = (blog) => {
    return async dispatch => {
      const changedBlog = await blogService.update(blog.id, blog)
      dispatch ({
        type: 'ADD_COMMENT',
        data: changedBlog
      })
    }
  }

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    })
  }
}

export default blogReducer