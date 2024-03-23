import React, { useState, useEffect } from 'react';
import styles from './states.module.css';

const State = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState('');
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [locationMessage, setLocationMessage] = useState('');

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://crio-location-selector.onrender.com/countries');
        if (!response.ok) {
          throw new Error('Failed to fetch countries');
        }
        const data = await response.json();
        setCountries(data.countries || []); // Ensure to handle undefined response
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchStates = async () => {
      if (selectedCountry) {
        try {
          const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`);
          if (!response.ok) {
            throw new Error('Failed to fetch states');
          }
          const data = await response.json();
          setStates(data.states || []); // Ensure to handle undefined response
        } catch (error) {
          console.error('Error fetching states:', error);
        }
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    const fetchCities = async () => {
      if (selectedCountry && selectedState) {
        try {
          const response = await fetch(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`);
          if (!response.ok) {
            throw new Error('Failed to fetch cities');
          }
          const data = await response.json();
          setCities(data.cities || []); // Ensure to handle undefined response
        } catch (error) {
          console.error('Error fetching cities:', error);
        }
      }
    };

    fetchCities();
  }, [selectedCountry, selectedState]);

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setSelectedState('');
    setSelectedCity('');
    setLocationMessage('');
  };

  const handleStateChange = (e) => {
    setSelectedState(e.target.value);
    setSelectedCity('');
    setLocationMessage('');
  };

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setLocationMessage(`You selected ${selectedCity}, ${selectedState}, ${selectedCountry}`);
  };

  return (
    <div className={styles.container}>
      <select className={styles.dropdown} value={selectedCountry} onChange={handleCountryChange}>
        <option value="">Select Country</option>
        {countries.map(country => (
          <option key={country} value={country}>{country}</option>
        ))}
      </select>

      {selectedCountry && (
        <select className={styles.dropdown} value={selectedState} onChange={handleStateChange}>
          <option value="">Select State</option>
          {states.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      )}

      {selectedState && (
        <select className={styles.dropdown} value={selectedCity} onChange={handleCityChange}>
          <option value="">Select City</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      )}

      {locationMessage && <p className={styles.locationMessage}>{locationMessage}</p>}
    </div>
  );
};

export default State;
