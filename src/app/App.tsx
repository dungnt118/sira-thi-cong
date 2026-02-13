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
// Old Admin Pages (deprecated)
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
                        {/* Supervisor routes will be added */}
                    </Route>

                    {/* PM Routes */}
                    <Route path="/pm/*" element={<PMLayout />}>
                        <Route index element={<Navigate to="/pm/dashboard" replace />} />
                        {/* PM routes will be added */}
                    </Route>

                    {/* Accountant Routes */}
                    <Route path="/accountant/*" element={<AccountantLayout />}>
                        <Route index element={<Navigate to="/accountant/dashboard" replace />} />
                        {/* Accountant routes will be added */}
                    </Route>

                    {/* Partner Routes */}
                    <Route path="/partner/*" element={<PartnerLayout />}>
                        <Route index element={<Navigate to="/partner/dashboard" replace />} />
                        {/* Partner routes will be added */}
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
