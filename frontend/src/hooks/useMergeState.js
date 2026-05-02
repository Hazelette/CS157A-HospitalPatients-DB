import { useState, useCallback } from "react";

/** Merges a partial into state (or merges the return value of `partialOrFn(prev)`). */
export function useMergeState(initial) {
  const [state, setState] = useState(initial);
  const merge = useCallback((partialOrFn) => {
    setState((prev) => ({
      ...prev,
      ...(typeof partialOrFn === "function" ? partialOrFn(prev) : partialOrFn),
    }));
  }, []);
  return [state, merge];
}
