import { resource } from "@/app/api/_lib/api";
import { Reel } from "@/server/models";

const handlers = resource(Reel, ["posterKey", "videoKey"]);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
