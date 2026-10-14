"use client";

import { Container, Eyebrow, Section } from "@/components";
import InquiryBuilder from "@/components/InquiryBuilder";
import { SOCIALS, STUDIO } from "@/constants/studio";
import type { SiteContentData } from "@/types";
import { Banner, Coords, Socials } from "./styled";

export default function ContactWrapper({
	banner,
}: {
	banner: SiteContentData["banners"]["contact"];
}) {
	return (
		<>
			<Container>
				<Banner>
					<Eyebrow>{banner.eyebrow}</Eyebrow>
					<h1>{banner.title}</h1>
					<p>{banner.intro}</p>
				</Banner>
			</Container>

			<Container>
				<Section $flush $tight>
					<InquiryBuilder />
				</Section>
			</Container>

			<Container>
				<Section $flush>
					<Coords>
						<div className="coord">
							<div className="k">WhatsApp</div>
							<div className="v wa">{STUDIO.whatsappNumber}</div>
						</div>
						<div className="coord">
							<div className="k">Based in</div>
							<div className="v">
								{STUDIO.base} · {STUDIO.availability.toLowerCase()}
							</div>
						</div>
						<div className="coord">
							<div className="k">Email</div>
							<div className="v">{STUDIO.email}</div>
						</div>
						<div className="coord">
							<div className="k">Response time</div>
							<div className="v">{STUDIO.responseTime}</div>
						</div>
					</Coords>
					<Socials>
						{SOCIALS.map((s) => (
							<a
								key={s.label}
								href={s.href}
								target="_blank"
								rel="noopener noreferrer"
							>
								{s.label}
							</a>
						))}
					</Socials>
				</Section>
			</Container>
		</>
	);
}
