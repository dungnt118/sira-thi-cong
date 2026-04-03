import type { HeadlessReferenceContent, IndexedContentItem } from 'types/apis';
import type { ApiListResponse, ApiResponse } from 'types/apis/ApiResponse';
import type { HeadlessFileUpload } from 'types/apis/HeadlessFileUpload';

/**
 * MaterialGroup interface
 * Auto-generated from Schema: MaterialGroup
 */
export interface IMaterialGroup {
  _id: string;
  name?: string;
  type?: MaterialGroupTypeEnum;
  category?: MaterialGroupCategoryEnum;
  base_unit?: MaterialGroupBaseUnitEnum;
  package_unit?: MaterialGroupPackageUnitEnum;
  status?: MaterialGroupStatusEnum;
  sort_order?: number;
}

export interface ICreateMaterialGroupInput {
  name?: string;
  type?: MaterialGroupTypeEnum2;
  category?: MaterialGroupCategoryEnum2;
  base_unit?: MaterialGroupBaseUnitEnum2;
  package_unit?: MaterialGroupPackageUnitEnum2;
  status?: MaterialGroupStatusEnum2;
  sort_order?: number;
}

export type IMaterialGroupListResponse = ApiListResponse<IMaterialGroup>

// Union types generated from value_options
export type MaterialGroupTypeEnum = 'CONSUMABLE' | 'OTHER';
export type MaterialGroupCategoryEnum = 'waterproofing_sealing' | 'paint_coating' | 'primer_putty_fillers' | 'chemical_adhesive' | 'cement_concrete_mortar' | 'brick_stone_aggregate' | 'steel_rebar_metal' | 'wood_board_formwork' | 'pipe_plumbing' | 'electrical_cable_accessories' | 'hvac_duct_accessories' | 'insulation_acoustic' | 'fasteners_hardware' | 'ppe_safety_consumables' | 'auxiliary_finishing' | 'other';
export type MaterialGroupBaseUnitEnum = 'kg' | 'g' | 'ton' | 'liter' | 'ml' | 'm' | 'cm' | 'mm' | 'm2' | 'm3' | 'piece' | 'set' | 'pair' | 'roll' | 'sheet' | 'bottle' | 'bag' | 'drum' | 'tube' | 'box_unit' | 'other';
export type MaterialGroupPackageUnitEnum = 'thung' | 'lon' | 'bao' | 'cuon' | 'cai' | 'kien' | 'pallet' | 'hop' | 'goi' | 'chai' | 'phuy' | 'bo' | 'cap' | 'khay' | 'can' | 'thung_xop' | 'other';
export type MaterialGroupStatusEnum = 'active' | 'inactive';
export type MaterialGroupTypeEnum2 = 'CONSUMABLE' | 'OTHER';
export type MaterialGroupCategoryEnum2 = 'waterproofing_sealing' | 'paint_coating' | 'primer_putty_fillers' | 'chemical_adhesive' | 'cement_concrete_mortar' | 'brick_stone_aggregate' | 'steel_rebar_metal' | 'wood_board_formwork' | 'pipe_plumbing' | 'electrical_cable_accessories' | 'hvac_duct_accessories' | 'insulation_acoustic' | 'fasteners_hardware' | 'ppe_safety_consumables' | 'auxiliary_finishing' | 'other';
export type MaterialGroupBaseUnitEnum2 = 'kg' | 'g' | 'ton' | 'liter' | 'ml' | 'm' | 'cm' | 'mm' | 'm2' | 'm3' | 'piece' | 'set' | 'pair' | 'roll' | 'sheet' | 'bottle' | 'bag' | 'drum' | 'tube' | 'box_unit' | 'other';
export type MaterialGroupPackageUnitEnum2 = 'thung' | 'lon' | 'bao' | 'cuon' | 'cai' | 'kien' | 'pallet' | 'hop' | 'goi' | 'chai' | 'phuy' | 'bo' | 'cap' | 'khay' | 'can' | 'thung_xop' | 'other';
export type MaterialGroupStatusEnum2 = 'active' | 'inactive';
