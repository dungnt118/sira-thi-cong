import { gql } from '@apollo/client';
import { Avatar, Empty, Popover, Select, Space, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { queryList } from '../../services/graphqlService';
import { getFileLink } from '../../services/storeService';
import type { ApiListResponse } from '../../types/apis/ApiResponse';
import type { AuthorizationPolicy } from '../../types/auth/AuthorizationPolicy';
import type { PropDefinition } from '../../types/schemas/PropDefinition';
import './AuthorizedUser.css';

// Local stubs for missing types
export interface BasePropTypeInput {
    value?: any;
    onChange?: (value: any) => void;
    onBlur?: any;
    property?: any;
    att?: any;
    form?: any;
    disabled?: boolean;
    size?: 'small' | 'middle' | 'large' | 'default' | any;
    className?: string;
    style?: React.CSSProperties;
    placeholder?: string;
    isFilter?: boolean;
    schemaName?: string;
    isEdit?: boolean;
    isQuickEdit?: boolean;
}

export interface PropTypeReadonly {
    value?: any;
    property?: any;
    att?: any;
    isEdit?: boolean;
    isQuickEdit?: boolean;
    onBlur?: any;
    schemaName?: string;
}

export interface PropTypeFilter {
    value?: any;
    onChange?: (value: any) => void;
    property?: any;
    att?: any;
    isFilter?: boolean;
    form?: any;
    placeholder?: any;
    size?: any;
}



const SEARCH_BASIC_USER_INFO = gql`
    query SearchBasicUserInfo($keyword: String, $subjectSchemas: [String], $policies: [AuthorizationPolicy], $limit: Int) {
        response: search_basic_user_info(
            keyword: $keyword
            subjectSchemas: $subjectSchemas
            policies: $policies
            limit: $limit
        ) {
            code
            message
            records
            data
        }
    }
`;

const LOAD_BASIC_USER_INFO_BY_USERNAMES = gql`
    query LoadBasicUserInfoByUsernames($usernames: [String]) {
        response: load_basic_user_info_by_usernames(usernames: $usernames) {
            code
            message
            records
            data
        }
    }
`;

type UnknownRecord = Record<string, unknown>;
type AuthorizedUserSearchOptionSource = {
    authorizedUserOption?: {
        subjectSchemas?: string[] | null;
        policies?: (AuthorizationPolicy | string)[] | null;
        subjectSchema?: string | null;
        policy?: AuthorizationPolicy | string | null;
    } | null;
} | null | undefined;

interface AuthorizedUserSearchConfig {
    subjectSchemas?: string[];
    policies?: AuthorizationPolicy[];
}

export interface BasicAuthorizedUserInfo {
    username: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    avatar?: string;
    isActive?: boolean;
    [key: string]: unknown;
}

type AuthorizedUserSelectProps = BasePropTypeInput & {
    allowMultiple?: boolean;
    placeholder?: string;
};

type AuthorizedUserBaseViewProps = BasePropTypeInput & PropTypeReadonly;

export type LinkedAuthorizedUserViewProps = AuthorizedUserBaseViewProps;
export type AuthorizedUserEditProps = AuthorizedUserSelectProps;
export type AuthorizedUserViewProps = AuthorizedUserBaseViewProps;
export type AuthorizedUserFilterProps = PropTypeFilter & {
    allowMultiple?: boolean;
};
export type AuthorizedUsersEditProps = AuthorizedUserSelectProps;
export type AuthorizedUsersViewProps = AuthorizedUserBaseViewProps;
export type AuthorizedUsersFilterProps = PropTypeFilter;

const { Text } = Typography;
const DEFAULT_AUTHORIZED_USER_POLICIES: AuthorizationPolicy[] = ['staff', 'admin', 'root'];

const toRecord = (value: unknown): UnknownRecord => (
    value && typeof value === 'object' ? (value as UnknownRecord) : {}
);

const toTrimmedString = (value: unknown): string | null => {
    if (value === null || value === undefined) {
        return null;
    }

    const nextValue = String(value).trim();
    return nextValue.length > 0 ? nextValue : null;
};

const firstNonEmptyString = (candidates: unknown[]): string | null => {
    for (const candidate of candidates) {
        const value = toTrimmedString(candidate);
        if (value) {
            return value;
        }
    }

    return null;
};

const normalizeStringList = (value: unknown): string[] | undefined => {
    const sourceValues = Array.isArray(value)
        ? value
        : value === null || value === undefined
            ? []
            : [value];
    const normalizedValues = Array.from(
        new Set(
            sourceValues
                .map((item) => toTrimmedString(item))
                .filter((item): item is string => Boolean(item))
        )
    ).sort((left, right) => left.localeCompare(right));

    return normalizedValues.length > 0 ? normalizedValues : undefined;
};

const normalizePolicyList = (value: unknown): AuthorizationPolicy[] | undefined => {
    const normalizedValues = normalizeStringList(value);
    return normalizedValues ? normalizedValues.map((item) => item as AuthorizationPolicy) : undefined;
};

const buildAuthorizedUserSearchKey = (values?: readonly string[]): string => (
    values && values.length > 0 ? JSON.stringify(values) : ''
);

const parseAuthorizedUserSearchKey = <T extends string>(value: string): T[] | undefined => {
    if (!value) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed)
            ? parsed.filter((item): item is T => typeof item === 'string')
            : undefined;
    } catch {
        return undefined;
    }
};

const resolveAuthorizedUserSearchConfig = (source: AuthorizedUserSearchOptionSource): AuthorizedUserSearchConfig => {
    const subjectSchemas = normalizeStringList(source?.authorizedUserOption?.subjectSchemas)
        ?? normalizeStringList(source?.authorizedUserOption?.subjectSchema);
    const policies = normalizePolicyList(source?.authorizedUserOption?.policies)
        ?? normalizePolicyList(source?.authorizedUserOption?.policy);

    return {
        subjectSchemas,
        policies
    };
};

const toBooleanOrUndefined = (value: unknown): boolean | undefined => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (value === null || value === undefined) {
        return undefined;
    }

    const normalized = String(value).trim().toLowerCase();
    if (['true', '1', 'yes'].includes(normalized)) {
        return true;
    }
    if (['false', '0', 'no'].includes(normalized)) {
        return false;
    }

    return undefined;
};

const parseGraphQLList = (raw: unknown): unknown[] => {
    if (!raw) {
        return [];
    }

    if (Array.isArray(raw)) {
        return raw;
    }

    if (typeof raw === 'string') {
        try {
            return parseGraphQLList(JSON.parse(raw));
        } catch {
            return [];
        }
    }

    if (typeof raw === 'object') {
        const source = raw as UnknownRecord;

        if (Array.isArray(source.data)) {
            return parseGraphQLList(source.data);
        }

        if (typeof source.data === 'string') {
            return parseGraphQLList(source.data);
        }
    }

    return [];
};

const toBasicAuthorizedUserInfo = (raw: unknown): BasicAuthorizedUserInfo | null => {
    const source = toRecord(raw);
    const username = firstNonEmptyString([
        source.username,
        source.userName,
        source.code,
        source._id,
        source.id
    ]);

    if (!username) {
        return null;
    }

    return {
        ...source,
        username,
        fullName: firstNonEmptyString([
            source.fullName,
            source.name,
            source.displayName,
            source.label
        ]) ?? username,
        email: firstNonEmptyString([source.email]) ?? undefined,
        phoneNumber: firstNonEmptyString([source.phoneNumber, source.phone]) ?? undefined,
        avatar: firstNonEmptyString([
            source.avatar,
            source.avatarId,
            source.avatarUrl,
            source.picture
        ]) ?? undefined,
        isActive: toBooleanOrUndefined(source.isActive)
    };
};

const dedupeUsers = (users: BasicAuthorizedUserInfo[]): BasicAuthorizedUserInfo[] => {
    const userMap = new Map<string, BasicAuthorizedUserInfo>();

    users.forEach((user) => {
        if (!user || !user.username) {
            return;
        }

        const existing = userMap.get(user.username);
        if (existing) {
            // Check if existing data is "skeleton" (only username/fullName=username and no email/avatar)
            const isExistingSkeleton = !existing.email && !existing.avatar && (!existing.fullName || existing.fullName === existing.username);
            const isNewSkeleton = !user.email && !user.avatar && (!user.fullName || user.fullName === user.username);

            if (isExistingSkeleton && !isNewSkeleton) {
                // Incoming is richer data, overwrite skeleton
                userMap.set(user.username, { ...existing, ...user });
            } else if (!isExistingSkeleton && isNewSkeleton) {
                // Existing is richer, keep existing rich fields but merge incoming (preserve existing)
                userMap.set(user.username, { ...user, ...existing });
            } else {
                // Both same type or both rich, take latest but merge
                userMap.set(user.username, { ...existing, ...user });
            }
        } else {
            userMap.set(user.username, user);
        }
    });

    return Array.from(userMap.values());
};

const normalizeAuthorizedUserList = (raw: unknown): BasicAuthorizedUserInfo[] => (
    dedupeUsers(
        parseGraphQLList(raw)
            .map((item) => toBasicAuthorizedUserInfo(item))
            .filter((item): item is BasicAuthorizedUserInfo => Boolean(item))
    )
);

const normalizeInlineUsers = (rawValue: unknown): BasicAuthorizedUserInfo[] => {
    if (Array.isArray(rawValue)) {
        return dedupeUsers(
            rawValue
                .map((item) => toBasicAuthorizedUserInfo(item))
                .filter((item): item is BasicAuthorizedUserInfo => Boolean(item))
        );
    }

    const user = toBasicAuthorizedUserInfo(rawValue);
    return user ? [user] : [];
};

const normalizeUsernameList = (rawValue: unknown): string[] => {
    const usernames = Array.isArray(rawValue) ? rawValue : [rawValue];
    const values = usernames.flatMap((item) => {
        const normalizedUser = toBasicAuthorizedUserInfo(item);
        if (normalizedUser?.username) {
            return [normalizedUser.username];
        }

        const stringValue = toTrimmedString(item);
        return stringValue ? [stringValue] : [];
    });

    return Array.from(new Set(values));
};

const sortUsersByUsernameOrder = (
    users: BasicAuthorizedUserInfo[],
    usernames: string[]
): BasicAuthorizedUserInfo[] => {
    if (usernames.length === 0) {
        return dedupeUsers(users);
    }

    const userMap = new Map(users.map((user) => [user.username, user]));

    return usernames.map((username) => (
        userMap.get(username) ?? {
            username,
            fullName: username
        }
    ));
};

const getDisplayName = (user?: BasicAuthorizedUserInfo | null): string => (
    user?.fullName || user?.username || ''
);

const getUserInitials = (fullName?: string | null, username?: string | null): string => {
    const source = toTrimmedString(fullName) ?? toTrimmedString(username) ?? '?';
    const parts = source.split(/\s+/).filter(Boolean);

    if (parts.length > 1) {
        return parts
            .slice(0, 3)
            .map((part) => part.charAt(0))
            .join('')
            .toUpperCase();
    }

    return source.substring(0, Math.min(3, source.length)).toUpperCase();
};

const resolveAvatarSrc = (avatar?: string | null): string | undefined => {
    const avatarValue = toTrimmedString(avatar);
    if (!avatarValue) {
        return undefined;
    }

    if (/^(https?:)?\/\//i.test(avatarValue) || avatarValue.startsWith('data:image')) {
        return avatarValue;
    }

    return getFileLink(avatarValue);
};

const mergeUsers = (
    currentUsers: BasicAuthorizedUserInfo[],
    incomingUsers: BasicAuthorizedUserInfo[]
): BasicAuthorizedUserInfo[] => dedupeUsers([...currentUsers, ...incomingUsers]);

const renderEmptyState = (property?: PropDefinition) => {
    if (property?.htmlIfEmpty) {
        return <span dangerouslySetInnerHTML={{ __html: property.htmlIfEmpty }} />;
    }

    return <Text type="secondary">-</Text>;
};

const wrapReadonlyContent = (content: React.ReactNode, isEdit?: boolean) => {
    if (!isEdit) {
        return content;
    }

    return (
        <div
            style={{
                background: '#eee',
                border: '1px solid #ccc',
                borderRadius: 5,
                minHeight: 40
            }}
        >
            <div style={{ padding: 8 }}>
                {content}
            </div>
        </div>
    );
};

async function searchBasicAuthorizedUsers(
    keyword: string,
    limit = 20,
    searchConfig?: AuthorizedUserSearchConfig
): Promise<BasicAuthorizedUserInfo[]> {
    const resolvedPolicies = searchConfig?.policies?.length
        ? searchConfig.policies
        : DEFAULT_AUTHORIZED_USER_POLICIES;

    const response = await queryList<BasicAuthorizedUserInfo>(SEARCH_BASIC_USER_INFO, {
        keyword,
        subjectSchemas: searchConfig?.subjectSchemas,
        policies: resolvedPolicies,
        limit
    });

    return normalizeAuthorizedUserList((response as ApiListResponse<BasicAuthorizedUserInfo>).data);
}

async function loadBasicAuthorizedUsersByUsernames(usernames: string[]): Promise<BasicAuthorizedUserInfo[]> {
    if (usernames.length === 0) {
        return [];
    }

    const response = await queryList<BasicAuthorizedUserInfo>(LOAD_BASIC_USER_INFO_BY_USERNAMES, {
        usernames
    });

    return normalizeAuthorizedUserList((response as ApiListResponse<BasicAuthorizedUserInfo>).data);
}

function AuthorizedUserAvatar({
    user,
    size = 'default'
}: {
    user: BasicAuthorizedUserInfo;
    size?: number | 'small' | 'default' | 'large';
}) {
    const avatarSrc = resolveAvatarSrc(user.avatar);
    const initials = getUserInitials(user.fullName, user.username);

    return (
        <Avatar size={size} src={avatarSrc} style={{ backgroundColor: avatarSrc ? undefined : '#1677ff' }}>
            {!avatarSrc && initials}
        </Avatar>
    );
}

function AuthorizedUserPopoverContent({ user }: { user: BasicAuthorizedUserInfo }) {
    return (
        <Space direction="vertical" size={8} style={{ maxWidth: 280 }}>
            <Space size={12} align="center">
                <AuthorizedUserAvatar user={user} size="large" />
                <div>
                    <div style={{ fontWeight: 600 }}>{getDisplayName(user)}</div>
                    <Text type="secondary">@{user.username}</Text>
                </div>
            </Space>

            <div>
                <div><strong>Email:</strong> {user.email || '-'}</div>
                <div><strong>Phone:</strong> {user.phoneNumber || '-'}</div>
                <div>
                    <strong>Status:</strong>{' '}
                    <Tag color={user.isActive === false ? 'red' : 'green'} style={{ marginInlineEnd: 0 }}>
                        {user.isActive === false ? 'Inactive' : 'Active'}
                    </Tag>
                </div>
            </div>
        </Space>
    );
}

/** Compact label: dòng 1 fullName, dòng 2 userName - dùng cho selected value & tag */
function AuthorizedUserOptionLabel({ user }: { user: BasicAuthorizedUserInfo }) {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                lineHeight: 1.25,
                minWidth: 0,
                overflow: 'hidden',
                flex: 1
            }}
        >
            <div
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 14
                }}
            >
                {user.fullName || user.username}
            </div>
            <div
                style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontSize: 12,
                    color: 'rgba(0,0,0,0.45)'
                }}
            >
                @{user.username}
            </div>
        </div>
    );
}

function AuthorizedUserOptionRow({ user }: { user: BasicAuthorizedUserInfo }) {
    return (
        <Space size={10} align="center" style={{ width: '100%', minWidth: 0 }}>
            <AuthorizedUserAvatar user={user} size="small" />
            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                <div
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                    }}
                >
                    {user.fullName || user.username}
                </div>
                <Text
                    type="secondary"
                    style={{
                        fontSize: 12,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        display: 'block'
                    }}
                >
                    @{user.username}
                </Text>
            </div>
            {user.isActive === false && (
                <Tag color="red" style={{ marginInlineStart: 'auto', marginInlineEnd: 0, flexShrink: 0 }}>
                    Inactive
                </Tag>
            )}
        </Space>
    );
}

function AuthorizedUserInlineDisplay({ user }: { user: BasicAuthorizedUserInfo }) {
    return (
        <Popover content={<AuthorizedUserPopoverContent user={user} />} trigger="hover">
            <Space size={8} align="center" style={{ cursor: 'pointer' }}>
                <AuthorizedUserAvatar user={user} />
                <Text>{getDisplayName(user)}</Text>
            </Space>
        </Popover>
    );
}

function AuthorizedUsersAvatarDisplay({
    users
}: {
    users: BasicAuthorizedUserInfo[];
}) {
    return (
        <Avatar.Group size="default">
            {users.map((user) => (
                <Popover key={user.username} content={<AuthorizedUserPopoverContent user={user} />} trigger="hover">
                    <span style={{ display: 'inline-flex' }}>
                        <AuthorizedUserAvatar user={user} />
                    </span>
                </Popover>
            ))}
        </Avatar.Group>
    );
}

function useResolvedAuthorizedUsers(rawValue: unknown) {
    const inlineUsers = useMemo(() => normalizeInlineUsers(rawValue), [rawValue]);
    const usernames = useMemo(() => normalizeUsernameList(rawValue), [rawValue]);
    const usernamesKey = useMemo(() => usernames.join('|'), [usernames]);
    const [users, setUsers] = useState<BasicAuthorizedUserInfo[]>(inlineUsers);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (inlineUsers.length > 0) {
            setUsers(sortUsersByUsernameOrder(inlineUsers, usernames));
        } else if (usernames.length === 0) {
            setUsers([]);
        }
    }, [inlineUsers, usernames]);

    useEffect(() => {
        if (inlineUsers.length > 0 || usernames.length === 0) {
            setLoading(false);
            return;
        }

        let active = true;
        setLoading(true);

        loadBasicAuthorizedUsersByUsernames(usernames)
            .then((loadedUsers) => {
                if (active) {
                    setUsers(sortUsersByUsernameOrder(loadedUsers, usernames));
                }
            })
            .catch((error) => {
                console.error('Failed to resolve authorized users:', error);
                if (active) {
                    setUsers(sortUsersByUsernameOrder([], usernames));
                }
            })
            .finally(() => {
                if (active) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [inlineUsers.length, usernames, usernamesKey]);

    return {
        users,
        loading
    };
}

export function AuthorizedUserSelect({
    value,
    onChange,
    property,
    att,
    form = {},
    disabled = false,
    placeholder,
    allowMultiple = false,
    isFilter = false,
    onBlur,
    className,
    style,
    size = 'large'
}: AuthorizedUserSelectProps) {
    const currentProperty = property || att;
    const normalizedValues = useMemo(() => normalizeUsernameList(value), [value]);
    const selectedValue = allowMultiple
        ? normalizedValues
        : (normalizedValues[0] || undefined);
    const [options, setOptions] = useState<BasicAuthorizedUserInfo[]>([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [loading, setLoading] = useState(false);
    const preloadRequestIdRef = useRef(0);
    const searchRequestIdRef = useRef(0);

    const isHidden = !isFilter && currentProperty?.editor === 'hidden';
    const isDisabledEditor = currentProperty?.editor === 'disabled';
    const dynamicDisabled = false;
    const isControlDisabled = disabled || isDisabledEditor || Boolean(currentProperty?.isDisabled) || dynamicDisabled;
    const authorizedUserSearchConfig = useMemo(
        () => resolveAuthorizedUserSearchConfig(currentProperty),
        [currentProperty]
    );
    const authorizedUserSearchPolicies = authorizedUserSearchConfig.policies;
    const authorizedUserSubjectSchemas = authorizedUserSearchConfig.subjectSchemas;
    const authorizedUserSearchPoliciesKey = buildAuthorizedUserSearchKey(authorizedUserSearchPolicies);
    const authorizedUserSubjectSchemasKey = buildAuthorizedUserSearchKey(authorizedUserSubjectSchemas);
    const authorizedUserSearchRequestConfig = useMemo<AuthorizedUserSearchConfig>(() => ({
        subjectSchemas: parseAuthorizedUserSearchKey(authorizedUserSubjectSchemasKey),
        policies: parseAuthorizedUserSearchKey<AuthorizationPolicy>(authorizedUserSearchPoliciesKey)
    }), [authorizedUserSearchPoliciesKey, authorizedUserSubjectSchemasKey]);

    useEffect(() => {
        if (normalizedValues.length === 0) {
            return;
        }

        let active = true;
        preloadRequestIdRef.current += 1;
        const requestId = preloadRequestIdRef.current;
        setLoading(true);

        loadBasicAuthorizedUsersByUsernames(normalizedValues)
            .then((loadedUsers) => {
                if (active && preloadRequestIdRef.current === requestId) {
                    setOptions((currentOptions) => mergeUsers(currentOptions, loadedUsers));
                }
            })
            .catch((error) => {
                console.error('Failed to preload authorized users:', error);
            })
            .finally(() => {
                if (active && preloadRequestIdRef.current === requestId) {
                    setLoading(false);
                }
            });

        return () => {
            active = false;
        };
    }, [authorizedUserSearchPoliciesKey, authorizedUserSubjectSchemasKey, normalizedValues]);

    useEffect(() => {
        let active = true;

        const timeoutId = window.setTimeout(() => {
            searchRequestIdRef.current += 1;
            const requestId = searchRequestIdRef.current;
            setLoading(true);

            searchBasicAuthorizedUsers(searchKeyword, 50, authorizedUserSearchRequestConfig)
                .then((searchedUsers) => {
                    if (active && searchRequestIdRef.current === requestId) {
                        setOptions((currentOptions) => mergeUsers(currentOptions, searchedUsers));
                    }
                })
                .catch((error) => {
                    console.error('Failed to search authorized users:', error);
                })
                .finally(() => {
                    if (active && searchRequestIdRef.current === requestId) {
                        setLoading(false);
                    }
                });
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timeoutId);
        };
    }, [authorizedUserSearchRequestConfig, searchKeyword]);

    const mergedOptions = useMemo(() => {
        const fallbackUsers = normalizedValues.map((username) => ({
            username,
            fullName: username
        }));

        const allMerged = mergeUsers(fallbackUsers, options);

        if (normalizedValues.length === 0) {
            return dedupeUsers(allMerged);
        }

        // Selected users first (in selection order), then all other users from search
        const selectedSet = new Set(normalizedValues);
        const selectedUsers = sortUsersByUsernameOrder(allMerged, normalizedValues);
        const otherUsers = allMerged.filter((u) => !selectedSet.has(u.username));

        return dedupeUsers([...selectedUsers, ...otherUsers]);
    }, [normalizedValues, options]);

    const userByUsername = useMemo(() => {
        const map = new Map<string, BasicAuthorizedUserInfo>();
        mergedOptions.forEach((u) => map.set(u.username, u));
        return map;
    }, [mergedOptions]);

    /** Lọc cục bộ theo từ khóa ô search: tên, username, email (bổ sung cho kết quả API). */
    const filterUserOption = (input: string, option?: { value?: string | number }) => {
        const username = option?.value != null ? String(option.value) : '';
        const user = userByUsername.get(username);
        const q = (input || '').trim().toLowerCase();
        if (!q) {
            return true;
        }
        if (!user) {
            return username.toLowerCase().includes(q);
        }
        const name = (user.fullName || '').toLowerCase();
        const un = (user.username || '').toLowerCase();
        const em = (user.email || '').toLowerCase();
        const phone = (user.phoneNumber || '').toLowerCase();
        return name.includes(q) || un.includes(q) || em.includes(q) || phone.includes(q);
    };
    const mergedClassName = [
        className,
        allowMultiple && size === 'large' ? 'authorized-user-select--comfortable' : null
    ]
        .filter(Boolean)
        .join(' ');

    if (isHidden) {
        return null;
    }

    const tagRender = allowMultiple
        ? (props: { value: string; label?: React.ReactNode; closable?: boolean; onClose?: () => void }) => {
            const user = userByUsername.get(props.value);
            return (
                <Tag
                    closable={props.closable}
                    onClose={props.onClose}
                    style={{
                        marginInlineEnd: 4,
                        maxWidth: '100%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6
                    }}
                >
                    {user ? (
                        <>
                            <AuthorizedUserAvatar user={user} size="small" />
                            <div style={{ minWidth: 0, flex: 1, overflow: 'hidden' }}>
                                <AuthorizedUserOptionLabel user={user} />
                            </div>
                        </>
                    ) : (
                        props.label ?? props.value
                    )}
                </Tag>
            );
        }
        : undefined;

    return (
        <Select
            allowClear
            showSearch
            optionFilterProp="value"
            filterOption={filterUserOption}
            getPopupContainer={() => document.body}
            mode={allowMultiple ? 'multiple' : undefined}
            maxTagCount={allowMultiple ? 'responsive' : undefined}
            value={selectedValue as any}
            size={size as any}
            placeholder={placeholder || currentProperty?.placeholder || currentProperty?.label || 'Select user'}
            className={mergedClassName || undefined}
            style={{ width: '100%', ...style }}
            disabled={isControlDisabled}
            loading={loading}
            optionLabelProp="label"
            tagRender={tagRender}
            onSearch={(nextKeyword) => {
                setSearchKeyword(nextKeyword);
            }}
            onFocus={() => {
                if (options.length === 0) {
                    setSearchKeyword('');
                }
            }}
            onChange={(nextValue) => {
                if (allowMultiple) {
                    const nextValues = Array.isArray(nextValue) ? nextValue.filter(Boolean) : [];
                    onChange?.(nextValues);
                    return;
                }

                onChange?.(typeof nextValue === 'string' && nextValue.length > 0 ? nextValue : null);
            }}
            onBlur={onBlur}
            notFoundContent={loading ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No users" />}
        >
            {mergedOptions.map((user) => (
                <Select.Option
                    key={user.username}
                    value={user.username}
                    label={
                        <Space size={8} align="center" style={{ width: '100%', minWidth: 0 }}>
                            <AuthorizedUserAvatar user={user} size="small" />
                            <AuthorizedUserOptionLabel user={user} />
                        </Space>
                    }
                >
                    <AuthorizedUserOptionRow user={user} />
                </Select.Option>
            ))}
        </Select>
    );
}

export function LinkedAuthorizedUserView({
    value,
    property,
    att,
    isEdit
}: LinkedAuthorizedUserViewProps) {
    const user = useMemo(() => {
        const users = normalizeInlineUsers(value);
        return users[0] || null;
    }, [value]);

    if (!user) {
        return wrapReadonlyContent(
            <div>{renderEmptyState(property || att)}</div>,
            isEdit
        );
    }

    return wrapReadonlyContent(
        <div>
            <AuthorizedUserInlineDisplay user={user} />
        </div>,
        isEdit
    );
}

export function AuthorizedUserEdit(props: AuthorizedUserEditProps) {
    return <AuthorizedUserSelect {...props} allowMultiple={false} />;
}

export function AuthorizedUsersEdit(props: AuthorizedUsersEditProps) {
    return <AuthorizedUserSelect {...props} allowMultiple={true} />;
}

export function AuthorizedUserView({
    value,
    property,
    att,
    isQuickEdit,
    onChange,
    onBlur,
    form,
    schemaName,
    isEdit
}: AuthorizedUserViewProps) {
    const currentProperty = property || att;
    const { users, loading } = useResolvedAuthorizedUsers(value);

    if (
        isQuickEdit &&
        currentProperty?.editor !== 'disabled' &&
        !currentProperty?.isDisabled
    ) {
        return (
            <AuthorizedUserEdit
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                property={currentProperty}
                att={att}
                form={form}
                schemaName={schemaName}
            />
        );
    }

    if (loading && users.length === 0) {
        return wrapReadonlyContent(<Spin size="small" />, isEdit);
    }

    if (users.length === 0) {
        return wrapReadonlyContent(
            <div>{renderEmptyState(property || att)}</div>,
            isEdit
        );
    }

    return wrapReadonlyContent(
        <div>
            <AuthorizedUserInlineDisplay user={users[0]} />
        </div>,
        isEdit
    );
}

export function AuthorizedUsersView({
    value,
    property,
    att,
    isQuickEdit,
    onChange,
    onBlur,
    form,
    schemaName,
    isEdit
}: AuthorizedUsersViewProps) {
    const currentProperty = property || att;
    const { users, loading } = useResolvedAuthorizedUsers(value);

    if (
        isQuickEdit &&
        currentProperty?.editor !== 'disabled' &&
        !currentProperty?.isDisabled
    ) {
        return (
            <AuthorizedUsersEdit
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                property={currentProperty}
                att={att}
                form={form}
                schemaName={schemaName}
            />
        );
    }

    if (loading && users.length === 0) {
        return wrapReadonlyContent(<Spin size="small" />, isEdit);
    }

    if (users.length === 0) {
        return wrapReadonlyContent(
            <div>{renderEmptyState(property || att)}</div>,
            isEdit
        );
    }

    return wrapReadonlyContent(
        <div>
            <AuthorizedUsersAvatarDisplay users={users} />
        </div>,
        isEdit
    );
}

export function AuthorizedUserFilter({
    value,
    onChange,
    property,
    form = {},
    placeholder,
    allowMultiple = false,
    size = 'middle'
}: AuthorizedUserFilterProps) {
    return (
        <AuthorizedUserSelect
            value={value}
            onChange={onChange}
            property={property as any}
            form={form}
            placeholder={placeholder}
            allowMultiple={allowMultiple}
            isFilter
            size={size}
        />
    );
}

export function AuthorizedUsersFilter({
    value,
    onChange,
    property,
    form = {},
    placeholder,
    size = 'middle'
}: AuthorizedUsersFilterProps) {
    return (
        <AuthorizedUserSelect
            value={value}
            onChange={onChange}
            property={property as any}
            form={form}
            placeholder={placeholder}
            allowMultiple={true}
            isFilter
            size={size}
        />
    );
}
