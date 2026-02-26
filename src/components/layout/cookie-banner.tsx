"use client";

import { useState, useEffect } from "react";

const COOKIE_CONSENT_KEY = "kpp-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[200] p-4 md:p-6">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-lg sm:flex-row sm:gap-4">
        <p className="text-center text-sm text-gray-700 sm:text-left">
          We use essential cookies to keep you signed in and make the app work.
          No tracking or advertising cookies.{" "}
          <a href="/privacy" className="font-medium text-kpp-purple underline">
            Privacy Policy
          </a>
        </p>
        <button
          onClick={accept}
          className="shrink-0 rounded-full bg-kpp-yellow px-5 py-2 text-sm font-bold text-kpp-dark transition-colors hover:bg-kpp-yellow-dark"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
