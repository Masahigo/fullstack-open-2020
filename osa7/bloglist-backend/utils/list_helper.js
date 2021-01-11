const logger = require('./logger')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        //logger.info('sum', sum)
        //logger.info('item', item)
        return sum + item
    }

    return blogs.length === 0
    ? 0 
    : blogs.map(blog => blog.likes).reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {

    const mostLikes = (blog) => {
        const blogObject = {
            title: blog.title,
            author: blog.author,
            likes: blog.likes,
        }
        return blogObject
    }

    //logger.info('Math.max', Math.max(...blogs.map(blog => blog.likes)))
    const maxLikes = Math.max(...blogs.map(blog => blog.likes))

    return blogs.length === 0
    ? 0 
    : mostLikes(blogs.filter(b => b.likes === maxLikes)[0])
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}