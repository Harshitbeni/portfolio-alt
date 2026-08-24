(function () {
  try {
    localStorage.removeItem("theme");

    var media = window.matchMedia("(prefers-color-scheme: dark)");
    var SKY = [
      [
        [0, 29, 51, 154],
        [1, 6, 13, 51],
      ],
      [
        [0, 130, 119, 122],
        [0.25, 103, 103, 131],
        [1, 29, 38, 83],
      ],
      [
        [0, 194, 131, 65],
        [0.1, 165, 118, 77],
        [0.30279, 111, 90, 97],
        [1, 35, 32, 58],
      ],
      [
        [0, 253, 128, 38],
        [0.30279, 170, 107, 73],
        [1, 93, 65, 74],
      ],
      [
        [0, 249, 198, 135],
        [0.25, 185, 166, 174],
        [1, 75, 96, 186],
      ],
      [
        [0, 171, 194, 255],
        [0.25, 132, 159, 255],
        [1, 79, 112, 221],
      ],
    ];
    var CYCLE = [0, 1, 2, 3, 4, 5, 4, 3, 2, 1];

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function sample(stops, at) {
      if (at <= stops[0][0]) {
        return [stops[0][1], stops[0][2], stops[0][3]];
      }
      var last = stops[stops.length - 1];
      if (at >= last[0]) {
        return [last[1], last[2], last[3]];
      }
      for (var i = 0; i < stops.length - 1; i++) {
        var from = stops[i];
        var to = stops[i + 1];
        if (at > to[0]) continue;
        var span = to[0] - from[0];
        var t = span === 0 ? 0 : (at - from[0]) / span;
        return [
          lerp(from[1], to[1], t),
          lerp(from[2], to[2], t),
          lerp(from[3], to[3], t),
        ];
      }
      return [last[1], last[2], last[3]];
    }

    function luma(rgb) {
      function lin(c) {
        var s = c / 255;
        return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
      }
      return 0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2]);
    }

    function skyProgress() {
      var now = new Date();
      var ms =
        now.getHours() * 3600000 +
        now.getMinutes() * 60000 +
        now.getSeconds() * 1000 +
        now.getMilliseconds();
      var scaled = (ms / 86400000) * CYCLE.length;
      var index = Math.floor(scaled) % CYCLE.length;
      return {
        fromStops: SKY[CYCLE[index]],
        toStops: SKY[CYCLE[(index + 1) % CYCLE.length]],
        t: scaled - Math.floor(scaled),
      };
    }

    function skyCss() {
      var progress = skyProgress();
      var fromStops = progress.fromStops;
      var toStops = progress.toStops;
      var t = progress.t;
      var ats = [];
      var seen = {};
      function addAt(at) {
        if (seen[at]) return;
        seen[at] = true;
        ats.push(at);
      }
      for (var i = 0; i < fromStops.length; i++) addAt(fromStops[i][0]);
      for (var j = 0; j < toStops.length; j++) addAt(toStops[j][0]);
      ats.sort(function (a, b) {
        return a - b;
      });
      var parts = [];
      for (var k = 0; k < ats.length; k++) {
        var at = ats[k];
        var a = sample(fromStops, at);
        var b = sample(toStops, at);
        parts.push(
          "rgb(" +
            Math.round(lerp(a[0], b[0], t)) +
            " " +
            Math.round(lerp(a[1], b[1], t)) +
            " " +
            Math.round(lerp(a[2], b[2], t)) +
            ") " +
            (at * 100).toFixed(3) +
            "%"
        );
      }
      return "linear-gradient(to top, " + parts.join(", ") + ")";
    }

    function skyDark() {
      var progress = skyProgress();
      var rgb = [];
      var a = sample(progress.fromStops, 0.72);
      var b = sample(progress.toStops, 0.72);
      rgb[0] = lerp(a[0], b[0], progress.t);
      rgb[1] = lerp(a[1], b[1], progress.t);
      rgb[2] = lerp(a[2], b[2], progress.t);
      return luma(rgb) < 0.179;
    }

    function apply() {
      var time =
        localStorage.getItem("appearance") === "time" &&
        location.pathname === "/";
      document.documentElement.toggleAttribute("data-time-mode", time);
      if (time) {
        var dark = skyDark();
        document.documentElement.classList.toggle("dark", dark);
        document.documentElement.dataset.timeSky = dark ? "dark" : "light";
        document.documentElement.style.setProperty("--time-sky", skyCss());
      } else {
        document.documentElement.classList.toggle("dark", media.matches);
        delete document.documentElement.dataset.timeSky;
        document.documentElement.style.removeProperty("--time-sky");
      }
    }

    apply();
    media.addEventListener("change", function () {
      if (localStorage.getItem("appearance") !== "time") apply();
    });
  } catch {
    // Ignore storage / matchMedia errors (private mode, etc).
  }
})();
