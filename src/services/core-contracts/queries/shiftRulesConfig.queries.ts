import { gql } from 'graphql-tag';

/**
 * Find ShiftRulesConfig DTO with typed data
 */
export const FIND_SHIFTRULESCONFIG_DTO = gql`
  query FindShiftRulesConfigDto($_id: String!, $custominput: Dictionary) {
    response: find_ShiftRulesConfig_dto(_id: $_id, custominput: $custominput) {
      code
      message
      data {
        _id
        createdAt
        updatedAt
        createdBy
        updatedBy
        configKey
        minRestHoursBetweenShifts
        maxWorkingHoursPerWeek
        maxOvertimeHoursPerMonth
        allowAutoArrange
        enableViolationPenalty
        additionalSettings
        publishedAt {
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Kind
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Second
          Ticks
          TimeOfDay {
            Ticks
            Days
            Hours
            Milliseconds
            Microseconds
            Nanoseconds
            Minutes
            Seconds
            TotalDays
            TotalHours
            TotalMilliseconds
            TotalMicroseconds
            TotalNanoseconds
            TotalMinutes
            TotalSeconds
          }
          Year
        }
        publishedBy
        name
      }
    }
  }
`;

/**
 * Query ShiftRulesConfigs DTO list
 */
export const QUERY_SHIFTRULESCONFIGS_DTO = gql`
  query QueryShiftRulesConfigsDto(
    $filter: GeneralCollectionFilterInput,
    $custominput: Dictionary
  ) {
    response: query_ShiftRulesConfigs_dto(filter: $filter, custominput: $custominput) {
      code
      message
      records
      data {
        _id
        configKey
        minRestHoursBetweenShifts
        maxWorkingHoursPerWeek
        maxOvertimeHoursPerMonth
        allowAutoArrange
        enableViolationPenalty
        additionalSettings
        publishedAt {
          Date
          Day
          DayOfWeek
          DayOfYear
          Hour
          Kind
          Millisecond
          Microsecond
          Nanosecond
          Minute
          Month
          Second
          Ticks
          TimeOfDay {
            Ticks
            Days
            Hours
            Milliseconds
            Microseconds
            Nanoseconds
            Minutes
            Seconds
            TotalDays
            TotalHours
            TotalMilliseconds
            TotalMicroseconds
            TotalNanoseconds
            TotalMinutes
            TotalSeconds
          }
          Year
        }
        publishedBy
        name
      }
    }
  }
`;
