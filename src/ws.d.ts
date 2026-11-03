import "ws";
import { WebSocket } from "ws";
import { WebSocketPayload } from "./dtos";
declare module "ws" {
  interface WebSocket {
    user: WebSocketPayload;
  }
}
