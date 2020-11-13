//const http = require('http')
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
app.use(express.static('build'))

app.use(cors())

app.use(express.json())

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

app.get('/api/notes/:id', (request, response) => {

    Note.findById(request.params.id).then(note => {
        response.json(note)
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

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = notes.length > 0
        ? Math.max(...notes.map(n => n.id))
        : 0
    return maxId + 1
}

app.post('/api/notes', (request, response) => {
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
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//console.log(`Server running on port ${port}`)