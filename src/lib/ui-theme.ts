export const UI_THEME_COOKIE = "sb_ui_layout_theme";

export const UI_THEME_IDS = ["dark", "light", "unicorn"] as const;

export type UiThemeId = (typeof UI_THEME_IDS)[number];

export function isUiThemeId(value: string | null | undefined): value is UiThemeId {
  return value === "dark" || value === "light" || value === "unicorn";
}

export const UI_THEME_LABELS: Record<UiThemeId, string> = {
  dark: "Dark",
  light: "Light",
  unicorn: "Unicorn",
};

export const UI_THEME_DESCRIPTIONS: Record<UiThemeId, string> = {
  dark: "Mørkt design som standard (zinc).",
  light: "Lyst, hvidt design.",
  unicorn: "Lilla (#C1B3F2), blå (#4A90E2), lime (#9FD36E) — uden grå/sort baggrund.",
};
