import {ADD_NEW_SERVER, GET_LOCATIONS, GET_SERVER_LIST, GET_CURRENT_LOCATION} from '../actions/index.jsx';

const initialState = {
    serverList: [],
    locations: [],
    currentLocation: ''
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_NEW_SERVER:
            return {...state, serverList: [...state.serverList, action.payload]}
        case GET_LOCATIONS:
            return {...state, locations: action.payload}
        case GET_SERVER_LIST:
                return {...state, serverList: action.payload}
        case GET_CURRENT_LOCATION:
            return {...state, currentLocation: action.payload}
        default:
            return state;
    }
};