const RELEASES = "https://api.github.com/repos/ych516/MarkEcho/releases/latest";

function pickWindows(assets) {
  const names = assets.map((a) => ({ a, n: a.name.toLowerCase() }));
  return names.find((x) => x.n.endsWith(".msi"))?.a
    || names.find((x) => x.n.endsWith(".exe"))?.a
    || names.find((x) => x.n.includes("windows") || x.n.includes("win"))?.a
    || null;
}

function enable(card, asset) {
  const btn = card.querySelector("[data-role=btn]");
  const name = card.querySelector("[data-role=name]");
  btn.href = asset.browser_download_url;
  btn.removeAttribute("aria-disabled");
  btn.textContent = "下载安装包";
  name.textContent = asset.name;
}

async function main() {
  const meta = document.getElementById("release-meta");
  try {
    const res = await fetch(RELEASES);
    if (res.status === 404) return;
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const win = pickWindows(data.assets || []);
    const winCard = document.querySelector('[data-os="windows"]');
    if (win && winCard) enable(winCard, win);
    if (data.tag_name) {
      meta.textContent = `当前版本 ${data.tag_name} · Windows 安装包来自本仓库 GitHub Releases。`;
    }
  } catch (err) {
    meta.textContent = "暂时读不到 Releases，过一会儿再试，或打开上方 Releases 页面。";
  }
}

main();
