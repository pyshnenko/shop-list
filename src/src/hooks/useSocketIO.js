import { io } from 'socket.io-client';
import { useEffect } from 'react';
import copy from 'fast-copy';

let socket;
const URL ='https://io.spamigor.ru';    
let connect = false;
let state, rows, setRows, sumLists, setSumLists, expanded, setExpanded, sumExpanded, setSumExpanded, unLogin = false, unLoginSum = false;

export function useSocketIO(props) {
    if (props.hasOwnProperty('state')) state = props.state;
    if (props.hasOwnProperty('rows')) rows = props.rows;
    if (props.hasOwnProperty('setRows')) setRows = props.setRows;
    if (props.hasOwnProperty('sumLists')) sumLists = props.sumLists;
    if (props.hasOwnProperty('setSumLists')) setSumLists = props.setSumLists;
    if (props.hasOwnProperty('expanded')) expanded = props.expanded;
    if (props.hasOwnProperty('setExpanded')) setExpanded = props.setExpanded;
    if (props.hasOwnProperty('sumExpanded')) sumExpanded = props.sumExpanded;
    if (props.hasOwnProperty('setSumExpanded')) setSumExpanded = props.setSumExpanded;
    if (props.hasOwnProperty('unLogin')) unLogin = props.unLogin;
    if (props.hasOwnProperty('unLoginSum')) unLoginSum = props.unLoginSum;

    if (!connect) {
        console.log('hello');
        socket = io(URL, {
            autoConnect: true
        });
        connect = true;

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('edit', onEdit);
        socket.on('editSum', onEditSum);
        socket.on('upd', statUpd);
    }

    useEffect(()=>{
        if ((state.state!=='unLoginAdm')&&(unLogin||unLoginSum)) {
            console.log('bye');
            socket.emit(unLoginSum?'bueSum':'bye', rows.id);
            unLogin=false;
            unLoginSum=false;
            socket.removeAllListeners();
        }
        if ((expanded!==undefined) && (expanded>=0)) {
            socket.emit('bye', rows[expanded].id);
            socket.removeAllListeners();
            connect = false;
            
            if ((sumExpanded!==undefined) && (sumExpanded>=0)) {
                socket.emit('byeSum', sumLists[sumExpanded].id);
            }
        }
    }, [state]);

    function statUpd() {
        socket.emit('hi', expanded>=0 ? rows[expanded].id : 0);
    }

    function onConnect() {
        console.log('connect')
    }

    function onDisconnect() {
        console.log('disconnect')
    }

    function onEdit(value) {
        let buf = JSON.parse(value);
        if (unLogin) {
            setRows(buf.data);
        }
        else {
            if (rows.length) {
                for (let i=0; i<rows.length; i++) {
                    if (rows[i].id===buf.id) {
                        let inpBuf = copy(rows);
                        inpBuf[i] = buf;
                        setRows(inpBuf);
                        break;
                    }
                }
            }
            else {
                let inpBuf = copy(rows);
                inpBuf.push(buf);
                setRows(inpBuf);
            }

        }
    }

    function onEditSum(value) {
        let buf = JSON.parse(value);
        if (unLogin) {
            setRows(buf.data);
        }
        else {
            if (sumLists.length) {
                for (let i=0; i<sumLists.length; i++) {
                    if (sumLists[i].id===buf.id) {
                        let inpBuf = copy(sumLists);
                        inpBuf[i] = buf;
                        setSumLists(inpBuf);
                        break;
                    }
                }
            }
            else {
                let inpBuf = copy(sumLists);
                inpBuf.push(buf);
                setSumLists(inpBuf);
            }
        }
    }

    function sendIO(addr, val) {
        socket.emit(addr, val)
    }

    return {
        socket,
        sendIO
    }

}