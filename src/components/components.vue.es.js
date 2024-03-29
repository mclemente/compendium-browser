import { openBlock as r, createElementBlock as o, createElementVNode as g, normalizeClass as m, Fragment as y, renderList as w, createCommentVNode as _, toDisplayString as v, renderSlot as T, resolveComponent as f, createVNode as i, withCtx as b, createTextVNode as h } from "../lib/vue.esm-browser.js";
function k(...t) {
  return t.reduce((a, e) => a + e, "");
}
const p = (t, a) => {
  const e = t.__vccOpts || t;
  for (const [l, s] of a)
    e[l] = s;
  return e;
}, x = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs", "flags"],
  setup() {
    return { concat: k };
  },
  data() {
    return {
      currentTab: "creatures"
    };
  },
  methods: {
    changeTab(t) {
      t && t.currentTarget && (this.currentTab = t.currentTarget.dataset.tab);
      for (let [a, e] of Object.entries(this.tabs))
        this.tabs[a].active = !1;
      this.tabs[this.currentTab] && (this.tabs[this.currentTab].active = !0);
    },
    getTabClass(t, a) {
      return `tab-link tab-link--${a}${t.active ? " active" : ""}`;
    }
  },
  async mounted() {
    var a;
    const t = (a = Object.values(this.tabs)) == null ? void 0 : a.find((e) => e.active);
    Object.values(this.tabs).forEach((e) => console.log(e)), console.log("Active", t), this.currentTab = (t == null ? void 0 : t.key) ?? "creatures", this.changeTab(!1);
  }
}, C = { class: "section section--tabs flexshrink" }, $ = ["data-group"], B = ["data-tab"], S = { key: 1 };
function N(t, a, e, l, s, u) {
  return r(), o("section", C, [
    g("nav", {
      class: m("sheet-tabs tabs tabs--" + e.group),
      "data-group": e.group
    }, [
      (r(!0), o(y, null, w(e.tabs, (n, c) => (r(), o("span", {
        key: "tab-" + e.group + "-" + c
      }, [
        n.hidden ? _("", !0) : (r(), o("a", {
          key: 0,
          onClick: a[0] || (a[0] = (...d) => u.changeTab && u.changeTab(...d)),
          class: m(u.getTabClass(n, c)),
          "data-tab": c
        }, [
          n.icon ? (r(), o("i", {
            key: 0,
            class: m(l.concat("fas ", n.icon))
          }, null, 2)) : _("", !0),
          n.hideLabel ? _("", !0) : (r(), o("span", S, v(n.label), 1))
        ], 10, B))
      ]))), 128))
    ], 10, $)
  ]);
}
const O = /* @__PURE__ */ p(x, [["render", N]]), V = {
  name: "Tab",
  props: ["context", "actor", "tab", "group", "classes"]
}, z = ["data-group", "data-tab"];
function I(t, a, e, l, s, u) {
  return r(), o("div", {
    class: m("tab " + e.tab.key + (e.tab.active ? " active" : "") + (e.classes ? " " + e.classes : "")),
    "data-group": e.group,
    "data-tab": e.tab.key
  }, [
    T(t.$slots, "default")
  ], 10, z);
}
const P = /* @__PURE__ */ p(V, [["render", I]]), j = {
  name: "Stub",
  props: ["context"]
};
function E(t, a, e, l, s, u) {
  return r(), o("h1", null, [
    T(t.$slots, "default", {}, void 0, !0)
  ]);
}
const M = /* @__PURE__ */ p(j, [["render", E], ["__scopeId", "data-v-ceecbcd3"]]), A = {
  name: "ArchmageCompendiumBrowser",
  props: ["context"],
  components: {
    Tabs: O,
    Tab: P,
    Stub: M
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
    var t, a, e;
    return {
      // The only variable we actually need to track is the active tab.
      tabs: {
        primary: {
          // Default tab is assigned in the flags() computed property.
          creatures: {
            key: "creatures",
            label: game.i18n.localize("CMPBrowser.Tab.NPCBrowser"),
            active: ((t = this.context) == null ? void 0 : t.defaultTab) === "creatures",
            opened: !1
          },
          powers: {
            key: "powers",
            label: game.i18n.localize("CMPBrowser.Tab.SpellBrowser"),
            active: ((a = this.context) == null ? void 0 : a.defaultTab) === "powers",
            opened: !1
          },
          items: {
            key: "items",
            label: game.i18n.localize("CMPBrowser.Tab.ItemBrowser"),
            active: ((e = this.context) == null ? void 0 : e.defaultTab) === "items",
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
}, F = { class: "compendium-browser-vue flexcol" }, L = { class: "container container--top" }, D = { class: "container container--bottom" };
function G(t, a, e, l, s, u) {
  const n = f("Tabs"), c = f("Stub"), d = f("Tab");
  return r(), o("div", F, [
    g("section", L, [
      i(n, {
        group: "primary",
        tabs: s.tabs.primary
      }, null, 8, ["tabs"])
    ]),
    g("section", D, [
      i(d, {
        group: "primary",
        tab: s.tabs.primary.creatures,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          i(c, null, {
            default: b(() => [
              h("Creatures")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      i(d, {
        group: "primary",
        tab: s.tabs.primary.powers,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          i(c, null, {
            default: b(() => [
              h("Spells")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      i(d, {
        group: "primary",
        tab: s.tabs.primary.items,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          i(c, null, {
            default: b(() => [
              h("Items")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"])
    ])
  ]);
}
const H = /* @__PURE__ */ p(A, [["render", G]]);
export {
  H as VueCompendiumBrowser
};
//# sourceMappingURL=components.vue.es.js.map
