//import logo from './logo.svg';
import './App.css';
import Menu from './helpers/menu';
import Login from './pages/Login';
import UnLogin from './pages/UnLogin';
import Registation from './pages/Register';
import CPage from './pages/CPage';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const api = new sendApi ('http://45.89.66.91:8765/api');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {

  const [ mode, setMode ] = useState({ edit: false, autosave: false })
  const [ state, setState ] = useState({login: false, state: ''});
  const [ data, setData ] = useState({log: '', pass: ''});
  const [ user, setUser ] = useState({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});

  return (
    <div className="App">
      {state.login&&<header className="App-header">
        <Menu mode={mode} setMode={setMode} user={user} setUser={setUser} state={state} setState={setState}/>
      </header>}
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
          {(!state.login)&&(state.state==='')&&<Login data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(!state.login)&&(state.state==='register')&&<Registation data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(!state.login)&&(state.state==='unLogin')&&<UnLogin data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(state.login)&&(state.state==='centralPage')&&<CPage mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
