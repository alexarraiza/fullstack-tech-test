import { Card, Statistic } from "antd";

export type DataKpisProps = {
  loading: boolean;
  count: number;
  minDate?: Date;
  maxDate?: Date;
  countLabel?: string;
  minDateLabel?: string;
  maxDateLabel?: string;
  valueColor?: string;
};

export const DataKpis = ({
  loading,
  count,
  minDate,
  maxDate,
  countLabel = "Registros totales",
  minDateLabel = "Fecha más antigua",
  maxDateLabel = "Fecha más reciente",
  valueColor = "black",
}: DataKpisProps) => {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "row", gap: 16 }}>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic
          loading={loading}
          title={countLabel}
          value={count}
          valueStyle={{ color: valueColor }}
        />
      </Card>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic
          loading={loading}
          title={minDateLabel}
          value={minDate ? new Date(minDate).toLocaleDateString() : undefined}
          valueStyle={{ color: valueColor }}
        />
      </Card>
      <Card variant="borderless" style={{ flex: 1 }}>
        <Statistic
          loading={loading}
          title={maxDateLabel}
          value={maxDate ? new Date(maxDate).toLocaleDateString() : undefined}
          valueStyle={{ color: valueColor }}
        />
      </Card>
    </div>
  );
};
