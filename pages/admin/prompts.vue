<template>
  <div class="d-flex min-vh-100 bg-light">
    <!-- Sidebar Navigation -->
    <AdminSidebar />

    <!-- Main Content -->
    <div class="flex-grow-1 main-admin-content p-3 p-md-4 p-xl-5">
      <!-- Header -->
      <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom">
        <div>
          <h3 class="fw-bold text-dark mb-1">Manajemen Materi & Video</h3>
          <p class="text-muted small mb-0">Kelola AI prompt, source code, video tutorial, dan tanggal publikasi.</p>
        </div>
        <button @click="openModal()" class="btn btn-primary rounded-pill px-4 shadow-sm">
          <i class="bi bi-plus-lg me-2"></i>Tambah Materi
        </button>
      </div>

      <!-- Search & Filter Bar -->
      <div class="card border-0 rounded-4 shadow-sm bg-white mb-4 p-3">
        <div class="row g-3 align-items-center">
          <div class="col-md-6 col-lg-5">
            <div class="input-group border rounded-3 overflow-hidden">
              <span class="input-group-text bg-white border-0"><i class="bi bi-search text-muted"></i></span>
              <input v-model="searchQuery" type="text" class="form-control border-0 py-2" placeholder="Cari berdasarkan judul prompt...">
            </div>
          </div>
          <div class="col-md-4 col-lg-3">
            <select v-model="selectedCategory" class="form-select border rounded-3 py-2">
              <option value="">Semua Kategori Platform</option>
              <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="col-md-2 col-lg-4 text-md-end text-muted small">
            Total <strong class="text-dark">{{ totalItems }}</strong> materi
          </div>
        </div>
      </div>

      <!-- Prompts Data Table -->
      <div class="card border-0 rounded-4 shadow-sm bg-white overflow-hidden">
        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="bg-light border-bottom">
              <tr class="text-uppercase text-muted small fw-bold">
                <th class="px-4 py-3" style="width: 35%;">Project & Video</th>
                <th class="px-3 py-3">Kategori / Tipe</th>
                <th class="px-3 py-3">Tanggal Dibuat / Rilis</th>
                <th class="px-4 py-3 text-end" style="width: 15%;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in prompts" :key="p.id">
                <td class="px-4 py-3">
                  <div class="d-flex align-items-center">
                    <div class="position-relative me-3 flex-shrink-0" style="width: 90px; height: 55px;">
                      <img :src="`https://img.youtube.com/vi/${getYouTubeID(p.youtube_url)}/mqdefault.jpg`" class="w-100 h-100 object-fit-cover rounded-3 border" alt="Thumb">
                      <span class="position-absolute top-50 start-50 translate-middle text-white drop-shadow">
                        <i class="bi bi-play-circle-fill fs-5"></i>
                      </span>
                    </div>
                    <div>
                      <h6 class="fw-bold mb-1 text-dark line-clamp-1">{{ p.title }}</h6>
                      <small class="text-muted text-truncate d-block" style="max-width: 300px;">{{ p.content_type === 'source_code' ? (p.download_url || p.source_code_snippet || 'Source code') : (p.prompt_text || 'Prompt belum diisi') }}</small>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-3">
                  <span class="badge bg-primary-subtle text-primary border border-primary border-opacity-25 rounded-pill px-3 py-1.5 fw-semibold">
                    {{ p.categories?.name || 'Umum' }}
                  </span>
                  <span class="badge ms-1" :class="p.content_type === 'source_code' ? 'text-bg-primary' : 'text-bg-success'">{{ p.content_type === 'source_code' ? 'Full Source Code' : 'AI Prompt' }}</span>
                </td>
                <td class="px-3 py-3">
                  <div class="d-flex align-items-center text-dark small fw-semibold">
                    <i class="bi bi-calendar3 me-2 text-primary"></i>
                    {{ formatDate(p.created_at) }}
                  </div>
                </td>
                <td class="px-4 py-3 text-end">
                  <button @click="openModal(p)" class="btn btn-sm btn-outline-primary border-0 me-1 p-2" title="Edit">
                    <i class="bi bi-pencil-square fs-6"></i>
                  </button>
                  <button @click="handleDelete(p.id)" class="btn btn-sm btn-outline-danger border-0 p-2" title="Hapus">
                    <i class="bi bi-trash fs-6"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!prompts.length && !pending">
                <td colspan="4" class="text-center py-5">
                  <i class="bi bi-inbox text-muted display-4 d-block mb-3"></i>
                  <p class="text-muted mb-0">Tidak ada prompt yang cocok dengan kriteria pencarian.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <PaginationControls
        v-if="totalItems > 0"
        :current-page="currentPage"
        :items-per-page="itemsPerPage"
        :total-items="totalItems"
        @update:current-page="currentPage = $event"
        @update:items-per-page="setItemsPerPage"
      />
    </div>

    <!-- Modal Form (Input & Edit Prompt with Input Tanggal) -->
    <div class="modal fade" id="promptModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header bg-dark text-white p-4 border-bottom-0">
            <h5 class="fw-bold mb-0">
              <i class="bi" :class="editId ? 'bi-pencil-square text-warning' : 'bi-plus-circle text-primary'"></i>
              <span class="ms-2">{{ editId ? 'Edit Materi' : 'Tambah Materi' }}</span>
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body p-4 bg-white">
              <div class="row g-3">
                <!-- Judul -->
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-dark">Judul Project / Tutorial</label>
                  <input v-model="form.title" type="text" class="form-control rounded-3 py-2" placeholder="Contoh: Membuat Aplikasi Kasir Toko dengan ChatGPT" required>
                </div>

                <!-- Link YouTube -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Link Video YouTube</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light text-danger border-end-0"><i class="bi bi-youtube"></i></span>
                    <input v-model="form.youtube_url" type="url" class="form-control rounded-end-3 py-2" placeholder="https://www.youtube.com/watch?v=..." required>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Tipe Konten</label>
                  <select v-model="form.content_type" class="form-select rounded-3 py-2" required>
                    <option value="prompt">AI Prompt (No-Code)</option>
                    <option value="source_code">Full Source Code (Coding)</option>
                  </select>
                </div>

                <!-- Kategori AI -->
                <div class="col-md-6">
                  <label class="form-label small fw-bold text-dark">Kategori Platform AI</label>
                  <select v-model="form.category_id" class="form-select rounded-3 py-2" required>
                    <option value="" disabled>Pilih Platform AI</option>
                    <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
                  </select>
                </div>

                <!-- INPUT TANGGAL (Publikasi / Dibuat) -->
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-dark">
                    <i class="bi bi-calendar-event me-1 text-primary"></i>Tanggal Dibuat / Publikasi
                  </label>
                  <input 
                    v-model="form.created_at" 
                    type="datetime-local" 
                    class="form-control rounded-3 py-2" 
                    required
                  >
                  <small class="text-muted" style="font-size: 0.75rem;">Anda dapat mengatur tanggal publikasi secara bebas (bisa tanggal lampau atau hari ini).</small>
                </div>

                <!-- Isi Prompt -->
                <div v-if="form.content_type === 'prompt'" class="col-md-12">
                  <label class="form-label small fw-bold text-dark">Isi Prompt AI Lengkap</label>
                  <textarea 
                    v-model="form.prompt_text" 
                    class="form-control rounded-3 font-monospace p-3" 
                    rows="7" 
                    placeholder="Instruksi prompt lengkap yang akan disalin pengguna..." 
                    :required="form.content_type === 'prompt'"
                  ></textarea>
                </div>

                <div v-else class="col-md-12">
                  <label class="form-label small fw-bold text-dark">URL Unduhan (Google Drive / OneDrive)</label>
                  <input v-model="form.download_url" type="url" class="form-control rounded-3 py-2" placeholder="https://drive.google.com/..." required>
                </div>

                <div v-if="form.content_type === 'source_code'" class="col-md-12">
                  <label class="form-label small fw-bold text-dark">Preview Source Code (Opsional)</label>
                  <textarea v-model="form.source_code_snippet" class="form-control rounded-3 font-monospace p-3" rows="7" placeholder="Potongan kode untuk preview..."></textarea>
                </div>

                <!-- Deskripsi Tambahan -->
                <div class="col-md-12">
                  <label class="form-label small fw-bold text-dark">Deskripsi Tambahan / Panduan (Opsional)</label>
                  <textarea 
                    v-model="form.description" 
                    class="form-control rounded-3 p-3" 
                    rows="3" 
                    placeholder="Langkah-langkah tambahan atau tips pemakaian..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light p-3 px-4 border-top">
              <button type="button" class="btn btn-light rounded-pill px-4 fw-semibold" data-bs-dismiss="modal">Batal</button>
              <button type="submit" class="btn btn-primary rounded-pill px-4 fw-semibold shadow-sm" :disabled="submitting">
                <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ submitting ? 'Menyimpan...' : 'Simpan Materi' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' });

const supabase = useSupabaseClient();
const { getYouTubeID, formatDate } = useUtils();

const searchQuery = ref('');
const selectedCategory = ref('');
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const categories = ref([]);

const form = reactive({
  title: '',
  youtube_url: '',
  category_id: '',
  created_at: '',
  content_type: 'prompt',
  prompt_text: '',
  download_url: '',
  source_code_snippet: '',
  description: ''
});

const editId = ref(null);
const submitting = ref(false);
let modalObj = null;

const fetchPrompts = async () => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value - 1;
  let query = supabase.from('prompts').select('*, categories(name)', { count: 'exact' }).order('created_at', { ascending: false }).range(start, end);
  if (selectedCategory.value) query = query.eq('category_id', selectedCategory.value);
  if (searchTerm.value) {
    const term = searchTerm.value.replace(/["\\]/g, '\\$&').replace(/[%_]/g, '\\$&');
    const match = `"%${term}%"`;
    query = query.or(`title.ilike.${match},prompt_text.ilike.${match},download_url.ilike.${match},source_code_snippet.ilike.${match}`);
  }
  const { data, count, error } = await query;
  if (error) throw error;
  return { items: data || [], total: count || 0 };
};

const fetchCategories = async () => {
  const { data } = await supabase.from('categories').select('*').order('name');
  categories.value = data || [];
};

const { data: promptResult, pending, refresh: refreshPrompts } = await useAsyncData('admin-prompts', fetchPrompts, {
  default: () => ({ items: [], total: 0 }),
  watch: [currentPage, itemsPerPage, searchTerm, selectedCategory]
});
const prompts = computed(() => promptResult.value?.items || []);
const totalItems = computed(() => promptResult.value?.total || 0);
await fetchCategories();

onMounted(() => {
  const el = document.getElementById('promptModal');
  if (el) {
    modalObj = new bootstrap.Modal(el);
  }
});

let searchTimer;
watch(searchQuery, (value) => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => { currentPage.value = 1; searchTerm.value = value.trim(); }, 300);
});
watch(selectedCategory, () => { currentPage.value = 1; }, { flush: 'sync' });
watch(totalItems, () => {
  const lastPage = Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value));
  if (currentPage.value > lastPage) currentPage.value = lastPage;
});
const setItemsPerPage = (size) => { currentPage.value = 1; itemsPerPage.value = size; };

const formatForDateTimeInput = (dateStr) => {
  if (!dateStr) return new Date().toISOString().slice(0, 16);
  const d = new Date(dateStr);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
};

const openModal = (p = null) => {
  if (p) {
    editId.value = p.id;
    Object.assign(form, {
      title: p.title,
      youtube_url: p.youtube_url,
      category_id: p.category_id,
      created_at: formatForDateTimeInput(p.created_at),
      content_type: p.content_type || 'prompt',
      prompt_text: p.prompt_text || '',
      download_url: p.download_url || '',
      source_code_snippet: p.source_code_snippet || '',
      description: p.description || ''
    });
  } else {
    editId.value = null;
    Object.assign(form, {
      title: '',
      youtube_url: '',
      category_id: categories.value[0]?.id || '',
      created_at: formatForDateTimeInput(new Date()),
      content_type: 'prompt',
      prompt_text: '',
      download_url: '',
      source_code_snippet: '',
      description: ''
    });
  }
  modalObj.show();
};

const handleSubmit = async () => {
  submitting.value = true;

  const payload = {
    title: form.title,
    youtube_url: form.youtube_url,
    category_id: form.category_id,
    created_at: new Date(form.created_at).toISOString(),
    content_type: form.content_type,
    prompt_text: form.content_type === 'prompt' ? form.prompt_text : null,
    download_url: form.content_type === 'source_code' ? form.download_url : null,
    source_code_snippet: form.content_type === 'source_code' ? form.source_code_snippet || null : null,
    description: form.description
  };

  if (editId.value) {
    await supabase.from('prompts').update(payload).eq('id', editId.value);
  } else {
    await supabase.from('prompts').insert(payload);
  }

  await refreshPrompts();
  submitting.value = false;
  modalObj.hide();
};

const handleDelete = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus prompt ini?')) {
    await supabase.from('prompts').delete().eq('id', id);
    await refreshPrompts();
  }
};

onBeforeUnmount(() => clearTimeout(searchTimer));
</script>

<style scoped>
.main-admin-content {
  margin-left: 280px;
  min-height: 100vh;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drop-shadow {
  filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.6));
}

.object-fit-cover {
  object-fit: cover;
}

@media (max-width: 991.98px) {
  .main-admin-content {
    margin-left: 0;
  }
}
</style>
