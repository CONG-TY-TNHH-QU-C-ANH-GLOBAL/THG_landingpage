"use client";

import { useEffect, useState } from "react";
import { Accordion } from "@/shared/ui/accordion";

/**
 * Client wrapper for the Hub accordion to support hash-based opening (#hub-id) 
 */
export function HubAccordion({ children, className }: Omit<React.ComponentProps<typeof Accordion>, "type" | "collapsible" | "value" | "onValueChange">) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#hub-")) {
      setValue(hash.replace("#hub-", ""));
    }

    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash.startsWith("#hub-")) {
        setValue(newHash.replace("#hub-", ""));
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Avoid hydration mismatch by rendering uncontrolled until mounted, 
  // or controlled once mounted.
  return (
    <Accordion
      type="single"
      collapsible
      className={className}
      value={value}
      onValueChange={(val) => {
        setValue(val);
        // Clean up hash if closed, or update it
        if (!val) {
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
        } else {
          window.history.replaceState(null, "", `#hub-${val}`);
        }
      }}
    >
      {children}
    </Accordion>
  );
}
