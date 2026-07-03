import { useState } from "react";

/** Minimal string-field form state: a record, a single-field setter, and a
 *  reset-to-initial. Keeps the two community submit dialogs from repeating the
 *  same useState + `set(key, value)` boilerplate. */
export function useFormFields<T extends Record<string, string>>(initial: T) {
  const [fields, setFields] = useState<T>(initial);
  const set = <K extends keyof T>(key: K, value: string) =>
    setFields((f) => ({ ...f, [key]: value }));
  const reset = () => setFields(initial);
  return { fields, set, reset };
}
