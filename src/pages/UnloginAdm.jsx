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
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';

export default function UnLoginAdm({ state, setState, unRows, setUnRows, api }) {

    const [ bdata, setBData ] = useState({error: unRows.error, textError: unRows.textError});
    const [ rows, setRows ] = useState(unRows.data.data);

    const styleBox = {
        borderRadius: '50px',
        boxShadow: 3,
        backgroundColor: blueGrey[900],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '250px',
        marginTop: '100px',
        padding: '20px'
    }

    const backButton = async (evt) => {
        evt.preventDefault();
        let buf = {...state};
        buf.state='';
        window.location.search='';
        setState(buf)
    }

    const handleClick = (evt, ind) => {
        let buf = copy(rows);
        buf[ind].selected=!buf[ind].selected;
        setRows(buf)
    }

    const saveButton = async (evt) => {
        setLoadingIndex(true); 
        let act = await api.sendPost({list: {id: unRows.data.id, data: rows}}, unRows.data.hasOwnProperty('saved')?'updASumUList':'updAUList', '');
        if (act.status===200) {
            if (Array.isArray(act.data.res))
                setRows(act.data.res[0].data)
            else setRows(act.data.res.list[0].data)
            getInfoMessage('success', '???????????? ????????????????', false);
        }
        else 
            getInfoMessage('error', '???????????? ???? ????????????????', false);
    }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-evenly' }}>
        <Grow in={true}><Box
            sx={styleBox}>
            {!bdata.error&&<TableContainer sx={{ margin: '10px' }} component={Paper}>
                <Table size="small" aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell align="left"></TableCell>
                        <TableCell align="left">????????????????</TableCell>
                        <TableCell align="right">??????-????</TableCell>
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
            {!bdata.error&&<Button sx={{ backgroundColor: green[400], color: 'black', boxShadow: 3, margin: 1 }} onClick = {(event)=>saveButton(event)}>??????????????????</Button>}
            {bdata.error&&<h1 style={{ 'padding':'0', 'margin':'0', 'fontFamily': 'monospace' }}>{bdata.textError}</h1>}
            <Button sx={{ backgroundColor: blue[400], boxShadow: 3, margin: 1 }} onClick = {(event)=>backButton(event)} variant="contained">??????????</Button> 
        </Box></Grow>
    </Box>
  );
}