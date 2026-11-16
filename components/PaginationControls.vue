<template>
  <div class="pagination-toolbar">
    <label class="pagination-size">
      <span>Baris per halaman</span>
      <select :value="itemsPerPage" class="form-select form-select-sm" @change="emit('update:itemsPerPage', Number($event.target.value))">
        <option :value="10">10</option>
        <option :value="20">20</option>
        <option :value="50">50</option>
      </select>
    </label>
    <span class="pagination-summary">Menampilkan {{ startItem }}–{{ endItem }} dari {{ totalItems }} data</span>
    <nav aria-label="Navigasi halaman data">
      <ul class="pagination pagination-sm mb-0">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" aria-label="Halaman pertama" :disabled="currentPage === 1" @click="emit('update:currentPage', 1)"><i class="bi bi-chevron-double-left"></i></button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" aria-label="Halaman sebelumnya" :disabled="currentPage === 1" @click="emit('update:currentPage', currentPage - 1)"><i class="bi bi-chevron-left"></i></button>
        </li>
        <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" :aria-label="`Halaman ${page}`" :aria-current="currentPage === page ? 'page' : undefined" @click="emit('update:currentPage', page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" aria-label="Halaman berikutnya" :disabled="currentPage === totalPages" @click="emit('update:currentPage', currentPage + 1)"><i class="bi bi-chevron-right"></i></button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" aria-label="Halaman terakhir" :disabled="currentPage === totalPages" @click="emit('update:currentPage', totalPages)"><i class="bi bi-chevron-double-right"></i></button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPage: { type: Number, required: true },
  itemsPerPage: { type: Number, required: true },
  totalItems: { type: Number, required: true }
})

const emit = defineEmits(['update:currentPage', 'update:itemsPerPage'])
const totalPages = computed(() => Math.max(1, Math.ceil(props.totalItems / props.itemsPerPage)))
const visiblePages = computed(() => {
  const firstPage = Math.max(1, Math.min(props.currentPage - 2, totalPages.value - 4))
  return Array.from({ length: Math.min(5, totalPages.value) }, (_, index) => firstPage + index)
})
const startItem = computed(() => props.totalItems ? (props.currentPage - 1) * props.itemsPerPage + 1 : 0)
const endItem = computed(() => Math.min(props.currentPage * props.itemsPerPage, props.totalItems))
</script>

<style scoped>
.pagination-toolbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px 18px; margin-top: 24px; }
.pagination-size { display: inline-flex; align-items: center; gap: 9px; color: #68758d; font-size: .8rem; }
.pagination-size .form-select { width: 76px; border-color: #dfe5ef; }
.pagination-summary { color: #68758d; font-size: .8rem; }
.page-link { min-width: 34px; border-color: #dfe5ef; color: #5146e5; text-align: center; }
.page-item.active .page-link { border-color: #5146e5; background: #5146e5; color: #fff; }
.page-item.disabled .page-link { color: #b6becc; }
@media (max-width: 575.98px) { .pagination-toolbar { justify-content: center; } .pagination-summary { order: 3; width: 100%; text-align: center; } }
</style>