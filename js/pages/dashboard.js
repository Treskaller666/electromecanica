import { requireAuth, supa, myMemberships } from "../supa.js";
import { renderNav } from "../ui.js";

export default async function Dashboard() {
  await requireAuth();
  await renderNav("/");
  // Mostrar últimos jobs del primer workshop del usuario
  const mbs = await myMemberships();
  const ws = mbs?.[0]?.workshop_id;
  if (!ws) return `<div class="card">No tienes taller asignado.</div>`;
  const { data, error } = await supa.from("jobs").select("*").eq("workshop_id", ws).order("creado_at", { ascending:false }).limit(10);
  if (error) return `<div class="card err">${error.message}</div>`;
  return `
    <div class="card">
      <h2>Mis Trabajos</h2>
      ${data.map(j=>`
        <div class="row">
          <div>${j.vehiculo_marca} ${j.vehiculo_modelo} ${j.vehiculo_anio}</div>
          <div class="helper">Cliente: ${j.cliente_alias} • Estado: ${j.estado}</div>
        </div>
      `).join('') || '<p>No hay trabajos aún.</p>'}
    </div>
  `;
}
