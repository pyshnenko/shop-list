import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { blueGrey, green, grey, lightBlue, red, yellow } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';

export default function UsersCard({ user, setUser, api }) { 
    const styleText = { central: { display: 'flex', alignItems: 'center' }, name: { color: lightBlue[800], marginRight: '10px' }, text: {}};
    const textFields = [ 
        {text: 'Логин:', index: 'login'}, 
        {text: 'Имя:', index: 'name'}, 
        {text: 'Фамилия:', index: 'last_name'}, 
        {text: 'Отчество:', index: 'first_name'}, 
        {text: 'Почта:', index: 'email'}, 
        {text: 'telegram:', index: 'telegram'} 
    ]
    console.log(user)

    const handleAddFriend = () => {
        setLoadingIndex(true);
        let res = api.sendPost({login: user.login}, 'askToAdd', `Bearer ${user.token}`);
        res.then((result)=>{
            console.log(result);
            getInfoMessage(result.status===200 ? 'success' : 'error', result.status===200 ? 'Запрос отправлен' : 'Что-то пошло не так', false);
        })
    }

    const handleDelFriend = () => {
        console.log('im here')
    }

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}>
            <Box sx={{ position: 'fixed', zIndex: 10, width: '100vw', height: '100vh', backgroundColor: 'black', opacity: '0.5', boxShadow: '0 0 500px black' }}></Box>
            <Box sx={{
                borderRadius: '50px',
                boxShadow: 3,
                backgroundColor: blueGrey[900],
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                width: '75vw',
                maxWidth: '750px',
                minWidth: '350px',
                margin: '100px 0',
                padding: '20px',
                opacity: '1',
                zIndex: 11
            }}>
                <IconButton sx={{ backgroundColor: red[700], position: 'fixed' }} onClick={(event=>setUser({visible: false}))} ><CloseIcon /></IconButton>
                <Box>
                    <Avatar
                        alt={(user.first_name+' '+user.last_name).toLocaleUpperCase()}
                        src={user.avatar ? user.avatar : ''}
                        sx={{ width: 50, height: 50, backgroundColor: grey[200], color: grey[800], fontSize: 'x-large', zoom: 3 }}
                    >{user.avatar ? '' : (user.name[0]+user.last_name[0]).toLocaleUpperCase()}</Avatar>
                    <Typography variant="h5" gutterBottom>{user.role}</Typography>
                    {user.asked&&<Typography variant="h5" gutterBottom>Ожидаем ответ</Typography>}
                    {user.friend&&<Typography variant="h5" gutterBottom>Ваш друг</Typography>}
                    {user.friend&&<Button onClick={(event)=>handleDelFriend()}>Удалить из друзей</Button>}
                    {(!user.asked)&&(!user.friend)&&<Button onClick={(event)=>handleAddFriend()}>Добавить в друзья</Button>}
                </Box>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    alignItems: 'flex-start',
                    padding: '30px',
                    borderRadius: '30px',
                    boxShadow: '0 0 5px #121212'
                }}>
                    {textFields.map((dat)=>{ return (
                        <Box key={dat.index} sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={styleText.central}>
                                {<Typography sx={styleText.name} variant="h5" gutterBottom>{dat.text}</Typography>}
                                {<Typography sx={styleText.text} variant="h5" gutterBottom>{user[dat.index]}</Typography>}
                                {dat.index==='email'&&user.emailValid&&<CheckIcon sx={{ color: green[500]}} />}
                                {dat.index==='email'&&(!user.emailValid)&&<CloseIcon sx={{ color: red[500]}} />}
                            </Box>
                        </Box>
                    )})}
                </Box>
            </Box>
        </Box>
    )
}