import { gql } from "@apollo/client";
import type { BalanceElectrico } from "../models/balanace-electrico";

export type BalanceElectricoFilter = {
  type?: string;
  group?: string;
  startDate?: Date;
  endDate?: Date;
};

export const GET_ALL_GROUPS_QUERY = gql`
  query GetAllGroups {
    groups
  }
`;

export const GET_ALL_TYPES_QUERY = gql`
  query GetAllTypes($group: String) {
    types(group: $group)
  }
`;

export const GET_ALL_DATA_QUERY = gql`
  query GetAllData(
    $type: String
    $group: String
    $startDate: DateTime
    $endDate: DateTime
  ) {
    balances(
      type: $type
      group: $group
      startDate: $startDate
      endDate: $endDate
    ) {
      date
      group
      type
      value
    }
  }
`;

export type BalanceElectricoResponse = {
  balances: BalanceElectrico[];
};

export type GroupsResponse = {
  groups: string[];
};

export type TypesResponse = {
  types: string[];
};
