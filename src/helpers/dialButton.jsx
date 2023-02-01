import React, { useState, useEffect } from 'react';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SaveIcon from '@mui/icons-material/Save';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import { styled } from '@mui/material/styles';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import TaskIcon from '@mui/icons-material/Task';
import CancelIcon from '@mui/icons-material/Cancel';
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

export default function SMess({ checkForTotal, setCheckForTotal, timer, trigUnload, api, rows, user, setUser, setVisibleWindowNewRow, editedLists, setEditedLists }) {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

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
        { icon: <NoteAddIcon />, name: 'Создать общий список', mode: 'checkForTotal' },
        { icon: <SpeedDialIcon />, name: 'Создать', mode: 'create' },
    ];

    const actionsV = [
        { icon: <TaskIcon />, name: 'Создать общий список', mode: 'CreateTotal' },
        { icon: <CancelIcon />, name: 'Отменить', mode: 'cancel' },
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
        if (name==='checkForTotal') {
            let buf = {...checkForTotal};
            buf.visible=true;
            setCheckForTotal(buf);
        }
        if (name==='cancel') {
            let buf = {...checkForTotal};
            buf.visible=false;
            setCheckForTotal(buf);
        }
        if (name==='CreateTotal') {
            let buf = {...checkForTotal};
            buf.visible=false;
            buf.ready=true;
            setCheckForTotal(buf);
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
              {checkForTotal.visible ?  
                actionsV.map((action, index) => (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={(event)=>handleDialClick(event, action.mode)}
                  />)) :
                actions.map((action, index) => (
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