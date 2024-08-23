import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {SearchProvider} from "./components/context/SearchContext";

createRoot(document.getElementById('root')).render(

  // <StrictMode>
  
    <SearchProvider>
      <App />
    </SearchProvider>
  // </StrictMode>,
)
