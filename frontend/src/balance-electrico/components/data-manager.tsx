import { useQuery } from "@apollo/client";
import { Card, notification } from "antd";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!loading && (!data || data?.balances.length === 0)) {
      notification.destroy();
      notification["info"]({
        message: "No se han encontrado resultados",
        description:
          "Parece que no se han encontrado datos, puedes probar a actualizar, cambiar los filtros o sincronizar los datos del API.",
        placement: "bottomLeft",
        duration: 0,
      });
    } else if (!loading && data && data?.balances.length > 0) {
      notification.destroy();
    }
  }, [loading, data]);

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
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
          countLabel="Registros visibles"
          minDate={
            data?.balances.length
              ? new Date(
                  Math.min(
                    ...data.balances.map((b) => new Date(b.date).getTime())
                  )
                )
              : undefined
          }
          minDateLabel="Fecha más antigua visible"
          maxDate={
            data?.balances.length
              ? new Date(
                  Math.max(
                    ...data.balances.map((b) => new Date(b.date).getTime())
                  )
                )
              : undefined
          }
          maxDateLabel="Fecha más reciente visible"
          valueColor="blue"
        />
      </div>
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
