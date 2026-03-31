import * as Actions from '../actions/login.actions';

export interface LoginState {
    success: boolean;
    error: any;
}

const initialState: LoginState = {
    success: false,
    error: {
        username: null,
        password: null
    }
};

const login = function (state: LoginState = initialState, action: any): LoginState {
    switch (action.type) {
        case Actions.LOGIN_SUCCESS: {
            return {
                ...initialState,
                success: true
            };
        }
        case Actions.LOGIN_ERROR: {
            return {
                success: false,
                error: action.payload
            };
        }
        default: {
            return state;
        }
    }
};

export default login;