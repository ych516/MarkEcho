const RELEASES = "https://api.github.com/repos/ych516/MarkEcho/releases/latest";

function pickWindows(assets) {
  const names = assets.map((a) => ({ a, n: a.name.toLowerCase() }));
  return (
    names.find((x) => x.n.endsWith(".exe"))?.a ||
    names.find((x) => x.n.endsWith(".msi"))?.a ||
    names.find((x) => x.n.includes("windows") || x.n.includes("win"))?.a ||
    null
  );
}

function pickMac(assets) {
  const names = assets.map((a) => ({ a, n: a.name.toLowerCase() }));
  return (
    names.find((x) => x.n.endsWith(".dmg"))?.a ||
    names.find((x) => x.n.includes("macos") || x.n.includes("mac"))?.a ||
    null
  );
}

function enable(box, asset) {
  const btn = box.querySelector("[data-role=btn]");
  const name = box.querySelector("[data-role=name]");
  btn.href = asset.browser_download_url;
  btn.removeAttribute("aria-disabled");
  btn.textContent = "下载";
  name.textContent = asset.name;
}

async function main() {
  const meta = document.getElementById("release-meta");
  const winBox = document.querySelector("[data-os=windows]");
  const macBox = document.querySelector("[data-os=mac]");
  try {
    const res = await fetch(RELEASES);
    if (res.status === 404) return;
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const assets = data.assets || [];
    const win = pickWindows(assets);
    const mac = pickMac(assets);
    if (win && winBox) enable(winBox, win);
    if (mac && macBox) enable(macBox, mac);
    if (meta && data.tag_name) {
      const parts = [];
      if (win) parts.push("Windows");
      if (mac) parts.push("macOS");
      const available = parts.length ? parts.join(" / ") + " 版已可下载" : "";
      meta.textContent = `现在是 ${data.tag_name}。${available}`;
    }
  } catch {
    if (meta) meta.textContent = "暂时下不了，过会儿再试。";
  }
}

main();
