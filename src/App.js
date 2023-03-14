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
import UnLoginAdm from './pages/UnloginAdm';
import Registation from './pages/Register';
import CPage from './pages/CPage';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Serials from './pages/Serials';
import SeechUser from './pages/SeechUser';
import Trenings from './pages/Trenings';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useEffect, useRef } from 'react';
import {useTelegram} from "./src/hooks/useTelegram";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {isMobile} from 'react-device-detect';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import Form from './pages/botPages/form';
import Trening from './pages/botPages/trening';

const api = new sendApi ('https://spamigor.site/api');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App(props)  {
  const {onToggleButton, tg} = useTelegram();  
  const [ form, setForm ] = useState(false);  
  const [ tren, setTren ] = useState(false);
  const trigger3 = useRef(true);

  useEffect(() => {
      tg.ready();
  }, []);  

  useEffect(() => {
    if (trigger3.current) {
      trigger3.current = false;
      const params = new URLSearchParams(window.location.search);
      let form2 = params.get('form');
      let tren2 = params.get('trening');
      if (form2) {
        setForm(true);
      }
      if (tren2) {
        setTren(true);
      }
    }
  }, []);

  console.log(window.location.pathname);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={form ? <Form /> : tren ? <Trening api={api} /> : <Appaa />}/>
          <Route path="/build?" element={form ? <Form /> : tren ? <Trening api={api} /> : <Appaa />}/>
          <Route path="/form" element={<Form />}/>
          <Route path="/build/form?" element={<Form />}/>
          <Route path="/trening" element={<Trening api={api} />}/>
          <Route path="/build/trening?" element={<Trening api={api} />}/>
        </Routes>
      </Router>
    </div>
  );
}

function Appaa(props) {

  const [ state, setState ] = useState({login: false, state: ''});
  const [ data, setData ] = useState({log: '', pass: ''});
  const [ user, setUser ] = useState({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});
  const [ rows, setRows ] = useState([]);
  const [ loadingInd, setLoadingInd ] = useState(false);  
  const [ openNewRowWindow, setOpenNewRowWindow ] = useState({visible: false, text: '', error: false, success: false});
  const [ unRows, setUnRows ] = useState({});
  const [ serials, setSerials ] = useState({});
  const [ trening, setTrening ] = useState({});
  const [ start, setStart ] = useState(false);

  const trigger = useRef(true);
  const trigger2 = useRef(true);
  const treningTrig = useRef(true);

  const {onToggleButton, tg} = useTelegram();

    useEffect(() => {
        tg.ready();
    }, [])

  SetInfoMessageStateItems(openNewRowWindow, setOpenNewRowWindow, loadingInd, setLoadingInd);

  useEffect(() => {
    if (trigger2.current) {
      trigger2.current = false;
      document.title = 'Список покупок';
      document.documentElement.setAttribute('lang', 'ru');
      const params = new URLSearchParams(window.location.search);
      let done = params.get('done');
      console.log(done)
      let addr = params.get('list');
      if (addr) {
        trigger.current = false;
        let answ; 
        api.sendPost({hash: addr}, done==='stList'?'unLoginAdm':'unSumLoginAdm', '')
          .then((res)=>{
            answ=res;
            if (answ.status!==200) {
              setUnRows({data: {}, error: true, textError: 'Некорректная ссылка'})
            }
            else setUnRows({data: answ.data.data[0], error: false, textError: ''})
            setState({login: false, state: 'unLoginAdm'});     
          })
      }
    }
  }, []);

  useEffect(()=> {
    if (trigger.current) {
      trigger.current = false;
      if ((localStorage.listToken)&&(!state.login)) {      
        setLoadingIndex(true);
        const answ = api.sendPost({}, 'login', `Bearer ${localStorage.listToken}`);
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
                if (res.data.data[0]?.settings?.localSave) localStorage.setItem('listToken', res.data.token);
                if (localStorage.listState) setState(JSON.parse(localStorage.listState))
              }
              setStart(true);              
            })
          }
        })
      }
      else setStart(true);
    }
  }, [])

  useEffect(() => {
    if ((state.login)&&(user?.settings?.pageSave)) localStorage.setItem('listState', JSON.stringify(state))
    if ((state.login)&&(state.state==='')) setState({login: true, state: 'centralPage'});
    treningTrig.current = true;
  }, [state]);
  
  return (
    <div className="Appaa">
          <div id="erer" ></div>
          { !user?.settings?.mobileAnimation&&isMobile ? null : ((user?.settings?.animation===1)||(!state.login) ? <Three /> : user?.settings?.animation===2 ? <ThreeMin /> : null) }
          <SMess openNewRowWindow={openNewRowWindow} setOpenNewRowWindow={setOpenNewRowWindow} />
          {loadingInd&&<Loading />}
          {state.login&&<header className="App-header">
            <Menu user={user} setUser={setUser} state={state} setState={setState} setRows={setRows} setSerials={setSerials} setTrening={setTrening} />
          </header>}
          <ThemeProvider theme={darkTheme}>
          <CssBaseline />
            <div className="workDiv" style={{ 
                backgroundImage: user?.settings?.animation===3?`url(${background})`:'none',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                height: '100em'
              }}>
              {start&&<div style={{ zIndex: 7, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {(!state.login)&&(state.state==='')&&<Login setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} setSerials={setSerials} setTrening={setTrening} /> }
                {(!state.login)&&(state.state==='register')&&<Registation data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} setSerials={setSerials} setRows = {setRows} /> }
                {(state.state==='unLogin')&&<UnLogin data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
                {(state.login)&&(state.state==='centralPage')&&<CPage rows = {rows} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
                {(state.login)&&(state.state==='profile')&&<Profile rows = {rows} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
                {(state.login)&&(state.state==='addfriend')&&<SeechUser user={user} setUser={setUser} api={api} /> }
                {(state.login)&&(state.state==='settings')&&<Settings user={user} setUser={setUser} api={api} /> }
                {(state.login)&&(state.state==='serials')&&<Serials user={user} setUser={setUser} api={api} serials={serials} setSerials={setSerials} /> }
                {(state.login)&&(state.state==='trening')&&<Trenings treningTrig={treningTrig} user={user} setUser={setUser} api={api} trening={trening} setTrening={setTrening} /> }
                {(!state.login)&&(state.state==='unLoginAdm')&&<UnLoginAdm api={api} state={state} setState={setState} unRows={unRows} setUnRows={setUnRows} />}
              </div>}
            </div>
            {(user?.settings?.neonLogo||(!state.login))&&(!isMobile||user?.settings?.mobileLogo||(!state.login))&&<div id="neonDiv"><h2 id="neonH2F">Д</h2><h2 id="neonH2">ызыг</h2><h2 id="neonH2l">н</h2></div>}
          </ThemeProvider>        
    </div>
  );
}

export default App;