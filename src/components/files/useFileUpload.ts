import { ACCESS_TOKEN, BASE_URL, get, REGCODE, UPLOAD_URL } from 'app/services/storeService';
import { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

export interface UploadConfig {
    action: string;
    headers: Record<string, string>;
    customRequest?: (options: any) => void;
}

export interface UseFileUploadOptions {
    useCustomRequest?: boolean;
    onProgress?: (percent: number) => void;
    onSuccess?: (response: any, file: any) => void;
    onError?: (error: any) => void;
}

export interface FileSearchParams {
    path?: string;
    file_type?: string;
    mime_type?: string;
    text?: string;
}

/**
 * Hook chia sẻ logic upload file cho các components
 */
export const useFileUpload = (options: UseFileUploadOptions = {}) => {
    const { useCustomRequest = false, onProgress, onSuccess, onError } = options;
    
    // Lấy token để authorization
    const getAuthHeaders = (): Record<string, string> => {
        const token = get(ACCESS_TOKEN);
        return token ? { Authorization:"Bearer " + token } : {};
    };

    const resolveUploadUrl = (): string => {
        const urlFromConfig = get(UPLOAD_URL);
        if (urlFromConfig && typeof urlFromConfig === 'string' && urlFromConfig.trim().length > 0) {
            return urlFromConfig;
        }

        const base = get(BASE_URL);
        if (base && typeof base === 'string') {
            try {
                return new URL('api/file/upload', base).toString();
            } catch {
                // fallback bên dưới
            }
        }

        // fallback cuối cùng: relative path để vẫn hoạt động với reverse proxy
        return '/api/file/upload';
    };

    // Config cơ bản cho antd Upload
    const getUploadConfig = (): UploadConfig => {
        const config: UploadConfig = {
            action: resolveUploadUrl(),
            headers: getAuthHeaders()
        };

        // Nếu cần custom request (như UploadImage)
        if (useCustomRequest) {
            config.customRequest = async (uploadOptions) => {
                const { file, onSuccess: onUploadSuccess, onError: onUploadError, onProgress: onUploadProgress } = uploadOptions;
                
                const formData = new FormData();
                formData.append('file', file);
                
                try {
                    const xhr = new XMLHttpRequest();
                    
                    // Progress tracking
                    xhr.upload.addEventListener('progress', (event) => {
                        if (event.lengthComputable) {
                            const percent = (event.loaded / event.total) * 100;
                            onUploadProgress?.({ percent });
                            onProgress?.(percent);
                        }
                    });
                    
                    // Success/Error handling
                    xhr.addEventListener('load', () => {
                        if (xhr.status === 200) {
                            try {
                                const response = JSON.parse(xhr.responseText);
                                console.log('Upload response:', response);
                                
                                // Standardize response format
                                const standardResponse = parseUploadResponse(response);
                                
                                onUploadSuccess?.(standardResponse.file_path, xhr);
                                onSuccess?.(standardResponse, file);
                            } catch (error) {
                                onUploadError?.(error);
                                onError?.(error);
                            }
                        } else {
                            const error = new Error(`Upload failed with status: ${xhr.status}`);
                            onUploadError?.(error);
                            onError?.(error);
                        }
                    });
                    
                    xhr.addEventListener('error', () => {
                        const error = new Error('Upload failed');
                        onUploadError?.(error);
                        onError?.(error);
                    });
                    
                    // Open connection and set headers
                    xhr.open('POST', get(UPLOAD_URL));
                    
                    const token = get(ACCESS_TOKEN);
                    if (token) {
                        xhr.setRequestHeader('Authorization',"Bearer " + token);
                    }
                    
                    xhr.send(formData);
                    
                } catch (error) {
                    onUploadError?.(error);
                    onError?.(error);
                }
            };
        }

        return config;
    };

    // Xử lý response standard từ server
    const parseUploadResponse = (response: any): HeadlessFileUpload => {
        // Standardize response format từ server mới
        // Unwrap nested result property if it exists (standard wrap in some APIs)
        const data = response.result || response;
        
        return {
            file_id: data.file_id,
            name: data.name,
            file_path: data.file_path || data.url,
            file_type: data.file_type,
            mime_type: data.mime_type,
            url: data.url || data.file_path,
            size: data.size,
            created_at: data.created_at,
            updated_at: data.updated_at,
            // Backward compatibility
            ...data
        };
    };

    // Hàm search files đã upload
    const searchFiles = async (
        params: FileSearchParams = {},
        setLoading?: (loading: boolean) => void
    ): Promise<HeadlessFileUpload[]> => {
        const { path, file_type, mime_type, text } = params;
        
        try {
            setLoading?.(true);
            
            // Build URL với query parameters
            const baseUrl = get(BASE_URL);
            const url = new URL('/api/file/search', baseUrl);
            
            // Thêm parameters nếu có
            if (path) url.searchParams.append('path', path);
            if (file_type) url.searchParams.append('file_type', file_type);
            if (mime_type) url.searchParams.append('mime_type', mime_type);
            if (text) url.searchParams.append('text', text);
            
            // Thêm regCode
            const regCode = get(REGCODE);
            if (regCode) url.searchParams.append('regCode', regCode);
            
            // Tạo request với headers authorization
            const headers = getAuthHeaders();
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`Search files failed with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Search files response data:', data);
            // Parse response - có thể là array trực tiếp hoặc wrap trong object
            const filesData = Array.isArray(data) ? data : (data.data || []);
            
            // Standardize từng file response
            return filesData.map((file: any) => parseUploadResponse(file));
            
        } catch (error) {
            console.error('Error searching files:', error);
            throw error;
        } finally {
            setLoading?.(false);
        }
    };

    return {
        getUploadConfig,
        getAuthHeaders,
        parseUploadResponse,
        searchFiles
    };
}; 