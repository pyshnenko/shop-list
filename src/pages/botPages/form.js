import React, {useCallback, useEffect, useState} from 'react';
import './form.css';
import {useTelegram} from "../../src/hooks/useTelegram";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { blue, blueGrey, green } from '@mui/material/colors';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';

const Form = () => {
    const [ serial, setSerial ] = useState('');
    const [seazon, setSeazon] = useState('');
    const [epizod, setEpizod] = useState('');
    const [time, setTime] = useState('00:00');
    const {tg, user, queryId} = useTelegram();
    const darkTheme = createTheme({
        palette: {
            mode: tg.colorScheme,
        },
    });

    const onSendData = () => {
        const data = {
            seazon,
            epizod,
            time
        }
        tg.sendData(JSON.stringify(data));
    };

    useEffect(() => {
        tg.onEvent('mainButtonClicked', onSendData)
        return () => {
            tg.offEvent('mainButtonClicked', onSendData)
        }
    }, [onSendData])

    useEffect(() => {
        tg.BackButton.show();
        tg.MainButton.setParams({
            text: 'Отправить данные'
        })
        const params = new URLSearchParams(window.location.search);
        setSerial(decodeURI(params.get('serialN')));
        setSeazon(decodeURI(params.get('serialS')));
        setEpizod(decodeURI(params.get('serialE')));
        setTime(decodeURI(params.get('serialT')));
    }, [])

    useEffect(() => {
        if(!epizod || !seazon || !time) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
        }
    }, [seazon, epizod, time])

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Typography sx = {{fontSize: 'large', padding: '30px 10px'}} variant="h4" gutterBottom>Введите новые значения для сериала: "{serial}"</Typography>
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} type="number" name='Сезон' label='Сезон' value={seazon} variant="outlined"
                onChange={({ target }) => {setSeazon(target.value)}} />
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} type="number" name='Серия' label='Серия' value={epizod} variant="outlined"
                onChange={({ target }) => {setEpizod(target.value)}} />
            <TextField required sx={{ margin: '10px', boxShadow: 3 }} type="time" name='Время' label='Время' value={time} variant="outlined"
                onChange={({ target }) => {setTime(target.value)}} />
        </ThemeProvider>
    );
};

export default Form;