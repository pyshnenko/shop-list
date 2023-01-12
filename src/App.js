//import logo from './logo.svg';
import './App.css';
import Menu from './helpers/menu';
import Loading from './helpers/loading';
import SMess from './helpers/serviceMessage';
import Login from './pages/Login';
import UnLogin from './pages/UnLogin';
import Registation from './pages/Register';
import CPage from './pages/CPage';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

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

  useEffect(()=> {
    async function updateData() {
      console.log(localStorage.token);
      if ((localStorage.token)&&(!state.login)) {      
        setLoadingInd(true);
        let answ = await api.sendPost({}, 'login', `Bearer ${localStorage.token}`);
        console.log(answ)
        if (answ?.status!==200) {
          localStorage.clear();
        }
        else {
            const result = await api.sendPost({name: user.name}, 'lists', `Bearer ${answ.data.data[0].token}`);
            if (typeof(result.data.lists)==='string') setRows([]);
            else setRows(result.data.lists);
            let rdata=answ.data.data[0]
            setUser(rdata)
            setState({login: true, state: 'centralPage'});
            setLoadingInd(false);
            let eBuf = {...openNewRowWindow};
            eBuf.text='Данные получены';
            eBuf.success=true;
            setOpenNewRowWindow(eBuf);
            localStorage.setItem('token', answ.data.data[0].token)
        }
      }
    }
    updateData();
  }, [])

  useEffect(() => {
    if ((state.login)&&(state.state==='')) setState({login: true, state: 'centralPage'})
  }, [state]);
  
  return (
    <div className="App">
      <SMess openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} />
      {loadingInd&&<Loading />}
      {state.login&&<header className="App-header">
        <Menu setLoadingInd={setLoadingInd} mode={mode} setMode={setMode} user={user} setUser={setUser} state={state} setState={setState}/>
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
          {(!state.login)&&(state.state==='')&&<Login openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(!state.login)&&(state.state==='register')&&<Registation setLoadingInd = {setLoadingInd} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(state.state==='unLogin')&&<UnLogin openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          {(state.login)&&(state.state==='centralPage')&&<CPage openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} rows = {rows} setRows = {setRows} mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
