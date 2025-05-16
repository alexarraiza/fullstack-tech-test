import { client } from "../../main";

export const refetchQueries = () =>
  client.refetchQueries({
    include: ["GetAllGroups", "GetAllTypes", "GetAllData", "GetMeta"],
  });
