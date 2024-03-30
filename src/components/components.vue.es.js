import { openBlock as re, createElementBlock as ie, normalizeClass as de, Fragment as st, renderList as pt, createCommentVNode as oe, toDisplayString as Ce, renderSlot as Be, toRefs as Me, ref as he, computed as K, onMounted as pa, onUnmounted as Tr, watch as ge, mergeProps as ua, createElementVNode as $, withModifiers as Vt, withKeys as Ja, createBlock as ur, Teleport as Dr, getCurrentInstance as Zt, nextTick as Yt, onBeforeUnmount as Nr, onUpdated as Br, resolveComponent as Rt, withDirectives as Qa, vModelText as Mr, vModelSelect as Vr, createVNode as ft, createTextVNode as La, withCtx as Kt } from "../lib/vue.esm-browser.js";
function Rr(...e) {
  return e.reduce((a, t) => a + t, "");
}
function Za(e) {
  const a = e.uuid.replace(".Actor", ""), t = game.dnd5e.moduleArt.map.get(a);
  return (t == null ? void 0 : t.actor) ?? e.img;
}
async function jr(e = [], a = []) {
  if (!e || !a || a.length < 1)
    return;
  let t = [];
  for (let s of e) {
    const m = await game.packs.get(s).getIndex({ fields: a });
    t = t.concat(m.contents);
  }
  return t;
}
function qr(e, a = "Actor") {
  getDocumentClass(a).fromDropData({
    type: a,
    uuid: e
  }).then((t) => {
    t != null && t.sheet ? t.sheet.render(!0) : console.warn(`No document found for ${e}`);
  });
}
function Ir(e, a, t = "Actor") {
  e.dataTransfer.setData("text/plain", JSON.stringify({
    type: t,
    uuid: a.uuid
  }));
}
const ea = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [s, n] of a)
    t[s] = n;
  return t;
}, zr = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs", "flags"],
  setup() {
    return { concat: Rr };
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
    var a;
    const e = (a = Object.values(this.tabs)) == null ? void 0 : a.find((t) => t.active);
    Object.values(this.tabs).forEach((t) => console.log(t)), console.log("Active", e), this.currentTab = (e == null ? void 0 : e.key) ?? "creatures", this.changeTab(!1);
  }
}, Fr = ["data-group"], Ur = ["data-tab"], Hr = { key: 1 };
function Wr(e, a, t, s, n, m) {
  return re(), ie("nav", {
    class: de(`tabs tabs--${t.group}`),
    "data-group": t.group
  }, [
    (re(!0), ie(st, null, pt(t.tabs, (l, d) => (re(), ie("span", {
      key: "tab-" + t.group + "-" + d
    }, [
      l.hidden ? oe("", !0) : (re(), ie("a", {
        key: 0,
        onClick: a[0] || (a[0] = (...p) => m.changeTab && m.changeTab(...p)),
        class: de(m.getTabClass(l, d)),
        "data-tab": d
      }, [
        l.icon ? (re(), ie("i", {
          key: 0,
          class: de(s.concat("fas ", l.icon))
        }, null, 2)) : oe("", !0),
        l.hideLabel ? oe("", !0) : (re(), ie("span", Hr, Ce(l.label), 1))
      ], 10, Ur))
    ]))), 128))
  ], 10, Fr);
}
const _r = /* @__PURE__ */ ea(zr, [["render", Wr]]), $r = {
  name: "Tab",
  props: ["context", "actor", "tab", "group", "classes"]
}, Gr = ["data-group", "data-tab"];
function Kr(e, a, t, s, n, m) {
  return re(), ie("div", {
    class: de("tab " + t.tab.key + (t.tab.active ? " active" : "") + (t.classes ? " " + t.classes : "")),
    "data-group": t.group,
    "data-tab": t.tab.key
  }, [
    Be(e.$slots, "default")
  ], 10, Gr);
}
const Xr = /* @__PURE__ */ ea($r, [["render", Kr]]), Yr = {
  name: "Stub",
  props: ["context"]
};
function Jr(e, a, t, s, n, m) {
  return re(), ie("h1", null, [
    Be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Qr = /* @__PURE__ */ ea(Yr, [["render", Jr], ["__scopeId", "data-v-ceecbcd3"]]);
function sa(e) {
  return [null, void 0, !1].indexOf(e) !== -1;
}
function Zr(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function cr(e) {
  var a = { exports: {} };
  return e(a, a.exports), a.exports;
}
var er = cr(function(e, a) {
  e.exports = /* @__PURE__ */ function() {
    var t = ["decimals", "thousand", "mark", "prefix", "suffix", "encoder", "decoder", "negativeBefore", "negative", "edit", "undo"];
    function s(g) {
      return g.split("").reverse().join("");
    }
    function n(g, w) {
      return g.substring(0, w.length) === w;
    }
    function m(g, w) {
      return g.slice(-1 * w.length) === w;
    }
    function l(g, w, S) {
      if ((g[w] || g[S]) && g[w] === g[S])
        throw new Error(w);
    }
    function d(g) {
      return typeof g == "number" && isFinite(g);
    }
    function p(g, w) {
      return g = g.toString().split("e"), (+((g = (g = Math.round(+(g[0] + "e" + (g[1] ? +g[1] + w : w)))).toString().split("e"))[0] + "e" + (g[1] ? +g[1] - w : -w))).toFixed(w);
    }
    function y(g, w, S, k, V, b, D, R, P, U, F, T) {
      var J, X, N, H = T, ne = "", G = "";
      return b && (T = b(T)), !!d(T) && (g !== !1 && parseFloat(T.toFixed(g)) === 0 && (T = 0), T < 0 && (J = !0, T = Math.abs(T)), g !== !1 && (T = p(T, g)), (T = T.toString()).indexOf(".") !== -1 ? (N = (X = T.split("."))[0], S && (ne = S + X[1])) : N = T, w && (N = s(N).match(/.{1,3}/g), N = s(N.join(s(w)))), J && R && (G += R), k && (G += k), J && P && (G += P), G += N, G += ne, V && (G += V), U && (G = U(G, H)), G);
    }
    function v(g, w, S, k, V, b, D, R, P, U, F, T) {
      var J, X = "";
      return F && (T = F(T)), !(!T || typeof T != "string") && (R && n(T, R) && (T = T.replace(R, ""), J = !0), k && n(T, k) && (T = T.replace(k, "")), P && n(T, P) && (T = T.replace(P, ""), J = !0), V && m(T, V) && (T = T.slice(0, -1 * V.length)), w && (T = T.split(w).join("")), S && (T = T.replace(S, ".")), J && (X += "-"), (X = (X += T).replace(/[^0-9\.\-.]/g, "")) !== "" && (X = Number(X), D && (X = D(X)), !!d(X) && X));
    }
    function x(g) {
      var w, S, k, V = {};
      for (g.suffix === void 0 && (g.suffix = g.postfix), w = 0; w < t.length; w += 1)
        if ((k = g[S = t[w]]) === void 0)
          S !== "negative" || V.negativeBefore ? S === "mark" && V.thousand !== "." ? V[S] = "." : V[S] = !1 : V[S] = "-";
        else if (S === "decimals") {
          if (!(k >= 0 && k < 8))
            throw new Error(S);
          V[S] = k;
        } else if (S === "encoder" || S === "decoder" || S === "edit" || S === "undo") {
          if (typeof k != "function")
            throw new Error(S);
          V[S] = k;
        } else {
          if (typeof k != "string")
            throw new Error(S);
          V[S] = k;
        }
      return l(V, "mark", "thousand"), l(V, "prefix", "negative"), l(V, "prefix", "negativeBefore"), V;
    }
    function A(g, w, S) {
      var k, V = [];
      for (k = 0; k < t.length; k += 1)
        V.push(g[t[k]]);
      return V.push(S), w.apply("", V);
    }
    function E(g) {
      if (!(this instanceof E))
        return new E(g);
      typeof g == "object" && (g = x(g), this.to = function(w) {
        return A(g, y, w);
      }, this.from = function(w) {
        return A(g, v, w);
      });
    }
    return E;
  }();
}), en = Zr(cr(function(e, a) {
  (function(t) {
    function s(o) {
      return n(o) && typeof o.from == "function";
    }
    function n(o) {
      return typeof o == "object" && typeof o.to == "function";
    }
    function m(o) {
      o.parentElement.removeChild(o);
    }
    function l(o) {
      return o != null;
    }
    function d(o) {
      o.preventDefault();
    }
    function p(o) {
      return o.filter(function(r) {
        return !this[r] && (this[r] = !0);
      }, {});
    }
    function y(o, r) {
      return Math.round(o / r) * r;
    }
    function v(o, r) {
      var L = o.getBoundingClientRect(), z = o.ownerDocument, B = z.documentElement, W = b(z);
      return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && (W.x = 0), r ? L.top + W.y - B.clientTop : L.left + W.x - B.clientLeft;
    }
    function x(o) {
      return typeof o == "number" && !isNaN(o) && isFinite(o);
    }
    function A(o, r, L) {
      L > 0 && (S(o, r), setTimeout(function() {
        k(o, r);
      }, L));
    }
    function E(o) {
      return Math.max(Math.min(o, 100), 0);
    }
    function g(o) {
      return Array.isArray(o) ? o : [o];
    }
    function w(o) {
      var r = (o = String(o)).split(".");
      return r.length > 1 ? r[1].length : 0;
    }
    function S(o, r) {
      o.classList && !/\s/.test(r) ? o.classList.add(r) : o.className += " " + r;
    }
    function k(o, r) {
      o.classList && !/\s/.test(r) ? o.classList.remove(r) : o.className = o.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    }
    function V(o, r) {
      return o.classList ? o.classList.contains(r) : new RegExp("\\b" + r + "\\b").test(o.className);
    }
    function b(o) {
      var r = window.pageXOffset !== void 0, L = (o.compatMode || "") === "CSS1Compat";
      return { x: r ? window.pageXOffset : L ? o.documentElement.scrollLeft : o.body.scrollLeft, y: r ? window.pageYOffset : L ? o.documentElement.scrollTop : o.body.scrollTop };
    }
    function D() {
      return window.navigator.pointerEnabled ? { start: "pointerdown", move: "pointermove", end: "pointerup" } : window.navigator.msPointerEnabled ? { start: "MSPointerDown", move: "MSPointerMove", end: "MSPointerUp" } : { start: "mousedown touchstart", move: "mousemove touchmove", end: "mouseup touchend" };
    }
    function R() {
      var o = !1;
      try {
        var r = Object.defineProperty({}, "passive", { get: function() {
          o = !0;
        } });
        window.addEventListener("test", null, r);
      } catch {
      }
      return o;
    }
    function P() {
      return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }
    function U(o, r) {
      return 100 / (r - o);
    }
    function F(o, r, L) {
      return 100 * r / (o[L + 1] - o[L]);
    }
    function T(o, r) {
      return F(o, o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0);
    }
    function J(o, r) {
      return r * (o[1] - o[0]) / 100 + o[0];
    }
    function X(o, r) {
      for (var L = 1; o >= r[L]; )
        L += 1;
      return L;
    }
    function N(o, r, L) {
      if (L >= o.slice(-1)[0])
        return 100;
      var z = X(L, o), B = o[z - 1], W = o[z], ue = r[z - 1], xe = r[z];
      return ue + T([B, W], L) / U(ue, xe);
    }
    function H(o, r, L) {
      if (L >= 100)
        return o.slice(-1)[0];
      var z = X(L, r), B = o[z - 1], W = o[z], ue = r[z - 1];
      return J([B, W], (L - ue) * U(ue, r[z]));
    }
    function ne(o, r, L, z) {
      if (z === 100)
        return z;
      var B = X(z, o), W = o[B - 1], ue = o[B];
      return L ? z - W > (ue - W) / 2 ? ue : W : r[B - 1] ? o[B - 1] + y(z - o[B - 1], r[B - 1]) : z;
    }
    var G, ee;
    t.PipsMode = void 0, (ee = t.PipsMode || (t.PipsMode = {})).Range = "range", ee.Steps = "steps", ee.Positions = "positions", ee.Count = "count", ee.Values = "values", t.PipsType = void 0, (G = t.PipsType || (t.PipsType = {}))[G.None = -1] = "None", G[G.NoValue = 0] = "NoValue", G[G.LargeValue = 1] = "LargeValue", G[G.SmallValue = 2] = "SmallValue";
    var se = function() {
      function o(r, L, z) {
        var B;
        this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [], this.xSteps = [z || !1], this.xNumSteps = [!1], this.snap = L;
        var W = [];
        for (Object.keys(r).forEach(function(ue) {
          W.push([g(r[ue]), ue]);
        }), W.sort(function(ue, xe) {
          return ue[0][0] - xe[0][0];
        }), B = 0; B < W.length; B++)
          this.handleEntryPoint(W[B][1], W[B][0]);
        for (this.xNumSteps = this.xSteps.slice(0), B = 0; B < this.xNumSteps.length; B++)
          this.handleStepPoint(B, this.xNumSteps[B]);
      }
      return o.prototype.getDistance = function(r) {
        for (var L = [], z = 0; z < this.xNumSteps.length - 1; z++)
          L[z] = F(this.xVal, r, z);
        return L;
      }, o.prototype.getAbsoluteDistance = function(r, L, z) {
        var B, W = 0;
        if (r < this.xPct[this.xPct.length - 1])
          for (; r > this.xPct[W + 1]; )
            W++;
        else
          r === this.xPct[this.xPct.length - 1] && (W = this.xPct.length - 2);
        z || r !== this.xPct[W + 1] || W++, L === null && (L = []);
        var ue = 1, xe = L[W], ye = 0, Ve = 0, me = 0, Q = 0;
        for (B = z ? (r - this.xPct[W]) / (this.xPct[W + 1] - this.xPct[W]) : (this.xPct[W + 1] - r) / (this.xPct[W + 1] - this.xPct[W]); xe > 0; )
          ye = this.xPct[W + 1 + Q] - this.xPct[W + Q], L[W + Q] * ue + 100 - 100 * B > 100 ? (Ve = ye * B, ue = (xe - 100 * B) / L[W + Q], B = 1) : (Ve = L[W + Q] * ye / 100 * ue, ue = 0), z ? (me -= Ve, this.xPct.length + Q >= 1 && Q--) : (me += Ve, this.xPct.length - Q >= 1 && Q++), xe = L[W + Q] * ue;
        return r + me;
      }, o.prototype.toStepping = function(r) {
        return r = N(this.xVal, this.xPct, r);
      }, o.prototype.fromStepping = function(r) {
        return H(this.xVal, this.xPct, r);
      }, o.prototype.getStep = function(r) {
        return r = ne(this.xPct, this.xSteps, this.snap, r);
      }, o.prototype.getDefaultStep = function(r, L, z) {
        var B = X(r, this.xPct);
        return (r === 100 || L && r === this.xPct[B - 1]) && (B = Math.max(B - 1, 1)), (this.xVal[B] - this.xVal[B - 1]) / z;
      }, o.prototype.getNearbySteps = function(r) {
        var L = X(r, this.xPct);
        return { stepBefore: { startValue: this.xVal[L - 2], step: this.xNumSteps[L - 2], highestStep: this.xHighestCompleteStep[L - 2] }, thisStep: { startValue: this.xVal[L - 1], step: this.xNumSteps[L - 1], highestStep: this.xHighestCompleteStep[L - 1] }, stepAfter: { startValue: this.xVal[L], step: this.xNumSteps[L], highestStep: this.xHighestCompleteStep[L] } };
      }, o.prototype.countStepDecimals = function() {
        var r = this.xNumSteps.map(w);
        return Math.max.apply(null, r);
      }, o.prototype.hasNoSize = function() {
        return this.xVal[0] === this.xVal[this.xVal.length - 1];
      }, o.prototype.convert = function(r) {
        return this.getStep(this.toStepping(r));
      }, o.prototype.handleEntryPoint = function(r, L) {
        var z;
        if (!x(z = r === "min" ? 0 : r === "max" ? 100 : parseFloat(r)) || !x(L[0]))
          throw new Error("noUiSlider: 'range' value isn't numeric.");
        this.xPct.push(z), this.xVal.push(L[0]);
        var B = Number(L[1]);
        z ? this.xSteps.push(!isNaN(B) && B) : isNaN(B) || (this.xSteps[0] = B), this.xHighestCompleteStep.push(0);
      }, o.prototype.handleStepPoint = function(r, L) {
        if (L)
          if (this.xVal[r] !== this.xVal[r + 1]) {
            this.xSteps[r] = F([this.xVal[r], this.xVal[r + 1]], L, 0) / U(this.xPct[r], this.xPct[r + 1]);
            var z = (this.xVal[r + 1] - this.xVal[r]) / this.xNumSteps[r], B = Math.ceil(Number(z.toFixed(3)) - 1), W = this.xVal[r] + this.xNumSteps[r] * B;
            this.xHighestCompleteStep[r] = W;
          } else
            this.xSteps[r] = this.xHighestCompleteStep[r] = this.xVal[r];
      }, o;
    }(), Te = { to: function(o) {
      return o === void 0 ? "" : o.toFixed(2);
    }, from: Number }, Y = { target: "target", base: "base", origin: "origin", handle: "handle", handleLower: "handle-lower", handleUpper: "handle-upper", touchArea: "touch-area", horizontal: "horizontal", vertical: "vertical", background: "background", connect: "connect", connects: "connects", ltr: "ltr", rtl: "rtl", textDirectionLtr: "txt-dir-ltr", textDirectionRtl: "txt-dir-rtl", draggable: "draggable", drag: "state-drag", tap: "state-tap", active: "active", tooltip: "tooltip", pips: "pips", pipsHorizontal: "pips-horizontal", pipsVertical: "pips-vertical", marker: "marker", markerHorizontal: "marker-horizontal", markerVertical: "marker-vertical", markerNormal: "marker-normal", markerLarge: "marker-large", markerSub: "marker-sub", value: "value", valueHorizontal: "value-horizontal", valueVertical: "value-vertical", valueNormal: "value-normal", valueLarge: "value-large", valueSub: "value-sub" }, Z = { tooltips: ".__tooltips", aria: ".__aria" };
    function te(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'step' is not numeric.");
      o.singleStep = r;
    }
    function pe(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'keyboardPageMultiplier' is not numeric.");
      o.keyboardPageMultiplier = r;
    }
    function Le(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
      o.keyboardMultiplier = r;
    }
    function ce(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
      o.keyboardDefaultStep = r;
    }
    function _(o, r) {
      if (typeof r != "object" || Array.isArray(r))
        throw new Error("noUiSlider: 'range' is not an object.");
      if (r.min === void 0 || r.max === void 0)
        throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
      o.spectrum = new se(r, o.snap || !1, o.singleStep);
    }
    function h(o, r) {
      if (r = g(r), !Array.isArray(r) || !r.length)
        throw new Error("noUiSlider: 'start' option is incorrect.");
      o.handles = r.length, o.start = r;
    }
    function j(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'snap' option must be a boolean.");
      o.snap = r;
    }
    function be(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'animate' option must be a boolean.");
      o.animate = r;
    }
    function Re(o, r) {
      if (typeof r != "number")
        throw new Error("noUiSlider: 'animationDuration' option must be a number.");
      o.animationDuration = r;
    }
    function gt(o, r) {
      var L, z = [!1];
      if (r === "lower" ? r = [!0, !1] : r === "upper" && (r = [!1, !0]), r === !0 || r === !1) {
        for (L = 1; L < o.handles; L++)
          z.push(r);
        z.push(!1);
      } else {
        if (!Array.isArray(r) || !r.length || r.length !== o.handles + 1)
          throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
        z = r;
      }
      o.connect = z;
    }
    function bt(o, r) {
      switch (r) {
        case "horizontal":
          o.ort = 0;
          break;
        case "vertical":
          o.ort = 1;
          break;
        default:
          throw new Error("noUiSlider: 'orientation' option is invalid.");
      }
    }
    function Ke(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'margin' option must be numeric.");
      r !== 0 && (o.margin = o.spectrum.getDistance(r));
    }
    function kt(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'limit' option must be numeric.");
      if (o.limit = o.spectrum.getDistance(r), !o.limit || o.handles < 2)
        throw new Error("noUiSlider: 'limit' option is only supported on linear sliders with 2 or more handles.");
    }
    function Ft(o, r) {
      var L;
      if (!x(r) && !Array.isArray(r))
        throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
      if (Array.isArray(r) && r.length !== 2 && !x(r[0]) && !x(r[1]))
        throw new Error("noUiSlider: 'padding' option must be numeric or array of exactly 2 numbers.");
      if (r !== 0) {
        for (Array.isArray(r) || (r = [r, r]), o.padding = [o.spectrum.getDistance(r[0]), o.spectrum.getDistance(r[1])], L = 0; L < o.spectrum.xNumSteps.length - 1; L++)
          if (o.padding[0][L] < 0 || o.padding[1][L] < 0)
            throw new Error("noUiSlider: 'padding' option must be a positive number(s).");
        var z = r[0] + r[1], B = o.spectrum.xVal[0];
        if (z / (o.spectrum.xVal[o.spectrum.xVal.length - 1] - B) > 1)
          throw new Error("noUiSlider: 'padding' option must not exceed 100% of the range.");
      }
    }
    function Qe(o, r) {
      switch (r) {
        case "ltr":
          o.dir = 0;
          break;
        case "rtl":
          o.dir = 1;
          break;
        default:
          throw new Error("noUiSlider: 'direction' option was not recognized.");
      }
    }
    function Pt(o, r) {
      if (typeof r != "string")
        throw new Error("noUiSlider: 'behaviour' must be a string containing options.");
      var L = r.indexOf("tap") >= 0, z = r.indexOf("drag") >= 0, B = r.indexOf("fixed") >= 0, W = r.indexOf("snap") >= 0, ue = r.indexOf("hover") >= 0, xe = r.indexOf("unconstrained") >= 0, ye = r.indexOf("drag-all") >= 0, Ve = r.indexOf("smooth-steps") >= 0;
      if (B) {
        if (o.handles !== 2)
          throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
        Ke(o, o.start[1] - o.start[0]);
      }
      if (xe && (o.margin || o.limit))
        throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
      o.events = { tap: L || W, drag: z, dragAll: ye, smoothSteps: Ve, fixed: B, snap: W, hover: ue, unconstrained: xe };
    }
    function Ze(o, r) {
      if (r !== !1)
        if (r === !0 || n(r)) {
          o.tooltips = [];
          for (var L = 0; L < o.handles; L++)
            o.tooltips.push(r);
        } else {
          if ((r = g(r)).length !== o.handles)
            throw new Error("noUiSlider: must pass a formatter for all handles.");
          r.forEach(function(z) {
            if (typeof z != "boolean" && !n(z))
              throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
          }), o.tooltips = r;
        }
    }
    function _e(o, r) {
      if (r.length !== o.handles)
        throw new Error("noUiSlider: must pass a attributes for all handles.");
      o.handleAttributes = r;
    }
    function qe(o, r) {
      if (!n(r))
        throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
      o.ariaFormat = r;
    }
    function ze(o, r) {
      if (!s(r))
        throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
      o.format = r;
    }
    function Xe(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
      o.keyboardSupport = r;
    }
    function yt(o, r) {
      o.documentElement = r;
    }
    function Ct(o, r) {
      if (typeof r != "string" && r !== !1)
        throw new Error("noUiSlider: 'cssPrefix' must be a string or `false`.");
      o.cssPrefix = r;
    }
    function Ie(o, r) {
      if (typeof r != "object")
        throw new Error("noUiSlider: 'cssClasses' must be an object.");
      typeof o.cssPrefix == "string" ? (o.cssClasses = {}, Object.keys(r).forEach(function(L) {
        o.cssClasses[L] = o.cssPrefix + r[L];
      })) : o.cssClasses = r;
    }
    function ct(o) {
      var r = { margin: null, limit: null, padding: null, animate: !0, animationDuration: 300, ariaFormat: Te, format: Te }, L = { step: { r: !1, t: te }, keyboardPageMultiplier: { r: !1, t: pe }, keyboardMultiplier: { r: !1, t: Le }, keyboardDefaultStep: { r: !1, t: ce }, start: { r: !0, t: h }, connect: { r: !0, t: gt }, direction: { r: !0, t: Qe }, snap: { r: !1, t: j }, animate: { r: !1, t: be }, animationDuration: { r: !1, t: Re }, range: { r: !0, t: _ }, orientation: { r: !1, t: bt }, margin: { r: !1, t: Ke }, limit: { r: !1, t: kt }, padding: { r: !1, t: Ft }, behaviour: { r: !0, t: Pt }, ariaFormat: { r: !1, t: qe }, format: { r: !1, t: ze }, tooltips: { r: !1, t: Ze }, keyboardSupport: { r: !0, t: Xe }, documentElement: { r: !1, t: yt }, cssPrefix: { r: !0, t: Ct }, cssClasses: { r: !0, t: Ie }, handleAttributes: { r: !1, t: _e } }, z = { connect: !1, direction: "ltr", behaviour: "tap", orientation: "horizontal", keyboardSupport: !0, cssPrefix: "noUi-", cssClasses: Y, keyboardPageMultiplier: 5, keyboardMultiplier: 1, keyboardDefaultStep: 10 };
      o.format && !o.ariaFormat && (o.ariaFormat = o.format), Object.keys(L).forEach(function(ye) {
        if (l(o[ye]) || z[ye] !== void 0)
          L[ye].t(r, l(o[ye]) ? o[ye] : z[ye]);
        else if (L[ye].r)
          throw new Error("noUiSlider: '" + ye + "' is required.");
      }), r.pips = o.pips;
      var B = document.createElement("div"), W = B.style.msTransform !== void 0, ue = B.style.transform !== void 0;
      r.transformRule = ue ? "transform" : W ? "msTransform" : "webkitTransform";
      var xe = [["left", "top"], ["right", "bottom"]];
      return r.style = xe[r.dir][r.ort], r;
    }
    function et(o, r, L) {
      var z, B, W, ue, xe, ye = D(), Ve = P() && R(), me = o, Q = r.spectrum, $e = [], we = [], Ne = [], Fe = 0, Ue = {}, at = o.ownerDocument, At = r.documentElement || at.documentElement, wt = at.body, ga = at.dir === "rtl" || r.ort === 1 ? 0 : 100;
      function He(i, c) {
        var f = at.createElement("div");
        return c && S(f, c), i.appendChild(f), f;
      }
      function ba(i, c) {
        var f = He(i, r.cssClasses.origin), O = He(f, r.cssClasses.handle);
        if (He(O, r.cssClasses.touchArea), O.setAttribute("data-handle", String(c)), r.keyboardSupport && (O.setAttribute("tabindex", "0"), O.addEventListener("keydown", function(M) {
          return wr(M, c);
        })), r.handleAttributes !== void 0) {
          var q = r.handleAttributes[c];
          Object.keys(q).forEach(function(M) {
            O.setAttribute(M, q[M]);
          });
        }
        return O.setAttribute("role", "slider"), O.setAttribute("aria-orientation", r.ort ? "vertical" : "horizontal"), c === 0 ? S(O, r.cssClasses.handleLower) : c === r.handles - 1 && S(O, r.cssClasses.handleUpper), f;
      }
      function ta(i, c) {
        return !!c && He(i, r.cssClasses.connect);
      }
      function ya(i, c) {
        var f = He(c, r.cssClasses.connects);
        B = [], (W = []).push(ta(f, i[0]));
        for (var O = 0; O < r.handles; O++)
          B.push(ba(c, O)), Ne[O] = O, W.push(ta(f, i[O + 1]));
      }
      function Ye(i) {
        return S(i, r.cssClasses.target), r.dir === 0 ? S(i, r.cssClasses.ltr) : S(i, r.cssClasses.rtl), r.ort === 0 ? S(i, r.cssClasses.horizontal) : S(i, r.cssClasses.vertical), S(i, getComputedStyle(i).direction === "rtl" ? r.cssClasses.textDirectionRtl : r.cssClasses.textDirectionLtr), He(i, r.cssClasses.base);
      }
      function wa(i, c) {
        return !(!r.tooltips || !r.tooltips[c]) && He(i.firstChild, r.cssClasses.tooltip);
      }
      function aa() {
        return me.hasAttribute("disabled");
      }
      function Ut(i) {
        return B[i].hasAttribute("disabled");
      }
      function Ht() {
        xe && (Gt("update" + Z.tooltips), xe.forEach(function(i) {
          i && m(i);
        }), xe = null);
      }
      function Tt() {
        Ht(), xe = B.map(wa), Oa("update" + Z.tooltips, function(i, c, f) {
          if (xe && r.tooltips && xe[c] !== !1) {
            var O = i[c];
            r.tooltips[c] !== !0 && (O = r.tooltips[c].to(f[c])), xe[c].innerHTML = O;
          }
        });
      }
      function Wt() {
        Gt("update" + Z.aria), Oa("update" + Z.aria, function(i, c, f, O, q) {
          Ne.forEach(function(M) {
            var ae = B[M], I = na(we, M, 0, !0, !0, !0), Pe = na(we, M, 100, !0, !0, !0), Ee = q[M], ve = String(r.ariaFormat.to(f[M]));
            I = Q.fromStepping(I).toFixed(1), Pe = Q.fromStepping(Pe).toFixed(1), Ee = Q.fromStepping(Ee).toFixed(1), ae.children[0].setAttribute("aria-valuemin", I), ae.children[0].setAttribute("aria-valuemax", Pe), ae.children[0].setAttribute("aria-valuenow", Ee), ae.children[0].setAttribute("aria-valuetext", ve);
          });
        });
      }
      function Dt(i) {
        if (i.mode === t.PipsMode.Range || i.mode === t.PipsMode.Steps)
          return Q.xVal;
        if (i.mode === t.PipsMode.Count) {
          if (i.values < 2)
            throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
          for (var c = i.values - 1, f = 100 / c, O = []; c--; )
            O[c] = c * f;
          return O.push(100), St(O, i.stepped);
        }
        return i.mode === t.PipsMode.Positions ? St(i.values, i.stepped) : i.mode === t.PipsMode.Values ? i.stepped ? i.values.map(function(q) {
          return Q.fromStepping(Q.getStep(Q.toStepping(q)));
        }) : i.values : [];
      }
      function St(i, c) {
        return i.map(function(f) {
          return Q.fromStepping(c ? Q.getStep(f) : f);
        });
      }
      function _t(i) {
        function c(Ee, ve) {
          return Number((Ee + ve).toFixed(7));
        }
        var f = Dt(i), O = {}, q = Q.xVal[0], M = Q.xVal[Q.xVal.length - 1], ae = !1, I = !1, Pe = 0;
        return (f = p(f.slice().sort(function(Ee, ve) {
          return Ee - ve;
        })))[0] !== q && (f.unshift(q), ae = !0), f[f.length - 1] !== M && (f.push(M), I = !0), f.forEach(function(Ee, ve) {
          var Oe, fe, De, je, Ae, $a, ka, Ga, Ka, Xa, Pa = Ee, Mt = f[ve + 1], Ya = i.mode === t.PipsMode.Steps;
          for (Ya && (Oe = Q.xNumSteps[ve]), Oe || (Oe = Mt - Pa), Mt === void 0 && (Mt = Pa), Oe = Math.max(Oe, 1e-7), fe = Pa; fe <= Mt; fe = c(fe, Oe)) {
            for (Ga = (Ae = (je = Q.toStepping(fe)) - Pe) / (i.density || 1), Xa = Ae / (Ka = Math.round(Ga)), De = 1; De <= Ka; De += 1)
              O[($a = Pe + De * Xa).toFixed(5)] = [Q.fromStepping($a), 0];
            ka = f.indexOf(fe) > -1 ? t.PipsType.LargeValue : Ya ? t.PipsType.SmallValue : t.PipsType.NoValue, !ve && ae && fe !== Mt && (ka = 0), fe === Mt && I || (O[je.toFixed(5)] = [fe, ka]), Pe = je;
          }
        }), O;
      }
      function Sa(i, c, f) {
        var O, q, M = at.createElement("div"), ae = ((O = {})[t.PipsType.None] = "", O[t.PipsType.NoValue] = r.cssClasses.valueNormal, O[t.PipsType.LargeValue] = r.cssClasses.valueLarge, O[t.PipsType.SmallValue] = r.cssClasses.valueSub, O), I = ((q = {})[t.PipsType.None] = "", q[t.PipsType.NoValue] = r.cssClasses.markerNormal, q[t.PipsType.LargeValue] = r.cssClasses.markerLarge, q[t.PipsType.SmallValue] = r.cssClasses.markerSub, q), Pe = [r.cssClasses.valueHorizontal, r.cssClasses.valueVertical], Ee = [r.cssClasses.markerHorizontal, r.cssClasses.markerVertical];
        function ve(fe, De) {
          var je = De === r.cssClasses.value, Ae = je ? ae : I;
          return De + " " + (je ? Pe : Ee)[r.ort] + " " + Ae[fe];
        }
        function Oe(fe, De, je) {
          if ((je = c ? c(De, je) : je) !== t.PipsType.None) {
            var Ae = He(M, !1);
            Ae.className = ve(je, r.cssClasses.marker), Ae.style[r.style] = fe + "%", je > t.PipsType.NoValue && ((Ae = He(M, !1)).className = ve(je, r.cssClasses.value), Ae.setAttribute("data-value", String(De)), Ae.style[r.style] = fe + "%", Ae.innerHTML = String(f.to(De)));
          }
        }
        return S(M, r.cssClasses.pips), S(M, r.ort === 0 ? r.cssClasses.pipsHorizontal : r.cssClasses.pipsVertical), Object.keys(i).forEach(function(fe) {
          Oe(fe, i[fe][0], i[fe][1]);
        }), M;
      }
      function dt() {
        ue && (m(ue), ue = null);
      }
      function Nt(i) {
        dt();
        var c = _t(i), f = i.filter, O = i.format || { to: function(q) {
          return String(Math.round(q));
        } };
        return ue = me.appendChild(Sa(c, f, O));
      }
      function u() {
        var i = z.getBoundingClientRect(), c = "offset" + ["Width", "Height"][r.ort];
        return r.ort === 0 ? i.width || z[c] : i.height || z[c];
      }
      function C(i, c, f, O) {
        var q = function(ae) {
          var I = le(ae, O.pageOffset, O.target || c);
          return !!I && !(aa() && !O.doNotReject) && !(V(me, r.cssClasses.tap) && !O.doNotReject) && !(i === ye.start && I.buttons !== void 0 && I.buttons > 1) && (!O.hover || !I.buttons) && (Ve || I.preventDefault(), I.calcPoint = I.points[r.ort], void f(I, O));
        }, M = [];
        return i.split(" ").forEach(function(ae) {
          c.addEventListener(ae, q, !!Ve && { passive: !0 }), M.push([ae, q]);
        }), M;
      }
      function le(i, c, f) {
        var O = i.type.indexOf("touch") === 0, q = i.type.indexOf("mouse") === 0, M = i.type.indexOf("pointer") === 0, ae = 0, I = 0;
        if (i.type.indexOf("MSPointer") === 0 && (M = !0), i.type === "mousedown" && !i.buttons && !i.touches)
          return !1;
        if (O) {
          var Pe = function(Oe) {
            var fe = Oe.target;
            return fe === f || f.contains(fe) || i.composed && i.composedPath().shift() === f;
          };
          if (i.type === "touchstart") {
            var Ee = Array.prototype.filter.call(i.touches, Pe);
            if (Ee.length > 1)
              return !1;
            ae = Ee[0].pageX, I = Ee[0].pageY;
          } else {
            var ve = Array.prototype.find.call(i.changedTouches, Pe);
            if (!ve)
              return !1;
            ae = ve.pageX, I = ve.pageY;
          }
        }
        return c = c || b(at), (q || M) && (ae = i.clientX + c.x, I = i.clientY + c.y), i.pageOffset = c, i.points = [ae, I], i.cursor = q || M, i;
      }
      function Se(i) {
        var c = 100 * (i - v(z, r.ort)) / u();
        return c = E(c), r.dir ? 100 - c : c;
      }
      function lt(i) {
        var c = 100, f = !1;
        return B.forEach(function(O, q) {
          if (!Ut(q)) {
            var M = we[q], ae = Math.abs(M - i);
            (ae < c || ae <= c && i > M || ae === 100 && c === 100) && (f = q, c = ae);
          }
        }), f;
      }
      function ra(i, c) {
        i.type === "mouseout" && i.target.nodeName === "HTML" && i.relatedTarget === null && $t(i, c);
      }
      function Ia(i, c) {
        if (navigator.appVersion.indexOf("MSIE 9") === -1 && i.buttons === 0 && c.buttonsProperty !== 0)
          return $t(i, c);
        var f = (r.dir ? -1 : 1) * (i.calcPoint - c.startCalcPoint);
        za(f > 0, 100 * f / c.baseSize, c.locations, c.handleNumbers, c.connect);
      }
      function $t(i, c) {
        c.handle && (k(c.handle, r.cssClasses.active), Fe -= 1), c.listeners.forEach(function(f) {
          At.removeEventListener(f[0], f[1]);
        }), Fe === 0 && (k(me, r.cssClasses.drag), Ea(), i.cursor && (wt.style.cursor = "", wt.removeEventListener("selectstart", d))), r.events.smoothSteps && (c.handleNumbers.forEach(function(f) {
          Ot(f, we[f], !0, !0, !1, !1);
        }), c.handleNumbers.forEach(function(f) {
          ke("update", f);
        })), c.handleNumbers.forEach(function(f) {
          ke("change", f), ke("set", f), ke("end", f);
        });
      }
      function Bt(i, c) {
        if (!c.handleNumbers.some(Ut)) {
          var f;
          c.handleNumbers.length === 1 && (f = B[c.handleNumbers[0]].children[0], Fe += 1, S(f, r.cssClasses.active)), i.stopPropagation();
          var O = [], q = C(ye.move, At, Ia, { target: i.target, handle: f, connect: c.connect, listeners: O, startCalcPoint: i.calcPoint, baseSize: u(), pageOffset: i.pageOffset, handleNumbers: c.handleNumbers, buttonsProperty: i.buttons, locations: we.slice() }), M = C(ye.end, At, $t, { target: i.target, handle: f, listeners: O, doNotReject: !0, handleNumbers: c.handleNumbers }), ae = C("mouseout", At, ra, { target: i.target, handle: f, listeners: O, doNotReject: !0, handleNumbers: c.handleNumbers });
          O.push.apply(O, q.concat(M, ae)), i.cursor && (wt.style.cursor = getComputedStyle(i.target).cursor, B.length > 1 && S(me, r.cssClasses.drag), wt.addEventListener("selectstart", d, !1)), c.handleNumbers.forEach(function(I) {
            ke("start", I);
          });
        }
      }
      function br(i) {
        i.stopPropagation();
        var c = Se(i.calcPoint), f = lt(c);
        f !== !1 && (r.events.snap || A(me, r.cssClasses.tap, r.animationDuration), Ot(f, c, !0, !0), Ea(), ke("slide", f, !0), ke("update", f, !0), r.events.snap ? Bt(i, { handleNumbers: [f] }) : (ke("change", f, !0), ke("set", f, !0)));
      }
      function yr(i) {
        var c = Se(i.calcPoint), f = Q.getStep(c), O = Q.fromStepping(f);
        Object.keys(Ue).forEach(function(q) {
          q.split(".")[0] === "hover" && Ue[q].forEach(function(M) {
            M.call(la, O);
          });
        });
      }
      function wr(i, c) {
        if (aa() || Ut(c))
          return !1;
        var f = ["Left", "Right"], O = ["Down", "Up"], q = ["PageDown", "PageUp"], M = ["Home", "End"];
        r.dir && !r.ort ? f.reverse() : r.ort && !r.dir && (O.reverse(), q.reverse());
        var ae, I = i.key.replace("Arrow", ""), Pe = I === q[0], Ee = I === q[1], ve = I === O[0] || I === f[0] || Pe, Oe = I === O[1] || I === f[1] || Ee, fe = I === M[0], De = I === M[1];
        if (!(ve || Oe || fe || De))
          return !0;
        if (i.preventDefault(), Oe || ve) {
          var je = ve ? 0 : 1, Ae = _a(c)[je];
          if (Ae === null)
            return !1;
          Ae === !1 && (Ae = Q.getDefaultStep(we[c], ve, r.keyboardDefaultStep)), Ae *= Ee || Pe ? r.keyboardPageMultiplier : r.keyboardMultiplier, Ae = Math.max(Ae, 1e-7), Ae *= ve ? -1 : 1, ae = $e[c] + Ae;
        } else
          ae = De ? r.spectrum.xVal[r.spectrum.xVal.length - 1] : r.spectrum.xVal[0];
        return Ot(c, Q.toStepping(ae), !0, !0), ke("slide", c), ke("update", c), ke("change", c), ke("set", c), !1;
      }
      function Sr(i) {
        i.fixed || B.forEach(function(c, f) {
          C(ye.start, c.children[0], Bt, { handleNumbers: [f] });
        }), i.tap && C(ye.start, z, br, {}), i.hover && C(ye.move, z, yr, { hover: !0 }), i.drag && W.forEach(function(c, f) {
          if (c !== !1 && f !== 0 && f !== W.length - 1) {
            var O = B[f - 1], q = B[f], M = [c], ae = [O, q], I = [f - 1, f];
            S(c, r.cssClasses.draggable), i.fixed && (M.push(O.children[0]), M.push(q.children[0])), i.dragAll && (ae = B, I = Ne), M.forEach(function(Pe) {
              C(ye.start, Pe, Bt, { handles: ae, handleNumbers: I, connect: c });
            });
          }
        });
      }
      function Oa(i, c) {
        Ue[i] = Ue[i] || [], Ue[i].push(c), i.split(".")[0] === "update" && B.forEach(function(f, O) {
          ke("update", O);
        });
      }
      function Or(i) {
        return i === Z.aria || i === Z.tooltips;
      }
      function Gt(i) {
        var c = i && i.split(".")[0], f = c ? i.substring(c.length) : i;
        Object.keys(Ue).forEach(function(O) {
          var q = O.split(".")[0], M = O.substring(q.length);
          c && c !== q || f && f !== M || Or(M) && f !== M || delete Ue[O];
        });
      }
      function ke(i, c, f) {
        Object.keys(Ue).forEach(function(O) {
          var q = O.split(".")[0];
          i === q && Ue[O].forEach(function(M) {
            M.call(la, $e.map(r.format.to), c, $e.slice(), f || !1, we.slice(), la);
          });
        });
      }
      function na(i, c, f, O, q, M, ae) {
        var I;
        return B.length > 1 && !r.events.unconstrained && (O && c > 0 && (I = Q.getAbsoluteDistance(i[c - 1], r.margin, !1), f = Math.max(f, I)), q && c < B.length - 1 && (I = Q.getAbsoluteDistance(i[c + 1], r.margin, !0), f = Math.min(f, I))), B.length > 1 && r.limit && (O && c > 0 && (I = Q.getAbsoluteDistance(i[c - 1], r.limit, !1), f = Math.min(f, I)), q && c < B.length - 1 && (I = Q.getAbsoluteDistance(i[c + 1], r.limit, !0), f = Math.max(f, I))), r.padding && (c === 0 && (I = Q.getAbsoluteDistance(0, r.padding[0], !1), f = Math.max(f, I)), c === B.length - 1 && (I = Q.getAbsoluteDistance(100, r.padding[1], !0), f = Math.min(f, I))), ae || (f = Q.getStep(f)), !((f = E(f)) === i[c] && !M) && f;
      }
      function xa(i, c) {
        var f = r.ort;
        return (f ? c : i) + ", " + (f ? i : c);
      }
      function za(i, c, f, O, q) {
        var M = f.slice(), ae = O[0], I = r.events.smoothSteps, Pe = [!i, i], Ee = [i, !i];
        O = O.slice(), i && O.reverse(), O.length > 1 ? O.forEach(function(Oe, fe) {
          var De = na(M, Oe, M[Oe] + c, Pe[fe], Ee[fe], !1, I);
          De === !1 ? c = 0 : (c = De - M[Oe], M[Oe] = De);
        }) : Pe = Ee = [!0];
        var ve = !1;
        O.forEach(function(Oe, fe) {
          ve = Ot(Oe, f[Oe] + c, Pe[fe], Ee[fe], !1, I) || ve;
        }), ve && (O.forEach(function(Oe) {
          ke("update", Oe), ke("slide", Oe);
        }), q != null && ke("drag", ae));
      }
      function Fa(i, c) {
        return r.dir ? 100 - i - c : i;
      }
      function xr(i, c) {
        we[i] = c, $e[i] = Q.fromStepping(c);
        var f = "translate(" + xa(Fa(c, 0) - ga + "%", "0") + ")";
        B[i].style[r.transformRule] = f, Ua(i), Ua(i + 1);
      }
      function Ea() {
        Ne.forEach(function(i) {
          var c = we[i] > 50 ? -1 : 1, f = 3 + (B.length + c * i);
          B[i].style.zIndex = String(f);
        });
      }
      function Ot(i, c, f, O, q, M) {
        return q || (c = na(we, i, c, f, O, !1, M)), c !== !1 && (xr(i, c), !0);
      }
      function Ua(i) {
        if (W[i]) {
          var c = 0, f = 100;
          i !== 0 && (c = we[i - 1]), i !== W.length - 1 && (f = we[i]);
          var O = f - c, q = "translate(" + xa(Fa(c, O) + "%", "0") + ")", M = "scale(" + xa(O / 100, "1") + ")";
          W[i].style[r.transformRule] = q + " " + M;
        }
      }
      function Ha(i, c) {
        return i === null || i === !1 || i === void 0 ? we[c] : (typeof i == "number" && (i = String(i)), (i = r.format.from(i)) !== !1 && (i = Q.toStepping(i)), i === !1 || isNaN(i) ? we[c] : i);
      }
      function ia(i, c, f) {
        var O = g(i), q = we[0] === void 0;
        c = c === void 0 || c, r.animate && !q && A(me, r.cssClasses.tap, r.animationDuration), Ne.forEach(function(I) {
          Ot(I, Ha(O[I], I), !0, !1, f);
        });
        var M = Ne.length === 1 ? 0 : 1;
        if (q && Q.hasNoSize() && (f = !0, we[0] = 0, Ne.length > 1)) {
          var ae = 100 / (Ne.length - 1);
          Ne.forEach(function(I) {
            we[I] = I * ae;
          });
        }
        for (; M < Ne.length; ++M)
          Ne.forEach(function(I) {
            Ot(I, we[I], !0, !0, f);
          });
        Ea(), Ne.forEach(function(I) {
          ke("update", I), O[I] !== null && c && ke("set", I);
        });
      }
      function Er(i) {
        ia(r.start, i);
      }
      function kr(i, c, f, O) {
        if (!((i = Number(i)) >= 0 && i < Ne.length))
          throw new Error("noUiSlider: invalid handle number, got: " + i);
        Ot(i, Ha(c, i), !0, !0, O), ke("update", i), f && ke("set", i);
      }
      function Wa(i) {
        if (i === void 0 && (i = !1), i)
          return $e.length === 1 ? $e[0] : $e.slice(0);
        var c = $e.map(r.format.to);
        return c.length === 1 ? c[0] : c;
      }
      function Pr() {
        for (Gt(Z.aria), Gt(Z.tooltips), Object.keys(r.cssClasses).forEach(function(i) {
          k(me, r.cssClasses[i]);
        }); me.firstChild; )
          me.removeChild(me.firstChild);
        delete me.noUiSlider;
      }
      function _a(i) {
        var c = we[i], f = Q.getNearbySteps(c), O = $e[i], q = f.thisStep.step, M = null;
        if (r.snap)
          return [O - f.stepBefore.startValue || null, f.stepAfter.startValue - O || null];
        q !== !1 && O + q > f.stepAfter.startValue && (q = f.stepAfter.startValue - O), M = O > f.thisStep.startValue ? f.thisStep.step : f.stepBefore.step !== !1 && O - f.stepBefore.highestStep, c === 100 ? q = null : c === 0 && (M = null);
        var ae = Q.countStepDecimals();
        return q !== null && q !== !1 && (q = Number(q.toFixed(ae))), M !== null && M !== !1 && (M = Number(M.toFixed(ae))), [M, q];
      }
      function Cr() {
        return Ne.map(_a);
      }
      function Lr(i, c) {
        var f = Wa(), O = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
        O.forEach(function(M) {
          i[M] !== void 0 && (L[M] = i[M]);
        });
        var q = ct(L);
        O.forEach(function(M) {
          i[M] !== void 0 && (r[M] = q[M]);
        }), Q = q.spectrum, r.margin = q.margin, r.limit = q.limit, r.padding = q.padding, r.pips ? Nt(r.pips) : dt(), r.tooltips ? Tt() : Ht(), we = [], ia(l(i.start) ? i.start : f, c);
      }
      function Ar() {
        z = Ye(me), ya(r.connect, z), Sr(r.events), ia(r.start), r.pips && Nt(r.pips), r.tooltips && Tt(), Wt();
      }
      Ar();
      var la = { destroy: Pr, steps: Cr, on: Oa, off: Gt, get: Wa, set: ia, setHandle: kr, reset: Er, __moveHandles: function(i, c, f) {
        za(i, c, we, f);
      }, options: L, updateOptions: Lr, target: me, removePips: dt, removeTooltips: Ht, getPositions: function() {
        return we.slice();
      }, getTooltips: function() {
        return xe;
      }, getOrigins: function() {
        return B;
      }, pips: Nt };
      return la;
    }
    function tt(o, r) {
      if (!o || !o.nodeName)
        throw new Error("noUiSlider: create requires a single element, got: " + o);
      if (o.noUiSlider)
        throw new Error("noUiSlider: Slider was already initialized.");
      var L = et(o, ct(r), r);
      return o.noUiSlider = L, L;
    }
    var Lt = { __spectrum: se, cssClasses: Y, create: tt };
    t.create = tt, t.cssClasses = Y, t.default = Lt, Object.defineProperty(t, "__esModule", { value: !0 });
  })(a);
}));
function tr(e, a) {
  if (!Array.isArray(e) || !Array.isArray(a))
    return !1;
  const t = a.slice().sort();
  return e.length === a.length && e.slice().sort().every(function(s, n) {
    return s === t[n];
  });
}
var Aa = { name: "Slider", emits: ["input", "update:modelValue", "start", "slide", "drag", "update", "change", "set", "end"], props: { value: { validator: function(e) {
  return (a) => typeof a == "number" || a instanceof Array || a == null || a === !1;
}, required: !1 }, modelValue: { validator: function(e) {
  return (a) => typeof a == "number" || a instanceof Array || a == null || a === !1;
}, required: !1 }, id: { type: [String, Number], required: !1 }, disabled: { type: Boolean, required: !1, default: !1 }, min: { type: Number, required: !1, default: 0 }, max: { type: Number, required: !1, default: 100 }, step: { type: Number, required: !1, default: 1 }, orientation: { type: String, required: !1, default: "horizontal" }, direction: { type: String, required: !1, default: "ltr" }, tooltips: { type: Boolean, required: !1, default: !0 }, options: { type: Object, required: !1, default: () => ({}) }, merge: { type: Number, required: !1, default: -1 }, format: { type: [Object, Function, Boolean], required: !1, default: null }, classes: { type: Object, required: !1, default: () => ({}) }, showTooltip: { type: String, required: !1, default: "always" }, tooltipPosition: { type: String, required: !1, default: null }, lazy: { type: Boolean, required: !1, default: !0 }, ariaLabelledby: { type: String, required: !1, default: void 0 }, aria: { required: !1, type: Object, default: () => ({}) } }, setup(e, a) {
  const t = function(l, d, p) {
    const { value: y, modelValue: v, min: x } = Me(l);
    let A = v && v.value !== void 0 ? v : y;
    const E = he(A.value);
    if (sa(A.value) && (A = he(x.value)), Array.isArray(A.value) && A.value.length == 0)
      throw new Error("Slider v-model must not be an empty array");
    return { value: A, initialValue: E };
  }(e), s = function(l, d, p) {
    const { classes: y, showTooltip: v, tooltipPosition: x, orientation: A } = Me(l), E = K(() => ({ target: "slider-target", focused: "slider-focused", tooltipFocus: "slider-tooltip-focus", tooltipDrag: "slider-tooltip-drag", ltr: "slider-ltr", rtl: "slider-rtl", horizontal: "slider-horizontal", vertical: "slider-vertical", textDirectionRtl: "slider-txt-dir-rtl", textDirectionLtr: "slider-txt-dir-ltr", base: "slider-base", connects: "slider-connects", connect: "slider-connect", origin: "slider-origin", handle: "slider-handle", handleLower: "slider-handle-lower", handleUpper: "slider-handle-upper", touchArea: "slider-touch-area", tooltip: "slider-tooltip", tooltipTop: "slider-tooltip-top", tooltipBottom: "slider-tooltip-bottom", tooltipLeft: "slider-tooltip-left", tooltipRight: "slider-tooltip-right", tooltipHidden: "slider-tooltip-hidden", active: "slider-active", draggable: "slider-draggable", tap: "slider-state-tap", drag: "slider-state-drag", pips: "slider-pips", pipsHorizontal: "slider-pips-horizontal", pipsVertical: "slider-pips-vertical", marker: "slider-marker", markerHorizontal: "slider-marker-horizontal", markerVertical: "slider-marker-vertical", markerNormal: "slider-marker-normal", markerLarge: "slider-marker-large", markerSub: "slider-marker-sub", value: "slider-value", valueHorizontal: "slider-value-horizontal", valueVertical: "slider-value-vertical", valueNormal: "slider-value-normal", valueLarge: "slider-value-large", valueSub: "slider-value-sub", ...y.value }));
    return { classList: K(() => {
      const g = { ...E.value };
      return Object.keys(g).forEach((w) => {
        g[w] = Array.isArray(g[w]) ? g[w].filter((S) => S !== null).join(" ") : g[w];
      }), v.value !== "always" && (g.target += ` ${v.value === "drag" ? g.tooltipDrag : g.tooltipFocus}`), A.value === "horizontal" && (g.tooltip += x.value === "bottom" ? ` ${g.tooltipBottom}` : ` ${g.tooltipTop}`), A.value === "vertical" && (g.tooltip += x.value === "right" ? ` ${g.tooltipRight}` : ` ${g.tooltipLeft}`), g;
    }) };
  }(e), n = function(l, d, p) {
    const { format: y, step: v } = Me(l), x = p.value, A = p.classList, E = K(() => y && y.value ? typeof y.value == "function" ? { to: y.value } : er({ ...y.value }) : er({ decimals: v.value >= 0 ? 0 : 2 })), g = K(() => Array.isArray(x.value) ? x.value.map((w) => E.value) : E.value);
    return { tooltipFormat: E, tooltipsFormat: g, tooltipsMerge: (w, S, k) => {
      var V = getComputedStyle(w).direction === "rtl", b = w.noUiSlider.options.direction === "rtl", D = w.noUiSlider.options.orientation === "vertical", R = w.noUiSlider.getTooltips(), P = w.noUiSlider.getOrigins();
      R.forEach(function(U, F) {
        U && P[F].appendChild(U);
      }), w.noUiSlider.on("update", function(U, F, T, J, X) {
        var N = [[]], H = [[]], ne = [[]], G = 0;
        R[0] && (N[0][0] = 0, H[0][0] = X[0], ne[0][0] = E.value.to(parseFloat(U[0])));
        for (var ee = 1; ee < U.length; ee++)
          (!R[ee] || U[ee] - U[ee - 1] > S) && (N[++G] = [], ne[G] = [], H[G] = []), R[ee] && (N[G].push(ee), ne[G].push(E.value.to(parseFloat(U[ee]))), H[G].push(X[ee]));
        N.forEach(function(se, Te) {
          for (var Y = se.length, Z = 0; Z < Y; Z++) {
            var te = se[Z];
            if (Z === Y - 1) {
              var pe = 0;
              H[Te].forEach(function(h) {
                pe += 1e3 - h;
              });
              var Le = D ? "bottom" : "right", ce = b ? 0 : Y - 1, _ = 1e3 - H[Te][ce];
              pe = (V && !D ? 100 : 0) + pe / Y - _, R[te].innerHTML = ne[Te].join(k), R[te].style.display = "block", R[te].style[Le] = pe + "%", A.value.tooltipHidden.split(" ").forEach((h) => {
                R[te].classList.contains(h) && R[te].classList.remove(h);
              });
            } else
              R[te].style.display = "none", A.value.tooltipHidden.split(" ").forEach((h) => {
                R[te].classList.add(h);
              });
          }
        });
      });
    } };
  }(e, 0, { value: t.value, classList: s.classList }), m = function(l, d, p) {
    const { orientation: y, direction: v, tooltips: x, step: A, min: E, max: g, merge: w, id: S, disabled: k, options: V, classes: b, format: D, lazy: R, ariaLabelledby: P, aria: U } = Me(l), F = p.value, T = p.initialValue, J = p.tooltipsFormat, X = p.tooltipsMerge, N = p.tooltipFormat, H = p.classList, ne = he(null), G = he(null), ee = he(!1), se = K(() => {
      let h = { cssPrefix: "", cssClasses: H.value, orientation: y.value, direction: v.value, tooltips: !!x.value && J.value, connect: "lower", start: sa(F.value) ? E.value : F.value, range: { min: E.value, max: g.value } };
      if (A.value > 0 && (h.step = A.value), Array.isArray(F.value) && (h.connect = !0), P && P.value || U && Object.keys(U.value).length) {
        let j = Array.isArray(F.value) ? F.value : [F.value];
        h.handleAttributes = j.map((be) => Object.assign({}, U.value, P && P.value ? { "aria-labelledby": P.value } : {}));
      }
      return D.value && (h.ariaFormat = N.value), h;
    }), Te = K(() => {
      let h = { id: S && S.value ? S.value : void 0 };
      return k.value && (h.disabled = !0), h;
    }), Y = K(() => Array.isArray(F.value)), Z = () => {
      let h = G.value.get();
      return Array.isArray(h) ? h.map((j) => parseFloat(j)) : parseFloat(h);
    }, te = function(h) {
      let j = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
      G.value.set(h, j);
    }, pe = (h) => {
      d.emit("input", h), d.emit("update:modelValue", h), d.emit("update", h);
    }, Le = () => {
      G.value = en.create(ne.value, Object.assign({}, se.value, V.value)), x.value && Y.value && w.value >= 0 && X(ne.value, w.value, " - "), G.value.on("set", () => {
        const h = Z();
        d.emit("change", h), d.emit("set", h), R.value && pe(h);
      }), G.value.on("update", () => {
        if (!ee.value)
          return;
        const h = Z();
        Y.value && tr(F.value, h) || !Y.value && F.value == h ? d.emit("update", h) : R.value || pe(h);
      }), G.value.on("start", () => {
        d.emit("start", Z());
      }), G.value.on("end", () => {
        d.emit("end", Z());
      }), G.value.on("slide", () => {
        d.emit("slide", Z());
      }), G.value.on("drag", () => {
        d.emit("drag", Z());
      }), ne.value.querySelectorAll("[data-handle]").forEach((h) => {
        h.onblur = () => {
          ne.value && H.value.focused.split(" ").forEach((j) => {
            ne.value.classList.remove(j);
          });
        }, h.onfocus = () => {
          H.value.focused.split(" ").forEach((j) => {
            ne.value.classList.add(j);
          });
        };
      }), ee.value = !0;
    }, ce = () => {
      G.value.off(), G.value.destroy(), G.value = null;
    }, _ = (h, j) => {
      ee.value = !1, ce(), Le();
    };
    return pa(Le), Tr(ce), ge(Y, _, { immediate: !1 }), ge(E, _, { immediate: !1 }), ge(g, _, { immediate: !1 }), ge(A, _, { immediate: !1 }), ge(y, _, { immediate: !1 }), ge(v, _, { immediate: !1 }), ge(x, _, { immediate: !1 }), ge(w, _, { immediate: !1 }), ge(D, _, { immediate: !1, deep: !0 }), ge(V, _, { immediate: !1, deep: !0 }), ge(b, _, { immediate: !1, deep: !0 }), ge(F, (h, j) => {
      j && (typeof j == "object" && typeof h == "object" && h && Object.keys(j) > Object.keys(h) || typeof j == "object" && typeof h != "object" || sa(h)) && _();
    }, { immediate: !1 }), ge(F, (h) => {
      if (sa(h))
        return void te(E.value, !1);
      let j = Z();
      Y.value && !Array.isArray(j) && (j = [j]), (Y.value && !tr(h, j) || !Y.value && h != j) && te(h, !1);
    }, { deep: !0 }), { slider: ne, slider$: G, isRange: Y, sliderProps: Te, init: Le, destroy: ce, refresh: _, update: te, reset: () => {
      pe(T.value);
    } };
  }(e, a, { value: t.value, initialValue: t.initialValue, tooltipFormat: n.tooltipFormat, tooltipsFormat: n.tooltipsFormat, tooltipsMerge: n.tooltipsMerge, classList: s.classList });
  return { ...s, ...n, ...m };
} };
Aa.render = function(e, a, t, s, n, m) {
  return re(), ie("div", ua(e.sliderProps, { ref: "slider" }), null, 16);
}, Aa.__file = "src/Slider.vue";
function rt(e) {
  return [null, void 0].indexOf(e) !== -1;
}
function tn(e, a, t) {
  const { object: s, valueProp: n, mode: m } = Me(e), l = Zt().proxy, d = t.iv, p = (x, A = !0) => {
    d.value = v(x);
    const E = y(x);
    a.emit("change", E, l), A && (a.emit("input", E), a.emit("update:modelValue", E));
  }, y = (x) => s.value || rt(x) ? x : Array.isArray(x) ? x.map((A) => A[n.value]) : x[n.value], v = (x) => rt(x) ? m.value === "single" ? {} : [] : x;
  return {
    update: p
  };
}
function an(e, a) {
  const { value: t, modelValue: s, mode: n, valueProp: m } = Me(e), l = he(n.value !== "single" ? [] : {}), d = K(() => s && s.value !== void 0 ? s.value : t.value), p = K(() => n.value === "single" ? l.value[m.value] : l.value.map((v) => v[m.value])), y = K(() => n.value !== "single" ? l.value.map((v) => v[m.value]).join(",") : l.value[m.value]);
  return {
    iv: l,
    internalValue: l,
    ev: d,
    externalValue: d,
    textValue: y,
    plainValue: p
  };
}
function rn(e, a, t) {
  const { regex: s } = Me(e), n = Zt().proxy, m = t.isOpen, l = t.open, d = he(null), p = () => {
    d.value = "";
  }, y = (A) => {
    d.value = A.target.value;
  }, v = (A) => {
    if (s && s.value) {
      let E = s.value;
      typeof E == "string" && (E = new RegExp(E)), A.key.match(E) || A.preventDefault();
    }
  }, x = (A) => {
    if (s && s.value) {
      let g = (A.clipboardData || /* istanbul ignore next */
      window.clipboardData).getData("Text"), w = s.value;
      typeof w == "string" && (w = new RegExp(w)), g.split("").every((S) => !!S.match(w)) || A.preventDefault();
    }
    a.emit("paste", A, n);
  };
  return ge(d, (A) => {
    !m.value && A && l(), a.emit("search-change", A, n);
  }), {
    search: d,
    clearSearch: p,
    handleSearchInput: y,
    handleKeypress: v,
    handlePaste: x
  };
}
function nn(e, a, t) {
  const { groupSelect: s, mode: n, groups: m, disabledProp: l } = Me(e), d = he(null), p = (v) => {
    v === void 0 || v !== null && v[l.value] || m.value && v && v.group && (n.value === "single" || !s.value) || (d.value = v);
  };
  return {
    pointer: d,
    setPointer: p,
    clearPointer: () => {
      p(null);
    }
  };
}
function Ca(e, a = !0) {
  return a ? String(e).toLowerCase().trim() : String(e).toLowerCase().normalize("NFD").trim().replace(new RegExp(/æ/g), "ae").replace(new RegExp(/œ/g), "oe").replace(new RegExp(/ø/g), "o").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function ln(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function sn(e, a) {
  const t = a.slice().sort();
  return e.length === a.length && e.slice().sort().every(function(s, n) {
    return s === t[n];
  });
}
function on(e, a, t) {
  const {
    options: s,
    mode: n,
    trackBy: m,
    limit: l,
    hideSelected: d,
    createTag: p,
    createOption: y,
    label: v,
    appendNewTag: x,
    appendNewOption: A,
    multipleLabel: E,
    object: g,
    loading: w,
    delay: S,
    resolveOnLoad: k,
    minChars: V,
    filterResults: b,
    clearOnSearch: D,
    clearOnSelect: R,
    valueProp: P,
    allowAbsent: U,
    groupLabel: F,
    canDeselect: T,
    max: J,
    strict: X,
    closeOnSelect: N,
    closeOnDeselect: H,
    groups: ne,
    reverse: G,
    infinite: ee,
    groupOptions: se,
    groupHideEmpty: Te,
    groupSelect: Y,
    onCreate: Z,
    disabledProp: te,
    searchStart: pe,
    searchFilter: Le
  } = Me(e), ce = Zt().proxy, _ = t.iv, h = t.ev, j = t.search, be = t.clearSearch, Re = t.update, gt = t.pointer, bt = t.setPointer, Ke = t.clearPointer, kt = t.focus, Ft = t.deactivate, Qe = t.close, Pt = t.localize, Ze = he([]), _e = he([]), qe = he(!1), ze = he(null), Xe = he(ee.value && l.value === -1 ? 10 : l.value), yt = K(() => p.value || y.value || !1), Ct = K(() => x.value !== void 0 ? x.value : A.value !== void 0 ? A.value : !0), Ie = K(() => {
    if (ne.value) {
      let u = tt.value || /* istanbul ignore next */
      [], C = [];
      return u.forEach((le) => {
        Wt(le[se.value]).forEach((Se) => {
          C.push(Object.assign({}, Se, le[te.value] ? { [te.value]: !0 } : {}));
        });
      }), C;
    } else {
      let u = Wt(_e.value || /* istanbul ignore next */
      []);
      return Ze.value.length && (u = u.concat(Ze.value)), u;
    }
  }), ct = K(() => {
    let u = Ie.value;
    return G.value && (u = u.reverse()), W.value.length && (u = W.value.concat(u)), Tt(u);
  }), et = K(() => {
    let u = ct.value;
    return Xe.value > 0 && (u = u.slice(0, Xe.value)), u;
  }), tt = K(() => {
    if (!ne.value)
      return [];
    let u = [], C = _e.value || /* istanbul ignore next */
    [];
    return Ze.value.length && u.push({
      [F.value]: " ",
      [se.value]: [...Ze.value],
      __CREATE__: !0
    }), u.concat(C);
  }), Lt = K(() => {
    let u = [...tt.value].map((C) => ({ ...C }));
    return W.value.length && (u[0] && u[0].__CREATE__ ? u[0][se.value] = [...W.value, ...u[0][se.value]] : u = [{
      [F.value]: " ",
      [se.value]: [...W.value],
      __CREATE__: !0
    }].concat(u)), u;
  }), o = K(() => {
    if (!ne.value)
      return [];
    let u = Lt.value;
    return Ht((u || /* istanbul ignore next */
    []).map((C, le) => {
      const Se = Wt(C[se.value]);
      return {
        ...C,
        index: le,
        group: !0,
        [se.value]: Tt(Se, !1).map((lt) => Object.assign({}, lt, C[te.value] ? { [te.value]: !0 } : {})),
        __VISIBLE__: Tt(Se).map((lt) => Object.assign({}, lt, C[te.value] ? { [te.value]: !0 } : {}))
      };
    }));
  }), r = K(() => {
    switch (n.value) {
      case "single":
        return !rt(_.value[P.value]);
      case "multiple":
      case "tags":
        return !rt(_.value) && _.value.length > 0;
    }
  }), L = K(() => E !== void 0 && E.value !== void 0 ? E.value(_.value, ce) : _.value && _.value.length > 1 ? `${_.value.length} options selected` : "1 option selected"), z = K(() => !Ie.value.length && !qe.value && !W.value.length), B = K(() => Ie.value.length > 0 && et.value.length == 0 && (j.value && ne.value || !ne.value)), W = K(() => yt.value === !1 || !j.value ? [] : wa(j.value) !== -1 ? [] : [{
    [P.value]: j.value,
    [ue.value[0]]: j.value,
    [v.value]: j.value,
    __CREATE__: !0
  }]), ue = K(() => m.value ? Array.isArray(m.value) ? m.value : [m.value] : [v.value]), xe = K(() => {
    switch (n.value) {
      case "single":
        return null;
      case "multiple":
      case "tags":
        return [];
    }
  }), ye = K(() => w.value || qe.value), Ve = (u) => {
    switch (typeof u != "object" && (u = Ye(u)), n.value) {
      case "single":
        Re(u);
        break;
      case "multiple":
      case "tags":
        Re(_.value.concat(u));
        break;
    }
    a.emit("select", Q(u), u, ce);
  }, me = (u) => {
    switch (typeof u != "object" && (u = Ye(u)), n.value) {
      case "single":
        Ne();
        break;
      case "tags":
      case "multiple":
        Re(Array.isArray(u) ? _.value.filter((C) => u.map((le) => le[P.value]).indexOf(C[P.value]) === -1) : _.value.filter((C) => C[P.value] != u[P.value]));
        break;
    }
    a.emit("deselect", Q(u), u, ce);
  }, Q = (u) => g.value ? u : u[P.value], $e = (u) => {
    me(u);
  }, we = (u, C) => {
    if (C.button !== 0) {
      C.preventDefault();
      return;
    }
    $e(u);
  }, Ne = () => {
    Re(xe.value), a.emit("clear", ce);
  }, Fe = (u) => {
    if (u.group !== void 0)
      return n.value === "single" ? !1 : ya(u[se.value]) && u[se.value].length;
    switch (n.value) {
      case "single":
        return !rt(_.value) && _.value[P.value] == u[P.value];
      case "tags":
      case "multiple":
        return !rt(_.value) && _.value.map((C) => C[P.value]).indexOf(u[P.value]) !== -1;
    }
  }, Ue = (u) => u[te.value] === !0, at = () => J === void 0 || J.value === -1 || !r.value && J.value > 0 ? !1 : _.value.length >= J.value, At = (u) => {
    if (!Ue(u)) {
      if (Z && Z.value && !Fe(u) && u.__CREATE__ && (u = { ...u }, delete u.__CREATE__, u = Z.value(u, ce), u instanceof Promise)) {
        qe.value = !0, u.then((C) => {
          qe.value = !1, wt(C);
        });
        return;
      }
      wt(u);
    }
  }, wt = (u) => {
    switch (u.__CREATE__ && (u = { ...u }, delete u.__CREATE__), n.value) {
      case "single":
        if (u && Fe(u)) {
          T.value && me(u), H.value && (Ke(), Qe());
          return;
        }
        u && He(u), R.value && be(), N.value && (Ke(), Qe()), u && Ve(u);
        break;
      case "multiple":
        if (u && Fe(u)) {
          me(u), H.value && (Ke(), Qe());
          return;
        }
        if (at()) {
          a.emit("max", ce);
          return;
        }
        u && (He(u), Ve(u)), R.value && be(), d.value && Ke(), N.value && Qe();
        break;
      case "tags":
        if (u && Fe(u)) {
          me(u), H.value && (Ke(), Qe());
          return;
        }
        if (at()) {
          a.emit("max", ce);
          return;
        }
        u && He(u), R.value && be(), u && Ve(u), d.value && Ke(), N.value && Qe();
        break;
    }
    N.value || kt();
  }, ga = (u) => {
    if (!(Ue(u) || n.value === "single" || !Y.value)) {
      switch (n.value) {
        case "multiple":
        case "tags":
          ta(u[se.value]) ? me(u[se.value]) : Ve(
            u[se.value].filter((C) => _.value.map((le) => le[P.value]).indexOf(C[P.value]) === -1).filter((C) => !C[te.value]).filter((C, le) => _.value.length + 1 + le <= J.value || J.value === -1)
          ), d.value && gt.value && bt(o.value.filter((C) => !C[te.value])[gt.value.index]);
          break;
      }
      N.value && Ft();
    }
  }, He = (u) => {
    Ye(u[P.value]) === void 0 && yt.value && (a.emit("tag", u[P.value], ce), a.emit("option", u[P.value], ce), a.emit("create", u[P.value], ce), Ct.value && Ut(u), be());
  }, ba = () => {
    n.value !== "single" && Ve(et.value.filter((u) => !u.disabled && !Fe(u)));
  }, ta = (u) => u.find((C) => !Fe(C) && !C[te.value]) === void 0, ya = (u) => u.find((C) => !Fe(C)) === void 0, Ye = (u) => Ie.value[Ie.value.map((C) => String(C[P.value])).indexOf(String(u))], wa = (u) => Ie.value.findIndex((C) => ue.value.some((le) => (parseInt(C[le]) == C[le] ? parseInt(C[le]) : C[le]) === (parseInt(u) == u ? parseInt(u) : u))), aa = (u) => ["tags", "multiple"].indexOf(n.value) !== -1 && d.value && Fe(u), Ut = (u) => {
    Ze.value.push(u);
  }, Ht = (u) => Te.value ? u.filter(
    (C) => j.value ? C.__VISIBLE__.length : C[se.value].length
  ) : u.filter((C) => j.value ? C.__VISIBLE__.length : !0), Tt = (u, C = !0) => {
    let le = u;
    if (j.value && b.value) {
      let Se = Le.value;
      Se || (Se = (lt, ra, Ia) => ue.value.some(($t) => {
        let Bt = Ca(Pt(lt[$t]), X.value);
        return pe.value ? Bt.startsWith(Ca(ra, X.value)) : Bt.indexOf(Ca(ra, X.value)) !== -1;
      })), le = le.filter((lt) => Se(lt, j.value, ce));
    }
    return d.value && C && (le = le.filter((Se) => !aa(Se))), le;
  }, Wt = (u) => {
    let C = u;
    return ln(C) && (C = Object.keys(C).map((le) => {
      let Se = C[le];
      return { [P.value]: le, [ue.value[0]]: Se, [v.value]: Se };
    })), C = C.map((le) => typeof le == "object" ? le : { [P.value]: le, [ue.value[0]]: le, [v.value]: le }), C;
  }, Dt = () => {
    rt(h.value) || (_.value = dt(h.value));
  }, St = (u) => (qe.value = !0, new Promise((C, le) => {
    s.value(j.value, ce).then((Se) => {
      _e.value = Se || [], typeof u == "function" && u(Se), qe.value = !1;
    }).catch((Se) => {
      console.error(Se), _e.value = [], qe.value = !1;
    }).finally(() => {
      C();
    });
  })), _t = () => {
    if (r.value)
      if (n.value === "single") {
        let u = Ye(_.value[P.value]);
        if (u !== void 0) {
          let C = u[v.value];
          _.value[v.value] = C, g.value && (h.value[v.value] = C);
        }
      } else
        _.value.forEach((u, C) => {
          let le = Ye(_.value[C][P.value]);
          if (le !== void 0) {
            let Se = le[v.value];
            _.value[C][v.value] = Se, g.value && (h.value[C][v.value] = Se);
          }
        });
  }, Sa = (u) => {
    St(u);
  }, dt = (u) => rt(u) ? n.value === "single" ? {} : [] : g.value ? u : n.value === "single" ? Ye(u) || (U.value ? {
    [v.value]: u,
    [P.value]: u,
    [ue.value[0]]: u
  } : {}) : u.filter((C) => !!Ye(C) || U.value).map((C) => Ye(C) || {
    [v.value]: C,
    [P.value]: C,
    [ue.value[0]]: C
  }), Nt = () => {
    ze.value = ge(j, (u) => {
      u.length < V.value || !u && V.value !== 0 || (qe.value = !0, D.value && (_e.value = []), setTimeout(() => {
        u == j.value && s.value(j.value, ce).then((C) => {
          (u == j.value || !j.value) && (_e.value = C, gt.value = et.value.filter((le) => le[te.value] !== !0)[0] || null, qe.value = !1);
        }).catch(
          /* istanbul ignore next */
          (C) => {
            console.error(C);
          }
        );
      }, S.value));
    }, { flush: "sync" });
  };
  if (n.value !== "single" && !rt(h.value) && !Array.isArray(h.value))
    throw new Error(`v-model must be an array when using "${n.value}" mode`);
  return s && typeof s.value == "function" ? k.value ? St(Dt) : g.value == !0 && Dt() : (_e.value = s.value, Dt()), S.value > -1 && Nt(), ge(S, (u, C) => {
    ze.value && ze.value(), u >= 0 && Nt();
  }), ge(h, (u) => {
    if (rt(u)) {
      Re(dt(u), !1);
      return;
    }
    switch (n.value) {
      case "single":
        (g.value ? u[P.value] != _.value[P.value] : u != _.value[P.value]) && Re(dt(u), !1);
        break;
      case "multiple":
      case "tags":
        sn(g.value ? u.map((C) => C[P.value]) : u, _.value.map((C) => C[P.value])) || Re(dt(u), !1);
        break;
    }
  }, { deep: !0 }), ge(s, (u, C) => {
    typeof e.options == "function" ? k.value && (!C || u && u.toString() !== C.toString()) && St() : (_e.value = e.options, Object.keys(_.value).length || Dt(), _t());
  }), ge(v, _t), ge(l, (u, C) => {
    Xe.value = ee.value && u === -1 ? 10 : u;
  }), {
    pfo: ct,
    fo: et,
    filteredOptions: et,
    hasSelected: r,
    multipleLabelText: L,
    eo: Ie,
    extendedOptions: Ie,
    eg: tt,
    extendedGroups: tt,
    fg: o,
    filteredGroups: o,
    noOptions: z,
    noResults: B,
    resolving: qe,
    busy: ye,
    offset: Xe,
    select: Ve,
    deselect: me,
    remove: $e,
    selectAll: ba,
    clear: Ne,
    isSelected: Fe,
    isDisabled: Ue,
    isMax: at,
    getOption: Ye,
    handleOptionClick: At,
    handleGroupClick: ga,
    handleTagRemove: we,
    refreshOptions: Sa,
    resolveOptions: St,
    refreshLabels: _t
  };
}
function un(e, a, t) {
  const {
    valueProp: s,
    showOptions: n,
    searchable: m,
    groupLabel: l,
    groups: d,
    mode: p,
    groupSelect: y,
    disabledProp: v,
    groupOptions: x
  } = Me(e), A = t.fo, E = t.fg, g = t.handleOptionClick, w = t.handleGroupClick, S = t.search, k = t.pointer, V = t.setPointer, b = t.clearPointer, D = t.multiselect, R = t.isOpen, P = K(() => A.value.filter((h) => !h[v.value])), U = K(() => E.value.filter((h) => !h[v.value])), F = K(() => p.value !== "single" && y.value), T = K(() => k.value && k.value.group), J = K(() => ce(k.value)), X = K(() => {
    const h = T.value ? k.value : (
      /* istanbul ignore next */
      ce(k.value)
    ), j = U.value.map((Re) => Re[l.value]).indexOf(h[l.value]);
    let be = U.value[j - 1];
    return be === void 0 && (be = H.value), be;
  }), N = K(() => {
    let h = U.value.map((j) => j.label).indexOf(T.value ? k.value[l.value] : ce(k.value)[l.value]) + 1;
    return U.value.length <= h && (h = 0), U.value[h];
  }), H = K(() => [...U.value].slice(-1)[0]), ne = K(() => k.value.__VISIBLE__.filter((h) => !h[v.value])[0]), G = K(() => {
    const h = J.value.__VISIBLE__.filter((j) => !j[v.value]);
    return h[h.map((j) => j[s.value]).indexOf(k.value[s.value]) - 1];
  }), ee = K(() => {
    const h = ce(k.value).__VISIBLE__.filter((j) => !j[v.value]);
    return h[h.map((j) => j[s.value]).indexOf(k.value[s.value]) + 1];
  }), se = K(() => [...X.value.__VISIBLE__.filter((h) => !h[v.value])].slice(-1)[0]), Te = K(() => [...H.value.__VISIBLE__.filter((h) => !h[v.value])].slice(-1)[0]), Y = (h) => k.value && (!h.group && k.value[s.value] === h[s.value] || h.group !== void 0 && k.value[l.value] === h[l.value]) ? !0 : void 0, Z = () => {
    V(P.value[0] || null);
  }, te = () => {
    !k.value || k.value[v.value] === !0 || (T.value ? w(k.value) : g(k.value));
  }, pe = () => {
    if (k.value === null)
      V((d.value && F.value ? U.value[0].__CREATE__ ? P.value[0] : U.value[0] : P.value[0]) || null);
    else if (d.value && F.value) {
      let h = T.value ? ne.value : ee.value;
      h === void 0 && (h = N.value, h.__CREATE__ && (h = h[x.value][0])), V(h || /* istanbul ignore next */
      null);
    } else {
      let h = P.value.map((j) => j[s.value]).indexOf(k.value[s.value]) + 1;
      P.value.length <= h && (h = 0), V(P.value[h] || null);
    }
    Yt(() => {
      _();
    });
  }, Le = () => {
    if (k.value === null) {
      let h = P.value[P.value.length - 1];
      d.value && F.value && (h = Te.value, h === void 0 && (h = H.value)), V(h || null);
    } else if (d.value && F.value) {
      let h = T.value ? se.value : G.value;
      h === void 0 && (h = T.value ? X.value : J.value, h.__CREATE__ && (h = se.value, h === void 0 && (h = X.value))), V(h || /* istanbul ignore next */
      null);
    } else {
      let h = P.value.map((j) => j[s.value]).indexOf(k.value[s.value]) - 1;
      h < 0 && (h = P.value.length - 1), V(P.value[h] || null);
    }
    Yt(() => {
      _();
    });
  }, ce = (h) => U.value.find((j) => j.__VISIBLE__.map((be) => be[s.value]).indexOf(h[s.value]) !== -1), _ = () => {
    let h = D.value.querySelector("[data-pointed]");
    if (!h)
      return;
    let j = h.parentElement.parentElement;
    d.value && (j = T.value ? h.parentElement.parentElement.parentElement : h.parentElement.parentElement.parentElement.parentElement), h.offsetTop + h.offsetHeight > j.clientHeight + j.scrollTop && (j.scrollTop = h.offsetTop + h.offsetHeight - j.clientHeight), h.offsetTop < j.scrollTop && (j.scrollTop = h.offsetTop);
  };
  return ge(S, (h) => {
    m.value && (h.length && n.value ? Z() : b());
  }), ge(R, (h) => {
    if (h && (D != null && D.value)) {
      let j = D.value.querySelectorAll("[data-selected]")[0];
      if (!j)
        return;
      let be = j.parentElement.parentElement;
      Yt(() => {
        be.scrollTop > 0 || (be.scrollTop = j.offsetTop);
      });
    }
  }), {
    pointer: k,
    canPointGroups: F,
    isPointed: Y,
    setPointerFirst: Z,
    selectPointer: te,
    forwardPointer: pe,
    backwardPointer: Le
  };
}
function We(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var a = e.ownerDocument;
    return a && a.defaultView || window;
  }
  return e;
}
function Et(e) {
  var a = We(e).Element;
  return e instanceof a || e instanceof Element;
}
function Ge(e) {
  var a = We(e).HTMLElement;
  return e instanceof a || e instanceof HTMLElement;
}
function Na(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  var a = We(e).ShadowRoot;
  return e instanceof a || e instanceof ShadowRoot;
}
var xt = Math.max, fa = Math.min, jt = Math.round;
function Ta() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(a) {
    return a.brand + "/" + a.version;
  }).join(" ") : navigator.userAgent;
}
function dr() {
  return !/^((?!chrome|android).)*safari/i.test(Ta());
}
function qt(e, a, t) {
  a === void 0 && (a = !1), t === void 0 && (t = !1);
  var s = e.getBoundingClientRect(), n = 1, m = 1;
  a && Ge(e) && (n = e.offsetWidth > 0 && jt(s.width) / e.offsetWidth || 1, m = e.offsetHeight > 0 && jt(s.height) / e.offsetHeight || 1);
  var l = Et(e) ? We(e) : window, d = l.visualViewport, p = !dr() && t, y = (s.left + (p && d ? d.offsetLeft : 0)) / n, v = (s.top + (p && d ? d.offsetTop : 0)) / m, x = s.width / n, A = s.height / m;
  return {
    width: x,
    height: A,
    top: v,
    right: y + x,
    bottom: v + A,
    left: y,
    x: y,
    y: v
  };
}
function Ba(e) {
  var a = We(e), t = a.pageXOffset, s = a.pageYOffset;
  return {
    scrollLeft: t,
    scrollTop: s
  };
}
function cn(e) {
  return {
    scrollLeft: e.scrollLeft,
    scrollTop: e.scrollTop
  };
}
function dn(e) {
  return e === We(e) || !Ge(e) ? Ba(e) : cn(e);
}
function nt(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function mt(e) {
  return ((Et(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
function Ma(e) {
  return qt(mt(e)).left + Ba(e).scrollLeft;
}
function ut(e) {
  return We(e).getComputedStyle(e);
}
function Va(e) {
  var a = ut(e), t = a.overflow, s = a.overflowX, n = a.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + n + s);
}
function fn(e) {
  var a = e.getBoundingClientRect(), t = jt(a.width) / e.offsetWidth || 1, s = jt(a.height) / e.offsetHeight || 1;
  return t !== 1 || s !== 1;
}
function pn(e, a, t) {
  t === void 0 && (t = !1);
  var s = Ge(a), n = Ge(a) && fn(a), m = mt(a), l = qt(e, n, t), d = {
    scrollLeft: 0,
    scrollTop: 0
  }, p = {
    x: 0,
    y: 0
  };
  return (s || !s && !t) && ((nt(a) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Va(m)) && (d = dn(a)), Ge(a) ? (p = qt(a, !0), p.x += a.clientLeft, p.y += a.clientTop) : m && (p.x = Ma(m))), {
    x: l.left + d.scrollLeft - p.x,
    y: l.top + d.scrollTop - p.y,
    width: l.width,
    height: l.height
  };
}
function fr(e) {
  var a = qt(e), t = e.offsetWidth, s = e.offsetHeight;
  return Math.abs(a.width - t) <= 1 && (t = a.width), Math.abs(a.height - s) <= 1 && (s = a.height), {
    x: e.offsetLeft,
    y: e.offsetTop,
    width: t,
    height: s
  };
}
function va(e) {
  return nt(e) === "html" ? e : (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    e.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    e.parentNode || // DOM Element detected
    (Na(e) ? e.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    mt(e)
  );
}
function pr(e) {
  return ["html", "body", "#document"].indexOf(nt(e)) >= 0 ? e.ownerDocument.body : Ge(e) && Va(e) ? e : pr(va(e));
}
function Jt(e, a) {
  var t;
  a === void 0 && (a = []);
  var s = pr(e), n = s === ((t = e.ownerDocument) == null ? void 0 : t.body), m = We(s), l = n ? [m].concat(m.visualViewport || [], Va(s) ? s : []) : s, d = a.concat(l);
  return n ? d : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    d.concat(Jt(va(l)))
  );
}
function vn(e) {
  return ["table", "td", "th"].indexOf(nt(e)) >= 0;
}
function ar(e) {
  return !Ge(e) || // https://github.com/popperjs/popper-core/issues/837
  ut(e).position === "fixed" ? null : e.offsetParent;
}
function hn(e) {
  var a = /firefox/i.test(Ta()), t = /Trident/i.test(Ta());
  if (t && Ge(e)) {
    var s = ut(e);
    if (s.position === "fixed")
      return null;
  }
  var n = va(e);
  for (Na(n) && (n = n.host); Ge(n) && ["html", "body"].indexOf(nt(n)) < 0; ) {
    var m = ut(n);
    if (m.transform !== "none" || m.perspective !== "none" || m.contain === "paint" || ["transform", "perspective"].indexOf(m.willChange) !== -1 || a && m.willChange === "filter" || a && m.filter && m.filter !== "none")
      return n;
    n = n.parentNode;
  }
  return null;
}
function ha(e) {
  for (var a = We(e), t = ar(e); t && vn(t) && ut(t).position === "static"; )
    t = ar(t);
  return t && (nt(t) === "html" || nt(t) === "body" && ut(t).position === "static") ? a : t || hn(e) || a;
}
var Je = "top", it = "bottom", ht = "right", ot = "left", Ra = "auto", ma = [Je, it, ht, ot], It = "start", Qt = "end", mn = "clippingParents", vr = "viewport", Xt = "popper", gn = "reference", rr = /* @__PURE__ */ ma.reduce(function(e, a) {
  return e.concat([a + "-" + It, a + "-" + Qt]);
}, []), bn = /* @__PURE__ */ [].concat(ma, [Ra]).reduce(function(e, a) {
  return e.concat([a, a + "-" + It, a + "-" + Qt]);
}, []), yn = "beforeRead", wn = "read", Sn = "afterRead", On = "beforeMain", xn = "main", En = "afterMain", kn = "beforeWrite", Pn = "write", Cn = "afterWrite", Ln = [yn, wn, Sn, On, xn, En, kn, Pn, Cn];
function An(e) {
  var a = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), s = [];
  e.forEach(function(m) {
    a.set(m.name, m);
  });
  function n(m) {
    t.add(m.name);
    var l = [].concat(m.requires || [], m.requiresIfExists || []);
    l.forEach(function(d) {
      if (!t.has(d)) {
        var p = a.get(d);
        p && n(p);
      }
    }), s.push(m);
  }
  return e.forEach(function(m) {
    t.has(m.name) || n(m);
  }), s;
}
function Tn(e) {
  var a = An(e);
  return Ln.reduce(function(t, s) {
    return t.concat(a.filter(function(n) {
      return n.phase === s;
    }));
  }, []);
}
function Dn(e) {
  var a;
  return function() {
    return a || (a = new Promise(function(t) {
      Promise.resolve().then(function() {
        a = void 0, t(e());
      });
    })), a;
  };
}
function Nn(e) {
  var a = e.reduce(function(t, s) {
    var n = t[s.name];
    return t[s.name] = n ? Object.assign({}, n, s, {
      options: Object.assign({}, n.options, s.options),
      data: Object.assign({}, n.data, s.data)
    }) : s, t;
  }, {});
  return Object.keys(a).map(function(t) {
    return a[t];
  });
}
function Bn(e, a) {
  var t = We(e), s = mt(e), n = t.visualViewport, m = s.clientWidth, l = s.clientHeight, d = 0, p = 0;
  if (n) {
    m = n.width, l = n.height;
    var y = dr();
    (y || !y && a === "fixed") && (d = n.offsetLeft, p = n.offsetTop);
  }
  return {
    width: m,
    height: l,
    x: d + Ma(e),
    y: p
  };
}
function Mn(e) {
  var a, t = mt(e), s = Ba(e), n = (a = e.ownerDocument) == null ? void 0 : a.body, m = xt(t.scrollWidth, t.clientWidth, n ? n.scrollWidth : 0, n ? n.clientWidth : 0), l = xt(t.scrollHeight, t.clientHeight, n ? n.scrollHeight : 0, n ? n.clientHeight : 0), d = -s.scrollLeft + Ma(e), p = -s.scrollTop;
  return ut(n || t).direction === "rtl" && (d += xt(t.clientWidth, n ? n.clientWidth : 0) - m), {
    width: m,
    height: l,
    x: d,
    y: p
  };
}
function Vn(e, a) {
  var t = a.getRootNode && a.getRootNode();
  if (e.contains(a))
    return !0;
  if (t && Na(t)) {
    var s = a;
    do {
      if (s && e.isSameNode(s))
        return !0;
      s = s.parentNode || s.host;
    } while (s);
  }
  return !1;
}
function Da(e) {
  return Object.assign({}, e, {
    left: e.x,
    top: e.y,
    right: e.x + e.width,
    bottom: e.y + e.height
  });
}
function Rn(e, a) {
  var t = qt(e, !1, a === "fixed");
  return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t;
}
function nr(e, a, t) {
  return a === vr ? Da(Bn(e, t)) : Et(a) ? Rn(a, t) : Da(Mn(mt(e)));
}
function jn(e) {
  var a = Jt(va(e)), t = ["absolute", "fixed"].indexOf(ut(e).position) >= 0, s = t && Ge(e) ? ha(e) : e;
  return Et(s) ? a.filter(function(n) {
    return Et(n) && Vn(n, s) && nt(n) !== "body";
  }) : [];
}
function qn(e, a, t, s) {
  var n = a === "clippingParents" ? jn(e) : [].concat(a), m = [].concat(n, [t]), l = m[0], d = m.reduce(function(p, y) {
    var v = nr(e, y, s);
    return p.top = xt(v.top, p.top), p.right = fa(v.right, p.right), p.bottom = fa(v.bottom, p.bottom), p.left = xt(v.left, p.left), p;
  }, nr(e, l, s));
  return d.width = d.right - d.left, d.height = d.bottom - d.top, d.x = d.left, d.y = d.top, d;
}
function vt(e) {
  return e.split("-")[0];
}
function zt(e) {
  return e.split("-")[1];
}
function hr(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function mr(e) {
  var a = e.reference, t = e.element, s = e.placement, n = s ? vt(s) : null, m = s ? zt(s) : null, l = a.x + a.width / 2 - t.width / 2, d = a.y + a.height / 2 - t.height / 2, p;
  switch (n) {
    case Je:
      p = {
        x: l,
        y: a.y - t.height
      };
      break;
    case it:
      p = {
        x: l,
        y: a.y + a.height
      };
      break;
    case ht:
      p = {
        x: a.x + a.width,
        y: d
      };
      break;
    case ot:
      p = {
        x: a.x - t.width,
        y: d
      };
      break;
    default:
      p = {
        x: a.x,
        y: a.y
      };
  }
  var y = n ? hr(n) : null;
  if (y != null) {
    var v = y === "y" ? "height" : "width";
    switch (m) {
      case It:
        p[y] = p[y] - (a[v] / 2 - t[v] / 2);
        break;
      case Qt:
        p[y] = p[y] + (a[v] / 2 - t[v] / 2);
        break;
    }
  }
  return p;
}
function gr() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function In(e) {
  return Object.assign({}, gr(), e);
}
function zn(e, a) {
  return a.reduce(function(t, s) {
    return t[s] = e, t;
  }, {});
}
function ja(e, a) {
  a === void 0 && (a = {});
  var t = a, s = t.placement, n = s === void 0 ? e.placement : s, m = t.strategy, l = m === void 0 ? e.strategy : m, d = t.boundary, p = d === void 0 ? mn : d, y = t.rootBoundary, v = y === void 0 ? vr : y, x = t.elementContext, A = x === void 0 ? Xt : x, E = t.altBoundary, g = E === void 0 ? !1 : E, w = t.padding, S = w === void 0 ? 0 : w, k = In(typeof S != "number" ? S : zn(S, ma)), V = A === Xt ? gn : Xt, b = e.rects.popper, D = e.elements[g ? V : A], R = qn(Et(D) ? D : D.contextElement || mt(e.elements.popper), p, v, l), P = qt(e.elements.reference), U = mr({
    reference: P,
    element: b,
    strategy: "absolute",
    placement: n
  }), F = Da(Object.assign({}, b, U)), T = A === Xt ? F : P, J = {
    top: R.top - T.top + k.top,
    bottom: T.bottom - R.bottom + k.bottom,
    left: R.left - T.left + k.left,
    right: T.right - R.right + k.right
  }, X = e.modifiersData.offset;
  if (A === Xt && X) {
    var N = X[n];
    Object.keys(J).forEach(function(H) {
      var ne = [ht, it].indexOf(H) >= 0 ? 1 : -1, G = [Je, it].indexOf(H) >= 0 ? "y" : "x";
      J[H] += N[G] * ne;
    });
  }
  return J;
}
var ir = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function lr() {
  for (var e = arguments.length, a = new Array(e), t = 0; t < e; t++)
    a[t] = arguments[t];
  return !a.some(function(s) {
    return !(s && typeof s.getBoundingClientRect == "function");
  });
}
function Fn(e) {
  e === void 0 && (e = {});
  var a = e, t = a.defaultModifiers, s = t === void 0 ? [] : t, n = a.defaultOptions, m = n === void 0 ? ir : n;
  return function(d, p, y) {
    y === void 0 && (y = m);
    var v = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, ir, m),
      modifiersData: {},
      elements: {
        reference: d,
        popper: p
      },
      attributes: {},
      styles: {}
    }, x = [], A = !1, E = {
      state: v,
      setOptions: function(k) {
        var V = typeof k == "function" ? k(v.options) : k;
        w(), v.options = Object.assign({}, m, v.options, V), v.scrollParents = {
          reference: Et(d) ? Jt(d) : d.contextElement ? Jt(d.contextElement) : [],
          popper: Jt(p)
        };
        var b = Tn(Nn([].concat(s, v.options.modifiers)));
        return v.orderedModifiers = b.filter(function(D) {
          return D.enabled;
        }), g(), E.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!A) {
          var k = v.elements, V = k.reference, b = k.popper;
          if (lr(V, b)) {
            v.rects = {
              reference: pn(V, ha(b), v.options.strategy === "fixed"),
              popper: fr(b)
            }, v.reset = !1, v.placement = v.options.placement, v.orderedModifiers.forEach(function(J) {
              return v.modifiersData[J.name] = Object.assign({}, J.data);
            });
            for (var D = 0; D < v.orderedModifiers.length; D++) {
              if (v.reset === !0) {
                v.reset = !1, D = -1;
                continue;
              }
              var R = v.orderedModifiers[D], P = R.fn, U = R.options, F = U === void 0 ? {} : U, T = R.name;
              typeof P == "function" && (v = P({
                state: v,
                options: F,
                name: T,
                instance: E
              }) || v);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Dn(function() {
        return new Promise(function(S) {
          E.forceUpdate(), S(v);
        });
      }),
      destroy: function() {
        w(), A = !0;
      }
    };
    if (!lr(d, p))
      return E;
    E.setOptions(y).then(function(S) {
      !A && y.onFirstUpdate && y.onFirstUpdate(S);
    });
    function g() {
      v.orderedModifiers.forEach(function(S) {
        var k = S.name, V = S.options, b = V === void 0 ? {} : V, D = S.effect;
        if (typeof D == "function") {
          var R = D({
            state: v,
            name: k,
            instance: E,
            options: b
          }), P = function() {
          };
          x.push(R || P);
        }
      });
    }
    function w() {
      x.forEach(function(S) {
        return S();
      }), x = [];
    }
    return E;
  };
}
var oa = {
  passive: !0
};
function Un(e) {
  var a = e.state, t = e.instance, s = e.options, n = s.scroll, m = n === void 0 ? !0 : n, l = s.resize, d = l === void 0 ? !0 : l, p = We(a.elements.popper), y = [].concat(a.scrollParents.reference, a.scrollParents.popper);
  return m && y.forEach(function(v) {
    v.addEventListener("scroll", t.update, oa);
  }), d && p.addEventListener("resize", t.update, oa), function() {
    m && y.forEach(function(v) {
      v.removeEventListener("scroll", t.update, oa);
    }), d && p.removeEventListener("resize", t.update, oa);
  };
}
var Hn = {
  name: "eventListeners",
  enabled: !0,
  phase: "write",
  fn: function() {
  },
  effect: Un,
  data: {}
};
function Wn(e) {
  var a = e.state, t = e.name;
  a.modifiersData[t] = mr({
    reference: a.rects.reference,
    element: a.rects.popper,
    strategy: "absolute",
    placement: a.placement
  });
}
var _n = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: Wn,
  data: {}
}, $n = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function Gn(e, a) {
  var t = e.x, s = e.y, n = a.devicePixelRatio || 1;
  return {
    x: jt(t * n) / n || 0,
    y: jt(s * n) / n || 0
  };
}
function sr(e) {
  var a, t = e.popper, s = e.popperRect, n = e.placement, m = e.variation, l = e.offsets, d = e.position, p = e.gpuAcceleration, y = e.adaptive, v = e.roundOffsets, x = e.isFixed, A = l.x, E = A === void 0 ? 0 : A, g = l.y, w = g === void 0 ? 0 : g, S = typeof v == "function" ? v({
    x: E,
    y: w
  }) : {
    x: E,
    y: w
  };
  E = S.x, w = S.y;
  var k = l.hasOwnProperty("x"), V = l.hasOwnProperty("y"), b = ot, D = Je, R = window;
  if (y) {
    var P = ha(t), U = "clientHeight", F = "clientWidth";
    if (P === We(t) && (P = mt(t), ut(P).position !== "static" && d === "absolute" && (U = "scrollHeight", F = "scrollWidth")), P = P, n === Je || (n === ot || n === ht) && m === Qt) {
      D = it;
      var T = x && P === R && R.visualViewport ? R.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        P[U]
      );
      w -= T - s.height, w *= p ? 1 : -1;
    }
    if (n === ot || (n === Je || n === it) && m === Qt) {
      b = ht;
      var J = x && P === R && R.visualViewport ? R.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        P[F]
      );
      E -= J - s.width, E *= p ? 1 : -1;
    }
  }
  var X = Object.assign({
    position: d
  }, y && $n), N = v === !0 ? Gn({
    x: E,
    y: w
  }, We(t)) : {
    x: E,
    y: w
  };
  if (E = N.x, w = N.y, p) {
    var H;
    return Object.assign({}, X, (H = {}, H[D] = V ? "0" : "", H[b] = k ? "0" : "", H.transform = (R.devicePixelRatio || 1) <= 1 ? "translate(" + E + "px, " + w + "px)" : "translate3d(" + E + "px, " + w + "px, 0)", H));
  }
  return Object.assign({}, X, (a = {}, a[D] = V ? w + "px" : "", a[b] = k ? E + "px" : "", a.transform = "", a));
}
function Kn(e) {
  var a = e.state, t = e.options, s = t.gpuAcceleration, n = s === void 0 ? !0 : s, m = t.adaptive, l = m === void 0 ? !0 : m, d = t.roundOffsets, p = d === void 0 ? !0 : d, y = {
    placement: vt(a.placement),
    variation: zt(a.placement),
    popper: a.elements.popper,
    popperRect: a.rects.popper,
    gpuAcceleration: n,
    isFixed: a.options.strategy === "fixed"
  };
  a.modifiersData.popperOffsets != null && (a.styles.popper = Object.assign({}, a.styles.popper, sr(Object.assign({}, y, {
    offsets: a.modifiersData.popperOffsets,
    position: a.options.strategy,
    adaptive: l,
    roundOffsets: p
  })))), a.modifiersData.arrow != null && (a.styles.arrow = Object.assign({}, a.styles.arrow, sr(Object.assign({}, y, {
    offsets: a.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: p
  })))), a.attributes.popper = Object.assign({}, a.attributes.popper, {
    "data-popper-placement": a.placement
  });
}
var Xn = {
  name: "computeStyles",
  enabled: !0,
  phase: "beforeWrite",
  fn: Kn,
  data: {}
};
function Yn(e) {
  var a = e.state;
  Object.keys(a.elements).forEach(function(t) {
    var s = a.styles[t] || {}, n = a.attributes[t] || {}, m = a.elements[t];
    !Ge(m) || !nt(m) || (Object.assign(m.style, s), Object.keys(n).forEach(function(l) {
      var d = n[l];
      d === !1 ? m.removeAttribute(l) : m.setAttribute(l, d === !0 ? "" : d);
    }));
  });
}
function Jn(e) {
  var a = e.state, t = {
    popper: {
      position: a.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  return Object.assign(a.elements.popper.style, t.popper), a.styles = t, a.elements.arrow && Object.assign(a.elements.arrow.style, t.arrow), function() {
    Object.keys(a.elements).forEach(function(s) {
      var n = a.elements[s], m = a.attributes[s] || {}, l = Object.keys(a.styles.hasOwnProperty(s) ? a.styles[s] : t[s]), d = l.reduce(function(p, y) {
        return p[y] = "", p;
      }, {});
      !Ge(n) || !nt(n) || (Object.assign(n.style, d), Object.keys(m).forEach(function(p) {
        n.removeAttribute(p);
      }));
    });
  };
}
var Qn = {
  name: "applyStyles",
  enabled: !0,
  phase: "write",
  fn: Yn,
  effect: Jn,
  requires: ["computeStyles"]
}, Zn = [Hn, _n, Xn, Qn], ei = /* @__PURE__ */ Fn({
  defaultModifiers: Zn
});
function ti(e) {
  return e === "x" ? "y" : "x";
}
function ca(e, a, t) {
  return xt(e, fa(a, t));
}
function ai(e, a, t) {
  var s = ca(e, a, t);
  return s > t ? t : s;
}
function ri(e) {
  var a = e.state, t = e.options, s = e.name, n = t.mainAxis, m = n === void 0 ? !0 : n, l = t.altAxis, d = l === void 0 ? !1 : l, p = t.boundary, y = t.rootBoundary, v = t.altBoundary, x = t.padding, A = t.tether, E = A === void 0 ? !0 : A, g = t.tetherOffset, w = g === void 0 ? 0 : g, S = ja(a, {
    boundary: p,
    rootBoundary: y,
    padding: x,
    altBoundary: v
  }), k = vt(a.placement), V = zt(a.placement), b = !V, D = hr(k), R = ti(D), P = a.modifiersData.popperOffsets, U = a.rects.reference, F = a.rects.popper, T = typeof w == "function" ? w(Object.assign({}, a.rects, {
    placement: a.placement
  })) : w, J = typeof T == "number" ? {
    mainAxis: T,
    altAxis: T
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, T), X = a.modifiersData.offset ? a.modifiersData.offset[a.placement] : null, N = {
    x: 0,
    y: 0
  };
  if (P) {
    if (m) {
      var H, ne = D === "y" ? Je : ot, G = D === "y" ? it : ht, ee = D === "y" ? "height" : "width", se = P[D], Te = se + S[ne], Y = se - S[G], Z = E ? -F[ee] / 2 : 0, te = V === It ? U[ee] : F[ee], pe = V === It ? -F[ee] : -U[ee], Le = a.elements.arrow, ce = E && Le ? fr(Le) : {
        width: 0,
        height: 0
      }, _ = a.modifiersData["arrow#persistent"] ? a.modifiersData["arrow#persistent"].padding : gr(), h = _[ne], j = _[G], be = ca(0, U[ee], ce[ee]), Re = b ? U[ee] / 2 - Z - be - h - J.mainAxis : te - be - h - J.mainAxis, gt = b ? -U[ee] / 2 + Z + be + j + J.mainAxis : pe + be + j + J.mainAxis, bt = a.elements.arrow && ha(a.elements.arrow), Ke = bt ? D === "y" ? bt.clientTop || 0 : bt.clientLeft || 0 : 0, kt = (H = X == null ? void 0 : X[D]) != null ? H : 0, Ft = se + Re - kt - Ke, Qe = se + gt - kt, Pt = ca(E ? fa(Te, Ft) : Te, se, E ? xt(Y, Qe) : Y);
      P[D] = Pt, N[D] = Pt - se;
    }
    if (d) {
      var Ze, _e = D === "x" ? Je : ot, qe = D === "x" ? it : ht, ze = P[R], Xe = R === "y" ? "height" : "width", yt = ze + S[_e], Ct = ze - S[qe], Ie = [Je, ot].indexOf(k) !== -1, ct = (Ze = X == null ? void 0 : X[R]) != null ? Ze : 0, et = Ie ? yt : ze - U[Xe] - F[Xe] - ct + J.altAxis, tt = Ie ? ze + U[Xe] + F[Xe] - ct - J.altAxis : Ct, Lt = E && Ie ? ai(et, ze, tt) : ca(E ? et : yt, ze, E ? tt : Ct);
      P[R] = Lt, N[R] = Lt - ze;
    }
    a.modifiersData[s] = N;
  }
}
var ni = {
  name: "preventOverflow",
  enabled: !0,
  phase: "main",
  fn: ri,
  requiresIfExists: ["offset"]
}, ii = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function da(e) {
  return e.replace(/left|right|bottom|top/g, function(a) {
    return ii[a];
  });
}
var li = {
  start: "end",
  end: "start"
};
function or(e) {
  return e.replace(/start|end/g, function(a) {
    return li[a];
  });
}
function si(e, a) {
  a === void 0 && (a = {});
  var t = a, s = t.placement, n = t.boundary, m = t.rootBoundary, l = t.padding, d = t.flipVariations, p = t.allowedAutoPlacements, y = p === void 0 ? bn : p, v = zt(s), x = v ? d ? rr : rr.filter(function(g) {
    return zt(g) === v;
  }) : ma, A = x.filter(function(g) {
    return y.indexOf(g) >= 0;
  });
  A.length === 0 && (A = x);
  var E = A.reduce(function(g, w) {
    return g[w] = ja(e, {
      placement: w,
      boundary: n,
      rootBoundary: m,
      padding: l
    })[vt(w)], g;
  }, {});
  return Object.keys(E).sort(function(g, w) {
    return E[g] - E[w];
  });
}
function oi(e) {
  if (vt(e) === Ra)
    return [];
  var a = da(e);
  return [or(e), a, or(a)];
}
function ui(e) {
  var a = e.state, t = e.options, s = e.name;
  if (!a.modifiersData[s]._skip) {
    for (var n = t.mainAxis, m = n === void 0 ? !0 : n, l = t.altAxis, d = l === void 0 ? !0 : l, p = t.fallbackPlacements, y = t.padding, v = t.boundary, x = t.rootBoundary, A = t.altBoundary, E = t.flipVariations, g = E === void 0 ? !0 : E, w = t.allowedAutoPlacements, S = a.options.placement, k = vt(S), V = k === S, b = p || (V || !g ? [da(S)] : oi(S)), D = [S].concat(b).reduce(function(ce, _) {
      return ce.concat(vt(_) === Ra ? si(a, {
        placement: _,
        boundary: v,
        rootBoundary: x,
        padding: y,
        flipVariations: g,
        allowedAutoPlacements: w
      }) : _);
    }, []), R = a.rects.reference, P = a.rects.popper, U = /* @__PURE__ */ new Map(), F = !0, T = D[0], J = 0; J < D.length; J++) {
      var X = D[J], N = vt(X), H = zt(X) === It, ne = [Je, it].indexOf(N) >= 0, G = ne ? "width" : "height", ee = ja(a, {
        placement: X,
        boundary: v,
        rootBoundary: x,
        altBoundary: A,
        padding: y
      }), se = ne ? H ? ht : ot : H ? it : Je;
      R[G] > P[G] && (se = da(se));
      var Te = da(se), Y = [];
      if (m && Y.push(ee[N] <= 0), d && Y.push(ee[se] <= 0, ee[Te] <= 0), Y.every(function(ce) {
        return ce;
      })) {
        T = X, F = !1;
        break;
      }
      U.set(X, Y);
    }
    if (F)
      for (var Z = g ? 3 : 1, te = function(_) {
        var h = D.find(function(j) {
          var be = U.get(j);
          if (be)
            return be.slice(0, _).every(function(Re) {
              return Re;
            });
        });
        if (h)
          return T = h, "break";
      }, pe = Z; pe > 0; pe--) {
        var Le = te(pe);
        if (Le === "break")
          break;
      }
    a.placement !== T && (a.modifiersData[s]._skip = !0, a.placement = T, a.reset = !0);
  }
}
var ci = {
  name: "flip",
  enabled: !0,
  phase: "main",
  fn: ui,
  requiresIfExists: ["offset"],
  data: {
    _skip: !1
  }
};
function di(e, a, t) {
  const { disabled: s, appendTo: n, appendToBody: m, openDirection: l } = Me(e), d = Zt().proxy, p = t.multiselect, y = t.dropdown, v = he(!1), x = he(null), A = he(null), E = K(() => n.value || m.value), g = K(() => l.value === "top" && A.value === "bottom" || l.value === "bottom" && A.value !== "top" ? "bottom" : "top"), w = () => {
    v.value || s.value || (v.value = !0, a.emit("open", d), E.value && Yt(() => {
      k();
    }));
  }, S = () => {
    v.value && (v.value = !1, a.emit("close", d));
  }, k = () => {
    if (!x.value)
      return;
    let b = parseInt(window.getComputedStyle(y.value).borderTopWidth.replace("px", "")), D = parseInt(window.getComputedStyle(y.value).borderBottomWidth.replace("px", ""));
    x.value.setOptions((R) => ({
      ...R,
      modifiers: [
        ...R.modifiers,
        {
          name: "offset",
          options: {
            offset: [0, (g.value === "top" ? b : D) * -1]
          }
        }
      ]
    })), x.value.update();
  }, V = (b) => {
    for (; b && b !== document.body; ) {
      if (getComputedStyle(b).position === "fixed")
        return !0;
      b = b.parentElement;
    }
    return !1;
  };
  return pa(() => {
    E.value && (x.value = ei(p.value, y.value, {
      strategy: V(p.value) ? (
        /* istanbul ignore next: UI feature */
        "fixed"
      ) : void 0,
      placement: l.value,
      modifiers: [
        ni,
        ci,
        {
          name: "sameWidth",
          enabled: !0,
          phase: "beforeWrite",
          requires: ["computeStyles"],
          fn: ({ state: b }) => {
            b.styles.popper.width = `${b.rects.reference.width}px`;
          },
          effect: ({ state: b }) => {
            b.elements.popper.style.width = `${b.elements.reference.offsetWidth}px`;
          }
        },
        {
          name: "toggleClass",
          enabled: !0,
          phase: "write",
          fn({ state: b }) {
            A.value = b.placement;
          }
        }
      ]
    }));
  }), Nr(() => {
    !E.value || !x.value || (x.value.destroy(), x.value = null);
  }), {
    popper: x,
    isOpen: v,
    open: w,
    close: S,
    placement: g,
    updatePopper: k
  };
}
function fi(e, a, t) {
  const { searchable: s, disabled: n, clearOnBlur: m } = Me(e), l = t.input, d = t.open, p = t.close, y = t.clearSearch, v = t.isOpen, x = t.wrapper, A = t.tags, E = he(!1), g = he(!1), w = K(() => s.value || n.value ? -1 : 0), S = () => {
    s.value && l.value.blur(), x.value.blur();
  }, k = () => {
    s.value && !n.value && l.value.focus();
  }, V = (F = !0) => {
    n.value || (E.value = !0, F && d());
  }, b = () => {
    E.value = !1, setTimeout(() => {
      E.value || (p(), m.value && y());
    }, 1);
  };
  return {
    tabindex: w,
    isActive: E,
    mouseClicked: g,
    blur: S,
    focus: k,
    activate: V,
    deactivate: b,
    handleFocusIn: (F) => {
      F.target.closest("[data-tags]") && F.target.nodeName !== "INPUT" || F.target.closest("[data-clear]") || V(g.value);
    },
    handleFocusOut: () => {
      b();
    },
    handleCaretClick: () => {
      b(), S();
    },
    handleMousedown: (F) => {
      g.value = !0, v.value && (F.target.isEqualNode(x.value) || F.target.isEqualNode(A.value)) ? setTimeout(() => {
        b();
      }, 0) : !v.value && (document.activeElement.isEqualNode(x.value) || document.activeElement.isEqualNode(l.value)) && V(), setTimeout(() => {
        g.value = !1;
      }, 0);
    }
  };
}
function pi(e, a, t) {
  const {
    mode: s,
    addTagOn: n,
    openDirection: m,
    searchable: l,
    showOptions: d,
    valueProp: p,
    groups: y,
    addOptionOn: v,
    createTag: x,
    createOption: A,
    reverse: E
  } = Me(e), g = Zt().proxy, w = t.iv, S = t.update, k = t.deselect, V = t.search, b = t.setPointer, D = t.selectPointer, R = t.backwardPointer, P = t.forwardPointer, U = t.multiselect, F = t.wrapper, T = t.tags, J = t.isOpen, X = t.open, N = t.blur, H = t.fo, ne = K(() => x.value || A.value || !1), G = K(() => n.value !== void 0 ? n.value : v.value !== void 0 ? v.value : ["enter"]), ee = () => {
    s.value === "tags" && !d.value && ne.value && l.value && !y.value && b(H.value[H.value.map((Y) => Y[p.value]).indexOf(V.value)]);
  };
  return {
    handleKeydown: (Y) => {
      a.emit("keydown", Y, g);
      let Z, te;
      switch (["ArrowLeft", "ArrowRight", "Enter"].indexOf(Y.key) !== -1 && s.value === "tags" && (Z = [...U.value.querySelectorAll("[data-tags] > *")].filter((pe) => pe !== T.value), te = Z.findIndex((pe) => pe === document.activeElement)), Y.key) {
        case "Backspace":
          if (s.value === "single" || l.value && [null, ""].indexOf(V.value) === -1 || w.value.length === 0)
            return;
          let pe = w.value.filter((Le) => !Le.disabled && Le.remove !== !1);
          pe.length && k(pe[pe.length - 1]);
          break;
        case "Enter":
          if (Y.preventDefault(), Y.keyCode === 229)
            return;
          if (te !== -1 && te !== void 0) {
            S([...w.value].filter((Le, ce) => ce !== te)), te === Z.length - 1 && (Z.length - 1 ? Z[Z.length - 2].focus() : l.value ? T.value.querySelector("input").focus() : F.value.focus());
            return;
          }
          if (G.value.indexOf("enter") === -1 && ne.value)
            return;
          ee(), D();
          break;
        case " ":
          if (!ne.value && !l.value) {
            Y.preventDefault(), ee(), D();
            return;
          }
          if (!ne.value)
            return !1;
          if (G.value.indexOf("space") === -1 && ne.value)
            return;
          Y.preventDefault(), ee(), D();
          break;
        case "Tab":
        case ";":
        case ",":
          if (G.value.indexOf(Y.key.toLowerCase()) === -1 || !ne.value)
            return;
          ee(), D(), Y.preventDefault();
          break;
        case "Escape":
          N();
          break;
        case "ArrowUp":
          if (Y.preventDefault(), !d.value)
            return;
          J.value || X(), R();
          break;
        case "ArrowDown":
          if (Y.preventDefault(), !d.value)
            return;
          J.value || X(), P();
          break;
        case "ArrowLeft":
          if (l.value && T.value && T.value.querySelector("input").selectionStart || Y.shiftKey || s.value !== "tags" || !w.value || !w.value.length)
            return;
          Y.preventDefault(), te === -1 ? Z[Z.length - 1].focus() : te > 0 && Z[te - 1].focus();
          break;
        case "ArrowRight":
          if (te === -1 || Y.shiftKey || s.value !== "tags" || !w.value || !w.value.length)
            return;
          Y.preventDefault(), Z.length > te + 1 ? Z[te + 1].focus() : l.value ? T.value.querySelector("input").focus() : l.value || F.value.focus();
          break;
      }
    },
    handleKeyup: (Y) => {
      a.emit("keyup", Y, g);
    },
    preparePointer: ee
  };
}
function vi(e, a, t) {
  const {
    classes: s,
    disabled: n,
    showOptions: m,
    breakTags: l
  } = Me(e), d = t.isOpen, p = t.isPointed, y = t.isSelected, v = t.isDisabled, x = t.isActive, A = t.canPointGroups, E = t.resolving, g = t.fo, w = t.placement, S = K(() => ({
    container: "multiselect",
    containerDisabled: "is-disabled",
    containerOpen: "is-open",
    containerOpenTop: "is-open-top",
    containerActive: "is-active",
    wrapper: "multiselect-wrapper",
    singleLabel: "multiselect-single-label",
    singleLabelText: "multiselect-single-label-text",
    multipleLabel: "multiselect-multiple-label",
    search: "multiselect-search",
    tags: "multiselect-tags",
    tag: "multiselect-tag",
    tagWrapper: "multiselect-tag-wrapper",
    tagWrapperBreak: "multiselect-tag-wrapper-break",
    tagDisabled: "is-disabled",
    tagRemove: "multiselect-tag-remove",
    tagRemoveIcon: "multiselect-tag-remove-icon",
    tagsSearchWrapper: "multiselect-tags-search-wrapper",
    tagsSearch: "multiselect-tags-search",
    tagsSearchCopy: "multiselect-tags-search-copy",
    placeholder: "multiselect-placeholder",
    caret: "multiselect-caret",
    caretOpen: "is-open",
    clear: "multiselect-clear",
    clearIcon: "multiselect-clear-icon",
    spinner: "multiselect-spinner",
    inifinite: "multiselect-inifite",
    inifiniteSpinner: "multiselect-inifite-spinner",
    dropdown: "multiselect-dropdown",
    dropdownTop: "is-top",
    dropdownHidden: "is-hidden",
    options: "multiselect-options",
    optionsTop: "is-top",
    group: "multiselect-group",
    groupLabel: "multiselect-group-label",
    groupLabelPointable: "is-pointable",
    groupLabelPointed: "is-pointed",
    groupLabelSelected: "is-selected",
    groupLabelDisabled: "is-disabled",
    groupLabelSelectedPointed: "is-selected is-pointed",
    groupLabelSelectedDisabled: "is-selected is-disabled",
    groupOptions: "multiselect-group-options",
    option: "multiselect-option",
    optionPointed: "is-pointed",
    optionSelected: "is-selected",
    optionDisabled: "is-disabled",
    optionSelectedPointed: "is-selected is-pointed",
    optionSelectedDisabled: "is-selected is-disabled",
    noOptions: "multiselect-no-options",
    noResults: "multiselect-no-results",
    fakeInput: "multiselect-fake-input",
    assist: "multiselect-assistive-text",
    spacer: "multiselect-spacer",
    ...s.value
  })), k = K(() => !!(d.value && m.value && (!E.value || E.value && g.value.length)));
  return {
    classList: K(() => {
      const b = S.value;
      return {
        container: [b.container].concat(n.value ? b.containerDisabled : []).concat(k.value && w.value === "top" ? b.containerOpenTop : []).concat(k.value && w.value !== "top" ? b.containerOpen : []).concat(x.value ? b.containerActive : []),
        wrapper: b.wrapper,
        spacer: b.spacer,
        singleLabel: b.singleLabel,
        singleLabelText: b.singleLabelText,
        multipleLabel: b.multipleLabel,
        search: b.search,
        tags: b.tags,
        tag: [b.tag].concat(n.value ? b.tagDisabled : []),
        tagWrapper: [b.tagWrapper, l.value ? b.tagWrapperBreak : null],
        tagDisabled: b.tagDisabled,
        tagRemove: b.tagRemove,
        tagRemoveIcon: b.tagRemoveIcon,
        tagsSearchWrapper: b.tagsSearchWrapper,
        tagsSearch: b.tagsSearch,
        tagsSearchCopy: b.tagsSearchCopy,
        placeholder: b.placeholder,
        caret: [b.caret].concat(d.value ? b.caretOpen : []),
        clear: b.clear,
        clearIcon: b.clearIcon,
        spinner: b.spinner,
        inifinite: b.inifinite,
        inifiniteSpinner: b.inifiniteSpinner,
        dropdown: [b.dropdown].concat(w.value === "top" ? b.dropdownTop : []).concat(!d.value || !m.value || !k.value ? b.dropdownHidden : []),
        options: [b.options].concat(w.value === "top" ? b.optionsTop : []),
        group: b.group,
        groupLabel: (D) => {
          let R = [b.groupLabel];
          return p(D) ? R.push(y(D) ? b.groupLabelSelectedPointed : b.groupLabelPointed) : y(D) && A.value ? R.push(v(D) ? b.groupLabelSelectedDisabled : b.groupLabelSelected) : v(D) && R.push(b.groupLabelDisabled), A.value && R.push(b.groupLabelPointable), R;
        },
        groupOptions: b.groupOptions,
        option: (D, R) => {
          let P = [b.option];
          return p(D) ? P.push(y(D) ? b.optionSelectedPointed : b.optionPointed) : y(D) ? P.push(v(D) ? b.optionSelectedDisabled : b.optionSelected) : (v(D) || R && v(R)) && P.push(b.optionDisabled), P;
        },
        noOptions: b.noOptions,
        noResults: b.noResults,
        assist: b.assist,
        fakeInput: b.fakeInput
      };
    }),
    showDropdown: k
  };
}
function hi(e, a, t) {
  const {
    limit: s,
    infinite: n
  } = Me(e), m = t.isOpen, l = t.offset, d = t.search, p = t.pfo, y = t.eo, v = he(null), x = he(null), A = K(() => l.value < p.value.length), E = (w) => {
    const { isIntersecting: S, target: k } = w[0];
    if (S) {
      const V = k.offsetParent, b = V.scrollTop;
      l.value += s.value == -1 ? 10 : s.value, Yt(() => {
        V.scrollTop = b;
      });
    }
  }, g = () => {
    m.value && l.value < p.value.length ? v.value.observe(x.value) : !m.value && v.value && v.value.disconnect();
  };
  return ge(m, () => {
    n.value && g();
  }), ge(d, () => {
    n.value && (l.value = s.value, g());
  }, { flush: "post" }), ge(y, () => {
    n.value && g();
  }, { immediate: !1, flush: "post" }), pa(() => {
    window && window.IntersectionObserver && (v.value = new IntersectionObserver(E));
  }), {
    hasMore: A,
    infiniteLoader: x
  };
}
function mi(e, a, t) {
  const {
    placeholder: s,
    id: n,
    valueProp: m,
    label: l,
    mode: d,
    groupLabel: p,
    aria: y,
    searchable: v
  } = Me(e), x = t.pointer, A = t.iv, E = t.hasSelected, g = t.multipleLabelText, w = he(null), S = K(() => {
    let N = [];
    return n && n.value && N.push(n.value), N.push("assist"), N.join("-");
  }), k = K(() => {
    let N = [];
    return n && n.value && N.push(n.value), N.push("multiselect-options"), N.join("-");
  }), V = K(() => {
    let N = [];
    if (n && n.value && N.push(n.value), x.value)
      return N.push(x.value.group ? "multiselect-group" : "multiselect-option"), N.push(x.value.group ? x.value.index : x.value[m.value]), N.join("-");
  }), b = K(() => s.value), D = K(() => d.value !== "single"), R = K(() => {
    let N = "";
    return d.value === "single" && E.value && (N += A.value[l.value]), d.value === "multiple" && E.value && (N += g.value), d.value === "tags" && E.value && (N += A.value.map((H) => H[l.value]).join(", ")), N;
  }), P = K(() => {
    let N = { ...y.value };
    return v.value && (N["aria-labelledby"] = N["aria-labelledby"] ? `${S.value} ${N["aria-labelledby"]}` : S.value, R.value && N["aria-label"] && (N["aria-label"] = `${R.value}, ${N["aria-label"]}`)), N;
  }), U = (N) => {
    let H = [];
    return n && n.value && H.push(n.value), H.push("multiselect-option"), H.push(N[m.value]), H.join("-");
  }, F = (N) => {
    let H = [];
    return n && n.value && H.push(n.value), H.push("multiselect-group"), H.push(N.index), H.join("-");
  }, T = (N) => {
    let H = [];
    return H.push(N), H.join(" ");
  }, J = (N) => {
    let H = [];
    return H.push(N), H.join(" ");
  }, X = (N) => `${N} ❎`;
  return pa(() => {
    if (n && n.value && document && document.querySelector) {
      let N = document.querySelector(`[for="${n.value}"]`);
      w.value = N ? N.innerText : null;
    }
  }), {
    arias: P,
    ariaLabel: R,
    ariaAssist: S,
    ariaControls: k,
    ariaPlaceholder: b,
    ariaMultiselectable: D,
    ariaActiveDescendant: V,
    ariaOptionId: U,
    ariaOptionLabel: T,
    ariaGroupId: F,
    ariaGroupLabel: J,
    ariaTagLabel: X
  };
}
function gi(e, a, t) {
  const {
    locale: s,
    fallbackLocale: n
  } = Me(e);
  return {
    localize: (l) => !l || typeof l != "object" ? l : l && l[s.value] ? l[s.value] : l && s.value && l[s.value.toUpperCase()] ? l[s.value.toUpperCase()] : l && l[n.value] ? l[n.value] : l && n.value && l[n.value.toUpperCase()] ? l[n.value.toUpperCase()] : l && Object.keys(l)[0] ? l[Object.keys(l)[0]] : ""
  };
}
function bi(e, a, t) {
  const s = he(null), n = he(null), m = he(null), l = he(null), d = he(null);
  return {
    multiselect: s,
    wrapper: n,
    tags: m,
    input: l,
    dropdown: d
  };
}
function yi(e, a, t, s = {}) {
  return t.forEach((n) => {
    n && (s = {
      ...s,
      ...n(e, a, s)
    });
  }), s;
}
var qa = {
  name: "Multiselect",
  emits: [
    "paste",
    "open",
    "close",
    "select",
    "deselect",
    "input",
    "search-change",
    "tag",
    "option",
    "update:modelValue",
    "change",
    "clear",
    "keydown",
    "keyup",
    "max",
    "create"
  ],
  props: {
    value: {
      required: !1
    },
    modelValue: {
      required: !1
    },
    options: {
      type: [Array, Object, Function],
      required: !1,
      default: () => []
    },
    id: {
      type: [String, Number],
      required: !1
    },
    name: {
      type: [String, Number],
      required: !1,
      default: "multiselect"
    },
    disabled: {
      type: Boolean,
      required: !1,
      default: !1
    },
    label: {
      type: String,
      required: !1,
      default: "label"
    },
    trackBy: {
      type: [String, Array],
      required: !1,
      default: void 0
    },
    valueProp: {
      type: String,
      required: !1,
      default: "value"
    },
    placeholder: {
      type: String,
      required: !1,
      default: null
    },
    mode: {
      type: String,
      required: !1,
      default: "single"
      // single|multiple|tags
    },
    searchable: {
      type: Boolean,
      required: !1,
      default: !1
    },
    limit: {
      type: Number,
      required: !1,
      default: -1
    },
    hideSelected: {
      type: Boolean,
      required: !1,
      default: !0
    },
    createTag: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    createOption: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    appendNewTag: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    appendNewOption: {
      type: Boolean,
      required: !1,
      default: void 0
    },
    addTagOn: {
      type: Array,
      required: !1,
      default: void 0
    },
    addOptionOn: {
      type: Array,
      required: !1,
      default: void 0
    },
    caret: {
      type: Boolean,
      required: !1,
      default: !0
    },
    loading: {
      type: Boolean,
      required: !1,
      default: !1
    },
    noOptionsText: {
      type: [String, Object],
      required: !1,
      default: "The list is empty"
    },
    noResultsText: {
      type: [String, Object],
      required: !1,
      default: "No results found"
    },
    multipleLabel: {
      type: Function,
      required: !1
    },
    object: {
      type: Boolean,
      required: !1,
      default: !1
    },
    delay: {
      type: Number,
      required: !1,
      default: -1
    },
    minChars: {
      type: Number,
      required: !1,
      default: 0
    },
    resolveOnLoad: {
      type: Boolean,
      required: !1,
      default: !0
    },
    filterResults: {
      type: Boolean,
      required: !1,
      default: !0
    },
    clearOnSearch: {
      type: Boolean,
      required: !1,
      default: !1
    },
    clearOnSelect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    canDeselect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    canClear: {
      type: Boolean,
      required: !1,
      default: !0
    },
    max: {
      type: Number,
      required: !1,
      default: -1
    },
    showOptions: {
      type: Boolean,
      required: !1,
      default: !0
    },
    required: {
      type: Boolean,
      required: !1,
      default: !1
    },
    openDirection: {
      type: String,
      required: !1,
      default: "bottom"
    },
    nativeSupport: {
      type: Boolean,
      required: !1,
      default: !1
    },
    classes: {
      type: Object,
      required: !1,
      default: () => ({})
    },
    strict: {
      type: Boolean,
      required: !1,
      default: !0
    },
    closeOnSelect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    closeOnDeselect: {
      type: Boolean,
      required: !1,
      default: !1
    },
    autocomplete: {
      type: String,
      required: !1
    },
    groups: {
      type: Boolean,
      required: !1,
      default: !1
    },
    groupLabel: {
      type: String,
      required: !1,
      default: "label"
    },
    groupOptions: {
      type: String,
      required: !1,
      default: "options"
    },
    groupHideEmpty: {
      type: Boolean,
      required: !1,
      default: !1
    },
    groupSelect: {
      type: Boolean,
      required: !1,
      default: !0
    },
    inputType: {
      type: String,
      required: !1,
      default: "text"
    },
    attrs: {
      required: !1,
      type: Object,
      default: () => ({})
    },
    onCreate: {
      required: !1,
      type: Function
    },
    disabledProp: {
      type: String,
      required: !1,
      default: "disabled"
    },
    searchStart: {
      type: Boolean,
      required: !1,
      default: !1
    },
    reverse: {
      type: Boolean,
      required: !1,
      default: !1
    },
    regex: {
      type: [Object, String, RegExp],
      required: !1,
      default: void 0
    },
    rtl: {
      type: Boolean,
      required: !1,
      default: !1
    },
    infinite: {
      type: Boolean,
      required: !1,
      default: !1
    },
    aria: {
      required: !1,
      type: Object,
      default: () => ({})
    },
    clearOnBlur: {
      required: !1,
      type: Boolean,
      default: !0
    },
    locale: {
      required: !1,
      type: String,
      default: null
    },
    fallbackLocale: {
      required: !1,
      type: String,
      default: "en"
    },
    searchFilter: {
      required: !1,
      type: Function,
      default: null
    },
    allowAbsent: {
      required: !1,
      type: Boolean,
      default: !1
    },
    appendToBody: {
      required: !1,
      type: Boolean,
      default: !1
    },
    closeOnScroll: {
      required: !1,
      type: Boolean,
      default: !1
    },
    breakTags: {
      required: !1,
      type: Boolean,
      default: !1
    },
    appendTo: {
      required: !1,
      type: String
    }
  },
  setup(e, a) {
    return yi(e, a, [
      bi,
      gi,
      an,
      nn,
      di,
      rn,
      tn,
      fi,
      on,
      hi,
      un,
      pi,
      vi,
      mi
    ]);
  },
  beforeMount() {
    var e, a;
    ((a = (e = this.$root.constructor) == null ? void 0 : e.version) != null && a.match(/^2\./) || this.vueVersionMs === 2) && (this.$options.components.Teleport || (this.$options.components.Teleport = {
      render() {
        return this.$slots.default ? this.$slots.default[0] : null;
      }
    }));
  }
};
const wi = ["id", "dir"], Si = ["tabindex", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable", "role"], Oi = ["type", "modelValue", "value", "autocomplete", "id", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable"], xi = ["onKeyup", "aria-label"], Ei = ["onClick"], ki = ["type", "modelValue", "value", "id", "autocomplete", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable"], Pi = ["innerHTML"], Ci = ["id"], Li = ["id"], Ai = ["id", "aria-label", "aria-selected"], Ti = ["data-pointed", "onMouseenter", "onMousedown"], Di = ["innerHTML"], Ni = ["aria-label"], Bi = ["data-pointed", "data-selected", "onMouseenter", "onMousedown", "id", "aria-selected", "aria-label"], Mi = ["data-pointed", "data-selected", "onMouseenter", "onMousedown", "id", "aria-selected", "aria-label"], Vi = ["innerHTML"], Ri = ["innerHTML"], ji = ["value"], qi = ["name", "value"], Ii = ["name", "value"], zi = ["id"];
function Fi(e, a, t, s, n, m) {
  return re(), ie("div", {
    ref: "multiselect",
    class: de(e.classList.container),
    id: t.searchable ? void 0 : t.id,
    dir: t.rtl ? "rtl" : void 0,
    onFocusin: a[12] || (a[12] = (...l) => e.handleFocusIn && e.handleFocusIn(...l)),
    onFocusout: a[13] || (a[13] = (...l) => e.handleFocusOut && e.handleFocusOut(...l)),
    onKeyup: a[14] || (a[14] = (...l) => e.handleKeyup && e.handleKeyup(...l)),
    onKeydown: a[15] || (a[15] = (...l) => e.handleKeydown && e.handleKeydown(...l))
  }, [
    $("div", ua({
      class: e.classList.wrapper,
      onMousedown: a[9] || (a[9] = (...l) => e.handleMousedown && e.handleMousedown(...l)),
      ref: "wrapper",
      tabindex: e.tabindex,
      "aria-controls": t.searchable ? void 0 : e.ariaControls,
      "aria-placeholder": t.searchable ? void 0 : e.ariaPlaceholder,
      "aria-expanded": t.searchable ? void 0 : e.isOpen,
      "aria-activedescendant": t.searchable ? void 0 : e.ariaActiveDescendant,
      "aria-multiselectable": t.searchable ? void 0 : e.ariaMultiselectable,
      role: t.searchable ? void 0 : "combobox"
    }, t.searchable ? {} : e.arias), [
      oe(" Search "),
      t.mode !== "tags" && t.searchable && !t.disabled ? (re(), ie("input", ua({
        key: 0,
        type: t.inputType,
        modelValue: e.search,
        value: e.search,
        class: e.classList.search,
        autocomplete: t.autocomplete,
        id: t.searchable ? t.id : void 0,
        onInput: a[0] || (a[0] = (...l) => e.handleSearchInput && e.handleSearchInput(...l)),
        onKeypress: a[1] || (a[1] = (...l) => e.handleKeypress && e.handleKeypress(...l)),
        onPaste: a[2] || (a[2] = Vt((...l) => e.handlePaste && e.handlePaste(...l), ["stop"])),
        ref: "input",
        "aria-controls": e.ariaControls,
        "aria-placeholder": e.ariaPlaceholder,
        "aria-expanded": e.isOpen,
        "aria-activedescendant": e.ariaActiveDescendant,
        "aria-multiselectable": e.ariaMultiselectable,
        role: "combobox"
      }, {
        ...t.attrs,
        ...e.arias
      }), null, 16, Oi)) : oe("v-if", !0),
      oe(" Tags (with search) "),
      t.mode == "tags" ? (re(), ie(
        "div",
        {
          key: 1,
          class: de(e.classList.tags),
          "data-tags": ""
        },
        [
          (re(!0), ie(
            st,
            null,
            pt(e.iv, (l, d, p) => Be(e.$slots, "tag", {
              option: l,
              handleTagRemove: e.handleTagRemove,
              disabled: t.disabled
            }, () => [
              (re(), ie("span", {
                class: de([
                  e.classList.tag,
                  l.disabled ? e.classList.tagDisabled : null
                ]),
                tabindex: "-1",
                onKeyup: Ja((y) => e.handleTagRemove(l, y), ["enter"]),
                key: p,
                "aria-label": e.ariaTagLabel(e.localize(l[t.label]))
              }, [
                $(
                  "span",
                  {
                    class: de(e.classList.tagWrapper)
                  },
                  Ce(e.localize(l[t.label])),
                  3
                  /* TEXT, CLASS */
                ),
                !t.disabled && !l.disabled ? (re(), ie("span", {
                  key: 0,
                  class: de(e.classList.tagRemove),
                  onClick: Vt((y) => e.handleTagRemove(l, y), ["stop"])
                }, [
                  $(
                    "span",
                    {
                      class: de(e.classList.tagRemoveIcon)
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ], 10, Ei)) : oe("v-if", !0)
              ], 42, xi))
            ])),
            256
            /* UNKEYED_FRAGMENT */
          )),
          $(
            "div",
            {
              class: de(e.classList.tagsSearchWrapper),
              ref: "tags"
            },
            [
              oe(" Used for measuring search width "),
              $(
                "span",
                {
                  class: de(e.classList.tagsSearchCopy)
                },
                Ce(e.search),
                3
                /* TEXT, CLASS */
              ),
              oe(" Actual search input "),
              t.searchable && !t.disabled ? (re(), ie("input", ua({
                key: 0,
                type: t.inputType,
                modelValue: e.search,
                value: e.search,
                class: e.classList.tagsSearch,
                id: t.searchable ? t.id : void 0,
                autocomplete: t.autocomplete,
                onInput: a[3] || (a[3] = (...l) => e.handleSearchInput && e.handleSearchInput(...l)),
                onKeypress: a[4] || (a[4] = (...l) => e.handleKeypress && e.handleKeypress(...l)),
                onPaste: a[5] || (a[5] = Vt((...l) => e.handlePaste && e.handlePaste(...l), ["stop"])),
                ref: "input",
                "aria-controls": e.ariaControls,
                "aria-placeholder": e.ariaPlaceholder,
                "aria-expanded": e.isOpen,
                "aria-activedescendant": e.ariaActiveDescendant,
                "aria-multiselectable": e.ariaMultiselectable,
                role: "combobox"
              }, {
                ...t.attrs,
                ...e.arias
              }), null, 16, ki)) : oe("v-if", !0)
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )) : oe("v-if", !0),
      oe(" Single label "),
      t.mode == "single" && e.hasSelected && !e.search && e.iv ? Be(e.$slots, "singlelabel", {
        key: 2,
        value: e.iv
      }, () => [
        $(
          "div",
          {
            class: de(e.classList.singleLabel)
          },
          [
            $(
              "span",
              {
                class: de(e.classList.singleLabelText)
              },
              Ce(e.localize(e.iv[t.label])),
              3
              /* TEXT, CLASS */
            )
          ],
          2
          /* CLASS */
        )
      ]) : oe("v-if", !0),
      oe(" Multiple label "),
      t.mode == "multiple" && e.hasSelected && !e.search ? Be(e.$slots, "multiplelabel", {
        key: 3,
        values: e.iv
      }, () => [
        $("div", {
          class: de(e.classList.multipleLabel),
          innerHTML: e.multipleLabelText
        }, null, 10, Pi)
      ]) : oe("v-if", !0),
      oe(" Placeholder "),
      t.placeholder && !e.hasSelected && !e.search ? Be(e.$slots, "placeholder", { key: 4 }, () => [
        $(
          "div",
          {
            class: de(e.classList.placeholder),
            "aria-hidden": "true"
          },
          Ce(t.placeholder),
          3
          /* TEXT, CLASS */
        )
      ]) : oe("v-if", !0),
      oe(" Spinner "),
      t.loading || e.resolving ? Be(e.$slots, "spinner", { key: 5 }, () => [
        $(
          "span",
          {
            class: de(e.classList.spinner),
            "aria-hidden": "true"
          },
          null,
          2
          /* CLASS */
        )
      ]) : oe("v-if", !0),
      oe(" Clear "),
      e.hasSelected && !t.disabled && t.canClear && !e.busy ? Be(e.$slots, "clear", {
        key: 6,
        clear: e.clear
      }, () => [
        $(
          "span",
          {
            "aria-hidden": "true",
            tabindex: "0",
            role: "button",
            "data-clear": "",
            "aria-roledescription": "❎",
            class: de(e.classList.clear),
            onClick: a[6] || (a[6] = (...l) => e.clear && e.clear(...l)),
            onKeyup: a[7] || (a[7] = Ja((...l) => e.clear && e.clear(...l), ["enter"]))
          },
          [
            $(
              "span",
              {
                class: de(e.classList.clearIcon)
              },
              null,
              2
              /* CLASS */
            )
          ],
          34
          /* CLASS, NEED_HYDRATION */
        )
      ]) : oe("v-if", !0),
      oe(" Caret "),
      t.caret && t.showOptions ? Be(e.$slots, "caret", {
        key: 7,
        handleCaretClick: e.handleCaretClick,
        isOpen: e.isOpen
      }, () => [
        $(
          "span",
          {
            class: de(e.classList.caret),
            onClick: a[8] || (a[8] = (...l) => e.handleCaretClick && e.handleCaretClick(...l)),
            "aria-hidden": "true"
          },
          null,
          2
          /* CLASS */
        )
      ]) : oe("v-if", !0)
    ], 16, Si),
    oe(" Options "),
    (re(), ur(Dr, {
      to: t.appendTo || "body",
      disabled: !t.appendToBody && !t.appendTo
    }, [
      $("div", {
        id: t.id ? `${t.id}-dropdown` : void 0,
        class: de(e.classList.dropdown),
        tabindex: "-1",
        ref: "dropdown",
        onFocusin: a[10] || (a[10] = (...l) => e.handleFocusIn && e.handleFocusIn(...l)),
        onFocusout: a[11] || (a[11] = (...l) => e.handleFocusOut && e.handleFocusOut(...l))
      }, [
        Be(e.$slots, "beforelist", { options: e.fo }),
        $("ul", {
          class: de(e.classList.options),
          id: e.ariaControls,
          role: "listbox"
        }, [
          t.groups ? (re(!0), ie(
            st,
            { key: 0 },
            pt(e.fg, (l, d, p) => (re(), ie("li", {
              class: de(e.classList.group),
              key: p,
              id: e.ariaGroupId(l),
              "aria-label": e.ariaGroupLabel(e.localize(l[t.groupLabel])),
              "aria-selected": e.isSelected(l),
              role: "option"
            }, [
              l.__CREATE__ ? oe("v-if", !0) : (re(), ie("div", {
                key: 0,
                class: de(e.classList.groupLabel(l)),
                "data-pointed": e.isPointed(l),
                onMouseenter: (y) => e.setPointer(l, d),
                onMousedown: Vt((y) => e.handleGroupClick(l), ["prevent"])
              }, [
                Be(e.$slots, "grouplabel", {
                  group: l,
                  isSelected: e.isSelected,
                  isPointed: e.isPointed
                }, () => [
                  $("span", {
                    innerHTML: e.localize(l[t.groupLabel])
                  }, null, 8, Di)
                ])
              ], 42, Ti)),
              $("ul", {
                class: de(e.classList.groupOptions),
                "aria-label": e.ariaGroupLabel(e.localize(l[t.groupLabel])),
                role: "group"
              }, [
                (re(!0), ie(
                  st,
                  null,
                  pt(l.__VISIBLE__, (y, v, x) => (re(), ie("li", {
                    class: de(e.classList.option(y, l)),
                    "data-pointed": e.isPointed(y),
                    "data-selected": e.isSelected(y) || void 0,
                    key: x,
                    onMouseenter: (A) => e.setPointer(y),
                    onMousedown: Vt((A) => e.handleOptionClick(y), ["prevent"]),
                    id: e.ariaOptionId(y),
                    "aria-selected": e.isSelected(y),
                    "aria-label": e.ariaOptionLabel(e.localize(y[t.label])),
                    role: "option"
                  }, [
                    Be(e.$slots, "option", {
                      option: y,
                      isSelected: e.isSelected,
                      isPointed: e.isPointed,
                      search: e.search
                    }, () => [
                      $(
                        "span",
                        null,
                        Ce(e.localize(y[t.label])),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, Bi))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 10, Ni)
            ], 10, Ai))),
            128
            /* KEYED_FRAGMENT */
          )) : (re(!0), ie(
            st,
            { key: 1 },
            pt(e.fo, (l, d, p) => (re(), ie("li", {
              class: de(e.classList.option(l)),
              "data-pointed": e.isPointed(l),
              "data-selected": e.isSelected(l) || void 0,
              key: p,
              onMouseenter: (y) => e.setPointer(l),
              onMousedown: Vt((y) => e.handleOptionClick(l), ["prevent"]),
              id: e.ariaOptionId(l),
              "aria-selected": e.isSelected(l),
              "aria-label": e.ariaOptionLabel(e.localize(l[t.label])),
              role: "option"
            }, [
              Be(e.$slots, "option", {
                option: l,
                isSelected: e.isSelected,
                isPointed: e.isPointed,
                search: e.search
              }, () => [
                $(
                  "span",
                  null,
                  Ce(e.localize(l[t.label])),
                  1
                  /* TEXT */
                )
              ])
            ], 42, Mi))),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 10, Li),
        e.noOptions ? Be(e.$slots, "nooptions", { key: 0 }, () => [
          $("div", {
            class: de(e.classList.noOptions),
            innerHTML: e.localize(t.noOptionsText)
          }, null, 10, Vi)
        ]) : oe("v-if", !0),
        e.noResults ? Be(e.$slots, "noresults", { key: 1 }, () => [
          $("div", {
            class: de(e.classList.noResults),
            innerHTML: e.localize(t.noResultsText)
          }, null, 10, Ri)
        ]) : oe("v-if", !0),
        t.infinite && e.hasMore ? (re(), ie(
          "div",
          {
            key: 2,
            class: de(e.classList.inifinite),
            ref: "infiniteLoader"
          },
          [
            Be(e.$slots, "infinite", {}, () => [
              $(
                "span",
                {
                  class: de(e.classList.inifiniteSpinner)
                },
                null,
                2
                /* CLASS */
              )
            ])
          ],
          2
          /* CLASS */
        )) : oe("v-if", !0),
        Be(e.$slots, "afterlist", { options: e.fo })
      ], 42, Ci)
    ], 8, ["to", "disabled"])),
    oe(" Hacky input element to show HTML5 required warning "),
    t.required ? (re(), ie("input", {
      key: 0,
      class: de(e.classList.fakeInput),
      tabindex: "-1",
      value: e.textValue,
      required: ""
    }, null, 10, ji)) : oe("v-if", !0),
    oe(" Native input support "),
    t.nativeSupport ? (re(), ie(
      st,
      { key: 1 },
      [
        t.mode == "single" ? (re(), ie("input", {
          key: 0,
          type: "hidden",
          name: t.name,
          value: e.plainValue !== void 0 ? e.plainValue : ""
        }, null, 8, qi)) : (re(!0), ie(
          st,
          { key: 1 },
          pt(e.plainValue, (l, d) => (re(), ie("input", {
            type: "hidden",
            name: `${t.name}[]`,
            value: l,
            key: d
          }, null, 8, Ii))),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      64
      /* STABLE_FRAGMENT */
    )) : oe("v-if", !0),
    oe(" Screen reader assistive text "),
    t.searchable && e.hasSelected ? (re(), ie("div", {
      key: 2,
      class: de(e.classList.assist),
      id: e.ariaAssist,
      "aria-hidden": "true"
    }, Ce(e.ariaLabel), 11, zi)) : oe("v-if", !0),
    oe(" Create height for empty input "),
    $(
      "div",
      {
        class: de(e.classList.spacer)
      },
      null,
      2
      /* CLASS */
    )
  ], 42, wi);
}
qa.render = Fi;
qa.__file = "src/Multiselect.vue";
const Ui = {
  name: "CompendiumBrowserPowers",
  props: ["tab"],
  // Imported components that need to be available in the <template>
  components: {
    Slider: Aa,
    Multiselect: qa
  },
  setup() {
    return {
      // Imported methods that need to be available in the <template>
      getActorModuleArt: Za,
      openDocument: qr,
      startDrag: Ir,
      // Foundry base props and methods.
      CONFIG,
      game
    };
  },
  data() {
    return {
      // Props used for infinite scroll and pagination.
      observer: null,
      loaded: !1,
      pager: {
        perPage: 50,
        firstIndex: 0,
        lastIndex: 50,
        totalRows: 0
      },
      // Sorting.
      sortBy: "name",
      sortOptions: [
        { value: "name", label: game.i18n.localize("Name") },
        { value: "cr", label: game.i18n.localize("Challenge Rating") },
        { value: "size", label: game.i18n.localize("Size") }
      ],
      // Our list of pseudo documents returned from the compendium.
      packIndex: [],
      // Filters.
      name: "",
      // @todo partial CRs like 1/4.
      crRange: [1, 30],
      size: []
    };
  },
  methods: {
    /**
     * Callback for the infinite scroll IntersectionObserver.
     *
     * @param {Array} List of IntersectionObserverEntry objects.
     */
    infiniteScroll(e) {
      e.forEach(({ target: a, isIntersecting: t }) => {
        t && (this.observer.unobserve(a), this.pager.lastIndex = Math.min(
          this.pager.lastIndex + this.pager.perPage,
          this.pager.totalRows
        ));
      });
    },
    /**
     * Click event to reset our filters.
     */
    resetFilters() {
      this.sortBy = "name", this.name = "", this.crRange = [1, 30], this.size = [];
    },
    /**
     * Get multiselect options.
     */
    getOptions(e) {
      const a = {};
      for (let [t, s] of Object.entries(e))
        a[t] = s.label;
      return a;
    }
  },
  computed: {
    entries() {
      let e = this.packIndex;
      if (e.length < 1)
        return this.pager.totalRows = 0, [];
      if (this.name && this.name.length > 0) {
        const a = this.name.toLocaleLowerCase();
        e = e.filter((t) => t.name.toLocaleLowerCase().includes(a));
      }
      return this.crRange.length == 2 && (e = e.filter(
        (a) => Number(a.system.details.cr) >= this.crRange[0] && Number(a.system.details.cr) <= this.crRange[1]
      )), Array.isArray(this.size) && this.size.length > 0 && (e = e.filter((a) => this.size.includes(a.system.traits.size))), e.length > this.pager.perPage ? (this.pager.totalRows = e.length, this.pager.lastIndex == 0 && (this.pager.lastIndex = this.pager.perPage - 1)) : this.pager.totalRows = 0, e = e.sort((a, t) => {
        switch (this.sortBy) {
          case "name":
            return a.name.localeCompare(t.name);
          case "size":
            return a.system.traits.size.localeCompare(t.system.traits.size);
        }
        return a.system.details.cr - t.system.details.cr;
      }), this.pager.totalRows > 0 ? e.slice(this.pager.firstIndex, this.pager.lastIndex) : e;
    }
  },
  watch: {},
  // Handle created hook.
  async created() {
    console.log("Creating compendium browser creatures tab..."), jr([
      "dnd5e.monsters"
      // insert additional packs as needed.
    ], [
      "img",
      "system.details.cr",
      "system.details.type",
      "system.traits.size"
      // insert additional properties as needed.
    ]).then((e) => {
      var a, t, s, n, m;
      if (!((t = (a = game.dnd5e) == null ? void 0 : a.moduleArt) != null && t.suppressArt) && ((m = (n = (s = game.dnd5e) == null ? void 0 : s.moduleArt) == null ? void 0 : n.map) == null ? void 0 : m.size) > 0)
        for (let l of e)
          l.img = Za(l);
      this.packIndex = e, this.loaded = !0;
    }), this.observer = new IntersectionObserver(this.infiniteScroll, {
      root: this.$el,
      threshold: 0.1
    });
  },
  // Handle mounted hook.
  async mounted() {
    console.log("Compendium browser creatures tab mounted."), this.tab.opened = !0, Br(() => {
      const e = document.querySelector(".compendium-browser-npcs .compendium-browser-row-observe");
      e && this.observer.observe(e);
    });
  },
  // Handle the unmount hook.
  async beforeUnmount() {
    this.observer.disconnect();
  }
}, Hi = { class: "npc-browser browser flexrow" }, Wi = { class: "control-area" }, _i = { class: "filtercontainer" }, $i = { class: "filter" }, Gi = {
  class: "unit-title",
  for: "compendiumBrowser.name"
}, Ki = { class: "sorter" }, Xi = ["value"], Yi = { class: "filtercontainer" }, Ji = { class: "filter" }, Qi = {
  class: "unit-title",
  for: "compendiumBrowser.level"
}, Zi = { class: "level-range flexrow" }, el = { class: "level-label" }, tl = { key: 0 }, al = { class: "level-input slider-wrapper flexrow" }, rl = { class: "filter" }, nl = {
  class: "unit-title",
  for: "compendiumBrowser.size"
}, il = { class: "list-area flexcol" }, ll = {
  key: 0,
  class: "compendium-browser-results compendium-browser-npcs"
}, sl = ["data-document-id", "onClick", "onDragstart"], ol = { class: "npc-image" }, ul = ["src"], cl = { class: "npc-line" }, dl = { class: "npc-name" }, fl = { class: "npc-tags" }, pl = ["data-tooltip"], vl = { class: "size" }, hl = { class: "type" }, ml = {
  key: 1,
  class: "compendium-browser-loading"
}, gl = /* @__PURE__ */ $("p", null, [
  /* @__PURE__ */ $("i", { class: "fas fa-circle-notch fa-spin" }),
  /* @__PURE__ */ La("Please wait, loading...")
], -1), bl = [
  gl
];
function yl(e, a, t, s, n, m) {
  const l = Rt("Slider"), d = Rt("Multiselect");
  return re(), ie("div", Hi, [
    $("section", Wi, [
      $("div", _i, [
        $("div", $i, [
          $("label", Gi, Ce(s.game.i18n.localize("Name")), 1),
          Qa($("input", {
            type: "text",
            name: "compendiumBrowser.name",
            "onUpdate:modelValue": a[0] || (a[0] = (p) => n.name = p),
            placeholder: "Hydra"
          }, null, 512), [
            [Mr, n.name]
          ])
        ]),
        $("dl", Ki, [
          $("dt", null, Ce(s.game.i18n.localize("Sort by:")), 1),
          $("dd", null, [
            Qa($("select", {
              class: "sort",
              name: "sortorder",
              "onUpdate:modelValue": a[1] || (a[1] = (p) => n.sortBy = p)
            }, [
              (re(!0), ie(st, null, pt(n.sortOptions, (p, y) => (re(), ie("option", {
                key: y,
                value: p.value
              }, Ce(p.label), 9, Xi))), 128))
            ], 512), [
              [Vr, n.sortBy]
            ])
          ])
        ]),
        $("button", {
          type: "reset",
          onClick: a[2] || (a[2] = (p) => m.resetFilters())
        }, Ce(s.game.i18n.localize("Reset Filters")), 1)
      ]),
      $("div", Yi, [
        $("h3", null, Ce(s.game.i18n.localize("General")), 1),
        $("div", Ji, [
          $("dt", Qi, Ce(s.game.i18n.localize("Challenge Rating")), 1),
          $("div", Zi, [
            $("div", el, [
              $("span", null, Ce(n.crRange[0]), 1),
              n.crRange[0] !== n.crRange[1] ? (re(), ie("span", tl, " - " + Ce(n.crRange[1]), 1)) : oe("", !0)
            ]),
            $("div", al, [
              ft(l, {
                modelValue: n.crRange,
                "onUpdate:modelValue": a[3] || (a[3] = (p) => n.crRange = p),
                min: 1,
                max: 30,
                tooltips: !1
              }, null, 8, ["modelValue"])
            ])
          ])
        ]),
        $("div", rl, [
          $("dt", nl, Ce(s.game.i18n.localize("Size")), 1),
          $("dd", null, [
            ft(d, {
              modelValue: n.size,
              "onUpdate:modelValue": a[4] || (a[4] = (p) => n.size = p),
              mode: "tags",
              searchable: !1,
              "create-option": !1,
              options: m.getOptions(s.CONFIG.DND5E.actorSizes)
            }, null, 8, ["modelValue", "options"])
          ])
        ])
      ])
    ]),
    $("div", il, [
      n.loaded ? (re(), ie("ul", ll, [
        (re(!0), ie(st, null, pt(m.entries, (p, y) => (re(), ie("li", {
          key: y,
          class: de(`npc flexrow draggable compendium-browser-row${y >= n.pager.lastIndex - 1 && y < n.pager.totalRows - 1 ? " compendium-browser-row-observe" : ""} document actor`),
          "data-document-id": p._id,
          onClick: (v) => s.openDocument(p.uuid),
          onDragstart: (v) => s.startDrag(v, p, "Actor"),
          draggable: "true"
        }, [
          $("div", ol, [
            $("img", {
              src: p.img ?? "icons/svg/mystery-man.svg"
            }, null, 8, ul)
          ]),
          $("div", cl, [
            $("div", dl, [
              $("a", null, Ce(p.name), 1)
            ]),
            $("div", fl, [
              $("span", {
                class: "cr",
                "data-tooltip": s.game.i18n.localize("Challenge rating")
              }, Ce(p.system.details.cr), 9, pl),
              $("span", vl, Ce(p.system.traits.size), 1),
              $("span", hl, Ce(p.system.details.type.value), 1)
            ])
          ])
        ], 42, sl))), 128))
      ])) : (re(), ie("div", ml, bl))
    ])
  ]);
}
const wl = /* @__PURE__ */ ea(Ui, [["render", yl]]), Sl = {
  name: "ArchmageCompendiumBrowser",
  props: ["context"],
  components: {
    Tabs: _r,
    Tab: Xr,
    Stub: Qr,
    CompendiumBrowserCreatures: wl
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
    var e, a, t;
    return {
      // The only variable we actually need to track is the active tab.
      tabs: {
        primary: {
          // Default tab is assigned in the flags() computed property.
          creatures: {
            key: "creatures",
            label: game.i18n.localize("CMPBrowser.Tab.NPCBrowser"),
            active: ((e = this.context) == null ? void 0 : e.defaultTab) === "creatures",
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
            active: ((t = this.context) == null ? void 0 : t.defaultTab) === "items",
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
}, Ol = { class: "compendium-browser-vue parent flexcol" }, xl = { class: "content" };
function El(e, a, t, s, n, m) {
  const l = Rt("Tabs"), d = Rt("CompendiumBrowserCreatures"), p = Rt("Tab"), y = Rt("Stub");
  return re(), ie("div", Ol, [
    ft(l, {
      group: "primary",
      tabs: n.tabs.primary
    }, null, 8, ["tabs"]),
    $("section", xl, [
      ft(p, {
        group: "primary",
        tab: n.tabs.primary.creatures,
        classes: "container container--bottom flexrow"
      }, {
        default: Kt(() => [
          n.tabs.primary.creatures.active || n.tabs.primary.creatures.opened ? (re(), ur(d, {
            key: 0,
            tab: n.tabs.primary.creatures
          }, null, 8, ["tab"])) : oe("", !0)
        ]),
        _: 1
      }, 8, ["tab"]),
      ft(p, {
        group: "primary",
        tab: n.tabs.primary.powers,
        classes: "container container--bottom flexrow"
      }, {
        default: Kt(() => [
          ft(y, null, {
            default: Kt(() => [
              La("Spells")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      ft(p, {
        group: "primary",
        tab: n.tabs.primary.items,
        classes: "container container--bottom flexrow"
      }, {
        default: Kt(() => [
          ft(y, null, {
            default: Kt(() => [
              La("Items")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"])
    ])
  ]);
}
const Pl = /* @__PURE__ */ ea(Sl, [["render", El]]);
export {
  Pl as VueCompendiumBrowser
};
//# sourceMappingURL=components.vue.es.js.map
