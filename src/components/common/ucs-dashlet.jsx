import React, {useEffect, useRef} from 'react';
import './ucs-dashlet.css';
import { fromEvent } from 'rxjs';

export default function UcsDashlet(props) {
    const comRef = useRef();
    const {order} = props;

    useEffect(() => {   
        if (!comRef.current) return;
        
        const dragStart$ = fromEvent(comRef.current, 'dragstart');
        const dragOver$ = fromEvent(comRef.current, 'dragover');
        const drop$ = fromEvent(comRef.current, 'drop');
        const dragger = dragOver$.subscribe(e => {
            e.dataTransfer.dropEffect = "move";
            e.preventDefault()
        });

        const dragStarter = dragStart$.subscribe(v => {
            v.dataTransfer.dropEffect = "move";
            v.dataTransfer.setData('text', order.pos);
        });

        const dropper = drop$.subscribe(v => {
            const dragPos = parseFloat(v.dataTransfer.getData('text'));
            const dropPos = order.pos;
            props.reorderDashlets(dragPos, dropPos);
        });

        return () => {
            dropper.unsubscribe();
            dragger.unsubscribe();
            dragStarter.unsubscribe();
        }

    }, [props.order]);
    return (
            <div>
                <div
                    style={order.style}
                    ref={comRef}
                    className="dashlet"
                    // onDragOver={e => e.preventDefault()}
                    // onDragLeave={e => props.onDragEnterLeaveHandler(e, order.pos)}
                    // onDragEnter={e => props.onDragEnterLeaveHandler(e, order.pos, 'enter')}
                    // onDrop={(e) => props.dropHandler(e, order.pos)}
                    // onDragStart={(e) => props.onDragStartHandler(e, order.pos)}
                    // onDragEnd={(e) => props.onDragEndHandler(e, order.pos)}
                    draggable
                >
                <div className="dashlet-header">{props.data.title}</div>
                <div className="dashlet-body">{order.id}</div>
            </div>
        </div>
    )
}
