"use client";

import styled from "styled-components";
import { adminLight } from "@/libs/adminTheme";

/** The admin shell: forced light, rail on the left, a scrolling pane beside it. */
export const Shell = styled.div`
	${adminLight}
	display: flex;
	min-height: 100vh;
`;

export const Pane = styled.main`
	flex: 1;
	min-width: 0;
	padding: 24px 28px 48px;

	@media (max-width: 640px) {
		padding: 20px 16px 40px;
	}
`;
