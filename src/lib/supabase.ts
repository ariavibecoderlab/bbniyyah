import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ykrxuyvixnoiwutwibpf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlrcnh1eXZpeG5vaXd1dHdpYnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMDU2MzIsImV4cCI6MjA5MTU4MTYzMn0.4AhwEBHNWmctg6jodiPlIwhWHGCE4pUT7lxP4iBvTT0'
)
