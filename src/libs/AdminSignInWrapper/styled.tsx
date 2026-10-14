"use client";

import styled from "styled-components";
import { adminLight } from "@/libs/adminTheme";

export const SignInShell = styled.div`
	${adminLight}
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
`;

export const SignCard = styled.div`
	width: 400px;
	max-width: 100%;
	background: var(--mm-surface);
	border: 1px solid var(--mm-line);
	border-radius: var(--mm-r-lg);
	padding: 34px 30px;
	box-shadow: var(--mm-shadow);
	display: flex;
	flex-direction: column;
	gap: 16px;

	.brand {
		display: flex;
		justify-content: center;
		margin-bottom: 4px;
	}
	.hint {
		font-size: 13px;
		color: var(--mm-ink-3);
		margin: 0;
		text-align: center;
	}
	.error {
		font-size: 13px;
		color: var(--mm-danger);
		margin: 0;
		text-align: center;
	}
`;
