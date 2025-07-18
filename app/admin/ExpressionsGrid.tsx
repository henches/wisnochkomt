"use client"
import { Expression } from "@/types/Expression";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { SuppressButonCellRenderer } from "./CellRenderers";
import './expressions.css';

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridExpression extends Expression { id?: number };

export interface ExpressionsGridProps {
    expressions: Expression[]
    refresh: () => void;
    actOnRowClick: (id?: number) => void
    gridRef: React.RefObject<AgGridReact>;
}
export const ExpressionsGrid = ({ actOnRowClick, ...props }: ExpressionsGridProps) => {
    const colDefs = useMemo<ColDef<GridExpression>[]>(() => ([
        {
            headerName: 'Expression',
            field: 'text',
            flex: 5,
            editable: false,
        },
        {
            headerName: 'Auteur',
            field: 'author',
            flex: 1,
        },
        {
            headerName: 'Contexte',
            field: 'info',
            flex: 2,
        },
        {
            colId: 'suppress',
            width: 20,
            cellRenderer: SuppressButonCellRenderer,
            style: { paddingLeft: '0' }
        }
    ]), []);

    console.log("🚀 ~ ExpressionsGrid ~ props.expressions:", props.expressions)
    return (
        <div className="ag-theme-alpine" style={{ height: '100%', width: '100%', flex: 1 }}>
            <AgGridReact
                rowData={props.expressions}
                columnDefs={colDefs}
                context={{ refresh: props.refresh }}
                onCellClicked={(event) => {
                    if (event.data && ['info', 'text'].includes(event.column.getColId())) actOnRowClick(event.data?.id)
                }}
                ref={props.gridRef}
            />
        </div>
    )
}