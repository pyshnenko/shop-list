import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { blueGrey } from '@mui/material/colors';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Paper from '@mui/material/Paper';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const steps = [
    {
      label: 'Придумай логин'
    },
    {
      label: 'Придумай пароль'
    },
    {
      label: 'Расскажи немного о себе'
    },
    {
      label: 'Введи свою почту'
    },
  ];

export default function Registration({ data, setData, state, setState, user, setUser, api, setSerials, setRows }) {
    const windowInnerWidth = window.innerWidth;
    const windowInnerHeight = window.innerHeight;
    const horiz = windowInnerWidth/windowInnerHeight>1;

    let [ activeStep, setActiveStep ] = React.useState(0);
    let [ checkPass, setCheckPass ] = useState({first: '', seckond: '', error: false, errorL: false, errorE: false})
    let [ otherData, setOtherData ] = useState({name: '', lastName: '', seckondName: '', email: ''});
    let [ open, setOpen ] = useState({succes: false, error: false, time: 5000, text: ''});

    const textFields = (ind) => {
        if (ind === 0) return (
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} name='login' label="Логин" value={data.log} variant="outlined"
                onChange={({ target }) => {
                    let resObj = { ...data };
                    resObj.log = target.value;
                    setData(resObj)
                    if (checkPass.errorL) {
                        resObj = { ...checkPass };
                        resObj.errorL = false;
                        setCheckPass(resObj)
                    }
            }} error={checkPass.errorL} />
        )
        else if (ind===1) return (
            <div>{checkPass.error&&<h4 id='errorText'>Пароли не введены или не совпадают</h4>}<TextField required sx={{ margin: '10px', boxShadow: 3 }} name='password' label="Пароль" value={checkPass.first} variant="outlined"
                onChange={({ target }) => {
                    let resObj = { ...checkPass };
                    resObj.first = target.value;
                    setCheckPass(resObj)
                    if (checkPass.error) {
                        resObj = { ...checkPass };
                        resObj.error = false;
                        setCheckPass(resObj)
                    }
            }} error={checkPass.error} />
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} name='password2' label="Повтори пароль" value={checkPass.seckond} variant="outlined"
                onChange={({ target }) => {
                    let resObj = { ...checkPass };
                    resObj.seckond = target.value;
                    setCheckPass(resObj)
                    if (checkPass.error) {
                        resObj = { ...checkPass };
                        resObj.error = false;
                        setCheckPass(resObj)
                    }
            }} error={checkPass.error} /></div>
        )
        
        else if (activeStep===2) return (<div><TextField sx={{ margin: '10px', boxShadow: 3 }} label="Имя" value={otherData.name} variant="outlined"
            onChange={({ target }) => {
                const resObj = { ...otherData };
                resObj.name = target.value;
                setOtherData(resObj)
            }} />
        <TextField sx={{ margin: '10px', boxShadow: 3 }} label="Фамилия" value={otherData.lastName} variant="outlined"
            onChange={({ target }) => {
                const resObj = { ...otherData };
                resObj.lastName = target.value;
                setOtherData(resObj)
        }} />
        <TextField sx={{ margin: '10px', boxShadow: 3 }} label="Отчество" value={otherData.seckondName} variant="outlined"
            onChange={({ target }) => {
                const resObj = { ...otherData };
                resObj.seckondName = target.value;
                setOtherData(resObj)
        }} /></div>)
        else if (ind === 3) return (
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} label="e-mail" value={otherData.email} variant="outlined"
                onChange={({ target }) => {
                    let resObj = { ...otherData };
                    resObj.email = target.value;
                    setOtherData(resObj)
                    if (checkPass.errorE) {
                        resObj = { ...checkPass };
                        resObj.errorE = false;
                        setCheckPass(resObj)
                    }
            }} error={checkPass.errorE} />
        )
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen({succes: false, error: false, time: 5000, text: ''});
    };

    const handleNext = async () => {
        if (activeStep===0) {
            if (data.log==='') {
                let dat = {...checkPass};
                dat.errorL=true;
                setCheckPass(dat)
                dat = {...open};
                dat.text='Пустое поле';
                dat.error=true;
                setOpen(dat)
            }
            else {
                let promis = await api.sendPost({login: data.log}, 'checkLogin', '');
                if (promis.data.result==='buzy') {
                    let dat = {...checkPass};
                    dat.errorL=true;
                    setCheckPass(dat)
                    dat = {...open};
                    dat.text='Логин занят';
                    dat.error=true;
                    setOpen(dat)
                }
                else {
                    let dat = {...checkPass};
                    dat.errorL=false;
                    setCheckPass(dat)
                    setActiveStep((prevActiveStep) => prevActiveStep + 1);
                }
            }
        }
        else if (activeStep===1) {
            if ((checkPass.first==='')||(checkPass.seckond==='')||(checkPass.first!==checkPass.seckond)) {
                let dat = {...checkPass};
                dat.error=true;
                setCheckPass(dat)
                dat = {...open};
                dat.error=true;
                dat.text='Пустое поле или пароли не совпадают';
                setOpen(dat)
            }
            else {
                let dat = {...checkPass};
                dat.error=false;
                setCheckPass(dat)
                dat = {...data};
                dat.pass = checkPass.first
                setData(dat);
                setActiveStep((prevActiveStep) => prevActiveStep + 1);
            }
        }
        else if (activeStep===3) {
            if (otherData.email==='') {
                let dat = {...checkPass};
                dat.errorE=true;
                setCheckPass(dat)
                dat = {...open};
                dat.error=true;
                dat.text='Мыло введи';
                setOpen(dat)
            }
            else {
                let dat = {...checkPass};
                let sjj = api.sendPost({ 
                    login: data.log, 
                    pass: data.pass, 
                    first_name: otherData.lastName, 
                    last_name: otherData.seckondName, 
                    name: otherData.name, 
                    email: otherData.email 
                }, 'reg', '' )
                sjj.then(async res=> 
                    {dat.errorE=false;
                    setCheckPass(dat)
                    setOpen({succes: true, error: false, time: 5000, text: 'Успех'});
                    let answ;
                    console.log(res.status)                    
                    setState({login: false, state: ''});
                    setData({log: '', pass: ''});
                    setActiveStep(0)
                })                
            }
        }
        else setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        if (activeStep===0) setState({login: false, state: ''});
        else setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    /*const handleReset = () => {
        setActiveStep(0);
    };*/
    return (
        <div>
            <Snackbar open={open.error} autoHideDuration={open.time} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                    {open.text}
                </Alert>
            </Snackbar>
            <Snackbar open={open.succes} autoHideDuration={open.time} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Успешно
                </Alert>
            </Snackbar>
            <Box sx = {{ width: '100%'}}>
                <Box component={Paper} sx={{
                    borderRadius: '50px',
                    boxShadow: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: horiz ? 'center' : 'flex-start',
                    justifyContent: 'center',
                    minWidth: '250px',
                    margin: horiz ? '100px' : '10px',
                    padding: horiz ? '20px' : '20px'
                }}>
                    <Stepper activeStep={activeStep} orientation={horiz ? "horizontal" : "vertical"}>
                        {steps.map((step, index) => (
                        <Step key={step.label} >
                            <StepLabel
                                optional={
                                    index === steps.length-1 ? (
                                    <Typography variant="caption">Завершение</Typography>
                                    ) : null
                                }
                                error={ index===1 ? checkPass.error : index===0 ? checkPass.errorL : index===3 ? checkPass.errorE : false}
                                >
                                {step.label}
                            </StepLabel>
                            { !horiz ? <StepContent>
                                <Box sx={{ mb: 2 }}>
                                    {textFields(index)}
                                    <div>
                                    <Button
                                        variant="contained"
                                        onClick={handleNext}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        {index === steps.length - 1 ? 'Зарегистрироваться' : 'Далее'}
                                    </Button>
                                    <Button
                                        onClick={handleBack}
                                        sx={{ mt: 1, mr: 1 }}
                                    >
                                        Назад
                                    </Button>
                                    </div>
                                </Box>
                            </StepContent>  : null} 
                        </Step>
                        ))}
                    </Stepper>
                    {horiz ? 
                        textFields(activeStep) : null }
                    { horiz&&activeStep < steps.length ? 
                        <div>
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                {activeStep === steps.length - 1 ? 'Зарегистрироваться' : 'Далее'}
                            </Button>
                            <Button
                                onClick={handleBack}
                                sx={{ mt: 1, mr: 1 }}
                            >
                                Назад
                            </Button>
                        </div> : null}
                </Box>
            </Box>
        </div>
    )

}