import React, { useMemo, useState } from 'react'
import { ArrowUp, Grid2X2, List, Folder, FileText, HardDrive } from 'lucide-react'
import { useVfs } from '../../context/VfsContext'
const initialPath = 'C:\\Users\\JMP\\Documents'
const folders = [['Accueil','C:\\Users\\JMP'],['Documents','C:\\Users\\JMP\\Documents'],['Bureau','C:\\Users\\JMP\\Desktop'],['Téléchargements','C:\\Users\\JMP\\Downloads'],['Projets','C:\\Projects'],['Archive','C:\\Archive']]
export default function Explorer({search='',onOpenFile}) {
 const fs=useVfs(), [path,setPath]=useState(initialPath), [history,setHistory]=useState([initialPath]), [index,setIndex]=useState(0), [mode,setMode]=useState('grid')
 const entries=useMemo(()=>{try{return fs.list(path).filter(e=>!search||e.path.toLowerCase().includes(search.toLowerCase()))}catch{return[]}},[fs,path,search])
 const go=p=>{if(fs.get(p)?.kind!=='dir')return;setPath(p);const h=history.slice(0,index+1);h.push(fs.normalize(p));setHistory(h);setIndex(h.length-1)}
 const parent=path.replace(/\\[^\\]+$/,'')||'C:\\'
 return <div className="explorer"><header><button disabled={index<=0} onClick={()=>{let i=index-1;setIndex(i);setPath(history[i])}}>‹</button><button disabled={index>=history.length-1} onClick={()=>{let i=index+1;setIndex(i);setPath(history[i])}}>›</button><button onClick={()=>go(parent)} aria-label="Dossier parent"><ArrowUp size={16}/></button><div className="address">{path.split('\\').join('  ›  ')}</div><button onClick={()=>setMode(mode==='grid'?'list':'grid')}>{mode==='grid'?<List size={17}/>:<Grid2X2 size={17}/>}</button></header><div className="explorer-body"><nav>{folders.map(([n,p])=><button className={path===p?'selected':''} key={p} onClick={()=>go(p)}><Folder size={16}/>{n}</button>)}<hr/><button onClick={()=>go('C:\\')}><HardDrive size={16}/>Disque local (C:)</button></nav><main><div className={'file-grid '+(mode==='list'?'file-list':'')}>{entries.map(n=><button key={n.path} onDoubleClick={()=>n.kind==='dir'?go(n.path):onOpenFile?.(n)}><span>{n.kind==='dir'?<Folder size={30} fill="#f6c85f" color="#d9a526"/>:<FileText size={30} color="#448ccb"/>}</span><span>{n.path.split('\\').pop()}</span></button>)}</div>{!entries.length&&<div className="empty-files">Aucun élément dans ce dossier</div>}</main></div><footer>{entries.length} élément(s) · Espace virtuel</footer></div>
}
