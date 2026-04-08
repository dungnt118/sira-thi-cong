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
        // Admin
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

        // Supervisor
        '/admin/gs': LABELS.SUPERVISOR.DASHBOARD,
        '/admin/gs/dashboard': LABELS.SUPERVISOR.DASHBOARD,
        '/admin/gs/projects': LABELS.SUPERVISOR.PROJECTS,
        '/admin/gs/evidence-queue': LABELS.SUPERVISOR.EVIDENCE_QUEUE,
        '/admin/gs/quality-issues': LABELS.SUPERVISOR.QUALITY_ISSUES,
        '/admin/gs/team-performance': LABELS.SUPERVISOR.TEAM_PERFORMANCE,
        '/admin/gs/reports': LABELS.SUPERVISOR.REPORTS,

        // PM
        '/admin/ql': LABELS.PM.DASHBOARD,
        '/admin/ql/dashboard': LABELS.PM.DASHBOARD,
        '/admin/ql/projects': LABELS.PM.PROJECTS,
        '/admin/ql/teams': LABELS.PM.TEAMS,
        '/admin/ql/customers': LABELS.PM.CUSTOMERS,
        '/admin/ql/financials': LABELS.PM.FINANCIALS,
        '/admin/ql/reports': LABELS.PM.REPORTS,

        // Accountant
        '/admin/kt': LABELS.ACCOUNTANT.DASHBOARD,
        '/admin/kt/dashboard': LABELS.ACCOUNTANT.DASHBOARD,
        '/admin/kt/financial-summary': LABELS.ACCOUNTANT.FINANCIAL_SUMMARY,
        '/admin/kt/payment-tracking': LABELS.ACCOUNTANT.PAYMENT_TRACKING,
        '/admin/kt/reports': LABELS.ACCOUNTANT.REPORTS,

        // Partner
        '/admin/partner': LABELS.PARTNER.DASHBOARD,
        '/admin/partner/dashboard': LABELS.PARTNER.DASHBOARD,
        '/admin/partner/my-projects': LABELS.PARTNER.MY_PROJECTS,
        '/admin/partner/upload-evidence': LABELS.PARTNER.UPLOAD_EVIDENCE,
        '/admin/partner/materials': LABELS.PARTNER.MATERIALS,
        '/admin/partner/labor': LABELS.PARTNER.LABOR,
        '/admin/partner/payments': LABELS.PARTNER.PAYMENTS,
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
