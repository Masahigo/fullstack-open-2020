const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

// try catch magic
// next removed from params also
// https://github.com/davidbanham/express-async-errors

/*
let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2020-01-10T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2020-01-10T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2020-01-10T19:20:14.298Z",
        important: true
    }
]

const app = http.createServer((request, response) => {
response.writeHead(200, { 'Content-Type': 'application/json' })
response.end(JSON.stringify(notes))
})

const port = 3001
app.listen(port)
*/

/*
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})
*/

notesRouter.get('/', async (req, res) => {
  //res.json(notes)
  /*Note.find({}).then(notes => {
    res.json(notes.map(note => note.toJSON()))
  })
    .catch(error => next(error))*/
  
  const notes = await Note
    .find({}).populate('user', { username: 1, name:1 })
  res.json(notes.map(note => note.toJSON()))

  
})

notesRouter.get('/:id', async (request, response) => {

  const note = await Note.findById(request.params.id)
  if (note) {
    response.json(note.toJSON())
  } else {
    response.status(404).end()
  }

  
  /*
  // https://mongoosejs.com/docs/api.html#model_Model.findById
  Note.findById(request.params.id).then(note => {
    //response.json(note)
    if (note) {
      response.json(note.toJSON())
    } else {
      response.status(404).end()
    }
  })
    .catch(error => {
      //logger.info(error)
      //response.status(400).send({ error: 'malformatted id' })
      next(error)
    })
  */

  /*
    const id = Number(request.params.id)
    logger.info(id)
    const note = notes.find(note => {
        //logger.info(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    */

  //logger.info(note)
  //response.json(note)
})

notesRouter.delete('/:id', async (request, response) => {

  await Note.findByIdAndRemove(request.params.id)
  response.status(204).end()
 

  /*const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()*/

  /*
    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  Note.findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
    */
})

/*
const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
*/

notesRouter.post('/', async (request, response) => {
  //logger.info(request.headers)
  //const note = request.body
  //logger.info(note)

  const body = request.body

  const user = await User.findById(body.userId)

  if (!body.content) {
    // HUOM: return
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    date: new Date(),
    user: user._id
  })


  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()
  
  response.json(savedNote.toJSON())

  
  /* VER2

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  })

  note.save()
    .then(savedNote => savedNote.toJSON())
    .then(savedAndFormattedNote => {
      response.json(savedAndFormattedNote)
    })
    .catch(error => next(error)) */


  /* VER 1
    const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
    */
})

notesRouter.put('/:id', async (request, response) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

 
  const updatedNote = await Note.findByIdAndUpdate(request.params.id, note, { new: true })
  response.json(updatedNote.toJSON())


  /* VER 1
  // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
  // by default would return the document as it was before update was applied
  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote.toJSON())
    })
    .catch(error => next(error))*/
})

module.exports = notesRouter