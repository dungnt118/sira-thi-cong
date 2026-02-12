import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { router } from './router';
import './styles/global.css';
import './styles/antd-overrides.css';

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1976D2',
          colorSuccess: '#4CAF50',
          colorWarning: '#FF9800',
          colorError: '#F44336',
          colorInfo: '#2196F3',
          borderRadius: 8,
          fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Layout: {
            headerBg: '#FFFFFF',
            siderBg: '#FFFFFF',
            bodyBg: '#F5F5F5',
          },
          Menu: {
            itemBg: 'transparent',
            itemSelectedBg: '#E3F2FD',
            itemSelectedColor: '#1976D2',
            itemHoverBg: '#F5F5F5',
            itemHeight: 48,
          },
          Table: {
            headerBg: '#FAFAFA',
            rowHoverBg: '#F5F5F5',
          },
        },
      }}
    >
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default App;
