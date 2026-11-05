import z from "zod";
import { ClientMarker } from "../dtos";
import { MarkersStore } from "../store/markers.store";
import { MoveClientDto, RegisterClientDto } from "../dtos/requests.dtos";

export class MarkersService {
  private readonly markersStore = new MarkersStore();

  public getAll = (_payload: unknown): ClientMarker[] => {
    return this.markersStore.getAll();
  };

  public findById = (id: string): ClientMarker => {
    const marker = this.markersStore.findById(id);
    if (!marker) {
      throw new Error(`Marker with id ${id} not found`);
    }
    return marker;
  };

  public add = (payload: RegisterClientDto): ClientMarker => {
    const newMarker = this.markersStore.add(payload);
    return newMarker;
  };

  public delete = (id: string): string => {
    const marker = this.markersStore.findById(id);

    if (!marker) {
      throw new Error(
        `Error while deleting client: client with id ${id} not found`,
      );
    }

    this.markersStore.delete(id);
    return id;
  };

  public moveMarkerCoordinates = (
    id: string,
    { coordinates }: MoveClientDto,
  ): Omit<ClientMarker, "name" | "color"> => {
    const marker = this.markersStore.findById(id);

    if (!marker) {
      throw new Error(
        `Error while MOVING client: client with id ${id} not found`,
      );
    }
    const markerUpdated = this.markersStore.moveMarkerCoordinates(
      id,
      coordinates,
    );
    return markerUpdated;
  };
}
