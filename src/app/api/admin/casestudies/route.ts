import { collection } from "@/app/api/_lib/api";
import { CaseStudy } from "@/server/models";

export const { GET, POST } = collection(CaseStudy);
