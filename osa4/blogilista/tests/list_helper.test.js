const listHelper = require('../utils/list_helper')

const blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    _id: "5a422a851b54a676234d17f7"
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    id: "5a422aa71b54a676234d17f8"
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    id: "5a422b3a1b54a676234d17f9"
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html",
    likes: 10,
    id: "5a422b891b54a676234d17fa"
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    id: "5a422ba71b54a676234d17fb"
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    id: "5a422bc61b54a676234d17fc"
  },
  {
    "title": "Tech blog about public clouds and devops using MS stack.",
    "author": "Masi Malmi",
    "url": "https://msdevopsdude.com",
    "likes": 12,
    "id": "5fc0d7f60a50d0129426619b"
  }
]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  const listWithOneBlog = [
    {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      id: '5a422aa71b54a676234d17f8'
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(listHelper.totalLikes([])).toBe(0)
  })

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(48)
  })
})

describe('favorite blogs', () => {

  const object = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    likes: 12
  };

  test('blog with most likes equals object', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual(object)
  })
})