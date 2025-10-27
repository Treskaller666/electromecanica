import { renderRoute } from "./router.js";
import { renderNav } from "./ui.js";
import { getSession } from "./supa.js";

window.addEventListener("hashchange", renderRoute);
window.addEventListener("load", async ()=>{
  await renderNav(location.hash.replace("#","") || "/");
  await renderRoute();
  // refrescar nav cuando cambie la sesión
  const sess = await getSession();
  document.addEventListener("visibilitychange", async ()=>{
    const s2 = await getSession();
    if (!!sess !== !!s2) await renderNav(location.hash.replace("#","") || "/");
  });
});
