import React from 'react';
import { Breadcrumb, Grid } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { LABELS } from '@utils/constants';

export const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;
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
        '/gs/dashboard': LABELS.SUPERVISOR.DASHBOARD,
        '/gs/projects': LABELS.SUPERVISOR.PROJECTS,
        '/gs/evidence-queue': LABELS.SUPERVISOR.EVIDENCE_QUEUE,
        '/gs/quality-issues': LABELS.SUPERVISOR.QUALITY_ISSUES,
        '/gs/team-performance': LABELS.SUPERVISOR.TEAM_PERFORMANCE,
        '/gs/reports': LABELS.SUPERVISOR.REPORTS,

        // PM routes
        '/ql': LABELS.PM.DASHBOARD,
        '/ql/dashboard': LABELS.PM.DASHBOARD,
        '/ql/projects': LABELS.PM.PROJECTS,
        '/ql/teams': LABELS.PM.TEAMS,
        '/ql/customers': LABELS.PM.CUSTOMERS,
        '/ql/financials': LABELS.PM.FINANCIALS,
        '/ql/reports': LABELS.PM.REPORTS,

        // Accountant routes
        '/kt': LABELS.ACCOUNTANT.DASHBOARD,
        '/kt/dashboard': LABELS.ACCOUNTANT.DASHBOARD,
        '/kt/financial-summary': LABELS.ACCOUNTANT.FINANCIAL_SUMMARY,
        '/kt/payment-tracking': LABELS.ACCOUNTANT.PAYMENT_TRACKING,
        '/kt/reports': LABELS.ACCOUNTANT.REPORTS,

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

    return (
        <div
            style={{
                margin: '4px 0 12px',
                maxWidth: '100%',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                WebkitOverflowScrolling: 'touch',
            }}
        >
            <Breadcrumb
                items={breadcrumbItems}
                style={{
                    minWidth: 'max-content',
                    fontSize: isMobile ? 12 : undefined,
                }}
            />
        </div>
    );
};
