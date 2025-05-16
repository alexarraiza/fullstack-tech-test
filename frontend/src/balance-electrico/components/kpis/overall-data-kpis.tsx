import { useQuery } from "@apollo/client";
import {
  GET_META_QUERY,
  type BalanceElectricoMetaResponse,
} from "../../queries/meta.queries";
import { DataKpis } from "./data-kpis";

export const OverallDataKpis = () => {
  const { data, loading } = useQuery<BalanceElectricoMetaResponse>(
    GET_META_QUERY,
  );

  return (
    <DataKpis
      loading={loading}
      count={data?.meta[0].count ?? 0}
      minDate={
        data?.meta[0].minDate ? new Date(data?.meta[0].minDate) : undefined
      }
      maxDate={
        data?.meta[0].maxDate ? new Date(data?.meta[0].maxDate) : undefined
      }
    />
  );
};
