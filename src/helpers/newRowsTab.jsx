import * as React from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { setLoadingIndex } from '../helpers/leftInfoWindow';

export default function NewRowsTab({setVisibleWindowNewRow, editedLists, setEditedLists, api, rows, setRows, user }) {
    const [ name, setName ] = React.useState('')
    const handleEnter = async (evt) => {
        setLoadingIndex(true);
        console.log(user.token);
        setVisibleWindowNewRow(false);
        let bbb = await api.sendPost({name: name, author: user.first_name || user.login, data: [], access: 'me', accessUsers: [user.login]}, 'setList', `Bearer ${user.token}`);
        console.log(bbb);
        setRows(bbb.data.list);
        console.log(bbb.data.list);
        let buf = copy (editedLists);
        buf.push(rows.length-1);
        setEditedLists(buf);
        setLoadingIndex(false);
    }

    const handleClosed = (evt) => {        
        setVisibleWindowNewRow(false);
    }

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ bgcolor: blueGrey[900], padding: '40px',
                    position: 'fixed', top: '40vh', zIndex: '9999', boxShadow: 3, borderRadius: '50px' }}>
                    <TextField sx={{ width: '300px', boxShadow: 3, bgcolor: blueGrey[800] }} 
                        label='Введи название' value={name} onChange={({ target }) => {setName(target.value)}} />
                    <Box sx={{ margin: 0}}>
                        <Button sx={{ margin: '15px 10px 0px 0px' }} 
                            variant='contained'
                            onClick={(event)=>handleEnter(event)}>Принять</Button>
                        <Button sx={{ bgcolor: blueGrey[800], margin: '15px 0px 0px 10px' }}
                            onClick={(event)=>handleClosed(event)}>Отменить</Button>
                    </Box>
                </Box>
            </Box>
        </div>
    );
  }