import React, { Fragment } from 'react'
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';

export default function UcsTableRow(props) {
    const {rowData, columns, selectable, rowId, onSelect, selected} = props;
    const onRowSelectHandler = (e) => {
        const checked = e.target.checked;
        e.stopPropagation();
        onSelect(rowData, checked, rowId);
    }
    return (
        <div className="table-row">
            {(columns).map((column, j) => {
                return (
                    <Fragment key={`td-${rowData[columns.path]}-${j}` || j}>
                        {selectable && !j ? (
                            <div className="td"><Checkbox onChange={onRowSelectHandler} checked={!!selected}/></div>
                        ) : null}
                        <div className="td">
                            {column.render && typeof column.render === 'function' ? (column.render(rowData[column.path], rowData)) : rowData[column.path]}
                        </div>
                    </Fragment>
                )
            })}
        </div>
    )
}

UcsTableRow.propTypes = {
    rowData: PropTypes.object,
    columns: PropTypes.array,
    selectable: PropTypes.bool,
};