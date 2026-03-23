/**
 * Upserter compliance-relaterede rækker i ui_translations (en-US + da).
 * Kræver NEXT_PUBLIC_SUPABASE_URL og SUPABASE_SERVICE_ROLE_KEY (fx fra .env.local).
 *
 * Brug: npm run seed:compliance-translations
 */
import { createClient } from "@supabase/supabase-js";

const rows = [
  {
    translation_key: "admin.nav.compliance",
    language_code: "en-US",
    text_value: "Compliance",
    context_description:
      "Admin sidebar navigation label (AdminWorkspaceShell → /dashboard/compliance). Short noun; legal/regulatory documentation area (GDPR, EU AI Act, tenant-specific notes). Not a certification or guarantee of compliance.",
  },
  {
    translation_key: "admin.nav.compliance",
    language_code: "da",
    text_value: "Compliance",
    context_description:
      "Admin-menu: link til /dashboard/compliance. Kort navn; lov-/GDPR-/AI-orienteret dokumentation — ikke en erklæring om at krav er opfyldt.",
  },
  {
    translation_key: "compliance.page.title",
    language_code: "en-US",
    text_value: "Compliance",
    context_description:
      "Page title (h1) on /dashboard/compliance (admin area). Should align with sidebar label admin.nav.compliance.",
  },
  {
    translation_key: "compliance.page.title",
    language_code: "da",
    text_value: "Compliance",
    context_description:
      "Overskrift på compliance-siden; samme begreb som admin-menuen.",
  },
  {
    translation_key: "compliance.page.intro",
    language_code: "en-US",
    text_value:
      "This area provides rolling, legally oriented documentation for ShiftBob: transparency about how the system works, references to AI and data-protection requirements, and a section for your organisation’s use of the product. Content will be updated as legislation and product features evolve.",
    context_description:
      "Lead paragraph under h1 on /dashboard/compliance. Neutral, informational tone (not legal advice). Mentions ShiftBob as product name; describes rolling updates and tenant-specific section.",
  },
  {
    translation_key: "compliance.page.intro",
    language_code: "da",
    text_value:
      "Her finder du løbende, lovmæssigt orienteret dokumentation for ShiftBob: transparens om systemets virkemåde, henvisning til krav om kunstig intelligens og databeskyttelse samt et afsnit om jeres konkrete brug. Indholdet opdateres, efterhånden som lovgivning og produktet udvikler sig.",
    context_description: "Indledning; produktnavn ShiftBob bevares.",
  },
  {
    translation_key: "compliance.section.system_title",
    language_code: "en-US",
    text_value: "System overview & transparency",
    context_description:
      "First main section heading (h2) on /dashboard/compliance: high-level description of the system and transparency.",
  },
  {
    translation_key: "compliance.section.system_title",
    language_code: "da",
    text_value: "Overordnet system og transparens",
    context_description: "Sektionsoverskrift (h2).",
  },
  {
    translation_key: "compliance.section.system_body",
    language_code: "en-US",
    text_value:
      "ShiftBob is a workplace scheduling application. Data is processed to provide calendars, roles, notifications and (where enabled) AI-assisted features such as plan suggestions or text generation. Processing is limited to what is needed for these purposes. Technical and organisational measures follow the design of the underlying platform (e.g. Supabase: authentication, row-level security, encryption in transit). This description is high-level; detailed data-flow diagrams and subprocessors can be listed here as the documentation matures.",
    context_description:
      "Body under system section. Keep ShiftBob and Supabase as proper nouns. RLS = row-level security; explain or expand in target language if needed. Not legal advice.",
  },
  {
    translation_key: "compliance.section.system_body",
    language_code: "da",
    text_value:
      "ShiftBob er en arbejdsplads-app til vagtplanlægning. Data behandles for at levere kalendere, roller, notifikationer og (hvor det er slået til) AI-understøttede funktioner såsom planforslag eller tekstgenerering. Behandlingen er begrænset til det, der er nødvendigt for disse formål. Tekniske og organisatoriske foranstaltninger følger den underliggende platforms udformning (fx Supabase: login, række-sikkerhed, kryptering under transport). Beskrivelsen er overordnet; detaljerede dataflows og underdatabehandlere kan uddybes her, efterhånden som dokumentationen modnes.",
    context_description: "Brødtekst; produkt- og platformnavne bevares.",
  },
  {
    translation_key: "compliance.section.ai_title",
    language_code: "en-US",
    text_value: "Artificial intelligence (EU AI Act)",
    context_description:
      "Section heading (h2): AI use and EU Artificial Intelligence Act framing.",
  },
  {
    translation_key: "compliance.section.ai_title",
    language_code: "da",
    text_value: "Kunstig intelligens (EU’s AI-forordning)",
    context_description: "Sektionsoverskrift (h2).",
  },
  {
    translation_key: "compliance.section.ai_body",
    language_code: "en-US",
    text_value:
      "Where ShiftBob uses AI (e.g. schedule explanations, import helpers, or future planning tools), outputs support human decisions and should be verified by responsible staff. High-risk automated decisions without human oversight are not the intended use. As EU AI Act obligations are clarified for your sector and deployment, this section will summarise the role of AI in the product, logging where applicable, and how to exercise rights or contest outcomes. Update this page after legal review.",
    context_description:
      "Body: human oversight, not standalone high-risk automation; obligations may evolve; recommend legal review. Formal compliance-oriented tone.",
  },
  {
    translation_key: "compliance.section.ai_body",
    language_code: "da",
    text_value:
      "Når ShiftBob anvender AI (fx forklaringer af planer, import-hjælp eller fremtidige planlægningsværktøjer), er resultaterne et beslutningsgrundlag for mennesker og bør kontrolleres af ansvarlige medarbejdere. Fuldt automatiserede afgørelser uden menneskelig inddragelse er ikke den tilsigtede anvendelse. Efterhånden som forpligtelser under EU’s AI-forordning afklares for jeres sektor og drift, vil dette afsnit blive opdateret med produktets rolle, relevant logning og hvordan brugerne kan gøre indsigelse. Indhold bør juridisk kvalificeres.",
    context_description: "Brødtekst; formel tone.",
  },
  {
    translation_key: "compliance.section.gdpr_title",
    language_code: "en-US",
    text_value: "Personal data & GDPR",
    context_description:
      "Section heading (h2): GDPR and personal data processing.",
  },
  {
    translation_key: "compliance.section.gdpr_title",
    language_code: "da",
    text_value: "Persondata og GDPR",
    context_description: "Sektionsoverskrift (h2).",
  },
  {
    translation_key: "compliance.section.gdpr_body",
    language_code: "en-US",
    text_value:
      "ShiftBob processes personal data such as identity, contact, work role, schedule and preferences to deliver the service. The data controller for your organisation’s use is typically your employer or the entity named in the agreement; ShiftBob acts according to the agreed setup (often as processor when we provide the software). Lawful bases, retention, transfers, DPIA and records of processing should be documented in your organisation’s privacy materials and cross-referenced here. Data subjects’ rights (access, rectification, erasure, restriction, portability, objection) are supported through account and admin flows where technically possible.",
    context_description:
      "Body: controller vs processor (typical pattern), DPIA, RoPA, data subject rights. EU GDPR framing; not legal advice; customer must document their own legal basis.",
  },
  {
    translation_key: "compliance.section.gdpr_body",
    language_code: "da",
    text_value:
      "ShiftBob behandler personoplysninger såsom identitet, kontakt, arbejdsrolle, vagtplan og præferencer for at levere tjenesten. Dataansvarlig for jeres brug er typisk arbejdsgiveren eller den enhed, der fremgår af aftalen; ShiftBob agerer efter den aftalte rolle (ofte som databehandler). Lovlige grunde, opbevaring, overførsler, DPIA og behandlingsaktiviteter bør dokumenteres i jeres egen privatlivs-/compliance-materiale og kan refereres her. Registreredes rettigheder (indsigt, berigtigelse, sletning, begrænsning, dataportabilitet, indsigelse) understøttes gennem konto- og admin-flows, hvor det er teknisk muligt.",
    context_description: "Brødtekst.",
  },
  {
    translation_key: "compliance.section.tenant_title",
    language_code: "en-US",
    text_value: "Your organisation’s use",
    context_description:
      "Section heading (h2): customer/tenant-specific compliance and usage.",
  },
  {
    translation_key: "compliance.section.tenant_title",
    language_code: "da",
    text_value: "Jeres brug af systemet",
    context_description: "Sektionsoverskrift (h2).",
  },
  {
    translation_key: "compliance.section.tenant_body",
    language_code: "en-US",
    text_value:
      "Active workplace: {workplace}. This section will hold customer-specific compliance artefacts: configuration of AI features, data categories in use, retention choices, DPIA excerpts, and audit trails as they become available in the product. Until automated exports are linked here, document decisions internally and keep this page as the single entry point for regulators and DPO reviews.",
    context_description:
      "Body; placeholder {workplace} is replaced in code with the active workplace display name — preserve {workplace} exactly in all translations.",
  },
  {
    translation_key: "compliance.section.tenant_body",
    language_code: "da",
    text_value:
      "Aktiv arbejdsplads: {workplace}. Dette afsnit skal indeholde kundespecifik compliance: aktivering af AI-funktioner, hvilke datakategorier I bruger, opbevaringsvalg, uddrag af DPIA og revisionspor, efterhånden som det bliver tilgængeligt i produktet. Indtil automatiske udtræk kobles på, bør I dokumentere beslutninger internt og bruge denne side som fælles indgang for tilsyn og DPO-gennemgang.",
    context_description: "Bevar pladsholderen {workplace} uændret.",
  },
  {
    translation_key: "compliance.footer.rolling",
    language_code: "en-US",
    text_value:
      "Rolling compliance: this page is a living document. Last content review: not yet recorded — assign ownership in your organisation.",
    context_description:
      "Footer on /dashboard/compliance: reminds that content is a living document; internal process note.",
  },
  {
    translation_key: "compliance.footer.rolling",
    language_code: "da",
    text_value:
      "Rullende compliance: denne side er et levende dokument. Seneste indholdsgennemgang: ikke registreret — udpeg ansvarlig i organisationen.",
    context_description: "Bundnote; meta om vedligeholdelse.",
  },
];

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "Mangler NEXT_PUBLIC_SUPABASE_URL eller SUPABASE_SERVICE_ROLE_KEY (brug .env.local med npm run seed:compliance-translations)."
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const { error } = await supabase.from("ui_translations").upsert(rows, {
  onConflict: "translation_key,language_code",
});

if (error) {
  console.error("Upsert fejlede:", error.message);
  process.exit(1);
}

console.log(`ui_translations: upserted ${rows.length} rows (compliance + admin nav).`);
