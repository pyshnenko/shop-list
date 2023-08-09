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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {isMobile} from 'react-device-detect';
import Paper from '@mui/material/Paper';

export default function Profile({ user, setRows, setState, data, setData, setUser, api, darkMode }) { 
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

    const handleValidClick = async (evt, index) => {        
        setLoadingIndex(true);
        console.log('valid');
        if (index==='email') {
            console.log(await api.sendPost({}, 'checkMail', `Bearer ${user.token}`));
            getInfoMessage('success','Данные отправлены', false);
        }
        else if (index==='telegram') {
            let res = await api.sendPost({}, 'tgCheck', `Bearer ${user.token}`);
            if (res.status===200) {
                let buf = {...user};
                buf.telegramValid=true;
                setUser(buf);
                getInfoMessage('success','Подтверждено', false);
            }
            else 
                getInfoMessage('error','Повтори позже', false);
        }
        else getInfoMessage('error','Неопознанный идентификатор', false);
    }

    const handleNoButton = (name) => {
        setLoadingIndex(true);
        let send = api.sendPost({friend: name, login: user.login}, 'friendshipNo', `Bearer ${user.token}`);
        let buf = {...user};
        send.then((res)=>{console.log(res); Object.assign(buf, res.data[0])});
        console.log(buf);
        setUser(buf);
        getInfoMessage('success','Данные отправлены', false);
    }

    const handleYesButton = (name) => {
        setLoadingIndex(true);
        let send = api.sendPost({friend: name, login: user.login}, 'friendshipStart', `Bearer ${user.token}`);
        let buf = {...user};
        send.then((res)=>{console.log(res); Object.assign(buf, res.data[0])});
        console.log(buf);  
        setUser(buf);      
        getInfoMessage('success','Данные отправлены', false);
    }

    const handleDelButton = (name) => {
        setLoadingIndex(true);
        let send = api.sendPost({friend: name, login: user.login}, 'friendshipEnd', `Bearer ${user.token}`);
        let buf = {...user};
        send.then((res)=>{console.log(res); Object.assign(buf, res.data[0])});
        console.log(buf);
        setUser(buf);
        getInfoMessage('success','Данные отправлены', false);
    }

    const handleClick = async (event) => {
        setLoadingIndex(true);
        let data = new FormData();
        data.append('file', event.target.files[0]);
        const options = {
            method: 'POST',
            headers: {
                login: encodeURI(user.login),
                fname: encodeURI(event.target.files[0].name)
            },
            body: data,
        }
        const response = await fetch('https://spamigor.ru/apiUpload', options);
        const res = await response.json();        
        let result = await api.sendPost({avatar: `https://spamigor.ru/${res.addr}`}, 'updUserData', `Bearer ${user.token}`);
        console.log(result.data.data[0]);
        setUser(result.data.data[0]);
        getInfoMessage('success','Данные отправлены', false);
    }

    return (
        <Box sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        }}><Grow in={true} appear={user.settings.grow}>
            <Box component={Paper} sx={{
                borderRadius: '50px',
                backgroundColor: grey[darkMode ? 900 : 200],
                boxShadow: 3,
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
                    <IconButton color="primary" aria-label="upload picture" component="label">
                        <input hidden accept="image/*" type="file" onChange={handleClick} />
                        <Avatar
                            alt={(user.first_name+' '+user.last_name).toLocaleUpperCase()}
                            src={user.avatar ? user.avatar : ''}
                            sx={{ width: 50, height: 50, backgroundColor: user.avatar ? blueGrey[900] : grey[200], color: grey[800], fontSize: 'x-large', zoom: 3, boxShadow: `0 0 4px ${darkMode?'gainsboro':'black'}` }}
                        >{user.avatar ? '' : ((user.name ? user.name[0] : 'ъ')+(user.last_name ? user.last_name[0] : 'Ъ')).toLocaleUpperCase()}</Avatar>
                    </IconButton>                    
                    <Typography variant="h5" gutterBottom>{user.role}</Typography>
                </Box>
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    flexWrap: 'nowrap',
                    alignItems: 'flex-start',
                    padding: '30px',
                    borderRadius: '30px',
                    boxShadow: '0 0 5px #121212',
                    backgroundColor: darkMode ? grey[800]:'white',
                }}>
                    {textFields.map((dat)=>{ return (
                        <Box key={dat.index} sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Box sx={styleText.central}>
                                {(!edit.activate||dat.index==='login'||dat.index==='telegram')&&<Typography sx={styleText.name} variant={isMobile?"h6":"h5"} gutterBottom>{dat.text}</Typography>}
                                {edit.activate&&dat.index!=='login'&&dat.index!=='telegram' ? 
                                    <TextField sx={{ margin: 1 }} label={dat.text} value={edit[dat.index]} onChange={({ target }) => {
                                        const resObj = { ...edit };
                                        resObj[dat.index] = target.value;
                                        setEdit(resObj)}} variant="standard" /> : 
                                    (dat.index!=='telegram'||(dat.index==='telegram'&&(user[dat.index]!==''||(user.telegramID!==0))))&&<Typography sx={styleText.text} variant={isMobile?"h6":"h5"} gutterBottom>
                                        {dat.index==='telegram' ? (user.telegram==='' ? user.telegramID : user.telegram) : user[dat.index]}
                                    </Typography>}
                                {!edit.activate&&((dat.index==='email'&&(user.emailValid))||(dat.index==='telegram'&&(user[dat.index]!==''||(user.telegramID!==0))&&(user.telegramValid)))&&
                                    <CheckIcon sx={{ color: green[500]}} />}
                                {!edit.activate&&((dat.index==='email'&&(!user.emailValid))||(dat.index==='telegram'&&(user[dat.index]!==''||(user.telegramID!==0))&&(!user.telegramValid)))&&
                                    <IconButton component="label" onClick={(event)=>handleValidClick(event, dat.index)}>
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
                {...({ timeout: 1000 })} appear={user.settings.grow}
            >
            <Box sx={{
                borderRadius: '50px',
                boxShadow: 3,
                backgroundColor: grey[darkMode ? 900 : 200],
                minWidth: '300px',
                padding: '20px'
            }}>
                {user.askToAdd&&(user.askToAdd.length!==0)&&<TableContainer sx={{ marginBottom: '50px' }}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Вас хотят добавить в список друзей:</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {user.askToAdd.map((row) => (
                            <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ bottom: 0, bottomLeft: '16px' }}>{row}</TableCell>
                                <TableCell align="right" sx={{ bottom: 0 }}><IconButton sx={{color: green[500]}} onClick={((event)=>handleYesButton(row))}><CheckIcon /></IconButton></TableCell>
                                <TableCell align="right" sx={{ bottom: 0 }}><IconButton sx={{color: red[500]}} onClick={((event)=>handleNoButton(row))}><CloseIcon /></IconButton></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
                <Typography variant="h5" gutterBottom>{user.friends.length===0&&'Друзей пока нет'}</Typography>
                {user.askToAdd&&(user.friends.length!==0)&&<TableContainer>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Список ваших друзей</TableCell>
                                <TableCell align="right"></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {user.friends.map((row) => (
                            <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" sx={{ bottom: 0, bottomLeft: '16px' }}>{row}</TableCell>
                                <TableCell align="right" sx={{ bottom: 0 }}><IconButton sx={{color: red[500]}} onClick={((event)=>handleDelButton(row))}><CloseIcon /></IconButton></TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>}
            </Box></Grow>
        </Box>
    )
}