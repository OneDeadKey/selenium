const cfg = document.forms[0];
const svg = document.querySelector("object");

const setConfig = () => {
  const data = Object.fromEntries(new FormData(cfg));
  svg.contentWindow.setConfig(data.mode, !!data.vim);
}

cfg.addEventListener("load", setConfig);
cfg.addEventListener("change", (event) => {
  switch(event.target.id) {
    case "geometry":
      svg.contentWindow.setGeometry(event.target.value);
      break;
    case "layout":
      svg.contentWindow.setLayout(event.target.value.toLowerCase());
      break;
    default:
      setConfig();
      break;
  }
});
