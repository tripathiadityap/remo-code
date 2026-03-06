"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  Package,
  Sparkles,
  ExternalLink,
  Github,
} from "lucide-react";
import { RemoLogo } from "./icons/remo-logo";

const navItems = [
  { href: "/workspace", label: "Workspace", icon: LayoutDashboard },
  { href: "/workspace/contexts", label: "Contexts", icon: Layers },
  { href: "/workspace/packs", label: "Pack Builder", icon: Package },
  { href: "/workspace/prompt", label: "Prompt Gen", icon: Sparkles },
];

interface SidebarProps {
  contextCount?: number;
  connected?: boolean;
}

export function Sidebar({ contextCount = 0, connected = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo" style={{ textDecoration: "none" }}>
          <span className="logo-icon">
            <RemoLogo size={28} />
          </span>
          REMO Code
        </Link>
        <span className="sidebar-version">v0.1.0</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/workspace" && pathname.startsWith(item.href));
          const isWorkspaceRoot =
            item.href === "/workspace" && pathname === "/workspace";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${isActive || isWorkspaceRoot ? "active" : ""}`}
            >
              <span className="nav-icon">
                <Icon size={18} strokeWidth={isActive || isWorkspaceRoot ? 2 : 1.5} />
              </span>
              {item.label}
              {item.label === "Contexts" && contextCount > 0 && (
                <span className="nav-badge">{contextCount}</span>
              )}
            </Link>
          );
        })}

        <div className="nav-section-label" style={{ marginTop: "1rem" }}>
          Resources
        </div>
        <a
          href="https://remo.rocks"
          target="_blank"
          rel="noreferrer"
          className="nav-item"
        >
          <span className="nav-icon">
            <ExternalLink size={18} strokeWidth={1.5} />
          </span>
          remo.rocks
        </a>
        <a
          href="https://github.com/tripathiadityap/remo-code"
          target="_blank"
          rel="noreferrer"
          className="nav-item"
        >
          <span className="nav-icon">
            <Github size={18} strokeWidth={1.5} />
          </span>
          GitHub
        </a>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <span className={`status-dot ${connected ? "" : "offline"}`} />
          {connected ? "Connected to REMO" : "Not connected"}
        </div>
      </div>
    </aside>
  );
}
