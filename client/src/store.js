import { combineReducers, configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/user/user.slice'
// 🔥 FIX: Use the /es/storage path to get the clean localStorage engine directly
import storage from 'redux-persist/es/storage'
import persistReducer from 'redux-persist/es/persistReducer'
import persistStore from 'redux-persist/es/persistStore'

const rootReducer = combineReducers({
  user: userReducer,
})

const persistConfig = {
  key: 'root',
  storage, // Now safely references the correct engine containing .getItem and .setItem
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: {
    root: persistedReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store)