import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';

// Pages (will be created)
const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const UserList = React.lazy(() => import('../pages/Users/UserList'));
const SystemHealth = React.lazy(() => import('../pages/Monitoring/SystemHealth'));

// Placeholder component for pages not yet implemented
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
    <div style={{ padding: 24 }}>
        <h1>{title}</h1>
        <p>This page is under development.</p>
    </div>
);

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/dashboard" replace />,
            },
            {
                path: 'dashboard',
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <Dashboard />
                    </React.Suspense>
                ),
            },
            {
                path: 'users',
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <UserList />
                    </React.Suspense>
                ),
            },
            {
                path: 'roles',
                element: <PlaceholderPage title="Roles" />,
            },
            {
                path: 'permissions',
                element: <PlaceholderPage title="Permissions" />,
            },
            {
                path: 'departments',
                element: <PlaceholderPage title="Departments" />,
            },
            {
                path: 'schemas',
                element: <PlaceholderPage title="Schemas" />,
            },
            {
                path: 'workflows',
                element: <PlaceholderPage title="Workflows" />,
            },
            {
                path: 'forms',
                element: <PlaceholderPage title="Forms" />,
            },
            {
                path: 'system/settings',
                element: <PlaceholderPage title="System Settings" />,
            },
            {
                path: 'system/integrations',
                element: <PlaceholderPage title="Integrations" />,
            },
            {
                path: 'system/email-templates',
                element: <PlaceholderPage title="Email Templates" />,
            },
            {
                path: 'security/audit-log',
                element: <PlaceholderPage title="Audit Log" />,
            },
            {
                path: 'security/access-control',
                element: <PlaceholderPage title="Access Control" />,
            },
            {
                path: 'security/api-keys',
                element: <PlaceholderPage title="API Keys" />,
            },
            {
                path: 'monitoring/system-health',
                element: (
                    <React.Suspense fallback={<div>Loading...</div>}>
                        <SystemHealth />
                    </React.Suspense>
                ),
            },
            {
                path: 'monitoring/performance',
                element: <PlaceholderPage title="Performance" />,
            },
            {
                path: 'monitoring/error-logs',
                element: <PlaceholderPage title="Error Logs" />,
            },
            {
                path: 'settings',
                element: <PlaceholderPage title="Settings" />,
            },
        ],
    },
]);
