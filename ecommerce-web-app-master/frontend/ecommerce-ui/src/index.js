import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Router } from 'react-router-dom';
import App from './App';
import {CookiesProvider} from 'react-cookie';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(

  <React.StrictMode>
    <CookiesProvider>
    <App />
    </CookiesProvider>
  </React.StrictMode>

);

