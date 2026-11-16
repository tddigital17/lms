<template>
  <div v-if="prompt" class="lesson-page min-vh-100 d-flex flex-column">
    <Navbar />
    <main class="container lesson-container py-4 py-lg-5">
      <NuxtLink to="/#koleksi" class="lesson-back-link mb-3"><i class="bi bi-arrow-left me-2"></i>Kembali ke Katalog</NuxtLink>
      <div class="row g-4 align-items-start">
        <div class="col-lg-8">
          <article class="lesson-feature-card mb-4">
            <div class="ratio ratio-16x9 lesson-video">
              <iframe
                :src="`https://www.youtube.com/embed/${getYouTubeID(prompt.youtube_url)}`"
                :title="`Tutorial ${prompt.title}`"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
              ></iframe>
            </div>
            <div class="lesson-feature-body">
              <div class="d-flex flex-wrap gap-2 mb-2">
                <span class="lesson-type-chip" :class="isSourceCode ? 'source' : 'prompt'"><i class="bi" :class="isSourceCode ? 'bi-code-slash' : 'bi-robot'"></i>{{ isSourceCode ? 'Full Source Code' : 'AI Prompt (No-Code)' }}</span>
                <span class="lesson-category-chip">{{ prompt.categories?.name || 'Umum' }}</span>
              </div>
              <h1>{{ prompt.title }}</h1>
              <p class="lesson-published mb-0"><i class="bi bi-calendar3 me-2"></i>Dipublikasikan pada {{ formatDate(prompt.created_at) }}</p>
            </div>
          </article>

          <section class="lesson-content-panel mb-4">
            <div class="lesson-panel-heading">
              <h2><i class="bi" :class="isSourceCode ? 'bi-code-slash' : 'bi-terminal'" ></i>{{ isSourceCode ? 'Source Code' : 'AI Prompt Instan' }}</h2>
              <button v-if="!isSourceCode" @click="copyPrompt" class="btn btn-primary btn-sm"><i class="bi bi-copy me-2"></i>Salin Prompt</button>
              <a v-else-if="prompt.download_url" :href="prompt.download_url" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm"><i class="bi bi-download me-2"></i>Unduh Berkas</a>
            </div>
            <pre v-if="!isSourceCode" class="lesson-code"><code>{{ prompt.prompt_text || 'Prompt belum tersedia.' }}</code></pre>
            <div v-else>
              <p class="text-secondary mb-3">{{ prompt.download_url ? 'Unduh seluruh berkas proyek melalui tombol di atas.' : 'Tautan unduhan belum tersedia untuk materi ini.' }}</p>
              <pre v-if="prompt.source_code_snippet" class="lesson-code"><code>{{ prompt.source_code_snippet }}</code></pre>
            </div>
          </section>

          <section class="lesson-description-panel">
            <h2><i class="bi bi-info-circle-fill"></i>Tentang Project & Panduan Belajar</h2>
            <p class="mb-0">{{ prompt.description || 'Tidak ada deskripsi tambahan.' }}</p>
          </section>
        </div>

        <aside class="col-lg-4">
          <div class="lesson-sidebar">
            <section class="lesson-side-section">
              <span class="lesson-side-eyebrow">INSTRUKTUR / CHANNEL</span>
              <a href="https://youtube.com/@tddigitalofficial" target="_blank" rel="noopener noreferrer" class="lesson-channel-link">
                <span class="lesson-youtube-icon"><i class="bi bi-youtube"></i></span>
                <span><strong>TD Digital</strong><small>Tutorial & Edukasi Aplikasi</small></span>
                <i class="bi bi-box-arrow-up-right ms-auto"></i>
              </a>
              <div class="lesson-support-box whatsapp">
                <strong><i class="bi bi-whatsapp me-1"></i>GRUP & DISKUSI DEVELOPER</strong>
                <p>Punya kendala saat praktik coding atau butuh konsultasi pembuatan aplikasi? Hubungi kami.</p>
                <a :href="whatsappUrl" target="_blank" rel="noopener noreferrer" class="btn btn-success btn-sm w-100"><i class="bi bi-chat-dots-fill me-2"></i>Chat WhatsApp TD Digital</a>
              </div>
              <div class="lesson-support-box donation">
                <strong><i class="bi bi-cup-hot-fill me-1"></i>DUKUNG DEVELOPER (DONASI)</strong>
                <p>Semua modul & source code bebas diakses gratis. Jika terbantu, dukung kami seikhlasnya via QRIS / e-Wallet.</p>
                <button class="btn btn-primary btn-sm w-100" type="button" @click="donationModalOpen = true"><i class="bi bi-qr-code me-2"></i>Lihat QRIS / Donasi Seikhlasnya</button>
              </div>
            </section>
            <section class="lesson-side-section lesson-ecosystem">
              <span class="lesson-side-eyebrow">AKSES EKOSISTEM</span>
              <a href="https://hubapps.web.id" target="_blank" rel="noopener noreferrer">Lihat Demo di HubApps <i class="bi bi-box-arrow-up-right"></i></a>
              <a href="https://youtube.com/@tddigitalofficial" target="_blank" rel="noopener noreferrer">Kunjungi Channel YouTube <i class="bi bi-youtube text-danger"></i></a>
            </section>
            <div class="lesson-ad-panel"><span>SPONSORED AD</span><AdBanner position="sidebar" /></div>
          </div>
        </aside>
      </div>
    </main>
    <Footer />
    <SupportActions />
    
    <!-- Success Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div id="copyToastDetail" class="toast align-items-center text-white bg-success border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body"><i class="bi bi-check-circle me-2"></i>Prompt berhasil disalin!</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>
  </div>
  
  <div v-else-if="pending" class="vh-100 d-flex justify-content-center align-items-center">
    <div class="spinner-border text-primary" role="status"></div>
  </div>
</template>

<script setup>
const route = useRoute();
const supabase = useSupabaseClient();
const { getYouTubeID, copyToClipboard, formatDate } = useUtils();
const { data: prompt, pending } = await useAsyncData(`prompt-${route.params.id}`, async () => {
  const { data } = await supabase
    .from('prompts')
    .select('*, categories(name)')
    .eq('id', route.params.id)
    .single();
  return data;
});
const isSourceCode = computed(() => prompt.value?.content_type === 'source_code');
const { data: siteSettings } = await useSiteSettings();
const donationModalOpen = useState('donation-modal-open', () => false);
const whatsappUrl = computed(() => {
  const number = String(siteSettings.value?.whatsapp_number || '').replace(/\D/g, '');
  const message = encodeURIComponent('Halo TD Digital, saya ingin bertanya tentang materi LMS.');
  return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`;
});

const copyPrompt = async () => {
  const success = await copyToClipboard(prompt.value.prompt_text);
  if (success) {
    const toastEl = document.getElementById('copyToastDetail');
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
  }
};
</script>
