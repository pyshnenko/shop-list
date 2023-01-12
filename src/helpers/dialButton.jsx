import React, { useState, useEffect } from 'react';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SaveIcon from '@mui/icons-material/Save';
import EditOffOutlinedIcon from '@mui/icons-material/EditOffOutlined';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import { styled } from '@mui/material/styles';

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

export default function SMess({api, mode, setMode, rows, user, setOpenNewRowWindow, editedLists, setLoadingInd}) {
    const [height, setHeight] = useState(window.innerHeight);
    const [width, setWidth] = useState(window.innerWidth);

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
        { icon: mode.edit ? <ModeEditOutlineOutlinedIcon /> : <EditOffOutlinedIcon />, name: 'Редактировать', mode: mode.edit ? 'edit' : 'notedit' },
        { icon: <SpeedDialIcon />, name: 'Создать', mode: 'create' },
    ];

    const handleDialClick = async (evt, name) => {
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
            setOpenNewRowWindow({visible: true, text: '', error: false, success: false});
            //api.sendPost()
        }
        if (name==='save'){
            setLoadingInd(true);
            console.log('save');
            for (let i=0; i<editedLists.length; i++)
                console.log(await api.sendPost({list: rows[editedLists[i]]}, 'updList', `Bearer ${user.token}`));
            setLoadingInd(false);
        }
        console.log(mode)
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