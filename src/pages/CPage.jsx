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
import PropTypes from 'prop-types';
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

const actions = [
  { icon: <SaveIcon />, name: 'Сохранить' },
  { icon: <ModeEditOutlineOutlinedIcon />, name: 'Редактировать' },
  { icon: <SpeedDialIcon />, name: 'Создать' },
];
let aaa = true;

const resultApi = async (api) => {
  return await api.sendPost({ headers: {token: 'token', make: 'listsList'}})
}
export default function PlaygroundSpeedDial({ api, user }) {

  const [ answer, setAnswer ] = useState()
  const [ page, setPage ] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(5);
  const [newRow, setNewRow] = React.useState({ name: '', total: '' });
  const [ rows, setRows ] = useState([]);
  if (aaa) {
    //setRows(resultApi(api));
    console.log(rows)
    aaa=false;
  }

  useEffect( () => {    
    console.log("useEffect");
    const fetchData = async () => {
      const result = await api.sendPost({ headers: {token: 'token', make: 'listsList'}});
      console.log(result);
      setRows(result);
    }
    fetchData()
    //setRows(fetchData())
  },
  []);

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

  return (
    <div>
      {rows.map((data, list)=>{ return (
      <Accordion key={data.name}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          key={data.name}
        >
          <Typography>{data.name}</Typography>
        </AccordionSummary>        
        <AccordionDetails>
          <Box sx={{ margin: '10px' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                <Table
                  aria-labelledby="tableTitle"
                  size={'small'}
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
      <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
        <Box sx={{ position: 'relative', height: "70vh" }}>
          <StyledSpeedDial 
              sx={{  }} 
              ariaLabel="Кнопка"
              icon={<SpeedDialIcon />}
              direction='up'
          >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
              />
            ))}
          </StyledSpeedDial>
        </Box>
      </Box>
    </div>
  );
}