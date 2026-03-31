
import gql from 'graphql-tag';


export const MUTATION_REGISTER_DEVICE = gql`
mutation($data:PushDeviceInput!){
  response:reg_push_device(data:$data){
    code
    message
  }
}
`
export const CHANGE_ACCOUNT_GROUP = gql`
mutation($groupId:String!){
  response:change_default_group(groupId:$groupId){
    code
    message
    data
  }
}
`
