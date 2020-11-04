import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = ({ countries, showClick, clearClick }) => {
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
            <div key={country.numericCode}>
              {country.name}
              <button onClick={() => showClick(country.numericCode)}>show</button>
            </div>
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
          <p>
            <button onClick={() => clearClick()}>back to list view</button>
          </p>
        </div>
      )}
    </>
  )
 
}

const App = () => {
  const [ countries, setCountries] = useState([])
  const [ countryFilter, setCountryFilter ] = useState('')
  const [ selectedCountry, setSelectedCountry] = useState([])

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

  const handleCountryClick = (id) => {
    //console.log('country with id ' + id + ' needs to be shown')
    const country = countries.filter(country => country.numericCode === id)
    console.log('selected country: ', country)
    setSelectedCountry(country)
  }

  const handleClearClick = () => {
    //setCountryFilter('')
    setSelectedCountry([])
  }

  const countriesToShow = countryFilter.length === 0
    ? countries
    : selectedCountry.length > 0 ? selectedCountry : countries.filter(country => country.name.toLowerCase().includes(countryFilter))

  return (
    <div>find countries&nbsp;
        <input 
          value={countryFilter} 
          onChange={handleFilterChange} 
        />
        <Countries countries={countriesToShow} showClick={handleCountryClick} clearClick={handleClearClick} />
    </div>
  )

}

export default App