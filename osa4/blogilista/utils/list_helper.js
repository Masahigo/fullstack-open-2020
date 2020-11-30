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


module.exports = {
    dummy,
    totalLikes,
}