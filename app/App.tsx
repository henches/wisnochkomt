'use client'

import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import Toolbar from './Toolbar';
import MainPage from './MainPage';

export default function App() {
  const gridRef = useRef<AgGridReact>(null);

  return (
    <div style={{display: 'flex', flexDirection: 'column', width: '100%'}}>
      <Toolbar gridRef={gridRef} />
      <MainPage gridRef={gridRef} />
    </div>
  )
}
