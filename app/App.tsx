'use client'

import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import Toolbar from './Toolbar';
import MainPage from './MainPage';

export default function App() {
  const gridRef = useRef<AgGridReact>(null);
  const refreshRef = useRef<VoidFunction | null>(null);

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column', width: '100%'}}>
      <Toolbar gridRef={gridRef} refreshRef={refreshRef}/>
      <MainPage gridRef={gridRef} refreshRef={refreshRef} />
    </div>
  )
}
