import { ClientMarker, Coordinates } from "../dtos";

export class MarkersStore {
  private markers: Map<string, ClientMarker> = new Map();

  public getAll = (hostId: string): ClientMarker[] => {
    return Array.from(this.markers.values()).filter(
      (marker) => marker.id !== hostId,
    );
  };

  public findById = (id: string): ClientMarker | null => {
    const marker = this.markers.get(id);
    return marker ?? null;
  };

  public add = (client: ClientMarker): ClientMarker => {
    this.markers.set(client.id, client);
    return client;
  };

  public delete = (id: string): string => {
    this.markers.delete(id);
    return id;
  };

  public moveMarkerCoordinates = (
    id: string,
    newCoordinates: Coordinates,
    updatedAt: Date,
  ): Omit<ClientMarker, "name" | "color"> => {
    const prevStatusMarker = this.findById(id);
    if (!prevStatusMarker)
      throw new Error(`Error on update - Marker with id ${id} not found`);

    const newStatusMarker: ClientMarker = {
      ...prevStatusMarker,
      updatedAt,
      coordinates: newCoordinates,
    };

    this.markers.set(id, newStatusMarker);

    const { color, name, ...rest } = newStatusMarker;

    return rest;
  };
}
