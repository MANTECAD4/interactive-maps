import { ClientMarker } from ".";
import { Coordinates } from "./index";

export enum ResponseMessage {
  "CLIENT_MARKERS_LIST" = "CLIENT_MARKERS_LIST",
  "CLIENT_JOINED" = "CLIENT_JOINED",
  "CLIENT_LEFT" = "CLIENT_LEFT",
  "CLIENT_MOVED" = "CLIENT_MOVED",
  // "WELCOME" = "WELCOME",
  "ERROR" = "ERROR",
}

export interface WebSocketResponse {
  personal: WebSocketResponseMessage[];
  broadcast: WebSocketResponseMessage[];
}

export type WebSocketResponseMessage =
  | {
      type: ResponseMessage.ERROR;
      message: string;
    }
  // | {
  //     type: ResponseMessage.WELCOME;
  //     payload: {
  //       clientMarker: ClientMarker;
  //     };
  //   }
  | {
      type: ResponseMessage.CLIENT_MARKERS_LIST;
      payload: { clientMarkers: ClientMarker[] };
    }
  | {
      type: ResponseMessage.CLIENT_JOINED;
      payload: { clientMarker: ClientMarker };
    }
  | {
      type: ResponseMessage.CLIENT_LEFT;
      payload: { id: string };
    }
  | {
      type: ResponseMessage.CLIENT_MOVED;
      payload: { id: string; coordinates: Coordinates; updatedAt: Date };
    };
