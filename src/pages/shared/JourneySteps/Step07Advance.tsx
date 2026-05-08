/**
 * @deprecated Removed in Wave 1 (gap-analysis 2026-05-08, W1-07).
 *
 * Tạm ứng / Đặt cọc is no longer a separate step or a sub-step of contract.
 * Per business rule, advance deposits can be invoiced during many journey steps
 * (especially execution) following the contract's payment schedule. They are
 * therefore rendered as one section inside Step10Payment, classified by the new
 * `PaymentMilestone.kind = 'advance_deposit'` schema field.
 *
 * This stub stays as a thin re-export so any lingering import keeps compiling —
 * but new code MUST import Step10Payment directly.
 */

import React from 'react';
import { Step10Payment } from './Step10Payment';
import type { Step10PaymentProps } from './Step10Payment';

export type Step07AdvanceProps = Omit<Step10PaymentProps, 'initialKindFilter'>;

export const Step07Advance: React.FC<Step07AdvanceProps> = (props) => (
    <Step10Payment {...props} initialKindFilter="advance_deposit" />
);

export default Step07Advance;
