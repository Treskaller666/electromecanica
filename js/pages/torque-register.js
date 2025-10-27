import { requireAuth, supa, myMemberships } from "../supa.js";
import { renderNav } from "../ui.js";

export default async function TorqueRegister() {
  await requireAuth();
  await renderNav("/torque");
  const mbs = await myMemberships();
  const ws = mbs?.[0]?.workshop_id;
  // Traer últimos jobs del taller para seleccionar
  const { data: jobs } = await supa.from("jobs").select("id, vehiculo_marca, vehiculo_modelo, vehiculo_anio").eq("workshop_id", ws).order("creado_at",{ascending:false}).limit(10);
  return `
    <div class="card">
      <h2>Registrar Torque</h2>
      <form id="f" class="grid">
        <select class="input" name="job">
          ${(jobs||[]).map(j=>`<option value="${j.id}">${j.vehiculo_marca} ${j.vehiculo_modelo} ${j.vehiculo_anio}</option>`).join('')}
        </select>
        <input class="input" name="componente" placeholder="Componente (p.ej. rueda_delantera_izq)" />
        <input class="input" name="herramienta" placeholder="Herramienta UUID" />
        <div class="grid grid2">
          <input class="input" name="setpoint" placeholder="Setpoint (Nm)" type="number" step="0.1" />
          <input class="input" name="medido" placeholder="Medido (Nm)" type="number" step="0.1" />
        </div>
        <input class="input" name="oem" placeholder="OEM Ref ID (opcional)" />
        <button class="button" type="submit">Guardar</button>
      </form>
      <p class="helper">Si la herramienta está vencida o el medido queda fuera de rango OEM, la BD lo validará por trigger.</p>
    </div>
    <script type="module">
      import { supa } from "../js/supa.js";
      import { myMemberships } from "../js/supa.js";
      const f = document.getElementById("f");
      f.onsubmit = async (e)=>{
        e.preventDefault();
        const mbs = await myMemberships();
        const ws = mbs?.[0]?.workshop_id;
        const { error } = await supa.from("torque_events").insert({
          workshop_id: ws,
          job_id: f.job.value,
          componente: f.componente.value.trim(),
          herramienta_id: f.herramienta.value.trim(),
          setpoint_nm: Number(f.setpoint.value),
          medido_nm: Number(f.medido.value),
          oem_ref_id: f.oem.value ? f.oem.value.trim() : null
        });
        if (error) { alert(error.message); return; }
        alert("Evento registrado (trigger calculó dentro_rango).");
        location.hash = "#/";
      };
    </script>
  `;
}
