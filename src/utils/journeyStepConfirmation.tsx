import React from 'react';
import { message, notification } from 'antd';
import { journeyService } from '../services/core-contracts/services/journey.service';
import type { IWorkTask } from '../services/core-contracts/types/workTask.types';

/** Map `journey.current_step` (enum BAC) → mã bước template (S01_INFO, …). */
export const HEADER_STEP_KEY_TO_TEMPLATE_STEP_CODE: Record<string, string> = {
    lead_new: 'S01_INFO',
    consult_contact: 'S02_CONSULT',
    site_survey: 'S03_SURVEY',
    solution_design: 'S04_SOLUTION',
    quotation: 'S05_QUOTE',
    contract: 'S06_CONTRACT',
    execution: 'S08_CONSTRUCT',
    final_acceptance: 'S09_ACCEPTANCE',
    payment: 'S10_PAYMENT',
    maintenance: 'S11_MAINTAIN',
    warranty: 'S12_WARRANTY',
    after_sales: 'S13_CARE',
};

export const JOURNEY_STEP_SEQUENCE = [
    'lead_new',
    'consult_contact',
    'site_survey',
    'solution_design',
    'quotation',
    'contract',
    'execution',
    'final_acceptance',
    'payment',
    'maintenance',
    'warranty',
    'after_sales',
] as const;

export type JourneyAdvanceStepResult = 'advanced' | 'blocked' | 'last' | 'invalid';

export function headerStepKeyToStandardProcedureGroupCd(
    headerStepKey: string,
    journeySteps: { step_code?: string; standardProcedureGroupCd?: string }[]
): string | undefined {
    const sCode = HEADER_STEP_KEY_TO_TEMPLATE_STEP_CODE[headerStepKey] || headerStepKey;
    return journeySteps.find((s) => s.step_code === sCode)?.standardProcedureGroupCd;
}

type ModalLike = {
    warning?: (config: { title?: React.ReactNode; content?: React.ReactNode; okText?: string }) => void;
};

/**
 * Giống JourneyStepRenderer: kiểm tra nhiệm vụ bắt buộc của `actualStep`, rồi `current_step` → bước kế.
 */
export async function confirmAdvanceJourneyStep(options: {
    journeyId: string;
    /** Mã bước trên Journey (vd. `lead_new`) — trùng `journey.current_step` khi chốt bước hiện tại. */
    actualStep: string;
    workTasks: IWorkTask[];
    modalApi?: ModalLike | null;
}): Promise<JourneyAdvanceStepResult> {
    const { journeyId, actualStep, workTasks, modalApi } = options;

    const currentIndex = JOURNEY_STEP_SEQUENCE.indexOf(actualStep as (typeof JOURNEY_STEP_SEQUENCE)[number]);
    if (currentIndex === -1) {
        const errorMsg = `Không xác định được bước '${actualStep}' trong quy trình`;
        console.error(errorMsg);
        message.error(errorMsg);
        return 'invalid';
    }

    const stepTasks = workTasks.filter((t) => t.journey_step_code === actualStep);
    const unfinishedMandatoryTasks = stepTasks.filter((t) => t.is_required && t.status !== 'finished');

    if (unfinishedMandatoryTasks.length > 0) {
        if (modalApi?.warning) {
            modalApi.warning({
                title: 'Chưa thể Hoàn thành Bước',
                content: (
                    <div>
                        Còn <b>{unfinishedMandatoryTasks.length}</b> đầu việc bắt buộc chưa xong:
                        <ul style={{ marginTop: 8, paddingLeft: 20 }}>
                            {unfinishedMandatoryTasks.map((t, idx) => (
                                <li key={idx}>{t.title}</li>
                            ))}
                        </ul>
                        <i style={{ fontSize: 12 }}>Vui lòng hoàn thành các việc này để tiếp tục.</i>
                    </div>
                ),
                okText: 'Đã hiểu',
            });
        } else {
            notification.warning({
                message: 'Chưa thể Hoàn thành Bước',
                description: `Còn ${unfinishedMandatoryTasks.length} đầu việc bắt buộc chưa xong.`,
                duration: 8,
            });
        }
        return 'blocked';
    }

    if (currentIndex === JOURNEY_STEP_SEQUENCE.length - 1) {
        message.info('Đây là bước cuối cùng của công trình!');
        return 'last';
    }

    const nextStep = JOURNEY_STEP_SEQUENCE[currentIndex + 1];
    await journeyService.updateJourney(journeyId, { current_step: nextStep as any });
    message.success('Đã xác nhận hoàn thành. Chuyển sang bước kế tiếp!');
    return 'advanced';
}
