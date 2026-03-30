import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@layouts': path.resolve(__dirname, './src/layouts'),
            '@pages': path.resolve(__dirname, './src/pages'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@services': path.resolve(__dirname, './src/services'),
            '@store': path.resolve(__dirname, './src/store'),
            '@types': path.resolve(__dirname, './src/types'),
            '@utils': path.resolve(__dirname, './src/utils'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@assets': path.resolve(__dirname, './src/assets'),
            '@fuse': path.resolve(__dirname, './src/utils/legacy/fuse'),
            '@history': path.resolve(__dirname, './src/utils/legacy/history'),
            'app': path.resolve(__dirname, './src'),
            'types': path.resolve(__dirname, './src/types'),
            'services': path.resolve(__dirname, './src/services'),
            'hooks': path.resolve(__dirname, './src/hooks'),
            'components': path.resolve(__dirname, './src/components'),
            'utils': path.resolve(__dirname, './src/utils'),
            'styles': path.resolve(__dirname, './src/styles'),
            'assets': path.resolve(__dirname, './src/assets'),
            'layouts': path.resolve(__dirname, './src/layouts'),
            'pages': path.resolve(__dirname, './src/pages'),
            'store': path.resolve(__dirname, './src/store'),
        },
    },
})
