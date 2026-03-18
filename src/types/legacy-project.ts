// ============================================================
// LEGACY PROJECT TYPES — Deprecated (Phase 3)
// ============================================================
// Các types này sẽ bị XÓA ở Phase 5 khi các trang Construction
// được merge vào Journey. KHÔNG thêm code mới phụ thuộc vào file này.
// ============================================================

import type { PaymentMilestone, StockOrder } from './v3';

export type ProjectStatus =
    | 'SCHEDULED'
    | 'WAITING_MATERIALS'
    | 'IN_PROGRESS'
    | 'AWAITING_APPROVAL'
    | 'COMPLETED'
    | 'CANCELLED';

export type StepStatus = 'LOCKED' | 'OPEN' | 'IN_PROGRESS' | 'AWAITING_REVIEW' | 'APPROVED' | 'REJECTED';

export interface StepEvidence {
    id: string;
    url: string;
    thumbnailUrl?: string;
    uploadedAt: string;
    uploadedBy: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    pmFeedback?: string;
}

export interface ProjectStep {
    id: string;
    templateStepId: string;
    order: number;
    name: string;
    description: string;
    minPhotos: number;
    status: StepStatus;
    completedAt?: string;
    completedBy?: string;
    evidences: StepEvidence[];
    notes?: string;
}

export interface IncidentReport {
    id: string;
    projectId: string;
    type: 'MATERIAL_SHORTAGE' | 'TECHNICAL' | 'WEATHER' | 'EQUIPMENT' | 'SAFETY' | 'OTHER';
    description: string;
    severity: 'NORMAL' | 'URGENT';
    images: string[];
    reportedAt: string;
    reportedBy: string;
    pmReply?: string;
    isResolved: boolean;
    resolvedAt?: string;
}

export interface ActivityLog {
    id: string;
    projectId: string;
    actor: string;
    action: string;
    detail: string;
    timestamp: string;
}

export interface Project {
    id: string;
    code: string;
    name: string;
    customerId: string;
    customerName: string;
    address: string;
    gpsLat?: number;
    gpsLng?: number;
    areaM2: number;
    category: string;
    type: 'Nội bộ' | 'Outsource';
    budget?: number;
    qualityScore?: number;
    templateId: string;
    status: ProjectStatus;
    pmId: string;
    pmName: string;
    workerIds: string[];
    workerNames: string[];
    startDate: string;
    plannedEndDate: string;
    actualEndDate?: string;
    steps: ProjectStep[];
    incidents: IncidentReport[];
    activityLog: ActivityLog[];
    paymentMilestones: PaymentMilestone[];
    stockOrders: StockOrder[];
    portalToken?: string;
    portalExpiry?: string;
    createdAt: string;
    notes?: string;
}
