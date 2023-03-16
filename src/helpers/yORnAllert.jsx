import React, { useState, useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';

export default function YESorNO({ user, list, setList }) { 
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
    
    useEffect(() => {
        const onKeypress = e => {
            if (e.code==='Escape') {
                handleNO();
            }
            else if (e.code==='Enter') {
                handleYES();
            }
        };
      
        document.addEventListener('keydown', onKeypress);
      
        return () => {
          document.removeEventListener('keydown', onKeypress);
        };
    }, []);

    const handleNO = () => {
        let buf = {...list};
        buf.result = false;
        buf.ready = true;
        buf.visible = false;
        setList(buf)
    }

    const handleYES = () => {
        let buf = {...list};
        buf.result = true;
        buf.ready = true;
        buf.visible = false;
        setList(buf)
    }

    return (
        <Grow in={true} appear={user?.settings?.grow}>
            <Box
                sx={{ 
                    position: 'fixed',
                    left: 0,
                    top: 0,
                    zIndex: 10,
                    display: 'flex',
                    height: '100vh',
                    width: '100%',
                    alignItems: 'center',
                    flexDirection: width>height ? 'row' : 'column',
                    justifyContent: width>height ? 'center' : 'flex-start'
                }}>
            <Box sx={{ 
                    backgroundColor: 'black',
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    position: 'fixed',
                    opacity: 0.5, 
                    zIndex: 15
                }}>
            </Box>
            <Box component={Paper} sx={{
                    margin: '10px',
                    width: '340px',
                    padding: '30px',
                    border: '2px solid white',
                    boxShadow: '0 0 10px',
                    borderRadius: '50px', 
                    zIndex: 17
                }}>
                <Typography sx={{height: '50px'}}>{list.text}</Typography>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly'
                }}>            
                    <Button onClick={handleNO}>Нет</Button>
                    <Button onClick={handleYES} variant="contained">Да</Button>
                </Box>
            </Box>            
        </Box>
        </Grow>
    );
}