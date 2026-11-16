<template>
  <div class="d-flex min-vh-100 bg-light">
    <AdminSidebar />

    <div class="flex-grow-1 main-admin-content p-3 p-md-4 p-xl-5">
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h3 class="fw-bold text-dark mb-1">Pengaturan Website</h3>
          <p class="text-muted small mb-0">Kelola penempatan iklan, kontak WhatsApp, dan informasi dukungan LMS.</p>
        </div>
      </div>

      <div class="row g-4">
        <div v-for="pos in positions" :key="pos.id" class="col-md-6 col-xl-4">
          <div class="card border-0 rounded-4 shadow-sm h-100 overflow-hidden">
            <div class="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center">
                <div class="icon-box bg-primary-subtle text-primary rounded-3 p-2 me-2">
                  <i class="bi bi-badge-ad"></i>
                </div>
                <h6 class="fw-bold mb-0 text-dark">{{ pos.label }}</h6>
              </div>
            </div>
            <div class="card-body p-4">
              <div class="mb-3">
                <label class="form-label small text-muted fw-bold text-uppercase">Script Iklan (HTML/JS)</label>
                <textarea 
                  v-model="settings[pos.id]" 
                  class="form-control rounded-3 font-monospace small" 
                  rows="12" 
                  placeholder="Paste script tag Adsterra di sini..."
                ></textarea>
              </div>
              <button @click="saveSetting(pos.id)" class="btn btn-primary w-100 rounded-pill py-2 shadow-sm" :disabled="saving === pos.id">
                <i v-if="saving === pos.id" class="spinner-border spinner-border-sm me-2"></i>
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>

      <section class="mt-5">
        <div class="mb-3 pb-3 border-bottom">
          <h4 class="fw-bold text-dark mb-1">Kontak & Dukungan</h4>
          <p class="text-muted small mb-0">Atur kontak WhatsApp dan informasi donasi yang tampil di website publik.</p>
        </div>
        <div class="row g-4">
          <div class="col-lg-6">
            <div class="card border-0 rounded-4 shadow-sm h-100">
              <div class="card-body p-4">
                <label for="whatsappNumber" class="form-label small text-muted fw-bold text-uppercase">Nomor WhatsApp</label>
                <div class="input-group mb-3">
                  <span class="input-group-text"><i class="bi bi-whatsapp text-success"></i></span>
                  <input id="whatsappNumber" v-model="settings.whatsapp_number" type="tel" inputmode="numeric" class="form-control" placeholder="6281234567890">
                </div>
                <small class="text-muted d-block mb-3">Gunakan kode negara tanpa tanda plus atau spasi, contoh: 6281234567890.</small>
                <button @click="saveSetting('whatsapp_number')" class="btn btn-primary w-100 rounded-pill py-2" :disabled="saving === 'whatsapp_number'">
                  <i v-if="saving === 'whatsapp_number'" class="spinner-border spinner-border-sm me-2"></i>Simpan Nomor WhatsApp
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="card border-0 rounded-4 shadow-sm h-100">
              <div class="card-body p-4">
                <label for="qrisImage" class="form-label small text-muted fw-bold text-uppercase">Gambar QRIS</label>
                <div v-if="qrisPreviewUrl" class="qris-preview-wrap mb-3">
                  <img :src="qrisPreviewUrl" alt="Preview gambar QRIS">
                </div>
                <div class="input-group mb-2">
                  <span class="input-group-text"><i class="bi bi-qr-code text-primary"></i></span>
                  <input id="qrisImage" type="file" class="form-control" accept="image/png,image/jpeg,image/webp" @change="handleQrisFileChange">
                </div>
                <small class="text-muted d-block mb-3">Pilih PNG, JPG, atau WebP, maksimal 5 MB.</small>
                <label for="donationInfo" class="form-label small text-muted fw-bold text-uppercase">Informasi Donasi / Rekening</label>
                <textarea id="donationInfo" v-model="settings.donation_info" class="form-control mb-3" rows="4" placeholder="Tulis instruksi donasi sukarela atau detail rekening..."></textarea>
                <button @click="saveDonationSettings" class="btn btn-primary w-100 rounded-pill py-2" :disabled="saving === 'donation'">
                  <i v-if="saving === 'donation'" class="spinner-border spinner-border-sm me-2"></i>{{ saving === 'donation' ? 'Mengunggah & Menyimpan...' : 'Unggah QRIS & Simpan' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <p v-if="saveMessage" class="alert mt-3 mb-0" :class="saveError ? 'alert-danger' : 'alert-success'" role="status">{{ saveMessage }}</p>
      </section>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const supabase = useSupabaseClient();
const saving = ref(null);
const saveMessage = ref('');
const saveError = ref(false);
const qrisFile = ref(null);
const qrisPreviewUrl = ref('');

const positions = [
  { id: 'adsterra_top', label: 'Atas (Leaderboard)' },
  { id: 'adsterra_sidebar', label: 'Bilah Sisi (Sidebar)' },
  { id: 'adsterra_bottom', label: 'Bawah (Footer Area)' }
];

const settings = reactive({
  adsterra_top: '',
  adsterra_sidebar: '',
  adsterra_bottom: '',
  whatsapp_number: '',
  qris_image_url: '',
  donation_info: ''
});

onMounted(async () => {
  const { data } = await supabase.from('settings').select('*');
  data?.forEach(s => {
    if (Object.prototype.hasOwnProperty.call(settings, s.id)) settings[s.id] = s.content || '';
  });
  qrisPreviewUrl.value = settings.qris_image_url;
});

const handleQrisFileChange = (event) => {
  const file = event.target.files?.[0];
  saveMessage.value = '';
  if (!file) return;
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    event.target.value = '';
    qrisFile.value = null;
    if (qrisPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(qrisPreviewUrl.value);
    qrisPreviewUrl.value = settings.qris_image_url;
    saveError.value = true;
    saveMessage.value = 'Pilih gambar PNG, JPG, atau WebP dengan ukuran maksimal 5 MB.';
    return;
  }
  if (qrisPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(qrisPreviewUrl.value);
  qrisFile.value = file;
  qrisPreviewUrl.value = URL.createObjectURL(file);
};

onBeforeUnmount(() => {
  if (qrisPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(qrisPreviewUrl.value);
});

const saveSetting = async (id, value = settings[id]) => {
  saving.value = id;
  saveMessage.value = '';
  const { error } = await supabase.from('settings').upsert({ 
    id: id,
    content: value || '',
    updated_at: new Date().toISOString()
  });

  saveError.value = Boolean(error);
  saveMessage.value = error ? `Gagal menyimpan pengaturan: ${error.message}` : 'Pengaturan berhasil disimpan.';
  saving.value = null;
};

const saveDonationSettings = async () => {
  saving.value = 'donation';
  saveMessage.value = '';
  try {
    let qrisUrl = settings.qris_image_url || '';
    if (qrisFile.value) {
      const extension = qrisFile.value.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
      const filePath = `qris/${Date.now()}-${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage.from('lms-assets').upload(filePath, qrisFile.value, {
        cacheControl: '3600',
        contentType: qrisFile.value.type,
        upsert: false
      });
      if (uploadError) throw uploadError;
      qrisUrl = supabase.storage.from('lms-assets').getPublicUrl(filePath).data.publicUrl;
    }

    const updatedAt = new Date().toISOString();
    const { error } = await supabase.from('settings').upsert([
      { id: 'qris_image_url', content: qrisUrl, updated_at: updatedAt },
      { id: 'donation_info', content: settings.donation_info || '', updated_at: updatedAt }
    ]);
    if (error) throw error;

    settings.qris_image_url = qrisUrl;
    qrisFile.value = null;
    saveError.value = false;
    saveMessage.value = 'Pengaturan donasi berhasil disimpan.';
    if (qrisPreviewUrl.value.startsWith('blob:')) URL.revokeObjectURL(qrisPreviewUrl.value);
    qrisPreviewUrl.value = qrisUrl;
  } catch (error) {
    saveError.value = true;
    saveMessage.value = `Gagal menyimpan pengaturan: ${error.message}`;
  } finally {
    saving.value = null;
  }
};
</script>

<style scoped>
.main-admin-content {
  margin-left: 280px;
  min-height: 100vh;
}

.icon-box {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qris-preview-wrap {
  display: grid;
  min-height: 180px;
  place-items: center;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  background: #f8fafc;
}

.qris-preview-wrap img {
  max-width: 100%;
  max-height: 240px;
  object-fit: contain;
}

@media (max-width: 991.98px) {
  .main-admin-content {
    margin-left: 0;
  }
}
</style>
