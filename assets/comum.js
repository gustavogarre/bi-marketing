/* =========================================================
   COMUM: formatação, métricas derivadas e a "casca" de cada página
   (barra de navegação, cabeçalho, detalhamento por hash e rodapé).
   ========================================================= */

/* ---------- Formatação ---------- */
const nf0 = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf2 = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const brl = v => "R$ " + nf0.format(v);
function brlC(v) { // compacto: R$ 1,23 mi / R$ 412,0 mil
  const a = Math.abs(v), s = v < 0 ? "−" : "";
  if (a >= 1e6) return s + "R$ " + nf2.format(a / 1e6) + " mi";
  if (a >= 1e3) return s + "R$ " + nf1.format(a / 1e3) + " mil";
  return s + "R$ " + nf0.format(a);
}
const pct = (p, d = 1) => (d === 0 ? nf0 : d === 2 ? nf2 : nf1).format(p * 100) + "%";
const sum = (arr, f) => arr.reduce((t, x) => t + ((typeof f === "function" ? f(x) : x[f]) || 0), 0);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ---------- Métricas derivadas (tudo calculado a partir de DADOS) ---------- */
const M = (() => {
  const D = DADOS;
  const camp = id => D.campanhas.find(c => c.id === id);
  const emReais = D.campanhas.filter(c => c.unidade === "R$");

  const porCategoria = Object.keys(D.categorias).map(id => {
    const cs = D.campanhas.filter(c => c.categoria === id);
    const rs = cs.filter(c => c.unidade === "R$");
    const investido = sum(cs, "investido"), vendas = sum(rs, "vendas");
    return { id, ...D.categorias[id], participantes: sum(cs, "participantes"), investido,
             vendas, razao: sum(rs, "investido") / vendas, temLitros: cs.some(c => c.unidade === "L") };
  });

  const times = D.proprio.times.map(t => {
    const c = camp(t.campanha);
    return { ...t, vendedoresQtd: c.participantes, investido: c.investido, vendas: c.vendas, meses: c.meses, razao: c.investido / c.vendas };
  });

  const pl = D.planejamento;
  const orcamento = sum(pl.linhas, "previsto"), realizado = sum(pl.linhas, "realizado");

  const pg = D.pagamentos;
  const st = n => pg.porStatus.find(s => s.nome === n);

  const po = D.promotor;
  const poTotal = sum(po.porEstado, "valor"), poAtipico = sum(po.porEstado.filter(e => e.atipico), "valor");

  return {
    camp,
    invTotal: sum(D.campanhas, "investido"),
    vendasTotal: sum(emReais, "vendas"),
    participantesTotal: sum(D.campanhas, "participantes"),
    porCategoria,
    times,
    prInv: sum(times, "investido"), prVend: sum(times, "vendas"), prVendedores: sum(times, "vendedoresQtd"),
    supInv: sum(D.proprio.supervisao, "investido"),
    meta: camp(D.multimarcas.campanha),
    mmAbaixo: D.multimarcas.abaixo / D.multimarcas.comBaseline,
    mmAcima: D.multimarcas.acima / D.multimarcas.comBaseline,
    orcamento, realizado, saldo: orcamento - realizado, exec: realizado / orcamento,
    ritmo: pl.mesesDecorridos / 12, semRealizado: pl.linhas.filter(l => l.realizado === null).length,
    pgTotal: sum(pg.porUnidade, x => x[1]), pgQtd: sum(pg.porUnidade, x => x[2]),
    pago: st("Pago"), atrasado: st("Atrasado"),
    poTotal, poAtipico, poSemAtipico: poTotal - poAtipico
  };
})();

/* ---------- Mapa do site: grupos e painéis ---------- */
const GRUPOS = {
  campanhas: { nome: "Campanhas e incentivos", desc: "Resultado comercial das ações: vendas geradas, eficiência do investimento e comportamento da rede." },
  orcamento: { nome: "Orçamento e pagamentos", desc: "Controle financeiro do marketing: o que foi planejado, o que foi gasto e o que foi pago." }
};
const PAINEIS = [
  { id: "distribuidor-proprio", nome: "Distribuidor próprio", grupo: "campanhas",
    pergunta: "A premiação das equipes de venda do grupo está trazendo resultado?",
    publico: "Comercial e gestão das distribuidoras", fonte: "BI de campanhas",
    detalhes: ["Geral", "Alfa (SP)", "Beta (RJ)", "Gama (MG)"] },
  { id: "multimarcas", nome: "Distribuidor multimarcas", grupo: "campanhas",
    pergunta: "A campanha de meta fez os distribuidores externos venderem mais que o normal?",
    publico: "Comercial e trade marketing", fonte: "BI de campanhas",
    detalhes: ["Geral", "Campanha de meta 2026"] },
  { id: "campanhas", nome: "Por campanha", grupo: "campanhas",
    pergunta: "Qual campanha é mais eficiente, mesmo com durações diferentes?",
    publico: "Marketing", fonte: "BI de campanhas",
    detalhes: ["Comparativo", "Parceiros mais eficientes"] },
  { id: "categorias", nome: "Por categoria", grupo: "campanhas",
    pergunta: "Onde o investimento rende mais: equipe interna, multimarcas ou varejo?",
    publico: "Diretoria e marketing", fonte: "BI de campanhas",
    detalhes: [] },
  { id: "promotor", nome: "Promotores", grupo: "campanhas",
    pergunta: "Quanto as abordagens dos promotores geraram em vendas?",
    publico: "Trade marketing", fonte: "Relatório de cruzamento promotores x vendas",
    detalhes: [] },
  { id: "planejamento", nome: "Planejamento x gasto", grupo: "orcamento",
    pergunta: "Quanto do orçamento anual já foi executado, linha por linha?",
    publico: "Marketing e controladoria", fonte: "Planilha de orçamento",
    detalhes: [] },
  { id: "pagamentos", nome: "Pagamentos", grupo: "orcamento",
    pergunta: "Quanto já foi pago, quanto está atrasado e com quem?",
    publico: "Financeiro e marketing", fonte: "Controle de pagamentos",
    detalhes: [] }
];

/* ---------- Componentes ---------- */
const icAlert = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>';
const icInfo  = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
const nota = (tipo, html) => `<div class="note ${tipo}">${tipo === "warn" ? icAlert : icInfo}<div>${html}</div></div>`;
const kpi = (l, v, h = "", cls = "") => `<div class="kpi"><div class="l">${l}</div><div class="v ${cls}">${v}</div>${h ? `<div class="h">${h}</div>` : ""}</div>`;
const kpis = (...k) => `<div class="kpis">${k.join("")}</div>`;
const barra = (p, rotulo, cls = "") => `<div class="bar ${cls}" role="img" aria-label="${esc(rotulo)}"><i style="width:${Math.max(0, Math.min(p, 1)) * 100}%"></i></div>`;
const statusTag = s => `<span class="tag ${s === "Executada" ? "ok" : "run"}">${s}</span>`;

/* ---------- Casca da página ---------- */
const Painel = {
  montar(opts) {
    const root = document.body.dataset.root || "";
    const atual = document.body.dataset.painel;
    const info = PAINEIS.find(p => p.id === atual);
    const app = document.getElementById("app");

    // Barra do site, com separador entre os grupos
    let navHtml = "", grupoAnt = null;
    PAINEIS.forEach(p => {
      if (grupoAnt && p.grupo !== grupoAnt) navHtml += '<span class="sep" aria-hidden="true"></span>';
      navHtml += `<a href="${root}paineis/${p.id}.html"${p.id === atual ? ' aria-current="page"' : ""}>${p.nome}</a>`;
      grupoAnt = p.grupo;
    });

    const views = opts.views, ids = Object.keys(views);
    const subnav = ids.length > 1
      ? `<nav class="subnav" aria-label="Detalhamento">${ids.map(id => `<a href="#${id}" data-v="${id}">${views[id].tab}</a>`).join("")}</nav>` : "";

    const cabecalho = info ? `
      <div class="crumb"><a href="${root}index.html">Visão geral</a> / ${GRUPOS[info.grupo].nome}</div>
      <h1 id="titulo">${info.nome}</h1>
      <p class="sub">${info.pergunta}</p>
      <div class="meta"><span class="pill">Para: <b>${info.publico}</b></span><span class="pill">Fonte: <b>${info.fonte}</b></span></div>`
      : opts.cabecalho;

    app.innerHTML = `
      <div class="sitebar"><div class="in">
        <a class="home" href="${root}index.html"${!info ? ' aria-current="page"' : ""}>BI de Marketing</a>
        <nav aria-label="Painéis">${navHtml}</nav>
      </div></div>
      <div class="wrap">
        <header class="top"><div>${cabecalho}</div><span class="demo-tag">Dados fictícios</span></header>
        ${subnav}
        <main id="view" tabindex="-1"></main>
        <footer>
          <span>${DADOS.empresa} é uma empresa fictícia. Nomes e valores não representam dados reais.</span>
          <span>Projeto de portfólio desenvolvido com apoio de IA (Claude).</span>
        </footer>
      </div>`;

    const viewEl = document.getElementById("view");
    const rota = foco => {
      const id = views[location.hash.slice(1)] ? location.hash.slice(1) : ids[0];
      viewEl.innerHTML = views[id].render();
      if (views[id].after) views[id].after();
      app.querySelectorAll(".subnav a").forEach(a => a.dataset.v === id ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
      document.title = (info ? info.nome : "Visão geral") + (ids.length > 1 && id !== ids[0] ? " | " + views[id].tab : "") + " | BI de Marketing";
      if (foco) viewEl.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", () => rota(true));
    rota(false);
  }
};
