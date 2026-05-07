module.exports = [
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "assertWorkplaceAdminOrSuperAdmin",
    ()=>assertWorkplaceAdminOrSuperAdmin,
    "assertWorkplaceMember",
    ()=>assertWorkplaceMember,
    "isWorkplaceCalendarAdminView",
    ()=>isWorkplaceCalendarAdminView
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/super-admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
;
;
async function hasSuperAdminAccessFromServer() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase);
}
async function assertWorkplaceAdminOrSuperAdmin(workplaceId) {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    if (await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$super$2d$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["hasSuperAdminAccess"])(supabase)) return;
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        throw new Error("Kunne ikke verificere adgang.");
    }
    const arr = Array.isArray(roles) ? roles : [];
    if (!arr.includes("ADMIN") && !arr.includes("SUPER_ADMIN")) {
        throw new Error("Ingen administrator-adgang til denne arbejdsplads.");
    }
}
async function assertWorkplaceMember(workplaceId) {
    if (await hasSuperAdminAccessFromServer()) return;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        throw new Error("Kunne ikke verificere adgang.");
    }
    const arr = Array.isArray(roles) ? roles : [];
    if (arr.length === 0) {
        throw new Error("Ingen adgang til denne arbejdsplads.");
    }
}
async function isWorkplaceCalendarAdminView(workplaceId) {
    if (await hasSuperAdminAccessFromServer()) return true;
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
    const { data: roles, error } = await supabase.rpc("get_my_roles_for_workplace", {
        p_workplace_id: workplaceId
    });
    if (error) {
        return false;
    }
    const arr = Array.isArray(roles) ? roles : [];
    return arr.includes("ADMIN") || arr.includes("SUPER_ADMIN") || arr.includes("MANAGER");
}
}),
"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4011b458bfbb978d88eb4dad4864186d4757f9e43f":{"name":"runSpreadsheetImportAction"},"40e7e97d1ee568729bacc97ac9b101e76d0c0d7d4f":{"name":"approveSpreadsheetPlanAction"}},"app/dashboard/import-regneark/actions.ts",""] */ __turbopack_context__.s([
    "approveSpreadsheetPlanAction",
    ()=>approveSpreadsheetPlanAction,
    "runSpreadsheetImportAction",
    ()=>runSpreadsheetImportAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:crypto [external] (node:crypto, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/workplace-admin-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/admin.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
;
function asMatrix(sheet) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet, {
        header: 1,
        defval: "",
        blankrows: false,
        raw: true
    });
}
function normalizeHeader(value) {
    return String(value ?? "").trim().toLowerCase().replace(/[_\s]+/g, " ").replace(/[^\w\s#]/g, "");
}
function normalizeName(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function normalizeShiftCode(value) {
    return value.trim().toUpperCase();
}
function normalizeKey(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ");
}
function pad2(n) {
    return String(n).padStart(2, "0");
}
function toIsoDate(year, month, day) {
    return `${year}-${pad2(month)}-${pad2(day)}`;
}
function shiftStartDateTime(shift) {
    return new Date(`${shift.date}T${shift.start_time}:00`);
}
function shiftEndDateTime(shift) {
    const start = shiftStartDateTime(shift);
    const end = new Date(`${shift.date}T${shift.end_time}:00`);
    if (end.getTime() <= start.getTime()) {
        end.setDate(end.getDate() + 1);
    }
    return end;
}
function buildPlaceholderEmail(companyId, localEmployeeId) {
    const c = companyId.replace(/[^a-zA-Z0-9]/g, "").toLowerCase().slice(0, 20);
    return `import+${c}.${localEmployeeId}@shiftbob.local`;
}
function readCellString(row, idx) {
    if (idx < 0) return "";
    return String(row[idx] ?? "").trim();
}
function findHeaderIndex(headers, ...candidates) {
    for (const candidate of candidates){
        const idx = headers.indexOf(candidate);
        if (idx >= 0) return idx;
    }
    return -1;
}
function excelTimeToHHMM(value) {
    if (typeof value === "string") {
        const trimmed = value.trim();
        const m = /^(\d{1,2}):(\d{2})$/.exec(trimmed);
        if (!m) return null;
        const hh = Number(m[1]);
        const mm = Number(m[2]);
        if (!Number.isFinite(hh) || !Number.isFinite(mm) || hh < 0 || hh > 23 || mm < 0 || mm > 59) {
            return null;
        }
        return `${pad2(hh)}:${pad2(mm)}`;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        const minutes = Math.round(value * 24 * 60);
        const hh = Math.floor(minutes / 60) % 24;
        const mm = minutes % 60;
        return `${pad2(hh)}:${pad2(mm)}`;
    }
    return null;
}
function findSheetByExactName(workbook, wantedName) {
    const name = workbook.SheetNames.find((n)=>n.trim().toLowerCase() === wantedName.trim().toLowerCase());
    return name ? workbook.Sheets[name] : null;
}
function emptyCompanySettings() {
    return {
        display_name: null,
        company_name: null,
        cvr_vat_number: null,
        no_of_employees: null,
        street: null,
        street_no: null,
        city: null,
        additional_suite: null,
        email: null,
        timezone: null,
        postal_code: null,
        country_iso2: null,
        phone: null
    };
}
function normalizeSettingsKey(value) {
    return value.trim().toLowerCase().replace(/\s+/g, " ").replace(/[().,:/\\-]+/g, " ").replace(/\s+/g, " ").trim();
}
function isBlankDbValue(value) {
    return value == null || typeof value === "string" && value.trim() === "";
}
function parseCompanySettings(workbook) {
    const sheet = findSheetByExactName(workbook, "Settings");
    if (!sheet) return {
        companySettings: emptyCompanySettings(),
        warnings: []
    };
    const matrix = asMatrix(sheet);
    if (matrix.length === 0) return {
        companySettings: emptyCompanySettings(),
        warnings: []
    };
    const companySettings = emptyCompanySettings();
    const warnings = [];
    const keyMap = new Map([
        [
            "display name",
            "display_name"
        ],
        [
            "company name",
            "company_name"
        ],
        [
            "cvr vat number",
            "cvr_vat_number"
        ],
        [
            "no of employees",
            "no_of_employees"
        ],
        [
            "street",
            "street"
        ],
        [
            "street no",
            "street_no"
        ],
        [
            "city",
            "city"
        ],
        [
            "additional suite",
            "additional_suite"
        ],
        [
            "email",
            "email"
        ],
        [
            "timezone",
            "timezone"
        ],
        [
            "postal code",
            "postal_code"
        ],
        [
            "country iso 2",
            "country_iso2"
        ],
        [
            "phone",
            "phone"
        ]
    ]);
    let sectionStart = 0;
    const sectionIdx = matrix.findIndex((row)=>normalizeSettingsKey(String(row[0] ?? "")).includes("company address"));
    if (sectionIdx >= 0) sectionStart = sectionIdx + 1;
    for(let r = sectionStart; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const keyRaw = String(row[0] ?? "").trim();
        if (!keyRaw) continue;
        const key = normalizeSettingsKey(keyRaw);
        const mapped = keyMap.get(key);
        if (!mapped) continue;
        const value = String(row[1] ?? "").trim();
        if (!value) continue;
        companySettings[mapped] = value;
    }
    if (companySettings.country_iso2 && companySettings.country_iso2.length !== 2) {
        warnings.push(`Country (ISO-2) value '${companySettings.country_iso2}' is not 2 characters`);
    }
    return {
        companySettings,
        warnings
    };
}
async function syncCompanySettingsIfEmpty(companyId, companySettings) {
    const warnings = [];
    const allowedEmployeeBands = new Set([
        "0-4",
        "5-20",
        "21-50",
        "51-100",
        "101-200",
        "201-500",
        "500+"
    ]);
    const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
    const { data: workplace, error } = await admin.from("workplaces").select("id, name, company_name, vat_number, employee_count_band, street_name, street_number, city, address_extra, contact_email, postal_code, country_code, phone").eq("id", companyId).maybeSingle();
    if (error) {
        warnings.push(`Could not read workplace settings: ${error.message}`);
        return warnings;
    }
    if (!workplace) {
        warnings.push("Workplace not found for company settings sync.");
        return warnings;
    }
    const patch = {};
    if (isBlankDbValue(workplace.name) && companySettings.display_name) patch.name = companySettings.display_name;
    if (isBlankDbValue(workplace.company_name) && companySettings.company_name) {
        patch.company_name = companySettings.company_name;
    }
    if (isBlankDbValue(workplace.vat_number) && companySettings.cvr_vat_number) {
        patch.vat_number = companySettings.cvr_vat_number;
    }
    if (isBlankDbValue(workplace.employee_count_band) && companySettings.no_of_employees) {
        const band = companySettings.no_of_employees.trim();
        if (allowedEmployeeBands.has(band)) {
            patch.employee_count_band = band;
        } else {
            warnings.push(`No. of Employees value '${companySettings.no_of_employees}' does not match allowed bands and was skipped`);
        }
    }
    if (isBlankDbValue(workplace.street_name) && companySettings.street) patch.street_name = companySettings.street;
    if (isBlankDbValue(workplace.street_number) && companySettings.street_no) {
        patch.street_number = companySettings.street_no;
    }
    if (isBlankDbValue(workplace.city) && companySettings.city) patch.city = companySettings.city;
    if (isBlankDbValue(workplace.address_extra) && companySettings.additional_suite) {
        patch.address_extra = companySettings.additional_suite;
    }
    if (isBlankDbValue(workplace.contact_email) && companySettings.email) {
        patch.contact_email = companySettings.email;
    }
    if (isBlankDbValue(workplace.postal_code) && companySettings.postal_code) {
        patch.postal_code = companySettings.postal_code;
    }
    if (isBlankDbValue(workplace.country_code) && companySettings.country_iso2) {
        patch.country_code = companySettings.country_iso2.toUpperCase();
    }
    if (isBlankDbValue(workplace.phone) && companySettings.phone) patch.phone = companySettings.phone;
    if (companySettings.timezone) {
        warnings.push("Timezone extracted from Settings sheet but not mapped to a workplace column.");
    }
    if (Object.keys(patch).length > 0) {
        const updateRes = await admin.from("workplaces").update(patch).eq("id", companyId);
        if (updateRes.error) {
            warnings.push(`Could not update workplace settings from spreadsheet: ${updateRes.error.message}`);
        }
    }
    return warnings;
}
function parseDepartments(workbook) {
    const sheet = findSheetByExactName(workbook, "Departments");
    if (!sheet) {
        return {
            departments: [],
            departmentIdByName: new Map()
        };
    }
    const matrix = asMatrix(sheet);
    if (matrix.length === 0) return {
        departments: [],
        departmentIdByName: new Map()
    };
    const headerRowIndex = matrix.findIndex((row)=>{
        const headers = row.map(normalizeHeader);
        return headers.includes("dept id") && headers.includes("department name");
    });
    if (headerRowIndex < 0) {
        throw new Error("Departments sheet is missing the expected header row");
    }
    const header = matrix[headerRowIndex].map(normalizeHeader);
    const col = {
        deptId: findHeaderIndex(header, "dept id", "department id"),
        departmentName: findHeaderIndex(header, "department name", "department"),
        notes: findHeaderIndex(header, "notes", "note")
    };
    const departments = [];
    const departmentIdByName = new Map();
    for(let r = headerRowIndex + 1; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const dept_id = readCellString(row, col.deptId);
        const department_name = readCellString(row, col.departmentName);
        if (!dept_id || !department_name) continue;
        const item = {
            dept_id,
            department_name,
            notes: readCellString(row, col.notes)
        };
        departments.push(item);
        departmentIdByName.set(normalizeName(department_name), dept_id);
    }
    return {
        departments,
        departmentIdByName
    };
}
function parseEmployees(params) {
    const { workbook, departmentIdByName } = params;
    const sheet = findSheetByExactName(workbook, "Employees");
    if (!sheet) {
        throw new Error("Missing required sheet: Employees");
    }
    const matrix = asMatrix(sheet);
    if (matrix.length === 0) return {
        employees: [],
        byName: new Map(),
        warnings: []
    };
    const headerRowIndex = matrix.findIndex((row)=>{
        const headers = row.map(normalizeHeader);
        return headers.includes("#") && headers.includes("first name") && headers.includes("last name");
    });
    if (headerRowIndex < 0) {
        throw new Error("Employees sheet is missing the expected header row");
    }
    const header = matrix[headerRowIndex].map(normalizeHeader);
    const col = {
        id: header.indexOf("#"),
        firstName: header.indexOf("first name"),
        lastName: header.indexOf("last name"),
        email: findHeaderIndex(header, "email", "e-mail", "mail"),
        mobilePhone: findHeaderIndex(header, "mobile phone", "mobile", "phone", "telefon"),
        streetName: findHeaderIndex(header, "street name", "street", "adresse", "address"),
        streetNumber: findHeaderIndex(header, "street number", "house number", "nr", "number"),
        postalCode: findHeaderIndex(header, "postal code", "zip", "zip code", "postnummer"),
        city: findHeaderIndex(header, "city", "by"),
        country: findHeaderIndex(header, "country", "land"),
        note: findHeaderIndex(header, "note", "notes", "kommentar"),
        contractHoursPerWeek: findHeaderIndex(header, "contract hrswk", "contrac hrswk", "contract hours"),
        maxHoursPerWeek: findHeaderIndex(header, "max hrswk", "max hours"),
        startDate: findHeaderIndex(header, "start date", "start date yyyymmdd"),
        jobTitle: header.indexOf("job title"),
        department: header.indexOf("department"),
        type: header.indexOf("type"),
        status: header.indexOf("status")
    };
    const employees = [];
    const byName = new Map();
    const warnings = [];
    for(let r = headerRowIndex + 1; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const rawId = row[col.id];
        const localId = Number(rawId);
        if (!Number.isFinite(localId)) continue;
        const employee_id = Math.trunc(localId);
        const first_name = readCellString(row, col.firstName);
        const last_name = readCellString(row, col.lastName);
        const full_name = `${first_name} ${last_name}`.trim();
        if (!full_name) continue;
        const email = readCellString(row, col.email).toLowerCase();
        const employee = {
            employee_id,
            first_name,
            last_name,
            full_name,
            email,
            mobile_phone: readCellString(row, col.mobilePhone),
            street_name: readCellString(row, col.streetName),
            street_number: readCellString(row, col.streetNumber),
            postal_code: readCellString(row, col.postalCode),
            city: readCellString(row, col.city),
            country: readCellString(row, col.country),
            note: readCellString(row, col.note),
            contract_hours_per_week: readCellString(row, col.contractHoursPerWeek),
            max_hours_per_week: readCellString(row, col.maxHoursPerWeek),
            start_date: readCellString(row, col.startDate),
            job_title: readCellString(row, col.jobTitle),
            department: readCellString(row, col.department),
            department_id: null,
            type: readCellString(row, col.type),
            status: readCellString(row, col.status)
        };
        if (employee.department) {
            employee.department_id = departmentIdByName.get(normalizeName(employee.department)) ?? null;
            if (!employee.department_id) {
                warnings.push(`Department '${employee.department}' for employee '${employee.full_name}' was not found in Departments sheet`);
            }
        }
        employees.push(employee);
        byName.set(normalizeName(full_name), employee);
        if (first_name && last_name) {
            byName.set(normalizeName(`${last_name}, ${first_name}`), employee);
        }
    }
    return {
        employees,
        byName,
        warnings
    };
}
function parseShiftTypes(workbook) {
    const sheet = findSheetByExactName(workbook, "Shift_Types");
    if (!sheet) {
        throw new Error("Missing required sheet: Shift_Types");
    }
    const matrix = asMatrix(sheet);
    if (matrix.length === 0) return {
        shiftTypes: [],
        lookup: {}
    };
    const headerRowIndex = matrix.findIndex((row)=>{
        const headers = row.map(normalizeHeader);
        return (headers.includes("shift code") || headers.includes("code")) && headers.includes("start time") && headers.includes("end time");
    });
    if (headerRowIndex < 0) {
        throw new Error("Shift_Types sheet is missing the expected header row");
    }
    const header = matrix[headerRowIndex].map(normalizeHeader);
    const codeIdx = Math.max(header.indexOf("shift code"), header.indexOf("code"));
    const startIdx = header.indexOf("start time");
    const endIdx = header.indexOf("end time");
    const shiftTypes = [];
    const lookup = {};
    for(let r = headerRowIndex + 1; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const shift_code = normalizeShiftCode(String(row[codeIdx] ?? ""));
        if (!shift_code) continue;
        const start_time = excelTimeToHHMM(row[startIdx]);
        const end_time = excelTimeToHHMM(row[endIdx]);
        if (!start_time || !end_time) continue;
        const item = {
            shift_code,
            start_time,
            end_time
        };
        shiftTypes.push(item);
        lookup[shift_code] = item;
    }
    return {
        shiftTypes,
        lookup
    };
}
function monthNamesEnUpper(month) {
    const dt = new Date(Date.UTC(2000, month - 1, 1));
    return dt.toLocaleString("en-US", {
        month: "long"
    }).toUpperCase();
}
function findMonthlyScheduleSheet(workbook, month, year) {
    const monthWord = monthNamesEnUpper(month);
    const exactByName = workbook.SheetNames.find((name)=>{
        const upper = name.trim().toUpperCase();
        return upper.includes(monthWord) && upper.includes(String(year));
    });
    if (exactByName) {
        return {
            sheetName: exactByName,
            sheet: workbook.Sheets[exactByName]
        };
    }
    for (const name of workbook.SheetNames){
        const sheet = workbook.Sheets[name];
        const a1 = sheet?.A1?.v;
        const upper = String(a1 ?? "").trim().toUpperCase();
        if (upper.includes(monthWord) && upper.includes(String(year))) {
            return {
                sheetName: name,
                sheet
            };
        }
    }
    const fallback = findSheetByExactName(workbook, "Monthly Schedule");
    if (fallback) {
        return {
            sheetName: "Monthly Schedule",
            sheet: fallback
        };
    }
    throw new Error("Could not locate the monthly schedule sheet for selected month/year");
}
function resolveDateHeaderRow(matrix) {
    let best = {
        rowIndex: -1,
        dateCols: []
    };
    const scanLimit = Math.min(matrix.length, 40);
    for(let r = 0; r < scanLimit; r++){
        const row = matrix[r] ?? [];
        const dateCols = [];
        for(let c = 1; c < row.length; c++){
            const value = row[c];
            const day = Number(value);
            if (Number.isInteger(day) && day >= 1 && day <= 31) {
                dateCols.push({
                    col: c,
                    day
                });
            }
        }
        if (dateCols.length > best.dateCols.length) {
            best = {
                rowIndex: r,
                dateCols
            };
        }
    }
    if (best.rowIndex < 0 || best.dateCols.length === 0) {
        throw new Error("Could not detect date header row in schedule sheet");
    }
    return best;
}
function parseMonthlySchedule(params) {
    const { workbook, month, year, employeesByName, shiftLookup } = params;
    const { sheetName, sheet } = findMonthlyScheduleSheet(workbook, month, year);
    const matrix = asMatrix(sheet);
    const { rowIndex, dateCols } = resolveDateHeaderRow(matrix);
    const warnings = [];
    const shifts = [];
    let blankEmployeeRows = 0;
    for(let r = rowIndex + 1; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const employeeName = String(row[0] ?? "").trim();
        if (!employeeName) {
            blankEmployeeRows += 1;
            if (blankEmployeeRows >= 8) break;
            continue;
        }
        blankEmployeeRows = 0;
        const employee = employeesByName.get(normalizeName(employeeName));
        if (!employee) {
            warnings.push(`Employee '${employeeName}' was not found in Employees sheet`);
            continue;
        }
        for (const { col, day } of dateCols){
            const rawCell = row[col];
            const code = normalizeShiftCode(String(rawCell ?? ""));
            if (!code) continue;
            const shiftType = shiftLookup[code];
            if (!shiftType) {
                warnings.push(`Unknown shift code '${code}' for employee '${employee.full_name}' on day ${day}`);
                continue;
            }
            shifts.push({
                employee_id: employee.employee_id,
                date: toIsoDate(year, month, day),
                shift_code: shiftType.shift_code,
                start_time: shiftType.start_time,
                end_time: shiftType.end_time
            });
        }
    }
    return {
        shifts,
        warnings,
        matchedSheet: sheetName
    };
}
function detectEuRuleViolations(params) {
    const { employees, shifts } = params;
    const nameById = new Map(employees.map((employee)=>[
            employee.employee_id,
            employee.full_name
        ]));
    const byEmployee = new Map();
    for (const shift of shifts){
        const list = byEmployee.get(shift.employee_id) ?? [];
        list.push(shift);
        byEmployee.set(shift.employee_id, list);
    }
    const violations = [];
    for (const [employeeId, employeeShifts] of byEmployee.entries()){
        const sorted = [
            ...employeeShifts
        ].sort((a, b)=>shiftStartDateTime(a).getTime() - shiftStartDateTime(b).getTime());
        for(let i = 1; i < sorted.length; i++){
            const prev = sorted[i - 1];
            const curr = sorted[i];
            const prevEnd = shiftEndDateTime(prev).getTime();
            const currStart = shiftStartDateTime(curr).getTime();
            const employee_name = nameById.get(employeeId) ?? `#${employeeId}`;
            if (currStart < prevEnd) {
                violations.push({
                    employee_name,
                    date: curr.date,
                    time_range: `${curr.start_time} - ${curr.end_time}`,
                    rule: "Overlap mellem vagter"
                });
                continue;
            }
            const restHours = (currStart - prevEnd) / (1000 * 60 * 60);
            if (restHours < 11) {
                violations.push({
                    employee_name,
                    date: curr.date,
                    time_range: `${curr.start_time} - ${curr.end_time}`,
                    rule: `11-timers hviletid overskredet (${restHours.toFixed(1)} t)`
                });
            }
        }
    }
    return violations;
}
async function runSpreadsheetImportAction(input) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {
            ok: false,
            error: "Ikke logget ind."
        };
        const file = input.get("file");
        const companyId = String(input.get("companyId") ?? "").trim();
        const selectedMonth = Number(input.get("selectedMonth"));
        const selectedYear = Number(input.get("selectedYear"));
        const runEuComplianceCheck = String(input.get("runEuComplianceCheck") ?? "true") === "true";
        if (!(file instanceof File)) {
            return {
                ok: false,
                error: "Manglende fil."
            };
        }
        if (!companyId) {
            return {
                ok: false,
                error: "Manglende virksomheds-id."
            };
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(companyId);
        if (!Number.isInteger(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
            return {
                ok: false,
                error: "Ugyldig måned."
            };
        }
        if (!Number.isInteger(selectedYear) || selectedYear < 2000 || selectedYear > 3000) {
            return {
                ok: false,
                error: "Ugyldigt år."
            };
        }
        const buffer = await file.arrayBuffer();
        const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["read"](buffer, {
            type: "array"
        });
        const { companySettings, warnings: companySettingsWarnings } = parseCompanySettings(workbook);
        const companySyncWarnings = await syncCompanySettingsIfEmpty(companyId, companySettings);
        const { departments, departmentIdByName } = parseDepartments(workbook);
        const { employees, byName, warnings: employeeWarnings } = parseEmployees({
            workbook,
            departmentIdByName
        });
        const { shiftTypes, lookup } = parseShiftTypes(workbook);
        const { shifts, warnings, matchedSheet } = parseMonthlySchedule({
            workbook,
            month: selectedMonth,
            year: selectedYear,
            employeesByName: byName,
            shiftLookup: lookup
        });
        const euViolations = runEuComplianceCheck ? detectEuRuleViolations({
            employees,
            shifts
        }) : [];
        return {
            ok: true,
            extractedCompanySettings: companySettings,
            extractedDepartments: departments,
            extractedEmployees: employees,
            extractedShiftTypes: shiftTypes,
            extractedShifts: shifts,
            euViolations,
            warnings: [
                ...companySettingsWarnings,
                ...companySyncWarnings,
                ...employeeWarnings,
                ...warnings
            ],
            matchedSheet
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Importen fejlede uventet."
        };
    }
}
async function listAllAuthUsers(admin) {
    const users = [];
    let page = 1;
    const perPage = 1000;
    for(;;){
        const res = await admin.auth.admin.listUsers({
            page,
            perPage
        });
        if (res.error) {
            throw new Error(res.error.message);
        }
        const current = res.data.users ?? [];
        for (const user of current){
            users.push({
                id: user.id,
                email: String(user.email ?? "").trim().toLowerCase(),
                user_metadata: user.user_metadata ?? null
            });
        }
        if (current.length < perPage) break;
        page += 1;
        if (page > 100) break;
    }
    return users;
}
async function approveSpreadsheetPlanAction(input) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabase"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {
            ok: false,
            error: "Ikke logget ind."
        };
        const companyId = String(input.companyId ?? "").trim();
        if (!companyId) return {
            ok: false,
            error: "Manglende virksomheds-id."
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$workplace$2d$admin$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["assertWorkplaceAdminOrSuperAdmin"])(companyId);
        const selectedMonth = Number(input.selectedMonth);
        const selectedYear = Number(input.selectedYear);
        if (!Number.isInteger(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
            return {
                ok: false,
                error: "Ugyldig måned."
            };
        }
        if (!Number.isInteger(selectedYear) || selectedYear < 2000 || selectedYear > 3000) {
            return {
                ok: false,
                error: "Ugyldigt år."
            };
        }
        const extractedEmployees = Array.isArray(input.extractedEmployees) ? input.extractedEmployees : [];
        const extractedShiftTypes = Array.isArray(input.extractedShiftTypes) ? input.extractedShiftTypes : [];
        const extractedShifts = Array.isArray(input.extractedShifts) ? input.extractedShifts : [];
        const shiftTimeByCode = new Map();
        for (const shiftType of extractedShiftTypes){
            const code = normalizeShiftCode(String(shiftType.shift_code ?? ""));
            const start = excelTimeToHHMM(shiftType.start_time);
            const end = excelTimeToHHMM(shiftType.end_time);
            if (!code || !start || !end) continue;
            shiftTimeByCode.set(code, {
                start_time: start,
                end_time: end
            });
        }
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAdminClient"])();
        const [departmentRes, shiftTypeRes, memberRes] = await Promise.all([
            admin.from("workplace_departments").select("id, name").eq("workplace_id", companyId),
            admin.from("workplace_shift_types").select("id, label, sort_order").eq("workplace_id", companyId),
            admin.from("workplace_members").select("user_id").eq("workplace_id", companyId)
        ]);
        if (departmentRes.error) return {
            ok: false,
            error: departmentRes.error.message
        };
        if (shiftTypeRes.error) return {
            ok: false,
            error: shiftTypeRes.error.message
        };
        if (memberRes.error) return {
            ok: false,
            error: memberRes.error.message
        };
        const departmentIdByName = new Map();
        for (const row of departmentRes.data ?? []){
            const name = String(row.name ?? "");
            const id = String(row.id ?? "");
            if (!name || !id) continue;
            departmentIdByName.set(normalizeKey(name), id);
        }
        let createdDepartments = 0;
        async function ensureDepartmentId(rawDepartmentName) {
            const name = rawDepartmentName.trim();
            if (!name) return null;
            const key = normalizeKey(name);
            const existing = departmentIdByName.get(key);
            if (existing) return existing;
            const ins = await admin.from("workplace_departments").insert({
                workplace_id: companyId,
                name
            }).select("id, name").single();
            if (ins.error) {
                throw new Error(ins.error.message);
            }
            const id = String(ins.data.id);
            departmentIdByName.set(key, id);
            createdDepartments += 1;
            return id;
        }
        const shiftTypeIdByCode = new Map();
        let maxShiftSortOrder = 0;
        for (const row of shiftTypeRes.data ?? []){
            const label = normalizeShiftCode(String(row.label ?? ""));
            const id = String(row.id ?? "");
            if (!label || !id) continue;
            shiftTypeIdByCode.set(label, id);
            const sort = Number(row.sort_order ?? 0);
            if (Number.isFinite(sort)) maxShiftSortOrder = Math.max(maxShiftSortOrder, sort);
        }
        async function ensureShiftTypeId(shiftCode) {
            const normalized = normalizeShiftCode(shiftCode);
            const existing = shiftTypeIdByCode.get(normalized);
            if (existing) return existing;
            maxShiftSortOrder += 10;
            const ins = await admin.from("workplace_shift_types").insert({
                workplace_id: companyId,
                template_id: null,
                label: normalized,
                sort_order: maxShiftSortOrder,
                calendar_color: "#94a3b8"
            }).select("id, label").single();
            if (ins.error) throw new Error(ins.error.message);
            const id = String(ins.data.id);
            shiftTypeIdByCode.set(normalized, id);
            return id;
        }
        const membershipUserIds = new Set((memberRes.data ?? []).map((row)=>String(row.user_id)));
        const allAuthUsers = await listAllAuthUsers(admin);
        const userIdByEmail = new Map();
        const metadataByUserId = new Map();
        for (const u of allAuthUsers){
            metadataByUserId.set(u.id, u.user_metadata);
            const email = u.email;
            if (!email) continue;
            userIdByEmail.set(email, u.id);
        }
        const memberUserIdByLocalEmployeeId = new Map();
        for (const userId of membershipUserIds){
            const metadata = metadataByUserId.get(userId);
            if (!metadata) continue;
            const importedCompanyId = String(metadata.import_company_id ?? "").trim();
            const importedLocalId = Number(metadata.import_local_employee_id);
            if (importedCompanyId !== companyId || !Number.isInteger(importedLocalId)) continue;
            memberUserIdByLocalEmployeeId.set(importedLocalId, userId);
        }
        let createdEmployees = 0;
        const employeeRefByLocalId = new Map();
        for (const employee of extractedEmployees){
            const localId = Number(employee.employee_id);
            if (!Number.isInteger(localId)) continue;
            const hasImportedEmail = Boolean(employee.email) && employee.email.includes("@");
            const preferredEmail = hasImportedEmail ? employee.email.toLowerCase() : buildPlaceholderEmail(companyId, localId);
            let userId = memberUserIdByLocalEmployeeId.get(localId) ?? userIdByEmail.get(preferredEmail) ?? null;
            if (!userId) {
                const created = await admin.auth.admin.createUser({
                    email: preferredEmail,
                    password: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$crypto__$5b$external$5d$__$28$node$3a$crypto$2c$__cjs$29$__["randomUUID"])(),
                    email_confirm: true,
                    user_metadata: {
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        full_name: employee.full_name,
                        import_company_id: companyId,
                        import_local_employee_id: localId,
                        import_job_title: employee.job_title || null,
                        import_employee_type: employee.type || null,
                        import_employee_status: employee.status || null,
                        import_contract_hours_per_week: employee.contract_hours_per_week || null,
                        import_max_hours_per_week: employee.max_hours_per_week || null,
                        import_start_date: employee.start_date || null
                    }
                });
                if (created.error || !created.data.user) {
                    throw new Error(created.error?.message ?? `Kunne ikke oprette medarbejder ${employee.full_name}`);
                }
                userId = created.data.user.id;
                userIdByEmail.set(preferredEmail, userId);
                metadataByUserId.set(userId, {
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    full_name: employee.full_name,
                    import_company_id: companyId,
                    import_local_employee_id: localId,
                    import_job_title: employee.job_title || null,
                    import_employee_type: employee.type || null,
                    import_employee_status: employee.status || null,
                    import_contract_hours_per_week: employee.contract_hours_per_week || null,
                    import_max_hours_per_week: employee.max_hours_per_week || null,
                    import_start_date: employee.start_date || null
                });
                createdEmployees += 1;
            } else {
                const metadata = metadataByUserId.get(userId) ?? {};
                const updateUser = await admin.auth.admin.updateUserById(userId, {
                    user_metadata: {
                        ...metadata,
                        first_name: employee.first_name,
                        last_name: employee.last_name,
                        full_name: employee.full_name,
                        import_company_id: companyId,
                        import_local_employee_id: localId,
                        import_job_title: employee.job_title || null,
                        import_employee_type: employee.type || null,
                        import_employee_status: employee.status || null,
                        import_contract_hours_per_week: employee.contract_hours_per_week || null,
                        import_max_hours_per_week: employee.max_hours_per_week || null,
                        import_start_date: employee.start_date || null
                    }
                });
                if (updateUser.error) {
                    throw new Error(updateUser.error.message);
                }
            }
            if (!membershipUserIds.has(userId)) {
                const upsertMember = await admin.from("workplace_members").upsert({
                    workplace_id: companyId,
                    user_id: userId,
                    role: "EMPLOYEE"
                }, {
                    onConflict: "user_id,workplace_id"
                });
                if (upsertMember.error) throw new Error(upsertMember.error.message);
                membershipUserIds.add(userId);
            }
            memberUserIdByLocalEmployeeId.set(localId, userId);
            const upsertProfile = await admin.from("user_profiles").upsert({
                user_id: userId,
                first_name: employee.first_name,
                last_name: employee.last_name,
                mobile_phone: employee.mobile_phone || null,
                street_name: employee.street_name || null,
                street_number: employee.street_number || null,
                postal_code: employee.postal_code || null,
                city: employee.city || null,
                country: employee.country || null,
                note: employee.note || null,
                updated_at: new Date().toISOString()
            }, {
                onConflict: "user_id"
            });
            if (upsertProfile.error) throw new Error(upsertProfile.error.message);
            const departmentId = await ensureDepartmentId(employee.department);
            if (departmentId) {
                const upsertDepartmentMembership = await admin.from("workplace_department_members").upsert({
                    workplace_id: companyId,
                    user_id: userId,
                    department_id: departmentId
                }, {
                    onConflict: "user_id,department_id"
                });
                if (upsertDepartmentMembership.error) {
                    throw new Error(upsertDepartmentMembership.error.message);
                }
            }
            employeeRefByLocalId.set(localId, {
                userId,
                departmentId
            });
        }
        const shiftRows = [];
        for (const shift of extractedShifts){
            const dateParts = String(shift.date).split("-");
            if (dateParts.length !== 3) continue;
            const y = Number(dateParts[0]);
            const m = Number(dateParts[1]);
            if (y !== selectedYear || m !== selectedMonth) continue;
            const employeeRef = employeeRefByLocalId.get(Number(shift.employee_id));
            if (!employeeRef) continue;
            const shiftTypeId = await ensureShiftTypeId(shift.shift_code);
            const shiftCode = normalizeShiftCode(shift.shift_code);
            // XLS Shift_Types er sandhed for tider pr. kode; matcher ikke "standard",
            // så bruger vi tiderne fra fanebladet.
            const xlsTime = shiftTimeByCode.get(shiftCode);
            const startTime = xlsTime?.start_time ?? shift.start_time;
            const endTime = xlsTime?.end_time ?? shift.end_time;
            const startsAt = new Date(`${shift.date}T${startTime}:00`);
            const endsAt = new Date(`${shift.date}T${endTime}:00`);
            if (Number.isNaN(startsAt.getTime()) || Number.isNaN(endsAt.getTime())) continue;
            if (endsAt.getTime() <= startsAt.getTime()) endsAt.setDate(endsAt.getDate() + 1);
            shiftRows.push({
                workplace_id: companyId,
                department_id: employeeRef.departmentId,
                user_id: employeeRef.userId,
                shift_type_id: shiftTypeId,
                starts_at: startsAt.toISOString(),
                ends_at: endsAt.toISOString()
            });
        }
        let insertedShifts = 0;
        const chunkSize = 200;
        for(let i = 0; i < shiftRows.length; i += chunkSize){
            const chunk = shiftRows.slice(i, i + chunkSize);
            if (chunk.length === 0) continue;
            const ins = await admin.from("workplace_shifts").insert(chunk);
            if (ins.error) throw new Error(ins.error.message);
            insertedShifts += chunk.length;
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard");
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])("/dashboard/import-regneark");
        return {
            ok: true,
            createdDepartments,
            createdEmployees,
            insertedShifts
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Godkendelse fejlede."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    runSpreadsheetImportAction,
    approveSpreadsheetPlanAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runSpreadsheetImportAction, "4011b458bfbb978d88eb4dad4864186d4757f9e43f", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(approveSpreadsheetPlanAction, "40e7e97d1ee568729bacc97ac9b101e76d0c0d7d4f", null);
}),
"[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)");
;
;
}),
"[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4011b458bfbb978d88eb4dad4864186d4757f9e43f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runSpreadsheetImportAction"],
    "40e7e97d1ee568729bacc97ac9b101e76d0c0d7d4f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["approveSpreadsheetPlanAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$import$2d$regneark$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => "[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0ydstog._.js.map