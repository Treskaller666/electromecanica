import { getSession, signOut } from "./supa.js";

export function toast(msg) {
  alert(msg); // simple
}

export async function renderNav(active) {
  const nav = document.getElementById("nav");
  const session = await getSession();
  if (!session) {
    nav.innerHTML = `<a href="#/login" class="${active==='/login'?'active':''}">Entrar</a>`;
    return;
  }
  nav.innerHTML = `
    <a href="#/" class="${active==='/'?'active':''}">Dashboard</a>
    <a href="#/job-new" class="${active==='/job-new'?'active':''}">Nuevo Trabajo</a>
    <a href="#/torque" class="${active==='/torque'?'active':''}">Registrar Torque</a>
    <a href="#/oem" class="${active==='/oem'?'active':''}">OEM</a>
    <a href="#/jefe" class="${active==='/jefe'?'active':''}">Jefe</a>
    <a href="#" id="logout">Salir</a>
  `;
  document.getElementById("logout").onclick = async (e) => {
    e.preventDefault();
    await signOut();
  };
}

export function input(name, placeholder, type="text") {
  return `<input class="input" name="${name}" placeholder="${placeholder}" type="${type}"/>`;
}
