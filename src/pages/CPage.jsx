import React, { useState } from 'react';
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
//import Dialog from '@mui/material/Dialog';
//import DialogActions from '@mui/material/DialogActions';
//import DialogContent from '@mui/material/DialogContent';
//import DialogTitle from '@mui/material/DialogTitle';
import NewRowsTab from '../helpers/newRowsTab';
import DButton from '../helpers/dialButton';
import DWindow from '../helpers/dialogWindow';

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

export default function PlaygroundSpeedDial({ rows, setRows, api, user, mode, setMode, setLoadingInd, openNewRowWindow, setOpenNewRowWindow }) {

  const arrGen = (length) => {
    let buf = [];
    for (let i=0; i<length; i++) buf.push(0);
    return buf;
  }

  const [ page, setPage ] = useState(arrGen(rows.length));
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [newRow, setNewRow] = useState({ name: '', total: '' });
  const [open, setOpen] = useState({list: 0, visible: false, text: ''});
  //const [opent, setOpent] = useState('');
  const [ editedLists, setEditedLists] = useState([]);

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
    console.log(list);
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
        if ((newRow.name!=='')&&(newRow.total!=='')) {
            let buf = copy(rows);
            buf[list].data.push({name: newRow.name, total: newRow.total, del: 0, selected: false});
            setRows(buf);
            setNewRow({name: '', total: '' });
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
    setOpen({ list: list, visible: true, text: '' })
    console.log(list);
  }

  const handleListDelete = (evt, list) => {
    setLoadingInd(true);
    console.log(list);
    console.log(`id: ${rows[list].id}`);
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
        setOpenNewRowWindow({visible: false, text: 'Удалено', error: false, success: true});
        setLoadingInd(false);
      }, (e)=>{
        console.log(e);
        setOpenNewRowWindow({visible: false, text: 'Ошбка', error: true, success: false});
        setLoadingInd(false);
      });
  }

  /*const handleClose = () => {
    setOpen({ list: 0, visible: false, text: ''})
  }*/

  /*const handleListNameEdit = (evt) => {
    console.log(evt);
    console.log(Object.keys(evt.target));
    let buf = copy(rows);
    buf[open.list].name=opent;
    setRows(buf);
    setOpen({ list: 0, visible: false, text: ''});
  }*/

  /*const DialogM = () => {
    return (
        <Dialog open={open.visible} onClose={handleClose}>
        <DialogTitle>Введи новое название</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Новое название списка"
            fullWidth
            variant="standard"
            name="tttext"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button onClick={(event)=>handleListNameEdit(event)} variant="contained">Принять</Button>
        </DialogActions>
      </Dialog>
    )
  }*/

  return (
    <div>
      {openNewRowWindow.visible&&<NewRowsTab setLoadingInd={setLoadingInd} editedLists={editedLists} setEditedLists={setEditedLists} api={api} user={user} rows={rows} setRows={setRows} setOpenNewRowWindow={setOpenNewRowWindow}/>}
      {open.visible&&<DWindow editedLists={editedLists} setEditedLists={setEditedLists} open={open} setOpen={setOpen} rows={rows} setRows={setRows} user={user} />}
      {rows.map((data, list)=>{ return (
      <Accordion sx={{ boxShadow: 3 }} key={data.name+list}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          key={data.name+list}
          sx={{ display: 'flex', justifyContent: 'center' }}
        >
          <Typography>{`${data.name} - ${data.author} - ID: ${data.id}`}</Typography>
          {mode.edit&&<Box sx={{ margin: 0, padding: 0}}>
            <Button sx={{ padding: 0, margin: 0 }} onClick={(event)=>handleListEdit(event, list)}><ModeEditOutlineOutlinedIcon /></Button>
            <Button sx={{ padding: 0, margin: 0 }} onClick={(event)=>handleListDelete(event, list)}><ClearOutlinedIcon /></Button>
          </Box>}
        </AccordionSummary>        
        <AccordionDetails sx={{ boxShadow: 3 }}>
          <Box sx={{ margin: '10px', boxShadow: 3 }}>
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
                <TextField sx={{ margin: 2 }} label="Название" variant="standard" value={newRow.name} onChange={({ target }) => {
                      const resObj = { ...newRow };
                      resObj.name = target.value;
                      setNewRow(resObj)}} />
                <TextField sx={{ margin: 2 }} label="Количество" variant="standard" value={newRow.total} onChange={({ target }) => {
                      const resObj = { ...newRow };
                      resObj.total = target.value;
                      setNewRow(resObj)}} />
              </Box>
              <Button
                onClick={(event)=>addButton(event, list)}>
                Добавить
              </Button>
            </Paper>
          </Box>
        </AccordionDetails>    
      </Accordion>
      )})}
      <DButton setLoadingInd={setLoadingInd} api={api} mode={mode} setMode={setMode} rows={rows} user={user} setOpenNewRowWindow={setOpenNewRowWindow} editedLists={editedLists} />
    </div>
  );
}