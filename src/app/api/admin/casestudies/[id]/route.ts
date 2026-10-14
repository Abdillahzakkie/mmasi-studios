import { resource } from "@/app/api/_lib/api";
import { CaseStudy } from "@/server/models";

// Case studies store public image URLs (not S3 keys), so no keyFields to clean.
export const { PUT, DELETE } = resource(CaseStudy);
