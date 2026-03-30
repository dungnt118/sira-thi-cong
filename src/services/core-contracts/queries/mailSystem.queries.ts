import { gql } from 'graphql-tag';

/**
 * Find MailSystem Setting — Single document, no _id needed.
 * `data` is a scalar field, do not expand subfields.
 */
export const FIND_MAILSYSTEM_SETTING = gql`
  query FindMailSystemSetting($schema: String!) {
    response: find_setting(schema: $schema) {
      code
      message
      data
    }
  }
`;

/**
 * Save MailSystem Setting — Single document, always upsert singleton.
 * `data` is a scalar field, do not expand subfields.
 */
export const SAVE_MAILSYSTEM_SETTING = gql`
  mutation SaveMailSystemSetting($schema: String!, $data: Dictionary!) {
    response: save_setting(schema: $schema, data: $data) {
      code
      message
      data
    }
  }
`;
