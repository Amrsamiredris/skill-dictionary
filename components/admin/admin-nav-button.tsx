"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminNavButton() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((data: { isAdmin?: boolean }) => setShow(Boolean(data.isAdmin)))
      .catch(() => setShow(false));
  }, []);

  if (!show) return null;

  return (
    <Link
      href="/admin"
      className="admin-nav-btn"
      aria-label="Admin dashboard"
      title="Admin dashboard"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width={20}
        height={20}
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </Link>
  );
}
