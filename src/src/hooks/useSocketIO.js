import { io } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import copy from 'fast-copy';

let socket;
const URL ='https://io.spamigor.site';    
let connect = false;

export function useSocketIO({ rows, setRows }) {

    if (!connect) {
        console.log('hello');
        socket = io(URL, {
            autoConnect: true
        });
        connect = true;

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('edit', onEdit);
    }

    function onConnect() {
        console.log('hook');
        console.log('connect')
    }

    function onDisconnect() {
        console.log('hook');
        console.log('disconnect')
    }

    function onEdit(value) {
        console.log('hook')
        console.log(JSON.parse(value));
        let buf = JSON.parse(value);
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
        else rows.push(buf);
    }

    /*function statUpd() {
        socket.current.emit('hi', expanded>=0 ? rows[expanded].id : 0);
    }*/
    //socket.current.on('upd', statUpd);

    return {
        socket,
        send: socket.emit
    }

}