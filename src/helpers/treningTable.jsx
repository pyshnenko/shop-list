import React, { useState, useEffect, useRef } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableHead from '@mui/material/TableHead';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import YorNallert from './yORnAllert';

function TablePaginationActions(props) {

    const { count, page, rowsPerPage, onPageChange } = props;

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

    const handleFirstPageButtonClick = (event) => {
        onPageChange(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onPageChange(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onPageChange(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            {width>500&&<IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
            >
                <FirstPageIcon />
            </IconButton>}
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
            >
                <KeyboardArrowLeft />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                <KeyboardArrowRight />
            </IconButton>
            {width>500&&<IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                <LastPageIcon />
            </IconButton>}
        </Box>
    );
}

export default function TreningTable({trening, setTrening, itemS, user, darkMode}) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [ newTrening, setNewTrening ] = useState({name: '', w: ''});
    const [ alList, setAlList ] = useState({text: '', ready: false, result: false, visible: false, make: ''});

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
        if ((alList.ready)&&(alList.result)) {
            if (alList.make[0]==='@') {
                let commands = alList.make.slice(1,4);
                let item = alList.make.slice(5);
                if (commands==='del') {
                    let buf = trening;
                    delete(buf.categories[itemS][item])
                    setTrening(buf);
                }
            }
            setAlList({text: '', ready: false, result: false, visible: false, make: ''});
        }
    }, [alList])

    const columns = [
        { id: 'name', label: 'Название', minWidth: width < 500 ? 50 : 100 },
        { id: 'weight', label: 'Вес (кг)', minWidth: width < 500 ? 30 : 60 },
        { id: 'graf', label: '', minWidth: width < 500 ? 30 : 40 },
        { id: 'edit', label: '', minWidth: width < 500 ? 30 : 40 },
        { id: 'delete', label: '', minWidth: width < 500 ? 30 : 40 }
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const addButton = () => {
        let w = Number(newTrening.w);

        //Заменить не забудь
        let buf = trening;
        buf.categories[itemS][newTrening.name.trim()] = {w: (w||w===0) ? w : newTrening.w};
        setTrening(buf)
        setNewTrening({name: '', w: ''});
    }

    return (
        <div>
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                style={{ minWidth: column.minWidth, padding: 5, color: '#729595' }}
                                >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                {(rowsPerPage > 0
                    ? (trening.categories[itemS]) ? Object.keys(trening.categories[itemS]).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : null
                    : !(trening.categories[itemS]) ? null : Object.keys(trening.categories[itemS])
                ).map((row) => (
                    <TableRow key={row}>
                        {row!=='target'&&row!=='onTarget'&&row!=='date'&&<TableCell component="th" scope="row" style={{ padding: width>500? 10 : 5, color: darkMode?'#BDC4C4':'black' }}>
                            {row}
                        </TableCell>}
                        {row!=='target'&&row!=='onTarget'&&row!=='date'&&<TableCell style={{ width: width < 500 ? 30 : 60, padding: width>500? 10 : 5, color: darkMode?'#BDC4C4':'black' }} align="center">
                            {trening.categories[itemS][row].w}
                        </TableCell>}
                        {row!=='target'&&row!=='onTarget'&&row!=='date'&&<TableCell style={{ width: width < 500 ? 30 : 40, height: width>500?60:40, padding: width>500? 5 : 0 }} align="center">
                        <IconButton sx={{ padding: 0 }}
                            onClick={()=>setNewTrening({name: row, w: trening.categories[itemS][row].w})}
                        >
                            <EditIcon sx={{color: '#3E6E3E'}} />
                        </IconButton>
                        </TableCell>}
                        {row!=='target'&&row!=='onTarget'&&row!=='date'&&<TableCell style={{ width: width < 500 ? 30 : 40, height: width>500?60:40, padding: width>500? 5 : 0 }} align="center">
                        <IconButton sx={{ padding: 0 }}
                            onClick={()=>setAlList({text: `Удаляем "${row}"?`, ready: false, result: false, visible: true, make: `@del:${row}`})}
                        >
                            <DeleteIcon sx={{color: '#794545'}} />
                        </IconButton>
                        </TableCell>}
                    </TableRow>
                ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, { label: 'All', value: -1 }]}
                            colSpan={width < 500 ? 6 : 6}
                            count={Object.keys(trening.categories[itemS]).length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            ActionsComponent={TablePaginationActions}
                            labelRowsPerPage={'Строк'}
                            labelDisplayedRows={width > 500 ? ({ from, to, count, page }) => {
                                return`${page+1} из ${Math.floor(count/rowsPerPage-0.0001)+1 || 1}`} : ({ page }) => {return`${page+1}`
                            }}
                        />
                    </TableRow>
                </TableFooter>
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
                    {true&&<Button sx={{ margin: 1, color: '#54A4A4' }} onClick = {(event)=>addButton(event)}>{trening.categories[itemS].hasOwnProperty(newTrening.name.trim())?'Изменить':'Добавить'}</Button>}
                </Box>
            </Box>
        </TableContainer>
            {alList.visible&&<YorNallert darkMode={darkMode} user={user} list={alList} setList={setAlList} />}
        </div>
    );
}