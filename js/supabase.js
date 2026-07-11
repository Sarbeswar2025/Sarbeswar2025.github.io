import { createClient } from "https://esm.sh/@supabase/supabase-js";

const SUPABASE_URL =
    "https://skxvmeumoohdjoetpfbv.supabase.co";

const SUPABASE_ANON_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNreHZtZXVtb29oZGpvZXRwZmJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NTE4NDEsImV4cCI6MjA5OTMyNzg0MX0.ppGk1T4IMElJ6ZdJBuPaqho7VWvtYmdE2C3PB0asarw";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);