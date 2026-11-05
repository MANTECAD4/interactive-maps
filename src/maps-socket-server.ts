import { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { WebSocketPayload } from "./dtos";
import { MarkersController } from "./controllers/markers.controller";
import { ResponseMessage } from "./dtos/responses.dtos";

interface OptionsWss {
  port: number;
  defaultChannel: string;
  path?: string;
}

export class MapsSocketServer {
  private wss: WebSocketServer;
  private readonly markersController = new MarkersController();
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
    user: WebSocketPayload,
  ): void => {
    ws.user = user;
    const channelId =
      new URL(req.url!, `http://${req.headers.host}`).searchParams.get(
        "channelId",
      ) || this.defaultChannel;
    if (!this.channels.get(channelId)) {
      this.channels.set(channelId, new Set());
    }
    this.channels.get(channelId)?.add(ws);
    ws.channelId = channelId;
    console.log(`Client ${user.id} connected to channel ${channelId}`);
  };

  private configureServer = () => {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      ws.on("close", () => {
        if (ws.user) {
          const result = this.markersController.handleRemoveClient({
            id: ws.user.id,
          });
          const channel = this.channels.get(ws.channelId);
          if (channel === undefined) return;
          result.broadcast.forEach((broadCastMessage) => {
            channel.forEach((client) => {
              if (ws.user.id !== client.user.id) {
                client.send(JSON.stringify(broadCastMessage));
              }
            });
          });
          channel.delete(ws);
          console.log(`User ${ws.user.id} disconnected`);
        }
      });

      ws.on("message", (rawRequestMessage: string) => {
        const result = this.markersController.handleMessage(rawRequestMessage);
        result.personal.forEach((personalMessage) => {
          if (personalMessage.type === ResponseMessage.WELCOME) {
            this.registerUser(
              ws,
              req,
              personalMessage.payload.clientMarker as WebSocketPayload,
            );
          }
          ws.send(JSON.stringify(personalMessage));
        });
        result.broadcast.forEach((broadcastMessage) => {
          this.channels.get(ws.channelId)?.forEach((client) => {
            if (ws.user.id !== client.user.id) {
              client.send(JSON.stringify(broadcastMessage));
            }
          });
        });
      });
    });
  };

  public start = () => {
    console.log(`Server running on port ${this.port}`);
    this.configureServer();
  };
}
