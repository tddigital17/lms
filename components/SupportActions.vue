<template>
  <Teleport to="body">
    <Transition name="donation-dialog">
      <div v-if="isOpen" class="donation-overlay" @click.self="closeDialog">
        <section class="donation-dialog" role="dialog" aria-modal="true" aria-labelledby="donationTitle">
          <button class="donation-close-icon" type="button" aria-label="Tutup dialog" @click="closeDialog"><i class="bi bi-x-lg"></i></button>
          <div class="donation-heart"><i class="bi bi-heart-fill"></i></div>
          <h2 id="donationTitle">Terima Kasih atas Dukunganmu!</h2>
          <p class="donation-intro">Scan QRIS di bawah menggunakan GoPay, OVO, DANA, BCA, atau m-Banking apa pun untuk donasi seikhlasnya.</p>
          <div class="donation-qr-frame">
            <div v-if="siteSettings?.qris_image_url" class="donation-qr-card">
              <img :src="siteSettings.qris_image_url" class="qris-image" alt="Kode QRIS TD Digital untuk donasi sukarela">
            </div>
            <div v-else class="donation-qr-card donation-qr-placeholder"><i class="bi bi-qr-code"></i><span>QRIS TD DIGITAL</span></div>
            <small v-if="siteSettings?.donation_info" class="donation-info">{{ siteSettings.donation_info }}</small>
          </div>
          <p class="donation-thanks">Bantuanmu sangat berarti untuk pengembangan modul & server TD Digital.</p>
          <button class="donation-close-button" type="button" @click="closeDialog">Tutup / Kembali</button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const { data: siteSettings } = await useSiteSettings()
const isOpen = useState('donation-modal-open', () => false)
const closeDialog = () => { isOpen.value = false }
const handleKeydown = (event) => { if (event.key === 'Escape') closeDialog() }

watch(isOpen, (open) => {
  if (import.meta.client) {
    if (open) {
      document.addEventListener('keydown', handleKeydown)
      document.body.classList.add('donation-open')
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.classList.remove('donation-open')
    }
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('keydown', handleKeydown)
    document.body.classList.remove('donation-open')
  }
})
</script>

<style scoped>
.donation-overlay { position: fixed; inset: 0; z-index: 2000; display: grid; place-items: center; padding: 18px; background: rgba(15,23,42,.58); backdrop-filter: blur(5px); }
.donation-dialog { position: relative; width: min(100%, 390px); max-height: min(92vh, 720px); overflow-y: auto; padding: 20px; border-radius: 20px; background: #fff; box-shadow: 0 24px 70px rgba(15,23,42,.28); text-align: center; }
.donation-close-icon { position: absolute; top: 12px; right: 12px; display: grid; width: 34px; aspect-ratio: 1; place-items: center; border: 0; border-radius: 50%; background: #f1f3f8; color: #59657b; }
.donation-heart { display: grid; width: 48px; aspect-ratio: 1; place-items: center; margin: 0 auto 12px; border-radius: 50%; background: #eff0ff; color: #5146e5; font-size: 1.2rem; }
.donation-dialog h2 { margin: 0 0 6px; color: #152039; font-size: 1.12rem; font-weight: 750; }
.donation-intro { margin: 0 auto 14px; color: #73809a; font-size: .78rem; line-height: 1.5; }
.donation-qr-frame { padding: 14px; border: 1px solid #dfe5ef; border-radius: 14px; background: #f8fafc; }
.donation-qr-card { display: grid; width: min(100%, 194px); aspect-ratio: 1; place-items: center; margin: 0 auto; padding: 8px; border: 1px solid #d5dce8; border-radius: 10px; background: #fff; box-shadow: 0 2px 6px rgba(15,23,42,.06); }
.qris-image { display: block; width: 100%; height: 100%; object-fit: contain; }
.donation-qr-placeholder { gap: 8px; background: #e6e9ef; color: #fff; font-size: .75rem; font-weight: 700; }
.donation-qr-placeholder i { font-size: 2rem; }
.donation-info { display: block; margin-top: 9px; color: #8895aa; font-size: .67rem; white-space: pre-line; }
.donation-thanks { margin: 15px 0 12px; color: #53617b; font-size: .78rem; line-height: 1.5; }
.donation-close-button { width: 100%; padding: 10px 16px; border: 0; border-radius: 11px; background: #11182c; color: #fff; font-size: .8rem; font-weight: 700; }
.donation-close-button:hover { background: #202b45; }
.donation-dialog-enter-active, .donation-dialog-leave-active { transition: opacity .18s ease; }
.donation-dialog-enter-active .donation-dialog, .donation-dialog-leave-active .donation-dialog { transition: transform .18s ease; }
.donation-dialog-enter-from, .donation-dialog-leave-to { opacity: 0; }
.donation-dialog-enter-from .donation-dialog, .donation-dialog-leave-to .donation-dialog { transform: translateY(10px) scale(.98); }
@media (max-width: 420px) { .donation-dialog { padding: 18px 16px; } .donation-qr-card { width: 180px; } }
</style>