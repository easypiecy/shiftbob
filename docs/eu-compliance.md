# ShiftBob EU Compliance Engine

Dette dokument beskriver regelmotoren for ShiftBob, baseret på EU's arbejdstidsdirektiv (2003/88/EC). Reglerne drives af en central `eu-rules.json` fil.

## Core Rules Implemented
1.  **Daily Rest (11-Hour Rule):** Min. 11 sammenhængende timers hvile pr. 24 timers periode.
2.  **Weekly Rest (35-Hour Rule):** Min. 24 timers uafbrudt hvile + 11 timers daglig hvile (samlet 35 timer) pr. 7-dages periode.
3.  **Maximum Weekly Hours:** Maks 48 timer i gennemsnit (17 ugers referenceperiode).
4.  **Maximum Daily Hours:** Anbefalet maks 10 timer pr. dag.
5.  **Maximum Consecutive Days:** Maks 6 arbejdsdage i træk.
6.  **Mandatory Breaks:** Min. 30 min pause for vagter >= 6 timer. Min. 45 min pause for vagter >= 9 timer.
7.  **Night Work Limits:** Max 8 timer i gennemsnit for natarbejdere.

## Severity Levels
-   `ERROR`: Ulovlig vagt. Skal blokere publicering/vagtbytte (f.eks. 11-timers brud).
-   `WARNING`: Ikke anbefalet, men ikke strengt blokerende (f.eks. > 10 timer på en dag).