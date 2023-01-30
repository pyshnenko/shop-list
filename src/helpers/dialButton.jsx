import React, { useState, useEffect } from 'react';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SaveIcon from '@mui/icons-material/Save';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import { styled } from '@mui/material/styles';
import { setLoadingIndex } from '../helpers/leftInfoWindow';

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

export default function SMess({timer, trigUnload, api, rows, user, setUser, setVisibleWindowNewRow, editedLists, setEditedLists }) {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

    /*useEffect(()=>{
        if (trigUnload.current) {
            trigUnload.current=false;
            document.addEventListener('unload', handleDialClick({}, 'save'));
          
            return () => {
                document.removeEventListener('unload', handleDialClick({}, 'save'));
            };
        }
    }, []);*/

    useEffect(() => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
        if (user?.settings?.autosave) 
            timer.current = setTimeout(()=> {
                if (editedLists.length) handleDialClick({}, 'save');
            }, 30000)
    }, [rows])

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

    const actions = [
        { icon: <SaveIcon />, name: 'Сохранить', mode: 'save' },
        { icon: user?.settings?.edit ? <ModeEditOutlineOutlinedIcon /> : <EditOffOutlinedIcon />, name: 'Редактировать', mode: user?.settings?.edit ? 'edit' : 'notedit' },
        { icon: <SpeedDialIcon />, name: 'Создать', mode: 'create' },
    ];

    const handleDialClick = async (evt, name) => {
        if (name==='notedit') {
            let buf = {...user}
            buf.settings.edit=true;
            setUser(buf)
        }
        if (name==='edit') {
            let buf = {...user}
            buf.settings.edit=false;
            setUser(buf)
        }
        if (name==='create') {
          setVisibleWindowNewRow(true);
            //api.sendPost()
        }
        if (name==='save'){
            setLoadingIndex(true);
            for (let i=0; i<editedLists.length; i++)
                await api.sendPost({list: rows[editedLists[i]]}, 'updList', `Bearer ${user.token}`);
            setEditedLists([]);
            setLoadingIndex(false);
        }
      }
    
    return (
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
    )
}