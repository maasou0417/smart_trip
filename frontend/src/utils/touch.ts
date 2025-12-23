

// Detect if device is touch-enabled
export const isTouchDevice = (): boolean => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
};

// Prevent double-tap zoom on buttons
export const preventDoubleTapZoom = (
  element: HTMLElement | null
): void => {
  if (!element) return;

  let lastTap = 0;
  element.addEventListener("touchend", (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 500 && tapLength > 0) {
      e.preventDefault();
    }
    lastTap = currentTime;
  });
};

// Add ripple effect for touch feedback
export const addRippleEffect = (
  e: React.MouseEvent<HTMLElement>
): void => {
  const button = e.currentTarget;
  const ripple = document.createElement("span");
  const rect = button.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.classList.add("ripple");

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 600);
};