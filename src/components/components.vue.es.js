import { openBlock as r, createElementBlock as o, normalizeClass as m, Fragment as T, renderList as y, createCommentVNode as _, toDisplayString as w, renderSlot as h, resolveComponent as f, createVNode as l, createElementVNode as v, withCtx as b, createTextVNode as g } from "../lib/vue.esm-browser.js";
function C(...t) {
  return t.reduce((a, e) => a + e, "");
}
const p = (t, a) => {
  const e = t.__vccOpts || t;
  for (const [u, s] of a)
    e[u] = s;
  return e;
}, k = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs", "flags"],
  setup() {
    return { concat: C };
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
}, x = ["data-group"], $ = ["data-tab"], B = { key: 1 };
function S(t, a, e, u, s, i) {
  return r(), o("nav", {
    class: m(`tabs tabs--${e.group}`),
    "data-group": e.group
  }, [
    (r(!0), o(T, null, y(e.tabs, (n, c) => (r(), o("span", {
      key: "tab-" + e.group + "-" + c
    }, [
      n.hidden ? _("", !0) : (r(), o("a", {
        key: 0,
        onClick: a[0] || (a[0] = (...d) => i.changeTab && i.changeTab(...d)),
        class: m(i.getTabClass(n, c)),
        "data-tab": c
      }, [
        n.icon ? (r(), o("i", {
          key: 0,
          class: m(u.concat("fas ", n.icon))
        }, null, 2)) : _("", !0),
        n.hideLabel ? _("", !0) : (r(), o("span", B, w(n.label), 1))
      ], 10, $))
    ]))), 128))
  ], 10, x);
}
const N = /* @__PURE__ */ p(k, [["render", S]]), O = {
  name: "Tab",
  props: ["context", "actor", "tab", "group", "classes"]
}, V = ["data-group", "data-tab"];
function z(t, a, e, u, s, i) {
  return r(), o("div", {
    class: m("tab " + e.tab.key + (e.tab.active ? " active" : "") + (e.classes ? " " + e.classes : "")),
    "data-group": e.group,
    "data-tab": e.tab.key
  }, [
    h(t.$slots, "default")
  ], 10, V);
}
const I = /* @__PURE__ */ p(O, [["render", z]]), P = {
  name: "Stub",
  props: ["context"]
};
function j(t, a, e, u, s, i) {
  return r(), o("h1", null, [
    h(t.$slots, "default", {}, void 0, !0)
  ]);
}
const E = /* @__PURE__ */ p(P, [["render", j], ["__scopeId", "data-v-ceecbcd3"]]), M = {
  name: "ArchmageCompendiumBrowser",
  props: ["context"],
  components: {
    Tabs: N,
    Tab: I,
    Stub: E
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
}, A = { class: "compendium-browser-vue parent flexcol" }, F = { class: "content" };
function L(t, a, e, u, s, i) {
  const n = f("Tabs"), c = f("Stub"), d = f("Tab");
  return r(), o("div", A, [
    l(n, {
      group: "primary",
      tabs: s.tabs.primary
    }, null, 8, ["tabs"]),
    v("section", F, [
      l(d, {
        group: "primary",
        tab: s.tabs.primary.creatures,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          l(c, null, {
            default: b(() => [
              g("Creatures")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      l(d, {
        group: "primary",
        tab: s.tabs.primary.powers,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          l(c, null, {
            default: b(() => [
              g("Spells")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      l(d, {
        group: "primary",
        tab: s.tabs.primary.items,
        classes: "container container--bottom flexrow"
      }, {
        default: b(() => [
          l(c, null, {
            default: b(() => [
              g("Items")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"])
    ])
  ]);
}
const G = /* @__PURE__ */ p(M, [["render", L]]);
export {
  G as VueCompendiumBrowser
};
//# sourceMappingURL=components.vue.es.js.map
