import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
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

test('renders all details of a blog after view button clicked', () => {
    const blog = {
        title: 'The best posts about DevOps',
        author: 'Polar Squad',
        url: 'https://polarsquad.com/blog',
        likes: 1000
    }

    const component = render(
        <Blog blog={blog} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.detail-view')
    expect(div).not.toHaveStyle('display: none')
    
    expect(div).toHaveTextContent(
        'The best posts about DevOps'
    )

    expect(div).toHaveTextContent(
        'Polar Squad'
    )

    expect(div).toHaveTextContent(
        'https://polarsquad.com/blog'
    )

    expect(div).toHaveTextContent(
        'likes 1000'
    )
})