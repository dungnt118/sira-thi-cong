import type { IActionsItem, IWorkTask } from '../services/core-contracts/types/workTask.types';
import { resolveTargetFieldFromAction } from '../constants/workTaskActionUx';

export type TaskActionUiBatch =
    | { kind: 'field_batch'; actions: IActionsItem[] }
    | { kind: 'document_batch'; actions: IActionsItem[] }
    | { kind: 'single'; action: IActionsItem };

export type TaskActionClickPayload =
    | { type: 'field_batch'; task: IWorkTask; actions: IActionsItem[] }
    | { type: 'document_batch'; task: IWorkTask; actions: IActionsItem[] }
    | { type: 'single'; task: IWorkTask; action: IActionsItem };

/**
 * Gom action theo loại UI: cập nhật field Journey (1 nút), upload tài liệu (1 nút), còn lại từng action một nút.
 * Action field/status không suy ra được `target_field` vẫn hiển thị như nút đơn (điều hướng / xử lý riêng).
 */
export function splitTaskActionsForUi(actions?: IActionsItem[] | null): TaskActionUiBatch[] {
    if (!actions?.length) return [];
    const fieldResolvable: IActionsItem[] = [];
    const documentLike: IActionsItem[] = [];
    const singles: IActionsItem[] = [];
    for (const a of actions) {
        const t = a?.action_type;
        if (t === 'require_journey_field' || t === 'require_status_equals') {
            if (resolveTargetFieldFromAction(a)) fieldResolvable.push(a);
            else if (a) singles.push(a);
        } else if (t === 'require_document') {
            documentLike.push(a);
        } else if (a) {
            singles.push(a);
        }
    }
    const out: TaskActionUiBatch[] = [];
    if (fieldResolvable.length) out.push({ kind: 'field_batch', actions: fieldResolvable });
    if (documentLike.length) out.push({ kind: 'document_batch', actions: documentLike });
    for (const a of singles) {
        out.push({ kind: 'single', action: a });
    }
    return out;
}
