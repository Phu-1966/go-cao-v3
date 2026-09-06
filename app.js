
const book = ePub("phia-sau-buc-tuong.epub", {});
const rendition = book.renderTo("viewer", {
  width: "100vw", height: "100%", layout: "reflowable", spread: "none",

  flow: "paginated", manager: "default"

});
rendition.hooks.content.register(function(contents) {

  contents.addStylesheet(

    "data:text/css," +

    encodeURIComponent(`

      html, body {
      width: 100% !important;

        column-count: 1 !important;

        -webkit-column-count: 1 !important;

        column-width: auto !important;

        -webkit-column-width: auto !important;

      }

    `)

  );

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

rendition.display().then(() => updateLocation());
                               
                               

rendition.on("relocated", updateLocation);

function updateLocation(cfi) {
  const loc = cfi || rendition.currentLocation();
  const text = loc?.start?.displayed;
  document.getElementById("location").textContent =
    text ? `Trang ${text.page || "—"} / ${text.total || "—"}` : "Đang đọc";
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
