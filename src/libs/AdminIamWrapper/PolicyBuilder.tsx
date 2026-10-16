"use client";

import { useState } from "react";
import { ACCESS, isValidDocument, type PolicyDocument } from "@/constants/iam";
import {
	BUILDER_ROWS,
	documentFromSelections,
	LEVEL_LABELS,
	type Selections,
	selectionsFromDocument,
} from "./permissions";
import { Advanced, LevelSeg, PermList, PermRow } from "./styled";

/**
 * The friendly permission builder: one Off / View / Manage choice per thing the
 * studio owns. The owner never writes a policy; the Advanced view shows the same
 * choices as the document the backend stores, and edits there flow back into the
 * builder so nothing is ever out of sync.
 */
export default function PolicyBuilder({
	initial,
	onChange,
}: {
	initial?: PolicyDocument;
	onChange: (doc: PolicyDocument) => void;
}) {
	const [sel, setSel] = useState<Selections>(() => selectionsFromDocument(initial));
	const [adv, setAdv] = useState(() =>
		JSON.stringify(documentFromSelections(selectionsFromDocument(initial)), null, 2),
	);
	const [jsonErr, setJsonErr] = useState("");

	const apply = (next: Selections) => {
		setSel(next);
		const doc = documentFromSelections(next);
		setAdv(JSON.stringify(doc, null, 2));
		setJsonErr("");
		onChange(doc);
	};

	const onAdv = (text: string) => {
		setAdv(text);
		let parsed: unknown;
		try {
			parsed = JSON.parse(text);
		} catch {
			setJsonErr("That is not valid JSON.");
			return;
		}
		if (!isValidDocument(parsed)) {
			setJsonErr('Each line must be a known section set to "read" or "full".');
			return;
		}
		setJsonErr("");
		setSel(selectionsFromDocument(parsed));
		onChange(parsed);
	};

	return (
		<>
			<PermList>
				{BUILDER_ROWS.map((row) => (
					<PermRow key={row.id}>
						<div>
							<div className="pname">{row.label}</div>
							<div className="pdesc">{row.desc}</div>
						</div>
						<LevelSeg role="group" aria-label={`Access to ${row.label}`}>
							{ACCESS.map((level) => (
								<button
									key={level}
									type="button"
									data-on={sel[row.id] === level ? level : undefined}
									aria-pressed={sel[row.id] === level}
									onClick={() => apply({ ...sel, [row.id]: level })}
								>
									{LEVEL_LABELS[level]}
								</button>
							))}
						</LevelSeg>
					</PermRow>
				))}
			</PermList>

			<Advanced>
				<summary>Advanced — show as a document</summary>
				<textarea
					value={adv}
					spellCheck={false}
					onChange={(e) => onAdv(e.target.value)}
					aria-label="Policy document as JSON"
				/>
				{jsonErr && <div className="err">{jsonErr}</div>}
			</Advanced>
		</>
	);
}
