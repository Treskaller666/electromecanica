import { requireAuth, supa, myMemberships } from "../supa.js";
import { renderNav, toast } from "../ui.js";

export default async function JobNew() {
  const s = await requireAuth();
  await renderNav("/job-new");
  const mbs = await myMemberships();
  const ws = mbs?.[0]?.workshop_id;
  return `
    <div class="card">
      <h2>Nuevo Trabajo</h2>
      <form id="f" class="grid grid2">
        <input class="input" name="marca" placeholder="Marca" />
        <input class="input" name="modelo" placeholder="Modelo" />
        <input class="input" name="anio" placeholder="Año" type="number" />
        <input class="input" name="patente" placeholder="Patente (opcional)" />
        <input class="input" name="vin" placeholder="VIN (opcional)" />
        <input class="input" name="cliente" placeholder="Alias cliente (seudónimo)" />
        <button class="button" type="submit">Guardar</button>
      </form>
    </div>
    <script type="module">
      import { supa } from "../js/supa.js";
      const f = document.getElementById("f");
      f.onsubmit = async (e)=>{
        e.preventDefault();
        const marca=f.marca.value.trim(), modelo=f.modelo.value.trim();
        const anio=Number(f.anio.value), cliente=f.cliente.value.trim();
        const { data: sess } = await supa.auth.getSession();
        const { data: mem } = await supa.from("memberships").select("workshop_id").eq("user_id", sess.session.user.id).limit(1).single();
        const workshop_id = mem?.workshop_id;
        if(!workshop_id) return alert("Sin taller");
        const { error } = await supa.from("jobs").insert({
          workshop_id,
          tecnico_uid: sess.session.user.id,
          vehiculo_marca: marca,
          vehiculo_modelo: modelo,
          vehiculo_anio: anio,
          patente: f.patente.value || null,
          vin: f.vin.value || null,
          cliente_alias: cliente
        });
        if (error) { alert(error.message); return; }
        alert("Trabajo creado"); location.hash="#/";
      };
    </script>
  `;
}
