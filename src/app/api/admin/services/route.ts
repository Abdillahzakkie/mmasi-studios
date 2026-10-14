import { collection } from "@/app/api/_lib/api";
import { Service } from "@/server/models";

export const { GET, POST } = collection(Service);
