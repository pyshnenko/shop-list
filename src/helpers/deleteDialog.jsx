import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function AlertDialog({openDelW, setOpenDelW}) {

  const handleClose = (res) => {
    setOpenDelW({...openDelW, visible: false, result: res, answer: true});
  };

  return (
    <div>
    {console.log('del2')}
      <Dialog
        open={true}
        onClose={(event)=>handleClose(false)}
      >
        <DialogTitle>
          {"Вы уверены?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Удаляем этот список?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={(event)=>handleClose(false)}>Нет</Button>
          <Button onClick={(event)=>handleClose(true)} autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}