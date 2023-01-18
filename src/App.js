//import logo from './logo.svg';
import './helpers/neon.css';
import './App.css';
import test from './helpers/test';
import Menu from './helpers/menu';
import Loading from './helpers/loading';
import SMess from './helpers/serviceMessage';
import Login from './pages/Login';
import UnLogin from './pages/UnLogin';
import Registation from './pages/Register';
import CPage from './pages/CPage';
import Profile from './pages/Profile';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { particlesCursor } from 'threejs-toys';//'https://unpkg.com/threejs-toys@0.0.8/build/threejs-toys.module.cdn.min.js'//'threejs-toys';

const api = new sendApi ('https://spamigor.site/api');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Three() {

  useEffect(()=> {

    console.log('effect')
    const pc = particlesCursor({
      el: document.getElementById('three'),
      gpgpuSize: 512,
      colors: [0x00ff00, 0x0000ff],
      color: 0xff0000,
      coordScale: 0.5,
      noiseIntensity: 0.001,
      noiseTimeCoef: 0.0001,
      pointSize: 5,
      pointDecay: 0.0025,
      sleepRadiusX: 250,
      sleepRadiusY: 250,
      sleepTimeCoefX: 0.001,
      sleepTimeCoefY: 0.002
    })
    
    document.body.addEventListener('click', () => {
      pc.uniforms.uColor.value.set(Math.random() * 0xffffff)
      pc.uniforms.uCoordScale.value = 0.001 + Math.random() * 2
      pc.uniforms.uNoiseIntensity.value = 0.0001 + Math.random() * 0.001
      pc.uniforms.uPointSize.value = 1 + Math.random() * 10
    })
  }, []);

  return (
    <div id="three" />
  )
}

function App() {

  const [ mode, setMode ] = useState({ edit: false, autosave: false })
  const [ state, setState ] = useState({login: false, state: ''});
  const [ data, setData ] = useState({log: '', pass: ''});
  const [ user, setUser ] = useState({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});
  const [ rows, setRows ] = useState([]);
  const [ loadingInd, setLoadingInd ] = useState(false);  
  const [ openNewRowWindow, setOpenNewRowWindow ] = useState({visible: false, text: '', error: false, success: false});

  let opApi=true;
  let numPop = 0;

  console.log('render app');
  test();

  useEffect(()=> {
    async function updateData() {
      console.log('app 73')
      console.log(localStorage.token);
      if ((localStorage.token)&&(!state.login)) {      
        setLoadingInd(true);
        let answ = await api.sendPost({}, 'login', `Bearer ${localStorage.token}`);
        console.log(answ)
        if (answ?.status!==200) {
          localStorage.clear();
        }
        else {
          if (rows.length===0) {
            let timerId = setInterval(async()=>{
              updateList(timerId, answ);
              numPop++;
              console.log(numPop);
              console.log('interval')
              if (numPop>5) {
                clearInterval(timerId);
                setLoadingInd(false);
                let eBuf = {...openNewRowWindow};
                eBuf.text='Данные не получены';
                eBuf.error=true;
                setOpenNewRowWindow(eBuf);
              }
            }, 10000)
          }
        }
      }
      opApi=false;
      setTimeout(()=>opApi=true, 5000)
    }
    async function updateList(timerId, answ) {
      const result = await api.sendPost({name: user.name}, 'lists', `Bearer ${answ.data.data[0].token}`);
      if (typeof(result.data.lists)==='string') setRows([]);
      else setRows(result.data.lists);
      console.log(rows);
      if (rows.length!==0) {
        clearInterval(timerId);
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
    if ((test()===4)&&opApi&&(user.login==='')) updateData();
  }, [])

  useEffect(() => {
    if ((state.login)&&(state.state==='')) setState({login: true, state: 'centralPage'})
  }, [state]);
  
  return (
    <div className="App">
      <Three />
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
          <div style={{ zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {(!state.login)&&(state.state==='')&&<Login openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(!state.login)&&(state.state==='register')&&<Registation setLoadingInd = {setLoadingInd} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.state==='unLogin')&&<UnLogin openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='centralPage')&&<CPage openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} rows = {rows} setRows = {setRows} mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='profile')&&<Profile openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} setLoadingInd = {setLoadingInd} rows = {rows} setRows = {setRows} mode={mode} setMode={setMode} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
          </div>
        </div>
        <div id="neonDiv"><h2 id="neonH2F">Д</h2><h2 id="neonH2">ызыг</h2><h2 id="neonH2l">н</h2></div>
      </ThemeProvider>
    </div>
  );
}

export default App;
