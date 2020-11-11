const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(
    //morgan('tiny')
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

morgan.token('body', function (req, res) { 
    //console.log('morgan token (req.body)', req.body)
    return JSON.stringify(req.body)
})

let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

app.get('/info', (req, res) => {
    let html = `<p>Phonebook has info for ${persons.length} people</p>`
    const date = new Date();
    html += `<p>${date.toDateString()} ${date.toTimeString()}</p>`
    res.send(html);
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    console.log(id)
    const person = persons.find(p => {
        return p.id === id
    })

    if (person) {
        //response.json(person)
        if (!person.number) {
            // HUOM: return
            return response.status(404).json({
                error: 'phone number missing'
            })
        }

        response.send(person.number)

    } else {
        response.status(404).end()
    }

})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(n => n.id))
        : 0

    let min = maxId + 1
    const max = 99999

    let random = Math.floor(Math.random() * (max - min))
    while (random === min) {
        random = Math.floor(Math.random() * (max - min))
    }

    return random
}

app.post('/api/persons', (request, response) => {
    //console.log(request.headers)

    const body = request.body

    if (!body.name) {
        return response.status(400).json({
            error: 'name missing'
        })
    }

    if (!body.number) {
        return response.status(400).json({
            error: 'phone number missing'
        })
    }

    const duplicate = persons.find(p => {
        return p.name === body.name.trim()
    })

    if (duplicate) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
})

/*
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
*/

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

//console.log(`Server running on port ${port}`)