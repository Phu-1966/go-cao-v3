
const book = ePub("SU_ICH_KY_THONG_MINH_FINAL_V2.epub", {});
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


rendition.hooks.content.register(contents => {

  const doc = contents.document;

  doc.querySelectorAll("p").forEach(p => {

    p.style.setProperty(

      "padding-left",

      "24px",

      "important"

    );

    p.style.setProperty(

      "padding-right",

      "22px",

      "important"

    );

  });


}

});

let fontSize = 100;

function renderToc(items, parent) {

  const chapterPages = {

    "ch1.xhtml": 20,

    "ch2.xhtml": 31,

    "ch3.xhtml": 40,

    "ch4.xhtml": 58,

    "ch5.xhtml": 69,

    "ch6.xhtml": 80,

    "ch7.xhtml": 99,

    "ch8.xhtml": 109,

    "ch9.xhtml": 119,

    "ch10.xhtml": 138,

    "ch11.xhtml": 148

  };

  items.forEach(item => {

    const a = document.createElement("a");

    a.style.marginLeft = "20px";

    a.style.display = "block";

    a.textContent = item.label;

    a.href = "#";

    a.onclick = async e => {

      e.preventDefault();

      try {

        const href = item.href.split("#")[0];

        const section = book.spine.get(href);

        if (!section) {

          console.error("Không tìm thấy section:", href);

          return;

        }
alert(

  "HREF: " + href +

  "\nSECTION: " + (section ? section.href : "null") +

  "\nINDEX: " + (section ? section.index : "null")

);
        await rendition.display(section.index);

        if (chapterPages[href]) {

          currentPage = chapterPages[href];

          updateLocation();

        }

      } catch (err) {

        console.error("TOC error:", err);

      }

      return false;

    };

    parent.appendChild(a);

    if (item.subitems && item.subitems.length) {

      renderToc(item.subitems, parent);

    }

  });

}

book.ready.then(() => {
  document.querySelector(".loading").remove();
  return book.loaded.navigation;
}).then(nav => renderToc(nav.toc, document.getElementById("toc")));

rendition.display().then(() => {

  

  updateLocation();
  
});
                               
                               



let currentPage = 1;

const totalPages = 169;

function updateLocation() {

  document.getElementById("location").textContent =

    `Trang ${currentPage} / ${totalPages}`;

}
  
function showDiagnostic() {

  const m = rendition.manager;

  const l = m && m.layout;

  const c = m && m.container;

  const v = m && m.views && m.views.last();

  const cr = c

    ? c.getBoundingClientRect()

    : null;

  const vr = v && v.element

    ? v.element.getBoundingClientRect()

    : null;

  const ir = v && v.iframe

    ? v.iframe.getBoundingClientRect()

    : null;

  let docWidth = "?";

  let bodyWidth = "?";

  let iframeStyleWidth = "?";

  let viewStyleWidth = "?";

  let overflowX = "?";

  let stageOverflowX = "?";
  let columnWidth = "?";

let columnGap = "?";

let columnCount = "?";

let bodyCssWidth = "?";

let bodyTransform = "?";

let bodyMarginLeft = "?";

  try {

    if (v && v.iframe && v.iframe.contentDocument) {

      const doc = v.iframe.contentDocument;
      const bodyStyle =

  doc.body

    ? getComputedStyle(doc.body)

    : null;

if (bodyStyle) {

  columnWidth = bodyStyle.columnWidth;

  columnGap = bodyStyle.columnGap;

  columnCount = bodyStyle.columnCount;

  bodyCssWidth = bodyStyle.width;

  bodyTransform = bodyStyle.transform;

  bodyMarginLeft = bodyStyle.marginLeft;

}

      docWidth = doc.documentElement

        ? doc.documentElement.scrollWidth

        : "?";

      bodyWidth = doc.body

        ? doc.body.scrollWidth

        : "?";

    }

    if (v && v.iframe) {

      iframeStyleWidth =

        v.iframe.style.width || "(auto)";

    }

    if (v && v.element) {

      viewStyleWidth =

        v.element.style.width || "(auto)";

    }

    if (c) {

      overflowX =

        getComputedStyle(c).overflowX;

    }

    if (v && v.element) {

      stageOverflowX =

        getComputedStyle(v.element).overflowX;

    }

  } catch (e) {

    docWidth = "blocked";

    bodyWidth = "blocked";

  }

  let box =

    document.getElementById("epubDiagnostic");

  if (!box) {

    box = document.createElement("pre");

    box.id = "epubDiagnostic";

    Object.assign(box.style, {

      position: "fixed",

      left: "8px",

      right: "8px",

      bottom: "8px",

      zIndex: "99999",

      margin: "0",

      padding: "8px",

      background: "rgba(0,0,0,.82)",

      color: "#fff",

      font: "12px/1.35 monospace",

      whiteSpace: "pre-wrap",

      borderRadius: "6px",

      pointerEvents: "none"

    });

    document.body.appendChild(box);

  }

  box.textContent = [

    "EPUB DIAGNOSTIC",

    `container.left   : ${

      cr ? cr.left.toFixed(2) : "?"

    }`,

    `container.width  : ${

      cr ? cr.width.toFixed(2) : "?"

    }`,

    `overflowX        : ${overflowX}`,

    `scrollLeft       : ${

      c ? c.scrollLeft : "?"

    }`,

    `scrollWidth      : ${

      c ? c.scrollWidth : "?"

    }`,

    `clientWidth      : ${

      c ? c.clientWidth : "?"

    }`,

    `delta            : ${

      l ? l.delta : "?"

    }`,

    `pageWidth        : ${

      l ? l.pageWidth : "?"

    }`,

    `divisor          : ${

      l ? l.divisor : "?"

    }`,

    `stage.left       : ${

      vr ? vr.left.toFixed(2) : "?"

    }`,

    `stage.width      : ${

      vr ? vr.width.toFixed(2) : "?"

    }`,

    `stage.overflowX  : ${stageOverflowX}`,

    `view.style.width : ${viewStyleWidth}`,

    `iframe.left      : ${

      ir ? ir.left.toFixed(2) : "?"

    }`,

    `iframe.width     : ${

      ir ? ir.width.toFixed(2) : "?"

    }`,

    `iframe.style.width: ${iframeStyleWidth}`,

    `doc.scrollWidth  : ${docWidth}`,

    `body.scrollWidth : ${bodyWidth}`,
    `columnWidth      : ${columnWidth}`,

`columnGap        : ${columnGap}`,

`columnCount      : ${columnCount}`,

`body.css.width   : ${bodyCssWidth}`,

`body.transform   : ${bodyTransform}`,

`body.marginLeft  : ${bodyMarginLeft}`

  ].join("\n");

}

let isTurning = false;

async function turnPage(direction) {

  if (isTurning) {

    return;

  }

  isTurning = true;

  try {

    if (direction === "next") {

      if (currentPage >= totalPages) {

        return;

      }

      await rendition.next();

      currentPage += 1;

      updateLocation();

    } else {

      if (currentPage <= 1) {

        return;

      }

      await rendition.prev();

      currentPage -= 1;

      updateLocation();

    }

  } finally {

    isTurning = false;

  }

}

    


 
document.getElementById("next").onclick = () => turnPage("next");

document.getElementById("prev").onclick = () => turnPage("prev");
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

  for (let i = 0; i < Math.abs(n); i++) {

    if (n > 0) {

      if (currentPage >= totalPages) {

        break;

      }

      await rendition.next();

      currentPage += 1;

    } else {

      if (currentPage <= 1) {

        break;

      }

      await rendition.prev();

      currentPage -= 1;

    }

  }

  updateLocation();

}

  
document.getElementById("forward10").onclick = () => jump(10);
document.getElementById("back10").onclick = () => jump(-10);

document.querySelectorAll(".book-row").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".book-row").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  };
});


