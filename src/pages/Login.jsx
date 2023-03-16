import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import React, { useState } from 'react';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';

export default function AccountMenu({ user, setRows, setState, data, setData, setUser, api, setSerials, setTrening }) {

    const [errState, setErrState] = useState({log: false, pass: false});
    const [label, setLabel] = useState({log: 'Логин', pass: 'Пароль'});

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let eee = {...errState};
        if (data.log==='') eee.log=true;
        if (data.pass==='') eee.pass=true;
        setErrState(eee);
    }

    const loginButton = (evt) => {
        setLoadingIndex(true);
        evt.preventDefault();
        const answ = api.sendPost({ login: data.log, pass: data.pass }, 'login', '');
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

    const regButton = async (evt) => {
        evt.preventDefault();
        setState({login: false, state: 'register'})
    }

    const unLoginMode = async (evt) => {
        evt.preventDefault();
        setState({login: false, state: 'unLogin'})
    }

  return (    
    <Grow in={true}><Box component={Paper}
        onSubmit={(event)=>handleSubmit(event)}
        sx={{
            borderRadius: '50px',
            boxShadow: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50vw',
            minWidth: '250px',
            marginTop: '100px',
            padding: '20px'
        }}
        autoComplete="off"
        >
        <TextField 
            required 
            sx={{ margin: '10px', boxShadow: 3 }}
            error={errState.log} 
            name='login' 
            label={label.log} 
            value={data.log} 
            variant="outlined" 
            onChange={({ target }) => {
                const resObj = { ...data };
                resObj.log = target.value;
                setData(resObj)
        }} />
        <TextField required sx={{ margin: '10px', boxShadow: 3 }} error={errState.pass} type="password" name='password' label={label.pass} value={data.pass} variant="outlined"
            onChange={({ target }) => {
                const resObj = { ...data };
                resObj.pass = target.value;
                setData(resObj)
        }} />
        <Box>
            <Button type="submit" color="primary" sx={{ boxShadow: 3, margin: 1 }} onClick = {(event)=>loginButton(event)} variant="contained">Вход</Button>
            <Button  color="success" sx={{ boxShadow: 3, margin: 1 }} onClick = {(event)=>regButton(event)} variant="contained">Регистрация</Button> 
        </Box>
        <Button color="primary" sx={{ boxShadow: 3, margin: 1 }} onClick = {(event)=>unLoginMode(event)} variant="outlined">Продолжить без регистрации </Button>
    </Box></Grow>
  );
}