---
name: Standardized SDK Usage
description: Guidelines for utilizing backend-integrated SDK folders for typing and GraphQL communication while prohibiting direct modifications.
---

# Standardized SDK Usage Instruction

All feature development in this repository MUST strictly adhere to and utilize the typing and GraphQL service standards defined in the following SDK folders. These folders comprise the backend-integrated SDK and should not be modified directly.

## Core SDK Folders

### 1. `services/core-contracts`
- **Purpose**: The "Typed Domain Layer". It contains the source of truth for data models and domain-specific GraphQL queries.
- **Contents**:
    - `types/`: TypeScript interfaces for all entities (e.g., `Employee`, `Schema`, `Project`).
    - `services/`: Specific service wrappers for standardized API calls.
    - `queries/`: Standard GraphQL query and mutation strings for domain entities.
- **Standard**: Always import existing types and query strings from here instead of redefining them in features.

### 2. `services/core-graphql`
- **Purpose**: The "Communication Layer". It handles low-level GraphQL transport, real-time synchronization, and local persistence.
- **Contents**:
    - `localstorage/`: Logic for local data caching.
    - `subscribeService/`: GraphQL subscription management for real-time updates.
- **Standard**: Use for features requiring real-time data or local data persistence.

### 3. `store/actions/data`
- **Purpose**: The "Generic Data Actions Layer". It provides reusable Redux actions and functions for standard CRUD operations on any schema.
- **Contents**:
    - `data.action.ts`: Primary entry point for `save_content`, `update_partial_content`, `query_content`, and `delete_content`.
    - `data.graphql.ts`: Generic GraphQL operations for schema-based data.
- **Standard**: Always use `data.action.ts` for general schema-based data interactions instead of writing custom GraphQL mutations for standard CRUD.

### 4. `store/actions/schemas`
- **Purpose**: The "Dynamic Schema Layer". It manages backend schema definitions and dynamic query generation.
- **Contents**:
    - `schemas.action.ts`: Handles fetching and managing schema metadata.
    - `GraphQLQueryGenerator.ts`: Generates queries on-the-fly based on schema definitions.
- **Standard**: Use to retrieve schema metadata, perform dynamic lookups, or handle complex cross-schema interactions.

## Mandatory Rules

1.  **Strict Usage**: New features MUST use the types and services from these folders to ensure data integrity and backend compatibility.
2.  **No Modifications**: Do NOT arbitrarily change, delete, or add files within these directories. They are synchronized with the backend SDK.
3.  **Consistency**: If a domain type or service is missing, verify the backend contract before attempting to extend the SDK locally.

## Design Patterns
- **Typing**: Use `import type { ... } from 'services/core-contracts/types/...'`
- **Data Fetching**: Use generic `query_content` or `find_content` from `store/actions/data/data.action.ts` for schema data.
- **Domain Logic**: Use specific services from `services/core-contracts/services/...` for complex business operations.
