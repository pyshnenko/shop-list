import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import UsersCard from '../helpers/usersCard';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';

export default function Profile({ user, setUser, api }) { 

    const [ usList, setUsList ] = useState([]);
    const [ visUsList, setVisUsList ] = useState([]);
    const [ userS, setUserS ] = useState({visible: false});
    
    const trigger2 = useRef(true);
    const styleS ={
        borderRadius: '50px',
        boxShadow: 3,
        width: '50%',
        minWidth: '350px',
        padding: '20px',
        marginTop: '100px'
    }

    useEffect(()=>{
        if (trigger2.current) {
            trigger2.current = false;
            let prom = api.sendPost({}, 'usersList', `Bearer ${user.token}`);
            prom.then((res)=>setUsList(res.data.list))
        }
    }, [] )

    const handleInputF = (target) => {
        if (target.value.length>2) {
            let buf = [];
            usList.map((key)=>{ if ((key.login.toLocaleUpperCase().includes(target.value.toLocaleUpperCase()))&&(key.login!==user.login)) buf.push(key); return true});
            setVisUsList(buf);
        }
        else setVisUsList([]);
    }

    const handleSeechClick = (userSB) => {
        let send = api.sendPost({login: userSB.login}, 'askUserData', `Bearer ${user.token}`);
        send.then((res)=>{
            setUserS({...res.data.answer, visible: true, friend: user.friends.includes(userSB.login), token: user.token});
        })
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            
            <Grow in={true} appear={user.settings.grow}><Box component={Paper} sx={styleS}>
                <Typography variant="h5" gutterBottom>{user.friends.length!==0 ? 'Список друзей' : 'Друзей пока нет'}</Typography>
            </Box></Grow>
            
            <Grow in={true} {...({ timeout: 1000 })} appear={user.settings.grow}><Box component={Paper} sx={styleS}>
                <Box>
                    <TextField onChange={({ target }) => handleInputF(target)} sx={{ width: '100%', marginBottom: '20px' }} label = 'Введи логин пользователя' />
                </Box>
                {visUsList.length!==0&&<ButtonGroup
                    orientation="vertical"
                    aria-label="vertical contained button group"
                    variant="contained"
                >
                    {visUsList.map((key, index)=>(
                            <Grow in={true} {...({ timeout: 1000*index })} key={key.login} appear={user.settings.grow}><Button sx={{ width: '200px' }} key={key.login} onClick={(event)=>handleSeechClick(key)}>{key.login}</Button></Grow>))}
                </ButtonGroup>}
            </Box></Grow>
            
            {userS.visible&&<Grow in={true} {...({ timeout: 1000 })} appear={user.settings.grow}>
                <Box sx={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UsersCard userS={userS} setUserS={setUserS} api={api} user={user} setUser={setUser} />
                </Box>
            </Grow>}
        </Box>
    )
}