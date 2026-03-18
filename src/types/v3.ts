// ============================================================
// V3 TypeScript Types – DL Tech Management
// Frontend-First (sample data driven)
// ============================================================

// ---- ACTOR TYPES ----
// Roles:
//   admin      – System admin, full access
//   pm         – Project Manager (also covers Giám đốc + Kinh doanh/Sales)
//   supervisor – On-site Supervisor (A Tuấn/Thái/Sinh): handles checklist, evidence,
//                incidents, acceptance & maintenance ON BEHALF of workers (thợ)
//               (Workers/thợ have no system account — only profile data)
//   accountant – Accountant + Hành chính (HCNS): finance, inventory, documents
export type UserRole = 'admin' | 'pm' | 'supervisor' | 'accountant';

export interface User {
    id: string;
    fullName: string;
    phone: string;
    role: UserRole;
    avatarUrl?: string;
    isActive: boolean;
}

// ---- CRM TYPES ----
// B2B, B2C Dynamic Pipelines
export type PipelineSystemStage = 'NEW' | 'IN_PROGRESS' | 'WON' | 'LOST';

export interface PipelineStage {
    id: string;
    name: string;      // e.g. "Đang khảo sát", "Đã báo giá"
    order: number;
    color: string;     // color code or status color
    systemStage: PipelineSystemStage; // fixed logic mapping
}

export interface Pipeline {
    id: string;
    name: string;      // e.g. "Quy trình Bán lẻ"
    isActive: boolean;
    isDefault: boolean;
    stages: PipelineStage[];
}

export type CustomerPipelineStatus =
    | 'NEW'           // Legacy fixed string (will be deprecated but keeping for now if used elsewhere)
    | 'SURVEYING'
    | 'QUOTED'
    | 'NEGOTIATING'
    | 'SIGNED'
    | 'REJECTED';

export interface Customer {
    id: string;
    code: string;           // KH-2026-001
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    district: string;
    city: string;
    gpsLat?: number;
    gpsLng?: number;
    assignedPmId: string;
    assignedPmName: string;
    createdAt: string;
    notes?: string;
}

export interface ServiceRequest {
    id: string;
    code: string;           // YC-2026-001
    customerId: string;
    customerName: string;
    name: string;
    pipelineId: string;
    stageId: string;
    status: PipelineSystemStage;
    assignedPmId: string;
    assignedPmName: string;
    surveyImages: SurveyImage[];
    moistureReadings: MoistureReading[];
    quotations: Quotation[];
    createdAt: string;
    notes?: string;
}

export interface SurveyImage {
    id: string;
    url: string;
    caption?: string;
    takenAt: string;   // ISO timestamp
    takenBy: string;
}

export interface MoistureReading {
    id: string;
    location: string;
    value: number;     // %
    readAt: string;
    readBy: string;
}

export interface QuotationItem {
    id: string;
    name: string;       // e.g. "SIRA PU (lót)"
    unit: string;       // m², kg, lít
    quantity: number;
    unitPrice: number;
    total: number;
    isAuto: boolean;    // calculated from định mức
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'APPROVED' | 'REJECTED';

export interface Quotation {
    id: string;
    code: string;       // BG-2026-001
    serviceRequestId: string;
    items: QuotationItem[];
    subtotal: number;
    discount: number;
    total: number;
    status: QuotationStatus;
    notes?: string;
    createdAt: string;
    approvedAt?: string;
    // Gap #6: milestones auto-created when status=APPROVED
    paymentMilestones?: PaymentMilestone[];
}

// ---- CHECKLIST TEMPLATE TYPES ----
export interface ChecklistStep {
    id: string;
    order: number;
    name: string;
    description: string;
    minPhotos: number;
    allowVideo: boolean;
}

export interface ChecklistTemplate {
    id: string;
    name: string;
    description: string;
    category: string;   // 'Chống thấm sàn' | 'Chống thấm tường' | etc.
    steps: ChecklistStep[];
    isDefault: boolean;
    usedInProjects: number;
}

// ---- PROJECT TYPES MOVED ----
// Project, ProjectStatus, ProjectStep, IncidentReport, ActivityLog, StepStatus, StepEvidence
// đã được chuyển sang src/types/legacy-project.ts (Phase 3)
// Sẽ bị xóa hoàn toàn ở Phase 5 khi các trang Construction được dọn dẹp.

// ---- INVENTORY TYPES ----

export type MaterialUnit = 'kg' | 'lít' | 'm²' | 'thùng' | 'cuộn' | 'cái';

export type MaterialType = 'CONSUMABLE'; // Assets moved to independent module

export interface MaterialGroup {
    id: string;
    name: string;           // e.g., "Sơn PU"
    baseUnit: string;       // e.g., "Kg" or "Lít"
    packageUnit: string;    // e.g., "Thùng", "Lon"
    category: string;
    type: MaterialType;
}

export interface Material {
    id: string;
    groupId?: string;        // Link to MaterialGroup
    code: string;           // SKU code (e.g., VT-001-15KG)
    name: string;           // Packaging name (e.g., "15" - inherited capacity)
    capacity?: number;       // Numeric value for aggregation (e.g., 15)
    unit: string;           // Unit for this SKU (e.g., "thùng" - inherited packageUnit)
    currentStock: number;   // Number of full containers
    partialStock?: number;   // Total remaining base unit quantity from opened containers
    minStockAlert: number;
    unitCost: number;
    category?: string;
}

// ===== ASSETS (Separated) =====
export type AssetStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'BROKEN' | 'LOST';

export interface AssetGroup {
    id: string;
    name: string;           // e.g., "Dụng cụ thi công", "Văn phòng phẩm"
    category: string;
    depreciationMonths: number;
}

export interface Asset {
    id: string;
    groupId: string;
    code: string;           // Serial ID / Internal code
    name: string;           // e.g., "Máy mài Bosch #1", "Laptop Dell XPS"
    serialNumber?: string;
    status: AssetStatus;
    assignedTo?: string;    // Person currently holding it
    purchaseDate: string;
    cost: number;
    condition: string;      // e.g., "New", "90%", "Old"
    notes?: string;
}

export interface MaterialStandard {
    id: string;
    materialId: string;
    materialName: string;
    constructionType: string; // 'Chống thấm sàn'
    usagePerM2: number;       // kg or lít per m²
}

export interface StockOrderItem {
    materialId: string;
    materialName: string;
    unit: MaterialUnit;
    quantity: number;           // Planned/Requested
    requestedQuantity?: number;  // Original PM request
    issuedQuantity?: number;     // What warehouse actually sent
    receivedQuantity?: number;  // What GS actually counted on site
    unitCost: number;
    isPartial?: boolean;
    remainingPercent?: number;
    discrepancyNote?: string;
}

export type StockOrderType = 'OUT' | 'IN';
export type StockOrderStatus = 
    | 'DRAFT' 
    | 'REQUESTED'       // PM submitted, waiting for Accountant
    | 'APPROVED'        // Accountant approved, ready to dispatch
    | 'DISPATCHED'      // Items left warehouse (In Transit)
    | 'RECEIVED'        // GS confirmed receipt
    | 'COMPLETED'       // Finalized, PDF archived
    | 'DISCREPANCY'     // Issue reported during receipt
    | 'CANCELLED';

export interface StockOrderSignature {
    role: UserRole | 'warehouse';
    userName: string;
    userId: string;
    signedAt: string;
    signatureDataUrl: string; // Base64 canvas signature
    note?: string;
}

export type StockOrderSource = 'DISTRIBUTOR' | 'PROJECT' | 'OTHER';

export interface StockOrder {
    id: string;
    code: string;
    type: StockOrderType;
    // === Journey FK (mới — Phase 1) ===
    journeyId?: string;         // FK tới Journey.id
    journeyCode?: string;       // FK tới Journey.journey_code (HT-2026-xxx)
    // === Project FK (cũ — sẽ xóa ở Phase 3) ===
    projectId?: string;
    projectName?: string;
    source?: StockOrderSource;
    sourceId?: string;
    items: StockOrderItem[];
    totalValue: number;
    status: StockOrderStatus;
    createdBy: string;
    createdAt: string;
    signatures?: StockOrderSignature[];
    signedBy?: string;
    signedAt?: string;
    supplier?: string;
    pdfUrl?: string;
    history?: {
        status: StockOrderStatus;
        updatedBy: string;
        updatedAt: string;
        comment?: string;
    }[];
    notes?: string;
}

export interface Distributor {
    id: string;
    code: string;
    name: string;
    phone: string;
    address: string;
    email?: string;
    categories: string[]; // Categories they supply
}

// ---- PM STOCK REQUEST TYPES (PM creates → Accountant converts to PX/PN) ----
export type StockRequestType = 'REQUEST_IN' | 'REQUEST_OUT';
export type StockRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CONVERTED';

export interface StockRequestItem {
    materialId: string;
    materialName: string;
    unit: MaterialUnit;
    requested: number;
    note?: string;
}

export interface StockRequest {
    id: string;
    code: string;           // YC-OUT-001, YC-IN-001
    type: StockRequestType;
    requestedBy: string;    // PM name
    projectId?: string;     // For REQUEST_OUT
    projectName?: string;
    items: StockRequestItem[];
    reason: string;
    status: StockRequestStatus;
    createdAt: string;
    reviewedBy?: string;    // Accountant who reviewed
    reviewedAt?: string;
    reviewNote?: string;
    convertedOrderId?: string; // PX/PN code created from this request
}

// ---- FINANCE TYPES ----
export type MilestoneStatus = 'PENDING' | 'PAID' | 'OVERDUE';

export interface PaymentMilestone {
    id: string;
    // === Journey FK (mới — Phase 1) ===
    journeyId?: string;
    journeyCode?: string;
    // === Project FK (cũ — sẽ xóa ở Phase 3) ===
    projectId: string;
    projectName: string;
    quotationId?: string;
    round: 1 | 2 | 3;
    percentage: 50 | 40 | 10;
    amount: number;
    dueDate: string;
    status: MilestoneStatus;
    paidAt?: string;
    paidBy?: string;
    receiptNote?: string;
}

// ---- WARRANTY TYPES ----
export interface WarrantyCard {
    id: string;
    code: string;           // BH-2026-001
    // === Journey FK (mới — Phase 1) ===
    journeyId?: string;
    journeyCode?: string;
    // === Project FK (cũ — sẽ xóa ở Phase 3) ===
    projectId: string;
    projectName: string;
    customerName: string;
    customerPhone: string;
    address: string;
    constructionType: string;
    areaM2: number;
    completedDate: string;
    warrantyMonths: number;
    expiryDate: string;
    materials: string[];
    qrCode?: string;
    issuedAt: string;
}

export interface WarrantyReminder {
    id: string;
    warrantyCardId: string;
    projectName: string;
    customerName: string;
    customerPhone: string;
    message: string;
    channel: 'SMS' | 'ZALO';
    scheduledAt: string;
    sentAt?: string;
    status: 'PENDING' | 'SENT' | 'FAILED';
}

// ---- ESTIMATE TEMPLATE TYPES (Phase 6) ----
export type EstimateComponentType = 'material' | 'labor' | 'other';

export interface EstimateTemplateComponent {
    id: string;
    type: EstimateComponentType;
    itemId?: string;      // Material ID if type = 'material'
    name: string;         // 'SIRA PU Lót' / 'Nhân công sơn'
    unit: string;         // kg / m2 / công
    quantityPerUnit: number; // Định mức vật tư/nhân công trên 1 ĐVT hạng mục
    unitPrice: number;    // Đơn giá tiêu chuẩn
}

export interface EstimateTemplate {
    id: string;
    code: string;
    name: string;         // Hạng mục thi công (vd: Chống thấm màng khò)
    unit: string;         // m2, cái, gói
    components: EstimateTemplateComponent[];
}

// ---- ASSET ALLOCATION TYPES ----
export type AssetAllocationStatus = 'REQUESTED' | 'APPROVED' | 'RECEIVED' | 'COMPLETED' | 'REJECTED' | 'RETURNED';

export interface AssetAllocationSignature {
    role: UserRole | 'borrower';
    userName: string;
    userId: string;
    signedAt: string;
    signatureDataUrl: string; // Base64 canvas signature
}

export interface AssetAllocation {
    id: string;
    code: string;
    assetId: string;
    assetName: string;
    assetCode: string;
    requestedBy: string;
    requestedById?: string;
    // === Journey FK (mới — Phase 1) ===
    journeyId?: string;
    journeyCode?: string;
    // === Project FK (cũ — sẽ xóa ở Phase 3) ===
    projectId?: string;
    projectName?: string;
    requestDate: string;
    expectedReturnDate?: string;
    actualReturnDate?: string;
    status: AssetAllocationStatus;
    signatures: AssetAllocationSignature[];
    notes?: string;
    history: {
        status: AssetAllocationStatus;
        updatedBy: string;
        updatedAt: string;
        comment?: string;
    }[];
}

