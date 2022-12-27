import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blue, blueGrey, green } from '@mui/material/colors';
import React, { useState } from 'react';

export default function AccountMenu({ setState, data, setData, setUser, api }) {

    const [errState, setErrState] = useState({log: false, pass: false});
    const [label, setLabel] = useState({log: 'Логин', pass: 'Пароль'});

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let eee = {...errState};
        if (data.log==='') eee.log=true;
        if (data.pass==='') eee.pass=true;
        setErrState(eee);
    }

    const loginButton = async (evt) => {
        console.log('aaaaaaa')
        evt.preventDefault();
        let answ = await api.sendPost({ login: data.log, pass: data.pass }, 'login', '');
        if (answ.data.data[0].hasOwnProperty('err')) console.log('error');
        else {
            console.log(answ.data.data[0])
            let rdata=answ.data.data[0]
            setUser({login: rdata.login, token: rdata.token, role: rdata.role, name: rdata.name, last_name: rdata.last_name, first_name: rdata.first_name, email: rdata.email, emailValid: rdata.emailValid})
            setState({login: true, state: 'centralPage'});
            setLabel({log: 'Логин', pass: 'Пароль'});
        }
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
    <Box
        component="form"
        onSubmit={(event)=>handleSubmit(event)}
        sx={{
            borderRadius: '50px',
            boxShadow: 3,
            backgroundColor: blueGrey[900],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            minWidth: '250px',
            margin: '100px',
            padding: '20px'
        }}
        validate
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
            <Button type="submit" sx={{ backgroundColor: blue[800], boxShadow: 3, margin: 1 }} onClick = {(event)=>loginButton(event)} variant="contained">Вход</Button>
            <Button sx={{ backgroundColor: green[400], boxShadow: 3, margin: 1 }} onClick = {(event)=>regButton(event)} variant="contained">Регистрация</Button> 
        </Box>
        <Button sx={{ backgroundColor: blue[100], boxShadow: 3, margin: 1 }} onClick = {(event)=>unLoginMode(event)} variant="contained">Продолжить без регистрации </Button>
    </Box>
  );
}