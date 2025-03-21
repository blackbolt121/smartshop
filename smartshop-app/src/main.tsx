import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom";
import store from './store/store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider> 
      </BrowserRouter>

  </StrictMode>,
)
