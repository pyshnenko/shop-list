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
import SeechUser from './pages/SeechUser';
import background from './back3.jpeg';
import sendApi from './mech/api';
import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {isMobile} from 'react-device-detect';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch, useParams, useSearchParams, useLocation} from 'react-router-dom';

const api = new sendApi ('https://spamigor.site/api');

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App(props) {

  const [ state, setState ] = useState({login: false, state: ''});
  const [ data, setData ] = useState({log: '', pass: ''});
  const [ user, setUser ] = useState({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});
  const [ rows, setRows ] = useState([]);
  const [ loadingInd, setLoadingInd ] = useState(false);  
  const [ openNewRowWindow, setOpenNewRowWindow ] = useState({visible: false, text: '', error: false, success: false});
  const [ unRows, setUnRows ] = useState({});

  const trigger = useRef(true);
  const trigger2 = useRef(true);

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
            })
          }
        })
      }
    }
  }, [])

  useEffect(() => {
    if ((state.login)&&(user?.settings?.pageSave)) localStorage.setItem('listState', JSON.stringify(state))
    if ((state.login)&&(state.state==='')) setState({login: true, state: 'centralPage'})
  }, [state]);
  
  return (
    <Router><div className="App">
      <div id="erer" ></div>
      { !user?.settings?.mobileAnimation&&isMobile ? null : ((user?.settings?.animation===1)||(!state.login) ? <Three /> : user?.settings?.animation===2 ? <ThreeMin /> : null) }
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
            {(state.login)&&(state.state==='centralPage')&&<CPage rows = {rows} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='profile')&&<Profile rows = {rows} setRows = {setRows} data = {data} setData={setData} state={state} setState={setState} user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='addfriend')&&<SeechUser user={user} setUser={setUser} api={api} /> }
            {(state.login)&&(state.state==='settings')&&<Settings user={user} setUser={setUser} api={api} /> }
            {(!state.login)&&(state.state==='unLoginAdm')&&<UnLoginAdm api={api} state={state} setState={setState} unRows={unRows} setUnRows={setUnRows} />}
          </div>
        </div>
        {(user?.settings?.neonLogo||(!state.login))&&(!isMobile||user?.settings?.mobileLogo||(!state.login))&&<div id="neonDiv"><h2 id="neonH2F">Д</h2><h2 id="neonH2">ызыг</h2><h2 id="neonH2l">н</h2></div>}
      </ThemeProvider>
      </div></Router>
  );
}

export default App;
