import { LinkOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, Image, Input, message, Modal, Space, Spin, Tabs, Tooltip } from 'antd';
import Upload from 'antd/lib/upload';
import { ACCESS_TOKEN, get, getFileLink, getFileUrl, UPLOAD_URL } from 'app/services/storeService';

import { forwardRef, CSSProperties, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';
import { PropDefinition } from "types/schemas/PropDefinition";
import { useFileUpload } from './useFileUpload';
import type { FilterComponentProps, PropTypeInput, PropTypeReadonly } from './types';

type ImageValue = string | null | undefined;

// Edit component props
export type UploadImageEditProps = PropTypeInput<ImageValue> & {
    fileTypeMessage?: string;
    uploadOnly?: boolean;
};

// View component props
export type UploadImageViewProps = PropTypeReadonly<ImageValue>;

// Filter component props
export type UploadImageFilterProps = FilterComponentProps;

/**
 * ImageWithFallback - Component hiển thị ảnh với fallback đẹp sử dụng Empty của Ant Design
 */
interface ImageWithFallbackProps {
    src?: string | null;
    alt?: string;
    style?: CSSProperties;
    preview?: boolean;
    onClick?: () => void;
    fallbackDescription?: string;
}

/** Fallback placeholder khi không có ảnh hoặc ảnh lỗi */
function ImagePlaceholder({ style = {}, label }: { style?: CSSProperties; label?: string }) {
    const containerStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f0f2f5 0%, #e6e9ef 100%)',
        border: '1px solid #e0e3ea',
        borderRadius: '8px',
        gap: '6px',
        minWidth: 64,
        minHeight: 64,
        ...style,
    };
    return (
        <div style={containerStyle}>
            <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Background */}
                <rect width="36" height="36" rx="6" fill="#dde1ea" />
                {/* Mountain + sun icon */}
                <circle cx="12" cy="13" r="3" fill="#b0b8c9" />
                <path d="M4 26 L12 16 L18 22 L23 17 L32 26 Z" fill="#c4cad6" />
                {/* Dashed border lines */}
                <rect x="2" y="2" width="32" height="32" rx="5" stroke="#b0b8c9" strokeWidth="1.2" strokeDasharray="3 2" fill="none" />
            </svg>
            {label && (
                <span style={{ fontSize: 11, color: '#8c98b0', letterSpacing: 0.2, marginTop: 2 }}>
                    {label}
                </span>
            )}
        </div>
    );
}

function ImageWithFallback({
    src,
    alt = 'Image',
    style = {},
    preview = false,
    onClick,
    fallbackDescription,
}: ImageWithFallbackProps) {
    const [error, setError] = useState(false);

    // Reset error state khi src thay đổi
    useEffect(() => {
        setError(false);
    }, [src]);

    if (!src || error) {
        return <ImagePlaceholder style={style} label={fallbackDescription} />;
    }

    const imageUrl = src?.includes('http') || src?.includes('https') || src?.includes('data:image')
        ? src
        : getFileLink(src);

    return (
        <Image
            src={imageUrl}
            alt={alt}
            style={style}
            preview={preview}
            onClick={onClick}
            onError={() => setError(true)}
        />
    );
}

/** Ref handle để mở modal từ bên ngoài (vd: chatbox 1 bước) */
export interface IUploadImageEditRef {
    showModal: () => void;
}

/**
 * UploadImage Edit Component - Dùng cho form editing
 * Hỗ trợ ref.showModal() để mở modal trực tiếp (tránh dialog trung gian)
 */
export const UploadImageEdit = forwardRef<IUploadImageEditRef, UploadImageEditProps>(function UploadImageEdit({
    value,
    onChange,
    att,
    fileTypeMessage,
    uploadOnly = false,
    disabled = false
}, ref) {
    const [openPreview, setOpenPreview] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('upload');
    const [imageUrl, setImageUrl] = useState('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    // States cho tab thư viện
    const [libraryImages, setLibraryImages] = useState<HeadlessFileUpload[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLibraryImage, setSelectedLibraryImage] = useState<string | null>(null);

    // useRef để lưu giá trị trước đó, tránh việc re-render không cần thiết
    const prevModalState = useRef(isModalOpen);

    // Initialize useFileUpload hook
    const { searchFiles } = useFileUpload();

    // Lấy fileSizeLimit từ att.fileUploadOption.max_size (default 2MB)
    const getFileSizeLimit = () => {
        const maxSize = att?.fileUploadOption?.max_size;
        return maxSize && maxSize > 0 ? maxSize : 5;
    };
    const fileSizeLimit = getFileSizeLimit();

    // Lấy folder từ att.fileUploadOption.folder
    const uploadFolder = att?.fileUploadOption?.folder || undefined;

    // Cập nhật previewImage khi value thay đổi mà không gây re-render modal
    useEffect(() => {
        if (isModalOpen && !prevModalState.current) {
            setPreviewImage(value ?? null);
        }
        prevModalState.current = isModalOpen;
    }, [isModalOpen, value]);

    // Hiển thị Modal
    const showModal = () => {
        setPreviewImage(value ?? ''); // Đặt giá trị hiện tại cho ảnh xem trước
        setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({ showModal }), []);

    // Đóng Modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Xác nhận và lưu thay đổi
    const handleOk = () => {
        onChange && onChange(previewImage);
        setIsModalOpen(false);
    };

    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImageUrl(e.target.value);
    };

    const handleImageUrlSubmit = () => {
        if (imageUrl.trim()) {
            setPreviewImage(imageUrl);
            setImageUrl(''); // Clear input sau khi submit
        } else {
            message.warning("Vui lòng nhập URL hợp lệ");
        }
    };

    // Hàm load ảnh từ thư viện
    const loadLibraryImages = async (searchTerm?: string) => {
        try {
            setLibraryLoading(true);
            const images = await searchFiles({
                path: uploadFolder, // Sử dụng folder từ config
                file_type: 'image',
                text: searchTerm || undefined
            });
            setLibraryImages(images);
        } catch (error) {
            console.error('Error loading library images:', error);
            message.error('Không thể tải danh sách ảnh từ thư viện');
        } finally {
            setLibraryLoading(false);
        }
    };

    // Hàm search ảnh trong thư viện
    const handleLibrarySearch = () => {
        loadLibraryImages(searchText);
    };

    // Hàm chọn ảnh từ thư viện
    const handleSelectLibraryImage = (filePath: string) => {
        setSelectedLibraryImage(filePath);
        setPreviewImage(filePath);
    };

    // Load ảnh thư viện khi mở modal lần đầu
    useEffect(() => {
        if (isModalOpen && activeTab === 'library' && libraryImages.length === 0) {
            loadLibraryImages();
        }
    }, [isModalOpen, activeTab]);

    // Reset selected library image khi chuyển tab
    const handleTabChange = (newActiveTab: string) => {
        if (newActiveTab !== 'library') {
            setSelectedLibraryImage(null);
        }
        setActiveTab(newActiveTab);
    };

    const handleUploadTab = () => {
        return (
            <Space direction="vertical" className="pt-4 w-full">
                <Upload
                    className={`w-auto`}
                    showUploadList={false}
                    maxCount={1}
                    customRequest={async (options) => {
                        const { file, onSuccess, onError, onProgress } = options;

                        const formData = new FormData();
                        formData.append('file', file);

                        // Thêm folder parameter nếu có
                        if (uploadFolder) {
                            formData.append('folder', uploadFolder);
                        }

                        try {
                            const xhr = new XMLHttpRequest();

                            xhr.upload.addEventListener('progress', (event) => {
                                if (event.lengthComputable && onProgress) {
                                    const percentComplete = (event.loaded / event.total) * 100;
                                    onProgress({ percent: percentComplete });
                                }
                            });

                            xhr.addEventListener('load', () => {
                                if (xhr.status === 200) {
                                    try {
                                        const response = JSON.parse(xhr.responseText);
                                        console.log('Upload response:', response);
                                        console.log('Using file_path:', response.file_path);
                                        // Xử lý response mới: {file_id, file_path, file_type}
                                        // Sử dụng file_path thay vì file_id
                                        onSuccess?.(response.file_path, xhr);
                                    } catch (error) {
                                        onError?.(error as Error);
                                    }
                                } else {
                                    onError?.(new Error(`Upload failed with status: ${xhr.status}`));
                                }
                            });

                            xhr.addEventListener('error', () => {
                                onError?.(new Error('Upload failed'));
                            });

                            xhr.open('POST', get(UPLOAD_URL));

                            // Thêm Authorization header sau khi mở connection (Bearer format)
                            const token = get(ACCESS_TOKEN);
                            if (token) {
                                xhr.setRequestHeader('Authorization', `Bearer ${token}`);
                            }

                            xhr.send(formData);

                        } catch (error) {
                            onError?.(error as Error);
                        }
                    }}
                    beforeUpload={(file) => {
                        const isJpgOrPng =
                            file.type === "image/jpeg" ||
                            file.type === "image/png" ||
                            file.type === "image/webp" ||
                            file.type === "image/gif";

                        if (!isJpgOrPng) {
                            message.error(fileTypeMessage || "Bạn chỉ có thể upload file JPG/PNG/WEBP/GIF");
                            return false;
                        }

                        const isLtSizeLimit = file.size / 1024 / 1024 < fileSizeLimit;
                        if (!isLtSizeLimit) {
                            message.error(`File ảnh không được vượt quá ${fileSizeLimit}MB!`);
                            return false;
                        }

                        return true;
                    }}
                    onChange={(info) => {
                        if (info.file.status === "done") {
                            console.log('Upload done, setting previewImage to:', info.file.response);
                            // Response giờ là file_path từ customRequest
                            setPreviewImage(info.file.response);
                        } else if (info.file.status === "error") {
                            message.error('Upload file lỗi');
                        }
                    }}
                >
                    <Button disabled={disabled} icon={<UploadOutlined />}>Upload ảnh</Button>
                </Upload>
            </Space>
        );
    };

    const handleUrlTab = () => {
        return (
            <Space direction="vertical" className="pt-4 w-full">
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Nhập URL ảnh"
                        value={imageUrl}
                        onChange={handleImageUrlChange}
                        disabled={disabled}
                        onPressEnter={handleImageUrlSubmit}
                    />
                    <Button
                        type="primary"
                        onClick={handleImageUrlSubmit}
                        icon={<LinkOutlined />}
                        disabled={disabled}
                    >
                        Xác nhận
                    </Button>
                </Space.Compact>
            </Space>
        );
    };

    const handleLibraryTab = () => {
        return (
            <Space direction="vertical" className="pt-4 w-full">
                {/* Search bar */}
                <Space.Compact style={{ width: '100%' }}>
                    <Input
                        placeholder="Tìm kiếm ảnh..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        disabled={disabled}
                        onPressEnter={handleLibrarySearch}
                    />
                    <Button
                        type="primary"
                        onClick={handleLibrarySearch}
                        icon={<SearchOutlined />}
                        disabled={disabled}
                        loading={libraryLoading}
                    >
                        Tìm kiếm
                    </Button>
                </Space.Compact>

                {/* Image grid */}
                <div className="mt-4" style={{ minHeight: '200px', maxHeight: '400px' }}>
                    {libraryLoading ? (
                        <div className="text-center py-8">
                            <Spin size="large" />
                            <div className="mt-2">Đang tải ảnh...</div>
                        </div>
                    ) : (
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(7, 1fr)',
                                gap: '8px',
                                maxHeight: '320px',
                                overflowY: 'auto'
                            }}
                        >
                            {libraryImages.map((image, index) => (
                                <Tooltip key={image.file_id || index} title={image.name || 'Ảnh không có tên'}>
                                    <div
                                        style={{
                                            position: 'relative',
                                            cursor: 'pointer',
                                            border: selectedLibraryImage === (image.file_path || image.url)
                                                ? '2px solid #1890ff'
                                                : '2px solid #d9d9d9',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            height: '80px',
                                            backgroundColor: selectedLibraryImage === (image.file_path || image.url)
                                                ? '#e6f7ff'
                                                : 'transparent',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => handleSelectLibraryImage(image.file_path || image.url || '')}
                                        onMouseEnter={(e) => {
                                            if (selectedLibraryImage !== (image.file_path || image.url)) {
                                                e.currentTarget.style.borderColor = '#40a9ff';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedLibraryImage !== (image.file_path || image.url)) {
                                                e.currentTarget.style.borderColor = '#d9d9d9';
                                            }
                                        }}
                                    >
                                        {/* Preview button */}
                                        <div style={{ position: 'absolute', top: '4px', right: '4px', zIndex: 10 }}>
                                            <Button
                                                size="small"
                                                type="text"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    padding: 0,
                                                    fontSize: '10px',
                                                    color: 'white',
                                                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                                    border: 'none'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const imageUrl = image.url || (image.file_path?.includes('http') || image.file_path?.includes('https') || image.file_path?.includes('data:image')
                                                        ? image.file_path
                                                        : getFileUrl(image.file_id || image.file_path || ''));

                                                    Modal.info({
                                                        title: image.name || 'Preview',
                                                        content: (
                                                            <div style={{ textAlign: 'center' }}>
                                                                <ImageWithFallback
                                                                    src={imageUrl}
                                                                    alt={image.name || 'Preview'}
                                                                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                                                                    fallbackDescription="Không thể tải ảnh xem trước"
                                                                />
                                                            </div>
                                                        ),
                                                        width: 500,
                                                        okText: 'Đóng'
                                                    });
                                                }}
                                            >
                                                👁
                                            </Button>
                                        </div>

                                        {/* Image content */}
                                        <ImageWithFallback
                                            src={
                                                image.url || (image.file_path?.includes('http') || image.file_path?.includes('https') || image.file_path?.includes('data:image')
                                                    ? image.file_path
                                                    : getFileUrl(image.file_id || image.file_path || ''))
                                            }
                                            alt={image.name || 'Library image'}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover'
                                            }}
                                            preview={false}
                                            fallbackDescription=""
                                        />

                                        {/* Selection indicator */}
                                        {selectedLibraryImage === (image.file_path || image.url) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                right: 0,
                                                bottom: 0,
                                                backgroundColor: 'rgba(24, 144, 255, 0.2)',
                                                border: '2px solid #1890ff',
                                                borderRadius: '8px'
                                            }}></div>
                                        )}

                                        {/* Selection dot */}
                                        {selectedLibraryImage === (image.file_path || image.url) && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '4px',
                                                left: '4px',
                                                width: '16px',
                                                height: '16px',
                                                backgroundColor: '#1890ff',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                <div style={{
                                                    width: '8px',
                                                    height: '8px',
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%'
                                                }}></div>
                                            </div>
                                        )}
                                    </div>
                                </Tooltip>
                            ))}
                        </div>
                    )}

                    {!libraryLoading && libraryImages.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>
                            Không tìm thấy ảnh nào trong thư viện
                        </div>
                    )}
                </div>
            </Space>
        );
    };

    // Component hiển thị khi có uploadOnly=true
    const UploadWithPreview = () => {
        return (
            <Space direction="vertical">
                <Button
                    icon={<UploadOutlined />}
                    onClick={showModal}
                    disabled={disabled}
                >
                    Thêm ảnh
                </Button>

                {value && (
                    <Upload
                        listType="picture-card"
                        fileList={[
                            {
                                uid: value,
                                name: value || 'image',
                                status: 'done',
                                type: 'image',
                                url: value?.includes('http') || value?.includes('https') || value?.includes('data:image') ? value : getFileLink(value),
                            },
                        ]}
                        isImageUrl={() => true}
                        onRemove={() => {
                            onChange && onChange(null);
                        }}
                        onPreview={() => {
                            setOpenPreview(true);
                        }}
                        className="w-auto"
                    ></Upload>
                )}

                <Modal
                    footer={null}
                    open={openPreview}
                    width={600}
                    style={{ top: "10vh" }}
                    zIndex={1410}
                    onCancel={() => setOpenPreview(false)}
                >
                    <ImageWithFallback
                        src={
                            value?.includes("http") || value?.includes("https") || value?.includes("data:image")
                                ? value
                                : getFileLink(value)
                        }
                        preview={false}
                        style={{ width: '100%' }}
                        fallbackDescription="Không thể tải ảnh xem trước"
                    />
                </Modal>
            </Space>
        );
    };

    // Tạo tabs với forceRender để tránh re-render khi chuyển tab
    const items = [
        {
            key: 'upload',
            label: 'Upload',
            children: handleUploadTab(),
            forceRender: true
        },
        {
            key: 'library',
            label: 'Gallery',
            children: handleLibraryTab(),
            forceRender: true
        },
        {
            key: 'url',
            label: 'URL',
            children: handleUrlTab(),
            forceRender: true
        }
    ];

    const isDisabled = disabled ||
        (att && String(att.editor) === "Disabled") ||
        Boolean(att?.isDisabled);

    if (att && String(att.editor) === "Hidden") {
        return null;
    }

    return (
        <div>
            {uploadOnly ? (
                <UploadWithPreview />
            ) : (
                <>
                    {value ? (
                        <ImageWithFallback
                            src={value?.includes('http') || value?.includes('data:image') ? value : getFileLink(value)}
                            preview={true}
                            style={{ cursor: 'pointer', maxWidth: '200px', maxHeight: '200px' }}
                            onClick={showModal}
                            fallbackDescription="Không thể tải ảnh"
                        />
                    ) : (
                        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center">
                            <Button
                                icon={<UploadOutlined />}
                                onClick={showModal}
                                disabled={isDisabled}
                            >
                                Thêm ảnh
                            </Button>
                        </div>
                    )}
                </>
            )}

            <Modal
                title={value ? "Cập nhật ảnh" : "Thêm ảnh mới"}
                open={isModalOpen}
                onCancel={handleCancel}
                width={600}
                zIndex={1400}
                destroyOnHidden={false}
                maskClosable={false}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk} disabled={!previewImage}>
                        Xác nhận
                    </Button>,
                ]}
                className="upload-image-modal"
            >
                <div className="flex flex-col space-y-4">
                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        items={items}
                        destroyOnHidden={false}
                        className="upload-image-tabs"
                    />

                    {previewImage && (
                        <div className="mt-4 text-center">
                            <h3 className="mb-2">Xem trước</h3>
                            <div className="border p-2 inline-block">
                                <ImageWithFallback
                                    src={previewImage?.includes('http') || previewImage?.includes('https') || previewImage?.includes('data:image')
                                        ? previewImage
                                        : getFileLink(previewImage)}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                                    fallbackDescription="Không thể tải ảnh xem trước"
                                />
                            </div>
                            <Button
                                type="text"
                                danger
                                onClick={() => setPreviewImage(null)}
                                className="mt-2"
                            >
                                Xóa ảnh
                            </Button>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
});

/**
 * UploadImage View Component - Dùng cho hiển thị readonly
 * Luôn hiển thị fallback placeholder khi không có ảnh hoặc link không hợp lệ
 */
export function UploadImageView({ value, property }: { value: any, property: PropDefinition }) {
    if (!value) {
        if (property.htmlIfEmpty) {
            return <div dangerouslySetInnerHTML={{ __html: property.htmlIfEmpty }} />;
        }
        // Hiển thị placeholder đẹp thay vì null
        return (
            <ImagePlaceholder
                style={{ width: 80, height: 80 }}
            />
        );
    }

    return (
        <ImageWithFallback
            src={value?.includes('http') || value?.includes('data:image') ? value : getFileLink(value)}
            preview={true}
            style={{ maxWidth: 200, maxHeight: 200, objectFit: 'cover', borderRadius: 6 }}
        />
    );
}


// Xuất component cũ để backward compatibility (deprecated)
function UploadImageEdit_Legacy(props: any) {
    console.warn('UploadImageEdit (default export) is deprecated. Use UploadImageEdit instead.');
    return <UploadImageEdit {...props} />;
}

// Legacy exports (deprecated)
export const UploadImageView_Legacy = UploadImageView;

export default UploadImageEdit_Legacy;
