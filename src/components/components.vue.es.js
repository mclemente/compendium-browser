import { openBlock as ne, createElementBlock as le, normalizeClass as de, Fragment as ot, renderList as ft, createCommentVNode as ue, toDisplayString as Ve, renderSlot as Ne, toRefs as Be, ref as he, computed as _, onMounted as pa, onUnmounted as Ar, watch as ge, mergeProps as ua, createElementVNode as Q, withModifiers as Mt, withKeys as Ja, createBlock as ur, Teleport as Dr, getCurrentInstance as Qt, nextTick as Xt, onBeforeUnmount as Nr, onUpdated as Br, withDirectives as Qa, vModelText as Mr, vModelSelect as Vr, createTextVNode as La, resolveComponent as la, createVNode as Vt, withCtx as _t } from "../lib/vue.esm-browser.js";
function jr(...e) {
  return e.reduce((a, t) => a + t, "");
}
function Za(e) {
  const a = e.uuid.replace(".Actor", ""), t = game.dnd5e.moduleArt.map.get(a);
  return (t == null ? void 0 : t.actor) ?? e.img;
}
async function qr(e = [], a = []) {
  if (!e || !a || a.length < 1)
    return;
  let t = [];
  for (let s of e) {
    const h = await game.packs.get(s).getIndex({ fields: a });
    t = t.concat(h.contents);
  }
  return t;
}
function Rr(e, a = "Actor") {
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
const Zt = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [s, i] of a)
    t[s] = i;
  return t;
}, Fr = {
  name: "Tabs",
  props: ["context", "actor", "group", "tabs", "flags"],
  setup() {
    return { concat: jr };
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
}, zr = ["data-group"], Ur = ["data-tab"], Hr = { key: 1 };
function $r(e, a, t, s, i, h) {
  return ne(), le("nav", {
    class: de(`tabs tabs--${t.group}`),
    "data-group": t.group
  }, [
    (ne(!0), le(ot, null, ft(t.tabs, (n, d) => (ne(), le("span", {
      key: "tab-" + t.group + "-" + d
    }, [
      n.hidden ? ue("", !0) : (ne(), le("a", {
        key: 0,
        onClick: a[0] || (a[0] = (...m) => h.changeTab && h.changeTab(...m)),
        class: de(h.getTabClass(n, d)),
        "data-tab": d
      }, [
        n.icon ? (ne(), le("i", {
          key: 0,
          class: de(s.concat("fas ", n.icon))
        }, null, 2)) : ue("", !0),
        n.hideLabel ? ue("", !0) : (ne(), le("span", Hr, Ve(n.label), 1))
      ], 10, Ur))
    ]))), 128))
  ], 10, zr);
}
const Wr = /* @__PURE__ */ Zt(Fr, [["render", $r]]), Gr = {
  name: "Tab",
  props: ["context", "actor", "tab", "group", "classes"]
}, _r = ["data-group", "data-tab"];
function Kr(e, a, t, s, i, h) {
  return ne(), le("div", {
    class: de("tab " + t.tab.key + (t.tab.active ? " active" : "") + (t.classes ? " " + t.classes : "")),
    "data-group": t.group,
    "data-tab": t.tab.key
  }, [
    Ne(e.$slots, "default")
  ], 10, _r);
}
const Xr = /* @__PURE__ */ Zt(Gr, [["render", Kr]]), Yr = {
  name: "Stub",
  props: ["context"]
};
function Jr(e, a, t, s, i, h) {
  return ne(), le("h1", null, [
    Ne(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Qr = /* @__PURE__ */ Zt(Yr, [["render", Jr], ["__scopeId", "data-v-ceecbcd3"]]);
function oa(e) {
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
    function i(g, y) {
      return g.substring(0, y.length) === y;
    }
    function h(g, y) {
      return g.slice(-1 * y.length) === y;
    }
    function n(g, y, S) {
      if ((g[y] || g[S]) && g[y] === g[S])
        throw new Error(y);
    }
    function d(g) {
      return typeof g == "number" && isFinite(g);
    }
    function m(g, y) {
      return g = g.toString().split("e"), (+((g = (g = Math.round(+(g[0] + "e" + (g[1] ? +g[1] + y : y)))).toString().split("e"))[0] + "e" + (g[1] ? +g[1] - y : -y))).toFixed(y);
    }
    function w(g, y, S, P, V, b, D, j, k, U, z, A) {
      var Y, K, N, H = A, re = "", G = "";
      return b && (A = b(A)), !!d(A) && (g !== !1 && parseFloat(A.toFixed(g)) === 0 && (A = 0), A < 0 && (Y = !0, A = Math.abs(A)), g !== !1 && (A = m(A, g)), (A = A.toString()).indexOf(".") !== -1 ? (N = (K = A.split("."))[0], S && (re = S + K[1])) : N = A, y && (N = s(N).match(/.{1,3}/g), N = s(N.join(s(y)))), Y && j && (G += j), P && (G += P), Y && k && (G += k), G += N, G += re, V && (G += V), U && (G = U(G, H)), G);
    }
    function p(g, y, S, P, V, b, D, j, k, U, z, A) {
      var Y, K = "";
      return z && (A = z(A)), !(!A || typeof A != "string") && (j && i(A, j) && (A = A.replace(j, ""), Y = !0), P && i(A, P) && (A = A.replace(P, "")), k && i(A, k) && (A = A.replace(k, ""), Y = !0), V && h(A, V) && (A = A.slice(0, -1 * V.length)), y && (A = A.split(y).join("")), S && (A = A.replace(S, ".")), Y && (K += "-"), (K = (K += A).replace(/[^0-9\.\-.]/g, "")) !== "" && (K = Number(K), D && (K = D(K)), !!d(K) && K));
    }
    function x(g) {
      var y, S, P, V = {};
      for (g.suffix === void 0 && (g.suffix = g.postfix), y = 0; y < t.length; y += 1)
        if ((P = g[S = t[y]]) === void 0)
          S !== "negative" || V.negativeBefore ? S === "mark" && V.thousand !== "." ? V[S] = "." : V[S] = !1 : V[S] = "-";
        else if (S === "decimals") {
          if (!(P >= 0 && P < 8))
            throw new Error(S);
          V[S] = P;
        } else if (S === "encoder" || S === "decoder" || S === "edit" || S === "undo") {
          if (typeof P != "function")
            throw new Error(S);
          V[S] = P;
        } else {
          if (typeof P != "string")
            throw new Error(S);
          V[S] = P;
        }
      return n(V, "mark", "thousand"), n(V, "prefix", "negative"), n(V, "prefix", "negativeBefore"), V;
    }
    function T(g, y, S) {
      var P, V = [];
      for (P = 0; P < t.length; P += 1)
        V.push(g[t[P]]);
      return V.push(S), y.apply("", V);
    }
    function E(g) {
      if (!(this instanceof E))
        return new E(g);
      typeof g == "object" && (g = x(g), this.to = function(y) {
        return T(g, w, y);
      }, this.from = function(y) {
        return T(g, p, y);
      });
    }
    return E;
  }();
}), en = Zr(cr(function(e, a) {
  (function(t) {
    function s(o) {
      return i(o) && typeof o.from == "function";
    }
    function i(o) {
      return typeof o == "object" && typeof o.to == "function";
    }
    function h(o) {
      o.parentElement.removeChild(o);
    }
    function n(o) {
      return o != null;
    }
    function d(o) {
      o.preventDefault();
    }
    function m(o) {
      return o.filter(function(r) {
        return !this[r] && (this[r] = !0);
      }, {});
    }
    function w(o, r) {
      return Math.round(o / r) * r;
    }
    function p(o, r) {
      var L = o.getBoundingClientRect(), F = o.ownerDocument, B = F.documentElement, $ = b(F);
      return /webkit.*Chrome.*Mobile/i.test(navigator.userAgent) && ($.x = 0), r ? L.top + $.y - B.clientTop : L.left + $.x - B.clientLeft;
    }
    function x(o) {
      return typeof o == "number" && !isNaN(o) && isFinite(o);
    }
    function T(o, r, L) {
      L > 0 && (S(o, r), setTimeout(function() {
        P(o, r);
      }, L));
    }
    function E(o) {
      return Math.max(Math.min(o, 100), 0);
    }
    function g(o) {
      return Array.isArray(o) ? o : [o];
    }
    function y(o) {
      var r = (o = String(o)).split(".");
      return r.length > 1 ? r[1].length : 0;
    }
    function S(o, r) {
      o.classList && !/\s/.test(r) ? o.classList.add(r) : o.className += " " + r;
    }
    function P(o, r) {
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
    function j() {
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
    function k() {
      return window.CSS && CSS.supports && CSS.supports("touch-action", "none");
    }
    function U(o, r) {
      return 100 / (r - o);
    }
    function z(o, r, L) {
      return 100 * r / (o[L + 1] - o[L]);
    }
    function A(o, r) {
      return z(o, o[0] < 0 ? r + Math.abs(o[0]) : r - o[0], 0);
    }
    function Y(o, r) {
      return r * (o[1] - o[0]) / 100 + o[0];
    }
    function K(o, r) {
      for (var L = 1; o >= r[L]; )
        L += 1;
      return L;
    }
    function N(o, r, L) {
      if (L >= o.slice(-1)[0])
        return 100;
      var F = K(L, o), B = o[F - 1], $ = o[F], se = r[F - 1], xe = r[F];
      return se + A([B, $], L) / U(se, xe);
    }
    function H(o, r, L) {
      if (L >= 100)
        return o.slice(-1)[0];
      var F = K(L, r), B = o[F - 1], $ = o[F], se = r[F - 1];
      return Y([B, $], (L - se) * U(se, r[F]));
    }
    function re(o, r, L, F) {
      if (F === 100)
        return F;
      var B = K(F, o), $ = o[B - 1], se = o[B];
      return L ? F - $ > (se - $) / 2 ? se : $ : r[B - 1] ? o[B - 1] + w(F - o[B - 1], r[B - 1]) : F;
    }
    var G, ee;
    t.PipsMode = void 0, (ee = t.PipsMode || (t.PipsMode = {})).Range = "range", ee.Steps = "steps", ee.Positions = "positions", ee.Count = "count", ee.Values = "values", t.PipsType = void 0, (G = t.PipsType || (t.PipsType = {}))[G.None = -1] = "None", G[G.NoValue = 0] = "NoValue", G[G.LargeValue = 1] = "LargeValue", G[G.SmallValue = 2] = "SmallValue";
    var oe = function() {
      function o(r, L, F) {
        var B;
        this.xPct = [], this.xVal = [], this.xSteps = [], this.xNumSteps = [], this.xHighestCompleteStep = [], this.xSteps = [F || !1], this.xNumSteps = [!1], this.snap = L;
        var $ = [];
        for (Object.keys(r).forEach(function(se) {
          $.push([g(r[se]), se]);
        }), $.sort(function(se, xe) {
          return se[0][0] - xe[0][0];
        }), B = 0; B < $.length; B++)
          this.handleEntryPoint($[B][1], $[B][0]);
        for (this.xNumSteps = this.xSteps.slice(0), B = 0; B < this.xNumSteps.length; B++)
          this.handleStepPoint(B, this.xNumSteps[B]);
      }
      return o.prototype.getDistance = function(r) {
        for (var L = [], F = 0; F < this.xNumSteps.length - 1; F++)
          L[F] = z(this.xVal, r, F);
        return L;
      }, o.prototype.getAbsoluteDistance = function(r, L, F) {
        var B, $ = 0;
        if (r < this.xPct[this.xPct.length - 1])
          for (; r > this.xPct[$ + 1]; )
            $++;
        else
          r === this.xPct[this.xPct.length - 1] && ($ = this.xPct.length - 2);
        F || r !== this.xPct[$ + 1] || $++, L === null && (L = []);
        var se = 1, xe = L[$], ye = 0, Me = 0, me = 0, J = 0;
        for (B = F ? (r - this.xPct[$]) / (this.xPct[$ + 1] - this.xPct[$]) : (this.xPct[$ + 1] - r) / (this.xPct[$ + 1] - this.xPct[$]); xe > 0; )
          ye = this.xPct[$ + 1 + J] - this.xPct[$ + J], L[$ + J] * se + 100 - 100 * B > 100 ? (Me = ye * B, se = (xe - 100 * B) / L[$ + J], B = 1) : (Me = L[$ + J] * ye / 100 * se, se = 0), F ? (me -= Me, this.xPct.length + J >= 1 && J--) : (me += Me, this.xPct.length - J >= 1 && J++), xe = L[$ + J] * se;
        return r + me;
      }, o.prototype.toStepping = function(r) {
        return r = N(this.xVal, this.xPct, r);
      }, o.prototype.fromStepping = function(r) {
        return H(this.xVal, this.xPct, r);
      }, o.prototype.getStep = function(r) {
        return r = re(this.xPct, this.xSteps, this.snap, r);
      }, o.prototype.getDefaultStep = function(r, L, F) {
        var B = K(r, this.xPct);
        return (r === 100 || L && r === this.xPct[B - 1]) && (B = Math.max(B - 1, 1)), (this.xVal[B] - this.xVal[B - 1]) / F;
      }, o.prototype.getNearbySteps = function(r) {
        var L = K(r, this.xPct);
        return { stepBefore: { startValue: this.xVal[L - 2], step: this.xNumSteps[L - 2], highestStep: this.xHighestCompleteStep[L - 2] }, thisStep: { startValue: this.xVal[L - 1], step: this.xNumSteps[L - 1], highestStep: this.xHighestCompleteStep[L - 1] }, stepAfter: { startValue: this.xVal[L], step: this.xNumSteps[L], highestStep: this.xHighestCompleteStep[L] } };
      }, o.prototype.countStepDecimals = function() {
        var r = this.xNumSteps.map(y);
        return Math.max.apply(null, r);
      }, o.prototype.hasNoSize = function() {
        return this.xVal[0] === this.xVal[this.xVal.length - 1];
      }, o.prototype.convert = function(r) {
        return this.getStep(this.toStepping(r));
      }, o.prototype.handleEntryPoint = function(r, L) {
        var F;
        if (!x(F = r === "min" ? 0 : r === "max" ? 100 : parseFloat(r)) || !x(L[0]))
          throw new Error("noUiSlider: 'range' value isn't numeric.");
        this.xPct.push(F), this.xVal.push(L[0]);
        var B = Number(L[1]);
        F ? this.xSteps.push(!isNaN(B) && B) : isNaN(B) || (this.xSteps[0] = B), this.xHighestCompleteStep.push(0);
      }, o.prototype.handleStepPoint = function(r, L) {
        if (L)
          if (this.xVal[r] !== this.xVal[r + 1]) {
            this.xSteps[r] = z([this.xVal[r], this.xVal[r + 1]], L, 0) / U(this.xPct[r], this.xPct[r + 1]);
            var F = (this.xVal[r + 1] - this.xVal[r]) / this.xNumSteps[r], B = Math.ceil(Number(F.toFixed(3)) - 1), $ = this.xVal[r] + this.xNumSteps[r] * B;
            this.xHighestCompleteStep[r] = $;
          } else
            this.xSteps[r] = this.xHighestCompleteStep[r] = this.xVal[r];
      }, o;
    }(), Te = { to: function(o) {
      return o === void 0 ? "" : o.toFixed(2);
    }, from: Number }, X = { target: "target", base: "base", origin: "origin", handle: "handle", handleLower: "handle-lower", handleUpper: "handle-upper", touchArea: "touch-area", horizontal: "horizontal", vertical: "vertical", background: "background", connect: "connect", connects: "connects", ltr: "ltr", rtl: "rtl", textDirectionLtr: "txt-dir-ltr", textDirectionRtl: "txt-dir-rtl", draggable: "draggable", drag: "state-drag", tap: "state-tap", active: "active", tooltip: "tooltip", pips: "pips", pipsHorizontal: "pips-horizontal", pipsVertical: "pips-vertical", marker: "marker", markerHorizontal: "marker-horizontal", markerVertical: "marker-vertical", markerNormal: "marker-normal", markerLarge: "marker-large", markerSub: "marker-sub", value: "value", valueHorizontal: "value-horizontal", valueVertical: "value-vertical", valueNormal: "value-normal", valueLarge: "value-large", valueSub: "value-sub" }, Z = { tooltips: ".__tooltips", aria: ".__aria" };
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
    function Ce(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'keyboardMultiplier' is not numeric.");
      o.keyboardMultiplier = r;
    }
    function ce(o, r) {
      if (!x(r))
        throw new Error("noUiSlider: 'keyboardDefaultStep' is not numeric.");
      o.keyboardDefaultStep = r;
    }
    function W(o, r) {
      if (typeof r != "object" || Array.isArray(r))
        throw new Error("noUiSlider: 'range' is not an object.");
      if (r.min === void 0 || r.max === void 0)
        throw new Error("noUiSlider: Missing 'min' or 'max' in 'range'.");
      o.spectrum = new oe(r, o.snap || !1, o.singleStep);
    }
    function v(o, r) {
      if (r = g(r), !Array.isArray(r) || !r.length)
        throw new Error("noUiSlider: 'start' option is incorrect.");
      o.handles = r.length, o.start = r;
    }
    function q(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'snap' option must be a boolean.");
      o.snap = r;
    }
    function be(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'animate' option must be a boolean.");
      o.animate = r;
    }
    function je(o, r) {
      if (typeof r != "number")
        throw new Error("noUiSlider: 'animationDuration' option must be a number.");
      o.animationDuration = r;
    }
    function mt(o, r) {
      var L, F = [!1];
      if (r === "lower" ? r = [!0, !1] : r === "upper" && (r = [!1, !0]), r === !0 || r === !1) {
        for (L = 1; L < o.handles; L++)
          F.push(r);
        F.push(!1);
      } else {
        if (!Array.isArray(r) || !r.length || r.length !== o.handles + 1)
          throw new Error("noUiSlider: 'connect' option doesn't match handle count.");
        F = r;
      }
      o.connect = F;
    }
    function gt(o, r) {
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
    function Et(o, r) {
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
        var F = r[0] + r[1], B = o.spectrum.xVal[0];
        if (F / (o.spectrum.xVal[o.spectrum.xVal.length - 1] - B) > 1)
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
      var L = r.indexOf("tap") >= 0, F = r.indexOf("drag") >= 0, B = r.indexOf("fixed") >= 0, $ = r.indexOf("snap") >= 0, se = r.indexOf("hover") >= 0, xe = r.indexOf("unconstrained") >= 0, ye = r.indexOf("drag-all") >= 0, Me = r.indexOf("smooth-steps") >= 0;
      if (B) {
        if (o.handles !== 2)
          throw new Error("noUiSlider: 'fixed' behaviour must be used with 2 handles");
        Ke(o, o.start[1] - o.start[0]);
      }
      if (xe && (o.margin || o.limit))
        throw new Error("noUiSlider: 'unconstrained' behaviour cannot be used with margin or limit");
      o.events = { tap: L || $, drag: F, dragAll: ye, smoothSteps: Me, fixed: B, snap: $, hover: se, unconstrained: xe };
    }
    function Ze(o, r) {
      if (r !== !1)
        if (r === !0 || i(r)) {
          o.tooltips = [];
          for (var L = 0; L < o.handles; L++)
            o.tooltips.push(r);
        } else {
          if ((r = g(r)).length !== o.handles)
            throw new Error("noUiSlider: must pass a formatter for all handles.");
          r.forEach(function(F) {
            if (typeof F != "boolean" && !i(F))
              throw new Error("noUiSlider: 'tooltips' must be passed a formatter or 'false'.");
          }), o.tooltips = r;
        }
    }
    function We(o, r) {
      if (r.length !== o.handles)
        throw new Error("noUiSlider: must pass a attributes for all handles.");
      o.handleAttributes = r;
    }
    function Re(o, r) {
      if (!i(r))
        throw new Error("noUiSlider: 'ariaFormat' requires 'to' method.");
      o.ariaFormat = r;
    }
    function Fe(o, r) {
      if (!s(r))
        throw new Error("noUiSlider: 'format' requires 'to' and 'from' methods.");
      o.format = r;
    }
    function Xe(o, r) {
      if (typeof r != "boolean")
        throw new Error("noUiSlider: 'keyboardSupport' option must be a boolean.");
      o.keyboardSupport = r;
    }
    function bt(o, r) {
      o.documentElement = r;
    }
    function kt(o, r) {
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
      var r = { margin: null, limit: null, padding: null, animate: !0, animationDuration: 300, ariaFormat: Te, format: Te }, L = { step: { r: !1, t: te }, keyboardPageMultiplier: { r: !1, t: pe }, keyboardMultiplier: { r: !1, t: Ce }, keyboardDefaultStep: { r: !1, t: ce }, start: { r: !0, t: v }, connect: { r: !0, t: mt }, direction: { r: !0, t: Qe }, snap: { r: !1, t: q }, animate: { r: !1, t: be }, animationDuration: { r: !1, t: je }, range: { r: !0, t: W }, orientation: { r: !1, t: gt }, margin: { r: !1, t: Ke }, limit: { r: !1, t: Et }, padding: { r: !1, t: Ft }, behaviour: { r: !0, t: Pt }, ariaFormat: { r: !1, t: Re }, format: { r: !1, t: Fe }, tooltips: { r: !1, t: Ze }, keyboardSupport: { r: !0, t: Xe }, documentElement: { r: !1, t: bt }, cssPrefix: { r: !0, t: kt }, cssClasses: { r: !0, t: Ie }, handleAttributes: { r: !1, t: We } }, F = { connect: !1, direction: "ltr", behaviour: "tap", orientation: "horizontal", keyboardSupport: !0, cssPrefix: "noUi-", cssClasses: X, keyboardPageMultiplier: 5, keyboardMultiplier: 1, keyboardDefaultStep: 10 };
      o.format && !o.ariaFormat && (o.ariaFormat = o.format), Object.keys(L).forEach(function(ye) {
        if (n(o[ye]) || F[ye] !== void 0)
          L[ye].t(r, n(o[ye]) ? o[ye] : F[ye]);
        else if (L[ye].r)
          throw new Error("noUiSlider: '" + ye + "' is required.");
      }), r.pips = o.pips;
      var B = document.createElement("div"), $ = B.style.msTransform !== void 0, se = B.style.transform !== void 0;
      r.transformRule = se ? "transform" : $ ? "msTransform" : "webkitTransform";
      var xe = [["left", "top"], ["right", "bottom"]];
      return r.style = xe[r.dir][r.ort], r;
    }
    function et(o, r, L) {
      var F, B, $, se, xe, ye = D(), Me = k() && j(), me = o, J = r.spectrum, Ge = [], we = [], De = [], ze = 0, Ue = {}, at = o.ownerDocument, Lt = r.documentElement || at.documentElement, yt = at.body, ga = at.dir === "rtl" || r.ort === 1 ? 0 : 100;
      function He(l, c) {
        var f = at.createElement("div");
        return c && S(f, c), l.appendChild(f), f;
      }
      function ba(l, c) {
        var f = He(l, r.cssClasses.origin), O = He(f, r.cssClasses.handle);
        if (He(O, r.cssClasses.touchArea), O.setAttribute("data-handle", String(c)), r.keyboardSupport && (O.setAttribute("tabindex", "0"), O.addEventListener("keydown", function(M) {
          return wr(M, c);
        })), r.handleAttributes !== void 0) {
          var R = r.handleAttributes[c];
          Object.keys(R).forEach(function(M) {
            O.setAttribute(M, R[M]);
          });
        }
        return O.setAttribute("role", "slider"), O.setAttribute("aria-orientation", r.ort ? "vertical" : "horizontal"), c === 0 ? S(O, r.cssClasses.handleLower) : c === r.handles - 1 && S(O, r.cssClasses.handleUpper), f;
      }
      function ea(l, c) {
        return !!c && He(l, r.cssClasses.connect);
      }
      function ya(l, c) {
        var f = He(c, r.cssClasses.connects);
        B = [], ($ = []).push(ea(f, l[0]));
        for (var O = 0; O < r.handles; O++)
          B.push(ba(c, O)), De[O] = O, $.push(ea(f, l[O + 1]));
      }
      function Ye(l) {
        return S(l, r.cssClasses.target), r.dir === 0 ? S(l, r.cssClasses.ltr) : S(l, r.cssClasses.rtl), r.ort === 0 ? S(l, r.cssClasses.horizontal) : S(l, r.cssClasses.vertical), S(l, getComputedStyle(l).direction === "rtl" ? r.cssClasses.textDirectionRtl : r.cssClasses.textDirectionLtr), He(l, r.cssClasses.base);
      }
      function wa(l, c) {
        return !(!r.tooltips || !r.tooltips[c]) && He(l.firstChild, r.cssClasses.tooltip);
      }
      function ta() {
        return me.hasAttribute("disabled");
      }
      function zt(l) {
        return B[l].hasAttribute("disabled");
      }
      function Ut() {
        xe && (Gt("update" + Z.tooltips), xe.forEach(function(l) {
          l && h(l);
        }), xe = null);
      }
      function Tt() {
        Ut(), xe = B.map(wa), Oa("update" + Z.tooltips, function(l, c, f) {
          if (xe && r.tooltips && xe[c] !== !1) {
            var O = l[c];
            r.tooltips[c] !== !0 && (O = r.tooltips[c].to(f[c])), xe[c].innerHTML = O;
          }
        });
      }
      function Ht() {
        Gt("update" + Z.aria), Oa("update" + Z.aria, function(l, c, f, O, R) {
          De.forEach(function(M) {
            var ae = B[M], I = ra(we, M, 0, !0, !0, !0), ke = ra(we, M, 100, !0, !0, !0), Ee = R[M], ve = String(r.ariaFormat.to(f[M]));
            I = J.fromStepping(I).toFixed(1), ke = J.fromStepping(ke).toFixed(1), Ee = J.fromStepping(Ee).toFixed(1), ae.children[0].setAttribute("aria-valuemin", I), ae.children[0].setAttribute("aria-valuemax", ke), ae.children[0].setAttribute("aria-valuenow", Ee), ae.children[0].setAttribute("aria-valuetext", ve);
          });
        });
      }
      function At(l) {
        if (l.mode === t.PipsMode.Range || l.mode === t.PipsMode.Steps)
          return J.xVal;
        if (l.mode === t.PipsMode.Count) {
          if (l.values < 2)
            throw new Error("noUiSlider: 'values' (>= 2) required for mode 'count'.");
          for (var c = l.values - 1, f = 100 / c, O = []; c--; )
            O[c] = c * f;
          return O.push(100), wt(O, l.stepped);
        }
        return l.mode === t.PipsMode.Positions ? wt(l.values, l.stepped) : l.mode === t.PipsMode.Values ? l.stepped ? l.values.map(function(R) {
          return J.fromStepping(J.getStep(J.toStepping(R)));
        }) : l.values : [];
      }
      function wt(l, c) {
        return l.map(function(f) {
          return J.fromStepping(c ? J.getStep(f) : f);
        });
      }
      function $t(l) {
        function c(Ee, ve) {
          return Number((Ee + ve).toFixed(7));
        }
        var f = At(l), O = {}, R = J.xVal[0], M = J.xVal[J.xVal.length - 1], ae = !1, I = !1, ke = 0;
        return (f = m(f.slice().sort(function(Ee, ve) {
          return Ee - ve;
        })))[0] !== R && (f.unshift(R), ae = !0), f[f.length - 1] !== M && (f.push(M), I = !0), f.forEach(function(Ee, ve) {
          var Oe, fe, Ae, qe, Le, Ga, Pa, _a, Ka, Xa, ka = Ee, Bt = f[ve + 1], Ya = l.mode === t.PipsMode.Steps;
          for (Ya && (Oe = J.xNumSteps[ve]), Oe || (Oe = Bt - ka), Bt === void 0 && (Bt = ka), Oe = Math.max(Oe, 1e-7), fe = ka; fe <= Bt; fe = c(fe, Oe)) {
            for (_a = (Le = (qe = J.toStepping(fe)) - ke) / (l.density || 1), Xa = Le / (Ka = Math.round(_a)), Ae = 1; Ae <= Ka; Ae += 1)
              O[(Ga = ke + Ae * Xa).toFixed(5)] = [J.fromStepping(Ga), 0];
            Pa = f.indexOf(fe) > -1 ? t.PipsType.LargeValue : Ya ? t.PipsType.SmallValue : t.PipsType.NoValue, !ve && ae && fe !== Bt && (Pa = 0), fe === Bt && I || (O[qe.toFixed(5)] = [fe, Pa]), ke = qe;
          }
        }), O;
      }
      function Sa(l, c, f) {
        var O, R, M = at.createElement("div"), ae = ((O = {})[t.PipsType.None] = "", O[t.PipsType.NoValue] = r.cssClasses.valueNormal, O[t.PipsType.LargeValue] = r.cssClasses.valueLarge, O[t.PipsType.SmallValue] = r.cssClasses.valueSub, O), I = ((R = {})[t.PipsType.None] = "", R[t.PipsType.NoValue] = r.cssClasses.markerNormal, R[t.PipsType.LargeValue] = r.cssClasses.markerLarge, R[t.PipsType.SmallValue] = r.cssClasses.markerSub, R), ke = [r.cssClasses.valueHorizontal, r.cssClasses.valueVertical], Ee = [r.cssClasses.markerHorizontal, r.cssClasses.markerVertical];
        function ve(fe, Ae) {
          var qe = Ae === r.cssClasses.value, Le = qe ? ae : I;
          return Ae + " " + (qe ? ke : Ee)[r.ort] + " " + Le[fe];
        }
        function Oe(fe, Ae, qe) {
          if ((qe = c ? c(Ae, qe) : qe) !== t.PipsType.None) {
            var Le = He(M, !1);
            Le.className = ve(qe, r.cssClasses.marker), Le.style[r.style] = fe + "%", qe > t.PipsType.NoValue && ((Le = He(M, !1)).className = ve(qe, r.cssClasses.value), Le.setAttribute("data-value", String(Ae)), Le.style[r.style] = fe + "%", Le.innerHTML = String(f.to(Ae)));
          }
        }
        return S(M, r.cssClasses.pips), S(M, r.ort === 0 ? r.cssClasses.pipsHorizontal : r.cssClasses.pipsVertical), Object.keys(l).forEach(function(fe) {
          Oe(fe, l[fe][0], l[fe][1]);
        }), M;
      }
      function dt() {
        se && (h(se), se = null);
      }
      function Dt(l) {
        dt();
        var c = $t(l), f = l.filter, O = l.format || { to: function(R) {
          return String(Math.round(R));
        } };
        return se = me.appendChild(Sa(c, f, O));
      }
      function u() {
        var l = F.getBoundingClientRect(), c = "offset" + ["Width", "Height"][r.ort];
        return r.ort === 0 ? l.width || F[c] : l.height || F[c];
      }
      function C(l, c, f, O) {
        var R = function(ae) {
          var I = ie(ae, O.pageOffset, O.target || c);
          return !!I && !(ta() && !O.doNotReject) && !(V(me, r.cssClasses.tap) && !O.doNotReject) && !(l === ye.start && I.buttons !== void 0 && I.buttons > 1) && (!O.hover || !I.buttons) && (Me || I.preventDefault(), I.calcPoint = I.points[r.ort], void f(I, O));
        }, M = [];
        return l.split(" ").forEach(function(ae) {
          c.addEventListener(ae, R, !!Me && { passive: !0 }), M.push([ae, R]);
        }), M;
      }
      function ie(l, c, f) {
        var O = l.type.indexOf("touch") === 0, R = l.type.indexOf("mouse") === 0, M = l.type.indexOf("pointer") === 0, ae = 0, I = 0;
        if (l.type.indexOf("MSPointer") === 0 && (M = !0), l.type === "mousedown" && !l.buttons && !l.touches)
          return !1;
        if (O) {
          var ke = function(Oe) {
            var fe = Oe.target;
            return fe === f || f.contains(fe) || l.composed && l.composedPath().shift() === f;
          };
          if (l.type === "touchstart") {
            var Ee = Array.prototype.filter.call(l.touches, ke);
            if (Ee.length > 1)
              return !1;
            ae = Ee[0].pageX, I = Ee[0].pageY;
          } else {
            var ve = Array.prototype.find.call(l.changedTouches, ke);
            if (!ve)
              return !1;
            ae = ve.pageX, I = ve.pageY;
          }
        }
        return c = c || b(at), (R || M) && (ae = l.clientX + c.x, I = l.clientY + c.y), l.pageOffset = c, l.points = [ae, I], l.cursor = R || M, l;
      }
      function Se(l) {
        var c = 100 * (l - p(F, r.ort)) / u();
        return c = E(c), r.dir ? 100 - c : c;
      }
      function lt(l) {
        var c = 100, f = !1;
        return B.forEach(function(O, R) {
          if (!zt(R)) {
            var M = we[R], ae = Math.abs(M - l);
            (ae < c || ae <= c && l > M || ae === 100 && c === 100) && (f = R, c = ae);
          }
        }), f;
      }
      function aa(l, c) {
        l.type === "mouseout" && l.target.nodeName === "HTML" && l.relatedTarget === null && Wt(l, c);
      }
      function Ia(l, c) {
        if (navigator.appVersion.indexOf("MSIE 9") === -1 && l.buttons === 0 && c.buttonsProperty !== 0)
          return Wt(l, c);
        var f = (r.dir ? -1 : 1) * (l.calcPoint - c.startCalcPoint);
        Fa(f > 0, 100 * f / c.baseSize, c.locations, c.handleNumbers, c.connect);
      }
      function Wt(l, c) {
        c.handle && (P(c.handle, r.cssClasses.active), ze -= 1), c.listeners.forEach(function(f) {
          Lt.removeEventListener(f[0], f[1]);
        }), ze === 0 && (P(me, r.cssClasses.drag), Ea(), l.cursor && (yt.style.cursor = "", yt.removeEventListener("selectstart", d))), r.events.smoothSteps && (c.handleNumbers.forEach(function(f) {
          St(f, we[f], !0, !0, !1, !1);
        }), c.handleNumbers.forEach(function(f) {
          Pe("update", f);
        })), c.handleNumbers.forEach(function(f) {
          Pe("change", f), Pe("set", f), Pe("end", f);
        });
      }
      function Nt(l, c) {
        if (!c.handleNumbers.some(zt)) {
          var f;
          c.handleNumbers.length === 1 && (f = B[c.handleNumbers[0]].children[0], ze += 1, S(f, r.cssClasses.active)), l.stopPropagation();
          var O = [], R = C(ye.move, Lt, Ia, { target: l.target, handle: f, connect: c.connect, listeners: O, startCalcPoint: l.calcPoint, baseSize: u(), pageOffset: l.pageOffset, handleNumbers: c.handleNumbers, buttonsProperty: l.buttons, locations: we.slice() }), M = C(ye.end, Lt, Wt, { target: l.target, handle: f, listeners: O, doNotReject: !0, handleNumbers: c.handleNumbers }), ae = C("mouseout", Lt, aa, { target: l.target, handle: f, listeners: O, doNotReject: !0, handleNumbers: c.handleNumbers });
          O.push.apply(O, R.concat(M, ae)), l.cursor && (yt.style.cursor = getComputedStyle(l.target).cursor, B.length > 1 && S(me, r.cssClasses.drag), yt.addEventListener("selectstart", d, !1)), c.handleNumbers.forEach(function(I) {
            Pe("start", I);
          });
        }
      }
      function br(l) {
        l.stopPropagation();
        var c = Se(l.calcPoint), f = lt(c);
        f !== !1 && (r.events.snap || T(me, r.cssClasses.tap, r.animationDuration), St(f, c, !0, !0), Ea(), Pe("slide", f, !0), Pe("update", f, !0), r.events.snap ? Nt(l, { handleNumbers: [f] }) : (Pe("change", f, !0), Pe("set", f, !0)));
      }
      function yr(l) {
        var c = Se(l.calcPoint), f = J.getStep(c), O = J.fromStepping(f);
        Object.keys(Ue).forEach(function(R) {
          R.split(".")[0] === "hover" && Ue[R].forEach(function(M) {
            M.call(ia, O);
          });
        });
      }
      function wr(l, c) {
        if (ta() || zt(c))
          return !1;
        var f = ["Left", "Right"], O = ["Down", "Up"], R = ["PageDown", "PageUp"], M = ["Home", "End"];
        r.dir && !r.ort ? f.reverse() : r.ort && !r.dir && (O.reverse(), R.reverse());
        var ae, I = l.key.replace("Arrow", ""), ke = I === R[0], Ee = I === R[1], ve = I === O[0] || I === f[0] || ke, Oe = I === O[1] || I === f[1] || Ee, fe = I === M[0], Ae = I === M[1];
        if (!(ve || Oe || fe || Ae))
          return !0;
        if (l.preventDefault(), Oe || ve) {
          var qe = ve ? 0 : 1, Le = Wa(c)[qe];
          if (Le === null)
            return !1;
          Le === !1 && (Le = J.getDefaultStep(we[c], ve, r.keyboardDefaultStep)), Le *= Ee || ke ? r.keyboardPageMultiplier : r.keyboardMultiplier, Le = Math.max(Le, 1e-7), Le *= ve ? -1 : 1, ae = Ge[c] + Le;
        } else
          ae = Ae ? r.spectrum.xVal[r.spectrum.xVal.length - 1] : r.spectrum.xVal[0];
        return St(c, J.toStepping(ae), !0, !0), Pe("slide", c), Pe("update", c), Pe("change", c), Pe("set", c), !1;
      }
      function Sr(l) {
        l.fixed || B.forEach(function(c, f) {
          C(ye.start, c.children[0], Nt, { handleNumbers: [f] });
        }), l.tap && C(ye.start, F, br, {}), l.hover && C(ye.move, F, yr, { hover: !0 }), l.drag && $.forEach(function(c, f) {
          if (c !== !1 && f !== 0 && f !== $.length - 1) {
            var O = B[f - 1], R = B[f], M = [c], ae = [O, R], I = [f - 1, f];
            S(c, r.cssClasses.draggable), l.fixed && (M.push(O.children[0]), M.push(R.children[0])), l.dragAll && (ae = B, I = De), M.forEach(function(ke) {
              C(ye.start, ke, Nt, { handles: ae, handleNumbers: I, connect: c });
            });
          }
        });
      }
      function Oa(l, c) {
        Ue[l] = Ue[l] || [], Ue[l].push(c), l.split(".")[0] === "update" && B.forEach(function(f, O) {
          Pe("update", O);
        });
      }
      function Or(l) {
        return l === Z.aria || l === Z.tooltips;
      }
      function Gt(l) {
        var c = l && l.split(".")[0], f = c ? l.substring(c.length) : l;
        Object.keys(Ue).forEach(function(O) {
          var R = O.split(".")[0], M = O.substring(R.length);
          c && c !== R || f && f !== M || Or(M) && f !== M || delete Ue[O];
        });
      }
      function Pe(l, c, f) {
        Object.keys(Ue).forEach(function(O) {
          var R = O.split(".")[0];
          l === R && Ue[O].forEach(function(M) {
            M.call(ia, Ge.map(r.format.to), c, Ge.slice(), f || !1, we.slice(), ia);
          });
        });
      }
      function ra(l, c, f, O, R, M, ae) {
        var I;
        return B.length > 1 && !r.events.unconstrained && (O && c > 0 && (I = J.getAbsoluteDistance(l[c - 1], r.margin, !1), f = Math.max(f, I)), R && c < B.length - 1 && (I = J.getAbsoluteDistance(l[c + 1], r.margin, !0), f = Math.min(f, I))), B.length > 1 && r.limit && (O && c > 0 && (I = J.getAbsoluteDistance(l[c - 1], r.limit, !1), f = Math.min(f, I)), R && c < B.length - 1 && (I = J.getAbsoluteDistance(l[c + 1], r.limit, !0), f = Math.max(f, I))), r.padding && (c === 0 && (I = J.getAbsoluteDistance(0, r.padding[0], !1), f = Math.max(f, I)), c === B.length - 1 && (I = J.getAbsoluteDistance(100, r.padding[1], !0), f = Math.min(f, I))), ae || (f = J.getStep(f)), !((f = E(f)) === l[c] && !M) && f;
      }
      function xa(l, c) {
        var f = r.ort;
        return (f ? c : l) + ", " + (f ? l : c);
      }
      function Fa(l, c, f, O, R) {
        var M = f.slice(), ae = O[0], I = r.events.smoothSteps, ke = [!l, l], Ee = [l, !l];
        O = O.slice(), l && O.reverse(), O.length > 1 ? O.forEach(function(Oe, fe) {
          var Ae = ra(M, Oe, M[Oe] + c, ke[fe], Ee[fe], !1, I);
          Ae === !1 ? c = 0 : (c = Ae - M[Oe], M[Oe] = Ae);
        }) : ke = Ee = [!0];
        var ve = !1;
        O.forEach(function(Oe, fe) {
          ve = St(Oe, f[Oe] + c, ke[fe], Ee[fe], !1, I) || ve;
        }), ve && (O.forEach(function(Oe) {
          Pe("update", Oe), Pe("slide", Oe);
        }), R != null && Pe("drag", ae));
      }
      function za(l, c) {
        return r.dir ? 100 - l - c : l;
      }
      function xr(l, c) {
        we[l] = c, Ge[l] = J.fromStepping(c);
        var f = "translate(" + xa(za(c, 0) - ga + "%", "0") + ")";
        B[l].style[r.transformRule] = f, Ua(l), Ua(l + 1);
      }
      function Ea() {
        De.forEach(function(l) {
          var c = we[l] > 50 ? -1 : 1, f = 3 + (B.length + c * l);
          B[l].style.zIndex = String(f);
        });
      }
      function St(l, c, f, O, R, M) {
        return R || (c = ra(we, l, c, f, O, !1, M)), c !== !1 && (xr(l, c), !0);
      }
      function Ua(l) {
        if ($[l]) {
          var c = 0, f = 100;
          l !== 0 && (c = we[l - 1]), l !== $.length - 1 && (f = we[l]);
          var O = f - c, R = "translate(" + xa(za(c, O) + "%", "0") + ")", M = "scale(" + xa(O / 100, "1") + ")";
          $[l].style[r.transformRule] = R + " " + M;
        }
      }
      function Ha(l, c) {
        return l === null || l === !1 || l === void 0 ? we[c] : (typeof l == "number" && (l = String(l)), (l = r.format.from(l)) !== !1 && (l = J.toStepping(l)), l === !1 || isNaN(l) ? we[c] : l);
      }
      function na(l, c, f) {
        var O = g(l), R = we[0] === void 0;
        c = c === void 0 || c, r.animate && !R && T(me, r.cssClasses.tap, r.animationDuration), De.forEach(function(I) {
          St(I, Ha(O[I], I), !0, !1, f);
        });
        var M = De.length === 1 ? 0 : 1;
        if (R && J.hasNoSize() && (f = !0, we[0] = 0, De.length > 1)) {
          var ae = 100 / (De.length - 1);
          De.forEach(function(I) {
            we[I] = I * ae;
          });
        }
        for (; M < De.length; ++M)
          De.forEach(function(I) {
            St(I, we[I], !0, !0, f);
          });
        Ea(), De.forEach(function(I) {
          Pe("update", I), O[I] !== null && c && Pe("set", I);
        });
      }
      function Er(l) {
        na(r.start, l);
      }
      function Pr(l, c, f, O) {
        if (!((l = Number(l)) >= 0 && l < De.length))
          throw new Error("noUiSlider: invalid handle number, got: " + l);
        St(l, Ha(c, l), !0, !0, O), Pe("update", l), f && Pe("set", l);
      }
      function $a(l) {
        if (l === void 0 && (l = !1), l)
          return Ge.length === 1 ? Ge[0] : Ge.slice(0);
        var c = Ge.map(r.format.to);
        return c.length === 1 ? c[0] : c;
      }
      function kr() {
        for (Gt(Z.aria), Gt(Z.tooltips), Object.keys(r.cssClasses).forEach(function(l) {
          P(me, r.cssClasses[l]);
        }); me.firstChild; )
          me.removeChild(me.firstChild);
        delete me.noUiSlider;
      }
      function Wa(l) {
        var c = we[l], f = J.getNearbySteps(c), O = Ge[l], R = f.thisStep.step, M = null;
        if (r.snap)
          return [O - f.stepBefore.startValue || null, f.stepAfter.startValue - O || null];
        R !== !1 && O + R > f.stepAfter.startValue && (R = f.stepAfter.startValue - O), M = O > f.thisStep.startValue ? f.thisStep.step : f.stepBefore.step !== !1 && O - f.stepBefore.highestStep, c === 100 ? R = null : c === 0 && (M = null);
        var ae = J.countStepDecimals();
        return R !== null && R !== !1 && (R = Number(R.toFixed(ae))), M !== null && M !== !1 && (M = Number(M.toFixed(ae))), [M, R];
      }
      function Cr() {
        return De.map(Wa);
      }
      function Lr(l, c) {
        var f = $a(), O = ["margin", "limit", "padding", "range", "animate", "snap", "step", "format", "pips", "tooltips"];
        O.forEach(function(M) {
          l[M] !== void 0 && (L[M] = l[M]);
        });
        var R = ct(L);
        O.forEach(function(M) {
          l[M] !== void 0 && (r[M] = R[M]);
        }), J = R.spectrum, r.margin = R.margin, r.limit = R.limit, r.padding = R.padding, r.pips ? Dt(r.pips) : dt(), r.tooltips ? Tt() : Ut(), we = [], na(n(l.start) ? l.start : f, c);
      }
      function Tr() {
        F = Ye(me), ya(r.connect, F), Sr(r.events), na(r.start), r.pips && Dt(r.pips), r.tooltips && Tt(), Ht();
      }
      Tr();
      var ia = { destroy: kr, steps: Cr, on: Oa, off: Gt, get: $a, set: na, setHandle: Pr, reset: Er, __moveHandles: function(l, c, f) {
        Fa(l, c, we, f);
      }, options: L, updateOptions: Lr, target: me, removePips: dt, removeTooltips: Ut, getPositions: function() {
        return we.slice();
      }, getTooltips: function() {
        return xe;
      }, getOrigins: function() {
        return B;
      }, pips: Dt };
      return ia;
    }
    function tt(o, r) {
      if (!o || !o.nodeName)
        throw new Error("noUiSlider: create requires a single element, got: " + o);
      if (o.noUiSlider)
        throw new Error("noUiSlider: Slider was already initialized.");
      var L = et(o, ct(r), r);
      return o.noUiSlider = L, L;
    }
    var Ct = { __spectrum: oe, cssClasses: X, create: tt };
    t.create = tt, t.cssClasses = X, t.default = Ct, Object.defineProperty(t, "__esModule", { value: !0 });
  })(a);
}));
function tr(e, a) {
  if (!Array.isArray(e) || !Array.isArray(a))
    return !1;
  const t = a.slice().sort();
  return e.length === a.length && e.slice().sort().every(function(s, i) {
    return s === t[i];
  });
}
var Ta = { name: "Slider", emits: ["input", "update:modelValue", "start", "slide", "drag", "update", "change", "set", "end"], props: { value: { validator: function(e) {
  return (a) => typeof a == "number" || a instanceof Array || a == null || a === !1;
}, required: !1 }, modelValue: { validator: function(e) {
  return (a) => typeof a == "number" || a instanceof Array || a == null || a === !1;
}, required: !1 }, id: { type: [String, Number], required: !1 }, disabled: { type: Boolean, required: !1, default: !1 }, min: { type: Number, required: !1, default: 0 }, max: { type: Number, required: !1, default: 100 }, step: { type: Number, required: !1, default: 1 }, orientation: { type: String, required: !1, default: "horizontal" }, direction: { type: String, required: !1, default: "ltr" }, tooltips: { type: Boolean, required: !1, default: !0 }, options: { type: Object, required: !1, default: () => ({}) }, merge: { type: Number, required: !1, default: -1 }, format: { type: [Object, Function, Boolean], required: !1, default: null }, classes: { type: Object, required: !1, default: () => ({}) }, showTooltip: { type: String, required: !1, default: "always" }, tooltipPosition: { type: String, required: !1, default: null }, lazy: { type: Boolean, required: !1, default: !0 }, ariaLabelledby: { type: String, required: !1, default: void 0 }, aria: { required: !1, type: Object, default: () => ({}) } }, setup(e, a) {
  const t = function(n, d, m) {
    const { value: w, modelValue: p, min: x } = Be(n);
    let T = p && p.value !== void 0 ? p : w;
    const E = he(T.value);
    if (oa(T.value) && (T = he(x.value)), Array.isArray(T.value) && T.value.length == 0)
      throw new Error("Slider v-model must not be an empty array");
    return { value: T, initialValue: E };
  }(e), s = function(n, d, m) {
    const { classes: w, showTooltip: p, tooltipPosition: x, orientation: T } = Be(n), E = _(() => ({ target: "slider-target", focused: "slider-focused", tooltipFocus: "slider-tooltip-focus", tooltipDrag: "slider-tooltip-drag", ltr: "slider-ltr", rtl: "slider-rtl", horizontal: "slider-horizontal", vertical: "slider-vertical", textDirectionRtl: "slider-txt-dir-rtl", textDirectionLtr: "slider-txt-dir-ltr", base: "slider-base", connects: "slider-connects", connect: "slider-connect", origin: "slider-origin", handle: "slider-handle", handleLower: "slider-handle-lower", handleUpper: "slider-handle-upper", touchArea: "slider-touch-area", tooltip: "slider-tooltip", tooltipTop: "slider-tooltip-top", tooltipBottom: "slider-tooltip-bottom", tooltipLeft: "slider-tooltip-left", tooltipRight: "slider-tooltip-right", tooltipHidden: "slider-tooltip-hidden", active: "slider-active", draggable: "slider-draggable", tap: "slider-state-tap", drag: "slider-state-drag", pips: "slider-pips", pipsHorizontal: "slider-pips-horizontal", pipsVertical: "slider-pips-vertical", marker: "slider-marker", markerHorizontal: "slider-marker-horizontal", markerVertical: "slider-marker-vertical", markerNormal: "slider-marker-normal", markerLarge: "slider-marker-large", markerSub: "slider-marker-sub", value: "slider-value", valueHorizontal: "slider-value-horizontal", valueVertical: "slider-value-vertical", valueNormal: "slider-value-normal", valueLarge: "slider-value-large", valueSub: "slider-value-sub", ...w.value }));
    return { classList: _(() => {
      const g = { ...E.value };
      return Object.keys(g).forEach((y) => {
        g[y] = Array.isArray(g[y]) ? g[y].filter((S) => S !== null).join(" ") : g[y];
      }), p.value !== "always" && (g.target += ` ${p.value === "drag" ? g.tooltipDrag : g.tooltipFocus}`), T.value === "horizontal" && (g.tooltip += x.value === "bottom" ? ` ${g.tooltipBottom}` : ` ${g.tooltipTop}`), T.value === "vertical" && (g.tooltip += x.value === "right" ? ` ${g.tooltipRight}` : ` ${g.tooltipLeft}`), g;
    }) };
  }(e), i = function(n, d, m) {
    const { format: w, step: p } = Be(n), x = m.value, T = m.classList, E = _(() => w && w.value ? typeof w.value == "function" ? { to: w.value } : er({ ...w.value }) : er({ decimals: p.value >= 0 ? 0 : 2 })), g = _(() => Array.isArray(x.value) ? x.value.map((y) => E.value) : E.value);
    return { tooltipFormat: E, tooltipsFormat: g, tooltipsMerge: (y, S, P) => {
      var V = getComputedStyle(y).direction === "rtl", b = y.noUiSlider.options.direction === "rtl", D = y.noUiSlider.options.orientation === "vertical", j = y.noUiSlider.getTooltips(), k = y.noUiSlider.getOrigins();
      j.forEach(function(U, z) {
        U && k[z].appendChild(U);
      }), y.noUiSlider.on("update", function(U, z, A, Y, K) {
        var N = [[]], H = [[]], re = [[]], G = 0;
        j[0] && (N[0][0] = 0, H[0][0] = K[0], re[0][0] = E.value.to(parseFloat(U[0])));
        for (var ee = 1; ee < U.length; ee++)
          (!j[ee] || U[ee] - U[ee - 1] > S) && (N[++G] = [], re[G] = [], H[G] = []), j[ee] && (N[G].push(ee), re[G].push(E.value.to(parseFloat(U[ee]))), H[G].push(K[ee]));
        N.forEach(function(oe, Te) {
          for (var X = oe.length, Z = 0; Z < X; Z++) {
            var te = oe[Z];
            if (Z === X - 1) {
              var pe = 0;
              H[Te].forEach(function(v) {
                pe += 1e3 - v;
              });
              var Ce = D ? "bottom" : "right", ce = b ? 0 : X - 1, W = 1e3 - H[Te][ce];
              pe = (V && !D ? 100 : 0) + pe / X - W, j[te].innerHTML = re[Te].join(P), j[te].style.display = "block", j[te].style[Ce] = pe + "%", T.value.tooltipHidden.split(" ").forEach((v) => {
                j[te].classList.contains(v) && j[te].classList.remove(v);
              });
            } else
              j[te].style.display = "none", T.value.tooltipHidden.split(" ").forEach((v) => {
                j[te].classList.add(v);
              });
          }
        });
      });
    } };
  }(e, 0, { value: t.value, classList: s.classList }), h = function(n, d, m) {
    const { orientation: w, direction: p, tooltips: x, step: T, min: E, max: g, merge: y, id: S, disabled: P, options: V, classes: b, format: D, lazy: j, ariaLabelledby: k, aria: U } = Be(n), z = m.value, A = m.initialValue, Y = m.tooltipsFormat, K = m.tooltipsMerge, N = m.tooltipFormat, H = m.classList, re = he(null), G = he(null), ee = he(!1), oe = _(() => {
      let v = { cssPrefix: "", cssClasses: H.value, orientation: w.value, direction: p.value, tooltips: !!x.value && Y.value, connect: "lower", start: oa(z.value) ? E.value : z.value, range: { min: E.value, max: g.value } };
      if (T.value > 0 && (v.step = T.value), Array.isArray(z.value) && (v.connect = !0), k && k.value || U && Object.keys(U.value).length) {
        let q = Array.isArray(z.value) ? z.value : [z.value];
        v.handleAttributes = q.map((be) => Object.assign({}, U.value, k && k.value ? { "aria-labelledby": k.value } : {}));
      }
      return D.value && (v.ariaFormat = N.value), v;
    }), Te = _(() => {
      let v = { id: S && S.value ? S.value : void 0 };
      return P.value && (v.disabled = !0), v;
    }), X = _(() => Array.isArray(z.value)), Z = () => {
      let v = G.value.get();
      return Array.isArray(v) ? v.map((q) => parseFloat(q)) : parseFloat(v);
    }, te = function(v) {
      let q = !(arguments.length > 1 && arguments[1] !== void 0) || arguments[1];
      G.value.set(v, q);
    }, pe = (v) => {
      d.emit("input", v), d.emit("update:modelValue", v), d.emit("update", v);
    }, Ce = () => {
      G.value = en.create(re.value, Object.assign({}, oe.value, V.value)), x.value && X.value && y.value >= 0 && K(re.value, y.value, " - "), G.value.on("set", () => {
        const v = Z();
        d.emit("change", v), d.emit("set", v), j.value && pe(v);
      }), G.value.on("update", () => {
        if (!ee.value)
          return;
        const v = Z();
        X.value && tr(z.value, v) || !X.value && z.value == v ? d.emit("update", v) : j.value || pe(v);
      }), G.value.on("start", () => {
        d.emit("start", Z());
      }), G.value.on("end", () => {
        d.emit("end", Z());
      }), G.value.on("slide", () => {
        d.emit("slide", Z());
      }), G.value.on("drag", () => {
        d.emit("drag", Z());
      }), re.value.querySelectorAll("[data-handle]").forEach((v) => {
        v.onblur = () => {
          re.value && H.value.focused.split(" ").forEach((q) => {
            re.value.classList.remove(q);
          });
        }, v.onfocus = () => {
          H.value.focused.split(" ").forEach((q) => {
            re.value.classList.add(q);
          });
        };
      }), ee.value = !0;
    }, ce = () => {
      G.value.off(), G.value.destroy(), G.value = null;
    }, W = (v, q) => {
      ee.value = !1, ce(), Ce();
    };
    return pa(Ce), Ar(ce), ge(X, W, { immediate: !1 }), ge(E, W, { immediate: !1 }), ge(g, W, { immediate: !1 }), ge(T, W, { immediate: !1 }), ge(w, W, { immediate: !1 }), ge(p, W, { immediate: !1 }), ge(x, W, { immediate: !1 }), ge(y, W, { immediate: !1 }), ge(D, W, { immediate: !1, deep: !0 }), ge(V, W, { immediate: !1, deep: !0 }), ge(b, W, { immediate: !1, deep: !0 }), ge(z, (v, q) => {
      q && (typeof q == "object" && typeof v == "object" && v && Object.keys(q) > Object.keys(v) || typeof q == "object" && typeof v != "object" || oa(v)) && W();
    }, { immediate: !1 }), ge(z, (v) => {
      if (oa(v))
        return void te(E.value, !1);
      let q = Z();
      X.value && !Array.isArray(q) && (q = [q]), (X.value && !tr(v, q) || !X.value && v != q) && te(v, !1);
    }, { deep: !0 }), { slider: re, slider$: G, isRange: X, sliderProps: Te, init: Ce, destroy: ce, refresh: W, update: te, reset: () => {
      pe(A.value);
    } };
  }(e, a, { value: t.value, initialValue: t.initialValue, tooltipFormat: i.tooltipFormat, tooltipsFormat: i.tooltipsFormat, tooltipsMerge: i.tooltipsMerge, classList: s.classList });
  return { ...s, ...i, ...h };
} };
Ta.render = function(e, a, t, s, i, h) {
  return ne(), le("div", ua(e.sliderProps, { ref: "slider" }), null, 16);
}, Ta.__file = "src/Slider.vue";
function rt(e) {
  return [null, void 0].indexOf(e) !== -1;
}
function tn(e, a, t) {
  const { object: s, valueProp: i, mode: h } = Be(e), n = Qt().proxy, d = t.iv, m = (x, T = !0) => {
    d.value = p(x);
    const E = w(x);
    a.emit("change", E, n), T && (a.emit("input", E), a.emit("update:modelValue", E));
  }, w = (x) => s.value || rt(x) ? x : Array.isArray(x) ? x.map((T) => T[i.value]) : x[i.value], p = (x) => rt(x) ? h.value === "single" ? {} : [] : x;
  return {
    update: m
  };
}
function an(e, a) {
  const { value: t, modelValue: s, mode: i, valueProp: h } = Be(e), n = he(i.value !== "single" ? [] : {}), d = _(() => s && s.value !== void 0 ? s.value : t.value), m = _(() => i.value === "single" ? n.value[h.value] : n.value.map((p) => p[h.value])), w = _(() => i.value !== "single" ? n.value.map((p) => p[h.value]).join(",") : n.value[h.value]);
  return {
    iv: n,
    internalValue: n,
    ev: d,
    externalValue: d,
    textValue: w,
    plainValue: m
  };
}
function rn(e, a, t) {
  const { regex: s } = Be(e), i = Qt().proxy, h = t.isOpen, n = t.open, d = he(null), m = () => {
    d.value = "";
  }, w = (T) => {
    d.value = T.target.value;
  }, p = (T) => {
    if (s && s.value) {
      let E = s.value;
      typeof E == "string" && (E = new RegExp(E)), T.key.match(E) || T.preventDefault();
    }
  }, x = (T) => {
    if (s && s.value) {
      let g = (T.clipboardData || /* istanbul ignore next */
      window.clipboardData).getData("Text"), y = s.value;
      typeof y == "string" && (y = new RegExp(y)), g.split("").every((S) => !!S.match(y)) || T.preventDefault();
    }
    a.emit("paste", T, i);
  };
  return ge(d, (T) => {
    !h.value && T && n(), a.emit("search-change", T, i);
  }), {
    search: d,
    clearSearch: m,
    handleSearchInput: w,
    handleKeypress: p,
    handlePaste: x
  };
}
function nn(e, a, t) {
  const { groupSelect: s, mode: i, groups: h, disabledProp: n } = Be(e), d = he(null), m = (p) => {
    p === void 0 || p !== null && p[n.value] || h.value && p && p.group && (i.value === "single" || !s.value) || (d.value = p);
  };
  return {
    pointer: d,
    setPointer: m,
    clearPointer: () => {
      m(null);
    }
  };
}
function Ca(e, a = !0) {
  return a ? String(e).toLowerCase().trim() : String(e).toLowerCase().normalize("NFD").trim().replace(new RegExp(/æ/g), "ae").replace(new RegExp(/œ/g), "oe").replace(new RegExp(/ø/g), "o").replace(new RegExp("\\p{Diacritic}", "gu"), "");
}
function ln(e) {
  return Object.prototype.toString.call(e) === "[object Object]";
}
function on(e, a) {
  const t = a.slice().sort();
  return e.length === a.length && e.slice().sort().every(function(s, i) {
    return s === t[i];
  });
}
function sn(e, a, t) {
  const {
    options: s,
    mode: i,
    trackBy: h,
    limit: n,
    hideSelected: d,
    createTag: m,
    createOption: w,
    label: p,
    appendNewTag: x,
    appendNewOption: T,
    multipleLabel: E,
    object: g,
    loading: y,
    delay: S,
    resolveOnLoad: P,
    minChars: V,
    filterResults: b,
    clearOnSearch: D,
    clearOnSelect: j,
    valueProp: k,
    allowAbsent: U,
    groupLabel: z,
    canDeselect: A,
    max: Y,
    strict: K,
    closeOnSelect: N,
    closeOnDeselect: H,
    groups: re,
    reverse: G,
    infinite: ee,
    groupOptions: oe,
    groupHideEmpty: Te,
    groupSelect: X,
    onCreate: Z,
    disabledProp: te,
    searchStart: pe,
    searchFilter: Ce
  } = Be(e), ce = Qt().proxy, W = t.iv, v = t.ev, q = t.search, be = t.clearSearch, je = t.update, mt = t.pointer, gt = t.setPointer, Ke = t.clearPointer, Et = t.focus, Ft = t.deactivate, Qe = t.close, Pt = t.localize, Ze = he([]), We = he([]), Re = he(!1), Fe = he(null), Xe = he(ee.value && n.value === -1 ? 10 : n.value), bt = _(() => m.value || w.value || !1), kt = _(() => x.value !== void 0 ? x.value : T.value !== void 0 ? T.value : !0), Ie = _(() => {
    if (re.value) {
      let u = tt.value || /* istanbul ignore next */
      [], C = [];
      return u.forEach((ie) => {
        Ht(ie[oe.value]).forEach((Se) => {
          C.push(Object.assign({}, Se, ie[te.value] ? { [te.value]: !0 } : {}));
        });
      }), C;
    } else {
      let u = Ht(We.value || /* istanbul ignore next */
      []);
      return Ze.value.length && (u = u.concat(Ze.value)), u;
    }
  }), ct = _(() => {
    let u = Ie.value;
    return G.value && (u = u.reverse()), $.value.length && (u = $.value.concat(u)), Tt(u);
  }), et = _(() => {
    let u = ct.value;
    return Xe.value > 0 && (u = u.slice(0, Xe.value)), u;
  }), tt = _(() => {
    if (!re.value)
      return [];
    let u = [], C = We.value || /* istanbul ignore next */
    [];
    return Ze.value.length && u.push({
      [z.value]: " ",
      [oe.value]: [...Ze.value],
      __CREATE__: !0
    }), u.concat(C);
  }), Ct = _(() => {
    let u = [...tt.value].map((C) => ({ ...C }));
    return $.value.length && (u[0] && u[0].__CREATE__ ? u[0][oe.value] = [...$.value, ...u[0][oe.value]] : u = [{
      [z.value]: " ",
      [oe.value]: [...$.value],
      __CREATE__: !0
    }].concat(u)), u;
  }), o = _(() => {
    if (!re.value)
      return [];
    let u = Ct.value;
    return Ut((u || /* istanbul ignore next */
    []).map((C, ie) => {
      const Se = Ht(C[oe.value]);
      return {
        ...C,
        index: ie,
        group: !0,
        [oe.value]: Tt(Se, !1).map((lt) => Object.assign({}, lt, C[te.value] ? { [te.value]: !0 } : {})),
        __VISIBLE__: Tt(Se).map((lt) => Object.assign({}, lt, C[te.value] ? { [te.value]: !0 } : {}))
      };
    }));
  }), r = _(() => {
    switch (i.value) {
      case "single":
        return !rt(W.value[k.value]);
      case "multiple":
      case "tags":
        return !rt(W.value) && W.value.length > 0;
    }
  }), L = _(() => E !== void 0 && E.value !== void 0 ? E.value(W.value, ce) : W.value && W.value.length > 1 ? `${W.value.length} options selected` : "1 option selected"), F = _(() => !Ie.value.length && !Re.value && !$.value.length), B = _(() => Ie.value.length > 0 && et.value.length == 0 && (q.value && re.value || !re.value)), $ = _(() => bt.value === !1 || !q.value ? [] : wa(q.value) !== -1 ? [] : [{
    [k.value]: q.value,
    [se.value[0]]: q.value,
    [p.value]: q.value,
    __CREATE__: !0
  }]), se = _(() => h.value ? Array.isArray(h.value) ? h.value : [h.value] : [p.value]), xe = _(() => {
    switch (i.value) {
      case "single":
        return null;
      case "multiple":
      case "tags":
        return [];
    }
  }), ye = _(() => y.value || Re.value), Me = (u) => {
    switch (typeof u != "object" && (u = Ye(u)), i.value) {
      case "single":
        je(u);
        break;
      case "multiple":
      case "tags":
        je(W.value.concat(u));
        break;
    }
    a.emit("select", J(u), u, ce);
  }, me = (u) => {
    switch (typeof u != "object" && (u = Ye(u)), i.value) {
      case "single":
        De();
        break;
      case "tags":
      case "multiple":
        je(Array.isArray(u) ? W.value.filter((C) => u.map((ie) => ie[k.value]).indexOf(C[k.value]) === -1) : W.value.filter((C) => C[k.value] != u[k.value]));
        break;
    }
    a.emit("deselect", J(u), u, ce);
  }, J = (u) => g.value ? u : u[k.value], Ge = (u) => {
    me(u);
  }, we = (u, C) => {
    if (C.button !== 0) {
      C.preventDefault();
      return;
    }
    Ge(u);
  }, De = () => {
    je(xe.value), a.emit("clear", ce);
  }, ze = (u) => {
    if (u.group !== void 0)
      return i.value === "single" ? !1 : ya(u[oe.value]) && u[oe.value].length;
    switch (i.value) {
      case "single":
        return !rt(W.value) && W.value[k.value] == u[k.value];
      case "tags":
      case "multiple":
        return !rt(W.value) && W.value.map((C) => C[k.value]).indexOf(u[k.value]) !== -1;
    }
  }, Ue = (u) => u[te.value] === !0, at = () => Y === void 0 || Y.value === -1 || !r.value && Y.value > 0 ? !1 : W.value.length >= Y.value, Lt = (u) => {
    if (!Ue(u)) {
      if (Z && Z.value && !ze(u) && u.__CREATE__ && (u = { ...u }, delete u.__CREATE__, u = Z.value(u, ce), u instanceof Promise)) {
        Re.value = !0, u.then((C) => {
          Re.value = !1, yt(C);
        });
        return;
      }
      yt(u);
    }
  }, yt = (u) => {
    switch (u.__CREATE__ && (u = { ...u }, delete u.__CREATE__), i.value) {
      case "single":
        if (u && ze(u)) {
          A.value && me(u), H.value && (Ke(), Qe());
          return;
        }
        u && He(u), j.value && be(), N.value && (Ke(), Qe()), u && Me(u);
        break;
      case "multiple":
        if (u && ze(u)) {
          me(u), H.value && (Ke(), Qe());
          return;
        }
        if (at()) {
          a.emit("max", ce);
          return;
        }
        u && (He(u), Me(u)), j.value && be(), d.value && Ke(), N.value && Qe();
        break;
      case "tags":
        if (u && ze(u)) {
          me(u), H.value && (Ke(), Qe());
          return;
        }
        if (at()) {
          a.emit("max", ce);
          return;
        }
        u && He(u), j.value && be(), u && Me(u), d.value && Ke(), N.value && Qe();
        break;
    }
    N.value || Et();
  }, ga = (u) => {
    if (!(Ue(u) || i.value === "single" || !X.value)) {
      switch (i.value) {
        case "multiple":
        case "tags":
          ea(u[oe.value]) ? me(u[oe.value]) : Me(
            u[oe.value].filter((C) => W.value.map((ie) => ie[k.value]).indexOf(C[k.value]) === -1).filter((C) => !C[te.value]).filter((C, ie) => W.value.length + 1 + ie <= Y.value || Y.value === -1)
          ), d.value && mt.value && gt(o.value.filter((C) => !C[te.value])[mt.value.index]);
          break;
      }
      N.value && Ft();
    }
  }, He = (u) => {
    Ye(u[k.value]) === void 0 && bt.value && (a.emit("tag", u[k.value], ce), a.emit("option", u[k.value], ce), a.emit("create", u[k.value], ce), kt.value && zt(u), be());
  }, ba = () => {
    i.value !== "single" && Me(et.value.filter((u) => !u.disabled && !ze(u)));
  }, ea = (u) => u.find((C) => !ze(C) && !C[te.value]) === void 0, ya = (u) => u.find((C) => !ze(C)) === void 0, Ye = (u) => Ie.value[Ie.value.map((C) => String(C[k.value])).indexOf(String(u))], wa = (u) => Ie.value.findIndex((C) => se.value.some((ie) => (parseInt(C[ie]) == C[ie] ? parseInt(C[ie]) : C[ie]) === (parseInt(u) == u ? parseInt(u) : u))), ta = (u) => ["tags", "multiple"].indexOf(i.value) !== -1 && d.value && ze(u), zt = (u) => {
    Ze.value.push(u);
  }, Ut = (u) => Te.value ? u.filter(
    (C) => q.value ? C.__VISIBLE__.length : C[oe.value].length
  ) : u.filter((C) => q.value ? C.__VISIBLE__.length : !0), Tt = (u, C = !0) => {
    let ie = u;
    if (q.value && b.value) {
      let Se = Ce.value;
      Se || (Se = (lt, aa, Ia) => se.value.some((Wt) => {
        let Nt = Ca(Pt(lt[Wt]), K.value);
        return pe.value ? Nt.startsWith(Ca(aa, K.value)) : Nt.indexOf(Ca(aa, K.value)) !== -1;
      })), ie = ie.filter((lt) => Se(lt, q.value, ce));
    }
    return d.value && C && (ie = ie.filter((Se) => !ta(Se))), ie;
  }, Ht = (u) => {
    let C = u;
    return ln(C) && (C = Object.keys(C).map((ie) => {
      let Se = C[ie];
      return { [k.value]: ie, [se.value[0]]: Se, [p.value]: Se };
    })), C = C.map((ie) => typeof ie == "object" ? ie : { [k.value]: ie, [se.value[0]]: ie, [p.value]: ie }), C;
  }, At = () => {
    rt(v.value) || (W.value = dt(v.value));
  }, wt = (u) => (Re.value = !0, new Promise((C, ie) => {
    s.value(q.value, ce).then((Se) => {
      We.value = Se || [], typeof u == "function" && u(Se), Re.value = !1;
    }).catch((Se) => {
      console.error(Se), We.value = [], Re.value = !1;
    }).finally(() => {
      C();
    });
  })), $t = () => {
    if (r.value)
      if (i.value === "single") {
        let u = Ye(W.value[k.value]);
        if (u !== void 0) {
          let C = u[p.value];
          W.value[p.value] = C, g.value && (v.value[p.value] = C);
        }
      } else
        W.value.forEach((u, C) => {
          let ie = Ye(W.value[C][k.value]);
          if (ie !== void 0) {
            let Se = ie[p.value];
            W.value[C][p.value] = Se, g.value && (v.value[C][p.value] = Se);
          }
        });
  }, Sa = (u) => {
    wt(u);
  }, dt = (u) => rt(u) ? i.value === "single" ? {} : [] : g.value ? u : i.value === "single" ? Ye(u) || (U.value ? {
    [p.value]: u,
    [k.value]: u,
    [se.value[0]]: u
  } : {}) : u.filter((C) => !!Ye(C) || U.value).map((C) => Ye(C) || {
    [p.value]: C,
    [k.value]: C,
    [se.value[0]]: C
  }), Dt = () => {
    Fe.value = ge(q, (u) => {
      u.length < V.value || !u && V.value !== 0 || (Re.value = !0, D.value && (We.value = []), setTimeout(() => {
        u == q.value && s.value(q.value, ce).then((C) => {
          (u == q.value || !q.value) && (We.value = C, mt.value = et.value.filter((ie) => ie[te.value] !== !0)[0] || null, Re.value = !1);
        }).catch(
          /* istanbul ignore next */
          (C) => {
            console.error(C);
          }
        );
      }, S.value));
    }, { flush: "sync" });
  };
  if (i.value !== "single" && !rt(v.value) && !Array.isArray(v.value))
    throw new Error(`v-model must be an array when using "${i.value}" mode`);
  return s && typeof s.value == "function" ? P.value ? wt(At) : g.value == !0 && At() : (We.value = s.value, At()), S.value > -1 && Dt(), ge(S, (u, C) => {
    Fe.value && Fe.value(), u >= 0 && Dt();
  }), ge(v, (u) => {
    if (rt(u)) {
      je(dt(u), !1);
      return;
    }
    switch (i.value) {
      case "single":
        (g.value ? u[k.value] != W.value[k.value] : u != W.value[k.value]) && je(dt(u), !1);
        break;
      case "multiple":
      case "tags":
        on(g.value ? u.map((C) => C[k.value]) : u, W.value.map((C) => C[k.value])) || je(dt(u), !1);
        break;
    }
  }, { deep: !0 }), ge(s, (u, C) => {
    typeof e.options == "function" ? P.value && (!C || u && u.toString() !== C.toString()) && wt() : (We.value = e.options, Object.keys(W.value).length || At(), $t());
  }), ge(p, $t), ge(n, (u, C) => {
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
    noOptions: F,
    noResults: B,
    resolving: Re,
    busy: ye,
    offset: Xe,
    select: Me,
    deselect: me,
    remove: Ge,
    selectAll: ba,
    clear: De,
    isSelected: ze,
    isDisabled: Ue,
    isMax: at,
    getOption: Ye,
    handleOptionClick: Lt,
    handleGroupClick: ga,
    handleTagRemove: we,
    refreshOptions: Sa,
    resolveOptions: wt,
    refreshLabels: $t
  };
}
function un(e, a, t) {
  const {
    valueProp: s,
    showOptions: i,
    searchable: h,
    groupLabel: n,
    groups: d,
    mode: m,
    groupSelect: w,
    disabledProp: p,
    groupOptions: x
  } = Be(e), T = t.fo, E = t.fg, g = t.handleOptionClick, y = t.handleGroupClick, S = t.search, P = t.pointer, V = t.setPointer, b = t.clearPointer, D = t.multiselect, j = t.isOpen, k = _(() => T.value.filter((v) => !v[p.value])), U = _(() => E.value.filter((v) => !v[p.value])), z = _(() => m.value !== "single" && w.value), A = _(() => P.value && P.value.group), Y = _(() => ce(P.value)), K = _(() => {
    const v = A.value ? P.value : (
      /* istanbul ignore next */
      ce(P.value)
    ), q = U.value.map((je) => je[n.value]).indexOf(v[n.value]);
    let be = U.value[q - 1];
    return be === void 0 && (be = H.value), be;
  }), N = _(() => {
    let v = U.value.map((q) => q.label).indexOf(A.value ? P.value[n.value] : ce(P.value)[n.value]) + 1;
    return U.value.length <= v && (v = 0), U.value[v];
  }), H = _(() => [...U.value].slice(-1)[0]), re = _(() => P.value.__VISIBLE__.filter((v) => !v[p.value])[0]), G = _(() => {
    const v = Y.value.__VISIBLE__.filter((q) => !q[p.value]);
    return v[v.map((q) => q[s.value]).indexOf(P.value[s.value]) - 1];
  }), ee = _(() => {
    const v = ce(P.value).__VISIBLE__.filter((q) => !q[p.value]);
    return v[v.map((q) => q[s.value]).indexOf(P.value[s.value]) + 1];
  }), oe = _(() => [...K.value.__VISIBLE__.filter((v) => !v[p.value])].slice(-1)[0]), Te = _(() => [...H.value.__VISIBLE__.filter((v) => !v[p.value])].slice(-1)[0]), X = (v) => P.value && (!v.group && P.value[s.value] === v[s.value] || v.group !== void 0 && P.value[n.value] === v[n.value]) ? !0 : void 0, Z = () => {
    V(k.value[0] || null);
  }, te = () => {
    !P.value || P.value[p.value] === !0 || (A.value ? y(P.value) : g(P.value));
  }, pe = () => {
    if (P.value === null)
      V((d.value && z.value ? U.value[0].__CREATE__ ? k.value[0] : U.value[0] : k.value[0]) || null);
    else if (d.value && z.value) {
      let v = A.value ? re.value : ee.value;
      v === void 0 && (v = N.value, v.__CREATE__ && (v = v[x.value][0])), V(v || /* istanbul ignore next */
      null);
    } else {
      let v = k.value.map((q) => q[s.value]).indexOf(P.value[s.value]) + 1;
      k.value.length <= v && (v = 0), V(k.value[v] || null);
    }
    Xt(() => {
      W();
    });
  }, Ce = () => {
    if (P.value === null) {
      let v = k.value[k.value.length - 1];
      d.value && z.value && (v = Te.value, v === void 0 && (v = H.value)), V(v || null);
    } else if (d.value && z.value) {
      let v = A.value ? oe.value : G.value;
      v === void 0 && (v = A.value ? K.value : Y.value, v.__CREATE__ && (v = oe.value, v === void 0 && (v = K.value))), V(v || /* istanbul ignore next */
      null);
    } else {
      let v = k.value.map((q) => q[s.value]).indexOf(P.value[s.value]) - 1;
      v < 0 && (v = k.value.length - 1), V(k.value[v] || null);
    }
    Xt(() => {
      W();
    });
  }, ce = (v) => U.value.find((q) => q.__VISIBLE__.map((be) => be[s.value]).indexOf(v[s.value]) !== -1), W = () => {
    let v = D.value.querySelector("[data-pointed]");
    if (!v)
      return;
    let q = v.parentElement.parentElement;
    d.value && (q = A.value ? v.parentElement.parentElement.parentElement : v.parentElement.parentElement.parentElement.parentElement), v.offsetTop + v.offsetHeight > q.clientHeight + q.scrollTop && (q.scrollTop = v.offsetTop + v.offsetHeight - q.clientHeight), v.offsetTop < q.scrollTop && (q.scrollTop = v.offsetTop);
  };
  return ge(S, (v) => {
    h.value && (v.length && i.value ? Z() : b());
  }), ge(j, (v) => {
    if (v && (D != null && D.value)) {
      let q = D.value.querySelectorAll("[data-selected]")[0];
      if (!q)
        return;
      let be = q.parentElement.parentElement;
      Xt(() => {
        be.scrollTop > 0 || (be.scrollTop = q.offsetTop);
      });
    }
  }), {
    pointer: P,
    canPointGroups: z,
    isPointed: X,
    setPointerFirst: Z,
    selectPointer: te,
    forwardPointer: pe,
    backwardPointer: Ce
  };
}
function $e(e) {
  if (e == null)
    return window;
  if (e.toString() !== "[object Window]") {
    var a = e.ownerDocument;
    return a && a.defaultView || window;
  }
  return e;
}
function xt(e) {
  var a = $e(e).Element;
  return e instanceof a || e instanceof Element;
}
function _e(e) {
  var a = $e(e).HTMLElement;
  return e instanceof a || e instanceof HTMLElement;
}
function Na(e) {
  if (typeof ShadowRoot > "u")
    return !1;
  var a = $e(e).ShadowRoot;
  return e instanceof a || e instanceof ShadowRoot;
}
var Ot = Math.max, fa = Math.min, jt = Math.round;
function Aa() {
  var e = navigator.userAgentData;
  return e != null && e.brands && Array.isArray(e.brands) ? e.brands.map(function(a) {
    return a.brand + "/" + a.version;
  }).join(" ") : navigator.userAgent;
}
function dr() {
  return !/^((?!chrome|android).)*safari/i.test(Aa());
}
function qt(e, a, t) {
  a === void 0 && (a = !1), t === void 0 && (t = !1);
  var s = e.getBoundingClientRect(), i = 1, h = 1;
  a && _e(e) && (i = e.offsetWidth > 0 && jt(s.width) / e.offsetWidth || 1, h = e.offsetHeight > 0 && jt(s.height) / e.offsetHeight || 1);
  var n = xt(e) ? $e(e) : window, d = n.visualViewport, m = !dr() && t, w = (s.left + (m && d ? d.offsetLeft : 0)) / i, p = (s.top + (m && d ? d.offsetTop : 0)) / h, x = s.width / i, T = s.height / h;
  return {
    width: x,
    height: T,
    top: p,
    right: w + x,
    bottom: p + T,
    left: w,
    x: w,
    y: p
  };
}
function Ba(e) {
  var a = $e(e), t = a.pageXOffset, s = a.pageYOffset;
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
  return e === $e(e) || !_e(e) ? Ba(e) : cn(e);
}
function nt(e) {
  return e ? (e.nodeName || "").toLowerCase() : null;
}
function ht(e) {
  return ((xt(e) ? e.ownerDocument : (
    // $FlowFixMe[prop-missing]
    e.document
  )) || window.document).documentElement;
}
function Ma(e) {
  return qt(ht(e)).left + Ba(e).scrollLeft;
}
function ut(e) {
  return $e(e).getComputedStyle(e);
}
function Va(e) {
  var a = ut(e), t = a.overflow, s = a.overflowX, i = a.overflowY;
  return /auto|scroll|overlay|hidden/.test(t + i + s);
}
function fn(e) {
  var a = e.getBoundingClientRect(), t = jt(a.width) / e.offsetWidth || 1, s = jt(a.height) / e.offsetHeight || 1;
  return t !== 1 || s !== 1;
}
function pn(e, a, t) {
  t === void 0 && (t = !1);
  var s = _e(a), i = _e(a) && fn(a), h = ht(a), n = qt(e, i, t), d = {
    scrollLeft: 0,
    scrollTop: 0
  }, m = {
    x: 0,
    y: 0
  };
  return (s || !s && !t) && ((nt(a) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
  Va(h)) && (d = dn(a)), _e(a) ? (m = qt(a, !0), m.x += a.clientLeft, m.y += a.clientTop) : h && (m.x = Ma(h))), {
    x: n.left + d.scrollLeft - m.x,
    y: n.top + d.scrollTop - m.y,
    width: n.width,
    height: n.height
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
    ht(e)
  );
}
function pr(e) {
  return ["html", "body", "#document"].indexOf(nt(e)) >= 0 ? e.ownerDocument.body : _e(e) && Va(e) ? e : pr(va(e));
}
function Yt(e, a) {
  var t;
  a === void 0 && (a = []);
  var s = pr(e), i = s === ((t = e.ownerDocument) == null ? void 0 : t.body), h = $e(s), n = i ? [h].concat(h.visualViewport || [], Va(s) ? s : []) : s, d = a.concat(n);
  return i ? d : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    d.concat(Yt(va(n)))
  );
}
function vn(e) {
  return ["table", "td", "th"].indexOf(nt(e)) >= 0;
}
function ar(e) {
  return !_e(e) || // https://github.com/popperjs/popper-core/issues/837
  ut(e).position === "fixed" ? null : e.offsetParent;
}
function hn(e) {
  var a = /firefox/i.test(Aa()), t = /Trident/i.test(Aa());
  if (t && _e(e)) {
    var s = ut(e);
    if (s.position === "fixed")
      return null;
  }
  var i = va(e);
  for (Na(i) && (i = i.host); _e(i) && ["html", "body"].indexOf(nt(i)) < 0; ) {
    var h = ut(i);
    if (h.transform !== "none" || h.perspective !== "none" || h.contain === "paint" || ["transform", "perspective"].indexOf(h.willChange) !== -1 || a && h.willChange === "filter" || a && h.filter && h.filter !== "none")
      return i;
    i = i.parentNode;
  }
  return null;
}
function ha(e) {
  for (var a = $e(e), t = ar(e); t && vn(t) && ut(t).position === "static"; )
    t = ar(t);
  return t && (nt(t) === "html" || nt(t) === "body" && ut(t).position === "static") ? a : t || hn(e) || a;
}
var Je = "top", it = "bottom", vt = "right", st = "left", ja = "auto", ma = [Je, it, vt, st], Rt = "start", Jt = "end", mn = "clippingParents", vr = "viewport", Kt = "popper", gn = "reference", rr = /* @__PURE__ */ ma.reduce(function(e, a) {
  return e.concat([a + "-" + Rt, a + "-" + Jt]);
}, []), bn = /* @__PURE__ */ [].concat(ma, [ja]).reduce(function(e, a) {
  return e.concat([a, a + "-" + Rt, a + "-" + Jt]);
}, []), yn = "beforeRead", wn = "read", Sn = "afterRead", On = "beforeMain", xn = "main", En = "afterMain", Pn = "beforeWrite", kn = "write", Cn = "afterWrite", Ln = [yn, wn, Sn, On, xn, En, Pn, kn, Cn];
function Tn(e) {
  var a = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Set(), s = [];
  e.forEach(function(h) {
    a.set(h.name, h);
  });
  function i(h) {
    t.add(h.name);
    var n = [].concat(h.requires || [], h.requiresIfExists || []);
    n.forEach(function(d) {
      if (!t.has(d)) {
        var m = a.get(d);
        m && i(m);
      }
    }), s.push(h);
  }
  return e.forEach(function(h) {
    t.has(h.name) || i(h);
  }), s;
}
function An(e) {
  var a = Tn(e);
  return Ln.reduce(function(t, s) {
    return t.concat(a.filter(function(i) {
      return i.phase === s;
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
    var i = t[s.name];
    return t[s.name] = i ? Object.assign({}, i, s, {
      options: Object.assign({}, i.options, s.options),
      data: Object.assign({}, i.data, s.data)
    }) : s, t;
  }, {});
  return Object.keys(a).map(function(t) {
    return a[t];
  });
}
function Bn(e, a) {
  var t = $e(e), s = ht(e), i = t.visualViewport, h = s.clientWidth, n = s.clientHeight, d = 0, m = 0;
  if (i) {
    h = i.width, n = i.height;
    var w = dr();
    (w || !w && a === "fixed") && (d = i.offsetLeft, m = i.offsetTop);
  }
  return {
    width: h,
    height: n,
    x: d + Ma(e),
    y: m
  };
}
function Mn(e) {
  var a, t = ht(e), s = Ba(e), i = (a = e.ownerDocument) == null ? void 0 : a.body, h = Ot(t.scrollWidth, t.clientWidth, i ? i.scrollWidth : 0, i ? i.clientWidth : 0), n = Ot(t.scrollHeight, t.clientHeight, i ? i.scrollHeight : 0, i ? i.clientHeight : 0), d = -s.scrollLeft + Ma(e), m = -s.scrollTop;
  return ut(i || t).direction === "rtl" && (d += Ot(t.clientWidth, i ? i.clientWidth : 0) - h), {
    width: h,
    height: n,
    x: d,
    y: m
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
function jn(e, a) {
  var t = qt(e, !1, a === "fixed");
  return t.top = t.top + e.clientTop, t.left = t.left + e.clientLeft, t.bottom = t.top + e.clientHeight, t.right = t.left + e.clientWidth, t.width = e.clientWidth, t.height = e.clientHeight, t.x = t.left, t.y = t.top, t;
}
function nr(e, a, t) {
  return a === vr ? Da(Bn(e, t)) : xt(a) ? jn(a, t) : Da(Mn(ht(e)));
}
function qn(e) {
  var a = Yt(va(e)), t = ["absolute", "fixed"].indexOf(ut(e).position) >= 0, s = t && _e(e) ? ha(e) : e;
  return xt(s) ? a.filter(function(i) {
    return xt(i) && Vn(i, s) && nt(i) !== "body";
  }) : [];
}
function Rn(e, a, t, s) {
  var i = a === "clippingParents" ? qn(e) : [].concat(a), h = [].concat(i, [t]), n = h[0], d = h.reduce(function(m, w) {
    var p = nr(e, w, s);
    return m.top = Ot(p.top, m.top), m.right = fa(p.right, m.right), m.bottom = fa(p.bottom, m.bottom), m.left = Ot(p.left, m.left), m;
  }, nr(e, n, s));
  return d.width = d.right - d.left, d.height = d.bottom - d.top, d.x = d.left, d.y = d.top, d;
}
function pt(e) {
  return e.split("-")[0];
}
function It(e) {
  return e.split("-")[1];
}
function hr(e) {
  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
}
function mr(e) {
  var a = e.reference, t = e.element, s = e.placement, i = s ? pt(s) : null, h = s ? It(s) : null, n = a.x + a.width / 2 - t.width / 2, d = a.y + a.height / 2 - t.height / 2, m;
  switch (i) {
    case Je:
      m = {
        x: n,
        y: a.y - t.height
      };
      break;
    case it:
      m = {
        x: n,
        y: a.y + a.height
      };
      break;
    case vt:
      m = {
        x: a.x + a.width,
        y: d
      };
      break;
    case st:
      m = {
        x: a.x - t.width,
        y: d
      };
      break;
    default:
      m = {
        x: a.x,
        y: a.y
      };
  }
  var w = i ? hr(i) : null;
  if (w != null) {
    var p = w === "y" ? "height" : "width";
    switch (h) {
      case Rt:
        m[w] = m[w] - (a[p] / 2 - t[p] / 2);
        break;
      case Jt:
        m[w] = m[w] + (a[p] / 2 - t[p] / 2);
        break;
    }
  }
  return m;
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
function Fn(e, a) {
  return a.reduce(function(t, s) {
    return t[s] = e, t;
  }, {});
}
function qa(e, a) {
  a === void 0 && (a = {});
  var t = a, s = t.placement, i = s === void 0 ? e.placement : s, h = t.strategy, n = h === void 0 ? e.strategy : h, d = t.boundary, m = d === void 0 ? mn : d, w = t.rootBoundary, p = w === void 0 ? vr : w, x = t.elementContext, T = x === void 0 ? Kt : x, E = t.altBoundary, g = E === void 0 ? !1 : E, y = t.padding, S = y === void 0 ? 0 : y, P = In(typeof S != "number" ? S : Fn(S, ma)), V = T === Kt ? gn : Kt, b = e.rects.popper, D = e.elements[g ? V : T], j = Rn(xt(D) ? D : D.contextElement || ht(e.elements.popper), m, p, n), k = qt(e.elements.reference), U = mr({
    reference: k,
    element: b,
    strategy: "absolute",
    placement: i
  }), z = Da(Object.assign({}, b, U)), A = T === Kt ? z : k, Y = {
    top: j.top - A.top + P.top,
    bottom: A.bottom - j.bottom + P.bottom,
    left: j.left - A.left + P.left,
    right: A.right - j.right + P.right
  }, K = e.modifiersData.offset;
  if (T === Kt && K) {
    var N = K[i];
    Object.keys(Y).forEach(function(H) {
      var re = [vt, it].indexOf(H) >= 0 ? 1 : -1, G = [Je, it].indexOf(H) >= 0 ? "y" : "x";
      Y[H] += N[G] * re;
    });
  }
  return Y;
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
function zn(e) {
  e === void 0 && (e = {});
  var a = e, t = a.defaultModifiers, s = t === void 0 ? [] : t, i = a.defaultOptions, h = i === void 0 ? ir : i;
  return function(d, m, w) {
    w === void 0 && (w = h);
    var p = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, ir, h),
      modifiersData: {},
      elements: {
        reference: d,
        popper: m
      },
      attributes: {},
      styles: {}
    }, x = [], T = !1, E = {
      state: p,
      setOptions: function(P) {
        var V = typeof P == "function" ? P(p.options) : P;
        y(), p.options = Object.assign({}, h, p.options, V), p.scrollParents = {
          reference: xt(d) ? Yt(d) : d.contextElement ? Yt(d.contextElement) : [],
          popper: Yt(m)
        };
        var b = An(Nn([].concat(s, p.options.modifiers)));
        return p.orderedModifiers = b.filter(function(D) {
          return D.enabled;
        }), g(), E.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function() {
        if (!T) {
          var P = p.elements, V = P.reference, b = P.popper;
          if (lr(V, b)) {
            p.rects = {
              reference: pn(V, ha(b), p.options.strategy === "fixed"),
              popper: fr(b)
            }, p.reset = !1, p.placement = p.options.placement, p.orderedModifiers.forEach(function(Y) {
              return p.modifiersData[Y.name] = Object.assign({}, Y.data);
            });
            for (var D = 0; D < p.orderedModifiers.length; D++) {
              if (p.reset === !0) {
                p.reset = !1, D = -1;
                continue;
              }
              var j = p.orderedModifiers[D], k = j.fn, U = j.options, z = U === void 0 ? {} : U, A = j.name;
              typeof k == "function" && (p = k({
                state: p,
                options: z,
                name: A,
                instance: E
              }) || p);
            }
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: Dn(function() {
        return new Promise(function(S) {
          E.forceUpdate(), S(p);
        });
      }),
      destroy: function() {
        y(), T = !0;
      }
    };
    if (!lr(d, m))
      return E;
    E.setOptions(w).then(function(S) {
      !T && w.onFirstUpdate && w.onFirstUpdate(S);
    });
    function g() {
      p.orderedModifiers.forEach(function(S) {
        var P = S.name, V = S.options, b = V === void 0 ? {} : V, D = S.effect;
        if (typeof D == "function") {
          var j = D({
            state: p,
            name: P,
            instance: E,
            options: b
          }), k = function() {
          };
          x.push(j || k);
        }
      });
    }
    function y() {
      x.forEach(function(S) {
        return S();
      }), x = [];
    }
    return E;
  };
}
var sa = {
  passive: !0
};
function Un(e) {
  var a = e.state, t = e.instance, s = e.options, i = s.scroll, h = i === void 0 ? !0 : i, n = s.resize, d = n === void 0 ? !0 : n, m = $e(a.elements.popper), w = [].concat(a.scrollParents.reference, a.scrollParents.popper);
  return h && w.forEach(function(p) {
    p.addEventListener("scroll", t.update, sa);
  }), d && m.addEventListener("resize", t.update, sa), function() {
    h && w.forEach(function(p) {
      p.removeEventListener("scroll", t.update, sa);
    }), d && m.removeEventListener("resize", t.update, sa);
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
function $n(e) {
  var a = e.state, t = e.name;
  a.modifiersData[t] = mr({
    reference: a.rects.reference,
    element: a.rects.popper,
    strategy: "absolute",
    placement: a.placement
  });
}
var Wn = {
  name: "popperOffsets",
  enabled: !0,
  phase: "read",
  fn: $n,
  data: {}
}, Gn = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function _n(e, a) {
  var t = e.x, s = e.y, i = a.devicePixelRatio || 1;
  return {
    x: jt(t * i) / i || 0,
    y: jt(s * i) / i || 0
  };
}
function or(e) {
  var a, t = e.popper, s = e.popperRect, i = e.placement, h = e.variation, n = e.offsets, d = e.position, m = e.gpuAcceleration, w = e.adaptive, p = e.roundOffsets, x = e.isFixed, T = n.x, E = T === void 0 ? 0 : T, g = n.y, y = g === void 0 ? 0 : g, S = typeof p == "function" ? p({
    x: E,
    y
  }) : {
    x: E,
    y
  };
  E = S.x, y = S.y;
  var P = n.hasOwnProperty("x"), V = n.hasOwnProperty("y"), b = st, D = Je, j = window;
  if (w) {
    var k = ha(t), U = "clientHeight", z = "clientWidth";
    if (k === $e(t) && (k = ht(t), ut(k).position !== "static" && d === "absolute" && (U = "scrollHeight", z = "scrollWidth")), k = k, i === Je || (i === st || i === vt) && h === Jt) {
      D = it;
      var A = x && k === j && j.visualViewport ? j.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        k[U]
      );
      y -= A - s.height, y *= m ? 1 : -1;
    }
    if (i === st || (i === Je || i === it) && h === Jt) {
      b = vt;
      var Y = x && k === j && j.visualViewport ? j.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        k[z]
      );
      E -= Y - s.width, E *= m ? 1 : -1;
    }
  }
  var K = Object.assign({
    position: d
  }, w && Gn), N = p === !0 ? _n({
    x: E,
    y
  }, $e(t)) : {
    x: E,
    y
  };
  if (E = N.x, y = N.y, m) {
    var H;
    return Object.assign({}, K, (H = {}, H[D] = V ? "0" : "", H[b] = P ? "0" : "", H.transform = (j.devicePixelRatio || 1) <= 1 ? "translate(" + E + "px, " + y + "px)" : "translate3d(" + E + "px, " + y + "px, 0)", H));
  }
  return Object.assign({}, K, (a = {}, a[D] = V ? y + "px" : "", a[b] = P ? E + "px" : "", a.transform = "", a));
}
function Kn(e) {
  var a = e.state, t = e.options, s = t.gpuAcceleration, i = s === void 0 ? !0 : s, h = t.adaptive, n = h === void 0 ? !0 : h, d = t.roundOffsets, m = d === void 0 ? !0 : d, w = {
    placement: pt(a.placement),
    variation: It(a.placement),
    popper: a.elements.popper,
    popperRect: a.rects.popper,
    gpuAcceleration: i,
    isFixed: a.options.strategy === "fixed"
  };
  a.modifiersData.popperOffsets != null && (a.styles.popper = Object.assign({}, a.styles.popper, or(Object.assign({}, w, {
    offsets: a.modifiersData.popperOffsets,
    position: a.options.strategy,
    adaptive: n,
    roundOffsets: m
  })))), a.modifiersData.arrow != null && (a.styles.arrow = Object.assign({}, a.styles.arrow, or(Object.assign({}, w, {
    offsets: a.modifiersData.arrow,
    position: "absolute",
    adaptive: !1,
    roundOffsets: m
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
    var s = a.styles[t] || {}, i = a.attributes[t] || {}, h = a.elements[t];
    !_e(h) || !nt(h) || (Object.assign(h.style, s), Object.keys(i).forEach(function(n) {
      var d = i[n];
      d === !1 ? h.removeAttribute(n) : h.setAttribute(n, d === !0 ? "" : d);
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
      var i = a.elements[s], h = a.attributes[s] || {}, n = Object.keys(a.styles.hasOwnProperty(s) ? a.styles[s] : t[s]), d = n.reduce(function(m, w) {
        return m[w] = "", m;
      }, {});
      !_e(i) || !nt(i) || (Object.assign(i.style, d), Object.keys(h).forEach(function(m) {
        i.removeAttribute(m);
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
}, Zn = [Hn, Wn, Xn, Qn], ei = /* @__PURE__ */ zn({
  defaultModifiers: Zn
});
function ti(e) {
  return e === "x" ? "y" : "x";
}
function ca(e, a, t) {
  return Ot(e, fa(a, t));
}
function ai(e, a, t) {
  var s = ca(e, a, t);
  return s > t ? t : s;
}
function ri(e) {
  var a = e.state, t = e.options, s = e.name, i = t.mainAxis, h = i === void 0 ? !0 : i, n = t.altAxis, d = n === void 0 ? !1 : n, m = t.boundary, w = t.rootBoundary, p = t.altBoundary, x = t.padding, T = t.tether, E = T === void 0 ? !0 : T, g = t.tetherOffset, y = g === void 0 ? 0 : g, S = qa(a, {
    boundary: m,
    rootBoundary: w,
    padding: x,
    altBoundary: p
  }), P = pt(a.placement), V = It(a.placement), b = !V, D = hr(P), j = ti(D), k = a.modifiersData.popperOffsets, U = a.rects.reference, z = a.rects.popper, A = typeof y == "function" ? y(Object.assign({}, a.rects, {
    placement: a.placement
  })) : y, Y = typeof A == "number" ? {
    mainAxis: A,
    altAxis: A
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, A), K = a.modifiersData.offset ? a.modifiersData.offset[a.placement] : null, N = {
    x: 0,
    y: 0
  };
  if (k) {
    if (h) {
      var H, re = D === "y" ? Je : st, G = D === "y" ? it : vt, ee = D === "y" ? "height" : "width", oe = k[D], Te = oe + S[re], X = oe - S[G], Z = E ? -z[ee] / 2 : 0, te = V === Rt ? U[ee] : z[ee], pe = V === Rt ? -z[ee] : -U[ee], Ce = a.elements.arrow, ce = E && Ce ? fr(Ce) : {
        width: 0,
        height: 0
      }, W = a.modifiersData["arrow#persistent"] ? a.modifiersData["arrow#persistent"].padding : gr(), v = W[re], q = W[G], be = ca(0, U[ee], ce[ee]), je = b ? U[ee] / 2 - Z - be - v - Y.mainAxis : te - be - v - Y.mainAxis, mt = b ? -U[ee] / 2 + Z + be + q + Y.mainAxis : pe + be + q + Y.mainAxis, gt = a.elements.arrow && ha(a.elements.arrow), Ke = gt ? D === "y" ? gt.clientTop || 0 : gt.clientLeft || 0 : 0, Et = (H = K == null ? void 0 : K[D]) != null ? H : 0, Ft = oe + je - Et - Ke, Qe = oe + mt - Et, Pt = ca(E ? fa(Te, Ft) : Te, oe, E ? Ot(X, Qe) : X);
      k[D] = Pt, N[D] = Pt - oe;
    }
    if (d) {
      var Ze, We = D === "x" ? Je : st, Re = D === "x" ? it : vt, Fe = k[j], Xe = j === "y" ? "height" : "width", bt = Fe + S[We], kt = Fe - S[Re], Ie = [Je, st].indexOf(P) !== -1, ct = (Ze = K == null ? void 0 : K[j]) != null ? Ze : 0, et = Ie ? bt : Fe - U[Xe] - z[Xe] - ct + Y.altAxis, tt = Ie ? Fe + U[Xe] + z[Xe] - ct - Y.altAxis : kt, Ct = E && Ie ? ai(et, Fe, tt) : ca(E ? et : bt, Fe, E ? tt : kt);
      k[j] = Ct, N[j] = Ct - Fe;
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
function sr(e) {
  return e.replace(/start|end/g, function(a) {
    return li[a];
  });
}
function oi(e, a) {
  a === void 0 && (a = {});
  var t = a, s = t.placement, i = t.boundary, h = t.rootBoundary, n = t.padding, d = t.flipVariations, m = t.allowedAutoPlacements, w = m === void 0 ? bn : m, p = It(s), x = p ? d ? rr : rr.filter(function(g) {
    return It(g) === p;
  }) : ma, T = x.filter(function(g) {
    return w.indexOf(g) >= 0;
  });
  T.length === 0 && (T = x);
  var E = T.reduce(function(g, y) {
    return g[y] = qa(e, {
      placement: y,
      boundary: i,
      rootBoundary: h,
      padding: n
    })[pt(y)], g;
  }, {});
  return Object.keys(E).sort(function(g, y) {
    return E[g] - E[y];
  });
}
function si(e) {
  if (pt(e) === ja)
    return [];
  var a = da(e);
  return [sr(e), a, sr(a)];
}
function ui(e) {
  var a = e.state, t = e.options, s = e.name;
  if (!a.modifiersData[s]._skip) {
    for (var i = t.mainAxis, h = i === void 0 ? !0 : i, n = t.altAxis, d = n === void 0 ? !0 : n, m = t.fallbackPlacements, w = t.padding, p = t.boundary, x = t.rootBoundary, T = t.altBoundary, E = t.flipVariations, g = E === void 0 ? !0 : E, y = t.allowedAutoPlacements, S = a.options.placement, P = pt(S), V = P === S, b = m || (V || !g ? [da(S)] : si(S)), D = [S].concat(b).reduce(function(ce, W) {
      return ce.concat(pt(W) === ja ? oi(a, {
        placement: W,
        boundary: p,
        rootBoundary: x,
        padding: w,
        flipVariations: g,
        allowedAutoPlacements: y
      }) : W);
    }, []), j = a.rects.reference, k = a.rects.popper, U = /* @__PURE__ */ new Map(), z = !0, A = D[0], Y = 0; Y < D.length; Y++) {
      var K = D[Y], N = pt(K), H = It(K) === Rt, re = [Je, it].indexOf(N) >= 0, G = re ? "width" : "height", ee = qa(a, {
        placement: K,
        boundary: p,
        rootBoundary: x,
        altBoundary: T,
        padding: w
      }), oe = re ? H ? vt : st : H ? it : Je;
      j[G] > k[G] && (oe = da(oe));
      var Te = da(oe), X = [];
      if (h && X.push(ee[N] <= 0), d && X.push(ee[oe] <= 0, ee[Te] <= 0), X.every(function(ce) {
        return ce;
      })) {
        A = K, z = !1;
        break;
      }
      U.set(K, X);
    }
    if (z)
      for (var Z = g ? 3 : 1, te = function(W) {
        var v = D.find(function(q) {
          var be = U.get(q);
          if (be)
            return be.slice(0, W).every(function(je) {
              return je;
            });
        });
        if (v)
          return A = v, "break";
      }, pe = Z; pe > 0; pe--) {
        var Ce = te(pe);
        if (Ce === "break")
          break;
      }
    a.placement !== A && (a.modifiersData[s]._skip = !0, a.placement = A, a.reset = !0);
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
  const { disabled: s, appendTo: i, appendToBody: h, openDirection: n } = Be(e), d = Qt().proxy, m = t.multiselect, w = t.dropdown, p = he(!1), x = he(null), T = he(null), E = _(() => i.value || h.value), g = _(() => n.value === "top" && T.value === "bottom" || n.value === "bottom" && T.value !== "top" ? "bottom" : "top"), y = () => {
    p.value || s.value || (p.value = !0, a.emit("open", d), E.value && Xt(() => {
      P();
    }));
  }, S = () => {
    p.value && (p.value = !1, a.emit("close", d));
  }, P = () => {
    if (!x.value)
      return;
    let b = parseInt(window.getComputedStyle(w.value).borderTopWidth.replace("px", "")), D = parseInt(window.getComputedStyle(w.value).borderBottomWidth.replace("px", ""));
    x.value.setOptions((j) => ({
      ...j,
      modifiers: [
        ...j.modifiers,
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
    E.value && (x.value = ei(m.value, w.value, {
      strategy: V(m.value) ? (
        /* istanbul ignore next: UI feature */
        "fixed"
      ) : void 0,
      placement: n.value,
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
            T.value = b.placement;
          }
        }
      ]
    }));
  }), Nr(() => {
    !E.value || !x.value || (x.value.destroy(), x.value = null);
  }), {
    popper: x,
    isOpen: p,
    open: y,
    close: S,
    placement: g,
    updatePopper: P
  };
}
function fi(e, a, t) {
  const { searchable: s, disabled: i, clearOnBlur: h } = Be(e), n = t.input, d = t.open, m = t.close, w = t.clearSearch, p = t.isOpen, x = t.wrapper, T = t.tags, E = he(!1), g = he(!1), y = _(() => s.value || i.value ? -1 : 0), S = () => {
    s.value && n.value.blur(), x.value.blur();
  }, P = () => {
    s.value && !i.value && n.value.focus();
  }, V = (z = !0) => {
    i.value || (E.value = !0, z && d());
  }, b = () => {
    E.value = !1, setTimeout(() => {
      E.value || (m(), h.value && w());
    }, 1);
  };
  return {
    tabindex: y,
    isActive: E,
    mouseClicked: g,
    blur: S,
    focus: P,
    activate: V,
    deactivate: b,
    handleFocusIn: (z) => {
      z.target.closest("[data-tags]") && z.target.nodeName !== "INPUT" || z.target.closest("[data-clear]") || V(g.value);
    },
    handleFocusOut: () => {
      b();
    },
    handleCaretClick: () => {
      b(), S();
    },
    handleMousedown: (z) => {
      g.value = !0, p.value && (z.target.isEqualNode(x.value) || z.target.isEqualNode(T.value)) ? setTimeout(() => {
        b();
      }, 0) : !p.value && (document.activeElement.isEqualNode(x.value) || document.activeElement.isEqualNode(n.value)) && V(), setTimeout(() => {
        g.value = !1;
      }, 0);
    }
  };
}
function pi(e, a, t) {
  const {
    mode: s,
    addTagOn: i,
    openDirection: h,
    searchable: n,
    showOptions: d,
    valueProp: m,
    groups: w,
    addOptionOn: p,
    createTag: x,
    createOption: T,
    reverse: E
  } = Be(e), g = Qt().proxy, y = t.iv, S = t.update, P = t.deselect, V = t.search, b = t.setPointer, D = t.selectPointer, j = t.backwardPointer, k = t.forwardPointer, U = t.multiselect, z = t.wrapper, A = t.tags, Y = t.isOpen, K = t.open, N = t.blur, H = t.fo, re = _(() => x.value || T.value || !1), G = _(() => i.value !== void 0 ? i.value : p.value !== void 0 ? p.value : ["enter"]), ee = () => {
    s.value === "tags" && !d.value && re.value && n.value && !w.value && b(H.value[H.value.map((X) => X[m.value]).indexOf(V.value)]);
  };
  return {
    handleKeydown: (X) => {
      a.emit("keydown", X, g);
      let Z, te;
      switch (["ArrowLeft", "ArrowRight", "Enter"].indexOf(X.key) !== -1 && s.value === "tags" && (Z = [...U.value.querySelectorAll("[data-tags] > *")].filter((pe) => pe !== A.value), te = Z.findIndex((pe) => pe === document.activeElement)), X.key) {
        case "Backspace":
          if (s.value === "single" || n.value && [null, ""].indexOf(V.value) === -1 || y.value.length === 0)
            return;
          let pe = y.value.filter((Ce) => !Ce.disabled && Ce.remove !== !1);
          pe.length && P(pe[pe.length - 1]);
          break;
        case "Enter":
          if (X.preventDefault(), X.keyCode === 229)
            return;
          if (te !== -1 && te !== void 0) {
            S([...y.value].filter((Ce, ce) => ce !== te)), te === Z.length - 1 && (Z.length - 1 ? Z[Z.length - 2].focus() : n.value ? A.value.querySelector("input").focus() : z.value.focus());
            return;
          }
          if (G.value.indexOf("enter") === -1 && re.value)
            return;
          ee(), D();
          break;
        case " ":
          if (!re.value && !n.value) {
            X.preventDefault(), ee(), D();
            return;
          }
          if (!re.value)
            return !1;
          if (G.value.indexOf("space") === -1 && re.value)
            return;
          X.preventDefault(), ee(), D();
          break;
        case "Tab":
        case ";":
        case ",":
          if (G.value.indexOf(X.key.toLowerCase()) === -1 || !re.value)
            return;
          ee(), D(), X.preventDefault();
          break;
        case "Escape":
          N();
          break;
        case "ArrowUp":
          if (X.preventDefault(), !d.value)
            return;
          Y.value || K(), j();
          break;
        case "ArrowDown":
          if (X.preventDefault(), !d.value)
            return;
          Y.value || K(), k();
          break;
        case "ArrowLeft":
          if (n.value && A.value && A.value.querySelector("input").selectionStart || X.shiftKey || s.value !== "tags" || !y.value || !y.value.length)
            return;
          X.preventDefault(), te === -1 ? Z[Z.length - 1].focus() : te > 0 && Z[te - 1].focus();
          break;
        case "ArrowRight":
          if (te === -1 || X.shiftKey || s.value !== "tags" || !y.value || !y.value.length)
            return;
          X.preventDefault(), Z.length > te + 1 ? Z[te + 1].focus() : n.value ? A.value.querySelector("input").focus() : n.value || z.value.focus();
          break;
      }
    },
    handleKeyup: (X) => {
      a.emit("keyup", X, g);
    },
    preparePointer: ee
  };
}
function vi(e, a, t) {
  const {
    classes: s,
    disabled: i,
    showOptions: h,
    breakTags: n
  } = Be(e), d = t.isOpen, m = t.isPointed, w = t.isSelected, p = t.isDisabled, x = t.isActive, T = t.canPointGroups, E = t.resolving, g = t.fo, y = t.placement, S = _(() => ({
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
  })), P = _(() => !!(d.value && h.value && (!E.value || E.value && g.value.length)));
  return {
    classList: _(() => {
      const b = S.value;
      return {
        container: [b.container].concat(i.value ? b.containerDisabled : []).concat(P.value && y.value === "top" ? b.containerOpenTop : []).concat(P.value && y.value !== "top" ? b.containerOpen : []).concat(x.value ? b.containerActive : []),
        wrapper: b.wrapper,
        spacer: b.spacer,
        singleLabel: b.singleLabel,
        singleLabelText: b.singleLabelText,
        multipleLabel: b.multipleLabel,
        search: b.search,
        tags: b.tags,
        tag: [b.tag].concat(i.value ? b.tagDisabled : []),
        tagWrapper: [b.tagWrapper, n.value ? b.tagWrapperBreak : null],
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
        dropdown: [b.dropdown].concat(y.value === "top" ? b.dropdownTop : []).concat(!d.value || !h.value || !P.value ? b.dropdownHidden : []),
        options: [b.options].concat(y.value === "top" ? b.optionsTop : []),
        group: b.group,
        groupLabel: (D) => {
          let j = [b.groupLabel];
          return m(D) ? j.push(w(D) ? b.groupLabelSelectedPointed : b.groupLabelPointed) : w(D) && T.value ? j.push(p(D) ? b.groupLabelSelectedDisabled : b.groupLabelSelected) : p(D) && j.push(b.groupLabelDisabled), T.value && j.push(b.groupLabelPointable), j;
        },
        groupOptions: b.groupOptions,
        option: (D, j) => {
          let k = [b.option];
          return m(D) ? k.push(w(D) ? b.optionSelectedPointed : b.optionPointed) : w(D) ? k.push(p(D) ? b.optionSelectedDisabled : b.optionSelected) : (p(D) || j && p(j)) && k.push(b.optionDisabled), k;
        },
        noOptions: b.noOptions,
        noResults: b.noResults,
        assist: b.assist,
        fakeInput: b.fakeInput
      };
    }),
    showDropdown: P
  };
}
function hi(e, a, t) {
  const {
    limit: s,
    infinite: i
  } = Be(e), h = t.isOpen, n = t.offset, d = t.search, m = t.pfo, w = t.eo, p = he(null), x = he(null), T = _(() => n.value < m.value.length), E = (y) => {
    const { isIntersecting: S, target: P } = y[0];
    if (S) {
      const V = P.offsetParent, b = V.scrollTop;
      n.value += s.value == -1 ? 10 : s.value, Xt(() => {
        V.scrollTop = b;
      });
    }
  }, g = () => {
    h.value && n.value < m.value.length ? p.value.observe(x.value) : !h.value && p.value && p.value.disconnect();
  };
  return ge(h, () => {
    i.value && g();
  }), ge(d, () => {
    i.value && (n.value = s.value, g());
  }, { flush: "post" }), ge(w, () => {
    i.value && g();
  }, { immediate: !1, flush: "post" }), pa(() => {
    window && window.IntersectionObserver && (p.value = new IntersectionObserver(E));
  }), {
    hasMore: T,
    infiniteLoader: x
  };
}
function mi(e, a, t) {
  const {
    placeholder: s,
    id: i,
    valueProp: h,
    label: n,
    mode: d,
    groupLabel: m,
    aria: w,
    searchable: p
  } = Be(e), x = t.pointer, T = t.iv, E = t.hasSelected, g = t.multipleLabelText, y = he(null), S = _(() => {
    let N = [];
    return i && i.value && N.push(i.value), N.push("assist"), N.join("-");
  }), P = _(() => {
    let N = [];
    return i && i.value && N.push(i.value), N.push("multiselect-options"), N.join("-");
  }), V = _(() => {
    let N = [];
    if (i && i.value && N.push(i.value), x.value)
      return N.push(x.value.group ? "multiselect-group" : "multiselect-option"), N.push(x.value.group ? x.value.index : x.value[h.value]), N.join("-");
  }), b = _(() => s.value), D = _(() => d.value !== "single"), j = _(() => {
    let N = "";
    return d.value === "single" && E.value && (N += T.value[n.value]), d.value === "multiple" && E.value && (N += g.value), d.value === "tags" && E.value && (N += T.value.map((H) => H[n.value]).join(", ")), N;
  }), k = _(() => {
    let N = { ...w.value };
    return p.value && (N["aria-labelledby"] = N["aria-labelledby"] ? `${S.value} ${N["aria-labelledby"]}` : S.value, j.value && N["aria-label"] && (N["aria-label"] = `${j.value}, ${N["aria-label"]}`)), N;
  }), U = (N) => {
    let H = [];
    return i && i.value && H.push(i.value), H.push("multiselect-option"), H.push(N[h.value]), H.join("-");
  }, z = (N) => {
    let H = [];
    return i && i.value && H.push(i.value), H.push("multiselect-group"), H.push(N.index), H.join("-");
  }, A = (N) => {
    let H = [];
    return H.push(N), H.join(" ");
  }, Y = (N) => {
    let H = [];
    return H.push(N), H.join(" ");
  }, K = (N) => `${N} ❎`;
  return pa(() => {
    if (i && i.value && document && document.querySelector) {
      let N = document.querySelector(`[for="${i.value}"]`);
      y.value = N ? N.innerText : null;
    }
  }), {
    arias: k,
    ariaLabel: j,
    ariaAssist: S,
    ariaControls: P,
    ariaPlaceholder: b,
    ariaMultiselectable: D,
    ariaActiveDescendant: V,
    ariaOptionId: U,
    ariaOptionLabel: A,
    ariaGroupId: z,
    ariaGroupLabel: Y,
    ariaTagLabel: K
  };
}
function gi(e, a, t) {
  const {
    locale: s,
    fallbackLocale: i
  } = Be(e);
  return {
    localize: (n) => !n || typeof n != "object" ? n : n && n[s.value] ? n[s.value] : n && s.value && n[s.value.toUpperCase()] ? n[s.value.toUpperCase()] : n && n[i.value] ? n[i.value] : n && i.value && n[i.value.toUpperCase()] ? n[i.value.toUpperCase()] : n && Object.keys(n)[0] ? n[Object.keys(n)[0]] : ""
  };
}
function bi(e, a, t) {
  const s = he(null), i = he(null), h = he(null), n = he(null), d = he(null);
  return {
    multiselect: s,
    wrapper: i,
    tags: h,
    input: n,
    dropdown: d
  };
}
function yi(e, a, t, s = {}) {
  return t.forEach((i) => {
    i && (s = {
      ...s,
      ...i(e, a, s)
    });
  }), s;
}
var Ra = {
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
      sn,
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
const wi = ["id", "dir"], Si = ["tabindex", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable", "role"], Oi = ["type", "modelValue", "value", "autocomplete", "id", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable"], xi = ["onKeyup", "aria-label"], Ei = ["onClick"], Pi = ["type", "modelValue", "value", "id", "autocomplete", "aria-controls", "aria-placeholder", "aria-expanded", "aria-activedescendant", "aria-multiselectable"], ki = ["innerHTML"], Ci = ["id"], Li = ["id"], Ti = ["id", "aria-label", "aria-selected"], Ai = ["data-pointed", "onMouseenter", "onMousedown"], Di = ["innerHTML"], Ni = ["aria-label"], Bi = ["data-pointed", "data-selected", "onMouseenter", "onMousedown", "id", "aria-selected", "aria-label"], Mi = ["data-pointed", "data-selected", "onMouseenter", "onMousedown", "id", "aria-selected", "aria-label"], Vi = ["innerHTML"], ji = ["innerHTML"], qi = ["value"], Ri = ["name", "value"], Ii = ["name", "value"], Fi = ["id"];
function zi(e, a, t, s, i, h) {
  return ne(), le("div", {
    ref: "multiselect",
    class: de(e.classList.container),
    id: t.searchable ? void 0 : t.id,
    dir: t.rtl ? "rtl" : void 0,
    onFocusin: a[12] || (a[12] = (...n) => e.handleFocusIn && e.handleFocusIn(...n)),
    onFocusout: a[13] || (a[13] = (...n) => e.handleFocusOut && e.handleFocusOut(...n)),
    onKeyup: a[14] || (a[14] = (...n) => e.handleKeyup && e.handleKeyup(...n)),
    onKeydown: a[15] || (a[15] = (...n) => e.handleKeydown && e.handleKeydown(...n))
  }, [
    Q("div", ua({
      class: e.classList.wrapper,
      onMousedown: a[9] || (a[9] = (...n) => e.handleMousedown && e.handleMousedown(...n)),
      ref: "wrapper",
      tabindex: e.tabindex,
      "aria-controls": t.searchable ? void 0 : e.ariaControls,
      "aria-placeholder": t.searchable ? void 0 : e.ariaPlaceholder,
      "aria-expanded": t.searchable ? void 0 : e.isOpen,
      "aria-activedescendant": t.searchable ? void 0 : e.ariaActiveDescendant,
      "aria-multiselectable": t.searchable ? void 0 : e.ariaMultiselectable,
      role: t.searchable ? void 0 : "combobox"
    }, t.searchable ? {} : e.arias), [
      ue(" Search "),
      t.mode !== "tags" && t.searchable && !t.disabled ? (ne(), le("input", ua({
        key: 0,
        type: t.inputType,
        modelValue: e.search,
        value: e.search,
        class: e.classList.search,
        autocomplete: t.autocomplete,
        id: t.searchable ? t.id : void 0,
        onInput: a[0] || (a[0] = (...n) => e.handleSearchInput && e.handleSearchInput(...n)),
        onKeypress: a[1] || (a[1] = (...n) => e.handleKeypress && e.handleKeypress(...n)),
        onPaste: a[2] || (a[2] = Mt((...n) => e.handlePaste && e.handlePaste(...n), ["stop"])),
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
      }), null, 16, Oi)) : ue("v-if", !0),
      ue(" Tags (with search) "),
      t.mode == "tags" ? (ne(), le(
        "div",
        {
          key: 1,
          class: de(e.classList.tags),
          "data-tags": ""
        },
        [
          (ne(!0), le(
            ot,
            null,
            ft(e.iv, (n, d, m) => Ne(e.$slots, "tag", {
              option: n,
              handleTagRemove: e.handleTagRemove,
              disabled: t.disabled
            }, () => [
              (ne(), le("span", {
                class: de([
                  e.classList.tag,
                  n.disabled ? e.classList.tagDisabled : null
                ]),
                tabindex: "-1",
                onKeyup: Ja((w) => e.handleTagRemove(n, w), ["enter"]),
                key: m,
                "aria-label": e.ariaTagLabel(e.localize(n[t.label]))
              }, [
                Q(
                  "span",
                  {
                    class: de(e.classList.tagWrapper)
                  },
                  Ve(e.localize(n[t.label])),
                  3
                  /* TEXT, CLASS */
                ),
                !t.disabled && !n.disabled ? (ne(), le("span", {
                  key: 0,
                  class: de(e.classList.tagRemove),
                  onClick: Mt((w) => e.handleTagRemove(n, w), ["stop"])
                }, [
                  Q(
                    "span",
                    {
                      class: de(e.classList.tagRemoveIcon)
                    },
                    null,
                    2
                    /* CLASS */
                  )
                ], 10, Ei)) : ue("v-if", !0)
              ], 42, xi))
            ])),
            256
            /* UNKEYED_FRAGMENT */
          )),
          Q(
            "div",
            {
              class: de(e.classList.tagsSearchWrapper),
              ref: "tags"
            },
            [
              ue(" Used for measuring search width "),
              Q(
                "span",
                {
                  class: de(e.classList.tagsSearchCopy)
                },
                Ve(e.search),
                3
                /* TEXT, CLASS */
              ),
              ue(" Actual search input "),
              t.searchable && !t.disabled ? (ne(), le("input", ua({
                key: 0,
                type: t.inputType,
                modelValue: e.search,
                value: e.search,
                class: e.classList.tagsSearch,
                id: t.searchable ? t.id : void 0,
                autocomplete: t.autocomplete,
                onInput: a[3] || (a[3] = (...n) => e.handleSearchInput && e.handleSearchInput(...n)),
                onKeypress: a[4] || (a[4] = (...n) => e.handleKeypress && e.handleKeypress(...n)),
                onPaste: a[5] || (a[5] = Mt((...n) => e.handlePaste && e.handlePaste(...n), ["stop"])),
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
              }), null, 16, Pi)) : ue("v-if", !0)
            ],
            2
            /* CLASS */
          )
        ],
        2
        /* CLASS */
      )) : ue("v-if", !0),
      ue(" Single label "),
      t.mode == "single" && e.hasSelected && !e.search && e.iv ? Ne(e.$slots, "singlelabel", {
        key: 2,
        value: e.iv
      }, () => [
        Q(
          "div",
          {
            class: de(e.classList.singleLabel)
          },
          [
            Q(
              "span",
              {
                class: de(e.classList.singleLabelText)
              },
              Ve(e.localize(e.iv[t.label])),
              3
              /* TEXT, CLASS */
            )
          ],
          2
          /* CLASS */
        )
      ]) : ue("v-if", !0),
      ue(" Multiple label "),
      t.mode == "multiple" && e.hasSelected && !e.search ? Ne(e.$slots, "multiplelabel", {
        key: 3,
        values: e.iv
      }, () => [
        Q("div", {
          class: de(e.classList.multipleLabel),
          innerHTML: e.multipleLabelText
        }, null, 10, ki)
      ]) : ue("v-if", !0),
      ue(" Placeholder "),
      t.placeholder && !e.hasSelected && !e.search ? Ne(e.$slots, "placeholder", { key: 4 }, () => [
        Q(
          "div",
          {
            class: de(e.classList.placeholder),
            "aria-hidden": "true"
          },
          Ve(t.placeholder),
          3
          /* TEXT, CLASS */
        )
      ]) : ue("v-if", !0),
      ue(" Spinner "),
      t.loading || e.resolving ? Ne(e.$slots, "spinner", { key: 5 }, () => [
        Q(
          "span",
          {
            class: de(e.classList.spinner),
            "aria-hidden": "true"
          },
          null,
          2
          /* CLASS */
        )
      ]) : ue("v-if", !0),
      ue(" Clear "),
      e.hasSelected && !t.disabled && t.canClear && !e.busy ? Ne(e.$slots, "clear", {
        key: 6,
        clear: e.clear
      }, () => [
        Q(
          "span",
          {
            "aria-hidden": "true",
            tabindex: "0",
            role: "button",
            "data-clear": "",
            "aria-roledescription": "❎",
            class: de(e.classList.clear),
            onClick: a[6] || (a[6] = (...n) => e.clear && e.clear(...n)),
            onKeyup: a[7] || (a[7] = Ja((...n) => e.clear && e.clear(...n), ["enter"]))
          },
          [
            Q(
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
      ]) : ue("v-if", !0),
      ue(" Caret "),
      t.caret && t.showOptions ? Ne(e.$slots, "caret", {
        key: 7,
        handleCaretClick: e.handleCaretClick,
        isOpen: e.isOpen
      }, () => [
        Q(
          "span",
          {
            class: de(e.classList.caret),
            onClick: a[8] || (a[8] = (...n) => e.handleCaretClick && e.handleCaretClick(...n)),
            "aria-hidden": "true"
          },
          null,
          2
          /* CLASS */
        )
      ]) : ue("v-if", !0)
    ], 16, Si),
    ue(" Options "),
    (ne(), ur(Dr, {
      to: t.appendTo || "body",
      disabled: !t.appendToBody && !t.appendTo
    }, [
      Q("div", {
        id: t.id ? `${t.id}-dropdown` : void 0,
        class: de(e.classList.dropdown),
        tabindex: "-1",
        ref: "dropdown",
        onFocusin: a[10] || (a[10] = (...n) => e.handleFocusIn && e.handleFocusIn(...n)),
        onFocusout: a[11] || (a[11] = (...n) => e.handleFocusOut && e.handleFocusOut(...n))
      }, [
        Ne(e.$slots, "beforelist", { options: e.fo }),
        Q("ul", {
          class: de(e.classList.options),
          id: e.ariaControls,
          role: "listbox"
        }, [
          t.groups ? (ne(!0), le(
            ot,
            { key: 0 },
            ft(e.fg, (n, d, m) => (ne(), le("li", {
              class: de(e.classList.group),
              key: m,
              id: e.ariaGroupId(n),
              "aria-label": e.ariaGroupLabel(e.localize(n[t.groupLabel])),
              "aria-selected": e.isSelected(n),
              role: "option"
            }, [
              n.__CREATE__ ? ue("v-if", !0) : (ne(), le("div", {
                key: 0,
                class: de(e.classList.groupLabel(n)),
                "data-pointed": e.isPointed(n),
                onMouseenter: (w) => e.setPointer(n, d),
                onMousedown: Mt((w) => e.handleGroupClick(n), ["prevent"])
              }, [
                Ne(e.$slots, "grouplabel", {
                  group: n,
                  isSelected: e.isSelected,
                  isPointed: e.isPointed
                }, () => [
                  Q("span", {
                    innerHTML: e.localize(n[t.groupLabel])
                  }, null, 8, Di)
                ])
              ], 42, Ai)),
              Q("ul", {
                class: de(e.classList.groupOptions),
                "aria-label": e.ariaGroupLabel(e.localize(n[t.groupLabel])),
                role: "group"
              }, [
                (ne(!0), le(
                  ot,
                  null,
                  ft(n.__VISIBLE__, (w, p, x) => (ne(), le("li", {
                    class: de(e.classList.option(w, n)),
                    "data-pointed": e.isPointed(w),
                    "data-selected": e.isSelected(w) || void 0,
                    key: x,
                    onMouseenter: (T) => e.setPointer(w),
                    onMousedown: Mt((T) => e.handleOptionClick(w), ["prevent"]),
                    id: e.ariaOptionId(w),
                    "aria-selected": e.isSelected(w),
                    "aria-label": e.ariaOptionLabel(e.localize(w[t.label])),
                    role: "option"
                  }, [
                    Ne(e.$slots, "option", {
                      option: w,
                      isSelected: e.isSelected,
                      isPointed: e.isPointed,
                      search: e.search
                    }, () => [
                      Q(
                        "span",
                        null,
                        Ve(e.localize(w[t.label])),
                        1
                        /* TEXT */
                      )
                    ])
                  ], 42, Bi))),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ], 10, Ni)
            ], 10, Ti))),
            128
            /* KEYED_FRAGMENT */
          )) : (ne(!0), le(
            ot,
            { key: 1 },
            ft(e.fo, (n, d, m) => (ne(), le("li", {
              class: de(e.classList.option(n)),
              "data-pointed": e.isPointed(n),
              "data-selected": e.isSelected(n) || void 0,
              key: m,
              onMouseenter: (w) => e.setPointer(n),
              onMousedown: Mt((w) => e.handleOptionClick(n), ["prevent"]),
              id: e.ariaOptionId(n),
              "aria-selected": e.isSelected(n),
              "aria-label": e.ariaOptionLabel(e.localize(n[t.label])),
              role: "option"
            }, [
              Ne(e.$slots, "option", {
                option: n,
                isSelected: e.isSelected,
                isPointed: e.isPointed,
                search: e.search
              }, () => [
                Q(
                  "span",
                  null,
                  Ve(e.localize(n[t.label])),
                  1
                  /* TEXT */
                )
              ])
            ], 42, Mi))),
            128
            /* KEYED_FRAGMENT */
          ))
        ], 10, Li),
        e.noOptions ? Ne(e.$slots, "nooptions", { key: 0 }, () => [
          Q("div", {
            class: de(e.classList.noOptions),
            innerHTML: e.localize(t.noOptionsText)
          }, null, 10, Vi)
        ]) : ue("v-if", !0),
        e.noResults ? Ne(e.$slots, "noresults", { key: 1 }, () => [
          Q("div", {
            class: de(e.classList.noResults),
            innerHTML: e.localize(t.noResultsText)
          }, null, 10, ji)
        ]) : ue("v-if", !0),
        t.infinite && e.hasMore ? (ne(), le(
          "div",
          {
            key: 2,
            class: de(e.classList.inifinite),
            ref: "infiniteLoader"
          },
          [
            Ne(e.$slots, "infinite", {}, () => [
              Q(
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
        )) : ue("v-if", !0),
        Ne(e.$slots, "afterlist", { options: e.fo })
      ], 42, Ci)
    ], 8, ["to", "disabled"])),
    ue(" Hacky input element to show HTML5 required warning "),
    t.required ? (ne(), le("input", {
      key: 0,
      class: de(e.classList.fakeInput),
      tabindex: "-1",
      value: e.textValue,
      required: ""
    }, null, 10, qi)) : ue("v-if", !0),
    ue(" Native input support "),
    t.nativeSupport ? (ne(), le(
      ot,
      { key: 1 },
      [
        t.mode == "single" ? (ne(), le("input", {
          key: 0,
          type: "hidden",
          name: t.name,
          value: e.plainValue !== void 0 ? e.plainValue : ""
        }, null, 8, Ri)) : (ne(!0), le(
          ot,
          { key: 1 },
          ft(e.plainValue, (n, d) => (ne(), le("input", {
            type: "hidden",
            name: `${t.name}[]`,
            value: n,
            key: d
          }, null, 8, Ii))),
          128
          /* KEYED_FRAGMENT */
        ))
      ],
      64
      /* STABLE_FRAGMENT */
    )) : ue("v-if", !0),
    ue(" Screen reader assistive text "),
    t.searchable && e.hasSelected ? (ne(), le("div", {
      key: 2,
      class: de(e.classList.assist),
      id: e.ariaAssist,
      "aria-hidden": "true"
    }, Ve(e.ariaLabel), 11, Fi)) : ue("v-if", !0),
    ue(" Create height for empty input "),
    Q(
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
Ra.render = zi;
Ra.__file = "src/Multiselect.vue";
const Ui = {
  name: "CompendiumBrowserPowers",
  props: ["tab"],
  // Imported components that need to be available in the <template>
  components: {
    Slider: Ta,
    Multiselect: Ra
  },
  setup() {
    return {
      // Imported methods that need to be available in the <template>
      getActorModuleArt: Za,
      openDocument: Rr,
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
      return e.length > this.pager.perPage ? (this.pager.totalRows = e.length, this.pager.lastIndex == 0 && (this.pager.lastIndex = this.pager.perPage - 1)) : this.pager.totalRows = 0, e = e.sort((a, t) => {
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
    console.log("Creating compendium browser creatures tab..."), qr([
      "dnd5e.monsters"
      // insert additional packs as needed.
    ], [
      "img",
      "system.details.cr",
      "system.details.type",
      "system.traits.size"
      // insert additional properties as needed.
    ]).then((e) => {
      var a, t, s, i, h;
      if (!((t = (a = game.dnd5e) == null ? void 0 : a.moduleArt) != null && t.suppressArt) && ((h = (i = (s = game.dnd5e) == null ? void 0 : s.moduleArt) == null ? void 0 : i.map) == null ? void 0 : h.size) > 0)
        for (let n of e)
          n.img = Za(n);
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
}, Hi = { class: "npc-browser browser flexrow" }, $i = { class: "control-area" }, Wi = { class: "filtercontainer" }, Gi = { class: "filter" }, _i = {
  class: "unit-title",
  for: "compendiumBrowser.name"
}, Ki = { class: "sorter" }, Xi = ["value"], Yi = { class: "list-area flexcol" }, Ji = {
  key: 0,
  class: "compendium-browser-results compendium-browser-npcs"
}, Qi = ["data-document-id", "onClick", "onDragstart"], Zi = { class: "npc-image" }, el = ["src"], tl = { class: "npc-line" }, al = { class: "npc-name" }, rl = { class: "npc-tags" }, nl = ["data-tooltip"], il = { class: "size" }, ll = { class: "type" }, ol = {
  key: 1,
  class: "compendium-browser-loading"
}, sl = /* @__PURE__ */ Q("p", null, [
  /* @__PURE__ */ Q("i", { class: "fas fa-circle-notch fa-spin" }),
  /* @__PURE__ */ La("Please wait, loading...")
], -1), ul = [
  sl
];
function cl(e, a, t, s, i, h) {
  return ne(), le("div", Hi, [
    Q("section", $i, [
      Q("div", Wi, [
        Q("div", Gi, [
          Q("label", _i, Ve(s.game.i18n.localize("Name")), 1),
          Qa(Q("input", {
            type: "text",
            name: "compendiumBrowser.name",
            "onUpdate:modelValue": a[0] || (a[0] = (n) => i.name = n),
            placeholder: "Hydra"
          }, null, 512), [
            [Mr, i.name]
          ])
        ]),
        Q("dl", Ki, [
          Q("dt", null, Ve(s.game.i18n.localize("Sort by:")), 1),
          Q("dd", null, [
            Qa(Q("select", {
              class: "sort",
              name: "sortorder",
              "onUpdate:modelValue": a[1] || (a[1] = (n) => i.sortBy = n)
            }, [
              (ne(!0), le(ot, null, ft(i.sortOptions, (n, d) => (ne(), le("option", {
                key: d,
                value: n.value
              }, Ve(n.label), 9, Xi))), 128))
            ], 512), [
              [Vr, i.sortBy]
            ])
          ])
        ]),
        Q("button", {
          type: "reset",
          onClick: a[2] || (a[2] = (n) => h.resetFilters())
        }, Ve(s.game.i18n.localize("Reset Filters")), 1)
      ])
    ]),
    Q("div", Yi, [
      i.loaded ? (ne(), le("ul", Ji, [
        (ne(!0), le(ot, null, ft(h.entries, (n, d) => (ne(), le("li", {
          key: d,
          class: de(`npc flexrow draggable compendium-browser-row${d >= i.pager.lastIndex - 1 && d < i.pager.totalRows - 1 ? " compendium-browser-row-observe" : ""} document actor`),
          "data-document-id": n._id,
          onClick: (m) => s.openDocument(n.uuid),
          onDragstart: (m) => s.startDrag(m, n, "Actor"),
          draggable: "true"
        }, [
          Q("div", Zi, [
            Q("img", {
              src: n.img ?? "icons/svg/mystery-man.svg"
            }, null, 8, el)
          ]),
          Q("div", tl, [
            Q("div", al, [
              Q("a", null, Ve(n.name), 1)
            ]),
            Q("div", rl, [
              Q("span", {
                class: "cr",
                "data-tooltip": s.game.i18n.localize("Challenge rating")
              }, Ve(n.system.details.cr), 9, nl),
              Q("span", il, Ve(n.system.traits.size), 1),
              Q("span", ll, Ve(n.system.details.type.value), 1)
            ])
          ])
        ], 42, Qi))), 128))
      ])) : (ne(), le("div", ol, ul))
    ])
  ]);
}
const dl = /* @__PURE__ */ Zt(Ui, [["render", cl]]), fl = {
  name: "ArchmageCompendiumBrowser",
  props: ["context"],
  components: {
    Tabs: Wr,
    Tab: Xr,
    Stub: Qr,
    CompendiumBrowserCreatures: dl
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
}, pl = { class: "compendium-browser-vue parent flexcol" }, vl = { class: "content" };
function hl(e, a, t, s, i, h) {
  const n = la("Tabs"), d = la("CompendiumBrowserCreatures"), m = la("Tab"), w = la("Stub");
  return ne(), le("div", pl, [
    Vt(n, {
      group: "primary",
      tabs: i.tabs.primary
    }, null, 8, ["tabs"]),
    Q("section", vl, [
      Vt(m, {
        group: "primary",
        tab: i.tabs.primary.creatures,
        classes: "container container--bottom flexrow"
      }, {
        default: _t(() => [
          i.tabs.primary.creatures.active || i.tabs.primary.creatures.opened ? (ne(), ur(d, {
            key: 0,
            tab: i.tabs.primary.creatures
          }, null, 8, ["tab"])) : ue("", !0)
        ]),
        _: 1
      }, 8, ["tab"]),
      Vt(m, {
        group: "primary",
        tab: i.tabs.primary.powers,
        classes: "container container--bottom flexrow"
      }, {
        default: _t(() => [
          Vt(w, null, {
            default: _t(() => [
              La("Spells")
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["tab"]),
      Vt(m, {
        group: "primary",
        tab: i.tabs.primary.items,
        classes: "container container--bottom flexrow"
      }, {
        default: _t(() => [
          Vt(w, null, {
            default: _t(() => [
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
const gl = /* @__PURE__ */ Zt(fl, [["render", hl]]);
export {
  gl as VueCompendiumBrowser
};
//# sourceMappingURL=components.vue.es.js.map
