import { ReloadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { client } from "../../main";

export const RefreshDataButton = () => {
  return (
    <Button
      size="small"
      icon={<ReloadOutlined />}
      onClick={() => {
        client.refetchQueries({
          include: ["GetAllGroups", "GetAllTypes", "GetAllData", "GetMeta"],
        });
      }}
    >
      Refresh data
    </Button>
  );
};
