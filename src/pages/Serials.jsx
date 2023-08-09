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
import SerialTable from '../helpers/serialTable';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Serials({ darkMode, user, setUser, api, serials, setSerials }) { 
    
    const [expanded, setExpanded] = useState(false);
    const [ alList, setAlList ] = useState({text: '', ready: false, result: false, visible: false, make: ''});
    const [ width, setWidth ] = useState(window.innerWidth);
    const [ edit, setEdit ] = useState({old: '', new: ''});

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
        if (trig.current) {
            trig.current=false;
            const serResult = api.sendPost({login: user.login}, 'findSerialList', `Bearer ${user.token}`);
            serResult.then((serRes)=>{
                if (serRes.status===200) setSerials({...serRes.data, res: true, status: serRes.status});
                else if(serRes.status===402) setSerials({res: false, status: serRes.status});
                else setSerials({res: false, status: serRes.status});
            })
        }
    }, [])

    useEffect(()=>{
        if ((!alList.ready)&&(serials.status===402)) {
            console.log('aaaa')
            setAlList({text: 'Создадим хранилище?', ready: false, result: false, visible: true, make: 'create'})
        }
        if (!serials.hasOwnProperty('list')) {
            let buf = {...serials, list: {'Без категории': {}}};
            setSerials(buf);
        }
    }, [serials])

    useEffect(()=>{
        if (alList.ready) {
            if ((alList.make==='create')&&(alList.result)) {
                setLoadingIndex(true);
                let res = api.sendPost({}, 'createSerialList', `Bearer ${user.token}`);
                res.then((result)=>{
                    console.log(result)
                    if (result.status===200) {
                        setSerials({...result.data, res: true, status: result.status});
                        getInfoMessage('success', 'Создано', false);
                    }
                })
            }
            else if ((alList.make[0]==='@')&&(alList.result)) {
                let commands = alList.make.slice(1, 4);
                let item = alList.make.slice(5);
                if (commands === 'del')
                {
                    let buf = serials;
                    delete(buf.list[item]);
                    setSerials(buf);
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
        let buf = serials;
        const name = 'Новая категория';
        let setName = name;
        let count = 1;
        while (buf.list.hasOwnProperty(setName)) {
            setName = `${name} - ${count}`
            count++;
        }
        buf.list[setName] = {};
        setEdit({old: setName, new: setName});
        setSerials(buf);
    }

    const saveButton = async () => {
        setLoadingIndex(true);
        let buf = serials; 
        delete(buf.status);
        let res = await api.sendPost(buf, 'updateSerialList', `Bearer ${user.token}`);
        if (res.status!==200) getInfoMessage('error', 'Что-то пошло не так', false);
        else {
            setSerials({...res.data, status: res.status, res: true});
            getInfoMessage('success', 'Данные получены', false);
        }
    }

    const checkEdit = () => {
        let buf = serials;
        let subBuf = serials.list[edit.old];
        delete(buf.list[edit.old]);
        buf.list[edit.new]=subBuf;
        setSerials(buf);
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
            {serials.status===200&&serials.hasOwnProperty('list')&&
            <Box>
                {Object.keys(serials.list).map((item, index)=>{
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
                                        <SerialTable darkMode={darkMode} serials={serials} setSerials={setSerials} itemS={item} user={user} />
                                    </AccordionDetails>
                                </Accordion>
                            </Grow>
                        </div>
                    )
                })}
            </Box>}
            {alList.visible&&<YorNallert user={user} list={alList} setList={setAlList} />}
        </div>
      );
}