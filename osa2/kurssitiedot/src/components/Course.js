import React from 'react'

const Header = (props) => {
    //console.log(props)
    return (
      <>
        <h1>{props.title}</h1>
      </>
    )
  }
  
  const Part = (props) => {
    //console.log(props)
    return (
      <p>
        {props.name} {props.number_of_exercises}
      </p>
    )
  }
  
  const Content = (props) => {
    //console.log(props)
    const { parts } = props
    return (
      <>
        {parts.map(part =>
          <Part key={part.id} name={part.name} number_of_exercises={part.exercises} />
        )}
      </>
    )
  }
  
  const Total = (props) => {
    console.log(props)
    const { parts } = props
    const totalAmount = parts.reduce((sum, part) => {
      return sum + part.exercises
    }, 0)
    
    return (
      <>
        <p><b>Total of {totalAmount} exercises</b></p>
      </>
    )
  }
  
  const Course = ({ course }) => {
    return (
      <>
        <Header title={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </>
    )
  }

  export default Course