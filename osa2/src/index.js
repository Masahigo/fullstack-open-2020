import React from 'react'
import ReactDOM from 'react-dom'

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
  console.log(props)
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
  //console.log(props)
  return (
    <>
      <p>Number of exercises {props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises}</p>
    </>
  )
}

const Course = ({ course }) => {
  return (
    <>
      <Header title={course.name} />
      <Content parts={course.parts} />
    </>
  )
}

const App = () => {
  const course = {
    name: 'Half Stack application development',
    id: 1,
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return (
    <div>
      <Course course={course} />
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
