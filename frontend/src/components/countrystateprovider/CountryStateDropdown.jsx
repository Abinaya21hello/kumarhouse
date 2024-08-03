import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Icon,
} from "@material-ui/core";
import { Country, State } from "country-state-city";
import RoomIcon from "@material-ui/icons/Room"; // Material-UI location icon
import {
  setSelectedCountry,
  setSelectedState,
} from "../../redux/actions/locationActions"; // Adjust path as per your project structure

const CountryStateDropdown = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const selectedCountry = useSelector(
    (state) => state.location.selectedCountry
  ); // Redux state for selected country
  const selectedState = useSelector((state) => state.location.selectedState); // Redux state for selected state
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch countries from the data set
    const countryData = Country.getAllCountries();
    setCountries(countryData);
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      // Fetch states based on selected country code
      const countryStates = State.getStatesOfCountry(selectedCountry);
      setStates(countryStates);
    }
  }, [selectedCountry]);

  const handleCountryChange = (event) => {
    const countryCode = event.target.value;
    dispatch(setSelectedCountry(countryCode));
    dispatch(setSelectedState("")); // Reset state when country changes
  };

  const handleStateChange = (event) => {
    dispatch(setSelectedState(event.target.value));
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={1}>
        <Icon color="#3BB77E" style={{ marginTop: 30 }}>
          <RoomIcon />
        </Icon>
      </Grid>
      <Grid item xs={5}>
        <FormControl fullWidth variant="">
          <InputLabel id="country-label">Country</InputLabel>
          <Select
            labelId="country-label"
            id="country-select"
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.isoCode}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <FormControl fullWidth variant="">
          <InputLabel id="state-label">State</InputLabel>
          <Select
            labelId="state-label"
            id="state-select"
            value={selectedState}
            onChange={handleStateChange}
            disabled={!selectedCountry}
          >
            {states.map((state, index) => (
              <MenuItem key={index} value={state.isoCode}>
                {state.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={1} />
      <Grid item xs={12}>
        <Typography variant="body1">
          {/* Selected Country: {selectedCountry}, Selected State: {selectedState} */}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default CountryStateDropdown;
