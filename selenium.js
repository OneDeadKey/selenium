// choc spacing = 18*17mm, scaled to stay close to x-keyboard's 60*60px
const kw = 60.0;  // key width
const kh = 56.67; // key height

const keyboards = {
  zero: {
    col_stagger: [ 0, 0.200, 0.600, 0.250, -0.250, -0.195 ],
    col_splay:   [ 10, 0, 6, 4, 0, 0 ], // total = 40deg between wrists
    thumb_stagger: [ -0.4, 0, 0 ],
    thumb_spread:  [ 0, 0.1, 0.1 ],
    thumb_splay:   [ 0, 15, 15 ],
    view_box: "42 -26 880 405",
  },
  flex: {
    col_stagger: [ 0, 0.195, 0.600, 0.350, -0.250, -0.195 ],
    col_splay:   [ 0, 0, 9, 6, 0, 0 ], // total = 30deg between wrists
    thumb_stagger: [ -0.4, 0, 0 ],
    thumb_splay:   [ 0, 16, 16 ],
    view_box: "38 -12 880 380",
  },
  qmx: {
    columns: [ "extra", "outer", "pinky", "ring", "middle", "index", "inner", "tmx" ],
    thumbs: [ "tucked3", "tucked2", "tucked1", "comfy", "reachy" ],
    rows: [ "num", "top", "home", "bottom" ],
    col_stagger: [ 0, 0, 0, 0.5, 0, 0, 0, 0.5],
    col_splay:   [ 0, 0, 0, 0, 0, 0, 0, 0 ],
    thumb_stagger: [ -1, 0, 0, 0, 0 ],
    thumb_spread:  [ -2, 0, 0, 0, 0 ],
    thumb_splay:   [ 0,0,  0, 16, 16 ],
    view_box: "-22 -12 1030 380",
  },
  ortho: {
    thumb_spread: [ -0.5, 0, 0 ],
    thumb_stagger: [ -0.2, 0, 0 ],
    view_box: "100 -10 730 260",
  },
};

    // thumbs: [ "tucked3", "tucked2", "tucked1", "comfy", "reachy" ],

const setGeometry = (name) => {
  const geometry = keyboards[name];
  document.documentElement.className.baseVal = name;
  document.documentElement.setAttribute("viewBox", geometry.view_box);

  // Ergogen values, relative to one another, from outer/pinky to inner/index
  const columns = geometry.columns || [ "outer", "pinky", "ring", "middle", "index", "inner" ];
  const thumbs  = geometry.thumbs  || [ "tucked", "comfy", "reachy" ];
  const rows    = geometry.rows    || [ "top", "home", "bottom" ];

  const col_stagger = geometry.col_stagger || [ 0, 0, 0, 0, 0, 0 ];
  const col_splay   = geometry.col_splay   || [ 0, 0, 0, 0, 0, 0 ];
  const alt_stagger = geometry.alt_stagger || [ 0.305, 0.695, 0.0, 0.0, 0.0, 0.305 ];

  const thumb_stagger = geometry.thumb_stagger || [ 0, 0, 0 ];
  const thumb_spread  = geometry.thumb_spread  || [ 0, 0, 0 ];
  const thumb_splay   = geometry.thumb_splay   || [ 0, 0, 0 ];

  // apply keyboard geometry
  let sheet = window.document.styleSheets[0];
  const cssTransform = (selector, transform) => {
    sheet.insertRule(`${selector} { transform: ${transform} }`);
  }
  const svgTransform = (selector, transform) => {
    document.querySelectorAll(selector).forEach(element => {
      element.setAttribute("transform", transform);
    });
  }

  const matrix = (dx, dy, angle) => {
    const rad = angle * Math.PI / 180.0;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    const tx = kw * (dx + sin * 2);
    const ty = kh * dy;
    return [
      `matrix(${cos}, ${sin}, ${-sin}, ${cos}, ${tx}, ${-ty})`,
      `matrix(${cos}, ${-sin}, ${sin}, ${cos}, ${-tx}, ${-ty})`
    ];
  }

  columns.forEach((name, i) => {
    const [left, right] = matrix(1, col_stagger[i], col_splay[i]);
    svgTransform(`#left  .${name}`, left);
    svgTransform(`#right .${name}`, right);
    svgTransform(`.col${6 - i}m`, `translate(0 ${alt_stagger[i] * kh})`);
  });
  rows.forEach((name, i) => { // XXX ends up with a lot of unused rules
    cssTransform(`.${name}`, `translateY(${i * kh}px)`);
  });

  const leftThumb  = document.querySelector("#left  .thumbCluster");
  const rightThumb = document.querySelector("#right .thumbCluster");
  leftThumb.setAttribute("x", -kw);
  leftThumb.setAttribute("y", 3 * kh);
  rightThumb.setAttribute("x", kw);
  rightThumb.setAttribute("y", 3 * kh);
  thumbs.forEach((name, i) => {
    const [left, right] = matrix(1 + thumb_spread[i], thumb_stagger[i], thumb_splay[i]);
    svgTransform(`.leftThumb  .${name}`, left);
    svgTransform(`.rightThumb .${name}`, right);
  });
};

let funState = false;
const setLayer3 = (id) => {
  document.querySelector("#left").setAttribute("layer3", id);
  document.querySelector("#right").setAttribute("layer3", id);
  funState = (id === "fun");
};

const setLayer4 = (id) => {
  document.querySelector("#left").setAttribute("layer4", id);
  document.querySelector("#right").setAttribute("layer4", id);
};

const toggleNavFun = () => {
  setLayer3(funState ? "nav" : "fun");
};

const setConfig = (cfg) => {
  document.querySelector("#left").setAttribute("class", cfg);
  document.querySelector("#right").setAttribute("class", cfg);
  const nav = (cfg === "vim") ? "vim" : "nav";
  setLayer3(nav);
  setLayer4("sym");

  ["left", "right"].forEach(id => {
    document.querySelector(`#${id} .thumbCluster`).setAttribute("href", `#${id}Thumb-${cfg}`);
  })

  document.querySelectorAll(".toggleNavFun *").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", "toggleNavFun()");
  })
  document.querySelectorAll(".showNav *").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", `setLayer3('${nav}')`);
  })
  document.querySelectorAll(".showFun *").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", "setLayer3('fun')");
  })
  document.querySelectorAll(".showNum *").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", "setLayer4('num')");
  })
  document.querySelectorAll(".showSym *").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", "setLayer4('sym')");
  })
  document.querySelectorAll("#select text").forEach(element => {
    element.setAttribute("style", "cursor: pointer");
    element.setAttribute("onclick", `setConfig('${element.id}')`);
  })
};

const drawKeys = () => {
  // show keys and dual keys
  const padding = 1.0;
  const ikw = kw - 2 * padding; // inner key width
  const ikh = kh - 2 * padding; // inner key width
  const radius = 4.0;

  document.querySelectorAll("rect").forEach(rect => {
    rect.setAttribute("x", padding);
    rect.setAttribute("y", padding);
    rect.setAttribute("rx", radius);
    rect.setAttribute("ry", radius);
    rect.setAttribute("width",  ikw);
    rect.setAttribute("height", ikh);
  });
  document.querySelectorAll("rect.dualKey").forEach(rect => {
    rect.setAttribute("y", padding + ikh / 2);
    rect.setAttribute("width",  ikw / 2);
    rect.setAttribute("height", ikh / 2);
  });
  document.querySelectorAll(".specialKey rect.dualKey").forEach(rect => {
    rect.setAttribute("width", ikw);
  });
};

const drawLabels = () => {
  // show keyboard layout/config
  const x0 = kw * 0.50;
  const x1 = kw * 0.25;
  const x2 = kw * 0.75;

  // const y0 = kh * 0.58;
  const y0 = kh * 0.50;
  const y1 = kh * 0.80;
  const y2 = kh * 0.37;

  document.querySelectorAll(".level0").forEach(text => {
    text.setAttribute("x", x0);
    text.setAttribute("y", y0);
  });
  document.querySelectorAll(".level1").forEach(text => {
    text.setAttribute("x", x1);
    text.setAttribute("y", y1);
  });
  document.querySelectorAll(".level2").forEach(text => {
    text.setAttribute("x", x1);
    text.setAttribute("y", y2);
  });
  document.querySelectorAll(".layerSym, .layerNum").forEach(text => {
    text.setAttribute("x", x2);
    text.setAttribute("y", y2);
  });
  document.querySelectorAll(".layerNav, .layerVim, .layerFun",).forEach(text => {
    text.setAttribute("x", x2);
    text.setAttribute("y", y1);
  });
  document.querySelectorAll(".specialKey .level1, .specialKey .level2").forEach(text => {
    text.setAttribute("x", x0);
  });
};
