"use server";

import { revalidatePath } from "next/cache";
import { assertSuperAdminAccess } from "@/src/lib/super-admin";
import { getAdminClient } from "@/src/utils/supabase/admin";
import { createServerSupabase } from "@/src/utils/supabase/server";

async function requireSuperAdmin() {
  const supabase = await createServerSupabase();
  await assertSuperAdminAccess(supabase);
}

export type EuCountryRow = {
  country_code: string;
  name: string;
};

export type CountryHolidayRow = {
  id: string;
  country_code: string;
  stable_code: string;
  holiday_rule: "fixed" | "easter_offset" | "nth_weekday" | "fixed_offset";
  month: number | null;
  day: number | null;
  easter_offset_days: number | null;
  display_name: string;
  sort_order: number;
};

type HolidayRule = CountryHolidayRow["holiday_rule"];

function slugifyStableCode(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 64);
}

function isValidStableCode(s: string): boolean {
  return /^[a-z][a-z0-9_]{0,62}$/.test(s);
}

type HolidayTemplateRow = {
  stable_code: string;
  holiday_rule: HolidayRule;
  month: number | null;
  day: number | null;
  easter_offset_days: number | null;
  sort_order: number;
};

const COMMON_HOLIDAY_TEMPLATES: HolidayTemplateRow[] = [
  { stable_code: "new_year", holiday_rule: "fixed", month: 1, day: 1, easter_offset_days: null, sort_order: 10 },
  { stable_code: "maundy_thursday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: -3, sort_order: 34 },
  { stable_code: "labour_day", holiday_rule: "fixed", month: 5, day: 1, easter_offset_days: null, sort_order: 20 },
  { stable_code: "good_friday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: -2, sort_order: 35 },
  { stable_code: "easter_sunday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 0, sort_order: 35 },
  { stable_code: "easter_monday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 1, sort_order: 36 },
  { stable_code: "ascension_day", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 39, sort_order: 37 },
  { stable_code: "whit_sunday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 49, sort_order: 37 },
  { stable_code: "whit_monday", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 50, sort_order: 38 },
  { stable_code: "christmas_day", holiday_rule: "fixed", month: 12, day: 25, easter_offset_days: null, sort_order: 200 },
  { stable_code: "christmas_second", holiday_rule: "fixed", month: 12, day: 26, easter_offset_days: null, sort_order: 210 },
];

const NATIONAL_HOLIDAY_TEMPLATE_BY_COUNTRY: Record<string, HolidayTemplateRow> = {
  AT: { stable_code: "national_holiday", holiday_rule: "fixed", month: 10, day: 26, easter_offset_days: null, sort_order: 100 },
  BE: { stable_code: "national_holiday", holiday_rule: "fixed", month: 7, day: 21, easter_offset_days: null, sort_order: 100 },
  BG: { stable_code: "national_holiday", holiday_rule: "fixed", month: 3, day: 3, easter_offset_days: null, sort_order: 100 },
  HR: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 25, easter_offset_days: null, sort_order: 100 },
  CY: { stable_code: "national_holiday", holiday_rule: "fixed", month: 10, day: 1, easter_offset_days: null, sort_order: 100 },
  CZ: { stable_code: "national_holiday", holiday_rule: "fixed", month: 10, day: 28, easter_offset_days: null, sort_order: 100 },
  DK: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 5, easter_offset_days: null, sort_order: 100 },
  EE: { stable_code: "national_holiday", holiday_rule: "fixed", month: 2, day: 24, easter_offset_days: null, sort_order: 100 },
  FI: { stable_code: "national_holiday", holiday_rule: "fixed", month: 12, day: 6, easter_offset_days: null, sort_order: 100 },
  FR: { stable_code: "national_holiday", holiday_rule: "fixed", month: 7, day: 14, easter_offset_days: null, sort_order: 100 },
  DE: { stable_code: "national_holiday", holiday_rule: "fixed", month: 10, day: 3, easter_offset_days: null, sort_order: 100 },
  GR: { stable_code: "national_holiday", holiday_rule: "fixed", month: 3, day: 25, easter_offset_days: null, sort_order: 100 },
  HU: { stable_code: "national_holiday", holiday_rule: "fixed", month: 3, day: 15, easter_offset_days: null, sort_order: 100 },
  IE: { stable_code: "national_holiday", holiday_rule: "fixed", month: 3, day: 17, easter_offset_days: null, sort_order: 100 },
  IT: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 2, easter_offset_days: null, sort_order: 100 },
  LV: { stable_code: "national_holiday", holiday_rule: "fixed", month: 11, day: 18, easter_offset_days: null, sort_order: 100 },
  LT: { stable_code: "national_holiday", holiday_rule: "fixed", month: 2, day: 16, easter_offset_days: null, sort_order: 100 },
  LU: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 23, easter_offset_days: null, sort_order: 100 },
  MT: { stable_code: "national_holiday", holiday_rule: "fixed", month: 9, day: 8, easter_offset_days: null, sort_order: 100 },
  NL: { stable_code: "national_holiday", holiday_rule: "fixed", month: 4, day: 27, easter_offset_days: null, sort_order: 100 },
  PL: { stable_code: "national_holiday", holiday_rule: "fixed", month: 11, day: 11, easter_offset_days: null, sort_order: 100 },
  PT: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 10, easter_offset_days: null, sort_order: 100 },
  RO: { stable_code: "national_holiday", holiday_rule: "fixed", month: 12, day: 1, easter_offset_days: null, sort_order: 100 },
  SK: { stable_code: "national_holiday", holiday_rule: "fixed", month: 8, day: 29, easter_offset_days: null, sort_order: 100 },
  SI: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 25, easter_offset_days: null, sort_order: 100 },
  ES: { stable_code: "national_holiday", holiday_rule: "fixed", month: 10, day: 12, easter_offset_days: null, sort_order: 100 },
  SE: { stable_code: "national_holiday", holiday_rule: "fixed", month: 6, day: 6, easter_offset_days: null, sort_order: 100 },
};

const EXTRA_TEMPLATES_BY_COUNTRY: Record<string, HolidayTemplateRow[]> = {
  DK: [
    { stable_code: "constitution_day", holiday_rule: "fixed", month: 6, day: 5, easter_offset_days: null, sort_order: 95 },
    { stable_code: "prayer_day", holiday_rule: "easter_offset", month: null, day: null, easter_offset_days: 26, sort_order: 36 },
  ],
  SE: [{ stable_code: "midsummer_day", holiday_rule: "fixed", month: 6, day: 24, easter_offset_days: null, sort_order: 120 }],
  FI: [{ stable_code: "epiphany", holiday_rule: "fixed", month: 1, day: 6, easter_offset_days: null, sort_order: 12 }],
  ES: [{ stable_code: "epiphany", holiday_rule: "fixed", month: 1, day: 6, easter_offset_days: null, sort_order: 12 }],
  IT: [{ stable_code: "epiphany", holiday_rule: "fixed", month: 1, day: 6, easter_offset_days: null, sort_order: 12 }],
  AT: [{ stable_code: "epiphany", holiday_rule: "fixed", month: 1, day: 6, easter_offset_days: null, sort_order: 12 }],
  DE: [{ stable_code: "epiphany", holiday_rule: "fixed", month: 1, day: 6, easter_offset_days: null, sort_order: 12 }],
  FR: [{ stable_code: "armistice_day", holiday_rule: "fixed", month: 11, day: 11, easter_offset_days: null, sort_order: 160 }],
  BE: [{ stable_code: "armistice_day", holiday_rule: "fixed", month: 11, day: 11, easter_offset_days: null, sort_order: 160 }],
  NL: [{ stable_code: "liberation_day", holiday_rule: "fixed", month: 5, day: 5, easter_offset_days: null, sort_order: 110 }],
  PT: [{ stable_code: "all_saints", holiday_rule: "fixed", month: 11, day: 1, easter_offset_days: null, sort_order: 150 }],
  PL: [{ stable_code: "all_saints", holiday_rule: "fixed", month: 11, day: 1, easter_offset_days: null, sort_order: 150 }],
  HU: [{ stable_code: "all_saints", holiday_rule: "fixed", month: 11, day: 1, easter_offset_days: null, sort_order: 150 }],
  SK: [{ stable_code: "all_saints", holiday_rule: "fixed", month: 11, day: 1, easter_offset_days: null, sort_order: 150 }],
  SI: [{ stable_code: "all_saints", holiday_rule: "fixed", month: 11, day: 1, easter_offset_days: null, sort_order: 150 }],
};

const HOLIDAY_NAME_BY_LANGUAGE: Record<string, Record<string, string>> = {
  "en-US": {
    new_year: "New Year's Day",
    labour_day: "Labour Day",
    good_friday: "Good Friday",
    easter_monday: "Easter Monday",
    ascension_day: "Ascension Day",
    whit_monday: "Whit Monday",
    christmas_day: "Christmas Day",
    christmas_second: "Second day of Christmas",
    maundy_thursday: "Maundy Thursday",
    easter_sunday: "Easter Sunday",
    whit_sunday: "Whit Sunday",
    prayer_day: "Great Prayer Day",
    constitution_day: "Constitution Day",
    epiphany: "Epiphany",
    all_saints: "All Saints' Day",
    armistice_day: "Armistice Day",
    liberation_day: "Liberation Day",
    midsummer_day: "Midsummer Day",
    national_holiday: "National Day",
  },
  "en-IE": {
    new_year: "New Year's Day",
    labour_day: "Labour Day",
    good_friday: "Good Friday",
    easter_monday: "Easter Monday",
    ascension_day: "Ascension Day",
    whit_monday: "Whit Monday",
    christmas_day: "Christmas Day",
    christmas_second: "St Stephen's Day",
    maundy_thursday: "Maundy Thursday",
    easter_sunday: "Easter Sunday",
    whit_sunday: "Whit Sunday",
    prayer_day: "Great Prayer Day",
    constitution_day: "Constitution Day",
    epiphany: "Epiphany",
    all_saints: "All Saints' Day",
    armistice_day: "Armistice Day",
    liberation_day: "Liberation Day",
    midsummer_day: "Midsummer Day",
    national_holiday: "St Patrick's Day",
  },
  da: {
    new_year: "Nytårsdag",
    labour_day: "Arbejdernes dag",
    good_friday: "Langfredag",
    easter_monday: "2. påskedag",
    ascension_day: "Kristi himmelfartsdag",
    whit_monday: "2. pinsedag",
    christmas_day: "Juledag",
    christmas_second: "2. juledag",
    maundy_thursday: "Skærtorsdag",
    easter_sunday: "Påskedag",
    whit_sunday: "Pinsedag",
    prayer_day: "Store bededag",
    constitution_day: "Grundlovsdag",
    epiphany: "Helligtrekonger",
    all_saints: "Allehelgensdag",
    armistice_day: "Våbenstilstandsdagen",
    liberation_day: "Befrielsesdag",
    midsummer_day: "Midsommerdag",
    national_holiday: "Grundlovsdag",
  },
  de: {
    new_year: "Neujahr",
    labour_day: "Tag der Arbeit",
    good_friday: "Karfreitag",
    easter_monday: "Ostermontag",
    ascension_day: "Christi Himmelfahrt",
    whit_monday: "Pfingstmontag",
    christmas_day: "Erster Weihnachtstag",
    christmas_second: "Zweiter Weihnachtstag",
    maundy_thursday: "Gründonnerstag",
    easter_sunday: "Ostersonntag",
    whit_sunday: "Pfingstsonntag",
    prayer_day: "Großer Gebetstag",
    constitution_day: "Verfassungstag",
    epiphany: "Heilige Drei Könige",
    all_saints: "Allerheiligen",
    armistice_day: "Waffenstillstandstag",
    liberation_day: "Befreiungstag",
    midsummer_day: "Mittsommertag",
    national_holiday: "Tag der Deutschen Einheit",
  },
  "de-AT": {
    new_year: "Neujahr",
    labour_day: "Tag der Arbeit",
    good_friday: "Karfreitag",
    easter_monday: "Ostermontag",
    ascension_day: "Christi Himmelfahrt",
    whit_monday: "Pfingstmontag",
    christmas_day: "Erster Weihnachtstag",
    christmas_second: "Zweiter Weihnachtstag",
    maundy_thursday: "Gründonnerstag",
    easter_sunday: "Ostersonntag",
    whit_sunday: "Pfingstsonntag",
    prayer_day: "Großer Gebetstag",
    constitution_day: "Verfassungstag",
    epiphany: "Heilige Drei Könige",
    all_saints: "Allerheiligen",
    armistice_day: "Waffenstillstandstag",
    liberation_day: "Befreiungstag",
    midsummer_day: "Mittsommertag",
    national_holiday: "Nationalfeiertag",
  },
  nl: {
    new_year: "Nieuwjaarsdag",
    labour_day: "Dag van de Arbeid",
    good_friday: "Goede Vrijdag",
    easter_monday: "Paasmaandag",
    ascension_day: "Hemelvaartsdag",
    whit_monday: "Pinkstermaandag",
    christmas_day: "Eerste kerstdag",
    christmas_second: "Tweede kerstdag",
    maundy_thursday: "Witte Donderdag",
    easter_sunday: "Eerste paasdag",
    whit_sunday: "Eerste pinksterdag",
    prayer_day: "Grote bededag",
    constitution_day: "Grondwetsdag",
    epiphany: "Driekoningen",
    all_saints: "Allerheiligen",
    armistice_day: "Wapenstilstandsdag",
    liberation_day: "Bevrijdingsdag",
    midsummer_day: "Midzomerdag",
    national_holiday: "Nationale feestdag",
  },
  "nl-BE": {
    new_year: "Nieuwjaarsdag",
    labour_day: "Dag van de Arbeid",
    good_friday: "Goede Vrijdag",
    easter_monday: "Paasmaandag",
    ascension_day: "Hemelvaartsdag",
    whit_monday: "Pinkstermaandag",
    christmas_day: "Eerste kerstdag",
    christmas_second: "Tweede kerstdag",
    maundy_thursday: "Witte Donderdag",
    easter_sunday: "Paaszondag",
    whit_sunday: "Pinksterzondag",
    prayer_day: "Grote bededag",
    constitution_day: "Grondwetsdag",
    epiphany: "Driekoningen",
    all_saints: "Allerheiligen",
    armistice_day: "Wapenstilstandsdag",
    liberation_day: "Bevrijdingsdag",
    midsummer_day: "Midzomerdag",
    national_holiday: "Nationale feestdag",
  },
  fr: {
    new_year: "Jour de l'An",
    labour_day: "Fête du Travail",
    good_friday: "Vendredi saint",
    easter_monday: "Lundi de Pâques",
    ascension_day: "Ascension",
    whit_monday: "Lundi de Pentecôte",
    christmas_day: "Noël",
    christmas_second: "Lendemain de Noël",
    maundy_thursday: "Jeudi saint",
    easter_sunday: "Dimanche de Pâques",
    whit_sunday: "Dimanche de Pentecôte",
    prayer_day: "Grand jour de prière",
    constitution_day: "Fête de la Constitution",
    epiphany: "Épiphanie",
    all_saints: "Toussaint",
    armistice_day: "Armistice",
    liberation_day: "Jour de la Libération",
    midsummer_day: "Fête de la Saint-Jean",
    national_holiday: "Fête nationale",
  },
  es: {
    new_year: "Año Nuevo",
    labour_day: "Día del Trabajador",
    good_friday: "Viernes Santo",
    easter_monday: "Lunes de Pascua",
    ascension_day: "Ascensión",
    whit_monday: "Lunes de Pentecostés",
    christmas_day: "Navidad",
    christmas_second: "Segundo día de Navidad",
    maundy_thursday: "Jueves Santo",
    easter_sunday: "Domingo de Pascua",
    whit_sunday: "Domingo de Pentecostés",
    prayer_day: "Gran día de oración",
    constitution_day: "Día de la Constitución",
    epiphany: "Epifanía",
    all_saints: "Todos los Santos",
    armistice_day: "Día del Armisticio",
    liberation_day: "Día de la Liberación",
    midsummer_day: "Día del Solsticio de Verano",
    national_holiday: "Fiesta Nacional de España",
  },
  it: {
    new_year: "Capodanno",
    labour_day: "Festa dei Lavoratori",
    good_friday: "Venerdì Santo",
    easter_monday: "Lunedì dell'Angelo",
    ascension_day: "Ascensione",
    whit_monday: "Lunedì di Pentecoste",
    christmas_day: "Natale",
    christmas_second: "Santo Stefano",
    maundy_thursday: "Giovedì santo",
    easter_sunday: "Domenica di Pasqua",
    whit_sunday: "Domenica di Pentecoste",
    prayer_day: "Grande giorno di preghiera",
    constitution_day: "Festa della Costituzione",
    epiphany: "Epifania",
    all_saints: "Ognissanti",
    armistice_day: "Giorno dell'armistizio",
    liberation_day: "Giorno della Liberazione",
    midsummer_day: "Giorno di mezza estate",
    national_holiday: "Festa della Repubblica",
  },
  pt: {
    new_year: "Ano Novo",
    labour_day: "Dia do Trabalhador",
    good_friday: "Sexta-feira Santa",
    easter_monday: "Segunda-feira de Páscoa",
    ascension_day: "Ascensão",
    whit_monday: "Segunda-feira de Pentecostes",
    christmas_day: "Natal",
    christmas_second: "Segundo dia de Natal",
    maundy_thursday: "Quinta-feira Santa",
    easter_sunday: "Domingo de Páscoa",
    whit_sunday: "Domingo de Pentecostes",
    prayer_day: "Grande Dia de Oração",
    constitution_day: "Dia da Constituição",
    epiphany: "Dia de Reis",
    all_saints: "Dia de Todos os Santos",
    armistice_day: "Dia do Armistício",
    liberation_day: "Dia da Libertação",
    midsummer_day: "Dia do Solstício de Verão",
    national_holiday: "Dia de Portugal",
  },
  sv: {
    new_year: "Nyårsdagen",
    labour_day: "Första maj",
    good_friday: "Långfredagen",
    easter_monday: "Annandag påsk",
    ascension_day: "Kristi himmelsfärdsdag",
    whit_monday: "Annandag pingst",
    christmas_day: "Juldagen",
    christmas_second: "Annandag jul",
    maundy_thursday: "Skärtorsdagen",
    easter_sunday: "Påskdagen",
    whit_sunday: "Pingstdagen",
    prayer_day: "Stora bönedagen",
    constitution_day: "Grundlagsdagen",
    epiphany: "Trettondedag jul",
    all_saints: "Alla helgons dag",
    armistice_day: "Vapenvilodagen",
    liberation_day: "Befrielsedagen",
    midsummer_day: "Midsommardagen",
    national_holiday: "Sveriges nationaldag",
  },
};

const NATIONAL_HOLIDAY_NAME_BY_COUNTRY: Record<string, string> = {
  AT: "Nationalfeiertag",
  BE: "Nationale feestdag",
  BG: "Ден на Освобождението",
  HR: "Dan državnosti",
  CY: "Ημέρα Ανεξαρτησίας",
  CZ: "Den vzniku samostatného československého státu",
  DK: "Grundlovsdag",
  EE: "Eesti Vabariigi aastapäev",
  FI: "Itsenäisyyspäivä",
  FR: "Fête nationale",
  DE: "Tag der Deutschen Einheit",
  GR: "Ημέρα Ανεξαρτησίας",
  HU: "Az 1848-as forradalom emléknapja",
  IE: "St Patrick's Day",
  IT: "Festa della Repubblica",
  LV: "Latvijas Republikas proklamēšanas diena",
  LT: "Lietuvos valstybės atkūrimo diena",
  LU: "Nationalfeierdag",
  MT: "Jum il-Vitorja",
  NL: "Koningsdag",
  PL: "Narodowe Święto Niepodległości",
  PT: "Dia de Portugal",
  RO: "Ziua Națională a României",
  SK: "Výročie Slovenského národného povstania",
  SI: "Dan državnosti",
  ES: "Fiesta Nacional de España",
  SE: "Sveriges nationaldag",
};

function localizedHolidayName(
  stableCode: string,
  countryCode: string,
  languageCode: string | null | undefined
): string {
  if (stableCode === "national_holiday") {
    return (
      NATIONAL_HOLIDAY_NAME_BY_COUNTRY[countryCode] ??
      HOLIDAY_NAME_BY_LANGUAGE[languageCode ?? ""]?.national_holiday ??
      HOLIDAY_NAME_BY_LANGUAGE["en-US"].national_holiday
    );
  }
  return (
    HOLIDAY_NAME_BY_LANGUAGE[languageCode ?? ""]?.[stableCode] ??
    HOLIDAY_NAME_BY_LANGUAGE["en-US"]?.[stableCode] ??
    stableCode
  );
}

export async function listEuCountriesForHolidays(): Promise<
  { ok: true; data: EuCountryRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("eu_countries")
      .select("country_code, name")
      .order("name", { ascending: true });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as EuCountryRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function listCountryHolidays(
  countryCode: string
): Promise<
  { ok: true; data: CountryHolidayRow[] } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const cc = countryCode.trim().toUpperCase();
    if (cc.length !== 2) {
      return { ok: false, error: "Ugyldig landekode." };
    }
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("country_public_holidays")
      .select(
        "id, country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order"
      )
      .eq("country_code", cc)
      .order("sort_order", { ascending: true })
      .order("display_name", { ascending: true });
    if (error) {
      return { ok: false, error: error.message };
    }
    return { ok: true, data: (data ?? []) as CountryHolidayRow[] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function createCountryHoliday(input: {
  country_code: string;
  stable_code?: string;
  display_name: string;
  holiday_rule: HolidayRule;
  month?: number | null;
  day?: number | null;
  easter_offset_days?: number | null;
  sort_order?: number;
}): Promise<
  { ok: true; data: CountryHolidayRow } | { ok: false; error: string }
> {
  try {
    await requireSuperAdmin();
    const country_code = input.country_code.trim().toUpperCase();
    if (country_code.length !== 2) {
      return { ok: false, error: "Ugyldig landekode." };
    }
    const display_name = input.display_name.trim();
    if (!display_name) {
      return { ok: false, error: "Navn skal udfyldes." };
    }
    const stable_code = slugifyStableCode(
      input.stable_code?.trim() || display_name
    );
    if (!stable_code || !isValidStableCode(stable_code)) {
      return {
        ok: false,
        error:
          "Stabil kode skal starte med bogstav og kun indeholde a-z, 0-9 og _.",
      };
    }
    let month: number | null = null;
    let day: number | null = null;
    let easter_offset_days: number | null = null;
    if (input.holiday_rule === "fixed") {
      const m = input.month;
      const d = input.day;
      if (m == null || d == null || m < 1 || m > 12 || d < 1 || d > 31) {
        return { ok: false, error: "Angiv gyldig måned (1–12) og dag (1–31)." };
      }
      month = Math.trunc(m);
      day = Math.trunc(d);
    } else if (input.holiday_rule === "easter_offset") {
      const off = input.easter_offset_days;
      if (off == null || !Number.isFinite(off)) {
        return { ok: false, error: "Angiv offset i dage fra påskesøndag." };
      }
      easter_offset_days = Math.trunc(off);
    } else if (input.holiday_rule === "nth_weekday") {
      const m = input.month;
      const weekday = input.day;
      const nth = input.easter_offset_days;
      if (m == null || !Number.isFinite(m) || m < 1 || m > 12) {
        return { ok: false, error: "Angiv gyldig måned (1–12)." };
      }
      if (weekday == null || !Number.isFinite(weekday) || weekday < 0 || weekday > 6) {
        return { ok: false, error: "Angiv ugedag som tal 0-6 (0=søndag)." };
      }
      if (
        nth == null ||
        !Number.isFinite(nth) ||
        Math.trunc(nth) === 0 ||
        Math.trunc(nth) < -1 ||
        Math.trunc(nth) > 5
      ) {
        return { ok: false, error: "Angiv forekomst som -1 (sidste) eller 1-5." };
      }
      month = Math.trunc(m);
      day = Math.trunc(weekday);
      easter_offset_days = Math.trunc(nth);
    } else {
      const m = input.month;
      const d = input.day;
      const off = input.easter_offset_days;
      if (m == null || d == null || m < 1 || m > 12 || d < 1 || d > 31) {
        return { ok: false, error: "Angiv gyldig måned (1–12) og dag (1–31)." };
      }
      if (off == null || !Number.isFinite(off)) {
        return { ok: false, error: "Angiv offset i dage fra den faste dato." };
      }
      month = Math.trunc(m);
      day = Math.trunc(d);
      easter_offset_days = Math.trunc(off);
    }
    const sort_order =
      input.sort_order !== undefined && Number.isFinite(input.sort_order)
        ? Math.trunc(input.sort_order)
        : 100;
    const admin = getAdminClient();
    const { data, error } = await admin
      .from("country_public_holidays")
      .insert({
        country_code,
        stable_code,
        display_name,
        holiday_rule: input.holiday_rule,
        month,
        day,
        easter_offset_days,
        sort_order,
      })
      .select(
        "id, country_code, stable_code, holiday_rule, month, day, easter_offset_days, display_name, sort_order"
      )
      .single();
    if (error) {
      if (error.code === "23505") {
        return {
          ok: false,
          error: "Den stabile kode findes allerede for dette land.",
        };
      }
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true, data: data as CountryHolidayRow };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function updateCountryHoliday(
  id: string,
  patch: {
    display_name?: string;
    holiday_rule?: HolidayRule;
    month?: number | null;
    day?: number | null;
    easter_offset_days?: number | null;
    sort_order?: number;
  }
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
    if (patch.display_name !== undefined) {
      const n = patch.display_name.trim();
      if (!n) {
        return { ok: false, error: "Navn kan ikke være tomt." };
      }
      row.display_name = n;
    }
    if (patch.holiday_rule !== undefined) {
      row.holiday_rule = patch.holiday_rule;
    }
    if (patch.month !== undefined) row.month = patch.month;
    if (patch.day !== undefined) row.day = patch.day;
    if (patch.easter_offset_days !== undefined) {
      row.easter_offset_days = patch.easter_offset_days;
    }
    if (patch.sort_order !== undefined) {
      row.sort_order = Math.trunc(patch.sort_order);
    }
    const admin = getAdminClient();
    const { data: current, error: currentErr } = await admin
      .from("country_public_holidays")
      .select("holiday_rule, month, day, easter_offset_days")
      .eq("id", id)
      .maybeSingle();
    if (currentErr) {
      return { ok: false, error: currentErr.message };
    }
    if (!current) {
      return { ok: false, error: "Helligdag ikke fundet." };
    }

    const nextRule = (patch.holiday_rule ?? current.holiday_rule) as HolidayRule;
    const nextMonth = patch.month ?? (current.month as number | null);
    const nextDay = patch.day ?? (current.day as number | null);
    const nextOffset =
      patch.easter_offset_days ?? (current.easter_offset_days as number | null);

    if (nextRule === "fixed") {
      if (nextMonth == null || nextDay == null || nextMonth < 1 || nextMonth > 12 || nextDay < 1 || nextDay > 31) {
        return { ok: false, error: "Regel 'Fast dato' kræver måned (1-12) og dag (1-31)." };
      }
    } else if (nextRule === "easter_offset") {
      if (nextOffset == null || !Number.isFinite(nextOffset)) {
        return { ok: false, error: "Regel 'Påske-offset' kræver offset i dage." };
      }
      row.month = null;
      row.day = null;
    } else if (nextRule === "nth_weekday") {
      if (nextMonth == null || !Number.isFinite(nextMonth) || nextMonth < 1 || nextMonth > 12) {
        return { ok: false, error: "Regel 'N-te ugedag' kræver måned (1-12)." };
      }
      if (nextDay == null || !Number.isFinite(nextDay) || nextDay < 0 || nextDay > 6) {
        return { ok: false, error: "Regel 'N-te ugedag' kræver ugedag 0-6." };
      }
      if (
        nextOffset == null ||
        !Number.isFinite(nextOffset) ||
        Math.trunc(nextOffset) === 0 ||
        Math.trunc(nextOffset) < -1 ||
        Math.trunc(nextOffset) > 5
      ) {
        return { ok: false, error: "Regel 'N-te ugedag' kræver forekomst -1 eller 1-5." };
      }
    } else {
      if (nextMonth == null || nextDay == null || nextMonth < 1 || nextMonth > 12 || nextDay < 1 || nextDay > 31) {
        return { ok: false, error: "Regel 'Fast dato + offset' kræver måned og dag." };
      }
      if (nextOffset == null || !Number.isFinite(nextOffset)) {
        return { ok: false, error: "Regel 'Fast dato + offset' kræver offset i dage." };
      }
    }

    const { error } = await admin
      .from("country_public_holidays")
      .update(row)
      .eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function deleteCountryHoliday(
  id: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const admin = getAdminClient();
    const { error } = await admin.from("country_public_holidays").delete().eq("id", id);
    if (error) {
      return { ok: false, error: error.message };
    }
    revalidatePath("/super-admin/helligdage");
    return { ok: true };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}

export async function refreshCountryHolidayDefaults(
  countryCode: string
): Promise<{ ok: true; upserted: number } | { ok: false; error: string }> {
  try {
    await requireSuperAdmin();
    const cc = countryCode.trim().toUpperCase();
    if (cc.length !== 2) {
      return { ok: false, error: "Ugyldig landekode." };
    }
    const admin = getAdminClient();
    const { data: country, error: countryErr } = await admin
      .from("eu_countries")
      .select("country_code, primary_language_code")
      .eq("country_code", cc)
      .maybeSingle();
    if (countryErr) return { ok: false, error: countryErr.message };
    if (!country) return { ok: false, error: "Land ikke fundet." };

    const templates = [
      ...COMMON_HOLIDAY_TEMPLATES,
      ...(EXTRA_TEMPLATES_BY_COUNTRY[cc] ?? []),
      NATIONAL_HOLIDAY_TEMPLATE_BY_COUNTRY[cc],
    ].filter((x): x is HolidayTemplateRow => Boolean(x));

    const rows = templates.map((tpl) => ({
      country_code: cc,
      stable_code: tpl.stable_code,
      holiday_rule: tpl.holiday_rule,
      month: tpl.month,
      day: tpl.day,
      easter_offset_days: tpl.easter_offset_days,
      display_name: localizedHolidayName(
        tpl.stable_code,
        cc,
        country.primary_language_code as string | null | undefined
      ),
      sort_order: tpl.sort_order,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await admin
      .from("country_public_holidays")
      .upsert(rows, { onConflict: "country_code,stable_code" });
    if (error) return { ok: false, error: error.message };

    revalidatePath("/super-admin/helligdage");
    return { ok: true, upserted: rows.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Ukendt fejl";
    return { ok: false, error: msg };
  }
}
