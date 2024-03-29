import { openBlock as s, createElementBlock as r, createElementVNode as f, normalizeClass as l, Fragment as h, renderList as g, createCommentVNode as m, toDisplayString as T, renderSlot as k, resolveComponent as _, createVNode as p, withCtx as w } from "../lib/vue.esm-browser.js";
function y(...e) {
  return e.reduce((a, t) => a + t, "");
}
const b = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [c, o] of a)
    t[c] = o;
  return t;
}, C = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs", "flags"],
  setup() {
    return { concat: y };
  },
  data() {
    return {
      currentTab: "creatures"
    };
  },
  methods: {
    changeTab(e) {
      e && e.currentTarget && (this.currentTab = e.currentTarget.dataset.tab);
      for (let [a, t] of Object.entries(this.tabs))
        this.tabs[a].active = !1;
      this.tabs[this.currentTab] && (this.tabs[this.currentTab].active = !0);
    },
    getTabClass(e, a) {
      return `tab-link tab-link--${a}${e.active ? " active" : ""}`;
    }
  },
  async mounted() {
    var e;
    this.currentTab = this.tabs.defaultTab ?? "creatures", (e = this.tabs) != null && e[this.currentTab].hidden && (this.currentTab = "creatures"), this.changeTab(!1);
  }
}, v = { class: "section section--tabs flexshrink" }, $ = ["data-group"], x = ["data-tab"], B = { key: 1 };
function S(e, a, t, c, o, i) {
  return s(), r("section", v, [
    f("nav", {
      class: l("sheet-tabs tabs tabs--" + t.group),
      "data-group": t.group
    }, [
      (s(!0), r(h, null, g(t.tabs, (n, u) => (s(), r("span", {
        key: "tab-" + t.group + "-" + u
      }, [
        n.hidden ? m("", !0) : (s(), r("a", {
          key: 0,
          onClick: a[0] || (a[0] = (...d) => i.changeTab && i.changeTab(...d)),
          class: l(i.getTabClass(n, u)),
          "data-tab": u
        }, [
          n.icon ? (s(), r("i", {
            key: 0,
            class: l(c.concat("fas ", n.icon))
          }, null, 2)) : m("", !0),
          n.hideLabel ? m("", !0) : (s(), r("span", B, T(n.label), 1))
        ], 10, x))
      ]))), 128))
    ], 10, $)
  ]);
}
const N = /* @__PURE__ */ b(C, [["render", S]]), z = {
  name: "Tab",
  props: ["context", "actor", "tab", "group", "classes"]
}, P = ["data-group", "data-tab"];
function V(e, a, t, c, o, i) {
  return s(), r("div", {
    class: l("tab " + t.tab.key + (t.tab.active ? " active" : "") + (t.classes ? " " + t.classes : "")),
    "data-group": t.group,
    "data-tab": t.tab.key
  }, [
    k(e.$slots, "default")
  ], 10, P);
}
const F = /* @__PURE__ */ b(z, [["render", V]]), I = {
  name: "Stub",
  props: ["context"]
};
function M(e, a, t, c, o, i) {
  return s(), r("h1", null, "Foobar");
}
const O = /* @__PURE__ */ b(I, [["render", M], ["__scopeId", "data-v-59ae215c"]]), E = {
  name: "ArchmageCompendiumBrowser",
  props: ["context"],
  components: {
    Tabs: N,
    Tab: F,
    Stub: O
    // CompendiumBrowserCreatures,
    // CompendiumBrowserPowers,
    // CompendiumBrowserItems
  },
  setup() {
    return {
      CONFIG,
      game
    };
  },
  data() {
    return {
      // The only variable we actually need to track is the active tab.
      tabs: {
        defaultTab: "creatures",
        primary: {
          // Default tab is assigned in the flags() computed property.
          creatures: {
            key: "creatures",
            label: game.i18n.localize("CMPBrowser.Tab.NPCBrowser"),
            active: !1,
            opened: !1
          },
          powers: {
            key: "powers",
            label: game.i18n.localize("CMPBrowser.Tab.SpellBrowser"),
            active: !1,
            opened: !1
          },
          items: {
            key: "items",
            label: game.i18n.localize("CMPBrowser.Tab.ItemBrowser"),
            active: !1,
            opened: !1
          }
        }
      }
    };
  },
  methods: {},
  computed: {},
  watch: {},
  async created() {
    console.log("Creating compendium browser...");
  },
  async mounted() {
    console.log("Compendium browser mounted.");
  }
}, L = { class: "compendium-browser-vue flexcol" }, j = { class: "container container--top" }, A = { class: "container container--bottom" };
function D(e, a, t, c, o, i) {
  const n = _("Tabs"), u = _("Stub"), d = _("Tab");
  return s(), r("div", L, [
    f("section", j, [
      p(n, {
        group: "primary",
        tabs: o.tabs.primary,
        flags: e.flags
      }, null, 8, ["tabs", "flags"])
    ]),
    f("section", A, [
      p(d, {
        group: "primary",
        tab: o.tabs.primary.creatures,
        classes: "container container--bottom flexrow"
      }, {
        default: w(() => [
          p(u)
        ]),
        _: 1
      }, 8, ["tab"])
    ])
  ]);
}
const q = /* @__PURE__ */ b(E, [["render", D]]);
export {
  q as VueCompendiumBrowser
};
//# sourceMappingURL=components.vue.es.js.map
