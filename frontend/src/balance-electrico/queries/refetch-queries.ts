import { client } from "../../main";

export const refetchQueries = () =>
  client.refetchQueries({
    include: "all",
  });
