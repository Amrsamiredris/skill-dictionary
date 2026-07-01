"use client";

import { useEffect, useState } from "react";
import { MOTION, useOverlayState } from "@/lib/motion";

export function IntroModal() {
  const [open, setOpen] = useState(false);
  const { mounted, active } = useOverlayState(open, MOTION.modal);

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-intro-modal", openHandler);

    try {
      if (!localStorage.getItem("sd_has_seen_intro")) {
        const t = setTimeout(() => setOpen(true), 500);
        return () => {
          clearTimeout(t);
          window.removeEventListener("open-intro-modal", openHandler);
        };
      }
    } catch {
      const t = setTimeout(() => setOpen(true), 500);
      return () => {
        clearTimeout(t);
        window.removeEventListener("open-intro-modal", openHandler);
      };
    }

    return () => window.removeEventListener("open-intro-modal", openHandler);
  }, []);

  const close = (persist: boolean) => {
    setOpen(false);
    if (persist) {
      try {
        localStorage.setItem("sd_has_seen_intro", "1");
      } catch {
        /* ignore */
      }
    }
  };

  if (!mounted) return null;

  return (
    <div
      className={`modal-overlay${active ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="intro-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close(false);
      }}
    >
      <div className="modal">
        <h2 className="modal-title" id="intro-title">
          Get better results from AI in one copy and paste
        </h2>
        <div className="modal-body">
          <p>
            This is a library of ready-made instructions that help tools like
            ChatGPT, Claude, and others give you much better answers.
          </p>
          <p>
            You do not need to know how to code. Pick something that fits your
            work, copy it, and paste it into whatever AI tool you already use.
          </p>
        </div>
        <button
          type="button"
          className="modal-cta"
          onClick={() => close(true)}
        >
          Got it, let&apos;s go
        </button>
      </div>
    </div>
  );
}
