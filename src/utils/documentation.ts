const roleToCategoryMap: Record<string, string> = {
    KT: 'accountant',
    GS: 'supervisor'
};

export const getDocumentationCategoryByRole = (role?: string | null) => {
    if (!role) {
        return undefined;
    }

    return roleToCategoryMap[role.toUpperCase()];
};

export const buildDocumentationPath = (role?: string | null, docId?: string) => {
    const params = new URLSearchParams();
    const categoryId = getDocumentationCategoryByRole(role);

    if (categoryId) {
        params.set('category', categoryId);
    }

    if (docId) {
        params.set('doc', docId);
    }

    const query = params.toString();
    return query ? `/documents?${query}` : '/documents';
};
