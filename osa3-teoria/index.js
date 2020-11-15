//const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static('build'))
app.use(cors())
app.use(express.json())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}

app.use(requestLogger)

const Note = require('./models/note')

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

app.get('/api/notes', (req, res) => {
    //res.json(notes)
    Note.find({}).then(notes => {
        res.json(notes)
    })
})

app.get('/api/notes/:id', (request, response, next) => {

    // https://mongoosejs.com/docs/api.html#model_Model.findById
    Note.findById(request.params.id).then(note => {
        //response.json(note)
        if (note) {
            response.json(note)
        } else {
            response.status(404).end()
        }
    })
        .catch(error => {
            //console.log(error)
            //response.status(400).send({ error: 'malformatted id' })
            next(error)
        })

    /*
    const id = Number(request.params.id)
    console.log(id)
    const note = notes.find(note => {
        //console.log(note.id, typeof note.id, id, typeof id, note.id === id)
        return note.id === id
    })

    if (note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    */

    //console.log(note)
    //response.json(note)
})

app.delete('/api/notes/:id', (request, response, next) => {
    /*const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()*/

    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
    Note.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))

})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response, next) => {
    //console.log(request.headers)
    //const note = request.body
    //console.log(note)

    const body = request.body

    if (!body.content) {
        // HUOM: return
        return response.status(400).json({
            error: 'content missing'
        })
    }

    /*const note = {
        content: body.content,
        important: body.important || false,
        date: new Date(),
        id: generateId(),
    }

    notes = notes.concat(note)

    response.json(note)
    */

    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note.save().then(savedNote => {
        response.json(savedNote)
    })
    .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
    const body = request.body

    const note = {
        content: body.content,
        important: body.important,
    }

    // https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
    // by default would return the document as it was before update was applied
    Note.findByIdAndUpdate(request.params.id, note, { new: true })
        .then(updatedNote => {
            response.json(updatedNote)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

// olemattomien osoitteiden käsittely
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// virheellisten pyyntöjen käsittely
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//console.log(`Server running on port ${port}`)