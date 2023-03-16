import React, { useEffect, useState, useRef} from 'react';
import {useTelegram} from "../../src/hooks/useTelegram";
import copy from 'fast-copy';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';

const Form = ({ api }) => {
    const [ trening, setTrening ] = useState('');
    const [ cat, setCat ] = useState('');
    const [ rename, setRename ] = useState('');
    const [ edit, setEdit ] = useState('');
    const [ editMode, setEditMode ] = useState(-1);
    const [ error, setError ] = useState(false);
    const [ succ, setSucc ] = useState(false);
    const [ renameMode, setRenameMode ] = useState(-1);
    const [ newTrening, setNewTrening ] = useState({name: '', w: ''});

    const trig = useRef(true);
    const {tg} = useTelegram();
    const darkTheme = createTheme({
        palette: {
            mode: tg.colorScheme,
        },
    });

    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        console.log(width)
        if (trig.current) {
            trig.current = false;
            tg.MainButton.setParams({
                text: 'Отправить данные'
            })
            const params = new URLSearchParams(window.location.search);
            let res = api.sendPost({token: decodeURI(params.get('auth'))}, 'treningForm', '' );
            res.then((result)=>{
                if (result.status===200) {
                    setError(false);
                    setSucc(true);
                    setTrening(result.data.res);
                    setCat(result.data.cat);
                }
                else {
                    setError(true);
                    setSucc(false);
                }
            })
        }
        tg.MainButton.show();

        const handleResize = (event) => {
            setWidth(event.target.innerWidth);
        };
        window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
    }, []);

    const onSendData = () => {

        tg.sendData(JSON.stringify({res: true, data: trening.categories}));
    };

    const columns = [
        { id: 'name', label: 'Название', minWidth: width < 500 ? 50 : 100 },
        { id: 'rename', label: '', minWidth: width < 500 ? 30 : 40 },
        { id: 'weight', label: 'Вес (кг)', minWidth: width < 500 ? 30 : 60 },
        { id: 'edit', label: '', minWidth: width < 500 ? 30 : 40 },
        { id: 'delete', label: '', minWidth: width < 500 ? 30 : 40 }
    ];

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    const saveRename = (item) => {
        setRenameMode(-1);
        let buf = trening;
        buf.categories[cat][rename] = buf.categories[cat][item];
        delete(buf.categories[cat][item]);
        setTrening(buf);
    }

    const saveEdit = (item) => {
        setEditMode(-1);
        let buf = trening;
        buf.categories[cat][item].w = edit;
        setTrening(buf);
    }

    const addButton = () => {
        let w = Number(newTrening.w);

        //Заменить не забудь
        let buf = trening;
        buf.categories[cat][newTrening.name.trim()] = {w: (w||w===0) ? w : newTrening.w};
        setTrening(buf)
        setNewTrening({name: '', w: ''});
    }

    const deleteButton = (item) => {
        let buf = copy(trening);
        delete(buf.categories[cat][item]);
        setTrening(buf);
    }

    const styleButton = {
        padding: 0,
        margin: 0,
        width: '30px'
    }

    const iconStyle = {
        padding: 0,
        margin: 0
    }

    return (
        <ThemeProvider theme={darkTheme}>
            <Box sx = {{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CssBaseline />
                <Typography sx = {{fontSize: 'large', padding: '30px 10px'}} variant="h4" gutterBottom>{error?'Неверные данные. Вернись в бота и нажми start':cat}</Typography>
                {succ&&<TableContainer sx={{ minWidth: '300px', width: (width<500?'100%':'80%'), maxWidth: '600px' }} component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.id==='weight'?"right":"left"}
                                        style={{ minWidth: column.minWidth, padding: 5 }}
                                        >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {Object.keys(trening.categories[cat]).map((row, index) => (
                            <TableRow
                                key={row}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {renameMode!==index ? row :
                                        <TextField required sx={{ margin: '10px', boxShadow: 3 }} name='name' label='Название' value={rename} variant="outlined"
                                            onChange={({ target }) => {setRename(target.value)}} />
                                    }
                                </TableCell>
                                <TableCell sx={{ padding: 0 }}>
                                    {(renameMode!==index)&&<IconButton sx={styleButton}
                                        onClick={()=>{setRenameMode(index); setRename(row)}}
                                    >
                                        <EditIcon sx={iconStyle} />
                                    </IconButton>}
                                    {(renameMode===index)&&<IconButton sx={styleButton}
                                        onClick={()=>saveRename(row)}
                                    >
                                        <SaveIcon sx={iconStyle} />
                                    </IconButton>}
                                </TableCell>
                                <TableCell sx={{ padding: '0 10px 0 0' }} align="right">{index!==editMode ? trening.categories[cat][row].w :                                 
                                    <TextField required sx={{ width: width<500?'60px':'120px', margin: '10px', boxShadow: 3, padding: width < 500 ? 0 : '16px' }} type='number'  name='w' label='Вес' value={edit} variant="outlined"
                                        onChange={({ target }) => {setEdit(target.value)}} />
                                }</TableCell>
                                <TableCell sx={{ width: '40px', padding: 0 }}>
                                    {index!==editMode&&<IconButton sx={styleButton}
                                        onClick={()=>{setEditMode(index); setEdit(trening.categories[cat][row].w)}}
                                    >
                                        <EditIcon sx={iconStyle} />
                                    </IconButton>}
                                    {index===editMode&&<IconButton sx={styleButton}
                                        onClick={()=>saveEdit(row)}
                                    >
                                        <SaveIcon sx={iconStyle} />
                                    </IconButton>}
                                </TableCell>
                                <TableCell sx={{ padding: 0 }}>
                                    <IconButton sx={styleButton}
                                        onClick={()=>{deleteButton(row)}}
                                    >
                                        <DeleteIcon sx={iconStyle} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: width>500 ? 'row' : 'column', alignItems: 'center' }}>
                            <TextField sx={{ margin: 1 }} variant="standard" label="Название упражнения" value={newTrening.name} 
                                onChange={({ target }) => {
                                const resObj = { ...newTrening };
                                resObj.name = target.value;
                                setNewTrening(resObj)}}
                            />
                            <Box>
                                <TextField sx={{ width: 50, margin: 1 }} type="number" variant="standard" label="Вес в кг" value={newTrening.s} 
                                    onChange={({ target }) => {
                                    const resObj = { ...newTrening };
                                    resObj.w = target.value;
                                    setNewTrening(resObj)}} 
                                />
                            </Box>
                        </Box>
                        <Box>
                            <Button variant="contained" sx={{ margin: 1 }} onClick = {(event)=>addButton(event)}>{trening.categories[cat].hasOwnProperty(newTrening.name.trim())?'Изменить':'Добавить'}</Button>
                        </Box>
                    </Box>
                </TableContainer>}
            </Box>
        </ThemeProvider>
    );
};

export default Form;