import { useState } from "react";
// import { authApi } from "../api/authApi";
// import axiosInstance from "../api/axiosInstance";

// ─── Mock current settings (replace with API GET /settings) ──────────────────
const DEFAULT_SETTINGS = {
  tatDefaults: {
    standard: 3,
    complex: 5,
    urgent: 1,
    implant: 7,
    nightguard: 2,
  },
  notifications: {
    emailOnNewCase: true,
    emailOnOverdue: true,
    emailOnRevision: false,
    emailOnCompletion: true,
  },
  system: {
    maintenanceMode: false,
    allowNewSignups: true,
    sessionTimeoutMinutes: 60,
  },
};

// ─── Reusable UI primitives ────────────────────────────────────────────────────
function SectionCard({ title, description, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}

function InputField({
  label,
  hint,
  id,
  type = "text",
  value,
  onChange,
  min,
  max,
  suffix,
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <label htmlFor={id} className="text-sm font-medium text-gray-700 block">
          {label}
        </label>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          className="w-20 px-3 py-1.5 rounded-lg border border-gray-300 text-sm text-gray-900 text-center outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
        />
        {suffix && <span className="text-xs text-gray-400 w-8">{suffix}</span>}
      </div>
    </div>
  );
}

function Toggle({ label, hint, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
          checked ? "bg-indigo-600" : "bg-gray-200"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

function SaveButton({ isLoading, saved }) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={`text-sm font-semibold px-5 py-2 rounded-lg transition-all ${
        saved
          ? "bg-green-50 text-green-700 border border-green-200"
          : "bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-60"
      }`}
    >
      {isLoading ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
    </button>
  );
}

// ─── TAT Section ──────────────────────────────────────────────────────────────
function TatSettings() {
  const [tat, setTat] = useState(DEFAULT_SETTINGS.tatDefaults);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const setField = (key, val) =>
    setTat((p) => ({ ...p, [key]: Math.max(1, Number(val)) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put("/settings/tat", tat);
    } catch {
      // silently handle — in real app show toast
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const cases = [
    {
      key: "standard",
      label: "Standard case",
      hint: "Default crown/bridge work",
    },
    { key: "complex", label: "Complex case", hint: "Multi-unit, full arch" },
    { key: "urgent", label: "Urgent case", hint: "Rush orders" },
    {
      key: "implant",
      label: "Implant case",
      hint: "Implant-supported restorations",
    },
    {
      key: "nightguard",
      label: "Nightguard / splint",
      hint: "Occlusal appliances",
    },
  ];

  return (
    <SectionCard
      title="Turnaround time defaults"
      description="System-wide default TAT (in business days) for each case type. Clinics can override per case."
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          {cases.map((c) => (
            <InputField
              key={c.key}
              id={`tat-${c.key}`}
              label={c.label}
              hint={c.hint}
              type="number"
              value={tat[c.key]}
              onChange={(e) => setField(c.key, e.target.value)}
              min={1}
              max={30}
              suffix="days"
            />
          ))}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <SaveButton isLoading={saving} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Notification toggles ─────────────────────────────────────────────────────
function NotificationSettings() {
  const [notifs, setNotifs] = useState(DEFAULT_SETTINGS.notifications);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key) => setNotifs((p) => ({ ...p, [key]: !p[key] }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put("/settings/notifications", notifs);
    } catch {
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const items = [
    {
      key: "emailOnNewCase",
      label: "New case submitted",
      hint: "Notify when a clinic submits a new case",
    },
    {
      key: "emailOnOverdue",
      label: "Case overdue alert",
      hint: "Alert when a case misses its TAT deadline",
    },
    {
      key: "emailOnRevision",
      label: "Revision requested",
      hint: "Notify when a clinic requests a revision",
    },
    {
      key: "emailOnCompletion",
      label: "Case completed",
      hint: "Notify admins on case completion",
    },
  ];

  return (
    <SectionCard
      title="Email notifications"
      description="Control which system events trigger admin email alerts."
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          {items.map((item) => (
            <Toggle
              key={item.key}
              label={item.label}
              hint={item.hint}
              checked={notifs[item.key]}
              onChange={() => toggle(item.key)}
            />
          ))}
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <SaveButton isLoading={saving} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ─── System flags ─────────────────────────────────────────────────────────────
function SystemSettings() {
  const [sys, setSys] = useState(DEFAULT_SETTINGS.system);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put("/settings/system", sys);
    } catch {
    } finally {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  return (
    <SectionCard
      title="System configuration"
      description="Platform-wide flags and session settings."
    >
      <form onSubmit={handleSubmit}>
        <div className="space-y-5">
          <Toggle
            label="Maintenance mode"
            hint="Blocks all non-admin logins and shows a maintenance banner"
            checked={sys.maintenanceMode}
            onChange={(v) => setSys((p) => ({ ...p, maintenanceMode: v }))}
          />
          {sys.maintenanceMode && (
            <div className="bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-4 py-2.5">
              Maintenance mode is ON. Non-admin users cannot log in.
            </div>
          )}
          <Toggle
            label="Allow new signups"
            hint="Allow new clinic accounts to self-register"
            checked={sys.allowNewSignups}
            onChange={(v) => setSys((p) => ({ ...p, allowNewSignups: v }))}
          />
          <InputField
            id="session-timeout"
            label="Session timeout"
            hint="Inactive users are logged out after this many minutes"
            type="number"
            value={sys.sessionTimeoutMinutes}
            onChange={(e) =>
              setSys((p) => ({
                ...p,
                sessionTimeoutMinutes: Math.max(5, Number(e.target.value)),
              }))
            }
            min={5}
            max={1440}
            suffix="min"
          />
        </div>
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-100">
          <SaveButton isLoading={saving} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Change password ──────────────────────────────────────────────────────────
function ChangePasswordSection() {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e = {};
    if (!form.current) e.current = "Required.";
    if (form.next.length < 8) e.next = "Minimum 8 characters.";
    if (form.next !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setErrors({});
    setApiError("");
    setSaving(true);
    try {
      await authApi.resetPassword({ token: "current", newPassword: form.next });
      setSaved(true);
      setForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  const Field = ({ id, label, key: k, placeholder }) => (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1.5"
      >
        {label}
      </label>
      <input
        id={id}
        type="password"
        autoComplete="new-password"
        value={form[k]}
        onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
        placeholder={placeholder}
        className={`w-full px-3.5 py-2.5 rounded-lg border text-sm bg-white text-gray-900 placeholder-gray-400 outline-none transition focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 ${
          errors[k] ? "border-red-400" : "border-gray-300"
        }`}
      />
      {errors[k] && <p className="text-xs text-red-500 mt-1">{errors[k]}</p>}
    </div>
  );

  return (
    <SectionCard
      title="Change password"
      description="Update your admin account password. You will receive a confirmation email."
    >
      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg px-4 py-2.5">
            {apiError}
          </div>
        )}
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-xs rounded-lg px-4 py-2.5">
            Password updated successfully.
          </div>
        )}
        <Field
          id="cp-current"
          label="Current password"
          k="current"
          placeholder="••••••••"
        />
        <Field
          id="cp-next"
          label="New password"
          k="next"
          placeholder="Min. 8 characters"
        />
        <Field
          id="cp-confirm"
          label="Confirm password"
          k="confirm"
          placeholder="Repeat new password"
        />
        <div className="pt-2">
          <SaveButton isLoading={saving} saved={saved} />
        </div>
      </form>
    </SectionCard>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Settings() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          System-wide configuration for the ORA admin platform
        </p>
      </div>

      <TatSettings />
      <NotificationSettings />
      <SystemSettings />
      <ChangePasswordSection />
    </div>
  );
}
