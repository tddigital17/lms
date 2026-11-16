import { _ as __nuxt_component_0 } from "./AdminSidebar-UFCyCoeU.js";
import { ref, reactive, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr, ssrRenderAttr, ssrRenderClass } from "vue/server-renderer";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/hookable/dist/index.mjs";
import { u as useSupabaseClient } from "./useSupabaseClient-DykwVqLQ.js";
import { _ as _export_sfc } from "../server.mjs";
import "./nuxt-link-BlqZ6m_D.js";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/ufo/dist/index.mjs";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/defu/dist/defu.mjs";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/unctx/dist/index.mjs";
import "D:/1. Data/8.Projek/GitHub/prompt/node_modules/h3/dist/index.mjs";
import "vue-router";
import "@supabase/ssr";
const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    useSupabaseClient();
    const saving = ref(null);
    const saveMessage = ref("");
    const saveError = ref(false);
    const positions = [
      { id: "adsterra_top", label: "Atas (Leaderboard)" },
      { id: "adsterra_sidebar", label: "Bilah Sisi (Sidebar)" },
      { id: "adsterra_bottom", label: "Bawah (Footer Area)" }
    ];
    const settings2 = reactive({
      adsterra_top: "",
      adsterra_sidebar: "",
      adsterra_bottom: "",
      whatsapp_number: "",
      qris_image_url: "",
      donation_info: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AdminSidebar = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "d-flex min-vh-100 bg-light" }, _attrs))} data-v-6b3e89f6>`);
      _push(ssrRenderComponent(_component_AdminSidebar, null, null, _parent));
      _push(`<div class="flex-grow-1 main-admin-content p-3 p-md-4 p-xl-5" data-v-6b3e89f6><div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom" data-v-6b3e89f6><div data-v-6b3e89f6><h3 class="fw-bold text-dark mb-1" data-v-6b3e89f6>Pengaturan Website</h3><p class="text-muted small mb-0" data-v-6b3e89f6>Kelola penempatan iklan, kontak WhatsApp, dan informasi dukungan LMS.</p></div></div><div class="row g-4" data-v-6b3e89f6><!--[-->`);
      ssrRenderList(positions, (pos) => {
        _push(`<div class="col-md-6 col-xl-4" data-v-6b3e89f6><div class="card border-0 rounded-4 shadow-sm h-100 overflow-hidden" data-v-6b3e89f6><div class="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between" data-v-6b3e89f6><div class="d-flex align-items-center" data-v-6b3e89f6><div class="icon-box bg-primary-subtle text-primary rounded-3 p-2 me-2" data-v-6b3e89f6><i class="bi bi-badge-ad" data-v-6b3e89f6></i></div><h6 class="fw-bold mb-0 text-dark" data-v-6b3e89f6>${ssrInterpolate(pos.label)}</h6></div></div><div class="card-body p-4" data-v-6b3e89f6><div class="mb-3" data-v-6b3e89f6><label class="form-label small text-muted fw-bold text-uppercase" data-v-6b3e89f6>Script Iklan (HTML/JS)</label><textarea class="form-control rounded-3 font-monospace small" rows="12" placeholder="Paste script tag Adsterra di sini..." data-v-6b3e89f6>${ssrInterpolate(unref(settings2)[pos.id])}</textarea></div><button class="btn btn-primary w-100 rounded-pill py-2 shadow-sm"${ssrIncludeBooleanAttr(unref(saving) === pos.id) ? " disabled" : ""} data-v-6b3e89f6>`);
        if (unref(saving) === pos.id) {
          _push(`<i class="spinner-border spinner-border-sm me-2" data-v-6b3e89f6></i>`);
        } else {
          _push(`<!---->`);
        }
        _push(` Simpan Perubahan </button></div></div></div>`);
      });
      _push(`<!--]--></div><section class="mt-5" data-v-6b3e89f6><div class="mb-3 pb-3 border-bottom" data-v-6b3e89f6><h4 class="fw-bold text-dark mb-1" data-v-6b3e89f6>Kontak &amp; Dukungan</h4><p class="text-muted small mb-0" data-v-6b3e89f6>Atur kontak WhatsApp dan informasi donasi yang tampil di website publik.</p></div><div class="row g-4" data-v-6b3e89f6><div class="col-lg-6" data-v-6b3e89f6><div class="card border-0 rounded-4 shadow-sm h-100" data-v-6b3e89f6><div class="card-body p-4" data-v-6b3e89f6><label for="whatsappNumber" class="form-label small text-muted fw-bold text-uppercase" data-v-6b3e89f6>Nomor WhatsApp</label><div class="input-group mb-3" data-v-6b3e89f6><span class="input-group-text" data-v-6b3e89f6><i class="bi bi-whatsapp text-success" data-v-6b3e89f6></i></span><input id="whatsappNumber"${ssrRenderAttr("value", unref(settings2).whatsapp_number)} type="tel" inputmode="numeric" class="form-control" placeholder="6281234567890" data-v-6b3e89f6></div><small class="text-muted d-block mb-3" data-v-6b3e89f6>Gunakan kode negara tanpa tanda plus atau spasi, contoh: 6281234567890.</small><button class="btn btn-primary w-100 rounded-pill py-2"${ssrIncludeBooleanAttr(unref(saving) === "whatsapp_number") ? " disabled" : ""} data-v-6b3e89f6>`);
      if (unref(saving) === "whatsapp_number") {
        _push(`<i class="spinner-border spinner-border-sm me-2" data-v-6b3e89f6></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(`Simpan Nomor WhatsApp </button></div></div></div><div class="col-lg-6" data-v-6b3e89f6><div class="card border-0 rounded-4 shadow-sm h-100" data-v-6b3e89f6><div class="card-body p-4" data-v-6b3e89f6><label for="qrisImageUrl" class="form-label small text-muted fw-bold text-uppercase" data-v-6b3e89f6>URL Gambar QRIS</label><div class="input-group mb-3" data-v-6b3e89f6><span class="input-group-text" data-v-6b3e89f6><i class="bi bi-qr-code text-primary" data-v-6b3e89f6></i></span><input id="qrisImageUrl"${ssrRenderAttr("value", unref(settings2).qris_image_url)} type="url" class="form-control" placeholder="https://.../qris.png" data-v-6b3e89f6></div><label for="donationInfo" class="form-label small text-muted fw-bold text-uppercase" data-v-6b3e89f6>Informasi Donasi / Rekening</label><textarea id="donationInfo" class="form-control mb-3" rows="4" placeholder="Tulis instruksi donasi sukarela atau detail rekening..." data-v-6b3e89f6>${ssrInterpolate(unref(settings2).donation_info)}</textarea><button class="btn btn-primary w-100 rounded-pill py-2"${ssrIncludeBooleanAttr(unref(saving) === "donation") ? " disabled" : ""} data-v-6b3e89f6>`);
      if (unref(saving) === "donation") {
        _push(`<i class="spinner-border spinner-border-sm me-2" data-v-6b3e89f6></i>`);
      } else {
        _push(`<!---->`);
      }
      _push(`Simpan Pengaturan Donasi </button></div></div></div></div>`);
      if (unref(saveMessage)) {
        _push(`<p class="${ssrRenderClass([unref(saveError) ? "alert-danger" : "alert-success", "alert mt-3 mb-0"])}" role="status" data-v-6b3e89f6>${ssrInterpolate(unref(saveMessage))}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const settings = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-6b3e89f6"]]);
export {
  settings as default
};
//# sourceMappingURL=settings-Ds5q_i1S.js.map
