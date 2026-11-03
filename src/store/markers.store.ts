import { ClientMarker, Coordinates, RegisterClientDto } from "../dtos";

export class MarkersStore {
  private markers: ClientMarker[] = [];

  public getAll = (): ClientMarker[] => {
    return this.markers;
  };

  public findById = (id: string): ClientMarker | null => {
    const marker = this.markers.find((marker) => marker.id === id);
    return marker ?? null;
  };

  public add = (data: RegisterClientDto): ClientMarker => {
    const id = crypto.randomUUID();
    const marker: ClientMarker = { ...data, id };
    this.markers.push(marker);
    return marker;
  };

  public delete = (id: string): string => {
    this.markers = this.markers.filter((marker) => marker.id !== id);
    return id;
  };

  public moveMarkerCoordinates = (
    id: string,
    newCoordinates: Coordinates,
  ): ClientMarker => {
    const prevStatusMarker = this.findById(id);
    if (!prevStatusMarker) throw new Error(`Marker with id ${id} not found`);

    const newStatusMarker: ClientMarker = {
      ...prevStatusMarker,
      updatedAt: new Date(),
      coordinates: newCoordinates,
    };
    this.markers = this.markers.map((marker) => {
      if (marker.id === id) {
        return newStatusMarker;
      }
      return marker;
    });

    return newStatusMarker;
  };
}
