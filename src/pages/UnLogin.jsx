import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blue, blueGrey, green } from '@mui/material/colors';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';

export default function AccountMenu({ state, setState, data, setData }) {

    const [errState, setErrState] = useState({log: false, pass: false});
    const [ seech, setSeech ] = useState('');

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        let eee = {...errState};
        if (data.log==='') eee.log=true;
        if (data.pass==='') eee.pass=true;
        setErrState(eee);
        //console.log(evt.target.value)
        //if (evt) console.log(evt);
    }

    const seechButton = async (evt) => {
        console.log(seech)
        evt.preventDefault();
    }

    const backButton = async (evt) => {
        evt.preventDefault();
        let buf = {...state};
        buf.state='';
        setState(buf)
    }

  return (
    <Box
        component="form"
        onSubmit={(event)=>handleSubmit(event)}
        sx={{
            borderRadius: '50px',
            boxShadow: 3,
            backgroundColor: blueGrey[900],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '50%',
            minWidth: '250px',
            margin: '100px',
            padding: '20px'
        }}
        validate
        autoComplete="off"
        >
        <Typography variant="h6" sx={{ color: blueGrey[200] }}>
            Введи id списка
        </Typography>
        <TextField 
            sx={{ margin: '10px', boxShadow: 3 }}
            error={errState.log} 
            name='login' 
            label='ID списка' 
            value={seech} 
            variant="outlined" 
            onChange={({ target }) => {
                setSeech(target.value)
        }} />        
        <Box>
            <Button type="submit" sx={{ backgroundColor: blue[800], boxShadow: 3, margin: 1 }} onClick = {(event)=>seechButton(event)} variant="contained">Поиск</Button>
            <Button sx={{ backgroundColor: green[400], boxShadow: 3, margin: 1 }} onClick = {(event)=>backButton(event)} variant="contained">Назад</Button> 
        </Box>
    </Box>
  );
}