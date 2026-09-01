import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wnkxshjyyxdoruxjvtnl.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indua3hzaGp5eXhkb3J1eGp2dG5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMTI3MTMsImV4cCI6MjEwMzY4ODcxM30.7Pe--Fm58kc6MdTNSx_UcAuoO3OVGBri9jUlbXTd05Q";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
