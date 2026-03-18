import { useState } from "react";
//import axiosInstance from "../api/axiosInstance";

// ─── Mock integrations (replace with GET /settings/stl-integrations) ─────────
const INITIAL_INTEGRATIONS = [
  {
    id: "viewstl",
    name: "ViewSTL",
    description: "Lightweight browser-based STL renderer. No auth required for public files.",
    docsUrl: "https://www.viewstl.com/plugin/",
    status: "active",
    apiKey: "",
    embedUrl: "https://www.viewstl.com/plugin/",
    useApiKey: false,
  },
  {
    id: "forge",
    name: "Autodesk Forge Viewer",
    description: "Enterprise-grade 3D viewer supporting STL, OBJ, STEP and 50+ formats.",
    docsUrl: "https://forge.autodesk.com",
    status: "inactive",
    apiKey: "",
    embedUrl: "",
    useApiKey: true,
  },
  {
    id: "three",
    name: "Three.js (Self-hosted)",
    description: "Open-source WebGL renderer embedded directly in the platform.",
    docsUrl: "https://threejs.org",
    status: "inactive",
    apiKey: "",
    embedUrl: "",
    useApiKey: false,
  },
];

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:   "bg-green-50 text-green-700 border-green-200",
    inactive: "bg-gray-100 text-gray-500 border-gray-200",
    error:    "bg-red-50  text-red-700   border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${map[status] ?? map.inactive}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "active" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-gray-400"}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Integration card ─────────────────────────────────────────────────────────
function IntegrationCard({ integration, onUpdate }) {
  const [expanded, setExpanded]   = useState(false);
  const [form, setForm]           = useState({ apiKey: integration.apiKey, embedUrl: integration.embedUrl });
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [toggling, setToggling]   = useState(false);
  const [showKey, setShowKey]     = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    const newStatus = integration.status === "active" ? "inactive" : "active";
    try {
      await axiosInstance.put(`/settings/stl-integrations/${integration.id}`, { status: newStatus });
      onUpdate(integration.id, { status: newStatus });
    } catch {
      // show toast in real app
    } finally {
      setToggling(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/settings/stl-integrations/${integration.id}`, form);
      onUpdate(integration.id, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    finally { setSaving(false); }
  };

  const handleTest = async () => {
    // In real app: ping the integration endpoint and show result
    alert(`Test connection to ${integration.name}: response OK (mock)`);
  };

  return (
    <div className={`bg-white rounded-xl border transition-all ${integration.status === "active" ? "border-indigo-200 shadow-sm" : "border-gray-200"}`}>
      {/* Header row */}
      <div className="flex items-start gap-4 p-5">
        {/* Icon placeholder */}
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
          integration.status === "active" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500"
        }`}>
          {integration.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-sm font-semibold text-gray-900">{integration.name}</h3>
            <StatusBadge status={integration.status} />
          </div>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{integration.description}</p>
          <a
            href={integration.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-indigo-600 hover:text-indigo-700 mt-1 inline-block"
          >
            View docs ↗
          </a>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-60 ${
              integration.status === "active"
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
            }`}
          >
            {toggling ? "…" : integration.status === "active" ? "Deactivate" : "Activate"}
          </button>
          <button
            onClick={() => setExpanded((p) => !p)}
            className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1.5 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            {expanded ? "Collapse ▴" : "Configure ▾"}
          </button>
        </div>
      </div>

      {/* Expandable config panel */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-5">
          <form onSubmit={handleSave} className="space-y-4 max-w-lg">
            {integration.useApiKey && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  API Key / Client ID
                </label>
                <div className="flex gap-2">
                  <input
                    type={showKey ? "text" : "password"}
                    value={form.apiKey}
                    onChange={(e) => setForm((p) => ({ ...p, apiKey: e.target.value }))}
                    placeholder="Enter API key…"
                    className="flex-1 px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((p) => !p)}
                    className="px-3 rounded-lg border border-gray-300 text-xs text-gray-500 hover:border-gray-400"
                  >
                    {showKey ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">Stored encrypted. Never exposed in the UI after save.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Embed / Base URL
              </label>
              <input
                type="url"
                value={form.embedUrl}
                onChange={(e) => setForm((p) => ({ ...p, embedUrl: e.target.value }))}
                placeholder="https://viewer.example.com/embed"
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <p className="text-xs text-gray-400 mt-1">This URL is used when embedding the viewer in a case detail page.</p>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
                  saved
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
                }`}
              >
                {saving ? "Saving…" : saved ? "✓ Saved" : "Save"}
              </button>
              <button
                type="button"
                onClick={handleTest}
                className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
              >
                Test connection
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ─── Currently active viewer preview ─────────────────────────────────────────
function ActiveViewerPreview({ activeIntegration }) {
  if (!activeIntegration) {
    return (
      <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
        <p className="text-sm text-gray-400">No viewer is currently active. Activate one below.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-indigo-200 rounded-xl p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
        {activeIntegration.name.slice(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">
          Active viewer: <span className="text-indigo-700">{activeIntegration.name}</span>
        </p>
        <p className="text-xs text-gray-500 mt-0.5">
          {activeIntegration.embedUrl || "No embed URL set yet"}
        </p>
      </div>
      <span className="ml-auto text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full font-medium">
        Live
      </span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StlViewer() {
  const [integrations, setIntegrations] = useState(INITIAL_INTEGRATIONS);

  const updateIntegration = (id, patch) =>
    setIntegrations((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  const active = integrations.find((i) => i.status === "active");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">STL Viewer Integration</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Configure and manage third-party STL viewing APIs used across case detail pages.
        </p>
      </div>

      {/* Active viewer banner */}
      <ActiveViewerPreview activeIntegration={active} />

      {/* Integration cards */}
      <div className="space-y-4">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Available integrations</p>
        {integrations.map((integration) => (
          <IntegrationCard
            key={integration.id}
            integration={integration}
            onUpdate={updateIntegration}
          />
        ))}
      </div>

      {/* Info note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 text-xs text-blue-700 leading-relaxed">
        Only one viewer can be active at a time. Activating a new viewer automatically deactivates the current one.
        API keys are encrypted at rest and are never returned in API responses after being saved.
      </div>
    </div>
  );
}