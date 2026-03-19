import type {
    Customer, ChecklistTemplate,
    Material, MaterialStandard, StockOrder,
    PaymentMilestone, WarrantyCard, WarrantyReminder, User, StockRequest, Pipeline, ServiceRequest
} from '../types/v3';
import { Project, ProjectStatus } from '../types/legacy-project';
import { mockJourneys } from './journeyMockData';
import type { Journey } from '../types/journey';

// --- Bridge: Map Journey to Legacy Project ---
const mapJourneyToProject = (j: Journey): Project => ({
    id: j.id,
    code: j.journey_code,
    name: j.customer_name + ' - ' + (j.requested_service || 'Dự án'),
    customerId: j.id, // Mock mapping
    customerName: j.customer_name,
    address: j.site_address || '',
    areaM2: 100, // Mock default
    category: j.requested_service || 'Chống thấm',
    type: 'Nội bộ',
    templateId: j.template_id || 'TPL-001',
    status: (j.project_status === 'completed' ? 'COMPLETED' : 
             j.project_status === 'active' ? 'IN_PROGRESS' : 'SCHEDULED') as ProjectStatus,
    pmId: j.owner_user_id || 'U001',
    pmName: j.owner_user || 'Nguyễn Văn PM',
    workerIds: [j.supervisor_name || ''],
    workerNames: [j.supervisor_name || ''],
    startDate: j.tentative_start_date || '2026-03-01',
    plannedEndDate: '2026-03-31',
    createdAt: j.created_at,
    notes: j.request_description,
    steps: (j.work_steps || []).map(s => ({
        id: s.id,
        templateStepId: s.templateStepId,
        order: s.order,
        name: s.name,
        description: s.description || '',
        minPhotos: s.minPhotos || 1,
        status: (s.status === 'APPROVED' ? 'COMPLETED' : 
                 s.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 
                 s.status === 'AWAITING_REVIEW' ? 'AWAITING_REVIEW' :
                 s.status === 'OPEN' ? 'OPEN' : 'LOCKED') as any,
        evidences: s.evidences || []
    })),
    incidents: [],
    activities: [],
    paymentMilestones: [],
    stockOrders: []
});

export const mockProjects: Project[] = mockJourneys.map(mapJourneyToProject);

export const getProjectProgress = (project: any) => {
    if (!project.steps || project.steps.length === 0) return 0;
    const completed = project.steps.filter((s: any) => s.status === 'COMPLETED').length;
    return Math.round((completed / project.steps.length) * 100);
};


// ============================================================
// MOCK USERS
// ============================================================
export const mockUsers: User[] = [
    { id: 'U001', fullName: 'Nguyễn Văn PM', phone: '0901234567', role: 'pm', isActive: true },
    { id: 'U002', fullName: 'GS Trần Văn Tuấn', phone: '0912345678', role: 'supervisor', isActive: true },
    { id: 'U003', fullName: 'GS Lê Văn Thái', phone: '0923456789', role: 'supervisor', isActive: true },
    { id: 'U004', fullName: 'Kế toán Phạm Thị A', phone: '0934567890', role: 'accountant', isActive: true },
    { id: 'U005', fullName: 'Admin Lam Bac', phone: '0800000000', role: 'admin', isActive: true },
];

// ============================================================
// CHECKLIST TEMPLATES
// ============================================================
export const mockTemplates: ChecklistTemplate[] = [
    {
        id: 'TPL-001',
        name: 'SIRA Standard v1.0',
        description: 'Template chuẩn cho chống thấm sàn bê tông',
        category: 'Chống thấm sàn',
        isDefault: true,
        usedInProjects: 14,
        steps: [
            { id: 's01', order: 1, name: 'Kiểm tra bề mặt & lên kế hoạch', description: 'Đánh giá tình trạng bề mặt, đo độ ẩm, lập kế hoạch thi công', minPhotos: 2, allowVideo: false },
            { id: 's02', order: 2, name: 'Bảo vệ khu vực xung quanh', description: 'Che chắn nội thất, đặt biển cảnh báo', minPhotos: 1, allowVideo: false },
            { id: 's03', order: 3, name: 'Mài sàn lần 1', description: 'Mài toàn bộ bề mặt bằng máy mài chuyên dụng', minPhotos: 2, allowVideo: true },
            { id: 's04', order: 4, name: 'Vệ sinh bụi sau mài', description: 'Hút bụi + lau ẩm toàn bộ bề mặt', minPhotos: 1, allowVideo: false },
            { id: 's05', order: 5, name: 'Mài sàn lần 2 (nếu cần)', description: 'Mài lại các điểm chưa đều', minPhotos: 1, allowVideo: false },
            { id: 's06', order: 6, name: 'Kiểm tra độ ẩm trước thi công', description: 'Đo độ ẩm, yêu cầu < 8%', minPhotos: 2, allowVideo: false },
            { id: 's07', order: 7, name: 'Quét Primer lần 1', description: 'Quét primer tăng độ bám dính', minPhotos: 2, allowVideo: false },
            { id: 's08', order: 8, name: 'Chờ Primer khô (chụp ảnh xác nhận)', description: 'Đợi 2-4 giờ, chụp ảnh bề mặt sau khô', minPhotos: 1, allowVideo: false },
            { id: 's09', order: 9, name: 'Quét SIRA PU lớp lót lần 1', description: 'Quét đều tay, kiểm tra độ phủ đều', minPhotos: 3, allowVideo: true },
            { id: 's10', order: 10, name: 'Chờ khô – Kiểm tra bề mặt', description: 'Đợi 4-6 giờ, kiểm tra không có bong bóng', minPhotos: 2, allowVideo: false },
            { id: 's11', order: 11, name: 'Quét SIRA PU lớp lót lần 2', description: 'Quét lớp thứ 2 sau khi lớp 1 khô hoàn toàn', minPhotos: 2, allowVideo: false },
            { id: 's12', order: 12, name: 'Chờ khô lần 2', description: 'Đợi 6-8 giờ', minPhotos: 1, allowVideo: false },
            { id: 's13', order: 13, name: 'Quét SIRA PU lớp phủ lần 1', description: 'Lớp phủ màu cuối, quét đều', minPhotos: 3, allowVideo: true },
            { id: 's14', order: 14, name: 'Chờ khô – Kiểm tra bề mặt', description: 'Kiểm tra màu sắc, độ đều, bong bóng', minPhotos: 2, allowVideo: false },
            { id: 's15', order: 15, name: 'Quét SIRA PU lớp phủ lần 2', description: 'Hoàn thiện lớp phủ cuối cùng', minPhotos: 2, allowVideo: false },
            { id: 's16', order: 16, name: 'Kiểm tra tổng thể – Test nước', description: 'Đổ nước kiểm tra, chờ 24h', minPhotos: 3, allowVideo: true },
            { id: 's17', order: 17, name: 'Hoàn thiện & vệ sinh công trình', description: 'Vệ sinh toàn bộ khu vực thi công, thu dọn', minPhotos: 2, allowVideo: false },
            { id: 's18', order: 18, name: 'Nghiệm thu – Chụp ảnh AFTER', description: 'Chụp ảnh toàn cảnh sau thi công, mời KH nghiệm thu', minPhotos: 4, allowVideo: true },
        ],
    },
    {
        id: 'TPL-002',
        name: 'SIRA Tường v1.0',
        description: 'Chống thấm mặt tường ngoài và trong',
        category: 'Chống thấm tường',
        isDefault: false,
        usedInProjects: 3,
        steps: [
            { id: 't01', order: 1, name: 'Kiểm tra bề mặt tường', description: 'Đánh giá vết nứt, bong tách', minPhotos: 2, allowVideo: false },
            { id: 't02', order: 2, name: 'Đục tẩy vết nứt', description: 'Dùng máy đục làm sạch vết nứt', minPhotos: 2, allowVideo: false },
            { id: 't03', order: 3, name: 'Trám khe nứt bằng Sika', description: 'Dùng Sika Latex hoặc tương đương', minPhotos: 1, allowVideo: false },
            { id: 't04', order: 4, name: 'Chờ trám khô (min 24h)', description: 'Đợi trám đóng rắn hoàn toàn', minPhotos: 1, allowVideo: false },
            { id: 't05', order: 5, name: 'Quét SIRA PU lớp lót tường', description: 'Quét từ trên xuống, đều tay', minPhotos: 2, allowVideo: false },
            { id: 't06', order: 6, name: 'Chờ lót khô', description: 'Đợi 4-6 giờ', minPhotos: 1, allowVideo: false },
            { id: 't07', order: 7, name: 'Quét SIRA PU lớp phủ tường', description: 'Lớp phủ hoàn thiện', minPhotos: 2, allowVideo: false },
            { id: 't08', order: 8, name: 'Nghiệm thu', description: 'Kiểm tra và chụp ảnh after', minPhotos: 3, allowVideo: true },
        ],
    },
];

// ============================================================
// PIPELINES & STAGES (Dynamic Kanban)
// ============================================================
export const mockPipelines: Pipeline[] = [
    {
        id: 'PPL-001',
        name: 'Quy trình Khách Lẻ SIRA',
        isActive: true,
        isDefault: true,
        stages: [
            { id: 'st-01', name: 'Tiếp nhận Lead', order: 1, color: 'blue', systemStage: 'NEW' },
            { id: 'st-02', name: 'Đang Khảo sát', order: 2, color: 'gold', systemStage: 'IN_PROGRESS' },
            { id: 'st-03', name: 'Đã Báo giá', order: 3, color: 'orange', systemStage: 'IN_PROGRESS' },
            { id: 'st-04', name: 'Đã ký Hợp đồng', order: 4, color: 'green', systemStage: 'WON' },
            { id: 'st-05', name: 'Từ chối / Hủy', order: 5, color: 'red', systemStage: 'LOST' },
        ],
    },
    {
        id: 'PPL-002',
        name: 'Quy trình Thầu Dự Án B2B',
        isActive: true,
        isDefault: false,
        stages: [
            { id: 'st-b1', name: 'Lead B2B', order: 1, color: 'blue', systemStage: 'NEW' },
            { id: 'st-b2', name: 'Làm Hồ sơ Thầu', order: 2, color: 'gold', systemStage: 'IN_PROGRESS' },
            { id: 'st-b3', name: 'Đang Đấu thầu', order: 3, color: 'volcano', systemStage: 'IN_PROGRESS' },
            { id: 'st-b4', name: 'Trúng thầu', order: 4, color: 'green', systemStage: 'WON' },
            { id: 'st-b5', name: 'Trượt thầu', order: 5, color: 'red', systemStage: 'LOST' },
        ],
    }
];

// ============================================================
// CUSTOMERS
// ============================================================
export const mockCustomers: Customer[] = [
    {
        id: 'KH-001',
        code: 'KH-2026-001',
        fullName: 'Nguyễn Văn A',
        phone: '0901234501',
        email: 'nguyenvana@gmail.com',
        address: '123 Đường Nguyễn Trãi',
        district: 'Quận 1',
        city: 'TP.HCM',
        gpsLat: 10.7769,
        gpsLng: 106.7009,
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        createdAt: '2026-02-15',
        notes: 'KH yêu cầu thi công cuối tuần',
    },
    {
        id: 'KH-002',
        code: 'KH-2026-002',
        fullName: 'Trần Thị B',
        phone: '0912345602',
        address: '456 Lê Văn Lương',
        district: 'Quận 7',
        city: 'TP.HCM',
        gpsLat: 10.7329,
        gpsLng: 106.7117,
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        createdAt: '2026-02-20',
    },
    {
        id: 'KH-003',
        code: 'KH-2026-003',
        fullName: 'Công ty TNHH ABC',
        phone: '0282345603',
        email: 'info@abc.com',
        address: '789 Đinh Tiên Hoàng',
        district: 'Quận Bình Thạnh',
        city: 'TP.HCM',
        gpsLat: 10.8117,
        gpsLng: 106.7223,
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        createdAt: '2026-02-28',
    },
    {
        id: 'KH-004',
        code: 'KH-2026-004',
        fullName: 'Lê Hoàng D',
        phone: '0934567804',
        address: '101 Hùng Vương',
        district: 'Quận 5',
        city: 'TP.HCM',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        createdAt: '2026-03-01',
    },
    {
        id: 'KH-005',
        code: 'KH-2026-005',
        fullName: 'Phạm Thị E',
        phone: '0945678905',
        address: '202 Cách Mạng Tháng 8',
        district: 'Quận 3',
        city: 'TP.HCM',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        createdAt: '2026-02-10',
        notes: 'KH chọn đơn vị khác',
    },
];

// ============================================================
// SERVICE REQUESTS (Deals)
// ============================================================
export const mockServiceRequests: ServiceRequest[] = [
    {
        id: 'SR-001',
        code: 'YC-2026-001',
        customerId: 'KH-001',
        customerName: 'Nguyễn Văn A',
        name: 'Chống thấm mái chung cư',
        pipelineId: 'PPL-001',
        stageId: 'st-04',
        status: 'WON',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        surveyImages: [
            { id: 'si01', url: 'https://placehold.co/400x300/1890ff/white?text=Survey+1', caption: 'Tổng quan sàn', takenAt: '2026-02-16T09:00:00', takenBy: 'Nguyễn Văn PM' },
            { id: 'si02', url: 'https://placehold.co/400x300/1890ff/white?text=Survey+2', caption: 'Vết thấm góc phòng', takenAt: '2026-02-16T09:15:00', takenBy: 'Nguyễn Văn PM' },
        ],
        moistureReadings: [
            { id: 'mr01', location: 'Góc phòng ngủ', value: 12.5, readAt: '2026-02-16T09:20:00', readBy: 'Nguyễn Văn PM' },
            { id: 'mr02', location: 'Sàn toilet', value: 18.3, readAt: '2026-02-16T09:25:00', readBy: 'Nguyễn Văn PM' },
        ],
        quotations: [
            {
                id: 'BG-001',
                code: 'BG-2026-001',
                serviceRequestId: 'SR-001',
                status: 'APPROVED',
                createdAt: '2026-02-17',
                approvedAt: '2026-02-18',
                discount: 350000,
                subtotal: 20350000,
                total: 20000000,
                notes: 'Bảo hành 24 tháng',
                items: [
                    { id: 'qi01', name: 'Mài sàn', unit: 'm²', quantity: 100, unitPrice: 30000, total: 3000000, isAuto: false },
                    { id: 'qi02', name: 'Vệ sinh bề mặt', unit: 'm²', quantity: 100, unitPrice: 10000, total: 1000000, isAuto: false },
                    { id: 'qi03', name: 'SIRA PU (lót)', unit: 'kg', quantity: 150, unitPrice: 45000, total: 6750000, isAuto: true },
                    { id: 'qi04', name: 'SIRA PU (phủ)', unit: 'kg', quantity: 200, unitPrice: 48000, total: 9600000, isAuto: true },
                ],
            },
        ],
        createdAt: '2026-02-15T08:00:00',
    },
    {
        id: 'SR-002',
        code: 'YC-2026-002',
        customerId: 'KH-002',
        customerName: 'Trần Thị B',
        name: 'Xử lý thấm tường',
        pipelineId: 'PPL-001',
        stageId: 'st-03',
        status: 'IN_PROGRESS',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        surveyImages: [],
        moistureReadings: [],
        quotations: [
            {
                id: 'BG-002',
                code: 'BG-2026-002',
                serviceRequestId: 'SR-002',
                status: 'SENT',
                createdAt: '2026-02-22',
                discount: 0,
                subtotal: 15000000,
                total: 15000000,
                items: [
                    { id: 'qi05', name: 'SIRA PU (lót)', unit: 'kg', quantity: 120, unitPrice: 45000, total: 5400000, isAuto: true },
                    { id: 'qi06', name: 'SIRA PU (phủ)', unit: 'kg', quantity: 160, unitPrice: 48000, total: 7680000, isAuto: true },
                    { id: 'qi07', name: 'Mài sàn', unit: 'm²', quantity: 80, unitPrice: 30000, total: 2400000, isAuto: false },
                ],
            },
        ],
        createdAt: '2026-02-20T10:00:00',
    },
    {
        id: 'SR-003',
        code: 'YC-2026-003',
        customerId: 'KH-003',
        customerName: 'Công ty TNHH ABC',
        name: 'Chống thấm tầng hầm B1, B2',
        pipelineId: 'PPL-002',
        stageId: 'st-b2',
        status: 'IN_PROGRESS',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        surveyImages: [],
        moistureReadings: [],
        quotations: [],
        createdAt: '2026-02-28T14:30:00',
    },
    {
        id: 'SR-004',
        code: 'YC-2026-004',
        customerId: 'KH-004',
        customerName: 'Lê Hoàng D',
        name: 'Cải tạo ban công',
        pipelineId: 'PPL-001',
        stageId: 'st-01',
        status: 'NEW',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        surveyImages: [],
        moistureReadings: [],
        quotations: [],
        createdAt: '2026-03-01T09:15:00',
    },
    {
        id: 'SR-005',
        code: 'YC-2026-005',
        customerId: 'KH-005',
        customerName: 'Phạm Thị E',
        name: 'Chống thấm khu WC',
        pipelineId: 'PPL-001',
        stageId: 'st-05',
        status: 'LOST',
        assignedPmId: 'U001',
        assignedPmName: 'Nguyễn Văn PM',
        surveyImages: [],
        moistureReadings: [],
        quotations: [],
        createdAt: '2026-02-10T16:45:00',
        notes: 'Khách hàng chê báo giá cao',
    },
];

// ============================================================
// PROJECTS
// ============================================================
// legacy mockProjects deleted

// ============================================================
// MATERIALS
// ============================================================
export const mockMaterials: Material[] = [
    { id: 'MAT-001', code: 'VT-001', name: 'SIRA PU (lót)', unit: 'kg', currentStock: 162, minStockAlert: 20, unitCost: 45000, category: 'Sơn chống thấm' },
    { id: 'MAT-002', code: 'VT-002', name: 'SIRA PU (phủ)', unit: 'kg', currentStock: 203, minStockAlert: 20, unitCost: 48000, category: 'Sơn chống thấm' },
    { id: 'MAT-003', code: 'VT-003', name: 'Primer (lót nền)', unit: 'lít', currentStock: 8, minStockAlert: 10, unitCost: 35000, category: 'Sơn lót' },
    { id: 'MAT-004', code: 'VT-004', name: 'Sika Latex', unit: 'kg', currentStock: 45, minStockAlert: 5, unitCost: 55000, category: 'Vật liệu trám' },
    { id: 'MAT-005', code: 'VT-005', name: 'Băng chống thấm Sika', unit: 'cuộn', currentStock: 12, minStockAlert: 3, unitCost: 120000, category: 'Vật liệu trám' },
];

export const mockStandards: MaterialStandard[] = [
    { id: 'STD-001', materialId: 'MAT-001', materialName: 'SIRA PU (lót)', constructionType: 'Chống thấm sàn', usagePerM2: 1.5 },
    { id: 'STD-002', materialId: 'MAT-002', materialName: 'SIRA PU (phủ)', constructionType: 'Chống thấm sàn', usagePerM2: 2.0 },
    { id: 'STD-003', materialId: 'MAT-003', materialName: 'Primer (lót nền)', constructionType: 'Chống thấm sàn', usagePerM2: 0.5 },
    { id: 'STD-004', materialId: 'MAT-001', materialName: 'SIRA PU (lót)', constructionType: 'Chống thấm tường', usagePerM2: 1.2 },
    { id: 'STD-005', materialId: 'MAT-002', materialName: 'SIRA PU (phủ)', constructionType: 'Chống thấm tường', usagePerM2: 1.5 },
];

// ============================================================
// STOCK ORDERS (separate registry)
// ============================================================
export const mockStockOrders: StockOrder[] = [
    {
        id: 'PX-001', code: 'PX-2026-001', type: 'OUT',
        journeyId: 'j-001', journeyCode: 'HT-2026-001',   // Phase 1: journey link
        projectId: 'DA-001', projectName: 'DA-2026-001',   // Phase 3: sẽ xóa
        items: [
            { materialId: 'MAT-001', materialName: 'SIRA PU (lót)', unit: 'kg', quantity: 150, unitCost: 45000 },
            { materialId: 'MAT-002', materialName: 'SIRA PU (phủ)', unit: 'kg', quantity: 200, unitCost: 48000 },
            { materialId: 'MAT-003', materialName: 'Primer', unit: 'lít', quantity: 50, unitCost: 35000 },
        ],
        totalValue: 18350000, status: 'COMPLETED',
        createdBy: 'Kế toán Phạm Thị A', createdAt: '2026-03-04',
        signedBy: 'Thợ Trần Văn C', signedAt: '2026-03-05T08:30:00',
    },
    {
        id: 'PN-001', code: 'PN-2026-001', type: 'IN',
        // journeyId: undefined (nhập kho không gắn journey cụ thể)
        items: [
            { materialId: 'MAT-001', materialName: 'SIRA PU (lót)', unit: 'kg', quantity: 150, unitCost: 45000 },
            { materialId: 'MAT-002', materialName: 'SIRA PU (phủ)', unit: 'kg', quantity: 200, unitCost: 48000 },
        ],
        totalValue: 16350000, status: 'COMPLETED',
        createdBy: 'Kế toán Phạm Thị A', createdAt: '2026-03-02',
        supplier: 'Công ty SIRA Việt Nam',
        notes: 'Nhập định kỳ tháng 3',
    },
];

// ============================================================
// PAYMENT MILESTONES (flat list for accountant view)
// ============================================================
export const mockMilestones: PaymentMilestone[] = [
    // Removed mockProjects reference
];

// ============================================================
// WARRANTY
// ============================================================
export const mockWarrantyCards: WarrantyCard[] = [
    {
        id: 'WC-001', code: 'BH-2026-001',
        projectId: 'DA-000-prev',
        projectName: 'Chống thấm T01/2026',
        customerName: 'Công ty TNHH XYZ',
        customerPhone: '0909090909',
        address: '55 Lý Tự Trọng, Q.1',
        constructionType: 'Chống thấm sàn',
        areaM2: 120, completedDate: '2026-01-20',
        warrantyMonths: 24, expiryDate: '2028-01-20',
        materials: ['SIRA PU (lót)', 'SIRA PU (phủ)', 'Primer'],
        issuedAt: '2026-01-21',
        qrCode: 'https://dltech.vn/warranty/BH-2026-001',
    },
];

export const mockWarrantyReminders: WarrantyReminder[] = [
    { id: 'WR-001', warrantyCardId: 'WC-001', projectName: 'Chống thấm T01/2026', customerName: 'Công ty TNHH XYZ', customerPhone: '0909090909', message: 'Kính gửi Quý khách, công trình của quý vị sẽ hết hạn bảo hành trong 30 ngày. Xin liên hệ 0900-000-000 nếu cần hỗ trợ.', channel: 'ZALO', scheduledAt: '2027-12-20T09:00:00', sentAt: undefined, status: 'PENDING' },
];

// ============================================================
// HELPERS
// ============================================================
export const getProjectById = (_id: string) => { /* mockProjects removed */ return undefined; }; // Placeholder for removed mockProjects
export const getCustomerById = (id: string) => mockCustomers.find(c => c.id === id);
export const getMaterialById = (id: string) => mockMaterials.find(m => m.id === id);

export const getLowStockMaterials = () => mockMaterials.filter(m => m.currentStock <= m.minStockAlert);

// ============================================================
// MOCK STOCK REQUESTS (PM → Kế toán workflow)
// ============================================================
export const mockStockRequests: StockRequest[] = [
    {
        id: 'YCR-001',
        code: 'YC-OUT-001',
        type: 'REQUEST_OUT',
        requestedBy: 'Nguyễn Văn PM',
        projectId: 'DA001',
        projectName: 'Chống thấm sàn Biệt thự Nguyễn A',
        items: [
            { materialId: 'VT001', materialName: 'SIRA PU (lót)', unit: 'kg', requested: 80, note: 'Thiếu theo định mức' },
            { materialId: 'VT003', materialName: 'Primer (lót nền)', unit: 'lít', requested: 30 },
        ],
        reason: 'Chuẩn bị thi công DA-001 tuần tới, cần xuất vật tư theo định mức',
        status: 'PENDING',
        createdAt: '2026-03-02T08:00:00',
    },
    {
        id: 'YCR-002',
        code: 'YC-OUT-002',
        type: 'REQUEST_OUT',
        requestedBy: 'Nguyễn Văn PM',
        projectId: 'DA002',
        projectName: 'Chống thấm mái Căn hộ Trần B',
        items: [
            { materialId: 'VT002', materialName: 'SIRA PU (phủ)', unit: 'kg', requested: 50 },
            { materialId: 'VT004', materialName: 'Sika Latex', unit: 'kg', requested: 20 },
        ],
        reason: 'DA-002 bước 7 – cần xuất VT cho thợ',
        status: 'CONVERTED',
        createdAt: '2026-02-28T09:30:00',
        reviewedBy: 'Kế toán Phạm Thị A',
        reviewedAt: '2026-02-28T14:00:00',
        reviewNote: 'Đã tạo PX-2026-030',
        convertedOrderId: 'PX-2026-030',
    },
    {
        id: 'YCR-003',
        code: 'YC-IN-001',
        type: 'REQUEST_IN',
        requestedBy: 'Nguyễn Văn PM',
        items: [
            { materialId: 'VT001', materialName: 'SIRA PU (lót)', unit: 'kg', requested: 200, note: 'Tổng 2 DA còn thiếu 188kg' },
            { materialId: 'VT002', materialName: 'SIRA PU (phủ)', unit: 'kg', requested: 150 },
            { materialId: 'VT003', materialName: 'Primer (lót nền)', unit: 'lít', requested: 60 },
        ],
        reason: 'Cảnh báo tồn kho thấp – 3 dự án sắp triển khai trong tháng 3',
        status: 'APPROVED',
        createdAt: '2026-03-01T10:00:00',
        reviewedBy: 'Kế toán Phạm Thị A',
        reviewedAt: '2026-03-01T15:00:00',
        reviewNote: 'Đã đặt hàng NCC, dự kiến nhập 05/03',
    },
    {
        id: 'YCR-004',
        code: 'YC-IN-002',
        type: 'REQUEST_IN',
        requestedBy: 'Nguyễn Văn PM',
        items: [
            { materialId: 'VT005', materialName: 'Băng chống thấm Sika', unit: 'cuộn', requested: 10 },
        ],
        reason: 'DA-003 cần băng chống thấm cho góc tường',
        status: 'PENDING',
        createdAt: '2026-03-03T07:00:00',
    },
];

// ============================================================
// ESTIMATE TEMPLATES (PM settings for Step 04 estimation)
// ============================================================
import { EstimateTemplate } from '../types/v3';

export const mockEstimateTemplates: EstimateTemplate[] = [
    {
        id: 'EST-TMPL-001',
        code: 'HM-PU-01',
        name: 'Chống thấm sàn Polyurethane (3 lớp tiêu chuẩn)',
        unit: 'm²',
        components: [
            { id: 'C01', type: 'material', itemId: 'MAT-003', name: 'Primer (lót nền)', unit: 'lít', quantityPerUnit: 0.2, unitPrice: 35000 },
            { id: 'C02', type: 'material', itemId: 'MAT-001', name: 'SIRA PU (lót)', unit: 'kg', quantityPerUnit: 1.5, unitPrice: 45000 },
            { id: 'C03', type: 'material', itemId: 'MAT-002', name: 'SIRA PU (phủ)', unit: 'kg', quantityPerUnit: 2.0, unitPrice: 48000 },
            { id: 'C04', type: 'labor', name: 'Nhân công thi công sàn', unit: 'm²', quantityPerUnit: 1, unitPrice: 35000 },
            { id: 'C05', type: 'other', name: 'Phí vận chuyển & hao hụt', unit: 'chuyến', quantityPerUnit: 0, unitPrice: 0 }
        ]
    },
    {
        id: 'EST-TMPL-002',
        code: 'HM-PU-02',
        name: 'Chống thấm tường ngoài (Sơn PU)',
        unit: 'm²',
        components: [
            { id: 'C06', type: 'material', itemId: 'MAT-001', name: 'SIRA PU (lót tường)', unit: 'kg', quantityPerUnit: 1.2, unitPrice: 45000 },
            { id: 'C07', type: 'material', itemId: 'MAT-002', name: 'SIRA PU (phủ bảo vệ)', unit: 'kg', quantityPerUnit: 1.5, unitPrice: 48000 },
            { id: 'C08', type: 'labor', name: 'Nhân công thi công tường (Đu dây)', unit: 'm²', quantityPerUnit: 1, unitPrice: 50000 }
        ]
    },
    {
        id: 'EST-TMPL-003',
        code: 'HM-CRACK-01',
        name: 'Xử lý vết nứt bằng Sika',
        unit: 'mdực', // mét dài
        components: [
            { id: 'C09', type: 'material', itemId: 'MAT-004', name: 'Sika Latex', unit: 'kg', quantityPerUnit: 0.5, unitPrice: 55000 },
            { id: 'C10', type: 'labor', name: 'Nhân công đục & trám', unit: 'mdực', quantityPerUnit: 1, unitPrice: 20000 }
        ]
    }
];
