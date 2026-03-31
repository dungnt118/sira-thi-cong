/**
 * Basic organizational entities.
 */

export interface Employee {
    _id: string;
    fullName?: string;
    employeeCode?: string;
    email?: string;
    phoneNumber?: string;
    title?: string;
    departmentIds?: string[];
    [key: string]: any;
}

export interface Department {
    _id: string;
    name?: string;
    code?: string;
    parentId?: string;
    managerId?: string;
    [key: string]: any;
}
