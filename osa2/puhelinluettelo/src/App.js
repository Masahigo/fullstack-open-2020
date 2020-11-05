import React, { useState, useEffect } from 'react'
import personsService from './services/persons'

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

const Persons = ({ persons, deleteClick }) => {
  return (
    <>
      {persons.map(person => 
        <div key={person.id}>
          {person.name} {person.number}
          &nbsp;
          <button onClick={() => deleteClick(person)}>delete</button>
        </div>
      )}
    </>
  )
}

const Notification = ({ message }) => {
  if (message.content === null) {
    return null
  }

  return (
    <div className={message.type}>
      {message.content}
    </div>
  )
}

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ nameFilter, setNameFilter ] = useState('')
  const [ notificationMessage, setNotificationMessage] = useState({ content: null, type: null })

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
      .catch(error => {

        const notificationMessageObject = {
          content: `Could not connect to server (db.json)`,
          type: 'error',
        }

        setNotificationMessage(notificationMessageObject)
      })
  }, [])
  
  console.log('render', persons.length, 'persons')

  const addName = (event) => {
    event.preventDefault()

    const updatePerson = persons.find(p => p.name === newName)
    if(updatePerson) {
      console.log('update person: ', updatePerson)
      const message = `${newName} is already added to phonebook, replace the old number with a new one?`
      const result = window.confirm(message)
      if(result) {
        const changedPerson = { ...updatePerson, number: newNumber }
        console.log('changed person: ', changedPerson)
        personsService
          .update(updatePerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.id !== updatePerson.id ? person : returnedPerson))

            const notificationMessageObject = {
              content: `Updated phone number for ${returnedPerson.name}`,
              type: 'success',
            }
  
            setNotificationMessage(notificationMessageObject)
  
            setTimeout(() => {
              setNotificationMessage({ content: null, type: null})
            }, 2000)
          })
          .catch(error => {

            const notificationMessageObject = {
              content: `Information of '${updatePerson.name}' has already been removed from server`,
              type: 'error',
            }

            setNotificationMessage(notificationMessageObject)

            setTimeout(() => {
              setNotificationMessage({ content: null, type: null})
            }, 5000)

            setPersons(persons.filter(p => p.id !== updatePerson.id))
          })
      }
    } else {
      const personObject = {
        name: newName,
        number: newNumber
      }
      
      personsService
        .create(personObject)
        .then(returnedPerson => {
          //console.log('promise fulfilled')
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          
          const notificationMessageObject = {
            content: `Added ${returnedPerson.name}`,
            type: 'success',
          }

          setNotificationMessage(notificationMessageObject)

          setTimeout(() => {
            setNotificationMessage({ content: null, type: null})
          }, 2000)
        })
    
    }
    
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

  const handleDeleteClick = (personToRemove) => {
    let message = `Delete ${personToRemove.name}?`
    const result = window.confirm(message)
    if(result) {
      personsService
        .remove(personToRemove.id)
        .then(returnedStatusCode => {
            console.log("returned status code: ", returnedStatusCode)
            setPersons(persons.filter(person => person.id !== personToRemove.id))
            //setPersons(persons.map(person => person.id !== personToRemove.id ? person : returnedPerson))
            const notificationMessageObject = {
              content: `Deleted ${personToRemove.name}`,
              type: 'success',
            }
  
            setNotificationMessage(notificationMessageObject)
  
            setTimeout(() => {
              setNotificationMessage({ content: null, type: null})
            }, 2000)
        })
    }
  }

  const personsToShow = nameFilter.length === 0
    ? persons
    : persons.filter(person => person.name.toLowerCase().includes(nameFilter))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter value={nameFilter} handleOnChange={handleNameFilterChange} />
      <h2>add a new</h2>
      <PersonForm 
        addName={addName} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} deleteClick={handleDeleteClick} />
    </div>
  )

}

export default App