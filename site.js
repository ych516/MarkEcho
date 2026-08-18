
const RELEASES = "https://api.github.com/repos/ych516/MarkEcho/releases/latest";

function pickWindows(assets) {
  const names = assets.map((a) => ({ a, n: a.name.toLowerCase() }));
  return names.find((x) => x.n.endsWith(".msi"))?.a
    || names.find((x) => x.n.endsWith(".exe"))?.a
    || names.find((x) => x.n.includes("windows") || x.n.includes("win"))?.a
    || null;
}

function enable(box, asset) {
  const btn = box.querySelector("[data-role=btn]");
  const name = box.querySelector("[data-role=name]");
  btn.href = asset.browser_download_url;
  btn.removeAttribute("aria-disabled");
  btn.textContent = "下载安装包";
  name.textContent = asset.name;
}

async function main() {
  const meta = document.getElementById("release-meta");
  const box = document.querySelector("[data-os=windows]");
  try {
    const res = await fetch(RELEASES);
    if (res.status === 404) return;
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    const win = pickWindows(data.assets || []);
    if (win && box) enable(box, win);
    if (data.tag_name) {
      meta.textContent = `当前版本 ${data.tag_name}。macOS 还在验证，暂时不提供。`;
    }
  } catch (err) {
    meta.textContent = "暂时拿不到安装包，请稍后再试。macOS 还在验证，暂时不提供。";
  }
}

main();
