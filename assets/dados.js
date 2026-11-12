/* =========================================================
   DADOS FICTÍCIOS
   Uma única fonte para todos os painéis. Nomes e valores
   são inventados; a estrutura e as regras seguem o projeto real.
   Totais e indicadores são calculados em comum.js, nunca digitados.
   ========================================================= */
const DADOS = {
  empresa: "Exemplo Lubrificantes",

  /* ---------- Campanhas de incentivo (BI de campanhas) ---------- */
  categorias: {
    interna:     { nome: "Equipe interna",           desc: "Vendedores das distribuidoras do grupo, sem contar supervisão" },
    multimarcas: { nome: "Distribuidor multimarcas", desc: "Distribuidores externos que vendem várias marcas" },
    varejo:      { nome: "Varejo",                   desc: "Lojas e oficinas, clientes finais das campanhas de brinde e rebate" }
  },
  campanhas: [
    { id: "meta",    nome: "Campanha de meta 2026",            categoria: "multimarcas", unidade: "R$", participantes: 96,  meses: 3, status: "Executada",    investido: 246000, vendas: 31200000 },
    { id: "alfa",    nome: "Premiação de vendedores Alfa",     categoria: "interna",     unidade: "R$", participantes: 28,  meses: 7, status: "Em andamento", investido: 41200,  vendas: 9100000 },
    { id: "beta",    nome: "Premiação de vendedores Beta",     categoria: "interna",     unidade: "R$", participantes: 19,  meses: 2, status: "Em andamento", investido: 23800,  vendas: 5600000 },
    { id: "gama",    nome: "Incentivo comercial Gama",         categoria: "interna",     unidade: "R$", participantes: 15,  meses: 1, status: "Em andamento", investido: 18900,  vendas: 4300000 },
    { id: "cam-jul", nome: "Compre e ganhe camiseta (julho)",  categoria: "varejo",      unidade: "R$", participantes: 410, meses: 1, status: "Executada",    investido: 21500,  vendas: 3700000 },
    { id: "cam-ago", nome: "Compre e ganhe camiseta (agosto)", categoria: "varejo",      unidade: "R$", participantes: 690, meses: 1, status: "Executada",    investido: 8200,   vendas: 3200000 },
    { id: "rebate",  nome: "Rebate de varejo",                 categoria: "varejo",      unidade: "R$", participantes: 310, meses: 2, status: "Em andamento", investido: 39000,  vendas: 1900000 },
    { id: "litros",  nome: "Compre e ganhe em litros",         categoria: "varejo",      unidade: "L",  participantes: 45,  meses: 5, status: "Em andamento", investido: 52000,  litros: 44500 }
  ],
  // Parceiros com menor investimento por real vendido (campanhas em R$)
  eficientes: [
    { id: "Parceiro M-112", categoria: "multimarcas", campanha: "meta", investido: 12,   vendas: 41000 },
    { id: "Parceiro M-087", categoria: "multimarcas", campanha: "meta", investido: 380,  vendas: 268000 },
    { id: "Vendedor A-07",  categoria: "interna",     campanha: "alfa", investido: 1050, vendas: 498000 },
    { id: "Parceiro M-045", categoria: "multimarcas", campanha: "meta", investido: 820,  vendas: 355000 },
    { id: "Vendedor A-11",  categoria: "interna",     campanha: "alfa", investido: 290,  vendas: 121000 },
    { id: "Vendedor B-04",  categoria: "interna",     campanha: "beta", investido: 760,  vendas: 301000 }
  ],

  /* ---------- Distribuidor próprio ---------- */
  proprio: {
    periodo: "fev a ago/2026",
    times: [
      { id: "alfa", nome: "Distribuidora Alfa", uf: "SP", campanha: "alfa",
        vendedores: [ ["Vendedor A-01", 3100, 690000], ["Vendedor A-02", 2650, 610000], ["Vendedor A-03", 2400, 575000], ["Vendedor A-04", 1980, 498000], ["Vendedor A-05", 1720, 452000] ] },
      { id: "beta", nome: "Distribuidora Beta", uf: "RJ", campanha: "beta",
        vendedores: [ ["Vendedor B-01", 2300, 540000], ["Vendedor B-02", 2050, 488000], ["Vendedor B-03", 1760, 431000], ["Vendedor B-04", 1500, 377000], ["Vendedor B-05", 1320, 342000] ] },
      { id: "gama", nome: "Distribuidora Gama", uf: "MG", campanha: "gama",
        vendedores: [ ["Vendedor G-01", 2100, 455000], ["Vendedor G-02", 1840, 410000], ["Vendedor G-03", 1610, 366000], ["Vendedor G-04", 1390, 318000], ["Vendedor G-05", 1180, 279000] ] }
    ],
    supervisao: [
      { nome: "Supervisor 1", time: "alfa", investido: 6400 },
      { nome: "Supervisor 2", time: "alfa", investido: 2100 },
      { nome: "Coordenador",  time: "gama", investido: null }
    ]
  },

  /* ---------- Distribuidor multimarcas ---------- */
  multimarcas: {
    campanha: "meta",
    comBaseline: 85, abaixo: 64, acima: 18, estavel: 3,
    mensal: [
      { mes: "mar", investido: 78000, vendas: 10400000 },
      { mes: "abr", investido: 84000, vendas: 10100000 },
      { mes: "mai", investido: 84000, vendas: 10700000 }
    ],
    quedas: [ ["Distribuidor D-041", -612000], ["Distribuidor D-007", -548000], ["Distribuidor D-063", -503000], ["Distribuidor D-022", -455000], ["Distribuidor D-088", -401000] ],
    altas:  [ ["Distribuidor D-015", 842000], ["Distribuidor D-052", 790000], ["Distribuidor D-034", 735000] ]
  },

  /* ---------- Planejamento x gasto (planilha de orçamento) ---------- */
  planejamento: {
    referencia: "jan a set/2026",
    mesesDecorridos: 9,
    baseVerba: 152400000, // previsão de vendas usada como base de cálculo; NÃO é o orçamento
    linhas: [
      { nome: "Campanha de meta trimestral",       previsto: 380000, realizado: 0 },
      { nome: "Programa de promotores de vendas",  previsto: 345000, realizado: 198500 },
      { nome: "Feiras e eventos",                  previsto: 292000, realizado: 174800 },
      { nome: "Material de ponto de venda",        previsto: 252000, realizado: 61300 },
      { nome: "Bonificação de mercadoria",         previsto: 236000, realizado: null },
      { nome: "Incentivo anual de distribuidores", previsto: 228000, realizado: null },
      { nome: "Gift card premium",                 previsto: 210000, realizado: 0 },
      { nome: "Mídia digital",                     previsto: 168000, realizado: 121900 },
      { nome: "Treinamento de balconistas",        previsto: 96000,  realizado: 58200 },
      { nome: "Demais ações (14 linhas)",          previsto: 410000, realizado: 286400 }
    ]
  },

  /* ---------- Pagamentos (controle de pagamentos) ---------- */
  pagamentos: {
    registros: 401, comErro: 286,
    porUnidade: [ ["Unidade Autopeças", 412000, 68], ["Unidade Agência", 151000, 35], ["Unidade Matriz", 359000, 12] ],
    porTipo:    [ ["Feira", 388000, 17], ["Material promocional", 193000, 45], ["Rebate", 158000, 9], ["Material de PDV", 126000, 27], ["Outros", 57000, 17] ],
    porStatus: [
      { nome: "Pago",           valor: 54000,  qtd: 10, cor: "var(--green)" },
      { nome: "Em dia",         valor: 156000, qtd: 21, cor: "var(--blue)" },
      { nome: "A vencer",       valor: 3000,   qtd: 1,  cor: "var(--muted)" },
      { nome: "Atrasado",       valor: 677000, qtd: 79, cor: "var(--red)" },
      { nome: "Sem vencimento", valor: 32000,  qtd: 4,  cor: "var(--line)" }
    ]
  },

  /* ---------- Programa de promotores (relatório de cruzamento) ---------- */
  promotor: {
    estados: "SP, MG e PR",
    abordagens: 845, comDocumento: 611, unicos: 503, recompras: 8, valorRecompra: 25900,
    porEstado: [
      { uf: "São Paulo",     contatos: 19, valor: 98400,   recompra: 19600, atipico: false },
      { uf: "Minas Gerais",  contatos: 14, valor: 54700,   recompra: 6300,  atipico: false },
      { uf: "Paraná",        contatos: 1,  valor: 1120000, recompra: 0,     atipico: true },
      { uf: "Não informado", contatos: 1,  valor: 640000,  recompra: 0,     atipico: true }
    ]
  }
};
