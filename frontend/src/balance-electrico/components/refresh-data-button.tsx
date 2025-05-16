import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { refetchQueries } from "../queries/refetch-queries";

export const RefreshDataButton = () => {
  return (
    <Button size="small" icon={<ReloadOutlined />} onClick={refetchQueries}>
      Actualizar
    </Button>
  );
};
