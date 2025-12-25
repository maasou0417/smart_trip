// Focus management utilities

export const focusElement = (
  selector: string,
  delay: number = 0
): void => {
  setTimeout(() => {
    const element = document.querySelector(selector) as HTMLElement;
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, delay);
};

export const saveFocus = (): HTMLElement | null => {
  return document.activeElement as HTMLElement;
};

export const restoreFocus = (element: HTMLElement | null): void => {
  if (element && element.focus) {
    element.focus();
  }
};

// Announce to screen readers
export const announce = (
  message: string,
  priority: "polite" | "assertive" = "polite"
): void => {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.style.position = "absolute";
  announcement.style.left = "-10000px";
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};