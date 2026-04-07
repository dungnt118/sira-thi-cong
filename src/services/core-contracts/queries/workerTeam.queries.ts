import { gql } from 'graphql-tag';

/**
 * Find WorkerTeam DTO with typed data
 */
export const FIND_WORKERTEAM_DTO = gql`
  query FindWorkerTeamDto($_id: String!, $custominput: Dictionary) {
    response: find_WorkerTeam_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        teamName
        contactName
        phone
        email
        zalo
        status
        joinDate
        specializations
        rating
        totalProjects
        completedProjects
        taxCode
        bankAccount
        city
        ward
        address
        lat
        lng
        note
      }
    }
  }
`;

/**
 * Query WorkerTeams DTO list
 */
export const QUERY_WORKERTEAMS_DTO = gql`
  query QueryWorkerTeamsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_WorkerTeams_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        teamName
        contactName
        phone
        email
        zalo
        status
        joinDate
        specializations
        rating
        totalProjects
        completedProjects
        taxCode
        bankAccount
        city
        ward
        address
        lat
        lng
        note
      }
    }
  }
`;
