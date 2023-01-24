import { useEffect } from 'react';

let openNewRowWindowG;
let setOpenNewRowWindowG;
let loadingIndG;
let setLoadingIndG;

export function getInfoMessage (type, text, ...arg) {
    if (arg.length!==0) setLoadingIndG(arg[0])
    let eBuf = {...openNewRowWindowG};
    eBuf.text=text;
    eBuf[type]=true;
    setOpenNewRowWindowG(eBuf);
}

export function SetInfoMessageStateItems(openNewRowWindow, setOpenNewRowWindow, loadingInd, setLoadingInd) {
    openNewRowWindowG=openNewRowWindow;
    setOpenNewRowWindowG=setOpenNewRowWindow;
    loadingIndG=loadingInd;
    setLoadingIndG=setLoadingInd;
    useEffect(()=> {
        if (loadingIndG!==loadingInd) loadingIndG=loadingInd;
    }, [loadingInd] )
}

export function setLoadingIndex(state) {
    if (loadingIndG!==state) {
        setLoadingIndG(state);
    }
}