import '@/services/config';
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
// Wave 6 W6-02 — antd v5 + React 19 compat shim. Phải import TRƯỚC khi App mount để
// patch các unstable APIs antd v5 dùng (ReactDOM.render → createRoot, Spin patches…).
// Loại bỏ warning: "[antd: compatible] antd v5 support React is 16 ~ 18".
import '@ant-design/v5-patch-for-react-19';

// Wave 5 W5-01 — Globally enable dayjs plugins used across reports.
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(quarterOfYear);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
)
