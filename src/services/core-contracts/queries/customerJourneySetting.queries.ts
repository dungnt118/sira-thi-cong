import { gql } from 'graphql-tag';

/**
 * Find CustomerJourneySetting Setting — Single document, no _id needed.
 * `data` is a scalar field, do not expand subfields.
 */
export const FIND_CUSTOMERJOURNEYSETTING_SETTING = gql`
  query FindCustomerJourneySettingSetting($schema: String!) {
    response: find_setting(schema: $schema) {
      code
      message
      data
    }
  }
`;

/**
 * Save CustomerJourneySetting Setting — Single document, always upsert singleton.
 * `data` is a scalar field, do not expand subfields.
 */
export const SAVE_CUSTOMERJOURNEYSETTING_SETTING = gql`
  mutation SaveCustomerJourneySettingSetting($schema: String!, $data: Dictionary!) {
    response: save_setting(schema: $schema, data: $data) {
      code
      message
      data
    }
  }
`;
