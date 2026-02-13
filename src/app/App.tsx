import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import viVN from 'antd/locale/vi_VN';
// Admin V2 Pages (Simplified for Construction SME)
import AdminLayoutV2 from '../layouts/AdminLayoutV2';
import DashboardV2 from '../pages/admin-v2/Dashboard';
import UserManagement from '../pages/admin-v2/UserManagement';
import RoleManagement from '../pages/admin-v2/RoleManagement';
import AuditLog from '../pages/admin-v2/AuditLog';
import SystemSettings from '../pages/admin-v2/SystemSettings';
import Reports from '../pages/admin-v2/Reports';
// PM Pages
import PMDashboard from '../pages/pm/Dashboard';
import ProjectList from '../pages/pm/Projects/ProjectList';
import ProjectDetail from '../pages/pm/Projects/ProjectDetail';
import ProjectCreate from '../pages/pm/Projects/ProjectCreate';
import Teams from '../pages/pm/Teams';
import Customers from '../pages/pm/Customers';
import Financials from '../pages/pm/Financials';
import PMReports from '../pages/pm/Reports';
// Layout imports
import { AdminLayout } from '@layouts/AdminLayout';
import { SupervisorLayout } from '@layouts/SupervisorLayout';
import { PMLayout } from '@layouts/PMLayout';
import { AccountantLayout } from '@layouts/AccountantLayout';
import { PartnerLayout } from '@layouts/PartnerLayout';
import { Login } from '@pages/shared/Login';
import { NotFound } from '@pages/shared/NotFound';
import './App.css';

/**
 * Main App Component with Multi-Layout Routing
 */
function App() {
    return (
        <ConfigProvider locale={viVN}>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />

                    {/* Admin Routes - Old (deprecated) */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<div>Old Admin - Deprecated</div>} />
                    </Route>

                    {/* Admin Routes V2 - Simplified for Construction SME */}
                    <Route path="/admin-v2" element={<AdminLayoutV2 />}>
                        <Route index element={<DashboardV2 />} />
                        <Route path="dashboard" element={<DashboardV2 />} />
                        <Route path="users" element={<UserManagement />} />
                        <Route path="roles" element={<RoleManagement />} />
                        <Route path="audit" element={<AuditLog />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="settings" element={<SystemSettings />} />
                    </Route>

                    {/* Supervisor Routes */}
                    <Route path="/supervisor/*" element={<SupervisorLayout />}>
                        <Route index element={<Navigate to="/supervisor/dashboard" replace />} />
                    </Route>

                    {/* PM Routes */}
                    <Route path="/pm" element={<PMLayout />}>
                        <Route index element={<Navigate to="/pm/dashboard" replace />} />
                        <Route path="dashboard" element={<PMDashboard />} />
                        <Route path="projects/all" element={<ProjectList />} />

                        <Route path="projects/create" element={<ProjectCreate />} />
                        <Route path="projects/:projectId" element={<ProjectDetail />} />
                        <Route path="teams/internal" element={<Teams />} />
                        <Route path="teams/outsource" element={<Teams />} />
                        <Route path="customers" element={<Customers />} />
                        <Route path="financials/milestones" element={<Financials />} />
                        <Route path="financials/transactions" element={<Financials />} />
                        <Route path="reports" element={<PMReports />} />
                    </Route>

                    {/* Accountant Routes */}
                    <Route path="/accountant/*" element={<AccountantLayout />}>
                        <Route index element={<Navigate to="/accountant/dashboard" replace />} />
                    </Route>

                    {/* Partner Routes */}
                    <Route path="/partner/*" element={<PartnerLayout />}>
                        <Route index element={<Navigate to="/partner/dashboard" replace />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/login" replace />} />

                    {/* 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </ConfigProvider>
    );
}

export default App;
