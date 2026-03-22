"""
OR-Tools CP-SAT: tildel vagter til medarbejdere (proof of concept).

Kør lokalt:
  echo '{"employees":["Alice","Bob","Carol"],"num_shifts":5}' | python3 api/solver.py --stdin

Next.js kalder samme entry via subprocess fra app/api/solver/route.ts.
"""

from __future__ import annotations

import json
import sys
from http.server import BaseHTTPRequestHandler

from ortools.sat.python import cp_model


def solve_from_payload(data: dict) -> dict:
    """Basal CP-model: én medarbejder pr. vagt, max N vagter pr. person."""
    employees = data.get("employees") or ["Alice", "Bob", "Carol"]
    if not isinstance(employees, list) or len(employees) == 0:
        return {"ok": False, "error": "employees must be a non-empty list"}

    num_shifts = int(data.get("num_shifts", 5))
    max_shifts_per_employee = int(data.get("max_shifts_per_employee", 2))

    n_e = len(employees)
    n_s = num_shifts

    model = cp_model.CpModel()
    assign: dict[tuple[int, int], cp_model.IntVar] = {}
    for s in range(n_s):
        for e in range(n_e):
            assign[s, e] = model.NewBoolVar(f"x_{s}_{e}")

    # Præcis én medarbejder pr. vagt
    for s in range(n_s):
        model.Add(sum(assign[s, e] for e in range(n_e)) == 1)

    # Højst max_shifts_per_employee vagter pr. medarbejder
    for e in range(n_e):
        model.Add(sum(assign[s, e] for s in range(n_s)) <= max_shifts_per_employee)

    # Trivielt mål: maksimér tildelte bools (ækvivalent med at finde en løsning)
    model.Maximize(sum(assign[s, e] for s in range(n_s) for e in range(n_e)))

    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    if status not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return {
            "ok": False,
            "status": solver.StatusName(status),
            "solver_status": int(status),
            "assignments": [],
        }

    assignments = []
    for s in range(n_s):
        for e in range(n_e):
            if solver.Value(assign[s, e]) == 1:
                assignments.append(
                    {
                        "shift_index": s,
                        "employee_index": e,
                        "employee_name": str(employees[e]),
                    }
                )
                break

    assignments.sort(key=lambda x: x["shift_index"])

    return {
        "ok": True,
        "status": solver.StatusName(status),
        "solver_status": int(status),
        "assignments": assignments,
        "meta": {
            "num_shifts": n_s,
            "num_employees": n_e,
            "employees": employees,
            "max_shifts_per_employee": max_shifts_per_employee,
        },
    }


class handler(BaseHTTPRequestHandler):
    """Vercel Python Serverless (POST JSON). Bruges kun hvis denne fil deployes som /api/solver."""

    def do_POST(self) -> None:
        try:
            length = int(self.headers.get("Content-Length", 0))
            if length <= 0:
                self._send_json(400, {"ok": False, "error": "empty body"})
                return
            raw = self.rfile.read(length)
            data = json.loads(raw.decode("utf-8"))
            result = solve_from_payload(data)
            self._send_json(200 if result.get("ok") else 422, result)
        except Exception as e:
            self._send_json(500, {"ok": False, "error": str(e)})

    def _send_json(self, code: int, obj: dict) -> None:
        body = json.dumps(obj).encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, format: str, *args) -> None:
        return


def main_stdin() -> None:
    raw = sys.stdin.read()
    data = json.loads(raw) if raw.strip() else {}
    out = solve_from_payload(data)
    print(json.dumps(out, ensure_ascii=False))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--stdin":
        main_stdin()
    else:
        print(
            json.dumps(
                {
                    "ok": False,
                    "error": "Brug: python3 api/solver.py --stdin  (JSON på stdin)",
                }
            ),
            file=sys.stderr,
        )
        sys.exit(1)
