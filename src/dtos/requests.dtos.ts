import z from "zod";
import { ClientMarkerSchema } from ".";

export enum RequestMessage {
  "REGISTER_CLIENT" = "REGISTER_CLIENT",
  "MOVE_CLIENT" = "MOVE_CLIENT",
  "DELETE_CLIENT" = "DELETE_CLIENT",
  "GET_CLIENT_MARKERS" = "GET_CLIENT_MARKERS",
}

export const MoveClientSchema = ClientMarkerSchema.omit({
  color: true,
  name: true,
  id: true,
});

// export const WithIdSchema = z.object({
//   id: z.uuid(),
// });

export const WebSocketRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(RequestMessage.GET_CLIENT_MARKERS),
    payload: z.null().optional(),
  }),
  z.object({
    type: z.literal(RequestMessage.REGISTER_CLIENT),
    payload: ClientMarkerSchema,
  }),
  z.object({
    type: z.literal(RequestMessage.MOVE_CLIENT),
    payload: MoveClientSchema,
  }),
  z.object({
    type: z.literal(RequestMessage.DELETE_CLIENT),
    payload: z.null().optional(),
  }),
]);

export type WebSocketRequestMessage = z.infer<typeof WebSocketRequestSchema>;

export type MoveClientDto = z.infer<typeof MoveClientSchema>;
// export type DeleteClientDto = z.infer<typeof WithIdSchema>;
// export type WithIdDto = z.infer<typeof WithIdSchema>;
// export type GetClientsRequest = Extract<
//   WebSocketRequestMessage,
//   { type: RequestMessage.GET_CLIENT_MARKERS }
// >;
