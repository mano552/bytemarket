import React, { useEffect, useRef } from "react";

// Minimal typing for the parts of the Google Identity Services global we use.
// The real script attaches `google` to `window` at runtime.
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
  }) => void;
  renderButton: (parent: HTMLElement, options: Record<string, string>) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: GoogleAccountsId;
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onToken: (idToken: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ onToken }) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !window.google || !buttonRef.current) return;

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onToken(response.credential),
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: String(Math.min(buttonRef.current.offsetWidth || 360, 400)),
    });
  }, [clientId, onToken]);

  if (!clientId) {
    return (
      <p className="muted" style={{ fontSize: "0.8rem" }}>
        Google Sign-In not configured (set VITE_GOOGLE_CLIENT_ID in frontend/.env)
      </p>
    );
  }

  return <div ref={buttonRef} style={{ width: "100%", overflow: "hidden" }} />;
};

export default GoogleSignInButton;
