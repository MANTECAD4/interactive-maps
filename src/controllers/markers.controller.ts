import z from "zod";
import {
  RequestMessage,
  WebSocketRequestMessage,
  WebSocketRequestSchema,
  WithIdDto,
} from "../dtos/requests.dtos";
import {
  ResponseMessage,
  WebSocketResponse,
  WebSocketResponseMessage,
} from "../dtos/responses.dtos";
import { MarkersService } from "../services/markers.service";

export class MarkersController {
  private readonly markersService = new MarkersService();
  public handleMessage = (rawMessage: string): WebSocketResponse => {
    try {
      const request: WebSocketRequestMessage = JSON.parse(rawMessage);
      const { data: checkedRequest, error } =
        WebSocketRequestSchema.safeParse(request);
      if (error) {
        return {
          personal: [
            {
              type: ResponseMessage.ERROR,
              error: {
                message: `Invalid request: ${z.treeifyError(error).errors.join(", ")}`,
              },
            },
          ],
          broadcast: [],
        };
      }
      switch (checkedRequest.type) {
        case RequestMessage.GET_CLIENT_MARKERS: {
          const result = this.markersService.getAll(null);
          const sendMarkersMessage: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_MARKERS_LIST,
            payload: { clientMarkers: result },
          };
          return { personal: [sendMarkersMessage], broadcast: [] };
        }

        case RequestMessage.REGISTER_CLIENT: {
          const result = this.markersService.add(checkedRequest.payload);
          const welcomeMessage: WebSocketResponseMessage = {
            type: ResponseMessage.WELCOME,
            payload: {
              clientMarker: result,
            },
          };
          const clientJoinedMessage: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_JOINED,
            payload: {
              clientMarker: result,
            },
          };
          return {
            personal: [welcomeMessage],
            broadcast: [clientJoinedMessage],
          };
        }

        case RequestMessage.MOVE_CLIENT: {
          const result = this.markersService.moveMarkerCoordinates(
            checkedRequest.payload,
          );

          const clientMoved: WebSocketResponseMessage = {
            type: ResponseMessage.CLIENT_MOVED,
            payload: result,
          };
          return { personal: [], broadcast: [clientMoved] };
        }

        default:
          return {
            personal: [
              {
                type: ResponseMessage.ERROR,
                error: {
                  message: `Request message ${checkedRequest.type} not identified`,
                },
              },
            ],
            broadcast: [],
          };
      }
    } catch (error) {
      return {
        personal: [
          {
            type: ResponseMessage.ERROR,
            error: {
              message: (error as any).message ?? "Invalid request",
            },
          },
        ],
        broadcast: [],
      };
    }
  };

  public handleRemoveClient = (payload: WithIdDto) => {
    const result = this.markersService.delete(payload);
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
