import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import { blueGrey, green, grey, lightBlue, red, yellow } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';

export default function Profile({ user, api }) { 

    const [ sLogin, setSLogin ] = useState('');
    const [ usList, setUsList ] = useState([]);
    const [ visUsList, setVisUsList ] = useState([]);
    
    const trigger2 = useRef(true);
    const styleS ={
        borderRadius: '50px',
        boxShadow: 3,
        backgroundColor: blueGrey[900],
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
        setSLogin(target.value);
        if (target.value.length>2) {
            let buf = [];
            usList.map((key)=>{ if (key.login.toLocaleUpperCase().includes(target.value.toLocaleUpperCase())) buf.push(key)});
            setVisUsList(buf);
        }
        else setVisUsList([]);
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            
            <Box sx={styleS}>
                <Typography variant="h5" gutterBottom>{user.friends.length!==0 ? 'Список друзей' : 'Друзей пока нет'}</Typography>
            </Box>
            
            <Box sx={styleS}>
                <Box>
                    <TextField onChange={({ target }) => handleInputF(target)} sx={{ width: '100%' }} label = 'Введи логин пользователя' />
                    <Button>Поиск</Button>
                </Box>
                {visUsList.length!==0&&<ButtonGroup
                    orientation="vertical"
                    aria-label="vertical contained button group"
                    variant="contained"
                >
                    {visUsList.map((key, index)=>(<Button sx={{ width: '200px' }} key={key.login}>{key.login}</Button>))}
                </ButtonGroup>}
            </Box>
        </Box>
    )
}