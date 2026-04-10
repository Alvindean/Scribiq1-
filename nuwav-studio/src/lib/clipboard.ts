/**
 * Mobile-safe clipboard copy utility.
 *
 * Strategy:
 *  1. Try navigator.clipboard.writeText() — works on HTTPS + modern browsers.
 *  2. Fall back to the legacy textarea + execCommand("copy") trick — works on
 *     older iOS Safari, Android WebView, and HTTP localhost.
 *
 * Returns true if the copy succeeded, false otherwise.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  // Modern async clipboard API
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to legacy path (e.g. permission denied on iOS)
    }
  }

  // Legacy fallback — works on iOS Safari < 13.4 and non-HTTPS pages
  try {
    const el = document.createElement("textarea");
    el.value = text;
    // Move off-screen so it doesn't flash
    el.style.cssText =
      "position:fixed;top:-9999px;left:-9999px;opacity:0;pointer-events:none";
    // iOS Safari requires the element to be editable and not read-only
    el.setAttribute("readonly", "");
    document.body.appendChild(el);

    // iOS needs a specific selection range trick
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
    }
    el.setSelectionRange(0, text.length);

    const ok = document.execCommand("copy");
    document.body.removeChild(el);
    return ok;
  } catch {
    return false;
  }
}
