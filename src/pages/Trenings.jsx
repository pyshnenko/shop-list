import React, { useState, useEffect, useRef } from 'react';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import YorNallert from '../helpers/yORnAllert';
import TreningTable from '../helpers/treningTable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { styled } from '@mui/material/styles';
import AccessibleForwardIcon from '@mui/icons-material/AccessibleForward';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';


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

export default function Trening({ treningTrig, user, setUser, api, trening, setTrening, darkMode }) { 
    
    const [ expanded, setExpanded ] = useState(false);
    const [ alList, setAlList ] = useState({text: '', ready: false, result: false, visible: false, make: ''});
    const [ width, setWidth ] = useState(window.innerWidth);
    const [ edit, setEdit ] = useState({old: '', new: ''});
    const [ targetEditMode, setTargetEditMode ] = useState(false);
    const [ targetEditValue, setTargetEditValue ] = useState(0);
    const [ dateUpd, setDateUpd] = useState(null);
    const trig = useRef(true);

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
        if (treningTrig.current) {
            console.log('start')
            treningTrig.current=false;
            const trenRes = api.sendPost({login: user.login}, 'findTreningList', `Bearer ${user.token}`);
            trenRes.then((trenRes)=>{
                if (trenRes.status===200) setTrening({...trenRes.data, res: true, status: trenRes.status});
                else if(trenRes.status===402) setTrening({res: false, status: trenRes.status});
                else setTrening({res: false, status: trenRes.status});
            })
        }
    }, [])

    useEffect(()=>{
        if ((!alList.ready)&&(trening.status===402)) {
            console.log('aaaa')
            setAlList({text: 'Создадим хранилище?', ready: false, result: false, visible: true, make: 'create'})
        }
        if (!trening.hasOwnProperty('categories')) {
            let buf = {...trening, categories: {'Без категории': {}}};
            setTrening(buf);
        }
        if ((trening.status===200)&&(trig.current)) {
            trig.current = false;
            let buf = {...trening};
            let sDate = trening.date ? new Date(trening.date) : new Date();
            let rDate = new Date();
            if (sDate>rDate)
                buf.onTarget = trening.onTarget || 0;
            else {
                buf.onTarget = 0;
                let jDate = new Date(sDate.setMonth((new Date()).getMonth()+1));
                if (jDate.getMonth()===(sDate.getMonth()+1)) jDate.setDate(1);
                buf.date = Number(jDate);
            }
            setTrening(buf);
            setDateUpd(buf.date);
        }
    }, [trening])

    useEffect(()=>{
        if (alList.ready) {
            if ((alList.make==='create')&&(alList.result)) {
                setLoadingIndex(true);
                let res = api.sendPost({}, 'createTreningList', `Bearer ${user.token}`);
                res.then((result)=>{
                    console.log(result)
                    if (result.status===200) {
                        setTrening({...result.data, res: true, status: result.status});
                        getInfoMessage('success', 'Создано', false);
                    }
                })
            }
            else if (alList.make[0]==='@') {
                let commands = alList.make.slice(1, 4);
                let item = alList.make.slice(5);
                if (commands === 'del')
                {
                    let buf = trening;
                    delete(buf.categories[item]);
                    setTrening(buf);
                }
            }
            setAlList({text: '', ready: false, result: false, visible: false, make: ''})
        }
    }, [alList])

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const addCategory = () => {
        console.log('add category');
        let buf = trening;
        const name = 'Новая категория';
        let setName = name;
        let count = 1;
        while (buf.categories.hasOwnProperty(setName)) {
            setName = `${name} - ${count}`
            count++;
        }
        buf.categories[setName] = {};
        setEdit({old: setName, new: setName});
        setTrening(buf);
    }

    const saveButton = async () => {
        setLoadingIndex(true);
        let buf = trening; 
        delete(buf.status);
        let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const checkEdit = () => {
        let buf = trening;
        let subBuf = trening.categories[edit.old];
        delete(buf.categories[edit.old]);
        buf.categories[edit.new]=subBuf;
        setTrening(buf);
        setEdit({old: '', new: ''});
    }

    const handleSaveTarget = async (onlySave) => {
        setTargetEditMode(false);
        if ((targetEditValue!==trening.target)||(onlySave)) {
            setLoadingIndex(true);
            let buf = trening;
            if (!onlySave) {
                buf.target = Number(targetEditValue);
                buf.date = Number(new Date());
            }
            if (!buf.hasOwnProperty('onTarget')) buf.onTarget=0;
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
        buf.onTarget ? buf.onTarget++ : buf.onTarget=1;
        if (!buf.date) buf.date = Number(new Date((new Date()).setMonth((new Date).getMonth()+1)));
        let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
        console.log(res.data)
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const restButton = async () => {
        setLoadingIndex(true);
        let buf = trening; 
        let sDate = trening.date ? (new Date(trening.date)) : (new Date());
        buf.date = Number(sDate);
        buf.onTarget=0;
        console.log(buf);
        let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    return (
        <div>
            <Box sx={{position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, display: 'flex', flexDirection: 'column-reverse', padding: width>500?'20px':0}}>
                <Fab color="primary" sx={{ marginTop: '20px' }} onClick={(()=>addCategory())}>
                    <AddIcon />
                </Fab>
                <Fab onClick={(()=>saveButton())}>
                    <SaveIcon />
                </Fab>
            </Box>
            {trening.status===200&&trening.hasOwnProperty('categories')&&
            <Box>
                {Object.keys(trening.categories).map((item, index)=>{
                    return (
                        <div key={item}>
                            <Grow in={true} timeout={1000 * index} appear={user.settings.grow} key={item}>
                                <Accordion expanded={expanded===index} onChange={handleChange(index)}
                                    sx ={{ width: '50vw', minWidth: '350px', boxShadow: 3, margin: 1 }}>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />} >
                                        <Box sx={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                                            {edit.old!==item&&<Typography>{item}</Typography>}
                                            {edit.old===item&&<TextField value={edit.new} onChange={({ target }) => {
                                                let buf = {...edit};
                                                buf.new = target.value;
                                                setEdit(buf)}} />}
                                            <Box>
                                                {edit.old!==item&&<IconButton sx={{ padding: '0 5px', margin: 0 }}
                                                    onClick={()=>setEdit({old: item, new: item })}
                                                >
                                                    <EditIcon />
                                                </IconButton>}
                                                {edit.old===item&&<IconButton sx={{ padding: '0 5px', margin: 0 }}
                                                    onClick={()=>checkEdit()}
                                                >
                                                    <CheckIcon />
                                                </IconButton>}
                                                {edit.old===item&&<IconButton sx={{ padding: '0 5px', margin: 0 }}
                                                    onClick={()=>setAlList({text: `Удаляем "${item}"?`, ready: false, result: false, visible: true, make: `@del:${item}`})}
                                                >
                                                    <DeleteIcon />
                                                </IconButton>}
                                            </Box>
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: width<500?'8px 4px 16px':'8px 16px 16px' }}>
                                        <TreningTable trening={trening} setTrening={setTrening} itemS={item} user={user} />
                                    </AccordionDetails>
                                </Accordion>
                            </Grow>
                        </div>
                    )
                })}
            </Box>}
            <Box sx={{ 
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
                {(trening.target<=trening.onTarget)&&(trening.target!==0)&&(trening.target)&&<Box sx={{ 
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
                {(!trening.hasOwnProperty('target')||trening.target<=0)&&<Typography>Давай зададим цель на этот месяц</Typography>}
                {(trening.target!==0)&&(trening.hasOwnProperty('target'))&&<BorderLinearProgress sx = {{ height: '30px', borderRadius: '30px', width: '100%' }} variant="determinate" value={(100*((trening.onTarget||0)/(trening.target||1)))>100?100:100*((trening.onTarget||0)/(trening.target||1))} />}
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'center' }}>
                    {!targetEditMode&&(trening.target!==0)&&(trening.hasOwnProperty('target'))&&<Typography sx={{margin: 2}}>Твой прогресс: {trening.onTarget||0} из {trening.target||0}</Typography>}
                    {(targetEditMode||(trening.target===0)||(!trening.hasOwnProperty('target')))&&<TextField sx={{width: '90px'}} value={targetEditValue} type='number' onChange={({ target }) => {setTargetEditValue(target.value)}} />}
                    {!targetEditMode&&(trening.target!==0)&&(trening.hasOwnProperty('target'))&&<IconButton onClick={()=>{setTargetEditMode(!targetEditMode); setTargetEditValue(trening.target||0)}}>
                        <EditIcon />
                    </IconButton>}
                    {(targetEditMode||(trening.target===0)||(!trening.hasOwnProperty('target')))&&<IconButton onClick={handleSaveTarget}>
                        <SaveIcon />
                    </IconButton>}
                </Box>
                <Box sx = {{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-evenly', alignItems: 'center', width: '50%', minWidth: '200px' }}>
                    {(trening.target>0)&&<Box><IconButton sx={{ backgroundColor: darkMode?'dimgrey':'lightgreen', boxShadow: '0 0 10px dimgrey' }} size="large" onClick={()=>plusButton()}>
                        <AddIcon fontSize="inherit" />
                    </IconButton></Box>}
                    {(trening.target>0)&&(trening.onTarget!==0)&&<IconButton sx={{ backgroundColor: darkMode?'black':'white', boxShadow: '0 0 10px dimgrey' }} size="large" onClick={()=>restButton()}>
                        <RestartAltIcon fontSize="inherit" />
                    </IconButton>}
                </Box>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <Typography sx={{marginTop: 2}}>Счетчик обновится:</Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='ru'>
                            <DatePicker sx={{width: '150px'}} value={dayjs((trening.date ? (new Date(trening.date)) : (new Date())).toDateString())} onChange={(val)=>setTrening({...trening, date: (Number(val.$d))})} />
                        </LocalizationProvider>
                        <IconButton onClick={()=>handleSaveTarget(true)}>
                            <SaveIcon />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
            {alList.visible&&<YorNallert user={user} list={alList} setList={setAlList} />}
        </div>
      );
}