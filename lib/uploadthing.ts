// Resource: https://docs.uploadthing.com/api-reference/react#generatereacthelpers
// Copy paste (be careful with imports)

import type { OurFileRouter } from "@/app/api/uploadthing/core";
import { generateComponents } from "@uploadthing/react";

export const { UploadButton } = generateComponents<OurFileRouter>();
