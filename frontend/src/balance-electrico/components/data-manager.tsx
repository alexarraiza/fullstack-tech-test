import { useQuery } from "@apollo/client";
import { Card } from "antd";
import { useState } from "react";
import {
  GET_ALL_DATA_QUERY,
  GET_ALL_GROUPS_QUERY,
  GET_ALL_TYPES_QUERY,
  type BalanceElectricoFilter,
  type BalanceElectricoResponse,
  type GroupsResponse,
  type TypesResponse,
} from "../queries/balance.queries";
import { MainContent } from "./content/main-content";
import { MainContentFilters } from "./content/main-content-filters";
import { DataKpis } from "./kpis/data-kpis";
import { OverallDataKpis } from "./kpis/overall-data-kpis";

export const DataManager = () => {
  const [filter, setFilter] = useState<BalanceElectricoFilter>({
    type: undefined,
    group: undefined,
    startDate: undefined,
    endDate: undefined,
  });

  const { loading, error, data, refetch } = useQuery<BalanceElectricoResponse>(
    GET_ALL_DATA_QUERY,
    {
      variables: { ...filter },
    }
  );

  const { data: groupsData, loading: groupsLoading } =
    useQuery<GroupsResponse>(GET_ALL_GROUPS_QUERY);

  const { data: typesData, loading: typesLoading } = useQuery<TypesResponse>(
    GET_ALL_TYPES_QUERY,
    {
      variables: {
        group: filter.group,
      },
    }
  );

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
      {/* MARK: KPIS
       */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          width: "100%",
        }}
      >
        <OverallDataKpis />
        <DataKpis
          loading={loading}
          count={data?.balances.length ?? 0}
          minDate={
            data?.balances.length
              ? new Date(
                  Math.min(
                    ...data.balances.map((b) => new Date(b.date).getTime())
                  )
                )
              : undefined
          }
          maxDate={
            data?.balances.length
              ? new Date(
                  Math.min(
                    ...data.balances.map((b) => new Date(b.date).getTime())
                  )
                )
              : undefined
          }
        />
      </div>
      {error && <Card style={{ marginTop: 12 }}>{error.toString()}</Card>}
      {/* MARK: Filters
       */}
      <Card
        style={{
          marginTop: 16,
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <MainContent
          balances={{
            data: data?.balances ?? [],
            loading: loading,
            refetch: refetch,
          }}
          filters={
            <MainContentFilters
              groups={{
                data: groupsData?.groups ?? [],
                loading: groupsLoading,
              }}
              types={{
                data: typesData?.types ?? [],
                loading: typesLoading,
              }}
              filter={filter}
              setFilter={(filter) => {
                setFilter((prev) => ({
                  ...prev,
                  ...filter,
                }));
              }}
            />
          }
        />
      </Card>
    </div>
  );
};
