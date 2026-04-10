import gql from "graphql-tag"

export const GET_MY_UNREAD_NOTIFY_STATE=gql`
mutation {
    response: notify_my_unread_notify_state  {
        code
        message
        data
    }
}              
`

export const GET_MY_TOTAL_UNREAD_NOTIFY=gql`
mutation {
    response: notify_my_total_unread_notify  {
        code
        message
        data
    }
}  
`
export const LOAD_MY_NOTIFY_BY_TYPE=gql`
mutation ($typeId:String,$skip:Float,$limit:Float){
    response: notify_load_my_notify (typeId: $typeId ,skip:$skip,limit:$limit)
}
`
export const UPDATE_READ_STATUS=gql`
mutation ($_id:String){
    response: notify_update_read_status (_id: $_id){
        code
        message
    }
}
`