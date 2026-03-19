import { useState, useEffect, useMemo } from "react";

//  Mock data
const DESIGNERS_DATA = [
  {
    id: 1,
    name: "Arjun Mehta",
    email: "arjun@oralab.com",
    phone: "+91 98110 34567",
    status: "Active",
    activeCases: 8,
    completedCases: 134,
    tatCompliance: 94,
    avgTurnaround: 2.1,
    joinedDate: "2023-04-12",
    lastLogin: "2025-06-14T09:30:00Z",
    specialization: "Crowns & Bridges",
  },
  {
    id: 2,
    name: "Sara Liu",
    email: "sara@oralab.com",
    phone: "+91 98201 56789",
    status: "Active",
    activeCases: 5,
    completedCases: 98,
    tatCompliance: 88,
    avgTurnaround: 2.8,
    joinedDate: "2023-07-20",
    lastLogin: "2025-06-14T08:15:00Z",
    specialization: "Veneers & Aligners",
  },
  {
    id: 3,
    name: "Tom Reed",
    email: "tom@oralab.com",
    phone: "+91 98450 23456",
    status: "Active",
    activeCases: 11,
    completedCases: 210,
    tatCompliance: 91,
    avgTurnaround: 2.3,
    joinedDate: "2022-11-05",
    lastLogin: "2025-06-13T17:45:00Z",
    specialization: "Implants",
  },
  {
    id: 4,
    name: "Priya Sharma",
    email: "priya@oralab.com",
    phone: "+91 98250 78901",
    status: "Active",
    activeCases: 6,
    completedCases: 77,
    tatCompliance: 96,
    avgTurnaround: 1.9,
    joinedDate: "2024-01-15",
    lastLogin: "2025-06-14T10:00:00Z",
    specialization: "Nightguards",
  },
  {
    id: 5,
    name: "Rahul Nair",
    email: "rahul@oralab.com",
    phone: "+91 98401 12345",
    status: "Suspended",
    activeCases: 0,
    completedCases: 42,
    tatCompliance: 71,
    avgTurnaround: 4.2,
    joinedDate: "2023-09-08",
    lastLogin: "2025-05-20T14:00:00Z",
    specialization: "Crowns & Bridges",
  },
  {
    id: 6,
    name: "Kavita Patel",
    email: "kavita@oralab.com",
    phone: "+91 98220 67890",
    status: "Active",
    activeCases: 9,
    completedCases: 156,
    tatCompliance: 89,
    avgTurnaround: 2.6,
    joinedDate: "2023-02-28",
    lastLogin: "2025-06-14T07:50:00Z",
    specialization: "Veneers & Aligners",
  },
  {
    id: 7,
    name: "Dev Shah",
    email: "dev@oralab.com",
    phone: "+91 98110 99001",
    status: "Inactive",
    activeCases: 0,
    completedCases: 18,
    tatCompliance: 80,
    avgTurnaround: 3.1,
    joinedDate: "2024-08-01",
    lastLogin: "2025-04-10T11:20:00Z",
    specialization: "Implants",
  },
];

const CASES_BY_DESIGNER = {
  1: [
    {
      id: "C-1041",
      patient: "Sneha Pillai",
      type: "Crown",
      status: "Review",
      deadline: "2025-06-15",
      submitted: "2025-06-12",
    },
    {
      id: "C-1035",
      patient: "Amit Verma",
      type: "Bridge",
      status: "In Progress",
      deadline: "2025-06-17",
      submitted: "2025-06-13",
    },
    {
      id: "C-1029",
      patient: "Rohan Gupta",
      type: "Veneer",
      status: "Completed",
      deadline: "2025-06-10",
      submitted: "2025-06-09",
    },
  ],
  2: [
    {
      id: "C-1044",
      patient: "Hetal Patel",
      type: "Aligner",
      status: "In Progress",
      deadline: "2025-06-16",
      submitted: "2025-06-13",
    },
    {
      id: "C-1038",
      patient: "Darshan Shah",
      type: "Veneer",
      status: "Completed",
      deadline: "2025-06-11",
      submitted: "2025-06-10",
    },
  ],
  3: [
    {
      id: "C-1042",
      patient: "Kavya Rao",
      type: "Implant",
      status: "In Progress",
      deadline: "2025-06-18",
      submitted: "2025-06-11",
    },
    {
      id: "C-1039",
      patient: "Nikhil Joshi",
      type: "Crown",
      status: "Overdue",
      deadline: "2025-06-12",
      submitted: "2025-06-10",
    },
    {
      id: "C-1036",
      patient: "Pooja Mehta",
      type: "Implant",
      status: "Completed",
      deadline: "2025-06-09",
      submitted: "2025-06-08",
    },
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const PERF_DATA = [18, 24, 20, 28, 25, 30];

const SPECIALIZATIONS = [
  "Crowns & Bridges",
  "Veneers & Aligners",
  "Implants",
  "Nightguards",
];

const BLANK_FORM = {
  name: "",
  email: "",
  phone: "",
  specialization: "Crowns & Bridges",
  status: "Active",
};

// ─── Style maps ───────────────────────────────────────────────────────────────
const STATUS_STYLES = {
  Active: "bg-green-50 text-green-700 border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
  Suspended: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_DOT = {
  Active: "bg-green-500",
  Inactive: "bg-gray-400",
  Suspended: "bg-red-500",
};

const CASE_STATUS_STYLES = {
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-green-700",
  Review: "bg-yellow-50 text-yellow-700",
  Overdue: "bg-red-50 text-red-700",
  Pending: "bg-gray-100 text-gray-600",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ago`;
  if (h > 0) return `${h}h ago`;
  return "Just now";
}

function TatBar({ value }) {
  const color =
    value >= 90 ? "bg-green-500" : value >= 80 ? "bg-amber-400" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span
        className={`text-xs font-semibold w-9 text-right ${value >= 90 ? "text-green-600" : value >= 80 ? "text-amber-600" : "text-red-600"}`}
      >
        {value}%
      </span>
    </div>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status] ?? "bg-gray-400"}`}
      />
      {status}
    </span>
  );
}

function CaseStatusBadge({ status }) {
  return (
    <span
      className={`text-xs font-medium px-2.5 py-1 rounded-full ${CASE_STATUS_STYLES[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}

function StatCard({ label, value, sub, subGreen = true }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1 min-w-24">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && (
        <p
          className={`text-xs mt-0.5 ${subGreen ? "text-green-600" : "text-gray-400"}`}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function MiniBarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-20 mt-3">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full rounded-t"
            style={{
              height: `${(v / max) * 100}%`,
              background: "#4f46e5",
              opacity: i === data.length - 1 ? 1 : 0.4,
            }}
          />
          <span className="text-xs text-gray-400">{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Avatar initials ──────────────────────────────────────────────────────────
const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-purple-100 text-purple-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-pink-100 text-pink-700",
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
];

function Avatar({ name, id, size = "md" }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const color = AVATAR_COLORS[id % AVATAR_COLORS.length];
  const sz = size === "lg" ? "w-12 h-12 text-base" : "w-9 h-9 text-sm";
  return (
    <div
      className={`${sz} ${color} rounded-xl flex items-center justify-center font-semibold shrink-0`}
    >
      {initials}
    </div>
  );
}

// ─── Add / Edit modal ─────────────────────────────────────────────────────────
function DesignerModal({ show, onClose, onSave, editData }) {
  const [form, setForm] = useState(editData ?? BLANK_FORM);

  // FIX: Replaced useMemo with useEffect to prevent state locking during render
  useEffect(() => {
    if (show) {
      setForm(editData ?? BLANK_FORM);
    }
  }, [show, editData]);

  if (!show) return null;
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const Field = ({ label, fieldKey, type = "text", colSpan = false }) => (
    <div className={colSpan ? "col-span-2" : ""}>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[fieldKey]}
        onChange={(e) => set(fieldKey, e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
      />
    </div>
  );

  const Select = ({ label, fieldKey, options }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      <select
        value={form[fieldKey]}
        onChange={(e) => set(fieldKey, e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {editData ? "Edit Designer" : "Add New Designer"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid grid-cols-2 gap-4">
          <Field label="Full name" fieldKey="name" colSpan />
          <Field label="Email" fieldKey="email" type="email" />
          <Field label="Phone" fieldKey="phone" />
          <Select
            label="Specialization"
            fieldKey="specialization"
            options={SPECIALIZATIONS}
          />
          <Select
            label="Status"
            fieldKey="status"
            options={["Active", "Inactive", "Suspended"]}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
          >
            {editData ? "Save changes" : "Add designer"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Reassign case modal ──────────────────────────────────────────────────────
function ReassignModal({
  show,
  caseItem,
  designers,
  currentDesignerId,
  onClose,
  onReassign,
}) {
  const [selectedId, setSelectedId] = useState("");
  useEffect(() => {
    if (show) setSelectedId("");
  }, [caseItem, show]);

  if (!show || !caseItem) return null;

  const others = designers.filter(
    (d) => d.id !== currentDesignerId && d.status === "Active",
  );

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Reassign Case</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-xl leading-none"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5 space-y-4">
          <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
            <p className="font-semibold text-gray-900">{caseItem.id}</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {caseItem.patient} · {caseItem.type}
            </p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Reassign to
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
            >
              <option value="">— Select designer —</option>
              {others.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.activeCases} active cases)
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={!selectedId}
            onClick={() => onReassign(caseItem.id, Number(selectedId))}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
          >
            Reassign
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Designer detail view ─────────────────────────────────────────────────────
function DesignerDetail({
  designer,
  allDesigners,
  onBack,
  onEdit,
  onToggleStatus,
}) {
  const [tab, setTab] = useState("cases");
  const [reassignCase, setReassign] = useState(null);
  const cases = CASES_BY_DESIGNER[designer.id] ?? [];

  const tabs = [
    { key: "cases", label: "Assigned Cases" },
    { key: "performance", label: "Performance" },
    { key: "account", label: "Account Details" },
  ];

  const statusCycle = {
    Active: {
      label: "Suspend",
      next: "Suspended",
      cls: "bg-red-50 text-red-600 hover:bg-red-100",
    },
    Suspended: {
      label: "Reactivate",
      next: "Active",
      cls: "bg-green-50 text-green-700 hover:bg-green-100",
    },
    Inactive: {
      label: "Activate",
      next: "Active",
      cls: "bg-green-50 text-green-700 hover:bg-green-100",
    },
  };
  const action = statusCycle[designer.status];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Designers
      </button>

      {/* Profile header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Avatar name={designer.name} id={designer.id} size="lg" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {designer.name}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {designer.specialization}
              </p>
              <p className="text-sm text-indigo-600 mt-0.5">{designer.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge status={designer.status} />
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            {action && (
              <button
                onClick={() => onToggleStatus(designer.id, action.next)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${action.cls}`}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <StatCard label="Active Cases" value={designer.activeCases} />
          <StatCard
            label="Completed"
            value={designer.completedCases}
            sub={`Since ${designer.joinedDate.slice(0, 4)}`}
          />
          <StatCard
            label="TAT Compliance"
            value={`${designer.tatCompliance}%`}
            sub={designer.tatCompliance >= 90 ? "✓ On target" : "Below target"}
            subGreen={designer.tatCompliance >= 90}
          />
          <StatCard
            label="Avg Turnaround"
            value={`${designer.avgTurnaround}d`}
            sub="Calendar days"
            subGreen={false}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-6 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {/* ── Assigned Cases tab ── */}
          {tab === "cases" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {cases.length} cases currently tracked
                </p>
              </div>
              {cases.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">
                  No cases assigned.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {[
                        "Case ID",
                        "Patient",
                        "Type",
                        "Status",
                        "Deadline",
                        "Actions",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {cases.map((c) => (
                      <tr
                        key={c.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-indigo-700">
                          {c.id}
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {c.patient}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{c.type}</td>
                        <td className="px-4 py-3">
                          <CaseStatusBadge status={c.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                          {c.deadline}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setReassign(c)}
                            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium border border-indigo-100 hover:border-indigo-300 px-2.5 py-1 rounded-lg transition-colors"
                          >
                            Reassign
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ── Performance tab ── */}
          {tab === "performance" && (
            <div className="space-y-5">
              {/* TAT compliance bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    TAT Compliance
                  </p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">
                    {designer.tatCompliance}%
                  </p>
                  <TatBar value={designer.tatCompliance} />
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Avg Turnaround
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {designer.avgTurnaround}d
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Calendar days per case
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
                    Total Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {designer.completedCases}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Since joining</p>
                </div>
              </div>

              {/* Bar chart */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Monthly cases completed
                </p>
                <p className="text-xs text-gray-400 mt-0.5 mb-1">
                  Last 6 months
                </p>
                <MiniBarChart data={PERF_DATA} labels={MONTHS} />
              </div>

              {/* Revision rate */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Revision rate
                  </p>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Cases that required rework
                  </p>
                </div>
                <p className="text-2xl font-bold text-amber-700">
                  {designer.tatCompliance >= 90
                    ? "8%"
                    : designer.tatCompliance >= 80
                      ? "14%"
                      : "22%"}
                </p>
              </div>
            </div>
          )}

          {/* ── Account Details tab ── */}
          {tab === "account" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
              {[
                { label: "Full Name", value: designer.name },
                { label: "Email", value: designer.email },
                { label: "Phone", value: designer.phone },
                { label: "Specialization", value: designer.specialization },
                { label: "Status", value: designer.status },
                {
                  label: "Joined",
                  value: new Date(designer.joinedDate).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "short", year: "numeric" },
                  ),
                },
                {
                  label: "Last Login",
                  value: new Date(designer.lastLogin).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
                },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {f.label}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-0.5">
                    {f.value}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Reassign modal */}
      <ReassignModal
        show={!!reassignCase}
        caseItem={reassignCase}
        designers={allDesigners}
        currentDesignerId={designer.id}
        onClose={() => setReassign(null)}
        onReassign={(caseId, toDesignerId) => {
          alert(`Case ${caseId} reassigned to designer ID ${toDesignerId}`);
          setReassign(null);
        }}
      />
    </div>
  );
}

// ─── Designers list view ──────────────────────────────────────────────────────
const PER_PAGE = 6;

export default function Designers() {
  const [designers, setDesigners] = useState(DESIGNERS_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [specFilter, setSpec] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editDesigner, setEdit] = useState(null);
  const [detailId, setDetailId] = useState(null);

  // ── Filtering ─────────────────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      designers.filter((d) => {
        const q = search.toLowerCase();
        return (
          (d.name.toLowerCase().includes(q) ||
            d.email.toLowerCase().includes(q)) &&
          (statusFilter === "All" || d.status === statusFilter) &&
          (specFilter === "All" || d.specialization === specFilter)
        );
      }),
    [designers, search, statusFilter, specFilter],
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    if (editDesigner) {
      setDesigners((ds) =>
        ds.map((d) => (d.id === editDesigner.id ? { ...d, ...form } : d)),
      );
    } else {
      setDesigners((ds) => [
        ...ds,
        {
          ...form,
          id: Date.now(),
          activeCases: 0,
          completedCases: 0,
          tatCompliance: 0,
          avgTurnaround: 0,
          joinedDate: new Date().toISOString().slice(0, 10),
          lastLogin: new Date().toISOString(),
        },
      ]);
    }
    setShowModal(false);
    setEdit(null);
  };

  const handleToggleStatus = (id, nextStatus) =>
    setDesigners((ds) =>
      ds.map((d) => (d.id === id ? { ...d, status: nextStatus } : d)),
    );

  const openAdd = () => {
    setEdit(null);
    setShowModal(true);
  };
  const openEdit = (d) => {
    setEdit(d);
    setShowModal(true);
  };

  // ── Detail view ───────────────────────────────────────────────────────────
  const detail = designers.find((d) => d.id === detailId);
  if (detailId && detail) {
    return (
      <>
        <DesignerModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editData={editDesigner}
        />
        <DesignerDetail
          designer={detail}
          allDesigners={designers}
          onBack={() => setDetailId(null)}
          onEdit={() => openEdit(detail)}
          onToggleStatus={handleToggleStatus}
        />
      </>
    );
  }

  // ── Summary stats (top of list) ───────────────────────────────────────────
  const totalActive = designers.filter((d) => d.status === "Active").length;
  const avgTat = Math.round(
    designers
      .filter((d) => d.status === "Active")
      .reduce((s, d) => s + d.tatCompliance, 0) / (totalActive || 1),
  );
  const totalActive_cases = designers.reduce((s, d) => s + d.activeCases, 0);

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <>
      <DesignerModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEdit(null);
        }}
        onSave={handleSave}
        editData={editDesigner}
      />

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Designers</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {totalActive} active · {designers.length} total
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-colors"
          >
            + Add Designer
          </button>
        </div>

        {/* Summary stat cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Active Designers
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalActive}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              of {designers.length} total
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Avg TAT Compliance
            </p>
            <p className="text-2xl font-bold text-gray-900">{avgTat}%</p>
            <div className="mt-2">
              <TatBar value={avgTat} />
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">
              Total Active Cases
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalActive_cases}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">across all designers</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Status filter */}
          <div className="flex gap-1.5">
            {["All", "Active", "Inactive", "Suspended"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs border transition-colors font-medium ${
                  statusFilter === s
                    ? "bg-indigo-600 border-indigo-600 text-white"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Specialization filter */}
          <select
            value={specFilter}
            onChange={(e) => {
              setSpec(e.target.value);
              setPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 bg-white"
          >
            <option value="All">All specializations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Search */}
          <div className="flex-1 min-w-52 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {[
                    "Designer",
                    "Specialization",
                    "Status",
                    "Active Cases",
                    "TAT Compliance",
                    "Last Login",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-14 text-gray-400 text-sm"
                    >
                      No designers found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((d) => (
                    <tr
                      key={d.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Designer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={d.name} id={d.id} />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {d.name}
                            </p>
                            <p className="text-xs text-gray-400">{d.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                          {d.specialization}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={d.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900">
                          {d.activeCases}
                        </span>
                        <span className="text-xs text-gray-400"> cases</span>
                      </td>
                      <td className="px-4 py-3.5 min-w-36">
                        <TatBar value={d.tatCompliance} />
                      </td>
                      <td className="px-4 py-3.5 text-xs text-gray-400 whitespace-nowrap">
                        {timeAgo(d.lastLogin)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetailId(d.id)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(d)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              const next =
                                d.status === "Active" ? "Suspended" : "Active";
                              handleToggleStatus(d.id, next);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              d.status === "Active"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {d.status === "Active" ? "Suspend" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length}
              </p>
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg border font-medium transition-colors ${
                        page === p
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
