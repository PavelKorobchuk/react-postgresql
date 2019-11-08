import React, {useState, useEffect} from 'react';
import UcsTable from '../common/ucs-table.jsx';
import UcsModal from '../common/ucs-modal.jsx';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import Pie from '../charts/pieChart.jsx';
import CounterChart from '../charts/counterChart.jsx'
import {Button} from 'antd';
import {socket} from '../App.jsx';

const mockColumns = [
    {
        label: 'Server Id',
        path: 'id',
        sort: true,
        render: (data) => <Link to={`/details/${data}`}>{data}</Link>
    },
    {
        label: 'Name',
        path: 'name',
        sort: true
    },
    {
        label: 'Health',
        path: 'health',
        sort: true
    }
];

const addServerRequest = (serverName, props, cb) => {
    const data = JSON.stringify({
        city_id: props.match.params.id,
        name: serverName,
        health: 'healthy',
        admin_state: 'connected'
    });
    
    socket.emit("add_server", data, cb);
};

const generateDashletData = (servers, path) => {
    const data = {};
    servers.forEach(item => data[item[path]] = data[item[path]] ? data[item[path]] + 1 : 1);
    return Object.keys(data).map(status => ({
        label: status,
        value: data[status],
    }));
};

function ServerListPage(props) {
    const {currentLocation, serverList = []} = props;
    const appRoot = document.getElementById("root");
    const moId = props.match.params.id;
    const [formState, setFormState] = useState({
        isValid: false,
        serverName: ''
    });
    const [modalState, setModalState] = useState({
        show: false,
        savedFocusedEl: null
    });

    useEffect(() => {
        socket.emit("initial_server_data", moId);
        socket.on("get_server_data", res => {
            const servers = (res || []);
            props.dispatchSetServers(servers[0]);
            props.dispatchSetCurrentLocation(servers[1][0].name);
        });
        socket.on("change_server_data", () => {
            socket.emit("initial_server_data", moId);
        });

        // ==== on unmount function ==== //
        return () => {
            socket.off("get_server_data");
            socket.off("change_server_data");
        }
    }, []);

    const showHideModal = (type, e) => {
        const focusEL = (e && e.target) || modalState.savedFocusedEl;
        setModalState(() => ({
            show: type === 'show',
            savedFocusedEl: focusEL
        }));
    }

    const isInputValid = (value) => value && !value.match(/\s/g);

    const onInputChangeHandler = (e) => {
        const value = e.target.value;
        const isValid = isInputValid(value);
        setFormState(() => ({
            ...formState,
            serverName: value,
            isValid
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formState.isValid) {
            addServerRequest(formState.serverName, props, () => {
                setTimeout(() => {
                    showHideModal('hide');
                }, 300);
            });
        }
    }

    const renderAddServerForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <label>
                    <input
                        type="text"
                        name="serverName"
                        className="ucs-input"
                        value={formState.serverName}
                        onChange={onInputChangeHandler} 
                        required
                        pattern="^\S+$"
                    />
                </label>
                <Button type="primary" htmlType="submit">+ Add Server</Button>
            </form>
        )
    }
    return (
            <div className="server-list-table">
                <div className="serverlist-title">{`Location: ${currentLocation}`}</div>
                <div className="dashlet-layout">
                    <div className="dashlet dashlet-pie">
                        <Pie
                            data={generateDashletData(serverList, 'health')}
                            width="200"
                            height="200"
                            innerRadius={60}
                            outerRadius={100}
                        />
                    </div>
                    {generateDashletData(serverList, 'admin_state').map(item => {
                        return (
                            <div key={item.label} className="dashlet dashlet-counter">
                                <CounterChart data={item} />
                            </div>
                        )
                    })}
                </div>
                <Button type="primary" className="primary-btn" onClick={(e) => showHideModal('show', e)}>Add Server</Button>
                <UcsTable
                    id="tableId"
                    data={serverList}
                    columns={mockColumns}
                    selectAll={true}
                    selectable={true}
                    rowId="id"
                />
                {modalState.show ? (
                    <UcsModal
                        savedFocusedEl={modalState.savedFocusedEl}
                        domNode={appRoot}
                        onClose={() => showHideModal('hide')}
                        title={"Modal title"}
                        footer={"Modal footer"}
                    >
                        <div>{renderAddServerForm()}</div>
                    </UcsModal>
                ) : null}
            </div>
    )
};

const mapStateToProps = (state) => {
    return {
        serverList: state.serverReducer.serverList,
        currentLocation: state.serverReducer.currentLocation
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchAddServer: (payload) => dispatch({ type: 'ADD_NEW_SERVER', payload }),
        dispatchSetServers: (payload) => dispatch({ type: 'GET_SERVER_LIST', payload }),
        dispatchSetCurrentLocation: (payload) => dispatch({ type: 'GET_CURRENT_LOCATION', payload })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerListPage)