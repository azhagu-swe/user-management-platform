// src/lib/cookies.ts
/**
 * Sets a cookie.
 * @param name Name of the cookie
 * @param value Value of the cookie
 * @param days Days until the cookie expires (optional)
 * @param path Cookie path (defaults to '/')
 */
export function setCookie(name: string, value: string, days?: number, path: string = '/') {
  if (typeof document === 'undefined') return; // Ensure runs only on client

  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  // For production, ensure 'Secure' flag is added if served over HTTPS
  const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  document.cookie = `${name}=${value || ""}${expires}; path=${path}; SameSite=Lax${secureFlag}`;
}

/**
 * Gets a cookie by name.
 * @param name Name of the cookie
 * @returns The cookie value or null if not found
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Removes a cookie by name.
 * @param name Name of the cookie
 * @param path Cookie path (defaults to '/')
 */
export function removeCookie(name: string, path: string = '/') {
  if (typeof document === 'undefined') return;
  // Set expiry date to the past to delete the cookie
  document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax;`;
}