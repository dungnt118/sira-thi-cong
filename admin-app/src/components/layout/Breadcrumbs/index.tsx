import React from 'react';
import { Breadcrumb } from 'antd';
import { useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import './Breadcrumbs.css';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const breadcrumbNameMap: Record<string, string> = {
        '/dashboard': 'Dashboard',
        '/users': 'Users',
        '/users/create': 'Create User',
        '/roles': 'Roles',
        '/permissions': 'Permissions',
        '/departments': 'Departments',
        '/schemas': 'Schemas',
        '/workflows': 'Workflows',
        '/forms': 'Forms',
        '/system': 'System',
        '/system/settings': 'Settings',
        '/system/integrations': 'Integrations',
        '/system/email-templates': 'Email Templates',
        '/security': 'Security',
        '/security/audit-log': 'Audit Log',
        '/security/access-control': 'Access Control',
        '/security/api-keys': 'API Keys',
        '/monitoring': 'Monitoring',
        '/monitoring/system-health': 'System Health',
        '/monitoring/performance': 'Performance',
        '/monitoring/error-logs': 'Error Logs',
        '/settings': 'Settings',
    };

    const breadcrumbItems = [
        {
            title: (
                <Link to="/dashboard">
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
        <div className="breadcrumbs-container">
            <Breadcrumb items={breadcrumbItems} />
        </div>
    );
};

export default Breadcrumbs;
