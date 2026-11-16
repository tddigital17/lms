<template>
  <header class="lms-header sticky-top">
    <nav class="container lms-nav" aria-label="Navigasi utama">
      <NuxtLink class="lms-brand" to="/" @click="isMenuOpen = false">
        <span class="brand-icon"><i class="bi bi-mortarboard-fill"></i></span>
        <span class="lms-brand-copy"><strong>LMS TD Digital</strong><small>Belajar AI & Coding Praktis</small></span>
      </NuxtLink>
      <button class="lms-menu-toggle" type="button" :aria-expanded="isMenuOpen" aria-controls="primaryMenu" :aria-label="isMenuOpen ? 'Tutup menu' : 'Buka menu'" @click="isMenuOpen = !isMenuOpen">
        <i class="bi" :class="isMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
      </button>
      <div id="primaryMenu" class="lms-menu" :class="{ 'is-open': isMenuOpen }">
        <NuxtLink class="lms-menu-link active" to="/" @click="isMenuOpen = false">Beranda</NuxtLink>
        <a class="lms-menu-link" href="https://tddig.my.id/" target="_blank" rel="noopener noreferrer" @click="isMenuOpen = false">Website Utama</a>
        <a class="lms-menu-link" href="https://hubapps.web.id" target="_blank" rel="noopener noreferrer" @click="isMenuOpen = false">HubApps <i class="bi bi-box-arrow-up-right ms-1"></i></a>
        <a class="lms-menu-whatsapp" :href="whatsappUrl" target="_blank" rel="noopener noreferrer" @click="isMenuOpen = false"><i class="bi bi-whatsapp"></i><span>WhatsApp</span></a>
      </div>
    </nav>
  </header>
</template>

<script setup>
const { data: siteSettings } = await useSiteSettings()
const isMenuOpen = ref(false)
const whatsappUrl = computed(() => {
  const number = String(siteSettings.value?.whatsapp_number || '').replace(/\D/g, '')
  const message = encodeURIComponent('Halo TD Digital, saya ingin bertanya tentang materi LMS.')
  return number ? `https://wa.me/${number}?text=${message}` : `https://wa.me/?text=${message}`
})
</script>
