export const FETCH_ALL_SCHEMAS = 'SCHEMAS/FETCH_ALL_SCHEMAS';
export const SET_JOURNEY_SETTING = 'SCHEMAS/SET_JOURNEY_SETTING';

export interface SchemasState {
    all_schemas: any[];
    journeySetting: any; // Type accurately as ICustomerJourneySetting where suitable
    loading: boolean;
    error: any;
}

const initialState: SchemasState = {
    all_schemas: [],
    journeySetting: null,
    loading: false,
    error: null
};

const schemasReducer = (state = initialState, action: any): SchemasState => {
    switch (action.type) {
        case FETCH_ALL_SCHEMAS:
            return {
                ...state,
                all_schemas: action.payload,
                loading: false
            };
        case SET_JOURNEY_SETTING:
            return {
                ...state,
                journeySetting: action.payload
            };
        default:
            return state;
    }
};

export default schemasReducer;
