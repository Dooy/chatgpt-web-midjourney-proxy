var Sa = function(c, a) {
  c = c || this;
  var h = c.window
    , p = c.document
    , d = new function() {
      var e = /^(statics|enumerable|beans|preserve)$/
        , t = []
        , n = t.slice
        , i = Object.create
        , r = Object.getOwnPropertyDescriptor
        , s = Object.defineProperty
        , u = t.forEach || function(_, v) {
        for (var b = 0, T = this.length; b < T; b++)
          _.call(v, this[b], b, this)
      }
        , o = function(_, v) {
        for (var b in this)
          this.hasOwnProperty(b) && _.call(v, this[b], b, this)
      }
        , l = Object.assign || function(_) {
        for (var v = 1, b = arguments.length; v < b; v++) {
          var T = arguments[v];
          for (var x in T)
            T.hasOwnProperty(x) && (_[x] = T[x])
        }
        return _
      }
        , f = function(_, v, b) {
        if (_) {
          var T = r(_, "length");
          (T && typeof T.value == "number" ? u : o).call(_, v, b = b || _)
        }
        return b
      };
      function g(_, v, b, T, x) {
        var S = {};
        function I(N, L) {
          L = L || (L = r(v, N)) && (L.get ? L : L.value),
          typeof L == "string" && L[0] === "#" && (L = _[L.substring(1)] || L);
          var R = typeof L == "function", D = L, V = x || R && !L.base ? L && L.get ? N in _ : _[N] : null, z;
          (!x || !V) && (R && V && (L.base = V),
          R && T !== !1 && (z = N.match(/^([gs]et|is)(([A-Z])(.*))$/)) && (S[z[3].toLowerCase() + z[4]] = z[2]),
          (!D || R || !D.get || typeof D.get != "function" || !y.isPlainObject(D)) && (D = {
            value: D,
            writable: !0
          }),
          (r(_, N) || {
            configurable: !0
          }).configurable && (D.configurable = !0,
            D.enumerable = b ?? !z),
            s(_, N, D))
        }
        if (v) {
          for (var m in v)
            v.hasOwnProperty(m) && !e.test(m) && I(m);
          for (var m in S) {
            var w = S[m]
              , E = _["set" + w]
              , A = _["get" + w] || E && _["is" + w];
            A && (T === !0 || A.length === 0) && I(m, {
              get: A,
              set: E
            })
          }
        }
        return _
      }
      function y() {
        for (var _ = 0, v = arguments.length; _ < v; _++) {
          var b = arguments[_];
          b && l(this, b)
        }
        return this
      }
      return g(y, {
        inject: function(_) {
          if (_) {
            var v = _.statics === !0 ? _ : _.statics
              , b = _.beans
              , T = _.preserve;
            v !== _ && g(this.prototype, _, _.enumerable, b, T),
              g(this, v, null, b, T)
          }
          for (var x = 1, S = arguments.length; x < S; x++)
            this.inject(arguments[x]);
          return this
        },
        extend: function() {
          for (var _ = this, v, b, T = 0, x, S = arguments.length; T < S && !(v && b); T++)
            x = arguments[T],
              v = v || x.initialize,
              b = b || x.prototype;
          return v = v || function() {
            _.apply(this, arguments)
          }
            ,
            b = v.prototype = b || i(this.prototype),
            s(b, "constructor", {
              value: v,
              writable: !0,
              configurable: !0
            }),
            g(v, this),
          arguments.length && this.inject.apply(v, arguments),
            v.base = _,
            v
        }
      }).inject({
        enumerable: !1,
        initialize: y,
        set: y,
        inject: function() {
          for (var _ = 0, v = arguments.length; _ < v; _++) {
            var b = arguments[_];
            b && g(this, b, b.enumerable, b.beans, b.preserve)
          }
          return this
        },
        extend: function() {
          var _ = i(this);
          return _.inject.apply(_, arguments)
        },
        each: function(_, v) {
          return f(this, _, v)
        },
        clone: function() {
          return new this.constructor(this)
        },
        statics: {
          set: l,
          each: f,
          create: i,
          define: s,
          describe: r,
          clone: function(_) {
            return l(new _.constructor, _)
          },
          isPlainObject: function(_) {
            var v = _ != null && _.constructor;
            return v && (v === Object || v === y || v.name === "Object")
          },
          pick: function(_, v) {
            return _ !== a ? _ : v
          },
          slice: function(_, v, b) {
            return n.call(_, v, b)
          }
        }
      })
    }
  ;
  d.inject({
    enumerable: !1,
    toString: function() {
      return this._id != null ? (this._class || "Object") + (this._name ? " '" + this._name + "'" : " @" + this._id) : "{ " + d.each(this, function(e, t) {
        if (!/^_/.test(t)) {
          var n = typeof e;
          this.push(t + ": " + (n === "number" ? k.instance.number(e) : n === "string" ? "'" + e + "'" : e))
        }
      }, []).join(", ") + " }"
    },
    getClassName: function() {
      return this._class || ""
    },
    importJSON: function(e) {
      return d.importJSON(e, this)
    },
    exportJSON: function(e) {
      return d.exportJSON(this, e)
    },
    toJSON: function() {
      return d.serialize(this)
    },
    set: function(e, t) {
      return e && d.filter(this, e, t, this._prioritize),
        this
    }
  }, {
    beans: !1,
    statics: {
      exports: {},
      extend: function e() {
        var t = e.base.apply(this, arguments)
          , n = t.prototype._class;
        return n && !d.exports[n] && (d.exports[n] = t),
          t
      },
      equals: function(e, t) {
        if (e === t)
          return !0;
        if (e && e.equals)
          return e.equals(t);
        if (t && t.equals)
          return t.equals(e);
        if (e && t && typeof e == "object" && typeof t == "object") {
          if (Array.isArray(e) && Array.isArray(t)) {
            var n = e.length;
            if (n !== t.length)
              return !1;
            for (; n--; )
              if (!d.equals(e[n], t[n]))
                return !1
          } else {
            var i = Object.keys(e)
              , n = i.length;
            if (n !== Object.keys(t).length)
              return !1;
            for (; n--; ) {
              var r = i[n];
              if (!(t.hasOwnProperty(r) && d.equals(e[r], t[r])))
                return !1
            }
          }
          return !0
        }
        return !1
      },
      read: function(e, t, n, i) {
        if (this === d) {
          var r = this.peek(e, t);
          return e.__index++,
            r
        }
        var s = this.prototype
          , u = s._readIndex
          , o = t || u && e.__index || 0
          , l = e.length
          , f = e[o];
        if (i = i || l - o,
        f instanceof this || n && n.readNull && f == null && i <= 1)
          return u && (e.__index = o + 1),
            f && n && n.clone ? f.clone() : f;
        if (f = d.create(s),
        u && (f.__read = !0),
          f = f.initialize.apply(f, o > 0 || o + i < l ? d.slice(e, o, o + i) : e) || f,
          u) {
          e.__index = o + f.__read;
          var g = f.__filtered;
          g && (e.__filtered = g,
            f.__filtered = a),
            f.__read = a
        }
        return f
      },
      peek: function(e, t) {
        return e[e.__index = t || e.__index || 0]
      },
      remain: function(e) {
        return e.length - (e.__index || 0)
      },
      readList: function(e, t, n, i) {
        for (var r = [], s, u = t || 0, o = i ? u + i : e.length, l = u; l < o; l++)
          r.push(Array.isArray(s = e[l]) ? this.read(s, 0, n) : this.read(e, l, n, 1));
        return r
      },
      readNamed: function(e, t, n, i, r) {
        var s = this.getNamed(e, t)
          , u = s !== a;
        if (u) {
          var o = e.__filtered;
          if (!o) {
            var l = this.getSource(e);
            o = e.__filtered = d.create(l),
              o.__unfiltered = l
          }
          o[t] = a
        }
        return this.read(u ? [s] : e, n, i, r)
      },
      readSupported: function(e, t) {
        var n = this.getSource(e)
          , i = this
          , r = !1;
        return n && Object.keys(n).forEach(function(s) {
          if (s in t) {
            var u = i.readNamed(e, s);
            u !== a && (t[s] = u),
              r = !0
          }
        }),
          r
      },
      getSource: function(e) {
        var t = e.__source;
        if (t === a) {
          var n = e.length === 1 && e[0];
          t = e.__source = n && d.isPlainObject(n) ? n : null
        }
        return t
      },
      getNamed: function(e, t) {
        var n = this.getSource(e);
        if (n)
          return t ? n[t] : e.__filtered || n
      },
      hasNamed: function(e, t) {
        return !!this.getNamed(e, t)
      },
      filter: function(e, t, n, i) {
        var r;
        function s(g) {
          if (!(n && g in n) && !(r && g in r)) {
            var y = t[g];
            y !== a && (e[g] = y)
          }
        }
        if (i) {
          for (var u = {}, o = 0, l, f = i.length; o < f; o++)
            (l = i[o])in t && (s(l),
              u[l] = !0);
          r = u
        }
        return Object.keys(t.__unfiltered || t).forEach(s),
          e
      },
      isPlainValue: function(e, t) {
        return d.isPlainObject(e) || Array.isArray(e) || t && typeof e == "string"
      },
      serialize: function(e, t, n, i) {
        t = t || {};
        var r = !i, s;
        if (r && (t.formatter = new k(t.precision),
          i = {
            length: 0,
            definitions: {},
            references: {},
            add: function(y, _) {
              var v = "#" + y._id
                , b = this.references[v];
              if (!b) {
                this.length++;
                var T = _.call(y)
                  , x = y._class;
                x && T[0] !== x && T.unshift(x),
                  this.definitions[v] = T,
                  b = this.references[v] = [v]
              }
              return b
            }
          }),
        e && e._serialize) {
          s = e._serialize(t, i);
          var u = e._class;
          u && !e._compactSerialize && (r || !n) && s[0] !== u && s.unshift(u)
        } else if (Array.isArray(e)) {
          s = [];
          for (var o = 0, l = e.length; o < l; o++)
            s[o] = d.serialize(e[o], t, n, i)
        } else if (d.isPlainObject(e)) {
          s = {};
          for (var f = Object.keys(e), o = 0, l = f.length; o < l; o++) {
            var g = f[o];
            s[g] = d.serialize(e[g], t, n, i)
          }
        } else
          typeof e == "number" ? s = t.formatter.number(e, t.precision) : s = e;
        return r && i.length > 0 ? [["dictionary", i.definitions], s] : s
      },
      deserialize: function(e, t, n, i, r) {
        var s = e
          , u = !n
          , o = u && e && e.length && e[0][0] === "dictionary";
        if (n = n || {},
          Array.isArray(e)) {
          var l = e[0]
            , f = l === "dictionary";
          if (e.length == 1 && /^#/.test(l))
            return n.dictionary[l];
          l = d.exports[l],
            s = [];
          for (var g = l ? 1 : 0, y = e.length; g < y; g++)
            s.push(d.deserialize(e[g], t, n, f, o));
          if (l) {
            var _ = s;
            t ? s = t(l, _, u || r) : s = new l(_)
          }
        } else if (d.isPlainObject(e)) {
          s = {},
          i && (n.dictionary = s);
          for (var v in e)
            s[v] = d.deserialize(e[v], t, n)
        }
        return o ? s[1] : s
      },
      exportJSON: function(e, t) {
        var n = d.serialize(e, t);
        return t && t.asString == !1 ? n : JSON.stringify(n)
      },
      importJSON: function(e, t) {
        return d.deserialize(typeof e == "string" ? JSON.parse(e) : e, function(n, i, r) {
          var s = r && t && t.constructor === n
            , u = s ? t : d.create(n.prototype);
          if (i.length === 1 && u instanceof oe && (s || !(u instanceof ct))) {
            var o = i[0];
            d.isPlainObject(o) && (o.insert = !1,
            s && (i = i.concat([oe.INSERT])))
          }
          return (s ? u.set : n).apply(u, i),
          s && (t = null),
            u
        })
      },
      push: function(e, t) {
        var n = t.length;
        if (n < 4096)
          e.push.apply(e, t);
        else {
          var i = e.length;
          e.length += n;
          for (var r = 0; r < n; r++)
            e[i + r] = t[r]
        }
        return e
      },
      splice: function(e, t, n, i) {
        var r = t && t.length
          , s = n === a;
        n = s ? e.length : n,
        n > e.length && (n = e.length);
        for (var u = 0; u < r; u++)
          t[u]._index = n + u;
        if (s)
          return d.push(e, t),
            [];
        var o = [n, i];
        t && d.push(o, t);
        for (var l = e.splice.apply(e, o), u = 0, f = l.length; u < f; u++)
          l[u]._index = a;
        for (var u = n + r, f = e.length; u < f; u++)
          e[u]._index = u;
        return l
      },
      capitalize: function(e) {
        return e.replace(/\b[a-z]/g, function(t) {
          return t.toUpperCase()
        })
      },
      camelize: function(e) {
        return e.replace(/-(.)/g, function(t, n) {
          return n.toUpperCase()
        })
      },
      hyphenate: function(e) {
        return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
      }
    }
  });
  var M = {
    on: function(e, t) {
      if (typeof e != "string")
        d.each(e, function(s, u) {
          this.on(u, s)
        }, this);
      else {
        var n = this._eventTypes
          , i = n && n[e]
          , r = this._callbacks = this._callbacks || {};
        r = r[e] = r[e] || [],
        r.indexOf(t) === -1 && (r.push(t),
        i && i.install && r.length === 1 && i.install.call(this, e))
      }
      return this
    },
    off: function(e, t) {
      if (typeof e != "string") {
        d.each(e, function(u, o) {
          this.off(o, u)
        }, this);
        return
      }
      var n = this._eventTypes, i = n && n[e], r = this._callbacks && this._callbacks[e], s;
      return r && (!t || (s = r.indexOf(t)) !== -1 && r.length === 1 ? (i && i.uninstall && i.uninstall.call(this, e),
        delete this._callbacks[e]) : s !== -1 && r.splice(s, 1)),
        this
    },
    once: function(e, t) {
      return this.on(e, function n() {
        t.apply(this, arguments),
          this.off(e, n)
      })
    },
    emit: function(e, t) {
      var n = this._callbacks && this._callbacks[e];
      if (!n)
        return !1;
      var i = d.slice(arguments, 1)
        , r = t && t.target && !t.currentTarget;
      n = n.slice(),
      r && (t.currentTarget = this);
      for (var s = 0, u = n.length; s < u; s++)
        if (n[s].apply(this, i) == !1) {
          t && t.stop && t.stop();
          break
        }
      return r && delete t.currentTarget,
        !0
    },
    responds: function(e) {
      return !!(this._callbacks && this._callbacks[e])
    },
    attach: "#on",
    detach: "#off",
    fire: "#emit",
    _installEvents: function(e) {
      var t = this._eventTypes
        , n = this._callbacks
        , i = e ? "install" : "uninstall";
      if (t) {
        for (var r in n)
          if (n[r].length > 0) {
            var s = t[r]
              , u = s && s[i];
            u && u.call(this, r)
          }
      }
    },
    statics: {
      inject: function e(t) {
        var n = t._events;
        if (n) {
          var i = {};
          d.each(n, function(r, s) {
            var u = typeof r == "string"
              , o = u ? r : s
              , l = d.capitalize(o)
              , f = o.substring(2).toLowerCase();
            i[f] = u ? {} : r,
              o = "_" + o,
              t["get" + l] = function() {
                return this[o]
              }
              ,
              t["set" + l] = function(g) {
                var y = this[o];
                y && this.off(f, y),
                g && this.on(f, g),
                  this[o] = g
              }
          }),
            t._eventTypes = i
        }
        return e.base.apply(this, arguments)
      }
    }
  }
    , F = d.extend({
    _class: "PaperScope",
    initialize: function e() {
      ae = this,
        this.settings = new d({
          applyMatrix: !0,
          insertItems: !0,
          handleSize: 4,
          hitTolerance: 0
        }),
        this.project = null,
        this.projects = [],
        this.tools = [],
        this._id = e._id++,
        e._scopes[this._id] = this;
      var t = e.prototype;
      if (!this.support) {
        var n = Je.getContext(1, 1) || {};
        t.support = {
          nativeDash: "setLineDash"in n || "mozDash"in n,
          nativeBlendModes: nn.nativeModes
        },
          Je.release(n)
      }
      if (!this.agent) {
        var i = c.navigator.userAgent.toLowerCase()
          , r = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(i) || [])[0]
          , s = r === "darwin" ? "mac" : r
          , u = t.agent = t.browser = {
          platform: s
        };
        s && (u[s] = !0),
          i.replace(/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node|jsdom)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g, function(o, l, f, g, y) {
            if (!u.chrome) {
              var _ = l === "opera" ? g : /^(node|trident)$/.test(l) ? y : f;
              u.version = _,
                u.versionNumber = parseFloat(_),
                l = {
                  trident: "msie",
                  jsdom: "node"
                }[l] || l,
                u.name = l,
                u[l] = !0
            }
          }),
        u.chrome && delete u.webkit,
        u.atom && delete u.chrome
      }
    },
    version: "0.12.17",
    getView: function() {
      var e = this.project;
      return e && e._view
    },
    getPaper: function() {
      return this
    },
    execute: function(e, t) {},
    install: function(e) {
      var t = this;
      d.each(["project", "view", "tool"], function(i) {
        d.define(e, i, {
          configurable: !0,
          get: function() {
            return t[i]
          }
        })
      });
      for (var n in this)
        !/^_/.test(n) && this[n] && (e[n] = this[n])
    },
    setup: function(e) {
      return h.paper = this,
        this.project = new ye(e),
        this
    },
    createCanvas: function(e, t) {
      return Je.getCanvas(e, t)
    },
    activate: function() {
      ae = this
    },
    clear: function() {
      for (var e = this.projects, t = this.tools, n = e.length - 1; n >= 0; n--)
        e[n].remove();
      for (var n = t.length - 1; n >= 0; n--)
        t[n].remove()
    },
    remove: function() {
      this.clear(),
        delete F._scopes[this._id]
    },
    statics: new function() {
      function e(t) {
        return t += "Attribute",
          function(n, i) {
            return n[t](i) || n[t]("data-paper-" + i)
          }
      }
      return {
        _scopes: {},
        _id: 0,
        get: function(t) {
          return this._scopes[t] || null
        },
        getAttribute: e("get"),
        hasAttribute: e("has")
      }
    }
  })
    , Z = d.extend(M, {
    initialize: function(e) {
      this._scope = ae,
        this._index = this._scope[this._list].push(this) - 1,
      (e || !this._scope[this._reference]) && this.activate()
    },
    activate: function() {
      if (!this._scope)
        return !1;
      var e = this._scope[this._reference];
      return e && e !== this && e.emit("deactivate"),
        this._scope[this._reference] = this,
        this.emit("activate", e),
        !0
    },
    isActive: function() {
      return this._scope[this._reference] === this
    },
    remove: function() {
      return this._index == null ? !1 : (d.splice(this._scope[this._list], null, this._index, 1),
      this._scope[this._reference] == this && (this._scope[this._reference] = null),
        this._scope = null,
        !0)
    },
    getView: function() {
      return this._scope.getView()
    }
  })
    , q = {
    findItemBoundsCollisions: function(e, t, n) {
      function i(u) {
        for (var o = new Array(u.length), l = 0; l < u.length; l++) {
          var f = u[l].getBounds();
          o[l] = [f.left, f.top, f.right, f.bottom]
        }
        return o
      }
      var r = i(e)
        , s = !t || t === e ? r : i(t);
      return this.findBoundsCollisions(r, s, n || 0)
    },
    findCurveBoundsCollisions: function(e, t, n, i) {
      function r(_) {
        for (var v = Math.min, b = Math.max, T = new Array(_.length), x = 0; x < _.length; x++) {
          var S = _[x];
          T[x] = [v(S[0], S[2], S[4], S[6]), v(S[1], S[3], S[5], S[7]), b(S[0], S[2], S[4], S[6]), b(S[1], S[3], S[5], S[7])]
        }
        return T
      }
      var s = r(e)
        , u = !t || t === e ? s : r(t);
      if (i) {
        for (var o = this.findBoundsCollisions(s, u, n || 0, !1, !0), l = this.findBoundsCollisions(s, u, n || 0, !0, !0), f = [], g = 0, y = o.length; g < y; g++)
          f[g] = {
            hor: o[g],
            ver: l[g]
          };
        return f
      }
      return this.findBoundsCollisions(s, u, n || 0)
    },
    findBoundsCollisions: function(e, t, n, i, r) {
      var s = !t || e === t
        , u = s ? e : e.concat(t)
        , o = e.length
        , l = u.length;
      function f(se, ue, Ie) {
        for (var Ee = 0, de = se.length; Ee < de; ) {
          var ve = de + Ee >>> 1;
          u[se[ve]][ue] < Ie ? Ee = ve + 1 : de = ve
        }
        return Ee - 1
      }
      for (var g = i ? 1 : 0, y = g + 2, _ = i ? 0 : 1, v = _ + 2, b = new Array(l), T = 0; T < l; T++)
        b[T] = T;
      b.sort(function(se, ue) {
        return u[se][g] - u[ue][g]
      });
      for (var x = [], S = new Array(o), T = 0; T < l; T++) {
        var I = b[T]
          , m = u[I]
          , w = s ? I : I - o
          , E = I < o
          , A = s || !E
          , N = E ? [] : null;
        if (x.length) {
          var L = f(x, y, m[g] - n) + 1;
          if (x.splice(0, L),
          s && r) {
            N = N.concat(x);
            for (var R = 0; R < x.length; R++) {
              var D = x[R];
              S[D].push(w)
            }
          } else
            for (var V = m[v], z = m[_], R = 0; R < x.length; R++) {
              var D = x[R]
                , G = u[D]
                , H = D < o
                , K = s || D >= o;
              (r || (E && K || A && H) && V >= G[_] - n && z <= G[v] + n) && (E && K && N.push(s ? D : D - o),
              A && H && S[D].push(w))
            }
        }
        if (E && (e === t && N.push(I),
          S[I] = N),
          x.length) {
          var $ = m[y]
            , W = f(x, y, $);
          x.splice(W + 1, 0, I)
        } else
          x.push(I)
      }
      for (var T = 0; T < S.length; T++) {
        var te = S[T];
        te && te.sort(function(ue, Ie) {
          return ue - Ie
        })
      }
      return S
    }
  }
    , k = d.extend({
    initialize: function(e) {
      this.precision = d.pick(e, 5),
        this.multiplier = Math.pow(10, this.precision)
    },
    number: function(e) {
      return this.precision < 16 ? Math.round(e * this.multiplier) / this.multiplier : e
    },
    pair: function(e, t, n) {
      return this.number(e) + (n || ",") + this.number(t)
    },
    point: function(e, t) {
      return this.number(e.x) + (t || ",") + this.number(e.y)
    },
    size: function(e, t) {
      return this.number(e.width) + (t || ",") + this.number(e.height)
    },
    rectangle: function(e, t) {
      return this.point(e, t) + (t || ",") + this.size(e, t)
    }
  });
  k.instance = new k;
  var O = new function() {
    var e = [[.5773502691896257], [0, .7745966692414834], [.33998104358485626, .8611363115940526], [0, .5384693101056831, .906179845938664], [.2386191860831969, .6612093864662645, .932469514203152], [0, .4058451513773972, .7415311855993945, .9491079123427585], [.1834346424956498, .525532409916329, .7966664774136267, .9602898564975363], [0, .3242534234038089, .6133714327005904, .8360311073266358, .9681602395076261], [.14887433898163122, .4333953941292472, .6794095682990244, .8650633666889845, .9739065285171717], [0, .26954315595234496, .5190961292068118, .7301520055740494, .8870625997680953, .978228658146057], [.1252334085114689, .3678314989981802, .5873179542866175, .7699026741943047, .9041172563704749, .9815606342467192], [0, .2304583159551348, .44849275103644687, .6423493394403402, .8015780907333099, .9175983992229779, .9841830547185881], [.10805494870734367, .31911236892788974, .5152486363581541, .6872929048116855, .827201315069765, .9284348836635735, .9862838086968123], [0, .20119409399743451, .3941513470775634, .5709721726085388, .7244177313601701, .8482065834104272, .937273392400706, .9879925180204854], [.09501250983763744, .2816035507792589, .45801677765722737, .6178762444026438, .755404408355003, .8656312023878318, .9445750230732326, .9894009349916499]]
      , t = [[1], [.8888888888888888, .5555555555555556], [.6521451548625461, .34785484513745385], [.5688888888888889, .47862867049936647, .23692688505618908], [.46791393457269104, .3607615730481386, .17132449237917036], [.4179591836734694, .3818300505051189, .27970539148927664, .1294849661688697], [.362683783378362, .31370664587788727, .22238103445337448, .10122853629037626], [.3302393550012598, .31234707704000286, .26061069640293544, .1806481606948574, .08127438836157441], [.29552422471475287, .26926671930999635, .21908636251598204, .1494513491505806, .06667134430868814], [.2729250867779006, .26280454451024665, .23319376459199048, .18629021092773426, .1255803694649046, .05566856711617366], [.24914704581340277, .2334925365383548, .20316742672306592, .16007832854334622, .10693932599531843, .04717533638651183], [.2325515532308739, .22628318026289723, .2078160475368885, .17814598076194574, .13887351021978725, .09212149983772845, .04048400476531588], [.2152638534631578, .2051984637212956, .18553839747793782, .15720316715819355, .12151857068790319, .08015808715976021, .03511946033175186], [.2025782419255613, .19843148532711158, .1861610000155622, .16626920581699392, .13957067792615432, .10715922046717194, .07036604748810812, .03075324199611727], [.1894506104550685, .18260341504492358, .16915651939500254, .14959598881657674, .12462897125553388, .09515851168249279, .062253523938647894, .027152459411754096]]
      , n = Math.abs
      , i = Math.sqrt
      , r = Math.pow
      , s = Math.log2 || function(y) {
      return Math.log(y) * Math.LOG2E
    }
      , u = 1e-12
      , o = 112e-18;
    function l(y, _, v) {
      return y < _ ? _ : y > v ? v : y
    }
    function f(y, _, v) {
      function b(L) {
        var R = L * 134217729
          , D = L - R
          , V = D + R
          , z = L - V;
        return [V, z]
      }
      var T = _ * _ - y * v
        , x = _ * _ + y * v;
      if (n(T) * 3 < x) {
        var S = b(y)
          , I = b(_)
          , m = b(v)
          , w = _ * _
          , E = I[0] * I[0] - w + 2 * I[0] * I[1] + I[1] * I[1]
          , A = y * v
          , N = S[0] * m[0] - A + S[0] * m[1] + S[1] * m[0] + S[1] * m[1];
        T = w - A + (E - N)
      }
      return T
    }
    function g() {
      var y = Math.max.apply(Math, arguments);
      return y && (y < 1e-8 || y > 1e8) ? r(2, -Math.round(s(y))) : 0
    }
    return {
      EPSILON: u,
      MACHINE_EPSILON: o,
      CURVETIME_EPSILON: 1e-8,
      GEOMETRIC_EPSILON: 1e-7,
      TRIGONOMETRIC_EPSILON: 1e-8,
      ANGULAR_EPSILON: 1e-5,
      KAPPA: 4 * (i(2) - 1) / 3,
      isZero: function(y) {
        return y >= -u && y <= u
      },
      isMachineZero: function(y) {
        return y >= -o && y <= o
      },
      clamp: l,
      integrate: function(y, _, v, b) {
        for (var T = e[b - 2], x = t[b - 2], S = (v - _) * .5, I = S + _, m = 0, w = b + 1 >> 1, E = b & 1 ? x[m++] * y(I) : 0; m < w; ) {
          var A = S * T[m];
          E += x[m++] * (y(I + A) + y(I - A))
        }
        return S * E
      },
      findRoot: function(y, _, v, b, T, x, S) {
        for (var I = 0; I < x; I++) {
          var m = y(v)
            , w = m / _(v)
            , E = v - w;
          if (n(w) < S) {
            v = E;
            break
          }
          m > 0 ? (T = v,
            v = E <= b ? (b + T) * .5 : E) : (b = v,
            v = E >= T ? (b + T) * .5 : E)
        }
        return l(v, b, T)
      },
      solveQuadratic: function(y, _, v, b, T, x) {
        var S, I = 1 / 0;
        if (n(y) < u) {
          if (n(_) < u)
            return n(v) < u ? -1 : 0;
          S = -v / _
        } else {
          _ *= -.5;
          var m = f(y, _, v);
          if (m && n(m) < o) {
            var w = g(n(y), n(_), n(v));
            w && (y *= w,
              _ *= w,
              v *= w,
              m = f(y, _, v))
          }
          if (m >= -o) {
            var E = m < 0 ? 0 : i(m)
              , A = _ + (_ < 0 ? -E : E);
            A === 0 ? (S = v / y,
              I = -S) : (S = A / y,
              I = v / A)
          }
        }
        var N = 0
          , L = T == null
          , R = T - u
          , D = x + u;
        return isFinite(S) && (L || S > R && S < D) && (b[N++] = L ? S : l(S, T, x)),
        I !== S && isFinite(I) && (L || I > R && I < D) && (b[N++] = L ? I : l(I, T, x)),
          N
      },
      solveCubic: function(y, _, v, b, T, x, S) {
        var I = g(n(y), n(_), n(v), n(b)), m, w, E, A, N;
        I && (y *= I,
          _ *= I,
          v *= I,
          b *= I);
        function L(W) {
          m = W;
          var te = y * m;
          w = te + _,
            E = w * m + v,
            A = (te + w) * m + E,
            N = E * m + b
        }
        if (n(y) < u)
          y = _,
            w = v,
            E = b,
            m = 1 / 0;
        else if (n(b) < u)
          w = _,
            E = v,
            m = 0;
        else {
          L(-(_ / y) / 3);
          var R = N / y
            , D = r(n(R), 1 / 3)
            , V = R < 0 ? -1 : 1
            , z = -A / y
            , G = z > 0 ? 1.324717957244746 * Math.max(D, i(z)) : D
            , H = m - V * G;
          if (H !== m) {
            do
              L(H),
                H = A === 0 ? m : m - N / A / (1 + o);
            while (V * H > V * m);
            n(y) * m * m > n(b / m) && (E = -b / m,
              w = (E - v) / m)
          }
        }
        var K = O.solveQuadratic(y, w, E, T, x, S)
          , $ = x == null;
        return isFinite(m) && (K === 0 || K > 0 && m !== T[0] && m !== T[1]) && ($ || m > x - u && m < S + u) && (T[K++] = $ ? m : l(m, x, S)),
          K
      }
    }
  }
    , B = {
    _id: 1,
    _pools: {},
    get: function(e) {
      if (e) {
        var t = this._pools[e];
        return t || (t = this._pools[e] = {
          _id: 1
        }),
          t._id++
      } else
        return this._id++
    }
  }
    , C = d.extend({
    _class: "Point",
    _readIndex: !0,
    initialize: function(t, n) {
      var i = typeof t
        , r = this.__read
        , s = 0;
      if (i === "number") {
        var u = typeof n == "number";
        this._set(t, u ? n : t),
        r && (s = u ? 2 : 1)
      } else if (i === "undefined" || t === null)
        this._set(0, 0),
        r && (s = t === null ? 1 : 0);
      else {
        var o = i === "string" ? t.split(/[\s,]+/) || [] : t;
        s = 1,
          Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "x"in o ? this._set(o.x || 0, o.y || 0) : "width"in o ? this._set(o.width || 0, o.height || 0) : "angle"in o ? (this._set(o.length || 0, 0),
            this.setAngle(o.angle || 0)) : (this._set(0, 0),
            s = 0)
      }
      return r && (this.__read = s),
        this
    },
    set: "#initialize",
    _set: function(e, t) {
      return this.x = e,
        this.y = t,
        this
    },
    equals: function(e) {
      return this === e || e && (this.x === e.x && this.y === e.y || Array.isArray(e) && this.x === e[0] && this.y === e[1]) || !1
    },
    clone: function() {
      return new C(this.x,this.y)
    },
    toString: function() {
      var e = k.instance;
      return "{ x: " + e.number(this.x) + ", y: " + e.number(this.y) + " }"
    },
    _serialize: function(e) {
      var t = e.formatter;
      return [t.number(this.x), t.number(this.y)]
    },
    getLength: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y)
    },
    setLength: function(e) {
      if (this.isZero()) {
        var t = this._angle || 0;
        this._set(Math.cos(t) * e, Math.sin(t) * e)
      } else {
        var n = e / this.getLength();
        O.isZero(n) && this.getAngle(),
          this._set(this.x * n, this.y * n)
      }
    },
    getAngle: function() {
      return this.getAngleInRadians.apply(this, arguments) * 180 / Math.PI
    },
    setAngle: function(e) {
      this.setAngleInRadians.call(this, e * Math.PI / 180)
    },
    getAngleInDegrees: "#getAngle",
    setAngleInDegrees: "#setAngle",
    getAngleInRadians: function() {
      if (arguments.length) {
        var e = C.read(arguments)
          , t = this.getLength() * e.getLength();
        if (O.isZero(t))
          return NaN;
        var n = this.dot(e) / t;
        return Math.acos(n < -1 ? -1 : n > 1 ? 1 : n)
      } else
        return this.isZero() ? this._angle || 0 : this._angle = Math.atan2(this.y, this.x)
    },
    setAngleInRadians: function(e) {
      if (this._angle = e,
        !this.isZero()) {
        var t = this.getLength();
        this._set(Math.cos(e) * t, Math.sin(e) * t)
      }
    },
    getQuadrant: function() {
      return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3
    }
  }, {
    beans: !1,
    getDirectedAngle: function() {
      var e = C.read(arguments);
      return Math.atan2(this.cross(e), this.dot(e)) * 180 / Math.PI
    },
    getDistance: function() {
      var e = arguments
        , t = C.read(e)
        , n = t.x - this.x
        , i = t.y - this.y
        , r = n * n + i * i
        , s = d.read(e);
      return s ? r : Math.sqrt(r)
    },
    normalize: function(e) {
      e === a && (e = 1);
      var t = this.getLength()
        , n = t !== 0 ? e / t : 0
        , i = new C(this.x * n,this.y * n);
      return n >= 0 && (i._angle = this._angle),
        i
    },
    rotate: function(e, t) {
      if (e === 0)
        return this.clone();
      e = e * Math.PI / 180;
      var n = t ? this.subtract(t) : this
        , i = Math.sin(e)
        , r = Math.cos(e);
      return n = new C(n.x * r - n.y * i,n.x * i + n.y * r),
        t ? n.add(t) : n
    },
    transform: function(e) {
      return e ? e._transformPoint(this) : this
    },
    add: function() {
      var e = C.read(arguments);
      return new C(this.x + e.x,this.y + e.y)
    },
    subtract: function() {
      var e = C.read(arguments);
      return new C(this.x - e.x,this.y - e.y)
    },
    multiply: function() {
      var e = C.read(arguments);
      return new C(this.x * e.x,this.y * e.y)
    },
    divide: function() {
      var e = C.read(arguments);
      return new C(this.x / e.x,this.y / e.y)
    },
    modulo: function() {
      var e = C.read(arguments);
      return new C(this.x % e.x,this.y % e.y)
    },
    negate: function() {
      return new C(-this.x,-this.y)
    },
    isInside: function() {
      return Y.read(arguments).contains(this)
    },
    isClose: function() {
      var e = arguments
        , t = C.read(e)
        , n = d.read(e);
      return this.getDistance(t) <= n
    },
    isCollinear: function() {
      var e = C.read(arguments);
      return C.isCollinear(this.x, this.y, e.x, e.y)
    },
    isColinear: "#isCollinear",
    isOrthogonal: function() {
      var e = C.read(arguments);
      return C.isOrthogonal(this.x, this.y, e.x, e.y)
    },
    isZero: function() {
      var e = O.isZero;
      return e(this.x) && e(this.y)
    },
    isNaN: function() {
      return isNaN(this.x) || isNaN(this.y)
    },
    isInQuadrant: function(e) {
      return this.x * (e > 1 && e < 4 ? -1 : 1) >= 0 && this.y * (e > 2 ? -1 : 1) >= 0
    },
    dot: function() {
      var e = C.read(arguments);
      return this.x * e.x + this.y * e.y
    },
    cross: function() {
      var e = C.read(arguments);
      return this.x * e.y - this.y * e.x
    },
    project: function() {
      var e = C.read(arguments)
        , t = e.isZero() ? 0 : this.dot(e) / e.dot(e);
      return new C(e.x * t,e.y * t)
    },
    statics: {
      min: function() {
        var e = arguments
          , t = C.read(e)
          , n = C.read(e);
        return new C(Math.min(t.x, n.x),Math.min(t.y, n.y))
      },
      max: function() {
        var e = arguments
          , t = C.read(e)
          , n = C.read(e);
        return new C(Math.max(t.x, n.x),Math.max(t.y, n.y))
      },
      random: function() {
        return new C(Math.random(),Math.random())
      },
      isCollinear: function(e, t, n, i) {
        return Math.abs(e * i - t * n) <= Math.sqrt((e * e + t * t) * (n * n + i * i)) * 1e-8
      },
      isOrthogonal: function(e, t, n, i) {
        return Math.abs(e * n + t * i) <= Math.sqrt((e * e + t * t) * (n * n + i * i)) * 1e-8
      }
    }
  }, d.each(["round", "ceil", "floor", "abs"], function(e) {
    var t = Math[e];
    this[e] = function() {
      return new C(t(this.x),t(this.y))
    }
  }, {}))
    , Q = C.extend({
    initialize: function(t, n, i, r) {
      this._x = t,
        this._y = n,
        this._owner = i,
        this._setter = r
    },
    _set: function(e, t, n) {
      return this._x = e,
        this._y = t,
      n || this._owner[this._setter](this),
        this
    },
    getX: function() {
      return this._x
    },
    setX: function(e) {
      this._x = e,
        this._owner[this._setter](this)
    },
    getY: function() {
      return this._y
    },
    setY: function(e) {
      this._y = e,
        this._owner[this._setter](this)
    },
    isSelected: function() {
      return !!(this._owner._selection & this._getSelection())
    },
    setSelected: function(e) {
      this._owner._changeSelection(this._getSelection(), e)
    },
    _getSelection: function() {
      return this._setter === "setPosition" ? 4 : 0
    }
  })
    , J = d.extend({
    _class: "Size",
    _readIndex: !0,
    initialize: function(t, n) {
      var i = typeof t
        , r = this.__read
        , s = 0;
      if (i === "number") {
        var u = typeof n == "number";
        this._set(t, u ? n : t),
        r && (s = u ? 2 : 1)
      } else if (i === "undefined" || t === null)
        this._set(0, 0),
        r && (s = t === null ? 1 : 0);
      else {
        var o = i === "string" ? t.split(/[\s,]+/) || [] : t;
        s = 1,
          Array.isArray(o) ? this._set(+o[0], +(o.length > 1 ? o[1] : o[0])) : "width"in o ? this._set(o.width || 0, o.height || 0) : "x"in o ? this._set(o.x || 0, o.y || 0) : (this._set(0, 0),
            s = 0)
      }
      return r && (this.__read = s),
        this
    },
    set: "#initialize",
    _set: function(e, t) {
      return this.width = e,
        this.height = t,
        this
    },
    equals: function(e) {
      return e === this || e && (this.width === e.width && this.height === e.height || Array.isArray(e) && this.width === e[0] && this.height === e[1]) || !1
    },
    clone: function() {
      return new J(this.width,this.height)
    },
    toString: function() {
      var e = k.instance;
      return "{ width: " + e.number(this.width) + ", height: " + e.number(this.height) + " }"
    },
    _serialize: function(e) {
      var t = e.formatter;
      return [t.number(this.width), t.number(this.height)]
    },
    add: function() {
      var e = J.read(arguments);
      return new J(this.width + e.width,this.height + e.height)
    },
    subtract: function() {
      var e = J.read(arguments);
      return new J(this.width - e.width,this.height - e.height)
    },
    multiply: function() {
      var e = J.read(arguments);
      return new J(this.width * e.width,this.height * e.height)
    },
    divide: function() {
      var e = J.read(arguments);
      return new J(this.width / e.width,this.height / e.height)
    },
    modulo: function() {
      var e = J.read(arguments);
      return new J(this.width % e.width,this.height % e.height)
    },
    negate: function() {
      return new J(-this.width,-this.height)
    },
    isZero: function() {
      var e = O.isZero;
      return e(this.width) && e(this.height)
    },
    isNaN: function() {
      return isNaN(this.width) || isNaN(this.height)
    },
    statics: {
      min: function(e, t) {
        return new J(Math.min(e.width, t.width),Math.min(e.height, t.height))
      },
      max: function(e, t) {
        return new J(Math.max(e.width, t.width),Math.max(e.height, t.height))
      },
      random: function() {
        return new J(Math.random(),Math.random())
      }
    }
  }, d.each(["round", "ceil", "floor", "abs"], function(e) {
    var t = Math[e];
    this[e] = function() {
      return new J(t(this.width),t(this.height))
    }
  }, {}))
    , ne = J.extend({
    initialize: function(t, n, i, r) {
      this._width = t,
        this._height = n,
        this._owner = i,
        this._setter = r
    },
    _set: function(e, t, n) {
      return this._width = e,
        this._height = t,
      n || this._owner[this._setter](this),
        this
    },
    getWidth: function() {
      return this._width
    },
    setWidth: function(e) {
      this._width = e,
        this._owner[this._setter](this)
    },
    getHeight: function() {
      return this._height
    },
    setHeight: function(e) {
      this._height = e,
        this._owner[this._setter](this)
    }
  })
    , Y = d.extend({
    _class: "Rectangle",
    _readIndex: !0,
    beans: !0,
    initialize: function(t, n, i, r) {
      var s = arguments, u = typeof t, o;
      if (u === "number" ? (this._set(t, n, i, r),
        o = 4) : u === "undefined" || t === null ? (this._set(0, 0, 0, 0),
        o = t === null ? 1 : 0) : s.length === 1 && (Array.isArray(t) ? (this._set.apply(this, t),
        o = 1) : t.x !== a || t.width !== a ? (this._set(t.x || 0, t.y || 0, t.width || 0, t.height || 0),
        o = 1) : t.from === a && t.to === a && (this._set(0, 0, 0, 0),
      d.readSupported(s, this) && (o = 1))),
      o === a) {
        var l = C.readNamed(s, "from"), f = d.peek(s), g = l.x, y = l.y, _, v;
        if (f && f.x !== a || d.hasNamed(s, "to")) {
          var b = C.readNamed(s, "to");
          _ = b.x - g,
            v = b.y - y,
          _ < 0 && (g = b.x,
            _ = -_),
          v < 0 && (y = b.y,
            v = -v)
        } else {
          var T = J.read(s);
          _ = T.width,
            v = T.height
        }
        this._set(g, y, _, v),
          o = s.__index
      }
      var x = s.__filtered;
      return x && (this.__filtered = x),
      this.__read && (this.__read = o),
        this
    },
    set: "#initialize",
    _set: function(e, t, n, i) {
      return this.x = e,
        this.y = t,
        this.width = n,
        this.height = i,
        this
    },
    clone: function() {
      return new Y(this.x,this.y,this.width,this.height)
    },
    equals: function(e) {
      var t = d.isPlainValue(e) ? Y.read(arguments) : e;
      return t === this || t && this.x === t.x && this.y === t.y && this.width === t.width && this.height === t.height || !1
    },
    toString: function() {
      var e = k.instance;
      return "{ x: " + e.number(this.x) + ", y: " + e.number(this.y) + ", width: " + e.number(this.width) + ", height: " + e.number(this.height) + " }"
    },
    _serialize: function(e) {
      var t = e.formatter;
      return [t.number(this.x), t.number(this.y), t.number(this.width), t.number(this.height)]
    },
    getPoint: function(e) {
      var t = e ? C : Q;
      return new t(this.x,this.y,this,"setPoint")
    },
    setPoint: function() {
      var e = C.read(arguments);
      this.x = e.x,
        this.y = e.y
    },
    getSize: function(e) {
      var t = e ? J : ne;
      return new t(this.width,this.height,this,"setSize")
    },
    _fw: 1,
    _fh: 1,
    setSize: function() {
      var e = J.read(arguments)
        , t = this._sx
        , n = this._sy
        , i = e.width
        , r = e.height;
      t && (this.x += (this.width - i) * t),
      n && (this.y += (this.height - r) * n),
        this.width = i,
        this.height = r,
        this._fw = this._fh = 1
    },
    getLeft: function() {
      return this.x
    },
    setLeft: function(e) {
      if (!this._fw) {
        var t = e - this.x;
        this.width -= this._sx === .5 ? t * 2 : t
      }
      this.x = e,
        this._sx = this._fw = 0
    },
    getTop: function() {
      return this.y
    },
    setTop: function(e) {
      if (!this._fh) {
        var t = e - this.y;
        this.height -= this._sy === .5 ? t * 2 : t
      }
      this.y = e,
        this._sy = this._fh = 0
    },
    getRight: function() {
      return this.x + this.width
    },
    setRight: function(e) {
      if (!this._fw) {
        var t = e - this.x;
        this.width = this._sx === .5 ? t * 2 : t
      }
      this.x = e - this.width,
        this._sx = 1,
        this._fw = 0
    },
    getBottom: function() {
      return this.y + this.height
    },
    setBottom: function(e) {
      if (!this._fh) {
        var t = e - this.y;
        this.height = this._sy === .5 ? t * 2 : t
      }
      this.y = e - this.height,
        this._sy = 1,
        this._fh = 0
    },
    getCenterX: function() {
      return this.x + this.width / 2
    },
    setCenterX: function(e) {
      this._fw || this._sx === .5 ? this.x = e - this.width / 2 : (this._sx && (this.x += (e - this.x) * 2 * this._sx),
        this.width = (e - this.x) * 2),
        this._sx = .5,
        this._fw = 0
    },
    getCenterY: function() {
      return this.y + this.height / 2
    },
    setCenterY: function(e) {
      this._fh || this._sy === .5 ? this.y = e - this.height / 2 : (this._sy && (this.y += (e - this.y) * 2 * this._sy),
        this.height = (e - this.y) * 2),
        this._sy = .5,
        this._fh = 0
    },
    getCenter: function(e) {
      var t = e ? C : Q;
      return new t(this.getCenterX(),this.getCenterY(),this,"setCenter")
    },
    setCenter: function() {
      var e = C.read(arguments);
      return this.setCenterX(e.x),
        this.setCenterY(e.y),
        this
    },
    getArea: function() {
      return this.width * this.height
    },
    isEmpty: function() {
      return this.width === 0 || this.height === 0
    },
    contains: function(e) {
      return e && e.width !== a || (Array.isArray(e) ? e : arguments).length === 4 ? this._containsRectangle(Y.read(arguments)) : this._containsPoint(C.read(arguments))
    },
    _containsPoint: function(e) {
      var t = e.x
        , n = e.y;
      return t >= this.x && n >= this.y && t <= this.x + this.width && n <= this.y + this.height
    },
    _containsRectangle: function(e) {
      var t = e.x
        , n = e.y;
      return t >= this.x && n >= this.y && t + e.width <= this.x + this.width && n + e.height <= this.y + this.height
    },
    intersects: function() {
      var e = Y.read(arguments)
        , t = d.read(arguments) || 0;
      return e.x + e.width > this.x - t && e.y + e.height > this.y - t && e.x < this.x + this.width + t && e.y < this.y + this.height + t
    },
    intersect: function() {
      var e = Y.read(arguments)
        , t = Math.max(this.x, e.x)
        , n = Math.max(this.y, e.y)
        , i = Math.min(this.x + this.width, e.x + e.width)
        , r = Math.min(this.y + this.height, e.y + e.height);
      return new Y(t,n,i - t,r - n)
    },
    unite: function() {
      var e = Y.read(arguments)
        , t = Math.min(this.x, e.x)
        , n = Math.min(this.y, e.y)
        , i = Math.max(this.x + this.width, e.x + e.width)
        , r = Math.max(this.y + this.height, e.y + e.height);
      return new Y(t,n,i - t,r - n)
    },
    include: function() {
      var e = C.read(arguments)
        , t = Math.min(this.x, e.x)
        , n = Math.min(this.y, e.y)
        , i = Math.max(this.x + this.width, e.x)
        , r = Math.max(this.y + this.height, e.y);
      return new Y(t,n,i - t,r - n)
    },
    expand: function() {
      var e = J.read(arguments)
        , t = e.width
        , n = e.height;
      return new Y(this.x - t / 2,this.y - n / 2,this.width + t,this.height + n)
    },
    scale: function(e, t) {
      return this.expand(this.width * e - this.width, this.height * (t === a ? e : t) - this.height)
    }
  }, d.each([["Top", "Left"], ["Top", "Right"], ["Bottom", "Left"], ["Bottom", "Right"], ["Left", "Center"], ["Top", "Center"], ["Right", "Center"], ["Bottom", "Center"]], function(e, t) {
    var n = e.join("")
      , i = /^[RL]/.test(n);
    t >= 4 && (e[1] += i ? "Y" : "X");
    var r = e[i ? 0 : 1]
      , s = e[i ? 1 : 0]
      , u = "get" + r
      , o = "get" + s
      , l = "set" + r
      , f = "set" + s
      , g = "get" + n
      , y = "set" + n;
    this[g] = function(_) {
      var v = _ ? C : Q;
      return new v(this[u](),this[o](),this,y)
    }
      ,
      this[y] = function() {
        var _ = C.read(arguments);
        this[l](_.x),
          this[f](_.y)
      }
  }, {
    beans: !0
  }))
    , Me = Y.extend({
      initialize: function(t, n, i, r, s, u) {
        this._set(t, n, i, r, !0),
          this._owner = s,
          this._setter = u
      },
      _set: function(e, t, n, i, r) {
        return this._x = e,
          this._y = t,
          this._width = n,
          this._height = i,
        r || this._owner[this._setter](this),
          this
      }
    }, new function() {
      var e = Y.prototype;
      return d.each(["x", "y", "width", "height"], function(t) {
        var n = d.capitalize(t)
          , i = "_" + t;
        this["get" + n] = function() {
          return this[i]
        }
          ,
          this["set" + n] = function(r) {
            this[i] = r,
            this._dontNotify || this._owner[this._setter](this)
          }
      }, d.each(["Point", "Size", "Center", "Left", "Top", "Right", "Bottom", "CenterX", "CenterY", "TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], function(t) {
        var n = "set" + t;
        this[n] = function() {
          this._dontNotify = !0,
            e[n].apply(this, arguments),
            this._dontNotify = !1,
            this._owner[this._setter](this)
        }
      }, {
        isSelected: function() {
          return !!(this._owner._selection & 2)
        },
        setSelected: function(t) {
          var n = this._owner;
          n._changeSelection && n._changeSelection(2, t)
        }
      }))
    }
  )
    , le = d.extend({
    _class: "Matrix",
    initialize: function e(t, n) {
      var i = arguments
        , r = i.length
        , s = !0;
      if (r >= 6 ? this._set.apply(this, i) : r === 1 || r === 2 ? t instanceof e ? this._set(t._a, t._b, t._c, t._d, t._tx, t._ty, n) : Array.isArray(t) ? this._set.apply(this, n ? t.concat([n]) : t) : s = !1 : r ? s = !1 : this.reset(),
        !s)
        throw new Error("Unsupported matrix parameters");
      return this
    },
    set: "#initialize",
    _set: function(e, t, n, i, r, s, u) {
      return this._a = e,
        this._b = t,
        this._c = n,
        this._d = i,
        this._tx = r,
        this._ty = s,
      u || this._changed(),
        this
    },
    _serialize: function(e, t) {
      return d.serialize(this.getValues(), e, !0, t)
    },
    _changed: function() {
      var e = this._owner;
      e && (e._applyMatrix ? e.transform(null, !0) : e._changed(25))
    },
    clone: function() {
      return new le(this._a,this._b,this._c,this._d,this._tx,this._ty)
    },
    equals: function(e) {
      return e === this || e && this._a === e._a && this._b === e._b && this._c === e._c && this._d === e._d && this._tx === e._tx && this._ty === e._ty
    },
    toString: function() {
      var e = k.instance;
      return "[[" + [e.number(this._a), e.number(this._c), e.number(this._tx)].join(", ") + "], [" + [e.number(this._b), e.number(this._d), e.number(this._ty)].join(", ") + "]]"
    },
    reset: function(e) {
      return this._a = this._d = 1,
        this._b = this._c = this._tx = this._ty = 0,
      e || this._changed(),
        this
    },
    apply: function(e, t) {
      var n = this._owner;
      return n ? (n.transform(null, d.pick(e, !0), t),
        this.isIdentity()) : !1
    },
    translate: function() {
      var e = C.read(arguments)
        , t = e.x
        , n = e.y;
      return this._tx += t * this._a + n * this._c,
        this._ty += t * this._b + n * this._d,
        this._changed(),
        this
    },
    scale: function() {
      var e = arguments
        , t = C.read(e)
        , n = C.read(e, 0, {
        readNull: !0
      });
      return n && this.translate(n),
        this._a *= t.x,
        this._b *= t.x,
        this._c *= t.y,
        this._d *= t.y,
      n && this.translate(n.negate()),
        this._changed(),
        this
    },
    rotate: function(e) {
      e *= Math.PI / 180;
      var t = C.read(arguments, 1)
        , n = t.x
        , i = t.y
        , r = Math.cos(e)
        , s = Math.sin(e)
        , u = n - n * r + i * s
        , o = i - n * s - i * r
        , l = this._a
        , f = this._b
        , g = this._c
        , y = this._d;
      return this._a = r * l + s * g,
        this._b = r * f + s * y,
        this._c = -s * l + r * g,
        this._d = -s * f + r * y,
        this._tx += u * l + o * g,
        this._ty += u * f + o * y,
        this._changed(),
        this
    },
    shear: function() {
      var e = arguments
        , t = C.read(e)
        , n = C.read(e, 0, {
        readNull: !0
      });
      n && this.translate(n);
      var i = this._a
        , r = this._b;
      return this._a += t.y * this._c,
        this._b += t.y * this._d,
        this._c += t.x * i,
        this._d += t.x * r,
      n && this.translate(n.negate()),
        this._changed(),
        this
    },
    skew: function() {
      var e = arguments
        , t = C.read(e)
        , n = C.read(e, 0, {
        readNull: !0
      })
        , i = Math.PI / 180
        , r = new C(Math.tan(t.x * i),Math.tan(t.y * i));
      return this.shear(r, n)
    },
    append: function(e, t) {
      if (e) {
        var n = this._a
          , i = this._b
          , r = this._c
          , s = this._d
          , u = e._a
          , o = e._c
          , l = e._b
          , f = e._d
          , g = e._tx
          , y = e._ty;
        this._a = u * n + l * r,
          this._c = o * n + f * r,
          this._b = u * i + l * s,
          this._d = o * i + f * s,
          this._tx += g * n + y * r,
          this._ty += g * i + y * s,
        t || this._changed()
      }
      return this
    },
    prepend: function(e, t) {
      if (e) {
        var n = this._a
          , i = this._b
          , r = this._c
          , s = this._d
          , u = this._tx
          , o = this._ty
          , l = e._a
          , f = e._c
          , g = e._b
          , y = e._d
          , _ = e._tx
          , v = e._ty;
        this._a = l * n + f * i,
          this._c = l * r + f * s,
          this._b = g * n + y * i,
          this._d = g * r + y * s,
          this._tx = l * u + f * o + _,
          this._ty = g * u + y * o + v,
        t || this._changed()
      }
      return this
    },
    appended: function(e) {
      return this.clone().append(e)
    },
    prepended: function(e) {
      return this.clone().prepend(e)
    },
    invert: function() {
      var e = this._a
        , t = this._b
        , n = this._c
        , i = this._d
        , r = this._tx
        , s = this._ty
        , u = e * i - t * n
        , o = null;
      return u && !isNaN(u) && isFinite(r) && isFinite(s) && (this._a = i / u,
        this._b = -t / u,
        this._c = -n / u,
        this._d = e / u,
        this._tx = (n * s - i * r) / u,
        this._ty = (t * r - e * s) / u,
        o = this),
        o
    },
    inverted: function() {
      return this.clone().invert()
    },
    concatenate: "#append",
    preConcatenate: "#prepend",
    chain: "#appended",
    _shiftless: function() {
      return new le(this._a,this._b,this._c,this._d,0,0)
    },
    _orNullIfIdentity: function() {
      return this.isIdentity() ? null : this
    },
    isIdentity: function() {
      return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1 && this._tx === 0 && this._ty === 0
    },
    isInvertible: function() {
      var e = this._a * this._d - this._c * this._b;
      return e && !isNaN(e) && isFinite(this._tx) && isFinite(this._ty)
    },
    isSingular: function() {
      return !this.isInvertible()
    },
    transform: function(e, t, n) {
      return arguments.length < 3 ? this._transformPoint(C.read(arguments)) : this._transformCoordinates(e, t, n)
    },
    _transformPoint: function(e, t, n) {
      var i = e.x
        , r = e.y;
      return t || (t = new C),
        t._set(i * this._a + r * this._c + this._tx, i * this._b + r * this._d + this._ty, n)
    },
    _transformCoordinates: function(e, t, n) {
      for (var i = 0, r = 2 * n; i < r; i += 2) {
        var s = e[i]
          , u = e[i + 1];
        t[i] = s * this._a + u * this._c + this._tx,
          t[i + 1] = s * this._b + u * this._d + this._ty
      }
      return t
    },
    _transformCorners: function(e) {
      var t = e.x
        , n = e.y
        , i = t + e.width
        , r = n + e.height
        , s = [t, n, i, n, i, r, t, r];
      return this._transformCoordinates(s, s, 4)
    },
    _transformBounds: function(e, t, n) {
      for (var i = this._transformCorners(e), r = i.slice(0, 2), s = r.slice(), u = 2; u < 8; u++) {
        var o = i[u]
          , l = u & 1;
        o < r[l] ? r[l] = o : o > s[l] && (s[l] = o)
      }
      return t || (t = new Y),
        t._set(r[0], r[1], s[0] - r[0], s[1] - r[1], n)
    },
    inverseTransform: function() {
      return this._inverseTransform(C.read(arguments))
    },
    _inverseTransform: function(e, t, n) {
      var i = this._a
        , r = this._b
        , s = this._c
        , u = this._d
        , o = this._tx
        , l = this._ty
        , f = i * u - r * s
        , g = null;
      if (f && !isNaN(f) && isFinite(o) && isFinite(l)) {
        var y = e.x - this._tx
          , _ = e.y - this._ty;
        t || (t = new C),
          g = t._set((y * u - _ * s) / f, (_ * i - y * r) / f, n)
      }
      return g
    },
    decompose: function() {
      var e = this._a, t = this._b, n = this._c, i = this._d, r = e * i - t * n, s = Math.sqrt, u = Math.atan2, o = 180 / Math.PI, l, f, g;
      if (e !== 0 || t !== 0) {
        var y = s(e * e + t * t);
        l = Math.acos(e / y) * (t > 0 ? 1 : -1),
          f = [y, r / y],
          g = [u(e * n + t * i, y * y), 0]
      } else if (n !== 0 || i !== 0) {
        var _ = s(n * n + i * i);
        l = Math.asin(n / _) * (i > 0 ? 1 : -1),
          f = [r / _, _],
          g = [0, u(e * n + t * i, _ * _)]
      } else
        l = 0,
          g = f = [0, 0];
      return {
        translation: this.getTranslation(),
        rotation: l * o,
        scaling: new C(f),
        skewing: new C(g[0] * o,g[1] * o)
      }
    },
    getValues: function() {
      return [this._a, this._b, this._c, this._d, this._tx, this._ty]
    },
    getTranslation: function() {
      return new C(this._tx,this._ty)
    },
    getScaling: function() {
      return this.decompose().scaling
    },
    getRotation: function() {
      return this.decompose().rotation
    },
    applyToContext: function(e) {
      this.isIdentity() || e.transform(this._a, this._b, this._c, this._d, this._tx, this._ty)
    }
  }, d.each(["a", "b", "c", "d", "tx", "ty"], function(e) {
    var t = d.capitalize(e)
      , n = "_" + e;
    this["get" + t] = function() {
      return this[n]
    }
      ,
      this["set" + t] = function(i) {
        this[n] = i,
          this._changed()
      }
  }, {}))
    , Se = d.extend({
    _class: "Line",
    initialize: function(t, n, i, r, s) {
      var u = !1;
      arguments.length >= 4 ? (this._px = t,
        this._py = n,
        this._vx = i,
        this._vy = r,
        u = s) : (this._px = t.x,
        this._py = t.y,
        this._vx = n.x,
        this._vy = n.y,
        u = i),
      u || (this._vx -= this._px,
        this._vy -= this._py)
    },
    getPoint: function() {
      return new C(this._px,this._py)
    },
    getVector: function() {
      return new C(this._vx,this._vy)
    },
    getLength: function() {
      return this.getVector().getLength()
    },
    intersect: function(e, t) {
      return Se.intersect(this._px, this._py, this._vx, this._vy, e._px, e._py, e._vx, e._vy, !0, t)
    },
    getSide: function(e, t) {
      return Se.getSide(this._px, this._py, this._vx, this._vy, e.x, e.y, !0, t)
    },
    getDistance: function(e) {
      return Math.abs(this.getSignedDistance(e))
    },
    getSignedDistance: function(e) {
      return Se.getSignedDistance(this._px, this._py, this._vx, this._vy, e.x, e.y, !0)
    },
    isCollinear: function(e) {
      return C.isCollinear(this._vx, this._vy, e._vx, e._vy)
    },
    isOrthogonal: function(e) {
      return C.isOrthogonal(this._vx, this._vy, e._vx, e._vy)
    },
    statics: {
      intersect: function(e, t, n, i, r, s, u, o, l, f) {
        l || (n -= e,
          i -= t,
          u -= r,
          o -= s);
        var g = n * o - i * u;
        if (!O.isMachineZero(g)) {
          var y = e - r
            , _ = t - s
            , v = (u * _ - o * y) / g
            , b = (n * _ - i * y) / g
            , T = 1e-12
            , x = -T
            , S = 1 + T;
          if (f || x < v && v < S && x < b && b < S)
            return f || (v = v <= 0 ? 0 : v >= 1 ? 1 : v),
              new C(e + v * n,t + v * i)
        }
      },
      getSide: function(e, t, n, i, r, s, u, o) {
        u || (n -= e,
          i -= t);
        var l = r - e
          , f = s - t
          , g = l * i - f * n;
        return !o && O.isMachineZero(g) && (g = (l * n + l * n) / (n * n + i * i),
        g >= 0 && g <= 1 && (g = 0)),
          g < 0 ? -1 : g > 0 ? 1 : 0
      },
      getSignedDistance: function(e, t, n, i, r, s, u) {
        return u || (n -= e,
          i -= t),
          n === 0 ? i > 0 ? r - e : e - r : i === 0 ? n < 0 ? s - t : t - s : ((r - e) * i - (s - t) * n) / (i > n ? i * Math.sqrt(1 + n * n / (i * i)) : n * Math.sqrt(1 + i * i / (n * n)))
      },
      getDistance: function(e, t, n, i, r, s, u) {
        return Math.abs(Se.getSignedDistance(e, t, n, i, r, s, u))
      }
    }
  })
    , ye = Z.extend({
    _class: "Project",
    _list: "projects",
    _reference: "project",
    _compactSerialize: !0,
    initialize: function(t) {
      Z.call(this, !0),
        this._children = [],
        this._namedChildren = {},
        this._activeLayer = null,
        this._currentStyle = new Kt(null,null,this),
        this._view = Ke.create(this, t || Je.getCanvas(1, 1)),
        this._selectionItems = {},
        this._selectionCount = 0,
        this._updateVersion = 0
    },
    _serialize: function(e, t) {
      return d.serialize(this._children, e, !0, t)
    },
    _changed: function(e, t) {
      if (e & 1) {
        var n = this._view;
        n && (n._needsUpdate = !0,
        !n._requested && n._autoUpdate && n.requestUpdate())
      }
      var i = this._changes;
      if (i && t) {
        var r = this._changesById
          , s = t._id
          , u = r[s];
        u ? u.flags |= e : i.push(r[s] = {
          item: t,
          flags: e
        })
      }
    },
    clear: function() {
      for (var e = this._children, t = e.length - 1; t >= 0; t--)
        e[t].remove()
    },
    isEmpty: function() {
      return !this._children.length
    },
    remove: function e() {
      return e.base.call(this) ? (this._view && this._view.remove(),
        !0) : !1
    },
    getView: function() {
      return this._view
    },
    getCurrentStyle: function() {
      return this._currentStyle
    },
    setCurrentStyle: function(e) {
      this._currentStyle.set(e)
    },
    getIndex: function() {
      return this._index
    },
    getOptions: function() {
      return this._scope.settings
    },
    getLayers: function() {
      return this._children
    },
    getActiveLayer: function() {
      return this._activeLayer || new ct({
        project: this,
        insert: !0
      })
    },
    getSymbolDefinitions: function() {
      var e = []
        , t = {};
      return this.getItems({
        class: ft,
        match: function(n) {
          var i = n._definition
            , r = i._id;
          return t[r] || (t[r] = !0,
            e.push(i)),
            !1
        }
      }),
        e
    },
    getSymbols: "getSymbolDefinitions",
    getSelectedItems: function() {
      var e = this._selectionItems
        , t = [];
      for (var n in e) {
        var i = e[n]
          , r = i._selection;
        r & 1 && i.isInserted() ? t.push(i) : r || this._updateSelection(i)
      }
      return t
    },
    _updateSelection: function(e) {
      var t = e._id
        , n = this._selectionItems;
      e._selection ? n[t] !== e && (this._selectionCount++,
        n[t] = e) : n[t] === e && (this._selectionCount--,
        delete n[t])
    },
    selectAll: function() {
      for (var e = this._children, t = 0, n = e.length; t < n; t++)
        e[t].setFullySelected(!0)
    },
    deselectAll: function() {
      var e = this._selectionItems;
      for (var t in e)
        e[t].setFullySelected(!1)
    },
    addLayer: function(e) {
      return this.insertLayer(a, e)
    },
    insertLayer: function(e, t) {
      if (t instanceof ct) {
        t._remove(!1, !0),
          d.splice(this._children, [t], e, 0),
          t._setProject(this, !0);
        var n = t._name;
        n && t.setName(n),
        this._changes && t._changed(5),
        this._activeLayer || (this._activeLayer = t)
      } else
        t = null;
      return t
    },
    _insertItem: function(e, t, n) {
      return t = this.insertLayer(e, t) || (this._activeLayer || this._insertItem(a, new ct(oe.NO_INSERT), !0)).insertChild(e, t),
      n && t.activate && t.activate(),
        t
    },
    getItems: function(e) {
      return oe._getItems(this, e)
    },
    getItem: function(e) {
      return oe._getItems(this, e, null, null, !0)[0] || null
    },
    importJSON: function(e) {
      this.activate();
      var t = this._activeLayer;
      return d.importJSON(e, t && t.isEmpty() && t)
    },
    removeOn: function(e) {
      var t = this._removeSets;
      if (t) {
        e === "mouseup" && (t.mousedrag = null);
        var n = t[e];
        if (n) {
          for (var i in n) {
            var r = n[i];
            for (var s in t) {
              var u = t[s];
              u && u != n && delete u[r._id]
            }
            r.remove()
          }
          t[e] = null
        }
      }
    },
    draw: function(e, t, n) {
      this._updateVersion++,
        e.save(),
        t.applyToContext(e);
      for (var i = this._children, r = new d({
        offset: new C(0,0),
        pixelRatio: n,
        viewMatrix: t.isIdentity() ? null : t,
        matrices: [new le],
        updateMatrix: !0
      }), s = 0, u = i.length; s < u; s++)
        i[s].draw(e, r);
      if (e.restore(),
      this._selectionCount > 0) {
        e.save(),
          e.strokeWidth = 1;
        var o = this._selectionItems
          , l = this._scope.settings.handleSize
          , f = this._updateVersion;
        for (var g in o)
          o[g]._drawSelection(e, t, l, o, f);
        e.restore()
      }
    }
  })
    , oe = d.extend(M, {
      statics: {
        extend: function e(t) {
          return t._serializeFields && (t._serializeFields = d.set({}, this.prototype._serializeFields, t._serializeFields)),
            e.base.apply(this, arguments)
        },
        INSERT: {
          insert: !0
        },
        NO_INSERT: {
          insert: !1
        }
      },
      _class: "Item",
      _name: null,
      _applyMatrix: !0,
      _canApplyMatrix: !0,
      _canScaleStroke: !1,
      _pivot: null,
      _visible: !0,
      _blendMode: "normal",
      _opacity: 1,
      _locked: !1,
      _guide: !1,
      _clipMask: !1,
      _selection: 0,
      _selectBounds: !0,
      _selectChildren: !1,
      _serializeFields: {
        name: null,
        applyMatrix: null,
        matrix: new le,
        pivot: null,
        visible: !0,
        blendMode: "normal",
        opacity: 1,
        locked: !1,
        guide: !1,
        clipMask: !1,
        selected: !1,
        data: {}
      },
      _prioritize: ["applyMatrix"]
    }, new function() {
      var e = ["onMouseDown", "onMouseUp", "onMouseDrag", "onClick", "onDoubleClick", "onMouseMove", "onMouseEnter", "onMouseLeave"];
      return d.each(e, function(t) {
        this._events[t] = {
          install: function(n) {
            this.getView()._countItemEvent(n, 1)
          },
          uninstall: function(n) {
            this.getView()._countItemEvent(n, -1)
          }
        }
      }, {
        _events: {
          onFrame: {
            install: function() {
              this.getView()._animateItem(this, !0)
            },
            uninstall: function() {
              this.getView()._animateItem(this, !1)
            }
          },
          onLoad: {},
          onError: {}
        },
        statics: {
          _itemHandlers: e
        }
      })
    }
    , {
      initialize: function() {},
      _initialize: function(e, t) {
        var n = e && d.isPlainObject(e)
          , i = n && e.internal === !0
          , r = this._matrix = new le
          , s = n && e.project || ae.project
          , u = ae.settings;
        return this._id = i ? null : B.get(),
          this._parent = this._index = null,
          this._applyMatrix = this._canApplyMatrix && u.applyMatrix,
        t && r.translate(t),
          r._owner = this,
          this._style = new Kt(s._currentStyle,this,s),
          i || n && e.insert == !1 || !u.insertItems && !(n && e.insert == !0) ? this._setProject(s) : (n && e.parent || s)._insertItem(a, this, !0),
        n && e !== oe.NO_INSERT && e !== oe.INSERT && this.set(e, {
          internal: !0,
          insert: !0,
          project: !0,
          parent: !0
        }),
          n
      },
      _serialize: function(e, t) {
        var n = {}
          , i = this;
        function r(s) {
          for (var u in s) {
            var o = i[u];
            d.equals(o, u === "leading" ? s.fontSize * 1.2 : s[u]) || (n[u] = d.serialize(o, e, u !== "data", t))
          }
        }
        return r(this._serializeFields),
        this instanceof We || r(this._style._defaults),
          [this._class, n]
      },
      _changed: function(e) {
        var t = this._symbol
          , n = this._parent || t
          , i = this._project;
        e & 8 && (this._bounds = this._position = this._decomposed = a),
        e & 16 && (this._globalMatrix = a),
        n && e & 72 && oe._clearBoundsCache(n),
        e & 2 && oe._clearBoundsCache(this),
        i && i._changed(e, this),
        t && t._changed(e)
      },
      getId: function() {
        return this._id
      },
      getName: function() {
        return this._name
      },
      setName: function(e) {
        if (this._name && this._removeNamed(),
        e === +e + "")
          throw new Error("Names consisting only of numbers are not supported.");
        var t = this._getOwner();
        if (e && t) {
          var n = t._children
            , i = t._namedChildren;
          (i[e] = i[e] || []).push(this),
          e in n || (n[e] = this)
        }
        this._name = e || a,
          this._changed(256)
      },
      getStyle: function() {
        return this._style
      },
      setStyle: function(e) {
        this.getStyle().set(e)
      }
    }, d.each(["locked", "visible", "blendMode", "opacity", "guide"], function(e) {
      var t = d.capitalize(e)
        , n = "_" + e
        , i = {
        locked: 256,
        visible: 265
      };
      this["get" + t] = function() {
        return this[n]
      }
        ,
        this["set" + t] = function(r) {
          r != this[n] && (this[n] = r,
            this._changed(i[e] || 257))
        }
    }, {}), {
      beans: !0,
      getSelection: function() {
        return this._selection
      },
      setSelection: function(e) {
        if (e !== this._selection) {
          this._selection = e;
          var t = this._project;
          t && (t._updateSelection(this),
            this._changed(257))
        }
      },
      _changeSelection: function(e, t) {
        var n = this._selection;
        this.setSelection(t ? n | e : n & ~e)
      },
      isSelected: function() {
        if (this._selectChildren) {
          for (var e = this._children, t = 0, n = e.length; t < n; t++)
            if (e[t].isSelected())
              return !0
        }
        return !!(this._selection & 1)
      },
      setSelected: function(e) {
        if (this._selectChildren)
          for (var t = this._children, n = 0, i = t.length; n < i; n++)
            t[n].setSelected(e);
        this._changeSelection(1, e)
      },
      isFullySelected: function() {
        var e = this._children
          , t = !!(this._selection & 1);
        if (e && t) {
          for (var n = 0, i = e.length; n < i; n++)
            if (!e[n].isFullySelected())
              return !1;
          return !0
        }
        return t
      },
      setFullySelected: function(e) {
        var t = this._children;
        if (t)
          for (var n = 0, i = t.length; n < i; n++)
            t[n].setFullySelected(e);
        this._changeSelection(1, e)
      },
      isClipMask: function() {
        return this._clipMask
      },
      setClipMask: function(e) {
        this._clipMask != (e = !!e) && (this._clipMask = e,
        e && (this.setFillColor(null),
          this.setStrokeColor(null)),
          this._changed(257),
        this._parent && this._parent._changed(2048))
      },
      getData: function() {
        return this._data || (this._data = {}),
          this._data
      },
      setData: function(e) {
        this._data = e
      },
      getPosition: function(e) {
        var t = e ? C : Q
          , n = this._position || (this._position = this._getPositionFromBounds());
        return new t(n.x,n.y,this,"setPosition")
      },
      setPosition: function() {
        this.translate(C.read(arguments).subtract(this.getPosition(!0)))
      },
      _getPositionFromBounds: function(e) {
        return this._pivot ? this._matrix._transformPoint(this._pivot) : (e || this.getBounds()).getCenter(!0)
      },
      getPivot: function() {
        var e = this._pivot;
        return e ? new Q(e.x,e.y,this,"setPivot") : null
      },
      setPivot: function() {
        this._pivot = C.read(arguments, 0, {
          clone: !0,
          readNull: !0
        }),
          this._position = a
      }
    }, d.each({
      getStrokeBounds: {
        stroke: !0
      },
      getHandleBounds: {
        handle: !0
      },
      getInternalBounds: {
        internal: !0
      }
    }, function(e, t) {
      this[t] = function(n) {
        return this.getBounds(n, e)
      }
    }, {
      beans: !0,
      getBounds: function(e, t) {
        var n = t || e instanceof le
          , i = d.set({}, n ? t : e, this._boundsOptions);
        (!i.stroke || this.getStrokeScaling()) && (i.cacheItem = this);
        var r = this._getCachedBounds(n && e, i).rect;
        return arguments.length ? r : new Me(r.x,r.y,r.width,r.height,this,"setBounds")
      },
      setBounds: function() {
        var e = Y.read(arguments)
          , t = this.getBounds()
          , n = this._matrix
          , i = new le
          , r = e.getCenter();
        i.translate(r),
        (e.width != t.width || e.height != t.height) && (n.isInvertible() || (n.set(n._backup || new le().translate(n.getTranslation())),
          t = this.getBounds()),
          i.scale(t.width !== 0 ? e.width / t.width : 0, t.height !== 0 ? e.height / t.height : 0)),
          r = t.getCenter(),
          i.translate(-r.x, -r.y),
          this.transform(i)
      },
      _getBounds: function(e, t) {
        var n = this._children;
        return !n || !n.length ? new Y : (oe._updateBoundsCache(this, t.cacheItem),
          oe._getBounds(n, e, t))
      },
      _getBoundsCacheKey: function(e, t) {
        return [e.stroke ? 1 : 0, e.handle ? 1 : 0, t ? 1 : 0].join("")
      },
      _getCachedBounds: function(e, t, n) {
        e = e && e._orNullIfIdentity();
        var i = t.internal && !n
          , r = t.cacheItem
          , s = i ? null : this._matrix._orNullIfIdentity()
          , u = r && (!e || e.equals(s)) && this._getBoundsCacheKey(t, i)
          , o = this._bounds;
        if (oe._updateBoundsCache(this._parent || this._symbol, r),
        u && o && u in o) {
          var l = o[u];
          return {
            rect: l.rect.clone(),
            nonscaling: l.nonscaling
          }
        }
        var f = this._getBounds(e || s, t)
          , g = f.rect || f
          , y = this._style
          , _ = f.nonscaling || y.hasStroke() && !y.getStrokeScaling();
        if (u) {
          o || (this._bounds = o = {});
          var l = o[u] = {
            rect: g.clone(),
            nonscaling: _,
            internal: i
          }
        }
        return {
          rect: g,
          nonscaling: _
        }
      },
      _getStrokeMatrix: function(e, t) {
        var n = this.getStrokeScaling() ? null : t && t.internal ? this : this._parent || this._symbol && this._symbol._item
          , i = n ? n.getViewMatrix().invert() : e;
        return i && i._shiftless()
      },
      statics: {
        _updateBoundsCache: function(e, t) {
          if (e && t) {
            var n = t._id
              , i = e._boundsCache = e._boundsCache || {
              ids: {},
              list: []
            };
            i.ids[n] || (i.list.push(t),
              i.ids[n] = t)
          }
        },
        _clearBoundsCache: function(e) {
          var t = e._boundsCache;
          if (t) {
            e._bounds = e._position = e._boundsCache = a;
            for (var n = 0, i = t.list, r = i.length; n < r; n++) {
              var s = i[n];
              s !== e && (s._bounds = s._position = a,
              s._boundsCache && oe._clearBoundsCache(s))
            }
          }
        },
        _getBounds: function(e, t, n) {
          var i = 1 / 0
            , r = -i
            , s = i
            , u = r
            , o = !1;
          n = n || {};
          for (var l = 0, f = e.length; l < f; l++) {
            var g = e[l];
            if (g._visible && !g.isEmpty(!0)) {
              var y = g._getCachedBounds(t && t.appended(g._matrix), n, !0)
                , _ = y.rect;
              i = Math.min(_.x, i),
                s = Math.min(_.y, s),
                r = Math.max(_.x + _.width, r),
                u = Math.max(_.y + _.height, u),
              y.nonscaling && (o = !0)
            }
          }
          return {
            rect: isFinite(i) ? new Y(i,s,r - i,u - s) : new Y,
            nonscaling: o
          }
        }
      }
    }), {
      beans: !0,
      _decompose: function() {
        return this._applyMatrix ? null : this._decomposed || (this._decomposed = this._matrix.decompose())
      },
      getRotation: function() {
        var e = this._decompose();
        return e ? e.rotation : 0
      },
      setRotation: function(e) {
        var t = this.getRotation();
        if (t != null && e != null) {
          var n = this._decomposed;
          this.rotate(e - t),
          n && (n.rotation = e,
            this._decomposed = n)
        }
      },
      getScaling: function() {
        var e = this._decompose()
          , t = e && e.scaling;
        return new Q(t ? t.x : 1,t ? t.y : 1,this,"setScaling")
      },
      setScaling: function() {
        var e = this.getScaling()
          , t = C.read(arguments, 0, {
          clone: !0,
          readNull: !0
        });
        if (e && t && !e.equals(t)) {
          var n = this.getRotation()
            , i = this._decomposed
            , r = new le
            , s = O.isZero;
          if (s(e.x) || s(e.y))
            r.translate(i.translation),
            n && r.rotate(n),
              r.scale(t.x, t.y),
              this._matrix.set(r);
          else {
            var u = this.getPosition(!0);
            r.translate(u),
            n && r.rotate(n),
              r.scale(t.x / e.x, t.y / e.y),
            n && r.rotate(-n),
              r.translate(u.negate()),
              this.transform(r)
          }
          i && (i.scaling = t,
            this._decomposed = i)
        }
      },
      getMatrix: function() {
        return this._matrix
      },
      setMatrix: function() {
        var e = this._matrix;
        e.set.apply(e, arguments)
      },
      getGlobalMatrix: function(e) {
        var t = this._globalMatrix;
        if (t)
          for (var n = this._parent, i = []; n; ) {
            if (!n._globalMatrix) {
              t = null;
              for (var r = 0, s = i.length; r < s; r++)
                i[r]._globalMatrix = null;
              break
            }
            i.push(n),
              n = n._parent
          }
        if (!t) {
          t = this._globalMatrix = this._matrix.clone();
          var n = this._parent;
          n && t.prepend(n.getGlobalMatrix(!0))
        }
        return e ? t : t.clone()
      },
      getViewMatrix: function() {
        return this.getGlobalMatrix().prepend(this.getView()._matrix)
      },
      getApplyMatrix: function() {
        return this._applyMatrix
      },
      setApplyMatrix: function(e) {
        (this._applyMatrix = this._canApplyMatrix && !!e) && this.transform(null, !0)
      },
      getTransformContent: "#getApplyMatrix",
      setTransformContent: "#setApplyMatrix"
    }, {
      getProject: function() {
        return this._project
      },
      _setProject: function(e, t) {
        if (this._project !== e) {
          this._project && this._installEvents(!1),
            this._project = e;
          for (var n = this._children, i = 0, r = n && n.length; i < r; i++)
            n[i]._setProject(e);
          t = !0
        }
        t && this._installEvents(!0)
      },
      getView: function() {
        return this._project._view
      },
      _installEvents: function e(t) {
        e.base.call(this, t);
        for (var n = this._children, i = 0, r = n && n.length; i < r; i++)
          n[i]._installEvents(t)
      },
      getLayer: function() {
        for (var e = this; e = e._parent; )
          if (e instanceof ct)
            return e;
        return null
      },
      getParent: function() {
        return this._parent
      },
      setParent: function(e) {
        return e.addChild(this)
      },
      _getOwner: "#getParent",
      getChildren: function() {
        return this._children
      },
      setChildren: function(e) {
        this.removeChildren(),
          this.addChildren(e)
      },
      getFirstChild: function() {
        return this._children && this._children[0] || null
      },
      getLastChild: function() {
        return this._children && this._children[this._children.length - 1] || null
      },
      getNextSibling: function() {
        var e = this._getOwner();
        return e && e._children[this._index + 1] || null
      },
      getPreviousSibling: function() {
        var e = this._getOwner();
        return e && e._children[this._index - 1] || null
      },
      getIndex: function() {
        return this._index
      },
      equals: function(e) {
        return e === this || e && this._class === e._class && this._style.equals(e._style) && this._matrix.equals(e._matrix) && this._locked === e._locked && this._visible === e._visible && this._blendMode === e._blendMode && this._opacity === e._opacity && this._clipMask === e._clipMask && this._guide === e._guide && this._equals(e) || !1
      },
      _equals: function(e) {
        return d.equals(this._children, e._children)
      },
      clone: function(e) {
        var t = new this.constructor(oe.NO_INSERT)
          , n = this._children
          , i = d.pick(e ? e.insert : a, e === a || e === !0)
          , r = d.pick(e ? e.deep : a, !0);
        n && t.copyAttributes(this),
        (!n || r) && t.copyContent(this),
        n || t.copyAttributes(this),
        i && t.insertAbove(this);
        var s = this._name
          , u = this._parent;
        if (s && u) {
          for (var n = u._children, o = s, l = 1; n[s]; )
            s = o + " " + l++;
          s !== o && t.setName(s)
        }
        return t
      },
      copyContent: function(e) {
        for (var t = e._children, n = 0, i = t && t.length; n < i; n++)
          this.addChild(t[n].clone(!1), !0)
      },
      copyAttributes: function(e, t) {
        this.setStyle(e._style);
        for (var n = ["_locked", "_visible", "_blendMode", "_opacity", "_clipMask", "_guide"], i = 0, r = n.length; i < r; i++) {
          var s = n[i];
          e.hasOwnProperty(s) && (this[s] = e[s])
        }
        t || this._matrix.set(e._matrix, !0),
          this.setApplyMatrix(e._applyMatrix),
          this.setPivot(e._pivot),
          this.setSelection(e._selection);
        var u = e._data
          , o = e._name;
        this._data = u ? d.clone(u) : null,
        o && this.setName(o)
      },
      rasterize: function(e, t) {
        var n, i, r;
        d.isPlainObject(e) ? (n = e.resolution,
          i = e.insert,
          r = e.raster) : (n = e,
          i = t),
        r || (r = new Pt(oe.NO_INSERT));
        var s = this.getStrokeBounds()
          , u = (n || this.getView().getResolution()) / 72
          , o = s.getTopLeft().floor()
          , l = s.getBottomRight().ceil()
          , f = new J(l.subtract(o))
          , g = f.multiply(u);
        if (r.setSize(g, !0),
          !g.isZero()) {
          var y = r.getContext(!0)
            , _ = new le().scale(u).translate(o.negate());
          y.save(),
            _.applyToContext(y),
            this.draw(y, new d({
              matrices: [_]
            })),
            y.restore()
        }
        return r._matrix.set(new le().translate(o.add(f.divide(2))).scale(1 / u)),
        (i === a || i) && r.insertAbove(this),
          r
      },
      contains: function() {
        var e = this._matrix;
        return e.isInvertible() && !!this._contains(e._inverseTransform(C.read(arguments)))
      },
      _contains: function(e) {
        var t = this._children;
        if (t) {
          for (var n = t.length - 1; n >= 0; n--)
            if (t[n].contains(e))
              return !0;
          return !1
        }
        return e.isInside(this.getInternalBounds())
      },
      isInside: function() {
        return Y.read(arguments).contains(this.getBounds())
      },
      _asPathItem: function() {
        return new ke.Rectangle({
          rectangle: this.getInternalBounds(),
          matrix: this._matrix,
          insert: !1
        })
      },
      intersects: function(e, t) {
        return e instanceof oe ? this._asPathItem().getIntersections(e._asPathItem(), null, t, !0).length > 0 : !1
      }
    }, new function() {
      function e() {
        var i = arguments;
        return this._hitTest(C.read(i), qe.getOptions(i))
      }
      function t() {
        var i = arguments
          , r = C.read(i)
          , s = qe.getOptions(i)
          , u = [];
        return this._hitTest(r, new d({
          all: u
        },s)),
          u
      }
      function n(i, r, s, u) {
        var o = this._children;
        if (o)
          for (var l = o.length - 1; l >= 0; l--) {
            var f = o[l]
              , g = f !== u && f._hitTest(i, r, s);
            if (g && !r.all)
              return g
          }
        return null
      }
      return ye.inject({
        hitTest: e,
        hitTestAll: t,
        _hitTest: n
      }),
        {
          hitTest: e,
          hitTestAll: t,
          _hitTestChildren: n
        }
    }
    , {
      _hitTest: function(e, t, n) {
        if (this._locked || !this._visible || this._guide && !t.guides || this.isEmpty())
          return null;
        var i = this._matrix
          , r = n ? n.appended(i) : this.getGlobalMatrix().prepend(this.getView()._matrix)
          , s = Math.max(t.tolerance, 1e-12)
          , u = t._tolerancePadding = new J(ke._getStrokePadding(s, i._shiftless().invert()));
        if (e = i._inverseTransform(e),
        !e || !this._children && !this.getBounds({
          internal: !0,
          stroke: !0,
          handle: !0
        }).expand(u.multiply(2))._containsPoint(e))
          return null;
        var o = !(t.guides && !this._guide || t.selected && !this.isSelected() || t.type && t.type !== d.hyphenate(this._class) || t.class && !(this instanceof t.class)), l = t.match, f = this, g, y;
        function _(m) {
          return m && l && !l(m) && (m = null),
          m && t.all && t.all.push(m),
            m
        }
        function v(m, w) {
          var E = w ? g["get" + w]() : f.getPosition();
          if (e.subtract(E).divide(u).length <= 1)
            return new qe(m,f,{
              name: w ? d.hyphenate(w) : m,
              point: E
            })
        }
        var b = t.position
          , T = t.center
          , x = t.bounds;
        if (o && this._parent && (b || T || x)) {
          if ((T || x) && (g = this.getInternalBounds()),
            y = b && v("position") || T && v("center", "Center"),
          !y && x)
            for (var S = ["TopLeft", "TopRight", "BottomLeft", "BottomRight", "LeftCenter", "TopCenter", "RightCenter", "BottomCenter"], I = 0; I < 8 && !y; I++)
              y = v("bounds", S[I]);
          y = _(y)
        }
        return y || (y = this._hitTestChildren(e, t, r) || o && _(this._hitTestSelf(e, t, r, this.getStrokeScaling() ? null : r._shiftless().invert())) || null),
        y && y.point && (y.point = i.transform(y.point)),
          y
      },
      _hitTestSelf: function(e, t) {
        if (t.fill && this.hasFill() && this._contains(e))
          return new qe("fill",this)
      },
      matches: function(e, t) {
        function n(u, o) {
          for (var l in u)
            if (u.hasOwnProperty(l)) {
              var f = u[l]
                , g = o[l];
              if (d.isPlainObject(f) && d.isPlainObject(g)) {
                if (!n(f, g))
                  return !1
              } else if (!d.equals(f, g))
                return !1
            }
          return !0
        }
        var i = typeof e;
        if (i === "object") {
          for (var r in e)
            if (e.hasOwnProperty(r) && !this.matches(r, e[r]))
              return !1;
          return !0
        } else {
          if (i === "function")
            return e(this);
          if (e === "match")
            return t(this);
          var s = /^(empty|editable)$/.test(e) ? this["is" + d.capitalize(e)]() : e === "type" ? d.hyphenate(this._class) : this[e];
          if (e === "class") {
            if (typeof t == "function")
              return this instanceof t;
            s = this._class
          }
          if (typeof t == "function")
            return !!t(s);
          if (t) {
            if (t.test)
              return t.test(s);
            if (d.isPlainObject(t))
              return n(t, s)
          }
          return d.equals(s, t)
        }
      },
      getItems: function(e) {
        return oe._getItems(this, e, this._matrix)
      },
      getItem: function(e) {
        return oe._getItems(this, e, this._matrix, null, !0)[0] || null
      },
      statics: {
        _getItems: function e(t, n, i, r, s) {
          if (!r) {
            var u = typeof n == "object" && n
              , o = u && u.overlapping
              , l = u && u.inside
              , f = o || l
              , _ = f && Y.read([f]);
            r = {
              items: [],
              recursive: u && u.recursive !== !1,
              inside: !!l,
              overlapping: !!o,
              rect: _,
              path: o && new ke.Rectangle({
                rectangle: _,
                insert: !1
              })
            },
            u && (n = d.filter({}, n, {
              recursive: !0,
              inside: !0,
              overlapping: !0
            }))
          }
          var g = t._children
            , y = r.items
            , _ = r.rect;
          i = _ && (i || new le);
          for (var v = 0, b = g && g.length; v < b; v++) {
            var T = g[v]
              , x = i && i.appended(T._matrix)
              , S = !0;
            if (_) {
              var f = T.getBounds(x);
              if (!_.intersects(f))
                continue;
              _.contains(f) || r.overlapping && (f.contains(_) || r.path.intersects(T, x)) || (S = !1)
            }
            if (S && T.matches(n) && (y.push(T),
              s) || (r.recursive !== !1 && e(T, n, x, r, s),
            s && y.length > 0))
              break
          }
          return y
        }
      }
    }, {
      importJSON: function(e) {
        var t = d.importJSON(e, this);
        return t !== this ? this.addChild(t) : t
      },
      addChild: function(e) {
        return this.insertChild(a, e)
      },
      insertChild: function(e, t) {
        var n = t ? this.insertChildren(e, [t]) : null;
        return n && n[0]
      },
      addChildren: function(e) {
        return this.insertChildren(this._children.length, e)
      },
      insertChildren: function(e, t) {
        var n = this._children;
        if (n && t && t.length > 0) {
          t = d.slice(t);
          for (var i = {}, r = t.length - 1; r >= 0; r--) {
            var s = t[r]
              , u = s && s._id;
            !s || i[u] ? t.splice(r, 1) : (s._remove(!1, !0),
              i[u] = !0)
          }
          d.splice(n, t, e, 0);
          for (var o = this._project, l = o._changes, r = 0, f = t.length; r < f; r++) {
            var s = t[r]
              , g = s._name;
            s._parent = this,
              s._setProject(o, !0),
            g && s.setName(g),
            l && s._changed(5)
          }
          this._changed(11)
        } else
          t = null;
        return t
      },
      _insertItem: "#insertChild",
      _insertAt: function(e, t) {
        var n = e && e._getOwner()
          , i = e !== this && n ? this : null;
        return i && (i._remove(!1, !0),
          n._insertItem(e._index + t, i)),
          i
      },
      insertAbove: function(e) {
        return this._insertAt(e, 1)
      },
      insertBelow: function(e) {
        return this._insertAt(e, 0)
      },
      sendToBack: function() {
        var e = this._getOwner();
        return e ? e._insertItem(0, this) : null
      },
      bringToFront: function() {
        var e = this._getOwner();
        return e ? e._insertItem(a, this) : null
      },
      appendTop: "#addChild",
      appendBottom: function(e) {
        return this.insertChild(0, e)
      },
      moveAbove: "#insertAbove",
      moveBelow: "#insertBelow",
      addTo: function(e) {
        return e._insertItem(a, this)
      },
      copyTo: function(e) {
        return this.clone(!1).addTo(e)
      },
      reduce: function(e) {
        var t = this._children;
        if (t && t.length === 1) {
          var n = t[0].reduce(e);
          return this._parent ? (n.insertAbove(this),
            this.remove()) : n.remove(),
            n
        }
        return this
      },
      _removeNamed: function() {
        var e = this._getOwner();
        if (e) {
          var t = e._children
            , n = e._namedChildren
            , i = this._name
            , r = n[i]
            , s = r ? r.indexOf(this) : -1;
          s !== -1 && (t[i] == this && delete t[i],
            r.splice(s, 1),
            r.length ? t[i] = r[0] : delete n[i])
        }
      },
      _remove: function(e, t) {
        var n = this._getOwner()
          , i = this._project
          , r = this._index;
        return this._style && this._style._dispose(),
          n ? (this._name && this._removeNamed(),
          r != null && (i._activeLayer === this && (i._activeLayer = this.getNextSibling() || this.getPreviousSibling()),
            d.splice(n._children, null, r, 1)),
            this._installEvents(!1),
          e && i._changes && this._changed(5),
          t && n._changed(11, this),
            this._parent = null,
            !0) : !1
      },
      remove: function() {
        return this._remove(!0, !0)
      },
      replaceWith: function(e) {
        var t = e && e.insertBelow(this);
        return t && this.remove(),
          t
      },
      removeChildren: function(e, t) {
        if (!this._children)
          return null;
        e = e || 0,
          t = d.pick(t, this._children.length);
        for (var n = d.splice(this._children, null, e, t - e), i = n.length - 1; i >= 0; i--)
          n[i]._remove(!0, !1);
        return n.length > 0 && this._changed(11),
          n
      },
      clear: "#removeChildren",
      reverseChildren: function() {
        if (this._children) {
          this._children.reverse();
          for (var e = 0, t = this._children.length; e < t; e++)
            this._children[e]._index = e;
          this._changed(11)
        }
      },
      isEmpty: function(e) {
        var t = this._children
          , n = t ? t.length : 0;
        if (e) {
          for (var i = 0; i < n; i++)
            if (!t[i].isEmpty(e))
              return !1;
          return !0
        }
        return !n
      },
      isEditable: function() {
        for (var e = this; e; ) {
          if (!e._visible || e._locked)
            return !1;
          e = e._parent
        }
        return !0
      },
      hasFill: function() {
        return this.getStyle().hasFill()
      },
      hasStroke: function() {
        return this.getStyle().hasStroke()
      },
      hasShadow: function() {
        return this.getStyle().hasShadow()
      },
      _getOrder: function(e) {
        function t(u) {
          var o = [];
          do
            o.unshift(u);
          while (u = u._parent);
          return o
        }
        for (var n = t(this), i = t(e), r = 0, s = Math.min(n.length, i.length); r < s; r++)
          if (n[r] != i[r])
            return n[r]._index < i[r]._index ? 1 : -1;
        return 0
      },
      hasChildren: function() {
        return this._children && this._children.length > 0
      },
      isInserted: function() {
        return this._parent ? this._parent.isInserted() : !1
      },
      isAbove: function(e) {
        return this._getOrder(e) === -1
      },
      isBelow: function(e) {
        return this._getOrder(e) === 1
      },
      isParent: function(e) {
        return this._parent === e
      },
      isChild: function(e) {
        return e && e._parent === this
      },
      isDescendant: function(e) {
        for (var t = this; t = t._parent; )
          if (t === e)
            return !0;
        return !1
      },
      isAncestor: function(e) {
        return e ? e.isDescendant(this) : !1
      },
      isSibling: function(e) {
        return this._parent === e._parent
      },
      isGroupedWith: function(e) {
        for (var t = this._parent; t; ) {
          if (t._parent && /^(Group|Layer|CompoundPath)$/.test(t._class) && e.isDescendant(t))
            return !0;
          t = t._parent
        }
        return !1
      }
    }, d.each(["rotate", "scale", "shear", "skew"], function(e) {
      var t = e === "rotate";
      this[e] = function() {
        var n = arguments
          , i = (t ? d : C).read(n)
          , r = C.read(n, 0, {
          readNull: !0
        });
        return this.transform(new le()[e](i, r || this.getPosition(!0)))
      }
    }, {
      translate: function() {
        var e = new le;
        return this.transform(e.translate.apply(e, arguments))
      },
      transform: function(e, t, n) {
        var i = this._matrix
          , r = e && !e.isIdentity()
          , s = n && this._canApplyMatrix || this._applyMatrix && (r || !i.isIdentity() || t && this._children);
        if (!r && !s)
          return this;
        if (r) {
          !e.isInvertible() && i.isInvertible() && (i._backup = i.getValues()),
            i.prepend(e, !0);
          var u = this._style
            , o = u.getFillColor(!0)
            , l = u.getStrokeColor(!0);
          o && o.transform(e),
          l && l.transform(e)
        }
        if (s && (s = this._transformContent(i, t, n))) {
          var f = this._pivot;
          f && i._transformPoint(f, f, !0),
            i.reset(!0),
          n && this._canApplyMatrix && (this._applyMatrix = !0)
        }
        var g = this._bounds
          , y = this._position;
        (r || s) && this._changed(25);
        var _ = r && g && e.decompose();
        if (_ && _.skewing.isZero() && _.rotation % 90 === 0) {
          for (var v in g) {
            var b = g[v];
            if (b.nonscaling)
              delete g[v];
            else if (s || !b.internal) {
              var T = b.rect;
              e._transformBounds(T, T)
            }
          }
          this._bounds = g;
          var x = g[this._getBoundsCacheKey(this._boundsOptions || {})];
          x && (this._position = this._getPositionFromBounds(x.rect))
        } else
          r && y && this._pivot && (this._position = e._transformPoint(y, y));
        return this
      },
      _transformContent: function(e, t, n) {
        var i = this._children;
        if (i) {
          for (var r = 0, s = i.length; r < s; r++)
            i[r].transform(e, t, n);
          return !0
        }
      },
      globalToLocal: function() {
        return this.getGlobalMatrix(!0)._inverseTransform(C.read(arguments))
      },
      localToGlobal: function() {
        return this.getGlobalMatrix(!0)._transformPoint(C.read(arguments))
      },
      parentToLocal: function() {
        return this._matrix._inverseTransform(C.read(arguments))
      },
      localToParent: function() {
        return this._matrix._transformPoint(C.read(arguments))
      },
      fitBounds: function(e, t) {
        e = Y.read(arguments);
        var n = this.getBounds()
          , i = n.height / n.width
          , r = e.height / e.width
          , s = (t ? i > r : i < r) ? e.width / n.width : e.height / n.height
          , u = new Y(new C,new J(n.width * s,n.height * s));
        u.setCenter(e.getCenter()),
          this.setBounds(u)
      }
    }), {
      _setStyles: function(e, t, n) {
        var i = this._style
          , r = this._matrix;
        if (i.hasFill() && (e.fillStyle = i.getFillColor().toCanvasStyle(e, r)),
          i.hasStroke()) {
          e.strokeStyle = i.getStrokeColor().toCanvasStyle(e, r),
            e.lineWidth = i.getStrokeWidth();
          var s = i.getStrokeJoin()
            , u = i.getStrokeCap()
            , o = i.getMiterLimit();
          if (s && (e.lineJoin = s),
          u && (e.lineCap = u),
          o && (e.miterLimit = o),
            ae.support.nativeDash) {
            var l = i.getDashArray()
              , f = i.getDashOffset();
            l && l.length && ("setLineDash"in e ? (e.setLineDash(l),
              e.lineDashOffset = f) : (e.mozDash = l,
              e.mozDashOffset = f))
          }
        }
        if (i.hasShadow()) {
          var g = t.pixelRatio || 1
            , y = n._shiftless().prepend(new le().scale(g, g))
            , _ = y.transform(new C(i.getShadowBlur(),0))
            , v = y.transform(this.getShadowOffset());
          e.shadowColor = i.getShadowColor().toCanvasStyle(e),
            e.shadowBlur = _.getLength(),
            e.shadowOffsetX = v.x,
            e.shadowOffsetY = v.y
        }
      },
      draw: function(e, t, n) {
        var i = this._updateVersion = this._project._updateVersion;
        if (!(!this._visible || this._opacity === 0)) {
          var r = t.matrices
            , s = t.viewMatrix
            , u = this._matrix
            , o = r[r.length - 1].appended(u);
          if (o.isInvertible()) {
            s = s ? s.appended(o) : o,
              r.push(o),
            t.updateMatrix && (this._globalMatrix = o);
            var l = this._blendMode, f = O.clamp(this._opacity, 0, 1), g = l === "normal", y = nn.nativeModes[l], _ = g && f === 1 || t.dontStart || t.clip || (y || g && f < 1) && this._canComposite(), v = t.pixelRatio || 1, b, T, x;
            if (!_) {
              var S = this.getStrokeBounds(s);
              if (!S.width || !S.height) {
                r.pop();
                return
              }
              x = t.offset,
                T = t.offset = S.getTopLeft().floor(),
                b = e,
                e = Je.getContext(S.getSize().ceil().add(1).multiply(v)),
              v !== 1 && e.scale(v, v)
            }
            e.save();
            var I = n ? n.appended(u) : this._canScaleStroke && !this.getStrokeScaling(!0) && s
              , m = !_ && t.clipItem
              , w = !I || m;
            if (_ ? (e.globalAlpha = f,
            y && (e.globalCompositeOperation = l)) : w && e.translate(-T.x, -T.y),
            w && (_ ? u : s).applyToContext(e),
            m && t.clipItem.draw(e, t.extend({
              clip: !0
            })),
              I) {
              e.setTransform(v, 0, 0, v, 0, 0);
              var E = t.offset;
              E && e.translate(-E.x, -E.y)
            }
            this._draw(e, t, s, I),
              e.restore(),
              r.pop(),
            t.clip && !t.dontFinish && e.clip(this.getFillRule()),
            _ || (nn.process(l, e, b, f, T.subtract(x).multiply(v)),
              Je.release(e),
              t.offset = x)
          }
        }
      },
      _isUpdated: function(e) {
        var t = this._parent;
        if (t instanceof ot)
          return t._isUpdated(e);
        var n = this._updateVersion === e;
        return !n && t && t._visible && t._isUpdated(e) && (this._updateVersion = e,
          n = !0),
          n
      },
      _drawSelection: function(e, t, n, i, r) {
        var s = this._selection
          , u = s & 1
          , o = s & 2 || u && this._selectBounds
          , l = s & 4;
        if (this._drawSelected || (u = !1),
        (u || o || l) && this._isUpdated(r)) {
          var f, g = this.getSelectedColor(!0) || (f = this.getLayer()) && f.getSelectedColor(!0), y = t.appended(this.getGlobalMatrix(!0)), _ = n / 2;
          if (e.strokeStyle = e.fillStyle = g ? g.toCanvasStyle(e) : "#009dec",
          u && this._drawSelected(e, y, i),
            l) {
            var v = this.getPosition(!0)
              , b = this._parent
              , T = b ? b.localToGlobal(v) : v
              , x = T.x
              , S = T.y;
            e.beginPath(),
              e.arc(x, S, _, 0, Math.PI * 2, !0),
              e.stroke();
            for (var I = [[0, -1], [1, 0], [0, 1], [-1, 0]], m = _, w = n + 1, E = 0; E < 4; E++) {
              var A = I[E]
                , N = A[0]
                , L = A[1];
              e.moveTo(x + N * m, S + L * m),
                e.lineTo(x + N * w, S + L * w),
                e.stroke()
            }
          }
          if (o) {
            var R = y._transformCorners(this.getInternalBounds());
            e.beginPath();
            for (var E = 0; E < 8; E++)
              e[E ? "lineTo" : "moveTo"](R[E], R[++E]);
            e.closePath(),
              e.stroke();
            for (var E = 0; E < 8; E++)
              e.fillRect(R[E] - _, R[++E] - _, n, n)
          }
        }
      },
      _canComposite: function() {
        return !1
      }
    }, d.each(["down", "drag", "up", "move"], function(e) {
      this["removeOn" + d.capitalize(e)] = function() {
        var t = {};
        return t[e] = !0,
          this.removeOn(t)
      }
    }, {
      removeOn: function(e) {
        for (var t in e)
          if (e[t]) {
            var n = "mouse" + t
              , i = this._project
              , r = i._removeSets = i._removeSets || {};
            r[n] = r[n] || {},
              r[n][this._id] = this
          }
        return this
      }
    }), {
      tween: function(e, t, n) {
        n || (n = t,
          t = e,
          e = null,
        n || (n = t,
          t = null));
        var i = n && n.easing
          , r = n && n.start
          , s = n != null && (typeof n == "number" ? n : n.duration)
          , u = new Sn(this,e,t,s,i,r);
        function o(l) {
          u._handleFrame(l.time * 1e3),
          u.running || this.off("frame", o)
        }
        return s && this.on("frame", o),
          u
      },
      tweenTo: function(e, t) {
        return this.tween(null, e, t)
      },
      tweenFrom: function(e, t) {
        return this.tween(e, null, t)
      }
    })
    , We = oe.extend({
    _class: "Group",
    _selectBounds: !1,
    _selectChildren: !0,
    _serializeFields: {
      children: []
    },
    initialize: function(t) {
      this._children = [],
        this._namedChildren = {},
      this._initialize(t) || this.addChildren(Array.isArray(t) ? t : arguments)
    },
    _changed: function e(t) {
      e.base.call(this, t),
      t & 2050 && (this._clipItem = a)
    },
    _getClipItem: function() {
      var e = this._clipItem;
      if (e === a) {
        e = null;
        for (var t = this._children, n = 0, i = t.length; n < i; n++)
          if (t[n]._clipMask) {
            e = t[n];
            break
          }
        this._clipItem = e
      }
      return e
    },
    isClipped: function() {
      return !!this._getClipItem()
    },
    setClipped: function(e) {
      var t = this.getFirstChild();
      t && t.setClipMask(e)
    },
    _getBounds: function e(t, n) {
      var i = this._getClipItem();
      return i ? i._getCachedBounds(i._matrix.prepended(t), d.set({}, n, {
        stroke: !1
      })) : e.base.call(this, t, n)
    },
    _hitTestChildren: function e(t, n, i) {
      var r = this._getClipItem();
      return (!r || r.contains(t)) && e.base.call(this, t, n, i, r)
    },
    _draw: function(e, t) {
      var n = t.clip
        , i = !n && this._getClipItem();
      t = t.extend({
        clipItem: i,
        clip: !1
      }),
        n ? (e.beginPath(),
          t.dontStart = t.dontFinish = !0) : i && i.draw(e, t.extend({
          clip: !0
        }));
      for (var r = this._children, s = 0, u = r.length; s < u; s++) {
        var o = r[s];
        o !== i && o.draw(e, t)
      }
    }
  })
    , ct = We.extend({
    _class: "Layer",
    initialize: function() {
      We.apply(this, arguments)
    },
    _getOwner: function() {
      return this._parent || this._index != null && this._project
    },
    isInserted: function e() {
      return this._parent ? e.base.call(this) : this._index != null
    },
    activate: function() {
      this._project._activeLayer = this
    },
    _hitTestSelf: function() {}
  })
    , je = oe.extend({
      _class: "Shape",
      _applyMatrix: !1,
      _canApplyMatrix: !1,
      _canScaleStroke: !0,
      _serializeFields: {
        type: null,
        size: null,
        radius: null
      },
      initialize: function(t, n) {
        this._initialize(t, n)
      },
      _equals: function(e) {
        return this._type === e._type && this._size.equals(e._size) && d.equals(this._radius, e._radius)
      },
      copyContent: function(e) {
        this.setType(e._type),
          this.setSize(e._size),
          this.setRadius(e._radius)
      },
      getType: function() {
        return this._type
      },
      setType: function(e) {
        this._type = e
      },
      getShape: "#getType",
      setShape: "#setType",
      getSize: function() {
        var e = this._size;
        return new ne(e.width,e.height,this,"setSize")
      },
      setSize: function() {
        var e = J.read(arguments);
        if (!this._size)
          this._size = e.clone();
        else if (!this._size.equals(e)) {
          var t = this._type
            , n = e.width
            , i = e.height;
          t === "rectangle" ? this._radius.set(J.min(this._radius, e.divide(2).abs())) : t === "circle" ? (n = i = (n + i) / 2,
            this._radius = n / 2) : t === "ellipse" && this._radius._set(n / 2, i / 2),
            this._size._set(n, i),
            this._changed(9)
        }
      },
      getRadius: function() {
        var e = this._radius;
        return this._type === "circle" ? e : new ne(e.width,e.height,this,"setRadius")
      },
      setRadius: function(e) {
        var t = this._type;
        if (t === "circle") {
          if (e === this._radius)
            return;
          var n = e * 2;
          this._radius = e,
            this._size._set(n, n)
        } else if (e = J.read(arguments),
          !this._radius)
          this._radius = e.clone();
        else {
          if (this._radius.equals(e))
            return;
          if (this._radius.set(e),
          t === "rectangle") {
            var n = J.max(this._size, e.multiply(2));
            this._size.set(n)
          } else
            t === "ellipse" && this._size._set(e.width * 2, e.height * 2)
        }
        this._changed(9)
      },
      isEmpty: function() {
        return !1
      },
      toPath: function(e) {
        var t = new ke[d.capitalize(this._type)]({
          center: new C,
          size: this._size,
          radius: this._radius,
          insert: !1
        });
        return t.copyAttributes(this),
        ae.settings.applyMatrix && t.setApplyMatrix(!0),
        (e === a || e) && t.insertAbove(this),
          t
      },
      toShape: "#clone",
      _asPathItem: function() {
        return this.toPath(!1)
      },
      _draw: function(e, t, n, i) {
        var r = this._style
          , s = r.hasFill()
          , u = r.hasStroke()
          , o = t.dontFinish || t.clip
          , l = !i;
        if (s || u || o) {
          var f = this._type
            , g = this._radius
            , y = f === "circle";
          if (t.dontStart || e.beginPath(),
          l && y)
            e.arc(0, 0, g, 0, Math.PI * 2, !0);
          else {
            var _ = y ? g : g.width
              , v = y ? g : g.height
              , b = this._size
              , T = b.width
              , x = b.height;
            if (l && f === "rectangle" && _ === 0 && v === 0)
              e.rect(-T / 2, -x / 2, T, x);
            else {
              var S = T / 2
                , I = x / 2
                , m = 1 - .5522847498307936
                , w = _ * m
                , E = v * m
                , A = [-S, -I + v, -S, -I + E, -S + w, -I, -S + _, -I, S - _, -I, S - w, -I, S, -I + E, S, -I + v, S, I - v, S, I - E, S - w, I, S - _, I, -S + _, I, -S + w, I, -S, I - E, -S, I - v];
              i && i.transform(A, A, 32),
                e.moveTo(A[0], A[1]),
                e.bezierCurveTo(A[2], A[3], A[4], A[5], A[6], A[7]),
              S !== _ && e.lineTo(A[8], A[9]),
                e.bezierCurveTo(A[10], A[11], A[12], A[13], A[14], A[15]),
              I !== v && e.lineTo(A[16], A[17]),
                e.bezierCurveTo(A[18], A[19], A[20], A[21], A[22], A[23]),
              S !== _ && e.lineTo(A[24], A[25]),
                e.bezierCurveTo(A[26], A[27], A[28], A[29], A[30], A[31])
            }
          }
          e.closePath()
        }
        !o && (s || u) && (this._setStyles(e, t, n),
        s && (e.fill(r.getFillRule()),
          e.shadowColor = "rgba(0,0,0,0)"),
        u && e.stroke())
      },
      _canComposite: function() {
        return !(this.hasFill() && this.hasStroke())
      },
      _getBounds: function(e, t) {
        var n = new Y(this._size).setCenter(0, 0)
          , i = this._style
          , r = t.stroke && i.hasStroke() && i.getStrokeWidth();
        return e && (n = e._transformBounds(n)),
          r ? n.expand(ke._getStrokePadding(r, this._getStrokeMatrix(e, t))) : n
      }
    }, new function() {
      function e(n, i, r) {
        var s = n._radius;
        if (!s.isZero())
          for (var u = n._size.divide(2), o = 1; o <= 4; o++) {
            var l = new C(o > 1 && o < 4 ? -1 : 1,o > 2 ? -1 : 1)
              , f = l.multiply(u)
              , g = f.subtract(l.multiply(s))
              , y = new Y(r ? f.add(l.multiply(r)) : f,g);
            if (y.contains(i))
              return {
                point: g,
                quadrant: o
              }
          }
      }
      function t(n, i, r, s) {
        var u = n.divide(i);
        return (!s || u.isInQuadrant(s)) && u.subtract(u.normalize()).multiply(i).divide(r).length <= 1
      }
      return {
        _contains: function n(i) {
          if (this._type === "rectangle") {
            var r = e(this, i);
            return r ? i.subtract(r.point).divide(this._radius).getLength() <= 1 : n.base.call(this, i)
          } else
            return i.divide(this.size).getLength() <= .5
        },
        _hitTestSelf: function n(i, r, s, u) {
          var o = !1
            , l = this._style
            , f = r.stroke && l.hasStroke()
            , g = r.fill && l.hasFill();
          if (f || g) {
            var y = this._type
              , _ = this._radius
              , v = f ? l.getStrokeWidth() / 2 : 0
              , b = r._tolerancePadding.add(ke._getStrokePadding(v, !l.getStrokeScaling() && u));
            if (y === "rectangle") {
              var T = b.multiply(2)
                , x = e(this, i, T);
              if (x)
                o = t(i.subtract(x.point), _, b, x.quadrant);
              else {
                var S = new Y(this._size).setCenter(0, 0)
                  , I = S.expand(T)
                  , m = S.expand(T.negate());
                o = I._containsPoint(i) && !m._containsPoint(i)
              }
            } else
              o = t(i, _, b)
          }
          return o ? new qe(f ? "stroke" : "fill",this) : n.base.apply(this, arguments)
        }
      }
    }
    , {
      statics: new function() {
        function e(t, n, i, r, s) {
          var u = d.create(je.prototype);
          return u._type = t,
            u._size = i,
            u._radius = r,
            u._initialize(d.getNamed(s), n),
            u
        }
        return {
          Circle: function() {
            var t = arguments
              , n = C.readNamed(t, "center")
              , i = d.readNamed(t, "radius");
            return e("circle", n, new J(i * 2), i, t)
          },
          Rectangle: function() {
            var t = arguments
              , n = Y.readNamed(t, "rectangle")
              , i = J.min(J.readNamed(t, "radius"), n.getSize(!0).divide(2));
            return e("rectangle", n.getCenter(!0), n.getSize(!0), i, t)
          },
          Ellipse: function() {
            var t = arguments
              , n = je._readEllipse(t)
              , i = n.radius;
            return e("ellipse", n.center, i.multiply(2), i, t)
          },
          _readEllipse: function(t) {
            var n, i;
            if (d.hasNamed(t, "radius"))
              n = C.readNamed(t, "center"),
                i = J.readNamed(t, "radius");
            else {
              var r = Y.readNamed(t, "rectangle");
              n = r.getCenter(!0),
                i = r.getSize(!0).divide(2)
            }
            return {
              center: n,
              radius: i
            }
          }
        }
      }
    })
    , Pt = oe.extend({
    _class: "Raster",
    _applyMatrix: !1,
    _canApplyMatrix: !1,
    _boundsOptions: {
      stroke: !1,
      handle: !1
    },
    _serializeFields: {
      crossOrigin: null,
      source: null
    },
    _prioritize: ["crossOrigin"],
    _smoothing: "low",
    beans: !0,
    initialize: function(t, n) {
      if (!this._initialize(t, n !== a && C.read(arguments))) {
        var i, r = typeof t, s = r === "string" ? p.getElementById(t) : r === "object" ? t : null;
        if (s && s !== oe.NO_INSERT) {
          if (s.getContext || s.naturalHeight != null)
            i = s;
          else if (s) {
            var u = J.read(arguments);
            u.isZero() || (i = Je.getCanvas(u))
          }
        }
        i ? this.setImage(i) : this.setSource(t)
      }
      this._size || (this._size = new J,
        this._loaded = !1)
    },
    _equals: function(e) {
      return this.getSource() === e.getSource()
    },
    copyContent: function(e) {
      var t = e._image
        , n = e._canvas;
      if (t)
        this._setImage(t);
      else if (n) {
        var i = Je.getCanvas(e._size);
        i.getContext("2d").drawImage(n, 0, 0),
          this._setImage(i)
      }
      this._crossOrigin = e._crossOrigin
    },
    getSize: function() {
      var e = this._size;
      return new ne(e ? e.width : 0,e ? e.height : 0,this,"setSize")
    },
    setSize: function(e, t) {
      var n = J.read(arguments);
      if (n.equals(this._size))
        t && this.clear();
      else if (n.width > 0 && n.height > 0) {
        var i = !t && this.getElement();
        this._setImage(Je.getCanvas(n)),
        i && this.getContext(!0).drawImage(i, 0, 0, n.width, n.height)
      } else
        this._canvas && Je.release(this._canvas),
          this._size = n.clone()
    },
    getWidth: function() {
      return this._size ? this._size.width : 0
    },
    setWidth: function(e) {
      this.setSize(e, this.getHeight())
    },
    getHeight: function() {
      return this._size ? this._size.height : 0
    },
    setHeight: function(e) {
      this.setSize(this.getWidth(), e)
    },
    getLoaded: function() {
      return this._loaded
    },
    isEmpty: function() {
      var e = this._size;
      return !e || e.width === 0 && e.height === 0
    },
    getResolution: function() {
      var e = this._matrix
        , t = new C(0,0).transform(e)
        , n = new C(1,0).transform(e).subtract(t)
        , i = new C(0,1).transform(e).subtract(t);
      return new J(72 / n.getLength(),72 / i.getLength())
    },
    getPpi: "#getResolution",
    getImage: function() {
      return this._image
    },
    setImage: function(e) {
      var t = this;
      function n(i) {
        var r = t.getView()
          , s = i && i.type || "load";
        r && t.responds(s) && (ae = r._scope,
          t.emit(s, new Zt(i)))
      }
      this._setImage(e),
        this._loaded ? setTimeout(n, 0) : e && tt.add(e, {
          load: function(i) {
            t._setImage(e),
              n(i)
          },
          error: n
        })
    },
    _setImage: function(e) {
      this._canvas && Je.release(this._canvas),
        e && e.getContext ? (this._image = null,
          this._canvas = e,
          this._loaded = !0) : (this._image = e,
          this._canvas = null,
          this._loaded = !!(e && e.src && e.complete)),
        this._size = new J(e ? e.naturalWidth || e.width : 0,e ? e.naturalHeight || e.height : 0),
        this._context = null,
        this._changed(1033)
    },
    getCanvas: function() {
      if (!this._canvas) {
        var e = Je.getContext(this._size);
        try {
          this._image && e.drawImage(this._image, 0, 0),
            this._canvas = e.canvas
        } catch {
          Je.release(e)
        }
      }
      return this._canvas
    },
    setCanvas: "#setImage",
    getContext: function(e) {
      return this._context || (this._context = this.getCanvas().getContext("2d")),
      e && (this._image = null,
        this._changed(1025)),
        this._context
    },
    setContext: function(e) {
      this._context = e
    },
    getSource: function() {
      var e = this._image;
      return e && e.src || this.toDataURL()
    },
    setSource: function(e) {
      var t = new c.Image
        , n = this._crossOrigin;
      n && (t.crossOrigin = n),
      e && (t.src = e),
        this.setImage(t)
    },
    getCrossOrigin: function() {
      var e = this._image;
      return e && e.crossOrigin || this._crossOrigin || ""
    },
    setCrossOrigin: function(e) {
      this._crossOrigin = e;
      var t = this._image;
      t && (t.crossOrigin = e)
    },
    getSmoothing: function() {
      return this._smoothing
    },
    setSmoothing: function(e) {
      this._smoothing = typeof e == "string" ? e : e ? "low" : "off",
        this._changed(257)
    },
    getElement: function() {
      return this._canvas || this._loaded && this._image
    }
  }, {
    beans: !1,
    getSubCanvas: function() {
      var e = Y.read(arguments)
        , t = Je.getContext(e.getSize());
      return t.drawImage(this.getCanvas(), e.x, e.y, e.width, e.height, 0, 0, e.width, e.height),
        t.canvas
    },
    getSubRaster: function() {
      var e = Y.read(arguments)
        , t = new Pt(oe.NO_INSERT);
      return t._setImage(this.getSubCanvas(e)),
        t.translate(e.getCenter().subtract(this.getSize().divide(2))),
        t._matrix.prepend(this._matrix),
        t.insertAbove(this),
        t
    },
    toDataURL: function() {
      var e = this._image
        , t = e && e.src;
      if (/^data:/.test(t))
        return t;
      var n = this.getCanvas();
      return n ? n.toDataURL.apply(n, arguments) : null
    },
    drawImage: function(e) {
      var t = C.read(arguments, 1);
      this.getContext(!0).drawImage(e, t.x, t.y)
    },
    getAverageColor: function(e) {
      var t, n;
      if (e ? e instanceof Ft ? (n = e,
        t = e.getBounds()) : typeof e == "object" && ("width"in e ? t = new Y(e) : "x"in e && (t = new Y(e.x - .5,e.y - .5,1,1))) : t = this.getBounds(),
        !t)
        return null;
      var i = 32
        , r = Math.min(t.width, i)
        , s = Math.min(t.height, i)
        , u = Pt._sampleContext;
      u ? u.clearRect(0, 0, i + 1, i + 1) : u = Pt._sampleContext = Je.getContext(new J(i)),
        u.save();
      var o = new le().scale(r / t.width, s / t.height).translate(-t.x, -t.y);
      o.applyToContext(u),
      n && n.draw(u, new d({
        clip: !0,
        matrices: [o]
      })),
        this._matrix.applyToContext(u);
      var l = this.getElement()
        , f = this._size;
      l && u.drawImage(l, -f.width / 2, -f.height / 2),
        u.restore();
      for (var g = u.getImageData(.5, .5, Math.ceil(r), Math.ceil(s)).data, y = [0, 0, 0], _ = 0, v = 0, b = g.length; v < b; v += 4) {
        var T = g[v + 3];
        _ += T,
          T /= 255,
          y[0] += g[v] * T,
          y[1] += g[v + 1] * T,
          y[2] += g[v + 2] * T
      }
      for (var v = 0; v < 3; v++)
        y[v] /= _;
      return _ ? Xe.read(y) : null
    },
    getPixel: function() {
      var e = C.read(arguments)
        , t = this.getContext().getImageData(e.x, e.y, 1, 1).data;
      return new Xe("rgb",[t[0] / 255, t[1] / 255, t[2] / 255],t[3] / 255)
    },
    setPixel: function() {
      var e = arguments
        , t = C.read(e)
        , n = Xe.read(e)
        , i = n._convert("rgb")
        , r = n._alpha
        , s = this.getContext(!0)
        , u = s.createImageData(1, 1)
        , o = u.data;
      o[0] = i[0] * 255,
        o[1] = i[1] * 255,
        o[2] = i[2] * 255,
        o[3] = r != null ? r * 255 : 255,
        s.putImageData(u, t.x, t.y)
    },
    clear: function() {
      var e = this._size;
      this.getContext(!0).clearRect(0, 0, e.width + 1, e.height + 1)
    },
    createImageData: function() {
      var e = J.read(arguments);
      return this.getContext().createImageData(e.width, e.height)
    },
    getImageData: function() {
      var e = Y.read(arguments);
      return e.isEmpty() && (e = new Y(this._size)),
        this.getContext().getImageData(e.x, e.y, e.width, e.height)
    },
    putImageData: function(e) {
      var t = C.read(arguments, 1);
      this.getContext(!0).putImageData(e, t.x, t.y)
    },
    setImageData: function(e) {
      this.setSize(e),
        this.getContext(!0).putImageData(e, 0, 0)
    },
    _getBounds: function(e, t) {
      var n = new Y(this._size).setCenter(0, 0);
      return e ? e._transformBounds(n) : n
    },
    _hitTestSelf: function(e) {
      if (this._contains(e)) {
        var t = this;
        return new qe("pixel",t,{
          offset: e.add(t._size.divide(2)).round(),
          color: {
            get: function() {
              return t.getPixel(this.offset)
            }
          }
        })
      }
    },
    _draw: function(e, t, n) {
      var i = this.getElement();
      if (i && i.width > 0 && i.height > 0) {
        e.globalAlpha = O.clamp(this._opacity, 0, 1),
          this._setStyles(e, t, n);
        var r = this._smoothing
          , s = r === "off";
        Ce.setPrefixed(e, s ? "imageSmoothingEnabled" : "imageSmoothingQuality", s ? !1 : r),
          e.drawImage(i, -this._size.width / 2, -this._size.height / 2)
      }
    },
    _canComposite: function() {
      return !0
    }
  })
    , ft = oe.extend({
    _class: "SymbolItem",
    _applyMatrix: !1,
    _canApplyMatrix: !1,
    _boundsOptions: {
      stroke: !0
    },
    _serializeFields: {
      symbol: null
    },
    initialize: function(t, n) {
      this._initialize(t, n !== a && C.read(arguments, 1)) || this.setDefinition(t instanceof dt ? t : new dt(t))
    },
    _equals: function(e) {
      return this._definition === e._definition
    },
    copyContent: function(e) {
      this.setDefinition(e._definition)
    },
    getDefinition: function() {
      return this._definition
    },
    setDefinition: function(e) {
      this._definition = e,
        this._changed(9)
    },
    getSymbol: "#getDefinition",
    setSymbol: "#setDefinition",
    isEmpty: function() {
      return this._definition._item.isEmpty()
    },
    _getBounds: function(e, t) {
      var n = this._definition._item;
      return n._getCachedBounds(n._matrix.prepended(e), t)
    },
    _hitTestSelf: function(e, t, n) {
      var i = t.extend({
        all: !1
      })
        , r = this._definition._item._hitTest(e, i, n);
      return r && (r.item = this),
        r
    },
    _draw: function(e, t) {
      this._definition._item.draw(e, t)
    }
  })
    , dt = d.extend({
    _class: "SymbolDefinition",
    initialize: function(t, n) {
      this._id = B.get(),
        this.project = ae.project,
      t && this.setItem(t, n)
    },
    _serialize: function(e, t) {
      return t.add(this, function() {
        return d.serialize([this._class, this._item], e, !1, t)
      })
    },
    _changed: function(e) {
      e & 8 && oe._clearBoundsCache(this),
      e & 1 && this.project._changed(e)
    },
    getItem: function() {
      return this._item
    },
    setItem: function(e, t) {
      e._symbol && (e = e.clone()),
      this._item && (this._item._symbol = null),
        this._item = e,
        e.remove(),
        e.setSelected(!1),
      t || e.setPosition(new C),
        e._symbol = this,
        this._changed(9)
    },
    getDefinition: "#getItem",
    setDefinition: "#setItem",
    place: function(e) {
      return new ft(this,e)
    },
    clone: function() {
      return new dt(this._item.clone(!1))
    },
    equals: function(e) {
      return e === this || e && this._item.equals(e._item) || !1
    }
  })
    , qe = d.extend({
    _class: "HitResult",
    initialize: function(t, n, i) {
      this.type = t,
        this.item = n,
      i && this.inject(i)
    },
    statics: {
      getOptions: function(e) {
        var t = e && d.read(e);
        return new d({
          type: null,
          tolerance: ae.settings.hitTolerance,
          fill: !t,
          stroke: !t,
          segments: !t,
          handles: !1,
          ends: !1,
          position: !1,
          center: !1,
          bounds: !1,
          guides: !1,
          selected: !1
        },t)
      }
    }
  })
    , pe = d.extend({
    _class: "Segment",
    beans: !0,
    _selection: 0,
    initialize: function(t, n, i, r, s, u) {
      var o = arguments.length, l, f, g, y;
      o > 0 && (t == null || typeof t == "object" ? o === 1 && t && "point"in t ? (l = t.point,
        f = t.handleIn,
        g = t.handleOut,
        y = t.selection) : (l = t,
        f = n,
        g = i,
        y = r) : (l = [t, n],
        f = i !== a ? [i, r] : null,
        g = s !== a ? [s, u] : null)),
        new Vt(l,this,"_point"),
        new Vt(f,this,"_handleIn"),
        new Vt(g,this,"_handleOut"),
      y && this.setSelection(y)
    },
    _serialize: function(e, t) {
      var n = this._point
        , i = this._selection
        , r = i || this.hasHandles() ? [n, this._handleIn, this._handleOut] : n;
      return i && r.push(i),
        d.serialize(r, e, !0, t)
    },
    _changed: function(e) {
      var t = this._path;
      if (t) {
        var n = t._curves, i = this._index, r;
        n && ((!e || e === this._point || e === this._handleIn) && (r = i > 0 ? n[i - 1] : t._closed ? n[n.length - 1] : null) && r._changed(),
        (!e || e === this._point || e === this._handleOut) && (r = n[i]) && r._changed()),
          t._changed(41)
      }
    },
    getPoint: function() {
      return this._point
    },
    setPoint: function() {
      this._point.set(C.read(arguments))
    },
    getHandleIn: function() {
      return this._handleIn
    },
    setHandleIn: function() {
      this._handleIn.set(C.read(arguments))
    },
    getHandleOut: function() {
      return this._handleOut
    },
    setHandleOut: function() {
      this._handleOut.set(C.read(arguments))
    },
    hasHandles: function() {
      return !this._handleIn.isZero() || !this._handleOut.isZero()
    },
    isSmooth: function() {
      var e = this._handleIn
        , t = this._handleOut;
      return !e.isZero() && !t.isZero() && e.isCollinear(t)
    },
    clearHandles: function() {
      this._handleIn._set(0, 0),
        this._handleOut._set(0, 0)
    },
    getSelection: function() {
      return this._selection
    },
    setSelection: function(e) {
      var t = this._selection
        , n = this._path;
      this._selection = e = e || 0,
      n && e !== t && (n._updateSelection(this, t, e),
        n._changed(257))
    },
    _changeSelection: function(e, t) {
      var n = this._selection;
      this.setSelection(t ? n | e : n & ~e)
    },
    isSelected: function() {
      return !!(this._selection & 7)
    },
    setSelected: function(e) {
      this._changeSelection(7, e)
    },
    getIndex: function() {
      return this._index !== a ? this._index : null
    },
    getPath: function() {
      return this._path || null
    },
    getCurve: function() {
      var e = this._path
        , t = this._index;
      return e ? (t > 0 && !e._closed && t === e._segments.length - 1 && t--,
      e.getCurves()[t] || null) : null
    },
    getLocation: function() {
      var e = this.getCurve();
      return e ? new Ot(e,this === e._segment1 ? 0 : 1) : null
    },
    getNext: function() {
      var e = this._path && this._path._segments;
      return e && (e[this._index + 1] || this._path._closed && e[0]) || null
    },
    smooth: function(e, t, n) {
      var i = e || {}
        , r = i.type
        , s = i.factor
        , u = this.getPrevious()
        , o = this.getNext()
        , l = (u || this)._point
        , f = this._point
        , g = (o || this)._point
        , y = l.getDistance(f)
        , _ = f.getDistance(g);
      if (!r || r === "catmull-rom") {
        var v = s === a ? .5 : s
          , b = Math.pow(y, v)
          , T = b * b
          , x = Math.pow(_, v)
          , S = x * x;
        if (!t && u) {
          var I = 2 * S + 3 * x * b + T
            , m = 3 * x * (x + b);
          this.setHandleIn(m !== 0 ? new C((S * l._x + I * f._x - T * g._x) / m - f._x,(S * l._y + I * f._y - T * g._y) / m - f._y) : new C)
        }
        if (!n && o) {
          var I = 2 * T + 3 * b * x + S
            , m = 3 * b * (b + x);
          this.setHandleOut(m !== 0 ? new C((T * g._x + I * f._x - S * l._x) / m - f._x,(T * g._y + I * f._y - S * l._y) / m - f._y) : new C)
        }
      } else if (r === "geometric") {
        if (u && o) {
          var w = l.subtract(g)
            , E = s === a ? .4 : s
            , A = E * y / (y + _);
          t || this.setHandleIn(w.multiply(A)),
          n || this.setHandleOut(w.multiply(A - E))
        }
      } else
        throw new Error("Smoothing method '" + r + "' not supported.")
    },
    getPrevious: function() {
      var e = this._path && this._path._segments;
      return e && (e[this._index - 1] || this._path._closed && e[e.length - 1]) || null
    },
    isFirst: function() {
      return !this._index
    },
    isLast: function() {
      var e = this._path;
      return e && this._index === e._segments.length - 1 || !1
    },
    reverse: function() {
      var e = this._handleIn
        , t = this._handleOut
        , n = e.clone();
      e.set(t),
        t.set(n)
    },
    reversed: function() {
      return new pe(this._point,this._handleOut,this._handleIn)
    },
    remove: function() {
      return this._path ? !!this._path.removeSegment(this._index) : !1
    },
    clone: function() {
      return new pe(this._point,this._handleIn,this._handleOut)
    },
    equals: function(e) {
      return e === this || e && this._class === e._class && this._point.equals(e._point) && this._handleIn.equals(e._handleIn) && this._handleOut.equals(e._handleOut) || !1
    },
    toString: function() {
      var e = ["point: " + this._point];
      return this._handleIn.isZero() || e.push("handleIn: " + this._handleIn),
      this._handleOut.isZero() || e.push("handleOut: " + this._handleOut),
      "{ " + e.join(", ") + " }"
    },
    transform: function(e) {
      this._transformCoordinates(e, new Array(6), !0),
        this._changed()
    },
    interpolate: function(e, t, n) {
      var i = 1 - n
        , r = n
        , s = e._point
        , u = t._point
        , o = e._handleIn
        , l = t._handleIn
        , f = t._handleOut
        , g = e._handleOut;
      this._point._set(i * s._x + r * u._x, i * s._y + r * u._y, !0),
        this._handleIn._set(i * o._x + r * l._x, i * o._y + r * l._y, !0),
        this._handleOut._set(i * g._x + r * f._x, i * g._y + r * f._y, !0),
        this._changed()
    },
    _transformCoordinates: function(e, t, n) {
      var i = this._point
        , r = !n || !this._handleIn.isZero() ? this._handleIn : null
        , s = !n || !this._handleOut.isZero() ? this._handleOut : null
        , u = i._x
        , o = i._y
        , l = 2;
      return t[0] = u,
        t[1] = o,
      r && (t[l++] = r._x + u,
        t[l++] = r._y + o),
      s && (t[l++] = s._x + u,
        t[l++] = s._y + o),
      e && (e._transformCoordinates(t, t, l / 2),
        u = t[0],
        o = t[1],
        n ? (i._x = u,
          i._y = o,
          l = 2,
        r && (r._x = t[l++] - u,
          r._y = t[l++] - o),
        s && (s._x = t[l++] - u,
          s._y = t[l++] - o)) : (r || (t[l++] = u,
          t[l++] = o),
        s || (t[l++] = u,
          t[l++] = o))),
        t
    }
  })
    , Vt = C.extend({
    initialize: function(t, n, i) {
      var r, s, u;
      if (!t)
        r = s = 0;
      else if ((r = t[0]) !== a)
        s = t[1];
      else {
        var o = t;
        (r = o.x) === a && (o = C.read(arguments),
          r = o.x),
          s = o.y,
          u = o.selected
      }
      this._x = r,
        this._y = s,
        this._owner = n,
        n[i] = this,
      u && this.setSelected(!0)
    },
    _set: function(e, t) {
      return this._x = e,
        this._y = t,
        this._owner._changed(this),
        this
    },
    getX: function() {
      return this._x
    },
    setX: function(e) {
      this._x = e,
        this._owner._changed(this)
    },
    getY: function() {
      return this._y
    },
    setY: function(e) {
      this._y = e,
        this._owner._changed(this)
    },
    isZero: function() {
      var e = O.isZero;
      return e(this._x) && e(this._y)
    },
    isSelected: function() {
      return !!(this._owner._selection & this._getSelection())
    },
    setSelected: function(e) {
      this._owner._changeSelection(this._getSelection(), e)
    },
    _getSelection: function() {
      var e = this._owner;
      return this === e._point ? 1 : this === e._handleIn ? 2 : this === e._handleOut ? 4 : 0
    }
  })
    , re = d.extend({
      _class: "Curve",
      beans: !0,
      initialize: function(t, n, i, r, s, u, o, l) {
        var f = arguments.length, g, y, _, v, b, T;
        f === 3 ? (this._path = t,
          g = n,
          y = i) : f ? f === 1 ? "segment1"in t ? (g = new pe(t.segment1),
          y = new pe(t.segment2)) : "point1"in t ? (_ = t.point1,
          b = t.handle1,
          T = t.handle2,
          v = t.point2) : Array.isArray(t) && (_ = [t[0], t[1]],
          v = [t[6], t[7]],
          b = [t[2] - t[0], t[3] - t[1]],
          T = [t[4] - t[6], t[5] - t[7]]) : f === 2 ? (g = new pe(t),
          y = new pe(n)) : f === 4 ? (_ = t,
          b = n,
          T = i,
          v = r) : f === 8 && (_ = [t, n],
          v = [o, l],
          b = [i - t, r - n],
          T = [s - o, u - l]) : (g = new pe,
          y = new pe),
          this._segment1 = g || new pe(_,null,b),
          this._segment2 = y || new pe(v,T,null)
      },
      _serialize: function(e, t) {
        return d.serialize(this.hasHandles() ? [this.getPoint1(), this.getHandle1(), this.getHandle2(), this.getPoint2()] : [this.getPoint1(), this.getPoint2()], e, !0, t)
      },
      _changed: function() {
        this._length = this._bounds = a
      },
      clone: function() {
        return new re(this._segment1,this._segment2)
      },
      toString: function() {
        var e = ["point1: " + this._segment1._point];
        return this._segment1._handleOut.isZero() || e.push("handle1: " + this._segment1._handleOut),
        this._segment2._handleIn.isZero() || e.push("handle2: " + this._segment2._handleIn),
          e.push("point2: " + this._segment2._point),
        "{ " + e.join(", ") + " }"
      },
      classify: function() {
        return re.classify(this.getValues())
      },
      remove: function() {
        var e = !1;
        if (this._path) {
          var t = this._segment2
            , n = t._handleOut;
          e = t.remove(),
          e && this._segment1._handleOut.set(n)
        }
        return e
      },
      getPoint1: function() {
        return this._segment1._point
      },
      setPoint1: function() {
        this._segment1._point.set(C.read(arguments))
      },
      getPoint2: function() {
        return this._segment2._point
      },
      setPoint2: function() {
        this._segment2._point.set(C.read(arguments))
      },
      getHandle1: function() {
        return this._segment1._handleOut
      },
      setHandle1: function() {
        this._segment1._handleOut.set(C.read(arguments))
      },
      getHandle2: function() {
        return this._segment2._handleIn
      },
      setHandle2: function() {
        this._segment2._handleIn.set(C.read(arguments))
      },
      getSegment1: function() {
        return this._segment1
      },
      getSegment2: function() {
        return this._segment2
      },
      getPath: function() {
        return this._path
      },
      getIndex: function() {
        return this._segment1._index
      },
      getNext: function() {
        var e = this._path && this._path._curves;
        return e && (e[this._segment1._index + 1] || this._path._closed && e[0]) || null
      },
      getPrevious: function() {
        var e = this._path && this._path._curves;
        return e && (e[this._segment1._index - 1] || this._path._closed && e[e.length - 1]) || null
      },
      isFirst: function() {
        return !this._segment1._index
      },
      isLast: function() {
        var e = this._path;
        return e && this._segment1._index === e._curves.length - 1 || !1
      },
      isSelected: function() {
        return this.getPoint1().isSelected() && this.getHandle1().isSelected() && this.getHandle2().isSelected() && this.getPoint2().isSelected()
      },
      setSelected: function(e) {
        this.getPoint1().setSelected(e),
          this.getHandle1().setSelected(e),
          this.getHandle2().setSelected(e),
          this.getPoint2().setSelected(e)
      },
      getValues: function(e) {
        return re.getValues(this._segment1, this._segment2, e)
      },
      getPoints: function() {
        for (var e = this.getValues(), t = [], n = 0; n < 8; n += 2)
          t.push(new C(e[n],e[n + 1]));
        return t
      }
    }, {
      getLength: function() {
        return this._length == null && (this._length = re.getLength(this.getValues(), 0, 1)),
          this._length
      },
      getArea: function() {
        return re.getArea(this.getValues())
      },
      getLine: function() {
        return new Se(this._segment1._point,this._segment2._point)
      },
      getPart: function(e, t) {
        return new re(re.getPart(this.getValues(), e, t))
      },
      getPartLength: function(e, t) {
        return re.getLength(this.getValues(), e, t)
      },
      divideAt: function(e) {
        return this.divideAtTime(e && e.curve === this ? e.time : this.getTimeAt(e))
      },
      divideAtTime: function(e, t) {
        var n = 1e-8
          , i = 1 - n
          , r = null;
        if (e >= n && e <= i) {
          var s = re.subdivide(this.getValues(), e)
            , u = s[0]
            , o = s[1]
            , l = t || this.hasHandles()
            , f = this._segment1
            , g = this._segment2
            , y = this._path;
          l && (f._handleOut._set(u[2] - u[0], u[3] - u[1]),
            g._handleIn._set(o[4] - o[6], o[5] - o[7]));
          var _ = u[6]
            , v = u[7]
            , b = new pe(new C(_,v),l && new C(u[4] - _,u[5] - v),l && new C(o[2] - _,o[3] - v));
          y ? (y.insert(f._index + 1, b),
            r = this.getNext()) : (this._segment2 = b,
            this._changed(),
            r = new re(b,g))
        }
        return r
      },
      splitAt: function(e) {
        var t = this._path;
        return t ? t.splitAt(e) : null
      },
      splitAtTime: function(e) {
        return this.splitAt(this.getLocationAtTime(e))
      },
      divide: function(e, t) {
        return this.divideAtTime(e === a ? .5 : t ? e : this.getTimeAt(e))
      },
      split: function(e, t) {
        return this.splitAtTime(e === a ? .5 : t ? e : this.getTimeAt(e))
      },
      reversed: function() {
        return new re(this._segment2.reversed(),this._segment1.reversed())
      },
      clearHandles: function() {
        this._segment1._handleOut._set(0, 0),
          this._segment2._handleIn._set(0, 0)
      },
      statics: {
        getValues: function(e, t, n, i) {
          var r = e._point
            , s = e._handleOut
            , u = t._handleIn
            , o = t._point
            , l = r.x
            , f = r.y
            , g = o.x
            , y = o.y
            , _ = i ? [l, f, l, f, g, y, g, y] : [l, f, l + s._x, f + s._y, g + u._x, y + u._y, g, y];
          return n && n._transformCoordinates(_, _, 4),
            _
        },
        subdivide: function(e, t) {
          var n = e[0]
            , i = e[1]
            , r = e[2]
            , s = e[3]
            , u = e[4]
            , o = e[5]
            , l = e[6]
            , f = e[7];
          t === a && (t = .5);
          var g = 1 - t
            , y = g * n + t * r
            , _ = g * i + t * s
            , v = g * r + t * u
            , b = g * s + t * o
            , T = g * u + t * l
            , x = g * o + t * f
            , S = g * y + t * v
            , I = g * _ + t * b
            , m = g * v + t * T
            , w = g * b + t * x
            , E = g * S + t * m
            , A = g * I + t * w;
          return [[n, i, y, _, S, I, E, A], [E, A, m, w, T, x, l, f]]
        },
        getMonoCurves: function(e, t) {
          var n = []
            , i = t ? 0 : 1
            , r = e[i + 0]
            , s = e[i + 2]
            , u = e[i + 4]
            , o = e[i + 6];
          if (r >= s == s >= u && s >= u == u >= o || re.isStraight(e))
            n.push(e);
          else {
            var l = 3 * (s - u) - r + o
              , f = 2 * (r + u) - 4 * s
              , g = s - r
              , y = 1e-8
              , _ = 1 - y
              , v = []
              , b = O.solveQuadratic(l, f, g, v, y, _);
            if (!b)
              n.push(e);
            else {
              v.sort();
              var T = v[0]
                , x = re.subdivide(e, T);
              n.push(x[0]),
              b > 1 && (T = (v[1] - T) / (1 - T),
                x = re.subdivide(x[1], T),
                n.push(x[0])),
                n.push(x[1])
            }
          }
          return n
        },
        solveCubic: function(e, t, n, i, r, s) {
          var u = e[t]
            , o = e[t + 2]
            , l = e[t + 4]
            , f = e[t + 6]
            , g = 0;
          if (!(u < n && f < n && o < n && l < n || u > n && f > n && o > n && l > n)) {
            var y = 3 * (o - u)
              , _ = 3 * (l - o) - y
              , v = f - u - y - _;
            g = O.solveCubic(v, _, y, u - n, i, r, s)
          }
          return g
        },
        getTimeOf: function(e, t) {
          var n = new C(e[0],e[1])
            , i = new C(e[6],e[7])
            , r = 1e-12
            , s = 1e-7
            , u = t.isClose(n, r) ? 0 : t.isClose(i, r) ? 1 : null;
          if (u === null)
            for (var o = [t.x, t.y], l = [], f = 0; f < 2; f++)
              for (var g = re.solveCubic(e, f, o[f], l, 0, 1), y = 0; y < g; y++) {
                var _ = l[y];
                if (t.isClose(re.getPoint(e, _), s))
                  return _
              }
          return t.isClose(n, s) ? 0 : t.isClose(i, s) ? 1 : null
        },
        getNearestTime: function(e, t) {
          if (re.isStraight(e)) {
            var n = e[0]
              , i = e[1]
              , r = e[6]
              , s = e[7]
              , u = r - n
              , o = s - i
              , l = u * u + o * o;
            if (l === 0)
              return 0;
            var f = ((t.x - n) * u + (t.y - i) * o) / l;
            return f < 1e-12 ? 0 : f > .999999999999 ? 1 : re.getTimeOf(e, new C(n + f * u,i + f * o))
          }
          var g = 100
            , y = 1 / 0
            , _ = 0;
          function v(x) {
            if (x >= 0 && x <= 1) {
              var S = t.getDistance(re.getPoint(e, x), !0);
              if (S < y)
                return y = S,
                  _ = x,
                  !0
            }
          }
          for (var b = 0; b <= g; b++)
            v(b / g);
          for (var T = 1 / (g * 2); T > 1e-8; )
            !v(_ - T) && !v(_ + T) && (T /= 2);
          return _
        },
        getPart: function(e, t, n) {
          var i = t > n;
          if (i) {
            var r = t;
            t = n,
              n = r
          }
          return t > 0 && (e = re.subdivide(e, t)[1]),
          n < 1 && (e = re.subdivide(e, (n - t) / (1 - t))[0]),
            i ? [e[6], e[7], e[4], e[5], e[2], e[3], e[0], e[1]] : e
        },
        isFlatEnough: function(e, t) {
          var n = e[0]
            , i = e[1]
            , r = e[2]
            , s = e[3]
            , u = e[4]
            , o = e[5]
            , l = e[6]
            , f = e[7]
            , g = 3 * r - 2 * n - l
            , y = 3 * s - 2 * i - f
            , _ = 3 * u - 2 * l - n
            , v = 3 * o - 2 * f - i;
          return Math.max(g * g, _ * _) + Math.max(y * y, v * v) <= 16 * t * t
        },
        getArea: function(e) {
          var t = e[0]
            , n = e[1]
            , i = e[2]
            , r = e[3]
            , s = e[4]
            , u = e[5]
            , o = e[6]
            , l = e[7];
          return 3 * ((l - n) * (i + s) - (o - t) * (r + u) + r * (t - s) - i * (n - u) + l * (s + t / 3) - o * (u + n / 3)) / 20
        },
        getBounds: function(e) {
          for (var t = e.slice(0, 2), n = t.slice(), i = [0, 0], r = 0; r < 2; r++)
            re._addBounds(e[r], e[r + 2], e[r + 4], e[r + 6], r, 0, t, n, i);
          return new Y(t[0],t[1],n[0] - t[0],n[1] - t[1])
        },
        _addBounds: function(e, t, n, i, r, s, u, o, l) {
          function f(E, A) {
            var N = E - A
              , L = E + A;
            N < u[r] && (u[r] = N),
            L > o[r] && (o[r] = L)
          }
          s /= 2;
          var g = u[r] + s
            , y = o[r] - s;
          if (e < g || t < g || n < g || i < g || e > y || t > y || n > y || i > y)
            if (t < e != t < i && n < e != n < i)
              f(e, 0),
                f(i, 0);
            else {
              var _ = 3 * (t - n) - e + i
                , v = 2 * (e + n) - 4 * t
                , b = t - e
                , T = O.solveQuadratic(_, v, b, l)
                , x = 1e-8
                , S = 1 - x;
              f(i, 0);
              for (var I = 0; I < T; I++) {
                var m = l[I]
                  , w = 1 - m;
                x <= m && m <= S && f(w * w * w * e + 3 * w * w * m * t + 3 * w * m * m * n + m * m * m * i, s)
              }
            }
        }
      }
    }, d.each(["getBounds", "getStrokeBounds", "getHandleBounds"], function(e) {
      this[e] = function() {
        this._bounds || (this._bounds = {});
        var t = this._bounds[e];
        return t || (t = this._bounds[e] = ke[e]([this._segment1, this._segment2], !1, this._path)),
          t.clone()
      }
    }, {}), d.each({
      isStraight: function(e, t, n, i) {
        if (t.isZero() && n.isZero())
          return !0;
        var r = i.subtract(e);
        if (r.isZero())
          return !1;
        if (r.isCollinear(t) && r.isCollinear(n)) {
          var s = new Se(e,i)
            , u = 1e-7;
          if (s.getDistance(e.add(t)) < u && s.getDistance(i.add(n)) < u) {
            var o = r.dot(r)
              , l = r.dot(t) / o
              , f = r.dot(n) / o;
            return l >= 0 && l <= 1 && f <= 0 && f >= -1
          }
        }
        return !1
      },
      isLinear: function(e, t, n, i) {
        var r = i.subtract(e).divide(3);
        return t.equals(r) && n.negate().equals(r)
      }
    }, function(e, t) {
      this[t] = function(n) {
        var i = this._segment1
          , r = this._segment2;
        return e(i._point, i._handleOut, r._handleIn, r._point, n)
      }
        ,
        this.statics[t] = function(n, i) {
          var r = n[0]
            , s = n[1]
            , u = n[6]
            , o = n[7];
          return e(new C(r,s), new C(n[2] - r,n[3] - s), new C(n[4] - u,n[5] - o), new C(u,o), i)
        }
    }, {
      statics: {},
      hasHandles: function() {
        return !this._segment1._handleOut.isZero() || !this._segment2._handleIn.isZero()
      },
      hasLength: function(e) {
        return (!this.getPoint1().equals(this.getPoint2()) || this.hasHandles()) && this.getLength() > (e || 0)
      },
      isCollinear: function(e) {
        return e && this.isStraight() && e.isStraight() && this.getLine().isCollinear(e.getLine())
      },
      isHorizontal: function() {
        return this.isStraight() && Math.abs(this.getTangentAtTime(.5).y) < 1e-8
      },
      isVertical: function() {
        return this.isStraight() && Math.abs(this.getTangentAtTime(.5).x) < 1e-8
      }
    }), {
      beans: !1,
      getLocationAt: function(e, t) {
        return this.getLocationAtTime(t ? e : this.getTimeAt(e))
      },
      getLocationAtTime: function(e) {
        return e != null && e >= 0 && e <= 1 ? new Ot(this,e) : null
      },
      getTimeAt: function(e, t) {
        return re.getTimeAt(this.getValues(), e, t)
      },
      getParameterAt: "#getTimeAt",
      getTimesWithTangent: function() {
        var e = C.read(arguments);
        return e.isZero() ? [] : re.getTimesWithTangent(this.getValues(), e)
      },
      getOffsetAtTime: function(e) {
        return this.getPartLength(0, e)
      },
      getLocationOf: function() {
        return this.getLocationAtTime(this.getTimeOf(C.read(arguments)))
      },
      getOffsetOf: function() {
        var e = this.getLocationOf.apply(this, arguments);
        return e ? e.getOffset() : null
      },
      getTimeOf: function() {
        return re.getTimeOf(this.getValues(), C.read(arguments))
      },
      getParameterOf: "#getTimeOf",
      getNearestLocation: function() {
        var e = C.read(arguments)
          , t = this.getValues()
          , n = re.getNearestTime(t, e)
          , i = re.getPoint(t, n);
        return new Ot(this,n,i,null,e.getDistance(i))
      },
      getNearestPoint: function() {
        var e = this.getNearestLocation.apply(this, arguments);
        return e && e.getPoint()
      }
    }, new function() {
      var e = ["getPoint", "getTangent", "getNormal", "getWeightedTangent", "getWeightedNormal", "getCurvature"];
      return d.each(e, function(t) {
        this[t + "At"] = function(n, i) {
          var r = this.getValues();
          return re[t](r, i ? n : re.getTimeAt(r, n))
        }
          ,
          this[t + "AtTime"] = function(n) {
            return re[t](this.getValues(), n)
          }
      }, {
        statics: {
          _evaluateMethods: e
        }
      })
    }
    , new function() {
      function e(i) {
        var r = i[0]
          , s = i[1]
          , u = i[2]
          , o = i[3]
          , l = i[4]
          , f = i[5]
          , g = i[6]
          , y = i[7]
          , _ = 9 * (u - l) + 3 * (g - r)
          , v = 6 * (r + l) - 12 * u
          , b = 3 * (u - r)
          , T = 9 * (o - f) + 3 * (y - s)
          , x = 6 * (s + f) - 12 * o
          , S = 3 * (o - s);
        return function(I) {
          var m = (_ * I + v) * I + b
            , w = (T * I + x) * I + S;
          return Math.sqrt(m * m + w * w)
        }
      }
      function t(i, r) {
        return Math.max(2, Math.min(16, Math.ceil(Math.abs(r - i) * 32)))
      }
      function n(i, r, s, u) {
        if (r == null || r < 0 || r > 1)
          return null;
        var o = i[0]
          , l = i[1]
          , f = i[2]
          , g = i[3]
          , y = i[4]
          , _ = i[5]
          , v = i[6]
          , b = i[7]
          , T = O.isZero;
        T(f - o) && T(g - l) && (f = o,
          g = l),
        T(y - v) && T(_ - b) && (y = v,
          _ = b);
        var x = 3 * (f - o), S = 3 * (y - f) - x, I = v - o - x - S, m = 3 * (g - l), w = 3 * (_ - g) - m, E = b - l - m - w, A, N;
        if (s === 0)
          A = r === 0 ? o : r === 1 ? v : ((I * r + S) * r + x) * r + o,
            N = r === 0 ? l : r === 1 ? b : ((E * r + w) * r + m) * r + l;
        else {
          var L = 1e-8
            , R = 1 - L;
          if (r < L ? (A = x,
            N = m) : r > R ? (A = 3 * (v - y),
            N = 3 * (b - _)) : (A = (3 * I * r + 2 * S) * r + x,
            N = (3 * E * r + 2 * w) * r + m),
            u) {
            A === 0 && N === 0 && (r < L || r > R) && (A = y - f,
              N = _ - g);
            var D = Math.sqrt(A * A + N * N);
            D && (A /= D,
              N /= D)
          }
          if (s === 3) {
            var y = 6 * I * r + 2 * S
              , _ = 6 * E * r + 2 * w
              , V = Math.pow(A * A + N * N, 3 / 2);
            A = V !== 0 ? (A * _ - N * y) / V : 0,
              N = 0
          }
        }
        return s === 2 ? new C(N,-A) : new C(A,N)
      }
      return {
        statics: {
          classify: function(i) {
            var r = i[0]
              , s = i[1]
              , u = i[2]
              , o = i[3]
              , l = i[4]
              , f = i[5]
              , g = i[6]
              , y = i[7]
              , _ = r * (y - f) + s * (l - g) + g * f - y * l
              , v = u * (s - y) + o * (g - r) + r * y - s * g
              , b = l * (o - s) + f * (r - u) + u * s - o * r
              , T = 3 * b
              , x = T - v
              , S = x - v + _
              , I = Math.sqrt(S * S + x * x + T * T)
              , m = I !== 0 ? 1 / I : 0
              , w = O.isZero
              , E = "serpentine";
            S *= m,
              x *= m,
              T *= m;
            function A(D, V, z) {
              var G = V !== a
                , H = G && V > 0 && V < 1
                , K = G && z > 0 && z < 1;
              return G && (!(H || K) || D === "loop" && !(H && K)) && (D = "arch",
                H = K = !1),
                {
                  type: D,
                  roots: H || K ? H && K ? V < z ? [V, z] : [z, V] : [H ? V : z] : null
                }
            }
            if (w(S))
              return w(x) ? A(w(T) ? "line" : "quadratic") : A(E, T / (3 * x));
            var N = 3 * x * x - 4 * S * T;
            if (w(N))
              return A("cusp", x / (2 * S));
            var L = N > 0 ? Math.sqrt(N / 3) : Math.sqrt(-N)
              , R = 2 * S;
            return A(N > 0 ? E : "loop", (x + L) / R, (x - L) / R)
          },
          getLength: function(i, r, s, u) {
            if (r === a && (r = 0),
            s === a && (s = 1),
              re.isStraight(i)) {
              var o = i;
              s < 1 && (o = re.subdivide(o, s)[0],
                r /= s),
              r > 0 && (o = re.subdivide(o, r)[1]);
              var l = o[6] - o[0]
                , f = o[7] - o[1];
              return Math.sqrt(l * l + f * f)
            }
            return O.integrate(u || e(i), r, s, t(r, s))
          },
          getTimeAt: function(i, r, s) {
            if (s === a && (s = r < 0 ? 1 : 0),
            r === 0)
              return s;
            var u = Math.abs
              , o = 1e-12
              , l = r > 0
              , f = l ? s : 0
              , g = l ? 1 : s
              , y = e(i)
              , _ = re.getLength(i, f, g, y)
              , v = u(r) - _;
            if (u(v) < o)
              return l ? g : f;
            if (v > o)
              return null;
            var b = r / _
              , T = 0;
            function x(S) {
              return T += O.integrate(y, s, S, t(s, S)),
                s = S,
              T - r
            }
            return O.findRoot(x, y, s + b, f, g, 32, 1e-12)
          },
          getPoint: function(i, r) {
            return n(i, r, 0, !1)
          },
          getTangent: function(i, r) {
            return n(i, r, 1, !0)
          },
          getWeightedTangent: function(i, r) {
            return n(i, r, 1, !1)
          },
          getNormal: function(i, r) {
            return n(i, r, 2, !0)
          },
          getWeightedNormal: function(i, r) {
            return n(i, r, 2, !1)
          },
          getCurvature: function(i, r) {
            return n(i, r, 3, !1).x
          },
          getPeaks: function(i) {
            var r = i[0]
              , s = i[1]
              , u = i[2]
              , o = i[3]
              , l = i[4]
              , f = i[5]
              , g = i[6]
              , y = i[7]
              , _ = -r + 3 * u - 3 * l + g
              , v = 3 * r - 6 * u + 3 * l
              , b = -3 * r + 3 * u
              , T = -s + 3 * o - 3 * f + y
              , x = 3 * s - 6 * o + 3 * f
              , S = -3 * s + 3 * o
              , I = 1e-8
              , m = 1 - I
              , w = [];
            return O.solveCubic(9 * (_ * _ + T * T), 9 * (_ * v + x * T), 2 * (v * v + x * x) + 3 * (b * _ + S * T), b * v + x * S, w, I, m),
              w.sort()
          }
        }
      }
    }
    , new function() {
      function e(v, b, T, x, S, I, m) {
        var w = !m && T.getPrevious() === S
          , E = !m && T !== S && T.getNext() === S
          , A = 1e-8
          , N = 1 - A;
        if (x !== null && x >= (w ? A : 0) && x <= (E ? N : 1) && I !== null && I >= (E ? A : 0) && I <= (w ? N : 1)) {
          var L = new Ot(T,x,null,m)
            , R = new Ot(S,I,null,m);
          L._intersection = R,
            R._intersection = L,
          (!b || b(L)) && Ot.insert(v, L, !0)
        }
      }
      function t(v, b, T, x, S, I, m, w, E, A, N, L, R) {
        if (++E >= 4096 || ++w >= 40)
          return E;
        var D = 1e-9, V = b[0], z = b[1], G = b[6], H = b[7], K = Se.getSignedDistance, $ = K(V, z, G, H, b[2], b[3]), W = K(V, z, G, H, b[4], b[5]), te = $ * W > 0 ? 3 / 4 : 4 / 9, se = te * Math.min(0, $, W), ue = te * Math.max(0, $, W), Ie = K(V, z, G, H, v[0], v[1]), Ee = K(V, z, G, H, v[2], v[3]), de = K(V, z, G, H, v[4], v[5]), ve = K(V, z, G, H, v[6], v[7]), Oe = n(Ie, Ee, de, ve), Te = Oe[0], Ge = Oe[1], Re, xe;
        if ($ === 0 && W === 0 && Ie === 0 && Ee === 0 && de === 0 && ve === 0 || (Re = i(Te, Ge, se, ue)) == null || (xe = i(Te.reverse(), Ge.reverse(), se, ue)) == null)
          return E;
        var ze = A + (N - A) * Re
          , De = A + (N - A) * xe;
        if (Math.max(R - L, De - ze) < D) {
          var _t = (ze + De) / 2
            , gt = (L + R) / 2;
          e(S, I, m ? x : T, m ? gt : _t, m ? T : x, m ? _t : gt)
        } else {
          v = re.getPart(v, Re, xe);
          var Et = R - L;
          if (xe - Re > .8)
            if (De - ze > Et) {
              var nt = re.subdivide(v, .5)
                , _t = (ze + De) / 2;
              E = t(b, nt[0], x, T, S, I, !m, w, E, L, R, ze, _t),
                E = t(b, nt[1], x, T, S, I, !m, w, E, L, R, _t, De)
            } else {
              var nt = re.subdivide(b, .5)
                , gt = (L + R) / 2;
              E = t(nt[0], v, x, T, S, I, !m, w, E, L, gt, ze, De),
                E = t(nt[1], v, x, T, S, I, !m, w, E, gt, R, ze, De)
            }
          else
            Et === 0 || Et >= D ? E = t(b, v, x, T, S, I, !m, w, E, L, R, ze, De) : E = t(v, b, T, x, S, I, m, w, E, ze, De, L, R)
        }
        return E
      }
      function n(v, b, T, x) {
        var S = [0, v], I = [1 / 3, b], m = [2 / 3, T], w = [1, x], E = b - (2 * v + x) / 3, A = T - (v + 2 * x) / 3, N;
        if (E * A < 0)
          N = [[S, I, w], [S, m, w]];
        else {
          var L = E / A;
          N = [L >= 2 ? [S, I, w] : L <= .5 ? [S, m, w] : [S, I, m, w], [S, w]]
        }
        return (E || A) < 0 ? N.reverse() : N
      }
      function i(v, b, T, x) {
        return v[0][1] < T ? r(v, !0, T) : b[0][1] > x ? r(b, !1, x) : v[0][0]
      }
      function r(v, b, T) {
        for (var x = v[0][0], S = v[0][1], I = 1, m = v.length; I < m; I++) {
          var w = v[I][0]
            , E = v[I][1];
          if (b ? E >= T : E <= T)
            return E === T ? w : x + (T - S) * (w - x) / (E - S);
          x = w,
            S = E
        }
        return null
      }
      function s(v, b, T, x, S) {
        var I = O.isZero;
        if (I(x) && I(S)) {
          var m = re.getTimeOf(v, new C(b,T));
          return m === null ? [] : [m]
        }
        for (var w = Math.atan2(-S, x), E = Math.sin(w), A = Math.cos(w), N = [], L = [], R = 0; R < 8; R += 2) {
          var D = v[R] - b
            , V = v[R + 1] - T;
          N.push(D * A - V * E, D * E + V * A)
        }
        return re.solveCubic(N, 1, 0, L, 0, 1),
          L
      }
      function u(v, b, T, x, S, I, m) {
        for (var w = b[0], E = b[1], A = b[6], N = b[7], L = s(v, w, E, A - w, N - E), R = 0, D = L.length; R < D; R++) {
          var V = L[R]
            , z = re.getPoint(v, V)
            , G = re.getTimeOf(b, z);
          G !== null && e(S, I, m ? x : T, m ? G : V, m ? T : x, m ? V : G)
        }
      }
      function o(v, b, T, x, S, I) {
        var m = Se.intersect(v[0], v[1], v[6], v[7], b[0], b[1], b[6], b[7]);
        m && e(S, I, T, re.getTimeOf(v, m), x, re.getTimeOf(b, m))
      }
      function l(v, b, T, x, S, I) {
        var m = 1e-12
          , w = Math.min
          , E = Math.max;
        if (E(v[0], v[2], v[4], v[6]) + m > w(b[0], b[2], b[4], b[6]) && w(v[0], v[2], v[4], v[6]) - m < E(b[0], b[2], b[4], b[6]) && E(v[1], v[3], v[5], v[7]) + m > w(b[1], b[3], b[5], b[7]) && w(v[1], v[3], v[5], v[7]) - m < E(b[1], b[3], b[5], b[7])) {
          var A = y(v, b);
          if (A)
            for (var N = 0; N < 2; N++) {
              var L = A[N];
              e(S, I, T, L[0], x, L[1], !0)
            }
          else {
            var R = re.isStraight(v)
              , D = re.isStraight(b)
              , V = R && D
              , z = R && !D
              , G = S.length;
            if ((V ? o : R || D ? u : t)(z ? b : v, z ? v : b, z ? x : T, z ? T : x, S, I, z, 0, 0, 0, 1, 0, 1),
            !V || S.length === G)
              for (var N = 0; N < 4; N++) {
                var H = N >> 1
                  , K = N & 1
                  , $ = H * 6
                  , W = K * 6
                  , te = new C(v[$],v[$ + 1])
                  , se = new C(b[W],b[W + 1]);
                te.isClose(se, m) && e(S, I, T, H, x, K)
              }
          }
        }
        return S
      }
      function f(v, b, T, x) {
        var S = re.classify(v);
        if (S.type === "loop") {
          var I = S.roots;
          e(T, x, b, I[0], b, I[1])
        }
        return T
      }
      function g(v, b, T, x, S, I) {
        var m = 1e-7
          , w = !b;
        w && (b = v);
        for (var E = v.length, A = b.length, N = new Array(E), L = w ? N : new Array(A), R = [], D = 0; D < E; D++)
          N[D] = v[D].getValues(x);
        if (!w)
          for (var D = 0; D < A; D++)
            L[D] = b[D].getValues(S);
        for (var V = q.findCurveBoundsCollisions(N, L, m), z = 0; z < E; z++) {
          var G = v[z]
            , H = N[z];
          w && f(H, G, R, T);
          var K = V[z];
          if (K)
            for (var $ = 0; $ < K.length; $++) {
              if (I && R.length)
                return R;
              var W = K[$];
              if (!w || W > z) {
                var te = b[W]
                  , se = L[W];
                l(H, se, G, te, R, T)
              }
            }
        }
        return R
      }
      function y(v, b) {
        function T(ve) {
          var Oe = ve[6] - ve[0]
            , Te = ve[7] - ve[1];
          return Oe * Oe + Te * Te
        }
        var x = Math.abs
          , S = Se.getDistance
          , I = 1e-8
          , m = 1e-7
          , w = re.isStraight(v)
          , E = re.isStraight(b)
          , A = w && E
          , N = T(v) < T(b)
          , L = N ? b : v
          , R = N ? v : b
          , D = L[0]
          , V = L[1]
          , z = L[6] - D
          , G = L[7] - V;
        if (S(D, V, z, G, R[0], R[1], !0) < m && S(D, V, z, G, R[6], R[7], !0) < m)
          !A && S(D, V, z, G, L[2], L[3], !0) < m && S(D, V, z, G, L[4], L[5], !0) < m && S(D, V, z, G, R[2], R[3], !0) < m && S(D, V, z, G, R[4], R[5], !0) < m && (w = E = A = !0);
        else if (A)
          return null;
        if (w ^ E)
          return null;
        for (var H = [v, b], K = [], $ = 0; $ < 4 && K.length < 2; $++) {
          var W = $ & 1
            , te = W ^ 1
            , se = $ >> 1
            , ue = re.getTimeOf(H[W], new C(H[te][se ? 6 : 0],H[te][se ? 7 : 1]));
          if (ue != null) {
            var Ie = W ? [se, ue] : [ue, se];
            (!K.length || x(Ie[0] - K[0][0]) > I && x(Ie[1] - K[0][1]) > I) && K.push(Ie)
          }
          if ($ > 2 && !K.length)
            break
        }
        if (K.length !== 2)
          K = null;
        else if (!A) {
          var Ee = re.getPart(v, K[0][0], K[1][0])
            , de = re.getPart(b, K[0][1], K[1][1]);
          (x(de[2] - Ee[2]) > m || x(de[3] - Ee[3]) > m || x(de[4] - Ee[4]) > m || x(de[5] - Ee[5]) > m) && (K = null)
        }
        return K
      }
      function _(v, b) {
        var T = v[0]
          , x = v[1]
          , S = v[2]
          , I = v[3]
          , m = v[4]
          , w = v[5]
          , E = v[6]
          , A = v[7]
          , N = b.normalize()
          , L = N.x
          , R = N.y
          , D = 3 * E - 9 * m + 9 * S - 3 * T
          , V = 3 * A - 9 * w + 9 * I - 3 * x
          , z = 6 * m - 12 * S + 6 * T
          , G = 6 * w - 12 * I + 6 * x
          , H = 3 * S - 3 * T
          , K = 3 * I - 3 * x
          , $ = 2 * D * R - 2 * V * L
          , W = [];
        if (Math.abs($) < O.CURVETIME_EPSILON) {
          var te = D * K - V * H
            , $ = D * G - V * z;
          if ($ != 0) {
            var se = -te / $;
            se >= 0 && se <= 1 && W.push(se)
          }
        } else {
          var ue = (z * z - 4 * D * H) * R * R + (-2 * z * G + 4 * V * H + 4 * D * K) * L * R + (G * G - 4 * V * K) * L * L
            , Ie = z * R - G * L;
          if (ue >= 0 && $ != 0) {
            var Ee = Math.sqrt(ue)
              , de = -(Ie + Ee) / $
              , ve = (-Ie + Ee) / $;
            de >= 0 && de <= 1 && W.push(de),
            ve >= 0 && ve <= 1 && W.push(ve)
          }
        }
        return W
      }
      return {
        getIntersections: function(v) {
          var b = this.getValues()
            , T = v && v !== this && v.getValues();
          return T ? l(b, T, this, v, []) : f(b, this, [])
        },
        statics: {
          getOverlaps: y,
          getIntersections: g,
          getCurveLineIntersections: s,
          getTimesWithTangent: _
        }
      }
    }
  )
    , Ot = d.extend({
      _class: "CurveLocation",
      initialize: function(t, n, i, r, s) {
        if (n >= .99999999) {
          var u = t.getNext();
          u && (n = 0,
            t = u)
        }
        this._setCurve(t),
          this._time = n,
          this._point = i || t.getPointAtTime(n),
          this._overlap = r,
          this._distance = s,
          this._intersection = this._next = this._previous = null
      },
      _setPath: function(e) {
        this._path = e,
          this._version = e ? e._version : 0
      },
      _setCurve: function(e) {
        this._setPath(e._path),
          this._curve = e,
          this._segment = null,
          this._segment1 = e._segment1,
          this._segment2 = e._segment2
      },
      _setSegment: function(e) {
        var t = e.getCurve();
        t ? this._setCurve(t) : (this._setPath(e._path),
          this._segment1 = e,
          this._segment2 = null),
          this._segment = e,
          this._time = e === this._segment1 ? 0 : 1,
          this._point = e._point.clone()
      },
      getSegment: function() {
        var e = this._segment;
        if (!e) {
          var t = this.getCurve()
            , n = this.getTime();
          n === 0 ? e = t._segment1 : n === 1 ? e = t._segment2 : n != null && (e = t.getPartLength(0, n) < t.getPartLength(n, 1) ? t._segment1 : t._segment2),
            this._segment = e
        }
        return e
      },
      getCurve: function() {
        var e = this._path
          , t = this;
        e && e._version !== this._version && (this._time = this._offset = this._curveOffset = this._curve = null);
        function n(i) {
          var r = i && i.getCurve();
          if (r && (t._time = r.getTimeOf(t._point)) != null)
            return t._setCurve(r),
              r
        }
        return this._curve || n(this._segment) || n(this._segment1) || n(this._segment2.getPrevious())
      },
      getPath: function() {
        var e = this.getCurve();
        return e && e._path
      },
      getIndex: function() {
        var e = this.getCurve();
        return e && e.getIndex()
      },
      getTime: function() {
        var e = this.getCurve()
          , t = this._time;
        return e && t == null ? this._time = e.getTimeOf(this._point) : t
      },
      getParameter: "#getTime",
      getPoint: function() {
        return this._point
      },
      getOffset: function() {
        var e = this._offset;
        if (e == null) {
          e = 0;
          var t = this.getPath()
            , n = this.getIndex();
          if (t && n != null)
            for (var i = t.getCurves(), r = 0; r < n; r++)
              e += i[r].getLength();
          this._offset = e += this.getCurveOffset()
        }
        return e
      },
      getCurveOffset: function() {
        var e = this._curveOffset;
        if (e == null) {
          var t = this.getCurve()
            , n = this.getTime();
          this._curveOffset = e = n != null && t && t.getPartLength(0, n)
        }
        return e
      },
      getIntersection: function() {
        return this._intersection
      },
      getDistance: function() {
        return this._distance
      },
      divide: function() {
        var e = this.getCurve()
          , t = e && e.divideAtTime(this.getTime());
        return t && this._setSegment(t._segment1),
          t
      },
      split: function() {
        var e = this.getCurve()
          , t = e._path
          , n = e && e.splitAtTime(this.getTime());
        return n && this._setSegment(t.getLastSegment()),
          n
      },
      equals: function(e, t) {
        var n = this === e;
        if (!n && e instanceof Ot) {
          var i = this.getCurve()
            , r = e.getCurve()
            , s = i._path
            , u = r._path;
          if (s === u) {
            var o = Math.abs
              , l = 1e-7
              , f = o(this.getOffset() - e.getOffset())
              , g = !t && this._intersection
              , y = !t && e._intersection;
            n = (f < l || s && o(s.getLength() - f) < l) && (!g && !y || g && y && g.equals(y, !0))
          }
        }
        return n
      },
      toString: function() {
        var e = []
          , t = this.getPoint()
          , n = k.instance;
        t && e.push("point: " + t);
        var i = this.getIndex();
        i != null && e.push("index: " + i);
        var r = this.getTime();
        return r != null && e.push("time: " + n.number(r)),
        this._distance != null && e.push("distance: " + n.number(this._distance)),
        "{ " + e.join(", ") + " }"
      },
      isTouching: function() {
        var e = this._intersection;
        if (e && this.getTangent().isCollinear(e.getTangent())) {
          var t = this.getCurve()
            , n = e.getCurve();
          return !(t.isStraight() && n.isStraight() && t.getLine().intersect(n.getLine()))
        }
        return !1
      },
      isCrossing: function() {
        var e = this._intersection;
        if (!e)
          return !1;
        var t = this.getTime()
          , n = e.getTime()
          , i = 1e-8
          , r = 1 - i
          , s = t >= i && t <= r
          , u = n >= i && n <= r;
        if (s && u)
          return !this.isTouching();
        var o = this.getCurve()
          , l = o && t < i ? o.getPrevious() : o
          , f = e.getCurve()
          , g = f && n < i ? f.getPrevious() : f;
        if (t > r && (o = o.getNext()),
        n > r && (f = f.getNext()),
        !l || !o || !g || !f)
          return !1;
        var y = [];
        function _(L, R) {
          var D = L.getValues()
            , V = re.classify(D).roots || re.getPeaks(D)
            , z = V.length
            , G = re.getLength(D, R && z ? V[z - 1] : 0, !R && z ? V[0] : 1);
          y.push(z ? G : G / 32)
        }
        function v(L, R, D) {
          return R < D ? L > R && L < D : L > R || L < D
        }
        s || (_(l, !0),
          _(o, !1)),
        u || (_(g, !0),
          _(f, !1));
        var b = this.getPoint()
          , T = Math.min.apply(Math, y)
          , x = s ? o.getTangentAtTime(t) : o.getPointAt(T).subtract(b)
          , S = s ? x.negate() : l.getPointAt(-T).subtract(b)
          , I = u ? f.getTangentAtTime(n) : f.getPointAt(T).subtract(b)
          , m = u ? I.negate() : g.getPointAt(-T).subtract(b)
          , w = S.getAngle()
          , E = x.getAngle()
          , A = m.getAngle()
          , N = I.getAngle();
        return !!(s ? v(w, A, N) ^ v(E, A, N) && v(w, N, A) ^ v(E, N, A) : v(A, w, E) ^ v(N, w, E) && v(A, E, w) ^ v(N, E, w))
      },
      hasOverlap: function() {
        return !!this._overlap
      }
    }, d.each(re._evaluateMethods, function(e) {
      var t = e + "At";
      this[e] = function() {
        var n = this.getCurve()
          , i = this.getTime();
        return i != null && n && n[t](i, !0)
      }
    }, {
      preserve: !0
    }), new function() {
      function e(t, n, i) {
        var r = t.length
          , s = 0
          , u = r - 1;
        function o(b, T) {
          for (var x = b + T; x >= -1 && x <= r; x += T) {
            var S = t[(x % r + r) % r];
            if (!n.getPoint().isClose(S.getPoint(), 1e-7))
              break;
            if (n.equals(S))
              return S
          }
          return null
        }
        for (; s <= u; ) {
          var l = s + u >>> 1, f = t[l], g;
          if (i && (g = n.equals(f) ? f : o(l, -1) || o(l, 1)))
            return n._overlap && (g._overlap = g._intersection._overlap = !0),
              g;
          var y = n.getPath()
            , _ = f.getPath()
            , v = y !== _ ? y._id - _._id : n.getIndex() + n.getTime() - (f.getIndex() + f.getTime());
          v < 0 ? u = l - 1 : s = l + 1
        }
        return t.splice(s, 0, n),
          n
      }
      return {
        statics: {
          insert: e,
          expand: function(t) {
            for (var n = t.slice(), i = t.length - 1; i >= 0; i--)
              e(n, t[i]._intersection, !1);
            return n
          }
        }
      }
    }
  )
    , Ft = oe.extend({
    _class: "PathItem",
    _selectBounds: !1,
    _canScaleStroke: !0,
    beans: !0,
    initialize: function() {},
    statics: {
      create: function(e) {
        var t, n, i;
        if (d.isPlainObject(e) ? (n = e.segments,
          t = e.pathData) : Array.isArray(e) ? n = e : typeof e == "string" && (t = e),
          n) {
          var r = n[0];
          i = r && Array.isArray(r[0])
        } else
          t && (i = (t.match(/m/gi) || []).length > 1 || /z\s*\S+/i.test(t));
        var s = i ? ot : ke;
        return new s(e)
      }
    },
    _asPathItem: function() {
      return this
    },
    isClockwise: function() {
      return this.getArea() >= 0
    },
    setClockwise: function(e) {
      this.isClockwise() != (e = !!e) && this.reverse()
    },
    setPathData: function(e) {
      var t = e && e.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig), n, i = !1, r, s, u = new C, o = new C;
      function l(m, w) {
        var E = +n[m];
        return i && (E += u[w]),
          E
      }
      function f(m) {
        return new C(l(m, "x"),l(m + 1, "y"))
      }
      this.clear();
      for (var g = 0, y = t && t.length; g < y; g++) {
        var _ = t[g]
          , v = _[0]
          , b = v.toLowerCase();
        n = _.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
        var T = n && n.length;
        switch (i = v === b,
        r === "z" && !/[mz]/.test(b) && this.moveTo(u),
          b) {
          case "m":
          case "l":
            for (var x = b === "m", S = 0; S < T; S += 2)
              this[x ? "moveTo" : "lineTo"](u = f(S)),
              x && (o = u,
                x = !1);
            s = u;
            break;
          case "h":
          case "v":
            var I = b === "h" ? "x" : "y";
            u = u.clone();
            for (var S = 0; S < T; S++)
              u[I] = l(S, I),
                this.lineTo(u);
            s = u;
            break;
          case "c":
            for (var S = 0; S < T; S += 6)
              this.cubicCurveTo(f(S), s = f(S + 2), u = f(S + 4));
            break;
          case "s":
            for (var S = 0; S < T; S += 4)
              this.cubicCurveTo(/[cs]/.test(r) ? u.multiply(2).subtract(s) : u, s = f(S), u = f(S + 2)),
                r = b;
            break;
          case "q":
            for (var S = 0; S < T; S += 4)
              this.quadraticCurveTo(s = f(S), u = f(S + 2));
            break;
          case "t":
            for (var S = 0; S < T; S += 2)
              this.quadraticCurveTo(s = /[qt]/.test(r) ? u.multiply(2).subtract(s) : u, u = f(S)),
                r = b;
            break;
          case "a":
            for (var S = 0; S < T; S += 7)
              this.arcTo(u = f(S + 5), new J(+n[S],+n[S + 1]), +n[S + 2], +n[S + 4], +n[S + 3]);
            break;
          case "z":
            this.closePath(1e-12),
              u = o;
            break
        }
        r = b
      }
    },
    _canComposite: function() {
      return !(this.hasFill() && this.hasStroke())
    },
    _contains: function(e) {
      var t = e.isInside(this.getBounds({
        internal: !0,
        handle: !0
      })) ? this._getWinding(e) : {};
      return t.onPath || !!(this.getFillRule() === "evenodd" ? t.windingL & 1 || t.windingR & 1 : t.winding)
    },
    getIntersections: function(e, t, n, i) {
      var r = this === e || !e
        , s = this._matrix._orNullIfIdentity()
        , u = r ? s : (n || e._matrix)._orNullIfIdentity();
      return r || this.getBounds(s).intersects(e.getBounds(u), 1e-12) ? re.getIntersections(this.getCurves(), !r && e.getCurves(), t, s, u, i) : []
    },
    getCrossings: function(e) {
      return this.getIntersections(e, function(t) {
        return t.isCrossing()
      })
    },
    getNearestLocation: function() {
      for (var e = C.read(arguments), t = this.getCurves(), n = 1 / 0, i = null, r = 0, s = t.length; r < s; r++) {
        var u = t[r].getNearestLocation(e);
        u._distance < n && (n = u._distance,
          i = u)
      }
      return i
    },
    getNearestPoint: function() {
      var e = this.getNearestLocation.apply(this, arguments);
      return e && e.getPoint()
    },
    interpolate: function(e, t, n) {
      var i = !this._children
        , r = i ? "_segments" : "_children"
        , s = e[r]
        , u = t[r]
        , o = this[r];
      if (!s || !u || s.length !== u.length)
        throw new Error("Invalid operands in interpolate() call: " + e + ", " + t);
      var l = o.length
        , f = u.length;
      if (l < f)
        for (var g = i ? pe : ke, y = l; y < f; y++)
          this.add(new g);
      else
        l > f && this[i ? "removeSegments" : "removeChildren"](f, l);
      for (var y = 0; y < f; y++)
        o[y].interpolate(s[y], u[y], n);
      i && (this.setClosed(e._closed),
        this._changed(9))
    },
    compare: function(e) {
      var t = !1;
      if (e) {
        var n = this._children || [this]
          , i = e._children ? e._children.slice() : [e]
          , r = n.length
          , s = i.length
          , u = []
          , o = 0;
        t = !0;
        for (var l = q.findItemBoundsCollisions(n, i, O.GEOMETRIC_EPSILON), f = r - 1; f >= 0 && t; f--) {
          var g = n[f];
          t = !1;
          var y = l[f];
          if (y)
            for (var _ = y.length - 1; _ >= 0 && !t; _--)
              g.compare(i[y[_]]) && (u[y[_]] || (u[y[_]] = !0,
                o++),
                t = !0)
        }
        t = t && o === s
      }
      return t
    }
  })
    , ke = Ft.extend({
      _class: "Path",
      _serializeFields: {
        segments: [],
        closed: !1
      },
      initialize: function(t) {
        this._closed = !1,
          this._segments = [],
          this._version = 0;
        var n = arguments
          , i = Array.isArray(t) ? typeof t[0] == "object" ? t : n : t && t.size === a && (t.x !== a || t.point !== a) ? n : null;
        i && i.length > 0 ? this.setSegments(i) : (this._curves = a,
          this._segmentSelection = 0,
        !i && typeof t == "string" && (this.setPathData(t),
          t = null)),
          this._initialize(!i && t)
      },
      _equals: function(e) {
        return this._closed === e._closed && d.equals(this._segments, e._segments)
      },
      copyContent: function(e) {
        this.setSegments(e._segments),
          this._closed = e._closed
      },
      _changed: function e(t) {
        if (e.base.call(this, t),
        t & 8) {
          if (this._length = this._area = a,
          t & 32)
            this._version++;
          else if (this._curves)
            for (var n = 0, i = this._curves.length; n < i; n++)
              this._curves[n]._changed()
        } else
          t & 64 && (this._bounds = a)
      },
      getStyle: function() {
        var e = this._parent;
        return (e instanceof ot ? e : this)._style
      },
      getSegments: function() {
        return this._segments
      },
      setSegments: function(e) {
        var t = this.isFullySelected()
          , n = e && e.length;
        if (this._segments.length = 0,
          this._segmentSelection = 0,
          this._curves = a,
          n) {
          var i = e[n - 1];
          typeof i == "boolean" && (this.setClosed(i),
            n--),
            this._add(pe.readList(e, 0, {}, n))
        }
        t && this.setFullySelected(!0)
      },
      getFirstSegment: function() {
        return this._segments[0]
      },
      getLastSegment: function() {
        return this._segments[this._segments.length - 1]
      },
      getCurves: function() {
        var e = this._curves
          , t = this._segments;
        if (!e) {
          var n = this._countCurves();
          e = this._curves = new Array(n);
          for (var i = 0; i < n; i++)
            e[i] = new re(this,t[i],t[i + 1] || t[0])
        }
        return e
      },
      getFirstCurve: function() {
        return this.getCurves()[0]
      },
      getLastCurve: function() {
        var e = this.getCurves();
        return e[e.length - 1]
      },
      isClosed: function() {
        return this._closed
      },
      setClosed: function(e) {
        if (this._closed != (e = !!e)) {
          if (this._closed = e,
            this._curves) {
            var t = this._curves.length = this._countCurves();
            e && (this._curves[t - 1] = new re(this,this._segments[t - 1],this._segments[0]))
          }
          this._changed(41)
        }
      }
    }, {
      beans: !0,
      getPathData: function(e, t) {
        var n = this._segments, i = n.length, r = new k(t), s = new Array(6), u = !0, o, l, f, g, y, _, v, b, T = [];
        function x(I, m) {
          if (I._transformCoordinates(e, s),
            o = s[0],
            l = s[1],
            u)
            T.push("M" + r.pair(o, l)),
              u = !1;
          else if (y = s[2],
            _ = s[3],
          y === o && _ === l && v === f && b === g) {
            if (!m) {
              var w = o - f
                , E = l - g;
              T.push(w === 0 ? "v" + r.number(E) : E === 0 ? "h" + r.number(w) : "l" + r.pair(w, E))
            }
          } else
            T.push("c" + r.pair(v - f, b - g) + " " + r.pair(y - f, _ - g) + " " + r.pair(o - f, l - g));
          f = o,
            g = l,
            v = s[4],
            b = s[5]
        }
        if (!i)
          return "";
        for (var S = 0; S < i; S++)
          x(n[S]);
        return this._closed && i > 0 && (x(n[0], !0),
          T.push("z")),
          T.join("")
      },
      isEmpty: function() {
        return !this._segments.length
      },
      _transformContent: function(e) {
        for (var t = this._segments, n = new Array(6), i = 0, r = t.length; i < r; i++)
          t[i]._transformCoordinates(e, n, !0);
        return !0
      },
      _add: function(e, u) {
        for (var n = this._segments, i = this._curves, r = e.length, s = u == null, u = s ? n.length : u, o = 0; o < r; o++) {
          var l = e[o];
          l._path && (l = e[o] = l.clone()),
            l._path = this,
            l._index = u + o,
          l._selection && this._updateSelection(l, 0, l._selection)
        }
        if (s)
          d.push(n, e);
        else {
          n.splice.apply(n, [u, 0].concat(e));
          for (var o = u + r, f = n.length; o < f; o++)
            n[o]._index = o
        }
        if (i) {
          var g = this._countCurves()
            , y = u > 0 && u + r - 1 === g ? u - 1 : u
            , _ = y
            , v = Math.min(y + r, g);
          e._curves && (i.splice.apply(i, [y, 0].concat(e._curves)),
            _ += e._curves.length);
          for (var o = _; o < v; o++)
            i.splice(o, 0, new re(this,null,null));
          this._adjustCurves(y, v)
        }
        return this._changed(41),
          e
      },
      _adjustCurves: function(e, t) {
        for (var n = this._segments, i = this._curves, r, s = e; s < t; s++)
          r = i[s],
            r._path = this,
            r._segment1 = n[s],
            r._segment2 = n[s + 1] || n[0],
            r._changed();
        (r = i[this._closed && !e ? n.length - 1 : e - 1]) && (r._segment2 = n[e] || n[0],
          r._changed()),
        (r = i[t]) && (r._segment1 = n[t],
          r._changed())
      },
      _countCurves: function() {
        var e = this._segments.length;
        return !this._closed && e > 0 ? e - 1 : e
      },
      add: function(e) {
        var t = arguments;
        return t.length > 1 && typeof e != "number" ? this._add(pe.readList(t)) : this._add([pe.read(t)])[0]
      },
      insert: function(e, t) {
        var n = arguments;
        return n.length > 2 && typeof t != "number" ? this._add(pe.readList(n, 1), e) : this._add([pe.read(n, 1)], e)[0]
      },
      addSegment: function() {
        return this._add([pe.read(arguments)])[0]
      },
      insertSegment: function(e) {
        return this._add([pe.read(arguments, 1)], e)[0]
      },
      addSegments: function(e) {
        return this._add(pe.readList(e))
      },
      insertSegments: function(e, t) {
        return this._add(pe.readList(t), e)
      },
      removeSegment: function(e) {
        return this.removeSegments(e, e + 1)[0] || null
      },
      removeSegments: function(e, t, n) {
        e = e || 0,
          t = d.pick(t, this._segments.length);
        var i = this._segments
          , r = this._curves
          , s = i.length
          , u = i.splice(e, t - e)
          , o = u.length;
        if (!o)
          return u;
        for (var l = 0; l < o; l++) {
          var f = u[l];
          f._selection && this._updateSelection(f, f._selection, 0),
            f._index = f._path = null
        }
        for (var l = e, g = i.length; l < g; l++)
          i[l]._index = l;
        if (r) {
          for (var y = e > 0 && t === s + (this._closed ? 1 : 0) ? e - 1 : e, r = r.splice(y, o), l = r.length - 1; l >= 0; l--)
            r[l]._path = null;
          n && (u._curves = r.slice(1)),
            this._adjustCurves(y, y)
        }
        return this._changed(41),
          u
      },
      clear: "#removeSegments",
      hasHandles: function() {
        for (var e = this._segments, t = 0, n = e.length; t < n; t++)
          if (e[t].hasHandles())
            return !0;
        return !1
      },
      clearHandles: function() {
        for (var e = this._segments, t = 0, n = e.length; t < n; t++)
          e[t].clearHandles()
      },
      getLength: function() {
        if (this._length == null) {
          for (var e = this.getCurves(), t = 0, n = 0, i = e.length; n < i; n++)
            t += e[n].getLength();
          this._length = t
        }
        return this._length
      },
      getArea: function() {
        var e = this._area;
        if (e == null) {
          var t = this._segments
            , n = this._closed;
          e = 0;
          for (var i = 0, r = t.length; i < r; i++) {
            var s = i + 1 === r;
            e += re.getArea(re.getValues(t[i], t[s ? 0 : i + 1], null, s && !n))
          }
          this._area = e
        }
        return e
      },
      isFullySelected: function() {
        var e = this._segments.length;
        return this.isSelected() && e > 0 && this._segmentSelection === e * 7
      },
      setFullySelected: function(e) {
        e && this._selectSegments(!0),
          this.setSelected(e)
      },
      setSelection: function e(t) {
        t & 1 || this._selectSegments(!1),
          e.base.call(this, t)
      },
      _selectSegments: function(e) {
        var t = this._segments
          , n = t.length
          , i = e ? 7 : 0;
        this._segmentSelection = i * n;
        for (var r = 0; r < n; r++)
          t[r]._selection = i
      },
      _updateSelection: function(e, t, n) {
        e._selection = n;
        var i = this._segmentSelection += n - t;
        i > 0 && this.setSelected(!0)
      },
      divideAt: function(e) {
        var t = this.getLocationAt(e), n;
        return t && (n = t.getCurve().divideAt(t.getCurveOffset())) ? n._segment1 : null
      },
      splitAt: function(e) {
        var t = this.getLocationAt(e)
          , n = t && t.index
          , i = t && t.time
          , r = 1e-8
          , s = 1 - r;
        i > s && (n++,
          i = 0);
        var u = this.getCurves();
        if (n >= 0 && n < u.length) {
          i >= r && u[n++].divideAtTime(i);
          var o = this.removeSegments(n, this._segments.length, !0), l;
          return this._closed ? (this.setClosed(!1),
            l = this) : (l = new ke(oe.NO_INSERT),
            l.insertAbove(this),
            l.copyAttributes(this)),
            l._add(o, 0),
            this.addSegment(o[0]),
            l
        }
        return null
      },
      split: function(e, t) {
        var n, i = t === a ? e : (n = this.getCurves()[e]) && n.getLocationAtTime(t);
        return i != null ? this.splitAt(i) : null
      },
      join: function(e, t) {
        var n = t || 0;
        if (e && e !== this) {
          var i = e._segments
            , r = this.getLastSegment()
            , s = e.getLastSegment();
          if (!s)
            return this;
          r && r._point.isClose(s._point, n) && e.reverse();
          var u = e.getFirstSegment();
          if (r && r._point.isClose(u._point, n))
            r.setHandleOut(u._handleOut),
              this._add(i.slice(1));
          else {
            var o = this.getFirstSegment();
            o && o._point.isClose(u._point, n) && e.reverse(),
              s = e.getLastSegment(),
              o && o._point.isClose(s._point, n) ? (o.setHandleIn(s._handleIn),
                this._add(i.slice(0, i.length - 1), 0)) : this._add(i.slice())
          }
          e._closed && this._add([i[0]]),
            e.remove()
        }
        var l = this.getFirstSegment()
          , f = this.getLastSegment();
        return l !== f && l._point.isClose(f._point, n) && (l.setHandleIn(f._handleIn),
          f.remove(),
          this.setClosed(!0)),
          this
      },
      reduce: function(e) {
        for (var t = this.getCurves(), n = e && e.simplify, i = n ? 1e-7 : 0, r = t.length - 1; r >= 0; r--) {
          var s = t[r];
          !s.hasHandles() && (!s.hasLength(i) || n && s.isCollinear(s.getNext())) && s.remove()
        }
        return this
      },
      reverse: function() {
        this._segments.reverse();
        for (var e = 0, t = this._segments.length; e < t; e++) {
          var n = this._segments[e]
            , i = n._handleIn;
          n._handleIn = n._handleOut,
            n._handleOut = i,
            n._index = e
        }
        this._curves = null,
          this._changed(9)
      },
      flatten: function(e) {
        for (var t = new kt(this,e || .25,256,!0), n = t.parts, i = n.length, r = [], s = 0; s < i; s++)
          r.push(new pe(n[s].curve.slice(0, 2)));
        !this._closed && i > 0 && r.push(new pe(n[i - 1].curve.slice(6))),
          this.setSegments(r)
      },
      simplify: function(e) {
        var t = new yn(this).fit(e || 2.5);
        return t && this.setSegments(t),
          !!t
      },
      smooth: function(e) {
        var t = this
          , n = e || {}
          , i = n.type || "asymmetric"
          , r = this._segments
          , s = r.length
          , u = this._closed;
        function o(Te, Ge) {
          var Re = Te && Te.index;
          if (Re != null) {
            var xe = Te.path;
            if (xe && xe !== t)
              throw new Error(Te._class + " " + Re + " of " + xe + " is not part of " + t);
            Ge && Te instanceof re && Re++
          } else
            Re = typeof Te == "number" ? Te : Ge;
          return Math.min(Re < 0 && u ? Re % s : Re < 0 ? Re + s : Re, s - 1)
        }
        var l = u && n.from === a && n.to === a
          , f = o(n.from, 0)
          , g = o(n.to, s - 1);
        if (f > g)
          if (u)
            f -= s;
          else {
            var y = f;
            f = g,
              g = y
          }
        if (/^(?:asymmetric|continuous)$/.test(i)) {
          var _ = i === "asymmetric"
            , v = Math.min
            , b = g - f + 1
            , T = b - 1
            , x = l ? v(b, 4) : 1
            , S = x
            , I = x
            , m = [];
          if (u || (S = v(1, f),
            I = v(1, s - g - 1)),
            T += S + I,
          T <= 1)
            return;
          for (var w = 0, E = f - S; w <= T; w++,
            E++)
            m[w] = r[(E < 0 ? E + s : E) % s]._point;
          for (var A = m[0]._x + 2 * m[1]._x, N = m[0]._y + 2 * m[1]._y, L = 2, R = T - 1, D = [A], V = [N], z = [L], G = [], H = [], w = 1; w < T; w++) {
            var K = w < R
              , $ = K || _ ? 1 : 2
              , W = K ? 4 : _ ? 2 : 7
              , te = K ? 4 : _ ? 3 : 8
              , se = K ? 2 : _ ? 0 : 1
              , ue = $ / L;
            L = z[w] = W - ue,
              A = D[w] = te * m[w]._x + se * m[w + 1]._x - ue * A,
              N = V[w] = te * m[w]._y + se * m[w + 1]._y - ue * N
          }
          G[R] = D[R] / z[R],
            H[R] = V[R] / z[R];
          for (var w = T - 2; w >= 0; w--)
            G[w] = (D[w] - G[w + 1]) / z[w],
              H[w] = (V[w] - H[w + 1]) / z[w];
          G[T] = (3 * m[T]._x - G[R]) / 2,
            H[T] = (3 * m[T]._y - H[R]) / 2;
          for (var w = S, Ie = T - I, E = f; w <= Ie; w++,
            E++) {
            var Ee = r[E < 0 ? E + s : E]
              , de = Ee._point
              , ve = G[w] - de._x
              , Oe = H[w] - de._y;
            (l || w < Ie) && Ee.setHandleOut(ve, Oe),
            (l || w > S) && Ee.setHandleIn(-ve, -Oe)
          }
        } else
          for (var w = f; w <= g; w++)
            r[w < 0 ? w + s : w].smooth(n, !l && w === f, !l && w === g)
      },
      toShape: function(e) {
        if (!this._closed)
          return null;
        var t = this._segments, n, i, r, s;
        function u(_, v) {
          var b = t[_]
            , T = b.getNext()
            , x = t[v]
            , S = x.getNext();
          return b._handleOut.isZero() && T._handleIn.isZero() && x._handleOut.isZero() && S._handleIn.isZero() && T._point.subtract(b._point).isCollinear(S._point.subtract(x._point))
        }
        function o(_) {
          var v = t[_]
            , b = v.getPrevious()
            , T = v.getNext();
          return b._handleOut.isZero() && v._handleIn.isZero() && v._handleOut.isZero() && T._handleIn.isZero() && v._point.subtract(b._point).isOrthogonal(T._point.subtract(v._point))
        }
        function l(_) {
          var v = t[_]
            , b = v.getNext()
            , T = v._handleOut
            , x = b._handleIn
            , S = .5522847498307936;
          if (T.isOrthogonal(x)) {
            var I = v._point
              , m = b._point
              , w = new Se(I,T,!0).intersect(new Se(m,x,!0), !0);
            return w && O.isZero(T.getLength() / w.subtract(I).getLength() - S) && O.isZero(x.getLength() / w.subtract(m).getLength() - S)
          }
          return !1
        }
        function f(_, v) {
          return t[_]._point.getDistance(t[v]._point)
        }
        if (!this.hasHandles() && t.length === 4 && u(0, 2) && u(1, 3) && o(1) ? (n = je.Rectangle,
          i = new J(f(0, 3),f(0, 1)),
          s = t[1]._point.add(t[2]._point).divide(2)) : t.length === 8 && l(0) && l(2) && l(4) && l(6) && u(1, 5) && u(3, 7) ? (n = je.Rectangle,
          i = new J(f(1, 6),f(0, 3)),
          r = i.subtract(new J(f(0, 7),f(1, 2))).divide(2),
          s = t[3]._point.add(t[4]._point).divide(2)) : t.length === 4 && l(0) && l(1) && l(2) && l(3) && (O.isZero(f(0, 2) - f(1, 3)) ? (n = je.Circle,
          r = f(0, 2) / 2) : (n = je.Ellipse,
          r = new J(f(2, 0) / 2,f(3, 1) / 2)),
          s = t[1]._point),
          n) {
          var g = this.getPosition(!0)
            , y = new n({
            center: g,
            size: i,
            radius: r,
            insert: !1
          });
          return y.copyAttributes(this, !0),
            y._matrix.prepend(this._matrix),
            y.rotate(s.subtract(g).getAngle() + 90),
          (e === a || e) && y.insertAbove(this),
            y
        }
        return null
      },
      toPath: "#clone",
      compare: function e(t) {
        if (!t || t instanceof ot)
          return e.base.call(this, t);
        var n = this.getCurves()
          , i = t.getCurves()
          , r = n.length
          , s = i.length;
        if (!r || !s)
          return r == s;
        for (var u = n[0].getValues(), o = [], l = 0, f, g = 0, y, _ = 0; _ < s; _++) {
          var x = i[_].getValues();
          o.push(x);
          var v = re.getOverlaps(u, x);
          if (v) {
            f = !_ && v[0][0] > 0 ? s - 1 : _,
              y = v[0][1];
            break
          }
        }
        for (var b = Math.abs, T = 1e-8, x = o[f], S; u && x; ) {
          var v = re.getOverlaps(u, x);
          if (v) {
            var I = v[0][0];
            if (b(I - g) < T) {
              g = v[1][0],
              g === 1 && (u = ++l < r ? n[l].getValues() : null,
                g = 0);
              var m = v[0][1];
              if (b(m - y) < T) {
                if (S || (S = [f, m]),
                  y = v[1][1],
                y === 1 && (++f >= s && (f = 0),
                  x = o[f] || i[f].getValues(),
                  y = 0),
                  !u)
                  return S[0] === f && S[1] === y;
                continue
              }
            }
          }
          break
        }
        return !1
      },
      _hitTestSelf: function(e, t, n, i) {
        var r = this, s = this.getStyle(), u = this._segments, o = u.length, l = this._closed, f = t._tolerancePadding, g = f, y, _, v, b, T, x, S = t.stroke && s.hasStroke(), I = t.fill && s.hasFill(), m = t.curves, w = S ? s.getStrokeWidth() / 2 : I && t.tolerance > 0 || m ? 0 : null;
        w !== null && (w > 0 ? (y = s.getStrokeJoin(),
          _ = s.getStrokeCap(),
          v = s.getMiterLimit(),
          g = g.add(ke._getStrokePadding(w, i))) : y = _ = "round");
        function E(G, H) {
          return e.subtract(G).divide(H).length <= 1
        }
        function A(G, H, K) {
          if (!t.selected || H.isSelected()) {
            var $ = G._point;
            if (H !== $ && (H = H.add($)),
              E(H, g))
              return new qe(K,r,{
                segment: G,
                point: H
              })
          }
        }
        function N(G, H) {
          return (H || t.segments) && A(G, G._point, "segment") || !H && t.handles && (A(G, G._handleIn, "handle-in") || A(G, G._handleOut, "handle-out"))
        }
        function L(G) {
          b.add(G)
        }
        function R(G) {
          var H = l || G._index > 0 && G._index < o - 1;
          if ((H ? y : _) === "round")
            return E(G._point, g);
          if (b = new ke({
            internal: !0,
            closed: !0
          }),
            H ? G.isSmooth() || ke._addBevelJoin(G, y, w, v, null, i, L, !0) : _ === "square" && ke._addSquareCap(G, _, w, null, i, L, !0),
            !b.isEmpty()) {
            var K;
            return b.contains(e) || (K = b.getNearestLocation(e)) && E(K.getPoint(), f)
          }
        }
        if (t.ends && !t.segments && !l) {
          if (x = N(u[0], !0) || N(u[o - 1], !0))
            return x
        } else if (t.segments || t.handles) {
          for (var D = 0; D < o; D++)
            if (x = N(u[D]))
              return x
        }
        if (w !== null) {
          if (T = this.getNearestLocation(e),
            T) {
            var V = T.getTime();
            V === 0 || V === 1 && o > 1 ? R(T.getSegment()) || (T = null) : E(T.getPoint(), g) || (T = null)
          }
          if (!T && y === "miter" && o > 1)
            for (var D = 0; D < o; D++) {
              var z = u[D];
              if (e.getDistance(z._point) <= v * w && R(z)) {
                T = z.getLocation();
                break
              }
            }
        }
        return !T && I && this._contains(e) || T && !S && !m ? new qe("fill",this) : T ? new qe(S ? "stroke" : "curve",this,{
          location: T,
          point: T.getPoint()
        }) : null
      }
    }, d.each(re._evaluateMethods, function(e) {
      this[e + "At"] = function(t) {
        var n = this.getLocationAt(t);
        return n && n[e]()
      }
    }, {
      beans: !1,
      getLocationOf: function() {
        for (var e = C.read(arguments), t = this.getCurves(), n = 0, i = t.length; n < i; n++) {
          var r = t[n].getLocationOf(e);
          if (r)
            return r
        }
        return null
      },
      getOffsetOf: function() {
        var e = this.getLocationOf.apply(this, arguments);
        return e ? e.getOffset() : null
      },
      getLocationAt: function(e) {
        if (typeof e == "number") {
          for (var t = this.getCurves(), n = 0, i = 0, r = t.length; i < r; i++) {
            var s = n
              , u = t[i];
            if (n += u.getLength(),
            n > e)
              return u.getLocationAt(e - s)
          }
          if (t.length > 0 && e <= this.getLength())
            return new Ot(t[t.length - 1],1)
        } else if (e && e.getPath && e.getPath() === this)
          return e;
        return null
      },
      getOffsetsWithTangent: function() {
        var e = C.read(arguments);
        if (e.isZero())
          return [];
        for (var t = [], n = 0, i = this.getCurves(), r = 0, s = i.length; r < s; r++) {
          for (var u = i[r], o = u.getTimesWithTangent(e), l = 0, f = o.length; l < f; l++) {
            var g = n + u.getOffsetAtTime(o[l]);
            t.indexOf(g) < 0 && t.push(g)
          }
          n += u.length
        }
        return t
      }
    }), new function() {
      function e(n, i, r, s) {
        if (s <= 0)
          return;
        var u = s / 2, o = s - 2, l = u - 1, f = new Array(6), g, y;
        function _(I) {
          var m = f[I]
            , w = f[I + 1];
          (g != m || y != w) && (n.beginPath(),
            n.moveTo(g, y),
            n.lineTo(m, w),
            n.stroke(),
            n.beginPath(),
            n.arc(m, w, u, 0, Math.PI * 2, !0),
            n.fill())
        }
        for (var v = 0, b = i.length; v < b; v++) {
          var T = i[v]
            , x = T._selection;
          if (T._transformCoordinates(r, f),
            g = f[0],
            y = f[1],
          x & 2 && _(2),
          x & 4 && _(4),
            n.fillRect(g - u, y - u, s, s),
          o > 0 && !(x & 1)) {
            var S = n.fillStyle;
            n.fillStyle = "#ffffff",
              n.fillRect(g - l, y - l, o, o),
              n.fillStyle = S
          }
        }
      }
      function t(n, i, r) {
        var s = i._segments, u = s.length, o = new Array(6), l = !0, f, g, y, _, v, b, T, x;
        function S(m) {
          if (r)
            m._transformCoordinates(r, o),
              f = o[0],
              g = o[1];
          else {
            var w = m._point;
            f = w._x,
              g = w._y
          }
          if (l)
            n.moveTo(f, g),
              l = !1;
          else {
            if (r)
              v = o[2],
                b = o[3];
            else {
              var E = m._handleIn;
              v = f + E._x,
                b = g + E._y
            }
            v === f && b === g && T === y && x === _ ? n.lineTo(f, g) : n.bezierCurveTo(T, x, v, b, f, g)
          }
          if (y = f,
            _ = g,
            r)
            T = o[4],
              x = o[5];
          else {
            var E = m._handleOut;
            T = y + E._x,
              x = _ + E._y
          }
        }
        for (var I = 0; I < u; I++)
          S(s[I]);
        i._closed && u > 0 && S(s[0])
      }
      return {
        _draw: function(n, i, r, s) {
          var u = i.dontStart
            , o = i.dontFinish || i.clip
            , l = this.getStyle()
            , f = l.hasFill()
            , g = l.hasStroke()
            , y = l.getDashArray()
            , _ = !ae.support.nativeDash && g && y && y.length;
          u || n.beginPath(),
          (f || g && !_ || o) && (t(n, this, s),
          this._closed && n.closePath());
          function v(m) {
            return y[(m % _ + _) % _]
          }
          if (!o && (f || g) && (this._setStyles(n, i, r),
          f && (n.fill(l.getFillRule()),
            n.shadowColor = "rgba(0,0,0,0)"),
            g)) {
            if (_) {
              u || n.beginPath();
              for (var b = new kt(this,.25,32,!1,s), T = b.length, x = -l.getDashOffset(), S, I = 0; x > 0; )
                x -= v(I--) + v(I--);
              for (; x < T; )
                S = x + v(I++),
                (x > 0 || S > 0) && b.drawPart(n, Math.max(x, 0), Math.max(S, 0)),
                  x = S + v(I++)
            }
            n.stroke()
          }
        },
        _drawSelected: function(n, i) {
          n.beginPath(),
            t(n, this, i),
            n.stroke(),
            e(n, this._segments, i, ae.settings.handleSize)
        }
      }
    }
    , new function() {
      function e(t) {
        var n = t._segments;
        if (!n.length)
          throw new Error("Use a moveTo() command first");
        return n[n.length - 1]
      }
      return {
        moveTo: function() {
          var t = this._segments;
          t.length === 1 && this.removeSegment(0),
          t.length || this._add([new pe(C.read(arguments))])
        },
        moveBy: function() {
          throw new Error("moveBy() is unsupported on Path items.")
        },
        lineTo: function() {
          this._add([new pe(C.read(arguments))])
        },
        cubicCurveTo: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = C.read(t)
            , s = e(this);
          s.setHandleOut(n.subtract(s._point)),
            this._add([new pe(r,i.subtract(r))])
        },
        quadraticCurveTo: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = e(this)._point;
          this.cubicCurveTo(n.add(r.subtract(n).multiply(1 / 3)), n.add(i.subtract(n).multiply(1 / 3)), i)
        },
        curveTo: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = d.pick(d.read(t), .5)
            , s = 1 - r
            , u = e(this)._point
            , o = n.subtract(u.multiply(s * s)).subtract(i.multiply(r * r)).divide(2 * r * s);
          if (o.isNaN())
            throw new Error("Cannot put a curve through points with parameter = " + r);
          this.quadraticCurveTo(o, i)
        },
        arcTo: function() {
          var t = arguments, n = Math.abs, i = Math.sqrt, r = e(this), s = r._point, u = C.read(t), o, l = d.peek(t), f = d.pick(l, !0), g, y, _, v;
          if (typeof f == "boolean")
            var b = s.add(u).divide(2)
              , o = b.add(b.subtract(s).rotate(f ? -90 : 90));
          else if (d.remain(t) <= 2)
            o = u,
              u = C.read(t);
          else if (!s.equals(u)) {
            var T = J.read(t)
              , x = O.isZero;
            if (x(T.width) || x(T.height))
              return this.lineTo(u);
            var S = d.read(t)
              , f = !!d.read(t)
              , I = !!d.read(t)
              , b = s.add(u).divide(2)
              , m = s.subtract(b).rotate(-S)
              , w = m.x
              , E = m.y
              , A = n(T.width)
              , N = n(T.height)
              , L = A * A
              , R = N * N
              , D = w * w
              , V = E * E
              , z = i(D / L + V / R);
            if (z > 1 && (A *= z,
              N *= z,
              L = A * A,
              R = N * N),
              z = (L * R - L * V - R * D) / (L * V + R * D),
            n(z) < 1e-12 && (z = 0),
            z < 0)
              throw new Error("Cannot create an arc with the given arguments");
            g = new C(A * E / N,-N * w / A).multiply((I === f ? -1 : 1) * i(z)).rotate(S).add(b),
              v = new le().translate(g).rotate(S).scale(A, N),
              _ = v._inverseTransform(s),
              y = _.getDirectedAngle(v._inverseTransform(u)),
              !f && y > 0 ? y -= 360 : f && y < 0 && (y += 360)
          }
          if (o) {
            var G = new Se(s.add(o).divide(2),o.subtract(s).rotate(90),!0)
              , H = new Se(o.add(u).divide(2),u.subtract(o).rotate(90),!0)
              , K = new Se(s,u)
              , $ = K.getSide(o);
            if (g = G.intersect(H, !0),
              !g) {
              if (!$)
                return this.lineTo(u);
              throw new Error("Cannot create an arc with the given arguments")
            }
            _ = s.subtract(g),
              y = _.getDirectedAngle(u.subtract(g));
            var W = K.getSide(g, !0);
            W === 0 ? y = $ * n(y) : $ === W && (y += y < 0 ? 360 : -360)
          }
          if (y) {
            for (var te = 1e-5, se = n(y), ue = se >= 360 ? 4 : Math.ceil((se - te) / 90), Ie = y / ue, Ee = Ie * Math.PI / 360, de = 4 / 3 * Math.sin(Ee) / (1 + Math.cos(Ee)), ve = [], Oe = 0; Oe <= ue; Oe++) {
              var m = u
                , Te = null;
              if (Oe < ue && (Te = _.rotate(90).multiply(de),
                v ? (m = v._transformPoint(_),
                  Te = v._transformPoint(_.add(Te)).subtract(m)) : m = g.add(_)),
                !Oe)
                r.setHandleOut(Te);
              else {
                var Ge = _.rotate(-90).multiply(de);
                v && (Ge = v._transformPoint(_.add(Ge)).subtract(m)),
                  ve.push(new pe(m,Ge,Te))
              }
              _ = _.rotate(Ie)
            }
            this._add(ve)
          }
        },
        lineBy: function() {
          var t = C.read(arguments)
            , n = e(this)._point;
          this.lineTo(n.add(t))
        },
        curveBy: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = d.read(t)
            , s = e(this)._point;
          this.curveTo(s.add(n), s.add(i), r)
        },
        cubicCurveBy: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = C.read(t)
            , s = e(this)._point;
          this.cubicCurveTo(s.add(n), s.add(i), s.add(r))
        },
        quadraticCurveBy: function() {
          var t = arguments
            , n = C.read(t)
            , i = C.read(t)
            , r = e(this)._point;
          this.quadraticCurveTo(r.add(n), r.add(i))
        },
        arcBy: function() {
          var t = arguments
            , n = e(this)._point
            , i = n.add(C.read(t))
            , r = d.pick(d.peek(t), !0);
          typeof r == "boolean" ? this.arcTo(i, r) : this.arcTo(i, n.add(C.read(t)))
        },
        closePath: function(t) {
          this.setClosed(!0),
            this.join(this, t)
        }
      }
    }
    , {
      _getBounds: function(e, t) {
        var n = t.handle ? "getHandleBounds" : t.stroke ? "getStrokeBounds" : "getBounds";
        return ke[n](this._segments, this._closed, this, e, t)
      },
      statics: {
        getBounds: function(e, t, n, i, r, s) {
          var u = e[0];
          if (!u)
            return new Y;
          var o = new Array(6)
            , l = u._transformCoordinates(i, new Array(6))
            , f = l.slice(0, 2)
            , g = f.slice()
            , y = new Array(2);
          function _(T) {
            T._transformCoordinates(i, o);
            for (var x = 0; x < 2; x++)
              re._addBounds(l[x], l[x + 4], o[x + 2], o[x], x, s ? s[x] : 0, f, g, y);
            var S = l;
            l = o,
              o = S
          }
          for (var v = 1, b = e.length; v < b; v++)
            _(e[v]);
          return t && _(u),
            new Y(f[0],f[1],g[0] - f[0],g[1] - f[1])
        },
        getStrokeBounds: function(e, t, n, i, r) {
          var s = n.getStyle()
            , u = s.hasStroke()
            , o = s.getStrokeWidth()
            , l = u && n._getStrokeMatrix(i, r)
            , f = u && ke._getStrokePadding(o, l)
            , g = ke.getBounds(e, t, n, i, r, f);
          if (!u)
            return g;
          var y = o / 2
            , _ = s.getStrokeJoin()
            , v = s.getStrokeCap()
            , b = s.getMiterLimit()
            , T = new Y(new J(f));
          function x(A) {
            g = g.include(A)
          }
          function S(A) {
            g = g.unite(T.setCenter(A._point.transform(i)))
          }
          function I(A, N) {
            N === "round" || A.isSmooth() ? S(A) : ke._addBevelJoin(A, N, y, b, i, l, x)
          }
          function m(A, N) {
            N === "round" ? S(A) : ke._addSquareCap(A, N, y, i, l, x)
          }
          var w = e.length - (t ? 0 : 1);
          if (w > 0) {
            for (var E = 1; E < w; E++)
              I(e[E], _);
            t ? I(e[0], _) : (m(e[0], v),
              m(e[e.length - 1], v))
          }
          return g
        },
        _getStrokePadding: function(e, t) {
          if (!t)
            return [e, e];
          var n = new C(e,0).transform(t)
            , i = new C(0,e).transform(t)
            , r = n.getAngleInRadians()
            , s = n.getLength()
            , u = i.getLength()
            , o = Math.sin(r)
            , l = Math.cos(r)
            , f = Math.tan(r)
            , g = Math.atan2(u * f, s)
            , y = Math.atan2(u, f * s);
          return [Math.abs(s * Math.cos(g) * l + u * Math.sin(g) * o), Math.abs(u * Math.sin(y) * l + s * Math.cos(y) * o)]
        },
        _addBevelJoin: function(e, t, n, i, r, s, u, o) {
          var l = e.getCurve()
            , f = l.getPrevious()
            , g = l.getPoint1().transform(r)
            , y = f.getNormalAtTime(1).multiply(n).transform(s)
            , _ = l.getNormalAtTime(0).multiply(n).transform(s)
            , v = y.getDirectedAngle(_);
          if ((v < 0 || v >= 180) && (y = y.negate(),
            _ = _.negate()),
          o && u(g),
            u(g.add(y)),
          t === "miter") {
            var b = new Se(g.add(y),new C(-y.y,y.x),!0).intersect(new Se(g.add(_),new C(-_.y,_.x),!0), !0);
            b && g.getDistance(b) <= i * n && u(b)
          }
          u(g.add(_))
        },
        _addSquareCap: function(e, t, n, i, r, s, u) {
          var o = e._point.transform(i)
            , l = e.getLocation()
            , f = l.getNormal().multiply(l.getTime() === 0 ? n : -n).transform(r);
          t === "square" && (u && (s(o.subtract(f)),
            s(o.add(f))),
            o = o.add(f.rotate(-90))),
            s(o.add(f)),
            s(o.subtract(f))
        },
        getHandleBounds: function(e, t, n, i, r) {
          var s = n.getStyle(), u = r.stroke && s.hasStroke(), o, l;
          if (u) {
            var f = n._getStrokeMatrix(i, r)
              , g = s.getStrokeWidth() / 2
              , y = g;
            s.getStrokeJoin() === "miter" && (y = g * s.getMiterLimit()),
            s.getStrokeCap() === "square" && (y = Math.max(y, g * Math.SQRT2)),
              o = ke._getStrokePadding(g, f),
              l = ke._getStrokePadding(y, f)
          }
          for (var _ = new Array(6), v = 1 / 0, b = -v, T = v, x = b, S = 0, I = e.length; S < I; S++) {
            var m = e[S];
            m._transformCoordinates(i, _);
            for (var w = 0; w < 6; w += 2) {
              var E = w ? o : l
                , A = E ? E[0] : 0
                , N = E ? E[1] : 0
                , L = _[w]
                , R = _[w + 1]
                , D = L - A
                , V = L + A
                , z = R - N
                , G = R + N;
              D < v && (v = D),
              V > b && (b = V),
              z < T && (T = z),
              G > x && (x = G)
            }
          }
          return new Y(v,T,b - v,x - T)
        }
      }
    });
  ke.inject({
    statics: new function() {
      var e = .5522847498307936
        , t = [new pe([-1, 0],[0, e],[0, -e]), new pe([0, -1],[-e, 0],[e, 0]), new pe([1, 0],[0, -e],[0, e]), new pe([0, 1],[e, 0],[-e, 0])];
      function n(r, s, u) {
        var o = d.getNamed(u)
          , l = new ke(o && (o.insert == !0 ? oe.INSERT : o.insert == !1 ? oe.NO_INSERT : null));
        return l._add(r),
          l._closed = s,
          l.set(o, oe.INSERT)
      }
      function i(r, s, u) {
        for (var o = new Array(4), l = 0; l < 4; l++) {
          var f = t[l];
          o[l] = new pe(f._point.multiply(s).add(r),f._handleIn.multiply(s),f._handleOut.multiply(s))
        }
        return n(o, !0, u)
      }
      return {
        Line: function() {
          var r = arguments;
          return n([new pe(C.readNamed(r, "from")), new pe(C.readNamed(r, "to"))], !1, r)
        },
        Circle: function() {
          var r = arguments
            , s = C.readNamed(r, "center")
            , u = d.readNamed(r, "radius");
          return i(s, new J(u), r)
        },
        Rectangle: function() {
          var r = arguments, s = Y.readNamed(r, "rectangle"), u = J.readNamed(r, "radius", 0, {
            readNull: !0
          }), o = s.getBottomLeft(!0), l = s.getTopLeft(!0), f = s.getTopRight(!0), g = s.getBottomRight(!0), y;
          if (!u || u.isZero())
            y = [new pe(o), new pe(l), new pe(f), new pe(g)];
          else {
            u = J.min(u, s.getSize(!0).divide(2));
            var _ = u.width
              , v = u.height
              , b = _ * e
              , T = v * e;
            y = [new pe(o.add(_, 0),null,[-b, 0]), new pe(o.subtract(0, v),[0, T]), new pe(l.add(0, v),null,[0, -T]), new pe(l.add(_, 0),[-b, 0],null), new pe(f.subtract(_, 0),null,[b, 0]), new pe(f.add(0, v),[0, -T],null), new pe(g.subtract(0, v),null,[0, T]), new pe(g.subtract(_, 0),[b, 0])]
          }
          return n(y, !0, r)
        },
        RoundRectangle: "#Rectangle",
        Ellipse: function() {
          var r = arguments
            , s = je._readEllipse(r);
          return i(s.center, s.radius, r)
        },
        Oval: "#Ellipse",
        Arc: function() {
          var r = arguments
            , s = C.readNamed(r, "from")
            , u = C.readNamed(r, "through")
            , o = C.readNamed(r, "to")
            , l = d.getNamed(r)
            , f = new ke(l && l.insert == !1 && oe.NO_INSERT);
          return f.moveTo(s),
            f.arcTo(u, o),
            f.set(l)
        },
        RegularPolygon: function() {
          for (var r = arguments, s = C.readNamed(r, "center"), u = d.readNamed(r, "sides"), o = d.readNamed(r, "radius"), l = 360 / u, f = u % 3 === 0, g = new C(0,f ? -o : o), y = f ? -1 : .5, _ = new Array(u), v = 0; v < u; v++)
            _[v] = new pe(s.add(g.rotate((v + y) * l)));
          return n(_, !0, r)
        },
        Star: function() {
          for (var r = arguments, s = C.readNamed(r, "center"), u = d.readNamed(r, "points") * 2, o = d.readNamed(r, "radius1"), l = d.readNamed(r, "radius2"), f = 360 / u, g = new C(0,-1), y = new Array(u), _ = 0; _ < u; _++)
            y[_] = new pe(s.add(g.rotate(f * _).multiply(_ % 2 ? l : o)));
          return n(y, !0, r)
        }
      }
    }
  });
  var ot = Ft.extend({
      _class: "CompoundPath",
      _serializeFields: {
        children: []
      },
      beans: !0,
      initialize: function(t) {
        this._children = [],
          this._namedChildren = {},
        this._initialize(t) || (typeof t == "string" ? this.setPathData(t) : this.addChildren(Array.isArray(t) ? t : arguments))
      },
      insertChildren: function e(t, n) {
        var i = n
          , r = i[0];
        r && typeof r[0] == "number" && (i = [i]);
        for (var s = n.length - 1; s >= 0; s--) {
          var u = i[s];
          i === n && !(u instanceof ke) && (i = d.slice(i)),
            Array.isArray(u) ? i[s] = new ke({
              segments: u,
              insert: !1
            }) : u instanceof ot && (i.splice.apply(i, [s, 1].concat(u.removeChildren())),
              u.remove())
        }
        return e.base.call(this, t, i)
      },
      reduce: function e(t) {
        for (var n = this._children, i = n.length - 1; i >= 0; i--) {
          var r = n[i].reduce(t);
          r.isEmpty() && r.remove()
        }
        if (!n.length) {
          var r = new ke(oe.NO_INSERT);
          return r.copyAttributes(this),
            r.insertAbove(this),
            this.remove(),
            r
        }
        return e.base.call(this)
      },
      isClosed: function() {
        for (var e = this._children, t = 0, n = e.length; t < n; t++)
          if (!e[t]._closed)
            return !1;
        return !0
      },
      setClosed: function(e) {
        for (var t = this._children, n = 0, i = t.length; n < i; n++)
          t[n].setClosed(e)
      },
      getFirstSegment: function() {
        var e = this.getFirstChild();
        return e && e.getFirstSegment()
      },
      getLastSegment: function() {
        var e = this.getLastChild();
        return e && e.getLastSegment()
      },
      getCurves: function() {
        for (var e = this._children, t = [], n = 0, i = e.length; n < i; n++)
          d.push(t, e[n].getCurves());
        return t
      },
      getFirstCurve: function() {
        var e = this.getFirstChild();
        return e && e.getFirstCurve()
      },
      getLastCurve: function() {
        var e = this.getLastChild();
        return e && e.getLastCurve()
      },
      getArea: function() {
        for (var e = this._children, t = 0, n = 0, i = e.length; n < i; n++)
          t += e[n].getArea();
        return t
      },
      getLength: function() {
        for (var e = this._children, t = 0, n = 0, i = e.length; n < i; n++)
          t += e[n].getLength();
        return t
      },
      getPathData: function(e, t) {
        for (var n = this._children, i = [], r = 0, s = n.length; r < s; r++) {
          var u = n[r]
            , o = u._matrix;
          i.push(u.getPathData(e && !o.isIdentity() ? e.appended(o) : e, t))
        }
        return i.join("")
      },
      _hitTestChildren: function e(t, n, i) {
        return e.base.call(this, t, n.class === ke || n.type === "path" ? n : d.set({}, n, {
          fill: !1
        }), i)
      },
      _draw: function(e, t, n, i) {
        var r = this._children;
        if (r.length) {
          t = t.extend({
            dontStart: !0,
            dontFinish: !0
          }),
            e.beginPath();
          for (var s = 0, u = r.length; s < u; s++)
            r[s].draw(e, t, i);
          if (!t.clip) {
            this._setStyles(e, t, n);
            var o = this._style;
            o.hasFill() && (e.fill(o.getFillRule()),
              e.shadowColor = "rgba(0,0,0,0)"),
            o.hasStroke() && e.stroke()
          }
        }
      },
      _drawSelected: function(e, t, n) {
        for (var i = this._children, r = 0, s = i.length; r < s; r++) {
          var u = i[r]
            , o = u._matrix;
          n[u._id] || u._drawSelected(e, o.isIdentity() ? t : t.appended(o))
        }
      }
    }, new function() {
      function e(t, n) {
        var i = t._children;
        if (n && !i.length)
          throw new Error("Use a moveTo() command first");
        return i[i.length - 1]
      }
      return d.each(["lineTo", "cubicCurveTo", "quadraticCurveTo", "curveTo", "arcTo", "lineBy", "cubicCurveBy", "quadraticCurveBy", "curveBy", "arcBy"], function(t) {
        this[t] = function() {
          var n = e(this, !0);
          n[t].apply(n, arguments)
        }
      }, {
        moveTo: function() {
          var t = e(this)
            , n = t && t.isEmpty() ? t : new ke(oe.NO_INSERT);
          n !== t && this.addChild(n),
            n.moveTo.apply(n, arguments)
        },
        moveBy: function() {
          var t = e(this, !0)
            , n = t && t.getLastSegment()
            , i = C.read(arguments);
          this.moveTo(n ? i.add(n._point) : i)
        },
        closePath: function(t) {
          e(this, !0).closePath(t)
        }
      })
    }
    , d.each(["reverse", "flatten", "simplify", "smooth"], function(e) {
      this[e] = function(t) {
        for (var n = this._children, i, r = 0, s = n.length; r < s; r++)
          i = n[r][e](t) || i;
        return i
      }
    }, {}));
  Ft.inject(new function() {
      var e = Math.min
        , t = Math.max
        , n = Math.abs
        , i = {
        unite: {
          1: !0,
          2: !0
        },
        intersect: {
          2: !0
        },
        subtract: {
          1: !0
        },
        exclude: {
          1: !0,
          "-1": !0
        }
      };
      function r(S) {
        return S._children || [S]
      }
      function s(S, I) {
        var m = S.clone(!1).reduce({
          simplify: !0
        }).transform(null, !0, !0);
        if (I) {
          for (var w = r(m), E = 0, A = w.length; E < A; E++) {
            var S = w[E];
            !S._closed && !S.isEmpty() && (S.closePath(1e-12),
              S.getFirstSegment().setHandleIn(0, 0),
              S.getLastSegment().setHandleOut(0, 0))
          }
          m = m.resolveCrossings().reorient(m.getFillRule() === "nonzero", !0)
        }
        return m
      }
      function u(S, I, m, w, E) {
        var A = new ot(oe.NO_INSERT);
        return A.addChildren(S, !0),
          A = A.reduce({
            simplify: I
          }),
        E && E.insert == !1 || A.insertAbove(w && m.isSibling(w) && m.getIndex() < w.getIndex() ? w : m),
          A.copyAttributes(m, !0),
          A
      }
      function o(S) {
        return S.hasOverlap() || S.isCrossing()
      }
      function l(S, I, m, w) {
        if (w && (w.trace == !1 || w.stroke) && /^(subtract|intersect)$/.test(m))
          return f(S, I, m);
        var E = s(S, !0)
          , A = I && S !== I && s(I, !0)
          , N = i[m];
        N[m] = !0,
        A && (N.subtract || N.exclude) ^ (A.isClockwise() ^ E.isClockwise()) && A.reverse();
        var L = v(Ot.expand(E.getIntersections(A, o))), R = r(E), D = A && r(A), V = [], z = [], G;
        function H(Te) {
          for (var Ge = 0, Re = Te.length; Ge < Re; Ge++) {
            var xe = Te[Ge];
            d.push(V, xe._segments),
              d.push(z, xe.getCurves()),
              xe._overlapsOnly = !0
          }
        }
        function K(Te) {
          for (var Ge = [], Re = 0, xe = Te && Te.length; Re < xe; Re++)
            Ge.push(z[Te[Re]]);
          return Ge
        }
        if (L.length) {
          H(R),
          D && H(D);
          for (var $ = new Array(z.length), W = 0, te = z.length; W < te; W++)
            $[W] = z[W].getValues();
          for (var se = q.findCurveBoundsCollisions($, $, 0, !0), ue = {}, W = 0; W < z.length; W++) {
            var Ie = z[W]
              , Ee = Ie._path._id
              , de = ue[Ee] = ue[Ee] || {};
            de[Ie.getIndex()] = {
              hor: K(se[W].hor),
              ver: K(se[W].ver)
            }
          }
          for (var W = 0, te = L.length; W < te; W++)
            T(L[W]._segment, E, A, ue, N);
          for (var W = 0, te = V.length; W < te; W++) {
            var ve = V[W]
              , Oe = ve._intersection;
            ve._winding || T(ve, E, A, ue, N),
            Oe && Oe._overlap || (ve._path._overlapsOnly = !1)
          }
          G = x(V, N)
        } else
          G = _(D ? R.concat(D) : R.slice(), function(Te) {
            return !!N[Te]
          });
        return u(G, !0, S, I, w)
      }
      function f(S, I, m) {
        var w = s(S)
          , E = s(I)
          , A = w.getIntersections(E, o)
          , N = m === "subtract"
          , L = m === "divide"
          , R = {}
          , D = [];
        function V(H) {
          if (!R[H._id] && (L || E.contains(H.getPointAt(H.getLength() / 2)) ^ N))
            return D.unshift(H),
              R[H._id] = !0
        }
        for (var z = A.length - 1; z >= 0; z--) {
          var G = A[z].split();
          G && (V(G) && G.getFirstSegment().setHandleIn(0, 0),
            w.getLastSegment().setHandleOut(0, 0))
        }
        return V(w),
          u(D, !1, S, I)
      }
      function g(S, I) {
        for (var m = S; m; ) {
          if (m === I)
            return;
          m = m._previous
        }
        for (; S._next && S._next !== I; )
          S = S._next;
        if (!S._next) {
          for (; I._previous; )
            I = I._previous;
          S._next = I,
            I._previous = S
        }
      }
      function y(S) {
        for (var I = S.length - 1; I >= 0; I--)
          S[I].clearHandles()
      }
      function _(S, I, m) {
        var w = S && S.length;
        if (w) {
          var E = d.each(S, function(se, ue) {
            this[se._id] = {
              container: null,
              winding: se.isClockwise() ? 1 : -1,
              index: ue
            }
          }, {})
            , A = S.slice().sort(function(se, ue) {
            return n(ue.getArea()) - n(se.getArea())
          })
            , N = A[0]
            , L = q.findItemBoundsCollisions(A, null, O.GEOMETRIC_EPSILON);
          m == null && (m = N.isClockwise());
          for (var R = 0; R < w; R++) {
            var D = A[R]
              , V = E[D._id]
              , z = 0
              , G = L[R];
            if (G) {
              for (var H = null, K = G.length - 1; K >= 0; K--)
                if (G[K] < R) {
                  H = H || D.getInteriorPoint();
                  var $ = A[G[K]];
                  if ($.contains(H)) {
                    var W = E[$._id];
                    z = W.winding,
                      V.winding += z,
                      V.container = W.exclude ? W.container : $;
                    break
                  }
                }
            }
            if (I(V.winding) === I(z))
              V.exclude = !0,
                S[V.index] = null;
            else {
              var te = V.container;
              D.setClockwise(te ? !te.isClockwise() : m)
            }
          }
        }
        return S
      }
      function v(S, I, m) {
        var w = I && [], E = 1e-8, A = 1 - E, N = !1, L = m || [], R = m && {}, D, V, z;
        function G(Ge) {
          return Ge._path._id + "." + Ge._segment1._index
        }
        for (var H = (m && m.length) - 1; H >= 0; H--) {
          var K = m[H];
          K._path && (R[G(K)] = !0)
        }
        for (var H = S.length - 1; H >= 0; H--) {
          var $ = S[H], W = $._time, te = W, se = I && !I($), K = $._curve, ue;
          if (K && (K !== V ? (N = !K.hasHandles() || R && R[G(K)],
            D = [],
            z = null,
            V = K) : z >= E && (W /= z)),
            se) {
            D && D.push($);
            continue
          } else
            I && w.unshift($);
          if (z = te,
          W < E)
            ue = K._segment1;
          else if (W > A)
            ue = K._segment2;
          else {
            var Ie = K.divideAtTime(W, !0);
            N && L.push(K, Ie),
              ue = Ie._segment1;
            for (var Ee = D.length - 1; Ee >= 0; Ee--) {
              var de = D[Ee];
              de._time = (de._time - W) / (1 - W)
            }
          }
          $._setSegment(ue);
          var ve = ue._intersection
            , Oe = $._intersection;
          if (ve) {
            g(ve, Oe);
            for (var Te = ve; Te; )
              g(Te._intersection, ve),
                Te = Te._next
          } else
            ue._intersection = Oe
        }
        return m || y(L),
        w || S
      }
      function b(S, I, m, w, E) {
        var A = Array.isArray(I) ? I : I[m ? "hor" : "ver"], N = m ? 1 : 0, L = N ^ 1, R = [S.x, S.y], D = R[N], V = R[L], z = 1e-9, G = 1e-6, H = D - z, K = D + z, $ = 0, W = 0, te = 0, se = 0, ue = !1, Ie = !1, Ee = 1, de = [], ve, Oe;
        function Te(Ye) {
          var ut = Ye[L + 0]
            , st = Ye[L + 6];
          if (!(V < e(ut, st) || V > t(ut, st))) {
            var vt = Ye[N + 0]
              , Ht = Ye[N + 2]
              , fn = Ye[N + 4]
              , jt = Ye[N + 6];
            if (ut === st) {
              (vt < K && jt > H || jt < K && vt > H) && (ue = !0);
              return
            }
            var Yt = V === ut ? 0 : V === st || H > t(vt, Ht, fn, jt) || K < e(vt, Ht, fn, jt) ? 1 : re.solveCubic(Ye, L, V, de, 0, 1) > 0 ? de[0] : 1
              , Dt = Yt === 0 ? vt : Yt === 1 ? jt : re.getPoint(Ye, Yt)[m ? "y" : "x"]
              , Ct = ut > st ? 1 : -1
              , Tn = ve[L] > ve[L + 6] ? 1 : -1
              , $t = ve[N + 6];
            return V !== ut ? (Dt < H ? te += Ct : Dt > K ? se += Ct : ue = !0,
            Dt > D - G && Dt < D + G && (Ee /= 2)) : (Ct !== Tn ? vt < H ? te += Ct : vt > K && (se += Ct) : vt != $t && ($t < K && Dt > K ? (se += Ct,
              ue = !0) : $t > H && Dt < H && (te += Ct,
              ue = !0)),
              Ee /= 4),
              ve = Ye,
            !E && Dt > H && Dt < K && re.getTangent(Ye, Yt)[m ? "x" : "y"] === 0 && b(S, I, !m, w, !0)
          }
        }
        function Ge(Ye) {
          var ut = Ye[L + 0]
            , st = Ye[L + 2]
            , vt = Ye[L + 4]
            , Ht = Ye[L + 6];
          if (V <= t(ut, st, vt, Ht) && V >= e(ut, st, vt, Ht)) {
            for (var fn = Ye[N + 0], jt = Ye[N + 2], Yt = Ye[N + 4], Dt = Ye[N + 6], Ct = H > t(fn, jt, Yt, Dt) || K < e(fn, jt, Yt, Dt) ? [Ye] : re.getMonoCurves(Ye, m), Tn, $t = 0, Oi = Ct.length; $t < Oi; $t++)
              if (Tn = Te(Ct[$t]))
                return Tn
          }
        }
        for (var Re = 0, xe = A.length; Re < xe; Re++) {
          var ze = A[Re], De = ze._path, _t = ze.getValues(), gt;
          if ((!Re || A[Re - 1]._path !== De) && (ve = null,
          De._closed || (Oe = re.getValues(De.getLastCurve().getSegment2(), ze.getSegment1(), null, !w),
          Oe[L] !== Oe[L + 6] && (ve = Oe)),
            !ve)) {
            ve = _t;
            for (var Et = De.getLastCurve(); Et && Et !== ze; ) {
              var nt = Et.getValues();
              if (nt[L] !== nt[L + 6]) {
                ve = nt;
                break
              }
              Et = Et.getPrevious()
            }
          }
          if (gt = Ge(_t))
            return gt;
          if (Re + 1 === xe || A[Re + 1]._path !== De) {
            if (Oe && (gt = Ge(Oe)))
              return gt;
            ue && !te && !se && (te = se = De.isClockwise(w) ^ m ? 1 : -1),
              $ += te,
              W += se,
              te = se = 0,
            ue && (Ie = !0,
              ue = !1),
              Oe = null
          }
        }
        return $ = n($),
          W = n(W),
          {
            winding: t($, W),
            windingL: $,
            windingR: W,
            quality: Ee,
            onPath: Ie
          }
      }
      function T(S, I, m, w, E) {
        var A = [], N = S, L = 0, z;
        do {
          var R = S.getCurve();
          if (R) {
            var D = R.getLength();
            A.push({
              segment: S,
              curve: R,
              length: D
            }),
              L += D
          }
          S = S.getNext()
        } while (S && !S._intersection && S !== N);
        for (var V = [.5, .25, .75], z = {
          winding: 0,
          quality: -1
        }, G = .001, H = 1 - G, K = 0; K < V.length && z.quality < .5; K++)
          for (var D = L * V[K], $ = 0, W = A.length; $ < W; $++) {
            var te = A[$]
              , se = te.length;
            if (D <= se) {
              var R = te.curve
                , ue = R._path
                , Ie = ue._parent
                , Ee = Ie instanceof ot ? Ie : ue
                , de = O.clamp(R.getTimeAt(D), G, H)
                , ve = R.getPointAtTime(de)
                , Oe = n(R.getTangentAtTime(de).y) < Math.SQRT1_2
                , Te = null;
              if (E.subtract && m) {
                var Ge = Ee === I ? m : I
                  , Re = Ge._getWinding(ve, Oe, !0);
                if (Ee === I && Re.winding || Ee === m && !Re.winding) {
                  if (Re.quality < 1)
                    continue;
                  Te = {
                    winding: 0,
                    quality: 1
                  }
                }
              }
              Te = Te || b(ve, w[ue._id][R.getIndex()], Oe, !0),
              Te.quality > z.quality && (z = Te);
              break
            }
            D -= se
          }
        for (var $ = A.length - 1; $ >= 0; $--)
          A[$].segment._winding = z
      }
      function x(S, I) {
        var m = [], w;
        function E(xe) {
          var ze;
          return !!(xe && !xe._visited && (!I || I[(ze = xe._winding || {}).winding] && !(I.unite && ze.winding === 2 && ze.windingL && ze.windingR)))
        }
        function A(xe) {
          if (xe) {
            for (var ze = 0, De = w.length; ze < De; ze++)
              if (xe === w[ze])
                return !0
          }
          return !1
        }
        function N(xe) {
          for (var ze = xe._segments, De = 0, _t = ze.length; De < _t; De++)
            ze[De]._visited = !0
        }
        function L(xe, ze) {
          var De = xe._intersection
            , _t = De
            , gt = [];
          ze && (w = [xe]);
          function Et(nt, Ye) {
            for (; nt && nt !== Ye; ) {
              var ut = nt._segment
                , st = ut && ut._path;
              if (st) {
                var vt = ut.getNext() || st.getFirstSegment()
                  , Ht = vt._intersection;
                ut !== xe && (A(ut) || A(vt) || vt && E(ut) && (E(vt) || Ht && E(Ht._segment))) && gt.push(ut),
                ze && w.push(ut)
              }
              nt = nt._next
            }
          }
          if (De) {
            for (Et(De); De && De._previous; )
              De = De._previous;
            Et(De, _t)
          }
          return gt
        }
        S.sort(function(xe, ze) {
          var De = xe._intersection
            , _t = ze._intersection
            , gt = !!(De && De._overlap)
            , Et = !!(_t && _t._overlap)
            , nt = xe._path
            , Ye = ze._path;
          return gt ^ Et ? gt ? 1 : -1 : !De ^ !_t ? De ? 1 : -1 : nt !== Ye ? nt._id - Ye._id : xe._index - ze._index
        });
        for (var R = 0, D = S.length; R < D; R++) {
          var V = S[R], z = E(V), G = null, H = !1, K = !0, $ = [], W, te, se;
          if (z && V._path._overlapsOnly) {
            var ue = V._path
              , Ie = V._intersection._segment._path;
            ue.compare(Ie) && (ue.getArea() && m.push(ue.clone(!1)),
              N(ue),
              N(Ie),
              z = !1)
          }
          for (; z; ) {
            var Ee = !G
              , de = L(V, Ee)
              , ve = de.shift()
              , H = !Ee && (A(V) || A(ve))
              , Oe = !H && ve;
            if (Ee && (G = new ke(oe.NO_INSERT),
              W = null),
              H) {
              (V.isFirst() || V.isLast()) && (K = V._path._closed),
                V._visited = !0;
              break
            }
            if (Oe && W && ($.push(W),
              W = null),
            W || (Oe && de.push(V),
              W = {
                start: G._segments.length,
                crossings: de,
                visited: te = [],
                handleIn: se
              }),
            Oe && (V = ve),
              !E(V)) {
              G.removeSegments(W.start);
              for (var Te = 0, Ge = te.length; Te < Ge; Te++)
                te[Te]._visited = !1;
              te.length = 0;
              do
                V = W && W.crossings.shift(),
                (!V || !V._path) && (V = null,
                  W = $.pop(),
                W && (te = W.visited,
                  se = W.handleIn));
              while (W && !E(V));
              if (!V)
                break
            }
            var Re = V.getNext();
            G.add(new pe(V._point,se,Re && V._handleOut)),
              V._visited = !0,
              te.push(V),
              V = Re || V._path.getFirstSegment(),
              se = Re && Re._handleIn
          }
          H && (K && (G.getFirstSegment().setHandleIn(se),
            G.setClosed(K)),
          G.getArea() !== 0 && m.push(G))
        }
        return m
      }
      return {
        _getWinding: function(S, I, m) {
          return b(S, this.getCurves(), I, m)
        },
        unite: function(S, I) {
          return l(this, S, "unite", I)
        },
        intersect: function(S, I) {
          return l(this, S, "intersect", I)
        },
        subtract: function(S, I) {
          return l(this, S, "subtract", I)
        },
        exclude: function(S, I) {
          return l(this, S, "exclude", I)
        },
        divide: function(S, I) {
          return I && (I.trace == !1 || I.stroke) ? f(this, S, "divide") : u([this.subtract(S, I), this.intersect(S, I)], !0, this, S, I)
        },
        resolveCrossings: function() {
          var S = this._children
            , I = S || [this];
          function m(W, te) {
            var se = W && W._intersection;
            return se && se._overlap && se._path === te
          }
          var w = !1
            , E = !1
            , A = this.getIntersections(null, function(W) {
            return W.hasOverlap() && (w = !0) || W.isCrossing() && (E = !0)
          })
            , N = w && E && [];
          if (A = Ot.expand(A),
            w)
            for (var L = v(A, function(W) {
              return W.hasOverlap()
            }, N), R = L.length - 1; R >= 0; R--) {
              var D = L[R]
                , V = D._path
                , z = D._segment
                , G = z.getPrevious()
                , H = z.getNext();
              m(G, V) && m(H, V) && (z.remove(),
                G._handleOut._set(0, 0),
                H._handleIn._set(0, 0),
              G !== z && !G.getCurve().hasLength() && (H._handleIn.set(G._handleIn),
                G.remove()))
            }
          E && (v(A, w && function(W) {
            var te = W.getCurve()
              , se = W.getSegment()
              , ue = W._intersection
              , Ie = ue._curve
              , Ee = ue._segment;
            if (te && Ie && te._path && Ie._path)
              return !0;
            se && (se._intersection = null),
            Ee && (Ee._intersection = null)
          }
            , N),
          N && y(N),
            I = x(d.each(I, function(W) {
              d.push(this, W._segments)
            }, [])));
          var K = I.length, $;
          return K > 1 && S ? (I !== S && this.setChildren(I),
            $ = this) : K === 1 && !S && (I[0] !== this && this.setSegments(I[0].removeSegments()),
            $ = this),
          $ || ($ = new ot(oe.NO_INSERT),
            $.addChildren(I),
            $ = $.reduce(),
            $.copyAttributes(this),
            this.replaceWith($)),
            $
        },
        reorient: function(S, I) {
          var m = this._children;
          return m && m.length ? this.setChildren(_(this.removeChildren(), function(w) {
            return !!(S ? w : w & 1)
          }, I)) : I !== a && this.setClockwise(I),
            this
        },
        getInteriorPoint: function() {
          var S = this.getBounds()
            , I = S.getCenter(!0);
          if (!this.contains(I)) {
            for (var m = this.getCurves(), w = I.y, E = [], A = [], N = 0, L = m.length; N < L; N++) {
              var R = m[N].getValues()
                , D = R[1]
                , V = R[3]
                , z = R[5]
                , G = R[7];
              if (w >= e(D, V, z, G) && w <= t(D, V, z, G))
                for (var H = re.getMonoCurves(R), K = 0, $ = H.length; K < $; K++) {
                  var W = H[K]
                    , te = W[1]
                    , se = W[7];
                  if (te !== se && (w >= te && w <= se || w >= se && w <= te)) {
                    var ue = w === te ? W[0] : w === se ? W[6] : re.solveCubic(W, 1, w, A, 0, 1) === 1 ? re.getPoint(W, A[0]).x : (W[0] + W[6]) / 2;
                    E.push(ue)
                  }
                }
            }
            E.length > 1 && (E.sort(function(Ie, Ee) {
              return Ie - Ee
            }),
              I.x = (E[0] + E[1]) / 2)
          }
          return I
        }
      }
    }
  );
  var kt = d.extend({
    _class: "PathFlattener",
    initialize: function(e, t, n, i, r) {
      var s = [], u = [], o = 0, l = 1 / (n || 32), f = e._segments, g = f[0], y;
      function _(x, S) {
        var I = re.getValues(x, S, r);
        s.push(I),
          v(I, x._index, 0, 1)
      }
      function v(x, S, I, m) {
        if (m - I > l && !(i && re.isStraight(x)) && !re.isFlatEnough(x, t || .25)) {
          var w = re.subdivide(x, .5)
            , E = (I + m) / 2;
          v(w[0], S, I, E),
            v(w[1], S, E, m)
        } else {
          var A = x[6] - x[0]
            , N = x[7] - x[1]
            , L = Math.sqrt(A * A + N * N);
          L > 0 && (o += L,
            u.push({
              offset: o,
              curve: x,
              index: S,
              time: m
            }))
        }
      }
      for (var b = 1, T = f.length; b < T; b++)
        y = f[b],
          _(g, y),
          g = y;
      e._closed && _(y || g, f[0]),
        this.curves = s,
        this.parts = u,
        this.length = o,
        this.index = 0
    },
    _get: function(e) {
      for (var t = this.parts, n = t.length, i, r, s = this.index; r = s,
        !(!s || t[--s].offset < e); )
        ;
      for (; r < n; r++) {
        var u = t[r];
        if (u.offset >= e) {
          this.index = r;
          var o = t[r - 1]
            , l = o && o.index === u.index ? o.time : 0
            , f = o ? o.offset : 0;
          return {
            index: u.index,
            time: l + (u.time - l) * (e - f) / (u.offset - f)
          }
        }
      }
      return {
        index: t[n - 1].index,
        time: 1
      }
    },
    drawPart: function(e, t, n) {
      for (var i = this._get(t), r = this._get(n), s = i.index, u = r.index; s <= u; s++) {
        var o = re.getPart(this.curves[s], s === i.index ? i.time : 0, s === r.index ? r.time : 1);
        s === i.index && e.moveTo(o[0], o[1]),
          e.bezierCurveTo.apply(e, o.slice(2))
      }
    }
  }, d.each(re._evaluateMethods, function(e) {
    this[e + "At"] = function(t) {
      var n = this._get(t);
      return re[e](this.curves[n.index], n.time)
    }
  }, {}))
    , yn = d.extend({
    initialize: function(e) {
      for (var t = this.points = [], n = e._segments, i = e._closed, r = 0, s, u = n.length; r < u; r++) {
        var o = n[r].point;
        (!s || !s.equals(o)) && t.push(s = o.clone())
      }
      i && (t.unshift(t[t.length - 1]),
        t.push(t[1])),
        this.closed = i
    },
    fit: function(e) {
      var t = this.points
        , n = t.length
        , i = null;
      return n > 0 && (i = [new pe(t[0])],
      n > 1 && (this.fitCubic(i, e, 0, n - 1, t[1].subtract(t[0]), t[n - 2].subtract(t[n - 1])),
      this.closed && (i.shift(),
        i.pop()))),
        i
    },
    fitCubic: function(e, t, n, i, r, s) {
      var u = this.points;
      if (i - n === 1) {
        var o = u[n]
          , l = u[i]
          , f = o.getDistance(l) / 3;
        this.addCurve(e, [o, o.add(r.normalize(f)), l.add(s.normalize(f)), l]);
        return
      }
      for (var g = this.chordLengthParameterize(n, i), y = Math.max(t, t * t), _, v = !0, b = 0; b <= 4; b++) {
        var T = this.generateBezier(n, i, g, r, s)
          , x = this.findMaxError(n, i, T, g);
        if (x.error < t && v) {
          this.addCurve(e, T);
          return
        }
        if (_ = x.index,
        x.error >= y)
          break;
        v = this.reparameterize(n, i, g, T),
          y = x.error
      }
      var S = u[_ - 1].subtract(u[_ + 1]);
      this.fitCubic(e, t, n, _, r, S),
        this.fitCubic(e, t, _, i, S.negate(), s)
    },
    addCurve: function(e, t) {
      var n = e[e.length - 1];
      n.setHandleOut(t[1].subtract(t[0])),
        e.push(new pe(t[3],t[2].subtract(t[3])))
    },
    generateBezier: function(e, t, n, i, r) {
      for (var s = 1e-12, u = Math.abs, o = this.points, l = o[e], f = o[t], g = [[0, 0], [0, 0]], y = [0, 0], _ = 0, v = t - e + 1; _ < v; _++) {
        var b = n[_]
          , T = 1 - b
          , x = 3 * b * T
          , S = T * T * T
          , I = x * T
          , m = x * b
          , w = b * b * b
          , E = i.normalize(I)
          , A = r.normalize(m)
          , N = o[e + _].subtract(l.multiply(S + I)).subtract(f.multiply(m + w));
        g[0][0] += E.dot(E),
          g[0][1] += E.dot(A),
          g[1][0] = g[0][1],
          g[1][1] += A.dot(A),
          y[0] += E.dot(N),
          y[1] += A.dot(N)
      }
      var L = g[0][0] * g[1][1] - g[1][0] * g[0][1], R, D;
      if (u(L) > s) {
        var V = g[0][0] * y[1] - g[1][0] * y[0]
          , z = y[0] * g[1][1] - y[1] * g[0][1];
        R = z / L,
          D = V / L
      } else {
        var G = g[0][0] + g[0][1]
          , H = g[1][0] + g[1][1];
        R = D = u(G) > s ? y[0] / G : u(H) > s ? y[1] / H : 0
      }
      var K = f.getDistance(l), $ = s * K, W, te;
      if (R < $ || D < $)
        R = D = K / 3;
      else {
        var se = f.subtract(l);
        W = i.normalize(R),
          te = r.normalize(D),
        W.dot(se) - te.dot(se) > K * K && (R = D = K / 3,
          W = te = null)
      }
      return [l, l.add(W || i.normalize(R)), f.add(te || r.normalize(D)), f]
    },
    reparameterize: function(e, t, n, i) {
      for (var r = e; r <= t; r++)
        n[r - e] = this.findRoot(i, this.points[r], n[r - e]);
      for (var r = 1, s = n.length; r < s; r++)
        if (n[r] <= n[r - 1])
          return !1;
      return !0
    },
    findRoot: function(e, t, n) {
      for (var i = [], r = [], s = 0; s <= 2; s++)
        i[s] = e[s + 1].subtract(e[s]).multiply(3);
      for (var s = 0; s <= 1; s++)
        r[s] = i[s + 1].subtract(i[s]).multiply(2);
      var u = this.evaluate(3, e, n)
        , o = this.evaluate(2, i, n)
        , l = this.evaluate(1, r, n)
        , f = u.subtract(t)
        , g = o.dot(o) + f.dot(l);
      return O.isMachineZero(g) ? n : n - f.dot(o) / g
    },
    evaluate: function(e, t, n) {
      for (var i = t.slice(), r = 1; r <= e; r++)
        for (var s = 0; s <= e - r; s++)
          i[s] = i[s].multiply(1 - n).add(i[s + 1].multiply(n));
      return i[0]
    },
    chordLengthParameterize: function(e, t) {
      for (var n = [0], i = e + 1; i <= t; i++)
        n[i - e] = n[i - e - 1] + this.points[i].getDistance(this.points[i - 1]);
      for (var i = 1, r = t - e; i <= r; i++)
        n[i] /= n[r];
      return n
    },
    findMaxError: function(e, t, n, i) {
      for (var r = Math.floor((t - e + 1) / 2), s = 0, u = e + 1; u < t; u++) {
        var o = this.evaluate(3, n, i[u - e])
          , l = o.subtract(this.points[u])
          , f = l.x * l.x + l.y * l.y;
        f >= s && (s = f,
          r = u)
      }
      return {
        error: s,
        index: r
      }
    }
  })
    , Gt = oe.extend({
    _class: "TextItem",
    _applyMatrix: !1,
    _canApplyMatrix: !1,
    _serializeFields: {
      content: null
    },
    _boundsOptions: {
      stroke: !1,
      handle: !1
    },
    initialize: function(t) {
      this._content = "",
        this._lines = [];
      var n = t && d.isPlainObject(t) && t.x === a && t.y === a;
      this._initialize(n && t, !n && C.read(arguments))
    },
    _equals: function(e) {
      return this._content === e._content
    },
    copyContent: function(e) {
      this.setContent(e._content)
    },
    getContent: function() {
      return this._content
    },
    setContent: function(e) {
      this._content = "" + e,
        this._lines = this._content.split(/\r\n|\n|\r/mg),
        this._changed(521)
    },
    isEmpty: function() {
      return !this._content
    },
    getCharacterStyle: "#getStyle",
    setCharacterStyle: "#setStyle",
    getParagraphStyle: "#getStyle",
    setParagraphStyle: "#setStyle"
  })
    , Mt = Gt.extend({
    _class: "PointText",
    initialize: function() {
      Gt.apply(this, arguments)
    },
    getPoint: function() {
      var e = this._matrix.getTranslation();
      return new Q(e.x,e.y,this,"setPoint")
    },
    setPoint: function() {
      var e = C.read(arguments);
      this.translate(e.subtract(this._matrix.getTranslation()))
    },
    _draw: function(e, t, n) {
      if (this._content) {
        this._setStyles(e, t, n);
        var i = this._lines
          , r = this._style
          , s = r.hasFill()
          , u = r.hasStroke()
          , o = r.getLeading()
          , l = e.shadowColor;
        e.font = r.getFontStyle(),
          e.textAlign = r.getJustification();
        for (var f = 0, g = i.length; f < g; f++) {
          e.shadowColor = l;
          var y = i[f];
          s && (e.fillText(y, 0, 0),
            e.shadowColor = "rgba(0,0,0,0)"),
          u && e.strokeText(y, 0, 0),
            e.translate(0, o)
        }
      }
    },
    _getBounds: function(e, t) {
      var n = this._style
        , i = this._lines
        , r = i.length
        , s = n.getJustification()
        , u = n.getLeading()
        , o = this.getView().getTextWidth(n.getFontStyle(), i)
        , l = 0;
      s !== "left" && (l -= o / (s === "center" ? 2 : 1));
      var f = new Y(l,r ? -.75 * u : 0,o,r * u);
      return e ? e._transformBounds(f, f) : f
    }
  })
    , Xe = d.extend(new function() {
      var e = {
        gray: ["gray"],
        rgb: ["red", "green", "blue"],
        hsb: ["hue", "saturation", "brightness"],
        hsl: ["hue", "saturation", "lightness"],
        gradient: ["gradient", "origin", "destination", "highlight"]
      }, t = {}, n = {
        transparent: [0, 0, 0, 0]
      }, i;
      function r(o) {
        var l = o.match(/^#([\da-f]{2})([\da-f]{2})([\da-f]{2})([\da-f]{2})?$/i) || o.match(/^#([\da-f])([\da-f])([\da-f])([\da-f])?$/i), f = "rgb", g;
        if (l) {
          var y = l[4] ? 4 : 3;
          g = new Array(y);
          for (var _ = 0; _ < y; _++) {
            var v = l[_ + 1];
            g[_] = parseInt(v.length == 1 ? v + v : v, 16) / 255
          }
        } else if (l = o.match(/^(rgb|hsl)a?\((.*)\)$/)) {
          f = l[1],
            g = l[2].trim().split(/[,\s]+/g);
          for (var b = f === "hsl", _ = 0, T = Math.min(g.length, 4); _ < T; _++) {
            var x = g[_]
              , v = parseFloat(x);
            if (b)
              if (_ === 0) {
                var S = x.match(/([a-z]*)$/)[1];
                v *= {
                  turn: 360,
                  rad: 180 / Math.PI,
                  grad: .9
                }[S] || 1
              } else
                _ < 3 && (v /= 100);
            else
              _ < 3 && (v /= /%$/.test(x) ? 100 : 255);
            g[_] = v
          }
        } else {
          var I = n[o];
          if (!I)
            if (h) {
              i || (i = Je.getContext(1, 1, {
                willReadFrequently: !0
              }),
                i.globalCompositeOperation = "copy"),
                i.fillStyle = "rgba(0,0,0,0)",
                i.fillStyle = o,
                i.fillRect(0, 0, 1, 1);
              var m = i.getImageData(0, 0, 1, 1).data;
              I = n[o] = [m[0] / 255, m[1] / 255, m[2] / 255]
            } else
              I = [0, 0, 0];
          g = I.slice()
        }
        return [f, g]
      }
      var s = [[0, 3, 1], [2, 0, 1], [1, 0, 3], [1, 2, 0], [3, 1, 0], [0, 1, 2]]
        , u = {
        "rgb-hsb": function(o, l, f) {
          var g = Math.max(o, l, f)
            , y = Math.min(o, l, f)
            , _ = g - y
            , v = _ === 0 ? 0 : (g == o ? (l - f) / _ + (l < f ? 6 : 0) : g == l ? (f - o) / _ + 2 : (o - l) / _ + 4) * 60;
          return [v, g === 0 ? 0 : _ / g, g]
        },
        "hsb-rgb": function(o, l, f) {
          o = (o / 60 % 6 + 6) % 6;
          var y = Math.floor(o)
            , g = o - y
            , y = s[y]
            , _ = [f, f * (1 - l), f * (1 - l * g), f * (1 - l * (1 - g))];
          return [_[y[0]], _[y[1]], _[y[2]]]
        },
        "rgb-hsl": function(o, l, f) {
          var g = Math.max(o, l, f)
            , y = Math.min(o, l, f)
            , _ = g - y
            , v = _ === 0
            , b = v ? 0 : (g == o ? (l - f) / _ + (l < f ? 6 : 0) : g == l ? (f - o) / _ + 2 : (o - l) / _ + 4) * 60
            , T = (g + y) / 2
            , x = v ? 0 : T < .5 ? _ / (g + y) : _ / (2 - g - y);
          return [b, x, T]
        },
        "hsl-rgb": function(o, l, f) {
          if (o = (o / 360 % 1 + 1) % 1,
          l === 0)
            return [f, f, f];
          for (var g = [o + 1 / 3, o, o - 1 / 3], y = f < .5 ? f * (1 + l) : f + l - f * l, _ = 2 * f - y, v = [], b = 0; b < 3; b++) {
            var T = g[b];
            T < 0 && (T += 1),
            T > 1 && (T -= 1),
              v[b] = 6 * T < 1 ? _ + (y - _) * 6 * T : 2 * T < 1 ? y : 3 * T < 2 ? _ + (y - _) * (2 / 3 - T) * 6 : _
          }
          return v
        },
        "rgb-gray": function(o, l, f) {
          return [o * .2989 + l * .587 + f * .114]
        },
        "gray-rgb": function(o) {
          return [o, o, o]
        },
        "gray-hsb": function(o) {
          return [0, 0, o]
        },
        "gray-hsl": function(o) {
          return [0, 0, o]
        },
        "gradient-rgb": function() {
          return []
        },
        "rgb-gradient": function() {
          return []
        }
      };
      return d.each(e, function(o, l) {
        t[l] = [],
          d.each(o, function(f, g) {
            var y = d.capitalize(f)
              , _ = /^(hue|saturation)$/.test(f)
              , v = t[l][g] = l === "gradient" ? f === "gradient" ? function(b) {
                    var T = this._components[0];
                    return b = xt.read(Array.isArray(b) ? b : arguments, 0, {
                      readNull: !0
                    }),
                    T !== b && (T && T._removeOwner(this),
                    b && b._addOwner(this)),
                      b
                  }
                  : function() {
                    return C.read(arguments, 0, {
                      readNull: f === "highlight",
                      clone: !0
                    })
                  }
                : function(b) {
                  return b == null || isNaN(b) ? 0 : +b
                }
            ;
            this["get" + y] = function() {
              return this._type === l || _ && /^hs[bl]$/.test(this._type) ? this._components[g] : this._convert(l)[g]
            }
              ,
              this["set" + y] = function(b) {
                this._type !== l && !(_ && /^hs[bl]$/.test(this._type)) && (this._components = this._convert(l),
                  this._properties = e[l],
                  this._type = l),
                  this._components[g] = v.call(this, b),
                  this._changed()
              }
          }, this)
      }, {
        _class: "Color",
        _readIndex: !0,
        initialize: function o(l) {
          var f = arguments, g = this.__read, y = 0, _, v, b, T;
          Array.isArray(l) && (f = l,
            l = f[0]);
          var x = l != null && typeof l;
          if (x === "string" && l in e && (_ = l,
            l = f[1],
            Array.isArray(l) ? (v = l,
              b = f[2]) : (g && (y = 1),
              f = d.slice(f, 1),
              x = typeof l)),
            !v) {
            if (T = x === "number" ? f : x === "object" && l.length != null ? l : null,
              T) {
              _ || (_ = T.length >= 3 ? "rgb" : "gray");
              var S = e[_].length;
              b = T[S],
              g && (y += T === arguments ? S + (b != null ? 1 : 0) : 1),
              T.length > S && (T = d.slice(T, 0, S))
            } else if (x === "string") {
              var I = r(l);
              _ = I[0],
                v = I[1],
              v.length === 4 && (b = v[3],
                v.length--)
            } else if (x === "object")
              if (l.constructor === o) {
                if (_ = l._type,
                  v = l._components.slice(),
                  b = l._alpha,
                _ === "gradient")
                  for (var m = 1, w = v.length; m < w; m++) {
                    var E = v[m];
                    E && (v[m] = E.clone())
                  }
              } else if (l.constructor === xt)
                _ = "gradient",
                  T = f;
              else {
                _ = "hue"in l ? "lightness"in l ? "hsl" : "hsb" : "gradient"in l || "stops"in l || "radial"in l ? "gradient" : "gray"in l ? "gray" : "rgb";
                var A = e[_]
                  , N = t[_];
                this._components = v = [];
                for (var m = 0, w = A.length; m < w; m++) {
                  var L = l[A[m]];
                  L == null && !m && _ === "gradient" && "stops"in l && (L = {
                    stops: l.stops,
                    radial: l.radial
                  }),
                    L = N[m].call(this, L),
                  L != null && (v[m] = L)
                }
                b = l.alpha
              }
            g && _ && (y = 1)
          }
          if (this._type = _ || "rgb",
            !v) {
            this._components = v = [];
            for (var N = t[this._type], m = 0, w = N.length; m < w; m++) {
              var L = N[m].call(this, T && T[m]);
              L != null && (v[m] = L)
            }
          }
          return this._components = v,
            this._properties = e[this._type],
            this._alpha = b,
          g && (this.__read = y),
            this
        },
        set: "#initialize",
        _serialize: function(o, l) {
          var f = this.getComponents();
          return d.serialize(/^(gray|rgb)$/.test(this._type) ? f : [this._type].concat(f), o, !0, l)
        },
        _changed: function() {
          this._canvasStyle = null,
          this._owner && (this._setter ? this._owner[this._setter](this) : this._owner._changed(129))
        },
        _convert: function(o) {
          var l;
          return this._type === o ? this._components.slice() : (l = u[this._type + "-" + o]) ? l.apply(this, this._components) : u["rgb-" + o].apply(this, u[this._type + "-rgb"].apply(this, this._components))
        },
        convert: function(o) {
          return new Xe(o,this._convert(o),this._alpha)
        },
        getType: function() {
          return this._type
        },
        setType: function(o) {
          this._components = this._convert(o),
            this._properties = e[o],
            this._type = o
        },
        getComponents: function() {
          var o = this._components.slice();
          return this._alpha != null && o.push(this._alpha),
            o
        },
        getAlpha: function() {
          return this._alpha != null ? this._alpha : 1
        },
        setAlpha: function(o) {
          this._alpha = o == null ? null : Math.min(Math.max(o, 0), 1),
            this._changed()
        },
        hasAlpha: function() {
          return this._alpha != null
        },
        equals: function(o) {
          var l = d.isPlainValue(o, !0) ? Xe.read(arguments) : o;
          return l === this || l && this._class === l._class && this._type === l._type && this.getAlpha() === l.getAlpha() && d.equals(this._components, l._components) || !1
        },
        toString: function() {
          for (var o = this._properties, l = [], f = this._type === "gradient", g = k.instance, y = 0, _ = o.length; y < _; y++) {
            var v = this._components[y];
            v != null && l.push(o[y] + ": " + (f ? v : g.number(v)))
          }
          return this._alpha != null && l.push("alpha: " + g.number(this._alpha)),
          "{ " + l.join(", ") + " }"
        },
        toCSS: function(o) {
          var l = this._convert("rgb")
            , f = o || this._alpha == null ? 1 : this._alpha;
          function g(y) {
            return Math.round((y < 0 ? 0 : y > 1 ? 1 : y) * 255)
          }
          return l = [g(l[0]), g(l[1]), g(l[2])],
          f < 1 && l.push(f < 0 ? 0 : f),
            o ? "#" + ((1 << 24) + (l[0] << 16) + (l[1] << 8) + l[2]).toString(16).slice(1) : (l.length == 4 ? "rgba(" : "rgb(") + l.join(",") + ")"
        },
        toCanvasStyle: function(o, l) {
          if (this._canvasStyle)
            return this._canvasStyle;
          if (this._type !== "gradient")
            return this._canvasStyle = this.toCSS();
          var f = this._components, g = f[0], y = g._stops, _ = f[1], v = f[2], b = f[3], T = l && l.inverted(), x;
          if (T && (_ = T._transformPoint(_),
            v = T._transformPoint(v),
          b && (b = T._transformPoint(b))),
            g._radial) {
            var S = v.getDistance(_);
            if (b) {
              var I = b.subtract(_);
              I.getLength() > S && (b = _.add(I.normalize(S - .1)))
            }
            var m = b || _;
            x = o.createRadialGradient(m.x, m.y, 0, _.x, _.y, S)
          } else
            x = o.createLinearGradient(_.x, _.y, v.x, v.y);
          for (var w = 0, E = y.length; w < E; w++) {
            var A = y[w]
              , N = A._offset;
            x.addColorStop(N ?? w / (E - 1), A._color.toCanvasStyle())
          }
          return this._canvasStyle = x
        },
        transform: function(o) {
          if (this._type === "gradient") {
            for (var l = this._components, f = 1, g = l.length; f < g; f++) {
              var y = l[f];
              o._transformPoint(y, y, !0)
            }
            this._changed()
          }
        },
        statics: {
          _types: e,
          random: function() {
            var o = Math.random;
            return new Xe(o(),o(),o())
          },
          _setOwner: function(o, l, f) {
            return o && (o._owner && l && o._owner !== l && (o = o.clone()),
            !o._owner ^ !l && (o._owner = l || null,
              o._setter = f || null)),
              o
          }
        }
      })
    }
    , new function() {
      var e = {
        add: function(t, n) {
          return t + n
        },
        subtract: function(t, n) {
          return t - n
        },
        multiply: function(t, n) {
          return t * n
        },
        divide: function(t, n) {
          return t / n
        }
      };
      return d.each(e, function(t, n) {
        this[n] = function(i) {
          i = Xe.read(arguments);
          for (var r = this._type, s = this._components, u = i._convert(r), o = 0, l = s.length; o < l; o++)
            u[o] = t(s[o], u[o]);
          return new Xe(r,u,this._alpha != null ? t(this._alpha, i.getAlpha()) : null)
        }
      }, {})
    }
  )
    , xt = d.extend({
    _class: "Gradient",
    initialize: function(t, n) {
      this._id = B.get(),
      t && d.isPlainObject(t) && (this.set(t),
        t = n = null),
      this._stops == null && this.setStops(t || ["white", "black"]),
      this._radial == null && this.setRadial(typeof n == "string" && n === "radial" || n || !1)
    },
    _serialize: function(e, t) {
      return t.add(this, function() {
        return d.serialize([this._stops, this._radial], e, !0, t)
      })
    },
    _changed: function() {
      for (var e = 0, t = this._owners && this._owners.length; e < t; e++)
        this._owners[e]._changed()
    },
    _addOwner: function(e) {
      this._owners || (this._owners = []),
        this._owners.push(e)
    },
    _removeOwner: function(e) {
      var t = this._owners ? this._owners.indexOf(e) : -1;
      t != -1 && (this._owners.splice(t, 1),
      this._owners.length || (this._owners = a))
    },
    clone: function() {
      for (var e = [], t = 0, n = this._stops.length; t < n; t++)
        e[t] = this._stops[t].clone();
      return new xt(e,this._radial)
    },
    getStops: function() {
      return this._stops
    },
    setStops: function(e) {
      if (e.length < 2)
        throw new Error("Gradient stop list needs to contain at least two stops.");
      var t = this._stops;
      if (t)
        for (var n = 0, i = t.length; n < i; n++)
          t[n]._owner = a;
      t = this._stops = en.readList(e, 0, {
        clone: !0
      });
      for (var n = 0, i = t.length; n < i; n++)
        t[n]._owner = this;
      this._changed()
    },
    getRadial: function() {
      return this._radial
    },
    setRadial: function(e) {
      this._radial = e,
        this._changed()
    },
    equals: function(e) {
      if (e === this)
        return !0;
      if (e && this._class === e._class) {
        var t = this._stops
          , n = e._stops
          , i = t.length;
        if (i === n.length) {
          for (var r = 0; r < i; r++)
            if (!t[r].equals(n[r]))
              return !1;
          return !0
        }
      }
      return !1
    }
  })
    , en = d.extend({
    _class: "GradientStop",
    initialize: function(t, n) {
      var i = t
        , r = n;
      typeof t == "object" && n === a && (Array.isArray(t) && typeof t[0] != "number" ? (i = t[0],
        r = t[1]) : ("color"in t || "offset"in t || "rampPoint"in t) && (i = t.color,
        r = t.offset || t.rampPoint || 0)),
        this.setColor(i),
        this.setOffset(r)
    },
    clone: function() {
      return new en(this._color.clone(),this._offset)
    },
    _serialize: function(e, t) {
      var n = this._color
        , i = this._offset;
      return d.serialize(i == null ? [n] : [n, i], e, !0, t)
    },
    _changed: function() {
      this._owner && this._owner._changed(129)
    },
    getOffset: function() {
      return this._offset
    },
    setOffset: function(e) {
      this._offset = e,
        this._changed()
    },
    getRampPoint: "#getOffset",
    setRampPoint: "#setOffset",
    getColor: function() {
      return this._color
    },
    setColor: function() {
      Xe._setOwner(this._color, null),
        this._color = Xe._setOwner(Xe.read(arguments, 0), this, "setColor"),
        this._changed()
    },
    equals: function(e) {
      return e === this || e && this._class === e._class && this._color.equals(e._color) && this._offset == e._offset || !1
    }
  })
    , Kt = d.extend(new function() {
      var e = {
        fillColor: null,
        fillRule: "nonzero",
        strokeColor: null,
        strokeWidth: 1,
        strokeCap: "butt",
        strokeJoin: "miter",
        strokeScaling: !0,
        miterLimit: 10,
        dashOffset: 0,
        dashArray: [],
        shadowColor: null,
        shadowBlur: 0,
        shadowOffset: new C,
        selectedColor: null
      }
        , t = d.set({}, e, {
        fontFamily: "sans-serif",
        fontWeight: "normal",
        fontSize: 12,
        leading: null,
        justification: "left"
      })
        , n = d.set({}, t, {
        fillColor: new Xe
      })
        , i = {
        strokeWidth: 193,
        strokeCap: 193,
        strokeJoin: 193,
        strokeScaling: 201,
        miterLimit: 193,
        fontFamily: 9,
        fontWeight: 9,
        fontSize: 9,
        font: 9,
        leading: 9,
        justification: 9
      }
        , r = {
        beans: !0
      }
        , s = {
        _class: "Style",
        beans: !0,
        initialize: function(o, l, f) {
          this._values = {},
            this._owner = l,
            this._project = l && l._project || f || ae.project,
            this._defaults = !l || l instanceof We ? t : l instanceof Gt ? n : e,
          o && this.set(o)
        }
      };
      return d.each(t, function(u, o) {
        var l = /Color$/.test(o)
          , f = o === "shadowOffset"
          , g = d.capitalize(o)
          , y = i[o]
          , _ = "set" + g
          , v = "get" + g;
        s[_] = function(b) {
          var T = this._owner
            , x = T && T._children
            , S = x && x.length > 0 && !(T instanceof ot);
          if (S)
            for (var I = 0, m = x.length; I < m; I++)
              x[I]._style[_](b);
          if ((o === "selectedColor" || !S) && o in this._defaults) {
            var w = this._values[o];
            w !== b && (l && (w && (Xe._setOwner(w, null),
              w._canvasStyle = null),
            b && b.constructor === Xe && (b = Xe._setOwner(b, T, S && _))),
              this._values[o] = b,
            T && T._changed(y || 129))
          }
        }
          ,
          s[v] = function(b) {
            var T = this._owner, x = T && T._children, S = x && x.length > 0 && !(T instanceof ot), I;
            if (S && !b)
              for (var m = 0, w = x.length; m < w; m++) {
                var E = x[m]._style[v]();
                if (!m)
                  I = E;
                else if (!d.equals(I, E))
                  return a
              }
            else if (o in this._defaults) {
              var I = this._values[o];
              if (I === a)
                I = this._defaults[o],
                I && I.clone && (I = I.clone());
              else {
                var A = l ? Xe : f ? C : null;
                A && !(I && I.constructor === A) && (this._values[o] = I = A.read([I], 0, {
                  readNull: !0,
                  clone: !0
                }))
              }
            }
            return I && l && (I = Xe._setOwner(I, T, S && _)),
              I
          }
          ,
          r[v] = function(b) {
            return this._style[v](b)
          }
          ,
          r[_] = function(b) {
            this._style[_](b)
          }
      }),
        d.each({
          Font: "FontFamily",
          WindingRule: "FillRule"
        }, function(u, o) {
          var l = "get" + o
            , f = "set" + o;
          s[l] = r[l] = "#get" + u,
            s[f] = r[f] = "#set" + u
        }),
        oe.inject(r),
        s
    }
    , {
      set: function(e) {
        var t = e instanceof Kt
          , n = t ? e._values : e;
        if (n) {
          for (var i in n)
            if (i in this._defaults) {
              var r = n[i];
              this[i] = r && t && r.clone ? r.clone() : r
            }
        }
      },
      equals: function(e) {
        function t(n, i, r) {
          var s = n._values
            , u = i._values
            , o = i._defaults;
          for (var l in s) {
            var f = s[l]
              , g = u[l];
            if (!(r && l in u) && !d.equals(f, g === a ? o[l] : g))
              return !1
          }
          return !0
        }
        return e === this || e && this._class === e._class && t(this, e) && t(e, this, !0) || !1
      },
      _dispose: function() {
        var e;
        e = this.getFillColor(),
        e && (e._canvasStyle = null),
          e = this.getStrokeColor(),
        e && (e._canvasStyle = null),
          e = this.getShadowColor(),
        e && (e._canvasStyle = null)
      },
      hasFill: function() {
        var e = this.getFillColor();
        return !!e && e.alpha > 0
      },
      hasStroke: function() {
        var e = this.getStrokeColor();
        return !!e && e.alpha > 0 && this.getStrokeWidth() > 0
      },
      hasShadow: function() {
        var e = this.getShadowColor();
        return !!e && e.alpha > 0 && (this.getShadowBlur() > 0 || !this.getShadowOffset().isZero())
      },
      getView: function() {
        return this._project._view
      },
      getFontStyle: function() {
        var e = this.getFontSize();
        return this.getFontWeight() + " " + e + (/[a-z]/i.test(e + "") ? " " : "px ") + this.getFontFamily()
      },
      getFont: "#getFontFamily",
      setFont: "#setFontFamily",
      getLeading: function e() {
        var t = e.base.call(this)
          , n = this.getFontSize();
        return /pt|em|%|px/.test(n) && (n = this.getView().getPixelSize(n)),
        t ?? n * 1.2
      }
    })
    , Ce = new function() {
    function e(t, n, i, r) {
      for (var s = ["", "webkit", "moz", "Moz", "ms", "o"], u = n[0].toUpperCase() + n.substring(1), o = 0; o < 6; o++) {
        var l = s[o]
          , f = l ? l + u : n;
        if (f in t) {
          if (i)
            t[f] = r;
          else
            return t[f];
          break
        }
      }
    }
    return {
      getStyles: function(t) {
        var n = t && t.nodeType !== 9 ? t.ownerDocument : t
          , i = n && n.defaultView;
        return i && i.getComputedStyle(t, "")
      },
      getBounds: function(t, n) {
        var i = t.ownerDocument, r = i.body, s = i.documentElement, u;
        try {
          u = t.getBoundingClientRect()
        } catch {
          u = {
            left: 0,
            top: 0,
            width: 0,
            height: 0
          }
        }
        var o = u.left - (s.clientLeft || r.clientLeft || 0)
          , l = u.top - (s.clientTop || r.clientTop || 0);
        if (!n) {
          var f = i.defaultView;
          o += f.pageXOffset || s.scrollLeft || r.scrollLeft,
            l += f.pageYOffset || s.scrollTop || r.scrollTop
        }
        return new Y(o,l,u.width,u.height)
      },
      getViewportBounds: function(t) {
        var n = t.ownerDocument
          , i = n.defaultView
          , r = n.documentElement;
        return new Y(0,0,i.innerWidth || r.clientWidth,i.innerHeight || r.clientHeight)
      },
      getOffset: function(t, n) {
        return Ce.getBounds(t, n).getPoint()
      },
      getSize: function(t) {
        return Ce.getBounds(t, !0).getSize()
      },
      isInvisible: function(t) {
        return Ce.getSize(t).equals(new J(0,0))
      },
      isInView: function(t) {
        return !Ce.isInvisible(t) && Ce.getViewportBounds(t).intersects(Ce.getBounds(t, !0))
      },
      isInserted: function(t) {
        return p.body.contains(t)
      },
      getPrefixed: function(t, n) {
        return t && e(t, n)
      },
      setPrefixed: function(t, n, i) {
        if (typeof n == "object")
          for (var r in n)
            e(t, r, !0, n[r]);
        else
          e(t, n, !0, i)
      }
    }
  }
    , tt = {
    add: function(e, t) {
      if (e)
        for (var n in t)
          for (var i = t[n], r = n.split(/[\s,]+/g), s = 0, u = r.length; s < u; s++) {
            var o = r[s]
              , l = e === p && (o === "touchstart" || o === "touchmove") ? {
              passive: !1
            } : !1;
            e.addEventListener(o, i, l)
          }
    },
    remove: function(e, t) {
      if (e)
        for (var n in t)
          for (var i = t[n], r = n.split(/[\s,]+/g), s = 0, u = r.length; s < u; s++)
            e.removeEventListener(r[s], i, !1)
    },
    getPoint: function(e) {
      var t = e.targetTouches ? e.targetTouches.length ? e.targetTouches[0] : e.changedTouches[0] : e;
      return new C(t.pageX || t.clientX + p.documentElement.scrollLeft,t.pageY || t.clientY + p.documentElement.scrollTop)
    },
    getTarget: function(e) {
      return e.target || e.srcElement
    },
    getRelatedTarget: function(e) {
      return e.relatedTarget || e.toElement
    },
    getOffset: function(e, t) {
      return tt.getPoint(e).subtract(Ce.getOffset(t || tt.getTarget(e)))
    }
  };
  tt.requestAnimationFrame = new function() {
    var e = Ce.getPrefixed(h, "requestAnimationFrame"), t = !1, n = [], i;
    function r() {
      var s = n;
      n = [];
      for (var u = 0, o = s.length; u < o; u++)
        s[u]();
      t = e && n.length,
      t && e(r)
    }
    return function(s) {
      n.push(s),
        e ? t || (e(r),
          t = !0) : i || (i = setInterval(r, 16.666666666666668))
    }
  }
  ;
  var Ke = d.extend(M, {
      _class: "View",
      initialize: function e(t, n) {
        function i(y) {
          return n[y] || parseInt(n.getAttribute(y), 10)
        }
        function r() {
          var y = Ce.getSize(n);
          return y.isNaN() || y.isZero() ? new J(i("width"),i("height")) : y
        }
        var s;
        if (h && n) {
          this._id = n.getAttribute("id"),
          this._id == null && n.setAttribute("id", this._id = "paper-view-" + e._id++),
            tt.add(n, this._viewEvents);
          var u = "none";
          if (Ce.setPrefixed(n.style, {
            userDrag: u,
            userSelect: u,
            touchAction: u,
            touchCallout: u,
            contentZooming: u,
            tapHighlightColor: "rgba(0,0,0,0)"
          }),
            F.hasAttribute(n, "resize")) {
            var o = this;
            tt.add(h, this._windowEvents = {
              resize: function() {
                o.setViewSize(r())
              }
            })
          }
          if (s = r(),
          F.hasAttribute(n, "stats") && typeof Stats < "u") {
            this._stats = new Stats;
            var l = this._stats.domElement
              , f = l.style
              , g = Ce.getOffset(n);
            f.position = "absolute",
              f.left = g.x + "px",
              f.top = g.y + "px",
              p.body.appendChild(l)
          }
        } else
          s = new J(n),
            n = null;
        this._project = t,
          this._scope = t._scope,
          this._element = n,
        this._pixelRatio || (this._pixelRatio = h && h.devicePixelRatio || 1),
          this._setElementSize(s.width, s.height),
          this._viewSize = s,
          e._views.push(this),
          e._viewsById[this._id] = this,
          (this._matrix = new le)._owner = this,
        e._focused || (e._focused = this),
          this._frameItems = {},
          this._frameItemCount = 0,
          this._itemEvents = {
            native: {},
            virtual: {}
          },
          this._autoUpdate = !ae.agent.node,
          this._needsUpdate = !1
      },
      remove: function() {
        if (!this._project)
          return !1;
        Ke._focused === this && (Ke._focused = null),
          Ke._views.splice(Ke._views.indexOf(this), 1),
          delete Ke._viewsById[this._id];
        var e = this._project;
        return e._view === this && (e._view = null),
          tt.remove(this._element, this._viewEvents),
          tt.remove(h, this._windowEvents),
          this._element = this._project = null,
          this.off("frame"),
          this._animate = !1,
          this._frameItems = {},
          !0
      },
      _events: d.each(oe._itemHandlers.concat(["onResize", "onKeyDown", "onKeyUp"]), function(e) {
        this[e] = {}
      }, {
        onFrame: {
          install: function() {
            this.play()
          },
          uninstall: function() {
            this.pause()
          }
        }
      }),
      _animate: !1,
      _time: 0,
      _count: 0,
      getAutoUpdate: function() {
        return this._autoUpdate
      },
      setAutoUpdate: function(e) {
        this._autoUpdate = e,
        e && this.requestUpdate()
      },
      update: function() {},
      draw: function() {
        this.update()
      },
      requestUpdate: function() {
        if (!this._requested) {
          var e = this;
          tt.requestAnimationFrame(function() {
            if (e._requested = !1,
              e._animate) {
              e.requestUpdate();
              var t = e._element;
              (!Ce.getPrefixed(p, "hidden") || F.getAttribute(t, "keepalive") === "true") && Ce.isInView(t) && e._handleFrame()
            }
            e._autoUpdate && e.update()
          }),
            this._requested = !0
        }
      },
      play: function() {
        this._animate = !0,
          this.requestUpdate()
      },
      pause: function() {
        this._animate = !1
      },
      _handleFrame: function() {
        ae = this._scope;
        var e = Date.now() / 1e3
          , t = this._last ? e - this._last : 0;
        this._last = e,
          this.emit("frame", new d({
            delta: t,
            time: this._time += t,
            count: this._count++
          })),
        this._stats && this._stats.update()
      },
      _animateItem: function(e, t) {
        var n = this._frameItems;
        t ? (n[e._id] = {
          item: e,
          time: 0,
          count: 0
        },
        ++this._frameItemCount === 1 && this.on("frame", this._handleFrameItems)) : (delete n[e._id],
        --this._frameItemCount === 0 && this.off("frame", this._handleFrameItems))
      },
      _handleFrameItems: function(e) {
        for (var t in this._frameItems) {
          var n = this._frameItems[t];
          n.item.emit("frame", new d(e,{
            time: n.time += e.delta,
            count: n.count++
          }))
        }
      },
      _changed: function() {
        this._project._changed(4097),
          this._bounds = this._decomposed = a
      },
      getElement: function() {
        return this._element
      },
      getPixelRatio: function() {
        return this._pixelRatio
      },
      getResolution: function() {
        return this._pixelRatio * 72
      },
      getViewSize: function() {
        var e = this._viewSize;
        return new ne(e.width,e.height,this,"setViewSize")
      },
      setViewSize: function() {
        var e = J.read(arguments)
          , t = e.subtract(this._viewSize);
        t.isZero() || (this._setElementSize(e.width, e.height),
          this._viewSize.set(e),
          this._changed(),
          this.emit("resize", {
            size: e,
            delta: t
          }),
        this._autoUpdate && this.update())
      },
      _setElementSize: function(e, t) {
        var n = this._element;
        n && (n.width !== e && (n.width = e),
        n.height !== t && (n.height = t))
      },
      getBounds: function() {
        return this._bounds || (this._bounds = this._matrix.inverted()._transformBounds(new Y(new C,this._viewSize))),
          this._bounds
      },
      getSize: function() {
        return this.getBounds().getSize()
      },
      isVisible: function() {
        return Ce.isInView(this._element)
      },
      isInserted: function() {
        return Ce.isInserted(this._element)
      },
      getPixelSize: function(e) {
        var t = this._element, n;
        if (t) {
          var i = t.parentNode
            , r = p.createElement("div");
          r.style.fontSize = e,
            i.appendChild(r),
            n = parseFloat(Ce.getStyles(r).fontSize),
            i.removeChild(r)
        } else
          n = parseFloat(n);
        return n
      },
      getTextWidth: function(e, t) {
        return 0
      }
    }, d.each(["rotate", "scale", "shear", "skew"], function(e) {
      var t = e === "rotate";
      this[e] = function() {
        var n = arguments
          , i = (t ? d : C).read(n)
          , r = C.read(n, 0, {
          readNull: !0
        });
        return this.transform(new le()[e](i, r || this.getCenter(!0)))
      }
    }, {
      _decompose: function() {
        return this._decomposed || (this._decomposed = this._matrix.decompose())
      },
      translate: function() {
        var e = new le;
        return this.transform(e.translate.apply(e, arguments))
      },
      getCenter: function() {
        return this.getBounds().getCenter()
      },
      setCenter: function() {
        var e = C.read(arguments);
        this.translate(this.getCenter().subtract(e))
      },
      getZoom: function() {
        var e = this._decompose().scaling;
        return (e.x + e.y) / 2
      },
      setZoom: function(e) {
        this.transform(new le().scale(e / this.getZoom(), this.getCenter()))
      },
      getRotation: function() {
        return this._decompose().rotation
      },
      setRotation: function(e) {
        var t = this.getRotation();
        t != null && e != null && this.rotate(e - t)
      },
      getScaling: function() {
        var e = this._decompose().scaling;
        return new Q(e.x,e.y,this,"setScaling")
      },
      setScaling: function() {
        var e = this.getScaling()
          , t = C.read(arguments, 0, {
          clone: !0,
          readNull: !0
        });
        e && t && this.scale(t.x / e.x, t.y / e.y)
      },
      getMatrix: function() {
        return this._matrix
      },
      setMatrix: function() {
        var e = this._matrix;
        e.set.apply(e, arguments)
      },
      transform: function(e) {
        this._matrix.append(e)
      },
      scrollBy: function() {
        this.translate(C.read(arguments).negate())
      }
    }), {
      projectToView: function() {
        return this._matrix._transformPoint(C.read(arguments))
      },
      viewToProject: function() {
        return this._matrix._inverseTransform(C.read(arguments))
      },
      getEventPoint: function(e) {
        return this.viewToProject(tt.getOffset(e, this._element))
      }
    }, {
      statics: {
        _views: [],
        _viewsById: {},
        _id: 0,
        create: function(e, t) {
          p && typeof t == "string" && (t = p.getElementById(t));
          var n = h ? Rt : Ke;
          return new n(e,t)
        }
      }
    }, new function() {
      if (!h)
        return;
      var e, t, n = !1, i = !1;
      function r(z) {
        var G = tt.getTarget(z);
        return G.getAttribute && Ke._viewsById[G.getAttribute("id")]
      }
      function s() {
        var z = Ke._focused;
        if (!z || !z.isVisible()) {
          for (var G = 0, H = Ke._views.length; G < H; G++)
            if ((z = Ke._views[G]).isVisible()) {
              Ke._focused = t = z;
              break
            }
        }
      }
      function u(z, G, H) {
        z._handleMouseEvent("mousemove", G, H)
      }
      var o, l, f;
      "onpointerdown"in h || h.PointerEvent || h.MSPointerEvent ? (o = "pointerdown MSPointerDown",
        l = "pointermove MSPointerMove",
        f = "pointerup pointercancel MSPointerUp MSPointerCancel") : (o = "touchstart",
        l = "touchmove",
        f = "touchend touchcancel",
      "ontouchstart"in h && navigator.userAgent.match(/mobile|tablet|ip(ad|hone|od)|android|silk/i) || (o += " mousedown",
        l += " mousemove",
        f += " mouseup"));
      var g = {}
        , y = {
        mouseout: function(z) {
          var G = Ke._focused
            , H = tt.getRelatedTarget(z);
          if (G && (!H || H.nodeName === "HTML")) {
            var K = tt.getOffset(z, G._element)
              , $ = K.x
              , W = Math.abs
              , te = W($)
              , se = 1 << 25
              , ue = te - se;
            K.x = W(ue) < te ? ue * ($ < 0 ? -1 : 1) : $,
              u(G, z, G.viewToProject(K))
          }
        },
        scroll: s
      };
      g[o] = function(z) {
        var G = Ke._focused = r(z);
        n || (n = !0,
          G._handleMouseEvent("mousedown", z))
      }
        ,
        y[l] = function(z) {
          var G = Ke._focused;
          if (!i) {
            var H = r(z);
            H ? G !== H && (G && u(G, z),
            e || (e = G),
              G = Ke._focused = t = H) : t && t === G && (e && !e.isInserted() && (e = null),
              G = Ke._focused = e,
              e = null,
              s())
          }
          G && u(G, z)
        }
        ,
        y[o] = function() {
          i = !0
        }
        ,
        y[f] = function(z) {
          var G = Ke._focused;
          G && n && G._handleMouseEvent("mouseup", z),
            i = n = !1
        }
        ,
        tt.add(p, y),
        tt.add(h, {
          load: s
        });
      var _ = !1, v = !1, b = {
        doubleclick: "click",
        mousedrag: "mousemove"
      }, T = !1, x, S, I, m, w, E, A, N, L;
      function R(z, G, H, K, $, W, te) {
        var se = !1, ue;
        function Ie(Ee, de) {
          if (Ee.responds(de)) {
            if (ue || (ue = new wn(de,K,$,G || Ee,W ? $.subtract(W) : null)),
            Ee.emit(de, ue) && (_ = !0,
            ue.prevented && (v = !0),
              ue.stopped))
              return se = !0
          } else {
            var ve = b[de];
            if (ve)
              return Ie(Ee, ve)
          }
        }
        for (; z && z !== te && !Ie(z, H); )
          z = z._parent;
        return se
      }
      function D(z, G, H, K, $, W) {
        return z._project.removeOn(H),
          v = _ = !1,
        E && R(E, null, H, K, $, W) || G && G !== E && !G.isDescendant(E) && R(G, null, H === "mousedrag" ? "mousemove" : H, K, $, W, E) || R(z, E || G || z, H, K, $, W)
      }
      var V = {
        mousedown: {
          mousedown: 1,
          mousedrag: 1,
          click: 1,
          doubleclick: 1
        },
        mouseup: {
          mouseup: 1,
          mousedrag: 1,
          click: 1,
          doubleclick: 1
        },
        mousemove: {
          mousedrag: 1,
          mousemove: 1,
          mouseenter: 1,
          mouseleave: 1
        }
      };
      return {
        _viewEvents: g,
        _handleMouseEvent: function(z, G, H) {
          var K = this._itemEvents
            , $ = K.native[z]
            , W = z === "mousemove"
            , te = this._scope.tool
            , se = this;
          function ue(Ge) {
            return K.virtual[Ge] || se.responds(Ge) || te && te.responds(Ge)
          }
          W && n && ue("mousedrag") && (z = "mousedrag"),
          H || (H = this.getEventPoint(G));
          var Ie = this.getBounds().contains(H)
            , Ee = $ && Ie && se._project.hitTest(H, {
            tolerance: 0,
            fill: !0,
            stroke: !0
          })
            , de = Ee && Ee.item || null
            , ve = !1
            , Oe = {};
          if (Oe[z.substr(5)] = !0,
          $ && de !== w && (w && R(w, null, "mouseleave", G, H),
          de && R(de, null, "mouseenter", G, H),
            w = de),
          T ^ Ie && (R(this, null, Ie ? "mouseenter" : "mouseleave", G, H),
            x = Ie ? this : null,
            ve = !0),
          (Ie || Oe.drag) && !H.equals(I) && (D(this, de, W ? z : "mousemove", G, H, I),
            ve = !0),
            T = Ie,
          Oe.down && Ie || Oe.up && S) {
            if (D(this, de, z, G, H, S),
              Oe.down) {
              if (L = de === A && Date.now() - N < 300,
                m = A = de,
              !v && de) {
                for (var Te = de; Te && !Te.responds("mousedrag"); )
                  Te = Te._parent;
                Te && (E = de)
              }
              S = H
            } else
              Oe.up && (!v && de === m && (N = Date.now(),
                D(this, de, L ? "doubleclick" : "click", G, H, S),
                L = !1),
                m = E = null);
            T = !1,
              ve = !0
          }
          I = H,
          ve && te && (_ = te._handleMouseEvent(z, G, H, Oe) || _),
          G.cancelable !== !1 && (_ && !Oe.move || Oe.down && ue("mouseup")) && G.preventDefault()
        },
        _handleKeyEvent: function(z, G, H, K) {
          var $ = this._scope, W = $.tool, te;
          function se(ue) {
            ue.responds(z) && (ae = $,
              ue.emit(z, te = te || new tn(z,G,H,K)))
          }
          this.isVisible() && (se(this),
          W && W.responds(z) && se(W))
        },
        _countItemEvent: function(z, G) {
          var H = this._itemEvents
            , K = H.native
            , $ = H.virtual;
          for (var W in V)
            K[W] = (K[W] || 0) + (V[W][z] || 0) * G;
          $[z] = ($[z] || 0) + G
        },
        statics: {
          updateFocus: s,
          _resetState: function() {
            n = i = _ = T = !1,
              e = t = x = S = I = m = w = E = A = N = L = null
          }
        }
      }
    }
  )
    , Rt = Ke.extend({
    _class: "CanvasView",
    initialize: function(t, n) {
      if (!(n instanceof h.HTMLCanvasElement)) {
        var i = J.read(arguments, 1);
        if (i.isZero())
          throw new Error("Cannot create CanvasView with the provided argument: " + d.slice(arguments, 1));
        n = Je.getCanvas(i)
      }
      var r = this._context = n.getContext("2d");
      if (r.save(),
        this._pixelRatio = 1,
        !/^off|false$/.test(F.getAttribute(n, "hidpi"))) {
        var s = h.devicePixelRatio || 1
          , u = Ce.getPrefixed(r, "backingStorePixelRatio") || 1;
        this._pixelRatio = s / u
      }
      Ke.call(this, t, n),
        this._needsUpdate = !0
    },
    remove: function e() {
      return this._context.restore(),
        e.base.call(this)
    },
    _setElementSize: function e(t, n) {
      var i = this._pixelRatio;
      if (e.base.call(this, t * i, n * i),
      i !== 1) {
        var r = this._element
          , s = this._context;
        if (!F.hasAttribute(r, "resize")) {
          var u = r.style;
          u.width = t + "px",
            u.height = n + "px"
        }
        s.restore(),
          s.save(),
          s.scale(i, i)
      }
    },
    getContext: function() {
      return this._context
    },
    getPixelSize: function e(t) {
      var n = ae.agent, i;
      if (n && n.firefox)
        i = e.base.call(this, t);
      else {
        var r = this._context
          , s = r.font;
        r.font = t + " serif",
          i = parseFloat(r.font),
          r.font = s
      }
      return i
    },
    getTextWidth: function(e, t) {
      var n = this._context
        , i = n.font
        , r = 0;
      n.font = e;
      for (var s = 0, u = t.length; s < u; s++)
        r = Math.max(r, n.measureText(t[s]).width);
      return n.font = i,
        r
    },
    update: function() {
      if (!this._needsUpdate)
        return !1;
      var e = this._project
        , t = this._context
        , n = this._viewSize;
      return t.clearRect(0, 0, n.width + 1, n.height + 1),
      e && e.draw(t, this._matrix, this._pixelRatio),
        this._needsUpdate = !1,
        !0
    }
  })
    , Zt = d.extend({
    _class: "Event",
    initialize: function(t) {
      this.event = t,
        this.type = t && t.type
    },
    prevented: !1,
    stopped: !1,
    preventDefault: function() {
      this.prevented = !0,
        this.event.preventDefault()
    },
    stopPropagation: function() {
      this.stopped = !0,
        this.event.stopPropagation()
    },
    stop: function() {
      this.stopPropagation(),
        this.preventDefault()
    },
    getTimeStamp: function() {
      return this.event.timeStamp
    },
    getModifiers: function() {
      return cn.modifiers
    }
  })
    , tn = Zt.extend({
    _class: "KeyEvent",
    initialize: function(t, n, i, r) {
      this.type = t,
        this.event = n,
        this.key = i,
        this.character = r
    },
    toString: function() {
      return "{ type: '" + this.type + "', key: '" + this.key + "', character: '" + this.character + "', modifiers: " + this.getModifiers() + " }"
    }
  })
    , cn = new function() {
    var e = {
      "	": "tab",
      " ": "space",
      "\b": "backspace",
      "\x7F": "delete",
      Spacebar: "space",
      Del: "delete",
      Win: "meta",
      Esc: "escape"
    }, t = {
      tab: "	",
      space: " ",
      enter: "\r"
    }, n = {}, i = {}, r, s, u = new d({
      shift: !1,
      control: !1,
      alt: !1,
      meta: !1,
      capsLock: !1,
      space: !1
    }).inject({
      option: {
        get: function() {
          return this.alt
        }
      },
      command: {
        get: function() {
          var f = ae && ae.agent;
          return f && f.mac ? this.meta : this.control
        }
      }
    });
    function o(f) {
      var g = f.key || f.keyIdentifier;
      return g = /^U\+/.test(g) ? String.fromCharCode(parseInt(g.substr(2), 16)) : /^Arrow[A-Z]/.test(g) ? g.substr(5) : g === "Unidentified" || g === a ? String.fromCharCode(f.keyCode) : g,
      e[g] || (g.length > 1 ? d.hyphenate(g) : g.toLowerCase())
    }
    function l(f, g, y, _) {
      var v = f ? "keydown" : "keyup", b = Ke._focused, T;
      if (n[g] = f,
        f ? i[g] = y : delete i[g],
      g.length > 1 && (T = d.camelize(g))in u) {
        u[T] = f;
        var x = ae && ae.agent;
        if (T === "meta" && x && x.mac)
          if (f)
            r = {};
          else {
            for (var S in r)
              S in i && l(!1, S, r[S], _);
            r = null
          }
      } else
        f && r && (r[g] = y);
      b && b._handleKeyEvent(f ? "keydown" : "keyup", _, g, y)
    }
    return tt.add(p, {
      keydown: function(f) {
        var g = o(f)
          , y = ae && ae.agent;
        g.length > 1 || y && y.chrome && (f.altKey || y.mac && f.metaKey || !y.mac && f.ctrlKey) ? l(!0, g, t[g] || (g.length > 1 ? "" : g), f) : s = g
      },
      keypress: function(f) {
        if (s) {
          var g = o(f)
            , y = f.charCode
            , _ = y >= 32 ? String.fromCharCode(y) : g.length > 1 ? "" : g;
          g !== s && (g = _.toLowerCase()),
            l(!0, g, _, f),
            s = null
        }
      },
      keyup: function(f) {
        var g = o(f);
        g in i && l(!1, g, i[g], f)
      }
    }),
      tt.add(h, {
        blur: function(f) {
          for (var g in i)
            l(!1, g, i[g], f)
        }
      }),
      {
        modifiers: u,
        isDown: function(f) {
          return !!n[f]
        }
      }
  }
    , wn = Zt.extend({
    _class: "MouseEvent",
    initialize: function(t, n, i, r, s) {
      this.type = t,
        this.event = n,
        this.point = i,
        this.target = r,
        this.delta = s
    },
    toString: function() {
      return "{ type: '" + this.type + "', point: " + this.point + ", target: " + this.target + (this.delta ? ", delta: " + this.delta : "") + ", modifiers: " + this.getModifiers() + " }"
    }
  })
    , bn = Zt.extend({
    _class: "ToolEvent",
    _item: null,
    initialize: function(t, n, i) {
      this.tool = t,
        this.type = n,
        this.event = i
    },
    _choosePoint: function(e, t) {
      return e || (t ? t.clone() : null)
    },
    getPoint: function() {
      return this._choosePoint(this._point, this.tool._point)
    },
    setPoint: function(e) {
      this._point = e
    },
    getLastPoint: function() {
      return this._choosePoint(this._lastPoint, this.tool._lastPoint)
    },
    setLastPoint: function(e) {
      this._lastPoint = e
    },
    getDownPoint: function() {
      return this._choosePoint(this._downPoint, this.tool._downPoint)
    },
    setDownPoint: function(e) {
      this._downPoint = e
    },
    getMiddlePoint: function() {
      return !this._middlePoint && this.tool._lastPoint ? this.tool._point.add(this.tool._lastPoint).divide(2) : this._middlePoint
    },
    setMiddlePoint: function(e) {
      this._middlePoint = e
    },
    getDelta: function() {
      return !this._delta && this.tool._lastPoint ? this.tool._point.subtract(this.tool._lastPoint) : this._delta
    },
    setDelta: function(e) {
      this._delta = e
    },
    getCount: function() {
      return this.tool[/^mouse(down|up)$/.test(this.type) ? "_downCount" : "_moveCount"]
    },
    setCount: function(e) {
      this.tool[/^mouse(down|up)$/.test(this.type) ? "downCount" : "count"] = e
    },
    getItem: function() {
      if (!this._item) {
        var e = this.tool._scope.project.hitTest(this.getPoint());
        if (e) {
          for (var t = e.item, n = t._parent; /^(Group|CompoundPath)$/.test(n._class); )
            t = n,
              n = n._parent;
          this._item = t
        }
      }
      return this._item
    },
    setItem: function(e) {
      this._item = e
    },
    toString: function() {
      return "{ type: " + this.type + ", point: " + this.getPoint() + ", count: " + this.getCount() + ", modifiers: " + this.getModifiers() + " }"
    }
  })
    , kn = Z.extend({
    _class: "Tool",
    _list: "tools",
    _reference: "tool",
    _events: ["onMouseDown", "onMouseUp", "onMouseDrag", "onMouseMove", "onActivate", "onDeactivate", "onEditOptions", "onKeyDown", "onKeyUp"],
    initialize: function(t) {
      Z.call(this),
        this._moveCount = -1,
        this._downCount = -1,
        this.set(t)
    },
    getMinDistance: function() {
      return this._minDistance
    },
    setMinDistance: function(e) {
      this._minDistance = e,
      e != null && this._maxDistance != null && e > this._maxDistance && (this._maxDistance = e)
    },
    getMaxDistance: function() {
      return this._maxDistance
    },
    setMaxDistance: function(e) {
      this._maxDistance = e,
      this._minDistance != null && e != null && e < this._minDistance && (this._minDistance = e)
    },
    getFixedDistance: function() {
      return this._minDistance == this._maxDistance ? this._minDistance : null
    },
    setFixedDistance: function(e) {
      this._minDistance = this._maxDistance = e
    },
    _handleMouseEvent: function(e, t, n, i) {
      ae = this._scope,
      i.drag && !this.responds(e) && (e = "mousemove");
      var r = i.move || i.drag
        , s = this.responds(e)
        , u = this.minDistance
        , o = this.maxDistance
        , l = !1
        , f = this;
      function g(_, v) {
        var b = n
          , T = r ? f._point : f._downPoint || b;
        if (r) {
          if (f._moveCount >= 0 && b.equals(T))
            return !1;
          if (T && (_ != null || v != null)) {
            var x = b.subtract(T)
              , S = x.getLength();
            if (S < (_ || 0))
              return !1;
            v && (b = T.add(x.normalize(Math.min(S, v))))
          }
          f._moveCount++
        }
        return f._point = b,
          f._lastPoint = T || b,
        i.down && (f._moveCount = -1,
          f._downPoint = b,
          f._downCount++),
          !0
      }
      function y() {
        s && (l = f.emit(e, new bn(f,e,t)) || l)
      }
      if (i.down)
        g(),
          y();
      else if (i.up)
        g(null, o),
          y();
      else if (s)
        for (; g(u, o); )
          y();
      return l
    }
  })
    , Sn = d.extend(M, {
    _class: "Tween",
    statics: {
      easings: new d({
        linear: function(e) {
          return e
        },
        easeInQuad: function(e) {
          return e * e
        },
        easeOutQuad: function(e) {
          return e * (2 - e)
        },
        easeInOutQuad: function(e) {
          return e < .5 ? 2 * e * e : -1 + 2 * (2 - e) * e
        },
        easeInCubic: function(e) {
          return e * e * e
        },
        easeOutCubic: function(e) {
          return --e * e * e + 1
        },
        easeInOutCubic: function(e) {
          return e < .5 ? 4 * e * e * e : (e - 1) * (2 * e - 2) * (2 * e - 2) + 1
        },
        easeInQuart: function(e) {
          return e * e * e * e
        },
        easeOutQuart: function(e) {
          return 1 - --e * e * e * e
        },
        easeInOutQuart: function(e) {
          return e < .5 ? 8 * e * e * e * e : 1 - 8 * --e * e * e * e
        },
        easeInQuint: function(e) {
          return e * e * e * e * e
        },
        easeOutQuint: function(e) {
          return 1 + --e * e * e * e * e
        },
        easeInOutQuint: function(e) {
          return e < .5 ? 16 * e * e * e * e * e : 1 + 16 * --e * e * e * e * e
        }
      })
    },
    initialize: function e(t, n, i, r, s, u) {
      this.object = t;
      var o = typeof s
        , l = o === "function";
      this.type = l ? o : o === "string" ? s : "linear",
        this.easing = l ? s : e.easings[this.type],
        this.duration = r,
        this.running = !1,
        this._then = null,
        this._startTime = null;
      var f = n || i;
      this._keys = f ? Object.keys(f) : [],
        this._parsedKeys = this._parseKeys(this._keys),
        this._from = f && this._getState(n),
        this._to = f && this._getState(i),
      u !== !1 && this.start()
    },
    then: function(e) {
      return this._then = e,
        this
    },
    start: function() {
      return this._startTime = null,
        this.running = !0,
        this
    },
    stop: function() {
      return this.running = !1,
        this
    },
    update: function(e) {
      if (this.running) {
        e >= 1 && (e = 1,
          this.running = !1);
        for (var t = this.easing(e), n = this._keys, i = function(g) {
          return typeof g == "function" ? g(t, e) : g
        }, r = 0, s = n && n.length; r < s; r++) {
          var u = n[r]
            , o = i(this._from[u])
            , l = i(this._to[u])
            , f = o && l && o.__add && l.__add ? l.__subtract(o).__multiply(t).__add(o) : (l - o) * t + o;
          this._setProperty(this._parsedKeys[u], f)
        }
        this.responds("update") && this.emit("update", new d({
          progress: e,
          factor: t
        })),
        !this.running && this._then && this._then(this.object)
      }
      return this
    },
    _events: {
      onUpdate: {}
    },
    _handleFrame: function(e) {
      var t = this._startTime
        , n = t ? (e - t) / this.duration : 0;
      t || (this._startTime = e),
        this.update(n)
    },
    _getState: function(e) {
      for (var t = this._keys, n = {}, i = 0, r = t.length; i < r; i++) {
        var s = t[i], u = this._parsedKeys[s], o = this._getProperty(u), l;
        if (e) {
          var f = this._resolveValue(o, e[s]);
          this._setProperty(u, f),
            l = this._getProperty(u),
            l = l && l.clone ? l.clone() : l,
            this._setProperty(u, o)
        } else
          l = o && o.clone ? o.clone() : o;
        n[s] = l
      }
      return n
    },
    _resolveValue: function(e, t) {
      if (t) {
        if (Array.isArray(t) && t.length === 2) {
          var n = t[0];
          return n && n.match && n.match(/^[+\-\*\/]=/) ? this._calculate(e, n[0], t[1]) : t
        } else if (typeof t == "string") {
          var i = t.match(/^[+\-*/]=(.*)/);
          if (i) {
            var r = JSON.parse(i[1].replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": '));
            return this._calculate(e, t[0], r)
          }
        }
      }
      return t
    },
    _calculate: function(e, t, n) {
      return ae.PaperScript.calculateBinary(e, t, n)
    },
    _parseKeys: function(e) {
      for (var t = {}, n = 0, i = e.length; n < i; n++) {
        var r = e[n]
          , s = r.replace(/\.([^.]*)/g, "/$1").replace(/\[['"]?([^'"\]]*)['"]?\]/g, "/$1");
        t[r] = s.split("/")
      }
      return t
    },
    _getProperty: function(e, t) {
      for (var n = this.object, i = 0, r = e.length - (t || 0); i < r && n; i++)
        n = n[e[i]];
      return n
    },
    _setProperty: function(e, t) {
      var n = this._getProperty(e, 1);
      n && (n[e[e.length - 1]] = t)
    }
  })
    , Bn = {
    request: function(e) {
      var t = new c.XMLHttpRequest;
      return t.open((e.method || "get").toUpperCase(), e.url, d.pick(e.async, !0)),
      e.mimeType && t.overrideMimeType(e.mimeType),
        t.onload = function() {
          var n = t.status;
          n === 0 || n === 200 ? e.onLoad && e.onLoad.call(t, t.responseText) : t.onerror()
        }
        ,
        t.onerror = function() {
          var n = t.status
            , i = 'Could not load "' + e.url + '" (Status: ' + n + ")";
          if (e.onError)
            e.onError(i, n);
          else
            throw new Error(i)
        }
        ,
        t.send(null)
    }
  }
    , Je = d.exports.CanvasProvider = {
    canvases: [],
    getCanvas: function(e, t, n) {
      if (!h)
        return null;
      var i, r = !0;
      typeof e == "object" && (t = e.height,
        e = e.width),
        this.canvases.length ? i = this.canvases.pop() : (i = p.createElement("canvas"),
          r = !1);
      var s = i.getContext("2d", n || {});
      if (!s)
        throw new Error("Canvas " + i + " is unable to provide a 2D context.");
      return i.width === e && i.height === t ? r && s.clearRect(0, 0, e + 1, t + 1) : (i.width = e,
        i.height = t),
        s.save(),
        i
    },
    getContext: function(e, t, n) {
      var i = this.getCanvas(e, t, n);
      return i ? i.getContext("2d", n || {}) : null
    },
    release: function(e) {
      var t = e && e.canvas ? e.canvas : e;
      t && t.getContext && (t.getContext("2d").restore(),
        this.canvases.push(t))
    }
  }
    , nn = new function() {
    var e = Math.min, t = Math.max, n = Math.abs, i, r, s, u, o, l, f, g, y, _, v;
    function b(E, A, N) {
      return .2989 * E + .587 * A + .114 * N
    }
    function T(E, A, N, D) {
      var R = D - b(E, A, N);
      y = E + R,
        _ = A + R,
        v = N + R;
      var D = b(y, _, v)
        , V = e(y, _, v)
        , z = t(y, _, v);
      if (V < 0) {
        var G = D - V;
        y = D + (y - D) * D / G,
          _ = D + (_ - D) * D / G,
          v = D + (v - D) * D / G
      }
      if (z > 255) {
        var H = 255 - D
          , K = z - D;
        y = D + (y - D) * H / K,
          _ = D + (_ - D) * H / K,
          v = D + (v - D) * H / K
      }
    }
    function x(E, A, N) {
      return t(E, A, N) - e(E, A, N)
    }
    function S(E, A, N, L) {
      var R = [E, A, N], D = t(E, A, N), V = e(E, A, N), z;
      V = V === E ? 0 : V === A ? 1 : 2,
        D = D === E ? 0 : D === A ? 1 : 2,
        z = e(V, D) === 0 ? t(V, D) === 1 ? 2 : 1 : 0,
        R[D] > R[V] ? (R[z] = (R[z] - R[V]) * L / (R[D] - R[V]),
          R[D] = L) : R[z] = R[D] = 0,
        R[V] = 0,
        y = R[0],
        _ = R[1],
        v = R[2]
    }
    var I = {
      multiply: function() {
        y = o * i / 255,
          _ = l * r / 255,
          v = f * s / 255
      },
      screen: function() {
        y = o + i - o * i / 255,
          _ = l + r - l * r / 255,
          v = f + s - f * s / 255
      },
      overlay: function() {
        y = o < 128 ? 2 * o * i / 255 : 255 - 2 * (255 - o) * (255 - i) / 255,
          _ = l < 128 ? 2 * l * r / 255 : 255 - 2 * (255 - l) * (255 - r) / 255,
          v = f < 128 ? 2 * f * s / 255 : 255 - 2 * (255 - f) * (255 - s) / 255
      },
      "soft-light": function() {
        var E = i * o / 255;
        y = E + o * (255 - (255 - o) * (255 - i) / 255 - E) / 255,
          E = r * l / 255,
          _ = E + l * (255 - (255 - l) * (255 - r) / 255 - E) / 255,
          E = s * f / 255,
          v = E + f * (255 - (255 - f) * (255 - s) / 255 - E) / 255
      },
      "hard-light": function() {
        y = i < 128 ? 2 * i * o / 255 : 255 - 2 * (255 - i) * (255 - o) / 255,
          _ = r < 128 ? 2 * r * l / 255 : 255 - 2 * (255 - r) * (255 - l) / 255,
          v = s < 128 ? 2 * s * f / 255 : 255 - 2 * (255 - s) * (255 - f) / 255
      },
      "color-dodge": function() {
        y = o === 0 ? 0 : i === 255 ? 255 : e(255, 255 * o / (255 - i)),
          _ = l === 0 ? 0 : r === 255 ? 255 : e(255, 255 * l / (255 - r)),
          v = f === 0 ? 0 : s === 255 ? 255 : e(255, 255 * f / (255 - s))
      },
      "color-burn": function() {
        y = o === 255 ? 255 : i === 0 ? 0 : t(0, 255 - (255 - o) * 255 / i),
          _ = l === 255 ? 255 : r === 0 ? 0 : t(0, 255 - (255 - l) * 255 / r),
          v = f === 255 ? 255 : s === 0 ? 0 : t(0, 255 - (255 - f) * 255 / s)
      },
      darken: function() {
        y = o < i ? o : i,
          _ = l < r ? l : r,
          v = f < s ? f : s
      },
      lighten: function() {
        y = o > i ? o : i,
          _ = l > r ? l : r,
          v = f > s ? f : s
      },
      difference: function() {
        y = o - i,
        y < 0 && (y = -y),
          _ = l - r,
        _ < 0 && (_ = -_),
          v = f - s,
        v < 0 && (v = -v)
      },
      exclusion: function() {
        y = o + i * (255 - o - o) / 255,
          _ = l + r * (255 - l - l) / 255,
          v = f + s * (255 - f - f) / 255
      },
      hue: function() {
        S(i, r, s, x(o, l, f)),
          T(y, _, v, b(o, l, f))
      },
      saturation: function() {
        S(o, l, f, x(i, r, s)),
          T(y, _, v, b(o, l, f))
      },
      luminosity: function() {
        T(o, l, f, b(i, r, s))
      },
      color: function() {
        T(i, r, s, b(o, l, f))
      },
      add: function() {
        y = e(o + i, 255),
          _ = e(l + r, 255),
          v = e(f + s, 255)
      },
      subtract: function() {
        y = t(o - i, 0),
          _ = t(l - r, 0),
          v = t(f - s, 0)
      },
      average: function() {
        y = (o + i) / 2,
          _ = (l + r) / 2,
          v = (f + s) / 2
      },
      negation: function() {
        y = 255 - n(255 - i - o),
          _ = 255 - n(255 - r - l),
          v = 255 - n(255 - s - f)
      }
    }
      , m = this.nativeModes = d.each(["source-over", "source-in", "source-out", "source-atop", "destination-over", "destination-in", "destination-out", "destination-atop", "lighter", "darker", "copy", "xor"], function(E) {
      this[E] = !0
    }, {})
      , w = Je.getContext(1, 1, {
      willReadFrequently: !0
    });
    w && (d.each(I, function(E, A) {
      var N = A === "darken"
        , L = !1;
      w.save();
      try {
        w.fillStyle = N ? "#300" : "#a00",
          w.fillRect(0, 0, 1, 1),
          w.globalCompositeOperation = A,
        w.globalCompositeOperation === A && (w.fillStyle = N ? "#a00" : "#300",
          w.fillRect(0, 0, 1, 1),
          L = w.getImageData(0, 0, 1, 1).data[0] !== N ? 170 : 51)
      } catch {}
      w.restore(),
        m[A] = L
    }),
      Je.release(w)),
      this.process = function(E, A, N, L, R) {
        var D = A.canvas
          , V = E === "normal";
        if (V || m[E])
          N.save(),
            N.setTransform(1, 0, 0, 1, 0, 0),
            N.globalAlpha = L,
          V || (N.globalCompositeOperation = E),
            N.drawImage(D, R.x, R.y),
            N.restore();
        else {
          var z = I[E];
          if (!z)
            return;
          for (var G = N.getImageData(R.x, R.y, D.width, D.height), H = G.data, K = A.getImageData(0, 0, D.width, D.height).data, $ = 0, W = H.length; $ < W; $ += 4) {
            i = K[$],
              o = H[$],
              r = K[$ + 1],
              l = H[$ + 1],
              s = K[$ + 2],
              f = H[$ + 2],
              u = K[$ + 3],
              g = H[$ + 3],
              z();
            var te = u * L / 255
              , se = 1 - te;
            H[$] = te * y + se * o,
              H[$ + 1] = te * _ + se * l,
              H[$ + 2] = te * v + se * f,
              H[$ + 3] = u * L + se * g
          }
          N.putImageData(G, R.x, R.y)
        }
      }
  }
    , Qe = new function() {
    var e = "http://www.w3.org/2000/svg"
      , t = "http://www.w3.org/2000/xmlns"
      , n = "http://www.w3.org/1999/xlink"
      , i = {
      href: n,
      xlink: t,
      xmlns: t + "/",
      "xmlns:xlink": t + "/"
    };
    function r(o, l, f) {
      return u(p.createElementNS(e, o), l, f)
    }
    function s(o, l) {
      var f = i[l]
        , g = f ? o.getAttributeNS(f, l) : o.getAttribute(l);
      return g === "null" ? null : g
    }
    function u(o, l, f) {
      for (var g in l) {
        var y = l[g]
          , _ = i[g];
        typeof y == "number" && f && (y = f.number(y)),
          _ ? o.setAttributeNS(_, g, y) : o.setAttribute(g, y)
      }
      return o
    }
    return {
      svg: e,
      xmlns: t,
      xlink: n,
      create: r,
      get: s,
      set: u
    }
  }
    , En = d.each({
    fillColor: ["fill", "color"],
    fillRule: ["fill-rule", "string"],
    strokeColor: ["stroke", "color"],
    strokeWidth: ["stroke-width", "number"],
    strokeCap: ["stroke-linecap", "string"],
    strokeJoin: ["stroke-linejoin", "string"],
    strokeScaling: ["vector-effect", "lookup", {
      true: "none",
      false: "non-scaling-stroke"
    }, function(e, t) {
      return !t && (e instanceof Ft || e instanceof je || e instanceof Gt)
    }
    ],
    miterLimit: ["stroke-miterlimit", "number"],
    dashArray: ["stroke-dasharray", "array"],
    dashOffset: ["stroke-dashoffset", "number"],
    fontFamily: ["font-family", "string"],
    fontWeight: ["font-weight", "string"],
    fontSize: ["font-size", "number"],
    justification: ["text-anchor", "lookup", {
      left: "start",
      center: "middle",
      right: "end"
    }],
    opacity: ["opacity", "number"],
    blendMode: ["mix-blend-mode", "style"]
  }, function(e, t) {
    var n = d.capitalize(t)
      , i = e[2];
    this[t] = {
      type: e[1],
      property: t,
      attribute: e[0],
      toSVG: i,
      fromSVG: i && d.each(i, function(r, s) {
        this[r] = s
      }, {}),
      exportFilter: e[3],
      get: "get" + n,
      set: "set" + n
    }
  }, {});
  new function() {
    var e;
    function t(I, m, w) {
      var E = new d
        , A = I.getTranslation();
      if (m) {
        var N;
        I.isInvertible() ? (I = I._shiftless(),
          N = I._inverseTransform(A),
          A = null) : N = new C,
          E[w ? "cx" : "x"] = N.x,
          E[w ? "cy" : "y"] = N.y
      }
      if (!I.isIdentity()) {
        var L = I.decompose();
        if (L) {
          var R = []
            , D = L.rotation
            , V = L.scaling
            , z = L.skewing;
          A && !A.isZero() && R.push("translate(" + e.point(A) + ")"),
          D && R.push("rotate(" + e.number(D) + ")"),
          (!O.isZero(V.x - 1) || !O.isZero(V.y - 1)) && R.push("scale(" + e.point(V) + ")"),
          z.x && R.push("skewX(" + e.number(z.x) + ")"),
          z.y && R.push("skewY(" + e.number(z.y) + ")"),
            E.transform = R.join(" ")
        } else
          E.transform = "matrix(" + I.getValues().join(",") + ")"
      }
      return E
    }
    function n(I, m) {
      for (var w = t(I._matrix), E = I._children, A = Qe.create("g", w, e), N = 0, L = E.length; N < L; N++) {
        var R = E[N]
          , D = x(R, m);
        if (D)
          if (R.isClipMask()) {
            var V = Qe.create("clipPath");
            V.appendChild(D),
              b(R, V, "clip"),
              Qe.set(A, {
                "clip-path": "url(#" + V.id + ")"
              })
          } else
            A.appendChild(D)
      }
      return A
    }
    function i(I, m) {
      var w = t(I._matrix, !0)
        , E = I.getSize()
        , A = I.getImage();
      return w.x -= E.width / 2,
        w.y -= E.height / 2,
        w.width = E.width,
        w.height = E.height,
        w.href = m.embedImages == !1 && A && A.src || I.toDataURL(),
        Qe.create("image", w, e)
    }
    function r(I, m) {
      var w = m.matchShapes;
      if (w) {
        var E = I.toShape(!1);
        if (E)
          return s(E, m)
      }
      var A = I._segments, N = A.length, L, R = t(I._matrix);
      if (w && N >= 2 && !I.hasHandles())
        if (N > 2) {
          L = I._closed ? "polygon" : "polyline";
          for (var D = [], V = 0; V < N; V++)
            D.push(e.point(A[V]._point));
          R.points = D.join(" ")
        } else {
          L = "line";
          var z = A[0]._point
            , G = A[1]._point;
          R.set({
            x1: z.x,
            y1: z.y,
            x2: G.x,
            y2: G.y
          })
        }
      else
        L = "path",
          R.d = I.getPathData(null, m.precision);
      return Qe.create(L, R, e)
    }
    function s(I) {
      var m = I._type
        , w = I._radius
        , E = t(I._matrix, !0, m !== "rectangle");
      if (m === "rectangle") {
        m = "rect";
        var A = I._size
          , N = A.width
          , L = A.height;
        E.x -= N / 2,
          E.y -= L / 2,
          E.width = N,
          E.height = L,
        w.isZero() && (w = null)
      }
      return w && (m === "circle" ? E.r = w : (E.rx = w.width,
        E.ry = w.height)),
        Qe.create(m, E, e)
    }
    function u(I, m) {
      var w = t(I._matrix)
        , E = I.getPathData(null, m.precision);
      return E && (w.d = E),
        Qe.create("path", w, e)
    }
    function o(I, m) {
      var w = t(I._matrix, !0)
        , E = I._definition
        , A = v(E, "symbol")
        , N = E._item
        , L = N.getStrokeBounds();
      return A || (A = Qe.create("symbol", {
        viewBox: e.rectangle(L)
      }),
        A.appendChild(x(N, m)),
        b(E, A, "symbol")),
        w.href = "#" + A.id,
        w.x += L.x,
        w.y += L.y,
        w.width = L.width,
        w.height = L.height,
        w.overflow = "visible",
        Qe.create("use", w, e)
    }
    function l(I) {
      var m = v(I, "color");
      if (!m) {
        var w = I.getGradient(), E = w._radial, A = I.getOrigin(), N = I.getDestination(), L;
        if (E) {
          L = {
            cx: A.x,
            cy: A.y,
            r: A.getDistance(N)
          };
          var R = I.getHighlight();
          R && (L.fx = R.x,
            L.fy = R.y)
        } else
          L = {
            x1: A.x,
            y1: A.y,
            x2: N.x,
            y2: N.y
          };
        L.gradientUnits = "userSpaceOnUse",
          m = Qe.create((E ? "radial" : "linear") + "Gradient", L, e);
        for (var D = w._stops, V = 0, z = D.length; V < z; V++) {
          var G = D[V]
            , H = G._color
            , K = H.getAlpha()
            , $ = G._offset;
          L = {
            offset: $ ?? V / (z - 1)
          },
          H && (L["stop-color"] = H.toCSS(!0)),
          K < 1 && (L["stop-opacity"] = K),
            m.appendChild(Qe.create("stop", L, e))
        }
        b(I, m, "color")
      }
      return "url(#" + m.id + ")"
    }
    function f(I) {
      var m = Qe.create("text", t(I._matrix, !0), e);
      return m.textContent = I._content,
        m
    }
    var g = {
      Group: n,
      Layer: n,
      Raster: i,
      Path: r,
      Shape: s,
      CompoundPath: u,
      SymbolItem: o,
      PointText: f
    };
    function y(I, m, w) {
      var E = {}
        , A = !w && I.getParent()
        , N = [];
      return I._name != null && (E.id = I._name),
        d.each(En, function(L) {
          var R = L.get
            , D = L.type
            , V = I[R]();
          if (L.exportFilter ? L.exportFilter(I, V) : !A || !d.equals(A[R](), V)) {
            if (D === "color" && V != null) {
              var z = V.getAlpha();
              z < 1 && (E[L.attribute + "-opacity"] = z)
            }
            D === "style" ? N.push(L.attribute + ": " + V) : E[L.attribute] = V == null ? "none" : D === "color" ? V.gradient ? l(V, I) : V.toCSS(!0) : D === "array" ? V.join(",") : D === "lookup" ? L.toSVG[V] : V
          }
        }),
      N.length && (E.style = N.join(";")),
      E.opacity === 1 && delete E.opacity,
      I._visible || (E.visibility = "hidden"),
        Qe.set(m, E, e)
    }
    var _;
    function v(I, m) {
      return _ || (_ = {
        ids: {},
        svgs: {}
      }),
      I && _.svgs[m + "-" + (I._id || I.__id || (I.__id = B.get("svg")))]
    }
    function b(I, m, w) {
      _ || v();
      var E = _.ids[w] = (_.ids[w] || 0) + 1;
      m.id = w + "-" + E,
        _.svgs[w + "-" + (I._id || I.__id)] = m
    }
    function T(I, m) {
      var w = I
        , E = null;
      if (_) {
        w = I.nodeName.toLowerCase() === "svg" && I;
        for (var A in _.svgs)
          E || (w || (w = Qe.create("svg"),
            w.appendChild(I)),
            E = w.insertBefore(Qe.create("defs"), w.firstChild)),
            E.appendChild(_.svgs[A]);
        _ = null
      }
      return m.asString ? new c.XMLSerializer().serializeToString(w) : w
    }
    function x(I, m, w) {
      var E = g[I._class]
        , A = E && E(I, m);
      if (A) {
        var N = m.onExport;
        N && (A = N(I, A, m) || A);
        var L = JSON.stringify(I._data);
        L && L !== "{}" && L !== "null" && A.setAttribute("data-paper-data", L)
      }
      return A && y(I, A, w)
    }
    function S(I) {
      return I || (I = {}),
        e = new k(I.precision),
        I
    }
    oe.inject({
      exportSVG: function(I) {
        return I = S(I),
          T(x(this, I, !0), I)
      }
    }),
      ye.inject({
        exportSVG: function(I) {
          I = S(I);
          var m = this._children
            , w = this.getView()
            , E = d.pick(I.bounds, "view")
            , A = I.matrix || E === "view" && w._matrix
            , N = A && le.read([A])
            , L = E === "view" ? new Y([0, 0],w.getViewSize()) : E === "content" ? oe._getBounds(m, N, {
            stroke: !0
          }).rect : Y.read([E], 0, {
            readNull: !0
          })
            , R = {
            version: "1.1",
            xmlns: Qe.svg,
            "xmlns:xlink": Qe.xlink
          };
          L && (R.width = L.width,
            R.height = L.height,
          (L.x || L.x === 0 || L.y || L.y === 0) && (R.viewBox = e.rectangle(L)));
          var D = Qe.create("svg", R, e)
            , V = D;
          N && !N.isIdentity() && (V = D.appendChild(Qe.create("g", t(N), e)));
          for (var z = 0, G = m.length; z < G; z++)
            V.appendChild(x(m[z], I, !0));
          return T(D, I)
        }
      })
  }
    ,
    new function() {
      var e = {}, t;
      function n(m, w, E, A, N, L) {
        var R = Qe.get(m, w) || L
          , D = R == null ? A ? null : E ? "" : 0 : E ? R : parseFloat(R);
        return /%\s*$/.test(R) ? D / 100 * (N ? 1 : t[/x|^width/.test(w) ? "width" : "height"]) : D
      }
      function i(m, w, E, A, N, L, R) {
        return w = n(m, w || "x", !1, A, N, L),
          E = n(m, E || "y", !1, A, N, R),
          A && (w == null || E == null) ? null : new C(w,E)
      }
      function r(m, w, E, A, N) {
        return w = n(m, w || "width", !1, A, N),
          E = n(m, E || "height", !1, A, N),
          A && (w == null || E == null) ? null : new J(w,E)
      }
      function s(m, w, E) {
        return m === "none" ? null : w === "number" ? parseFloat(m) : w === "array" ? m ? m.split(/[\s,]+/g).map(parseFloat) : [] : w === "color" ? x(m) || m : w === "lookup" ? E[m] : m
      }
      function u(m, w, E, A) {
        var N = m.childNodes
          , L = w === "clippath"
          , R = w === "defs"
          , D = new We
          , V = D._project
          , z = V._currentStyle
          , G = [];
        if (!L && !R && (D = T(D, m, A),
          V._currentStyle = D._style.clone()),
          A)
          for (var H = m.querySelectorAll("defs"), K = 0, $ = H.length; K < $; K++)
            S(H[K], E, !1);
        for (var K = 0, $ = N.length; K < $; K++) {
          var W = N[K], te;
          W.nodeType === 1 && !/^defs$/i.test(W.nodeName) && (te = S(W, E, !1)) && !(te instanceof dt) && G.push(te)
        }
        return D.addChildren(G),
        L && (D = T(D.reduce(), m, A)),
          V._currentStyle = z,
        (L || R) && (D.remove(),
          D = null),
          D
      }
      function o(m, w) {
        for (var E = m.getAttribute("points").match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g), A = [], N = 0, L = E.length; N < L; N += 2)
          A.push(new C(parseFloat(E[N]),parseFloat(E[N + 1])));
        var R = new ke(A);
        return w === "polygon" && R.closePath(),
          R
      }
      function l(m) {
        return Ft.create(m.getAttribute("d"))
      }
      function f(m, w) {
        var E = (n(m, "href", !0) || "").substring(1), A = w === "radialgradient", N;
        if (E)
          N = e[E].getGradient(),
          N._radial ^ A && (N = N.clone(),
            N._radial = A);
        else {
          for (var L = m.childNodes, R = [], D = 0, V = L.length; D < V; D++) {
            var z = L[D];
            z.nodeType === 1 && R.push(T(new en, z))
          }
          N = new xt(R,A)
        }
        var G, H, K, $ = n(m, "gradientUnits", !0) !== "userSpaceOnUse";
        A ? (G = i(m, "cx", "cy", !1, $, "50%", "50%"),
          H = G.add(n(m, "r", !1, !1, $, "50%"), 0),
          K = i(m, "fx", "fy", !0, $)) : (G = i(m, "x1", "y1", !1, $, "0%", "0%"),
          H = i(m, "x2", "y2", !1, $, "100%", "0%"));
        var W = T(new Xe(N,G,H,K), m);
        return W._scaleToBounds = $,
          null
      }
      var g = {
        "#document": function(m, w, E, A) {
          for (var N = m.childNodes, L = 0, R = N.length; L < R; L++) {
            var D = N[L];
            if (D.nodeType === 1)
              return S(D, E, A)
          }
        },
        g: u,
        svg: u,
        clippath: u,
        polygon: o,
        polyline: o,
        path: l,
        lineargradient: f,
        radialgradient: f,
        image: function(m) {
          var w = new Pt(n(m, "href", !0));
          return w.on("load", function() {
            var E = r(m);
            this.setSize(E);
            var A = i(m).add(E.divide(2));
            this._matrix.append(new le().translate(A))
          }),
            w
        },
        symbol: function(m, w, E, A) {
          return new dt(u(m, w, E, A),!0)
        },
        defs: u,
        use: function(m) {
          var w = (n(m, "href", !0) || "").substring(1)
            , E = e[w]
            , A = i(m);
          return E ? E instanceof dt ? E.place(A) : E.clone().translate(A) : null
        },
        circle: function(m) {
          return new je.Circle(i(m, "cx", "cy"),n(m, "r"))
        },
        ellipse: function(m) {
          return new je.Ellipse({
            center: i(m, "cx", "cy"),
            radius: r(m, "rx", "ry")
          })
        },
        rect: function(m) {
          return new je.Rectangle(new Y(i(m),r(m)),r(m, "rx", "ry"))
        },
        line: function(m) {
          return new ke.Line(i(m, "x1", "y1"),i(m, "x2", "y2"))
        },
        text: function(m) {
          var w = new Mt(i(m).add(i(m, "dx", "dy")));
          return w.setContent(m.textContent.trim() || ""),
            w
        },
        switch: u
      };
      function y(m, w, E, A) {
        if (m.transform) {
          for (var N = (A.getAttribute(E) || "").split(/\)\s*/g), L = new le, R = 0, D = N.length; R < D; R++) {
            var V = N[R];
            if (!V)
              break;
            for (var z = V.split(/\(\s*/), G = z[0], H = z[1].split(/[\s,]+/g), K = 0, $ = H.length; K < $; K++)
              H[K] = parseFloat(H[K]);
            switch (G) {
              case "matrix":
                L.append(new le(H[0],H[1],H[2],H[3],H[4],H[5]));
                break;
              case "rotate":
                L.rotate(H[0], H[1] || 0, H[2] || 0);
                break;
              case "translate":
                L.translate(H[0], H[1] || 0);
                break;
              case "scale":
                L.scale(H);
                break;
              case "skewX":
                L.skew(H[0], 0);
                break;
              case "skewY":
                L.skew(0, H[0]);
                break
            }
          }
          m.transform(L)
        }
      }
      function _(m, w, E) {
        var A = E === "fill-opacity" ? "getFillColor" : "getStrokeColor"
          , N = m[A] && m[A]();
        N && N.setAlpha(parseFloat(w))
      }
      var v = d.set(d.each(En, function(m) {
        this[m.attribute] = function(w, E) {
          if (w[m.set] && (w[m.set](s(E, m.type, m.fromSVG)),
          m.type === "color")) {
            var A = w[m.get]();
            if (A && A._scaleToBounds) {
              var N = w.getBounds();
              A.transform(new le().translate(N.getPoint()).scale(N.getSize()))
            }
          }
        }
      }, {}), {
        id: function(m, w) {
          e[w] = m,
          m.setName && m.setName(w)
        },
        "clip-path": function(m, w) {
          var E = x(w);
          if (E)
            if (E = E.clone(),
              E.setClipMask(!0),
            m instanceof We)
              m.insertChild(0, E);
            else
              return new We(E,m)
        },
        gradientTransform: y,
        transform: y,
        "fill-opacity": _,
        "stroke-opacity": _,
        visibility: function(m, w) {
          m.setVisible && m.setVisible(w === "visible")
        },
        display: function(m, w) {
          m.setVisible && m.setVisible(w !== null)
        },
        "stop-color": function(m, w) {
          m.setColor && m.setColor(w)
        },
        "stop-opacity": function(m, w) {
          m._color && m._color.setAlpha(parseFloat(w))
        },
        offset: function(m, w) {
          if (m.setOffset) {
            var E = w.match(/(.*)%$/);
            m.setOffset(E ? E[1] / 100 : parseFloat(w))
          }
        },
        viewBox: function(m, w, E, A, N) {
          var L = new Y(s(w, "array")), R = r(A, null, null, !0), D, V;
          if (m instanceof We) {
            var z = R ? R.divide(L.getSize()) : 1
              , V = new le().scale(z).translate(L.getPoint().negate());
            D = m
          } else
            m instanceof dt && (R && L.setSize(R),
              D = m._item);
          if (D) {
            if (b(A, "overflow", N) !== "visible") {
              var G = new je.Rectangle(L);
              G.setClipMask(!0),
                D.addChild(G)
            }
            V && D.transform(V)
          }
        }
      });
      function b(m, w, E) {
        var A = m.attributes[w]
          , N = A && A.value;
        if (!N && m.style) {
          var L = d.camelize(w);
          N = m.style[L],
          !N && E.node[L] !== E.parent[L] && (N = E.node[L])
        }
        return N ? N === "none" ? null : N : a
      }
      function T(m, w, E) {
        var A = w.parentNode
          , N = {
          node: Ce.getStyles(w) || {},
          parent: !E && !/^defs$/i.test(A.tagName) && Ce.getStyles(A) || {}
        };
        return d.each(v, function(L, R) {
          var D = b(w, R, N);
          m = D !== a && L(m, D, R, w, N) || m
        }),
          m
      }
      function x(m) {
        var w = m && m.match(/\((?:["'#]*)([^"')]+)/)
          , E = w && w[1]
          , A = E && e[h ? E.replace(h.location.href.split("#")[0] + "#", "") : E];
        return A && A._scaleToBounds && (A = A.clone(),
          A._scaleToBounds = !0),
          A
      }
      function S(m, w, E) {
        var A = m.nodeName.toLowerCase(), N = A !== "#document", L = p.body, R, D, V;
        E && N && (t = ae.getView().getSize(),
          t = r(m, null, null, !0) || t,
          R = Qe.create("svg", {
            style: "stroke-width: 1px; stroke-miterlimit: 10"
          }),
          D = m.parentNode,
          V = m.nextSibling,
          R.appendChild(m),
          L.appendChild(R));
        var z = ae.settings
          , G = z.applyMatrix
          , H = z.insertItems;
        z.applyMatrix = !1,
          z.insertItems = !1;
        var K = g[A]
          , $ = K && K(m, A, w, E) || null;
        if (z.insertItems = H,
          z.applyMatrix = G,
          $) {
          N && !($ instanceof We) && ($ = T($, m, E));
          var W = w.onImport
            , te = N && m.getAttribute("data-paper-data");
          W && ($ = W(m, $, w) || $),
          w.expandShapes && $ instanceof je && ($.remove(),
            $ = $.toPath()),
          te && ($._data = JSON.parse(te))
        }
        return R && (L.removeChild(R),
        D && (V ? D.insertBefore(m, V) : D.appendChild(m))),
        E && (e = {},
        $ && d.pick(w.applyMatrix, G) && $.matrix.apply(!0, !0)),
          $
      }
      function I(m, w, E) {
        if (!m)
          return null;
        w = typeof w == "function" ? {
          onLoad: w
        } : w || {};
        var A = ae
          , N = null;
        function L(z) {
          try {
            var G = typeof z == "object" ? z : new c.DOMParser().parseFromString(z.trim(), "image/svg+xml");
            if (!G.nodeName)
              throw G = null,
                new Error("Unsupported SVG source: " + m);
            ae = A,
              N = S(G, w, !0),
            (!w || w.insert !== !1) && E._insertItem(a, N);
            var H = w.onLoad;
            H && H(N, z)
          } catch (K) {
            R(K)
          }
        }
        function R(z, G) {
          var H = w.onError;
          if (H)
            H(z, G);
          else
            throw new Error(z)
        }
        if (typeof m == "string" && !/^[\s\S]*</.test(m)) {
          var D = p.getElementById(m);
          D ? L(D) : Bn.request({
            url: m,
            async: !0,
            onLoad: L,
            onError: R
          })
        } else if (typeof File < "u" && m instanceof File) {
          var V = new FileReader;
          return V.onload = function() {
            L(V.result)
          }
            ,
            V.onerror = function() {
              R(V.error)
            }
            ,
            V.readAsText(m)
        } else
          L(m);
        return N
      }
      oe.inject({
        importSVG: function(m, w) {
          return I(m, w, this)
        }
      }),
        ye.inject({
          importSVG: function(m, w) {
            return this.activate(),
              I(m, w, this)
          }
        })
    }
  ;
  var ae = new (F.inject(d.exports, {
    Base: d,
    Numerical: O,
    Key: cn,
    DomEvent: tt,
    DomElement: Ce,
    document: p,
    window: h,
    Symbol: dt,
    PlacedSymbol: ft
  }));
  return ae
}
  .call(void 0, typeof self == "object" ? self : null)
  , ce = Sa;
function _n(c, a, h, p) {
  function d(M) {
    return M instanceof h ? M : new h(function(F) {
        F(M)
      }
    )
  }
  return new (h || (h = Promise))(function(M, F) {
      function Z(O) {
        try {
          k(p.next(O))
        } catch (B) {
          F(B)
        }
      }
      function q(O) {
        try {
          k(p.throw(O))
        } catch (B) {
          F(B)
        }
      }
      function k(O) {
        O.done ? M(O.value) : d(O.value).then(Z, q)
      }
      k((p = p.apply(c, a || [])).next())
    }
  )
}
var ri = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}
  , Ir = {
  exports: {}
};
(function(c) {
    var a = Object.prototype.hasOwnProperty
      , h = "~";
    function p() {}
    Object.create && (p.prototype = Object.create(null),
    new p().__proto__ || (h = !1));
    function d(q, k, O) {
      this.fn = q,
        this.context = k,
        this.once = O || !1
    }
    function M(q, k, O, B, C) {
      if (typeof O != "function")
        throw new TypeError("The listener must be a function");
      var Q = new d(O,B || q,C)
        , J = h ? h + k : k;
      return q._events[J] ? q._events[J].fn ? q._events[J] = [q._events[J], Q] : q._events[J].push(Q) : (q._events[J] = Q,
        q._eventsCount++),
        q
    }
    function F(q, k) {
      --q._eventsCount === 0 ? q._events = new p : delete q._events[k]
    }
    function Z() {
      this._events = new p,
        this._eventsCount = 0
    }
    Z.prototype.eventNames = function() {
      var k = [], O, B;
      if (this._eventsCount === 0)
        return k;
      for (B in O = this._events)
        a.call(O, B) && k.push(h ? B.slice(1) : B);
      return Object.getOwnPropertySymbols ? k.concat(Object.getOwnPropertySymbols(O)) : k
    }
      ,
      Z.prototype.listeners = function(k) {
        var O = h ? h + k : k
          , B = this._events[O];
        if (!B)
          return [];
        if (B.fn)
          return [B.fn];
        for (var C = 0, Q = B.length, J = new Array(Q); C < Q; C++)
          J[C] = B[C].fn;
        return J
      }
      ,
      Z.prototype.listenerCount = function(k) {
        var O = h ? h + k : k
          , B = this._events[O];
        return B ? B.fn ? 1 : B.length : 0
      }
      ,
      Z.prototype.emit = function(k, O, B, C, Q, J) {
        var ne = h ? h + k : k;
        if (!this._events[ne])
          return !1;
        var Y = this._events[ne], Me = arguments.length, le, Se;
        if (Y.fn) {
          switch (Y.once && this.removeListener(k, Y.fn, void 0, !0),
            Me) {
            case 1:
              return Y.fn.call(Y.context),
                !0;
            case 2:
              return Y.fn.call(Y.context, O),
                !0;
            case 3:
              return Y.fn.call(Y.context, O, B),
                !0;
            case 4:
              return Y.fn.call(Y.context, O, B, C),
                !0;
            case 5:
              return Y.fn.call(Y.context, O, B, C, Q),
                !0;
            case 6:
              return Y.fn.call(Y.context, O, B, C, Q, J),
                !0
          }
          for (Se = 1,
                 le = new Array(Me - 1); Se < Me; Se++)
            le[Se - 1] = arguments[Se];
          Y.fn.apply(Y.context, le)
        } else {
          var ye = Y.length, oe;
          for (Se = 0; Se < ye; Se++)
            switch (Y[Se].once && this.removeListener(k, Y[Se].fn, void 0, !0),
              Me) {
              case 1:
                Y[Se].fn.call(Y[Se].context);
                break;
              case 2:
                Y[Se].fn.call(Y[Se].context, O);
                break;
              case 3:
                Y[Se].fn.call(Y[Se].context, O, B);
                break;
              case 4:
                Y[Se].fn.call(Y[Se].context, O, B, C);
                break;
              default:
                if (!le)
                  for (oe = 1,
                         le = new Array(Me - 1); oe < Me; oe++)
                    le[oe - 1] = arguments[oe];
                Y[Se].fn.apply(Y[Se].context, le)
            }
        }
        return !0
      }
      ,
      Z.prototype.on = function(k, O, B) {
        return M(this, k, O, B, !1)
      }
      ,
      Z.prototype.once = function(k, O, B) {
        return M(this, k, O, B, !0)
      }
      ,
      Z.prototype.removeListener = function(k, O, B, C) {
        var Q = h ? h + k : k;
        if (!this._events[Q])
          return this;
        if (!O)
          return F(this, Q),
            this;
        var J = this._events[Q];
        if (J.fn)
          J.fn === O && (!C || J.once) && (!B || J.context === B) && F(this, Q);
        else {
          for (var ne = 0, Y = [], Me = J.length; ne < Me; ne++)
            (J[ne].fn !== O || C && !J[ne].once || B && J[ne].context !== B) && Y.push(J[ne]);
          Y.length ? this._events[Q] = Y.length === 1 ? Y[0] : Y : F(this, Q)
        }
        return this
      }
      ,
      Z.prototype.removeAllListeners = function(k) {
        var O;
        return k ? (O = h ? h + k : k,
        this._events[O] && F(this, O)) : (this._events = new p,
          this._eventsCount = 0),
          this
      }
      ,
      Z.prototype.off = Z.prototype.removeListener,
      Z.prototype.addListener = Z.prototype.on,
      Z.prefixed = h,
      Z.EventEmitter = Z,
      c.exports = Z
  }
)(Ir);
var Ea = Ir.exports
  , Cr = function(c, a) {
  return (Cr = Object.setPrototypeOf || {
        __proto__: []
      }instanceof Array && function(h, p) {
        h.__proto__ = p
      }
      || function(h, p) {
        for (var d in p)
          Object.prototype.hasOwnProperty.call(p, d) && (h[d] = p[d])
      }
  )(c, a)
};
function He(c, a) {
  if (typeof a != "function" && a !== null)
    throw new TypeError("Class extends value " + String(a) + " is not a constructor or null");
  function h() {
    this.constructor = c
  }
  Cr(c, a),
    c.prototype = a === null ? Object.create(a) : (h.prototype = a.prototype,
      new h)
}
var rt, ee = function() {
  return (ee = Object.assign || function(c) {
      for (var a, h = 1, p = arguments.length; h < p; h++)
        for (var d in a = arguments[h])
          Object.prototype.hasOwnProperty.call(a, d) && (c[d] = a[d]);
      return c
    }
  ).apply(this, arguments)
};
function Bi(c, a, h, p) {
  return new (h = h || Promise)(function(d, M) {
      function F(k) {
        try {
          q(p.next(k))
        } catch (O) {
          M(O)
        }
      }
      function Z(k) {
        try {
          q(p.throw(k))
        } catch (O) {
          M(O)
        }
      }
      function q(k) {
        var O;
        k.done ? d(k.value) : ((O = k.value)instanceof h ? O : new h(function(B) {
            B(O)
          }
        )).then(F, Z)
      }
      q((p = p.apply(c, a || [])).next())
    }
  )
}
function Ui(c, a) {
  var h, p, d, M = {
    label: 0,
    sent: function() {
      if (1 & d[0])
        throw d[1];
      return d[1]
    },
    trys: [],
    ops: []
  }, F = {
    next: Z(0),
    throw: Z(1),
    return: Z(2)
  };
  return typeof Symbol == "function" && (F[Symbol.iterator] = function() {
      return this
    }
  ),
    F;
  function Z(q) {
    return function(k) {
      return function(O) {
        if (h)
          throw new TypeError("Generator is already executing.");
        for (; M; )
          try {
            if (h = 1,
            p && (d = 2 & O[0] ? p.return : O[0] ? p.throw || ((d = p.return) && d.call(p),
              0) : p.next) && !(d = d.call(p, O[1])).done)
              return d;
            switch (p = 0,
              (O = d ? [2 & O[0], d.value] : O)[0]) {
              case 0:
              case 1:
                d = O;
                break;
              case 4:
                return M.label++,
                  {
                    value: O[1],
                    done: !1
                  };
              case 5:
                M.label++,
                  p = O[1],
                  O = [0];
                continue;
              case 7:
                O = M.ops.pop(),
                  M.trys.pop();
                continue;
              default:
                if (!(d = 0 < (d = M.trys).length && d[d.length - 1]) && (O[0] === 6 || O[0] === 2)) {
                  M = 0;
                  continue
                }
                if (O[0] === 3 && (!d || O[1] > d[0] && O[1] < d[3])) {
                  M.label = O[1];
                  break
                }
                if (O[0] === 6 && M.label < d[1]) {
                  M.label = d[1],
                    d = O;
                  break
                }
                if (d && M.label < d[2]) {
                  M.label = d[2],
                    M.ops.push(O);
                  break
                }
                d[2] && M.ops.pop(),
                  M.trys.pop();
                continue
            }
            O = a.call(c, M)
          } catch (B) {
            O = [6, B],
              p = 0
          } finally {
            h = d = 0
          }
        if (5 & O[0])
          throw O[1];
        return {
          value: O[0] ? O[1] : void 0,
          done: !0
        }
      }([q, k])
    }
  }
}
function lt(c) {
  var a = typeof Symbol == "function" && Symbol.iterator
    , h = a && c[a]
    , p = 0;
  if (h)
    return h.call(c);
  if (c && typeof c.length == "number")
    return {
      next: function() {
        return {
          value: (c = c && p >= c.length ? void 0 : c) && c[p++],
          done: !c
        }
      }
    };
  throw new TypeError(a ? "Object is not iterable." : "Symbol.iterator is not defined.")
}
function It(c, a) {
  var h = typeof Symbol == "function" && c[Symbol.iterator];
  if (!h)
    return c;
  var p, d, M = h.call(c), F = [];
  try {
    for (; (a === void 0 || 0 < a--) && !(p = M.next()).done; )
      F.push(p.value)
  } catch (Z) {
    d = {
      error: Z
    }
  } finally {
    try {
      p && !p.done && (h = M.return) && h.call(M)
    } finally {
      if (d)
        throw d.error
    }
  }
  return F
}
function Tt(c, a) {
  for (var h = 0, p = a.length, d = c.length; h < p; h++,
    d++)
    c[d] = a[h];
  return c
}
(function(c) {
    c.assertNever = function(a) {
      throw new Error
    }
      ,
      c.arrayToEnum = function(a) {
        var h, p, d = {};
        try {
          for (var M = lt(a), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            d[Z] = Z
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      }
      ,
      c.getValidEnumValues = function(a) {
        var h, p, d = c.objectKeys(a).filter(function(k) {
          return typeof a[a[k]] != "number"
        }), M = {};
        try {
          for (var F = lt(d), Z = F.next(); !Z.done; Z = F.next()) {
            var q = Z.value;
            M[q] = a[q]
          }
        } catch (k) {
          h = {
            error: k
          }
        } finally {
          try {
            Z && !Z.done && (p = F.return) && p.call(F)
          } finally {
            if (h)
              throw h.error
          }
        }
        return c.objectValues(M)
      }
      ,
      c.objectValues = function(a) {
        return c.objectKeys(a).map(function(h) {
          return a[h]
        })
      }
      ,
      c.objectKeys = typeof Object.keys == "function" ? function(a) {
          return Object.keys(a)
        }
        : function(a) {
          var h, p = [];
          for (h in a)
            Object.prototype.hasOwnProperty.call(a, h) && p.push(h);
          return p
        }
      ,
      c.find = function(a, h) {
        var p, d;
        try {
          for (var M = lt(a), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            if (h(Z))
              return Z
          }
        } catch (q) {
          p = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (d = M.return) && d.call(M)
          } finally {
            if (p)
              throw p.error
          }
        }
      }
      ,
      c.isInteger = typeof Number.isInteger == "function" ? function(a) {
          return Number.isInteger(a)
        }
        : function(a) {
          return typeof a == "number" && isFinite(a) && Math.floor(a) === a
        }
  }
)(rt = rt || {});
var et, be = rt.arrayToEnum(["invalid_type", "custom", "invalid_union", "invalid_enum_value", "unrecognized_keys", "invalid_arguments", "invalid_return_type", "invalid_date", "invalid_string", "too_small", "too_big", "invalid_intersection_types", "not_multiple_of"]), Ta = function(c) {
  return JSON.stringify(c, null, 2).replace(/"([^"]+)":/g, "$1:")
}, On = function(c) {
  function a(h) {
    var p = this.constructor
      , d = c.call(this) || this;
    return d.issues = [],
      d.format = function() {
        var M = {
          _errors: []
        }
          , F = function(Z) {
          var q, k;
          try {
            for (var O = lt(Z.issues), B = O.next(); !B.done; B = O.next()) {
              var C = B.value;
              if (C.code === "invalid_union")
                C.unionErrors.map(F);
              else if (C.code === "invalid_return_type")
                F(C.returnTypeError);
              else if (C.code === "invalid_arguments")
                F(C.argumentsError);
              else if (C.path.length === 0)
                M._errors.push(C.message);
              else
                for (var Q = M, J = 0; J < C.path.length; ) {
                  var ne, Y = C.path[J];
                  J === C.path.length - 1 ? (Q[Y] = Q[Y] || {
                    _errors: []
                  },
                    Q[Y]._errors.push(C.message)) : typeof Y == "string" ? Q[Y] = Q[Y] || {
                    _errors: []
                  } : typeof Y == "number" && ((ne = [])._errors = [],
                    Q[Y] = Q[Y] || ne),
                    Q = Q[Y],
                    J++
                }
            }
          } catch (Me) {
            q = {
              error: Me
            }
          } finally {
            try {
              B && !B.done && (k = O.return) && k.call(O)
            } finally {
              if (q)
                throw q.error
            }
          }
        };
        return F(d),
          M
      }
      ,
      d.addIssue = function(M) {
        d.issues = Tt(Tt([], It(d.issues), !1), [M])
      }
      ,
      d.addIssues = function(M) {
        M === void 0 && (M = []),
          d.issues = Tt(Tt([], It(d.issues), !1), It(M))
      }
      ,
      d.flatten = function(M) {
        var F, Z;
        M === void 0 && (M = function(Q) {
            return Q.message
          }
        );
        var q = {}
          , k = [];
        try {
          for (var O = lt(d.issues), B = O.next(); !B.done; B = O.next()) {
            var C = B.value;
            0 < C.path.length ? (q[C.path[0]] = q[C.path[0]] || [],
              q[C.path[0]].push(M(C))) : k.push(M(C))
          }
        } catch (Q) {
          F = {
            error: Q
          }
        } finally {
          try {
            B && !B.done && (Z = O.return) && Z.call(O)
          } finally {
            if (F)
              throw F.error
          }
        }
        return {
          formErrors: k,
          fieldErrors: q
        }
      }
      ,
      p = p.prototype,
      Object.setPrototypeOf ? Object.setPrototypeOf(d, p) : d.__proto__ = p,
      d.name = "ZodError",
      d.issues = h,
      d
  }
  return He(a, c),
    Object.defineProperty(a.prototype, "errors", {
      get: function() {
        return this.issues
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype.toString = function() {
      return this.message
    }
    ,
    Object.defineProperty(a.prototype, "message", {
      get: function() {
        return JSON.stringify(this.issues, null, 2)
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "isEmpty", {
      get: function() {
        return this.issues.length === 0
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "formErrors", {
      get: function() {
        return this.flatten()
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h) {
      return new a(h)
    }
    ,
    a
}(Error), ji = function(c, a) {
  var h;
  switch (c.code) {
    case be.invalid_type:
      h = c.received === "undefined" ? "Required" : "Expected " + c.expected + ", received " + c.received;
      break;
    case be.unrecognized_keys:
      h = "Unrecognized key(s) in object: " + c.keys.map(function(p) {
        return "'" + p + "'"
      }).join(", ");
      break;
    case be.invalid_union:
      h = "Invalid input";
      break;
    case be.invalid_enum_value:
      h = "Invalid enum value. Expected " + c.options.map(function(p) {
        return typeof p == "string" ? "'" + p + "'" : p
      }).join(" | ") + ", received " + (typeof a.data == "string" ? "'" + a.data + "'" : a.data);
      break;
    case be.invalid_arguments:
      h = "Invalid function arguments";
      break;
    case be.invalid_return_type:
      h = "Invalid function return type";
      break;
    case be.invalid_date:
      h = "Invalid date";
      break;
    case be.invalid_string:
      h = c.validation !== "regex" ? "Invalid " + c.validation : "Invalid";
      break;
    case be.too_small:
      h = c.type === "array" ? "Should have " + (c.inclusive ? "at least" : "more than") + " " + c.minimum + " items" : c.type === "string" ? "Should be " + (c.inclusive ? "at least" : "over") + " " + c.minimum + " characters" : c.type === "number" ? "Value should be greater than " + (c.inclusive ? "or equal to " : "") + c.minimum : "Invalid input";
      break;
    case be.too_big:
      h = c.type === "array" ? "Should have " + (c.inclusive ? "at most" : "less than") + " " + c.maximum + " items" : c.type === "string" ? "Should be " + (c.inclusive ? "at most" : "under") + " " + c.maximum + " characters long" : c.type === "number" ? "Value should be less than " + (c.inclusive ? "or equal to " : "") + c.maximum : "Invalid input";
      break;
    case be.custom:
      h = "Invalid input";
      break;
    case be.invalid_intersection_types:
      h = "Intersection results could not be merged";
      break;
    case be.not_multiple_of:
      h = "Should be multiple of " + c.multipleOf;
      break;
    default:
      h = a.defaultError,
        rt.assertNever(c)
  }
  return {
    message: h
  }
}, qi = ji, Ia = function(c) {
  qi = c
}, we = rt.arrayToEnum(["string", "nan", "number", "integer", "float", "boolean", "date", "bigint", "symbol", "function", "undefined", "null", "array", "object", "unknown", "promise", "void", "never", "map", "set"]), wt = function(c) {
  switch (typeof c) {
    case "undefined":
      return we.undefined;
    case "string":
      return we.string;
    case "number":
      return isNaN(c) ? we.nan : we.number;
    case "boolean":
      return we.boolean;
    case "function":
      return we.function;
    case "bigint":
      return we.bigint;
    case "object":
      return Array.isArray(c) ? we.array : c === null ? we.null : c.then && typeof c.then == "function" && c.catch && typeof c.catch == "function" ? we.promise : c instanceof Map ? we.map : c instanceof Set ? we.set : c instanceof Date ? we.date : we.object;
    default:
      return we.unknown
  }
}, ui = function(d) {
  var a, h, p = d.data, M = d.path, q = d.errorMaps, d = d.issueData, M = Tt(Tt([], It(M), !1), It(d.path || [])), F = ee(ee({}, d), {
    path: M
  }), Z = "", q = q.filter(function(B) {
    return !!B
  }).slice().reverse();
  try {
    for (var k = lt(q), O = k.next(); !O.done; O = k.next())
      Z = (0,
        O.value)(F, {
        data: p,
        defaultError: Z
      }).message
  } catch (B) {
    a = {
      error: B
    }
  } finally {
    try {
      O && !O.done && (h = k.return) && h.call(k)
    } finally {
      if (a)
        throw a.error
    }
  }
  return ee(ee({}, d), {
    path: M,
    message: d.message || Z
  })
}, Ca = null, Nn = function(c) {
  if (c === null)
    return [];
  for (var a = new Array(c.count); c !== null; )
    a[c.count - 1] = c.component,
      c = c.parent;
  return a
}, Ar = function(c) {
  for (var a = null, h = 0; h < c.length; h++)
    a = {
      parent: a,
      component: c[h],
      count: h + 1
    };
  return a
}, li = function() {
  function c(a) {
    this.def = a
  }
  return Object.defineProperty(c.prototype, "path", {
    get: function() {
      return this.def.path
    },
    enumerable: !1,
    configurable: !0
  }),
    Object.defineProperty(c.prototype, "issues", {
      get: function() {
        return this.def.issues
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(c.prototype, "errorMap", {
      get: function() {
        return this.def.errorMap
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(c.prototype, "async", {
      get: function() {
        return this.def.async
      },
      enumerable: !1,
      configurable: !0
    }),
    c.prototype.stepInto = function(a) {
      return new c(ee(ee({}, this.def), {
        path: this.path === null ? {
          parent: null,
          count: 1,
          component: a
        } : {
          parent: this.path,
          count: this.path.count + 1,
          component: a
        }
      }))
    }
    ,
    c.prototype._addIssue = function(a, h, p) {
      p === void 0 && (p = {}),
        p = ui({
          data: a,
          issueData: h,
          path: Nn(this.path),
          errorMaps: [this.def.errorMap, p.schemaErrorMap, qi, ji]
        }),
        this.issues.push(p)
    }
    ,
    c
}(), Pe = Object.freeze({
  valid: !1
}), Ue = function(c) {
  return {
    valid: !0,
    value: c
  }
}, Lt = function(c) {
  return c.valid === !1
}, Qt = function(c) {
  return c.valid === !0
}, vn = function(c) {
  return c instanceof Promise
};
(function(c) {
    c.errToObj = function(a) {
      return typeof a == "string" ? {
        message: a
      } : a || {}
    }
      ,
      c.toString = function(a) {
        return typeof a == "string" ? a : a?.message
      }
  }
)(et = et || {});
var wr = function(c) {
  return new li({
    path: Ar(c.path || []),
    issues: [],
    errorMap: c.errorMap,
    async: (c = c.async) !== null && c !== void 0 && c
  })
}
  , br = function(c, a) {
  return Qt(a) && !c.issues.length ? {
    success: !0,
    data: a.value
  } : {
    success: !1,
    error: new On(c.issues)
  }
};
function Ve(c) {
  if (!c)
    return {};
  if (c.errorMap && (c.invalid_type_error || c.required_error))
    throw new Error(`Can't use "invalid" or "required" in conjunction with custom error map.`);
  return c.errorMap ? {
    errorMap: c.errorMap
  } : {
    errorMap: function(a, h) {
      return a.code !== "invalid_type" ? {
        message: h.defaultError
      } : h.data === void 0 && c.required_error ? {
        message: c.required_error
      } : c.invalid_type_error ? {
        message: c.invalid_type_error
      } : {
        message: h.defaultError
      }
    }
  }
}
var Vn, Fe = function() {
  function c(a) {
    this.spa = this.safeParseAsync,
      this.superRefine = this._refinement,
      this._def = a,
      this.transform = this.transform.bind(this),
      this.default = this.default.bind(this)
  }
  return c.prototype.addIssue = function(a, h, p) {
    a._addIssue(p.data, h, {
      schemaErrorMap: this._def.errorMap
    })
  }
    ,
    c.prototype._parseSync = function(a, h, p) {
      if (p = this._parse(a, h, p),
        vn(p))
        throw new Error("Synchronous parse encountered promise.");
      return p
    }
    ,
    c.prototype._parseAsync = function(a, h, p) {
      return p = this._parse(a, h, p),
        Promise.resolve(p)
    }
    ,
    c.prototype.parse = function(a, h) {
      if (h = this.safeParse(a, h),
        h.success)
        return h.data;
      throw h.error
    }
    ,
    c.prototype.safeParse = function(a, h) {
      return h = wr(ee(ee({}, h), {
        async: !1
      })),
        a = this._parseSync(h, a, wt(a)),
        br(h, a)
    }
    ,
    c.prototype.parseAsync = function(a, h) {
      return Bi(this, void 0, void 0, function() {
        var p;
        return Ui(this, function(d) {
          switch (d.label) {
            case 0:
              return [4, this.safeParseAsync(a, h)];
            case 1:
              if ((p = d.sent()).success)
                return [2, p.data];
              throw p.error
          }
        })
      })
    }
    ,
    c.prototype.safeParseAsync = function(a, h) {
      return Bi(this, void 0, void 0, function() {
        var p, d;
        return Ui(this, function(M) {
          switch (M.label) {
            case 0:
              return p = wr(ee(ee({}, h), {
                async: !0
              })),
                d = this._parse(p, a, wt(a)),
                [4, vn(d) ? d : Promise.resolve(d)];
            case 1:
              return d = M.sent(),
                [2, br(p, d)]
          }
        })
      })
    }
    ,
    c.prototype.refine = function(a, h) {
      return this._refinement(function(p, d) {
        function M() {
          return d.addIssue(ee({
            code: be.custom
          }, (Z = p,
            typeof h == "string" || h === void 0 ? {
              message: h
            } : typeof h == "function" ? h(Z) : h)));
          var Z
        }
        var F = a(p);
        return F instanceof Promise ? F.then(function(Z) {
          return !!Z || (M(),
            !1)
        }) : !!F || (M(),
          !1)
      })
    }
    ,
    c.prototype.refinement = function(a, h) {
      return this._refinement(function(p, d) {
        return !!a(p) || (d.addIssue(typeof h == "function" ? h(p, d) : h),
          !1)
      })
    }
    ,
    c.prototype._refinement = function(a) {
      return new Mn({
        schema: this,
        typeName: Le.ZodEffects,
        effect: {
          type: "refinement",
          refinement: a
        }
      })
    }
    ,
    c.prototype.optional = function() {
      return on.create(this)
    }
    ,
    c.prototype.nullable = function() {
      return Gn.create(this)
    }
    ,
    c.prototype.nullish = function() {
      return this.optional().nullable()
    }
    ,
    c.prototype.array = function() {
      return Fn.create(this)
    }
    ,
    c.prototype.promise = function() {
      return _i.create(this)
    }
    ,
    c.prototype.or = function(a) {
      return Yi.create([this, a])
    }
    ,
    c.prototype.and = function(a) {
      return pi.create(this, a)
    }
    ,
    c.prototype.transform = function(a) {
      return new Mn({
        schema: this,
        typeName: Le.ZodEffects,
        effect: {
          type: "transform",
          transform: a
        }
      })
    }
    ,
    c.prototype.default = function(a) {
      return new Gr({
        innerType: this,
        defaultValue: typeof a == "function" ? a : function() {
          return a
        }
        ,
        typeName: Le.ZodDefault
      })
    }
    ,
    c.prototype.isOptional = function() {
      return this.safeParse(void 0).success
    }
    ,
    c.prototype.isNullable = function() {
      return this.safeParse(null).success
    }
    ,
    c
}(), Aa = /^c[^\s-]{8,}$/i, Pa = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i, Oa = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i, Ki = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h._regex = function(p, d, M) {
      return h.refinement(function(F) {
        return p.test(F)
      }, ee({
        validation: d,
        code: be.invalid_string
      }, et.errToObj(M)))
    }
      ,
      h.nonempty = function(p) {
        return h.min(1, et.errToObj(p))
      }
      ,
      h
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      var M, F;
      if (d !== we.string)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.string,
          received: d
        }, {
          data: p
        }),
          Pe;
      var Z = !1;
      try {
        for (var q = lt(this._def.checks), k = q.next(); !k.done; k = q.next()) {
          var O = k.value;
          if (O.kind === "min")
            p.length < O.value && (Z = !0,
              this.addIssue(h, {
                code: be.too_small,
                minimum: O.value,
                type: "string",
                inclusive: !0,
                message: O.message
              }, {
                data: p
              }));
          else if (O.kind === "max")
            p.length > O.value && (Z = !0,
              this.addIssue(h, {
                code: be.too_big,
                maximum: O.value,
                type: "string",
                inclusive: !0,
                message: O.message
              }, {
                data: p
              }));
          else if (O.kind === "email")
            Oa.test(p) || (Z = !0,
              this.addIssue(h, {
                validation: "email",
                code: be.invalid_string,
                message: O.message
              }, {
                data: p
              }));
          else if (O.kind === "uuid")
            Pa.test(p) || (Z = !0,
              this.addIssue(h, {
                validation: "uuid",
                code: be.invalid_string,
                message: O.message
              }, {
                data: p
              }));
          else if (O.kind === "cuid")
            Aa.test(p) || (Z = !0,
              this.addIssue(h, {
                validation: "cuid",
                code: be.invalid_string,
                message: O.message
              }, {
                data: p
              }));
          else if (O.kind === "url")
            try {
              new URL(p)
            } catch {
              Z = !0,
                this.addIssue(h, {
                  validation: "url",
                  code: be.invalid_string,
                  message: O.message
                }, {
                  data: p
                })
            }
          else
            O.kind === "regex" && (O.regex.lastIndex = 0,
            O.regex.test(p) || (Z = !0,
              this.addIssue(h, {
                validation: "regex",
                code: be.invalid_string,
                message: O.message
              }, {
                data: p
              })))
        }
      } catch (B) {
        M = {
          error: B
        }
      } finally {
        try {
          k && !k.done && (F = q.return) && F.call(q)
        } finally {
          if (M)
            throw M.error
        }
      }
      return Z ? Pe : Ue(p)
    }
    ,
    a.prototype._addCheck = function(h) {
      return new a(ee(ee({}, this._def), {
        checks: Tt(Tt([], It(this._def.checks), !1), [h])
      }))
    }
    ,
    a.prototype.email = function(h) {
      return this._addCheck(ee({
        kind: "email"
      }, et.errToObj(h)))
    }
    ,
    a.prototype.url = function(h) {
      return this._addCheck(ee({
        kind: "url"
      }, et.errToObj(h)))
    }
    ,
    a.prototype.uuid = function(h) {
      return this._addCheck(ee({
        kind: "uuid"
      }, et.errToObj(h)))
    }
    ,
    a.prototype.cuid = function(h) {
      return this._addCheck(ee({
        kind: "cuid"
      }, et.errToObj(h)))
    }
    ,
    a.prototype.regex = function(h, p) {
      return this._addCheck(ee({
        kind: "regex",
        regex: h
      }, et.errToObj(p)))
    }
    ,
    a.prototype.min = function(h, p) {
      return this._addCheck(ee({
        kind: "min",
        value: h
      }, et.errToObj(p)))
    }
    ,
    a.prototype.max = function(h, p) {
      return this._addCheck(ee({
        kind: "max",
        value: h
      }, et.errToObj(p)))
    }
    ,
    a.prototype.length = function(h, p) {
      return this.min(h, p).max(h, p)
    }
    ,
    Object.defineProperty(a.prototype, "isEmail", {
      get: function() {
        return !!this._def.checks.find(function(h) {
          return h.kind === "email"
        })
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "isURL", {
      get: function() {
        return !!this._def.checks.find(function(h) {
          return h.kind === "url"
        })
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "isUUID", {
      get: function() {
        return !!this._def.checks.find(function(h) {
          return h.kind === "uuid"
        })
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "isCUID", {
      get: function() {
        return !!this._def.checks.find(function(h) {
          return h.kind === "cuid"
        })
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "minLength", {
      get: function() {
        var h = -1 / 0;
        return this._def.checks.map(function(p) {
          p.kind === "min" && (h === null || p.value > h) && (h = p.value)
        }),
          h
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "maxLength", {
      get: function() {
        var h = null;
        return this._def.checks.map(function(p) {
          p.kind === "max" && (h === null || p.value < h) && (h = p.value)
        }),
          h
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h) {
      return new a(ee({
        checks: [],
        typeName: Le.ZodString
      }, Ve(h)))
    }
    ,
    a
}(Fe), Pr = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h.min = h.gte,
      h.max = h.lte,
      h.step = h.multipleOf,
      h
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      var M, F;
      if (d !== we.number)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.number,
          received: d
        }, {
          data: p
        }),
          Pe;
      var Z = !1;
      try {
        for (var q = lt(this._def.checks), k = q.next(); !k.done; k = q.next()) {
          var O = k.value;
          O.kind === "int" ? rt.isInteger(p) || (Z = !0,
            this.addIssue(h, {
              code: be.invalid_type,
              expected: "integer",
              received: "float",
              message: O.message
            }, {
              data: p
            })) : O.kind === "min" ? (O.inclusive ? p < O.value : p <= O.value) && (Z = !0,
            this.addIssue(h, {
              code: be.too_small,
              minimum: O.value,
              type: "number",
              inclusive: O.inclusive,
              message: O.message
            }, {
              data: p
            })) : O.kind === "max" ? (O.inclusive ? p > O.value : p >= O.value) && (Z = !0,
            this.addIssue(h, {
              code: be.too_big,
              maximum: O.value,
              type: "number",
              inclusive: O.inclusive,
              message: O.message
            }, {
              data: p
            })) : O.kind === "multipleOf" ? p % O.value != 0 && (Z = !0,
            this.addIssue(h, {
              code: be.not_multiple_of,
              multipleOf: O.value,
              message: O.message
            }, {
              data: p
            })) : rt.assertNever(O)
        }
      } catch (B) {
        M = {
          error: B
        }
      } finally {
        try {
          k && !k.done && (F = q.return) && F.call(q)
        } finally {
          if (M)
            throw M.error
        }
      }
      return Z ? Pe : Ue(p)
    }
    ,
    a.prototype.gte = function(h, p) {
      return this.setLimit("min", h, !0, et.toString(p))
    }
    ,
    a.prototype.gt = function(h, p) {
      return this.setLimit("min", h, !1, et.toString(p))
    }
    ,
    a.prototype.lte = function(h, p) {
      return this.setLimit("max", h, !0, et.toString(p))
    }
    ,
    a.prototype.lt = function(h, p) {
      return this.setLimit("max", h, !1, et.toString(p))
    }
    ,
    a.prototype.setLimit = function(h, p, d, M) {
      return new a(ee(ee({}, this._def), {
        checks: Tt(Tt([], It(this._def.checks), !1), [{
          kind: h,
          value: p,
          inclusive: d,
          message: et.toString(M)
        }])
      }))
    }
    ,
    a.prototype._addCheck = function(h) {
      return new a(ee(ee({}, this._def), {
        checks: Tt(Tt([], It(this._def.checks), !1), [h])
      }))
    }
    ,
    a.prototype.int = function(h) {
      return this._addCheck({
        kind: "int",
        message: et.toString(h)
      })
    }
    ,
    a.prototype.positive = function(h) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !1,
        message: et.toString(h)
      })
    }
    ,
    a.prototype.negative = function(h) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !1,
        message: et.toString(h)
      })
    }
    ,
    a.prototype.nonpositive = function(h) {
      return this._addCheck({
        kind: "max",
        value: 0,
        inclusive: !0,
        message: et.toString(h)
      })
    }
    ,
    a.prototype.nonnegative = function(h) {
      return this._addCheck({
        kind: "min",
        value: 0,
        inclusive: !0,
        message: et.toString(h)
      })
    }
    ,
    a.prototype.multipleOf = function(h, p) {
      return this._addCheck({
        kind: "multipleOf",
        value: h,
        message: et.toString(p)
      })
    }
    ,
    Object.defineProperty(a.prototype, "minValue", {
      get: function() {
        var h, p, d = null;
        try {
          for (var M = lt(this._def.checks), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            Z.kind === "min" && (d === null || Z.value > d) && (d = Z.value)
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "maxValue", {
      get: function() {
        var h, p, d = null;
        try {
          for (var M = lt(this._def.checks), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            Z.kind === "max" && (d === null || Z.value < d) && (d = Z.value)
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "isInt", {
      get: function() {
        return !!this._def.checks.find(function(h) {
          return h.kind === "int"
        })
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h) {
      return new a(ee(ee({
        checks: [],
        typeName: Le.ZodNumber
      }, Ve(h)), Ve(h)))
    }
    ,
    a
}(Fe), Or = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.bigint ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.bigint,
        received: d
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodBigInt
      }, Ve(h)))
    }
    ,
    a
}(Fe), xr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.boolean ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.boolean,
        received: d
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodBoolean
      }, Ve(h)))
    }
    ,
    a
}(Fe), Nr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.date ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.date,
        received: d
      }, {
        data: p
      }),
        Pe) : isNaN(p.getTime()) ? (this.addIssue(h, {
        code: be.invalid_date
      }, {
        data: p
      }),
        Pe) : Ue(new Date(p.getTime()))
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodDate
      }, Ve(h)))
    }
    ,
    a
}(Fe), Lr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.undefined ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.undefined,
        received: d
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodUndefined
      }, Ve(h)))
    }
    ,
    a
}(Fe), Mr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.null ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.null,
        received: d
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodNull
      }, Ve(h)))
    }
    ,
    a
}(Fe), hi = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h._any = !0,
      h
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodAny
      }, Ve(h)))
    }
    ,
    a
}(Fe), zn = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h._unknown = !0,
      h
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodUnknown
      }, Ve(h)))
    }
    ,
    a
}(Fe), Pn = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return this.addIssue(h, {
        code: be.invalid_type,
        expected: we.never,
        received: d
      }, {
        data: p
      }),
        Pe
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodNever
      }, Ve(h)))
    }
    ,
    a
}(Fe), Rr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d !== we.undefined ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.void,
        received: d
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h) {
      return new a(ee({
        typeName: Le.ZodVoid
      }, Ve(h)))
    }
    ,
    a
}(Fe), Fn = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, F, d) {
      var M = this._def;
      if (d !== we.array)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.array,
          received: d
        }, {
          data: F
        }),
          Pe;
      var F = F
        , Z = !1;
      M.minLength !== null && F.length < M.minLength.value && (Z = !0,
        this.addIssue(h, {
          code: be.too_small,
          minimum: M.minLength.value,
          type: "array",
          inclusive: !0,
          message: M.minLength.message
        }, {
          data: F
        })),
      M.maxLength !== null && F.length > M.maxLength.value && (Z = !0,
        this.addIssue(h, {
          code: be.too_big,
          maximum: M.maxLength.value,
          type: "array",
          inclusive: !0,
          message: M.maxLength.message
        }, {
          data: F
        }));
      var q = []
        , k = new Array(F.length)
        , O = M.type
        , B = function(C, Q) {
        Qt(Q) ? k[C] = Q.value : Lt(Q) ? Z = !0 : q.push(Q.then(function(J) {
          return B(C, J)
        }))
      };
      return F.forEach(function(C, Q) {
        B(Q, O._parse(h.stepInto(Q), C, wt(C)))
      }),
        h.async ? Promise.all(q).then(function() {
          return Z ? Pe : Ue(k)
        }) : Z ? Pe : Ue(k)
    }
    ,
    Object.defineProperty(a.prototype, "element", {
      get: function() {
        return this._def.type
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype.min = function(h, p) {
      return new a(ee(ee({}, this._def), {
        minLength: {
          value: h,
          message: et.toString(p)
        }
      }))
    }
    ,
    a.prototype.max = function(h, p) {
      return new a(ee(ee({}, this._def), {
        maxLength: {
          value: h,
          message: et.toString(p)
        }
      }))
    }
    ,
    a.prototype.length = function(h, p) {
      return this.min(h, p).max(h, p)
    }
    ,
    a.prototype.nonempty = function(h) {
      return this.min(1, h)
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        type: h,
        minLength: null,
        maxLength: null,
        typeName: Le.ZodArray
      }, Ve(p)))
    }
    ,
    a
}(Fe);
(function(c) {
    c.mergeShapes = function(a, h) {
      return ee(ee({}, a), h)
    }
      ,
      c.intersectShapes = function(a, h) {
        var p, d, F = rt.objectKeys(a), M = rt.objectKeys(h), F = F.filter(function(B) {
          return M.indexOf(B) !== -1
        }), Z = {};
        try {
          for (var q = lt(F), k = q.next(); !k.done; k = q.next()) {
            var O = k.value;
            Z[O] = pi.create(a[O], h[O])
          }
        } catch (B) {
          p = {
            error: B
          }
        } finally {
          try {
            k && !k.done && (d = q.return) && d.call(q)
          } finally {
            if (p)
              throw p.error
          }
        }
        return ee(ee(ee({}, a), h), Z)
      }
  }
)(Vn = Vn || {});
var xa = function(c) {
  return function(a) {
    var h = Vn.mergeShapes(c._def.shape(), a._def.shape());
    return new un({
      unknownKeys: c._def.unknownKeys,
      catchall: c._def.catchall,
      shape: function() {
        return h
      },
      typeName: Le.ZodObject
    })
  }
}
  , Sr = function(c) {
  return function(a) {
    return new un(ee(ee({}, c), {
      shape: function() {
        return ee(ee({}, c.shape()), a)
      }
    }))
  }
};
function An(c) {
  if (c instanceof un) {
    var a, h = {};
    for (a in c.shape) {
      var p = c.shape[a];
      h[a] = on.create(An(p))
    }
    return new un(ee(ee({}, c._def), {
      shape: function() {
        return h
      }
    }))
  }
  return c instanceof Fn ? Fn.create(An(c.element)) : c instanceof on ? on.create(An(c.unwrap())) : c instanceof Gn ? Gn.create(An(c.unwrap())) : c instanceof Ln ? Ln.create(c.items.map(function(d) {
    return An(d)
  })) : c
}
var un = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h._cached = null,
      h.nonstrict = h.passthrough,
      h.augment = Sr(h._def),
      h.extend = Sr(h._def),
      h
  }
  return He(a, c),
    a.prototype._getCached = function() {
      if (this._cached !== null)
        return this._cached;
      var h = this._def.shape()
        , p = rt.objectKeys(h);
      return this._cached = {
        shape: h,
        keys: p
      }
    }
    ,
    a.prototype._parse = function(h, p, B) {
      var M, F, Z, q, k;
      if (B !== we.object)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.object,
          received: B
        }, {
          data: p
        }),
          Pe;
      var B = this._getCached()
        , O = B.shape
        , B = B.keys
        , C = !1
        , Q = []
        , J = {}
        , ne = function(qe, pe) {
        var Vt;
        Qt(pe) ? ((Vt = pe.value) !== void 0 || qe in p) && (J[qe] = Vt) : Lt(pe) ? C = !0 : Q.push(pe.then(function(re) {
          return ne(qe, re)
        }))
      };
      try {
        for (var Y = lt(B), Me = Y.next(); !Me.done; Me = Y.next()) {
          var le = Me.value
            , Se = O[le]
            , ye = p[le];
          ne(le, Se._parse(h.stepInto(le), ye, wt(ye)))
        }
      } catch (qe) {
        oe = {
          error: qe
        }
      } finally {
        try {
          Me && !Me.done && (M = Y.return) && M.call(Y)
        } finally {
          if (oe)
            throw oe.error
        }
      }
      if (this._def.catchall instanceof Pn) {
        var oe = this._def.unknownKeys;
        if (oe === "passthrough") {
          var We = rt.objectKeys(p).filter(function(qe) {
            return !(qe in O)
          });
          try {
            for (var ct = lt(We), je = ct.next(); !je.done; je = ct.next())
              le = je.value,
                J[le] = p[le]
          } catch (qe) {
            F = {
              error: qe
            }
          } finally {
            try {
              je && !je.done && (Z = ct.return) && Z.call(ct)
            } finally {
              if (F)
                throw F.error
            }
          }
        } else if (oe === "strict")
          0 < (We = rt.objectKeys(p).filter(function(qe) {
            return !(qe in O)
          })).length && (C = !0,
            this.addIssue(h, {
              code: be.unrecognized_keys,
              keys: We
            }, {
              data: p
            }));
        else if (oe !== "strip")
          throw new Error("Internal ZodObject error: invalid unknownKeys value.")
      } else {
        var Pt = this._def.catchall
          , We = rt.objectKeys(p).filter(function(pe) {
          return !(pe in O)
        });
        try {
          for (var ft = lt(We), dt = ft.next(); !dt.done; dt = ft.next())
            le = dt.value,
              ye = p[le],
              ne(le, Pt._parse(h.stepInto(le), ye, wt(ye)))
        } catch (pe) {
          q = {
            error: pe
          }
        } finally {
          try {
            dt && !dt.done && (k = ft.return) && k.call(ft)
          } finally {
            if (q)
              throw q.error
          }
        }
      }
      return h.async ? Promise.all(Q).then(function() {
        return C ? Pe : Ue(J)
      }) : C ? Pe : Ue(J)
    }
    ,
    Object.defineProperty(a.prototype, "shape", {
      get: function() {
        return this._def.shape()
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype.strict = function() {
      return new a(ee(ee({}, this._def), {
        unknownKeys: "strict"
      }))
    }
    ,
    a.prototype.strip = function() {
      return new a(ee(ee({}, this._def), {
        unknownKeys: "strip"
      }))
    }
    ,
    a.prototype.passthrough = function() {
      return new a(ee(ee({}, this._def), {
        unknownKeys: "passthrough"
      }))
    }
    ,
    a.prototype.setKey = function(h, p) {
      var d;
      return this.augment(((d = {})[h] = p,
        d))
    }
    ,
    a.prototype.merge = function(h) {
      var p = Vn.mergeShapes(this._def.shape(), h._def.shape());
      return new a({
        unknownKeys: h._def.unknownKeys,
        catchall: h._def.catchall,
        shape: function() {
          return p
        },
        typeName: Le.ZodObject
      })
    }
    ,
    a.prototype.catchall = function(h) {
      return new a(ee(ee({}, this._def), {
        catchall: h
      }))
    }
    ,
    a.prototype.pick = function(h) {
      var p = this
        , d = {};
      return rt.objectKeys(h).map(function(M) {
        d[M] = p.shape[M]
      }),
        new a(ee(ee({}, this._def), {
          shape: function() {
            return d
          }
        }))
    }
    ,
    a.prototype.omit = function(h) {
      var p = this
        , d = {};
      return rt.objectKeys(this.shape).map(function(M) {
        rt.objectKeys(h).indexOf(M) === -1 && (d[M] = p.shape[M])
      }),
        new a(ee(ee({}, this._def), {
          shape: function() {
            return d
          }
        }))
    }
    ,
    a.prototype.deepPartial = function() {
      return An(this)
    }
    ,
    a.prototype.partial = function(h) {
      var p, d = this, M = {};
      if (h)
        return rt.objectKeys(this.shape).map(function(Z) {
          rt.objectKeys(h).indexOf(Z) === -1 ? M[Z] = d.shape[Z] : M[Z] = d.shape[Z].optional()
        }),
          new a(ee(ee({}, this._def), {
            shape: function() {
              return M
            }
          }));
      for (p in this.shape) {
        var F = this.shape[p];
        M[p] = F.optional()
      }
      return new a(ee(ee({}, this._def), {
        shape: function() {
          return M
        }
      }))
    }
    ,
    a.prototype.required = function() {
      var h, p = {};
      for (h in this.shape) {
        for (var d = this.shape[h]; d instanceof on; )
          d = d._def.innerType;
        p[h] = d
      }
      return new a(ee(ee({}, this._def), {
        shape: function() {
          return p
        }
      }))
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        shape: function() {
          return h
        },
        unknownKeys: "strip",
        catchall: Pn.create(),
        typeName: Le.ZodObject
      }, Ve(p)))
    }
    ,
    a.strictCreate = function(h, p) {
      return new a(ee({
        shape: function() {
          return h
        },
        unknownKeys: "strict",
        catchall: Pn.create(),
        typeName: Le.ZodObject
      }, Ve(p)))
    }
    ,
    a.lazycreate = function(h, p) {
      return new a(ee({
        shape: h,
        unknownKeys: "strip",
        catchall: Pn.create(),
        typeName: Le.ZodObject
      }, Ve(p)))
    }
    ,
    a
}(Fe)
  , Yi = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      function M(Me) {
        var le = Me.map(function(Se) {
          return new On(Se)
        });
        return (Me = le.filter(function(Se) {
          return Se.issues[0].code !== "invalid_type"
        })).length === 1 ? Me[0].issues.forEach(function(Se) {
          return h.issues.push(Se)
        }) : q.addIssue(h, {
          code: be.invalid_union,
          unionErrors: le
        }, {
          data: p
        }),
          Pe
      }
      var F, Z, q = this, k = this._def.options;
      if (h.async) {
        var O = k.map(function() {
          return new li(ee(ee({}, h.def), {
            issues: []
          }))
        });
        return Promise.all(k.map(function(Me, le) {
          return Me._parse(O[le], p, d)
        })).then(function(Me) {
          var le, Se;
          try {
            for (var ye = lt(Me), oe = ye.next(); !oe.done; oe = ye.next()) {
              var We = oe.value;
              if (Qt(We))
                return We
            }
          } catch (ct) {
            le = {
              error: ct
            }
          } finally {
            try {
              oe && !oe.done && (Se = ye.return) && Se.call(ye)
            } finally {
              if (le)
                throw le.error
            }
          }
          return M(O.map(function(ct) {
            return ct.issues
          }))
        })
      }
      var B = [];
      try {
        for (var C = lt(k), Q = C.next(); !Q.done; Q = C.next()) {
          var J = Q.value
            , ne = new li(ee(ee({}, h.def), {
            issues: []
          }))
            , Y = J._parseSync(ne, p, d);
          if (!Lt(Y))
            return Y;
          B.push(ne.issues)
        }
      } catch (Me) {
        F = {
          error: Me
        }
      } finally {
        try {
          Q && !Q.done && (Z = C.return) && Z.call(C)
        } finally {
          if (F)
            throw F.error
        }
      }
      return M(B)
    }
    ,
    Object.defineProperty(a.prototype, "options", {
      get: function() {
        return this._def.options
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h, p) {
      return new a(ee({
        options: h,
        typeName: Le.ZodUnion
      }, Ve(p)))
    }
    ,
    a
}(Fe);
function zi(c, a) {
  var h, p, d = wt(c), M = wt(a);
  if (c === a)
    return {
      valid: !0,
      data: c
    };
  if (d === we.object && M === we.object) {
    var F = rt.objectKeys(a)
      , Z = rt.objectKeys(c).filter(function(ne) {
      return F.indexOf(ne) !== -1
    })
      , q = ee(ee({}, c), a);
    try {
      for (var k = lt(Z), O = k.next(); !O.done; O = k.next()) {
        var B = O.value;
        if (!(C = zi(c[B], a[B])).valid)
          return {
            valid: !1
          };
        q[B] = C.data
      }
    } catch (ne) {
      h = {
        error: ne
      }
    } finally {
      try {
        O && !O.done && (p = k.return) && p.call(k)
      } finally {
        if (h)
          throw h.error
      }
    }
    return {
      valid: !0,
      data: q
    }
  }
  if (d !== we.array || M !== we.array)
    return {
      valid: !1
    };
  if (c.length !== a.length)
    return {
      valid: !1
    };
  for (var C, Q = [], J = 0; J < c.length; J++) {
    if (!(C = zi(c[J], a[J])).valid)
      return {
        valid: !1
      };
    Q.push(C.data)
  }
  return {
    valid: !0,
    data: Q
  }
}
var pi = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      function M(Z, q) {
        return Lt(Z) || Lt(q) ? Pe : (q = zi(Z.value, q.value)).valid ? Ue(q.data) : (F.addIssue(h, {
          code: be.invalid_intersection_types
        }, {
          data: p
        }),
          Pe)
      }
      var F = this;
      return h.async ? Promise.all([this._def.left._parse(h, p, d), this._def.right._parse(h, p, d)]).then(function(q) {
        var k = It(q, 2)
          , q = k[0]
          , k = k[1];
        return M(q, k)
      }) : M(this._def.left._parseSync(h, p, d), this._def.right._parseSync(h, p, d))
    }
    ,
    a.create = function(h, p, d) {
      return new a(ee({
        left: h,
        right: p,
        typeName: Le.ZodIntersection
      }, Ve(d)))
    }
    ,
    a
}(Fe)
  , Ln = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      if (d !== we.array)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.array,
          received: d
        }, {
          data: p
        }),
          Pe;
      var M = this._def.rest;
      if (!M && p.length > this._def.items.length)
        return this.addIssue(h, {
          code: be.too_big,
          maximum: this._def.items.length,
          inclusive: !0,
          type: "array"
        }, {
          data: p
        }),
          Pe;
      if (p.length < this._def.items.length)
        return this.addIssue(h, {
          code: be.too_small,
          minimum: this._def.items.length,
          inclusive: !0,
          type: "array"
        }, {
          data: p
        }),
          Pe;
      var F = []
        , Z = this._def.items
        , q = new Array(p.length)
        , k = !1
        , O = function(B, C) {
        Qt(C) ? q[B] = C.value : Lt(C) ? k = !0 : F.push(C.then(function(Q) {
          return O(B, Q)
        }))
      };
      return Z.forEach(function(B, C) {
        O(C, B._parse(h.stepInto(C), p[C], wt(p[C])))
      }),
      M && p.slice(Z.length).forEach(function(B, C) {
        C += Z.length,
          O(C, M._parse(h.stepInto(C), B, wt(B)))
      }),
        h.async ? Promise.all(F).then(function() {
          return k ? Pe : Ue(q)
        }) : k ? Pe : Ue(q)
    }
    ,
    Object.defineProperty(a.prototype, "items", {
      get: function() {
        return this._def.items
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype.rest = function(h) {
      return new a(ee(ee({}, this._def), {
        rest: h
      }))
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        items: h,
        typeName: Le.ZodTuple,
        rest: null
      }, Ve(p)))
    }
    ,
    a
}(Fe)
  , Dr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    Object.defineProperty(a.prototype, "keySchema", {
      get: function() {
        return this._def.keyType
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "valueSchema", {
      get: function() {
        return this._def.valueType
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype._parse = function(h, p, d) {
      if (d !== we.object)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.object,
          received: d
        }, {
          data: p
        }),
          Pe;
      var M, F = [], Z = this._def.keyType, q = this._def.valueType, k = {}, O = !1, B = function(C, Q) {
        Qt(C) && Qt(Q) ? k[C.value] = Q.value : vn(C) || vn(Q) ? F.push(Promise.all([C, Q]).then(function(ne) {
          var Y = It(ne, 2)
            , ne = Y[0]
            , Y = Y[1];
          return B(ne, Y)
        })) : O = !0
      };
      for (M in p)
        B(Z._parse(h.stepInto(M), M, wt(M)), q._parse(h.stepInto(M), p[M], wt(p[M])));
      return h.async ? Promise.all(F).then(function() {
        return O ? Pe : Ue(k)
      }) : O ? Pe : Ue(k)
    }
    ,
    Object.defineProperty(a.prototype, "element", {
      get: function() {
        return this._def.valueType
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h, p, d) {
      return new a(p instanceof Fe ? ee({
        keyType: h,
        valueType: p,
        typeName: Le.ZodRecord
      }, Ve(d)) : ee({
        keyType: Ki.create(),
        valueType: h,
        typeName: Le.ZodRecord
      }, Ve(p)))
    }
    ,
    a
}(Fe)
  , kr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, Z, d) {
      if (d !== we.map)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.map,
          received: d
        }, {
          data: Z
        }),
          Pe;
      var M = this._def.keyType
        , F = this._def.valueType
        , Z = Z
        , q = new Map
        , k = []
        , O = !1
        , B = function(C, Q) {
        vn(C) || vn(Q) ? k.push(Promise.all([C, Q]).then(function(ne) {
          var Y = It(ne, 2)
            , ne = Y[0]
            , Y = Y[1];
          return B(ne, Y)
        })) : Lt(C) || Lt(Q) ? O = !0 : q.set(C.value, Q.value)
      };
      return Tt([], It(Z.entries())).forEach(function(ne, J) {
        var Y = It(ne, 2)
          , ne = Y[0]
          , Y = Y[1]
          , J = h.stepInto(J)
          , ne = M._parse(J.stepInto("key"), ne, wt(ne))
          , Y = F._parse(J.stepInto("value"), Y, wt(Y));
        B(ne, Y)
      }),
        h.async ? Promise.all(k).then(function() {
          return O ? Pe : Ue(q)
        }) : O ? Pe : Ue(q)
    }
    ,
    a.create = function(h, p, d) {
      return new a(ee({
        valueType: p,
        keyType: h,
        typeName: Le.ZodMap
      }, Ve(d)))
    }
    ,
    a
}(Fe)
  , Br = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, M, d) {
      if (d !== we.set)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.set,
          received: d
        }, {
          data: M
        }),
          Pe;
      var M = M
        , F = this._def.valueType
        , Z = new Set
        , q = []
        , k = !1
        , O = function(B) {
        Qt(B) ? Z.add(B.value) : Lt(B) ? k = !0 : q.push(B.then(function(C) {
          return O(C)
        }))
      };
      return Tt([], It(M.values())).forEach(function(B, C) {
        return O(F._parse(h.stepInto(C), B, wt(B)))
      }),
        h.async ? Promise.all(q).then(function() {
          return k ? Pe : Ue(Z)
        }) : k ? Pe : Ue(Z)
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        valueType: h,
        typeName: Le.ZodSet
      }, Ve(p)))
    }
    ,
    a
}(Fe)
  , Ur = function(c) {
  function a() {
    var h = c !== null && c.apply(this, arguments) || this;
    return h.validate = h.implement,
      h
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      var M = this;
      if (d !== we.function)
        return this.addIssue(h, {
          code: be.invalid_type,
          expected: we.function,
          received: d
        }, {
          data: p
        }),
          Pe;
      function F(O, B) {
        return ui({
          data: O,
          path: Nn(h.path),
          errorMaps: [h.errorMap],
          issueData: {
            code: be.invalid_arguments,
            argumentsError: B
          }
        })
      }
      function Z(O, B) {
        return ui({
          data: O,
          path: Nn(h.path),
          errorMaps: [h.errorMap],
          issueData: {
            code: be.invalid_return_type,
            returnTypeError: B
          }
        })
      }
      var q = {
        errorMap: h.errorMap
      }
        , k = p;
      return this._def.returns instanceof _i ? Ue(function() {
        for (var O = [], B = 0; B < arguments.length; B++)
          O[B] = arguments[B];
        return Bi(M, void 0, void 0, function() {
          var C, Q, J;
          return Ui(this, function(ne) {
            switch (ne.label) {
              case 0:
                return C = new On([]),
                  [4, this._def.args.parseAsync(O, q).catch(function(Y) {
                    throw C.addIssue(F(O, Y)),
                      C
                  })];
              case 1:
                return Q = ne.sent(),
                  [4, k.apply(void 0, Tt([], It(Q)))];
              case 2:
                return J = ne.sent(),
                  [4, this._def.returns.parseAsync(J, q).catch(function(Y) {
                    throw C.addIssue(Z(J, Y)),
                      C
                  })];
              case 3:
                return [2, ne.sent()]
            }
          })
        })
      }) : Ue(function() {
        for (var O = [], B = 0; B < arguments.length; B++)
          O[B] = arguments[B];
        var Q = M._def.args.safeParse(O, q);
        if (!Q.success)
          throw new On([F(O, Q.error)]);
        var C = k.apply(void 0, Tt([], It(Q.data)))
          , Q = M._def.returns.safeParse(C, q);
        if (!Q.success)
          throw new On([Z(C, Q.error)]);
        return Q.data
      })
    }
    ,
    a.prototype.parameters = function() {
      return this._def.args
    }
    ,
    a.prototype.returnType = function() {
      return this._def.returns
    }
    ,
    a.prototype.args = function() {
      for (var h = [], p = 0; p < arguments.length; p++)
        h[p] = arguments[p];
      return new a(ee(ee({}, this._def), {
        args: Ln.create(h).rest(zn.create())
      }))
    }
    ,
    a.prototype.returns = function(h) {
      return new a(ee(ee({}, this._def), {
        returns: h
      }))
    }
    ,
    a.prototype.implement = function(h) {
      return this.parse(h)
    }
    ,
    a.prototype.strictImplement = function(h) {
      return this.parse(h)
    }
    ,
    a.create = function(h, p, d) {
      return new a(ee({
        args: (h || Ln.create([])).rest(zn.create()),
        returns: p || zn.create(),
        typeName: Le.ZodFunction
      }, Ve(d)))
    }
    ,
    a
}(Fe)
  , zr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    Object.defineProperty(a.prototype, "schema", {
      get: function() {
        return this._def.getter()
      },
      enumerable: !1,
      configurable: !0
    }),
    a.prototype._parse = function(h, p, d) {
      return this._def.getter()._parse(h, p, d)
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        getter: h,
        typeName: Le.ZodLazy
      }, Ve(p)))
    }
    ,
    a
}(Fe)
  , Vr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return p !== this._def.value ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: this._def.value,
        received: p
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    Object.defineProperty(a.prototype, "value", {
      get: function() {
        return this._def.value
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = function(h, p) {
      return new a(ee({
        value: h,
        typeName: Le.ZodLiteral
      }, Ve(p)))
    }
    ,
    a
}(Fe);
function Na(c) {
  return new $i({
    values: c,
    typeName: Le.ZodEnum
  })
}
var Le, $i = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return this._def.values.indexOf(p) === -1 ? (this.addIssue(h, {
        code: be.invalid_enum_value,
        options: this._def.values
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    Object.defineProperty(a.prototype, "options", {
      get: function() {
        return this._def.values
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "enum", {
      get: function() {
        var h, p, d = {};
        try {
          for (var M = lt(this._def.values), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            d[Z] = Z
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "Values", {
      get: function() {
        var h, p, d = {};
        try {
          for (var M = lt(this._def.values), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            d[Z] = Z
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      },
      enumerable: !1,
      configurable: !0
    }),
    Object.defineProperty(a.prototype, "Enum", {
      get: function() {
        var h, p, d = {};
        try {
          for (var M = lt(this._def.values), F = M.next(); !F.done; F = M.next()) {
            var Z = F.value;
            d[Z] = Z
          }
        } catch (q) {
          h = {
            error: q
          }
        } finally {
          try {
            F && !F.done && (p = M.return) && p.call(M)
          } finally {
            if (h)
              throw h.error
          }
        }
        return d
      },
      enumerable: !1,
      configurable: !0
    }),
    a.create = Na,
    a
}(Fe), Fr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      var M = rt.getValidEnumValues(this._def.values);
      return M.indexOf(p) === -1 ? (this.addIssue(h, {
        code: be.invalid_enum_value,
        options: rt.objectValues(M)
      }, {
        data: p
      }),
        Pe) : Ue(p)
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        values: h,
        typeName: Le.ZodNativeEnum
      }, Ve(p)))
    }
    ,
    a
}(Fe), _i = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      var M = this;
      return d !== we.promise && h.async === !1 ? (this.addIssue(h, {
        code: be.invalid_type,
        expected: we.promise,
        received: d
      }, {
        data: p
      }),
        Pe) : (p = d === we.promise ? p : Promise.resolve(p),
        Ue(p.then(function(F) {
          return M._def.type.parseAsync(F, {
            path: Nn(h.path),
            errorMap: h.errorMap
          })
        })))
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        type: h,
        typeName: Le.ZodPromise
      }, Ve(p)))
    }
    ,
    a
}(Fe), Mn = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype.innerType = function() {
      return this._def.schema
    }
    ,
    a.prototype._parse = function(h, p, k) {
      var M = this
        , F = h.async === !1
        , Z = this._def.effect || null
        , q = p
        , k = k;
      if (Z.type === "preprocess") {
        var O = Z.transform(p);
        if (h.async)
          return Promise.resolve(O).then(function(J) {
            return M._def.schema._parseAsync(h, J, wt(J))
          });
        if ((O = this._def.schema._parseSync(h, O, wt(O)))instanceof Promise)
          throw new Error("Asynchronous preprocess step encountered during synchronous parse operation. Use .parseAsync instead.");
        return O
      }
      if (Z.type === "refinement") {
        let J = function(ne, Y) {
          if (Y = Y.refinement(ne, C),
          Y instanceof Promise) {
            if (F)
              throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
            return Y.then(function() {
              return ne
            })
          }
          return ne
        };
        var B = !1
          , C = {
          addIssue: function(ne) {
            B = !0,
              M.addIssue(h, ne, {
                data: q
              })
          },
          get path() {
            return Nn(h.path)
          }
        };
        if (C.addIssue = C.addIssue.bind(C),
          F) {
          var Q = this._def.schema._parseSync(h, q, k);
          return Lt(Q) ? Pe : (O = J(Q.value, Z),
            B ? Pe : Ue(O))
        }
        return this._def.schema._parseAsync(h, q, k).then(function(ne) {
          return Lt(ne) ? Pe : J(ne.value, Z)
        }).then(function(ne) {
          return B ? Pe : Ue(ne)
        })
      }
      if (Z.type === "transform") {
        let J = function(ne, Y) {
          if (ne = Y.transform(ne),
          ne instanceof Promise && F)
            throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
          return ne
        };
        return F ? (Q = this._def.schema._parseSync(h, q, k),
          Lt(Q) ? Pe : (O = J(Q.value, Z),
            Ue(O))) : this._def.schema._parseAsync(h, q, k).then(function(ne) {
          return Lt(ne) ? Pe : J(ne.value, Z)
        }).then(function(ne) {
          return Ue(ne)
        })
      }
      rt.assertNever(Z)
    }
    ,
    a.create = function(h, p, d) {
      return new a(ee({
        schema: h,
        typeName: Le.ZodEffects,
        effect: p
      }, Ve(d)))
    }
    ,
    a.createWithPreprocess = function(h, p, d) {
      return new a(ee({
        schema: p,
        effect: {
          type: "preprocess",
          transform: h
        },
        typeName: Le.ZodEffects
      }, Ve(d)))
    }
    ,
    a
}(Fe), on = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d === we.undefined ? Ue(void 0) : this._def.innerType._parse(h, p, d)
    }
    ,
    a.prototype.unwrap = function() {
      return this._def.innerType
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        innerType: h,
        typeName: Le.ZodOptional
      }, Ve(p)))
    }
    ,
    a
}(Fe), Gn = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d === we.null ? Ue(null) : this._def.innerType._parse(h, p, d)
    }
    ,
    a.prototype.unwrap = function() {
      return this._def.innerType
    }
    ,
    a.create = function(h, p) {
      return new a(ee({
        innerType: h,
        typeName: Le.ZodNullable
      }, Ve(p)))
    }
    ,
    a
}(Fe), Gr = function(c) {
  function a() {
    return c !== null && c.apply(this, arguments) || this
  }
  return He(a, c),
    a.prototype._parse = function(h, p, d) {
      return d === we.undefined && (p = this._def.defaultValue()),
        this._def.innerType._parse(h, p, wt(p))
    }
    ,
    a.prototype.removeDefault = function() {
      return this._def.innerType
    }
    ,
    a.create = function(h, p) {
      return new on(ee({
        innerType: h,
        typeName: Le.ZodOptional
      }, Ve(p)))
    }
    ,
    a
}(Fe), Zr = function(c, a) {
  return c ? hi.create().refine(c, a) : hi.create()
}, La = {
  object: un.lazycreate
};
(function(c) {
    c.ZodString = "ZodString",
      c.ZodNumber = "ZodNumber",
      c.ZodBigInt = "ZodBigInt",
      c.ZodBoolean = "ZodBoolean",
      c.ZodDate = "ZodDate",
      c.ZodUndefined = "ZodUndefined",
      c.ZodNull = "ZodNull",
      c.ZodAny = "ZodAny",
      c.ZodUnknown = "ZodUnknown",
      c.ZodNever = "ZodNever",
      c.ZodVoid = "ZodVoid",
      c.ZodArray = "ZodArray",
      c.ZodObject = "ZodObject",
      c.ZodUnion = "ZodUnion",
      c.ZodIntersection = "ZodIntersection",
      c.ZodTuple = "ZodTuple",
      c.ZodRecord = "ZodRecord",
      c.ZodMap = "ZodMap",
      c.ZodSet = "ZodSet",
      c.ZodFunction = "ZodFunction",
      c.ZodLazy = "ZodLazy",
      c.ZodLiteral = "ZodLiteral",
      c.ZodEnum = "ZodEnum",
      c.ZodEffects = "ZodEffects",
      c.ZodNativeEnum = "ZodNativeEnum",
      c.ZodOptional = "ZodOptional",
      c.ZodNullable = "ZodNullable",
      c.ZodDefault = "ZodDefault",
      c.ZodPromise = "ZodPromise"
  }
)(Le = Le || {});
var Ma = function(c, a) {
  return a === void 0 && (a = {
    message: "Input not instance of " + c.name
  }),
    Zr(function(h) {
      return h instanceof c
    }, a)
}
  , j = Ki.create
  , fe = Pr.create
  , Hr = Or.create
  , Ae = xr.create
  , Ra = Nr.create
  , Da = Lr.create
  , Wi = Mr.create
  , ka = hi.create
  , Zn = zn.create
  , Ba = Pn.create
  , Ua = Rr.create
  , Be = Fn.create
  , he = un.create
  , za = un.strictCreate
  , Ji = Yi.create
  , Va = pi.create
  , Fa = Ln.create
  , Ga = Dr.create
  , Za = kr.create
  , Ha = Br.create
  , ja = Ur.create
  , qa = zr.create
  , zt = Vr.create
  , Ka = $i.create
  , Rn = Fr.create
  , Ya = _i.create
  , Er = Mn.create
  , jr = on.create
  , $a = Gn.create
  , qr = Mn.createWithPreprocess
  , Wa = function() {
  return j().optional()
}
  , Ja = function() {
  return fe().optional()
}
  , Xa = function() {
  return Ae().optional()
};
Object.freeze({
  __proto__: null,
  ZodParsedType: we,
  getParsedType: wt,
  makeIssue: ui,
  EMPTY_PATH: Ca,
  pathToArray: Nn,
  pathFromArray: Ar,
  ParseContext: li,
  INVALID: Pe,
  OK: Ue,
  isInvalid: Lt,
  isOk: Qt,
  isAsync: vn,
  ZodType: Fe,
  ZodString: Ki,
  ZodNumber: Pr,
  ZodBigInt: Or,
  ZodBoolean: xr,
  ZodDate: Nr,
  ZodUndefined: Lr,
  ZodNull: Mr,
  ZodAny: hi,
  ZodUnknown: zn,
  ZodNever: Pn,
  ZodVoid: Rr,
  ZodArray: Fn,
  get objectUtil() {
    return Vn
  },
  mergeObjects: xa,
  ZodObject: un,
  ZodUnion: Yi,
  ZodIntersection: pi,
  ZodTuple: Ln,
  ZodRecord: Dr,
  ZodMap: kr,
  ZodSet: Br,
  ZodFunction: Ur,
  ZodLazy: zr,
  ZodLiteral: Vr,
  ZodEnum: $i,
  ZodNativeEnum: Fr,
  ZodPromise: _i,
  ZodEffects: Mn,
  ZodTransformer: Mn,
  ZodOptional: on,
  ZodNullable: Gn,
  ZodDefault: Gr,
  custom: Zr,
  Schema: Fe,
  ZodSchema: Fe,
  late: La,
  get ZodFirstPartyTypeKind() {
    return Le
  },
  any: ka,
  array: Be,
  bigint: Hr,
  boolean: Ae,
  date: Ra,
  effect: Er,
  enum: Ka,
  function: ja,
  instanceof: Ma,
  intersection: Va,
  lazy: qa,
  literal: zt,
  map: Za,
  nativeEnum: Rn,
  never: Ba,
  null: Wi,
  nullable: $a,
  number: fe,
  object: he,
  oboolean: Xa,
  onumber: Ja,
  optional: jr,
  ostring: Wa,
  preprocess: qr,
  promise: Ya,
  record: Ga,
  set: Ha,
  strictObject: za,
  string: j,
  transformer: Er,
  tuple: Fa,
  undefined: Da,
  union: Ji,
  unknown: Zn,
  void: Ua,
  ZodIssueCode: be,
  quotelessJson: Ta,
  ZodError: On,
  defaultErrorMap: ji,
  get overrideErrorMap() {
    return qi
  },
  setErrorMap: Ia
});
var Kr = {
  exports: {}
};
(function(c) {
    var a = function(h) {
      var p = 1e7
        , d = 7
        , M = 9007199254740992
        , F = J(M)
        , Z = "0123456789abcdefghijklmnopqrstuvwxyz"
        , q = typeof BigInt == "function";
      function k(t, n, i, r) {
        return typeof t > "u" ? k[0] : typeof n < "u" ? +n == 10 && !i ? ae(t) : kn(t, n, i, r) : ae(t)
      }
      function O(t, n) {
        this.value = t,
          this.sign = n,
          this.isSmall = !1
      }
      O.prototype = Object.create(k.prototype);
      function B(t) {
        this.value = t,
          this.sign = t < 0,
          this.isSmall = !0
      }
      B.prototype = Object.create(k.prototype);
      function C(t) {
        this.value = t
      }
      C.prototype = Object.create(k.prototype);
      function Q(t) {
        return -M < t && t < M
      }
      function J(t) {
        return t < 1e7 ? [t] : t < 1e14 ? [t % 1e7, Math.floor(t / 1e7)] : [t % 1e7, Math.floor(t / 1e7) % 1e7, Math.floor(t / 1e14)]
      }
      function ne(t) {
        Y(t);
        var n = t.length;
        if (n < 4 && kt(t, F) < 0)
          switch (n) {
            case 0:
              return 0;
            case 1:
              return t[0];
            case 2:
              return t[0] + t[1] * p;
            default:
              return t[0] + (t[1] + t[2] * p) * p
          }
        return t
      }
      function Y(t) {
        for (var n = t.length; t[--n] === 0; )
          ;
        t.length = n + 1
      }
      function Me(t) {
        for (var n = new Array(t), i = -1; ++i < t; )
          n[i] = 0;
        return n
      }
      function le(t) {
        return t > 0 ? Math.floor(t) : Math.ceil(t)
      }
      function Se(t, n) {
        var i = t.length, r = n.length, s = new Array(i), u = 0, o = p, l, f;
        for (f = 0; f < r; f++)
          l = t[f] + n[f] + u,
            u = l >= o ? 1 : 0,
            s[f] = l - u * o;
        for (; f < i; )
          l = t[f] + u,
            u = l === o ? 1 : 0,
            s[f++] = l - u * o;
        return u > 0 && s.push(u),
          s
      }
      function ye(t, n) {
        return t.length >= n.length ? Se(t, n) : Se(n, t)
      }
      function oe(t, n) {
        var i = t.length, r = new Array(i), s = p, u, o;
        for (o = 0; o < i; o++)
          u = t[o] - s + n,
            n = Math.floor(u / s),
            r[o] = u - n * s,
            n += 1;
        for (; n > 0; )
          r[o++] = n % s,
            n = Math.floor(n / s);
        return r
      }
      O.prototype.add = function(t) {
        var n = ae(t);
        if (this.sign !== n.sign)
          return this.subtract(n.negate());
        var i = this.value
          , r = n.value;
        return n.isSmall ? new O(oe(i, Math.abs(r)),this.sign) : new O(ye(i, r),this.sign)
      }
        ,
        O.prototype.plus = O.prototype.add,
        B.prototype.add = function(t) {
          var n = ae(t)
            , i = this.value;
          if (i < 0 !== n.sign)
            return this.subtract(n.negate());
          var r = n.value;
          if (n.isSmall) {
            if (Q(i + r))
              return new B(i + r);
            r = J(Math.abs(r))
          }
          return new O(oe(r, Math.abs(i)),i < 0)
        }
        ,
        B.prototype.plus = B.prototype.add,
        C.prototype.add = function(t) {
          return new C(this.value + ae(t).value)
        }
        ,
        C.prototype.plus = C.prototype.add;
      function We(t, n) {
        var i = t.length, r = n.length, s = new Array(i), u = 0, o = p, l, f;
        for (l = 0; l < r; l++)
          f = t[l] - u - n[l],
            f < 0 ? (f += o,
              u = 1) : u = 0,
            s[l] = f;
        for (l = r; l < i; l++) {
          if (f = t[l] - u,
          f < 0)
            f += o;
          else {
            s[l++] = f;
            break
          }
          s[l] = f
        }
        for (; l < i; l++)
          s[l] = t[l];
        return Y(s),
          s
      }
      function ct(t, n, i) {
        var r;
        return kt(t, n) >= 0 ? r = We(t, n) : (r = We(n, t),
          i = !i),
          r = ne(r),
          typeof r == "number" ? (i && (r = -r),
            new B(r)) : new O(r,i)
      }
      function je(t, n, i) {
        var r = t.length, s = new Array(r), u = -n, o = p, l, f;
        for (l = 0; l < r; l++)
          f = t[l] + u,
            u = Math.floor(f / o),
            f %= o,
            s[l] = f < 0 ? f + o : f;
        return s = ne(s),
          typeof s == "number" ? (i && (s = -s),
            new B(s)) : new O(s,i)
      }
      O.prototype.subtract = function(t) {
        var n = ae(t);
        if (this.sign !== n.sign)
          return this.add(n.negate());
        var i = this.value
          , r = n.value;
        return n.isSmall ? je(i, Math.abs(r), this.sign) : ct(i, r, this.sign)
      }
        ,
        O.prototype.minus = O.prototype.subtract,
        B.prototype.subtract = function(t) {
          var n = ae(t)
            , i = this.value;
          if (i < 0 !== n.sign)
            return this.add(n.negate());
          var r = n.value;
          return n.isSmall ? new B(i - r) : je(r, Math.abs(i), i >= 0)
        }
        ,
        B.prototype.minus = B.prototype.subtract,
        C.prototype.subtract = function(t) {
          return new C(this.value - ae(t).value)
        }
        ,
        C.prototype.minus = C.prototype.subtract,
        O.prototype.negate = function() {
          return new O(this.value,!this.sign)
        }
        ,
        B.prototype.negate = function() {
          var t = this.sign
            , n = new B(-this.value);
          return n.sign = !t,
            n
        }
        ,
        C.prototype.negate = function() {
          return new C(-this.value)
        }
        ,
        O.prototype.abs = function() {
          return new O(this.value,!1)
        }
        ,
        B.prototype.abs = function() {
          return new B(Math.abs(this.value))
        }
        ,
        C.prototype.abs = function() {
          return new C(this.value >= 0 ? this.value : -this.value)
        }
      ;
      function Pt(t, n) {
        var i = t.length, r = n.length, s = i + r, u = Me(s), o = p, l, f, g, y, _;
        for (g = 0; g < i; ++g) {
          y = t[g];
          for (var v = 0; v < r; ++v)
            _ = n[v],
              l = y * _ + u[g + v],
              f = Math.floor(l / o),
              u[g + v] = l - f * o,
              u[g + v + 1] += f
        }
        return Y(u),
          u
      }
      function ft(t, n) {
        var i = t.length, r = new Array(i), s = p, u = 0, o, l;
        for (l = 0; l < i; l++)
          o = t[l] * n + u,
            u = Math.floor(o / s),
            r[l] = o - u * s;
        for (; u > 0; )
          r[l++] = u % s,
            u = Math.floor(u / s);
        return r
      }
      function dt(t, n) {
        for (var i = []; n-- > 0; )
          i.push(0);
        return i.concat(t)
      }
      function qe(t, n) {
        var i = Math.max(t.length, n.length);
        if (i <= 30)
          return Pt(t, n);
        i = Math.ceil(i / 2);
        var r = t.slice(i)
          , s = t.slice(0, i)
          , u = n.slice(i)
          , o = n.slice(0, i)
          , l = qe(s, o)
          , f = qe(r, u)
          , g = qe(ye(s, r), ye(o, u))
          , y = ye(ye(l, dt(We(We(g, l), f), i)), dt(f, 2 * i));
        return Y(y),
          y
      }
      function pe(t, n) {
        return -.012 * t - .012 * n + 15e-6 * t * n > 0
      }
      O.prototype.multiply = function(t) {
        var n = ae(t), i = this.value, r = n.value, s = this.sign !== n.sign, u;
        if (n.isSmall) {
          if (r === 0)
            return k[0];
          if (r === 1)
            return this;
          if (r === -1)
            return this.negate();
          if (u = Math.abs(r),
          u < p)
            return new O(ft(i, u),s);
          r = J(u)
        }
        return pe(i.length, r.length) ? new O(qe(i, r),s) : new O(Pt(i, r),s)
      }
        ,
        O.prototype.times = O.prototype.multiply;
      function Vt(t, n, i) {
        return t < p ? new O(ft(n, t),i) : new O(Pt(n, J(t)),i)
      }
      B.prototype._multiplyBySmall = function(t) {
        return Q(t.value * this.value) ? new B(t.value * this.value) : Vt(Math.abs(t.value), J(Math.abs(this.value)), this.sign !== t.sign)
      }
        ,
        O.prototype._multiplyBySmall = function(t) {
          return t.value === 0 ? k[0] : t.value === 1 ? this : t.value === -1 ? this.negate() : Vt(Math.abs(t.value), this.value, this.sign !== t.sign)
        }
        ,
        B.prototype.multiply = function(t) {
          return ae(t)._multiplyBySmall(this)
        }
        ,
        B.prototype.times = B.prototype.multiply,
        C.prototype.multiply = function(t) {
          return new C(this.value * ae(t).value)
        }
        ,
        C.prototype.times = C.prototype.multiply;
      function re(t) {
        var n = t.length, i = Me(n + n), r = p, s, u, o, l, f;
        for (o = 0; o < n; o++) {
          l = t[o],
            u = 0 - l * l;
          for (var g = o; g < n; g++)
            f = t[g],
              s = 2 * (l * f) + i[o + g] + u,
              u = Math.floor(s / r),
              i[o + g] = s - u * r;
          i[o + n] = u
        }
        return Y(i),
          i
      }
      O.prototype.square = function() {
        return new O(re(this.value),!1)
      }
        ,
        B.prototype.square = function() {
          var t = this.value * this.value;
          return Q(t) ? new B(t) : new O(re(J(Math.abs(this.value))),!1)
        }
        ,
        C.prototype.square = function(t) {
          return new C(this.value * this.value)
        }
      ;
      function Ot(t, n) {
        var i = t.length, r = n.length, s = p, u = Me(n.length), o = n[r - 1], l = Math.ceil(s / (2 * o)), f = ft(t, l), g = ft(n, l), y, _, v, b, T, x, S;
        for (f.length <= i && f.push(0),
               g.push(0),
               o = g[r - 1],
               _ = i - r; _ >= 0; _--) {
          for (y = s - 1,
               f[_ + r] !== o && (y = Math.floor((f[_ + r] * s + f[_ + r - 1]) / o)),
                 v = 0,
                 b = 0,
                 x = g.length,
                 T = 0; T < x; T++)
            v += y * g[T],
              S = Math.floor(v / s),
              b += f[_ + T] - (v - S * s),
              v = S,
              b < 0 ? (f[_ + T] = b + s,
                b = -1) : (f[_ + T] = b,
                b = 0);
          for (; b !== 0; ) {
            for (y -= 1,
                   v = 0,
                   T = 0; T < x; T++)
              v += f[_ + T] - s + g[T],
                v < 0 ? (f[_ + T] = v + s,
                  v = 0) : (f[_ + T] = v,
                  v = 1);
            b += v
          }
          u[_] = y
        }
        return f = ke(f, l)[0],
          [ne(u), ne(f)]
      }
      function Ft(t, n) {
        for (var i = t.length, r = n.length, s = [], u = [], o = p, l, f, g, y, _; i; ) {
          if (u.unshift(t[--i]),
            Y(u),
          kt(u, n) < 0) {
            s.push(0);
            continue
          }
          f = u.length,
            g = u[f - 1] * o + u[f - 2],
            y = n[r - 1] * o + n[r - 2],
          f > r && (g = (g + 1) * o),
            l = Math.ceil(g / y);
          do {
            if (_ = ft(n, l),
            kt(_, u) <= 0)
              break;
            l--
          } while (l);
          s.push(l),
            u = We(u, _)
        }
        return s.reverse(),
          [ne(s), ne(u)]
      }
      function ke(t, n) {
        var i = t.length, r = Me(i), s = p, u, o, l, f;
        for (l = 0,
               u = i - 1; u >= 0; --u)
          f = l * s + t[u],
            o = le(f / n),
            l = f - o * n,
            r[u] = o | 0;
        return [r, l | 0]
      }
      function ot(t, n) {
        var i, r = ae(n);
        if (q)
          return [new C(t.value / r.value), new C(t.value % r.value)];
        var s = t.value, u = r.value, o;
        if (u === 0)
          throw new Error("Cannot divide by zero");
        if (t.isSmall)
          return r.isSmall ? [new B(le(s / u)), new B(s % u)] : [k[0], t];
        if (r.isSmall) {
          if (u === 1)
            return [t, k[0]];
          if (u == -1)
            return [t.negate(), k[0]];
          var l = Math.abs(u);
          if (l < p) {
            i = ke(s, l),
              o = ne(i[0]);
            var f = i[1];
            return t.sign && (f = -f),
              typeof o == "number" ? (t.sign !== r.sign && (o = -o),
                [new B(o), new B(f)]) : [new O(o,t.sign !== r.sign), new B(f)]
          }
          u = J(l)
        }
        var g = kt(s, u);
        if (g === -1)
          return [k[0], t];
        if (g === 0)
          return [k[t.sign === r.sign ? 1 : -1], k[0]];
        s.length + u.length <= 200 ? i = Ot(s, u) : i = Ft(s, u),
          o = i[0];
        var y = t.sign !== r.sign
          , _ = i[1]
          , v = t.sign;
        return typeof o == "number" ? (y && (o = -o),
          o = new B(o)) : o = new O(o,y),
          typeof _ == "number" ? (v && (_ = -_),
            _ = new B(_)) : _ = new O(_,v),
          [o, _]
      }
      O.prototype.divmod = function(t) {
        var n = ot(this, t);
        return {
          quotient: n[0],
          remainder: n[1]
        }
      }
        ,
        C.prototype.divmod = B.prototype.divmod = O.prototype.divmod,
        O.prototype.divide = function(t) {
          return ot(this, t)[0]
        }
        ,
        C.prototype.over = C.prototype.divide = function(t) {
          return new C(this.value / ae(t).value)
        }
        ,
        B.prototype.over = B.prototype.divide = O.prototype.over = O.prototype.divide,
        O.prototype.mod = function(t) {
          return ot(this, t)[1]
        }
        ,
        C.prototype.mod = C.prototype.remainder = function(t) {
          return new C(this.value % ae(t).value)
        }
        ,
        B.prototype.remainder = B.prototype.mod = O.prototype.remainder = O.prototype.mod,
        O.prototype.pow = function(t) {
          var n = ae(t), i = this.value, r = n.value, s, u, o;
          if (r === 0)
            return k[1];
          if (i === 0)
            return k[0];
          if (i === 1)
            return k[1];
          if (i === -1)
            return n.isEven() ? k[1] : k[-1];
          if (n.sign)
            return k[0];
          if (!n.isSmall)
            throw new Error("The exponent " + n.toString() + " is too large.");
          if (this.isSmall && Q(s = Math.pow(i, r)))
            return new B(le(s));
          for (u = this,
                 o = k[1]; r & !0 && (o = o.times(u),
            --r),
               r !== 0; )
            r /= 2,
              u = u.square();
          return o
        }
        ,
        B.prototype.pow = O.prototype.pow,
        C.prototype.pow = function(t) {
          var n = ae(t)
            , i = this.value
            , r = n.value
            , s = BigInt(0)
            , u = BigInt(1)
            , o = BigInt(2);
          if (r === s)
            return k[1];
          if (i === s)
            return k[0];
          if (i === u)
            return k[1];
          if (i === BigInt(-1))
            return n.isEven() ? k[1] : k[-1];
          if (n.isNegative())
            return new C(s);
          for (var l = this, f = k[1]; (r & u) === u && (f = f.times(l),
            --r),
          r !== s; )
            r /= o,
              l = l.square();
          return f
        }
        ,
        O.prototype.modPow = function(t, n) {
          if (t = ae(t),
            n = ae(n),
            n.isZero())
            throw new Error("Cannot take modPow with modulus 0");
          var i = k[1]
            , r = this.mod(n);
          for (t.isNegative() && (t = t.multiply(k[-1]),
            r = r.modInv(n)); t.isPositive(); ) {
            if (r.isZero())
              return k[0];
            t.isOdd() && (i = i.multiply(r).mod(n)),
              t = t.divide(2),
              r = r.square().mod(n)
          }
          return i
        }
        ,
        C.prototype.modPow = B.prototype.modPow = O.prototype.modPow;
      function kt(t, n) {
        if (t.length !== n.length)
          return t.length > n.length ? 1 : -1;
        for (var i = t.length - 1; i >= 0; i--)
          if (t[i] !== n[i])
            return t[i] > n[i] ? 1 : -1;
        return 0
      }
      O.prototype.compareAbs = function(t) {
        var n = ae(t)
          , i = this.value
          , r = n.value;
        return n.isSmall ? 1 : kt(i, r)
      }
        ,
        B.prototype.compareAbs = function(t) {
          var n = ae(t)
            , i = Math.abs(this.value)
            , r = n.value;
          return n.isSmall ? (r = Math.abs(r),
            i === r ? 0 : i > r ? 1 : -1) : -1
        }
        ,
        C.prototype.compareAbs = function(t) {
          var n = this.value
            , i = ae(t).value;
          return n = n >= 0 ? n : -n,
            i = i >= 0 ? i : -i,
            n === i ? 0 : n > i ? 1 : -1
        }
        ,
        O.prototype.compare = function(t) {
          if (t === 1 / 0)
            return -1;
          if (t === -1 / 0)
            return 1;
          var n = ae(t)
            , i = this.value
            , r = n.value;
          return this.sign !== n.sign ? n.sign ? 1 : -1 : n.isSmall ? this.sign ? -1 : 1 : kt(i, r) * (this.sign ? -1 : 1)
        }
        ,
        O.prototype.compareTo = O.prototype.compare,
        B.prototype.compare = function(t) {
          if (t === 1 / 0)
            return -1;
          if (t === -1 / 0)
            return 1;
          var n = ae(t)
            , i = this.value
            , r = n.value;
          return n.isSmall ? i == r ? 0 : i > r ? 1 : -1 : i < 0 !== n.sign ? i < 0 ? -1 : 1 : i < 0 ? 1 : -1
        }
        ,
        B.prototype.compareTo = B.prototype.compare,
        C.prototype.compare = function(t) {
          if (t === 1 / 0)
            return -1;
          if (t === -1 / 0)
            return 1;
          var n = this.value
            , i = ae(t).value;
          return n === i ? 0 : n > i ? 1 : -1
        }
        ,
        C.prototype.compareTo = C.prototype.compare,
        O.prototype.equals = function(t) {
          return this.compare(t) === 0
        }
        ,
        C.prototype.eq = C.prototype.equals = B.prototype.eq = B.prototype.equals = O.prototype.eq = O.prototype.equals,
        O.prototype.notEquals = function(t) {
          return this.compare(t) !== 0
        }
        ,
        C.prototype.neq = C.prototype.notEquals = B.prototype.neq = B.prototype.notEquals = O.prototype.neq = O.prototype.notEquals,
        O.prototype.greater = function(t) {
          return this.compare(t) > 0
        }
        ,
        C.prototype.gt = C.prototype.greater = B.prototype.gt = B.prototype.greater = O.prototype.gt = O.prototype.greater,
        O.prototype.lesser = function(t) {
          return this.compare(t) < 0
        }
        ,
        C.prototype.lt = C.prototype.lesser = B.prototype.lt = B.prototype.lesser = O.prototype.lt = O.prototype.lesser,
        O.prototype.greaterOrEquals = function(t) {
          return this.compare(t) >= 0
        }
        ,
        C.prototype.geq = C.prototype.greaterOrEquals = B.prototype.geq = B.prototype.greaterOrEquals = O.prototype.geq = O.prototype.greaterOrEquals,
        O.prototype.lesserOrEquals = function(t) {
          return this.compare(t) <= 0
        }
        ,
        C.prototype.leq = C.prototype.lesserOrEquals = B.prototype.leq = B.prototype.lesserOrEquals = O.prototype.leq = O.prototype.lesserOrEquals,
        O.prototype.isEven = function() {
          return (this.value[0] & 1) === 0
        }
        ,
        B.prototype.isEven = function() {
          return (this.value & 1) === 0
        }
        ,
        C.prototype.isEven = function() {
          return (this.value & BigInt(1)) === BigInt(0)
        }
        ,
        O.prototype.isOdd = function() {
          return (this.value[0] & 1) === 1
        }
        ,
        B.prototype.isOdd = function() {
          return (this.value & 1) === 1
        }
        ,
        C.prototype.isOdd = function() {
          return (this.value & BigInt(1)) === BigInt(1)
        }
        ,
        O.prototype.isPositive = function() {
          return !this.sign
        }
        ,
        B.prototype.isPositive = function() {
          return this.value > 0
        }
        ,
        C.prototype.isPositive = B.prototype.isPositive,
        O.prototype.isNegative = function() {
          return this.sign
        }
        ,
        B.prototype.isNegative = function() {
          return this.value < 0
        }
        ,
        C.prototype.isNegative = B.prototype.isNegative,
        O.prototype.isUnit = function() {
          return !1
        }
        ,
        B.prototype.isUnit = function() {
          return Math.abs(this.value) === 1
        }
        ,
        C.prototype.isUnit = function() {
          return this.abs().value === BigInt(1)
        }
        ,
        O.prototype.isZero = function() {
          return !1
        }
        ,
        B.prototype.isZero = function() {
          return this.value === 0
        }
        ,
        C.prototype.isZero = function() {
          return this.value === BigInt(0)
        }
        ,
        O.prototype.isDivisibleBy = function(t) {
          var n = ae(t);
          return n.isZero() ? !1 : n.isUnit() ? !0 : n.compareAbs(2) === 0 ? this.isEven() : this.mod(n).isZero()
        }
        ,
        C.prototype.isDivisibleBy = B.prototype.isDivisibleBy = O.prototype.isDivisibleBy;
      function yn(t) {
        var n = t.abs();
        if (n.isUnit())
          return !1;
        if (n.equals(2) || n.equals(3) || n.equals(5))
          return !0;
        if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
          return !1;
        if (n.lesser(49))
          return !0
      }
      function Gt(t, n) {
        for (var i = t.prev(), r = i, s = 0, u, o, l; r.isEven(); )
          r = r.divide(2),
            s++;
        e: for (o = 0; o < n.length; o++)
          if (!t.lesser(n[o]) && (l = a(n[o]).modPow(r, t),
            !(l.isUnit() || l.equals(i)))) {
            for (u = s - 1; u != 0; u--) {
              if (l = l.square().mod(t),
                l.isUnit())
                return !1;
              if (l.equals(i))
                continue e
            }
            return !1
          }
        return !0
      }
      O.prototype.isPrime = function(t) {
        var n = yn(this);
        if (n !== h)
          return n;
        var i = this.abs()
          , r = i.bitLength();
        if (r <= 64)
          return Gt(i, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
        for (var s = Math.log(2) * r.toJSNumber(), u = Math.ceil(t === !0 ? 2 * Math.pow(s, 2) : s), o = [], l = 0; l < u; l++)
          o.push(a(l + 2));
        return Gt(i, o)
      }
        ,
        C.prototype.isPrime = B.prototype.isPrime = O.prototype.isPrime,
        O.prototype.isProbablePrime = function(t, n) {
          var i = yn(this);
          if (i !== h)
            return i;
          for (var r = this.abs(), s = t === h ? 5 : t, u = [], o = 0; o < s; o++)
            u.push(a.randBetween(2, r.minus(2), n));
          return Gt(r, u)
        }
        ,
        C.prototype.isProbablePrime = B.prototype.isProbablePrime = O.prototype.isProbablePrime,
        O.prototype.modInv = function(t) {
          for (var n = a.zero, i = a.one, r = ae(t), s = this.abs(), u, o, l; !s.isZero(); )
            u = r.divide(s),
              o = n,
              l = r,
              n = i,
              r = s,
              i = o.subtract(u.multiply(i)),
              s = l.subtract(u.multiply(s));
          if (!r.isUnit())
            throw new Error(this.toString() + " and " + t.toString() + " are not co-prime");
          return n.compare(0) === -1 && (n = n.add(t)),
            this.isNegative() ? n.negate() : n
        }
        ,
        C.prototype.modInv = B.prototype.modInv = O.prototype.modInv,
        O.prototype.next = function() {
          var t = this.value;
          return this.sign ? je(t, 1, this.sign) : new O(oe(t, 1),this.sign)
        }
        ,
        B.prototype.next = function() {
          var t = this.value;
          return t + 1 < M ? new B(t + 1) : new O(F,!1)
        }
        ,
        C.prototype.next = function() {
          return new C(this.value + BigInt(1))
        }
        ,
        O.prototype.prev = function() {
          var t = this.value;
          return this.sign ? new O(oe(t, 1),!0) : je(t, 1, this.sign)
        }
        ,
        B.prototype.prev = function() {
          var t = this.value;
          return t - 1 > -M ? new B(t - 1) : new O(F,!0)
        }
        ,
        C.prototype.prev = function() {
          return new C(this.value - BigInt(1))
        }
      ;
      for (var Mt = [1]; 2 * Mt[Mt.length - 1] <= p; )
        Mt.push(2 * Mt[Mt.length - 1]);
      var Xe = Mt.length
        , xt = Mt[Xe - 1];
      function en(t) {
        return Math.abs(t) <= p
      }
      O.prototype.shiftLeft = function(t) {
        var n = ae(t).toJSNumber();
        if (!en(n))
          throw new Error(String(n) + " is too large for shifting.");
        if (n < 0)
          return this.shiftRight(-n);
        var i = this;
        if (i.isZero())
          return i;
        for (; n >= Xe; )
          i = i.multiply(xt),
            n -= Xe - 1;
        return i.multiply(Mt[n])
      }
        ,
        C.prototype.shiftLeft = B.prototype.shiftLeft = O.prototype.shiftLeft,
        O.prototype.shiftRight = function(t) {
          var n, i = ae(t).toJSNumber();
          if (!en(i))
            throw new Error(String(i) + " is too large for shifting.");
          if (i < 0)
            return this.shiftLeft(-i);
          for (var r = this; i >= Xe; ) {
            if (r.isZero() || r.isNegative() && r.isUnit())
              return r;
            n = ot(r, xt),
              r = n[1].isNegative() ? n[0].prev() : n[0],
              i -= Xe - 1
          }
          return n = ot(r, Mt[i]),
            n[1].isNegative() ? n[0].prev() : n[0]
        }
        ,
        C.prototype.shiftRight = B.prototype.shiftRight = O.prototype.shiftRight;
      function Kt(t, n, i) {
        n = ae(n);
        for (var r = t.isNegative(), s = n.isNegative(), u = r ? t.not() : t, o = s ? n.not() : n, l = 0, f = 0, g = null, y = null, _ = []; !u.isZero() || !o.isZero(); )
          g = ot(u, xt),
            l = g[1].toJSNumber(),
          r && (l = xt - 1 - l),
            y = ot(o, xt),
            f = y[1].toJSNumber(),
          s && (f = xt - 1 - f),
            u = g[0],
            o = y[0],
            _.push(i(l, f));
        for (var v = i(r ? 1 : 0, s ? 1 : 0) !== 0 ? a(-1) : a(0), b = _.length - 1; b >= 0; b -= 1)
          v = v.multiply(xt).add(a(_[b]));
        return v
      }
      O.prototype.not = function() {
        return this.negate().prev()
      }
        ,
        C.prototype.not = B.prototype.not = O.prototype.not,
        O.prototype.and = function(t) {
          return Kt(this, t, function(n, i) {
            return n & i
          })
        }
        ,
        C.prototype.and = B.prototype.and = O.prototype.and,
        O.prototype.or = function(t) {
          return Kt(this, t, function(n, i) {
            return n | i
          })
        }
        ,
        C.prototype.or = B.prototype.or = O.prototype.or,
        O.prototype.xor = function(t) {
          return Kt(this, t, function(n, i) {
            return n ^ i
          })
        }
        ,
        C.prototype.xor = B.prototype.xor = O.prototype.xor;
      var Ce = 1 << 30
        , tt = (p & -p) * (p & -p) | Ce;
      function Ke(t) {
        var n = t.value
          , i = typeof n == "number" ? n | Ce : typeof n == "bigint" ? n | BigInt(Ce) : n[0] + n[1] * p | tt;
        return i & -i
      }
      function Rt(t, n) {
        if (n.compareTo(t) <= 0) {
          var i = Rt(t, n.square(n))
            , r = i.p
            , s = i.e
            , u = r.multiply(n);
          return u.compareTo(t) <= 0 ? {
            p: u,
            e: s * 2 + 1
          } : {
            p: r,
            e: s * 2
          }
        }
        return {
          p: a(1),
          e: 0
        }
      }
      O.prototype.bitLength = function() {
        var t = this;
        return t.compareTo(a(0)) < 0 && (t = t.negate().subtract(a(1))),
          t.compareTo(a(0)) === 0 ? a(0) : a(Rt(t, a(2)).e).add(a(1))
      }
        ,
        C.prototype.bitLength = B.prototype.bitLength = O.prototype.bitLength;
      function Zt(t, n) {
        return t = ae(t),
          n = ae(n),
          t.greater(n) ? t : n
      }
      function tn(t, n) {
        return t = ae(t),
          n = ae(n),
          t.lesser(n) ? t : n
      }
      function cn(t, n) {
        if (t = ae(t).abs(),
          n = ae(n).abs(),
          t.equals(n))
          return t;
        if (t.isZero())
          return n;
        if (n.isZero())
          return t;
        for (var i = k[1], r, s; t.isEven() && n.isEven(); )
          r = tn(Ke(t), Ke(n)),
            t = t.divide(r),
            n = n.divide(r),
            i = i.multiply(r);
        for (; t.isEven(); )
          t = t.divide(Ke(t));
        do {
          for (; n.isEven(); )
            n = n.divide(Ke(n));
          t.greater(n) && (s = n,
            n = t,
            t = s),
            n = n.subtract(t)
        } while (!n.isZero());
        return i.isUnit() ? t : t.multiply(i)
      }
      function wn(t, n) {
        return t = ae(t).abs(),
          n = ae(n).abs(),
          t.divide(cn(t, n)).multiply(n)
      }
      function bn(t, n, i) {
        t = ae(t),
          n = ae(n);
        var r = i || Math.random
          , s = tn(t, n)
          , u = Zt(t, n)
          , o = u.subtract(s).add(1);
        if (o.isSmall)
          return s.add(Math.floor(r() * o));
        for (var l = Je(o, p).value, f = [], g = !0, y = 0; y < l.length; y++) {
          var _ = g ? l[y] : p
            , v = le(r() * _);
          f.push(v),
          v < _ && (g = !1)
        }
        return s.add(k.fromArray(f, p, !1))
      }
      var kn = function(t, n, i, r) {
        i = i || Z,
          t = String(t),
        r || (t = t.toLowerCase(),
          i = i.toLowerCase());
        var s = t.length, u, o = Math.abs(n), l = {};
        for (u = 0; u < i.length; u++)
          l[i[u]] = u;
        for (u = 0; u < s; u++) {
          var f = t[u];
          if (f !== "-" && f in l && l[f] >= o) {
            if (f === "1" && o === 1)
              continue;
            throw new Error(f + " is not a valid digit in base " + n + ".")
          }
        }
        n = ae(n);
        var g = []
          , y = t[0] === "-";
        for (u = y ? 1 : 0; u < t.length; u++) {
          var f = t[u];
          if (f in l)
            g.push(ae(l[f]));
          else if (f === "<") {
            var _ = u;
            do
              u++;
            while (t[u] !== ">" && u < t.length);
            g.push(ae(t.slice(_ + 1, u)))
          } else
            throw new Error(f + " is not a valid character")
        }
        return Sn(g, n, y)
      };
      function Sn(t, n, i) {
        var r = k[0], s = k[1], u;
        for (u = t.length - 1; u >= 0; u--)
          r = r.add(t[u].times(s)),
            s = s.times(n);
        return i ? r.negate() : r
      }
      function Bn(t, n) {
        return n = n || Z,
          t < n.length ? n[t] : "<" + t + ">"
      }
      function Je(t, n) {
        if (n = a(n),
          n.isZero()) {
          if (t.isZero())
            return {
              value: [0],
              isNegative: !1
            };
          throw new Error("Cannot convert nonzero numbers to base 0.")
        }
        if (n.equals(-1)) {
          if (t.isZero())
            return {
              value: [0],
              isNegative: !1
            };
          if (t.isNegative())
            return {
              value: [].concat.apply([], Array.apply(null, Array(-t.toJSNumber())).map(Array.prototype.valueOf, [1, 0])),
              isNegative: !1
            };
          var i = Array.apply(null, Array(t.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
          return i.unshift([1]),
            {
              value: [].concat.apply([], i),
              isNegative: !1
            }
        }
        var r = !1;
        if (t.isNegative() && n.isPositive() && (r = !0,
          t = t.abs()),
          n.isUnit())
          return t.isZero() ? {
            value: [0],
            isNegative: !1
          } : {
            value: Array.apply(null, Array(t.toJSNumber())).map(Number.prototype.valueOf, 1),
            isNegative: r
          };
        for (var s = [], u = t, o; u.isNegative() || u.compareAbs(n) >= 0; ) {
          o = u.divmod(n),
            u = o.quotient;
          var l = o.remainder;
          l.isNegative() && (l = n.minus(l).abs(),
            u = u.next()),
            s.push(l.toJSNumber())
        }
        return s.push(u.toJSNumber()),
          {
            value: s.reverse(),
            isNegative: r
          }
      }
      function nn(t, n, i) {
        var r = Je(t, n);
        return (r.isNegative ? "-" : "") + r.value.map(function(s) {
          return Bn(s, i)
        }).join("")
      }
      O.prototype.toArray = function(t) {
        return Je(this, t)
      }
        ,
        B.prototype.toArray = function(t) {
          return Je(this, t)
        }
        ,
        C.prototype.toArray = function(t) {
          return Je(this, t)
        }
        ,
        O.prototype.toString = function(t, n) {
          if (t === h && (t = 10),
          t !== 10)
            return nn(this, t, n);
          for (var i = this.value, r = i.length, s = String(i[--r]), u = "0000000", o; --r >= 0; )
            o = String(i[r]),
              s += u.slice(o.length) + o;
          var l = this.sign ? "-" : "";
          return l + s
        }
        ,
        B.prototype.toString = function(t, n) {
          return t === h && (t = 10),
            t != 10 ? nn(this, t, n) : String(this.value)
        }
        ,
        C.prototype.toString = B.prototype.toString,
        C.prototype.toJSON = O.prototype.toJSON = B.prototype.toJSON = function() {
          return this.toString()
        }
        ,
        O.prototype.valueOf = function() {
          return parseInt(this.toString(), 10)
        }
        ,
        O.prototype.toJSNumber = O.prototype.valueOf,
        B.prototype.valueOf = function() {
          return this.value
        }
        ,
        B.prototype.toJSNumber = B.prototype.valueOf,
        C.prototype.valueOf = C.prototype.toJSNumber = function() {
          return parseInt(this.toString(), 10)
        }
      ;
      function Qe(t) {
        if (Q(+t)) {
          var n = +t;
          if (n === le(n))
            return q ? new C(BigInt(n)) : new B(n);
          throw new Error("Invalid integer: " + t)
        }
        var i = t[0] === "-";
        i && (t = t.slice(1));
        var r = t.split(/e/i);
        if (r.length > 2)
          throw new Error("Invalid integer: " + r.join("e"));
        if (r.length === 2) {
          var s = r[1];
          if (s[0] === "+" && (s = s.slice(1)),
            s = +s,
          s !== le(s) || !Q(s))
            throw new Error("Invalid integer: " + s + " is not a valid exponent.");
          var u = r[0]
            , o = u.indexOf(".");
          if (o >= 0 && (s -= u.length - o - 1,
            u = u.slice(0, o) + u.slice(o + 1)),
          s < 0)
            throw new Error("Cannot include negative exponent part for integers");
          u += new Array(s + 1).join("0"),
            t = u
        }
        var l = /^([0-9][0-9]*)$/.test(t);
        if (!l)
          throw new Error("Invalid integer: " + t);
        if (q)
          return new C(BigInt(i ? "-" + t : t));
        for (var f = [], g = t.length, y = d, _ = g - y; g > 0; )
          f.push(+t.slice(_, g)),
            _ -= y,
          _ < 0 && (_ = 0),
            g -= y;
        return Y(f),
          new O(f,i)
      }
      function En(t) {
        if (q)
          return new C(BigInt(t));
        if (Q(t)) {
          if (t !== le(t))
            throw new Error(t + " is not an integer.");
          return new B(t)
        }
        return Qe(t.toString())
      }
      function ae(t) {
        return typeof t == "number" ? En(t) : typeof t == "string" ? Qe(t) : typeof t == "bigint" ? new C(t) : t
      }
      for (var e = 0; e < 1e3; e++)
        k[e] = ae(e),
        e > 0 && (k[-e] = ae(-e));
      return k.one = k[1],
        k.zero = k[0],
        k.minusOne = k[-1],
        k.max = Zt,
        k.min = tn,
        k.gcd = cn,
        k.lcm = wn,
        k.isInstance = function(t) {
          return t instanceof O || t instanceof B || t instanceof C
        }
        ,
        k.randBetween = bn,
        k.fromArray = function(t, n, i) {
          return Sn(t.map(ae), ae(n || 10), i)
        }
        ,
        k
    }();
    c.hasOwnProperty("exports") && (c.exports = a)
  }
)(Kr);
var Qa = Kr.exports
  , Yr = 64
  , Vi = 16
  , an = Yr / Vi;
function eo() {
  try {
    return !0
  } catch {
    return !1
  }
}
function to(c, a, h) {
  let p = 0;
  for (let d = 0; d < h; d++) {
    let M = c[a + d];
    if (M === void 0)
      break;
    p += M * Math.pow(16, d)
  }
  return p
}
function $r(c) {
  let a = [];
  for (let h = 0; h < c.length; h++) {
    let p = Number(c[h]);
    for (let d = 0; p || d < a.length; d++)
      p += (a[d] || 0) * 10,
        a[d] = p % 16,
        p = (p - a[d]) / 16
  }
  return a
}
function no(c) {
  let a = $r(c)
    , h = Array(an);
  for (let p = 0; p < an; p++)
    h[an - 1 - p] = to(a, p * an, an);
  return h
}
var Hn = class c {
  constructor(a, h) {
    this.parts = a,
      this.str = h
  }
  static fromString(a) {
    return new c(no(a),a)
  }
  static fromBit(a) {
    let h = Array(an)
      , p = Math.floor(a / Vi);
    for (let d = 0; d < an; d++)
      h[an - 1 - d] = d === p ? 1 << a - p * Vi : 0;
    return new c(h)
  }
  and({parts: a}) {
    return new c(this.parts.map((h,p)=>h & a[p]))
  }
  or({parts: a}) {
    return new c(this.parts.map((h,p)=>h | a[p]))
  }
  xor({parts: a}) {
    return new c(this.parts.map((h,p)=>h ^ a[p]))
  }
  not() {
    return new c(this.parts.map(a=>~a))
  }
  equals({parts: a}) {
    return this.parts.every((h,p)=>h === a[p])
  }
  toString() {
    if (this.str != null)
      return this.str;
    let a = new Array(Yr / 4);
    return this.parts.forEach((h,p)=>{
        let d = $r(h.toString());
        for (let M = 0; M < 4; M++)
          a[M + p * 4] = d[4 - 1 - M] || 0
      }
    ),
      this.str = Qa.fromArray(a, 16).toString()
  }
  toJSON() {
    return this.toString()
  }
}
  , ln = eo();
ln && BigInt.prototype.toJSON == null && (BigInt.prototype.toJSON = function() {
    return this.toString()
  }
);
var si = {}
  , Wr = ln ? function(a) {
      return BigInt(a)
    }
    : function(a) {
      return a instanceof Hn ? a : (typeof a == "number" && (a = a.toString()),
      si[a] != null || (si[a] = Hn.fromString(a)),
        si[a])
    }
  , St = Wr(0)
  , gi = ln ? function(a=St, h=St) {
      return a & h
    }
    : function(a=St, h=St) {
      return a.and(h)
    }
  , Jr = ln ? function(a=St, h=St) {
      return a | h
    }
    : function(a=St, h=St) {
      return a.or(h)
    }
  , io = ln ? function(a=St, h=St) {
      return a ^ h
    }
    : function(a=St, h=St) {
      return a.xor(h)
    }
  , ro = ln ? function(a=St) {
      return ~a
    }
    : function(a=St) {
      return a.not()
    }
  , Xi = ln ? function(a, h) {
      return a === h
    }
    : function(a, h) {
      return a == null || h == null ? a == h : a.equals(h)
    }
;
function so(...c) {
  let a = c[0];
  for (let h = 1; h < c.length; h++)
    a = Jr(a, c[h]);
  return a
}
function ao(c, a) {
  return Xi(gi(c, a), a)
}
function oo(c, a) {
  return !Xi(gi(c, a), St)
}
function uo(c, a) {
  return a === St ? c : Jr(c, a)
}
function lo(c, a) {
  return a === St ? c : io(c, gi(c, a))
}
var ho = ln ? function(a) {
    return BigInt(1) << BigInt(a)
  }
  : function(a) {
    return Hn.fromBit(a)
  }
  , co = {
  combine: so,
  add: uo,
  remove: lo,
  filter: gi,
  invert: ro,
  has: ao,
  hasAny: oo,
  equals: Xi,
  deserialize: Wr,
  getFlag: ho
}, ci;
(function(c) {
    c[c.CLOSE_NORMAL = 1e3] = "CLOSE_NORMAL",
      c[c.CLOSE_UNSUPPORTED = 1003] = "CLOSE_UNSUPPORTED",
      c[c.CLOSE_ABNORMAL = 1006] = "CLOSE_ABNORMAL",
      c[c.INVALID_CLIENTID = 4e3] = "INVALID_CLIENTID",
      c[c.INVALID_ORIGIN = 4001] = "INVALID_ORIGIN",
      c[c.RATELIMITED = 4002] = "RATELIMITED",
      c[c.TOKEN_REVOKED = 4003] = "TOKEN_REVOKED",
      c[c.INVALID_VERSION = 4004] = "INVALID_VERSION",
      c[c.INVALID_ENCODING = 4005] = "INVALID_ENCODING"
  }
)(ci || (ci = {}));
var jn;
(function(c) {
    c[c.INVALID_PAYLOAD = 4e3] = "INVALID_PAYLOAD",
      c[c.INVALID_COMMAND = 4002] = "INVALID_COMMAND",
      c[c.INVALID_EVENT = 4004] = "INVALID_EVENT",
      c[c.INVALID_PERMISSIONS = 4006] = "INVALID_PERMISSIONS"
  }
)(jn || (jn = {}));
var Fi;
(function(c) {
    c.LANDSCAPE = "landscape",
      c.PORTRAIT = "portrait"
  }
)(Fi || (Fi = {}));
var gn;
(function(c) {
    c.MOBILE = "mobile",
      c.DESKTOP = "desktop"
  }
)(gn || (gn = {}));
var ju = Object.freeze({
  CREATE_INSTANT_INVITE: co.getFlag(0)
});
function pt(c) {
  return qr(a=>{
      var h;
      let[p] = (h = Object.entries(c).find(([,d])=>d === a)) !== null && h !== void 0 ? h : [];
      return a != null && p === void 0 ? c.UNHANDLED : a
    }
    , j().or(fe()))
}
var Xr = "DISPATCH", ge;
(function(c) {
    c.AUTHORIZE = "AUTHORIZE",
      c.AUTHENTICATE = "AUTHENTICATE",
      c.GET_GUILDS = "GET_GUILDS",
      c.GET_GUILD = "GET_GUILD",
      c.GET_CHANNEL = "GET_CHANNEL",
      c.GET_CHANNELS = "GET_CHANNELS",
      c.SET_USER_VOICE_SETTINGS = "SET_USER_VOICE_SETTINGS",
      c.SELECT_VOICE_CHANNEL = "SELECT_VOICE_CHANNEL",
      c.GET_SELECTED_VOICE_CHANNEL = "GET_SELECTED_VOICE_CHANNEL",
      c.SELECT_TEXT_CHANNEL = "SELECT_TEXT_CHANNEL",
      c.GET_VOICE_SETTINGS = "GET_VOICE_SETTINGS",
      c.SET_VOICE_SETTINGS = "SET_VOICE_SETTINGS",
      c.SUBSCRIBE = "SUBSCRIBE",
      c.UNSUBSCRIBE = "UNSUBSCRIBE",
      c.CAPTURE_SHORTCUT = "CAPTURE_SHORTCUT",
      c.SET_CERTIFIED_DEVICES = "SET_CERTIFIED_DEVICES",
      c.SET_ACTIVITY = "SET_ACTIVITY",
      c.GET_SKUS = "GET_SKUS",
      c.GET_ENTITLEMENTS = "GET_ENTITLEMENTS",
      c.GET_SKUS_EMBEDDED = "GET_SKUS_EMBEDDED",
      c.GET_ENTITLEMENTS_EMBEDDED = "GET_ENTITLEMENTS_EMBEDDED",
      c.START_PURCHASE = "START_PURCHASE",
      c.START_PREMIUM_PURCHASE = "START_PREMIUM_PURCHASE",
      c.SET_CONFIG = "SET_CONFIG",
      c.SEND_ANALYTICS_EVENT = "SEND_ANALYTICS_EVENT",
      c.USER_SETTINGS_GET_LOCALE = "USER_SETTINGS_GET_LOCALE",
      c.OPEN_EXTERNAL_LINK = "OPEN_EXTERNAL_LINK",
      c.ENCOURAGE_HW_ACCELERATION = "ENCOURAGE_HW_ACCELERATION",
      c.CAPTURE_LOG = "CAPTURE_LOG",
      c.SET_ORIENTATION_LOCK_STATE = "SET_ORIENTATION_LOCK_STATE",
      c.OPEN_INVITE_DIALOG = "OPEN_INVITE_DIALOG",
      c.GET_PLATFORM_BEHAVIORS = "GET_PLATFORM_BEHAVIORS",
      c.GET_CHANNEL_PERMISSIONS = "GET_CHANNEL_PERMISSIONS",
      c.OPEN_SHARE_MOMENT_DIALOG = "OPEN_SHARE_MOMENT_DIALOG",
      c.INITIATE_IMAGE_UPLOAD = "INITIATE_IMAGE_UPLOAD"
  }
)(ge || (ge = {}));
var Dn = he({
  cmd: j(),
  data: Zn(),
  evt: Wi(),
  nonce: j()
}).passthrough()
  , Qr = {
  UNHANDLED: -1,
  bot: "bot",
  rpc: "rpc",
  identify: "identify",
  connections: "connections",
  email: "email",
  guilds: "guilds",
  "guilds.join": "guilds.join",
  "guilds.members.read": "guilds.members.read",
  "gdm.join": "gdm.join",
  "messages.read": "messages.read",
  "rpc.notifications.read": "rpc.notifications.read",
  "rpc.voice.write": "rpc.voice.write",
  "rpc.voice.read": "rpc.voice.read",
  "rpc.activities.write": "rpc.activities.write",
  "webhook.incoming": "webhook.incoming",
  "applications.builds.upload": "applications.builds.upload",
  "applications.builds.read": "applications.builds.read",
  "applications.store.update": "applications.store.update",
  "applications.entitlements": "applications.entitlements",
  "relationships.read": "relationships.read",
  "activities.read": "activities.read",
  "activities.write": "activities.write"
}
  , es = pt(Qr)
  , qt = he({
  id: j(),
  username: j(),
  discriminator: j(),
  avatar: j().optional().nullable(),
  publicFlags: fe().optional().nullable()
})
  , vi = he({
  user: qt,
  nick: j().optional().nullable(),
  roles: Be(j()),
  joined_at: j(),
  deaf: Ae(),
  mute: Ae()
})
  , mi = he({
  id: j(),
  name: j().optional().nullable(),
  roles: Be(j()).optional().nullable(),
  user: qt.optional().nullable(),
  require_colons: Ae().optional().nullable(),
  managed: Ae().optional().nullable(),
  animated: Ae().optional().nullable(),
  available: Ae().optional().nullable()
})
  , yi = he({
  mute: Ae(),
  deaf: Ae(),
  self_mute: Ae(),
  self_deaf: Ae(),
  suppress: Ae()
})
  , ts = he({
  mute: Ae(),
  nick: j(),
  user: qt,
  voice_state: yi,
  volume: fe()
})
  , ns = {
  UNHANDLED: -1,
  IDLE: "idle",
  DND: "dnd",
  ONLINE: "online",
  OFFLINE: "offline"
}
  , Un = pt(ns)
  , xn = he({
  name: j(),
  type: fe(),
  url: j().optional().nullable(),
  created_at: fe().optional().nullable(),
  timestamps: he({
    start: fe(),
    end: fe()
  }).partial().optional().nullable(),
  application_id: j().optional().nullable(),
  details: j().optional().nullable(),
  state: j().optional().nullable(),
  emoji: mi.optional().nullable(),
  party: he({
    id: j().optional().nullable(),
    size: Be(fe()).optional().nullable()
  }).optional().nullable(),
  assets: he({
    large_image: j().nullable(),
    large_text: j().nullable(),
    small_image: j().nullable(),
    small_text: j().nullable()
  }).partial().optional().nullable(),
  secrets: he({
    join: j(),
    match: j()
  }).partial().optional().nullable(),
  instance: Ae().optional().nullable(),
  flags: fe().optional().nullable()
})
  , is = {
  UNHANDLED: -1,
  ROLE: 0,
  MEMBER: 1
}
  , rs = he({
  id: j(),
  type: pt(is),
  allow: j(),
  deny: j()
})
  , wi = {
  UNHANDLED: -1,
  DM: 1,
  GROUP_DM: 3,
  GUILD_TEXT: 0,
  GUILD_VOICE: 2,
  GUILD_CATEGORY: 4,
  GUILD_ANNOUNCEMENT: 5,
  GUILD_STORE: 6,
  ANNOUNCEMENT_THREAD: 10,
  PUBLIC_THREAD: 11,
  PRIVATE_THREAD: 12,
  GUILD_STAGE_VOICE: 13,
  GUILD_DIRECTORY: 14,
  GUILD_FORUM: 15
}
  , Qi = he({
  id: j(),
  type: pt(wi),
  guild_id: j().optional().nullable(),
  position: fe().optional().nullable(),
  permission_overwrites: Be(rs).optional().nullable(),
  name: j().optional().nullable(),
  topic: j().optional().nullable(),
  nsfw: Ae().optional().nullable(),
  last_message_id: j().optional().nullable(),
  bitrate: fe().optional().nullable(),
  user_limit: fe().optional().nullable(),
  rate_limit_per_user: fe().optional().nullable(),
  recipients: Be(qt).optional().nullable(),
  icon: j().optional().nullable(),
  owner_id: j().optional().nullable(),
  application_id: j().optional().nullable(),
  parent_id: j().optional().nullable(),
  last_pin_timestamp: j().optional().nullable()
})
  , ss = he({
  user: qt,
  guild_id: j(),
  status: Un,
  activities: Be(xn),
  client_status: he({
    desktop: Un,
    mobile: Un,
    web: Un
  }).partial()
})
  , as = he({
  id: j(),
  name: j(),
  color: fe(),
  hoist: Ae(),
  position: fe(),
  permissions: j(),
  managed: Ae(),
  mentionable: Ae()
})
  , os = he({
  id: j(),
  name: j(),
  owner_id: j(),
  icon: j().nullable(),
  icon_hash: j().optional().nullable(),
  splash: j().nullable(),
  discovery_splash: j().nullable(),
  owner: Ae().optional().nullable(),
  permissions: j().optional().nullable(),
  region: j(),
  afk_channel_id: j().nullable(),
  afk_timeout: fe(),
  widget_enabled: Ae().optional().nullable(),
  widget_channel_id: j().optional().nullable(),
  verification_level: fe(),
  default_message_notifications: fe(),
  explicit_content_filter: fe(),
  roles: Be(as),
  emojis: Be(mi),
  features: Be(j()),
  mfa_level: fe(),
  application_id: j().nullable(),
  system_channel_id: j().nullable(),
  system_channel_flags: fe(),
  rules_channel_id: j().nullable(),
  joined_at: j().optional().nullable(),
  large: Ae().optional().nullable(),
  unavailable: Ae().optional().nullable(),
  member_count: fe().optional().nullable(),
  voice_states: Be(yi).optional().nullable(),
  members: Be(vi).optional().nullable(),
  channels: Be(Qi).optional().nullable(),
  presences: Be(ss).optional().nullable(),
  max_presences: fe().optional().nullable(),
  max_members: fe().optional().nullable(),
  vanity_url_code: j().nullable(),
  description: j().nullable(),
  banner: j().nullable(),
  premium_tier: fe(),
  premium_subscription_count: fe().optional().nullable(),
  preferred_locale: j(),
  public_updates_channel_id: j().nullable(),
  max_video_channel_users: fe().optional().nullable(),
  approximate_member_count: fe().optional().nullable(),
  approximate_presence_count: fe().optional().nullable()
})
  , us = he({
  id: j(),
  guild_id: j(),
  type: fe(),
  name: j()
})
  , ls = he({
  id: j(),
  filename: j(),
  size: fe(),
  url: j(),
  proxy_url: j(),
  height: fe().optional().nullable(),
  width: fe().optional().nullable()
})
  , hs = he({
  text: j(),
  icon_url: j().optional().nullable(),
  proxy_icon_url: j().optional().nullable()
})
  , fi = he({
  url: j().optional().nullable(),
  proxy_url: j().optional().nullable(),
  height: fe().optional().nullable(),
  width: fe().optional().nullable()
})
  , cs = fi.omit({
  proxy_url: !0
})
  , fs = he({
  name: j().optional().nullable(),
  url: j().optional().nullable()
})
  , ds = he({
  name: j().optional().nullable(),
  url: j().optional().nullable(),
  icon_url: j().optional().nullable(),
  proxy_icon_url: j().optional().nullable()
})
  , ps = he({
  name: j(),
  value: j(),
  inline: Ae()
})
  , _s = he({
  title: j().optional().nullable(),
  type: j().optional().nullable(),
  description: j().optional().nullable(),
  url: j().optional().nullable(),
  timestamp: j().optional().nullable(),
  color: fe().optional().nullable(),
  footer: hs.optional().nullable(),
  image: fi.optional().nullable(),
  thumbnail: fi.optional().nullable(),
  video: cs.optional().nullable(),
  provider: fs.optional().nullable(),
  author: ds.optional().nullable(),
  fields: Be(ps).optional().nullable()
})
  , gs = he({
  count: fe(),
  me: Ae(),
  emoji: mi
})
  , vs = he({
  type: fe(),
  party_id: j().optional().nullable()
})
  , ms = he({
  id: j(),
  cover_image: j().optional().nullable(),
  description: j(),
  icon: j().optional().nullable(),
  name: j()
})
  , ys = he({
  message_id: j().optional().nullable(),
  channel_id: j().optional().nullable(),
  guild_id: j().optional().nullable()
})
  , bi = he({
  id: j(),
  channel_id: j(),
  guild_id: j().optional().nullable(),
  author: qt.optional().nullable(),
  member: vi.optional().nullable(),
  content: j(),
  timestamp: j(),
  edited_timestamp: j().optional().nullable(),
  tts: Ae(),
  mention_everyone: Ae(),
  mentions: Be(qt),
  mention_roles: Be(j()),
  mention_channels: Be(us),
  attachments: Be(ls),
  embeds: Be(_s),
  reactions: Be(gs).optional().nullable(),
  nonce: Ji([j(), fe()]).optional().nullable(),
  pinned: Ae(),
  webhook_id: j().optional().nullable(),
  type: fe(),
  activity: vs.optional().nullable(),
  application: ms.optional().nullable(),
  message_reference: ys.optional().nullable(),
  flags: fe().optional().nullable(),
  stickers: Be(Zn()).optional().nullable(),
  referenced_message: Zn().optional().nullable()
})
  , ws = he({
  id: j(),
  name: j()
})
  , bs = {
  UNHANDLED: -1,
  KEYBOARD_KEY: 0,
  MOUSE_BUTTON: 1,
  KEYBOARD_MODIFIER_KEY: 2,
  GAMEPAD_BUTTON: 3
}
  , Si = he({
  type: pt(bs),
  code: fe(),
  name: j()
})
  , Ss = {
  UNHANDLED: -1,
  PUSH_TO_TALK: "PUSH_TO_TALK",
  VOICE_ACTIVITY: "VOICE_ACTIVITY"
}
  , Es = he({
  type: pt(Ss),
  auto_threshold: Ae(),
  threshold: fe(),
  shortcut: Be(Si),
  delay: fe()
})
  , Gi = he({
  device_id: j(),
  volume: fe(),
  available_devices: Be(ws)
})
  , Ts = {
  UNHANDLED: -1,
  AUDIO_INPUT: "AUDIO_INPUT",
  AUDIO_OUTPUT: "AUDIO_OUTPUT",
  VIDEO_INPUT: "VIDEO_INPUT"
}
  , fo = he({
  type: pt(Ts),
  id: j(),
  vendor: he({
    name: j(),
    url: j()
  }),
  model: he({
    name: j(),
    url: j()
  }),
  related: Be(j()),
  echo_cancellation: Ae().optional().nullable(),
  noise_suppression: Ae().optional().nullable(),
  automatic_gain_control: Ae().optional().nullable(),
  hardware_mute: Ae().optional().nullable()
})
  , Is = {
  UNHANDLED: -1,
  APPLICATION: 1,
  DLC: 2,
  CONSUMABLE: 3,
  BUNDLE: 4,
  SUBSCRIPTION: 5
}
  , Cs = he({
  id: j(),
  name: j(),
  type: pt(Is),
  price: he({
    amount: fe(),
    currency: j()
  }),
  application_id: j(),
  flags: fe(),
  release_date: j().nullable()
})
  , As = {
  UNHANDLED: -1,
  PURCHASE: 1,
  PREMIUM_SUBSCRIPTION: 2,
  DEVELOPER_GIFT: 3,
  TEST_MODE_PURCHASE: 4,
  FREE_PURCHASE: 5,
  USER_GIFT: 6,
  PREMIUM_PURCHASE: 7
}
  , Ei = he({
  id: j(),
  sku_id: j(),
  application_id: j(),
  user_id: j(),
  gift_code_flags: fe(),
  type: pt(As),
  gifter_user_id: j().optional().nullable(),
  branches: Be(j()).optional().nullable(),
  starts_at: j().optional().nullable(),
  ends_at: j().optional().nullable(),
  parent_id: j().optional().nullable(),
  consumed: Ae().optional().nullable(),
  deleted: Ae().optional().nullable(),
  gift_code_batch_id: j().optional().nullable()
})
  , Ps = {
  UNHANDLED: -1,
  UNLOCKED: 1,
  PORTRAIT: 2,
  LANDSCAPE: 3
}
  , po = pt(Ps)
  , Os = {
  UNHANDLED: -1,
  NOMINAL: 0,
  FAIR: 1,
  SERIOUS: 2,
  CRITICAL: 3
}
  , xs = pt(Os)
  , er = {
  UNHANDLED: -1,
  PORTRAIT: 0,
  LANDSCAPE: 1
}
  , _o = pt(er)
  , qn = {
  UNHANDLED: -1,
  FOCUSED: 0,
  PIP: 1,
  GRID: 2
}
  , go = pt(qn)
  , vo = Object.freeze({
  __proto__: null,
  DISPATCH: Xr,
  get Commands() {
    return ge
  },
  ReceiveFramePayload: Dn,
  ScopesObject: Qr,
  Scopes: es,
  User: qt,
  GuildMember: vi,
  Emoji: mi,
  VoiceState: yi,
  UserVoiceState: ts,
  StatusObject: ns,
  Status: Un,
  Activity: xn,
  PermissionOverwriteTypeObject: is,
  PermissionOverwrite: rs,
  ChannelTypesObject: wi,
  Channel: Qi,
  PresenceUpdate: ss,
  Role: as,
  Guild: os,
  ChannelMention: us,
  Attachment: ls,
  EmbedFooter: hs,
  Image: fi,
  Video: cs,
  EmbedProvider: fs,
  EmbedAuthor: ds,
  EmbedField: ps,
  Embed: _s,
  Reaction: gs,
  MessageActivity: vs,
  MessageApplication: ms,
  MessageReference: ys,
  Message: bi,
  VoiceDevice: ws,
  KeyTypesObject: bs,
  ShortcutKey: Si,
  VoiceSettingModeTypeObject: Ss,
  VoiceSettingsMode: Es,
  VoiceSettingsIO: Gi,
  CertifiedDeviceTypeObject: Ts,
  CertifiedDevice: fo,
  SkuTypeObject: Is,
  Sku: Cs,
  EntitlementTypesObject: As,
  Entitlement: Ei,
  OrientationLockStateTypeObject: Ps,
  OrientationLockState: po,
  ThermalStateTypeObject: Os,
  ThermalState: xs,
  OrientationTypeObject: er,
  Orientation: _o,
  LayoutModeTypeObject: qn,
  LayoutMode: go
})
  , mn = he({}).nullable()
  , Ns = he({
  code: j()
})
  , Ls = he({
  access_token: j(),
  user: he({
    username: j(),
    discriminator: j(),
    id: j(),
    avatar: j().nullable(),
    public_flags: fe()
  }),
  scopes: Be(es),
  expires: j(),
  application: he({
    description: j(),
    icon: j().nullable(),
    id: j(),
    rpc_origins: Be(j()).optional(),
    name: j()
  })
})
  , mo = he({
  guilds: Be(he({
    id: j(),
    name: j()
  }))
})
  , yo = he({
  id: j(),
  name: j(),
  icon_url: j().optional(),
  members: Be(vi)
})
  , Kn = he({
  id: j(),
  type: pt(wi),
  guild_id: j().optional().nullable(),
  name: j().optional().nullable(),
  topic: j().optional().nullable(),
  bitrate: fe().optional().nullable(),
  user_limit: fe().optional().nullable(),
  position: fe().optional().nullable(),
  voice_states: Be(ts),
  messages: Be(bi)
})
  , wo = he({
  channels: Be(Qi)
})
  , Ms = he({
  user_id: j(),
  pan: he({
    left: fe(),
    right: fe()
  }).optional(),
  volume: fe().optional(),
  mute: Ae().optional()
})
  , qu = Kn.nullable()
  , bo = Kn.nullable()
  , Rs = Kn.nullable()
  , So = Kn.nullable()
  , tr = he({
  input: Gi,
  output: Gi,
  mode: Es,
  automatic_gain_control: Ae(),
  echo_cancellation: Ae(),
  noise_suppression: Ae(),
  qos: Ae(),
  silence_warning: Ae(),
  deaf: Ae(),
  mute: Ae()
})
  , Eo = he({
  evt: j()
})
  , To = he({
  shortcut: Si
})
  , Ds = xn
  , ks = he({
  skus: Be(Cs)
})
  , Bs = he({
  entitlements: Be(Ei)
})
  , Us = Be(Ei).nullable()
  , zs = he({
  use_interactive_pip: Ae()
})
  , Vs = he({
  locale: j()
})
  , Fs = he({
  enabled: Ae()
})
  , Gs = he({
  permissions: Hr().or(j())
})
  , Zs = he({
  image_url: j()
}).nullable()
  , Hs = he({
  iosKeyboardResizesView: jr(Ae())
})
  , Io = Dn.extend({
  cmd: Rn(ge),
  evt: Wi()
});
function Co({cmd: c, data: a}) {
  switch (c) {
    case ge.AUTHENTICATE:
      return Ls.parse(a);
    case ge.AUTHORIZE:
      return Ns.parse(a);
    case ge.CAPTURE_SHORTCUT:
      return To.parse(a);
    case ge.ENCOURAGE_HW_ACCELERATION:
      return Fs.parse(a);
    case ge.GET_CHANNEL:
      return Kn.parse(a);
    case ge.GET_CHANNELS:
      return wo.parse(a);
    case ge.GET_CHANNEL_PERMISSIONS:
      return Gs.parse(a);
    case ge.GET_GUILD:
      return yo.parse(a);
    case ge.GET_GUILDS:
      return mo.parse(a);
    case ge.GET_PLATFORM_BEHAVIORS:
      return Hs.parse(a);
    case ge.GET_SELECTED_VOICE_CHANNEL:
      return Rs.parse(a);
    case ge.GET_VOICE_SETTINGS:
    case ge.SET_VOICE_SETTINGS:
      return tr.parse(a);
    case ge.SELECT_TEXT_CHANNEL:
      return So.parse(a);
    case ge.SELECT_VOICE_CHANNEL:
      return bo.parse(a);
    case ge.SET_ACTIVITY:
      return Ds.parse(a);
    case ge.GET_SKUS_EMBEDDED:
      return ks.parse(a);
    case ge.GET_ENTITLEMENTS_EMBEDDED:
      return Bs.parse(a);
    case ge.SET_CONFIG:
      return zs.parse(a);
    case ge.SET_USER_VOICE_SETTINGS:
      return Ms.parse(a);
    case ge.START_PURCHASE:
      return Us.parse(a);
    case ge.SUBSCRIBE:
    case ge.UNSUBSCRIBE:
      return Eo.parse(a);
    case ge.USER_SETTINGS_GET_LOCALE:
      return Vs.parse(a);
    case ge.INITIATE_IMAGE_UPLOAD:
      return Zs.parse(a);
    case ge.START_PREMIUM_PURCHASE:
    case ge.OPEN_EXTERNAL_LINK:
    case ge.SET_ORIENTATION_LOCK_STATE:
    case ge.SET_CERTIFIED_DEVICES:
    case ge.SEND_ANALYTICS_EVENT:
    case ge.OPEN_INVITE_DIALOG:
    case ge.CAPTURE_LOG:
    case ge.OPEN_SHARE_MOMENT_DIALOG:
      return mn.parse(a);
    default:
      throw new Error(`Unrecognized command ${c}`)
  }
}
function Ao(c) {
  return Object.assign(Object.assign({}, c), {
    data: Co(c)
  })
}
var nr = "ERROR", _e;
(function(c) {
    c.READY = "READY",
      c.GUILD_STATUS = "GUILD_STATUS",
      c.GUILD_CREATE = "GUILD_CREATE",
      c.CHANNEL_CREATE = "CHANNEL_CREATE",
      c.VOICE_CHANNEL_SELECT = "VOICE_CHANNEL_SELECT",
      c.VOICE_SETTINGS_UPDATE = "VOICE_SETTINGS_UPDATE",
      c.VOICE_STATE_CREATE = "VOICE_STATE_CREATE",
      c.VOICE_STATE_UPDATE = "VOICE_STATE_UPDATE",
      c.VOICE_STATE_DELETE = "VOICE_STATE_DELETE",
      c.VOICE_CONNECTION_STATUS = "VOICE_CONNECTION_STATUS",
      c.MESSAGE_CREATE = "MESSAGE_CREATE",
      c.MESSAGE_UPDATE = "MESSAGE_UPDATE",
      c.MESSAGE_DELETE = "MESSAGE_DELETE",
      c.SPEAKING_START = "SPEAKING_START",
      c.SPEAKING_STOP = "SPEAKING_STOP",
      c.NOTIFICATION_CREATE = "NOTIFICATION_CREATE",
      c.CAPTURE_SHORTCUT_CHANGE = "CAPTURE_SHORTCUT_CHANGE",
      c.ACTIVITY_JOIN = "ACTIVITY_JOIN",
      c.ACTIVITY_JOIN_REQUEST = "ACTIVITY_JOIN_REQUEST",
      c.ACTIVITY_PIP_MODE_UPDATE = "ACTIVITY_PIP_MODE_UPDATE",
      c.ACTIVITY_LAYOUT_MODE_UPDATE = "ACTIVITY_LAYOUT_MODE_UPDATE",
      c.ORIENTATION_UPDATE = "ORIENTATION_UPDATE",
      c.CURRENT_USER_UPDATE = "CURRENT_USER_UPDATE",
      c.ENTITLEMENT_CREATE = "ENTITLEMENT_CREATE",
      c.THERMAL_STATE_UPDATE = "THERMAL_STATE_UPDATE"
  }
)(_e || (_e = {}));
var js = Dn.extend({
  evt: zt(nr),
  data: he({
    code: fe(),
    message: j().optional()
  }).passthrough(),
  cmd: Rn(ge),
  nonce: j().nullable()
})
  , ir = Dn.extend({
  evt: Rn(_e),
  nonce: j().nullable(),
  cmd: zt(Xr),
  data: he({}).passthrough()
})
  , Po = ir.extend({
  evt: j()
})
  , Oo = Ji([ir, Po, js]);
function at(c, a) {
  return ir.extend({
    evt: zt(c),
    data: he(a)
  })
}
var xo = at(_e.READY, {
  v: fe(),
  config: he({
    cdn_host: j().optional(),
    api_endpoint: j(),
    environment: j()
  }),
  user: he({
    id: j(),
    username: j(),
    discriminator: j(),
    avatar: j().optional()
  }).optional()
})
  , No = at(_e.GUILD_STATUS, {
  guild: os,
  online: fe().optional()
})
  , Lo = at(_e.GUILD_CREATE, {
  id: j(),
  name: j()
})
  , Mo = at(_e.CHANNEL_CREATE, {
  id: j(),
  name: j(),
  type: pt(wi)
})
  , Ro = at(_e.VOICE_CHANNEL_SELECT, {
  channel_id: j().nullable(),
  guild_id: j().nullable().optional()
})
  , Do = at(_e.VOICE_STATE_UPDATE, {
  data: tr
})
  , rr = at(_e.VOICE_STATE_CREATE, {
  voice_state: yi,
  user: qt,
  nick: j(),
  volume: fe(),
  mute: Ae(),
  pan: he({
    left: fe(),
    right: fe()
  })
})
  , ko = rr.extend({
  evt: zt(_e.VOICE_STATE_UPDATE)
})
  , Bo = rr.extend({
  evt: zt(_e.VOICE_STATE_DELETE)
})
  , Uo = {
  UNHANDLED: -1,
  DISCONNECTED: "DISCONNECTED",
  AWAITING_ENDPOINT: "AWAITING_ENDPOINT",
  AUTHENTICATING: "AUTHENTICATING",
  CONNECTING: "CONNECTING",
  CONNECTED: "CONNECTED",
  VOICE_DISCONNECTED: "VOICE_DISCONNECTED",
  VOICE_CONNECTING: "VOICE_CONNECTING",
  VOICE_CONNECTED: "VOICE_CONNECTED",
  NO_ROUTE: "NO_ROUTE",
  ICE_CHECKING: "ICE_CHECKING"
}
  , zo = at(_e.VOICE_CONNECTION_STATUS, {
  state: pt(Uo),
  hostname: j(),
  pings: Be(fe()),
  average_ping: fe(),
  last_ping: fe()
})
  , sr = at(_e.MESSAGE_CREATE, {
  channel_id: j(),
  message: bi
})
  , Vo = sr.extend({
  evt: zt(_e.MESSAGE_UPDATE)
})
  , Fo = sr.extend({
  evt: zt(_e.MESSAGE_DELETE)
})
  , Go = at(_e.SPEAKING_START, {
  user_id: j()
})
  , Zo = at(_e.SPEAKING_STOP, {
  user_id: j()
})
  , Ho = at(_e.NOTIFICATION_CREATE, {
  channel_id: j(),
  message: bi,
  icon_url: j(),
  title: j(),
  body: j()
})
  , jo = at(_e.CAPTURE_SHORTCUT_CHANGE, {
  shortcut: Si
})
  , qo = {
  UNHANDLED: -1,
  PLAY: 0,
  SPECTATE: 1
}
  , Ko = at(_e.ACTIVITY_JOIN, {
  secret: j(),
  intent: pt(qo).optional()
})
  , Yo = at(_e.ACTIVITY_JOIN_REQUEST, {
  user: qt
})
  , $o = at(_e.ACTIVITY_PIP_MODE_UPDATE, {
  is_pip_mode: Ae()
})
  , Wo = at(_e.ACTIVITY_LAYOUT_MODE_UPDATE, {
  layout_mode: pt(qn)
})
  , Jo = at(_e.ORIENTATION_UPDATE, {
  screen_orientation: pt(er),
  orientation: Rn(Fi)
})
  , Xo = at(_e.CURRENT_USER_UPDATE, {
  avatar: j().optional().nullable(),
  bot: Ae(),
  discriminator: j(),
  flags: fe().optional().nullable(),
  id: j(),
  premium_type: fe().optional().nullable(),
  username: j()
})
  , Qo = at(_e.ENTITLEMENT_CREATE, {
  entitlement: Ei
})
  , eu = at(_e.THERMAL_STATE_UPDATE, {
  thermal_state: xs
});
function tu(c) {
  switch (c.evt) {
    case _e.ACTIVITY_JOIN:
      return Ko.parse(c);
    case _e.ACTIVITY_JOIN_REQUEST:
      return Yo.parse(c);
    case _e.ACTIVITY_PIP_MODE_UPDATE:
      return $o.parse(c);
    case _e.ACTIVITY_LAYOUT_MODE_UPDATE:
      return Wo.parse(c);
    case _e.CAPTURE_SHORTCUT_CHANGE:
      return jo.parse(c);
    case _e.CHANNEL_CREATE:
      return Mo.parse(c);
    case nr:
      return js.parse(c);
    case _e.GUILD_CREATE:
      return Lo.parse(c);
    case _e.GUILD_STATUS:
      return No.parse(c);
    case _e.MESSAGE_CREATE:
      return sr.parse(c);
    case _e.MESSAGE_DELETE:
      return Fo.parse(c);
    case _e.MESSAGE_UPDATE:
      return Vo.parse(c);
    case _e.NOTIFICATION_CREATE:
      return Ho.parse(c);
    case _e.ORIENTATION_UPDATE:
      return Jo.parse(c);
    case _e.READY:
      return xo.parse(c);
    case _e.SPEAKING_START:
      return Go.parse(c);
    case _e.SPEAKING_STOP:
      return Zo.parse(c);
    case _e.VOICE_CHANNEL_SELECT:
      return Ro.parse(c);
    case _e.VOICE_CONNECTION_STATUS:
      return zo.parse(c);
    case _e.VOICE_SETTINGS_UPDATE:
      return Do.parse(c);
    case _e.VOICE_STATE_CREATE:
      return rr.parse(c);
    case _e.VOICE_STATE_DELETE:
      return Bo.parse(c);
    case _e.VOICE_STATE_UPDATE:
      return ko.parse(c);
    case _e.CURRENT_USER_UPDATE:
      return Xo.parse(c);
    case _e.ENTITLEMENT_CREATE:
      return Qo.parse(c);
    case _e.THERMAL_STATE_UPDATE:
      return eu.parse(c);
    default:
      throw new Error(`Unrecognized event type ${c.evt}`)
  }
}
he({
  frame_id: j(),
  platform: Rn(gn).optional().nullable()
});
he({
  v: zt(1),
  encoding: zt("json").optional(),
  client_id: j(),
  frame_id: j()
});
var nu = he({
  code: fe(),
  message: j().optional()
})
  , iu = he({
  evt: j().nullable(),
  nonce: j().nullable(),
  data: Zn().nullable(),
  cmd: j()
}).passthrough();
function ru(c) {
  let a = iu.parse(c);
  return a.evt != null ? tu(Oo.parse(a)) : Ao(Io.passthrough().parse(a))
}
function ht(c, a, h, p=()=>{}
) {
  let d = Dn.extend({
    cmd: zt(a),
    data: h
  });
  return M=>_n(this, void 0, void 0, function*() {
    let F = yield c({
      cmd: a,
      args: M,
      transfer: p(M)
    });
    return d.parse(F).data
  })
}
var su = c=>ht(c, ge.AUTHENTICATE, Ls)
  , au = c=>ht(c, ge.AUTHORIZE, Ns)
  , ou = c=>ht(c, ge.CAPTURE_LOG, mn)
  , uu = c=>ht(c, ge.ENCOURAGE_HW_ACCELERATION, Fs)
  , lu = c=>ht(c, ge.GET_ENTITLEMENTS_EMBEDDED, Bs)
  , hu = c=>ht(c, ge.GET_SELECTED_VOICE_CHANNEL, Rs)
  , cu = c=>ht(c, ge.GET_SKUS_EMBEDDED, ks)
  , fu = c=>ht(c, ge.GET_VOICE_SETTINGS, tr)
  , du = c=>ht(c, ge.GET_CHANNEL_PERMISSIONS, Gs)
  , pu = c=>ht(c, ge.GET_PLATFORM_BEHAVIORS, Hs)
  , _u = c=>ht(c, ge.OPEN_EXTERNAL_LINK, mn)
  , gu = c=>ht(c, ge.OPEN_INVITE_DIALOG, mn)
  , vu = c=>ht(c, ge.OPEN_SHARE_MOMENT_DIALOG, mn);
xn.pick({
  state: !0,
  details: !0,
  timestamps: !0,
  assets: !0,
  party: !0,
  secrets: !0,
  buttons: !0,
  instance: !0,
  supported_platforms: !0,
  type: !0
}).extend({
  type: xn.shape.type.optional(),
  instance: xn.shape.instance.optional()
}).nullable();
var mu = c=>ht(c, ge.SET_ACTIVITY, Ds)
  , yu = c=>ht(c, ge.SET_CONFIG, zs);
function wu({sendCommand: c, cmd: a, response: h, fallbackTransform: p, transferTransform: d=()=>{}
            }) {
  let M = Dn.extend({
    cmd: zt(a),
    data: h
  });
  return F=>_n(this, void 0, void 0, function*() {
    try {
      let Z = yield c({
        cmd: a,
        args: F,
        transfer: d(F)
      });
      return M.parse(Z).data
    } catch (Z) {
      if (Z.code === jn.INVALID_PAYLOAD) {
        let q = p(F)
          , k = yield c({
          cmd: a,
          args: q,
          transfer: d(q)
        });
        return M.parse(k).data
      } else
        throw Z
    }
  })
}
var bu = c=>({
  lock_state: c.lock_state,
  picture_in_picture_lock_state: c.picture_in_picture_lock_state
})
  , Su = c=>wu({
  sendCommand: c,
  cmd: ge.SET_ORIENTATION_LOCK_STATE,
  response: mn,
  fallbackTransform: bu
})
  , Eu = c=>ht(c, ge.SET_USER_VOICE_SETTINGS, Ms)
  , Tu = c=>ht(c, ge.START_PREMIUM_PURCHASE, mn)
  , Iu = c=>ht(c, ge.START_PURCHASE, Us)
  , Cu = c=>ht(c, ge.USER_SETTINGS_GET_LOCALE, Vs)
  , Au = c=>ht(c, ge.INITIATE_IMAGE_UPLOAD, Zs);
function Pu(c) {
  return {
    authenticate: su(c),
    authorize: au(c),
    captureLog: ou(c),
    encourageHardwareAcceleration: uu(c),
    getChannelPermissions: du(c),
    getEntitlements: lu(c),
    getPlatformBehaviors: pu(c),
    getSelectedVoiceChannel: hu(c),
    getSkus: cu(c),
    getVoiceSettings: fu(c),
    openExternalLink: _u(c),
    openInviteDialog: gu(c),
    openShareMomentDialog: vu(c),
    setActivity: mu(c),
    setConfig: yu(c),
    setOrientationLockState: Su(c),
    setUserVoiceSettings: Eu(c),
    startPremiumPurchase: Tu(c),
    startPurchase: Iu(c),
    userSettingsGetLocale: Cu(c),
    initiateImageUpload: Au(c)
  }
}
var ai, Ou = new Uint8Array(16);
function xu() {
  if (!ai && (ai = typeof crypto < "u" && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || typeof msCrypto < "u" && typeof msCrypto.getRandomValues == "function" && msCrypto.getRandomValues.bind(msCrypto),
    !ai))
    throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
  return ai(Ou)
}
var Nu = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
function Lu(c) {
  return typeof c == "string" && Nu.test(c)
}
var bt = [];
for (oi = 0; oi < 256; ++oi)
  bt.push((oi + 256).toString(16).substr(1));
var oi;
function Mu(c) {
  var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0
    , h = (bt[c[a + 0]] + bt[c[a + 1]] + bt[c[a + 2]] + bt[c[a + 3]] + "-" + bt[c[a + 4]] + bt[c[a + 5]] + "-" + bt[c[a + 6]] + bt[c[a + 7]] + "-" + bt[c[a + 8]] + bt[c[a + 9]] + "-" + bt[c[a + 10]] + bt[c[a + 11]] + bt[c[a + 12]] + bt[c[a + 13]] + bt[c[a + 14]] + bt[c[a + 15]]).toLowerCase();
  if (!Lu(h))
    throw TypeError("Stringified UUID is invalid");
  return h
}
function Tr(c, a, h) {
  c = c || {};
  var p = c.random || (c.rng || xu)();
  if (p[6] = p[6] & 15 | 64,
    p[8] = p[8] & 63 | 128,
    a) {
    h = h || 0;
    for (var d = 0; d < 16; ++d)
      a[h + d] = p[d];
    return a
  }
  return Mu(p)
}
var Zi = class extends Error {
  constructor(a, h="") {
    super(h),
      this.code = a,
      this.message = h,
      this.name = "Discord SDK Error"
  }
}
  , qs = /\{([a-z]+)\}/g;
function Ru(c) {
  let a = c.replace(qs, (h,p)=>`(?<${p}>[\\w-]+)`);
  return new RegExp(`${a}(/|$)`)
}
function Du({originalURL: c, prefix: a, prefixHost: h, target: p}) {
  let d = new URL(`https://${p}`)
    , M = Ru(d.host)
    , F = c.toString().match(M);
  if (F == null)
    return c;
  let Z = new URL(c.toString());
  return Z.host = h,
    Z.pathname = a.replace(qs, (q,k)=>{
        var O;
        let B = (O = F.groups) === null || O === void 0 ? void 0 : O[k];
        if (B == null)
          throw new Error("Misconfigured route.");
        return B
      }
    ),
    Z.pathname += Z.pathname === "/" ? c.pathname.slice(1) : c.pathname,
    Z.pathname = Z.pathname.replace(d.pathname, ""),
    Z.pathname += Z.pathname.endsWith("/") ? "" : "/",
    Z
}
function Di(c, a=window.location.protocol, h=window.location.host) {
  return c.startsWith("/") ? new URL(`${a}//${h}${c}`) : new URL(c)
}
function ki({url: c, mappings: a}) {
  for (let h of a) {
    let p = Du({
      originalURL: c,
      prefix: h.prefix,
      target: h.target,
      prefixHost: window.location.host
    });
    if (p)
      return p
  }
  return c
}
function ku(c, a) {
  let h = window.fetch;
  window.fetch = function(M, F) {
    let Z = ki({
      url: Di(M.toString()),
      mappings: a
    });
    return h(Z.toString(), F)
  }
  ;
  let p = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(M, F, Z, q, k) {
    let O = ki({
      url: Di(F),
      mappings: a
    });
    p.apply(this, [M, O.toString(), Z, q, k])
  }
  ;
  class d extends WebSocket {
    constructor(F, Z) {
      let q = F instanceof URL ? F.toString() : F
        , k = ki({
        url: Di(q, "wss:"),
        mappings: a
      });
      super(k.toString(), Z)
    }
  }
  window.WebSocket = d
}
function Bu() {
  return {
    disableConsoleLogOverride: !1
  }
}
var Uu = ["log", "warn", "debug", "info", "error"];
function zu(c, a, h) {
  let p = c[a]
    , d = c;
  p && (c[a] = function() {
      let M = [].slice.call(arguments)
        , F = "" + M.join(" ");
      h(a, F),
        p.apply(d, M)
    }
  )
}
var Xt;
(function(c) {
    c[c.HANDSHAKE = 0] = "HANDSHAKE",
      c[c.FRAME = 1] = "FRAME",
      c[c.CLOSE = 2] = "CLOSE",
      c[c.HELLO = 3] = "HELLO"
  }
)(Xt || (Xt = {}));
var Vu = new Set([window.location.origin, "https://discord.com", "https://discordapp.com", "https://ptb.discord.com", "https://ptb.discordapp.com", "https://canary.discord.com", "https://canary.discordapp.com", "https://staging.discord.co", "http://localhost:3333", "https://pax.discord.com", "null"]);
function Fu() {
  var c;
  return [(c = window.parent.opener) !== null && c !== void 0 ? c : window.parent, document.referrer ? document.referrer : "*"]
}
var di = class {
    constructor(a, h) {
      this.eventBus = new Ea,
        this.source = null,
        this.sourceOrigin = "",
        this.pendingCommands = new Map,
        this.layoutModeUpdateListenerMap = new Map,
        this.sendCommand = Z=>{
          var q;
          if (this.source == null)
            throw new Error("Attempting to send message before initialization");
          let k = Tr();
          return (q = this.source) === null || q === void 0 || q.postMessage([Xt.FRAME, Object.assign(Object.assign({}, Z), {
            nonce: k
          })], this.sourceOrigin, this.getTransfer(Z)),
            new Promise((B,C)=>{
                this.pendingCommands.set(k, {
                  resolve: B,
                  reject: C
                })
              }
            )
        }
        ,
        this.commands = Pu(this.sendCommand),
        this.initializeNetworkShims = ku,
        this.handleMessage = Z=>{
          if (!Vu.has(Z.origin))
            return;
          let q = Z.data;
          if (!Array.isArray(q))
            return;
          let[k,O] = q;
          switch (k) {
            case Xt.HELLO:
              return;
            case Xt.CLOSE:
              return this.handleClose(O);
            case Xt.HANDSHAKE:
              return this.handleHandshake();
            case Xt.FRAME:
              return this.handleFrame(O);
            default:
              throw new Error("Invalid message format")
          }
        }
        ,
        this.isReady = !1,
        this.clientId = a,
        this.configuration = h ?? Bu(),
        window.addEventListener("message", this.handleMessage);
      let p = new URLSearchParams(window.location.search)
        , d = p.get("frame_id");
      if (!d)
        throw new Error("frame_id query param is not defined");
      this.frameId = d;
      let M = p.get("instance_id");
      if (!M)
        throw new Error("instance_id query param is not defined");
      this.instanceId = M;
      let F = p.get("platform");
      if (F) {
        if (F !== gn.DESKTOP && F !== gn.MOBILE)
          throw new Error(`Invalid query param "platform" of "${F}". Valid values are "${gn.DESKTOP}" or "${gn.MOBILE}"`)
      } else
        throw new Error("platform query param is not defined");
      this.platform = F,
        this.guildId = p.get("guild_id"),
        this.channelId = p.get("channel_id"),
        [this.source,this.sourceOrigin] = Fu(),
        this.addOnReadyListener(),
        this.handshake()
    }
    getTransfer(a) {
      var h;
      switch (a.cmd) {
        case ge.SUBSCRIBE:
        case ge.UNSUBSCRIBE:
          return;
        default:
          return (h = a.transfer) !== null && h !== void 0 ? h : void 0
      }
    }
    close(a, h) {
      var p;
      window.removeEventListener("message", this.handleMessage);
      let d = Tr();
      (p = this.source) === null || p === void 0 || p.postMessage([Xt.CLOSE, {
        code: a,
        message: h,
        nonce: d
      }], this.sourceOrigin)
    }
    subscribe(a, h, p) {
      return _n(this, void 0, void 0, function*() {
        let d = this.eventBus.listenerCount(a)
          , M = this.eventBus.on(a, h);
        return Object.values(_e).includes(a) && a !== _e.READY && d === 0 && (yield this.sendCommand({
          cmd: ge.SUBSCRIBE,
          args: p,
          evt: a
        })),
          M
      })
    }
    unsubscribe(a, h) {
      return _n(this, void 0, void 0, function*() {
        return Object.values(_e).includes(a) && a !== _e.READY && this.eventBus.listenerCount(a) === 1 && (yield this.sendCommand({
          cmd: ge.UNSUBSCRIBE,
          evt: a
        })),
          this.eventBus.off(a, h)
      })
    }
    ready() {
      return _n(this, void 0, void 0, function*() {
        this.isReady || (yield new Promise(a=>{
            this.eventBus.once(_e.READY, a)
          }
        ))
      })
    }
    subscribeToLayoutModeUpdatesCompat(a) {
      return _n(this, void 0, void 0, function*() {
        let h = M=>{
            let F = M.is_pip_mode ? qn.PIP : qn.FOCUSED;
            a({
              layout_mode: F
            })
          }
          , p = yield this.subscribe(_e.ACTIVITY_PIP_MODE_UPDATE, h)
          , d = M=>{
            this.unsubscribe(_e.ACTIVITY_PIP_MODE_UPDATE, h),
              a(M)
          }
        ;
        this.layoutModeUpdateListenerMap.set(a, {
          layoutModeListener: d,
          pipModeListener: h
        });
        try {
          return yield this.subscribe(_e.ACTIVITY_LAYOUT_MODE_UPDATE, d)
        } catch (M) {
          if (M.code === jn.INVALID_EVENT)
            return p;
          throw M
        }
      })
    }
    unsubscribeFromLayoutModeUpdatesCompat(a) {
      return _n(this, void 0, void 0, function*() {
        let h = this.layoutModeUpdateListenerMap.get(a);
        if (this.layoutModeUpdateListenerMap.delete(a),
        h != null) {
          let {layoutModeListener: p, pipModeListener: d} = h
            , M = null
            , F = null;
          if (p != null)
            try {
              M = yield this.unsubscribe(_e.ACTIVITY_LAYOUT_MODE_UPDATE, p)
            } catch (Z) {
              if (Z.code !== jn.INVALID_EVENT)
                throw Z
            }
          return d != null && (F = yield this.unsubscribe(_e.ACTIVITY_PIP_MODE_UPDATE, d)),
          M ?? F
        }
      })
    }
    handshake() {
      var a;
      (a = this.source) === null || a === void 0 || a.postMessage([Xt.HANDSHAKE, {
        v: 1,
        encoding: "json",
        client_id: this.clientId,
        frame_id: this.frameId
      }], this.sourceOrigin)
    }
    addOnReadyListener() {
      this.eventBus.once(_e.READY, ()=>{
          this.overrideConsoleLogging(),
            this.isReady = !0
        }
      )
    }
    overrideConsoleLogging() {
      if (this.configuration.disableConsoleLogOverride)
        return;
      let a = (h,p)=>{
          this.commands.captureLog({
            level: h,
            message: p
          })
        }
      ;
      Uu.forEach(h=>{
          zu(console, h, a)
        }
      )
    }
    handleClose(a) {
      nu.parse(a)
    }
    handleHandshake() {}
    handleFrame(a) {
      var h, p;
      let d;
      try {
        d = ru(a)
      } catch (M) {
        console.error("Failed to parse", a),
          console.error(M);
        return
      }
      if (d.cmd === "DISPATCH")
        this.eventBus.emit(d.evt, d.data);
      else {
        if (d.evt === nr) {
          if (d.nonce != null) {
            (h = this.pendingCommands.get(d.nonce)) === null || h === void 0 || h.reject(d.data),
              this.pendingCommands.delete(d.nonce);
            return
          }
          this.eventBus.emit("error", new Zi(d.data.code,d.data.message))
        }
        if (d.nonce == null) {
          console.error("Missing nonce", a);
          return
        }
        (p = this.pendingCommands.get(d.nonce)) === null || p === void 0 || p.resolve(d),
          this.pendingCommands.delete(d.nonce)
      }
    }
  }
;
var Hi = {
  exports: {}
};
(function(c, a) {
    var h = 200
      , p = "Expected a function"
      , d = "__lodash_hash_undefined__"
      , M = 1
      , F = 2
      , Z = 1 / 0
      , q = 9007199254740991
      , k = "[object Arguments]"
      , O = "[object Array]"
      , B = "[object Boolean]"
      , C = "[object Date]"
      , Q = "[object Error]"
      , J = "[object Function]"
      , ne = "[object GeneratorFunction]"
      , Y = "[object Map]"
      , Me = "[object Number]"
      , le = "[object Object]"
      , Se = "[object Promise]"
      , ye = "[object RegExp]"
      , oe = "[object Set]"
      , We = "[object String]"
      , ct = "[object Symbol]"
      , je = "[object WeakMap]"
      , Pt = "[object ArrayBuffer]"
      , ft = "[object DataView]"
      , dt = "[object Float32Array]"
      , qe = "[object Float64Array]"
      , pe = "[object Int8Array]"
      , Vt = "[object Int16Array]"
      , re = "[object Int32Array]"
      , Ot = "[object Uint8Array]"
      , Ft = "[object Uint8ClampedArray]"
      , ke = "[object Uint16Array]"
      , ot = "[object Uint32Array]"
      , kt = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
      , yn = /^\w*$/
      , Gt = /^\./
      , Mt = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
      , Xe = /[\\^$.*+?()[\]{}|]/g
      , xt = /\\(\\)?/g
      , en = /^\[object .+?Constructor\]$/
      , Kt = /^(?:0|[1-9]\d*)$/
      , Ce = {};
    Ce[dt] = Ce[qe] = Ce[pe] = Ce[Vt] = Ce[re] = Ce[Ot] = Ce[Ft] = Ce[ke] = Ce[ot] = !0,
      Ce[k] = Ce[O] = Ce[Pt] = Ce[B] = Ce[ft] = Ce[C] = Ce[Q] = Ce[J] = Ce[Y] = Ce[Me] = Ce[le] = Ce[ye] = Ce[oe] = Ce[We] = Ce[je] = !1;
    var tt = typeof ri == "object" && ri && ri.Object === Object && ri
      , Ke = typeof self == "object" && self && self.Object === Object && self
      , Rt = tt || Ke || Function("return this")()
      , Zt = a && !a.nodeType && a
      , tn = Zt && !0 && c && !c.nodeType && c
      , cn = tn && tn.exports === Zt
      , wn = cn && tt.process
      , bn = function() {
      try {
        return wn && wn.binding("util")
      } catch {}
    }()
      , kn = bn && bn.isTypedArray;
    function Sn(P, U) {
      for (var X = -1, ie = P ? P.length : 0; ++X < ie && U(P[X], X, P) !== !1; )
        ;
      return P
    }
    function Bn(P, U) {
      for (var X = -1, ie = P ? P.length : 0; ++X < ie; )
        if (U(P[X], X, P))
          return !0;
      return !1
    }
    function Je(P) {
      return function(U) {
        return U?.[P]
      }
    }
    function nn(P, U) {
      for (var X = -1, ie = Array(P); ++X < P; )
        ie[X] = U(X);
      return ie
    }
    function Qe(P) {
      return function(U) {
        return P(U)
      }
    }
    function En(P, U) {
      return P?.[U]
    }
    function ae(P) {
      var U = !1;
      if (P != null && typeof P.toString != "function")
        try {
          U = !!(P + "")
        } catch {}
      return U
    }
    function e(P) {
      var U = -1
        , X = Array(P.size);
      return P.forEach(function(ie, Ne) {
        X[++U] = [Ne, ie]
      }),
        X
    }
    function t(P, U) {
      return function(X) {
        return P(U(X))
      }
    }
    function n(P) {
      var U = -1
        , X = Array(P.size);
      return P.forEach(function(ie) {
        X[++U] = ie
      }),
        X
    }
    var i = Array.prototype
      , r = Function.prototype
      , s = Object.prototype
      , u = Rt["__core-js_shared__"]
      , o = function() {
      var P = /[^.]+$/.exec(u && u.keys && u.keys.IE_PROTO || "");
      return P ? "Symbol(src)_1." + P : ""
    }()
      , l = r.toString
      , f = s.hasOwnProperty
      , g = s.toString
      , y = RegExp("^" + l.call(f).replace(Xe, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$")
      , _ = Rt.Symbol
      , v = Rt.Uint8Array
      , b = t(Object.getPrototypeOf, Object)
      , T = Object.create
      , x = s.propertyIsEnumerable
      , S = i.splice
      , I = t(Object.keys, Object)
      , m = In(Rt, "DataView")
      , w = In(Rt, "Map")
      , E = In(Rt, "Promise")
      , A = In(Rt, "Set")
      , N = In(Rt, "WeakMap")
      , L = In(Object, "create")
      , R = dn(m)
      , D = dn(w)
      , V = dn(E)
      , z = dn(A)
      , G = dn(N)
      , H = _ ? _.prototype : void 0
      , K = H ? H.valueOf : void 0
      , $ = H ? H.toString : void 0;
    function W(P) {
      var U = -1
        , X = P ? P.length : 0;
      for (this.clear(); ++U < X; ) {
        var ie = P[U];
        this.set(ie[0], ie[1])
      }
    }
    function te() {
      this.__data__ = L ? L(null) : {}
    }
    function se(P) {
      return this.has(P) && delete this.__data__[P]
    }
    function ue(P) {
      var U = this.__data__;
      if (L) {
        var X = U[P];
        return X === d ? void 0 : X
      }
      return f.call(U, P) ? U[P] : void 0
    }
    function Ie(P) {
      var U = this.__data__;
      return L ? U[P] !== void 0 : f.call(U, P)
    }
    function Ee(P, U) {
      var X = this.__data__;
      return X[P] = L && U === void 0 ? d : U,
        this
    }
    W.prototype.clear = te,
      W.prototype.delete = se,
      W.prototype.get = ue,
      W.prototype.has = Ie,
      W.prototype.set = Ee;
    function de(P) {
      var U = -1
        , X = P ? P.length : 0;
      for (this.clear(); ++U < X; ) {
        var ie = P[U];
        this.set(ie[0], ie[1])
      }
    }
    function ve() {
      this.__data__ = []
    }
    function Oe(P) {
      var U = this.__data__
        , X = Ct(U, P);
      if (X < 0)
        return !1;
      var ie = U.length - 1;
      return X == ie ? U.pop() : S.call(U, X, 1),
        !0
    }
    function Te(P) {
      var U = this.__data__
        , X = Ct(U, P);
      return X < 0 ? void 0 : U[X][1]
    }
    function Ge(P) {
      return Ct(this.__data__, P) > -1
    }
    function Re(P, U) {
      var X = this.__data__
        , ie = Ct(X, P);
      return ie < 0 ? X.push([P, U]) : X[ie][1] = U,
        this
    }
    de.prototype.clear = ve,
      de.prototype.delete = Oe,
      de.prototype.get = Te,
      de.prototype.has = Ge,
      de.prototype.set = Re;
    function xe(P) {
      var U = -1
        , X = P ? P.length : 0;
      for (this.clear(); ++U < X; ) {
        var ie = P[U];
        this.set(ie[0], ie[1])
      }
    }
    function ze() {
      this.__data__ = {
        hash: new W,
        map: new (w || de),
        string: new W
      }
    }
    function De(P) {
      return Jn(this, P).delete(P)
    }
    function _t(P) {
      return Jn(this, P).get(P)
    }
    function gt(P) {
      return Jn(this, P).has(P)
    }
    function Et(P, U) {
      return Jn(this, P).set(P, U),
        this
    }
    xe.prototype.clear = ze,
      xe.prototype.delete = De,
      xe.prototype.get = _t,
      xe.prototype.has = gt,
      xe.prototype.set = Et;
    function nt(P) {
      var U = -1
        , X = P ? P.length : 0;
      for (this.__data__ = new xe; ++U < X; )
        this.add(P[U])
    }
    function Ye(P) {
      return this.__data__.set(P, d),
        this
    }
    function ut(P) {
      return this.__data__.has(P)
    }
    nt.prototype.add = nt.prototype.push = Ye,
      nt.prototype.has = ut;
    function st(P) {
      this.__data__ = new de(P)
    }
    function vt() {
      this.__data__ = new de
    }
    function Ht(P) {
      return this.__data__.delete(P)
    }
    function fn(P) {
      return this.__data__.get(P)
    }
    function jt(P) {
      return this.__data__.has(P)
    }
    function Yt(P, U) {
      var X = this.__data__;
      if (X instanceof de) {
        var ie = X.__data__;
        if (!w || ie.length < h - 1)
          return ie.push([P, U]),
            this;
        X = this.__data__ = new xe(ie)
      }
      return X.set(P, U),
        this
    }
    st.prototype.clear = vt,
      st.prototype.delete = Ht,
      st.prototype.get = fn,
      st.prototype.has = jt,
      st.prototype.set = Yt;
    function Dt(P, U) {
      var X = Wt(P) || gr(P) ? nn(P.length, String) : []
        , ie = X.length
        , Ne = !!ie;
      for (var me in P)
        (U || f.call(P, me)) && !(Ne && (me == "length" || fr(me, ie))) && X.push(me);
      return X
    }
    function Ct(P, U) {
      for (var X = P.length; X--; )
        if (_r(P[X][0], U))
          return X;
      return -1
    }
    function Tn(P) {
      return Cn(P) ? T(P) : {}
    }
    var $t = aa();
    function Oi(P, U) {
      return P && $t(P, U, ti)
    }
    function lr(P, U) {
      U = Xn(U, P) ? [U] : hr(U);
      for (var X = 0, ie = U.length; P != null && X < ie; )
        P = P[Qn(U[X++])];
      return X && X == ie ? P : void 0
    }
    function Ys(P) {
      return g.call(P)
    }
    function $s(P, U) {
      return P != null && U in Object(P)
    }
    function xi(P, U, X, ie, Ne) {
      return P === U ? !0 : P == null || U == null || !Cn(P) && !ei(U) ? P !== P && U !== U : Ws(P, U, xi, X, ie, Ne)
    }
    function Ws(P, U, X, ie, Ne, me) {
      var Ze = Wt(P)
        , $e = Wt(U)
        , it = O
        , mt = O;
      Ze || (it = rn(P),
        it = it == k ? le : it),
      $e || (mt = rn(U),
        mt = mt == k ? le : mt);
      var At = it == le && !ae(P)
        , Nt = mt == le && !ae(U)
        , yt = it == mt;
      if (yt && !At)
        return me || (me = new st),
          Ze || mr(P) ? cr(P, U, X, ie, Ne, me) : oa(P, U, it, X, ie, Ne, me);
      if (!(Ne & F)) {
        var Bt = At && f.call(P, "__wrapped__")
          , Ut = Nt && f.call(U, "__wrapped__");
        if (Bt || Ut) {
          var sn = Bt ? P.value() : P
            , Jt = Ut ? U.value() : U;
          return me || (me = new st),
            X(sn, Jt, ie, Ne, me)
        }
      }
      return yt ? (me || (me = new st),
        ua(P, U, X, ie, Ne, me)) : !1
    }
    function Js(P, U, X, ie) {
      var Ne = X.length
        , me = Ne
        , Ze = !ie;
      if (P == null)
        return !me;
      for (P = Object(P); Ne--; ) {
        var $e = X[Ne];
        if (Ze && $e[2] ? $e[1] !== P[$e[0]] : !($e[0]in P))
          return !1
      }
      for (; ++Ne < me; ) {
        $e = X[Ne];
        var it = $e[0]
          , mt = P[it]
          , At = $e[1];
        if (Ze && $e[2]) {
          if (mt === void 0 && !(it in P))
            return !1
        } else {
          var Nt = new st;
          if (ie)
            var yt = ie(mt, At, it, P, U, Nt);
          if (!(yt === void 0 ? xi(At, mt, ie, M | F, Nt) : yt))
            return !1
        }
      }
      return !0
    }
    function Xs(P) {
      if (!Cn(P) || fa(P))
        return !1;
      var U = Li(P) || ae(P) ? y : en;
      return U.test(dn(P))
    }
    function Qs(P) {
      return ei(P) && Mi(P.length) && !!Ce[g.call(P)]
    }
    function ea(P) {
      return typeof P == "function" ? P : P == null ? wa : typeof P == "object" ? Wt(P) ? ia(P[0], P[1]) : na(P) : ba(P)
    }
    function ta(P) {
      if (!da(P))
        return I(P);
      var U = [];
      for (var X in Object(P))
        f.call(P, X) && X != "constructor" && U.push(X);
      return U
    }
    function na(P) {
      var U = la(P);
      return U.length == 1 && U[0][2] ? pr(U[0][0], U[0][1]) : function(X) {
        return X === P || Js(X, P, U)
      }
    }
    function ia(P, U) {
      return Xn(P) && dr(U) ? pr(Qn(P), U) : function(X) {
        var ie = va(X, P);
        return ie === void 0 && ie === U ? ma(X, P) : xi(U, ie, void 0, M | F)
      }
    }
    function ra(P) {
      return function(U) {
        return lr(U, P)
      }
    }
    function sa(P) {
      if (typeof P == "string")
        return P;
      if (Ri(P))
        return $ ? $.call(P) : "";
      var U = P + "";
      return U == "0" && 1 / P == -Z ? "-0" : U
    }
    function hr(P) {
      return Wt(P) ? P : pa(P)
    }
    function aa(P) {
      return function(U, X, ie) {
        for (var Ne = -1, me = Object(U), Ze = ie(U), $e = Ze.length; $e--; ) {
          var it = Ze[P ? $e : ++Ne];
          if (X(me[it], it, me) === !1)
            break
        }
        return U
      }
    }
    function cr(P, U, X, ie, Ne, me) {
      var Ze = Ne & F
        , $e = P.length
        , it = U.length;
      if ($e != it && !(Ze && it > $e))
        return !1;
      var mt = me.get(P);
      if (mt && me.get(U))
        return mt == U;
      var At = -1
        , Nt = !0
        , yt = Ne & M ? new nt : void 0;
      for (me.set(P, U),
             me.set(U, P); ++At < $e; ) {
        var Bt = P[At]
          , Ut = U[At];
        if (ie)
          var sn = Ze ? ie(Ut, Bt, At, U, P, me) : ie(Bt, Ut, At, P, U, me);
        if (sn !== void 0) {
          if (sn)
            continue;
          Nt = !1;
          break
        }
        if (yt) {
          if (!Bn(U, function(Jt, pn) {
            if (!yt.has(pn) && (Bt === Jt || X(Bt, Jt, ie, Ne, me)))
              return yt.add(pn)
          })) {
            Nt = !1;
            break
          }
        } else if (!(Bt === Ut || X(Bt, Ut, ie, Ne, me))) {
          Nt = !1;
          break
        }
      }
      return me.delete(P),
        me.delete(U),
        Nt
    }
    function oa(P, U, X, ie, Ne, me, Ze) {
      switch (X) {
        case ft:
          if (P.byteLength != U.byteLength || P.byteOffset != U.byteOffset)
            return !1;
          P = P.buffer,
            U = U.buffer;
        case Pt:
          return !(P.byteLength != U.byteLength || !ie(new v(P), new v(U)));
        case B:
        case C:
        case Me:
          return _r(+P, +U);
        case Q:
          return P.name == U.name && P.message == U.message;
        case ye:
        case We:
          return P == U + "";
        case Y:
          var $e = e;
        case oe:
          var it = me & F;
          if ($e || ($e = n),
          P.size != U.size && !it)
            return !1;
          var mt = Ze.get(P);
          if (mt)
            return mt == U;
          me |= M,
            Ze.set(P, U);
          var At = cr($e(P), $e(U), ie, Ne, me, Ze);
          return Ze.delete(P),
            At;
        case ct:
          if (K)
            return K.call(P) == K.call(U)
      }
      return !1
    }
    function ua(P, U, X, ie, Ne, me) {
      var Ze = Ne & F
        , $e = ti(P)
        , it = $e.length
        , mt = ti(U)
        , At = mt.length;
      if (it != At && !Ze)
        return !1;
      for (var Nt = it; Nt--; ) {
        var yt = $e[Nt];
        if (!(Ze ? yt in U : f.call(U, yt)))
          return !1
      }
      var Bt = me.get(P);
      if (Bt && me.get(U))
        return Bt == U;
      var Ut = !0;
      me.set(P, U),
        me.set(U, P);
      for (var sn = Ze; ++Nt < it; ) {
        yt = $e[Nt];
        var Jt = P[yt]
          , pn = U[yt];
        if (ie)
          var yr = Ze ? ie(pn, Jt, yt, U, P, me) : ie(Jt, pn, yt, P, U, me);
        if (!(yr === void 0 ? Jt === pn || X(Jt, pn, ie, Ne, me) : yr)) {
          Ut = !1;
          break
        }
        sn || (sn = yt == "constructor")
      }
      if (Ut && !sn) {
        var ni = P.constructor
          , ii = U.constructor;
        ni != ii && "constructor"in P && "constructor"in U && !(typeof ni == "function" && ni instanceof ni && typeof ii == "function" && ii instanceof ii) && (Ut = !1)
      }
      return me.delete(P),
        me.delete(U),
        Ut
    }
    function Jn(P, U) {
      var X = P.__data__;
      return ca(U) ? X[typeof U == "string" ? "string" : "hash"] : X.map
    }
    function la(P) {
      for (var U = ti(P), X = U.length; X--; ) {
        var ie = U[X]
          , Ne = P[ie];
        U[X] = [ie, Ne, dr(Ne)]
      }
      return U
    }
    function In(P, U) {
      var X = En(P, U);
      return Xs(X) ? X : void 0
    }
    var rn = Ys;
    (m && rn(new m(new ArrayBuffer(1))) != ft || w && rn(new w) != Y || E && rn(E.resolve()) != Se || A && rn(new A) != oe || N && rn(new N) != je) && (rn = function(P) {
        var U = g.call(P)
          , X = U == le ? P.constructor : void 0
          , ie = X ? dn(X) : void 0;
        if (ie)
          switch (ie) {
            case R:
              return ft;
            case D:
              return Y;
            case V:
              return Se;
            case z:
              return oe;
            case G:
              return je
          }
        return U
      }
    );
    function ha(P, U, X) {
      U = Xn(U, P) ? [U] : hr(U);
      for (var ie, Ne = -1, Ze = U.length; ++Ne < Ze; ) {
        var me = Qn(U[Ne]);
        if (!(ie = P != null && X(P, me)))
          break;
        P = P[me]
      }
      if (ie)
        return ie;
      var Ze = P ? P.length : 0;
      return !!Ze && Mi(Ze) && fr(me, Ze) && (Wt(P) || gr(P))
    }
    function fr(P, U) {
      return U = U ?? q,
      !!U && (typeof P == "number" || Kt.test(P)) && P > -1 && P % 1 == 0 && P < U
    }
    function Xn(P, U) {
      if (Wt(P))
        return !1;
      var X = typeof P;
      return X == "number" || X == "symbol" || X == "boolean" || P == null || Ri(P) ? !0 : yn.test(P) || !kt.test(P) || U != null && P in Object(U)
    }
    function ca(P) {
      var U = typeof P;
      return U == "string" || U == "number" || U == "symbol" || U == "boolean" ? P !== "__proto__" : P === null
    }
    function fa(P) {
      return !!o && o in P
    }
    function da(P) {
      var U = P && P.constructor
        , X = typeof U == "function" && U.prototype || s;
      return P === X
    }
    function dr(P) {
      return P === P && !Cn(P)
    }
    function pr(P, U) {
      return function(X) {
        return X == null ? !1 : X[P] === U && (U !== void 0 || P in Object(X))
      }
    }
    var pa = Ni(function(P) {
      P = ga(P);
      var U = [];
      return Gt.test(P) && U.push(""),
        P.replace(Mt, function(X, ie, Ne, me) {
          U.push(Ne ? me.replace(xt, "$1") : ie || X)
        }),
        U
    });
    function Qn(P) {
      if (typeof P == "string" || Ri(P))
        return P;
      var U = P + "";
      return U == "0" && 1 / P == -Z ? "-0" : U
    }
    function dn(P) {
      if (P != null) {
        try {
          return l.call(P)
        } catch {}
        try {
          return P + ""
        } catch {}
      }
      return ""
    }
    function Ni(P, U) {
      if (typeof P != "function" || U && typeof U != "function")
        throw new TypeError(p);
      var X = function() {
        var ie = arguments
          , Ne = U ? U.apply(this, ie) : ie[0]
          , me = X.cache;
        if (me.has(Ne))
          return me.get(Ne);
        var Ze = P.apply(this, ie);
        return X.cache = me.set(Ne, Ze),
          Ze
      };
      return X.cache = new (Ni.Cache || xe),
        X
    }
    Ni.Cache = xe;
    function _r(P, U) {
      return P === U || P !== P && U !== U
    }
    function gr(P) {
      return _a(P) && f.call(P, "callee") && (!x.call(P, "callee") || g.call(P) == k)
    }
    var Wt = Array.isArray;
    function vr(P) {
      return P != null && Mi(P.length) && !Li(P)
    }
    function _a(P) {
      return ei(P) && vr(P)
    }
    function Li(P) {
      var U = Cn(P) ? g.call(P) : "";
      return U == J || U == ne
    }
    function Mi(P) {
      return typeof P == "number" && P > -1 && P % 1 == 0 && P <= q
    }
    function Cn(P) {
      var U = typeof P;
      return !!P && (U == "object" || U == "function")
    }
    function ei(P) {
      return !!P && typeof P == "object"
    }
    function Ri(P) {
      return typeof P == "symbol" || ei(P) && g.call(P) == ct
    }
    var mr = kn ? Qe(kn) : Qs;
    function ga(P) {
      return P == null ? "" : sa(P)
    }
    function va(P, U, X) {
      var ie = P == null ? void 0 : lr(P, U);
      return ie === void 0 ? X : ie
    }
    function ma(P, U) {
      return P != null && ha(P, U, $s)
    }
    function ti(P) {
      return vr(P) ? Dt(P) : ta(P)
    }
    function ya(P, U, X) {
      var ie = Wt(P) || mr(P);
      if (U = ea(U),
      X == null)
        if (ie || Cn(P)) {
          var Ne = P.constructor;
          ie ? X = Wt(P) ? new Ne : [] : X = Li(Ne) ? Tn(b(P)) : {}
        } else
          X = {};
      return (ie ? Sn : Oi)(P, function(me, Ze, $e) {
        return U(X, me, Ze, $e)
      }),
        X
    }
    function wa(P) {
      return P
    }
    function ba(P) {
      return Xn(P) ? Je(Qn(P)) : ra(P)
    }
    c.exports = ya
  }
)(Hi, Hi.exports);
var Ku = Hi.exports;
var {Commands: Yu} = vo;
var Gu = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="spinner" aria-label="loading">
    <path
      d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
      opacity=".25"
    />
    <path d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
  </svg>
`
  , Ti = c=>{
    try {
      if (c.dataset?.state === "loading")
        return;
      c.disabled = !0,
        c.dataset.state = "loading",
        c.innerHTML = `
      <div class="spinner-container">
        ${Gu}
      </div>
      <div class="loading-container">
        ${c.innerHTML}
      </div>
    `
    } catch {
      console.error("failed to start loading", c)
    }
  }
  , Ii = c=>{
    try {
      if (c.dataset?.state !== "loading")
        return;
      delete c.dataset.state,
        c.disabled = !1;
      let a = null;
      for (let h = 0; h < c.childElementCount; h++) {
        let p = c.children[h];
        if (p.classList?.contains("loading-container")) {
          a = p;
          break
        }
      }
      c.innerHTML = a.innerHTML
    } catch (a) {
      console.error("failed to stop loading", c, a)
    }
  }
;
var Yn = class extends EventTarget {
    constructor(a) {
      super(),
        this.tool = new ce.Tool,
        this.lastTolerance = 5,
        this.selectedSegments = [],
        this.editor = a,
        this.tool.onKeyDown = h=>{
          this.onKeyDown(h)
        }
        ,
        this.tool.onMouseDown = h=>{
          this.onMouseDown(h)
        }
        ,
        this.tool.onMouseDrag = h=>{
          this.onMouseDrag(h)
        }
        ,
        this.tool.onMouseMove = h=>{
          this.onMouseMove(h)
        }
        ,
        this.tool.onMouseUp = h=>{
          this.onMouseUp(h)
        }
    }
    hitTestActiveLayer(a) {
      return ce.project.hitTest(a, {
        segments: !0,
        stroke: !0,
        fill: !0,
        tolerance: this.lastTolerance,
        match: h=>h.item.layer == ce.project.activeLayer && !h.item.name.includes("Background") && !h.item.name.includes("Checkerboard")
      })
    }
    onMouseDown(a) {
      a.event.pointerId && this.editor.canvas.setPointerCapture(a.event.pointerId || 1),
        this.clampToBounds(a),
        this.button = !a.event.button || a.event.button <= 0 ? this.editor.selectedTool : a.event.button,
        this.minDistance = this.button == 2 ? this.lastTolerance * 2 : 0,
        this.currentSegment = this.currentPath = null;
      let h = this.hitTestActiveLayer(a.point);
      if (!this.button || this.button <= 0)
        this.currentPath = new ce.Path.Rectangle({
          from: a.point,
          to: a.point
        }),
          this.currentPath.strokeColor = new ce.Color("#eeeeee"),
          this.currentPath.strokeColor.alpha = 1,
          this.currentPath.strokeCap = "round",
          this.currentPath.isRectangle = !0,
          this.currentPath.strokeWidth = 4,
          this.currentPath.strokeColor = new ce.Color("rgba(255,255,255,1)"),
          this.currentPath.dashArray = [10, 10],
          this.currentPath.add(a.point),
          this.editor.drawingLayer.addChild(this.currentPath);
      else if (this.button == .5)
        this.currentPath = new ce.Path({
          segments: [a.point]
        }),
          this.currentPath.strokeWidth = 4,
          this.currentPath.strokeColor = new ce.Color("rgba(255,255,255,1)"),
          this.currentPath.dashArray = [10, 10],
          this.currentPath.add(a.point),
          this.currentPath.strokeCap = "round",
          this.currentPath.isStroke = !0,
          this.currentPath.closed = !0,
          this.currentPath.fillColor = new ce.Color(1,1,1),
          this.editor.drawingLayer.addChild(this.currentPath);
      else if (this.button == 1) {
        if (!h)
          this.selectionRectPath = new ce.Path.Rectangle({
            from: a.point,
            to: a.point
          });
        else if (this.selectedSegments.length > 0)
          this.markForSave = !0;
        else if (this.currentPath = h.item,
        this.currentPath && (this.saveItemStateForUndo(h.item),
        h.type == "stroke" || h.type == "fill"))
          if (this.editor.movePath)
            this.currentSegment = null;
          else {
            let p = h.location;
            this.currentSegment = this.currentPath.insert(p.index + 1, a.point),
              this.currentPath.smooth()
          }
      } else if (h && this.button == 2) {
        if (this.selectedSegments.length > 0)
          for (let p = ce.project.selectedItems.length - 1; p >= 0; p--) {
            let d = ce.project.selectedItems[p];
            d.selected = !1,
              this.saveItemStateForUndo(d),
              d.remove()
          }
        else
          h.type == "stroke" || h.type == "fill" || h.segment.path.segments.length <= 2 ? (this.saveItemStateForUndo(h.item),
            h.item.remove()) : h.type == "segment" && (this.saveItemStateForUndo(h.item),
            h.segment.remove());
        return
      }
    }
    onMouseMove(a) {
      if (this.clampToBounds(a),
      this.selectedSegments.length == 0) {
        ce.project.activeLayer.selected = !1;
        let h = this.hitTestActiveLayer(a.point);
        h && (h.item.selected = !0,
        h.item.strokeWidth && (this.lastTolerance = Math.max(h.item.strokeWidth / 4, 5)))
      }
    }
    onMouseDrag(a) {
      if (this.clampToBounds(a),
      !this.button || this.button <= 0) {
        if (ce.project.activeLayer.selected = !1,
        this.currentPath && this.currentPath.isRectangle) {
          let h = new ce.Path.Rectangle(a.downPoint,a.point);
          h.fillColor = "white",
            this.currentPath.replaceWith(h),
            this.currentPath.remove(),
            this.currentPath = h,
            this.currentPath.bounds.selected = !0,
            this.currentPath.isRectangle = !0
        }
      } else if (this.button == .5)
        ce.project.activeLayer.selected = !1,
          this.currentPath.add(a.point);
      else if (this.button == 1)
        if (this.selectionRectPath) {
          let h = new ce.Path.Rectangle(a.downPoint,a.point);
          this.selectionRectPath.replaceWith(h),
            this.selectionRectPath.remove(),
            this.selectionRectPath = h,
            this.selectionRectPath.bounds.selected = !0,
            this.selectedSegments = [];
          for (let d = 0; d < ce.project.selectedItems.length; d++)
            ce.project.selectedItems[d].selected = !1;
          let p = this.editor.drawingLayer.getItems({
            overlapping: h.bounds
          });
          for (let d = 0; d < p.length; d++)
            if (p[d].segments)
              for (let M = 0; M < p[d].segments.length; M++)
                this.selectionRectPath.bounds.contains(p[d].segments[M].point) && (p[d].segments[M].selected = !0,
                  this.selectedSegments.push(p[d].segments[M]))
        } else if (this.selectedSegments.length > 0) {
          if (this.markForSave) {
            for (let h = ce.project.selectedItems.length - 1; h >= 0; h--)
              this.saveItemStateForUndo(ce.project.selectedItems[h]);
            this.markForSave = !1
          }
          for (let h = 0; h < this.selectedSegments.length; h++)
            this.selectedSegments[h].point = this.selectedSegments[h].point.add(a.delta)
        } else
          this.currentSegment ? this.currentSegment.point = this.currentSegment.point.add(a.delta) : this.currentPath && (this.currentPath.position = this.currentPath.position.add(a.delta));
      else if (this.button == 2) {
        let h = this.hitTestActiveLayer(a.point);
        if (!h)
          return;
        h.type == "stroke" || h.type == "fill" || h.segment.path.segments.length <= 2 ? (this.saveItemStateForUndo(h.item),
          h.item.remove()) : h.type == "segment" && (this.saveItemStateForUndo(h.item),
          h.segment.remove())
      }
    }
    onMouseUp(a) {
      a.event.pointerId && this.editor.canvas.releasePointerCapture(a.event.pointerId || 1),
        this.clampToBounds(a),
      this.selectionRectPath && (this.selectionRectPath.remove(),
        this.selectionRectPath = null),
      (!this.button || this.button <= .5) && (this.currentPath.isRectangle || (this.currentPath.segments.length > 1 ? this.currentPath.simplify(3) : this.currentPath.add(a.point),
        this.currentPath.strokeColor = new ce.Color("#ffffff")),
        this.clearSelection(),
        this.dispatchEvent(new Event("newStroke",{
          name: this.currentPath.name
        })),
        this.currentPath.bounds.selected = !1,
        this.currentPath.name = "Stroke-" + this.stringHashCode(this.currentPath.toString()),
        this.currentPath.strokeColor = null,
        this.editor.undoLayer.addChild(new ce.Group({
          name: this.editor.removeCmd + this.currentPath.name
        })),
        this.editor.redoLayer.removeChildren())
    }
    async onKeyDown(a) {
      if (a.key == "enter") {
        if (a.preventDefault(),
          a.stopPropagation(),
        this.editor.submitButton.disabled || this.editor.submitButton.dataset?.state === "loading")
          return;
        Ti(this.editor.submitButton);
        try {
          await this.editor.submit().catch(h=>this.editor.displayError(h?.toString()))
        } finally {
          Ii(this.editor.submitButton)
        }
      } else
        (a.modifiers.control || a.modifiers.meta) && (a.key == "z" ? this.editor.undo() : a.key == "y" && this.editor.redo())
    }
    clearSelection() {
      for (let a = 0; a < this.selectedSegments.length; a++)
        this.selectedSegments[a].selected = !1;
      this.selectedSegments = [];
      for (let a = 0; a < ce.project.selectedItems.length; a++)
        ce.project.selectedItems[a].selected = !1
    }
    saveItemStateForUndo(a) {
      a.name || (a.name = "ForeignObject-" + this.stringHashCode(a.toString()));
      let h = a.clone();
      h.name = a.name,
        this.editor.undoLayer.addChild(h),
        this.editor.redoLayer.removeChildren()
    }
    stringHashCode(a) {
      let h = 0;
      if (a.length == 0)
        return h;
      for (let p = 0; p < a.length; p++) {
        let d = a.charCodeAt(p);
        h = (h << 5) - h + d,
          h = h & h
      }
      return h
    }
    clampToBounds(a) {
      let h = this.editor.backgroundImageElement.width
        , p = this.editor.backgroundImageElement.height;
      a.point = a.point.set(Math.min(h * .5, Math.max(-h * .5, a.point.x)), Math.min(p * .5, Math.max(-p * .5, a.point.y)))
    }
  }
;
var Ci = class {
    constructor(a) {
      this.omniTool = a,
        this.promptBarAvailable = !1
    }
    start() {
      this.omniTool.addEventListener("newStroke", ()=>{
          this.promptBarAvailable ? (this.createPopover("When you're ready, edit the prompt to describe the new image"),
            document.getElementById("Prompt").addEventListener("input", ()=>{
                this.createPopover("按右下角箭头提交")
              }
              , {
                once: !0
              })) : this.createPopover("按右下角箭头提交")
        }
        , {
          once: !0
        }),
        this.createPopover("请拖动选择要更改的区域")
    }
    setPromptBarAvailable(a) {
      this.promptBarAvailable = a
    }
    createPopover(a) {
      let h = document.getElementById("popover-container");
      h.innerHTML = "";
      let p = document.createElement("div");
      p.className = "popover",
        p.innerText = a,
        h.appendChild(p)
    }
  }
;
var ar = document.getElementById("modal-container");
document.addEventListener("click", c=>{
    c.target.classList.contains("modal-backdrop") && Ai()
  }
);
var Ai = ()=>{
    ar.innerHTML = ""
  }
  , hn = c=>{
    let a = c.header !== void 0;
    ar.innerHTML = "";
    let h = document.createElement("div");
    h.classList.add("modal");
    let p = document.createElement("div");
    if (p.classList.add("modal-body"),
      p.innerHTML = `
    ${a ? `<div class="modal-header">
      ${c.header}
    </div>` : ""}
    <div class="modal-content">
      ${c.content}
    </div>
  `,
    c.footer !== void 0) {
      let F = document.createElement("div");
      F.classList.add("modal-footer"),
      c.footer && (typeof c.footer == "string" ? F.innerHTML = c.footer : F.appendChild(c.footer)),
        p.appendChild(F)
    }
    let M = document.createElement("div");
    M.classList.add("modal-backdrop"),
      h.appendChild(M),
      h.appendChild(p),
      ar.appendChild(h)
  }
;
var Zu = {
  "": ["<em>", "</em>"],
  _: ["<strong>", "</strong>"],
  "*": ["<strong>", "</strong>"],
  "~": ["<s>", "</s>"],
  "\n": ["<br />"],
  " ": ["<br />"],
  "-": ["<hr />"]
};
function Ks(c) {
  return c.replace(RegExp("^" + (c.match(/^(\t| )+/) || "")[0], "gm"), "")
}
function $n(c) {
  return (c + "").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}
function Wn(c, a) {
  let h = /((?:^|\n+)(?:\n---+|\* \*(?: \*)+)\n)|(?:^``` *(\w*)\n([\s\S]*?)\n```$)|((?:(?:^|\n+)(?:\t|  {2,}).+)+\n*)|((?:(?:^|\n)([>*+-]|\d+\.)\s+.*)+)|(?:!\[([^\]]*?)\]\(([^)]+?)\))|(\[)|(\](?:\(([^)]+?)\))?)|(?:(?:^|\n+)([^\s].*)\n(-{3,}|={3,})(?:\n+|$))|(?:(?:^|\n+)(#{1,6})\s*(.+)(?:\n+|$))|(?:`([^`].*?)`)|(  \n\n*|\n{2,}|__|\*\*|[_*]|~~)/gm, p = [], d = "", M = a || {}, F = 0, Z, q, k, O, B;
  function C(J) {
    let ne = Zu[J[1] || ""]
      , Y = p[p.length - 1] == J;
    return ne ? ne[1] ? (Y ? p.pop() : p.push(J),
      ne[Y | 0]) : ne[0] : J
  }
  function Q() {
    let J = "";
    for (; p.length; )
      J += C(p[p.length - 1]);
    return J
  }
  for (c = c.replace(/^\[(.+?)\]:\s*(.+)$/gm, (J,ne,Y)=>(M[ne.toLowerCase()] = Y,
    "")).replace(/^\n+|\n+$/g, ""); k = h.exec(c); )
    q = c.substring(F, k.index),
      F = h.lastIndex,
      Z = k[0],
    q.match(/[^\\](\\\\)*\\$/) || ((B = k[3] || k[4]) ? Z = '<pre class="code ' + (k[4] ? "poetry" : k[2].toLowerCase()) + '"><code' + (k[2] ? ` class="language-${k[2].toLowerCase()}"` : "") + ">" + Ks($n(B).replace(/^\n+|\n+$/g, "")) + "</code></pre>" : (B = k[6]) ? (B.match(/\./) && (k[5] = k[5].replace(/^\d+/gm, "")),
      O = Wn(Ks(k[5].replace(/^\s*[>*+.-]/gm, ""))),
      B == ">" ? B = "blockquote" : (B = B.match(/\./) ? "ol" : "ul",
        O = O.replace(/^(.*)(\n|$)/gm, "<li>$1</li>")),
      Z = "<" + B + ">" + O + "</" + B + ">") : k[8] ? Z = `<img src="${$n(k[8])}" alt="${$n(k[7])}">` : k[10] ? (d = d.replace("<a>", `<a href="${$n(k[11] || M[q.toLowerCase()])}">`),
      Z = Q() + "</a>") : k[9] ? Z = "<a>" : k[12] || k[14] ? (B = "h" + (k[14] ? k[14].length : k[13] > "=" ? 1 : 2),
      Z = "<" + B + ">" + Wn(k[12] || k[15], M) + "</" + B + ">") : k[16] ? Z = "<code>" + $n(k[16]) + "</code>" : (k[17] || k[1]) && (Z = C(k[17] || "--"))),
      d += q,
      d += Z;
  return (d + c.substring(F) + Q()).replace(/^\n+|\n+$/g, "")
}
var or = class extends Error {
    constructor(a, h) {
      super(a + ": " + h),
        this.responseText = h
    }
  }
  , Pi = class {
    constructor() {}
    async getImageInfo(a, h, p) {
      return await fetch(`./api/get-image-info/${a}/${h}/${p}`).then(this._handleResponse)
    }
    async _handleResponse(a) {
      if (a.ok || 400 <= a.status < 500)
        return await a.json();
      let h = await a.text();
      throw new or(`request failed with ${a.status}`,h)
    }
  }
;
var ur = class {
    constructor() {
      this.keymap = new Set,
        this.width = 1024,
        this.height = 1024,
        this.movePath = !0,
        this.removeCmd = "Remove-",
        this.selectedTool = 0,
        this.omniTool = new Yn(this),
        this.onboarding = new Ci(this.omniTool),
        this.api = new Pi,
        window.addEventListener( 'message', (e)=>{
         //console.log("message",e.data);
         const obj= JSON.parse(e.data)
         this.imgInfo= obj.img_info;
         this.setup()
       });
        //this.setup()
    }
    async setup() {
      
      if (this.imageURL = "./assets/strawberryshake.webp",
        this.inIFrame = window.location.search != "",
        this.currentPath = null,
        document.addEventListener("keydown", this.onKeyDown.bind(this)),
        document.addEventListener("keyup", this.onKeyUp.bind(this)),
        this.inIFrame) {
        if (this.searchParams = new URLSearchParams(window.location.search),
          this.customId = this.searchParams.get("custom_id").split("::")[2],
          this.applicationId = this.searchParams.get("instance_id").split(":")[1],
          this.guildId = this.searchParams.get("guild_id"),
          this.channelId = this.searchParams.get("channel_id"),
          this.platform = this.searchParams.get("platform"),
          //this.imgInfo = this.searchParams.get("img_info") && JSON.parse(this.searchParams.get("img_info")),
          this.discord = null)
          try {
            let d = window.location.hostname.split(".")[0];
            this.discord = new di(d),
              console.log("Discord SDK was initialized!", this.discord)
          } catch (d) {
            console.error("Discord SDK could not be initialized!", d)
          }
        this.userId = "0",
          this.userName = "0";
        let p = this.imgInfo;
        if (p.error === "invalid_id") {
          console.error("Error fetching image info:", p),
          this.discord != null && (p.message = "This session is invalid. Please relaunch the editor from the original message."),
            hn({
              header: "Error",
              content: p.message,
              footer: this.createDefaultCloseButton()
            });
          return
        }
        //console.log("Fetched Image info:", p),
          this.prompt = p.prompt,
          this.input_job_id = p.child_job_id,
          this.input_index = p.image_num,
          this.has_prompt_enabled = p.has_prompt_enabled,
          this.imageURL = p.image_url
      } else
        this.has_prompt_enabled = !0;
      this.backgroundImageElement = await this.loadImageAsync(this.imageURL),
        this.width = this.backgroundImageElement.width,
        this.height = this.backgroundImageElement.height,
        await this.forPageLoadAsync(),
        this.canvas = document.getElementById("InpaintingEditorCanvas"),
        ce.setup(this.canvas),
        ce.project.activeLayer.name = "EditorWorkspace",
        this.checkerboardImage = new ce.Raster("./assets/checkerboard.png"),
        this.checkerboardImage.name = "CheckerboardImage",
        this.checkerboardImage.position = new ce.Point(0,0),
        this.checkerboardImage.strokeWidth = 0,
        this.checkerboardImage.scale(Math.max(this.width, this.height) / 1024),
        this.drawingLayer = new ce.Group({
          name: "Drawing",
          blendMode: "destination-atop"
        }),
        this.undoLayer = new ce.Group({
          name: "Undo",
          visible: !1
        }),
        this.redoLayer = new ce.Group({
          name: "Redo",
          visible: !1
        }),
        ce.project.activeLayer.addChildren(new ce.Group({
          name: "CheckerboardCompositingGroup",
          children: [this.checkerboardImage, this.drawingLayer],
          blendMode: "source-over",
          opacity: .4
        }), this.undoLayer),
        ce.project.activeLayer.addChild(this.redoLayer),
        ce.view.onFrame = p=>{
          this.checkerboardImage.visible = !1;
          for (let d = 0; d < this.drawingLayer.children.length; d++)
            if (this.drawingLayer.children[d].bounds.area > 0) {
              this.checkerboardImage.visible = !0;
              break
            }
        }
        ,
        ce.view.onResize = this.onResize.bind(this);
      let a = !1;
      this.toolbar = document.getElementById("appbody"),
        this.toolbar.addEventListener("mousedown", p=>{
            a = !0
          }
        ),
        document.body.addEventListener("mouseup", p=>{
            a = !1,
              this.toolbar.classList.remove("fadeout")
          }
        );
      let h = document.getElementById("popover-container");
      document.addEventListener("mousemove", p=>{
          p.buttons
        }
      ),
        ce.view.onMouseMove = p=>{
          !(p.event.buttons === 1) || a || h.classList.add("fadeout")
        }
        ,
        ce.view.onMouseDown = ce.view.onMouseMove,
        ce.view.onMouseUp = p=>{
          h.classList.remove("fadeout")
        }
        ,
        ce.view.onMouseLeave = p=>{
          h.classList.remove("fadeout")
        }
        ,
        document.getElementById("Undo").addEventListener("click", ()=>{
            this.undo()
          }
          , !1),
        document.getElementById("Rect Tool").addEventListener("click", ()=>{
            this.selectedTool = 0,
              this.highlightSelected()
          }
          , !1),
        document.getElementById("Lasso Tool").addEventListener("click", ()=>{
            this.selectedTool = .5,
              this.highlightSelected()
          }
          , !1),
        this.bottomBar = document.getElementById("bottomBar"),
        this.promptBar = document.getElementById("Prompt"),
        this.promptBar.addEventListener("paste", p=>{
            p.preventDefault(),
              p.stopPropagation();
            let d = (p.originalEvent || p).clipboardData.getData("text/plain");
            document.execCommand("insertText", !1, d)
          }
        ),
        this.submitLabel = document.getElementById("submit-label"),
        this.submitButton = document.getElementById("Submit"),
        this.submitButton.addEventListener("click", async p=>{
            let d = p.target;
            if (d instanceof HTMLButtonElement && !(d.disabled || d.dataset?.state === "loading")) {
              Ti(d);
              try {
                await this.submit().catch(M=>this.displayError(M?.toString()))
              } finally {
                Ii(d)
              }
            }
          }
          , !1),
      this.has_prompt_enabled && (this.bottomBar.classList.remove("noFill"),
        this.promptBar.classList.remove("hidden"),
        this.submitButton.classList.remove("withText"),
        this.submitLabel.innerText = "",
        this.onboarding.setPromptBarAvailable(!0)),
        setInterval(()=>{
            this.submitButton instanceof HTMLButtonElement && (this.submitButton.disabled = this.drawingLayer.children.length === 0)
          }
          , 100),
      this.prompt && (this.promptBar.textContent = this.prompt),
        this.highlightSelected(),
        this.onResize(),
        this.backgroundImage = new ce.Raster(this.backgroundImageElement),
        this.backgroundImage.name = "BackgroundImage",
        this.backgroundImage.position = new ce.Point(0,0),
        this.backgroundImage.strokeWidth = 0,
        this.backgroundImage.insertBelow(this.drawingLayer.parent),
        this.canvas.setAttribute("oncontextmenu", "return false;"),
        ce.settings.handleSize = 0;
      try {
        let p = window.localStorage.getItem(this.imageURL);
        p && ce.project.importSVG(p, {
          expandShapes: !0,
          insert: !1,
          onLoad: M=>{
            M.translate(new ce.Point(-this.width / 2,-this.height / 2)),
              M.getItems({
                recursive: !0
              }).forEach(F=>{
                  F.name == this.drawingLayer.name ? this.drawingLayer.children = F.children : F.name == this.undoLayer.name ? this.undoLayer.children = F.children : F.name == this.redoLayer.name && (this.redoLayer.children = F.children)
                }
              ),
            this.inIFrame && (document.getElementById("popover-container").innerHTML = "")
          }
          ,
          onError: M=>{
            console.error(M)
          }
        });
        let d = window.localStorage.getItem(this.imageURL + "-Prompt");
        d && (this.prompt = d,
          this.promptBar.textContent = d)
      } catch (p) {
        console.log("Couldn't load Local Storage", p)
      }
      Ai(),
        this.onboarding.start()
    }
    onKeyDown(a) {
      this.keymap.add(a.key)
    }
    onKeyUp(a) {
      if (this.keymap.delete(a.key),
      a.key === "Escape") {
        let h = document.getElementById("Prompt");
        h == document.activeElement ? h.blur() : this.close("User Exited")
      }
    }
    onResize(a) {
      let h = 0;
      if (a && a.canonicalSpace)
        ce.view.viewSize.set(this.width / window.devicePixelRatio, this.height / window.devicePixelRatio),
          ce.view.zoom = 1 / window.devicePixelRatio;
      else {
        let d = this.toolbar.getBoundingClientRect().height * 1.75;
        h = d;
        let M = this.canvas.width / window.devicePixelRatio
          , F = this.canvas.height / window.devicePixelRatio;
        ce.view.zoom = Math.max(.01, Math.min(M / this.width, (F - d) / this.height) * .95)
      }
      ce.view.translate(new ce.Point(ce.view.center.x,ce.view.center.y - h * .5 / ce.view.zoom)),
        ce.view.update()
    }
    undo() {
      this.processDoCommand(this.drawingLayer, this.undoLayer, this.redoLayer)
    }
    redo() {
      this.processDoCommand(this.drawingLayer, this.redoLayer, this.undoLayer)
    }
    close(a="Job Submitted!") {
      this.discord != null && this.discord.close(ci.CLOSE_NORMAL, a)
    }
    processDoCommand(a, h, p) {
      let d = h.lastChild;
      if (d)
        if (d.name && d.name.startsWith(this.removeCmd)) {
          let M = d.name.substring(this.removeCmd.length)
            , F = a.getItem({
            match: Z=>Z.name == M
          });
          p.addChild(F),
            d.remove()
        } else {
          let M = a.getItem({
            match: F=>F.name == d.name
          });
          if (M) {
            let F = M.clone();
            F.name = M.name,
              p.addChild(F),
              M.replaceWith(d)
          } else
            a.addChild(d),
              p.addChild(new ce.Group({
                name: this.removeCmd + d.name
              }))
        }
    }
    async submit() {
      document.getElementById("popover-container").innerHTML = "",
        document.getElementById("Prompt").blur();
      let a = this.drawingLayer.children.length
        , h = this.drawingLayer.children;
      if (console.log({
        childLength: a
      }),
      a == 0) {
        hn({
          header: "请进行选择",
          content: "要使用修复功能，请开始拖动以选择您想要替换的图像区域。",
          footer: this.createDefaultCloseButton("好的")
        });
        return
      }
      let p = 0;
      for (let ye = 0; ye < a; ye++) {
        let oe = h[ye];
        oe.name.includes("Image") || (p += oe.bounds.width * oe.bounds.height)
      }
      if (p < 1e4) {
        hn({
          header: "选择的区域太小了",
          content: "为了获得最佳效果，您需要选择更多的图像来替换。",
          footer: this.createDefaultCloseButton("好的")
        });
        return
      }
      let d = document.getElementById("Prompt").textContent
        , M = ce.view.viewSize.width
        , F = ce.view.viewSize.height;
      this.omniTool.clearSelection(),
        ce.project.activeLayer.selected = !1,
      this.currentPath && (this.currentPath.bounds.selected = !1);
      let Z = this.drawingLayer.parent.opacity;
      this.drawingLayer.parent.opacity = 1,
        this.drawingLayer.blendMode = "normal",
        this.checkerboardImage.visible = !1,
       // console.log("Submitting Job..."),
        this.onResize({
          canonicalSpace: !0
        });
      let q = ce.project.exportSVG({
        asString: !0
      })
        , k = q.indexOf("<image")
        , O = q.indexOf("/>", k);
      q = q.substring(0, k) + q.substring(O + 2),
        k = q.indexOf("<image"),
        O = q.indexOf("/>", k),
        q = q.substring(0, k) + q.substring(O + 2),
        q = q.replace(/width="\d*\.?\d+" height="\d*\.?\d+" viewBox="0,0,\d*\.?\d+,\d*\.?\d+"/g, 'width="' + this.width + '" height="' + this.height + '" viewBox="0,0,' + this.width + "," + this.height + '"'),
        q = q.replace(/transform="translate\(\d*\.?\d+,\d*\.?\d+\) scale\(\d*\.?\d+,\d*\.?\d+\)"/g, 'transform="translate(' + this.width / 2 + "," + this.height / 2 + ') scale(1.0,1.0)"');
      try {
        window.localStorage.setItem(this.imageURL, q),
          window.localStorage.setItem(this.imageURL + "-Prompt", d)
      } catch (ye) {
        console.log("Cannot access local storage!", ye)
      }
      let B = new ce.Path.Rectangle(ce.view.bounds);
      B.fillColor = "white",
        B.sendToBack();
      for (let ye = 0; ye < a; ye++) {
        let oe = h[ye];
        oe.name.includes("Image") || (oe.visible = !0)
      }
      let C = []
        , Q = this.backgroundImage;
      if (Q.name && Q.visible && Q.name.includes("Image")) {
        let ye = new ce.Path.Rectangle(Q.bounds);
        ye.fillColor = "black",
          ye.insertAbove(Q),
          ye.name = "Occluder",
          C.push(ye)
      }
      this.omniTool.clearSelection(),
        ce.project.activeLayer.selected = !1,
      this.currentPath && (this.currentPath.bounds.selected = !1),
        this.onResize({
          canonicalSpace: !0
        }),
        ce.view.update(),
        this.omniTool.clearSelection(),
        ce.project.activeLayer.selected = !1,
      this.currentPath && (this.currentPath.bounds.selected = !1),
        this.onResize({
          canonicalSpace: !0
        });
      let J = ce.view.getContext()
        , ne = J.getImageData(0, 0, this.canvas.width / window.devicePixelRatio, this.canvas.height / window.devicePixelRatio)
        , Y = ne.data;
      for (let ye = 0; ye < Y.length; ye += 4)
        Y[ye + 0] = Y[ye + 0] > 128 ? 255 : 0,
          Y[ye + 1] = Y[ye + 1] > 128 ? 255 : 0,
          Y[ye + 2] = Y[ye + 2] > 128 ? 255 : 0,
          Y[ye + 3] = 255;
      J.putImageData(ne, 0, 0);
      let Me = this.canvas.toDataURL("image/"+this.imgInfo.img_type, 1)
        , le = document.createElement("a");
      this.inIFrame || (le.download = "drawingExportMask.webp",
        le.href = Me,
        le.click());
      for (let ye = 0; ye < C.length; ye++)
        C[ye].remove();
      B.remove(),
        ce.view.viewSize.set(M, F),
        ce.view.update(),
        this.onResize(),
        this.drawingLayer.parent.opacity = Z,
        this.drawingLayer.blendMode = "destination-atop",
        this.checkerboardImage.visible = !0,
      this.inIFrame || await new Promise(ye=>setTimeout(ye, 2e3));
      let Se = Me.split(",")[1];
      let ret = {
        username: this.userName,
        userId: this.userId,
        customId: this.customId,
        prompt: d,
        full_prompt: null,
        mask: Se
      };
      //localStorage.setItem("mj-iframe-btn-click","1");
      //localStorage.setItem("mj-iframe-btn-click-ret",JSON.stringify(ret));
      window.parent.postMessage( JSON.stringify(ret) , '*' )
    }
    async submitToBackend(a, h, p, d, M, F=null,aid) {
      let Z = await fetch("https://"+aid+".discordsays.com/inpaint/api/submit-job", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          username: a,
          userId: h,
          customId: p,
          mask: d,
          prompt: M,
          full_prompt: F
        })
      });
      return Z.status == 200 ? (Z = await Z.json(),
      !this.keymap.has("Shift") && !this.keymap.has("Alt") && (this.close(),
        hn({
          header: "Job Submitted!",
          content: "Your job was submitted successfully! You can now close this window, or make additional edits.",
          footer: this.createDefaultCloseButton()
        })),
        Z) : 400 <= Z.status < 500 ? (Z = await Z.json(),
        console.error("Received Error Response!", Z),
        hn({
          header: "Error",
          content: Z.message,
          footer: this.createDefaultCloseButton()
        }),
        Z) : (hn({
        header: "Error",
        content: "There was an error submitting your job. Please try again later.",
        footer: this.createDefaultCloseButton()
      }),
        null)
    }
    createDefaultCloseButton(a="Close") {
      let h = document.createElement("button");
      return h.className = "modal-button",
        h.addEventListener("click", Ai),
        h.innerText = a,
        h
    }
    displayError(a) {
      hn({
        header: "\u274C Submission Error!",
        content: `<p id="errorMessage">${Wn(a)}</p>`,
        footer: this.createDefaultCloseButton()
      })
    }
    highlightSelected() {
      let a = document.getElementById("Rect Tool")
        , h = document.getElementById("Lasso Tool");
      a.classList.remove("selected"),
        h.classList.remove("selected"),
        this.selectedTool == 0 ? a.classList.add("selected") : this.selectedTool == .5 && h.classList.add("selected")
    }
    loadImageAsync(a) {
      return new Promise((h,p)=>{
          let d = new Image;
          d.src = a,
            d.crossOrigin = "anonymous",
            d.onload = ()=>h(d),
            d.onerror = ()=>p(new Error("could not load image"))
        }
      )
    }
    forPageLoadAsync() {
      return new Promise(a=>{
          document.readyState === "complete" ? a() : window.onload = a.bind(this)
        }
      )
    }
  }
;
window.inpaintingEditor = new ur;
export {ur as InpaintingEditor};
/*!
 * Paper.js v0.12.17 - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 *
 * Date: Thu Nov 3 21:15:36 2022 +0100
 *
 ***
 *
 * Straps.js - Class inheritance library with support for bean-style accessors
 *
 * Copyright (c) 2006 - 2020 Jürg Lehni
 * http://juerglehni.com/
 *
 * Distributed under the MIT license.
 *
 ***
 *
 * Acorn.js
 * https://marijnhaverbeke.nl/acorn/
 *
 * Acorn is a tiny, fast JavaScript parser written in JavaScript,
 * created by Marijn Haverbeke and released under an MIT license.
 *
 */
