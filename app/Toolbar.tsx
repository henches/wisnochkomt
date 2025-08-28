"use client"
import { ExportOutlined, ImportOutlined, MenuOutlined } from '@ant-design/icons';
import '@ant-design/v5-patch-for-react-19';
import { AgGridReact } from 'ag-grid-react';
import { Button, Drawer, Menu, MenuProps, Modal } from 'antd';
import { useState } from "react";
import { ImportCsv } from './ImportCsv';
import { BACKGROUND_COLOR } from './constants';

const TOOLBAR_HEIGHT = '35px'

type MenuItem = Required<MenuProps>['items'][number];

export interface ToolbarProps {
  gridRef: React.RefObject<AgGridReact | null>;
  refreshRef: React.RefObject<VoidFunction | null>
}

export default function Toolbar(props: ToolbarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isImportPopinOpen, setIsImportPopinOpen] = useState(false);

  const showDrawer = () => {
    setIsDrawerOpen(true);
  };

  const onClose = () => {
    setIsDrawerOpen(false);
  };

  const items: MenuItem[] = [
    {
      label: 'Exporter',
      key: 'export',
      icon: <ExportOutlined />,
    },
    {
      label: 'Importer',
      key: 'import',
      icon: <ImportOutlined />,
      // disabled: true
    },
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
    const readableDate = formatter.format(date);
    if (key === 'export') props.gridRef?.current?.api.exportDataAsCsv({
      processCellCallback: (params) => {
        return params.value;
      },
      processHeaderCallback: (params) => params.column.getColId(),
      columnKeys: ['text', 'author', 'info'], // Spécifiez explicitement les colonnes à exporter
      fileName: `export-WisNochKomt-${readableDate}.csv`
    });
    if (key === 'import') setIsImportPopinOpen(true);
  }

  const actAfterLoad = () => {
    setIsImportPopinOpen(false);
    onClose();
    if (props.refreshRef?.current) props.refreshRef.current();
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '3px', background: BACKGROUND_COLOR, height: TOOLBAR_HEIGHT }}>
        <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'white', letterSpacing: '-0,5px', marginLeft: '10px', marginTop: '5px' }}>WNK</div>
        <div>
          <Button type="text" icon={<MenuOutlined />} onClick={showDrawer} />
        </div>
      </div>
      <Drawer placement="top" closable={true} onClose={onClose} title="Actions..."
        open={isDrawerOpen} height='auto' style={{ marginLeft: 'auto', marginTop: TOOLBAR_HEIGHT, width: '400px', color: 'white' }} >
        <Menu mode="inline" items={items} onClick={onClick} />
      </Drawer>
      <Modal
        open={isImportPopinOpen}
        title="Import"
        onCancel={() => setIsImportPopinOpen(false)}
        footer={(_, { CancelBtn }) => (
          <>
            <CancelBtn />
          </>
        )}>
        <ImportCsv actAfterLoad={actAfterLoad} />
      </Modal>
    </>
  );
}
