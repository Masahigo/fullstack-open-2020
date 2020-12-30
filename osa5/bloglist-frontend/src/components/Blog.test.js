import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders blog\'s title in list view', () => {
    const blog = {
        title: 'The best posts about DevOps',
        author: 'Polar Squad',
        url: 'https://polarsquad.com/blog',
        likes: 1000
    }

    const component = render(
        <Blog blog={blog} />
    )

    const div = component.container.querySelector('.list-view')
    expect(div).toHaveTextContent(
        'The best posts about DevOps'
    )
})