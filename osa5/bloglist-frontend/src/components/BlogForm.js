import React, { useState } from 'react'

const BlogForm = ({ createBlog, userId }) => {
    
    const [newBlog, setNewBlog] = useState({
        title: '', author: '', url: ''
    })

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title: newBlog.title,
            author: newBlog.author,
            url: newBlog.url,
            userId: userId,
        })

        setNewBlog({title: '', author: '', url: ''})
    }

    return (
        <form onSubmit={addBlog}>
            <div>
                title:&nbsp;
                <input
                    type="text"
                    value={newBlog.title}
                    name="Title"
                    onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
                />
            </div>
            <div>
                author:&nbsp;
                <input
                    type="text"
                    value={newBlog.author}
                    name="Author"
                    onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
                />
            </div>
            <div>
                url:&nbsp;
                <input
                    type="text"
                    value={newBlog.url}
                    name="Url"
                    onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default BlogForm