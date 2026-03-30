import { gql } from 'graphql-tag';

/**
 * Find PushDevice DTO with typed data
 */
export const FIND_PUSHDEVICE_DTO = gql`
  query FindPushDeviceDto($_id: String!, $custominput: Dictionary) {
    response: find_PushDevice_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        tokenId
        deviceId
        username
        platform
        appId
        p256dh
        auth
        last_ip
        device_info
        extra_info
        name
      }
    }
  }
`;

/**
 * Query PushDevices DTO list
 */
export const QUERY_PUSHDEVICES_DTO = gql`
  query QueryPushDevicesDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_PushDevices_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        tokenId
        deviceId
        username
        platform
        appId
        p256dh
        auth
        last_ip
        device_info
        extra_info
        name
      }
    }
  }
`;
