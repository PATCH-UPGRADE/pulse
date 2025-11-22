import { useQueryStates } from "nuqs";
import { vulnerabilitiesParams } from "../params";

export const useVulnerabilitiesParams = () => {
  return useQueryStates(vulnerabilitiesParams);
};
