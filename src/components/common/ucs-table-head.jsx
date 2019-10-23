import React from 'react';
import PropTypes from 'prop-types';
import UcsTableTh from './ucs-table-th.jsx';
import { Checkbox } from 'antd';

export default function UcsTableHead(props) {
    const {selectAll, data} = props;
    const sortTrigger = (sortAsc, element) => {
        if (typeof props.onColumnSortHandler === 'function') props.onColumnSortHandler(!sortAsc, element);
    }

    return (
        <div className="table-header ant-table-thead">
            {selectAll ? (
                <div className="th">
                    <Checkbox defaultChecked={false} onChange={props.onSelectAllHandler} />
                </div>) : null}
            {(data || []).map(th => <UcsTableTh key={`${th.path}-th`} data={th} dispatchClickTrigger={sortTrigger} />)}
        </div>
    )
}

UcsTableHead.propTypes = {
    data: PropTypes.array,
    selectAll: PropTypes.bool,
};