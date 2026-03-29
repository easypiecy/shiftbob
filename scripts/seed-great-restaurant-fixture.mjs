import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment."
  );
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TARGET_WORKPLACE = "great restaurant";
const DEPARTMENT_NAMES = ["København", "Slagelse", "Odense"];
const EMPLOYEE_COUNT = 80;
const DAYS_TO_PLAN = 31;
const EMAIL_PREFIX = "great.restaurant.staff+";
const EMAIL_DOMAIN = "shiftbob.local";
const DANISH_FIRST_NAMES = [
  "Mads",
  "Freja",
  "Lukas",
  "Sofie",
  "Emil",
  "Clara",
  "Noah",
  "Alma",
  "William",
  "Laura",
  "Oscar",
  "Ida",
  "Magnus",
  "Olivia",
  "Victor",
  "Mathilde",
  "Alexander",
  "Nora",
  "Theodor",
  "Agnes",
  "Johan",
  "Asta",
  "Sebastian",
  "Karla",
  "Benjamin",
  "Ella",
  "Anton",
  "Liva",
  "Valdemar",
  "Josefine",
  "Nikolaj",
  "Lea",
  "Rasmus",
  "Camilla",
  "Andreas",
  "Line",
  "Sander",
  "Mille",
  "Casper",
  "Nanna",
];
const DANISH_LAST_NAMES = [
  "Jensen",
  "Nielsen",
  "Hansen",
  "Pedersen",
  "Andersen",
  "Christensen",
  "Larsen",
  "Sørensen",
  "Rasmussen",
  "Jørgensen",
  "Madsen",
  "Kristensen",
  "Poulsen",
  "Thomsen",
  "Knudsen",
  "Møller",
  "Holm",
  "Friis",
  "Dahl",
  "Lund",
];

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function startOfLocalDay(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDays(d, days) {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function localDateAt(day, hour, minute = 0) {
  const d = new Date(day);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function emailForIndex(i) {
  return `${EMAIL_PREFIX}${String(i).padStart(3, "0")}@${EMAIL_DOMAIN}`;
}

function danishNameForIndex(i) {
  const first = DANISH_FIRST_NAMES[(i - 1) % DANISH_FIRST_NAMES.length];
  const last = DANISH_LAST_NAMES[Math.floor((i - 1) / DANISH_FIRST_NAMES.length)];
  return {
    first,
    last: last ?? DANISH_LAST_NAMES[(i * 7) % DANISH_LAST_NAMES.length],
  };
}

function randomFromSeed(seed) {
  let x = seed | 0;
  x ^= x << 13;
  x ^= x >> 17;
  x ^= x << 5;
  return (x >>> 0) / 4294967296;
}

function shuffleSeeded(arr, seed) {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(randomFromSeed(seed + i * 17) * (i + 1));
    const t = out[i];
    out[i] = out[j];
    out[j] = t;
  }
  return out;
}

async function getTargetWorkplaceId() {
  const { data, error } = await supabase
    .from("workplaces")
    .select("id, name, company_name")
    .limit(500);
  if (error) throw new Error(`Failed reading workplaces: ${error.message}`);

  const match = (data ?? []).find((w) => {
    const name = String(w.name ?? "").toLowerCase();
    const company = String(w.company_name ?? "").toLowerCase();
    return name.includes(TARGET_WORKPLACE) || company.includes(TARGET_WORKPLACE);
  });
  if (!match) {
    throw new Error(
      "Could not find workplace 'Great Restaurant'. Create/select it first."
    );
  }
  return match.id;
}

async function ensureDepartments(workplaceId) {
  const { data: existing, error: e1 } = await supabase
    .from("workplace_departments")
    .select("id, name")
    .eq("workplace_id", workplaceId);
  if (e1) throw new Error(`Failed reading departments: ${e1.message}`);

  const byName = new Map(
    (existing ?? []).map((d) => [String(d.name).toLowerCase(), d.id])
  );
  const toInsert = DEPARTMENT_NAMES.filter(
    (n) => !byName.has(n.toLowerCase())
  ).map((name) => ({ workplace_id: workplaceId, name }));

  if (toInsert.length > 0) {
    const { error } = await supabase.from("workplace_departments").insert(toInsert);
    if (error) throw new Error(`Failed creating departments: ${error.message}`);
  }

  const { data: finalRows, error: e2 } = await supabase
    .from("workplace_departments")
    .select("id, name")
    .eq("workplace_id", workplaceId)
    .in("name", DEPARTMENT_NAMES);
  if (e2) throw new Error(`Failed re-reading departments: ${e2.message}`);

  const result = {};
  for (const d of finalRows ?? []) result[d.name] = d.id;
  return result;
}

async function ensureEmployeeTypes(workplaceId) {
  const { error: e1 } = await supabase
    .from("workplace_employee_types")
    .select("id")
    .eq("workplace_id", workplaceId)
    .limit(1);
  if (e1) throw new Error(`Failed reading employee types: ${e1.message}`);

  const defaults = [
    { label: "Fuldtid", sort_order: 10 },
    { label: "Deltid", sort_order: 20 },
    { label: "Elev", sort_order: 30 },
    { label: "Vikar", sort_order: 40 },
    { label: "Ung (under 18)", sort_order: 50 },
  ];
  const { error: clearMembersErr } = await supabase
    .from("workplace_members")
    .update({ employee_type_id: null })
    .eq("workplace_id", workplaceId);
  if (clearMembersErr && !/employee_type_id|column/i.test(clearMembersErr.message)) {
    throw new Error(`Failed clearing employee types on members: ${clearMembersErr.message}`);
  }
  const { error: delErr } = await supabase
    .from("workplace_employee_types")
    .delete()
    .eq("workplace_id", workplaceId);
  if (delErr) throw new Error(`Failed deleting employee types: ${delErr.message}`);
  const rows = defaults.map((d) => ({ workplace_id: workplaceId, ...d }));
  const { error: insErr } = await supabase.from("workplace_employee_types").insert(rows);
  if (insErr) throw new Error(`Failed creating employee types: ${insErr.message}`);

  const { data: finalRows, error: e2 } = await supabase
    .from("workplace_employee_types")
    .select("id, label, sort_order, calendar_pattern")
    .eq("workplace_id", workplaceId)
    .order("sort_order");
  if (e2) throw new Error(`Failed re-reading employee types: ${e2.message}`);
  return finalRows ?? [];
}

async function ensureShiftTypes(workplaceId) {
  const { error: e1 } = await supabase
    .from("workplace_shift_types")
    .select("id")
    .eq("workplace_id", workplaceId)
    .limit(1);
  if (e1) throw new Error(`Failed reading shift types: ${e1.message}`);

  const defaults = [
    { label: "Normal", sort_order: 10 },
    { label: "Ledig", sort_order: 20 },
    { label: "Akut", sort_order: 30 },
    { label: "Bytte", sort_order: 40 },
    { label: "Sygdom", sort_order: 50 },
    { label: "Ferie", sort_order: 60 },
    { label: "Barn 1. sygedag", sort_order: 70 },
  ];
  const { error: clearShiftTypeErr } = await supabase
    .from("workplace_shifts")
    .update({ shift_type_id: null })
    .eq("workplace_id", workplaceId);
  if (clearShiftTypeErr && !/workplace_shifts|schema cache|does not exist|42p01/i.test(clearShiftTypeErr.message)) {
    throw new Error(`Failed clearing shift types on shifts: ${clearShiftTypeErr.message}`);
  }
  const { error: delErr } = await supabase
    .from("workplace_shift_types")
    .delete()
    .eq("workplace_id", workplaceId);
  if (delErr) throw new Error(`Failed deleting shift types: ${delErr.message}`);
  const rows = defaults.map((d) => ({ workplace_id: workplaceId, ...d }));
  const { error: insErr } = await supabase.from("workplace_shift_types").insert(rows);
  if (insErr) throw new Error(`Failed creating shift types: ${insErr.message}`);

  const { data: finalRows, error: e2 } = await supabase
    .from("workplace_shift_types")
    .select("id, label, sort_order, calendar_color")
    .eq("workplace_id", workplaceId)
    .order("sort_order");
  if (e2) throw new Error(`Failed re-reading shift types: ${e2.message}`);
  return finalRows ?? [];
}

async function ensureTypeVisuals(workplaceId, employeeTypes, shiftTypes) {
  const shiftColorByLabel = new Map([
    ["normal", "#475569"],
    ["ledig", "#22c55e"],
    ["akut", "#f97316"],
    ["bytte", "#f59e0b"],
    ["sygdom", "#8b5cf6"],
    ["ferie", "#9ca3af"],
    ["barn 1. sygedag", "#c4b5fd"],
  ]);
  const patternByLabel = new Map([
    ["fuldtid", "none"],
    ["deltid", "none"],
    ["elev", "stripes"],
    ["vikar", "dots"],
    ["ung (under 18)", "grid"],
  ]);
  const fallbackPatterns = ["stripes", "dots", "grid", "diagonal"];

  const shiftUpdates = shiftTypes.map((row, idx) => ({
    id: row.id,
    calendar_color:
      shiftColorByLabel.get(String(row.label ?? "").toLowerCase()) ??
      ["#475569", "#22c55e", "#f97316", "#f59e0b", "#8b5cf6", "#9ca3af", "#c4b5fd"][
        idx % 7
      ],
  }));
  for (const r of shiftUpdates) {
    const { error } = await supabase
      .from("workplace_shift_types")
      .update({ calendar_color: r.calendar_color })
      .eq("id", r.id)
      .eq("workplace_id", workplaceId);
    if (error) {
      if (!/calendar_color|column|does not exist|schema cache/i.test(error.message)) {
        throw new Error(`Failed updating shift colors: ${error.message}`);
      }
      break;
    }
  }

  const empUpdates = employeeTypes.map((row, idx) => ({
    id: row.id,
    calendar_pattern:
      patternByLabel.get(String(row.label ?? "").toLowerCase()) ??
      fallbackPatterns[idx % fallbackPatterns.length],
  }));
  for (const r of empUpdates) {
    const { error } = await supabase
      .from("workplace_employee_types")
      .update({ calendar_pattern: r.calendar_pattern })
      .eq("id", r.id)
      .eq("workplace_id", workplaceId);
    if (error) {
      if (!/calendar_pattern|column|does not exist|schema cache/i.test(error.message)) {
        throw new Error(`Failed updating employee patterns: ${error.message}`);
      }
      break;
    }
  }

  const { data: finalShiftTypes } = await supabase
    .from("workplace_shift_types")
    .select("id, label, sort_order, calendar_color")
    .eq("workplace_id", workplaceId)
    .order("sort_order");

  const { data: finalEmployeeTypes } = await supabase
    .from("workplace_employee_types")
    .select("id, label, sort_order, calendar_pattern")
    .eq("workplace_id", workplaceId)
    .order("sort_order");

  return {
    employeeTypes: finalEmployeeTypes ?? employeeTypes,
    shiftTypes: finalShiftTypes ?? shiftTypes,
  };
}

async function listAllUsers() {
  const users = [];
  for (let page = 1; page <= 100; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw new Error(`Failed listing auth users: ${error.message}`);
    const batch = data.users ?? [];
    users.push(...batch);
    if (batch.length < 1000) break;
  }
  return users;
}

async function ensureStaffUsers() {
  const allUsers = await listAllUsers();
  const byEmail = new Map(
    allUsers
      .filter((u) => typeof u.email === "string")
      .map((u) => [u.email.toLowerCase(), u.id])
  );

  const userIds = [];
  for (let i = 1; i <= EMPLOYEE_COUNT; i++) {
    const email = emailForIndex(i).toLowerCase();
    const { first, last } = danishNameForIndex(i);
    const fullName = `${first} ${last}`;
    let uid = byEmail.get(email);
    if (!uid) {
      const password = `ShiftBob!${String(i).padStart(4, "0")}Ab`;
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: fullName,
          given_name: first,
          family_name: last,
        },
      });
      if (error || !data.user?.id) {
        throw new Error(`Failed creating ${email}: ${error?.message ?? "unknown"}`);
      }
      uid = data.user.id;
    }
    const { error: updErr } = await supabase.auth.admin.updateUserById(uid, {
      user_metadata: {
        full_name: fullName,
        given_name: first,
        family_name: last,
      },
    });
    if (updErr) {
      throw new Error(`Failed updating metadata for ${email}: ${updErr.message}`);
    }
    userIds.push({ index: i, user_id: uid, email, first_name: first, last_name: last });
  }
  return userIds;
}

function pickEmployeeTypeId(employeeTypes, employeeIndex) {
  const slot = (employeeIndex - 1) % Math.max(employeeTypes.length, 1);
  const type = employeeTypes[slot] ?? employeeTypes[0];
  return type?.id ?? null;
}

async function upsertWorkplaceMembers(workplaceId, staff, employeeTypes) {
  const rows = staff.map((s) => ({
    workplace_id: workplaceId,
    user_id: s.user_id,
    role: "EMPLOYEE",
    employee_type_id: pickEmployeeTypeId(employeeTypes, s.index),
  }));

  // employee_type_id kan mangle i ældre schema, fallback uden kolonnen.
  const { error } = await supabase.from("workplace_members").upsert(rows, {
    onConflict: "user_id,workplace_id",
  });
  if (!error) return;
  if (!/employee_type_id|column/i.test(error.message)) {
    throw new Error(`Failed upserting workplace members: ${error.message}`);
  }
  const fallback = rows.map((r) => ({
    workplace_id: r.workplace_id,
    user_id: r.user_id,
    role: r.role,
  }));
  const { error: e2 } = await supabase.from("workplace_members").upsert(fallback, {
    onConflict: "user_id,workplace_id",
  });
  if (e2) throw new Error(`Failed upserting fallback members: ${e2.message}`);
}

async function assignDepartments(workplaceId, staff, departmentsByName) {
  const orderedDeptIds = DEPARTMENT_NAMES.map((n) => departmentsByName[n]).filter(
    Boolean
  );
  if (orderedDeptIds.length === 0) throw new Error("No departments found.");

  const staffIds = staff.map((s) => s.user_id);
  const { error: delErr } = await supabase
    .from("workplace_department_members")
    .delete()
    .eq("workplace_id", workplaceId)
    .in("user_id", staffIds);
  if (delErr) throw new Error(`Failed clearing department memberships: ${delErr.message}`);

  const rows = staff.map((s, idx) => ({
    department_id: orderedDeptIds[idx % orderedDeptIds.length],
    workplace_id: workplaceId,
    user_id: s.user_id,
  }));
  for (const part of chunk(rows, 500)) {
    const { error } = await supabase
      .from("workplace_department_members")
      .insert(part);
    if (error) throw new Error(`Failed inserting department memberships: ${error.message}`);
  }
}

async function upsertProfiles(staff, employeeTypes) {
  const labels = employeeTypes.map((x) => x.label);
  const rows = staff.map((s) => {
    const first = s.first_name;
    const last = s.last_name;
    const comp = labels[(s.index - 1) % Math.max(labels.length, 1)] ?? "Generalist";
    return {
      user_id: s.user_id,
      first_name: first,
      last_name: last,
      mobile_phone: `+45 28 70 ${String(1000 + s.index).slice(-4)}`,
      note: `Testmedarbejder. Primær kompetence: ${comp}.`,
      updated_at: new Date().toISOString(),
    };
  });
  const { error } = await supabase.from("user_profiles").upsert(rows, {
    onConflict: "user_id",
  });
  if (error && !/relation .*user_profiles|does not exist|42p01/i.test(error.message)) {
    throw new Error(`Failed upserting user profiles: ${error.message}`);
  }
}

function orderedShiftTypePool(shiftTypes) {
  const rows = [...(shiftTypes ?? [])];
  rows.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const ids = rows.map((x) => x.id).filter(Boolean);
  return ids.length > 0 ? ids : [null];
}

function deptCoverageByDay(day) {
  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
  return {
    København: {
      day: isWeekend ? 12 : 10,
      midday: isWeekend ? 5 : 4,
      evening: isWeekend ? 11 : 9,
    },
    Slagelse: {
      day: isWeekend ? 9 : 7,
      midday: isWeekend ? 4 : 3,
      evening: isWeekend ? 8 : 6,
    },
    Odense: {
      day: isWeekend ? 10 : 8,
      midday: isWeekend ? 4 : 3,
      evening: isWeekend ? 9 : 7,
    },
  };
}

function buildShiftsForMonth({
  workplaceId,
  staffByDepartment,
  departmentIdsByName,
  shiftTypePool,
}) {
  const start = startOfLocalDay(new Date());
  const shiftRows = [];
  const staffShuffledByDept = {};
  for (const [dept, staff] of Object.entries(staffByDepartment)) {
    staffShuffledByDept[dept] = shuffleSeeded(staff, staff.length * 97 + dept.length);
  }

  for (let d = 0; d < DAYS_TO_PLAN; d++) {
    const day = addDays(start, d);
    const coverage = deptCoverageByDay(day);

    for (const deptName of DEPARTMENT_NAMES) {
      const departmentId = departmentIdsByName[deptName];
      const workers = staffShuffledByDept[deptName] ?? [];
      if (!departmentId || workers.length === 0) continue;

      const used = new Set();
      const pick = (need, seedOffset) => {
        const order = shuffleSeeded(workers, d * 131 + seedOffset);
        const out = [];
        for (const w of order) {
          if (used.has(w.user_id)) continue;
          out.push(w);
          used.add(w.user_id);
          if (out.length >= need) break;
        }
        return out;
      };

      const slots = [
        {
          name: "early",
          startHour: 9,
          endHour: 15,
          count: Math.max(2, coverage[deptName].day - 2),
          seed: 11,
        },
        {
          name: "midday",
          startHour: 11,
          endHour: 17,
          count: coverage[deptName].midday,
          seed: 23,
        },
        {
          name: "evening",
          startHour: 16,
          endHour: 22,
          count: coverage[deptName].evening,
          seed: 37,
        },
        {
          name: "late",
          startHour: 20,
          endHour: 1,
          count: day.getDay() === 0 || day.getDay() === 6 ? 4 : 2,
          seed: 53,
        },
      ];

      for (let slotIdx = 0; slotIdx < slots.length; slotIdx++) {
        const slot = slots[slotIdx];
        const selected = pick(slot.count, slot.seed);
        for (let personIdx = 0; personIdx < selected.length; personIdx++) {
          const person = selected[personIdx];
          const startsAt = localDateAt(day, slot.startHour);
          const endsAt =
            slot.endHour > slot.startHour
              ? localDateAt(day, slot.endHour)
              : localDateAt(addDays(day, 1), slot.endHour);
          const typeIndex =
            (d * 19 + slotIdx * 7 + personIdx + deptName.length) %
            shiftTypePool.length;
          const shiftTypeId = shiftTypePool[typeIndex] ?? null;
          shiftRows.push({
            workplace_id: workplaceId,
            department_id: departmentId,
            user_id: person.user_id,
            shift_type_id: shiftTypeId,
            starts_at: startsAt.toISOString(),
            ends_at: endsAt.toISOString(),
          });
        }
      }
    }
  }
  return { start, end: addDays(start, DAYS_TO_PLAN), shiftRows };
}

async function resetAndInsertShifts(workplaceId, staff, monthData) {
  const userIds = staff.map((s) => s.user_id);
  const { error: delErr } = await supabase
    .from("workplace_shifts")
    .delete()
    .eq("workplace_id", workplaceId)
    .in("user_id", userIds)
    .gte("starts_at", monthData.start.toISOString())
    .lt("starts_at", monthData.end.toISOString());
  if (delErr) {
    if (/workplace_shifts|schema cache|does not exist|42p01/i.test(delErr.message)) {
      throw new Error(
        "Table workplace_shifts is missing. Run supabase_workplace_shifts.sql in Supabase SQL Editor, then rerun `npm run seed:great-restaurant`."
      );
    }
    throw new Error(`Failed clearing existing shifts: ${delErr.message}`);
  }

  for (const part of chunk(monthData.shiftRows, 500)) {
    const { error } = await supabase.from("workplace_shifts").insert(part);
    if (error) throw new Error(`Failed inserting shifts: ${error.message}`);
  }
}

async function main() {
  const workplaceId = await getTargetWorkplaceId();
  console.log("Workplace found:", workplaceId);

  const departmentsByName = await ensureDepartments(workplaceId);
  console.log("Departments ensured:", departmentsByName);

  const employeeTypesRaw = await ensureEmployeeTypes(workplaceId);
  const shiftTypesRaw = await ensureShiftTypes(workplaceId);
  const { employeeTypes, shiftTypes } = await ensureTypeVisuals(
    workplaceId,
    employeeTypesRaw,
    shiftTypesRaw
  );
  console.log(
    `Types ready: ${employeeTypes.length} employee types, ${shiftTypes.length} shift types`
  );

  const staff = await ensureStaffUsers();
  console.log(`Staff users ready: ${staff.length}`);

  await upsertWorkplaceMembers(workplaceId, staff, employeeTypes);
  await assignDepartments(workplaceId, staff, departmentsByName);
  await upsertProfiles(staff, employeeTypes);

  const staffByDepartment = {
    København: [],
    Slagelse: [],
    Odense: [],
  };
  for (let i = 0; i < staff.length; i++) {
    const dept = DEPARTMENT_NAMES[i % DEPARTMENT_NAMES.length];
    staffByDepartment[dept].push(staff[i]);
  }

  const monthData = buildShiftsForMonth({
    workplaceId,
    staffByDepartment,
    departmentIdsByName: departmentsByName,
    shiftTypePool: orderedShiftTypePool(shiftTypes),
  });
  await resetAndInsertShifts(workplaceId, staff, monthData);

  console.log("Done.");
  console.log(`- Departments: ${DEPARTMENT_NAMES.join(", ")}`);
  console.log(`- Employees: ${staff.length}`);
  console.log(`- Shift rows inserted: ${monthData.shiftRows.length}`);
  console.log(
    `- Period: ${monthData.start.toISOString().slice(0, 10)} -> ${monthData.end
      .toISOString()
      .slice(0, 10)}`
  );
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exitCode = 1;
});
