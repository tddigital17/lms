export const useSiteSettings = () => useAsyncData('lms-site-settings', async () => {
  const supabase = useSupabaseClient()
  const { data, error } = await supabase
    .from('settings')
    .select('id, content')
    .in('id', ['whatsapp_number', 'qris_image_url', 'donation_info'])

  if (error) return {}

  return Object.fromEntries((data || []).map(({ id, content }) => [id, content || '']))
})