import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blue, blueGrey, green } from '@mui/material/colors';
import React, { useState } from 'react';

export default function AccountMenu({ openNewRowWindow, setOpenNewRowWindow, setLoadingInd, user, setRows, setState, data, setData, setUser, api }) {

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
        setLoadingInd(true);
        evt.preventDefault();
        let answ = await api.sendPost({ login: data.log, pass: data.pass }, 'login', '');
        console.log(answ)
        if (answ?.status!==200) {
            console.log('error');
            setLoadingInd(false);
            let eBuf = {...openNewRowWindow};
            eBuf.text='Неверные данные';
            eBuf.error=true;
            setOpenNewRowWindow(eBuf)
        }
        else {
            const result = await api.sendPost({name: user.name}, 'lists', `Bearer ${answ.data.data[0].token}`);
            if (typeof(result.data.lists)==='string') setRows([]);
            else setRows(result.data.lists);
            let rdata=answ.data.data[0]
            setUser(rdata)
            setState({login: true, state: 'centralPage'});
            setLabel({log: 'Логин', pass: 'Пароль'});
            setLoadingInd(false);
            let eBuf = {...openNewRowWindow};
            eBuf.text='Данные получены';
            eBuf.success=true;
            setOpenNewRowWindow(eBuf);
            localStorage.setItem('token', answ.data.data[0].token)
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
            <Button type="submit" sx={{ backgroundColor: blue[800], boxShadow: 3, margin: 1 }} onClick = {(event)=>loginButton(event)} variant="contained">Вход</Button>
            <Button sx={{ backgroundColor: green[400], boxShadow: 3, margin: 1 }} onClick = {(event)=>regButton(event)} variant="contained">Регистрация</Button> 
        </Box>
        <Button sx={{ backgroundColor: blue[100], boxShadow: 3, margin: 1 }} onClick = {(event)=>unLoginMode(event)} variant="contained">Продолжить без регистрации </Button>
    </Box>
  );
}