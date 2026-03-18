import { useState, useEffect, useCallback } from "react";
import { CiSearch } from "react-icons/ci";

//import axiosInstance from "../api/axiosInstance";

// ─── Mock data (replace with GET /audit-logs) ─────────────────────────────────
const MOCK_LOGS = [
  { id: "L-2001", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "USER_CREATED",      target: "Sara Liu (U-42)",         caseId: null,     ip: "192.168.1.10", timestamp: "2025-03-18T09:12:00Z" },
  { id: "L-2000", userId: "U-42", userName: "Sara Liu",     userEmail: "sara@oralab.com",     action: "FILE_UPLOAD",        target: "Case C-1041 — design.stl", caseId: "C-1041", ip: "10.0.0.55",   timestamp: "2025-03-18T08:55:00Z" },
  { id: "L-1999", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "STATUS_CHANGE",      target: "Case C-1040 → Completed",  caseId: "C-1040", ip: "192.168.1.10", timestamp: "2025-03-18T08:40:00Z" },
  { id: "L-1998", userId: "U-33", userName: "Arjun Mehta",  userEmail: "arjun@oralab.com",    action: "COMMENT_ADDED",      target: "Case C-1039",              caseId: "C-1039", ip: "10.0.0.21",   timestamp: "2025-03-18T07:30:00Z" },
  { id: "L-1997", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "CASE_REASSIGNED",    target: "C-1038: Tom → Arjun",      caseId: "C-1038", ip: "192.168.1.10", timestamp: "2025-03-17T17:20:00Z" },
  { id: "L-1996", userId: "U-55", userName: "Tom Reed",     userEmail: "tom@oralab.com",      action: "LOGIN",              target: "Successful login",          caseId: null,     ip: "10.0.0.88",   timestamp: "2025-03-17T16:05:00Z" },
  { id: "L-1995", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "ACCOUNT_SUSPENDED",  target: "User priya@clinic.com",    caseId: null,     ip: "192.168.1.10", timestamp: "2025-03-17T15:00:00Z" },
  { id: "L-1994", userId: "U-22", userName: "Priya Sharma", userEmail: "priya@oralab.com",    action: "FILE_UPLOAD",        target: "Case C-1037 — model.stl",  caseId: "C-1037", ip: "10.0.0.14",   timestamp: "2025-03-17T13:45:00Z" },
  { id: "L-1993", userId: "U-33", userName: "Arjun Mehta",  userEmail: "arjun@oralab.com",    action: "STATUS_CHANGE",      target: "Case C-1036 → Review",     caseId: "C-1036", ip: "10.0.0.21",   timestamp: "2025-03-17T12:10:00Z" },
  { id: "L-1992", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "SETTINGS_UPDATED",   target: "TAT defaults modified",     caseId: null,     ip: "192.168.1.10", timestamp: "2025-03-17T11:00:00Z" },
  { id: "L-1991", userId: "U-44", userName: "City Clinic",  userEmail: "city@clinic.com",     action: "LOGIN",              target: "Successful login",          caseId: null,     ip: "203.0.113.5", timestamp: "2025-03-17T10:30:00Z" },
  { id: "L-1990", userId: "U-11", userName: "Admin",        userEmail: "admin@ora.com",       action: "USER_REACTIVATED",   target: "User city@clinic.com",     caseId: null,     ip: "192.168.1.10", timestamp: "2025-03-17T09:15:00Z" },
];

const ACTION_TYPES = [
  "All actions",
  "LOGIN",
  "FILE_UPLOAD",
  "STATUS_CHANGE",
  "COMMENT_ADDED",
  "CASE_REASSIGNED",
  "ACCOUNT_SUSPENDED",
  "USER_CREATED",
  "USER_REACTIVATED",
  "SETTINGS_UPDATED",
];

const ACTION_STYLES = {
  LOGIN:             "bg-gray-100 text-gray-600",
  FILE_UPLOAD:       "bg-blue-50 text-blue-700",
  STATUS_CHANGE:     "bg-indigo-50 text-indigo-700",
  COMMENT_ADDED:     "bg-purple-50 text-purple-700",
  CASE_REASSIGNED:   "bg-amber-50 text-amber-700",
  ACCOUNT_SUSPENDED: "bg-red-50 text-red-700",
  USER_CREATED:      "bg-green-50 text-green-700",
  USER_REACTIVATED:  "bg-teal-50 text-teal-700",
  SETTINGS_UPDATED:  "bg-orange-50 text-orange-700",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTs(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString("en-US", {
    month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
    hour12: true,
  });
}

function useDebounce(value, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Detail drawer ────────────────────────────────────────────────────────────
function LogDrawer({ log, onClose }) {
  if (!log) return null;

  const fields = [
    { label: "Log ID",     value: log.id },
    { label: "User",       value: `${log.userName} (${log.userId})` },
    { label: "Email",      value: log.userEmail },
    { label: "Action",     value: log.action },
    { label: "Target",     value: log.target },
    { label: "Case ID",    value: log.caseId ?? "—" },
    { label: "IP address", value: log.ip },
    { label: "Timestamp",  value: new Date(log.timestamp).toLocaleString() },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-20"
        onClick={onClose}
      />
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl border-l border-gray-200 z-30 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Log detail</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-lg leading-none"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="mb-4">
            <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-600"}`}>
              {log.action.replace(/_/g, " ")}
            </span>
          </div>
          <dl className="space-y-4">
            {fields.map((f) => (
              <div key={f.label}>
                <dt className="text-xs font-medium text-gray-400 uppercase tracking-wide">{f.label}</dt>
                <dd className="text-sm text-gray-800 mt-0.5 break-all">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        {log.caseId && (
          <div className="px-5 py-4 border-t border-gray-100">
            <a
              href={`/cases?id=${log.caseId}`}
              className="block w-full text-center text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 py-2.5 rounded-lg transition-colors"
            >
              View case {log.caseId} →
            </a>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AuditLogs() {
  const [logs, setLogs]         = useState(MOCK_LOGS);
  const [isLoading, setLoading] = useState(false);
  const [selectedLog, setLog]   = useState(null);

  // Filters
  const [search, setSearch]         = useState("");
  const [actionFilter, setAction]   = useState("All actions");
  const [userFilter, setUser]       = useState("");
  const [dateFrom, setDateFrom]     = useState("");
  const [dateTo, setDateTo]         = useState("");
  const [caseIdFilter, setCaseId]   = useState("");

  const debouncedSearch = useDebounce(search);

  // ── Fetch (with fallback to mock) ──────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search: debouncedSearch || undefined,
        action: actionFilter !== "All actions" ? actionFilter : undefined,
        user:   userFilter    || undefined,
        from:   dateFrom      || undefined,
        to:     dateTo        || undefined,
        caseId: caseIdFilter  || undefined,
      };
      const data = await axiosInstance.get("/audit-logs", { params }).then((r) => r.data);
      setLogs(data.logs ?? data);
    } catch {
      // stay on mock data
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, actionFilter, userFilter, dateFrom, dateTo, caseIdFilter]);

  // Client-side filtering on mock data
  const filtered = MOCK_LOGS.filter((l) => {
    const q = debouncedSearch.toLowerCase();
    const matchSearch =
      !q ||
      l.userName.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q);
    const matchAction  = actionFilter === "All actions" || l.action === actionFilter;
    const matchUser    = !userFilter || l.userName.toLowerCase().includes(userFilter.toLowerCase()) || l.userEmail.toLowerCase().includes(userFilter.toLowerCase());
    const matchCaseId  = !caseIdFilter || (l.caseId ?? "").toLowerCase().includes(caseIdFilter.toLowerCase());
    const matchFrom    = !dateFrom || new Date(l.timestamp) >= new Date(dateFrom);
    const matchTo      = !dateTo   || new Date(l.timestamp) <= new Date(dateTo + "T23:59:59Z");
    return matchSearch && matchAction && matchUser && matchCaseId && matchFrom && matchTo;
  });

  const clearFilters = () => {
    setSearch(""); setAction("All actions"); setUser(""); setDateFrom(""); setDateTo(""); setCaseId("");
  };

  const hasFilters = search || actionFilter !== "All actions" || userFilter || dateFrom || dateTo || caseIdFilter;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Complete record of every user action across the platform.
          </p>
        </div>
        <button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors">
          Export CSV
        </button>
      </div>
      

      {/* Filter bar */}
 <div className="bg-white rounded-xl border border-gray-200 p-4">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
    
    {/* Search */}
    <div className="xl:col-span-2  relative">
      {/* 1. Added absolute positioning to center the icon vertically */}
      <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
      <input
        type="text"
        placeholder="Search user, action, target…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
      />
    </div>

    {/* Action type */}
    <select
      value={actionFilter}
      onChange={(e) => setAction(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 bg-white"
    >
      {ACTION_TYPES.map((a) => <option key={a}>{a}</option>)}
    </select>

    {/* User filter */}
    <input
      type="text"
      placeholder="Filter by user…"
      value={userFilter}
      onChange={(e) => setUser(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
    />

    {/* Case ID */}
    <input
      type="text"
      placeholder="Case ID (e.g. C-1040)"
      value={caseIdFilter}
      onChange={(e) => setCaseId(e.target.value)}
      className="px-3 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
    />

    {/* Date range */}
    <div className="flex gap-1.5 items-center">
      <input
        type="date"
        value={dateFrom}
        onChange={(e) => setDateFrom(e.target.value)}
        /* 2. Added min-w-0 to prevent the input from breaking out of the flex container */
        className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
      />
      <span className="text-gray-400 text-xs">–</span>
      <input
        type="date"
        value={dateTo}
        onChange={(e) => setDateTo(e.target.value)}
        /* 2. Added min-w-0 here as well */
        className="flex-1 min-w-0 px-2 py-2 rounded-lg border border-gray-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
      />
    </div>
    
  </div>




        {hasFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-gray-500">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Log ID</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Action</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Target / Description</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Case</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">IP</th>
                <th className="text-left text-xs font-medium text-gray-400 px-4 py-3">Time</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400">
                    No logs match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr
                    key={log.id}
                    onClick={() => setLog(log)}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.id}</td>
                    <td className="px-4 py-3">
                      <p className="text-gray-800 font-medium">{log.userName}</p>
                      <p className="text-xs text-gray-400">{log.userEmail}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${ACTION_STYLES[log.action] ?? "bg-gray-100 text-gray-600"}`}>
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{log.target}</td>
                    <td className="px-4 py-3">
                      {log.caseId
                        ? <span className="font-mono text-xs text-indigo-700 font-medium">{log.caseId}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">{log.ip}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{formatTs(log.timestamp)}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-indigo-600 hover:text-indigo-700">View →</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination stub */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-400">Showing {filtered.length} of {MOCK_LOGS.length} entries</p>
          <div className="flex items-center gap-1">
            <button disabled className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-300 disabled:cursor-not-allowed">← Prev</button>
            <span className="px-3 py-1.5 text-xs rounded border border-indigo-200 bg-indigo-50 text-indigo-700 font-medium">1</span>
            <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-500 hover:border-gray-300">Next →</button>
          </div>
        </div>
      </div>

      {/* Detail drawer */}
      <LogDrawer log={selectedLog} onClose={() => setLog(null)} />
    </div>
  );
}