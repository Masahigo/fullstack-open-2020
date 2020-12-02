const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Note = require('../models/note')

describe('when there is initially some notes saved', () => {

  beforeEach(async () => {
    await Note.deleteMany({})
    
    /*console.log('cleared')

    helper.initialNotes.forEach(async (note) => {
      let noteObject = new Note(note)
      await noteObject.save()
      console.log('saved')
    })
    console.log('done')*/

    

    /* VER1 - promises are executed in parallel, in no specific order

    const noteObjects = helper.initialNotes
    
      .map(note => new Note(note))
    const promiseArray = noteObjects.map(note => note.save())
    await Promise.all(promiseArray)*/

    /* VER2 - execute promises in order
    for (let note of noteObjects) {
      let noteObject = new Note(note)
      await noteObject.save()
    } */

    // VER3 - skip promises and use ORM's built-in method
    await Note.insertMany(helper.initialNotes)
  })

  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes')

    //expect(response.body).toHaveLength(2)
    expect(response.body).toHaveLength(helper.initialNotes.length)
  })

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes')
    //console.log('response.body from test db: ', response.body)

    const contents = response.body.map(r => r.content)

    //expect(response.body[0].content).toBe('HTML is easy')
    expect(contents).toContain(
      'Browser can execute only Javascript'
    )
  })

  describe('viewing a specific note', () => {

    test('a specific note can be viewed', async () => {
      const notesAtStart = await helper.notesInDb()
  
      const noteToView = notesAtStart[0]
  
      const resultNote = await api
        .get(`/api/notes/${noteToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
  
      const processedNoteToView = JSON.parse(JSON.stringify(noteToView))
  
      expect(resultNote.body).toEqual(processedNoteToView)
    })

  })

  describe('addition of a new note', () => {

    test('a valid note can be added ', async () => {
      const newNote = {
        content: 'async/await simplifies making async calls',
        important: true,
      }

      await api
        .post('/api/notes')
        .send(newNote)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      /*const response = await api.get('/api/notes')

      const contents = response.body.map(r => r.content)

      expect(response.body).toHaveLength(initialNotes.length + 1)*/

      const notesAtEnd = await helper.notesInDb()
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length + 1)

      const contents = notesAtEnd.map(n => n.content)

      expect(contents).toContain(
        'async/await simplifies making async calls'
      )
    })

    test('note without content is not added', async () => {
      const newNote = {
        important: true
      }
  
      await api
        .post('/api/notes')
        .send(newNote)
        .expect(400)
  
      /*const response = await api.get('/api/notes')
  
      expect(response.body).toHaveLength(initialNotes.length)*/
      const notesAtEnd = await helper.notesInDb()
  
      expect(notesAtEnd).toHaveLength(helper.initialNotes.length)
    })

  })
  
  describe('deletion of a note', () => {

    test('a note can be deleted', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToDelete = notesAtStart[0]

      await api
        .delete(`/api/notes/${noteToDelete.id}`)
        .expect(204)

      const notesAtEnd = await helper.notesInDb()

      expect(notesAtEnd).toHaveLength(
        helper.initialNotes.length - 1
      )

      const contents = notesAtEnd.map(r => r.content)

      expect(contents).not.toContain(noteToDelete.content)
    })

  })

  describe('updating a note', () => {

    test('a specific note can be updated', async () => {
      const notesAtStart = await helper.notesInDb()
      const noteToUpdate = notesAtStart[0]

      noteToUpdate.content ='HTML is easy - CSS is not.'

      const resultNote = await api
        .put(`/api/notes/${noteToUpdate.id}`)
        .send(noteToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      //console.log('resultNote.body: ', resultNote.body)

      const processedNoteToUpdate = JSON.parse(JSON.stringify(noteToUpdate))
      expect(resultNote.body).toEqual(processedNoteToUpdate)
    })
    
  })

})

afterAll(() => {
  mongoose.connection.close()
})