import { DatePicker, Select } from "antd";
import dayjs from "dayjs";
import type { BalanceElectricoFilter } from "../../queries/balance.queries";

const { RangePicker } = DatePicker;

export type MainContentFiltersProps = {
  groups: { data: string[]; loading: boolean };
  types: { data: string[]; loading: boolean };
  filter: BalanceElectricoFilter;
  setFilter: (filter: BalanceElectricoFilter) => void;
};

export const MainContentFilters = ({
  groups,
  types,
  filter,
  setFilter,
}: MainContentFiltersProps) => {
  return (
    <>
      <Select
        size="small"
        value={filter.group}
        options={groups.data.map((group) => ({
          label: group,
          value: group,
        }))}
        allowClear
        loading={groups.loading}
        placeholder="Grupo"
        style={{ width: 150, marginRight: 16 }}
        onSelect={(value) => {
          setFilter({
            group: value,
            type: undefined,
          });
        }}
        onClear={() => {
          setFilter({
            group: undefined,
            type: undefined,
          });
        }}
      />
      <Select
        size="small"
        value={filter.type}
        options={types.data.map((type) => ({
          label: type,
          value: type,
        }))}
        loading={types.loading}
        allowClear
        placeholder="Tipo"
        style={{ width: 150, marginRight: 16 }}
        onSelect={(value) => {
          setFilter({
            type: value,
          });
        }}
        onClear={() => {
          setFilter({
            type: undefined,
          });
        }}
      />
      <RangePicker
        style={{ marginRight: 16 }}
        size="small"
        placeholder={["Desde", "Hasta"]}
        value={[
          filter.startDate ? dayjs(filter.startDate) : undefined,
          filter.endDate ? dayjs(filter.endDate) : undefined,
        ]}
        onChange={(dates) => {
          setFilter({
            startDate: dates?.[0]?.toDate(),
            endDate: dates?.[1]?.toDate(),
          });
        }}
      />
    </>
  );
};
