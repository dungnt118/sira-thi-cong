import { combineReducers } from '@reduxjs/toolkit';
import login from './login.reducer';
import user from './user.reducer';

const authReducers = combineReducers({
    user,
    login,
});

export type AuthState = ReturnType<typeof authReducers>;

export default authReducers;