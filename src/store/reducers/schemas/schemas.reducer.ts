export const FETCH_ALL_SCHEMAS = 'SCHEMAS/FETCH_ALL_SCHEMAS';

export interface SchemasState {
    all_schemas: any[];
    loading: boolean;
    error: any;
}

const initialState: SchemasState = {
    all_schemas: [],
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
        default:
            return state;
    }
};

export default schemasReducer;
