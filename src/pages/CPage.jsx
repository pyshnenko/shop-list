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
import SumListsGenerator from '../helpers/sumListsGenerator';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import {isMobile} from 'react-device-detect';
import DelWindow from '../helpers/deleteDialog';
import FormControl from '@mui/material/FormControl';
import ShareIcon from '@mui/icons-material/Share';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import {useSocketIO} from "../src/hooks/useSocketIO";

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

  const [ page, setPage ] = useState(arrGen(rows.length));
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [ newRow, setNewRow ] = useState({ name: '', total: '', ind: '' });
  const [ visibleWindowNewRow, setVisibleWindowNewRow ] = useState(false);
  const [ open, setOpen ] = useState({list: 0, visible: false, text: ''});
  const [ editedLists, setEditedLists ] = useState([]);
  const [ openDelW, setOpenDelW ] = useState({visible: false, result: false, answer: false, list: 0, sums: false});
  const [ width, setWidth ] = useState(window.innerWidth);
  const [ getUrl, setGetUrl ] = useState({visible: false, url: ''});
  const [ checkForTotal, setCheckForTotal ] = useState({visible: false, ready: false, data: []});
  const [ sumLists, setSumLists ] = useState([]);
  const [ expanded, setExpanded ] = useState(-1);
  const { sendIO } = useSocketIO({ expanded, setExpanded, sumLists, setSumLists });

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
        addr.searchParams.append('done', 'stList');
        setGetUrl({visible: true, url: addr.href});
        getInfoMessage('success', 'URL сгенерирован', false);
      })
  }

  const handleClick = (event, list, index) => {
    const rIndex = index + (page[list] * rowsPerPage);
    let buf = copy(rows);
    buf[list].data[rIndex].selected = buf[list].data[rIndex].selected ? false : true;
    setRows(buf);
    sendIO('edit', JSON.stringify(buf[list]));
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
    console.log(event.target.value);
    //setRowsPerPage(parseInt(event.target.value, 10));
    setRowsPerPage(event.target.value)
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
    sendIO('edit', JSON.stringify(buf[list]));
    let pp = Math.trunc((buf[list].data.length/rowsPerPage)-0.001);
    bpage[list]=(p<pp ? p : pp)
    setPage(bpage);
    if (!editedLists.includes(list)) {
        let buf1 = copy (editedLists);
        buf1.push(list);
        setEditedLists(buf1);
    }
  }

  const addButton = (evt, list) => {
    if ((newRow.name!=='')&&(newRow.total!=='')) {
      let buf = copy(rows);
      let rTotal = Number(newRow.total);
      let rInd = newRow.ind;
      if (newRow.ind===' г') { rTotal = Number(newRow.total)/1000; rInd = ' кг' }
      else if (newRow.ind===' мл') { rTotal = Number(newRow.total)/1000; rInd = ' л' }
      let trig = true;
      buf[list].data.map((row)=>{
        if (row.name.toLocaleLowerCase()===newRow.name.toLocaleLowerCase()) {
          trig=false; 
          if (row.ind===' мл') { row.ind = ' л'; row.total/=1000+rTotal}
          else if (row.ind===' г') { row.ind = ' кг'; row.total/=1000+rTotal}
          else { row.ind = rInd; row.total+=rTotal }
        }
      })
      if (trig) buf[list].data.push({name: newRow.name, total: rTotal, ind: rInd, del: 0, selected: false});
      setRows(buf);
      sendIO('edit', JSON.stringify(buf[list]));
      setNewRow({ name: '', total: '', ind: '' });
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
    if ((!user?.settings?.askToDel)&&(!openDelW.sums)) handleListDelete(evt, list);
    else setOpenDelW({visible: true, result: false, answer: false, list: list, sums: false})
  }

  useEffect (()=>{
    if ((openDelW.answer)&&(!openDelW.sums)) {
      if (openDelW.result) handleListDelete({}, openDelW.list);
      setOpenDelW({visible: false, result: false, answer: false, list: 0, sums: false})
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
        let buf2 = copy(checkForTotal);
        buf2.data.splice(list, 1);
        setCheckForTotal(buf2);
        getInfoMessage('success', 'Удалено', false);
        setVisibleWindowNewRow(false);
      }, (e)=>{
        console.log(e);
        getInfoMessage('error', 'Ошбка', false);
        setVisibleWindowNewRow(false);
      });
  }

  const handleCheckForTotal = (list) => {
    let id = rows[list].id;
    let buf = copy(checkForTotal);
    if (buf.data.includes(id)) buf.splice(buf.data.indexOf(id),1);
    else buf.data.push(id);
    buf.data.sort();
    setCheckForTotal(buf);
  }

  const handleChange = (list) => (evt, dat) => {
    setExpanded(dat ? list : -1);
    setNewRow({ name: '', total: '', ind: '' });
    sendIO(dat ? 'hi' : 'bye', rows[list].id);
  }

  return (
    <div>
      {getUrl.visible&&<GeneratingUrl user={user} getUrl={getUrl} setGetUrl={setGetUrl} />}
      {visibleWindowNewRow&&<NewRowsTab newRow={newRow} setNewRow={setNewRow} setVisibleWindowNewRow={setVisibleWindowNewRow} editedLists={editedLists} setEditedLists={setEditedLists} api={api} user={user} rows={rows} setRows={setRows}/>}
      {open.visible&&<DWindow editedLists={editedLists} setEditedLists={setEditedLists} open={open} setOpen={setOpen} rows={rows} setRows={setRows} user={user} />}
      {openDelW.visible&&<DelWindow openDelW={openDelW} setOpenDelW={setOpenDelW} />}
      {rows.map((data, list)=>{ return (
        <Grow in={true} timeout={1000 * list} appear={user.settings.grow} key={data.name+list}>
          <Accordion sx={{ boxShadow: 3 }} key={data.name+list} expanded={expanded===list} onChange={handleChange(list)} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              key={data.name+list}
              sx={{ display: 'flex', justifyContent: 'center', padding: (checkForTotal.visible?'0 6px':'0 16px') }}
            >
              <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                {checkForTotal.visible&&<Checkbox checked={checkForTotal.data.includes(data.id)} onClick={(event)=>handleCheckForTotal(list)} sx={{ '& .MuiSvgIcon-root': { fontSize: 28 }, margin: 0, padding: 0 }} />}
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
                                <TableCell align="right">{
                                  (row.ind===' л'&&row.total<1) ? 
                                    (row.total*1000+' мл') : 
                                    (row.ind===' кг'&&row.total<1) ? 
                                      (row.total*1000+' г') : row.total + (row.ind||'')
                                }</TableCell>
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
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={rows[list].data.length}
                    rowsPerPage={rowsPerPage}
                    labelRowsPerPage={'Строк'}
                    labelDisplayedRows={({ from, to, count, page }) => {return`${page+1} из ${Math.floor(count/rowsPerPage-0.0001)+1}`}}
                    page={(page[list] ? page[list] : 0)}
                    onPageChange={(event, newPage)=>handleChangePage(event, newPage, list)}
                    onRowsPerPageChange={(event, list)=>handleChangeRowsPerPage(event, list)}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'center'}}>
                    <TextField sx={{ margin: 1 }} label="Название" variant="standard" value={newRow.name} onChange={({ target }) => {
                          const resObj = {...newRow};
                          resObj.name = target.value;
                          setNewRow(resObj)}} />
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <TextField sx={{ margin: 1 }} label="Количество" variant="standard" value={newRow.total} onChange={({ target }) => {
                            const resObj = {...newRow};
                            let num = Number(target.value);
                            if (num) {
                              resObj.total = num;
                              setNewRow(resObj)}
                            else if (target.value[target.value.length-1]===','||target.value[target.value.length-1]==='.') {
                              resObj.total = target.value;
                              setNewRow(resObj);
                          }}} />
                      <FormControl variant="standard" sx={{ minWidth: 40, marginRight: '20px' }}>
                        <Select
                          sx={{ paddingTop: '20px'}}
                          value={newRow.ind}
                          onChange={({target})=>{
                            const resObj = {...newRow};
                            resObj.ind = target.value;
                            setNewRow(resObj)
                          }}
                        >
                          <MenuItem value=""> </MenuItem>
                          <MenuItem value={' кг'}>кг</MenuItem>
                          <MenuItem value={' г'}>г</MenuItem>
                          <MenuItem value={' л'}>л</MenuItem>
                          <MenuItem value={' мл'}>мл</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  </Box>
                  <Button
                    onClick={(event)=>addButton(event, list)}>
                    Добавить
                  </Button>
                </Paper>
              </Box>
            </AccordionDetails>    
          </Accordion>
        </Grow>
      )})}
      {user.hasOwnProperty('sumLists')&&(user?.sumLists.length!==0)&&<SumListsGenerator setGetUrl={setGetUrl} rows={rows} setRows={setRows} api={api} user={user} checkForTotal={checkForTotal} setCheckForTotal={setCheckForTotal} openDelW={openDelW} setOpenDelW={setOpenDelW} sumLists={sumLists} setSumLists={setSumLists} />}
      <DButton checkForTotal={checkForTotal} setCheckForTotal={setCheckForTotal} trigUnload={trigUnload} timer={timer} api={api} rows={rows} user={user} setUser={setUser} setVisibleWindowNewRow={setVisibleWindowNewRow} editedLists={editedLists} setEditedLists={setEditedLists} />
    </div>
  );
}