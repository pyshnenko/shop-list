import * as React from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function NewRowsTab({rows, setRows, setOpenNewRowWindow, user}) {
    const [ name, setName ] = React.useState('')
    const handleEnter = (evt) => {
        console.log(user);
        setOpenNewRowWindow({visible: false, text: name});
        let buf = copy(rows);
        console.log(rows)
        buf.push({name: name, author: user.first_name || user.login, data: [], id: -1})
        setRows(buf);
    }

    const handleClosed = (evt) => {        
        setOpenNewRowWindow({visible: false, text: ''})
    }

    return (
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
    );
  }