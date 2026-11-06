import React,{createContext,useContext,useState} from 'react';import {createVfs} from '../lib/vfs';
const C=createContext(null);export function VfsProvider({children}){const [fs]=useState(()=>createVfs());return <C.Provider value={fs}>{children}</C.Provider>}export const useVfs=()=>useContext(C);
