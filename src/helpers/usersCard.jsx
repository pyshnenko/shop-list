import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { blueGrey, green, grey, lightBlue, red } from '@mui/material/colors';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Paper from '@mui/material/Paper';

export default function UsersCard({ userS, setUserS, api, user, setUser }) { 
    
    useEffect(() => {
        const onKeypress = e => {
            console.log(e.code);
            if (e.code==='Escape') {
                setUserS({visible: false});
            }
        };
      
        document.addEventListener('keydown', onKeypress);
      
        return () => {
          document.removeEventListener('keydown', onKeypress);
        };
    }, []);

    const styleText = { central: { display: 'flex', alignItems: 'center' }, name: { color: lightBlue[800], marginRight: '10px' }, text: {}};
    const textFields = [ 
        {text: 'Логин:', index: 'login'}, 
        {text: 'Имя:', index: 'name'}, 
        {text: 'Фамилия:', index: 'last_name'}, 
        {text: 'Отчество:', index: 'first_name'}, 
        {text: 'Почта:', index: 'email'}, 
        {text: 'telegram:', index: 'telegram'} 
    ];

    const handleAddFriend = () => {
        setLoadingIndex(true);
        let res = api.sendPost({login: userS.login}, 'askToAdd', `Bearer ${userS.token}`);
        res.then((result)=>{
            console.log(result);
            getInfoMessage(result.status===200 ? 'success' : 'error', result.status===200 ? 'Запрос отправлен' : 'Что-то пошло не так', false);
            if (result.status===200) {
                let buf = {...userS};
                buf.asked=true;
                setUserS(buf);
            }
        })
    }

    const handleDelFriend = () => {
        console.log(userS.token);
        setLoadingIndex(true);
        let send = api.sendPost({friend: userS.login}, 'friendshipEnd', `Bearer ${userS.token}`);
        let buf = {...userS};
        send.then((res)=>{
            console.log(res);
            if (res.status===200) {
                buf.friend=false;
                setUserS(buf);
                buf={...user};
                buf.friends.splice(buf.friends.indexOf(userS.login), 1);
                setUser(buf);
                getInfoMessage('success','Данные отправлены', false);
            }
            else getInfoMessage('error','Что-то пошло не так', false);
        });
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
            <Box component={Paper} sx={{
                borderRadius: '50px',
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
                padding: '20px',
                opacity: '1',
                zIndex: 11
            }}>
                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}><IconButton sx={{ position: 'fixed' }} onClick={(event=>setUserS({visible: false}))} ><CloseIcon /></IconButton></Box>
                <Box>
                    <Avatar
                        alt={(userS.first_name+' '+userS.last_name).toLocaleUpperCase()}
                        src={userS.avatar ? userS.avatar : ''}
                        sx={{ width: 50, height: 50, backgroundColor: grey[200], color: grey[800], fontSize: 'x-large', zoom: 3 }}
                    >{userS.avatar ? '' : ((userS.name ? userS.name[0] : 'Ъ')+(userS.last_name ? userS.last_name[0] : 'Ъ')).toLocaleUpperCase()}</Avatar>
                    <Typography variant="h5" gutterBottom>{userS.role}</Typography>
                    {userS.asked&&<Typography sx={{ fontSize: 'medium', marginTop: '20px', color: 'cadetblue' }} variant="h5" gutterBottom>Ожидаем ответ</Typography>}
                    {userS.friend&&<Typography variant="h5" gutterBottom>Ваш друг</Typography>}
                    {userS.friend&&<Button onClick={(event)=>handleDelFriend()}>Удалить из друзей</Button>}
                    {(!userS.asked)&&(!userS.friend)&&<Button onClick={(event)=>handleAddFriend()}>Добавить в друзья</Button>}
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
                                {<Typography sx={styleText.text} variant="h5" gutterBottom>
                                    {dat.index==='telegram'?(userS.telegram===''?userS.telegramID:userS.telegram):userS[dat.index]}
                                </Typography>}
                                {dat.index==='email'&&userS.emailValid&&<CheckIcon sx={{ color: green[500]}} />}
                                {dat.index==='telegram'&&userS.telegramValid&&<CheckIcon sx={{ color: green[500]}} />}
                                {dat.index==='email'&&(!userS.emailValid)&&<CloseIcon sx={{ color: red[500]}} />}
                                {dat.index==='telegram'&&(!userS.telegramValid)&&<CloseIcon sx={{ color: red[500]}} />}
                            </Box>
                        </Box>
                    )})}
                </Box>
            </Box>
        </Box>
    )
}