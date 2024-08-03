import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import userReducer from './redux/reducer/UserReducer';
import contactReducer from './redux/reducer/contactReducer';
import { productReducer, subProductListReducer } from './redux/reducer/productReducer';
import locationReducer from './redux/reducer/locationReducer';
import cartReducer  from './redux/reducer/cartReducer'
import reviewReducer from './redux/reducer/reviewReducer';
import wishlistReducer from './redux/reducer/wishlistReducer';
import cartItemReducer from './redux/reducer/cartItemsReducer';

// Root reducer combining all reducers
const rootReducer = combineReducers({
  location:locationReducer,
  auth: userReducer,
  cart: cartReducer,
  contact: contactReducer,
 wishlist:wishlistReducer,
  product: productReducer,
 reviews:reviewReducer,
  subProducts: subProductListReducer,
  cartItemReducer,

  // Add other reducers as needed
});

// Redux Persist configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'] // List of reducers to persist
  // blacklist: [], // Optionally, blacklist reducers (overrides whitelist)
};

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Define initial state for relevant slices of the store
const initialState = {};

// Define middleware (include thunk for async actions)
const middleware = [thunk];

// Create Redux store with persistedReducer, initialState, and middleware
const store = createStore(
  persistedReducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

// Persist the store to localStorage
export const persistor = persistStore(store);

export default store;
