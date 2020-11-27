const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const dbname = 'note-app'

////mongodb+srv://higofullstack2020:<password>@cluster0.uaba3.mongodb.net/<dbname>?retryWrites=true&w=majority
const url = `mongodb+srv://higofullstack2020:${password}@cluster0.uaba3.mongodb.net/${dbname}?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const noteSchema = new mongoose.Schema({
  content: String,
  date: Date,
  important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

/*
const note = new Note({
    content: 'HTML is Easy',
    date: new Date(),
    important: true,
})

const note2 = new Note({
    content: 'Mongoose makes use of mongo easy',
    date: new Date(),
    important: false,
})

const note3 = new Note({
    content: 'Callback-functions suck',
    date: new Date(),
    important: true,
})

note.save().then(result => {
    console.log('note 1 saved!')

    note2.save().then(result => {
        console.log('note 2 saved!')

        note3.save().then(result => {
            console.log('note 3 saved!')
            mongoose.connection.close()
        })
    })
})
*/

Note.find({}).then(result => {
  result.forEach(note => {
    console.log('All notes', note)
  })

  //mongoose.connection.close()
})

Note.find({ important: true }).then(result => {
  result.forEach(note => {
    console.log('filtered notes', note)
  })

  mongoose.connection.close()
})