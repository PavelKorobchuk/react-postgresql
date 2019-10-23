import React, {useState, useEffect} from 'react'
import {Descriptions} from 'antd';
import {socket} from '../App.jsx';

const ServerDataMap = {
    id: 'Id',
    name: 'Name',
    health: 'Health',
    admin_state: 'Admin State',
};

export default function ServerDetails(props) {
    const moId = props.match.params.id;
    const [state, setState] = useState({
        serverData: {}
    });

    useEffect(() => {
        socket.emit("initial_server_info", moId);
        socket.on("get_server_info", res => {
            let server = {};
            if (Array.isArray(res) || res.length) {
                server = res[0];
            };

            setState(() => ({
                ...state,
                serverData: server
            }))
        });

        // ==== on unmount function ==== //
        return () => {
            socket.off("get_server_info");
        }
    }, []);

    return (
            <div className="server-list-table">
                <div className="serverlist-title">{`Server Name: ${state.serverData.name}`}</div>
                <div className="serverlist-content">
                    <Descriptions title="Server Info" bordered size="small">
                        {Object.keys(state.serverData).map(key => {
                            const label = ServerDataMap[key];
                            if (label && state.serverData[key] !== 'undefined') {
                                return <Descriptions.Item span={3} key={key} label={label}>{state.serverData[key]}</Descriptions.Item>
                            }
                            return null;
                        })}
                    </Descriptions>
                </div>
            </div>
    )
}