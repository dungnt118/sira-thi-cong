export type ProjectStatus = 
    | 'SCHEDULED' 
    | 'WAITING_MATERIALS' 
    | 'IN_PROGRESS' 
    | 'AWAITING_APPROVAL' 
    | 'COMPLETED' 
    | 'CANCELLED';

export interface ProjectStep {
    id: string;
    templateStepId: string;
    order: number;
    name: string;
    description: string;
    minPhotos: number;
    status: 'LOCKED' | 'OPEN' | 'IN_PROGRESS' | 'AWAITING_REVIEW' | 'COMPLETED' | 'REJECTED';
    evidences: any[];
}

export interface IncidentReport {
    id: string;
    title: string;
    description: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'OPEN' | 'RESOLVED';
    createdAt: string;
    reportedBy: string;
}

export interface ActivityLog {
    id: string;
    journeyId: string;
    category: string;
    actor: string;
    action: string;
    summary: string;
    timestamp: string;
}

export interface PaymentMilestone {
    id: string;
    round: number;
    percentage: number;
    amount: number;
    dueDate: string;
    status: 'PENDING' | 'PAID' | 'OVERDUE';
    paidAt?: string;
    paidBy?: string;
}

export interface Project {
    id: string;
    code: string;
    name: string;
    customerId: string;
    customerName: string;
    address: string;
    areaM2: number;
    category: string;
    type: string;
    templateId: string;
    status: ProjectStatus;
    pmId: string;
    pmName: string;
    workerIds: string[];
    workerNames: string[];
    startDate: string;
    plannedEndDate: string;
    createdAt: string;
    notes?: string;
    steps: ProjectStep[];
    incidents: IncidentReport[];
    activities: ActivityLog[];
    paymentMilestones: PaymentMilestone[];
    stockOrders: any[];
}
