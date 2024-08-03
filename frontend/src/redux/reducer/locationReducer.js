const initialState = {
    selectedCountry: '',
    selectedState: '',
  };
  
  const locationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_SELECTED_COUNTRY':
        return {
          ...state,
          selectedCountry: action.payload,
        };
      case 'SET_SELECTED_STATE':
        return {
          ...state,
          selectedState: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default locationReducer;
  