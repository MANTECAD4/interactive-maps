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
  updatedAt: z.coerce.date(),
});
export type ClientMarker = z.infer<typeof ClientMarkerSchema>;

export type WebSocketPayload = Omit<ClientMarker, "color" | "updatedAt">;
