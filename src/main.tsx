import React from 'react'
import ReactDOM from 'react-dom/client'
import "./styles/global.css"

import { MusicPlayer } from './app'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <MusicPlayer/>
  </React.StrictMode>,
)
