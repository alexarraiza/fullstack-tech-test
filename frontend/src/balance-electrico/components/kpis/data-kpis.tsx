import { Card, Statistic } from "antd";

export type DataKpisProps = {
  loading: boolean;
  count: number;
  minDate?: Date;
  maxDate?: Date;
};

export const DataKpis = ({
  loading,
  count,
  minDate,
  maxDate,
}: DataKpisProps) => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 16 }}>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic loading={loading} title="Registros totales" value={count} />
      </Card>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic
          loading={loading}
          title="Fecha más antigua"
          value={minDate ? new Date(minDate).toLocaleDateString() : undefined}
        />
      </Card>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic
          loading={loading}
          title="Fecha más reciente"
          value={maxDate ? new Date(maxDate).toLocaleDateString() : undefined}
        />
      </Card>
    </div>
  );
};
