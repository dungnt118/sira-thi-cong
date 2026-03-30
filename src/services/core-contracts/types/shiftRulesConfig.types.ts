import type { IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * ShiftRulesConfig interface
 * Auto-generated from Schema: ShiftRulesConfig
 */
export interface IShiftRulesConfig {
  _id: string;
  configKey?: string;
  minRestHoursBetweenShifts?: any[];
  maxWorkingHoursPerWeek?: any[];
  maxOvertimeHoursPerMonth?: any[];
  allowAutoArrange?: boolean;
  enableViolationPenalty?: boolean;
  additionalSettings?: any;
  publishedAt?: IPublishedatItem[];
  publishedBy?: string;
  name?: string;
}

export interface IPublishedatItem {
  Date?: string | Date;
  Day?: number;
  DayOfWeek?: PublishedatDayOfWeekEnum;
  DayOfYear?: number;
  Hour?: number;
  Kind?: PublishedatKindEnum;
  Millisecond?: number;
  Microsecond?: number;
  Nanosecond?: number;
  Minute?: number;
  Month?: number;
  Second?: number;
  Ticks?: any;
  TimeOfDay?: ITimeofdayItem[];
  Year?: number;
}

export interface ITimeofdayItem {
  Ticks?: any;
  Days?: number;
  Hours?: number;
  Milliseconds?: number;
  Microseconds?: number;
  Nanoseconds?: number;
  Minutes?: number;
  Seconds?: number;
  TotalDays?: number;
  TotalHours?: number;
  TotalMilliseconds?: number;
  TotalMicroseconds?: number;
  TotalNanoseconds?: number;
  TotalMinutes?: number;
  TotalSeconds?: number;
}

export interface ICreateShiftRulesConfigInput {
  configKey?: string;
  minRestHoursBetweenShifts?: any[];
  maxWorkingHoursPerWeek?: any[];
  maxOvertimeHoursPerMonth?: any[];
  allowAutoArrange?: boolean;
  enableViolationPenalty?: boolean;
  additionalSettings?: any;
  publishedAt?: IPublishedatItem[];
  publishedBy?: string;
  name?: string;
}

export type IShiftRulesConfigListResponse = ApiListResponse<IShiftRulesConfig>

// Union types generated from value_options
export type PublishedatDayOfWeekEnum = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type PublishedatKindEnum = 'Unspecified' | 'Utc' | 'Local';
