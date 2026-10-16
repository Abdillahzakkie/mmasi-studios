import { collection } from "@/app/api/_lib/api";
import { Film } from "@/server/models";

const handlers = collection(Film, "films");

export const GET = handlers.GET;
export const POST = handlers.POST;
