/* Colombia B2B Marketplace — immersive experience, SV2 Labs */
(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isFine = window.matchMedia("(pointer: fine)").matches;
  var isDesktop = window.matchMedia("(min-width: 900px)").matches;

  /* ---------- Nav + lang ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }
  document.querySelectorAll(".lang").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var btn = e.target.closest("button");
      if (!btn) return;
      group.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("is-active", b === btn);
      });
    });
  });

  if (typeof gsap === "undefined") {
    window.__immReady = true;
    return;
  }
  if (typeof ScrollTrigger !== "undefined") gsap.registerPlugin(ScrollTrigger);

  /* ---------- Lenis ---------- */
  var lenis = null;
  if (!reduced && typeof Lenis !== "undefined") {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }

  /* ---------- Custom cursor ---------- */
  var cursor = document.querySelector(".cursor");
  var cursorDot = document.querySelector(".cursor-dot");
  if (!reduced && isFine && cursor && cursorDot) {
    var cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3.out" });
    var cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3.out" });
    var dx = gsap.quickTo(cursorDot, "x", { duration: 0.12, ease: "power3.out" });
    var dy = gsap.quickTo(cursorDot, "y", { duration: 0.12, ease: "power3.out" });
    window.addEventListener(
      "mousemove",
      function (e) {
        cx(e.clientX);
        cy(e.clientY);
        dx(e.clientX);
        dy(e.clientY);
      },
      { passive: true }
    );
    document.querySelectorAll("a, button, .exporter-card, input, select").forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        cursor.classList.add("is-hover");
      });
      el.addEventListener("mouseleave", function () {
        cursor.classList.remove("is-hover");
      });
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!reduced && isFine) {
    document.querySelectorAll(".magnetic").forEach(function (btn) {
      var xTo = gsap.quickTo(btn, "x", { duration: 0.35, ease: "power3.out" });
      var yTo = gsap.quickTo(btn, "y", { duration: 0.35, ease: "power3.out" });
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      btn.addEventListener("mouseleave", function () {
        xTo(0);
        yTo(0);
      });
    });
  }

  /* ---------- Globe ---------- */
  var globeApi = initGlobe();

  /* ---------- Intro ---------- */
  if (!reduced) {
    var intro = gsap.timeline({ defaults: { ease: "power3.out" } });
    intro
      .from(".hero-kicker", { y: 16, autoAlpha: 0, duration: 0.7 })
      .from(
        ".hero h1 .line span",
        { yPercent: 110, duration: 1.05, stagger: 0.1, ease: "power4.out" },
        "-=0.35"
      )
      .from(".hero .lede", { y: 20, autoAlpha: 0, duration: 0.7 }, "-=0.55")
      .from(".search-card", { y: 36, autoAlpha: 0, duration: 0.9, ease: "power3.out" }, "-=0.35")
      .from(".scroll-hint", { autoAlpha: 0, duration: 0.6 }, "-=0.3");
  } else {
    gsap.set(".hero-kicker, .hero h1 .line span, .hero .lede, .search-card, .scroll-hint", { autoAlpha: 1, y: 0, yPercent: 0 });
  }

  /* ---------- Counters ---------- */
  document.querySelectorAll(".counter").forEach(function (el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    if (reduced) {
      el.textContent = formatCount(target);
      return;
    }
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: function () {
        el.textContent = formatCount(obj.val);
      },
    });
  });

  function formatCount(v) {
    var n = Math.round(v);
    return n >= 1000 ? n.toLocaleString("es-CO") : String(n);
  }

  /* ---------- Sectors pin ---------- */
  var slides = gsap.utils.toArray("[data-sector]");
  var bars = gsap.utils.toArray(".sector-progress i em");
  var mm = gsap.matchMedia();

  mm.add("(min-width: 700px) and (prefers-reduced-motion: no-preference)", function () {
    gsap.set(slides, { autoAlpha: 0 });
    gsap.set(slides[0], { autoAlpha: 1 });
    if (bars[0]) gsap.set(bars[0], { width: "100%" });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".sectors-pin",
        start: "top top",
        end: "+=520%",
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: function (self) {
          if (globeApi && globeApi.setIdle) globeApi.setIdle(self.progress > 0.02);
        },
      },
    });

    slides.forEach(function (slide, i) {
      if (i === 0) return;
      var prev = slides[i - 1];
      var art = slide.querySelector("[data-parallax]");
      var prevArt = prev.querySelector("[data-parallax]");
      tl.to(prev, { autoAlpha: 0, y: -36, duration: 0.7 }, "+=0.45");
      if (prevArt) tl.to(prevArt, { y: -40, duration: 0.7 }, "<");
      if (bars[i - 1]) tl.to(bars[i - 1], { width: "100%", duration: 0.5, ease: "none" }, "<");
      tl.fromTo(slide, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 0.7 }, "<0.15");
      if (art) tl.fromTo(art, { y: 50, scale: 1.06 }, { y: 0, scale: 1, duration: 0.8 }, "<");
    });
    if (bars[bars.length - 1]) {
      tl.to(bars[bars.length - 1], { width: "100%", duration: 0.5, ease: "none" }, "+=0.3");
    }
    return function () {
      gsap.set(slides, { clearProps: "all" });
      gsap.set(slides[0], { autoAlpha: 1 });
    };
  });

  mm.add("(max-width: 699px), (prefers-reduced-motion: reduce)", function () {
    gsap.set(slides, { autoAlpha: 1, y: 0, visibility: "visible", position: "relative", pointerEvents: "auto" });
    bars.forEach(function (b) {
      gsap.set(b, { width: "100%" });
    });
  });

  /* ---------- Horizontal exporters ---------- */
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", function () {
    var track = document.querySelector(".exp-track");
    if (!track) return;
    var tween = gsap.to(track, {
      x: function () {
        return -(track.scrollWidth - window.innerWidth + 40);
      },
      ease: "none",
      scrollTrigger: {
        trigger: ".exporters-pin",
        start: "top top",
        end: function () {
          return "+=" + Math.max(track.scrollWidth - window.innerWidth, 600);
        },
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
    return function () {
      tween.kill();
      gsap.set(track, { x: 0 });
    };
  });

  /* ---------- Reveal on scroll ---------- */
  if (!reduced) {
    gsap.utils.toArray(".reveal").forEach(function (el, i) {
      gsap.from(el, {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: (i % 3) * 0.08,
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    gsap.utils.toArray(".stat-card").forEach(function (el, i) {
      gsap.from(el, {
        y: 28,
        autoAlpha: 0,
        duration: 0.75,
        delay: i * 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: ".stats-section", start: "top 70%", once: true },
      });
    });
  }

  /* ---------- Globe fades after hero/stats ---------- */
  if (!reduced && globeApi) {
    ScrollTrigger.create({
      trigger: ".sectors-pin",
      start: "top 80%",
      onEnter: function () {
        gsap.to(".scene-wrap", { autoAlpha: 0, duration: 0.8, ease: "power2.out" });
        globeApi.setIdle(true);
      },
      onLeaveBack: function () {
        gsap.to(".scene-wrap", { autoAlpha: 1, duration: 0.6, ease: "power2.out" });
        globeApi.setIdle(false);
      },
    });
  }

  window.addEventListener(
    "resize",
    debounce(function () {
      ScrollTrigger.refresh();
    }, 200)
  );

  /* Fonts can shift layout */
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      ScrollTrigger.refresh();
    });
  }

  window.__immReady = true;

  function debounce(fn, ms) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  /* ============================================================
     Three.js stylized globe with export arcs
     ============================================================ */
  function initGlobe() {
    var canvas = document.getElementById("globe");
    var fallback = document.getElementById("globe-fallback");
    if (!canvas || typeof THREE === "undefined") {
      if (fallback) fallback.classList.add("is-on");
      return null;
    }
    var glOk = false;
    try {
      var probe = document.createElement("canvas");
      glOk = !!(probe.getContext("webgl") || probe.getContext("experimental-webgl"));
    } catch (e) {
      glOk = false;
    }
    if (!glOk) {
      if (fallback) fallback.classList.add("is-on");
      return null;
    }

    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    var dpr = Math.min(window.devicePixelRatio || 1, isDesktop ? 1.75 : 1.25);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(42, 1, 0.1, 40);
    var root = new THREE.Group();
    var spin = new THREE.Group();
    root.add(spin);
    scene.add(root);

    var mouse = { x: 0, y: 0 };
    var idle = false;
    var RADIUS = 1.28;

    layoutCamera();

    scene.add(new THREE.AmbientLight(0x8899bb, 1.15));
    var key = new THREE.DirectionalLight(0xffffff, 1.35);
    key.position.set(-3, 2.2, 4);
    scene.add(key);
    var goldLight = new THREE.PointLight(0xfcd116, 1.4, 8);
    goldLight.position.set(0.4, 0.15, 1.8);
    scene.add(goldLight);
    var fill = new THREE.DirectionalLight(0x4d8dff, 0.45);
    fill.position.set(3, -1, 1);
    scene.add(fill);

    /* Stars */
    spin.add(makeStars());

    /* Globe + atmosphere */
    var tex = new THREE.CanvasTexture(drawGlobeTexture());
    tex.anisotropy = 4;
    tex.colorSpace = THREE.SRGBColorSpace || THREE.sRGBEncoding;
    var globe = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS, 64, 48),
      new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.86,
        metalness: 0.12,
        emissive: new THREE.Color(0x0a1a33),
        emissiveIntensity: 0.35,
      })
    );
    spin.add(globe);

    var atmos = new THREE.Mesh(
      new THREE.SphereGeometry(RADIUS * 1.06, 48, 32),
      new THREE.MeshBasicMaterial({
        color: 0x4d8dff,
        transparent: true,
        opacity: 0.14,
        side: THREE.BackSide,
      })
    );
    spin.add(atmos);

    /* Meridians */
    var grid = new THREE.LineSegments(
      new THREE.WireframeGeometry(new THREE.SphereGeometry(RADIUS * 1.002, 24, 16)),
      new THREE.LineBasicMaterial({ color: 0xfcd116, transparent: true, opacity: 0.07 })
    );
    spin.add(grid);

    /* Colombia faces camera initially: lon -74.3 */
    // Standard mapping: with camera on +Z, lon 0 is not necessarily front.
    // We'll rotate spin so Bogotá (4.57, -74.3) faces the camera.
    var bogota = latLonToVec(4.57, -74.3, RADIUS);
    var q = new THREE.Quaternion().setFromUnitVectors(bogota.clone().normalize(), new THREE.Vector3(0, 0, 1));
    spin.quaternion.copy(q);

    /* Markers + arcs */
    var colombia = { lat: 4.57, lon: -74.3 };
    var markets = [
      { lat: 25.76, lon: -80.19, name: "Miami" },
      { lat: 40.71, lon: -74.0, name: "Nueva York" },
      { lat: 51.51, lon: -0.12, name: "Londres" },
      { lat: 52.52, lon: 13.4, name: "Berlín" },
      { lat: 52.37, lon: 4.89, name: "Ámsterdam" },
      { lat: 35.68, lon: 139.65, name: "Tokio" },
      { lat: 37.57, lon: 126.98, name: "Seúl" },
      { lat: 43.65, lon: -79.38, name: "Toronto" },
      { lat: 19.43, lon: -99.13, name: "Ciudad de México" },
    ];

    spin.add(makeMarker(colombia.lat, colombia.lon, 0xfcd116, 0.028));
    markets.forEach(function (m) {
      spin.add(makeMarker(m.lat, m.lon, 0x8ec5ff, 0.018));
    });

    var arcs = [];
    markets.forEach(function (m, i) {
      var arc = makeArc(colombia, m, RADIUS, i);
      spin.add(arc.line);
      spin.add(arc.dot);
      arcs.push(arc);
    });

    window.addEventListener(
      "mousemove",
      function (e) {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    var t0 = performance.now();
    var running = true;
    function frame(now) {
      if (!running) return;
      requestAnimationFrame(frame);
      var t = (now - t0) / 1000;
      if (!reduced && !idle) {
        spin.rotation.y += 0.00115;
      }
      var targetX = isDesktop ? mouse.y * -0.22 : 0;
      var targetY = isDesktop ? mouse.x * 0.4 : 0;
      root.rotation.x += (targetX - root.rotation.x) * 0.045;
      root.rotation.y += (targetY - root.rotation.y) * 0.045;

      arcs.forEach(function (a, i) {
        var p = (t * 0.18 + a.offset) % 1;
        var pt = a.curve.getPoint(p);
        a.dot.position.copy(pt);
        a.dot.scale.setScalar(0.6 + 0.4 * Math.sin(p * Math.PI));
      });

      renderer.render(scene, camera);
    }
    requestAnimationFrame(frame);

    window.addEventListener("resize", debounce(function () {
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth >= 900 ? 1.75 : 1.25);
      renderer.setPixelRatio(dpr);
      layoutCamera();
    }, 150));

    function layoutCamera() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      if (w >= 900) {
        camera.position.set(-1.25, 0.18, 3.35);
        camera.lookAt(0.7, 0, 0);
      } else {
        camera.position.set(0, 0.35, 4.4);
        camera.lookAt(0, -0.15, 0);
      }
      camera.updateProjectionMatrix();
    }

    return {
      setIdle: function (v) {
        idle = !!v;
      },
      dispose: function () {
        running = false;
        renderer.dispose();
      },
    };

    function latLonToVec(lat, lon, r) {
      var phi = (90 - lat) * (Math.PI / 180);
      var theta = (lon + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    }

    function makeMarker(lat, lon, color, size) {
      var g = new THREE.Group();
      var mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 12, 12),
        new THREE.MeshBasicMaterial({ color: color })
      );
      var pos = latLonToVec(lat, lon, RADIUS + 0.01);
      mesh.position.copy(pos);
      var glow = new THREE.Mesh(
        new THREE.SphereGeometry(size * 2.4, 12, 12),
        new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.25 })
      );
      glow.position.copy(pos);
      g.add(mesh);
      g.add(glow);
      return g;
    }

    function makeArc(from, to, r, i) {
      var start = latLonToVec(from.lat, from.lon, r);
      var end = latLonToVec(to.lat, to.lon, r);
      var mid = start.clone().add(end).multiplyScalar(0.5);
      var dist = start.distanceTo(end);
      mid.normalize().multiplyScalar(r + dist * 0.42);
      var curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      var pts = curve.getPoints(80);
      var geom = new THREE.BufferGeometry().setFromPoints(pts);
      var color = i % 2 === 0 ? 0xfcd116 : 0x7eb6ff;
      var line = new THREE.Line(
        geom,
        new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.55 })
      );
      var dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.018, 10, 10),
        new THREE.MeshBasicMaterial({ color: color })
      );
      return { curve: curve, line: line, dot: dot, offset: i * 0.11 };
    }

    function makeStars() {
      var n = 500;
      var positions = new Float32Array(n * 3);
      for (var i = 0; i < n; i++) {
        var u = Math.random();
        var v = Math.random();
        var theta = 2 * Math.PI * u;
        var phi = Math.acos(2 * v - 1);
        var rr = 8 + Math.random() * 6;
        positions[i * 3] = rr * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = rr * Math.cos(phi);
        positions[i * 3 + 2] = rr * Math.sin(phi) * Math.sin(theta);
      }
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      return new THREE.Points(
        g,
        new THREE.PointsMaterial({ color: 0xb7c4d8, size: 0.025, sizeAttenuation: true, transparent: true, opacity: 0.7 })
      );
    }

    function drawGlobeTexture() {
      var w = 2048, h = 1024;
      var c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      var ctx = c.getContext("2d");
      var ocean = ctx.createLinearGradient(0, 0, 0, h);
      ocean.addColorStop(0, "#081427");
      ocean.addColorStop(0.5, "#0b1c38");
      ocean.addColorStop(1, "#07111f");
      ctx.fillStyle = ocean;
      ctx.fillRect(0, 0, w, h);

      /* Grid */
      ctx.strokeStyle = "rgba(252,209,22,0.06)";
      ctx.lineWidth = 1;
      for (var lon = -180; lon <= 180; lon += 15) {
        var x = ((lon + 180) / 360) * w;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (var lat = -75; lat <= 75; lat += 15) {
        var y = ((90 - lat) / 180) * h;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      function xy(lon, lat) {
        return [((lon + 180) / 360) * w, ((90 - lat) / 180) * h];
      }
      function fill(pts, color) {
        if (!pts.length) return;
        ctx.beginPath();
        pts.forEach(function (p, i) {
          var q = xy(p[0], p[1]);
          if (i === 0) ctx.moveTo(q[0], q[1]);
          else ctx.lineTo(q[0], q[1]);
        });
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }

      var land = "rgba(150, 184, 220, 0.38)";
      var land2 = "rgba(120, 160, 200, 0.28)";

      /* North America */
      fill(
        [
          [-168, 66], [-141, 69], [-107, 68], [-95, 72], [-88, 68], [-82, 62],
          [-70, 60], [-60, 47], [-66, 44], [-74, 40], [-81, 31], [-81, 25],
          [-97, 26], [-97, 16], [-105, 22], [-111, 23], [-117, 32], [-125, 48],
          [-130, 56], [-153, 58], [-166, 64],
        ],
        land
      );
      /* Greenland */
      fill([[-45, 83], [-20, 74], [-22, 64], [-44, 60], [-62, 70], [-70, 76], [-60, 83]], land2);
      /* South America */
      fill(
        [
          [-81, 12], [-77, 8], [-68, 10], [-60, 8], [-50, 1], [-35, -7],
          [-38, -15], [-40, -22], [-48, -25], [-52, -34], [-68, -55],
          [-71, -52], [-75, -45], [-73, -18], [-81, -5], [-80, 1],
        ],
        land
      );
      /* Europe */
      fill(
        [
          [-10, 52], [-9, 43], [-1, 43], [0, 51], [8, 54], [12, 55],
          [10, 59], [24, 70], [31, 70], [30, 60], [28, 45], [18, 40],
          [10, 36], [-5, 36], [-9, 38], [-10, 43],
        ],
        land
      );
      /* Africa */
      fill(
        [
          [-6, 36], [10, 37], [11, 33], [32, 31], [43, 12], [51, 11],
          [40, -3], [39, -16], [29, -26], [18, -35], [18, -30], [12, -17],
          [8, -4], [9, 4], [-5, 5], [-17, 14], [-16, 21], [-10, 32],
        ],
        land
      );
      /* Asia */
      fill(
        [
          [28, 41], [32, 60], [40, 68], [60, 70], [90, 72], [130, 70],
          [160, 66], [180, 65], [180, 42], [145, 42], [140, 35], [128, 32],
          [122, 25], [100, 8], [104, 2], [98, 8], [80, 8], [70, 20],
          [60, 25], [48, 36], [36, 36],
        ],
        land
      );
      /* India */
      fill([[68, 24], [78, 24], [88, 22], [80, 8], [73, 18]], land);
      /* SE Asia / islands suggestion */
      fill([[95, 6], [110, 6], [119, 0], [105, -8], [95, -3]], land2);
      /* Australia */
      fill([[113, -12], [145, -11], [153, -28], [150, -38], [116, -35], [114, -22]], land);
      /* Antarctica faint */
      fill([[-180, -72], [0, -68], [180, -72], [180, -90], [-180, -90]], "rgba(180,200,220,0.12)");

      /* Colombia highlight with glow */
      var co = [
        [-71.7, 12.4], [-71.3, 11.8], [-67.5, 6.2], [-67.0, 1.2],
        [-69.9, -4.2], [-75.0, -1.0], [-79.0, 1.5], [-77.9, 7.2],
        [-76.8, 8.2], [-75.5, 10.4], [-74.8, 11.0], [-72.9, 11.5],
      ];
      ctx.shadowColor = "rgba(252,209,22,0.85)";
      ctx.shadowBlur = 16;
      fill(co, "#fcd116");
      ctx.shadowBlur = 0;
      fill(co, "#f5d34a");

      /* Soft vignette */
      var vg = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.2, w * 0.5, h * 0.5, h * 0.85);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, "rgba(5,9,16,0.35)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      return c;
    }
  }
})();
