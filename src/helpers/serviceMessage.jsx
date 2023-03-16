import React from 'react';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';

export default function SMess({openNewRowWindow ,setOpenNewRowWindow}) {

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpenNewRowWindow({ visible: false, error: false, success: false, text: '' })
    };

    return (
        <Stack sx={{ width: '20%', minWidth: '200px', position: 'fixed', left: '20px', top: '87vh', zIndex: 9999 }} spacing={2}>  
            <Snackbar open={openNewRowWindow.success} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    {openNewRowWindow.text}
                </Alert>
            </Snackbar>
            <Snackbar open={openNewRowWindow.error} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {openNewRowWindow.text}
                </Alert>
            </Snackbar>
        </Stack>
    )
}