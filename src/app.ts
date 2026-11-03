import { getEnvs } from "./config/get-envs";
import { MapsSocketServer } from "./maps-socket-server";
const main = () => {
  const { DEFAULT_CHANNEL, PORT } = getEnvs();
  const mapsSocketServer = new MapsSocketServer({
    defaultChannel: DEFAULT_CHANNEL,
    port: PORT,
  });
  mapsSocketServer.start();
};
(() => {
  main();
})();
