import React, { useState } from "react";
import UcsTableRow from './ucs-table-row.jsx';
import UcsTableHead from './ucs-table-head.jsx';
import UcsTableFooter from './ucs-table-footer.jsx';
import './ucs-table.css';

export default function UcsTable(props) {

    const ucsTable = React.createRef();
    const [state, setState] = useState({
        selectedItems: [],
        sortColumn: '',
        sortAsc: true,
        size: 10,
        currentPage: 1,
    });

    
    const sortRows = (rows) => {
        const {sortAsc, sortColumn} = state;
        return sortAsc
            ? rows.sort((b, a) => sorting(a, b))
            : rows.sort((a, b) => sorting(a, b));

        function sorting(a, b) {
            if (a[sortColumn] > b[sortColumn]) return -1;
            else if (a[sortColumn] < b[sortColumn]) return 1;
            else return 0;
        }
    }

    const onColumnSortHandler = (sortAsc, column) => {
        setState(() => ({
          ...state,
          sortAsc: sortAsc,
          sortColumn: column
        }))
    }

    const onRowSelect = (row, checked, rowId) => {
        const {selectedItems} = state;
        setState(() => ({
          ...state,
          selectedItems: checked ? [...selectedItems, row] : selectedItems.filter(item => item[props.rowId] !== rowId)
        }))
    }

    const onSelectAllHandler = (e) => {
        if (!e || !e.target) return;

        const isAllRowsSelected = e.target.checked;
        const selectedItems = isAllRowsSelected ? [...props.data] : []
        setState(() => ({
          ...state,
          selectedItems,
        }));
    }

    const onPageChange = (currentPage) => {
        setState(() => ({
            ...state,
            currentPage
        }))
    }

    const aggregateTableData = (data) => {
        const {size, currentPage} = state;
        let updatedData = data;
        if (data.length > size) {
            const buffer = currentPage > 1 ? size * (currentPage - 1) : 0;
            updatedData = data.slice(buffer, buffer + size)
        }

        return state.sortColumn ? sortRows(updatedData) : updatedData;
    }

    const {columns, selectAll, selectable} = props;
    const data = aggregateTableData(props.data);

    return (
        <div className="table ant-table" ref={ucsTable}>
            <UcsTableHead
                data={columns}
                selectAll={selectAll}
                onSelectAllHandler={onSelectAllHandler}
                onColumnSortHandler={onColumnSortHandler} />
            <div className="table-body ant-table-tbody">
                {(data || []).map((item, i) => {
                return <UcsTableRow
                        className="table-row"
                        onSelect={onRowSelect}
                        rowData={item}
                        columns={columns}
                        selected={state.selectedItems.find(el => el[props.rowId] === item[props.rowId])}
                        selectable={selectable}
                        key={item[props.rowId]}
                        rowId={item[props.rowId]}
                        />
                })}                    
            </div>
            {props.data.length > state.size ? (
                <UcsTableFooter
                    data={props.data}
                    size={state.size}
                    onPageChange={onPageChange}
                    />
            ) : null}
        </div>
    )
}