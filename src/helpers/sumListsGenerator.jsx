import React, { useState, useEffect, useRef } from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import {isMobile} from 'react-device-detect';
import DelWindow from '../helpers/deleteDialog';
import ShareIcon from '@mui/icons-material/Share';
import SaveIcon from '@mui/icons-material/Save';

const headCells = [
    {
        id: 'name',
        numeric: false,
        disablePadding: true,
        label: 'Название',
    },
    {
        id: 'total',
        numeric: true,
        disablePadding: false,
        label: 'Осталось',
    },
    {
        id: 'sumTotal',
        numeric: true,
        disablePadding: false,
        label: 'Всего',
    }
];

function EnhancedTableHead() {
    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                </TableCell>
                {headCells.map((headCell) => (
                <TableCell
                    key={headCell.id}
                    align={headCell.numeric ? 'right' : 'left'}
                    padding={headCell.disablePadding ? 'none' : 'normal'}
                >
                    {headCell.label}
                </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

export default function SumListsGenerator({ setGetUrl, rows, setRows, api, user, checkForTotal, setCheckForTotal, openDelW, setOpenDelW, sumLists, setSumLists }) {

    const arrGen = (length) => {
        let buf = [0];
        for (let i=0; i<length; i++) buf.push(0);
        return buf;
    }

    const [ page, setPage ] = useState(arrGen(sumLists.length));
    const [ rowsPerPage, setRowsPerPage ] = useState(10);
    const [ width, setWidth ] = useState(window.innerWidth);

    let triggerSumlists = useRef(true);

    useEffect(() => {
        const handleResize = (event) => {
            setWidth(event.target.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(()=>{
        if (triggerSumlists.current) {
            triggerSumlists.current=false;
            setLoadingIndex(true);
            let lists = api.sendPost({}, 'sumLists', `Bearer ${user.token}`);
            lists.then((res)=>{
                console.log(res)
                if (res.status===200)
                    setSumLists(res.data.sumLists)
                else setSumLists([]);
                getInfoMessage('success', 'Обновлено', false);
            })
        }
    }, [])

    useEffect(()=>{
        if(sumLists.length) {
        }
    }, [rows])

    useEffect(()=>{
        if (checkForTotal.ready)
        {
            let buf = createList(checkForTotal);
            if (buf) {
                let sBuf = copy(sumLists);
                sBuf.push(buf);
                setSumLists(sBuf);
                setPage(arrGen(sBuf.length));
                setCheckForTotal({visible: false, ready: false, data: []});
            }
        }
    }, [checkForTotal])

    const createList = (arrData) => {
        let startCheck = false;
        for (let i=0; i<arrData.data.length; i++) {
            for (let j=0; j<rows.length; j++) {
                if (arrData.data[i]===rows[j].id) {
                    startCheck=true;
                    break;
                }
                else startCheck=false;
            }
        }
        if(startCheck) {
            let recDataForSum=[];
            let bufDataObj={name: [], total: [], sumTotal: [], ind: []};
            for (let i=0; i<rows.length; i++) {
                if (arrData.data.includes(rows[i].id)) {
                    for (let j=0; j<rows[i].data.length; j++) {
                        if (bufDataObj.name.includes(rows[i].data[j].name.toLocaleLowerCase())){
                            let index = bufDataObj.name.indexOf(rows[i].data[j].name.toLocaleLowerCase());
                            if ((rows[i].data[j].ind===' г')||(rows[i].data[j].ind===' мл')) {
                                bufDataObj.sumTotal[index]+=(rows[i].data[j].total/1000);
                                if (!rows[i].data[j].selected) bufDataObj.total[index]+=(rows[i].data[j].total/1000);
                            }
                            else {
                                bufDataObj.sumTotal[index]+=(rows[i].data[j].total);
                                if (!rows[i].data[j].selected) bufDataObj.total[index]+=(rows[i].data[j].total);
                            }
                            if ((rows[i].data[j].ind!=='')&&(bufDataObj.ind[index]==='')) bufDataObj.ind[index]=rows[i].data[j].ind;
                        }
                        else {
                            let ind = rows[i].data[j].ind;
                            if (rows[i].data[j].ind===' мл') ind = ' л';
                            else if (rows[i].data[j].ind===' г') ind = ' кг';
                            bufDataObj.name.push(rows[i].data[j].name.toLocaleLowerCase());
                            bufDataObj.total.push(rows[i].data[j].selected?0:rows[i].data[j].total/((rows[i].data[j].ind===' мл'||rows[i].data[j].ind===' г')?1000:1));
                            bufDataObj.sumTotal.push(rows[i].data[j].total/((rows[i].data[j].ind===' мл'||rows[i].data[j].ind===' г')?1000:1));
                            bufDataObj.ind.push(ind);
                        }
                    }
                }
            }
            for (let i=0; i<bufDataObj.name.length; i++) {
                let index = bufDataObj.ind[i];
                if ((bufDataObj.ind[i]===' кг')&&(bufDataObj.sumTotal[i]<1)) index=' г';
                else if ((bufDataObj.ind[i]===' л')&&(bufDataObj.sumTotal[i]<1)) index=' мл';
                recDataForSum.push({
                    name: (bufDataObj.name[i][0].toUpperCase()+bufDataObj.name[i].slice(1)), 
                    total: ((bufDataObj.ind[i]===' кг'||bufDataObj.ind[i]===' л')?(bufDataObj.sumTotal[i]<1?(bufDataObj.total[i]*1000):bufDataObj.total[i]):bufDataObj.total[i]),
                    sumTotal: ((bufDataObj.ind[i]===' кг'||bufDataObj.ind[i]===' л')?(bufDataObj.sumTotal[i]<1?(bufDataObj.sumTotal[i]*1000):bufDataObj.sumTotal[i]):bufDataObj.sumTotal[i]),
                    ind: index,
                    selected: (bufDataObj.total[i]===0?true:false)
                })
            }
            let listsBuf = {num: [], name: []};
            rows.map((item, list)=>{if (arrData.data.includes(item.id)) {listsBuf.num.push(rows[list].id); listsBuf.name.push(rows[list].name)}});
            return {lists: listsBuf, data: recDataForSum, id: 0, saved: false};
        }
        else return null
    }

    const handleClick = (event, list, index) => {
        console.log('click')
        const rIndex = index + ((page[list]||0) * rowsPerPage);
        let buf = copy(sumLists);
        buf[list].data[rIndex].selected = buf[list].data[rIndex].selected ? false : true;
        let bufR = copy(rows);
        sumLists[list].lists.num.map((row)=>{
            bufR.map((rowI)=>{
                let total = buf[list].data[rIndex].total/((buf[list].data[rIndex].ind===' г'||buf[list].data[rIndex].ind===' мл')?1000:1)
                if (row===rowI.id) rowI.data.map((item)=>{
                    if ((item.name===sumLists[list].data[index].name)&&((item.total/((item.ind===' г'||item.ind===' мл')?1000:1))<=(total))) {
                        total -= item.total/((item.ind===' г'||item.ind===' мл')?1000:1);
                        item.selected=buf[list].data[rIndex].selected;
                    }
                })
            })
        })
        setRows(bufR)
        setSumLists(buf);
    };

    const handleChangePage = (event, newPage, list) => {
        let bList = copy(page);
        bList[list]=newPage
        setPage(bList);
    };

    const handleChangeRowsPerPage = (event,list) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        let bPage = copy(page);
        bPage[list]=0;
        setPage(bPage);
    };

    const handleListDeleteBefore = (evt, list) => {
        if ((!user?.settings?.askToDel)&&(openDelW.sums)) handleListDelete(evt, list);
        else setOpenDelW({visible: true, result: false, answer: false, list: list, sums: true})
    }

    useEffect (()=>{
        if ((openDelW.answer)&&(openDelW.sums)) {
        if (openDelW.result) handleListDelete({}, openDelW.list);
        setOpenDelW({visible: false, result: false, answer: false, list: 0, sums: false})
        }
    }, [openDelW])

    const handleListDelete = (evt, list) => {
        setLoadingIndex(true);
        if (sumLists[list].saved) {
            let lBuf = api.sendPost({id: sumLists[list].id}, 'delSumList', `Bearer ${user.token}`);
            lBuf.then((res)=>{
                if (res.status===200) {
                    let buf = copy(sumLists);
                    buf.splice(list,1);
                    setSumLists(buf);
                    getInfoMessage('success', 'Удалено', false);
                }
                else {                    
                    getInfoMessage('error', 'Не удалено', false);
                }
            })
        }
    }

    const saveFunction = (list) => {
        setLoadingIndex(true);
        let send = api.sendPost(sumLists[list], 'saveSumList', `Bearer ${user.token}`);
        send.then((res)=>{
            console.log(res);
            if (res.status===200) {
                let buf = copy (sumLists);
                buf[list].id = res.data.id;
                buf[list].hash = res.data.hash;
                buf[list].saved = true;
                setSumLists(buf);
                getInfoMessage('success', 'Сохранено', false);
            }
            else getInfoMessage('error', 'Не сохранено', false);
        })
    }

    return (
        <Box sx={{ marginTop: 5 }}>
            {openDelW.visible&&<DelWindow openDelW={openDelW} setOpenDelW={setOpenDelW} />}
            {sumLists.map((data, list)=>{ return (
                <Grow in={true} timeout={1000 * (list+rows.length)} appear={user.settings.grow} key={list}><Accordion sx={{ boxShadow: 3 }} key={list}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        key={list}
                        id={'someSumClass'}
                        sx={{ display: 'flex', justifyContent: 'center', padding: (checkForTotal.visible?'0 6px':'0 16px') }}
                    >
                        <Typography>{`Совмещенный лист: ${data.lists.name.map((item)=>' '+item.trim())}`}</Typography>
                        <ButtonGroup variant="text" sx={{ margin: 0, padding: 0, display: 'flex', flexWrap: 'nowrap', justifyContent: 'center' }}>
                            {data.saved&&<IconButton sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={()=>{
                                setLoadingIndex(true);
                                let addr = new URL(window.location.href);
                                addr.searchParams.append('list', data.hash);
                                addr.searchParams.append('done', 'sumtList');
                                setGetUrl({visible: true, url: addr.href});
                                getInfoMessage('success', 'URL сгенерирован', false);
                            }}><ShareIcon /></IconButton>}
                            <IconButton sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={(event)=>saveFunction(list)} ><SaveIcon /></IconButton>
                            {user.settings.edit&&<IconButton sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={(event)=>handleListDeleteBefore(event, list)}><ClearOutlinedIcon /></IconButton>}
                        </ButtonGroup>
                    </AccordionSummary>
                    <AccordionDetails sx={{ boxShadow: 3, padding: (isMobile) ? 0 : '8px 16px 16px' }}>
                        <Box sx={{ margin: (isMobile)?0:'10px', boxShadow: 3 }}>
                            <Paper sx={{ width: '100%', mb: 2 }}>
                                <TableContainer>
                                    <Table
                                        size={'small'}
                                        sx={{ boxShadow: 3 }}
                                    >
                                        <EnhancedTableHead />
                                        <TableBody>
                                            {sumLists[list].data
                                                .slice(page[list] * rowsPerPage, (page[list]||0) * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                            const isItemSelected = row.selected;
                                            const labelId = `enhanced-table-checkbox-${index}`;

                                            return (
                                                <TableRow
                                                    hover
                                                    role="checkbox"
                                                    aria-checked={isItemSelected}
                                                    tabIndex={-1}
                                                    key={row.name+index}
                                                    selected={isItemSelected}
                                                >
                                                    <TableCell padding="checkbox">
                                                        <Checkbox
                                                            sx = {{ zoom: 1.3 }}
                                                            color="primary"
                                                            checked={isItemSelected}
                                                            onClick={(event) => handleClick(event, list, index)}
                                                        />
                                                    </TableCell>
                                                    <TableCell
                                                        component="th"
                                                        id={labelId}
                                                        scope="row"
                                                        padding="none"
                                                        sx = {{ textDecoration: row.selected ? 'line-through' : 'none' }}
                                                    >
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell align="right">{row.total + row.ind}</TableCell>
                                                    <TableCell align="right">{row.sumTotal + row.ind}</TableCell>
                                                </TableRow>
                                            );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TablePagination
                                    sx={{ padding: 0 }}
                                    rowsPerPageOptions={[5, 10, 25, 50]}
                                    component="div"
                                    count={sumLists[list].data.length}
                                    rowsPerPage={rowsPerPage}
                                    labelRowsPerPage={'Строк'}
                                    labelDisplayedRows={({ from, to, count, page }) => {return`${page+1} из ${Math.floor(count/rowsPerPage)+1}`}}
                                    page={(page[list] ? page[list] : 0)}
                                    onPageChange={(event, newPage)=>handleChangePage(event, newPage, list)}
                                    onRowsPerPageChange={(event, list)=>handleChangeRowsPerPage(event, list)}
                                />
                            </Paper>
                        </Box>
                    </AccordionDetails>
                </Accordion></Grow>
            )})}
        </Box>
    );
}