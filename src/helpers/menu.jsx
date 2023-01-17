import * as React from 'react';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';

export default function AccountMenu({ user, setUser, state, setState }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (evt, ind) => {
    console.log(ind);
    if (ind==='exit') {
      setUser({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});
      setState({login: false, state: ''});
      localStorage.clear();
    }
    else if (ind==='lists') {
      let sState={...state};
      sState.state='centralPage';
      setState(sState)
    }
    else if (ind==='openlists') {
      let sState={...state};
      sState.state='unLogin';
      setState(sState)
    }
    else if (ind==='profile') {
      let sState={...state};
      sState.state='profile';
      setState(sState)
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <Avatar sx={{ width: 32, height: 32 }}>{(user.first_name[0]+user.last_name[0]).toLocaleUpperCase()}</Avatar>
          </IconButton>
        </Tooltip>
        <Typography sx={{ minWidth: 100 }}>{user.login}</Typography>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: '87%',
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        <MenuItem onClick={(event)=> {handleMenuClick(event, 'profile')}}>
          <Avatar /> Профиль
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'lists')}}>
          <InsertDriveFileIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Мои списки
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'openlists')}}>
          <SearchIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Поиск списка
        </MenuItem>
        <Divider />
        <MenuItem onClick={(event)=> {handleMenuClick(event,'addfriend')}}>
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Добавить друга
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'settings')}}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Настройки
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'exit')}}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Выход
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}