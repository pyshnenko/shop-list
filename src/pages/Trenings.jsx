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
import TreningCount from '../helpers/treningCount';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Trening({ treningTrig, user, setUser, api, trening, setTrening, darkMode }) { 
    
    const [ expanded, setExpanded ] = useState(false);
    const [ alList, setAlList ] = useState({text: '', ready: false, result: false, visible: false, make: ''});
    const [ width, setWidth ] = useState(window.innerWidth);
    const [ edit, setEdit ] = useState({old: '', new: ''});
    const [ dateUpd, setDateUpd] = useState(null);
    const [ ready, setReady ] = useState(false);
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
            setReady(true)
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
                                        {expanded===index&&<TreningCount trening={trening} setTrening={setTrening} api={api} cat={['categories',item]} darkMode={darkMode} user={user} />}
                                    </AccordionDetails>
                                </Accordion>
                            </Grow>
                        </div>
                    )
                })}
            </Box>} 
            {ready&&<TreningCount trening={trening} setTrening={setTrening} api={api} cat={[]} darkMode={darkMode} user={user} />}
            {alList.visible&&<YorNallert user={user} list={alList} setList={setAlList} />}
        </div>
      );
}