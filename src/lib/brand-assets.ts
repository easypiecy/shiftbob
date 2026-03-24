/**
 * Samme filnavn i /public — når du erstatter PNG’en, øg `CACHE` så browsere og
 * Next.js’ billedoptimering ikke viser den gamle grafik.
 */
const CACHE = "4";

/** Login / store visninger — 1024-px fil */
export const SHIFTBOB_CIRCLE_LOGO_DARK = `/ShiftBob-circle-logo-dark-1024.png?v=${CACHE}`;

/** Mørk baggrund — lys variant af cirkellogo */
export const SHIFTBOB_CIRCLE_LOGO_LIGHT = `/ShiftBob-circle-logo-light-1024.png?v=${CACHE}`;

/** Favicon, PWA og apple-touch — `/public/ikon.jpg` */
export const SHIFTBOB_SITE_ICON = `/ikon.jpg?v=${CACHE}`;

/** Login input feltbaggrund (ældre grå stribe) */
export const LOGO_STRIPE_FILL = "#6b6b6b";

/** E-mail/adgangskode på login — feltbaggrund sættes i `globals.css` (`.login-page-shell .login-form-input`) */
export const LOGIN_INPUT_BACKGROUND = "#d3d3d3";

export const LOGO_STRIPE_BORDER = "#5c5c5c";
export const LOGO_STRIPE_BORDER_FOCUS = "#8f8f8f";
