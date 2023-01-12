import Box from '@mui/material/Box';
import copy from 'fast-copy';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blue, blueGrey, green } from '@mui/material/colors';
import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';

export default function AccountMenu({ setLoadingInd, openNewRowWindow, setOpenNewRowWindow, state, setState, data, setData, api }) {

    const [ errState, setErrState ] = useState({log: false, pass: false});
    const [ seech, setSeech ] = useState('');
    const [ bdata, setBData ] = useState({visible: false, error: false, textError: '', row: {}});
    const [ rows, setRows ] = useState([]);

    const seechButton = async (evt) => {
        setLoadingInd(true);
        console.log(seech)
        if (evt) evt.preventDefault();
        let answ = await api.sendPost({id: seech}, 'askList', '');
        if (answ.status===200) {
            setRows(answ.data.res.data);
            let eBuf = {...openNewRowWindow};
            eBuf.text='Данные получены';
            eBuf.success=true;
            setOpenNewRowWindow(eBuf)
            setBData({visible: true, error: false, textError: '', row: answ.data.res})
            setLoadingInd(false);
        }
        else if (answ.status===402) {
            let eBuf = {...openNewRowWindow};
            eBuf.text='Отказ в доступе';
            eBuf.error=true;
            setOpenNewRowWindow(eBuf)
            setBData({visible: true, error: true, textError: 'Отказ в доступе', row: {}})
            setLoadingInd(false);
        }
        else if (answ.status===401) {
            let eBuf = {...openNewRowWindow};
            eBuf.text='ID не найден';
            eBuf.error=true;
            setOpenNewRowWindow(eBuf)
            setBData({visible: true, error: true, textError: 'ID не найден', row: {}})
            setLoadingInd(false);
        }
        else {
            let eBuf = {...openNewRowWindow};
            eBuf.text='Скорее всего АПИ упала';
            eBuf.error=true;
            setOpenNewRowWindow(eBuf)
            setBData({visible: true, error: true, textError: 'Скорее всего АПИ упала', row: {}})
            setLoadingInd(false); 
        }
        console.log(answ);
    }

    const backButton = async (evt) => {
        evt.preventDefault();
        let buf = {...state};
        buf.state='';
        setState(buf)
    }

    const handleClick = (evt, ind) => {
        console.log(ind)
        let buf = copy(rows);
        buf[ind].selected=!buf[ind].selected;
        setRows(buf)
    }

    const saveButton = async (evt) => {
        setLoadingInd(true); 
        let act = await api.sendPost({list: {id: seech, data: rows}}, 'updUList', '');
        console.log(act);
        await seechButton();
    }

  return (
    <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-evenly',
        }}>
        <Box
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
                margin: '10px',
                padding: '20px'
            }}
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
        {bdata.visible&&<Box
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
            }}>
            {!bdata.error&&<TableContainer sx={{ margin: '10px' }} component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left">Название</TableCell>
                        <TableCell align="right">Кол-во</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row, index) => (
                        <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell sx={{ width: '30px', margin: 0, padding: 0, paddingLeft: '10px' }}>
                            <Checkbox
                                sx={{ zoom: 1.5, padding: 0, margin: 0, color: green[400], '&.Mui-checked': {
                                      color: green[600]} }}
                                checked={row.selected}
                                onClick={(event) => handleClick(event, index)}
                            />
                        </TableCell>
                        <TableCell align="left" sx = {{ textDecoration: row.selected ? 'line-through' : 'none' }}>{row.name}</TableCell>
                        <TableCell align="right">{row.total}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>}
            {!bdata.error&&<Button onClick = {(event)=>saveButton(event)}>Сохранить</Button>}
            {bdata.error&&<h1 style={{ 'padding':'0', 'margin':'0', 'fontFamily': 'monospace' }}>{bdata.textError}</h1>}
        </Box>}
    </Box>
  );
}