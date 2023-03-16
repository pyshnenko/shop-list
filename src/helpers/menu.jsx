import React, { useEffect } from 'react';
import { grey } from '@mui/material/colors';
import Badge from '@mui/material/Badge';
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
import MovieIcon from '@mui/icons-material/Movie';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export default function AccountMenu({ user, setUser, state, setState, setRows, setSerials, setTrening }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const onKeypress = e => {
        if (e.code==='Escape') {
          setAnchorEl(null);
        }
    };
  
    document.addEventListener('keydown', onKeypress);
  
    return () => {
      document.removeEventListener('keydown', onKeypress);
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuClick = (evt, ind) => {
    if (ind==='exit') {
      setUser({login: '', key: '', token: '', atoken: '', role: '', name: '', last_name: '', first_name: '', email: ''});
      setState({login: false, state: ''});
      setRows([]);
      setSerials({});
      setTrening({});
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
    else if (ind==='addfriend') {
      let sState={...state};
      sState.state='addfriend';
      setState(sState)
    }
    else if (ind==='settings') {
      let sState={...state};
      sState.state='settings';
      setState(sState)
    }
    else if (ind==='serials') {
      let sState={...state};
      sState.state='serials';
      setState(sState)
    }
    else if (ind==='trening') {
      let sState={...state};
      sState.state='trening';
      setState(sState)
    }
  };
  return (
    <React.Fragment>
      <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center', zIndex: 900000 }}>
        <Tooltip title="Account settings">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 2 }}
          >
            <Badge color="primary" variant="dot" invisible={!(user.askToAdd&&user.askToAdd.length!==0)}>
              <Avatar
                alt={(user.first_name+' '+user.last_name).toLocaleUpperCase()}
                src={user.avatar ? user.avatar : ''}
                sx={{ width: 32, height: 32 }}
              >{user.avatar ? '' : ((user.name ? user.name[0] : 'ъ')+(user.last_name ? user.last_name[0] : 'Ъ')).toLocaleUpperCase()}</Avatar>
            </Badge>
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
          <Badge anchorOrigin={{ vertical: 'top', horizontal: 'left' }} color="primary" variant="dot" invisible={!(user.askToAdd&&user.askToAdd.length!==0)}><Avatar /></Badge> Профиль
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'lists')}}>
          <InsertDriveFileIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Мои списки
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'openlists')}}>
          <SearchIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Поиск списка
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'serials')}}>
          <MovieIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Сериальчики
        </MenuItem>
        <MenuItem onClick={(event)=> {handleMenuClick(event,'trening')}}>
          <FitnessCenterIcon sx={{ marginLeft: '-7px', width: 42, height: 32, color: grey[500] }} /> Тренировочки
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