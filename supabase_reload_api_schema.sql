-- ShiftBob: Tving PostgREST (Supabase API) til at genindlæse skema-cache.
-- Kør i SQL Editor hvis du får "Could not find ... in the schema cache" lige efter oprettelse af tabeller.

notify pgrst, 'reload schema';
