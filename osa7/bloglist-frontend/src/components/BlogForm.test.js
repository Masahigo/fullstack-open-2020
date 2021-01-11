import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state with correct object and calls onSubmit', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, { 
    target: { value: 'Tech blog about public clouds and devops using MS stack.' } 
  })
  fireEvent.change(author, { 
    target: { value: 'Masi Malmi' } 
  })
  fireEvent.change(url, { 
    target: { value: 'https://msdevopsdude.com' } 
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Tech blog about public clouds and devops using MS stack.')
  expect(createBlog.mock.calls[0][0].author).toBe('Masi Malmi')
  expect(createBlog.mock.calls[0][0].url).toBe('https://msdevopsdude.com')
})