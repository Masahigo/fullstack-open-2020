import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries }) => {
  if(countries.length > 10) {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }

  if(countries.length > 1) {
    return (
      <>
        {countries.map(country =>
            <div key={country.numericCode}>{country.name}</div>
        )}
      </>
    )
  }

  const imgStyle = {
    border: '2px solid #555',
    margin: 0,
    padding: 0,
    width: 'auto',
    height: '110px',
    display: 'block',
  };

  return (
    <>
      {countries.map(country =>
        <div key={country.numericCode}>
          <h2>{country.name}</h2>
          <p>
            capital {country.capital}<br/>
            population {country.population}
          </p>
          <h3>languages</h3>
          <ul>
            {country.languages.map(language => 
              <li key={language.iso639_1}>
                {language.name}
              </li>  
            )}
          </ul>
          <img src={country.flag} alt="flag" style={imgStyle} />
        </div>
      )}
    </>
  )
 
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ countryFilter, setCountryFilter ] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        console.log('promise fulfilled')
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  const handleFilterChange = (event) => {
    //console.log(event.target.value)
    setCountryFilter(event.target.value)
  }

  const countriesToShow = countryFilter.length === 0
    ? countries
    : countries.filter(country => country.name.toLowerCase().includes(countryFilter))

  return (
    <div>find countries&nbsp;
        <input 
          value={countryFilter} 
          onChange={handleFilterChange} 
        />
        <Countries countries={countriesToShow} />
    </div>
  )

}

export default App