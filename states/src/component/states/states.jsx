// State.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './states.module.css';

const State = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    // Fetch all countries
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://crio-location-selector.onrender.com/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedState('');
    setSelectedCity('');
    setLocationMessage('');
    if (country) {
      // Fetch states of the selected country
      try {
        const response = await axios.get(`https://crio-location-selector.onrender.com/country=${country}/states`);
        setStates(response.data);
      } catch (error) {
        console.error('Error fetching states:', error);
      }
    }
  };

  const handleStateChange = async (e) => {
    const state = e.target.value;
    setSelectedState(state);
    setSelectedCity('');
    setLocationMessage('');
    if (selectedCountry && state) {
      // Fetch cities of the selected state in the selected country
      try {
        const response = await axios.get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${state}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    setLocationMessage(`You selected ${city}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div className={styles.container}>
      <select value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>
      <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry}>
        <option value="">Select State</option>
        {states.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      <select value={selectedCity} onChange={handleCityChange} disabled={!selectedState}>
        <option value="">Select City</option>
        {cities.map(city => (
          <option key={city} value={city}>{city}</option>
        ))}
      </select>
      {locationMessage && <p>{locationMessage}</p>}
    </div>
  );
};

export default State;
