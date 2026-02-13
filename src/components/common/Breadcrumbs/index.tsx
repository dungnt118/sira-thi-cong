import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { LABELS } from '@utils/constants';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const breadcrumbNameMap: Record<string, string> = {
        // Admin routes
        '/admin': LABELS.ADMIN.DASHBOARD,
        '/admin/dashboard': LABELS.ADMIN.DASHBOARD,
        '/admin/users': LABELS.ADMIN.USER_MANAGEMENT,
        '/admin/roles': LABELS.ADMIN.ROLE_MANAGEMENT,
        '/admin/organization': LABELS.ADMIN.DEPARTMENT_HIERARCHY,
        '/admin/schemas': LABELS.ADMIN.SCHEMA_MANAGEMENT,
        '/admin/workflows': LABELS.ADMIN.WORKFLOW_DESIGNER,
        '/admin/forms': LABELS.ADMIN.FORM_BUILDER,
        '/admin/menus': LABELS.ADMIN.MENU_MANAGEMENT,
        '/admin/system-settings': LABELS.ADMIN.SYSTEM_SETTINGS,
        '/admin/integrations': LABELS.ADMIN.INTEGRATION_MANAGEMENT,
        '/admin/email-templates': LABELS.ADMIN.EMAIL_TEMPLATES,
        '/admin/notification-rules': LABELS.ADMIN.NOTIFICATION_RULES,
        '/admin/audit-log': LABELS.ADMIN.AUDIT_LOG,
        '/admin/security-settings': LABELS.ADMIN.SECURITY_SETTINGS,
        '/admin/access-control': LABELS.ADMIN.ACCESS_CONTROL,
        '/admin/api-keys': LABELS.ADMIN.API_KEYS,
        '/admin/performance': LABELS.ADMIN.PERFORMANCE_DASHBOARD,
        '/admin/error-logs': LABELS.ADMIN.ERROR_LOGS,
        '/admin/system-health': LABELS.ADMIN.SYSTEM_HEALTH,

        // Supervisor routes
        '/supervisor': LABELS.SUPERVISOR.DASHBOARD,
        '/supervisor/dashboard': LABELS.SUPERVISOR.DASHBOARD,
        '/supervisor/projects': LABELS.SUPERVISOR.PROJECTS,
        '/supervisor/evidence-queue': LABELS.SUPERVISOR.EVIDENCE_QUEUE,
        '/supervisor/quality-issues': LABELS.SUPERVISOR.QUALITY_ISSUES,
        '/supervisor/team-performance': LABELS.SUPERVISOR.TEAM_PERFORMANCE,
        '/supervisor/reports': LABELS.SUPERVISOR.REPORTS,

        // PM routes
        '/pm': LABELS.PM.DASHBOARD,
        '/pm/dashboard': LABELS.PM.DASHBOARD,
        '/pm/projects': LABELS.PM.PROJECTS,
        '/pm/teams': LABELS.PM.TEAMS,
        '/pm/customers': LABELS.PM.CUSTOMERS,
        '/pm/financials': LABELS.PM.FINANCIALS,
        '/pm/reports': LABELS.PM.REPORTS,

        // Accountant routes
        '/accountant': LABELS.ACCOUNTANT.DASHBOARD,
        '/accountant/dashboard': LABELS.ACCOUNTANT.DASHBOARD,
        '/accountant/financial-summary': LABELS.ACCOUNTANT.FINANCIAL_SUMMARY,
        '/accountant/payment-tracking': LABELS.ACCOUNTANT.PAYMENT_TRACKING,
        '/accountant/reports': LABELS.ACCOUNTANT.REPORTS,

        // Partner routes
        '/partner': LABELS.PARTNER.DASHBOARD,
        '/partner/dashboard': LABELS.PARTNER.DASHBOARD,
        '/partner/my-projects': LABELS.PARTNER.MY_PROJECTS,
        '/partner/upload-evidence': LABELS.PARTNER.UPLOAD_EVIDENCE,
        '/partner/materials': LABELS.PARTNER.MATERIALS,
        '/partner/labor': LABELS.PARTNER.LABOR,
        '/partner/payments': LABELS.PARTNER.PAYMENTS,
    };

    const breadcrumbItems = [
        {
            title: (
                <Link to="/">
                    <HomeOutlined />
                </Link>
            ),
        },
        ...pathSnippets.map((_, index) => {
            const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSnippets.length - 1;
            const title = breadcrumbNameMap[url] || pathSnippets[index];

            return {
                title: isLast ? title : <Link to={url}>{title}</Link>,
            };
        }),
    ];

    return <Breadcrumb items={breadcrumbItems} style={{ margin: '16px 0' }} />;
};
