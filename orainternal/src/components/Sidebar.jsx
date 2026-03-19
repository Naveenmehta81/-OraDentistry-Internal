import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
// react icon
import {
  MdDashboard,
  MdPeople,
  MdFolder,
  MdViewInAr,
  MdAssignment,
  MdSettings,
  MdLogout,
  MdMenu,
  MdClose,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdNotifications,
  MdSearch,
  MdAddCard,
  MdEngineering,
} from "react-icons/md";

import { RiShieldUserLine } from "react-icons/ri";

const menuGroups = [
  {
    label: "Overview",
    items: [
      {
        name: "Analytics",
        path: "/dashboard",
        icon: MdDashboard,
        badge: null,
        color: "#6366f1",
      },
      {
        name: "Users",
        path: "/users",
        icon: MdPeople,
        badge: "12",
        color: "#0ea5e9",
      },
      {
        name: "Clinics",
        path: "/ClinicsModule",
        icon: MdAddCard,
        badge: 4,
        color: "#f0b643",
      },
      {
        name: "Designers",
        path: "/Designers",
        icon: MdEngineering,
        badge: null,
        color: "#4374f0",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        name: "Cases",
        path: "/cases",
        icon: MdFolder,
        badge: "3",
        color: "#f59e0b",
      },
      {
        name: "STL Viewer",
        path: "/stl-viewer",
        icon: MdViewInAr,
        badge: null,
        color: "#10b981",
      },
      {
        name: "Audit Logs",
        path: "/audit-logs",
        icon: MdAssignment,
        badge: null,
        color: "#8b5cf6",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        name: "Settings",
        path: "/settings",
        icon: MdSettings,
        badge: null,
        color: "#64748b",
      },
    ],
  },
];

/* ─── component ─────────────────────────────────────────── */
export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const fn = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);

  return (
    <>
      <header
        className="font-sans fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14
        bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm md:hidden"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200"
          >
            {open ? <MdClose size={20} /> : <MdMenu size={20} />}
          </button>
          <span className="select-none cursor-default font-bold text-slate-800 text-[15px]">
            Admin Portal
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200">
            <MdNotifications size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow"
            style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}
          >
            A
          </div>
        </div>
      </header>

      {/* ── BACKDROP ───────────────────────────────────── */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-slate-900/25 backdrop-blur-[2px] md:hidden
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* ── SIDEBAR ────────────────────────────────────── */}
      <aside
        ref={drawerRef}
        className={`font-sans
          fixed top-0 left-0 z-40 h-screen flex flex-col
          bg-white border-r border-slate-200/80
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:z-auto
          ${collapsed ? "md:w-[68px]" : "md:w-[248px]"}
          w-[248px] shadow-[4px_0_30px_rgba(0,0,0,.05)] md:shadow-none
        `}
      >
        {/* LOGO ROW */}
        <div
          className={`flex items-center h-16 px-4 border-b border-slate-100 shrink-0 gap-3
          ${collapsed ? "md:px-0 md:justify-center" : ""}`}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{
              background: "linear-gradient(135deg,#6366f1 0%,#06b6d4 100%)",
            }}
          >
            <RiShieldUserLine size={18} />
          </div>

          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="select-none cursor-default font-bold text-slate-800 text-[14.5px] tracking-tight leading-tight">
                Admin Portal
              </p>
              <p className="select-none cursor-default text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                Management Suite
              </p>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              className="w-7 h-7 hidden md:flex items-center justify-center rounded-lg
                text-slate-300 hover:text-slate-600 hover:bg-slate-100 shrink-0"
            >
              <MdKeyboardArrowLeft size={18} />
            </button>
          )}
        </div>

        {/* EXPAND (collapsed) */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="hidden md:flex mx-auto mt-4 w-9 h-9 items-center justify-center
              rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdKeyboardArrowRight size={20} />
          </button>
        )}

        {/* SEARCH */}
        {!collapsed && (
          <div className="px-4 pt-4 pb-2 shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border-[1.5px] border-slate-200 rounded-xl px-[11px] py-[7px] focus-within:border-indigo-300 focus-within:ring-[3px] focus-within:ring-indigo-100/50">
              <MdSearch size={15} className="text-slate-400 shrink-0" />
              <input
                placeholder="Search anything…"
                className="bg-transparent border-none outline-none text-[13px] text-slate-700 w-full placeholder:text-slate-400"
              />
              <kbd className="select-none cursor-default  text-[10px] text-slate-400 bg-slate-200 p-2 m-2 rounded-md font-mono leading-none">
                ⌘
              </kbd>
            </div>
          </div>
        )}

        {/* NAV (With Custom Tailwind Scrollbar) */}
        <nav className="flex-1 px-3 py-1 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {menuGroups.map((group) => (
            <div key={group.label}>
              {!collapsed ? (
                <p className="select-none cursor-default  text-[10px] font-bold tracking-[0.09em] uppercase text-slate-300 px-2.5 mt-4 mb-1.5">
                  {group.label}
                </p>
              ) : (
                <div className="my-2 border-t border-slate-100 mx-1" />
              )}

              {group.items.map(({ name, path, icon: Icon, badge, color }) => {
                const active = location.pathname === path;
                const cBg = color + "15"; // Adds 15 hex (~8% opacity) to color string

                return (
                  <Link
                    key={path}
                    to={path}
                    className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] whitespace-nowrap relative
                      ${active ? "font-semibold" : "font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-700"}
                      ${collapsed ? "md:justify-center md:px-0" : ""}
                    `}
                    style={active ? { backgroundColor: cBg, color: color } : {}}
                  >
                    <span
                      className={`w-[34px] h-[34px] rounded-lg flex items-center justify-center shrink-0
                        ${active ? "text-white shadow-md" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"}
                      `}
                      style={active ? { backgroundColor: color } : {}}
                    >
                      <Icon size={17} />
                    </span>

                    {!collapsed && (
                      <>
                        <span className="flex-1">{name}</span>
                        {badge && (
                          <span
                            className="ml-auto text-[10px] font-bold px-[7px] py-[2px] rounded-full shrink-0 leading-[1.4]"
                            style={{ background: color + "18", color: color }}
                          >
                            {badge}
                          </span>
                        )}
                      </>
                    )}

                    {/* TOOLTIP FOR COLLAPSED STATE */}
                    {collapsed && (
                      <span
                        className="hidden group-hover:block absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg
                        before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[5px] before:border-transparent before:border-r-slate-800"
                      >
                        {name} {badge ? ` · ${badge}` : ""}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* NOTIFICATION CARD  */}
        {!collapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-sky-50 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-indigo-100 shrink-0">
                <MdNotifications size={16} className="text-indigo-500" />
              </div>
              {/* this is hardcode need to show real case and alert  */}
              <div className="flex-1 overflow-hidden">
                <p className="text-[12.5px] font-semibold text-slate-700 leading-tight">
                  3 new alerts
                </p>
                <p className="text-[11px] text-slate-400">
                  2 cases need review
                </p>
              </div>
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
            </div>
          </div>
        )}

        {/* FOOTER: user + logout */}
        <div
          className={`px-3 pb-4 pt-3 border-t border-slate-100 shrink-0 ${collapsed ? "flex flex-col items-center gap-2" : ""}`}
        >
          {/* user row */}
          {!collapsed && (
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-slate-50 cursor-pointer mb-1">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow"
                style={{
                  background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                }}
              ></div>
              <div className="flex-1 overflow-hidden">
                <p className="select-none cursor-default text-[13px] font-semibold text-slate-800 truncate leading-tight">
                  Alex Johnson
                </p>
                <p className="select-none cursor-default text-[11px] text-slate-400 truncate">
                  Super Admin
                </p>
              </div>
              <div
                className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"
                title="Online"
              />
            </div>
          )}

          {collapsed && (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow"
              style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)" }}
            >
              A
            </div>
          )}

          {/* logout */}
          <Link
            to="/"
            className={`group flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13.5px] font-medium whitespace-nowrap relative text-red-500 hover:bg-red-50 hover:text-red-600
              ${collapsed ? "md:px-0 md:justify-center" : ""}
            `}
          >
            <span className="w-\[34px\] h-\[34px\] rounded-lg flex items-center justify-center shrink-0 bg-red-100 text-red-500 group-hover:bg-red-200">
              <MdLogout size={17} />
            </span>
            {!collapsed && <span>Logout</span>}

            {collapsed && (
              <span
                className="hidden group-hover:block absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 bg-slate-800 text-white text-xs font-medium px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 shadow-lg
                before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[5px] before:border-transparent before:border-r-slate-800"
              >
                Logout
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* mobile top-bar spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
}
