import React, { useState, useEffect, useRef } from 'react';
import copy from 'fast-copy';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import NewRowsTab from '../helpers/newRowsTab';
import DButton from '../helpers/dialButton';
import DWindow from '../helpers/dialogWindow';
import GeneratingUrl from '../helpers/generatingUrl';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import {isMobile} from 'react-device-detect';
import DelWindow from '../helpers/deleteDialog';
import FormControl from '@mui/material/FormControl';
import ShareIcon from '@mui/icons-material/Share';

const addresU = '/build';

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
    label: 'Количество',
  },
  {
    id: 'delete',
    numeric: false,
    disablePadding: true,
    label: 'Удалить',
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

export default function PlaygroundSpeedDial({ rows, setRows, api, user, setUser }) {

  const arrGen = (length) => {
    let buf = [];
    for (let i=0; i<length; i++) buf.push(0);
    return buf;
  }

  const arrGen2 = (length) => {
    let buf = [];
    for (let i=0; i<length; i++) buf.push({ name: '', total: '' });
    return buf;
  }

  const [ page, setPage ] = useState(arrGen(rows.length));
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [ newRow, setNewRow ] = useState(arrGen2(rows.length));
  const [ visibleWindowNewRow, setVisibleWindowNewRow ] = useState(false);
  const [ open, setOpen ] = useState({list: 0, visible: false, text: ''});
  const [ editedLists, setEditedLists ] = useState([]);
  const [ openDelW, setOpenDelW ] = useState({visible: false, result: false, answer: false, list: 0});
  const [ width, setWidth ] = useState(window.innerWidth);
  const [ getUrl, setGetUrl ] = useState({visible: false, url: ''});

  const timer = useRef();
  const trigUnload = useRef(true);  

  useEffect(() => {
    const handleResize = (event) => {
      setWidth(event.target.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleShare = async (evt, list) => {
    setLoadingIndex(true);
    let id = Number(rows[list].id);
    api.sendPost({id: id}, 'setHash', `Bearer ${user.token}`)
      .then((res)=>{
        let addr = new URL(window.location.href);
        addr.searchParams.append('list', res.data.hash);
        setGetUrl({visible: true, url: addr.href});
        getInfoMessage('success', 'URL сгенерирован', false);
      })
  }

  const handleClick = (event, list, index) => {
    const rIndex = index + (page[list] * rowsPerPage);
    let buf = copy(rows);
    buf[list].data[rIndex].selected = buf[list].data[rIndex].selected ? false : true;
    setRows(buf);
    if (!editedLists.includes(list)) {
        buf = copy(editedLists);
        buf.push(list);
        setEditedLists(buf);
    }
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

  const handleDelClick = async (evt, list, ind) => {
    const index = ind + (page[list] * rowsPerPage);
    let bpage = copy(page);
    let p = page[list];
    let buf = {};
    buf = copy(rows);
    setRows()
    buf[list].data.splice(index, 1);
    setRows(buf);
    let pp = Math.trunc((rows[list].data.length/rowsPerPage)-0.001);
    bpage[list]=(p<pp ? p : pp)
    setPage(bpage);
    if (!editedLists.includes(list)) {
        let buf1 = copy (editedLists);
        buf1.push(list);
        setEditedLists(buf1);
    }
  }

    const addButton = (evt, list) => {
        if ((newRow[list].name!=='')&&(newRow[list].total!=='')) {
            let buf = copy(rows);
            buf[list].data.push({name: newRow[list].name, total: newRow[list].total, del: 0, selected: false});
            setRows(buf);
            let buf2 = copy(newRow);
            buf2[list]={name: '', total: '' }
            setNewRow(buf2);
            let bPage = copy(page);
            bPage[list] = Math.trunc((rows[list].data.length/rowsPerPage));
            setPage(bPage);
            if (!editedLists.includes(list)) {
                buf = copy (editedLists);
                buf.push(list);
                setEditedLists(buf);
            }
        }
    }

  const handleListEdit = (evt, list) => {
    setOpen({ list: list, visible: true, text: '' });
  }

  const handleListDeleteBefore = (evt, list) => {
    if (!user?.settings?.askToDel) handleListDelete(evt, list);
    else setOpenDelW({visible: true, result: false, answer: false, list: list})
  }

  useEffect (()=>{
    if (openDelW.answer) {
      if (openDelW.result) handleListDelete({}, openDelW.list);
      setOpenDelW({visible: false, result: false, answer: false, list: 0})
    }
  }, [openDelW])

  const handleListDelete = (evt, list) => {
    setLoadingIndex(true);
    let id = Number(rows[list].id);
    api.sendPost({id: id}, 'delList', `Bearer ${user.token}`)
      .then(()=>{        
        let buf = copy(rows);
        buf.splice(list,1);
        setRows(buf);    
        if (!editedLists.includes(list)) {
            buf = copy (editedLists);
            buf.push(list);
            setEditedLists(buf);
        }
        getInfoMessage('success', 'Удалено', false);
        setVisibleWindowNewRow(false);
      }, (e)=>{
        console.log(e);
        getInfoMessage('error', 'Ошбка', false);
        setVisibleWindowNewRow(false);
      });
  }

  return (
    <div>
      {getUrl.visible&&<GeneratingUrl user={user} getUrl={getUrl} setGetUrl={setGetUrl} />}
      {visibleWindowNewRow&&<NewRowsTab newRow={newRow} setNewRow={setNewRow} setVisibleWindowNewRow={setVisibleWindowNewRow} editedLists={editedLists} setEditedLists={setEditedLists} api={api} user={user} rows={rows} setRows={setRows}/>}
      {open.visible&&<DWindow editedLists={editedLists} setEditedLists={setEditedLists} open={open} setOpen={setOpen} rows={rows} setRows={setRows} user={user} />}
      {openDelW.visible&&<DelWindow openDelW={openDelW} setOpenDelW={setOpenDelW} />}
      {rows.map((data, list)=>{ return (
      <Grow in={true} timeout={1000 * list} appear={user.settings.grow} key={data.name+list}><Accordion sx={{ boxShadow: 3 }} key={data.name+list}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          key={data.name+list}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <Typography>{`${data.name} - `}</Typography>
            <Typography>{`${data.author} - `}</Typography>
            <Typography>{`ID: ${data.id}`}</Typography>
          </Box>
          {user.settings.edit&&<Box sx={{ margin: 0, padding: 0, display: 'flex', flexWrap: 'nowrap'}}>
            <Button sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={(event)=>handleShare(event, list)}><ShareIcon /></Button>
            <Button sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={(event)=>handleListEdit(event, list)}><ModeEditOutlineOutlinedIcon /></Button>
            <Button sx={{ padding: 0, margin: 0, minWidth: width<400?'35px':'50px' }} onClick={(event)=>handleListDeleteBefore(event, list)}><ClearOutlinedIcon /></Button>
          </Box>}
        </AccordionSummary>
        <AccordionDetails sx={{ boxShadow: 3, padding: (isMobile) ? 0 : '8px 16px 16px' }}>
          <Box sx={{ margin: (isMobile)?0:'10px', boxShadow: 3 }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                <Table
                  aria-labelledby="tableTitle"
                  size={'small'}
                  sx={{ boxShadow: 3 }}
                >
                  <EnhancedTableHead />
                  <TableBody>
                    {rows[list].data
                      .slice(page[list] * rowsPerPage, page[list] * rowsPerPage + rowsPerPage)
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
                            <TableCell align="right">{row.total}</TableCell>
                            <TableCell align="right">
                              <IconButton onClick={(event) => handleDelClick(event, list, index)}>
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                sx={{ padding: 0 }}
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows[list].data.length}
                rowsPerPage={rowsPerPage}
                page={(page[list] ? page[list] : page[list]===0 ? 0 : 0)}
                onPageChange={(event, newPage)=>handleChangePage(event, newPage, list)}
                onRowsPerPageChange={(event, list)=>handleChangeRowsPerPage(event, list)}
              />
              <Box>          
                <TextField sx={{ margin: 2 }} label="Название" variant="standard" value={newRow[list].name} onChange={({ target }) => {
                      const resObj = copy(newRow);
                      resObj[list].name = target.value;
                      setNewRow(resObj)}} />
                <TextField sx={{ margin: 2 }} label="Количество" variant="standard" value={newRow[list].total} onChange={({ target }) => {
                      const resObj = copy(newRow);
                      resObj[list].total = target.value;
                      setNewRow(resObj)}} />
              </Box>
              <Button
                onClick={(event)=>addButton(event, list)}>
                Добавить
              </Button>
            </Paper>
          </Box>
        </AccordionDetails>    
      </Accordion></Grow>
      )})}
      <DButton trigUnload={trigUnload} timer={timer} api={api} rows={rows} user={user} setUser={setUser} setVisibleWindowNewRow={setVisibleWindowNewRow} editedLists={editedLists} setEditedLists={setEditedLists} />
    </div>
  );
}