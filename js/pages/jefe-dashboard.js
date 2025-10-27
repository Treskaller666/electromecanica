import { requireAuth, supa, myMemberships, getSession } from "../supa.js";
import { renderNav } from "../ui.js";
import { EDGE_BASE } from "../config.js";

export default async function JefeDashboard() {
  await requireAuth();
  await renderNav("/jefe");
  const m = await myMemberships();
  const ws = m?.[0]?.workshop_id;
  const { data: jobs } = await supa.from("jobs").select("*").eq("workshop_id", ws).in("estado", ["en_revision","aprobado"]).order("creado_at", { ascending:false });
  return `
    <div class="card">
      <h2>Aprobaciones / Certificados</h2>
      ${(jobs||[]).map(j=>`
        <div class="row card">
          <div style="flex:1">${j.vehiculo_marca} ${j.vehiculo_modelo} ${j.vehiculo_anio} — ${j.cliente_alias} <span class="helper">[${j.estado}]</span></div>
          <button class="button" data-job="${j.id}">Emitir Certificado</button>
        </div>
      `).join('') || '<p>No hay trabajos en revisión.</p>'}
    </div>
    <script type="module">
      import { getSession } from "../js/supa.js";
      import { EDGE_BASE } from "../js/config.js";
      const buttons = [...document.querySelectorAll('button[data-job]')];
      for (const b of buttons) {
        b.onclick = async ()=>{
          const jobId = b.dataset.job;
          const sess = await getSession();
          const token = sess?.access_token;
          const res = await fetch(EDGE_BASE + "/certificates-generate", {
            method:"POST",
            headers: { "Content-Type":"application/json", "Authorization": "Bearer " + token },
            body: JSON.stringify({
              workshop_id: "${ws}",
              job_id: jobId,
              tipo: "TORQUE",
              firmante_uid: sess.user.id
            })
          });
          const j = await res.json();
          if(!res.ok){ alert(j.error || "Error"); return; }
          alert("Certificado emitido (ver Storage)"); location.reload();
        };
      }
    </script>
  `;
}
