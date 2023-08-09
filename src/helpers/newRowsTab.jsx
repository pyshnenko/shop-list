import React, { useEffect } from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import {isMobile} from 'react-device-detect';
import Paper from '@mui/material/Paper';

export default function NewRowsTab({newRow, setNewRow, setVisibleWindowNewRow, editedLists, setEditedLists, api, rows, setRows, user }) {
    const [ name, setName ] = React.useState('');

    useEffect(() => {
        const onKeypress = e => {
            if (e.code==='Escape') {
                handleClosed();
            }
            else if (e.code==='Enter') {
                if (name!=='') handleEnter();
            }
        };
      
        if (!isMobile) document.addEventListener('keydown', onKeypress);
      
        return () => {
            if (!isMobile) document.removeEventListener('keydown', onKeypress);
        };
    }, []);

    const accUsList = (shMode) => {
        let buf = [];
        if (!shMode||(shMode==='me')) buf.push(user.login);
        else if (shMode==='friends') {
            buf = user.friends;
            buf.push(user.login);
        }
        return buf; 
    }

    const handleEnter = async (evt) => {
        setLoadingIndex(true);
        setVisibleWindowNewRow(false);
        let acc = user?.settings?.sharedMode ? user?.settings?.sharedMode : 'me';
        let accU = await accUsList(user?.settings?.sharedMode ? user?.settings?.sharedMode : 'me');
        let bbb = await api.sendPost({name: name, author: user.name || user.login, data: [], access: acc, accessUsers: accU}, 'setList', `Bearer ${user.token}`);
        setRows(bbb.data.list);
        let buf = copy (editedLists);
        buf.push(rows.length-1);
        setNewRow({ name: '', total: '' });
        setEditedLists(buf);
        setLoadingIndex(false);
    }

    const handleClosed = (evt) => {        
        setVisibleWindowNewRow(false);
    }

    return (
        <div>
            <Grow in={true} appear={user.settings.grow}><Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component={Paper} sx={{ padding: '40px',
                    position: 'fixed', top: '40vh', zIndex: '9999', boxShadow: 3, borderRadius: '50px' }}>
                    <TextField sx={{ width: '300px', boxShadow: 3 }} 
                        label='Введи название' value={name} onChange={({ target }) => {if (name.length<25)setName(target.value)}} />
                    <Box sx={{ margin: 0}}>
                        <Button color="success" sx={{ margin: '15px 10px 0px 0px' }} 
                            variant='contained'
                            onClick={(event)=>handleEnter(event)}>Принять</Button>
                        <Button color="error" sx={{ margin: '15px 0px 0px 10px' }}
                            onClick={(event)=>handleClosed(event)}>Отменить</Button>
                    </Box>
                </Box>
            </Box></Grow>
        </div>
    );
  }