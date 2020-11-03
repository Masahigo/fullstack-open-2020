import React, { useState } from 'react'

const Person = ({ person }) => {
  return (
  <p>{person.name} {person.number}</p>
  )
}

const Filter = ({ value, handleOnChange }) => {
  return (
    <div>filter shown with 
          <input 
            value={value} 
            onChange={handleOnChange} 
          />
      </div>
  )
}

const PersonForm = (props) => {
  console.log(props)
  return (
    <form onSubmit={props.addName}>
        <div>
          name: 
          <input 
            value={props.newName} 
            onChange={props.handleNameChange} 
          />
        </div>
        <div>number: 
          <input 
            value={props.newNumber} 
            onChange={props.handleNumberChange} 
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
  )
}

const Persons = ({ persons }) => {
  return (
    <>
      {persons.map(person => 
        <Person key={person.name} person={person} />
      )}
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')

  const addName = (event) => {
    event.preventDefault()

    if(persons.filter(person => person.name === newName).length > 0) {
      console.log('name found already: ', newName)
      const alertMessage = `${newName} is already added to phonebook`
      alert(alertMessage)
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
    
      setPersons(persons.concat(personObject))
    }

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    //console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleNameFilterChange = (event) => {
    setNameFilter(event.target.value)
  }

  const personsToShow = nameFilter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={nameFilter} handleOnChange={handleNameFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        addName={addName} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  )

}

export default App