import React, {useState, useEffect, useRef, Fragment} from 'react';
import UcsTable from '../common/ucs-table.jsx';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';
import './LocationPage.css';
import {socket} from '../App.jsx';
import {getLocationsMiddleware} from '../../actions/index.jsx';

const mockColumns = [
    {
        label: 'Name',
        path: 'name',
        sort: true,
        render: (item, data) => <Link to={`/list/${data.id}`}>{item}</Link>
    },
    {
        label: 'Id',
        path: 'id',
        sort: true,
    },
    {
        label: 'Servers Ids',
        path: 'servers',
        sort: true,
        render: (data) => <Fragment>{data.map(item => (<span key={item}>{`${item}, `}</span>))}</Fragment>
    }
];

const setMapMarkers = (data, map) => {
    data.forEach(item => {
        if (!item.lat || !item.ln) return;
        window.L.marker([item.lat, item.ln]).addTo(map)
    })
}

const drawServerMap = (mapRef, data) => {
    if (!mapRef || !mapRef.current) return;
    const map = window.L.map(mapRef.current).setView([51.505, -0.09], 1);

    setMapMarkers(data, map)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGtvcm9iY2h1ayIsImEiOiJjazFrZ2xza3cxNzhxM3BqeTJ6MWRubmo1In0.bsGxSECxEUm4OhcGcGzTKw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoicGtvcm9iY2h1ayIsImEiOiJjazFrZ2xza3cxNzhxM3BqeTJ6MWRubmo1In0.bsGxSECxEUm4OhcGcGzTKw'
    }).addTo(map);
}

function LocationPage(props) {
    const mapRef = useRef();

    useEffect(() => {
        
        socket.emit("initial_locations");
        socket.on("get_locations", res => {
            const cities = (res || []);
            drawServerMap(mapRef, cities);
            props.dispatchGetLocations(cities);
        });
        socket.on("change_locations", () => {
            socket.emit("initial_locations");
        });

        // ==== on unmount function ==== //
        return () => {
            socket.off("get_locations");
            socket.off("change_locations");
        }
    }, []);

    return (
            <div>
                <div className="title">Server Locations</div>
                <div id="mapid" ref={mapRef}></div>
                {props.locations && props.locations.length ? (
                    <div className="table-layout">
                        <UcsTable
                            id="tableId"
                            data={props.locations}
                            columns={mockColumns}
                            selectAll={true}
                            selectable={true}
                            rowId="id"
                        />
                    </div>
                ) : null}
            </div>
    )
};

const mapStateToProps = (state) => {
    return {
        locations: state.serverReducer.locations
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatchGetLocations: (payload) => dispatch({ type: 'GET_LOCATIONS', payload })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationPage);