import { gql } from 'graphql-tag';

/**
 * Find DebtCollectionTask DTO with typed data
 */
export const FIND_DEBTCOLLECTIONTASK_DTO = gql`
  query FindDebtCollectionTaskDto($_id: String!, $custominput: Dictionary) {
    response: find_DebtCollectionTask_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        payment_milestone_id
        idx_payment_milestone_id
        payment_milestone_id
        debt_confirmation_id
        idx_debt_confirmation_id
        debt_confirmation_id
        project_id
        idx_project_id
        project_id
        customer_id
        idx_customer_id
        customer_id
        task_type
        status
        assigned_user
        scheduled_at
        completed_at
        debt_amount
        customer_commitment_date
        result_note
        next_action
        evidence_files
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;

/**
 * Query DebtCollectionTasks DTO list
 */
export const QUERY_DEBTCOLLECTIONTASKS_DTO = gql`
  query QueryDebtCollectionTasksDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_DebtCollectionTasks_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        code
        journey_id
        idx_journey_id
        journey_id
        journey_step_code
        payment_milestone_id
        idx_payment_milestone_id
        payment_milestone_id
        debt_confirmation_id
        idx_debt_confirmation_id
        debt_confirmation_id
        project_id
        idx_project_id
        project_id
        customer_id
        idx_customer_id
        customer_id
        task_type
        status
        assigned_user
        scheduled_at
        completed_at
        debt_amount
        customer_commitment_date
        result_note
        next_action
        evidence_files
        contract_id
        idx_contract_id
        contract_id
      }
    }
  }
`;
