// Dados fictícios. Edite à vontade para treinar.
const jogos = [
  { id: 1, esporte: "futebol", liga: "Brasileirão", casa: "Rio Azul", fora: "Vila Verde", hora: "16:00", vivo: false, odds: [2.10, 3.30, 3.40] },
  { id: 2, esporte: "futebol", liga: "Brasileirão", casa: "Atlético Sul", fora: "Serra FC", hora: "62'", vivo: true, odds: [1.75, 3.60, 4.80] },
  { id: 3, esporte: "futebol", liga: "Copa do Nordeste", casa: "Mar Bravo", fora: "Sertão", hora: "19:30", vivo: false, odds: [2.45, 3.10, 2.90] },
  { id: 4, esporte: "basquete", liga: "NBB", casa: "Paulista Hoops", fora: "Minas Basquete", hora: "Q3 04:12", vivo: true, odds: [1.55, 2.40] },
  { id: 5, esporte: "basquete", liga: "NBB", casa: "Sul Tigers", fora: "Capital Fire", hora: "20:00", vivo: false, odds: [1.90, 1.90] },
  { id: 6, esporte: "tenis", liga: "Challenger", casa: "M. Duarte", fora: "L. Ferrer", hora: "2º set", vivo: true, odds: [1.40, 2.85] },
  { id: 7, esporte: "tenis", liga: "Challenger", casa: "T. Nunes", fora: "P. Costa", hora: "18:15", vivo: false, odds: [2.20, 1.65] },
];

const nomes = { todos: "Todos os jogos", futebol: "Futebol", basquete: "Basquete", tenis: "Tênis", "ao-vivo": "Ao vivo agora" };
let filtro = "todos";
const bilhete = {}; // idJogo -> { escolha, odd, rotulo, jogo }

const $ = (id) => document.getElementById(id);
const brl = (n) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const fmt = (n) => n.toFixed(2).replace(".", ",");

function rotulos(j) {
  return j.odds.length === 3 ? [j.casa, "Empate", j.fora] : [j.casa, j.fora];
}

function renderJogos() {
  const lista = jogos.filter((j) => filtro === "todos" || (filtro === "ao-vivo" ? j.vivo : j.esporte === filtro));
  $("titulo").textContent = nomes[filtro];
  $("lista").innerHTML = lista.map((j) => {
    const r = rotulos(j);
    const botoes = j.odds.map((o, i) => {
      const sel = bilhete[j.id] && bilhete[j.id].escolha === i ? " sel" : "";
      const sigla = j.odds.length === 3 ? ["1", "X", "2"][i] : ["1", "2"][i];
      return `<button class="odd${sel}" data-j="${j.id}" data-i="${i}" aria-pressed="${!!sel}" aria-label="${r[i]}, odd ${fmt(o)}"><small>${sigla}</small><b>${fmt(o)}</b></button>`;
    }).join("");
    return `<article class="jogo">
      <div class="meta"><span>${j.liga}</span><span class="${j.vivo ? "vivo" : ""}">${j.vivo ? "Ao vivo · " : ""}${j.hora}</span></div>
      <div class="times"><span>${j.casa}</span><span>${j.fora}</span></div>
      <div class="odds ${j.odds.length === 2 ? "dois" : ""}">${botoes}</div>
    </article>`;
  }).join("") || "<p class='vazio'>Nenhum jogo nesta categoria.</p>";
}

function renderBilhete() {
  const itens = Object.values(bilhete);
  $("qtd").textContent = $("qtd2").textContent = itens.length;
  $("itens").innerHTML = itens.length
    ? itens.map((it) => `<div class="item"><span>${it.rotulo}</span><small>${it.jogo.casa} x ${it.jogo.fora}</small><b>${fmt(it.odd)}</b><button data-rm="${it.jogo.id}">Remover</button></div>`).join("")
    : '<p class="vazio">Toque em uma odd para adicionar ao bilhete.</p>';
  const total = itens.reduce((acc, it) => acc * it.odd, 1);
  const valor = Math.max(0, parseFloat($("valor").value) || 0);
  $("odd").textContent = itens.length ? fmt(total) : "0,00";
  $("ret").textContent = itens.length ? brl(total * valor) : brl(0);
  $("fim").disabled = !itens.length || valor <= 0;
}

function alternar(idJogo, i) {
  const j = jogos.find((x) => x.id === idJogo);
  if (bilhete[idJogo] && bilhete[idJogo].escolha === i) {
    delete bilhete[idJogo];
  } else {
    bilhete[idJogo] = { escolha: i, odd: j.odds[i], rotulo: rotulos(j)[i], jogo: j };
  }
  $("msg").textContent = "";
  renderJogos();
  renderBilhete();
}

$("lista").addEventListener("click", (e) => {
  const b = e.target.closest(".odd");
  if (b) alternar(+b.dataset.j, +b.dataset.i);
});

$("itens").addEventListener("click", (e) => {
  const b = e.target.closest("[data-rm]");
  if (b) { delete bilhete[b.dataset.rm]; renderJogos(); renderBilhete(); }
});

$("tabs").addEventListener("click", (e) => {
  const t = e.target.closest(".tab");
  if (!t) return;
  filtro = t.dataset.s;
  document.querySelectorAll(".tab").forEach((x) => x.classList.toggle("on", x === t));
  renderJogos();
});

$("valor").addEventListener("input", renderBilhete);

$("limpar").addEventListener("click", () => {
  Object.keys(bilhete).forEach((k) => delete bilhete[k]);
  $("msg").textContent = "";
  renderJogos();
  renderBilhete();
});

$("fim").addEventListener("click", () => {
  $("msg").textContent = "Demonstração: nenhuma aposta real foi feita.";
});

renderJogos();
renderBilhete();