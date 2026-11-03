import z from "zod";

export const CoordinatesSchema = z.object({
  lon: z.number(),
  lat: z.number(),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const ClientMarkerSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3),
  coordinates: CoordinatesSchema,
  color: z.string(),
  updatedAt: z.date(),
});
export type ClientMarker = z.infer<typeof ClientMarkerSchema>;

export const WebSocketPayloadSchema = ClientMarkerSchema.omit({
  updatedAt: true,
  color: true,
});
export type WebSocketPayload = z.infer<typeof WebSocketPayloadSchema>;

// ! REQUESTS
export enum RequestMessage {
  "REGISTER_CLIENT" = "REGISTER_CLIENT",
  "MOVE_CLIENT" = "MOVE_CLIENT",
  "REMOVE_CLIENT" = "REMOVE_CLIENT",
  "GET_CLIENT_MARKERS" = "GET_CLIENT_MARKERS",
  "RESET" = "RESET",
}

export type IncomingMessage = {
  type: RequestMessage;
  payload: unknown;
};

export const RegisterClientSchema = ClientMarkerSchema.omit({
  id: true,
  // updatedAt: true,
});
export type RegisterClientDto = z.infer<typeof RegisterClientSchema>;

export const MoveClientSchema = z.object({
  coordinates: CoordinatesSchema,
});
export type MoveClientDto = z.infer<typeof MoveClientSchema>;

// !RESPONSES
export enum ResponseMessage {
  "CLIENT_MARKERS_LIST" = "CLIENT_MARKERS_LIST",
  "CLIENT_JOINED" = "CLIENT_JOINED",
  "CLIENT_LEFT" = "CLIENT_LEFT",
  "CLIENT_MOVED" = "CLIENT_MOVED",
  "WELCOME" = "WELCOME",
  "ERROR" = "ERROR",
}

export interface OutgoingMessage {
  type: ResponseMessage;
  payload: unknown;
}

export interface ClientMarkersListPayload {
  clients: ClientMarker[];
}

export interface ClientJoinedPayload {
  client: ClientMarker;
}
export interface ClientLeftPayload {
  id: string;
}
export interface ClientMovedPayload {
  id: string;
  coordinates: Coordinates;
  updatedAt: Date;
}
export interface WelcomePayload {
  id: string;
}

export interface ErrorPayload {
  error: {
    message: string;
  };
}
