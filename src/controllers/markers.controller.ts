import z from "zod";
import {
  RequestMessage,
  WebSocketRequestMessage,
  WebSocketRequestSchema,
} from "../dtos/requests.dtos";
import {
  ResponseMessage,
  WebSocketResponse,
  WebSocketResponseMessage,
} from "../dtos/responses.dtos";
import { MarkersService } from "../services/markers.service";
import { WebSocketPayload } from "../dtos";

export class MarkersController {
  private readonly markersService = new MarkersService();
  public handleMessage = (
    rawMessage: string,
    user: WebSocketPayload | undefined,
  ): WebSocketResponse => {
    try {
      const request: WebSocketRequestMessage = JSON.parse(rawMessage);
      const { data: checkedRequest, error } =
        WebSocketRequestSchema.safeParse(request);
      if (error) {
        return this.handleError(
          `Invalid request: ${error.issues.map((issue) => issue.message).join(", ")}`,
        );
      }
      switch (checkedRequest.type) {
        case RequestMessage.GET_CLIENT_MARKERS: {
          if (!user) return this.handleError("User not registered");
          const result = this.markersService.getAll(user.id);
          const sendMarkersMessage: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_MARKERS_LIST,
            payload: { clientMarkers: result },
          };
          return { personal: [sendMarkersMessage], broadcast: [] };
        }

        case RequestMessage.REGISTER_CLIENT: {
          if (user) return this.handleError("User already registered");
          const newClientMarker = this.markersService.add(
            checkedRequest.payload,
          );
          const markersList = this.markersService.getAll(newClientMarker.id);
          // const welcomeMessage: WebSocketResponseMessage = {
          //   type: ResponseMessage.WELCOME,
          //   payload: {
          //     clientMarker: newClientMarker,
          //   },
          // };
          const markersListMessage: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_MARKERS_LIST,
            payload: {
              clientMarkers: markersList,
            },
          };
          const clientJoinedMessage: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_JOINED,
            payload: {
              clientMarker: newClientMarker,
            },
          };
          return {
            personal: [markersListMessage /* welcomeMessage */],
            broadcast: [clientJoinedMessage],
          };
        }

        case RequestMessage.MOVE_CLIENT: {
          if (!user) return this.handleError("User not registered");
          const result = this.markersService.moveMarkerCoordinates(
            user.id,
            checkedRequest.payload,
          );

          const clientMoved: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_MOVED,
            payload: result,
          };
          return { personal: [], broadcast: [clientMoved] };
        }

        default:
          return this.handleError(
            `Request message ${checkedRequest.type} not identified`,
          );
      }
    } catch (error) {
      return this.handleError((error as any).message ?? "Invalid request");
    }
  };

  private handleError = (errorMessage: string): WebSocketResponse => ({
    personal: [
      {
        type: ResponseMessage.ERROR,
        error: {
          message: errorMessage,
        },
      },
    ],
    broadcast: [],
  });

  public handleRemoveClient = (clientId: string) => {
    const result = this.markersService.delete(clientId);
    const clientLeftMessage: WebSocketResponseMessage = {
      type: ResponseMessage.CLIENT_LEFT,
      payload: { id: result },
    };
    return {
      personal: [],
      broadcast: [clientLeftMessage],
    };
  };
}
