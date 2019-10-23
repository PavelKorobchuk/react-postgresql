import React, {useState} from 'react'

export default function UcsTableTh(props) {
    const [sortAsc, setState] = useState(false);
    const {data} = props;

    const onClickHandler = (e) => {
        setState(!sortAsc);
        if (typeof props.dispatchClickTrigger === 'function') props.dispatchClickTrigger(!sortAsc, data.path);
    }
    return (
        <div className={`th ${data.sort ? 'sortable' : ''}`} onClick={onClickHandler}>
            {sortAsc ? '< ' : '> '}
            {data.label || ''}
        </div>
    )
}
