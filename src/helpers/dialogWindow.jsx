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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';

export default function DWindow({ editedLists, setEditedLists, open, setOpen, rows, setRows, user}) {

    const [ newName, setNewName ] = useState(rows[open.list].name);
    const [ newAcc, setNewAcc ] = useState(rows[open.list].access || 'me');
    const [ newAccUsers, setNewAccUsers ] = useState(rows[open.list].accessUsers || []);

    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const handleResize = (event) => {
        setWidth(event.target.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
  
    useEffect(() => {
      const handleResize = (event) => {
        setHeight(event.target.innerHeight);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);
    
    useEffect(() => {
        const onKeypress = e => {
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
        console.log(newAccUsers);
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
        if (event.target.value==='all') setNewAccUsers([]);
        else if (event.target.value==='me') setNewAccUsers([user.login]);
        else if (event.target.value==='friends') {
            let buf = copy(user.friends);
            buf.push(user.login);
            setNewAccUsers(buf);
        }
        else if (event.target.value==='users') {
            let buf = copy(newAccUsers);
            if (!buf.includes(user.login)) buf.push(user.login);
            console.log(buf)
            setNewAccUsers(buf);
        }
        console.log(event.target.value);
    };

    const handleCheck = (name) => {
        let buf = copy(newAccUsers);
        if (buf.includes(name)) buf.splice(buf.indexOf(name),1);
        else buf.push(name);
        setNewAccUsers(buf);
    }

    return (
        <Grow in={true} appear={user?.settings?.grow}><Box
            sx={{ 
                position: 'fixed',
                left: 0,
                top: 0,
                zIndex: 10,
                display: 'flex',
                height: '100vh',
                width: '100%',
                alignItems: 'center',
                flexDirection: width>height ? 'row' : 'column',
                justifyContent: width>height ? 'center' : 'flex-start'
            }}>
            <Box sx={{ 
                    backgroundColor: 'black',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                    opacity: 0.5,
                    zIndex: 12,
                }}>
            </Box>
            <Box  component={Paper} sx={{
                    margin: '10px',
                    width: '340px',
                    padding: '30px',
                    border: '2px solid white',
                    boxShadow: '0 0 10px',
                    borderRadius: '50px',
                    zIndex: 15,
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
            {newAcc==='users'&&<Box component={Paper} sx={{
                    margin: '10px',
                    width: '340px',
                    padding: '30px',
                    border: '2px solid white',
                    boxShadow: '0 0 10px',
                    borderRadius: '50px',
                    zIndex: 15,
                }}>
                <TableContainer sx={{ marginBottom: '50px' }}>
                    <Table size="small" aria-label="a dense table">
                        <TableBody>
                        {user.friends.map((row) => (
                            <TableRow
                            key={row}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        sx = {{ zoom: 1.3 }}
                                        color="primary"
                                        checked={newAccUsers.includes(row)}
                                        onClick={(event) => handleCheck(row)}
                                    />
                                </TableCell>
                                <TableCell component="th" scope="row" sx={{ bottom: 0, bottomLeft: '16px' }}>{row}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>}
        </Box></Grow>
    )
}