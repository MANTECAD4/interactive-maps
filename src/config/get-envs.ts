import "dotenv/config";
import { get } from "env-var";
export const getEnvs = () => ({
  PORT: get("PORT").required().asPortNumber(),
  DEFAULT_CHANNEL: get("DEFAULT_CHANNEL").required().asString(),
});
