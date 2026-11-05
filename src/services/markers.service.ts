import z from "zod";
import { ClientMarker } from "../dtos";
import { MarkersStore } from "../store/markers.store";
import {
  MoveClientDto,
  RegisterClientDto,
  WithIdDto,
} from "../dtos/requests.dtos";

export class MarkersService {
  private readonly markersStore = new MarkersStore();

  public getAll = (_payload: unknown): ClientMarker[] => {
    return this.markersStore.getAll();
  };

  public findById = (payload: WithIdDto): ClientMarker => {
    const marker = this.markersStore.findById(payload.id);
    if (!marker) {
      throw new Error(`Marker with id ${payload.id} not found`);
    }
    return marker;
  };

  public add = (payload: RegisterClientDto): ClientMarker => {
    const newMarker = this.markersStore.add(payload);
    return newMarker;
  };

  public delete = (payload: WithIdDto): string => {
    const marker = this.markersStore.findById(payload.id);

    if (!marker) {
      throw new Error(
        `Error while deleting client: client with id ${payload.id} not found`,
      );
    }

    this.markersStore.delete(payload.id);
    return payload.id;
  };

  public moveMarkerCoordinates = (
    payload: MoveClientDto,
  ): Omit<ClientMarker, "name" | "color"> => {
    const marker = this.markersStore.findById(payload.id);

    if (!marker) {
      throw new Error(
        `Error while MOVING client: client with id ${payload.id} not found`,
      );
    }
    const markerUpdated = this.markersStore.moveMarkerCoordinates(
      payload.id,
      payload.coordinates,
    );
    return markerUpdated;
  };
}
