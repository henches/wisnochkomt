"use client"
import { Expression } from "@/types/Expression";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { SuppressButonCellRenderer } from "./CellRenderers";

ModuleRegistry.registerModules([AllCommunityModule]);

export interface ExpressionsGridProps {
    expressions: Expression[]
    refresh: () => void;
}
export const ExpressionsGrid = (props: ExpressionsGridProps) => {
    console.log("🚀 ~ ExpressionsGrid ~ props:", props)
    const colDefs = useMemo<ColDef[]>(() => ([
        { field: 'id', flex: 1 },
        {
            field: 'text', flex: 5,
            editable: true,
            cellEditor: 'agLargeTextCellEditor',
            cellEditorPopup: true,
            cellEditorParams: {
                rows: 10,
                cols: 100,
                maxLength: 1000
            }
        },
        { field: 'info', flex: 2 },
        { colId: 'suppress', flex: 1, cellRenderer: SuppressButonCellRenderer }
    ]), []);

    console.log("🚀 ~ ExpressionsGrid ~ props.expressions:", props.expressions)
    return (
        <div className="ag-theme-alpine" style={{ width: "100%", flex: 1 }}>
            <AgGridReact rowData={props.expressions} columnDefs={colDefs} context={{ refresh: props.refresh }} />
        </div>
    )
}