import { localStorageService } from './localStorageService';

// Import all mock data from central files
import {
    mockUsers,
    mockProjects,
    mockMilestones,
    mockMaterials,
    mockStandards,
    mockStockOrders,
    mockStockRequests,
    mockPipelines,
    mockTemplates,
    mockCustomers,
    mockServiceRequests,
    mockWarrantyCards,
    mockWarrantyReminders,
    mockEstimateTemplates
} from '../../data/mockData';

import {
    mockJourneys,
    mockJourneyTemplates,
    mockSurveys,
    mockPortalThreads,
    mockActionItems,
    mockQuotations,
    mockContracts,
    mockPayments,
    mockConstructReports,
    mockIncidents,
    mockEstimates,
    mockLaborPlans,
    mockMaterialDetails
} from '../../data/journeyMockData';

/**
 * Demo Data Service
 * Manages the lifecycle of demo data in localStorage.
 */
export const demoDataService = {
    /**
     * Keys used for mapping mock data to localStorage
     */
    KEYS: {
        USERS: 'demo_users',
        PROJECTS: 'demo_projects',
        MILESTONES: 'demo_milestones',
        MATERIALS: 'demo_materials',
        STANDARDS: 'demo_standards',
        STOCK_ORDERS: 'demo_stock_orders',
        STOCK_REQUESTS: 'demo_stock_requests',
        PIPELINES: 'demo_pipelines',
        TEMPLATES: 'demo_templates',
        CUSTOMERS: 'demo_customers',
        SERVICE_REQUESTS: 'demo_service_requests',
        WARRANTY_CARDS: 'demo_warranty_cards',
        WARRANTY_REMINDERS: 'demo_warranty_reminders',
        ESTIMATE_TEMPLATES: 'demo_estimate_templates',
        JOURNEYS: 'demo_journeys',
        JOURNEY_TEMPLATES: 'demo_journey_templates',
        SURVEYS: 'demo_surveys',
        PORTAL_THREADS: 'demo_portal_threads',
        ACTION_ITEMS: 'demo_action_items',
        QUOTATIONS: 'demo_quotations',
        CONTRACTS: 'demo_contracts',
        PAYMENTS: 'demo_payments',
        CONSTRUCT_REPORTS: 'demo_construct_reports',
        INCIDENTS: 'demo_incidents',
        ESTIMATES: 'demo_estimates',
        LABOR_PLANS: 'demo_labor_plans',
        MATERIAL_DETAILS: 'demo_material_details',
    },

    /**
     * Internal data mapping
     */
    getDataMapping(): Record<string, any> {
        return {
            [this.KEYS.USERS]: mockUsers,
            [this.KEYS.PROJECTS]: mockProjects,
            [this.KEYS.MILESTONES]: mockMilestones,
            [this.KEYS.MATERIALS]: mockMaterials,
            [this.KEYS.STANDARDS]: mockStandards,
            [this.KEYS.STOCK_ORDERS]: mockStockOrders,
            [this.KEYS.STOCK_REQUESTS]: mockStockRequests,
            [this.KEYS.PIPELINES]: mockPipelines,
            [this.KEYS.TEMPLATES]: mockTemplates,
            [this.KEYS.CUSTOMERS]: mockCustomers,
            [this.KEYS.SERVICE_REQUESTS]: mockServiceRequests,
            [this.KEYS.WARRANTY_CARDS]: mockWarrantyCards,
            [this.KEYS.WARRANTY_REMINDERS]: mockWarrantyReminders,
            [this.KEYS.ESTIMATE_TEMPLATES]: mockEstimateTemplates,
            [this.KEYS.JOURNEYS]: mockJourneys,
            [this.KEYS.JOURNEY_TEMPLATES]: mockJourneyTemplates,
            [this.KEYS.SURVEYS]: mockSurveys,
            [this.KEYS.PORTAL_THREADS]: mockPortalThreads,
            [this.KEYS.ACTION_ITEMS]: mockActionItems,
            [this.KEYS.QUOTATIONS]: mockQuotations,
            [this.KEYS.CONTRACTS]: mockContracts,
            [this.KEYS.PAYMENTS]: mockPayments,
            [this.KEYS.CONSTRUCT_REPORTS]: mockConstructReports,
            [this.KEYS.INCIDENTS]: mockIncidents,
            [this.KEYS.ESTIMATES]: mockEstimates,
            [this.KEYS.LABOR_PLANS]: mockLaborPlans,
            [this.KEYS.MATERIAL_DETAILS]: mockMaterialDetails,
        };
    },

    /**
     * Seeds or resets all mock data into localStorage
     */
    resetData(): void {
        console.log('Resetting demo data in localStorage...');
        const dataMap = this.getDataMapping();

        // Save each collection independently
        Object.entries(dataMap).forEach(([key, data]) => {
            localStorageService.saveLocal(key, data);
        });

        console.log('Demo data re-seeded successfully.');
    },

    /**
     * Resets a specific collection to its original mock state
     */
    resetCollection(key: string): void {
        const dataMap = this.getDataMapping();
        const mockData = dataMap[key];
        
        if (mockData !== undefined) {
            localStorageService.saveLocal(key, mockData);
            console.log(`Collection ${key} reset successfully.`);
        } else {
            console.warn(`No mock data found for key: ${key}`);
        }
    },

    /**
     * Checks if demo data has been initialized
     */
    isDataSeeded(): boolean {
        return !!localStorageService.getLocal(this.KEYS.USERS);
    },

    /**
     * Returns raw data for a specific collection from localStorage
     */
    getCollectionData(key: string): any {
        return localStorageService.getLocal(key);
    },

    /**
     * Get all demo related keys
     */
    getDemoKeys(): string[] {
        return Object.values(this.KEYS);
    },

    /**
     * Updates or adds an item in a specific collection
     */
    saveItem(key: string, item: any, idField: string = 'id'): void {
        const data = this.getCollectionData(key) || [];
        if (Array.isArray(data)) {
            const index = data.findIndex((i: any) => i[idField] === item[idField]);
            if (index !== -1) {
                // Update
                data[index] = { ...data[index], ...item };
            } else {
                // Add
                data.push(item);
            }
            localStorageService.saveLocal(key, data);
        } else {
            // If not an array, just overwrite
            localStorageService.saveLocal(key, item);
        }
    }
};

export default demoDataService;
