import React, {useEffect, useState} from 'react';
import UcsDashlet from '../common/ucs-dashlet.jsx';

interface Props {};
interface DashletsOrder {
    dragOrder: number,
    dropOrder: number
};

const getDashletPosition = (order: number) => {
    const row = Math.floor(order / 3);
    const maringBottom = 15 * row;
    return {
        left: `${(order % 3) * 33.3333}%`,
        top: `${((300 * row) + (row ? maringBottom : 0))}px`
    }
};

const getPositionStyles = (order: number) => {
    const row = Math.floor(order / 3);
    const maringBottom = 15 * row;
    return {
        left: `${(order % 3) * 33.3333}%`,
        top: `${((300 * row) + (row ? maringBottom : 0))}px`
    }
};

export default function Dashboard(props: Props) {
    const data: Array<any> = [
        {id: 'id1', title: 'title 1'},
        {id: 'id2', title: 'title 2'},
        {id: 'id3', title: 'title 3'},
        {id: 4, title: 'title'},
        {id: 5, title: 'title'},
        {id: 6, title: 'title'},
        {id: 7, title: 'title'}
    ];

    const [state, setState] = useState({orderSheet: []});

    useEffect(() => {
        setState(() => ({
            orderSheet: [...data.map((item, i) => ({
                id: item.id,
                pos: i,
                style: getPositionStyles(i)
            }))]
        }));
    }, []);

    const reorderDashlets = (dragOrder: DashletsOrder, dropOrder: DashletsOrder) => {
        const {orderSheet} = state;
        const data = orderSheet.map(item => {
            let dashlet;
            switch(true) {
                case (item.pos === dragOrder):
                    dashlet = {...item, pos: dropOrder};
                break;
                case (dragOrder > dropOrder):
                    dashlet = (item.pos >= dropOrder && item.pos <= dragOrder) ? {...item, pos: item.pos + 1} : item;
                break;
                case (dragOrder < dropOrder):
                    dashlet = (item.pos <= dropOrder && item.pos >= dragOrder) ? {...item, pos: item.pos - 1} : item;
                break;
                default:
                    dashlet = item;
                break;
            }
    
            return {...dashlet, style: getDashletPosition(dashlet.pos)}
        });

        setState(() => ({
            ...state,
            orderSheet: data
        }));
    };

    return (
        <div className="dashboard-layout">
            <div className="dashboard-tabs">Tab 1 | Tab 2 | Tab 3</div>
            <div className="dashboard-container droppable">
                {state.orderSheet.length ? data.map((item, i) => {
                    return (
                        <UcsDashlet
                            key={`${item.id}-key`}
                            order={state.orderSheet.find(el => el.id === item.id)}
                            data={item}
                            reorderDashlets={reorderDashlets}
                        />
                    )
                }) : null}
            </div>
        </div>
    )
}
