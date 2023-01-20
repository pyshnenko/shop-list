import React, { useState, useEffect } from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grow from '@mui/material/Grow';

export default function DWindow({ editedLists, setEditedLists, open, setOpen, rows, setRows, user}) {

    const [ newName, setNewName ] = useState(rows[open.list].name);
    const [ newAcc, setNewAcc ] = useState(rows[open.list].access || 'me');
    const [ newAccUsers, setNewAccUsers ] = useState(rows[open.list].accessUsers || []);

    useEffect(() => {
        const onKeypress = e => {
            console.log(e.code);
            if (e.code==='Escape') {
                handleClose();
            }
            else if (e.code==='Enter') {
                handleListNameEdit();
            }
        };
      
        document.addEventListener('keydown', onKeypress);
      
        return () => {
          document.removeEventListener('keydown', onKeypress);
        };
    }, []);

    const handleClose = (event) => {
        setOpen({visible: false, list: 0, text: '' })
    };

    const handleListNameEdit = (event) => {
        console.log('push');
        let row = copy(rows);
        row[open.list].name=newName;
        row[open.list].access=newAcc;
        row[open.list].accessUsers=newAccUsers;
        setRows(row);
        if (!editedLists.includes(open.list)) {
            const ed = copy(editedLists);
            ed.push(open.list);
            setEditedLists(ed);
        }
        handleClose();
    }

    const handleChange = (event) => {
        setNewAcc(event.target.value);
        let buf = [user.friends];
        buf.push(user.login);
        if (event.target.value==='all') setNewAccUsers([]);
        else if (event.target.value==='me') setNewAccUsers([user.login]);
        else if (event.target.value==='friends') setNewAccUsers(buf);
        console.log(event.target.value);
        console.log(user)
    };

    return (
        <Grow in={true}><Box
            sx={{ 
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 10,
                display: 'flex',
                height: '100vh',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',

            }}>
            <Box sx={{ 
                    backgroundColor: 'black',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                    opacity: 0.5
                }}>
            </Box>
            <Box sx={{
                    margin: '10px',
                    backgroundColor: '#202020',
                    width: '340px',
                    padding: '30px',
                    border: '2px solid white',
                    boxShadow: '0 0 10px',
                    borderRadius: '50px'
                }}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Новое название списка"
                    fullWidth
                    variant="standard"
                    value={newName}
                    onChange={({ target }) => setNewName(target.value)}
                />
                <FormControl 
                    sx={{ margin: '25px 0px' }}>
                    <FormLabel>Кому доступно?</FormLabel>
                    <RadioGroup
                        defaultValue={rows[open.list].access || 'me'}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="me" control={<Radio />} label="Только мне" />
                        {user.friends.length!==0&&<FormControlLabel value="friends" control={<Radio />} label="Моим друзьям" />}
                        {user.friends.length!==0&&<FormControlLabel value="users" control={<Radio />} label="Выбрать пользователей" />}
                        <FormControlLabel value="all" control={<Radio />} label="Всем" />
                    </RadioGroup>
                </FormControl>                
                <Box>            
                    <Button onClick={handleClose}>Отменить</Button>
                    <Button onClick={(event)=>handleListNameEdit(event)} variant="contained">Принять</Button>
                </Box>
            </Box>
            {newAcc==='users'&&<Box sx={{
                    margin: '10px',
                    backgroundColor: '#202020',
                    width: '340px',
                    padding: '30px',
                    border: '2px solid white',
                    boxShadow: '0 0 10px',
                    borderRadius: '50px'
                }}>

            </Box>}
        </Box></Grow>
    )
}