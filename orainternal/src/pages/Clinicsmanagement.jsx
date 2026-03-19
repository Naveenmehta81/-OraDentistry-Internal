import { useState, useMemo } from "react";

// ─── Mock data (replace with GET /clinics via React Query) ────────────────────
const CLINICS_DATA = [
  {
    id: 1,
    name: "Smile Dental Clinic",
    city: "Mumbai",
    address: "12 Marine Drive, Mumbai 400001",
    contactPerson: "Dr. Priya Sharma",
    email: "priya@smiledental.in",
    phone: "+91 98201 45678",
    status: "Active",
    totalUsers: 8,
    activeCases: 23,
    turnaround: 92,
  },
  {
    id: 2,
    name: "Pearl Orthodontics",
    city: "Delhi",
    address: "45 Connaught Place, New Delhi 110001",
    contactPerson: "Dr. Arjun Mehta",
    email: "arjun@pearlortho.in",
    phone: "+91 98110 23456",
    status: "Active",
    totalUsers: 5,
    activeCases: 14,
    turnaround: 87,
  },
  {
    id: 3,
    name: "BrightSmile Center",
    city: "Surat",
    address: "88 Ring Road, Surat 395002",
    contactPerson: "Dr. Kavita Patel",
    email: "kavita@brightsmile.in",
    phone: "+91 98250 67890",
    status: "Active",
    totalUsers: 12,
    activeCases: 37,
    turnaround: 95,
  },
  {
    id: 4,
    name: "Dental Care Hub",
    city: "Bangalore",
    address: "22 MG Road, Bangalore 560001",
    contactPerson: "Dr. Rahul Nair",
    email: "rahul@dentalcare.in",
    phone: "+91 98450 11223",
    status: "Inactive",
    totalUsers: 3,
    activeCases: 2,
    turnaround: 74,
  },
  {
    id: 5,
    name: "White Pearl Dentistry",
    city: "Chennai",
    address: "5 Anna Salai, Chennai 600002",
    contactPerson: "Dr. Lakshmi Iyer",
    email: "lakshmi@whitepearl.in",
    phone: "+91 98401 55678",
    status: "Active",
    totalUsers: 7,
    activeCases: 19,
    turnaround: 88,
  },
  {
    id: 6,
    name: "Apex Dental Studio",
    city: "Pune",
    address: "67 FC Road, Pune 411004",
    contactPerson: "Dr. Sameer Joshi",
    email: "sameer@apexdental.in",
    phone: "+91 98220 34567",
    status: "Active",
    totalUsers: 6,
    activeCases: 11,
    turnaround: 91,
  },
];

const USERS_DATA = {
  1: [
    {
      id: 1,
      name: "Dr. Anjali Rao",
      role: "Dentist",
      email: "anjali@smiledental.in",
      status: "Active",
    },
    {
      id: 2,
      name: "Raj Kumar",
      role: "Designer",
      email: "raj@smiledental.in",
      status: "Active",
    },
    {
      id: 3,
      name: "Meena Shah",
      role: "Staff",
      email: "meena@smiledental.in",
      status: "Active",
    },
  ],
  3: [
    {
      id: 4,
      name: "Dr. Vivek Modi",
      role: "Dentist",
      email: "vivek@brightsmile.in",
      status: "Active",
    },
    {
      id: 5,
      name: "Pooja Desai",
      role: "Designer",
      email: "pooja@brightsmile.in",
      status: "Active",
    },
  ],
};

const CASES_DATA = {
  1: [
    {
      id: "C-1001",
      patient: "Rohan Gupta",
      type: "Crown",
      status: "In Progress",
      date: "2025-06-10",
    },
    {
      id: "C-1002",
      patient: "Sneha Pillai",
      type: "Veneer",
      status: "Completed",
      date: "2025-06-08",
    },
    {
      id: "C-1003",
      patient: "Amit Verma",
      type: "Implant",
      status: "Pending",
      date: "2025-06-12",
    },
  ],
  3: [
    {
      id: "C-2001",
      patient: "Hetal Patel",
      type: "Bridge",
      status: "In Progress",
      date: "2025-06-11",
    },
    {
      id: "C-2002",
      patient: "Darshan Shah",
      type: "Crown",
      status: "Completed",
      date: "2025-06-09",
    },
  ],
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const CASE_VOLUME = [12, 18, 14, 22, 19, 23];

const BLANK_FORM = {
  name: "",
  city: "",
  address: "",
  contactPerson: "",
  email: "",
  phone: "",
  status: "Active",
};

const STATUS_STYLES = {
  Active: "bg-green-50 text-green-700 border-green-200",
  Inactive: "bg-gray-100 text-gray-500 border-gray-200",
};

const CASE_STATUS_STYLES = {
  "In Progress": "bg-blue-50 text-blue-700",
  Completed: "bg-green-50 text-green-700",
  Pending: "bg-amber-50 text-amber-700",
};

// ─── Shared small components ──────────────────────────────────────────────────

function Badge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_STYLES[status] ?? "bg-gray-100 text-gray-500 border-gray-200"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${status === "Active" ? "bg-green-500" : "bg-gray-400"}`}
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

function StatCard({ label, value, sub }) {
  return (
    <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1 min-w-24">
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-green-600 mt-0.5">{sub}</p>}
    </div>
  );
}

function MiniBarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-2 h-24 mt-2">
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

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────
function ClinicModal({ show, onClose, onSave, editData }) {
  const [form, setForm] = useState(editData ?? BLANK_FORM);

  // Sync when editData changes (switching between add/edit)
  useMemo(() => {
    setForm(editData ?? BLANK_FORM);
  }, [editData]);

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

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">
            {editData ? "Edit Clinic" : "Add New Clinic"}
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
          <Field label="Clinic name" fieldKey="name" colSpan />
          <Field label="City" fieldKey="city" />
          <Field label="Phone" fieldKey="phone" />
          <Field label="Full address" fieldKey="address" colSpan />
          <Field label="Contact person" fieldKey="contactPerson" />
          <Field label="Contact email" fieldKey="email" type="email" />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
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
            {editData ? "Save changes" : "Add clinic"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Clinic detail view ───────────────────────────────────────────────────────
function ClinicDetail({ clinic, onBack, onEdit, onToggleStatus }) {
  const [tab, setTab] = useState("users");
  const users = USERS_DATA[clinic.id] ?? [];
  const cases = CASES_DATA[clinic.id] ?? [];

  const tabs = [
    { key: "users", label: "Associated Users" },
    { key: "cases", label: "Clinic Cases" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
      >
        ← Back to Clinics
      </button>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
              🏥
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{clinic.name}</h1>
              <p className="text-sm text-gray-400 mt-0.5">{clinic.address}</p>
              <p className="text-sm text-gray-500 mt-0.5">{clinic.phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge status={clinic.status} />
            <button
              onClick={onEdit}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Edit
            </button>
            <button
              onClick={() => onToggleStatus(clinic.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                clinic.status === "Active"
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-green-50 text-green-700 hover:bg-green-100"
              }`}
            >
              {clinic.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          </div>
        </div>

        {/* Stat row */}
        <div className="flex gap-3 mt-5 flex-wrap">
          <StatCard label="Total Users" value={clinic.totalUsers} />
          <StatCard label="Active Cases" value={clinic.activeCases} />
          <StatCard
            label="Turnaround"
            value={`${clinic.turnaround}%`}
            sub={clinic.turnaround >= 90 ? "✓ On target" : "Below target"}
          />
          <StatCard
            label="Contact"
            value={clinic.contactPerson}
            sub={clinic.email}
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
          {/* Users tab */}
          {tab === "users" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-500">
                  {users.length} users assigned to this clinic
                </p>
                <button className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  + Add user
                </button>
              </div>
              {users.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">
                  No users assigned yet.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Name", "Role", "Email", "Status"].map((h) => (
                        <th
                          key={h}
                          className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {u.name}
                        </td>
                        <td className="px-4 py-3 text-gray-500">{u.role}</td>
                        <td className="px-4 py-3 text-indigo-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <Badge status={u.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Cases tab */}
          {tab === "cases" && (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                {cases.length} cases for this clinic
              </p>
              {cases.length === 0 ? (
                <p className="text-center text-gray-400 py-10 text-sm">
                  No cases found.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      {["Case ID", "Patient", "Type", "Status", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide"
                          >
                            {h}
                          </th>
                        ),
                      )}
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
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {c.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Analytics tab */}
          {tab === "analytics" && (
            <div className="space-y-5">
              <div className="flex gap-3 flex-wrap">
                <StatCard
                  label="Avg Turnaround"
                  value={`${clinic.turnaround}%`}
                />
                <StatCard label="Total Cases" value={clinic.activeCases} />
                <StatCard
                  label="Compliance"
                  value={
                    clinic.turnaround >= 90 ? "Excellent" : "Needs Attention"
                  }
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-gray-800">
                  Monthly case volume
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
                <MiniBarChart data={CASE_VOLUME} labels={MONTHS} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Clinics list view ────────────────────────────────────────────────────────
const PER_PAGE = 5;

export default function Clinics() {
  const [clinics, setClinics] = useState(CLINICS_DATA);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editClinic, setEditClinic] = useState(null);
  const [detailId, setDetailId] = useState(null);

  // ── Filtering + pagination ────────────────────────────────────────────────
  const filtered = useMemo(
    () =>
      clinics.filter((c) => {
        const q = search.toLowerCase();
        return (
          (c.name.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q)) &&
          (statusFilter === "All" || c.status === statusFilter)
        );
      }),
    [clinics, search, statusFilter],
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSave = (form) => {
    if (editClinic) {
      setClinics((cs) =>
        cs.map((c) => (c.id === editClinic.id ? { ...c, ...form } : c)),
      );
    } else {
      setClinics((cs) => [
        ...cs,
        {
          ...form,
          id: Date.now(),
          totalUsers: 0,
          activeCases: 0,
          turnaround: 0,
        },
      ]);
    }
    setShowModal(false);
    setEditClinic(null);
  };

  const handleToggleStatus = (id) =>
    setClinics((cs) =>
      cs.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" }
          : c,
      ),
    );

  const openAdd = () => {
    setEditClinic(null);
    setShowModal(true);
  };
  const openEdit = (clinic) => {
    setEditClinic(clinic);
    setShowModal(true);
  };

  // ── Detail view ───────────────────────────────────────────────────────────
  const detail = clinics.find((c) => c.id === detailId);
  if (detailId && detail) {
    return (
      <>
        <ClinicModal
          show={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          editData={editClinic}
        />
        <ClinicDetail
          clinic={detail}
          onBack={() => setDetailId(null)}
          onEdit={() => openEdit(detail)}
          onToggleStatus={handleToggleStatus}
        />
      </>
    );
  }

  // ── List view ─────────────────────────────────────────────────────────────
  return (
    <>
      <ClinicModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditClinic(null);
        }}
        onSave={handleSave}
        editData={editClinic}
      />

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Clinics Management
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {clinics.filter((c) => c.status === "Active").length} active ·{" "}
              {clinics.length} total
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm shadow-indigo-200 transition-colors"
          >
            + Add Clinic
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {["All", "Active", "Inactive"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-sm border transition-colors ${
                statusFilter === s
                  ? "bg-indigo-600 border-indigo-600 text-white font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
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
              placeholder="Search by name or city…"
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
                    "Clinic Name",
                    "City",
                    "Contact",
                    "Status",
                    "Users",
                    "Cases",
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
                      No clinics found.
                    </td>
                  </tr>
                ) : (
                  paginated.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Clinic name */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center text-base shrink-0">
                            🏥
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {c.name}
                            </p>
                            <p className="text-xs text-gray-400 truncate max-w-44">
                              {c.address}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">{c.city}</td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-800 text-xs">
                          {c.contactPerson}
                        </p>
                        <p className="text-xs text-indigo-600">{c.email}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge status={c.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900">
                          {c.totalUsers}
                        </span>
                        <span className="text-xs text-gray-400"> users</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-900">
                          {c.activeCases}
                        </span>
                        <span className="text-xs text-gray-400"> cases</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setDetailId(c.id)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEdit(c)}
                            className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              c.status === "Active"
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {c.status === "Active" ? "Deactivate" : "Activate"}
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
