

// WCAG 2.1 Color Contrast Utilities

export const getLuminance = (hex: string): number => {

    // REmove the hashtag #
    hex = hex.replace("#", "");

    // Convert to RGB
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance 
    const [rs, gs, bs] = [r, g, b].map((c) => {
        return c <= 0.03928 ? c /12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

export const getContrastRatio = (color1: string, color2: string): number => {
    const l1 = getLuminance(color1);
    const l2 = getLuminance(color2);

    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);

    return (lighter + 0.05) / (darker + 0.05);
};

export const meetsWCAG = (
    color1: string,
    color2: string,
    level: "AA" | "AAA" = "AA",
    size: "normal" | "large" = "normal"
): boolean => {
    const ratio = getContrastRatio(color1, color2);

    if(level === "AAA") {
        return size === "large" ? ratio >= 4.5 : ratio >= 7;
    }

    // AA level
    return size === "large" ? ratio >= 3 : ratio >= 4.5;
};