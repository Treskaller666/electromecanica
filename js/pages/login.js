import { supa } from "../supa.js";
import { renderNav, toast } from "../ui.js";

export default async function Login() {
  await renderNav("/login");
  return `
    <div class="card">
      <h2>Iniciar sesión</h2>
      <form id="f">
        ${['email','password'].map((n,i)=>`<div>${i===0?'<label>Email</label>':''}${i===1?'<label>Contraseña</label>':''}<input class="input" name="${n}" type="${n}" /></div>`).join('')}
        <button class="button" type="submit">Entrar</button>
      </form>
      <p class="helper">Usa los usuarios que creaste en Supabase Auth.</p>
    </div>
    <script type="module">
      import { supa } from "../js/supa.js";
      import { toast } from "../js/ui.js";
      const f = document.getElementById("f");
      f.onsubmit = async (e) => {
        e.preventDefault();
        const email = f.email.value.trim();
        const password = f.password.value.trim();
        const { error } = await supa.auth.signInWithPassword({ email, password });
        if (error) { toast(error.message); return; }
        location.hash = "#/";
      };
    </script>
  `;
}
