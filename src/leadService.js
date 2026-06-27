const LEADS_KEY = 'kv_leads'
const SESSION_KEY = 'kv_owner_session'
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isCloudConfigured = Boolean(supabaseUrl && supabaseAnonKey)

const requestHeaders = token => ({
  apikey: supabaseAnonKey,
  Authorization: `Bearer ${token || supabaseAnonKey}`,
  'Content-Type': 'application/json',
})

export function getLocalLeads() {
  try {
    return JSON.parse(localStorage.getItem(LEADS_KEY) || '[]')
  } catch {
    return []
  }
}

export function persistLead(lead) {
  localStorage.setItem(LEADS_KEY, JSON.stringify([lead, ...getLocalLeads()]))
  window.dispatchEvent(new Event('kv-leads-updated'))

  if (!isCloudConfigured) return

  fetch(`${supabaseUrl}/rest/v1/leads`, {
    method: 'POST',
    headers: { ...requestHeaders(), Prefer: 'return=minimal' },
    body: JSON.stringify({
      id: lead.id,
      type: lead.type,
      created_at: lead.createdAt,
      name: lead.name,
      mobile: lead.mobile,
      location: lead.location,
      event_type: lead.eventType || null,
      guests: lead.guests ? Number(lead.guests) : null,
      booking_date: lead.date || null,
      booking_time: lead.time || null,
      budget: lead.budget || null,
      request: lead.request || null,
      status: lead.status || 'new',
    }),
  })
    .then(response => {
      if (!response.ok) throw new Error(`Lead API returned ${response.status}`)
    })
    .catch(error => console.error('Cloud lead capture failed:', error))
}

export function getOwnerSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

export async function ownerSignIn(email, password) {
  if (!isCloudConfigured) throw new Error('Owner CMS is not connected yet. Add the Supabase environment variables.')

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: requestHeaders(),
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error_description || data.msg || 'Unable to sign in.')

  const session = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: Date.now() + (data.expires_in || 3600) * 1000,
    email: data.user?.email || email,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return session
}

export function ownerSignOut() {
  localStorage.removeItem(SESSION_KEY)
}

export async function fetchOwnerLeads(session) {
  if (!isCloudConfigured) return getLocalLeads()
  if (!session?.accessToken) throw new Error('Please sign in to view leads.')

  const response = await fetch(`${supabaseUrl}/rest/v1/leads?select=*&order=created_at.desc`, {
    headers: requestHeaders(session.accessToken),
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'Your session expired. Please sign in again.' : 'Unable to load leads.')

  const rows = await response.json()
  return rows.map(row => ({
    id: row.id,
    type: row.type,
    createdAt: row.created_at,
    name: row.name,
    mobile: row.mobile,
    location: row.location,
    eventType: row.event_type || '',
    guests: row.guests || '',
    date: row.booking_date || '',
    time: row.booking_time || '',
    budget: row.budget || '',
    request: row.request || '',
    status: row.status || 'new',
  }))
}

export async function updateOwnerLeadStatus(session, id, status) {
  if (!isCloudConfigured) {
    const updated = getLocalLeads().map(lead => lead.id === id ? { ...lead, status } : lead)
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated))
    return
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/leads?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { ...requestHeaders(session.accessToken), Prefer: 'return=minimal' },
    body: JSON.stringify({ status }),
  })
  if (!response.ok) throw new Error('Unable to update lead status.')
}
