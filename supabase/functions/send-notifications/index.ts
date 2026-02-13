// Supabase Edge Function to process notification queue
// Deploy with: supabase functions deploy send-notifications
// Set secret: supabase secrets set RESEND_API_KEY=re_xxxxx

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

interface Notification {
  id: string
  booking_id: string
  notification_type: 'booking_approved' | 'booking_rejected'
  recipient_email: string
  recipient_name: string | null
  slot_date: string
  slot_time: string
  slot_duration: string
}

const formatDate = (date: string): string => {
  const d = new Date(date)
  return d.toLocaleDateString('sv-SE', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTime = (time: string): string => {
  return time.substring(0, 5) // HH:MM
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Lender <noreply@lender.app>', // Update with your domain
      to: [to],
      subject,
      html,
    }),
  })
  
  if (!res.ok) {
    const error = await res.text()
    throw new Error(`Failed to send email: ${error}`)
  }
  
  return res.json()
}

const getApprovedEmailHtml = (name: string | null, date: string, time: string, duration: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { color: #6366f1; font-size: 24px; margin-bottom: 20px; }
    .card { background: #f3f4f6; border-radius: 8px; padding: 16px; margin: 16px 0; }
    .success { color: #10b981; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Lender</div>
    <p>Hej${name ? ` ${name}` : ''}!</p>
    <p class="success">✓ Din bokning har godkänts!</p>
    <div class="card">
      <p><strong>Datum:</strong> ${date}</p>
      <p><strong>Tid:</strong> ${time}</p>
      <p><strong>Längd:</strong> ${duration}</p>
      <p><strong>Sträcka:</strong> Malmö Triangeln ↔ Nørreport St.</p>
    </div>
    <p>Du kommer få biljetten via Skånetrafiken-appen.</p>
    <p>Trevlig resa!</p>
  </div>
</body>
</html>
`

const getRejectedEmailHtml = (name: string | null, date: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { color: #6366f1; font-size: 24px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Lender</div>
    <p>Hej${name ? ` ${name}` : ''}!</p>
    <p>Tyvärr kunde vi inte godkänna din bokning för ${date}.</p>
    <p>Du är välkommen att boka en annan tid.</p>
  </div>
</body>
</html>
`

Deno.serve(async (req) => {
  try {
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured')
    }
    
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)
    
    // Get unprocessed notifications
    const { data: notifications, error: fetchError } = await supabase
      .from('notification_queue')
      .select('*')
      .eq('processed', false)
      .order('created_at', { ascending: true })
      .limit(10)
    
    if (fetchError) throw fetchError
    
    const results = []
    
    for (const notification of (notifications as Notification[])) {
      try {
        const formattedDate = formatDate(notification.slot_date)
        const formattedTime = formatTime(notification.slot_time)
        
        if (notification.notification_type === 'booking_approved') {
          await sendEmail(
            notification.recipient_email,
            'Din bokning har godkänts! ✓',
            getApprovedEmailHtml(
              notification.recipient_name,
              formattedDate,
              formattedTime,
              notification.slot_duration
            )
          )
        } else {
          await sendEmail(
            notification.recipient_email,
            'Uppdatering om din bokning',
            getRejectedEmailHtml(notification.recipient_name, formattedDate)
          )
        }
        
        // Mark as processed
        await supabase
          .from('notification_queue')
          .update({ processed: true })
          .eq('id', notification.id)
        
        results.push({ id: notification.id, status: 'sent' })
      } catch (err) {
        results.push({ id: notification.id, status: 'failed', error: err.message })
      }
    }
    
    return new Response(JSON.stringify({ processed: results.length, results }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
