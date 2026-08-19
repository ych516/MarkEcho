const RELEASES = "https://api.github.com/repos/ych516/MarkEcho/releases/latest";

function pick(assets, tests) {
  const lowered = assets.map((a) => ({ a, n: a.name.toLowerCase() }));
  for (const test of tests) {
    const found = lowered.find((x) => test(x.n));
    if (found) return found.a;
  }
  return null;
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
    if (res.status === 404) {
      if (meta) meta.textContent = "尚未发布正式版本，敬请期待。";
      return;
    }
    if (!res.ok) throw new Error(res.status);
    const data = await res.json();
    const assets = data.assets || [];

    const win = pick(assets, [
      (n) => n.endsWith(".exe"),
      (n) => n.endsWith(".msi"),
      (n) => n.includes("windows") || n.includes("win"),
    ]);
    const mac = pick(assets, [
      (n) => n.endsWith(".dmg"),
      (n) => n.includes("macos") || n.includes("mac"),
    ]);

    if (win && winBox) enable(winBox, win);
    if (mac && macBox) enable(macBox, mac);

    if (meta && data.tag_name) {
      const available = [win && "Windows", mac && "macOS"].filter(Boolean).join(" / ");
      meta.textContent = `当前版本 ${data.tag_name}${available ? "　· 　" + available + " 版已可下载" : ""}`;
    }
  } catch {
    if (meta) meta.textContent = "暂时无法获取版本信息，请稍后再试。";
  }
}

main();
