import { resource } from "@/app/api/_lib/api";
import { Service } from "@/server/models";

export const { PUT, DELETE } = resource(Service, "services");
