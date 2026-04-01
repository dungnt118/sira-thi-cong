import type { PropDefinition } from 'types/schemas/PropDefinition';

/** Props chuẩn cho editor property (form) — `att` là alias theo convention platform */
export type PropTypeInput<T = unknown> = {
    value?: T;
    onChange?: (value: T) => void;
    att?: PropDefinition;
    disabled?: boolean;
};

export type PropTypeReadonly<T = unknown> = {
    value?: T;
    property: PropDefinition;
};

export type FilterComponentProps<T = unknown> = {
    value?: T;
    onChange?: (value: T) => void;
    property?: PropDefinition;
};
