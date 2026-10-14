import { collection } from "@/app/api/_lib/api";
import { Photo } from "@/server/models";

const handlers = collection(Photo);

export const GET = handlers.GET;
export const POST = handlers.POST;
