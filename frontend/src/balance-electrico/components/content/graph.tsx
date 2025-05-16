import { ResponsiveBarCanvas, type BarDatum } from "@nivo/bar";
import dayjs from "dayjs";
import type { BalanceElectrico } from "../../models/balanace-electrico";

type GraphProps = {
  data: BalanceElectrico[];
};

export const Graph = ({ data }: GraphProps) => {
  const keys: Set<string> = new Set();

  const graphData = data.reduce((acc, curr) => {
    const date = dayjs(curr.date).format("YYYY-MM-DD");
    const existingEntry = acc.find((entry) => entry.date === date);

    if (existingEntry) {
      existingEntry[curr.type] = curr.value;
    } else {
      acc.push({ date, [curr.type]: curr.value });
    }

    keys.add(curr.type);

    return acc;
  }, [] as BarDatum[]);

  return (
    <div
      style={{
        height: "calc(100vh - 350px)",
        width: "100%",
      }}
    >
      <ResponsiveBarCanvas
        data={graphData}
        keys={[...keys]}
        indexBy={"date"}
        groupMode="stacked"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.3}
        colors={{ scheme: "nivo" }}
        enableLabel={false}
        enableGridY={false}
        enableGridX={false}
        enableTotals={false}
        axisLeft={{
          legend: "kWh",
        }}
        axisBottom={null}
      />
    </div>
  );
};
