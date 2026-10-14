import { resource } from "@/app/api/_lib/api";
import { Photo } from "@/server/models";

const handlers = resource(Photo, ["imageKey"]);

export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
