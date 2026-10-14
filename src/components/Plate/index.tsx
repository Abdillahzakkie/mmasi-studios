"use client";

import Image from "next/image";
import type { Tone } from "@/types";
import { PlateStyled } from "./styled";

interface PlateProps {
	tone: Tone;
	ratio?: string;
	className?: string;
	/** When set, the real image renders over the graded placeholder. */
	src?: string;
	alt?: string;
	children?: React.ReactNode;
}

export default function Plate({ tone, ratio, className, src, alt, children }: PlateProps) {
	return (
		<PlateStyled $tone={tone} $ratio={ratio} className={className}>
			{src && (
				<Image
					src={src}
					alt={alt || ""}
					fill
					sizes="(max-width: 640px) 50vw, 33vw"
					// Served straight from object storage (MinIO/S3); the Next image
					// optimizer isn't in the path, so no remote-host coupling.
					unoptimized
					style={{ objectFit: "cover" }}
				/>
			)}
			{children}
		</PlateStyled>
	);
}
