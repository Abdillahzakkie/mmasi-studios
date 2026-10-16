import { collection } from "@/app/api/_lib/api";
import { Reel } from "@/server/models";

const handlers = collection(Reel, "reels");

export const GET = handlers.GET;
export const POST = handlers.POST;
