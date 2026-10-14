"use client";

import { Button, Container, Eyebrow, Section } from "@/components";
import { serviceWaMessage, waLink } from "@/constants/studio";
import type { PublicService } from "@/server/data";
import type { SiteContentData } from "@/types";
import { Banner, Delivers, ServiceCard, ServiceGrid, WaCallout } from "./styled";

// The short label each card's WhatsApp button carries, per the mockup. The
// inquiry message itself uses the full service title.
const CTA_LABEL: Record<string, string> = {
	"editorial-portraits": "Inquire — Portraits",
	"wedding-stills-film": "Inquire — Weddings",
	"commercial-campaigns": "Inquire — Commercial",
	"short-form-content": "Inquire — Reels",
	"custom-monographs": "Inquire — Monograph",
	"tell-us-your-vision": "Start a conversation",
};

export default function ServicesWrapper({
	services,
	banner,
	copy,
}: {
	services: PublicService[];
	banner: SiteContentData["banners"]["services"];
	copy: SiteContentData["services"];
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

			<Section>
				<Container>
					<ServiceGrid>
						{services.map((service) => (
							<ServiceCard key={service.slug} $feature={service.feature}>
								<span className="stag">{service.tag}</span>
								<h3>{service.title}</h3>
								<p className="sdesc">{service.description}</p>
								<div className="invest">
									<b>{service.investment}</b>
									{service.investmentNote && ` ${service.investmentNote}`}
								</div>
								<Delivers>
									{service.deliverables.map((item: string) => (
										<li key={item}>{item}</li>
									))}
								</Delivers>
								<Button
									variant="wa"
									block
									href={waLink(serviceWaMessage(service.title))}
								>
									{CTA_LABEL[service.slug] ?? "Inquire on WhatsApp"}
								</Button>
							</ServiceCard>
						))}
					</ServiceGrid>
				</Container>
			</Section>

			<Section $flush>
				<Container>
					<WaCallout>
						<div className="wtext">
							<h3>{copy.calloutHeading}</h3>
							<p>{copy.calloutBody}</p>
						</div>
						<Button variant="wa" size="lg" href={waLink()}>
							{copy.calloutCta}
						</Button>
					</WaCallout>
				</Container>
			</Section>
		</>
	);
}
