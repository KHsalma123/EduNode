//main.jsx sont les points d'entrée de l'application React. Ils sont responsables de rendre le composant racine (App) dans le DOM.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
