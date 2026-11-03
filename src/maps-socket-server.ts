import { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { RegisterUserData } from "./dtos";

interface OptionsWss {
  port: number;
  defaultChannel: string;
  path?: string;
}

export class MapsSocketServer {
  private wss: WebSocketServer;
  private channels: Map<string, Set<WebSocket>> = new Map();
  public defaultChannel: string;
  public port: number;

  constructor(options: OptionsWss) {
    const { defaultChannel, port, path = "/" } = options;
    this.port = port;
    this.defaultChannel = defaultChannel;
    this.wss = new WebSocketServer({ port, path });
  }

  public sendEvent = (message: any) => {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  };

  private registerUser = (
    ws: WebSocket,
    req: IncomingMessage,
    user: RegisterUserData,
  ): { channelId: string; clientId: string } => {
    const clientId = crypto.randomUUID();
    ws.user = { id: clientId, name: "", coordinates: { lat: 1, lon: 1 } };
    const channelId =
      new URL(req.url!, `http://${req.headers.host}`).searchParams.get(
        "channelId",
      ) || this.defaultChannel;
    if (this.channels.get(channelId)) {
      this.channels.set(channelId, new Set());
    }
    this.channels.get(channelId)?.add(ws);
    console.log(`Client ${clientId} connected to channel ${channelId}`);
    return { channelId, clientId };
  };

  private configureServer = () => {
    this.wss.on("connection", (ws: WebSocket, req) => {
      // !TODO - implement helper for user data extraction from
      const registerUserData: RegisterUserData = {
        coordinates: {
          lon: 0,
          lat: 0,
        },
        name: "",
        color: "",
      };
      const { channelId, clientId } = this.registerUser(
        ws,
        req,
        registerUserData,
      );

      ws.send(`Welcome!! Your id is ${clientId}`);

      ws.on("close", () => {
        console.log(`User ${clientId} disconnected`);
      });

      ws.on("message", (rawRequestMessage: string) => {
        console.log({ rawRequestMessage });
      });
    });
  };

  public start = () => {
    console.log(`Server running on port ${this.port}`);
    this.configureServer();
  };
}
