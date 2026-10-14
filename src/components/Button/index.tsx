"use client";

import Link from "next/link";
import { type ButtonSize, ButtonStyled, type ButtonVariant, WaGlyph } from "./styled";

interface ButtonProps {
	variant?: ButtonVariant;
	size?: ButtonSize;
	block?: boolean;
	/** Internal route or external URL. Given, the button renders as a link. */
	href?: string;
	onClick?: () => void;
	children: React.ReactNode;
	className?: string;
	"aria-label"?: string;
}

const isExternal = (href: string) => /^https?:\/\//.test(href) || href.startsWith("mailto:");

export default function Button({
	variant = "pri",
	size = "md",
	block,
	href,
	onClick,
	children,
	className,
	...rest
}: ButtonProps) {
	const content = (
		<>
			{variant === "wa" && <WaGlyph aria-hidden />}
			{children}
		</>
	);

	const shared = {
		$variant: variant,
		$size: size,
		$block: block,
		className,
		onClick,
		...rest,
	};

	if (href) {
		if (isExternal(href)) {
			return (
				<ButtonStyled
					as="a"
					href={href}
					target="_blank"
					rel="noopener noreferrer"
					{...shared}
				>
					{content}
				</ButtonStyled>
			);
		}
		return (
			<ButtonStyled as={Link} href={href} {...shared}>
				{content}
			</ButtonStyled>
		);
	}

	return (
		<ButtonStyled type="button" {...shared}>
			{content}
		</ButtonStyled>
	);
}
