import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ConfigProvider, App as AntApp } from 'antd';
import viVN from 'antd/locale/vi_VN';

// Admin V2 Pages
import AdminLayoutV2 from '../layouts/AdminLayoutV2';
import DashboardV2 from '../pages/admin-v2/Dashboard';
import UserManagement from '../pages/admin-v2/UserManagement';
import RoleManagement from '../pages/admin-v2/RoleManagement';
import AuditLog from '../pages/admin-v2/AuditLog';
import SystemSettings from '../pages/admin-v2/SystemSettings';
import Reports from '../pages/admin-v2/Reports';

// PM Pages (existing)
import PMDashboard from '../pages/pm/Dashboard';
import Teams from '../pages/pm/Teams';
import WorkerManagement from '../pages/pm/Teams/WorkerManagement';
import WorkerDetail from '../pages/pm/Teams/WorkerDetail';
import TeamManagement from '../pages/pm/Teams/TeamManagement';
import TeamDetail from '../pages/pm/Teams/TeamDetail';
import LaborPriceConfig from '../pages/pm/Teams/LaborPriceConfig';
import CollaboratorDetail from '../pages/pm/Teams/CollaboratorDetail';
import Financials from '../pages/pm/Financials';
import PMReports from '../pages/pm/Reports';

// V3 CRM Pages
import CustomerList from '../pages/pm/CRM/CustomerList';
import CustomerDetail from '../pages/pm/CRM/CustomerDetail';
import ServiceRequestList from '../pages/pm/CRM/ServiceRequestList';
import ServiceRequestDetail from '../pages/pm/CRM/ServiceRequestDetail';
import Pipeline from '../pages/pm/CRM/Pipeline';
import CustomerCreate from '../pages/pm/CRM/CustomerCreate';
import SurveyUpload from '../pages/pm/CRM/SurveyUpload';
import Quotation from '../pages/pm/CRM/Quotation';
import PipelineSettings from '../pages/pm/CRM/PipelineSettings';

// V3 PM Construction Pages
import PMProjectList from '../pages/pm/Construction/ProjectList';
import PMProjectDetail from '../pages/pm/Construction/ProjectDetail';
import PMProjectCreate from '../pages/pm/Construction/ProjectCreate';
import PhotoApproval from '../pages/pm/Construction/PhotoApproval';
import EvidenceQueue from '../pages/pm/Construction/EvidenceQueue';
import TemplateChecklist from '../pages/pm/Construction/TemplateChecklist';
import MaterialPlan from '../pages/pm/Construction/MaterialPlan';
import ProjectFinance from '../pages/pm/Construction/ProjectFinance';
import ProjectFinanceList from '../pages/pm/Construction/ProjectFinanceList';
import MaterialPlanList from '../pages/pm/Construction/MaterialPlanList';
import InventoryCatalog from '../pages/pm/Inventory/InventoryCatalog';


// ===== PHASE 1: JOURNEY PAGES =====
// PM Journey Pages
import JourneyList from '../pages/pm/Journeys/JourneyList';
import JourneyBoard from '../pages/pm/Journeys/JourneyBoard';
import JourneyDetail360 from '../pages/pm/Journeys/JourneyDetail360';
import ActionCenter from '../pages/pm/Journeys/ActionCenter';
import CustomerJourneySettingPage from '../pages/pm/Settings/CustomerJourneySettingPage';
import EstimateTemplateList from '../pages/pm/Settings/EstimateTemplateList';

// Sale Layout + Pages
import { SaleLayout } from '../layouts/SaleLayout';
// Giam Sat Layout + Pages
import { GiamSatLayout } from '../layouts/GiamSatLayout';
import SaleDashboard from '../pages/sale/Journeys/JourneyInbox';
import SLAQueue from '../pages/sale/Journeys/SLAQueue';
import SurveyCoordination from '../pages/sale/Journeys/SurveyCoordination';
import SaleSurveyDetail from '../pages/sale/Journeys/SaleSurveyDetail';
import CommunicationsCenter from '../pages/sale/Journeys/CommunicationsCenter';
import SaleJourneyDetail from '../pages/sale/Journeys/SaleJourneyContext';
import SaleCustomerList from '../pages/sale/Customers/CustomerList';
import SaleCustomerDetail from '../pages/sale/Customers/CustomerDetail';

// Portal Sub-pages
import PublishedTimeline from '../pages/public/portal/PublishedTimeline';
import PortalDocuments from '../pages/public/portal/PortalDocuments';
import ThreadInbox from '../pages/public/portal/ThreadInbox';
import ThreadDetail from '../pages/public/portal/ThreadDetail';

// V3 Supervisor Pages
import SupervisorChecklist from '../pages/worker/Checklist';
import SupervisorEvidenceUpload from '../pages/worker/EvidenceUpload';
const SupervisorIncidentReport = lazy(() => import('../pages/worker/IncidentReport'));
const ProjectDiary = lazy(() => import('../pages/giam-sat/ProjectDiary'));
const MaterialReceipt = lazy(() => import('../pages/giam-sat/MaterialReceipt'));
const GiamSatProfile = lazy(() => import('../pages/giam-sat/GiamSatProfile'));
const SupervisorDashboard = lazy(() => import('../pages/giam-sat/SupervisorDashboard'));
const SupervisorProjectList = lazy(() => import('../pages/giam-sat/SupervisorProjectList'));

// V3 Accountant Pages
import AccountantV3Layout from '../layouts/AccountantV3Layout';
import InventoryDashboard from '../pages/accountant/Inventory/Dashboard';
import PaymentDashboard from '../pages/accountant/Finance/PaymentDashboard';
import InboundForm from '../pages/accountant/Inventory/InboundForm';
import OutboundForm from '../pages/shared/OutboundForm';
import DistributorList from '../pages/accountant/Inventory/DistributorList';
import AssetsDashboard from '../pages/accountant/Assets/Dashboard';
import AssetAllocationHistory from '../pages/accountant/Assets/AllocationHistory';
import AllocationForm from '../pages/shared/AllocationForm';
import AssetAllocationDetail from '../pages/accountant/Assets/AssetAllocationDetail';
import StockOrderDetail from '@pages/accountant/Inventory/StockOrderDetail';
import InventoryHistory from '../pages/accountant/Inventory/History';

// V4 Ky Thuat Pages
import KyThuatLayout from '../layouts/KyThuatLayout';
import {
    Dashboard as KTDashboard,
    Schedule as KTSchedule,
    SurveyForm as KTSurveyForm,
    Execution as KTExecution,
    JourneyDetail as KTJourneyDetail
} from '../pages/ky-thuat';

// V3 Public Pages
import CustomerPortal from '../pages/public/CustomerPortal';

// Layouts
import { PMLayout } from '../layouts/PMLayout';
import { PartnerLayout } from '../layouts/PartnerLayout';
import { Login } from '../pages/shared/Login';
import { NotFound } from '../pages/shared/NotFound';
import './App.css';

import { BuildOutlined } from '@ant-design/icons';

// Simple stub component for pages in progress
const ComingSoon = ({ title }: { title: string }) => (
    <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{ fontSize: 48, color: '#fa8c16' }}><BuildOutlined /></div>
        <h2>{title}</h2>
        <p style={{ color: '#999' }}>Tính năng đang được phát triển</p>
    </div>
);

import { Provider } from 'react-redux';
import store from '@/store';
import Auth from '@/pages/shared/auth/Auth';

function App() {
    return (
        <ConfigProvider locale={viVN}>
            <AntApp>
                <Provider store={store}>
                    <BrowserRouter>
                        <Auth>
                            <Suspense fallback={<div style={{ padding: 20 }}>Loading...</div>}>
                                <Routes>

                            {/* ===== AUTO REDIRECTS ===== */}
                            <Route path="/personal/profile" element={<Navigate to="/sale/dashboard" replace />} />
                            
                            {/* ===== PUBLIC ROUTES ===== */}

                            <Route path="/login" element={<Login />} />
                            <Route path="/portal/:token" element={<CustomerPortal />} />
                            <Route path="/portal/:token/timeline" element={<PublishedTimeline />} />
                            <Route path="/portal/:token/documents" element={<PortalDocuments />} />
                            <Route path="/portal/:token/threads" element={<ThreadInbox />} />
                            <Route path="/portal/:token/threads/:threadId" element={<ThreadDetail />} />

                            {/* ===== ADMIN ROUTES ===== */}
                            <Route path="/admin" element={<AdminLayoutV2 />}>
                                <Route index element={<DashboardV2 />} />
                                <Route path="dashboard" element={<DashboardV2 />} />
                                <Route path="users" element={<UserManagement />} />
                                <Route path="roles" element={<RoleManagement />} />
                                <Route path="audit" element={<AuditLog />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="settings" element={<SystemSettings />} />
                            </Route>

                            {/* ===== PM ROUTES (V3) ===== */}
                            <Route path="/pm" element={<PMLayout />}>
                                <Route index element={<Navigate to="/pm/dashboard" replace />} />
                                <Route path="dashboard" element={<PMDashboard />} />

                                {/* --- Journey Module (PM) --- */}
                                <Route path="journeys">
                                    <Route index element={<JourneyList />} />
                                    <Route path="board" element={<JourneyBoard />} />
                                    <Route path="action-center" element={<ActionCenter />} />
                                    <Route path=":journeyId" element={<JourneyDetail360 />} />
                                </Route>

                                {/* --- App Settings (PM) --- */}
                                <Route path="settings">
                                    <Route path="customer-journey" element={<CustomerJourneySettingPage />} />
                                    <Route path="estimate-templates" element={<EstimateTemplateList />} />
                                </Route>

                                {/* --- CRM Module --- */}
                                <Route path="crm">
                                    <Route index element={<Navigate to="/pm/crm/service-requests" replace />} />
                                    <Route path="customers" element={<CustomerList />} />
                                    <Route path="customers/new" element={<CustomerCreate />} />
                                    <Route path="customers/:id" element={<CustomerDetail />} />

                                    <Route path="service-requests" element={<ServiceRequestList />} />
                                    <Route path="service-requests/new" element={<CustomerCreate />} />
                                    <Route path="service-requests/:id" element={<ServiceRequestDetail />} />
                                    <Route path="service-requests/:id/survey" element={<SurveyUpload />} />
                                    <Route path="service-requests/:id/quotation" element={<Quotation />} />

                                    <Route path="pipeline" element={<Pipeline />} />
                                    <Route path="pipeline-settings" element={<PipelineSettings />} />
                                </Route>

                                {/* --- Construction Module (PM) --- */}
                                <Route path="construction">
                                    <Route index element={<Navigate to="/pm/construction/projects" replace />} />
                                    <Route path="projects" element={<PMProjectList />} />
                                    <Route path="projects/create" element={<PMProjectCreate />} />
                                    <Route path="projects/:id/edit" element={<PMProjectCreate />} />
                                    <Route path="projects/:id" element={<PMProjectDetail />} />
                                    <Route path="projects/:id/finance" element={<ProjectFinance />} />
                                    <Route path="projects/:id/materials" element={<MaterialPlan />} />
                                    <Route path="evidence" element={<EvidenceQueue />} />
                                    <Route path="evidence/:id" element={<PhotoApproval />} />
                                    <Route path="templates" element={<TemplateChecklist />} />
                                </Route>

                                {/* --- Inventory & Assets (PM view) --- */}
                                <Route path="inventory">
                                    <Route path="catalog" element={<InventoryCatalog />} />
                                    <Route path="plan" element={<MaterialPlanList />} />
                                    <Route path="plan/:id" element={<MaterialPlan />} />
                                    <Route path="stock-out" element={<OutboundForm />} />
                                    <Route path="history" element={<InventoryHistory />} />
                                </Route>
                                <Route path="assets">
                                    <Route path="allocation" element={<AllocationForm />} />
                                </Route>

                                {/* --- Finance (PM view) --- */}
                                <Route path="finance">
                                    <Route path="projects" element={<ProjectFinanceList />} />
                                    <Route path="projects/:id" element={<ProjectFinance />} />
                                </Route>

                                {/* --- Teams/Labor Management --- */}
                                <Route path="teams/internal" element={<Teams />} />
                                <Route path="teams/outsource" element={<Teams />} />
                                <Route path="teams/workers" element={<WorkerManagement />} />
                                <Route path="teams/workers/:id" element={<WorkerDetail />} />
                                <Route path="teams/groups" element={<TeamManagement />} />
                                <Route path="teams/prices" element={<LaborPriceConfig />} />
                                <Route path="teams/groups/:id" element={<TeamDetail />} />
                                <Route path="teams/outsource/:id" element={<CollaboratorDetail />} />
                                
                                <Route path="financials/milestones" element={<Financials />} />
                                <Route path="reports" element={<PMReports />} />
                            </Route>

                            {/* ===== SALE ROUTES (Phase 1) ===== */}
                            <Route path="/sale" element={<SaleLayout />}>
                                <Route index element={<Navigate to="/sale/dashboard" replace />} />
                                <Route path="dashboard" element={<SaleDashboard />} />
                                <Route path="customers" element={<SaleCustomerList />} />
                                <Route path="customers/:customerId" element={<SaleCustomerDetail />} />
                                <Route path="sla" element={<SLAQueue />} />
                                <Route path="surveys" element={<SurveyCoordination />} />
                                <Route path="communications" element={<CommunicationsCenter />} />
                                <Route path="dashboard/:journeyId" element={<SaleJourneyDetail />} />
                                <Route path="dashboard/:journeyId/surveys/:surveyId" element={<SaleSurveyDetail />} />
                                <Route path="inventory/stock-out" element={<OutboundForm />} />
                                <Route path="inventory/history" element={<InventoryHistory />} />
                                <Route path="assets/allocation" element={<AllocationForm />} />
                            </Route>

                            {/* ===== SUPERVISOR ROUTES (V4) ===== */}
                            <Route path="/supervisor" element={<GiamSatLayout />}>
                                <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
                                <Route path="dashboard" element={<SupervisorDashboard />} />
                                <Route path="projects" element={<SupervisorProjectList />} />
                                <Route path="checklist/:id" element={<SupervisorChecklist />} />
                                <Route path="evidence/:projectId/:stepId" element={<SupervisorEvidenceUpload />} />
                                <Route path="incident" element={<SupervisorIncidentReport />} />
                                <Route path="materials" element={<MaterialReceipt />} />
                                <Route path="profile" element={<GiamSatProfile />} />
                                <Route path="diary/:projectId" element={<ProjectDiary />} />
                                <Route path="inventory/stock-out" element={<OutboundForm />} />
                                <Route path="inventory/history" element={<InventoryHistory />} />
                                <Route path="assets/allocation" element={<AllocationForm />} />
                            </Route>

                            {/* ===== ACCOUNTANT ROUTES (V3) ===== */}
                            <Route path="/accountant" element={<AccountantV3Layout />}>
                                <Route index element={<Navigate to="/accountant/dashboard" replace />} />
                                <Route path="dashboard" element={<InventoryDashboard />} />
                                <Route path="inventory" element={<Navigate to="/accountant/inventory/materials" replace />} />
                                <Route path="inventory/materials" element={<InventoryDashboard />} />
                                <Route path="inventory/stock-out" element={<OutboundForm />} />
                                <Route path="inventory/stock-in" element={<InboundForm />} />
                                <Route path="inventory/distributors" element={<DistributorList />} />
                                <Route path="inventory/order/:id" element={<StockOrderDetail />} />
                                <Route path="inventory/history" element={<InventoryHistory />} />

                                {/* Assets Module */}
                                <Route path="assets" element={<Navigate to="/accountant/assets/list" replace />} />
                                <Route path="assets/list" element={<AssetsDashboard />} />
                                <Route path="assets/allocation" element={<AllocationForm />} />
                                <Route path="assets/allocation/:id" element={<AssetAllocationDetail />} />
                                <Route path="assets/allocation-history" element={<AssetAllocationHistory />} />
                                <Route path="assets/maintenance" element={<ComingSoon title="Bảo trì tài sản" />} />
                                <Route path="finance">
                                    <Route index element={<Navigate to="/accountant/finance/milestones" replace />} />
                                    <Route path="milestones" element={<PaymentDashboard />} />
                                    <Route path="report" element={<ComingSoon title="Báo cáo Tài chính" />} />
                                </Route>
                                <Route path="warranty">
                                    <Route path="cards" element={<ComingSoon title="Phiếu Bảo hành" />} />
                                    <Route path="schedule" element={<ComingSoon title="Lịch Bảo hành" />} />
                                </Route>
                                <Route path="reports" element={<ComingSoon title="Báo cáo Tổng hợp" />} />
                            </Route>

                            {/* ===== KỸ THUẬT ROUTES (V4) ===== */}
                            <Route path="/ky-thuat" element={<KyThuatLayout />}>
                                <Route index element={<Navigate to="/ky-thuat/dashboard" replace />} />
                                <Route path="dashboard" element={<KTDashboard />} />
                                <Route path="schedule" element={<KTSchedule />} />
                                <Route path="survey/:id" element={<KTSurveyForm />} />
                                <Route path="execution" element={<KTExecution />} />
                                <Route path="journeys/:id" element={<KTJourneyDetail />} />
                                <Route path="profile" element={<ComingSoon title="Hồ sơ Kỹ thuật" />} />
                                <Route path="inventory/stock-out" element={<OutboundForm />} />
                                <Route path="inventory/history" element={<InventoryHistory />} />
                                <Route path="assets/allocation" element={<AllocationForm />} />
                            </Route>

                            {/* ===== PARTNER ROUTES ===== */}
                            <Route path="/partner/*" element={<PartnerLayout />}>
                                <Route index element={<Navigate to="/partner/dashboard" replace />} />
                            </Route>

                            {/* Default + 404 */}
                            <Route path="/" element={<Navigate to="/login" replace />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </Suspense>
                        </Auth>
                    </BrowserRouter>
                </Provider>
            </AntApp>
        </ConfigProvider>
    );
}

export default App;
