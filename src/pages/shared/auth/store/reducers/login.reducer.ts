import * as Actions from '../actions/login.actions';

const initialState = {
    success: false,
    error  : {
        username: null,
        password: null
    }
};

const login = function (state = initialState, action: any) {
    switch ( action.type )
    {
        case Actions.LOGIN_SUCCESS:
        {
            return {
                ...initialState,
                success: true
            };
        }
        case Actions.LOGIN_ERROR:
        {
            return {
                success: false,
                error  : action.payload
            };
        }
        default:
        {
            return state
        }
    }
};

export default login;