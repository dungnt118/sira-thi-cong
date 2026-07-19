import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const screenshotDir = path.join('C:\\Users\\admin\\.gemini\\antigravity\\brain\\d01829ea-0582-45b5-9bca-24713ec81475', 'screenshots');

// Đảm bảo thư mục lưu ảnh tồn tại
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

// Cấu hình các kích thước màn hình
const viewports = [
  { name: 'Desktop', width: 1920, height: 1080 },
  { name: 'Tablet', width: 768, height: 1024 },
  { name: 'Mobile', width: 375, height: 812 },
];

test.describe('Refactor UI/UX & Responsive Evaluation', () => {

  test.beforeEach(async ({ page }) => {
    // In log của browser ra console để debug
    page.on('console', msg => console.log(`BROWSER LOG [${msg.type()}]:`, msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

    // Vô hiệu hóa Service Worker để Playwright hoạt động tin cậy
    await page.addInitScript(() => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register = () => Promise.reject(new Error("Service Worker disabled"));
      }
    });

    // API Mocking cho GraphQL bao gồm CORS preflight OPTIONS để chạy offline độc lập
    await page.route('**/graphql', async (route) => {
      const request = route.request();
      
      // Xử lý CORS Preflight Options
      if (request.method() === 'OPTIONS') {
        const reqHeaders = request.headers();
        const allowHeaders = reqHeaders['access-control-request-headers'] || '*';
        await route.fulfill({
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': allowHeaders,
            'Access-Control-Max-Age': '86400',
          }
        });
        return;
      }

      const postData = request.postDataJSON() || {};
      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': '*',
      };
      
      // Query string để kiểm tra nội dung
      const queryString = postData.query || '';

      // Mock danh sách Yêu cầu chi
      if (queryString.includes('query_PaymentRequests_dto') || queryString.includes('QueryPaymentRequestsDto')) {
        await route.fulfill({
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({
            data: {
              response: {
                code: 0,
                message: 'Success',
                records: 3,
                data: [
                  {
                    _id: 'PR-001',
                    code: 'YCC-2026-001',
                    request_date: '2026-07-18T10:00:00Z',
                    request_type: 'supplier_payment',
                    priority: 'urgent',
                    requested_by: 'Nguyễn Văn PM',
                    status: 'approved',
                    amount: 25000000,
                    currency: 'vnd',
                    payment_content: 'Thanh toán tiền cát đá đợt 2 công trình Lam Sơn',
                    request_note: 'Đã có hóa đơn tài chính đi kèm',
                    beneficiary_name_snapshot: 'CÔNG TY TNHH VẬT LIỆU XÂY DỰNG TIẾN PHÁT',
                    beneficiary_account_number_snapshot: '1903456789012',
                    beneficiary_bank_name_snapshot: 'Techcombank',
                    submitted_at: '2026-07-18T10:05:00Z'
                  },
                  {
                    _id: 'PR-002',
                    code: 'YCC-2026-002',
                    request_date: '2026-07-18T11:00:00Z',
                    request_type: 'expense_reimbursement',
                    priority: 'normal',
                    requested_by: 'Trần Văn Giám Sát',
                    status: 'pending_approval',
                    amount: 1500000,
                    currency: 'vnd',
                    payment_content: 'Hoàn ứng chi phí nhiên liệu và ăn trưa tiếp khách đợt khảo sát ngày 15/07',
                    request_note: 'Có kèm hóa đơn đỏ ăn uống',
                    beneficiary_name_snapshot: 'TRẦN VĂN TUẤN',
                    beneficiary_account_number_snapshot: '0071001234567',
                    beneficiary_bank_name_snapshot: 'Vietcombank',
                    submitted_at: '2026-07-18T11:10:00Z'
                  },
                  {
                    _id: 'PR-003',
                    code: 'YCC-2026-003',
                    request_date: '2026-07-18T12:00:00Z',
                    request_type: 'salary_payment',
                    priority: 'critical',
                    requested_by: 'Nguyễn Văn PM',
                    status: 'paid',
                    amount: 45000000,
                    currency: 'vnd',
                    payment_content: 'Chi lương đợt 1 cho tổ thợ xây công trình biệt thự cỏ nhân tạo',
                    beneficiary_name_snapshot: 'LÊ VĂN THÁI',
                    beneficiary_account_number_snapshot: '1012345678',
                    beneficiary_bank_name_snapshot: 'VietinBank',
                    submitted_at: '2026-07-18T12:05:00Z',
                    paid_by: 'Phạm Thị A (Kế toán)',
                    paid_at: '2026-07-18T14:00:00Z',
                    bank_transaction_ref: 'FT26071800098',
                    payment_proof_note: 'Đã chuyển khoản thành công từ tài khoản VCB-MAIN công ty.'
                  }
                ]
              }
            }
          })
        });
      } 
      // Mock danh sách tài khoản ngân hàng công ty
      else if (queryString.includes('query_CompanyBankAccounts_dto') || queryString.includes('queryCompanyBankAccountsDto')) {
        await route.fulfill({
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({
            data: {
              response: {
                code: 0,
                message: 'Success',
                data: [
                  { _id: 'CO-001', bank_name: 'Vietcombank', account_number: '9704360001', account_name: 'CÔNG TY TNHH LÂM BẮC', code: 'VCB-MAIN', status: 'active', is_default: true }
                ]
              }
            }
          })
        });
      }
      // Mock danh sách danh bạ thụ hưởng
      else if (queryString.includes('query_BeneficiaryBankContacts_dto') || queryString.includes('queryBeneficiaryBankContactsDto')) {
        await route.fulfill({
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({
            data: {
              response: {
                code: 0,
                message: 'Success',
                data: [
                  { _id: 'BEN-001', contact_name: 'CÔNG TY TNHH VẬT LIỆU XÂY DỰNG TIẾN PHÁT', bank_account_name: 'CÔNG TY TNHH VẬT LIỆU XÂY DỰNG TIẾN PHÁT', bank_account_number: '1903456789012', bank_name: 'Techcombank', status: 'active' }
                ]
              }
            }
          })
        });
      }
      // Mock GraphQL User session query (get_user_session_info) để tránh bị logout
      else if (queryString.includes('get_user_session_info')) {
        const variables = postData.variables || {};
        const activeRole = variables.role || 'KT';
        
        await route.fulfill({
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({
            data: {
              response: {
                code: 0,
                message: 'Success',
                data: {
                  user: {
                    _id: 'US-001',
                    username: 'admin',
                    name: 'Nguyễn Văn Admin',
                    roles: ['KT', 'QL', 'GS'],
                    identity_contexts: [
                      { clientId: 'bac.user', roles: ['KT', 'QL', 'GS'], defaultRole: 'KT' }
                    ]
                  },
                  activeRole: activeRole,
                  welcome_url: activeRole === 'KT' ? '/admin/kt/expenditures/payment-requests' : '/admin/ql/inventory/plan'
                }
              }
            }
          })
        });
      }
      // Mock Fallback cho mọi GraphQL query khác để tránh 404 crash
      else {
        await route.fulfill({
          contentType: 'application/json',
          headers: corsHeaders,
          body: JSON.stringify({
            data: {}
          })
        });
      }
    });
  });

  // Test Phân hệ Kế toán - Yêu cầu chi
  test('1. Evaluation - Kế toán - Yêu cầu chi & VietQR', async ({ page }) => {
    // Tăng timeout cho test này lên 120s để chạy qua 3 viewports và chụp ảnh modal đầy đủ
    test.setTimeout(120000);

    // Gán thông tin auth bypass trực tiếp vào localStorage và vô hiệu hóa serviceWorker an toàn
    await page.addInitScript(() => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register = () => Promise.reject(new Error("Service Worker disabled"));
      }
      window.localStorage.setItem('access_token', 'mock-access-token');
      window.localStorage.setItem('expires_at', new Date(Date.now() + 3600000).toISOString());
      window.localStorage.setItem('userData', JSON.stringify({
        username: 'admin',
        role: 'KT',
        roles: ['KT', 'QL', 'GS']
      }));
      window.localStorage.setItem('manualActiveRole', 'KT');
    });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      
      // Đi tới trang danh sách yêu cầu chi
      console.log(`Going to payment requests on ${vp.name}...`);
      await page.goto('http://localhost:5173/admin/kt/expenditures/payment-requests', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000); // Chờ vẽ Antd Grid ổn định
      
      // Inject CSS ẩn Sidebar (Sider) để tránh che khuất element trên viewport nhỏ
      await page.addStyleTag({
        content: `
          aside.ant-layout-sider, 
          .ant-layout-sider-trigger,
          .fuse-navigation { 
            display: none !important; 
          }
          .ant-layout {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
        `
      });
      await page.waitForTimeout(500);

      console.log(`Current page URL on ${vp.name}:`, page.url());

      // Chụp ảnh màn hình danh sách ở tab Chờ duyệt
      await page.screenshot({ 
        path: path.join(screenshotDir, `KT_List_PaymentRequests_${vp.name}.png`),
        fullPage: false
      });

      // Click tab "Đã duyệt" để hiển thị bản ghi YCC-2026-001 bằng dispatch click event
      console.log(`Clicking approved tab on ${vp.name}...`);
      const approvedTab = page.locator('.ant-tabs-tab[data-node-key="approved"]').first();
      await approvedTab.dispatchEvent('click');
      await page.waitForTimeout(1500); // Chờ table reload dữ liệu tab

      // Chụp ảnh danh sách ở tab Đã duyệt
      await page.screenshot({ 
        path: path.join(screenshotDir, `KT_List_Approved_${vp.name}.png`),
        fullPage: false
      });

      // Mở modal chi tiết yêu cầu chi YCC-2026-001 bằng cách dispatch click event
      console.log(`Clicking YCC-2026-001 row/card on ${vp.name}...`);
      const rowItem = page.locator('text=YCC-2026-001').first();
      await rowItem.dispatchEvent('click');
      await page.waitForTimeout(1500); // Chờ animation modal mở

      // Chụp ảnh màn hình Modal chi tiết có chứa VietQR
      await page.screenshot({ 
        path: path.join(screenshotDir, `KT_Detail_VietQR_${vp.name}.png`),
        fullPage: false
      });

      // Nếu đang ở màn hình lớn, test tiếp phần Click "Xác nhận Đã chi"
      if (vp.name === 'Desktop') {
        const confirmPayBtn = page.locator('text="Xác nhận Đã chi"').first();
        await confirmPayBtn.dispatchEvent('click');
        await page.waitForTimeout(1000); // Chờ modal xác nhận xuất hiện
        
        await page.screenshot({ 
          path: path.join(screenshotDir, `KT_ConfirmPay_VietQR_${vp.name}.png`),
          fullPage: false
        });

        // Đóng modal xác nhận chi tiền
        const closeConfirmBtn = page.locator('.ant-modal-close-x').last();
        await closeConfirmBtn.dispatchEvent('click');
      }

      // Đóng modal chi tiết
      const closeDetailBtn = page.locator('.ant-modal-close-x').first();
      if (await closeDetailBtn.isVisible()) {
        await closeDetailBtn.dispatchEvent('click');
      }
      await page.waitForTimeout(500);
    }
  });

  // Test Phân hệ PM Thi công - Định mức vật tư
  test('2. Evaluation - PM - Định mức vật tư', async ({ page }) => {
    test.setTimeout(90000);

    await page.addInitScript(() => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register = () => Promise.reject(new Error("Service Worker disabled"));
      }
      window.localStorage.setItem('access_token', 'mock-access-token');
      window.localStorage.setItem('expires_at', new Date(Date.now() + 3600000).toISOString());
      window.localStorage.setItem('userData', JSON.stringify({
        username: 'admin',
        role: 'QL',
        roles: ['KT', 'QL', 'GS']
      }));
      window.localStorage.setItem('manualActiveRole', 'QL');
    });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Đi tới danh sách định mức vật tư dự án
      await page.goto('http://localhost:5173/admin/ql/inventory/plan', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // Inject CSS ẩn Sidebar (Sider)
      await page.addStyleTag({
        content: `
          aside.ant-layout-sider, 
          .ant-layout-sider-trigger,
          .fuse-navigation { 
            display: none !important; 
          }
          .ant-layout {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
        `
      });
      await page.waitForTimeout(500);

      // Chụp ảnh danh sách định mức vật tư
      await page.screenshot({ 
        path: path.join(screenshotDir, `PM_List_MaterialPlan_${vp.name}.png`),
        fullPage: false
      });

      // Đi tới chi tiết định mức vật tư của dự án J001
      await page.goto('http://localhost:5173/admin/ql/inventory/plan/J001', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // Inject CSS ẩn Sidebar (Sider)
      await page.addStyleTag({
        content: `
          aside.ant-layout-sider, 
          .ant-layout-sider-trigger,
          .fuse-navigation { 
            display: none !important; 
          }
          .ant-layout {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
        `
      });
      await page.waitForTimeout(500);

      // Chụp ảnh chi tiết định mức vật tư
      await page.screenshot({ 
        path: path.join(screenshotDir, `PM_Detail_MaterialPlan_${vp.name}.png`),
        fullPage: false
      });
    }
  });

  // Test Phân hệ PM Thi công - Tài chính dự án
  test('3. Evaluation - PM - Tài chính dự án', async ({ page }) => {
    test.setTimeout(90000);

    await page.addInitScript(() => {
      if (navigator.serviceWorker) {
        navigator.serviceWorker.register = () => Promise.reject(new Error("Service Worker disabled"));
      }
      window.localStorage.setItem('access_token', 'mock-access-token');
      window.localStorage.setItem('expires_at', new Date(Date.now() + 3600000).toISOString());
      window.localStorage.setItem('userData', JSON.stringify({
        username: 'admin',
        role: 'QL',
        roles: ['KT', 'QL', 'GS']
      }));
      window.localStorage.setItem('manualActiveRole', 'QL');
    });

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      // Đi tới danh sách tài chính dự án
      await page.goto('http://localhost:5173/admin/ql/finance/projects', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // Inject CSS ẩn Sidebar (Sider)
      await page.addStyleTag({
        content: `
          aside.ant-layout-sider, 
          .ant-layout-sider-trigger,
          .fuse-navigation { 
            display: none !important; 
          }
          .ant-layout {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
        `
      });
      await page.waitForTimeout(500);

      // Chụp ảnh danh sách tài chính
      await page.screenshot({ 
        path: path.join(screenshotDir, `PM_List_ProjectFinance_${vp.name}.png`),
        fullPage: false
      });

      // Đi tới chi tiết tài chính dự án J001
      await page.goto('http://localhost:5173/admin/ql/finance/projects/J001', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);

      // Inject CSS ẩn Sidebar (Sider)
      await page.addStyleTag({
        content: `
          aside.ant-layout-sider, 
          .ant-layout-sider-trigger,
          .fuse-navigation { 
            display: none !important; 
          }
          .ant-layout {
            padding-left: 0 !important;
            margin-left: 0 !important;
          }
        `
      });
      await page.waitForTimeout(500);

      // Chụp ảnh chi tiết tài chính
      await page.screenshot({ 
        path: path.join(screenshotDir, `PM_Detail_ProjectFinance_${vp.name}.png`),
        fullPage: false
      });
    }
  });

});
