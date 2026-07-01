"use client";

import { trackEvent } from "@/lib/track-client";
import {
  hasSeenInstallPrompt,
  markInstallPromptSeen,
} from "@/lib/session";

export function InstallPrompt({
  skillId,
  skillName,
  onDismiss,
}: {
  skillId: string;
  skillName: string;
  onDismiss: () => void;
}) {
  const handleYes = () => {
    markInstallPromptSeen(skillId);
    trackEvent(skillId, "install_yes");
    onDismiss();
  };

  const handleNo = () => {
    markInstallPromptSeen(skillId);
    trackEvent(skillId, "install_no");
    onDismiss();
  };

  const handleSkip = () => {
    markInstallPromptSeen(skillId);
    onDismiss();
  };

  return (
    <div className="install-prompt" role="status">
      <p className="install-prompt-text">
        Did you install <strong>{skillName}</strong>?
      </p>
      <div className="install-prompt-actions">
        <button type="button" className="install-btn" onClick={handleYes}>
          Yes
        </button>
        <button type="button" className="install-btn" onClick={handleNo}>
          No
        </button>
        <button type="button" className="install-btn install-skip" onClick={handleSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}

export function shouldShowInstallPrompt(skillId: string): boolean {
  return !hasSeenInstallPrompt(skillId);
}
