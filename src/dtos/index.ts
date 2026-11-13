import z from "zod";

export const CoordinatesSchema = z.object({
  lon: z.number().min(-180).max(180),
  lat: z.number().min(-90).max(90),
});
export type Coordinates = z.infer<typeof CoordinatesSchema>;

export const ClientMarkerSchema = z.object({
  id: z.uuid(),
  name: z.string().min(3),
  coordinates: CoordinatesSchema,
  color: z.string(),
  updatedAt: z.coerce.date("Invalid date recieved"),
});
export type ClientMarker = z.infer<typeof ClientMarkerSchema>;

export type WebSocketPayload = Omit<ClientMarker, "color" | "updatedAt">;
