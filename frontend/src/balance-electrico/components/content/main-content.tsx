import { BarChartOutlined, TableOutlined } from "@ant-design/icons";
import { Radio } from "antd";
import { useState } from "react";
import type { BalanceElectrico } from "../../models/balanace-electrico";
import { Datatable } from "./datatable";
import { Graph } from "./graph";

const DataViewType = {
  chart: "c",
  table: "t",
} as const;

type DataViewType = (typeof DataViewType)[keyof typeof DataViewType];

export type MainContentProps = {
  balances: {
    data: BalanceElectrico[];
    loading: boolean;
    refetch: () => void;
  };
  filters: React.ReactNode;
};

export const MainContent = ({ balances, filters }: MainContentProps) => {
  const [viewType, setViewType] = useState<DataViewType>(DataViewType.chart);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Radio.Group defaultValue={viewType} buttonStyle="solid" size="small">
          <Radio.Button
            value="c"
            onClick={() => setViewType(DataViewType.chart)}
          >
            <BarChartOutlined />
          </Radio.Button>
          <Radio.Button
            value="t"
            onClick={() => setViewType(DataViewType.table)}
          >
            <TableOutlined />
          </Radio.Button>
        </Radio.Group>
        <div>{filters}</div>
      </div>
      <div style={{ flex: 1 }}>
        {viewType === "t"
          ? balances.data && (
              <Datatable loading={balances.loading} data={balances.data} />
            )
          : balances.data && <Graph data={balances.data} />}
      </div>
    </>
  );
};
