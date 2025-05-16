import { CheckOutlined } from "@ant-design/icons";
import { Button, DatePicker } from "antd";
import type dayjs from "dayjs";
import { useState } from "react";

const { RangePicker } = DatePicker;

type SyncDataFormProps = {
  onDone: () => void;
};

export const SyncDataForm = ({ onDone }: SyncDataFormProps) => {
  const [startDate, setStartDate] = useState<dayjs.Dayjs | undefined>(
    undefined
  );
  const [endDate, setEndDate] = useState<dayjs.Dayjs | undefined>(undefined);

  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleFetchData = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const response = await fetch(
        `http://localhost:4000/data-ingestion?startDate=${startDate}&endDate=${endDate}&replace=true`,
        {
          method: "GET",
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const result = await response.json();
      setData(result);
    } catch (_) {
      setError("Error trying to sync data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Sincronizar datos</h2>
      <p>
        Si necesitas sincronizar nuevos datos o sobreescribir los existentes
        desde el servicio de Red Eléctrica, simplemente selecciona las fechas y
        pulsa en Obtener
      </p>
      <RangePicker
        size="small"
        disabled={isLoading || data}
        style={{ width: "100%" }}
        placeholder={["Desde", "Hasta"]}
        onChange={(dates) => {
          if (dates && dates.length === 2) {
            setStartDate(dates[0]!);
            setEndDate(dates[1]!);
          } else {
            setStartDate(undefined);
            setEndDate(undefined);
          }
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {error ? <p style={{ color: "red" }}>{error}</p> : <div />}
        {!data ? (
          <Button
            type="primary"
            size="small"
            loading={isLoading}
            onClick={() => {
              if (startDate && endDate) {
                handleFetchData(
                  startDate.format("YYYY-MM-DDT00:00:00"),
                  endDate.format("YYYY-MM-DDT23:59:59")
                );
              }
            }}
            style={{ marginTop: 16 }}
            disabled={!startDate || !endDate}
          >
            Obtener
          </Button>
        ) : (
          <Button
            icon={<CheckOutlined />}
            color="green"
            type="primary"
            size="small"
            style={{ marginTop: 16 }}
            onClick={onDone}
          >
            Hecho
          </Button>
        )}
      </div>
    </div>
  );
};
