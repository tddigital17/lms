<template>
  <div class="public-page">
    <Navbar />
    <main>
      <section class="hero-section">
        <div class="container position-relative py-5">
          <div class="row align-items-center g-5 py-lg-4">
            <div class="col-lg-7 col-xl-8 hero-copy">
              <span class="eyebrow"><i class="bi bi-mortarboard-fill me-2"></i>Platform Belajar & Kursus Pembuatan Aplikasi</span>
              <h1 class="display-3 fw-bold mt-4 mb-4">Kuasai Pembuatan<br class="d-none d-xl-block"> Aplikasi dengan<br class="d-none d-xl-block"><span class="hero-typewriter" aria-label="AI Prompt & Source Code">{{ typedHeadline }}<span class="typing-cursor" aria-hidden="true"></span></span></h1>
              <p class="lead text-secondary mb-4">Pusat kursus interaktif dari kanal YouTube <strong>TD Digital</strong>. Pilih metode belajarmu: salin prompt instan atau unduh berkas koding lengkap step-by-step.</p>
              <div class="hero-actions d-flex flex-wrap gap-3">
                <a href="#koleksi" class="btn btn-primary btn-lg rounded-3 px-4 shadow-sm"><i class="bi bi-play-fill me-1"></i>Mulai Belajar Sekarang</a>
              </div>
            </div>
            <div class="col-lg-5 col-xl-4">
              <div class="hero-media">
                <img class="hero-photo" src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=85" alt="Laptop dengan editor kode untuk membangun produk digital" fetchpriority="high">
                <div class="hero-visual">
                  <div class="visual-window rounded-4 overflow-hidden">
                  <div class="window-bar"><span></span><span></span><span></span><small>lms.tddig.my.id/preview</small></div>
                  <div class="hero-code-preview">
                    <p><span class="code-comment">// Sistem Pembelajaran Terpadu</span></p>
                    <p>const trackAI = <span class="code-string">"No-Code AI Prompt"</span>;</p>
                    <p>const trackCode = <span class="code-string">"Google Apps Script & Source"</span>;</p>
                    <p>Status: <span class="code-status">Siap Diakses & Diunduh</span></p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="container" id="koleksi">
        <AdBanner position="top" />
        <section class="catalog-section py-5">
          <div class="catalog-heading d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-4 mb-4">
            <div>
              <h2 class="fw-bold mb-1">Jelajahi Katalog Pembelajaran</h2>
              <p class="text-secondary mb-0">Pilih materi video tutorial, salin prompt, atau unduh berkas koding lengkap.</p>
            </div>
            <label class="catalog-search input-group">
              <span class="input-group-text"><i class="bi bi-search"></i></span>
              <input v-model="search" class="form-control" type="search" placeholder="Cari judul materi / aplikasi..." aria-label="Cari materi">
            </label>
          </div>

          <div class="catalog-filter-bar d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-4">
            <div class="catalog-tabs" role="group" aria-label="Filter tipe materi">
              <button class="catalog-tab" :class="{ active: selectedType === 'all' }" @click="selectType('all')">Semua Materi</button>
              <button class="catalog-tab" :class="{ active: selectedType === 'prompt' }" @click="selectType('prompt')"><i class="bi bi-robot me-1"></i>AI Prompt (No-Code)</button>
              <button class="catalog-tab" :class="{ active: selectedType === 'source_code' }" @click="selectType('source_code')"><i class="bi bi-laptop me-1"></i>Source Code (File)</button>
            </div>
            <span class="catalog-result-count">Total <strong>{{ totalItems }}</strong> materi pembelajaran</span>
          </div>

          <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Memuat materi...</span></div></div>
          <div v-else-if="prompts.length" class="row g-4">
            <div v-for="(item, index) in prompts" :key="item.id" class="col-12 col-sm-6 col-xl-4 reveal-card" :style="{ '--delay': `${index * 40}ms` }">
              <article class="catalog-course-card h-100">
                <NuxtLink :to="`/detail/${item.id}`" class="catalog-course-link">
                  <div class="catalog-course-image">
                    <img :src="`https://img.youtube.com/vi/${getYouTubeID(item.youtube_url)}/mqdefault.jpg`" :alt="`Thumbnail: ${item.title}`" loading="lazy">
                    <span class="catalog-type-badge" :class="item.content_type === 'source_code' ? 'source' : 'prompt'"><i class="bi" :class="item.content_type === 'source_code' ? 'bi-code-slash' : 'bi-robot'"></i>{{ item.content_type === 'source_code' ? 'Source Code' : 'AI Prompt' }}</span>
                    <span class="catalog-play"><i class="bi bi-play-fill"></i></span>
                  </div>
                  <div class="catalog-course-body">
                    <span class="catalog-category">{{ item.categories?.name || 'Umum' }}</span>
                    <h3>{{ item.title }}</h3>
                    <p>{{ item.description || 'Tonton tutorial dan pelajari materi langkah demi langkah.' }}</p>
                    <div class="catalog-course-footer">
                      <span><i class="bi bi-calendar3 me-1"></i>{{ formatDate(item.created_at) }}</span>
                      <span class="catalog-open-link">Buka Materi <i class="bi bi-arrow-right"></i></span>
                    </div>
                  </div>
                </NuxtLink>
              </article>
            </div>
          </div>
          <div v-else class="catalog-empty-state">
            <i class="bi bi-search"></i>
            <h3>Materi belum ditemukan</h3>
            <p>Coba ubah kata pencarian atau pilih tipe materi lainnya.</p>
          </div>
          <PaginationControls
            v-if="totalItems > 0"
            :current-page="currentPage"
            :items-per-page="itemsPerPage"
            :total-items="totalItems"
            @update:current-page="currentPage = $event"
            @update:items-per-page="setItemsPerPage"
          />
        </section>
        <AdBanner position="bottom" />
      </div>
    </main>
    <Footer />
    <SupportActions />
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const { getYouTubeID, formatDate } = useUtils()
const search = ref('')
const searchTerm = ref('')
const selectedType = ref('all')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const typedHeadline = ref('')
let typingTimer
let typingPosition = 0
let deleting = false
const headlineText = 'AI Prompt & Source Code'
const fetchPrompts = async () => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value - 1
  let query = supabase.from('prompts').select('*, categories(name)', { count: 'exact' }).order('created_at', { ascending: false }).range(start, end)
  if (selectedType.value === 'source_code') query = query.eq('content_type', 'source_code')
  if (selectedType.value === 'prompt') query = query.eq('content_type', 'prompt')
  if (searchTerm.value) {
    const term = searchTerm.value.replace(/["\\]/g, '\\$&').replace(/[%_]/g, '\\$&')
    const match = `"%${term}%"`
    query = query.or(`title.ilike.${match},description.ilike.${match},prompt_text.ilike.${match},source_code_snippet.ilike.${match}`)
  }
  const { data, count, error } = await query
  if (error) throw error
  return { items: data || [], total: count || 0 }
}
const { data: catalogResult, pending } = await useAsyncData('prompts', fetchPrompts, {
  default: () => ({ items: [], total: 0 }),
  watch: [currentPage, itemsPerPage, searchTerm, selectedType]
})
const prompts = computed(() => catalogResult.value?.items || [])
const totalItems = computed(() => catalogResult.value?.total || 0)
const { data: categories } = await useAsyncData('categories', async () => (await supabase.from('categories').select('*').order('name')).data || [])
let searchTimer
watch(search, (value) => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    currentPage.value = 1
    searchTerm.value = value.trim()
  }, 300)
})
watch(totalItems, () => {
  const lastPage = Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value))
  if (currentPage.value > lastPage) currentPage.value = lastPage
})
const selectType = (type) => { currentPage.value = 1; selectedType.value = type }
const setItemsPerPage = (size) => { currentPage.value = 1; itemsPerPage.value = size }
const typeHeadline = () => {
  if (!deleting) {
    typingPosition++
    typedHeadline.value = headlineText.slice(0, typingPosition)
    if (typingPosition >= headlineText.length) {
      deleting = true
      typingTimer = setTimeout(typeHeadline, 1700)
      return
    }
  } else {
    typingPosition--
    typedHeadline.value = headlineText.slice(0, typingPosition)
    if (typingPosition <= 0) {
      deleting = false
      typingTimer = setTimeout(typeHeadline, 450)
      return
    }
  }
  typingTimer = setTimeout(typeHeadline, deleting ? 38 : 82)
}
onMounted(() => { typingTimer = setTimeout(typeHeadline, 350) })
onBeforeUnmount(() => { clearTimeout(typingTimer); clearTimeout(searchTimer) })
</script>
