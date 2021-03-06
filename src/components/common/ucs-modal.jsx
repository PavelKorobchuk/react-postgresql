import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import './ucs-modal.css';

const modalContainer = (props) => {
    const {children, onClose, title, footer, savedFocusedEl} = props;
    const isPropFunc = (prop) => prop && typeof prop === 'function';
    const onKeyUpHandler = (e) => {
        if (e && e.keyCode === 27) onModalClose();
    }
    const [state, setState] = useState({
       isShown: true 
    });

    const onModalClose = () => {
        setState(() => ({
            ...state,
            isShown: false
        }));
        savedFocusedEl && savedFocusedEl.focus();
    };

    useEffect(() => {
        if (!state.isShown) setTimeout(() => onClose && typeof onClose === 'function' && onClose(), 300);
    }, [state]);

    useEffect(() => {
        document.addEventListener('keydown', onKeyUpHandler, false);
        return () => {
            document.removeEventListener('keydown', onKeyUpHandler, false);
        }
    }, []);
    
    return (
        <div className={`modal-background ${!state.isShown ? 'hidden' : 'visible'}`} onClick={onModalClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <span className="close-icon" onClick={onModalClose}>X</span>
                {title ? (<div className="modal-header">{isPropFunc(title) ? title() : title}</div>) : null }
                {children ? (<div className="modal-body">{isPropFunc(children) ? children() : children}</div>) : null }
                {footer ? (<div className="modal-footer">{isPropFunc(footer) ? footer() : footer}</div>) : null }
            </div>
        </div>
    )
}

export default function UcsModal(props) {
    return ReactDOM.createPortal(modalContainer(props), props.domNode)
}
