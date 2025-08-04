"use client"
import { Expression } from "@/types/Expression";
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { useMemo } from "react";
import { SuppressButonCellRenderer } from "./CellRenderers";
import './expressions.css';
import { themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridExpression extends Expression { id?: number };

export interface ExpressionsGridProps {
    expressions: Expression[]
    refresh: () => void;
    actOnRowClick: (id?: number) => void
    gridRef: React.RefObject<AgGridReact<GridExpression>>;
    textFilter: string
}
export const ExpressionsGrid = ({ actOnRowClick, ...props }: ExpressionsGridProps) => {
    const colDefs = useMemo<ColDef<GridExpression>[]>(() => ([
        {
            field: 'id',
            hide: true,
            sort: 'asc'
        },
        {
            headerName: 'Expression',
            field: 'text',
            flex: 5,
            editable: false,
            filter: true
        },
        {
            headerName: 'Auteur',
            field: 'author',
            flex: 2,
            filter: true
        },
        {
            headerName: 'Contexte',
            field: 'info',
            flex: 1,
            filter: true
        },
        {
            colId: 'suppress',
            width: 20,
            cellRenderer: SuppressButonCellRenderer,
        }
    ]), []);


    const myTheme = themeQuartz
        .withParams({
            accentColor: "slateGrey",
            backgroundColor: "#48538A",
            borderColor: "slateGrey",
            borderRadius: 5,
            browserColorScheme: "dark",
            cellHorizontalPaddingScale: 0.8,
            cellTextColor: "white",
            columnBorder: true,
            fontFamily: {
                googleFont: "IBM Plex Mono"
            },
            fontSize: 16,
            foregroundColor: "#68FF8E",
            headerBackgroundColor: "#48538A",
            headerFontSize: 14,
            headerFontWeight: 700,
            headerTextColor: "white",
            headerVerticalPaddingScale: 1.5,
            oddRowBackgroundColor: "#3A4270",
            rangeSelectionBackgroundColor: "#FFFF0020",
            rangeSelectionBorderColor: "lightGrey",
            rowBorder: true,
            rowVerticalPaddingScale: 1.5,
            sidePanelBorder: true,
            spacing: 4,
            wrapperBorder: true,
            wrapperBorderRadius: 0,
        });


    return (
        <div className="ag-theme-alpine custom-grid" style={{ height: '100%', width: '100%', flex: 1 }}>
            <AgGridReact
                rowData={props.expressions}
                columnDefs={colDefs}
                context={{ refresh: props.refresh }}
                onCellClicked={(event) => {
                    if (event.data && ['info', 'text', 'author'].includes(event.column.getColId())) actOnRowClick(event.data?.id)
                }}
                ref={props.gridRef}
                theme={myTheme}
                quickFilterText={props.textFilter}
            />
        </div>
    )
}