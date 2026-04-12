import React from 'react';

import { DeleteOutlined, LinkOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons';
import _ from '@/@lodash';
import { Button, Checkbox, Image, Input, List, message, Modal, Space, Spin, Tabs, Tooltip, Upload } from 'antd';
import { getFileLink } from '@/services/storeService';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useDispatch } from 'react-redux';
import type { HeadlessFileUpload } from '@/types/apis';
import { PropDefinition } from '@/types/schemas/PropDefinition';
import { useFileUpload } from './useFileUpload';
import { PdfViewer } from '../common/PdfViewer';

/** Icon inline action: hỗ trợ class Font Awesome (chuỗi) khi không có @fortawesome trong project */
function FaIconWrapper({
    icon,
    style,
    className,
}: {
    icon?: string;
    style?: React.CSSProperties;
    className?: string;
}) {
    if (!icon) return null;
    const cls = [typeof icon === 'string' ? icon : '', className].filter(Boolean).join(' ');
    if (cls.trim()) {
        return <i className={cls.trim()} style={style} aria-hidden />;
    }
    return null;
}

// SVG data URI dùng làm fallback khi ảnh không tải được
const IMAGE_FALLBACK_SVG = `data:image/svg+xml;base64,${btoa('<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><rect width="80" height="80" rx="8" fill="#e8eaf0"/><rect x="4" y="4" width="72" height="72" rx="6" stroke="#b0b8c9" stroke-width="2" stroke-dasharray="5 3" fill="none"/><circle cx="28" cy="30" r="7" fill="#b0b8c9"/><path d="M8 60 L26 38 L40 52 L52 40 L72 60 Z" fill="#c4cad6"/></svg>')}`;

// Kiểm tra xem file có phải là ảnh không dựa trên tên hoặc URL
const isImageFile = (item: HeadlessFileUpload) => {
    if (item == null) return false;
    // Nếu file đã được đánh dấu là ảnh từ việc nhập URL
    if (item.file_type === 'image') return true;

    // Kiểm tra theo phần mở rộng trong tên file
    const imgPattern = new RegExp(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i);
    return item.name && imgPattern.test(item.name);
};

// Xác định loại file dựa trên tên file
const getFileType = (fileName: string) => {
    if (!fileName) return 'unknown';

    const extension = fileName.split('.').pop()?.toLowerCase();

    // Các định dạng ảnh phổ biến
    if (/^(jpg|jpeg|png|gif|webp|bmp|svg)$/.test(extension || '')) {
        return 'image';
    }

    // Các định dạng văn bản
    if (extension === 'pdf') {
        return 'pdf';
    }
    if (/^(txt|doc|docx|rtf|odt)$/.test(extension || '')) {
        return 'document';
    }

    // Các định dạng bảng tính
    if (/^(xls|xlsx|csv|ods)$/.test(extension || '')) {
        return 'spreadsheet';
    }

    // Các định dạng trình chiếu
    if (/^(ppt|pptx|odp)$/.test(extension || '')) {
        return 'presentation';
    }

    // Các định dạng nén
    if (/^(zip|rar|7z|tar|gz)$/.test(extension || '')) {
        return 'archive';
    }

    // Các định dạng âm thanh
    if (/^(mp3|wav|ogg|flac|aac)$/.test(extension || '')) {
        return 'audio';
    }

    // Các định dạng video
    if (/^(mp4|avi|mov|wmv|flv|mkv)$/.test(extension || '')) {
        return 'video';
    }

    // Các định dạng mã nguồn
    if (/^(js|jsx|ts|tsx|html|css|php|py|java|c|cpp|cs|go|rb)$/.test(extension || '')) {
        return 'code';
    }

    return 'other';
};

// Kiểm tra xem URL có phải là ảnh hay không
const isImageUrl = (url: string) => {
    // Kiểm tra phần mở rộng của URL
    const imgExtPattern = new RegExp(/(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i);
    if (imgExtPattern.test(url)) return true;

    // Kiểm tra nếu URL có chứa các chuỗi thường có trong URL ảnh
    const imgHostPattern = new RegExp(/(imgur|flickr|\.jpg|\.jpeg|\.png|\.gif|\.webp)/i);
    return imgHostPattern.test(url);
};

interface FileItem {
    name: string;
    url?: string;
    file_id?: string;
    file_type?: string;
    [key: string]: any;
}

interface UrlInput {
    value: string;
}

// Edit component props
export type UploadFilesEditProps = {
    schemaName?: string;
    fileSizeLimit?: number;
    value?: HeadlessFileUpload[];
    onChange?: (value: HeadlessFileUpload[]) => void;
    property?: PropDefinition;
    disabled?: boolean;
};

/** Ref handle để mở modal từ bên ngoài (vd: chatbox 1 bước) */
export interface IUploadFilesEditRef {
    showModal: () => void;
}

/**
 * UploadFiles Edit Component - Dùng cho form editing
 * Hỗ trợ ref.showModal() để mở modal trực tiếp (tránh dialog trung gian)
 */
export const UploadFilesEdit = forwardRef(function UploadFilesEdit(
    {
        value,
        onChange,
        property,
        schemaName,
        fileSizeLimit = 50, // Improved default to 50MB since videos are common now

        disabled = false,
    }: UploadFilesEditProps,
    ref: React.Ref<IUploadFilesEditRef>
) {

    // Sử dụng upload hook để có Authorization và standardized logic
    const { getUploadConfig, parseUploadResponse, searchFiles } = useFileUpload({
        useCustomRequest: true,
        onSuccess: (standardResponse, file) => {
            const newFile: HeadlessFileUpload = {
                name: file.name,
                url: standardResponse.url,
                file_id: standardResponse.file_id,
                file_path: standardResponse.file_path,
                file_type: standardResponse.file_type || getFileType(file.name),
                size: file.size,
            };
            setFileList(prev => [...prev, newFile]);
            message.success(`${file.name} đã được tải lên thành công.`);
        },
        onError: (error) => {
            message.error('Tải lên thất bại: ' + (error.message || 'Lỗi không xác định'));
        }
    });

    const uploadConfig = getUploadConfig();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fileList, setFileList] = useState<HeadlessFileUpload[]>([]);
    const [urls, setUrls] = useState<UrlInput[]>([{ value: '' }]);
    const [fileRemoved, setFileRemoved] = useState<HeadlessFileUpload[]>([]);

    // States cho tab Gallery
    const [activeTab, setActiveTab] = useState('upload');
    const [libraryFiles, setLibraryFiles] = useState<HeadlessFileUpload[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedLibraryFiles, setSelectedLibraryFiles] = useState<Set<string>>(new Set());

    // Khởi tạo fileList từ value
    useEffect(() => {
        if (value && Array.isArray(value)) {
            setFileList(value);
        } else {
            setFileList([]);
        }
    }, [value]);

    // Mở modal để thêm/sửa file
    const showModal = () => {
        // Đặt lại danh sách file từ value hiện tại
        if (value && Array.isArray(value)) {
            setFileList([...value]);
        } else {
            setFileList([]);
        }

        // Reset các state khác
        setFileRemoved([]);
        setUrls([{ value: '' }]);
        setIsModalOpen(true);
    };

    useImperativeHandle(ref, () => ({ showModal }), []);

    // Đóng modal
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    // Xác nhận thay đổi và đóng modal
    const handleOk = () => {
        const newValue = fileList.filter(file => file !== null);
        onChange && onChange(newValue);
        setIsModalOpen(false);
    };

    // Xử lý khi upload file
    const handleUpload = (info: any) => {
        // useFileUpload handle success/error via callbacks already
    };

    // Thêm trường URL mới
    const handleAddUrl = () => {
        setUrls(prev => [...prev, { value: '' }]);
    };

    // Thay đổi giá trị URL
    const handleUrlChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrls = [...urls];
        newUrls[index].value = e.target.value;
        setUrls(newUrls);
    };

    // Xóa trường URL
    const handleRemoveUrl = (index: number) => {
        if (urls.length > 1) {
            const newUrls = urls.filter((_, i) => i !== index);
            setUrls(newUrls);
        }
    };

    // Lấy tên file từ URL
    const extractFileName = (url: string) => {
        try {
            // Loại bỏ query parameters và fragment
            const cleanUrl = url.split('?')[0].split('#')[0];

            // Lấy phần cuối cùng của URL
            let fileName = cleanUrl.split('/').pop() || '';

            // Nếu không có phần mở rộng, thêm dựa trên heuristics
            if (!fileName.includes('.')) {
                if (isImageUrl(url)) {
                    fileName += '.jpg'; // Mặc định cho ảnh
                } else {
                    fileName += '.file'; // Mặc định cho file khác
                }
            }

            return fileName || 'unnamed_file';
        } catch (error) {
            return 'unnamed_file';
        }
    };

    // Xử lý thêm file từ URL
    const handleUrlSubmit = () => {
        const validUrls = urls.filter(url => url.value.trim() !== '');

        if (validUrls.length === 0) {
            message.warning('Vui lòng nhập ít nhất một URL hợp lệ.');
            return;
        }

        const newFiles: FileItem[] = validUrls.map(url => {
            const fileName = extractFileName(url.value);
            return {
                name: fileName,
                url: url.value,
                file_type: isImageUrl(url.value) ? 'image' : getFileType(fileName)
            };
        });

        setFileList(prev => [...prev, ...newFiles]);
        setUrls([{ value: '' }]); // Reset về một trường trống
        message.success(`Đã thêm ${newFiles.length} file từ URL.`);
    };

    // Hàm load files từ thư viện
    const loadLibraryFiles = async (searchTerm?: string) => {
        try {
            setLibraryLoading(true);
            const files = await searchFiles({
                path: (property as PropDefinition | undefined)?.fileUploadOption?.folder as string | undefined,
                text: searchTerm || undefined
            });
            setLibraryFiles(files);
        } catch (error) {
            console.error('Error loading library files:', error);
            message.error('Không thể tải danh sách file từ thư viện');
        } finally {
            setLibraryLoading(false);
        }
    };

    // Hàm search files trong thư viện
    const handleLibrarySearch = () => {
        loadLibraryFiles(searchText);
    };

    // Hàm toggle chọn file từ thư viện
    const handleToggleLibraryFile = (file: HeadlessFileUpload) => {
        const fileKey = file.file_path || file.file_id || file.url || '';
        const newSelected = new Set(selectedLibraryFiles);

        if (newSelected.has(fileKey)) {
            newSelected.delete(fileKey);
        } else {
            newSelected.add(fileKey);
        }

        setSelectedLibraryFiles(newSelected);
    };

    // Hàm thêm files đã chọn từ thư viện
    const handleAddSelectedLibraryFiles = () => {
        const filesToAdd: HeadlessFileUpload[] = libraryFiles
            .filter(file => {
                const fileKey = file.file_path || file.file_id || file.url || '';
                return selectedLibraryFiles.has(fileKey);
            });

        if (filesToAdd.length > 0) {
            setFileList(prev => [...prev, ...filesToAdd]);
            setSelectedLibraryFiles(new Set());
            message.success(`Đã thêm ${filesToAdd.length} file từ thư viện.`);
        } else {
            message.warning('Vui lòng chọn ít nhất một file.');
        }
    };

    // Load files thư viện khi mở tab lần đầu
    useEffect(() => {
        if (isModalOpen && activeTab === 'gallery' && libraryFiles.length === 0) {
            loadLibraryFiles();
        }
    }, [isModalOpen, activeTab]);

    // Reset selected files khi chuyển tab
    const handleTabChange = (newActiveTab: string) => {
        if (newActiveTab !== 'gallery') {
            setSelectedLibraryFiles(new Set());
        }
        setActiveTab(newActiveTab);
    };

    // Xóa file khỏi danh sách
    const handleRemoveFile = (index: number) => {
        const removedFile = fileList[index];
        if (removedFile) {
            setFileRemoved(prev => [...prev, removedFile]);
        }

        const newFileList = fileList.filter((_, i) => i !== index);
        setFileList(newFileList);
    };

    if (property && String(property.editor) === "Hidden") {
        return null;
    }

    return (
        <div>
            <Button
                type="dashed"
                onClick={showModal}
                icon={<UploadOutlined />}
                className="w-full"
                disabled={disabled}
            >
                {fileList.length > 0 ? `Quản lý files (${fileList.length})` : 'Tải lên files'}
            </Button>

            {/* Hiển thị preview files đã chọn */}
            {fileList.length > 0 && (
                <div className="mt-2">
                    <UploadFilesView value={fileList} property={(property as any)} />
                </div>
            )}

            <Modal
                title="Quản lý Files"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                width={600}
                zIndex={1400}
                className="upload-files-modal"
            >
                <div>
                    {/* Hiển thị danh sách file hiện tại */}
                    {fileList.length > 0 && (
                        <div className="mb-4">
                            <h3>Files đã chọn ({fileList.length})</h3>
                            <List
                                dataSource={fileList}
                                renderItem={(file, index) => (
                                    <List.Item
                                        actions={[
                                            <Button
                                                danger
                                                size="small"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveFile(index)}
                                            >
                                                Xóa
                                            </Button>
                                        ]}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                isImageFile(file) ? (
                                                    <Image
                                                        src={getFileLink(file.file_id || file.url)}
                                                        width={40}
                                                        height={40}
                                                        style={{ objectFit: 'cover' }}
                                                        alt={file.name}
                                                    />
                                                ) : (
                                                    <FileIcon fileName={file.name || 'Unknown file'} />
                                                )
                                            }
                                            title={file.name}
                                            description={file.url ? 'Từ URL' : 'Đã tải lên'}
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    )}

                    <Tabs
                        activeKey={activeTab}
                        onChange={handleTabChange}
                        items={[
                            {
                                key: 'upload',
                                label: 'Upload',
                                children: (
                                    <div className="pt-4">
                                        <Upload
                                            name="file"
                                            customRequest={uploadConfig.customRequest}
                                            showUploadList={false}
                                            multiple
                                            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.mov,.mp4"
                                            beforeUpload={(file) => {
                                                // Kiểm tra kích thước file
                                                const isLtLimit = file.size / 1024 / 1024 < fileSizeLimit;
                                                if (!isLtLimit) {
                                                    message.error(`File "${file.name}" quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Tối đa là ${fileSizeLimit}MB!`);
                                                    return Upload.LIST_IGNORE; // Better than returning false for multiple uploads
                                                }
                                                return true;
                                            }}
                                        >
                                            <Button icon={<UploadOutlined />} style={{ height: 100, width: '100%', border: '2px dashed #d9d9d9' }}>
                                                <div>
                                                    <PlusOutlined style={{ fontSize: 24 }} />
                                                    <div style={{ marginTop: 8 }}>Click hoặc kéo thả để tải lên (Tối đa {fileSizeLimit}MB)</div>
                                                </div>
                                            </Button>
                                        </Upload>
                                    </div>
                                )
                            },
                            {
                                key: 'gallery',
                                label: 'Gallery',
                                children: (
                                    <Space direction="vertical" className="pt-4 w-full">
                                        {/* Search bar */}
                                        <Space.Compact style={{ width: '100%' }}>
                                            <Input
                                                placeholder="Tìm kiếm file..."
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

                                        {/* Files grid */}
                                        <div className="mt-4" style={{ minHeight: '200px', maxHeight: '400px' }}>
                                            {libraryLoading ? (
                                                <div className="text-center py-8">
                                                    <Spin size="large" />
                                                    <div className="mt-2">Đang tải file...</div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div
                                                        style={{
                                                            display: 'grid',
                                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                                            gap: '8px',
                                                            maxHeight: '320px',
                                                            overflowY: 'auto'
                                                        }}
                                                    >
                                                        {libraryFiles.map((file, index) => {
                                                            const fileKey = file.file_path || file.file_id || file.url || '';
                                                            const isSelected = selectedLibraryFiles.has(fileKey);

                                                            return (
                                                                <div
                                                                    key={file.file_id || index}
                                                                    style={{
                                                                        position: 'relative',
                                                                        cursor: 'pointer',
                                                                        border: isSelected ? '2px solid #1890ff' : '2px solid #d9d9d9',
                                                                        borderRadius: '8px',
                                                                        overflow: 'hidden',
                                                                        height: '80px',
                                                                        backgroundColor: isSelected ? '#e6f7ff' : 'transparent',
                                                                        transition: 'all 0.2s ease'
                                                                    }}
                                                                    onClick={() => handleToggleLibraryFile(file)}
                                                                    onMouseEnter={(e) => {
                                                                        if (!isSelected) {
                                                                            e.currentTarget.style.borderColor = '#40a9ff';
                                                                        }
                                                                    }}
                                                                    onMouseLeave={(e) => {
                                                                        if (!isSelected) {
                                                                            e.currentTarget.style.borderColor = '#d9d9d9';
                                                                        }
                                                                    }}
                                                                >
                                                                    {/* Checkbox overlay */}
                                                                    <div style={{ position: 'absolute', top: '4px', left: '4px', zIndex: 10 }}>
                                                                        <Checkbox
                                                                            checked={isSelected}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleToggleLibraryFile(file);
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    {/* Preview button */}
                                                                    {isImageFile(file) && (
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
                                                                                    const imageUrl = file.file_path?.includes('http') || file.file_path?.includes('https') || file.file_path?.includes('data:image')
                                                                                        ? file.file_path
                                                                                        : getFileLink(file.file_path || file.file_id || '');

                                                                                    Modal.info({
                                                                                        title: file.name || 'Preview',
                                                                                        content: (
                                                                                            <div style={{ textAlign: 'center' }}>
                                                                                                <Image
                                                                                                    src={imageUrl}
                                                                                                    alt={file.name || 'Preview'}
                                                                                                    style={{ maxWidth: '100%', maxHeight: '400px' }}
                                                                                                    fallback={IMAGE_FALLBACK_SVG}
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
                                                                    )}

                                                                    {/* File content */}
                                                                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        {isImageFile(file) ? (
                                                                            <Image
                                                                                src={
                                                                                    file.file_path?.includes('http') || file.file_path?.includes('https') || file.file_path?.includes('data:image')
                                                                                        ? file.file_path
                                                                                        : getFileLink(file.file_path || file.file_id || '')
                                                                                }
                                                                                alt={file.name || 'Library file'}
                                                                                style={{
                                                                                    width: '100%',
                                                                                    height: '100%',
                                                                                    objectFit: 'cover'
                                                                                }}
                                                                                preview={false}
                                                                                fallback={IMAGE_FALLBACK_SVG}
                                                                            />
                                                                        ) : (
                                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '4px' }}>
                                                                                <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                                                                                    <FileIcon fileName={file.name || ''} />
                                                                                </div>
                                                                                <Tooltip title={file.name || 'File không có tên'}>
                                                                                    <div style={{ fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                                                                        {file.name || 'Unnamed'}
                                                                                    </div>
                                                                                </Tooltip>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Selection indicator */}
                                                                    {isSelected && (
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
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {selectedLibraryFiles.size > 0 && (
                                                        <div style={{ marginTop: '16px', textAlign: 'center' }}>
                                                            <Button
                                                                type="primary"
                                                                onClick={handleAddSelectedLibraryFiles}
                                                                disabled={selectedLibraryFiles.size === 0}
                                                            >
                                                                Thêm {selectedLibraryFiles.size} file đã chọn
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            )}

                                            {!libraryLoading && libraryFiles.length === 0 && (
                                                <div style={{ textAlign: 'center', padding: '32px 0', color: '#999' }}>
                                                    Không tìm thấy file nào trong thư viện
                                                </div>
                                            )}
                                        </div>
                                    </Space>
                                )
                            },
                            {
                                key: 'url',
                                label: 'URL',
                                children: (
                                    <div className="pt-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3>Thêm file từ URL</h3>
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={handleAddUrl}
                                            >
                                                Thêm URL
                                            </Button>
                                        </div>

                                        {urls.map((url, index) => (
                                            <div key={index} className="flex mb-2 w-full">
                                                <Input
                                                    placeholder="Nhập URL file (https://example.com/image.jpg)"
                                                    value={url.value}
                                                    onChange={(e) => handleUrlChange(index, e)}
                                                    onPressEnter={handleUrlSubmit}
                                                    className="flex-grow"
                                                    addonBefore="URL:"
                                                    size="middle"
                                                    allowClear
                                                />
                                                {urls.length > 1 && (
                                                    <Button
                                                        icon={<DeleteOutlined />}
                                                        onClick={() => handleRemoveUrl(index)}
                                                        danger
                                                        className="ml-2"
                                                    />
                                                )}
                                            </div>
                                        ))}

                                        <Button
                                            type="primary"
                                            icon={<LinkOutlined />}
                                            onClick={handleUrlSubmit}
                                            className="mt-2 w-full"
                                        >
                                            Thêm URL vào danh sách
                                        </Button>
                                    </div>
                                )
                            }
                        ]}
                        destroyOnHidden={false}
                        className="upload-files-tabs"
                    />
                </div>
            </Modal>
        </div>
    );
});

/**
 * UploadFiles View Component - Dùng cho hiển thị readonly (đã loại bỏ QuickEdit logic)
 */
export function UploadFilesView({ value, property }: { value: any, property: PropDefinition }) {

    // State cho preview modal
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [previewFile, setPreviewFile] = useState<any>(null);

    // Phân chia file thành 2 loại: ảnh và file thông thường (bỏ qua phần tử null/undefined)
    const getImageAndNormalFiles = () => {
        if (!value || !Array.isArray(value) || value.length === 0) {
            return { imageFiles: [], normalFiles: [] };
        }
        const validFiles = value.filter((file: any) => file != null);
        const imageFiles = validFiles.filter((file: any) => isImageFile(file));
        const normalFiles = validFiles.filter((file: any) => !isImageFile(file));

        return { imageFiles, normalFiles };
    };

    const { imageFiles, normalFiles } = getImageAndNormalFiles();
    // Xử lý preview file
    const handlePreview = (file: any) => {
        setPreviewFile(file);
        setPreviewModalOpen(true);
    };

    // Xử lý download file - chỉ khi user muốn download
    const handleDownload = (file: any) => {
        const url = file.url || getFileLink(file.file_id);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name || 'download';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!value || !Array.isArray(value) || value.length === 0) {
        return property.htmlIfEmpty ? (
            <div dangerouslySetInnerHTML={{ __html: property.htmlIfEmpty }} />
        ) : null;
    }

    // Xử lý sự kiện action
    const handleAction = (action: any, file: any) => {
        //todo
    };

    // Render action buttons
    const renderActions = (file: any) => {
        if (!property?.inline_actions?.length) return null;

        return (
            <Space className='ml-2'>
                {property.inline_actions.map((action: any, index: number) => (
                    <Tooltip key={index} title={action.name}>
                        <Button
                            size='small'
                            className={action.className}
                            style={_.getStyleObjectFromString(action.style)}
                            onClick={() => handleAction(action, file)}
                        >
                            <FaIconWrapper
                                icon={action.faIcon}
                                style={action.style}
                                className={action.className}
                            />
                        </Button>
                    </Tooltip>
                ))}
            </Space>
        );
    };

    return (
        <div className="mt-2">
            {/* Hiển thị ảnh dạng grid */}
            {imageFiles.length > 0 && (
                <div className="mb-3">
                    <div className="flex flex-wrap gap-2">
                        {imageFiles.map((file: any, index: number) => (
                            <div key={index} className="relative group">
                                <Tooltip title={`Click để preview: ${file.name}`}>
                                    <div
                                        onClick={() => handlePreview(file)}
                                        className="cursor-pointer"
                                    >
                                        <Image
                                            preview={false}
                                            src={getFileLink(file.file_id || file.url)}
                                            width={80}
                                            height={80}
                                            style={{ objectFit: 'cover' }}
                                            alt={file.name}
                                            fallback={IMAGE_FALLBACK_SVG}
                                        />
                                    </div>
                                </Tooltip>
                                {property?.inline_actions && property?.inline_actions?.length > 0 && (
                                    <div className="absolute top-0 right-0">
                                        {renderActions(file)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Hiển thị file thông thường dạng list */}
            {normalFiles.length > 0 && (
                <div className="mt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {normalFiles.map((file: any, index: number) => (
                            <div 
                                key={index} 
                                onClick={() => handlePreview(file)}
                                className="flex items-center p-3 border border-gray-100 rounded-xl bg-gray-50/50 hover:bg-white hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="mr-3 transform group-hover:scale-110 transition-transform">
                                    <FileIcon fileName={file.name || ''} size="small" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-700 truncate group-hover:text-blue-600 transition-colors" title={file.name}>
                                        {file.name || `file ${index}`}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        {file.size ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Tài liệu'}
                                    </div>
                                </div>
                                {property?.inline_actions && property?.inline_actions?.length > 0 && (
                                    <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {renderActions(file)}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal Preview */}
            <Modal
                title={previewFile?.name || 'File Preview'}
                open={previewModalOpen}
                onCancel={() => setPreviewModalOpen(false)}
                width={getFileType(previewFile?.name) === 'pdf' ? '100vw' : 800}
                zIndex={1410}
                style={getFileType(previewFile?.name) === 'pdf' ? { 
                    top: 0, 
                    margin: 0, 
                    maxWidth: '100vw', 
                    padding: 0,
                    height: '100dvh' 
                } : undefined}
                styles={{
                    content: getFileType(previewFile?.name) === 'pdf' ? {
                        height: '100dvh',
                        display: 'flex',
                        flexDirection: 'column',
                        padding: 0,
                        borderRadius: 0,
                        overflow: 'hidden',
                    } : {},
                    header: getFileType(previewFile?.name) === 'pdf' ? {
                        padding: '12px 16px',
                        marginBottom: 0,
                        borderBottom: '1px solid #f0f0f0',
                        flexShrink: 0,
                    } : {},
                    body: getFileType(previewFile?.name) === 'pdf' ? {
                        flex: 1,
                        padding: 0,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                    } : { padding: '16px 24px' },
                }}
                footer={getFileType(previewFile?.name) === 'pdf' ? null : [
                    <Button key="download" onClick={() => handleDownload(previewFile)}>
                        Tải xuống
                    </Button>,
                    <Button key="close" type="primary" onClick={() => setPreviewModalOpen(false)}>
                        Đóng
                    </Button>
                ]}
            >
                {previewFile && (
                    <div style={getFileType(previewFile?.name) === 'pdf' ? {
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 0,
                        height: '100%',
                    } : { textAlign: 'center' }}>
                        {isImageFile(previewFile) ? (
                            <Image
                                src={getFileLink(previewFile.file_id || previewFile.url)}
                                alt={previewFile.name}
                                style={{ maxWidth: '100%', maxHeight: '500px' }}
                                fallback={IMAGE_FALLBACK_SVG}
                            />
                        ) : getFileType(previewFile.name) === 'video' ? (
                            <video 
                                controls 
                                autoPlay 
                                style={{ maxWidth: '100%', maxHeight: '500px', backgroundColor: '#000' }}
                                src={getFileLink(previewFile.file_id || previewFile.url)}
                            >
                                Your browser does not support the video tag.
                            </video>
                        ) : getFileType(previewFile.name) === 'pdf' ? (
                            <div style={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                minHeight: 0,
                                height: '100%',
                                overflow: 'hidden',
                            }}>
                                <PdfViewer 
                                    url={getFileLink(previewFile.file_id || previewFile.url) || ''} 
                                    title={previewFile.name} 
                                    height="100%" 
                                />
                            </div>
                        ) : (
                            <div className="p-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                                <div className="text-7xl mb-6">
                                    <FileIcon fileName={previewFile.name} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{previewFile.name}</h3>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    Loại file này không hỗ trợ xem trực tiếp trên trình duyệt. 
                                    Vui lòng nhấn <strong>"Tải xuống"</strong> để xem nội dung.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </div>
    );
}

// Helper component để hiển thị icon cho các loại file khác nhau
const FileIcon = ({ fileName, size = 'large' }: { fileName: string, size?: 'small' | 'large' }) => {
    const getFileExtension = (name: string) => {
        return name.split('.').pop()?.toLowerCase();
    };

    const extension = getFileExtension(fileName);
    const isSmall = size === 'small';

    const iconStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: isSmall ? '6px' : '12px',
        fontWeight: 'bold',
        fontSize: isSmall ? '10px' : '20px',
        color: '#fff',
        width: isSmall ? '32px' : '80px',
        height: isSmall ? '32px' : '80px',
        boxShadow: isSmall ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
        textTransform: 'uppercase'
    };

    // Hiển thị icon tùy theo loại file
    switch (extension) {
        case 'pdf':
            return <span style={{ ...iconStyle, backgroundColor: '#ff4d4f' }}>PDF</span>;
        case 'doc':
        case 'docx':
            return <span style={{ ...iconStyle, backgroundColor: '#1890ff' }}>DOC</span>;
        case 'xls':
        case 'xlsx':
            return <span style={{ ...iconStyle, backgroundColor: '#52c41a' }}>XLS</span>;
        case 'zip':
        case 'rar':
        case '7z':
            return <span style={{ ...iconStyle, backgroundColor: '#faad14' }}>ZIP</span>;
        case 'ppt':
        case 'pptx':
            return <span style={{ ...iconStyle, backgroundColor: '#fa541c' }}>PPT</span>;
        default:
            return <span style={{ ...iconStyle, backgroundColor: '#bfbfbf' }}>FILE</span>;
    }
};

// Giữ lại alias cũ để các call-site dùng UploadFiles tiếp tục hoạt động
export const UploadFiles = UploadFilesEdit;
