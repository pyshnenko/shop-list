import React, { useState, useEffect } from 'react';
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
import LinearProgress from '@mui/material/LinearProgress';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function Trening({ user, setUser, api, trening, setTrening }) { 
    
    const [ expanded, setExpanded ] = useState(false);
    const [ alList, setAlList ] = useState({text: '', ready: false, result: false, visible: false, make: ''});
    const [ width, setWidth ] = useState(window.innerWidth);
    const [ edit, setEdit ] = useState({old: '', new: ''});
    const [ targetEditMode, setTargetEditMode ] = useState(false);
    const [ targetEditValue, setTargetEditValue ] = useState(0);

    useEffect(() => {
        const handleResize = (event) => {
            setWidth(event.target.innerWidth);
        };
        window.addEventListener('resize', handleResize);
            return () => {
                window.removeEventListener('resize', handleResize);
            };
    }, []);

    useEffect(()=>{
        console.log(trening);
        if ((!alList.ready)&&(trening.status===402)) {
            console.log('aaaa')
            setAlList({text: 'Создадим хранилище?', ready: false, result: false, visible: true, make: 'create'})
        }
        if (!trening.hasOwnProperty('categories')) {
            let buf = {...trening, categories: {'Без категории': {}}};
            setTrening(buf);
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

    const handleSaveTarget = async () => {
        setTargetEditMode(false);
        if (targetEditValue!==trening.target) {
            setLoadingIndex(true);
            let buf = trening;
            buf.target = Number(targetEditValue);
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
        buf.onTarget ? buf.onTarget=buf.onTarget+1 : buf.onTarget=1;
        let res = await api.sendPost(buf, 'updateTreningList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setTrening({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const restButton = async () => {
        setLoadingIndex(true);
        let buf = trening; 
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
                    backgroundColor: 'black', 
                    padding: '20px', 
                    margin: '20px',
                    borderRadius: '30px', 
                    border: '2px solid white',
                    boxShadow: '0 0 10px white'
                }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', alignContent: 'center', justifyContent: 'space-between' }}>
                    <LinearProgress sx = {{ height: '30px', borderRadius: '30px', width: '85%'}} variant="determinate" value={100*trening.onTarget/(trening.target||1)} />
                    {!targetEditMode&&<Typography>{trening.target||0}</Typography>}
                    {targetEditMode&&<TextField value={targetEditValue} type='number' onChange={({ target }) => {setTargetEditValue(target.value)}} />}
                    {!targetEditMode&&<IconButton onClick={()=>{setTargetEditMode(!targetEditMode); setTargetEditValue(trening.target||0)}}>
                        <EditIcon />
                    </IconButton>}
                    {targetEditMode&&<IconButton onClick={handleSaveTarget}>
                        <SaveIcon />
                    </IconButton>}
                </Box>
                <IconButton onClick={()=>plusButton()}>
                    <AddIcon />
                </IconButton>
                <IconButton onClick={()=>plusButton()}>
                    <RestartAltIcon onClick={()=>restButton()} />
                </IconButton>
            </Box>
            {alList.visible&&<YorNallert user={user} list={alList} setList={setAlList} />}
        </div>
      );
}