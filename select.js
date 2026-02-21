const cfg = document.forms[0];
const obj = document.querySelectorAll("object");
const svg = obj[0]; // main keyboard display

const selected = () => document.querySelector("#menu .selected");

drawKeys();
drawLabels();

async function setLayout(name) {
  const response = await fetch(`layouts/${name}.json`);
  const result   = await response.json();
  obj.forEach(view => {
    view.contentWindow.setLayout(result.keymap);
  });
}

const applyFlavor = () => {
  const flavor = selected().id.substr(5);
  const vim = document.getElementById("option-vim").checked;
  svg.contentWindow.setConfig(flavor, vim);
}

const applyConfig = () => {
  const data = Object.fromEntries(new FormData(cfg));
  setLayout(data.layout.toLowerCase());
  svg.contentWindow.setGeometry(data.geometry);
  applyFlavor();
};

svg.addEventListener("load", applyConfig);
cfg.addEventListener("change", applyConfig);

// layer views
const init = (name, layer3, layer4) => {
  const view = document.querySelector(`object.${name}`);
  view.addEventListener("load", () => {
    view.contentWindow.setLayer3(layer3);
    view.contentWindow.setLayer4(layer4);
  })
};
init("sym", "", "sym");
init("nav", "nav", "");
init("fun", "fun", "");
init("vim", "vim", "num");

// menu
document.querySelectorAll("#menu tr").forEach((tr) => {
  tr.addEventListener("click", (event) => {
    selected().classList.remove("selected");
    tr.classList.add("selected");
    applyFlavor();
  });
});
