import { ClientMarker, Coordinates } from "../dtos";
import { RegisterClientDto } from "../dtos/requests.dtos";

export class MarkersStore {
  private markers: Map<string, ClientMarker> = new Map();

  public getAll = (): ClientMarker[] => {
    return Array.from(this.markers.values());
  };

  public findById = (id: string): ClientMarker | null => {
    const marker = this.markers.get(id);
    return marker ?? null;
  };

  public add = (data: RegisterClientDto): ClientMarker => {
    const id = crypto.randomUUID();
    const marker: ClientMarker = { ...data, id, updatedAt: new Date() };
    this.markers.set(id, marker);
    return marker;
  };

  public delete = (id: string): string => {
    this.markers.delete(id);
    return id;
  };

  public moveMarkerCoordinates = (
    id: string,
    newCoordinates: Coordinates,
  ): Omit<ClientMarker, "name" | "color"> => {
    const prevStatusMarker = this.findById(id);
    if (!prevStatusMarker)
      throw new Error(`Error on update - Marker with id ${id} not found`);

    const newStatusMarker: ClientMarker = {
      ...prevStatusMarker,
      updatedAt: new Date(),
      coordinates: newCoordinates,
    };

    this.markers.set(id, newStatusMarker);

    const { color, name, ...rest } = newStatusMarker;

    return rest;
  };
}
