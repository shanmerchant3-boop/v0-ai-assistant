import { createClient } from "@/lib/supabase/server"

export async function generateLicenseKey(orderId: string, productId: string, userId: string, duration?: string) {
  const supabase = await createClient()
  
  const { data: keyData } = await supabase.rpc('generate_license_key')
  const licenseKey = keyData as string

  let expiresAt = null
  if (duration && duration !== 'Lifetime') {
    const days = parseInt(duration.match(/\d+/)?.[0] || '0')
    expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + days)
  }

  const { data, error } = await supabase
    .from('license_keys')
    .insert({
      key: licenseKey,
      product_id: productId,
      order_id: orderId,
      user_id: userId,
      expires_at: expiresAt,
      status: 'active'
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function activateLicense(licenseKey: string, hwid: string) {
  const supabase = await createClient()

  const { data: license, error: fetchError } = await supabase
    .from('license_keys')
    .select('*')
    .eq('key', licenseKey)
    .single()

  if (fetchError || !license) {
    throw new Error('Invalid license key')
  }

  if (license.status === 'used' && license.hwid !== hwid) {
    throw new Error('License key already activated on another device')
  }

  if (license.expires_at && new Date(license.expires_at) < new Date()) {
    throw new Error('License key has expired')
  }

  const { error: updateError } = await supabase
    .from('license_keys')
    .update({
      hwid,
      status: 'used',
      activated_at: new Date().toISOString()
    })
    .eq('id', license.id)

  if (updateError) throw updateError

  return license
}

export async function getUserLicenses(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('license_keys')
    .select(`
      *,
      products:product_id (name, image_url),
      orders:order_id (created_at, total_amount)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}
