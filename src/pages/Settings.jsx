import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { blueGrey } from '@mui/material/colors';
import Grow from '@mui/material/Grow';
import Button from '@mui/material/Button';
import { getInfoMessage, setLoadingIndex } from '../helpers/leftInfoWindow';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';

const backStyle = {
    borderRadius: '50px',
    boxShadow: 3,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    width: '75vw',
    maxWidth: '750px',
    minWidth: '350px',
    margin: '100px 0',
    padding: '20px'
}

export default function Profile({ setDarkMode, user, setUser, api }) { 

    const [newSet, setNewSet] = useState(user.settings);

    const saved = async () => {
        setLoadingIndex(true);
        let buf = await api.sendPost({settings: newSet}, 'updUserData', `Bearer ${user.token}`)
        if (buf.status===200) {
            setUser(buf.data.data[0]);
            getInfoMessage('success','Данные отправлены', false);
        }
        else getInfoMessage('error','Что-то пошло не так', false);
    }

    const handleChange = (event) => {
        setNewSet({
            ...newSet,
            [event.target.name]: event.target.checked,
        });
    };

    const handleCheck = (evt) => {
        setNewSet({
            ...newSet,
            animation: evt.target.value
        })
        if (evt.target.value!==0) setDarkMode('dark');
    }

    const handleCheck2 = (evt) => {
        setNewSet({
            ...newSet,
            sharedMode: evt.target.value
        })
    }

    const handleCheck3 = (evt) => {
        setNewSet({
            ...newSet,
            darkMode: evt.target.value
        });
        if (newSet?.localSave) localStorage.setItem('shopListColorMode', evt.target.value);
        if (evt.target.value!=='auto') setDarkMode(evt.target.value);
        else setDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')
    }

    return (
        <Box>
            <Grow in={true} appear={user.settings.grow}>
                <Box component={Paper} sx={backStyle}>
                    <FormControl component="fieldset" variant="standard">
                        <FormLabel component="legend">Настройки анимации</FormLabel>
                        <FormGroup>
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.autosave} onChange={handleChange} name="autosave" />
                            }
                            label="Автосохранение"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.edit} onChange={handleChange} name="edit" />
                            }
                            label="Режим редактирования"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.grow} onChange={handleChange} name="grow" />
                            }
                            label="Анимация появления"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.askToDel} onChange={handleChange} name="askToDel" />
                            }
                            label="Подтверждение удаления"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.pageSave} onChange={handleChange} name="pageSave" />
                            }
                            label="Сохранение страницы"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.localSave} onChange={handleChange} name="localSave" />
                            }
                            label="Сохранение данных на этом ПК"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.neonLogo} onChange={handleChange} name="neonLogo" />
                            }
                            label="Логотип"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.mobileAnimation} onChange={handleChange} name="mobileAnimation" />
                            }
                            label="Анимация на мобильных устройствах"
                            />
                            <FormControlLabel
                            control={
                                <Switch checked={newSet?.mobileLogo} onChange={handleChange} name="mobileLogo" />
                            }
                            label="Логотип на мобильных устройствах"
                            />
                        </FormGroup>
                    </FormControl>
                </Box>
            </Grow>
            <Grow in={true} {...({ timeout: 1000 })} appear={user.settings.grow}>
                <Box component={Paper} sx={backStyle}>
                    <FormControl sx={{ m: 1, width: 200 }}>
                        <InputLabel>Задний фон</InputLabel>
                        <Select
                            value={newSet?.animation || 0}
                            label="Фон"
                            onChange={handleCheck}
                        >
                            <MenuItem value={0}>Базовый</MenuItem>
                            <MenuItem value={1}>Салютики</MenuItem>
                            <MenuItem value={2}>Точки</MenuItem>
                            <MenuItem value={3}>Картинка</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 200 }}>
                        <InputLabel>Кому по умолчанию отправить</InputLabel>
                        <Select
                            value={newSet?.sharedMode || 'me'}
                            label="Отправка"
                            onChange={handleCheck2}
                        >
                            <MenuItem value={'me'}>Только я</MenuItem>
                            <MenuItem value={'friends'}>Друзья</MenuItem>
                            <MenuItem value={'all'}>Все</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl sx={{ m: 1, width: 200 }}>
                        <InputLabel>Тема по умолчанию</InputLabel>
                        <Select
                            value={newSet?.darkMode || 'auto'}
                            label="Темный"
                            onChange={handleCheck3}
                        >
                            <MenuItem value={'auto'}>Авто</MenuItem>
                            <MenuItem value={'light'}>Светлая</MenuItem>
                            <MenuItem value={'dark'}>Темная</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Grow>
            <Grow in={true} {...({ timeout: 2000 })} appear={user.settings.grow}>                
                <Button variant="contained" onClick={saved}>
                    Сохранить
                </Button>
            </Grow>
        </Box>
    )
}