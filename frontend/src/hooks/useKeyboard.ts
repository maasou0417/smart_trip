import {type RefObject, useEffect } from "react";

export const useKeyboardNavigation = (
  onEscape?: () => void,
  onEnter?: () => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onEscape) {
        onEscape();
      }
      if (e.key === "Enter" && onEnter && !e.shiftKey) {
        onEnter();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape, onEnter, enabled]);
};

// Tab trap for modals/dialogs
export function useTrapFocus(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const focusableSelectors =
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const focusableElements =
      ref.current.querySelectorAll<HTMLElement>(focusableSelectors);

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    ref.current.addEventListener("keydown", handleKeyDown);

    return () => {
      ref.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, isActive]);
}

// Skip to main content
export const useSkipLink = () => {
  const skipToMain = () => {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView();
    }
  };

  return skipToMain;
};