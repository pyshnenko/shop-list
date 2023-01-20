import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { blueGrey, green, grey, lightBlue, red, yellow } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';

export default function Profile({ user, setRows, setState, data, setData, setUser, api }) { 
    const styleText = { central: { display: 'flex', alignItems: 'center' }, name: { color: lightBlue[800], marginRight: '10px' }, text: {}};
    const textFields = [ 
        {text: 'Логин:', index: 'login'}, 
        {text: 'Имя:', index: 'name'}, 
        {text: 'Фамилия:', index: 'last_name'}, 
        {text: 'Отчество:', index: 'first_name'}, 
        {text: 'Почта:', index: 'email'}, 
        {text: 'telegram:', index: 'telegram'} 
    ]

    const [ edit, setEdit ] = useState({activate: false, name: user.name, first_name: user.first_name, last_name: user.last_name, email: user.email, telegram: user.telegram})

    const handleEditClick = () => {
        console.log('click');
        let buf = {...edit};
        buf.activate=!edit.activate;
        setEdit(buf);
    }

    const handleEditClickCheck = async () => {
        console.log('ready');
        let bufS = {...edit};
        delete bufS.activate;
        let res = await api.sendPost(bufS, 'updUserData', `Bearer ${user.token}`);
        setUser(res.data.data[0]);
        setEdit({activate: false, name: user.name, first_name: user.first_name, last_name: user.last_name, email: user.email, telegram: user.telegram});
        console.log(res);
    }

    const handleValidClick = async () => {        
        setLoadingIndex(true);
        console.log('valid');
        console.log(await api.sendPost({}, 'checkMail', `Bearer ${user.token}`))
        setLoadingIndex(false);
        getInfoMessage('success','Данные отправлены');
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}><Grow in={true}>
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
                padding: '20px'
            }}>
                <Box>
                    <Avatar
                        alt={(user.first_name+' '+user.last_name).toLocaleUpperCase()}
                        src={user.avatar ? user.avatar : ''}
                        sx={{ width: 50, height: 50, backgroundColor: grey[200], color: grey[800], fontSize: 'x-large', zoom: 3 }}
                    >{user.avatar ? '' : (user.name[0]+user.last_name[0]).toLocaleUpperCase()}</Avatar>
                    <Typography variant="h5" gutterBottom>{user.role}</Typography>
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
                                {(!edit.activate||dat.index==='login')&&<Typography sx={styleText.name} variant="h5" gutterBottom>{dat.text}</Typography>}
                                {edit.activate&&dat.index!=='login' ? 
                                    <TextField sx={{ margin: 1 }} label={dat.text} value={edit[dat.index]} onChange={({ target }) => {
                                        const resObj = { ...edit };
                                        resObj[dat.index] = target.value;
                                        setEdit(resObj)}} variant="standard" /> : 
                                    <Typography sx={styleText.text} variant="h5" gutterBottom>{user[dat.index]}</Typography>}
                                {!edit.activate&&dat.index==='email'&&user.emailValid&&<CheckIcon sx={{ color: green[500]}} />}
                                {!edit.activate&&dat.index==='email'&&(!user.emailValid)&&
                                    <IconButton component="label" onClick={handleValidClick}>
                                        <CloseIcon sx={{ color: red[500]}} /> 
                                    </IconButton>}
                            </Box>
                            <Box>
                                {dat.index==='login'&&edit.activate&&<IconButton sx={{color: yellow[800]}} component="label" onClick={handleEditClickCheck}>
                                    <CheckIcon sx={{ color: green[500]}} />
                                </IconButton>}
                                {dat.index==='login'&&<IconButton sx={{color: yellow[800]}} component="label" onClick={handleEditClick}>
                                    {edit.activate ? <CloseIcon sx={{ color: red[500]}} /> : <ModeEditIcon />}
                                </IconButton>}
                            </Box>
                        </Box>
                    )})}
                </Box>
            </Box></Grow>
            <Grow
            in={true}
                {...({ timeout: 1000 })}
            >
            <Box sx={{
                borderRadius: '50px',
                boxShadow: 3,
                backgroundColor: blueGrey[900],
                width: '50%',
                minWidth: '250px',
                padding: '20px'
            }}>
                <Typography variant="h5" gutterBottom>{user.friends.length!==0 ? 'Список друзей' : 'Друзей пока нет'}</Typography>
            </Box></Grow>
        </Box>
    )
}