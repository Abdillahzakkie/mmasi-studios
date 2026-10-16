"use client";

import { useState } from "react";
import useSWR from "swr";
import { Button } from "@/components";
import type { PolicyDocument } from "@/constants/iam";
import {
	Badge,
	Card,
	Chip,
	EmptyBox,
	FormGrid,
	Muted,
	PaneHead,
	Pill,
	Seg,
	TableCard,
} from "@/libs/adminUi";
import PolicyBuilder from "./PolicyBuilder";
import { summarizeDocument } from "./permissions";
import { CardHead, ListRow, TabBar } from "./styled";

const fetcher = (url: string) => fetch(url).then((r) => r.json());
// Treat a missing status as active (the first admin predates the status field).
const isActive = (s?: string) => s !== "disabled";
const initials = (name: string) =>
	name
		.split(/\s+/)
		.map((w) => w[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase() || "–";

interface Ref {
	id: string;
	name: string;
}
interface ApiPolicy {
	id: string;
	name: string;
	description: string;
	managedBy: "system" | "custom";
	document: PolicyDocument;
}
interface ApiUser {
	id: string;
	name: string;
	email: string;
	status?: "active" | "disabled";
	groups: Ref[];
}
interface ApiMember extends Ref {
	email: string;
	status?: "active" | "disabled";
}
interface ApiGroup {
	id: string;
	name: string;
	description: string;
	managedBy?: "system" | "custom";
	policies: Ref[];
	members: ApiMember[];
}

type Tab = "team" | "groups" | "policies";
type TabProps = { tab: Tab; setTab: (t: Tab) => void };

async function send(url: string, method: string, body?: unknown) {
	const res = await fetch(url, {
		method,
		headers: body ? { "Content-Type": "application/json" } : undefined,
		body: body ? JSON.stringify(body) : undefined,
	});
	if (!res.ok) {
		const data = await res.json().catch(() => ({}));
		throw new Error(data.error || `Request failed (${res.status}).`);
	}
	return res.json().catch(() => ({}));
}

/** A row of toggleable chips for picking several items (groups, policies…). */
function ChipPicker({
	options,
	selected,
	onToggle,
	empty,
}: {
	options: Ref[];
	selected: string[];
	onToggle: (id: string) => void;
	empty: string;
}) {
	if (options.length === 0) return <Muted>{empty}</Muted>;
	return (
		<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
			{options.map((o) => {
				const on = selected.includes(o.id);
				return (
					<button
						key={o.id}
						type="button"
						onClick={() => onToggle(o.id)}
						style={{
							padding: "6px 12px",
							borderRadius: "var(--mm-r-pill)",
							border: `1px solid ${on ? "var(--mm-gold-500)" : "var(--mm-line)"}`,
							background: on ? "var(--mm-gold-50)" : "var(--mm-surface)",
							color: on ? "var(--mm-gold-700)" : "var(--mm-ink-2)",
							fontSize: 13,
							fontWeight: 600,
							cursor: "pointer",
						}}
					>
						{on ? "✓ " : ""}
						{o.name}
					</button>
				);
			})}
		</div>
	);
}

// ── Permission sets ──────────────────────────────────────────────────────────
function PolicyForm({ policy, onDone }: { policy: ApiPolicy | null; onDone: () => void }) {
	const [name, setName] = useState(policy?.name ?? "");
	const [description, setDescription] = useState(policy?.description ?? "");
	const [document, setDocument] = useState<PolicyDocument>(policy?.document ?? {});
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState("");

	const save = async () => {
		if (!name.trim()) return setErr("Give the permission set a name.");
		setBusy(true);
		setErr("");
		try {
			await send(
				policy ? `/api/admin/iam/policies/${policy.id}` : "/api/admin/iam/policies",
				policy ? "PATCH" : "POST",
				{ name: name.trim(), description, document },
			);
			onDone();
		} catch (e) {
			setErr((e as Error).message);
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>{policy ? "Permission set" : "New permission set"}</h1>
					<p>Choose what this set can do — in plain words</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save permission set"}
					</Button>
				</div>
			</PaneHead>
			<Card style={{ marginBottom: 14 }}>
				<FormGrid>
					<div>
						<label htmlFor="pol-name">Name</label>
						<input
							id="pol-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="pol-desc">What it's for</label>
						<input
							id="pol-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</FormGrid>
			</Card>
			<Card>
				<h2>What can this set touch?</h2>
				<PolicyBuilder initial={policy?.document} onChange={setDocument} />
			</Card>
			{err && <Muted style={{ color: "var(--mm-danger)", marginTop: 10 }}>{err}</Muted>}
		</>
	);
}

function PoliciesTab({ tab, setTab }: TabProps) {
	const { data, isLoading, mutate } = useSWR<ApiPolicy[]>("/api/admin/iam/policies", fetcher);
	const policies = data ?? [];
	const [editing, setEditing] = useState<ApiPolicy | "new" | null>(null);

	const remove = async (p: ApiPolicy) => {
		await fetch(`/api/admin/iam/policies/${p.id}`, { method: "DELETE" });
		mutate();
	};

	if (editing) {
		return (
			<PolicyForm
				policy={editing === "new" ? null : editing}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	return (
		<>
			<PaneHead>
				<div>
					<h1>Access &amp; team</h1>
					<p>Permission sets — what a group is allowed to touch</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						New permission set
					</Button>
				</div>
			</PaneHead>
			<TabBar>
				<IamTabs tab={tab} setTab={setTab} />
			</TabBar>
			{isLoading ? (
				<Muted>Loading permission sets…</Muted>
			) : policies.length === 0 ? (
				<EmptyBox>
					<span className="eglyph" aria-hidden />
					<h2>No permission sets yet</h2>
					<p>A permission set says what a group of teammates can see and change.</p>
				</EmptyBox>
			) : (
				policies.map((p) => (
					<Card key={p.id} style={{ marginBottom: 12 }}>
						<CardHead>
							<div>
								<div className="ch-title">
									{p.name}
									<Badge>
										{p.managedBy === "system" ? "built in" : "custom"}
									</Badge>
								</div>
								<div className="ch-sub">
									{p.description || summarizeDocument(p.document)}
								</div>
							</div>
							{p.managedBy !== "system" && (
								<div className="ch-acts">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setEditing(p)}
									>
										Edit
									</Button>
									<Button variant="ghost" size="sm" onClick={() => remove(p)}>
										Delete
									</Button>
								</div>
							)}
						</CardHead>
						<Muted>{summarizeDocument(p.document)}</Muted>
					</Card>
				))
			)}
		</>
	);
}

// ── Groups ───────────────────────────────────────────────────────────────────
function GroupForm({
	group,
	policies,
	users,
	onDone,
}: {
	group: ApiGroup | null;
	policies: ApiPolicy[];
	users: ApiUser[];
	onDone: () => void;
}) {
	const [name, setName] = useState(group?.name ?? "");
	const [description, setDescription] = useState(group?.description ?? "");
	const [policyIds, setPolicyIds] = useState<string[]>(group?.policies.map((p) => p.id) ?? []);
	const [memberIds, setMemberIds] = useState<string[]>(group?.members.map((m) => m.id) ?? []);
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState("");

	const toggle = (list: string[], set: (v: string[]) => void, id: string) =>
		set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

	const save = async () => {
		if (!name.trim()) return setErr("Give the group a name.");
		setBusy(true);
		setErr("");
		try {
			await send(
				group ? `/api/admin/iam/groups/${group.id}` : "/api/admin/iam/groups",
				group ? "PATCH" : "POST",
				{ name: name.trim(), description, policyIds, memberIds },
			);
			onDone();
		} catch (e) {
			setErr((e as Error).message);
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>{group ? "Edit group" : "New group"}</h1>
					<p>A group bundles permission sets and the people who get them</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : "Save group"}
					</Button>
				</div>
			</PaneHead>
			<Card style={{ marginBottom: 14 }}>
				<FormGrid>
					<div>
						<label htmlFor="grp-name">Name</label>
						<input
							id="grp-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="grp-desc">What it's for</label>
						<input
							id="grp-desc"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>
				</FormGrid>
			</Card>
			<Card style={{ marginBottom: 14 }}>
				<h2>Permission sets</h2>
				<ChipPicker
					options={policies.map((p) => ({ id: p.id, name: p.name }))}
					selected={policyIds}
					onToggle={(id) => toggle(policyIds, setPolicyIds, id)}
					empty="Create a permission set first."
				/>
			</Card>
			<Card>
				<h2>Members</h2>
				<ChipPicker
					options={users.map((u) => ({ id: u.id, name: u.name || u.email }))}
					selected={memberIds}
					onToggle={(id) => toggle(memberIds, setMemberIds, id)}
					empty="Invite a teammate first."
				/>
			</Card>
			{err && <Muted style={{ color: "var(--mm-danger)", marginTop: 10 }}>{err}</Muted>}
		</>
	);
}

function GroupsTab({ tab, setTab }: TabProps) {
	const {
		data: groups,
		isLoading,
		mutate,
	} = useSWR<ApiGroup[]>("/api/admin/iam/groups", fetcher);
	const { data: policies } = useSWR<ApiPolicy[]>("/api/admin/iam/policies", fetcher);
	const { data: users } = useSWR<ApiUser[]>("/api/admin/iam/users", fetcher);
	const [editing, setEditing] = useState<ApiGroup | "new" | null>(null);

	const remove = async (g: ApiGroup) => {
		await fetch(`/api/admin/iam/groups/${g.id}`, { method: "DELETE" });
		mutate();
	};

	if (editing) {
		return (
			<GroupForm
				group={editing === "new" ? null : editing}
				policies={policies ?? []}
				users={users ?? []}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	return (
		<>
			<PaneHead>
				<div>
					<h1>Access &amp; team</h1>
					<p>Groups — a role for a kind of teammate</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						New group
					</Button>
				</div>
			</PaneHead>
			<TabBar>
				<IamTabs tab={tab} setTab={setTab} />
			</TabBar>
			{isLoading ? (
				<Muted>Loading groups…</Muted>
			) : (groups ?? []).length === 0 ? (
				<EmptyBox>
					<span className="eglyph" aria-hidden />
					<h2>No groups yet</h2>
					<p>
						A group is a role — Owners, Editors, Viewers — with its people and
						permissions.
					</p>
				</EmptyBox>
			) : (
				(groups ?? []).map((g) => (
					<Card key={g.id} style={{ marginBottom: 14 }}>
						<CardHead>
							<div>
								<div className="ch-title">
									{g.name}
									<Badge>
										{g.managedBy === "system" ? "built in" : "custom"}
									</Badge>
								</div>
								<div className="ch-sub">
									{g.description}
									{g.policies.map((p) => (
										<Chip key={p.id}>{p.name}</Chip>
									))}
								</div>
							</div>
							<div className="ch-acts">
								<Button variant="outline" size="sm" onClick={() => setEditing(g)}>
									Edit
								</Button>
								{g.managedBy !== "system" && (
									<Button variant="ghost" size="sm" onClick={() => remove(g)}>
										Delete
									</Button>
								)}
							</div>
						</CardHead>
						{g.members.length === 0 ? (
							<Muted>No members yet.</Muted>
						) : (
							g.members.map((m) => (
								<ListRow key={m.id}>
									<div className="who">
										<span className="lav">{initials(m.name || m.email)}</span>
										<div className="meta">
											<b>{m.name || m.email}</b>
											<span>{m.email}</span>
										</div>
									</div>
									<Pill $tone={isActive(m.status) ? "ok" : "idle"}>
										{isActive(m.status) ? "Active" : "Disabled"}
									</Pill>
								</ListRow>
							))
						)}
					</Card>
				))
			)}
		</>
	);
}

// ── Team ─────────────────────────────────────────────────────────────────────
function TeamForm({
	user,
	groups,
	onDone,
}: {
	user: ApiUser | null;
	groups: ApiGroup[];
	onDone: () => void;
}) {
	const [name, setName] = useState(user?.name ?? "");
	const [email, setEmail] = useState(user?.email ?? "");
	const [password, setPassword] = useState("");
	const [status, setStatus] = useState<"active" | "disabled">(user?.status ?? "active");
	const [groupIds, setGroupIds] = useState<string[]>(user?.groups.map((g) => g.id) ?? []);
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState("");

	const save = async () => {
		if (!email.trim()) return setErr("Enter an email address.");
		if (!user && !password) return setErr("Set a password for the new teammate.");
		setBusy(true);
		setErr("");
		try {
			await send(
				user ? `/api/admin/iam/users/${user.id}` : "/api/admin/iam/users",
				user ? "PATCH" : "POST",
				{
					name: name.trim(),
					...(user ? {} : { email: email.trim() }),
					...(password ? { password } : {}),
					status,
					groupIds,
				},
			);
			onDone();
		} catch (e) {
			setErr((e as Error).message);
			setBusy(false);
		}
	};

	return (
		<>
			<PaneHead>
				<div>
					<h1>{user ? "Edit teammate" : "Invite teammate"}</h1>
					<p>Their own sign-in, and the groups that decide what they can do</p>
				</div>
				<div className="actions">
					<Button variant="outline" onClick={onDone}>
						Cancel
					</Button>
					<Button variant="pri" onClick={save}>
						{busy ? "Saving…" : user ? "Save teammate" : "Send invite"}
					</Button>
				</div>
			</PaneHead>
			<Card style={{ marginBottom: 14 }}>
				<FormGrid>
					<div>
						<label htmlFor="usr-name">Name</label>
						<input
							id="usr-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="usr-email">Email</label>
						<input
							id="usr-email"
							type="email"
							value={email}
							disabled={!!user}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div>
						<label htmlFor="usr-pass">
							{user ? "New password (optional)" : "Password"}
						</label>
						<input
							id="usr-pass"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>
					<div>
						{/* biome-ignore lint/a11y/noLabelWithoutControl: labels a segmented control */}
						<label>Status</label>
						<Seg>
							<button
								type="button"
								data-on={status === "active"}
								onClick={() => setStatus("active")}
							>
								Active
							</button>
							<button
								type="button"
								data-on={status === "disabled"}
								onClick={() => setStatus("disabled")}
							>
								Disabled
							</button>
						</Seg>
					</div>
				</FormGrid>
			</Card>
			<Card>
				<h2>Groups</h2>
				<ChipPicker
					options={groups.map((g) => ({ id: g.id, name: g.name }))}
					selected={groupIds}
					onToggle={(id) =>
						setGroupIds(
							groupIds.includes(id)
								? groupIds.filter((x) => x !== id)
								: [...groupIds, id],
						)
					}
					empty="Create a group first."
				/>
			</Card>
			{err && <Muted style={{ color: "var(--mm-danger)", marginTop: 10 }}>{err}</Muted>}
		</>
	);
}

function TeamTab({ tab, setTab }: TabProps) {
	const { data: users, isLoading, mutate } = useSWR<ApiUser[]>("/api/admin/iam/users", fetcher);
	const { data: groups } = useSWR<ApiGroup[]>("/api/admin/iam/groups", fetcher);
	const { data: me } = useSWR<{ email: string }>("/api/auth/me", fetcher);
	const [editing, setEditing] = useState<ApiUser | "new" | null>(null);
	const [err, setErr] = useState("");

	const remove = async (u: ApiUser) => {
		if (
			!window.confirm(
				`Delete ${u.name || u.email}? This removes their sign-in and passkeys, and can't be undone.`,
			)
		)
			return;
		setErr("");
		try {
			await send(`/api/admin/iam/users/${u.id}`, "DELETE");
			mutate();
		} catch (e) {
			setErr((e as Error).message);
		}
	};

	if (editing) {
		return (
			<TeamForm
				user={editing === "new" ? null : editing}
				groups={groups ?? []}
				onDone={() => {
					setEditing(null);
					mutate();
				}}
			/>
		);
	}

	return (
		<>
			<PaneHead>
				<div>
					<h1>Access &amp; team</h1>
					<p>
						{(users ?? []).length} people can sign in · groups decide what each can
						touch
					</p>
				</div>
				<div className="actions">
					<Button variant="pri" onClick={() => setEditing("new")}>
						Invite teammate
					</Button>
				</div>
			</PaneHead>
			<TabBar>
				<IamTabs tab={tab} setTab={setTab} />
			</TabBar>
			{err && <Muted style={{ color: "var(--mm-danger)", marginBottom: 10 }}>{err}</Muted>}
			{isLoading ? (
				<Muted>Loading team…</Muted>
			) : (
				<TableCard>
					<table>
						<thead>
							<tr>
								<th>Teammate</th>
								<th>Group</th>
								<th>Status</th>
								<th>Actions</th>
							</tr>
						</thead>
						<tbody>
							{(users ?? []).map((u) => (
								<tr key={u.id}>
									<td>
										<div className="cell-main">
											<div>
												<span className="title">{u.name || u.email}</span>
												<span className="sub">{u.email}</span>
											</div>
										</div>
									</td>
									<td>
										{u.groups.length === 0 ? (
											<Muted>none</Muted>
										) : (
											u.groups.map((g) => <Chip key={g.id}>{g.name}</Chip>)
										)}
									</td>
									<td>
										<Pill $tone={isActive(u.status) ? "ok" : "idle"}>
											{isActive(u.status) ? "Active" : "Disabled"}
										</Pill>
									</td>
									<td>
										<div className="row-actions">
											<Button
												variant="outline"
												size="sm"
												onClick={() => setEditing(u)}
											>
												Edit
											</Button>
											{u.email !== me?.email && (
												<Button
													variant="ghost"
													size="sm"
													onClick={() => remove(u)}
												>
													Delete
												</Button>
											)}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</TableCard>
			)}
		</>
	);
}

// ── Shell ────────────────────────────────────────────────────────────────────
function IamTabs({ tab, setTab }: TabProps) {
	return (
		<Seg>
			<button type="button" data-on={tab === "team"} onClick={() => setTab("team")}>
				Team
			</button>
			<button type="button" data-on={tab === "groups"} onClick={() => setTab("groups")}>
				Groups
			</button>
			<button type="button" data-on={tab === "policies"} onClick={() => setTab("policies")}>
				Permission sets
			</button>
		</Seg>
	);
}

export default function AdminIamWrapper() {
	const [tab, setTab] = useState<Tab>("team");
	if (tab === "groups") return <GroupsTab tab={tab} setTab={setTab} />;
	if (tab === "policies") return <PoliciesTab tab={tab} setTab={setTab} />;
	return <TeamTab tab={tab} setTab={setTab} />;
}
