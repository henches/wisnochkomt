'use client'

import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import Toolbar from './Toolbar';
import MainPage from './MainPage';
import { ConfigProvider, theme } from 'antd';
import { BACKGROUND_COLOR } from './constants';

export default function App() {
  const gridRef = useRef<AgGridReact>(null);
  const refreshRef = useRef<VoidFunction | null>(null);

  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <ConfigProvider
      theme={{
        algorithm: darkAlgorithm, // ou darkAlgorithm pour un thème sombre
        token: {
          colorText: 'white', // Définissez la couleur du texte ici
          colorPrimary: '#1890ff', // Couleur principale
          colorInfo: '#1890ff', // Couleur d'info
          colorSuccess: '#52c41a', // Couleur de succès
          colorWarning: '#faad14', // Couleur d'avertissement
          colorError: '#f5222d', // Couleur d'erreur
          colorBgBase: BACKGROUND_COLOR, // Définissez la couleur de fond par défaut ici
        },
      }}
    >
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', width: '100%' }}>
        <Toolbar gridRef={gridRef} refreshRef={refreshRef} />
        <MainPage gridRef={gridRef} refreshRef={refreshRef} />
      </div>
    </ConfigProvider>
  )
}
