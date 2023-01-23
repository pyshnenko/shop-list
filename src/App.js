//import logo from './logo.svg';
import './helpers/neon.css';
import './App.css';
import { getInfoMessage, SetInfoMessageStateItems, setLoadingIndex } from './helpers/leftInfoWindow';
import Menu from './helpers/menu';
import Three from './helpers/Tree';
import ThreeMin from './helpers/threeMin';
import Loading from './helpers/loading';
import SMess from './helpers/serviceMessage';
import Login from './pages/Login';
import UnLogin from './pages/UnLogin';
import Registation from './pages/Register';
import CPage from './pages/CPage';
import Profile from './pages/Profile';
import SeechUser from './pages/SeechUser';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useEffect, useRef  } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {isMobile} from 'react-device-detect';

const api = new sendApi ('https://spamigor.site/api');

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
  const [ rows, setRows ] = useState([]);
  const [ loadingInd, setLoadingInd ] = useState(false);  
  const [ openNewRowWindow, setOpenNewRowWindow ] = useState({visible: false, text: '', error: false, success: false});
  const trigger = useRef(true);

  SetInfoMessageStateItems(openNewRowWindow, setOpenNewRowWindow, loadingInd, setLoadingInd);

  useEffect(()=> {
    if (trigger.current) {
      trigger.current = false;
      if ((localStorage.token)&&(!state.login)) {      
        setLoadingIndex(true);
        const answ = api.sendPost({}, 'login', `Bearer ${localStorage.token}`);
        answ.then((res)=>{
          if (res?.status!==200) {
            localStorage.clear();
          }
          else {
            setUser(res.data.data[0]);
            const result = api.sendPost({login: res.data.data[0].login}, 'lists', `Bearer ${res.data.data[0].token}`);
            result.then((lists)=>{
              if (lists?.status!==200) {
                getInfoMessage('error', 'Данные не получены', false)
              }
              else {
                setRows(lists.data.lists);
                setState({login: true, state: 'centralPage'});
                getInfoMessage('success', 'Данные получены', false)
                localStorage.setItem('token', res.data.token);
                if (localStorage.state) setState(JSON.parse(localStorage.state))
              }
            })
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    console.log(state);
    if (state.login) localStorage.setItem('state', JSON.stringify(state))
    if ((state.login)&&(state.state==='')) setState({login: true, state: 'centralPage'})
  }, [state]);
  
  return (
    <div className="App">
      <div id="erer" ></div>
      { !isMobile ? <Three /> : <ThreeMin /> }
      <SMess openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} />
      {loadingInd&&<Loading />}
      {state.login&&<header className="App-header">
        <Menu user={user} setUser={setUser} state={state} setState={setState} setRows={setRows}/>
      </header>}
      <ThemeProvider theme={darkTheme}>
      <CssBaseline />
        <div className="workDiv" style={{ 
            backgroundImage: `url(${background})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            height: '100vh'
          }}>
          <div style={{ zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(!state.login)&&(state.state==='')&&<Login setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(!state.login)&&(state.state==='register')&&<Registation data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.state==='unLogin')&&<UnLogin data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='centralPage')&&<CPage rows = {rows} setRows = {setRows} mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='profile')&&<Profile rows = {rows} setRows = {setRows} mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='addfriend')&&<SeechUser user={user} api={api} /> }
          </div>
        </div>
        <div id="neonDiv"><h2 id="neonH2F">Д</h2><h2 id="neonH2">ызыг</h2><h2 id="neonH2l">н</h2></div>
      </ThemeProvider>
    </div>
  );
}

export default App;
