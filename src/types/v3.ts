// ============================================================
// V3 TypeScript Types – DL Tech Management
// Frontend-First (sample data driven)
// ============================================================

// ---- ACTOR TYPES ----
// Roles (Standardized):
//   ADMIN – System admin, full access
//   QL    – Project Manager (Quản lý dự án)
//   GS    – On-site Supervisor (Giám sát)
//   KT    – Accountant (Kế toán)
//   KD    – Sale (Kinh doanh)
//   KYT   – Technical (Kỹ thuật)
export type UserRole = 'ADMIN' | 'QL' | 'GS' | 'KT' | 'KD' | 'KYT';

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

// ---- ACTIVITY EVENT (Canonical - Phase 4) ----
// Type này là chuẩn thống nhất cho nhật ký hoạt động.
// Tương thích với JourneyActivity (journey.ts) và thay thế legacy ActivityLog.
export type ActivityEventCategory =
    | 'STOCK_ORDER'         // Phiếu xuất/nhập kho
    | 'ASSET_ALLOCATION'    // Cấp phát tài sản
    | 'PAYMENT'             // Đợt thanh toán
    | 'WARRANTY'            // Bảo hành
    | 'INCIDENT'            // Sự cố
    | 'SURVEY'              // Khảo sát
    | 'QUOTATION'           // Báo giá
    | 'CONTRACT'            // Hợp đồng
    | 'CONSTRUCT'           // Thi công (step)
    | 'GENERAL';            // Chung

export interface ActivityEvent {
    id: string;
    journeyId: string;          // FK tới Journey.id (chính)
    journeyCode?: string;       // HT-2026-xxx (dùng để hiển thị)
    category: ActivityEventCategory;
    actor: string;              // Tên người thực hiện
    action: string;             // Tên hành động (ngắn)
    summary: string;            // Mô tả đầy đủ
    context?: string;           // Ngữ cảnh bổ sung (tùy chọn)
    timestamp: string;          // ISO 8601
    relatedEntityId?: string;   // ID của entity liên quan (PX-001, CP-001...)
    relatedEntityType?: 'STOCK_ORDER' | 'ASSET_ALLOCATION' | 'PAYMENT_MILESTONE' | 'WARRANTY';
}

// ---- INVENTORY TYPES ----

export type MaterialUnit = 'kg' | 'lít' | 'm²' | 'thùng' | 'cuộn' | 'cái';

export type MaterialType = 'CONSUMABLE'; // Assets moved to independent module

/** Khớp Dropdown category trên BAC schema MaterialGroup */
export type MaterialGroupCategory =
    | 'waterproofing_sealing'
    | 'paint_coating'
    | 'primer_putty_fillers'
    | 'chemical_adhesive'
    | 'cement_concrete_mortar'
    | 'brick_stone_aggregate'
    | 'steel_rebar_metal'
    | 'wood_board_formwork'
    | 'pipe_plumbing'
    | 'electrical_cable_accessories'
    | 'hvac_duct_accessories'
    | 'insulation_acoustic'
    | 'fasteners_hardware'
    | 'ppe_safety_consumables'
    | 'auxiliary_finishing'
    | 'other';

/** Nhãn hiển thị — khớp BAC MaterialGroup.category value_options */
export const MATERIAL_GROUP_CATEGORY_LABELS: Record<MaterialGroupCategory, string> = {
    waterproofing_sealing: 'Chống thấm & kết dính',
    paint_coating: 'Sơn & lớp phủ bảo vệ',
    primer_putty_fillers: 'Sơn lót, bột trét, chất trám',
    chemical_adhesive: 'Hóa chất, keo dán',
    cement_concrete_mortar: 'Xi măng, bê tông, vữa',
    brick_stone_aggregate: 'Gạch, đá, cát, đá dăm',
    steel_rebar_metal: 'Thép, cốt thép, kim loại xây dựng',
    wood_board_formwork: 'Gỗ, ván, cốp pha',
    pipe_plumbing: 'Ống nước & phụ kiện cấp thoát',
    electrical_cable_accessories: 'Dây cáp & phụ kiện điện',
    hvac_duct_accessories: 'HVAC, ống gió & phụ kiện',
    insulation_acoustic: 'Cách nhiệt, cách âm',
    fasteners_hardware: 'Bu lông, vít, phụ kiện lắp ghép',
    ppe_safety_consumables: 'BHLĐ, an toàn & VTT tiêu hao',
    auxiliary_finishing: 'Phụ kiện thi công & hoàn thiện',
    other: 'Khác',
};

/** Khớp Dropdown base_unit trên BAC schema MaterialGroup */
export type MaterialGroupBaseUnit =
    | 'kg'
    | 'g'
    | 'ton'
    | 'liter'
    | 'ml'
    | 'm'
    | 'cm'
    | 'mm'
    | 'm2'
    | 'm3'
    | 'piece'
    | 'set'
    | 'pair'
    | 'roll'
    | 'sheet'
    | 'bottle'
    | 'bag'
    | 'drum'
    | 'tube'
    | 'box_unit'
    | 'other';

/** Khớp Dropdown package_unit trên BAC schema MaterialGroup */
export type MaterialGroupPackageUnit =
    | 'thung'
    | 'lon'
    | 'bao'
    | 'cuon'
    | 'cai'
    | 'kien'
    | 'pallet'
    | 'hop'
    | 'goi'
    | 'chai'
    | 'phuy'
    | 'bo'
    | 'cap'
    | 'khay'
    | 'can'
    | 'thung_xop'
    | 'other';

/** Nhãn hiển thị — khớp BAC MaterialGroup.base_unit */
export const MATERIAL_GROUP_BASE_UNIT_LABELS: Record<MaterialGroupBaseUnit, string> = {
    kg: 'Kilogram (kg)',
    g: 'Gram (g)',
    ton: 'Tấn',
    liter: 'Lít',
    ml: 'Mililít (ml)',
    m: 'Mét (m)',
    cm: 'Centimet (cm)',
    mm: 'Milimet (mm)',
    m2: 'm² (mét vuông)',
    m3: 'm³ (mét khối)',
    piece: 'Cái',
    set: 'Bộ',
    pair: 'Đôi',
    roll: 'Cuộn',
    sheet: 'Tấm',
    bottle: 'Chai',
    bag: 'Bao',
    drum: 'Phuy',
    tube: 'Ống (theo chiều dài)',
    box_unit: 'Hộp (đơn vị cơ sở)',
    other: 'Khác',
};

/** Nhãn hiển thị — khớp BAC MaterialGroup.package_unit */
export const MATERIAL_GROUP_PACKAGE_UNIT_LABELS: Record<MaterialGroupPackageUnit, string> = {
    thung: 'Thùng',
    lon: 'Lon',
    bao: 'Bao',
    cuon: 'Cuộn',
    cai: 'Cái',
    kien: 'Kiện',
    pallet: 'Pallet',
    hop: 'Hộp',
    goi: 'Gói',
    chai: 'Chai',
    phuy: 'Phuy',
    bo: 'Bộ',
    cap: 'Cặp',
    khay: 'Khay',
    can: 'Can',
    thung_xop: 'Thùng xốp',
    other: 'Khác',
};

export function materialGroupBaseUnitLabel(code: string | undefined): string {
    if (!code) return '—';
    return MATERIAL_GROUP_BASE_UNIT_LABELS[code as MaterialGroupBaseUnit] ?? code;
}

export function materialGroupPackageLabel(code: string | undefined): string {
    if (!code) return '—';
    return MATERIAL_GROUP_PACKAGE_UNIT_LABELS[code as MaterialGroupPackageUnit] ?? code;
}

export interface MaterialGroup {
    id: string;
    name: string;           // e.g., "Sơn PU"
    baseUnit: MaterialGroupBaseUnit;
    packageUnit: MaterialGroupPackageUnit;
    category?: MaterialGroupCategory;
    type: MaterialType;
}

export interface Material {
    id: string;
    groupId?: string;        // Link to MaterialGroup
    code: string;           // SKU code (e.g., VT-001-15KG)
    name: string;           // Packaging name (e.g., "15" - inherited capacity)
    capacity?: number;       // Numeric value for aggregation (e.g., 15)
    unit: MaterialGroupPackageUnit; // Kế thừa packageUnit của nhóm
    currentStock: number;   // Number of full containers
    partialStock?: number;   // Total remaining base unit quantity from opened containers
    minStockAlert: number;
    unitCost: number;
    category?: string;
}

// ===== ASSETS (Separated) =====
export type AssetStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'BROKEN' | 'LOST';

/** Khớp Dropdown category trên BAC schema AssetGroup */
export type AssetGroupCategory =
    | 'machinery'
    | 'power_tools'
    | 'hand_tools'
    | 'measuring_testing'
    | 'safety_ppe'
    | 'lifting_handling'
    | 'vehicles'
    | 'it_equipment'
    | 'office_furniture'
    | 'electrical_installation'
    | 'temporary_site'
    | 'other';

export interface AssetGroup {
    id: string;
    name: string;           // e.g., "Máy mài Bosch #1", "Laptop kỹ thuật"
    category: AssetGroupCategory;
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

