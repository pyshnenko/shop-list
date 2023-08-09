import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { setLoadingIndex } from '../helpers/leftInfoWindow';
import Grow from '@mui/material/Grow';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { blueGrey } from '@mui/material/colors';
import Paper from '@mui/material/Paper';

export default function GenUrl({ user, getUrl, setGetUrl }) {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
      const onKeypress = e => {
          if (e.code==='Escape') {
              handleClosed();
          }
      };
    
      document.addEventListener('keydown', onKeypress);
    
      return () => {
        document.removeEventListener('keydown', onKeypress);
      };
    }, []);

    useEffect(() => {
      const handleResize = (event) => {
        setWidth(event.target.innerWidth);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    const handleClosed = async (evt) => {
        setGetUrl({visible: false, url: ''});
        setLoadingIndex(false);
    }

    const handleCopy = async (evt) => {
      let textarea = document.createElement("textarea");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      textarea.textContent = getUrl.url;
 
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    
    return (
      <Grow in={true} appear={user.settings.grow}><Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ position: 'fixed', width: '100vw', height: '100vh', opacity: '0.7', bgcolor: 'black', zIndex: 10 }}></Box>
        <Box component={Paper} sx={{ padding: '40px',
            position: 'fixed', top: '40vh', zIndex: '9999', boxShadow: 3, borderRadius: '50px' }}>
          <TextField sx={{ width: '300px', boxShadow: 3 }} 
              label='Введи название' value={getUrl.url} />
          <Box sx={{ margin: 0}}>
            <Button color="success" sx={{ margin: '15px 0px 0px 10px' }}
                onClick={(event)=>handleCopy(event)}>Копировать</Button>
            <Button color="primary" sx={{ margin: '15px 0px 0px 10px' }}
                onClick={(event)=>handleClosed(event)}>Назад</Button>
          </Box>
        </Box>
      </Box></Grow>
    )
}