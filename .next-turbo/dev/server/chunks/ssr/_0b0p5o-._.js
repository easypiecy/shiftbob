module.exports = [
"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4011b458bfbb978d88eb4dad4864186d4757f9e43f":{"name":"runSpreadsheetImportAction"}},"app/dashboard/import-regneark/actions.ts",""] */ __turbopack_context__.s([
    "runSpreadsheetImportAction",
    ()=>runSpreadsheetImportAction
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/xlsx/xlsx.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
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
function parseEmployees(workbook) {
    const sheet = findSheetByExactName(workbook, "Employees");
    if (!sheet) {
        throw new Error("Missing required sheet: Employees");
    }
    const matrix = asMatrix(sheet);
    if (matrix.length === 0) return {
        employees: [],
        byName: new Map()
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
        jobTitle: header.indexOf("job title"),
        department: header.indexOf("department"),
        type: header.indexOf("type"),
        status: header.indexOf("status")
    };
    const employees = [];
    const byName = new Map();
    for(let r = headerRowIndex + 1; r < matrix.length; r++){
        const row = matrix[r] ?? [];
        const rawId = row[col.id];
        const localId = Number(rawId);
        if (!Number.isFinite(localId)) continue;
        const employee_id = Math.trunc(localId);
        const first_name = String(row[col.firstName] ?? "").trim();
        const last_name = String(row[col.lastName] ?? "").trim();
        const full_name = `${first_name} ${last_name}`.trim();
        if (!full_name) continue;
        const employee = {
            employee_id,
            first_name,
            last_name,
            full_name,
            job_title: String(row[col.jobTitle] ?? "").trim(),
            department: String(row[col.department] ?? "").trim(),
            type: String(row[col.type] ?? "").trim(),
            status: String(row[col.status] ?? "").trim()
        };
        employees.push(employee);
        byName.set(normalizeName(full_name), employee);
        if (first_name && last_name) {
            byName.set(normalizeName(`${last_name}, ${first_name}`), employee);
        }
    }
    return {
        employees,
        byName
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
        const { employees, byName } = parseEmployees(workbook);
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
            extractedEmployees: employees,
            extractedShiftTypes: shiftTypes,
            extractedShifts: shifts,
            euViolations,
            warnings,
            matchedSheet
        };
    } catch (error) {
        return {
            ok: false,
            error: error instanceof Error ? error.message : "Importen fejlede uventet."
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    runSpreadsheetImportAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(runSpreadsheetImportAction, "4011b458bfbb978d88eb4dad4864186d4757f9e43f", null);
}),
"[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => \"[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4011b458bfbb978d88eb4dad4864186d4757f9e43f",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["runSpreadsheetImportAction"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$dashboard$2f$import$2d$regneark$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/dashboard/import-regneark/page/actions.js { ACTIONS_MODULE0 => "[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$dashboard$2f$import$2d$regneark$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/dashboard/import-regneark/actions.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=_0b0p5o-._.js.map