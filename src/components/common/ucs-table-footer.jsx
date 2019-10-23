import React, {useState} from 'react';

export default function UcsTableFooter(props) {
    const {data, size} = props;
    const [state, setState] = useState({
        currentPage: 1
    });
    
    const renderPagination = () => {
        const pageCount = Math.ceil(data.length / size);
        const arr = Array.from(Array(pageCount), (_, x) => x + 1);

        const onPagClick = (page) => {
            setState({...state, currentPage: page});
            props.onPageChange(page);
        };

        const onArrowClick = (type) => {
            const isPrev = type === 'prev';
            const page = isPrev ? state.currentPage - 1 : state.currentPage + 1;
            const notLastPage = (isPrev && page > 0) || (!isPrev && state.currentPage < data.length / size);
            notLastPage && onPagClick(page);
        };

        return (
            <div>
                <button className="prev" onClick={() => onArrowClick('prev')}>{' < '}</button>
                {arr.map(item => {
                    return (
                        <button
                            key={`p-${item}`}
                            className={`pag-item ${state.currentPage === item ? 'active' : ''}`}
                            onClick={() => onPagClick(item)}>{item}</button>
                    )
                })}
                <button className="next" onClick={() => onArrowClick('next')}>{' > '}</button>
            </div>
        )
        
    };

    return (
        <div className="table-footer">
            {data.length ? (
                <div className="pagination">
                    {renderPagination()}
                </div>
            ) : null}
        </div>
    )
}
