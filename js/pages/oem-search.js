import { requireAuth } from "../supa.js";
import { renderNav } from "../ui.js";
import { EDGE_BASE } from "../config.js";

export default async function OemSearchPage() {
  await requireAuth();
  await renderNav("/oem");
  return `
    <div class="card">
      <h2>Buscar OEM</h2>
      <div class="grid grid2">
        <input class="input" id="marca" placeholder="Marca" />
        <input class="input" id="modelo" placeholder="Modelo" />
        <input class="input" id="anio" placeholder="Año" type="number" />
        <input class="input" id="comp" placeholder="Componente" />
      </div>
      <div class="row" style="margin:12px 0">
        <button class="button" id="buscar">Buscar</button>
      </div>
      <div id="res"></div>
    </div>
    <script type="module">
      import { EDGE_BASE } from "../js/config.js";
      const res = document.getElementById("res");
      document.getElementById("buscar").onclick = async ()=>{
        const m = marca.value.trim(), mo = modelo.value.trim(), a = anio.value.trim(), c = comp.value.trim();
        const url = EDGE_BASE + "/oem-search?marca="+encodeURIComponent(m)+"&modelo="+encodeURIComponent(mo)+"&anio="+encodeURIComponent(a)+"&componente="+encodeURIComponent(c);
        const r = await fetch(url);
        const j = await r.json();
        res.innerHTML = (j.data||[]).map(x=>\`<div class="card">\${x.marca} \${x.modelo} \${x.anio} — \${x.componente} [\${x.torque_min_nm}–\${x.torque_max_nm} Nm]</div>\`).join('') || '<p>No hay resultados.</p>';
      };
    </script>
  `;
}
