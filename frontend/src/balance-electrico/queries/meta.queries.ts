import { gql } from "@apollo/client";
import type { BalanceElectricoMeta } from "../models/balance-electrico-meta";

export const GET_META_QUERY = gql`
  query GetMeta {
    meta {
      count
      maxDate
      minDate
    }
  }
`;

export type BalanceElectricoMetaResponse = {
  meta: BalanceElectricoMeta[];
};
