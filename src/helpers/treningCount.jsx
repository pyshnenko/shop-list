import React, { useState, useEffect, useRef } from 'react';
import copy from 'fast-copy';
import { getInfoMessage, setLoadingIndex } from './leftInfoWindow';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { styled } from '@mui/material/styles';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';

const BorderLinearProgress = styled(LinearProgress)(({ theme, value }) => ({
    height: 10,
    borderRadius: '30px',
    [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 30,
    boxShadow: `0 0 20px rgb(${(2*255-2*2.55*value)<=255?(2*255-2*2.55*value):255},${(2*2.55*value)<=255?(2*2.55*value):255},0)`,
    backgroundColor: `rgb(${(2*255-2*2.55*value)<=255?(2*255-2*2.55*value):255},${(2*2.55*value)<=255?(2*2.55*value):255},0)`,
    },
}));

const revObj = (obj, cat) => {
    if (typeof(obj)==='object'){
        if (cat.length===0) return obj;
        else {
            /*console.log(obj[cat[0]])
            let buf = obj[cat[0]];
            let cat2 = cat.slice(1);
            revObj(buf, cat2);*/
            return obj[cat[0]][cat[1]]
        }
    }
    else return undefined
}

const saveRevObj = (obj, sObj, cat) => {
    if (cat.length===0) return {...obj, ...sObj};
    else if (cat.length===1) {obj[cat[0]]=sObj; return obj}
    else if (cat.length===2) {obj[cat[0]][cat[1]]=sObj; return obj}
}

export default function CountTrening({ trening, setTrening, api, cat, darkMode, user }) {

    const [ targetEditMode, setTargetEditMode ] = useState(false);
    const [ targetEditValue, setTargetEditValue ] = useState(0);
    const [ inpTrening, setInpTrening ] = useState(cat.length===0?trening:revObj(trening, cat));

    useEffect(()=>{
        if (cat.length===0) {
            let buf = copy(trening);
            if (!((buf.hasOwnProperty('target'))||(buf.target===0))) buf.target=0;
            if (!((buf.hasOwnProperty('onTarget'))||(buf.onTarget===0))) buf.onTarget=0;
            if (!(buf.hasOwnProperty('date'))) buf.date=(new Date()).setMonth((new Date()).getMonth()+1);
            setInpTrening(buf);
        }
        else {
            let buf = revObj(copy(trening), cat);
            if (buf!==undefined) {
                if (!((buf.hasOwnProperty('target'))||(buf.target===0))) buf.target=0;
                if (!((buf.hasOwnProperty('onTarget'))||(buf.onTarget===0))) buf.onTarget=0;
                if (!(buf.hasOwnProperty('date'))) buf.date=(new Date()).setMonth((new Date()).getMonth()+1);
                setInpTrening(buf);
            }
        }
    }, [])

    useEffect(()=>{
        let buf = {...trening};
        if (cat.length===0) {
            if (buf.date<Number(new Date())) {
                setLoadingIndex(true);
                buf.onTarget = 0;
                let rDate = new Date();
                let sDate = new Date(rDate.setDate((new Date(buf.date)).getDate()));
                sDate.setMilliseconds(0);
                sDate.setSeconds(0);
                sDate.setMinutes(0);
                sDate.setHours(0);
                sDate.setMonth(sDate.getMonth()+1)
                buf.date = Number(sDate);
                let res = api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
                res.then((result)=>{
                    if (result.status===200) setTrening({...res.data, status: res.status, res: true})
                    getInfoMessage('success', 'Данные получены', false);
                })
            }
        }
        else if (cat.length===2) {
            if (buf[cat[0]][cat[1]].date<Number(new Date())) {
                setLoadingIndex(true);
                buf[cat[0]][cat[1]].onTarget = 0;
                let rDate = new Date();
                let sDate = new Date(rDate.setDate((new Date(buf[cat[0]][cat[1]].date)).getDate()));
                sDate.setMilliseconds(0);
                sDate.setSeconds(0);
                sDate.setMinutes(0);
                sDate.setHours(0);
                sDate.setMonth(sDate.getMonth()+1)
                buf[cat[0]][cat[1]].date = Number(sDate);
                let res = api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
                res.then((result)=>{
                    if (result.status===200) setTrening({...res.data, status: res.status, res: true})
                    getInfoMessage('success', 'Данные получены', false);
                })
            }
        }
        setInpTrening(revObj(buf, cat));
    }, [trening])
    
    const handleSaveTarget = async (onlySave) => {
        setTargetEditMode(false);
        if ((targetEditValue!==inpTrening.target)||(onlySave)) {
            setLoadingIndex(true);
            let buf = trening;
            if (!onlySave) {
                if (cat.length===0) {
                    buf.target = Number(targetEditValue);
                    buf.date = Number(new Date());
                }
                else {
                    let sBuf = revObj(buf, cat);
                    sBuf.target = Number(targetEditValue);
                    sBuf.date = Number(new Date());
                    buf=saveRevObj(buf, sBuf, cat);
                }
            }
            if (!buf.hasOwnProperty('onTarget')) {                
                if (cat.length===0) buf.onTarget=0;
                else saveRevObj(buf, {onTarget: 0}, cat);
            }
            let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
            if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
            else {
                setTrening({...res.data, status: res.status, res: true});
                getInfoMessage('success', 'Данные получены', false);
            }
        }
    }

    const plusButton = async () => {
        setLoadingIndex(true);
        let buf = trening;
        if (cat.length===0) buf.onTarget ? buf.onTarget++ : buf.onTarget=1;
        else {
            let sBuf = revObj(buf, cat);
            sBuf.onTarget ? sBuf.onTarget++ : sBuf.onTarget=1;
            buf=saveRevObj(buf, sBuf, cat);
        }
        if (!buf.date) buf.date = Number(new Date((new Date()).setMonth((new Date).getMonth()+1)));
        let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const restButton = async () => {
        setLoadingIndex(true);
        let buf = inpTrening; 
        let orBuf = trening;
        let sDate = inpTrening.date ? (new Date(inpTrening.date)) : (new Date());
        buf.date = Number(sDate);
        buf.onTarget=0;
        let extBuf = saveRevObj(orBuf, buf, cat);
        let res = await api.sendPost(extBuf, 'updateTreningList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const saveDate = (date) => {
        let buf = {...trening};
        switch (cat.length) {
            case 0: buf.date = date; break;
            case 1: buf[cat[0]].date = date; break;
            case 2: buf[cat[0]][cat[1]].date = date; break;
        }
        setTrening(buf)
    }

    return (
        <Box>
            {(inpTrening!==undefined)&&<Box sx={{ 
                backgroundColor: darkMode?'black':'#c7c7c7', 
                padding: '20px', 
                margin: '20px',
                borderRadius: '30px', 
                border: '2px solid white',
                boxShadow: '0 0 10px white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}>
                {(inpTrening.hasOwnProperty('target'))&&(inpTrening.target<=inpTrening.onTarget)&&(inpTrening.target!==0)&&(inpTrening.target)&&<Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'row',
                        flexWrap: 'nowrap',
                        alignItems: 'center',
                        marginBottom: 2 
                    }}>
                    <AccessibleForwardIcon sx={{transform: 'scale(-1, 1)' }} />
                    <Typography>Успех!!!</Typography>
                    <AccessibleForwardIcon />
                </Box>}
                {(!inpTrening.hasOwnProperty('target')||inpTrening.target<=0)&&<Typography>Давай зададим цель на этот месяц</Typography>}
                {(inpTrening.hasOwnProperty('target'))&&(inpTrening.target!==0)&&<BorderLinearProgress sx = {{ height: '30px', borderRadius: '30px', width: '100%' }} variant="determinate" value={(100*((inpTrening.onTarget||0)/(inpTrening.target||1)))>100?100:100*((inpTrening.onTarget||0)/(inpTrening.target||1))} />}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                    {!targetEditMode&&(inpTrening.target!==0)&&(inpTrening.hasOwnProperty('target'))&&<Typography sx={{margin: 2}}>Твой прогресс: {inpTrening.onTarget||0} из {inpTrening.target||0}</Typography>}
                    {(targetEditMode||(inpTrening.target===0)||(!inpTrening.hasOwnProperty('target')))&&<TextField sx={{width: '90px'}} value={targetEditValue} type='number' onChange={({ target }) => {setTargetEditValue(target.value)}} />}
                    {!targetEditMode&&(inpTrening.target!==0)&&(inpTrening.hasOwnProperty('target'))&&<IconButton onClick={()=>{setTargetEditMode(!targetEditMode); setTargetEditValue(inpTrening.target||0)}}>
                        <EditIcon />
                    </IconButton>}
                    {(targetEditMode||(inpTrening.target===0)||(!inpTrening.hasOwnProperty('target')))&&<IconButton onClick={()=>handleSaveTarget(false)}>
                        <SaveIcon />
                    </IconButton>}
                </Box>
                <Box sx = {{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-evenly', alignItems: 'center', width: '50%', minWidth: '200px' }}>
                    {(inpTrening.target>0)&&<Box><IconButton sx={{ backgroundColor: darkMode?'dimgrey':'lightgreen', boxShadow: '0 0 10px dimgrey' }} size="large" onClick={()=>plusButton()}>
                        <AddIcon fontSize="inherit" />
                    </IconButton></Box>}
                    {(inpTrening.target>0)&&(inpTrening.onTarget!==0)&&<IconButton sx={{ backgroundColor: darkMode?'black':'white', boxShadow: '0 0 10px dimgrey' }} size="large" onClick={()=>restButton()}>
                        <RestartAltIcon fontSize="inherit" />
                    </IconButton>}
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{marginTop: 2}}>Счетчик обновится:</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                            <DatePicker sx={{width: '150px'}} value={dayjs((inpTrening.date ? (new Date(inpTrening.date)) : (new Date())).toDateString())} onChange={(val)=>saveDate(Number(val.$d))} />
                        </LocalizationProvider>
                        <IconButton onClick={()=>handleSaveTarget(true)}>
                            <SaveIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>}
        </Box>
    );
}