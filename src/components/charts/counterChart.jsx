import React, { Fragment } from 'react';
import './counterChart.css'
export default function CounterChart(props) {
    const {data} = props;
    
    return (
        <Fragment>
            <div className="counter-layout">
                {data ? (
                    <div className="chart">
                        <div className="chart-label">{data.label || ''}</div>
                        <div className="chart-label">{data.value || ''}</div>
                    </div>
                ) : null}
            </div>
        </Fragment>
    )
}
