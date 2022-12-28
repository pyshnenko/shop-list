import React, { useState, useEffect } from 'react';
import copy from 'fast-copy';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SaveIcon from '@mui/icons-material/Save';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
//import { blueGrey, green } from '@mui/material/colors';
//import PropTypes from 'prop-types';
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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import block from './../mech/apiTimer';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import NewRowsTab from '../helpers/newRowsTab'

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

function EnhancedTableHead(props) {
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

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2)
  },
}));

export default function PlaygroundSpeedDial({ api, user, mode, setMode }) {

  const [ page, setPage ] = useState(0);
  const [ rowsPerPage, setRowsPerPage ] = useState(5);
  const [newRow, setNewRow] = useState({ name: '', total: '' });
  const [ rows, setRows ] = useState([]);
  const [open, setOpen] = useState({list: 0, visible: false, text: ''});
  const [opent, setOpent] = useState('');
  const [width, setWidth] = useState(window.innerWidth);
  const [ openNewRowWindow, setOpenNewRowWindow ] = useState({visible: false, text: ''});

  const [height, setHeight] = useState(window.innerHeight);

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

  useEffect( () => {    
    console.log("useEffect");
    const fetchData = async () => {
      const result = await api.sendPost({}, 'lists', `Bearer ${user.token}`);
      //console.log(result.data.lists);
      if (typeof(result.data.lists)==='string') setRows([]);
      else setRows(result.data.lists);
    }
    if (block()) fetchData()
  },
  []);

  const actions = [
    { icon: <SaveIcon />, name: 'Сохранить', mode: 'save' },
    { icon: mode.edit ? <ModeEditOutlineOutlinedIcon /> : <EditOffOutlinedIcon />, name: 'Редактировать', mode: mode.edit ? 'edit' : 'notedit' },
    { icon: <SpeedDialIcon />, name: 'Создать', mode: 'create' },
  ];

  const handleClick = (event, list, index) => {
    const rIndex = index + (page * rowsPerPage);
    let buf = copy(rows);
    setRows();
    buf[list].data[rIndex].selected = buf[list].data[rIndex].selected ? false : true;
    setRows(buf);
    console.log(rows[list].data[rIndex])
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDelClick = async (evt, list, ind) => {
    const index = ind + (page * rowsPerPage);
    let p = page;
    let buf = {};
    buf = copy(rows);
    setRows()
    buf[list].data.splice(index, 1);
    setRows(buf);
    let pp = Math.trunc((rows[list].data.length/rowsPerPage)-0.0001)
    setPage(pp>p ? p : pp);
  }

  const addButton = (evt, list) => {
    if ((newRow.name!=='')&&(newRow.total!=='')) {
      let buf = copy(rows);
      buf[list].data.push({name: newRow.name, total: newRow.total, del: 0});
      setRows(buf);
      setNewRow({name: '', total: '' });
      setPage(Math.trunc((rows[list].data.length/rowsPerPage)-0.0001));
    }
  }

  const handleListEdit = (evt, list) => {
    setOpen({ list: list, visible: true })
    console.log(list);
  }

  const handleListDelete = (evt, list) => {
    console.log(list);
    console.log(`id: ${rows[list].id}`);
    let buf = copy(rows);
    buf.splice(list,1);
    setRows(buf);
    //api.sendDel({}, 'lists', `Bearer ${user.token}`)
  }

  const handleClose = () => {
    setOpen({ list: 0, visible: false, text: ''})
  }

  const handleDialClick = (evt, name) => {
    console.log(name)
    if (name==='notedit') {
        let buf = {...mode}
        buf.edit=true;
        setMode(buf)
    }
    if (name==='edit') {
        let buf = {...mode}
        buf.edit=false;
        setMode(buf)
    }
    if (name==='create') {
        setOpenNewRowWindow({visible: true, text: ''})
    }
    console.log(mode)
  }

  const handleListNameEdit = (evt) => {
    console.log(evt.target.value);
    let buf = copy(rows);
    buf[open.list].name=opent;
    setRows(buf);
    setOpen({ list: 0, visible: false, text: ''});
  }

  const DialogM = () => {
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
            onChange={(event)=>setOpent(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Отменить</Button>
          <Button onClick={(event)=>handleListNameEdit(event)} variant="contained">Принять</Button>
        </DialogActions>
      </Dialog>
    )
  }

  return (
    <div>
        {openNewRowWindow.visible&&<NewRowsTab user={user} rows={rows} setRows={setRows} setOpenNewRowWindow={setOpenNewRowWindow}/>}
        <DialogM />
      {rows.map((data, list)=>{ return (
      <Accordion sx={{ boxShadow: 3 }} key={data.name}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          key={data.name}
          sx={{ display: 'flex', justifyContent: 'center' }}
          justifyContent="center"
        >
          <Typography>{data.name}</Typography>
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
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row, index) => {
                        const isItemSelected = row.selected;
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                sx = {{ zoom: 1.3 }}
                                color="primary"
                                checked={isItemSelected}
                                onClick={(event) => handleClick(event, list, index)}
                                inputProps={{
                                  'aria-labelledby': labelId,
                                }}
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
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
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
                onClick={(event)=>addButton(event)}>
                Добавить
              </Button>
            </Paper>
          </Box>
        </AccordionDetails>    
      </Accordion>
      )})}
      <Box>
        <Box sx={{ boxShadow: 3, position: 'fixed', left: `${width>600 ? width-30 : width-15}px`, top: `${height>600 ? height-30 : height-15}px` }}>
          <StyledSpeedDial 
              sx={{  }} 
              ariaLabel="Кнопка"
              icon={<SpeedDialIcon />}
              direction='up'
          >
            {actions.map((action, index) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={(event)=>handleDialClick(event, action.mode)}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </Box>
    </div>
  );
}