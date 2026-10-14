import { resource } from "@/app/api/_lib/api";
import { Film } from "@/server/models";

const handlers = resource(Film, ["posterKey", "videoKey"]);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
