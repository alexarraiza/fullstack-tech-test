import { Table, type TableProps } from "antd";
import type { BalanceElectrico } from "../../models/balanace-electrico";

type DatatableProps = TableProps & {
  data: BalanceElectrico[];
};

export const Datatable = ({ data, loading, ...props }: DatatableProps) => {
  return (
    <Table
      size="small"
      loading={loading}
      bordered
      style={{ marginTop: 16, height: "100%" }}
      virtual
      pagination={false}
      scroll={{ y: "calc(100% - 64px)" }}
      columns={[
        {
          title: "Fecha",
          dataIndex: "date",
          sorter: (a, b) => {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
          },
        },
        {
          title: "Grupo",
          dataIndex: "group",
        },
        {
          title: "Tipo",
          dataIndex: "type",
        },
        {
          title: "Valor",
          dataIndex: "value",
        },
      ]}
      dataSource={data}
      {...props}
    />
  );
};
