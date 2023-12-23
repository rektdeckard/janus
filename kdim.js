{
  var Ft = Object.defineProperty;
  var _t = (o, t, r) =>
    t in o
      ? Ft(o, t, { enumerable: !0, configurable: !0, writable: !0, value: r })
      : (o[t] = r);
  var N = (o, t, r) => (_t(o, typeof t != "symbol" ? t + "" : t, r), r),
    wt = (o, t, r) => {
      if (!t.has(o)) throw TypeError("Cannot " + r);
    };
  var n = (o, t, r) => (
      wt(o, t, "read from private field"), r ? r.call(o) : t.get(o)
    ),
    f = (o, t, r) => {
      if (t.has(o))
        throw TypeError("Cannot add the same private member more than once");
      t instanceof WeakSet ? t.add(o) : t.set(o, r);
    },
    u = (o, t, r, e) => (
      wt(o, t, "write to private field"), e ? e.call(o, r) : t.set(o, r), r
    );
  var gt = (o, t, r, e) => ({
      set _(i) {
        u(o, t, i, r);
      },
      get _() {
        return n(o, t, e);
      },
    }),
    M = (o, t, r) => (wt(o, t, "access private method"), r);
  const kt = {
      algorithm: "SHA-1",
    },
    Dt = /* @__PURE__ */ new Set(["SHA-1", "SHA-256", "SHA-384", "SHA-512"]);
  async function lt(o, t = {}) {
    if (typeof o > "u" || o === null)
      throw new Error("Object argument required");
    const { algorithm: r } = { ...kt, ...t };
    if (!Dt.has(r.toUpperCase())) throw new Error(`Invalid algorithm ${r}`);
    const e = new Ut();
    return (
      Lt({}, e).dispatch(o),
      typeof window > "u"
        ? Array.from(
            new Uint8Array(
              await require("crypto").webcrypto.subtle.digest(
                r,
                new TextEncoder().encode(e.read())
              )
            )
          )
            .map((s) => s.toString(16))
            .join("")
        : Array.from(
            new Uint8Array(
              await crypto.subtle.digest(
                "SHA-1",
                new TextEncoder().encode(e.read())
              )
            )
          )
            .map((s) => s.toString(16))
            .join("")
    );
  }
  function Lt(o = {}, t, r = []) {
    const e = (i) => (t.update ? t.update(i, "utf8") : t.write(i, "utf8"));
    return {
      dispatch: function (i) {
        return this["_" + (i === null ? "null" : typeof i)](i);
      },
      _object: function (i) {
        const s = /\[object (.*)\]/i,
          l = Object.prototype.toString.call(i),
          a = s.exec(l),
          h = (a ? a[1] : "unknown:[" + l + "]").toLowerCase();
        let c = null;
        if ((c = r.indexOf(i)) >= 0)
          return this.dispatch("[CIRCULAR:" + c + "]");
        if (
          (r.push(i),
          h !== "object" && h !== "function" && h !== "asyncfunction")
        )
          if (this["_" + h]) this["_" + h](i);
          else throw new Error('Unknown object type "' + h + '"');
        else {
          var d = Object.keys(i);
          (d = d.sort()),
            d.splice(0, 0, "prototype", "__proto__", "constructor"),
            e("object:" + d.length + ":");
          const S = this;
          return d.forEach(function (D) {
            S.dispatch(D), e(":"), S.dispatch(i[D]), e(",");
          });
        }
      },
      _array: function (i, s = !1) {
        const l = this;
        if ((e("array:" + i.length + ":"), !s || i.length <= 1))
          return i.forEach((c) => l.dispatch(c));
        let a = [];
        const h = i.map((c) => {
          const d = new Ut(),
            S = r.slice();
          return (
            Lt(o, d, S).dispatch(c),
            (a = a.concat(S.slice(r.length))),
            d.read().toString()
          );
        });
        return (r = r.concat(a)), h.sort(), this._array(h, !1);
      },
      _date: function (i) {
        return e("date:" + i.toJSON());
      },
      _symbol: function (i) {
        return e("symbol:" + i.toString());
      },
      _error: function (i) {
        return e("error:" + i.toString());
      },
      _boolean: function (i) {
        return e("bool:" + i.toString());
      },
      _string: function (i) {
        e("string:" + i.length + ":"), e(i.toString());
      },
      _function: function (i) {
        e("fn:"), this.dispatch(i.toString());
      },
      _number: function (i) {
        return e("number:" + i.toString());
      },
      _xml: function (i) {
        return e("xml:" + i.toString());
      },
      _null: function () {
        return e("Null");
      },
      _undefined: function () {
        return e("Undefined");
      },
      _regexp: function (i) {
        return e("regex:" + i.toString());
      },
      _uint8array: function (i) {
        return e("uint8array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _uint8clampedarray: function (i) {
        return (
          e("uint8clampedarray:"), this.dispatch(Array.prototype.slice.call(i))
        );
      },
      _int8array: function (i) {
        return e("int8array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _uint16array: function (i) {
        return e("uint16array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _int16array: function (i) {
        return e("int16array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _uint32array: function (i) {
        return e("uint32array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _int32array: function (i) {
        return e("int32array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _float32array: function (i) {
        return e("float32array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _float64array: function (i) {
        return e("float64array:"), this.dispatch(Array.prototype.slice.call(i));
      },
      _arraybuffer: function (i) {
        return e("arraybuffer:"), this.dispatch(new Uint8Array(i));
      },
      _url: function (i) {
        return e("url:" + i.toString());
      },
      _map: function (i) {
        e("map:");
        var s = Array.from(i);
        return this._array(s, o.unorderedSets !== !1);
      },
      _set: function (i) {
        e("set:");
        var s = Array.from(i);
        return this._array(s, o.unorderedSets !== !1);
      },
      _file: function (i) {
        return (
          e("file:"), this.dispatch([i.name, i.size, i.type, i.lastModified])
        );
      },
      _blob: function () {
        throw Error("Hashing Blob objects is currently not supported.");
      },
      _domwindow: function () {
        return e("domwindow");
      },
      _bigint: function (i) {
        return e("bigint:" + i.toString());
      },
      /* Node.js standard native objects */
      _process: function () {
        return e("process");
      },
      _timer: function () {
        return e("timer");
      },
      _pipe: function () {
        return e("pipe");
      },
      _tcp: function () {
        return e("tcp");
      },
      _udp: function () {
        return e("udp");
      },
      _tty: function () {
        return e("tty");
      },
      _statwatcher: function () {
        return e("statwatcher");
      },
      _securecontext: function () {
        return e("securecontext");
      },
      _connection: function () {
        return e("connection");
      },
      _zlib: function () {
        return e("zlib");
      },
      _context: function () {
        return e("context");
      },
      _nodescript: function () {
        return e("nodescript");
      },
      _httpparser: function () {
        return e("httpparser");
      },
      _dataview: function () {
        return e("dataview");
      },
      _signal: function () {
        return e("signal");
      },
      _fsevent: function () {
        return e("fsevent");
      },
      _tlswrap: function () {
        return e("tlswrap");
      },
    };
  }
  class Ut {
    constructor() {
      N(this, "buf", "");
    }
    write(t) {
      this.buf += t;
    }
    end(t) {
      this.buf += t;
    }
    read() {
      return this.buf;
    }
  }
  var B, G, rt, et, dt;
  const ct = class ct {
    constructor({
      size: t = 16 ** 5,
      hashFunctions: r = ct.DEFAULT_HASH_FUNCTIONS,
    } = {}) {
      f(this, et);
      f(this, B, void 0);
      f(this, G, void 0);
      f(this, rt, void 0);
      u(this, B, t), u(this, G, new Array(t)), u(this, rt, r);
    }
    async add(t) {
      const r = await M(this, et, dt).call(this, t);
      for (const e of r) {
        const i = parseInt(e.substring(0, 8), 16) % n(this, B);
        n(this, G)[i] = !0;
      }
    }
    async test(t) {
      const r = await M(this, et, dt).call(this, t);
      for (const e of r) {
        const i = parseInt(e.substring(0, 8), 16) % n(this, B);
        if (n(this, G)[i]) return !0;
      }
      return !1;
    }
  };
  (B = new WeakMap()),
    (G = new WeakMap()),
    (rt = new WeakMap()),
    (et = new WeakSet()),
    (dt = async function (t) {
      return Promise.all(n(this, rt).map((r) => r(t)));
    }),
    N(ct, "DEFAULT_HASH_FUNCTIONS", [
      (t) => lt(t, { algorithm: "SHA-1" }),
      (t) => lt(t, { algorithm: "SHA-256" }),
      (t) => lt(t, { algorithm: "SHA-384" }),
      (t) => lt(t, { algorithm: "SHA-512" }),
    ]);
  let $t = ct;
  var C;
  const Y = class Y {
    constructor(t) {
      f(this, C, void 0);
      u(this, C, t ?? Y.lexicalCompare);
    }
    static lexicalCompare(t, r) {
      return t === r ? 0 : t > r ? 1 : -1;
    }
    static reverseLexicalCompare(t, r) {
      return Y.lexicalCompare(t, r) * -1;
    }
    static numericCompare(t, r) {
      return Number(t) - Number(r);
    }
    static reverseNumericCompare(t, r) {
      return Y.numericCompare(t, r) * -1;
    }
    eq(t, r) {
      return n(this, C).call(this, t, r) === 0;
    }
    gt(t, r) {
      return n(this, C).call(this, t, r) < 0;
    }
    gte(t, r) {
      return n(this, C).call(this, t, r) <= 0;
    }
    lt(t, r) {
      return n(this, C).call(this, t, r) > 0;
    }
    lte(t, r) {
      return n(this, C).call(this, t, r) >= 0;
    }
  };
  C = new WeakMap();
  let pt = Y;
  class ht {
    constructor(t, r) {
      N(this, "value");
      N(this, "left");
      N(this, "right");
      N(this, "parent");
      (this.value = t), (this.parent = r);
    }
    asBST() {
      return yt.fromNode(this);
    }
  }
  var x, T;
  const Et = class Et {
    constructor(t) {
      f(this, x, null);
      f(this, T, void 0);
      u(this, T, new pt(t));
    }
    static fromNode(t) {
      const r = new Et();
      return u(r, x, t), r;
    }
    search(t) {
      const r = (e) =>
        e
          ? n(this, T).eq(e.value, t)
            ? e
            : n(this, T).lt(e.value, t)
            ? r(e.left)
            : r(e.right)
          : null;
      return r(n(this, x));
    }
    insert(t) {
      if (!n(this, x)) return u(this, x, new ht(t)), !1;
      const r = (e) =>
        n(this, T).eq(e.value, t)
          ? ((e.value = t), !0)
          : n(this, T).lt(e.value, t)
          ? e.left
            ? r(e.left)
            : ((e.left = new ht(t, e)), !1)
          : e.right
          ? r(e.right)
          : ((e.right = new ht(t, e)), !1);
      return r(n(this, x));
    }
    has(t) {
      return !!this.search(t);
    }
    delete(t) {
      const r = (i, s = null) => {
          i.parent
            ? i === i.parent.left
              ? (i.parent.left = s)
              : (i.parent.right = s)
            : u(this, x, s),
            s && (s.parent = i.parent);
        },
        e = (i) => {
          if (i.left)
            if (i.right) {
              let s = this.successor(i);
              return (
                s.parent !== i &&
                  (r(s, s.right), (s.right = i.right), (s.right.parent = s)),
                r(i, s),
                (s.left = i.left),
                (s.left.parent = s),
                !0
              );
            } else return r(i, i.left), !0;
          else return r(i, i.right), !0;
        };
      if (t instanceof ht) {
        if (this.has(t.value)) return e(t);
      } else {
        const i = this.search(t);
        if (i) return e(i);
      }
      return !1;
    }
    max(t) {
      let r = t ?? n(this, x);
      for (; r != null && r.right; ) r = r.right;
      return r ?? null;
    }
    min(t) {
      let r = t ?? n(this, x);
      for (; r != null && r.left; ) r = r.left;
      return r ?? null;
    }
    successor(t) {
      if (t.right) return this.min(t.right);
      let r = t,
        e = t.parent;
      for (; e && r === e.right; ) (r = e), (e = e.parent);
      return e ?? null;
    }
    predecessor(t) {
      if (t.left) return this.max(t.left);
      let r = t,
        e = t.parent;
      for (; e && r === e.left; ) (r = e), (e = e.parent);
      return e ?? null;
    }
    asOrdered() {
      const t = [],
        r = (e) => {
          e && (r(e.left), t.push(e.value), r(e.right));
        };
      return r(n(this, x)), t;
    }
    asPreOrdered() {
      const t = [],
        r = (e) => {
          e && (t.push(e.value), r(e.left), r(e.right));
        };
      return r(n(this, x)), t;
    }
    asPostOrdered() {
      const t = [],
        r = (e) => {
          e && (r(e.left), r(e.right), t.push(e.value));
        };
      return r(n(this, x)), t;
    }
    *[Symbol.iterator]() {
      function* t(r) {
        r && (yield* t(r.left), yield r.value, yield* t(r.right));
      }
      yield* t(n(this, x));
    }
  };
  (x = new WeakMap()), (T = new WeakMap());
  let yt = Et;
  class Vt {
    constructor(t) {
      N(this, "parent");
      N(this, "point");
      N(this, "left");
      N(this, "right");
      (this.point = t),
        (this.parent = null),
        (this.left = null),
        (this.right = null);
    }
  }
  var $, v, L, ft, Rt, U, X;
  class er {
    constructor(t, r = { clone: !0 }) {
      f(this, ft);
      f(this, U);
      f(this, $, void 0);
      f(this, v, void 0);
      f(this, L, void 0);
      var e;
      u(this, $, t ? (r != null && r.clone ? [...t] : t) : []),
        u(
          this,
          v,
          ((e = t == null ? void 0 : t[0]) == null ? void 0 : e.length) ?? 0
        ),
        u(this, L, M(this, U, X).call(this, n(this, $), 0, null));
    }
    get dimensions() {
      return n(this, v);
    }
    get tree() {
      return n(this, L);
    }
    [Symbol.iterator]() {
      return n(this, $)[Symbol.iterator]();
    }
    insert(t) {
      if (!n(this, $).length) u(this, v, t.length);
      else if (n(this, v) !== t.length)
        throw new TypeError(
          `Point [${t}] has ${t.length} dimensions, but should have ${n(
            this,
            v
          )}`
        );
      n(this, $).push(t),
        u(this, L, M(this, U, X).call(this, n(this, $), 0, null));
    }
    remove(t) {
      if (!n(this, $).length || t.length !== n(this, v)) return;
      const r = this.nearestNeighbor(t);
      if (r.distance === 0) {
        const e = n(this, $).findIndex((i) => i === r.point);
        return (
          n(this, $).splice(e, 1),
          u(this, L, M(this, U, X).call(this, n(this, $), 0, null)),
          r.point
        );
      }
    }
    has(t) {
      return t.length !== n(this, v)
        ? !1
        : this.nearestNeighbor(t).distance === 0;
    }
    nearestNeighbor(t) {
      function r(l, a) {
        return a ? l.reduce((h, c, d) => h + (c - a[d]) ** 2, 0) : 1 / 0;
      }
      function e(l, a) {
        return l && (!a || r(t, l.point) <= r(t, a.point)) ? l : a;
      }
      const i = (l, a) => {
          if (!l) return null;
          let h, c;
          t[a % n(this, v)] <= l.point[a % this.dimensions]
            ? ((h = l.left), (c = l.right))
            : ((h = l.right), (c = l.left));
          let d = i(h, a + 1),
            S = e(d, l);
          const D = r(t, S == null ? void 0 : S.point),
            ot = t[a % n(this, v)] - l.point[a % n(this, v)];
          return D >= ot ** 2 && ((d = i(c, a + 1)), (S = e(d, S))), S;
        },
        s = i(n(this, L), 0);
      return {
        point: (s == null ? void 0 : s.point) ?? null,
        distance: Math.sqrt(r(t, s == null ? void 0 : s.point)),
      };
    }
  }
  ($ = new WeakMap()),
    (v = new WeakMap()),
    (L = new WeakMap()),
    (ft = new WeakSet()),
    (Rt = function (t) {
      const r = Math.floor(t.length / 2);
      return [t[r], r];
    }),
    (U = new WeakSet()),
    (X = function (t, r, e) {
      if (t.length === 0) return null;
      t.sort((h, c) => h[r] - c[r]);
      const [i, s] = M(this, ft, Rt).call(this, t),
        l = (r + 1) % n(this, v),
        a = new Vt(i);
      return (
        (a.parent = e),
        (a.left = M(this, U, X).call(this, t.slice(0, s), l, a)),
        (a.right = M(this, U, X).call(this, t.slice(s + 1), l, a)),
        a
      );
    });
  var E, q, k, J;
  const bt = class bt {
    constructor(t) {
      f(this, E, void 0);
      f(this, q, void 0);
      f(this, k, 0);
      f(this, J, 0);
      if (typeof t != "number" || t <= 0)
        throw new RangeError("Must be initialized with a capacity");
      u(this, E, new Array(t).fill(null)), u(this, q, t);
    }
    static from(t) {
      const r = new bt(t.length);
      return u(r, E, t), r;
    }
    get capacity() {
      return n(this, q);
    }
    get data() {
      return n(this, E);
    }
    get isEmpty() {
      return n(this, E).every((t) => t === null);
    }
    get isFull() {
      return n(this, E).every((t) => t !== null);
    }
    get [Symbol.toStringTag]() {
      return "RingBuffer";
    }
    toString() {
      return JSON.stringify({ data: n(this, E), capacity: n(this, q) });
    }
    [Symbol.iterator]() {
      return n(this, E)[Symbol.iterator]();
    }
    peek(t = 0) {
      return n(this, E).at((n(this, k) + t) % n(this, q)) ?? null;
    }
    enqueue(t) {
      (n(this, E)[gt(this, J)._++] = t), u(this, J, n(this, J) % n(this, q));
    }
    dequeue() {
      const [t] = n(this, E).splice(gt(this, k)._++, 1, null);
      return u(this, k, n(this, k) % n(this, q)), t;
    }
    drain() {
      const t = n(this, E).filter((r) => r !== null);
      return u(this, E, []), u(this, k, 0), u(this, J, 0), t;
    }
  };
  (E = new WeakMap()),
    (q = new WeakMap()),
    (k = new WeakMap()),
    (J = new WeakMap());
  let It = bt;
  function Xt(o, ...t) {
    try {
      return (
        new new Proxy(o, {
          construct() {
            return {};
          },
        })(...(t ?? [])),
        !0
      );
    } catch {
      return !1;
    }
  }
  function tt(o, t, r) {
    if (o > t) throw new RangeError("Minimum must be less than maximum");
    if (!(typeof r > "u") && (o > r || r > t))
      throw new RangeError("Value must be between minimum and maximum");
  }
  function Bt(...o) {
    if (o.some((t) => !Number.isInteger(t)))
      throw new RangeError("Arguments must be integers");
  }
  function Pt(...o) {
    if (o.some((t) => t < 0 || !Number.isInteger(t)))
      throw new RangeError("Arguments must be natural numbers");
  }
  function Nt(...o) {
    if (o.some((t) => t < 1 || !Number.isInteger(t)))
      throw new RangeError("Arguments must be counting numbers");
  }
  function St(o) {
    const t = typeof o == "number" ? o : Number(o);
    if (!Number.isSafeInteger(t))
      throw new RangeError("Values must be safe integers");
    return t.valueOf();
  }
  var it, nt;
  const b = class b {
    constructor(t = 0, r = 0) {
      f(this, it, void 0);
      f(this, nt, void 0);
      u(this, it, t), u(this, nt, r);
    }
    get real() {
      return n(this, it);
    }
    get imaginary() {
      return n(this, nt);
    }
    static from(t) {
      return t instanceof b ? t : new b(t.valueOf());
    }
    add(t) {
      const r = b.from(t);
      return new b(this.real + r.real, this.imaginary + r.imaginary);
    }
    sub(t) {
      const r = b.from(t);
      return new b(this.real - r.real, this.imaginary - r.imaginary);
    }
    mul(t) {
      const r = b.from(t);
      return new b(
        this.real * r.real - this.imaginary * r.imaginary,
        this.real * r.imaginary + this.imaginary * r.real
      );
    }
    div(t) {
      const r = b.from(t),
        e = r.conjugate(),
        i = this.mul(e),
        s = r.real ** 2 + r.imaginary ** 2;
      return new b(i.real / s, i.imaginary / s);
    }
    pow(t) {
      let r = this;
      for (let e = t.valueOf() - 1; e > 0; e--) r = r.mul(this);
      return r;
    }
    eq(t) {
      const r = b.from(t);
      return this.real === r.real && this.imaginary === r.imaginary;
    }
    conjugate() {
      return new b(this.real, -1 * this.imaginary);
    }
    valueOf() {
      return this.real;
    }
    toFixed(t) {
      return this.real.toFixed(t);
    }
    toExponential(t) {
      return this.real.toExponential(t);
    }
    toPrecision(t) {
      return this.real.toPrecision(t);
    }
    toString(t) {
      return `${this.real === 0 && this.imaginary !== 0 ? "" : this.real}${
        this.imaginary !== 0
          ? (this.imaginary === 1
              ? "+"
              : this.imaginary.toLocaleString("en-US", {
                  signDisplay: this.real === 0 ? "auto" : "always",
                })) + "i"
          : ""
      }`;
    }
    toLocaleString(t, r) {
      return this.toString();
    }
    [Symbol.toPrimitive](t) {
      return t === "string" ? this.toString() : this.real;
    }
    get [Symbol.toStringTag]() {
      return "ComplexNumber";
    }
  };
  (it = new WeakMap()), (nt = new WeakMap());
  let Mt = b;
  const Gt = 256 - 1,
    Jt = 65536 - 1,
    j = -1 >>> 0,
    Wt = 128 - 1,
    Kt = -Wt - 1,
    Qt = 32768 - 1,
    Yt = -Qt - 1,
    Zt = (j + 1) / 2 - 1,
    tr = -Zt - 1;
  var w;
  const m = class m {
    constructor(t) {
      f(this, w, void 0);
      u(this, w, t);
    }
    get rows() {
      return n(this, w).length;
    }
    get cols() {
      return n(this, w)[0].length;
    }
    get size() {
      return this.rows * this.cols;
    }
    get data() {
      return n(this, w);
    }
    static zero(t) {
      if (t <= 0) throw new RangeError(`Invalid matrix size [${t}x${t}]`);
      const r = new Array(t).fill(null).map(() => new Array(t).fill(0));
      return new m(r);
    }
    static identity(t) {
      if (t <= 0) throw new RangeError(`Invalid matrix size [${t}x${t}]`);
      const r = m.zero(t);
      for (let e = 0; e < t; e++) r.data[e][e] = 1;
      return r;
    }
    static withSize(t, r, e = 0) {
      if (t <= 0 || r <= 0) throw new RangeError(`Invalid size [${t} x ${r}]`);
      const i = new Array(t).fill(null).map(() => new Array(r).fill(e));
      return new m(i);
    }
    static fromDiagonal(t) {
      const r = t.length;
      if (r <= 0) throw new RangeError(`Invalid size [${r} x ${r}]`);
      const e = m.zero(r);
      for (let i = 0; i < r; i++) n(e, w)[i][i] = t[i];
      return e;
    }
    static fromMTX(t, r = {}) {
      const [e, ...i] = t.split(/\n/),
        [s, l, a, h, c] = e.split(/\s+/).map((H) => H.toLowerCase());
      if (s !== "%%matrixmarket") throw new Error(`Unrecognized header '${s}'`);
      if (l !== "matrix") throw new Error(`Unrecognized object '${l}'`);
      if (!["coordinate", "array"].includes(a))
        throw new Error(`Unrecognized format '${a}'`);
      if (a === "array" && h === "pattern")
        throw new Error(
          "Format 'array' is incompatible with symmetry type 'pattern'"
        );
      if (r.format && a !== r.format)
        throw new Error(
          `Specified format '${r.format}' does not match data format '${a}'`
        );
      if (!["real", "complex", "integer", "pattern"].includes(h))
        throw new Error(`Unrecognized field type '${h}'`);
      if (
        (c === "hermitian" && h !== "complex") ||
        (h === "pattern" && !["general", "symmetric"].includes(c))
      )
        throw new Error(
          `Symmetry type '${c}' is incompatible with field type '${h}'`
        );
      if (r.field && h !== r.field)
        throw new Error(
          `Specified field type '${r.field}' does not match data field type '${h}'`
        );
      if (!["general", "symmetric", "skew-symmetric", "hermitian"].includes(c))
        throw new Error(`Unrecognized symmetry type '${c}'`);
      if (c !== "general" || (r.symmetry && c !== r.symmetry))
        throw new Error("Type");
      for (; i[0].startsWith("%"); ) i.shift();
      const [d, S, D] = i
        .shift()
        .split(/\s/)
        .map((H) => parseInt(H));
      if (d !== S && c !== "general")
        throw new Error(
          `Symmetry type '${c}' is unsupported for non-square matrices`
        );
      const ot = m.withSize(d, S);
      for (let H = 0, mt = 0; H < i.length; H++) {
        const at = i[H];
        if (at.startsWith("%") || !at.trim()) continue;
        let [W, K, V, Q] = at.split(/\s+/).map(Number);
        if (
          (a === "array" &&
            ((V = W),
            (Q = K),
            ([W, K] = [(mt % d) + 1, Math.floor(mt / d) + 1]),
            mt++),
          !Number.isInteger(W) || !Number.isInteger(K))
        )
          throw new Error(`Bad matrix coordinate ${W},${K}
${at}`);
        if (Number.isNaN(V)) throw new Error(`Bad value '${V}`);
        if (Number.isNaN(Q)) throw new Error(`Bad value ${Q}`);
        let Ht = V;
        switch (h) {
          case "integer": {
            if (!Number.isInteger(V))
              throw new Error(`Non-integer value '${V}'`);
            break;
          }
          case "complex":
            throw Number.isNaN(Q)
              ? new Error(`Invalid imaginary component '${Q}'`)
              : new Error("TODO");
          case "pattern":
            throw new Error("TODO");
        }
        n(ot, w)[W - 1][K - 1] = Ht;
      }
      return ot;
    }
    static isMatrixLike(t, ...r) {
      var s;
      const [e, i] = r;
      return (
        Array.isArray(t) &&
        Array.isArray(t[0]) &&
        typeof ((s = t[0][0]) == null ? void 0 : s.valueOf()) == "number" &&
        ((!e && !i) || (t.length === e && t[0].length === i))
      );
    }
    isSquare() {
      return this.rows === this.cols;
    }
    at(t, r) {
      var e;
      return (e = n(this, w).at(t)) == null ? void 0 : e.at(r);
    }
    row(t) {
      return this.data.at(t);
    }
    col(t) {
      if (!(t >= this.cols)) return this.data.map((r) => r.at(t));
    }
    clone() {
      const t = n(this, w).map((r) => [...r]);
      return new m(t);
    }
    submatrix(t, r) {
      const e = n(this, w).reduce((i, s, l) => {
        if (!t.includes(l)) {
          const a = s.reduce((h, c, d) => (r.includes(d) || h.push(c), h), []);
          i.push(a);
        }
        return i;
      }, []);
      return new m(e);
    }
    trace() {
      if (!this.isSquare())
        throw new Error(
          `Cannot find trace of non-square matrix [${this.rows}x${this.cols}]`
        );
      let t = 0;
      for (let r = 0; r < this.rows; r++) t += this.data[r][r];
      return t;
    }
    determinant() {
      if (!this.isSquare())
        throw new Error(
          `Cannot find determinant of non-square matrix [${this.rows}x${this.cols}]`
        );
      if (this.size === 1) return this.at(0, 0);
      if (this.rows === 2 && this.cols === 2)
        return this.at(0, 0) * this.at(1, 1) - this.at(1, 0) * this.at(0, 1);
      if (this.rows === 3 && this.cols === 3)
        return (
          // aei
          this.at(0, 0) * this.at(1, 1) * this.at(2, 2) + // bfg
          this.at(0, 1) * this.at(1, 2) * this.at(2, 0) + // cdh
          this.at(0, 2) * this.at(1, 0) * this.at(2, 1) - // ceg
          this.at(0, 2) * this.at(1, 1) * this.at(2, 0) - // bdi
          this.at(0, 1) * this.at(1, 0) * this.at(2, 2) - // afh
          this.at(0, 0) * this.at(1, 2) * this.at(2, 1)
        );
      let t = 0;
      for (let r = 0; r < this.rows; r++) {
        const e = this.submatrix([0], [r]),
          i = (-1) ** (r % 2),
          s = e.determinant();
        if (s === void 0) throw new Error("Failed to find subdeterminant");
        t += this.at(0, r) * i * s;
      }
      return t;
    }
    inverse(t = 5) {
      if (!this.isSquare())
        throw new Error(
          `Cannot invert non-square matrix [${this.rows}x${this.cols}]`
        );
      if (!this.determinant()) throw new Error("Cannot invert singular matrix");
      const r = this.clone(),
        e = m.identity(r.rows);
      for (let i = 0; i < r.rows; i++) {
        const s = 1 / r.at(i, i);
        for (let l = 0; l < r.cols; l++)
          (n(r, w)[i][l] *= s), (n(e, w)[i][l] *= s);
        for (let l = 0; l < r.rows; l++) {
          if (l === i) continue;
          const a = r.at(l, i);
          for (let h = 0; h < r.cols; h++)
            (n(r, w)[l][h] = r.at(l, h) - a * r.at(i, h)),
              (n(e, w)[l][h] = e.at(l, h) - a * e.at(i, h));
        }
      }
      if (!this.mul(e).eq(m.identity(this.rows), t))
        throw new Error("Matrix inversion failed!");
      return e;
    }
    transpose() {
      const t = m.withSize(this.cols, this.rows);
      for (let r = 0; r < this.cols; r++)
        for (let e = 0; e < this.rows; e++) n(t, w)[r][e] = n(this, w)[e][r];
      return t;
    }
    vectorize() {
      return n(this, w).flat();
    }
    add(t) {
      if (t instanceof m) {
        if (this.cols !== t.cols || this.rows !== t.rows)
          throw new RangeError(
            `Cannot add receiver [${this.rows}x${this.cols}] to argument [${t.rows}x${t.cols}]`
          );
        const r = new Array(this.rows).fill(null).map(() => new Array(t.cols));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < this.cols; i++)
            r[e][i] = this.at(e, i) + t.at(e, i);
        return new m(r);
      }
      if (m.isMatrixLike(t)) {
        if (this.rows !== t.length || this.cols !== t[0].length)
          throw new RangeError(
            `Cannot add receiver [${this.rows}x${this.cols}] to argument [${t.length}x${t[0].length}]`
          );
        const r = new Array(this.rows)
          .fill(null)
          .map(() => new Array(this.cols));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < this.cols; i++) r[e][i] = this.at(e, i) + t[e][i];
        return new m(r);
      } else throw new TypeError(`Invalid argument ${t}`);
    }
    sub(t) {
      if (t instanceof m) {
        if (this.cols !== t.cols || this.rows !== t.rows)
          throw new RangeError(
            `Cannot subtract from receiver [${this.rows}x${this.cols}] argument [${t.rows}x${t.cols}]`
          );
        const r = new Array(this.rows).fill(null).map(() => new Array(t.cols));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < this.cols; i++)
            r[e][i] = this.at(e, i) - t.at(e, i);
        return new m(r);
      }
      if (m.isMatrixLike(t)) {
        if (this.rows !== t.length || this.cols !== t[0].length)
          throw new RangeError(
            `Cannot subtract from receiver [${this.rows}x${this.cols}] argument [${t.length}x${t[0].length}]`
          );
        const r = new Array(this.rows)
          .fill(null)
          .map(() => new Array(this.cols));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < this.cols; i++) r[e][i] = this.at(e, i) - t[e][i];
        return new m(r);
      } else throw new TypeError(`Invalid argument ${t}`);
    }
    mul(t) {
      if (t instanceof m) {
        if (this.cols !== t.rows)
          throw new RangeError(
            `Cannot multiply receiver [${this.rows}x${this.cols}] by argument [${t.rows}x${t.cols}]`
          );
        const r = new Array(this.rows).fill(null).map(() => new Array(t.cols));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < t.cols; i++)
            r[e][i] = n(this, w)[e].reduce((s, l, a) => {
              const h = l * t.at(a, i);
              return s + h;
            }, 0);
        return new m(r);
      }
      if (m.isMatrixLike(t)) {
        if (this.cols !== t.length || t[0].length <= 0)
          throw new RangeError(
            `Cannot multiply receiver [${this.rows}x${this.cols}] by argument [${t.length}x${t[0].length}]`
          );
        const r = new Array(this.rows)
          .fill(null)
          .map(() => new Array(t[0].length));
        for (let e = 0; e < this.rows; e++)
          for (let i = 0; i < t[0].length; i++)
            r[e][i] = n(this, w)[e].reduce((s, l, a) => {
              const h = l * t[a][i];
              return s + h;
            }, 0);
        return new m(r);
      } else {
        if (Array.isArray(t))
          throw new RangeError(
            `Cannot multiply receiver [${this.rows}x${this.cols}] by argument [${t.length}x?]`
          );
        return new m(n(this, w).map((r) => r.map((e) => e * t)));
      }
    }
    pow(t) {
      if (t < 0)
        throw new RangeError(
          "Negative exponentiation is not permitted. If matrix is invertible, first invert then use positive exponentiation."
        );
      if (!this.isSquare())
        throw new Error("Exponentiation is only defined for square matricies");
      if (t === 0) return m.identity(this.rows);
      {
        let r = this;
        for (let e = t - 1; e > 0; e--) r = r.mul(this);
        return r;
      }
    }
    eq(t, r = 5) {
      function e(i, s) {
        return r ? Math.abs(i - s) < 1 / 10 ** r : i === s;
      }
      return t instanceof m
        ? m.isMatrixLike(t.data, this.rows, this.cols)
          ? t.data.every((i, s) => i.every((l, a) => e(l, this.at(s, a))))
          : !1
        : m.isMatrixLike(t, this.rows, this.cols)
        ? t.every((i, s) =>
            // @ts-ignore
            i.every((l, a) => e(l, this.at(s, a)))
          )
        : !1;
    }
    [Symbol.iterator]() {
      return n(this, w)[Symbol.iterator]();
    }
  };
  w = new WeakMap();
  let Ot = m;
  var p;
  const _ = class _ {
    constructor(t) {
      f(this, p, void 0);
      u(this, p, t);
    }
    valueOf() {
      return n(this, p);
    }
    add(t) {
      return new _(n(this, p) + n(t, p));
    }
    sub(t) {
      return new _(n(this, p) - n(t, p));
    }
    mul(t) {
      return new _(n(this, p) * n(t, p));
    }
    div(t) {
      return new _(n(this, p) / n(t, p));
    }
    pow(t) {
      return new _(n(this, p) ** n(t, p));
    }
    eq(t) {
      return n(this, p) === t.valueOf();
    }
    toFixed(t) {
      return n(this, p).toFixed(t);
    }
    toExponential(t) {
      return n(this, p).toExponential(t);
    }
    toPrecision(t) {
      return n(this, p).toPrecision(t);
    }
  };
  p = new WeakMap();
  let zt = _;
  var I;
  class ir {
    constructor(...t) {
      f(this, I, []);
      t.length && u(this, I, t);
    }
    event(t) {
      return n(this, I).push(t), this;
    }
    sample() {
      if (!n(this, I).length) throw new RangeError("No events");
      const t = n(this, I).reduce((a, h) => (h.p ? a + h.p : a), 0);
      if (t > 1) throw new RangeError(">1 total p");
      const r = 1 - t;
      let e = Math.random(),
        i = n(this, I)[0],
        s = i.p ?? r,
        l = 0;
      for (; e > s; )
        (l += 1), n(this, I)[l] && ((i = n(this, I)[l]), (s += i.p ?? r));
      return i;
    }
    take() {
      const t = this.sample();
      return (
        u(
          this,
          I,
          n(this, I).filter((r) => r !== t)
        ),
        t
      );
    }
  }
  I = new WeakMap();
  function ut(o, t, r) {
    return Math.min(Math.max(r, o), t);
  }
  function nr(o, t, r) {
    return tt(o, t), ut(o, t, r);
  }
  function F(o, t, r) {
    if (0 > r || r > 1)
      throw new RangeError("Value must be between 0 and 1 inclusive");
    return o + (t - o) * r;
  }
  function Ct(o) {
    if ((Pt(o), o <= 2)) return o;
    let t = o,
      r = o;
    for (; r > 1; ) r--, (t = t * r);
    return t;
  }
  var st, xt;
  const Z = class Z {
    constructor(...t) {
      throw new Error(
        "Range contains static methods only and is not meant to be constructed"
      );
    }
    /**
     * Produce an {@link Array} of values over a finite range.
     *
     * @param where A number or configuration object. When `where` is a number, range is
     * inferred to be [0, `where`], with a step size of 1, or -1 if `where < 0`. When
     * `where` is an object, it contains a `to` property, and optional `from` and `step`
     * properties, all numbers. If `step` is provided it must be positive, as the step
     * sign is inferred by the range direction.
     * @param factory An optional factory or constructor to be called with each value in
     * the range to produce values. When omitted, the values in the range will be the numbers
     * of that range.
     * @returns An array of values
     *
     * @example
     * // Producing a simple numeric range
     * const list = Range.of(3); // [0, 1, 2, 3]
     *
     * @example
     * // Producing a range with specific bounds and step size
     * const odds = Range.of({ from: 1, to: 9, step: 2 }); // [1, 3, 5, 7, 9]
     *
     * @example
     * // Producing a range of objects using a factory
     * const nsAndSquares = Range.of({ to: 4 }, (n) => ({ n, sq: n * n }));
     * // [
     * //   { n: 0, sq: 0 },
     * //   { n: 1, sq: 1 },
     * //   { n: 2, sq: 4 },
     * //   { n: 3, sq: 9 },
     * //   { n: 4, sq: 16 },
     * // ]
     */
    static of(t, r) {
      var h;
      const {
          from: e,
          to: i,
          step: s,
          produce: l,
        } = M((h = Z), st, xt).call(h, t, r),
        a = [];
      for (let c = e; e < i ? c <= i : c >= i; c += s) a.push(l(c));
      return a;
    }
    /**
     * Produce a {@link Generator} of values over both finite and infinite ranges.
     *
     * @param where A number or configuration object. When `where` is a number, range is
     * inferred to be [0, `where`], with a step size of 1, or -1 if `where < 0`. When
     * `where` is an object, it contains a `to` property, and optional `from` and `step`
     * properties, all numbers. If `step` is provided it must be positive, as the step
     * sign is inferred by the range direction.
     * @param factory An optional factory or constructor to be called with each value in
     * the range to produce values. When omitted, the values in the range will be the numbers
     * of that range.
     * @returns A generator of values
     *
     * @example
     * // Iterating an infinite range
     * const odds = Range.lazy({ from: 1, to: Infinity, step: 2 });
     * odds.next(); // { value: 1, done: false }
     * odds.next(); // { value: 3, done: false }
     * odds.next(); // { value: 5, done: false }
     *
     * @example
     * // Using the generator as an iterable
     * const descending = Range.lazy(-Infinity);
     *
     * for (const n of descending) {
     *   if (n < -3) break;
     *   console.log(n);
     * }
     * // 0
     * // -1
     * // -2
     * // -3
     */
    static *lazy(t, r) {
      var a;
      const {
        from: e,
        to: i,
        step: s,
        produce: l,
      } = M((a = Z), st, xt).call(a, t, r);
      for (let h = e; e < i ? h <= i : h >= i; h += s) yield l(h);
    }
  };
  (st = new WeakSet()),
    (xt = function (t, r) {
      let {
        from: e = 0,
        to: i = 0,
        step: s = 1,
      } = typeof t == "object" ? t : { to: t };
      if (e === i) throw new Error("Range must be nonzero in size");
      if (s <= 0)
        throw new Error(
          "Step size must be positive, as its sign is inferred from the range"
        );
      e > i && (s *= -1);
      const l = r ? (Xt(r, e) ? (a) => new r(a) : (a) => r(a)) : (a) => a;
      return { from: e, to: i, step: s, produce: l };
    }),
    f(Z, st);
  let qt = Z;
  class A {
    constructor(...t) {
      throw new Error(
        "Random contains static methods only and is not meant to be constructed"
      );
    }
    static bool() {
      return Math.random() >= 0.5;
    }
    static natural(t = j) {
      return Pt(t), Math.floor(F(0, t + 1, Math.random()));
    }
    static counting(t = j) {
      return Nt(t), Math.floor(F(1, t + 1, Math.random()));
    }
    static u8() {
      return Math.floor(F(0, Gt + 1, Math.random()));
    }
    static u16() {
      return Math.floor(F(0, Jt + 1, Math.random()));
    }
    static u32() {
      return Math.floor(F(0, j + 1, Math.random()));
    }
    static i8() {
      return A.u8() + Kt;
    }
    static i16() {
      return A.u16() + Yt;
    }
    static i32() {
      return A.u32() + tr;
    }
    static integer(
      { min: t = 0, max: r = j } = {
        max: j,
      }
    ) {
      return Bt(t, r), tt(t, r), Math.floor(F(t, r + 1, Math.random()));
    }
    static float(
      { min: t = 0, max: r = j } = {
        max: j,
      }
    ) {
      return tt(t, r), F(t, r + 1, Math.random());
    }
    static dice(t) {
      return Nt(t), A.integer({ min: 1, max: t });
    }
    static sample(t) {
      const r = t instanceof Set ? [...t] : t;
      if (r.length === 0) return;
      const e = A.natural(r.length - 1);
      return r[e];
    }
    static take(t) {
      const r = t instanceof Set ? [...t] : t;
      if (r.length === 0) return;
      const e = A.natural(r.length - 1),
        i = r[e];
      return t instanceof Set ? t.delete(i) : t.splice(e, 1), i;
    }
    /**
     * Shuffles a provided array in-place to a new, random permutation using the
     * Fisher-Yates algorithm.
     *
     * @param array an array of values
     */
    static permute(t) {
      for (let r = 0; r < t.length - 1; r++) {
        const e = r + A.integer({ max: t.length - r - 1 }),
          i = t[r];
        (t[r] = t[e]), (t[e] = i);
      }
    }
    /**
     * Shuffles a provided array and returns the random permutation as a new
     * array using the Fisher-Yates algorithm.
     *
     * @param array array an array of values
     */
    static permutation(t) {
      const r = [...t];
      for (let e = 0; e <= t.length - 1; e++) {
        const i = e + A.integer({ max: t.length - e - 1 }),
          s = r[e];
        (r[e] = r[i]), (r[i] = s);
      }
      return r;
    }
    static permutationsOf(t) {
      let r = t instanceof Set ? t.size : Array.isArray(t) ? t.length : t;
      return r === 0 ? 1 : Ct(r);
    }
    /**
     * Shuffles a provided array in-place to a new, random derangement with no
     * fixed points, per the algorithm described by Martínez, Conrado,
     * Alois Panholzer, and Helmut Prodinger:
     * https://epubs.siam.org/doi/pdf/10.1137/1.9781611972986.7
     *
     * @param array an array of values
     */
    static derange(t) {
      const r = new Array(t.length).fill(!1);
      let e = t.length,
        i = e;
      for (; i >= 2; ) {
        if (!r[e - 1]) {
          let s = 0;
          do s = A.integer({ min: 1, max: e - 1 });
          while (r[s - 1]);
          const l = t[s - 1];
          (t[s - 1] = t[e - 1]),
            (t[e - 1] = l),
            Math.random() <
              ((i - 1) * A.derangementsOf(i - 2)) / A.derangementsOf(i) &&
              ((r[s - 1] = !0), i--),
            i--;
        }
        e--;
      }
    }
    /**
     * Shuffles a provided array and returns a new, random derangement with no
     * fixed points, per the algorithm described by Martínez, Conrado,
     * Alois Panholzer, and Helmut Prodinger:
     * https://epubs.siam.org/doi/pdf/10.1137/1.9781611972986.7
     *
     * @param array an array of values
     */
    static derangement(t) {
      const r = [...t];
      return A.derange(r), r;
    }
    static derangementsOf(t) {
      let r = t instanceof Set ? t.size : Array.isArray(t) ? t.length : t;
      return Math.floor((Ct(r) + 1) / Math.E);
    }
  }
  var R, P, y;
  const vt = class vt {
    constructor({ max: t, min: r = 0 }, e) {
      f(this, R, void 0);
      f(this, P, void 0);
      f(this, y, void 0);
      if (
        !Number.isSafeInteger(r) ||
        !Number.isSafeInteger(t) ||
        (typeof e < "u" && !Number.isSafeInteger(e))
      )
        throw new RangeError("Values must be integers");
      tt(r, t, e), u(this, R, t), u(this, P, r), u(this, y, e ?? r);
    }
    static from(t) {
      return new vt({ max: t.max, min: t.min }, t.value);
    }
    add(t) {
      const r = typeof t == "number" ? t : Number(t);
      if (!Number.isSafeInteger(r))
        throw new RangeError("Values must be integers");
      return r === 0
        ? this
        : (u(this, y, ut(n(this, P), n(this, R), n(this, y) + r)), this);
    }
    sub(t) {
      return this.add(-t);
    }
    mul(t) {
      const r = St(t);
      return r === 1
        ? this
        : (u(this, y, ut(n(this, P), n(this, R), n(this, y) * r)), this);
    }
    div(t) {
      const r = St(t);
      if (r === 0) throw new Error("Cannot divide by zero");
      return (
        u(this, y, ut(n(this, P), n(this, R), Math.trunc(n(this, y) / r))), this
      );
    }
    eq(t) {
      return n(this, y) === t.valueOf();
    }
    get value() {
      return n(this, y);
    }
    get min() {
      return n(this, P);
    }
    get max() {
      return n(this, R);
    }
    valueOf() {
      return n(this, y);
    }
    toFixed(t) {
      return n(this, y).toFixed(t);
    }
    toExponential(t) {
      return n(this, y).toExponential(t);
    }
    toPrecision(t) {
      return n(this, y).toPrecision(t);
    }
    toString(t) {
      return n(this, y).toString(t);
    }
    toLocaleString(t, r) {
      return n(this, y).toLocaleString(t, r);
    }
    [Symbol.toPrimitive](t) {
      return t === "string" ? this.toString() : n(this, y);
    }
    get [Symbol.toStringTag]() {
      return "Saturating";
    }
  };
  (R = new WeakMap()), (P = new WeakMap()), (y = new WeakMap());
  let jt = vt;
  class sr {}
  var O, z, g;
  const At = class At {
    constructor({ max: t, min: r = 0 }, e) {
      f(this, O, void 0);
      f(this, z, void 0);
      f(this, g, void 0);
      if (
        !Number.isSafeInteger(r) ||
        !Number.isSafeInteger(t) ||
        (typeof e < "u" && !Number.isSafeInteger(e))
      )
        throw new RangeError("Values must be safe integers");
      tt(r, t, e), u(this, O, t), u(this, z, r), u(this, g, e ?? r);
    }
    static from(t) {
      return new At({ max: t.max, min: t.min }, t.value);
    }
    add(t) {
      const r = St(t);
      if (r === 0) return this;
      if (n(this, g) + r <= n(this, O) && n(this, g) + r >= n(this, z))
        return u(this, g, n(this, g) + r), this;
      const e = r % (Math.abs(n(this, O) - n(this, z)) + 1);
      return n(this, g) + e <= n(this, O) && n(this, g) + e >= n(this, z)
        ? (u(this, g, n(this, g) + e), this)
        : e > 0
        ? (u(this, g, e - (n(this, O) - n(this, g)) + (n(this, z) - 1)), this)
        : e < 0
        ? (u(this, g, e - (n(this, z) - n(this, g)) + (n(this, O) + 1)), this)
        : this;
    }
    sub(t) {
      return this.add(-t);
    }
    // mul<N extends Number>(n: N) {
    //   const multiplier = castInteger(n);
    //   if (multiplier === 1) return this;
    //   //  FIXME: what do we do if 0 is out of range?
    //   // if (multiplier === 0) {
    //   //   this.#value = 0;
    //   //   return this;
    //   // }
    //   this.#value =
    //     ((this.#value * multiplier) % (this.#max - this.#min + 1)) + this.#min;
    //   return this;
    // }
    // div<N extends Number>(n: N) {
    //   const divisor = castInteger(n);
    //   if (divisor === 1) return this;
    //   if (divisor === 0) throw new Error("Cannot divide by zero");
    //   const absolute = Math.trunc(this.#value / divisor);
    //   if (absolute >= this.#min && absolute <= this.#max) {
    //     this.#value = absolute;
    //     return this;
    //   }
    //   const modAmount = absolute % (Math.abs(this.#max - this.#min) + 1);
    //   // TODO
    // }
    eq(t) {
      return n(this, g) === t.valueOf();
    }
    get value() {
      return n(this, g);
    }
    get min() {
      return n(this, z);
    }
    get max() {
      return n(this, O);
    }
    valueOf() {
      return n(this, g);
    }
    toFixed(t) {
      return n(this, g).toFixed(t);
    }
    toExponential(t) {
      return n(this, g).toExponential(t);
    }
    toPrecision(t) {
      return n(this, g).toPrecision(t);
    }
    toString(t) {
      return n(this, g).toString(t);
    }
    toLocaleString(t, r) {
      return n(this, g).toLocaleString(t, r);
    }
    [Symbol.toPrimitive](t) {
      return t === "string" ? this.toString() : n(this, g);
    }
    get [Symbol.toStringTag]() {
      return "Wrapping";
    }
  };
  (O = new WeakMap()), (z = new WeakMap()), (g = new WeakMap());
  let Tt = At;
  this.BST = yt;
  this.BSTNode = ht;
  this.BloomFilter = $t;
  this.Bounded = sr;
  this.Comparator = pt;
  this.ComplexNumber = Mt;
  this.I16_MAX = Qt;
  this.I16_MIN = Yt;
  this.I32_MAX = Zt;
  this.I32_MIN = tr;
  this.I8_MAX = Wt;
  this.I8_MIN = Kt;
  this.KDTree = er;
  this.Matrix = Ot;
  this.Probability = ir;
  this.Random = A;
  this.Range = qt;
  this.RingBuffer = It;
  this.Saturating = jt;
  this.SimpleNumber = zt;
  this.U16_MAX = Jt;
  this.U32_MAX = j;
  this.U8_MAX = Gt;
  this.Wrapping = Tt;
  this.assertCounting = Nt;
  this.assertInteger = Bt;
  this.assertNatural = Pt;
  this.assertValidRange = tt;
  this.castInteger = St;
  this.clamp = nr;
  this.factorial = Ct;
  this.isConstructor = Xt;
  this.lerp = F;
  this.uncheckedClamp = ut;
}
