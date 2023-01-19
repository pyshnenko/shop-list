import { useEffect } from 'react';

let openNewRowWindowG;
let setOpenNewRowWindowG;
let loadingIndG;
let setLoadingIndG;

export function getInfoMessage (type, text, ...arg) {    
    console.log(arg)
    if (arg.length!==0) setLoadingIndG(arg[0])
    let eBuf = {...openNewRowWindowG};
    eBuf.text=text;
    eBuf[type]=true;
    setOpenNewRowWindowG(eBuf);
}

export function SetInfoMessageStateItems(openNewRowWindow, setOpenNewRowWindow, loadingInd, setLoadingInd) {
    console.log('setInfoMessageStateItems')
    openNewRowWindowG=openNewRowWindow;
    setOpenNewRowWindowG=setOpenNewRowWindow;
    loadingIndG=loadingInd;
    setLoadingIndG=setLoadingInd;
    useEffect(()=> {
        console.log('effect ind')
        if (loadingIndG!==loadingInd) loadingIndG=loadingInd;
    }, [loadingInd] )
}

export function setLoadingIndex(state) {
    if (loadingIndG!==state) {
        setLoadingIndG(state);
    }
}