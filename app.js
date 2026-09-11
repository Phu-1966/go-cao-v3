
const book = ePub("phia-sau-buc-tuong.epub", {});
const rendition = book.renderTo("viewer", {

  width: document.getElementById("viewer").clientWidth,

  height: "100%",

  layout: "reflowable",

  flow: "paginated",

  spread: "none",
gap: 0 ,
  manager: "default",

});
rendition.spread("none");
rendition.on("relocated", () => {

  const manager = rendition.manager;

  const layout = rendition._layout;

  if (!manager || !layout || !manager.container) return;

  const delta = layout.delta;

  const left = manager.container.scrollLeft;

  const page = Math.round(left / delta);

  manager.container.scrollLeft = page * delta;

});
let fontSize = 100;

function renderToc(items, parent) {
  items.forEach(item => {
    const a = document.createElement("a");
    a.textContent = item.label;
    a.href = "#";
    a.onclick = e => { e.preventDefault(); rendition.display(item.href); };
    parent.appendChild(a);
    if (item.subitems && item.subitems.length) renderToc(item.subitems, parent);
  });
}

book.ready.then(() => {
  document.querySelector(".loading").remove();
  return book.loaded.navigation;
}).then(nav => renderToc(nav.toc, document.getElementById("toc")));

rendition.display().then(() => {

  rendition.spread("none");

  updateLocation();
  
});
                               
                               

rendition.on("relocated", updateLocation);

let locationsReady;

async function updateLocation(cfi) {

  if (!locationsReady) {

    locationsReady = book.locations.generate(1000);

  }

  await locationsReady;

  const loc = cfi || rendition.currentLocation();

  const percent = book.locations.percentageFromCfi(loc?.start?.cfi);

  const totalPages = 357;

  const page = Math.min(

    totalPages,

    Math.max(1, Math.floor(percent * totalPages) + 1)

  );

  document.getElementById("location").textContent =

    `Trang ${page} / ${totalPages}`;

}

document.getElementById("next").onclick = () => rendition.next();
document.getElementById("prev").onclick = () => rendition.prev();
document.getElementById("fontPlus").onclick = () => {
  fontSize = Math.min(160, fontSize + 10);
  rendition.themes.fontSize(fontSize + "%");
};
document.getElementById("fontMinus").onclick = () => {
  fontSize = Math.max(70, fontSize - 10);
  rendition.themes.fontSize(fontSize + "%");
};

// Ten-page jump: walk ten paginated spreads in the current direction.
async function jump(n) {
  for (let i=0;i<Math.abs(n);i++) {
    if (n > 0) await rendition.next();
    else await rendition.prev();
  }
}
document.getElementById("forward10").onclick = () => jump(10);
document.getElementById("back10").onclick = () => jump(-10);

document.querySelectorAll(".book-row").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".book-row").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});
