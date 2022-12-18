//import logo from './logo.svg';
import './App.css';
import Menu from './helpers/menu';
import Login from './pages/Login';
import Registation from './pages/Register';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const api = new sendApi ('http://45.89.66.91:8765/api');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  const [ login, setLogin ] = useState({login: false, register: false, guestMode: false});
  const [data, setData] = useState({log: '', pass: ''});

  return (
    <div className="App">
      {login.check ? <header className="App-header">
        <Menu />
      </header> : null}
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <div className="workDiv" style={{ 
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            width: '100vw',
            height: '100vh'
          }}>
          { !login.login ? !login.register ? !login.guestMode ? <Login setLogin = { setLogin } data = {data} setData={setData} /> 
            : null : <Registation data = {data} setData={setData} /> : null }
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
