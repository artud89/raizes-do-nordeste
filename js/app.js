// Script principal da interface - Raízes do Nordeste
// Manoel Neto - RU 5079070

import {
  UNIDADES,
  CARDAPIO,
  CAMPANHAS,
  RECOMPENSAS,
  CLIENTE_EXEMPLO
} from "./mockData.js";

const CHAVE_STORAGE = "raizes_nordeste_dados_v2";
const ETAPAS_PEDIDO = ["Recebido", "Em Preparo", "Pronto para Retirada", "Entregue"];

let estado = carregarEstado();

function criarEstadoInicial() {
  return {
    canal: "web",
    unidadeId: UNIDADES[0].id,
    categoriaAtiva: "Todos",
    usuario: null,
    sacola: [],
    cupomAplicado: null,
    descontoResgatado: 0,
    pedidos: [],
    avisoLgpdFechado: false,
    auditoria: [
      {
        horario: new Date().toLocaleTimeString("pt-BR"),
        origem: "Sistema",
        detalhe: "Acesso iniciado sem coleta automática de dados pessoais."
      }
    ]
  };
}

function carregarEstado() {
  try {
    const salvo = localStorage.getItem(CHAVE_STORAGE);
    if (!salvo) return criarEstadoInicial();
    return { ...criarEstadoInicial(), ...JSON.parse(salvo) };
  } catch (e) {
    return criarEstadoInicial();
  }
}

function salvarEstado() {
  localStorage.setItem(CHAVE_STORAGE, JSON.stringify(estado));
}

function registrarLog(origem, detalhe) {
  estado.auditoria.unshift({
    horario: new Date().toLocaleTimeString("pt-BR"),
    origem,
    detalhe
  });
  if (estado.auditoria.length > 25) estado.auditoria.pop();
  salvarEstado();
}

function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function obterUnidadeAtual() {
  return UNIDADES.find((u) => u.id === estado.unidadeId) || UNIDADES[0];
}

// Inicialização da página
const seletorCanal = document.getElementById("seletorCanal");
const seletorUnidade = document.getElementById("seletorUnidade");
const btnAbrirConta = document.getElementById("btnAbrirConta");

function iniciar() {
  UNIDADES.forEach((u) => {
    const op = document.createElement("option");
    op.value = u.id;
    op.textContent = `${u.nome} (${u.porte})`;
    seletorUnidade.appendChild(op);
  });

  seletorCanal.value = estado.canal;
  seletorUnidade.value = estado.unidadeId;
  atualizarClasseCanal();

  if (estado.avisoLgpdFechado) {
    document.getElementById("barraLgpd").classList.add("oculto");
  }

  configurarEventos();
  atualizarTela();
}

function configurarEventos() {
  seletorCanal.addEventListener("change", (e) => {
    estado.canal = e.target.value;
    atualizarClasseCanal();
    registrarLog("Interface", `Modo de tela alterado para ${estado.canal.toUpperCase()}.`);
    atualizarTela();
  });

  seletorUnidade.addEventListener("change", (e) => {
    estado.unidadeId = e.target.value;
    // limpa a sacola ao trocar de loja para não misturar estoque e disponibilidade
    estado.sacola = [];
    registrarLog("Cliente", `Trocou para a loja: ${obterUnidadeAtual().nome}.`);
    atualizarTela();
  });

  document.querySelectorAll(".aba").forEach((btn) => {
    btn.addEventListener("click", () => trocarAba(btn.dataset.secao));
  });

  btnAbrirConta.addEventListener("click", () => abrirModal("modalConta"));

  document.querySelectorAll("[data-fechar]").forEach((btn) => {
    btn.addEventListener("click", () => fecharModal(btn.dataset.fechar));
  });

  document.getElementById("btnPreencherTeste").addEventListener("click", () => {
    document.getElementById("inpNome").value = CLIENTE_EXEMPLO.nome;
    document.getElementById("inpEmail").value = CLIENTE_EXEMPLO.email;
    document.getElementById("inpIdade").value = CLIENTE_EXEMPLO.faixaEtaria;
    document.getElementById("chkAceiteCadastro").checked = true;
  });

  document.getElementById("formConta").addEventListener("submit", salvarIdentificacao);
  document.getElementById("btnSairConta").addEventListener("click", sairDaConta);

  document.getElementById("btnAplicarCupom").addEventListener("click", aplicarCupom);
  document.getElementById("btnIrPagamento").addEventListener("click", abrirTelaPagamento);
  document.getElementById("btnConfirmarPagamento").addEventListener("click", dispararPagamentoExterno);

  document.getElementById("formLgpd").addEventListener("submit", salvarPreferenciasLgpd);
  document.getElementById("btnBaixarDados").addEventListener("click", exportarDadosJson);
  document.getElementById("btnAnonimizar").addEventListener("click", anonimizarConta);

  document.getElementById("btnFecharBarraLgpd").addEventListener("click", () => {
    estado.avisoLgpdFechado = true;
    document.getElementById("barraLgpd").classList.add("oculto");
    registrarLog("LGPD", "Cliente confirmou leitura do aviso inferior de privacidade.");
    atualizarTela();
  });

  document.getElementById("linkIrPrivacidade").addEventListener("click", (e) => {
    e.preventDefault();
    trocarAba("privacidade");
  });
}

function atualizarClasseCanal() {
  document.body.classList.remove("canal-web", "canal-app", "canal-totem");
  document.body.classList.add(`canal-${estado.canal}`);
  const nomes = { web: "Site Web", app: "App Celular", totem: "Totem Loja" };
  document.getElementById("etiquetaCanal").textContent = nomes[estado.canal];
}

function trocarAba(nomeSecao) {
  document.querySelectorAll(".aba").forEach((b) => {
    b.classList.toggle("ativa", b.dataset.secao === nomeSecao);
  });
  document.querySelectorAll(".secao").forEach((s) => {
    s.classList.toggle("ativa", s.id === `secao-${nomeSecao}`);
  });
}

function atualizarTela() {
  if (estado.usuario) {
    btnAbrirConta.textContent = `${estado.usuario.nome.split(" ")[0]} (${estado.usuario.pontos} pts)`;
  } else {
    btnAbrirConta.textContent = "Minha Conta";
  }

  montarResumoUnidade();
  montarFiltrosCategoria();
  montarCardapio();
  montarSacola();
  montarFidelidade();
  montarPedidos();
  montarPrivacidade();
  montarPainelOperacao();
  salvarEstado();
}

function montarResumoUnidade() {
  const u = obterUnidadeAtual();
  document.getElementById("resumoUnidade").innerHTML = `
    <strong>${u.nome}</strong>
    <div class="aviso-unidade-detalhes">
      <span>Estrutura: <strong>${u.porte}</strong></span>
      <span>Tempo médio: <strong>~${u.tempoMedioMin} min</strong></span>
      <span>Funcionamento: ${u.horario}</span>
      <span>${u.observacaoRegional}</span>
    </div>
  `;
}

function montarFiltrosCategoria() {
  const itensDaLoja = CARDAPIO.filter((p) => p.unidadesDisponiveis.includes(estado.unidadeId));
  const categorias = ["Todos", ...new Set(itensDaLoja.map((p) => p.categoria))];
  const div = document.getElementById("filtrosCategoria");
  div.innerHTML = "";

  categorias.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `filtro-btn ${estado.categoriaAtiva === cat ? "ativo" : ""}`;
    b.textContent = cat;
    b.addEventListener("click", () => {
      estado.categoriaAtiva = cat;
      montarFiltrosCategoria();
      montarCardapio();
    });
    div.appendChild(b);
  });
}

function montarCardapio() {
  const filtrados = CARDAPIO.filter((p) => {
    const disponivelNaLoja = p.unidadesDisponiveis.includes(estado.unidadeId);
    const mesmaCat = estado.categoriaAtiva === "Todos" || p.categoria === estado.categoriaAtiva;
    return disponivelNaLoja && mesmaCat;
  });

  const grade = document.getElementById("listaProdutos");
  grade.innerHTML = "";

  filtrados.forEach((p) => {
    const qtdEstoque = p.estoque[estado.unidadeId] ?? 0;
    const obsRegional = p.notaRegional[estado.unidadeId];
    const item = document.createElement("article");
    item.className = "produto-item";
    item.innerHTML = `
      <div>
        <div class="produto-topo">
          <h3>${p.nome}</h3>
          ${p.selo ? `<span class="etiqueta ${p.sazonal ? "etiqueta-sazonal" : ""}">${p.selo}</span>` : ""}
        </div>
        <p class="produto-desc">${p.descricao}</p>
        ${obsRegional ? `<div class="obs-regional">${obsRegional}</div>` : ""}
      </div>
      <div class="produto-rodape">
        <div>
          <span class="preco">${moeda(p.preco)}</span>
          <div class="info-estoque">Disponível: ${qtdEstoque} un &bull; Gera +${p.pontos} pts</div>
        </div>
        <button class="botao botao-primario botao-pequeno" type="button" ${qtdEstoque <= 0 ? "disabled" : ""}>
          ${qtdEstoque > 0 ? "Adicionar" : "Indisponível"}
        </button>
      </div>
    `;
    item.querySelector("button").addEventListener("click", () => adicionarNaSacola(p.id));
    grade.appendChild(item);
  });
}

function adicionarNaSacola(produtoId) {
  const prod = CARDAPIO.find((p) => p.id === produtoId);
  const limite = prod.estoque[estado.unidadeId] ?? 0;
  const existente = estado.sacola.find((item) => item.id === produtoId);

  if (existente) {
    if (existente.qtd >= limite) {
      alert(`A unidade atual só possui ${limite} unidades de "${prod.nome}" disponíveis no estoque.`);
      return;
    }
    existente.qtd += 1;
  } else {
    estado.sacola.push({ id: produtoId, qtd: 1 });
  }
  montarSacola();
  salvarEstado();
}

function alterarQuantidade(produtoId, delta) {
  const idx = estado.sacola.findIndex((i) => i.id === produtoId);
  if (idx === -1) return;
  const prod = CARDAPIO.find((p) => p.id === produtoId);
  const limite = prod.estoque[estado.unidadeId] ?? 0;
  const novaQtd = estado.sacola[idx].qtd + delta;

  if (novaQtd <= 0) {
    estado.sacola.splice(idx, 1);
  } else if (novaQtd <= limite) {
    estado.sacola[idx].qtd = novaQtd;
  } else {
    alert(`Quantidade máxima em estoque (${limite}) atingida.`);
  }
  montarSacola();
  salvarEstado();
}

function calcularValores() {
  let subtotal = 0;
  let pontos = 0;

  estado.sacola.forEach((item) => {
    const prod = CARDAPIO.find((p) => p.id === item.id);
    if (prod) {
      subtotal += prod.preco * item.qtd;
      pontos += prod.pontos * item.qtd;
    }
  });

  let desconto = 0;
  if (estado.usuario && estado.usuario.consentimentoLgpd.fidelidadeHistorico && estado.usuario.pontos >= 100) {
    desconto += subtotal * 0.05;
  }
  if (estado.cupomAplicado) {
    desconto += subtotal * (estado.cupomAplicado.percentualDesconto / 100);
  }
  desconto += estado.descontoResgatado || 0;
  if (desconto > subtotal) desconto = subtotal;

  return {
    subtotal,
    desconto,
    total: Math.max(0, subtotal - desconto),
    pontosGerados: pontos
  };
}

function montarSacola() {
  const div = document.getElementById("itensSacola");
  const btnPag = document.getElementById("btnIrPagamento");

  if (estado.sacola.length === 0) {
    div.innerHTML = `<p class="texto-vazio">Nenhum item adicionado ainda.</p>`;
    btnPag.disabled = true;
  } else {
    div.innerHTML = "";
    estado.sacola.forEach((item) => {
      const prod = CARDAPIO.find((p) => p.id === item.id);
      const linha = document.createElement("div");
      linha.className = "linha-sacola";
      linha.innerHTML = `
        <div>
          <strong>${prod.nome}</strong>
          <div class="texto-apoio">${moeda(prod.preco * item.qtd)}</div>
        </div>
        <div class="controles-qtd">
          <button class="btn-qtd" type="button" aria-label="Remover um">-</button>
          <span>${item.qtd}</span>
          <button class="btn-qtd" type="button" aria-label="Adicionar mais um">+</button>
        </div>
      `;
      const [btnMenos, btnMais] = linha.querySelectorAll(".btn-qtd");
      btnMenos.addEventListener("click", () => alterarQuantidade(item.id, -1));
      btnMais.addEventListener("click", () => alterarQuantidade(item.id, 1));
      div.appendChild(linha);
    });
    btnPag.disabled = false;
  }

  const calc = calcularValores();
  document.getElementById("valorSubtotal").textContent = moeda(calc.subtotal);
  document.getElementById("valorDesconto").textContent = `- ${moeda(calc.desconto)}`;
  document.getElementById("valorTotal").textContent = moeda(calc.total);
  document.getElementById("previaPontos").textContent = `${calc.pontosGerados} pts`;
}

function aplicarCupom() {
  const codigo = document.getElementById("campoCupom").value.trim().toUpperCase();
  const msg = document.getElementById("msgCupom");
  const camp = CAMPANHAS.find((c) => c.cupom === codigo);

  if (!camp) {
    estado.cupomAplicado = null;
    msg.textContent = "Cupom não encontrado. Cupons ativos: SAOJOAO10 ou RETIRADA15.";
    msg.style.color = "var(--vermelho)";
  } else {
    estado.cupomAplicado = camp;
    msg.textContent = `Cupom ${camp.cupom} aplicado (${camp.percentualDesconto}% de desconto).`;
    msg.style.color = "var(--verde)";
    registrarLog("Promoção", `Cupom ${camp.cupom} inserido na sacola.`);
  }
  montarSacola();
  salvarEstado();
}

// Modais e Conta
function abrirModal(id) {
  const modal = document.getElementById(id);
  if (id === "modalConta") {
    const logadoBox = document.getElementById("blocoUsuarioLogado");
    const form = document.getElementById("formConta");
    if (estado.usuario) {
      logadoBox.classList.remove("oculto");
      form.classList.add("oculto");
      document.getElementById("lblNomeUsuario").textContent = estado.usuario.nome;
      document.getElementById("lblIdUsuario").textContent = estado.usuario.id;
      document.getElementById("lblNivelUsuario").textContent = estado.usuario.nivel;
      document.getElementById("lblPontosUsuario").textContent = estado.usuario.pontos;
    } else {
      logadoBox.classList.add("oculto");
      form.classList.remove("oculto");
    }
  }
  modal.classList.remove("oculto");
}

function fecharModal(id) {
  document.getElementById(id).classList.add("oculto");
}

function salvarIdentificacao(e) {
  e.preventDefault();
  const nome = document.getElementById("inpNome").value.trim();
  const email = document.getElementById("inpEmail").value.trim();
  const faixaEtaria = document.getElementById("inpIdade").value;
  const aceitouLgpd = document.getElementById("chkAceiteCadastro").checked;
  const msg = document.getElementById("msgConta");

  if (!nome || !email || !aceitouLgpd) {
    msg.textContent = "Para continuar é obrigatório preencher nome, e-mail e marcar o aceite da LGPD.";
    msg.style.color = "var(--vermelho)";
    return;
  }

  estado.usuario = {
    id: `CLI-${Math.floor(100000 + Math.random() * 900000)}`,
    nome,
    email,
    faixaEtaria,
    pontos: CLIENTE_EXEMPLO.pontos,
    nivel: CLIENTE_EXEMPLO.nivel,
    consentimentoLgpd: {
      essencialPedido: true,
      fidelidadeHistorico: true,
      campanhasMarketing: false,
      dataAceite: new Date().toLocaleString("pt-BR")
    }
  };
  registrarLog("Autenticação", `Cliente ${nome} autenticado com aceite explícito da LGPD.`);
  fecharModal("modalConta");
  atualizarTela();
}

function sairDaConta() {
  registrarLog("Autenticação", `Cliente ${estado.usuario?.nome || ""} desconectou.`);
  estado.usuario = null;
  fecharModal("modalConta");
  atualizarTela();
}

// Fluxo de Pagamento Externo
function abrirTelaPagamento() {
  if (!estado.usuario) {
    alert("Identifique-se antes de enviar o pedido (você pode clicar em 'Usar cliente de teste').");
    abrirModal("modalConta");
    return;
  }
  const calc = calcularValores();
  document.getElementById("lblValorPagamento").textContent = moeda(calc.total);
  const statusBox = document.getElementById("caixaStatusPagamento");
  statusBox.className = "status-pag oculto";
  statusBox.textContent = "";
  abrirModal("modalPagamento");
}

function dispararPagamentoExterno() {
  const metodo = document.getElementById("selMetodoPag").value;
  const resultadoSimulado = document.getElementById("selSimulacaoRetorno").value;
  const statusBox = document.getElementById("caixaStatusPagamento");
  const btn = document.getElementById("btnConfirmarPagamento");

  btn.disabled = true;
  statusBox.className = "status-pag aguardando";
  statusBox.textContent = `Comunicando com serviço externo (${metodo})... Aguardando confirmação.`;
  registrarLog("Pagamento Externo", `Solicitação enviada à operadora externa (${metodo}).`);

  setTimeout(() => {
    btn.disabled = false;
    if (resultadoSimulado === "aprovado") {
      statusBox.className = "status-pag sucesso";
      statusBox.textContent = "Confirmado pela operadora! Seu pedido foi encaminhado para a cozinha.";
      registrarPedidoConfirmado(metodo);
      setTimeout(() => {
        fecharModal("modalPagamento");
        trocarAba("pedidos");
      }, 900);
    } else if (resultadoSimulado === "recusado") {
      statusBox.className = "status-pag erro";
      statusBox.textContent = "Pagamento recusado pela operadora externa. Sua sacola foi mantida para tentar outra forma.";
      registrarLog("Pagamento Externo", "Operadora retornou recusa de pagamento.");
    } else {
      statusBox.className = "status-pag erro";
      statusBox.textContent = "Tempo esgotado (Timeout) ao aguardar o serviço externo. Nenhum valor foi cobrado e sua sacola continua salva.";
      registrarLog("Pagamento Externo", "Falha de comunicação (timeout) tratada sem perda do pedido.");
    }
    montarPrivacidade();
  }, 850);
}

function registrarPedidoConfirmado(formaPagamento) {
  const calc = calcularValores();
  const modalidade = document.querySelector('input[name="tipoEntrega"]:checked')?.value || "Retirada Rápida (Pick-up)";
  const loja = obterUnidadeAtual();

  const novoPedido = {
    codigo: `PED-${Date.now().toString().slice(-5)}`,
    lojaNome: loja.nome,
    canalOrigem: estado.canal.toUpperCase(),
    modalidade,
    itens: estado.sacola.map((i) => {
      const p = CARDAPIO.find((c) => c.id === i.id);
      return { nome: p.nome, qtd: i.qtd };
    }),
    valorPago: calc.total,
    formaPagamento,
    status: "Recebido"
  };

  estado.pedidos.unshift(novoPedido);
  if (estado.usuario && estado.usuario.consentimentoLgpd.fidelidadeHistorico) {
    estado.usuario.pontos += calc.pontosGerados;
  }
  estado.sacola = [];
  estado.cupomAplicado = null;
  estado.descontoResgatado = 0;
  registrarLog("Pedido", `Pedido ${novoPedido.codigo} criado após retorno positivo do pagamento externo.`);
  atualizarTela();
}

function montarFidelidade() {
  const divSaldo = document.getElementById("painelSaldoPontos");
  if (!estado.usuario) {
    divSaldo.innerHTML = `
      <div class="cartao">
        <h3>Identifique-se para usar seus pontos</h3>
        <p class="texto-apoio">Clique em "Minha Conta" no topo da página para consultar seu saldo e liberar resgates.</p>
      </div>
    `;
  } else {
    divSaldo.innerHTML = `
      <div class="cartao">
        <h3>Pontuação Acumulada</h3>
        <p class="preco">${estado.usuario.pontos} pontos</p>
        <p class="texto-apoio">${estado.usuario.nivel}</p>
      </div>
      <div class="cartao">
        <h3>Como funciona</h3>
        <p class="texto-apoio">Acima de 100 pontos você recebe 5% de desconto progressivo automático se o consentimento de fidelidade estiver ativo na LGPD.</p>
      </div>
    `;
  }

  const divRec = document.getElementById("listaRecompensas");
  divRec.innerHTML = "";
  RECOMPENSAS.forEach((r) => {
    const podeTrocar = estado.usuario && estado.usuario.pontos >= r.custoPontos;
    const card = document.createElement("div");
    card.className = "cartao";
    card.innerHTML = `
      <h4>${r.titulo}</h4>
      <p class="texto-apoio">Necessário: <strong>${r.custoPontos} pts</strong> (Abate ${moeda(r.valorAbatimento)})</p>
      <button class="botao botao-secundario botao-pequeno" type="button" ${podeTrocar ? "" : "disabled"}>
        Usar pontos na sacola
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      estado.usuario.pontos -= r.custoPontos;
      estado.descontoResgatado = (estado.descontoResgatado || 0) + r.valorAbatimento;
      registrarLog("Fidelidade", `Resgate de "${r.titulo}" aplicado (-${r.custoPontos} pts).`);
      atualizarTela();
      trocarAba("cardapio");
    });
    divRec.appendChild(card);
  });

  const divCamp = document.getElementById("listaCampanhas");
  divCamp.innerHTML = "";
  CAMPANHAS.forEach((c) => {
    const card = document.createElement("div");
    card.className = "cartao";
    card.innerHTML = `
      <span class="etiqueta">Cupom: ${c.cupom}</span>
      <h4>${c.titulo}</h4>
      <p class="texto-apoio">${c.descricao}</p>
      <p class="texto-apoio"><strong>Regra:</strong> ${c.publicoAlvo}</p>
    `;
    divCamp.appendChild(card);
  });
}

function montarPedidos() {
  document.getElementById("contadorPedidos").textContent = estado.pedidos.length;
  const div = document.getElementById("listaPedidosCliente");
  if (estado.pedidos.length === 0) {
    div.innerHTML = `<p class="texto-vazio">Você ainda não enviou nenhum pedido nesta sessão.</p>`;
    return;
  }

  div.innerHTML = "";
  estado.pedidos.forEach((ped) => {
    const idxAtual = ETAPAS_PEDIDO.indexOf(ped.status);
    const card = document.createElement("div");
    card.className = "cartao-pedido";
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:0.4rem;">
        <strong>${ped.codigo} &mdash; ${ped.lojaNome}</strong>
        <span class="etiqueta">${ped.canalOrigem} &bull; ${ped.modalidade}</span>
      </div>
      <p class="texto-apoio">Forma de pagamento: ${ped.formaPagamento} &bull; Valor: <strong>${moeda(ped.valorPago)}</strong></p>
      <ul class="texto-apoio">${ped.itens.map((i) => `<li>${i.qtd}x ${i.nome}</li>`).join("")}</ul>
      <div class="trilha-status">
        ${
          ped.status === "Cancelado"
            ? `<span class="etapa-status cancelada">Pedido Cancelado (Registrado na Auditoria)</span>`
            : ETAPAS_PEDIDO.map((etapa, i) => `<span class="etapa-status ${i <= idxAtual ? "concluida" : ""}">${etapa}</span>`).join("")
        }
      </div>
    `;
    div.appendChild(card);
  });
}

function montarPrivacidade() {
  const chkFid = document.getElementById("chkLgpdFidelidade");
  const chkMkt = document.getElementById("chkLgpdMarketing");
  if (estado.usuario) {
    chkFid.checked = !!estado.usuario.consentimentoLgpd.fidelidadeHistorico;
    chkMkt.checked = !!estado.usuario.consentimentoLgpd.campanhasMarketing;
  } else {
    chkFid.checked = false;
    chkMkt.checked = false;
  }

  const ul = document.getElementById("listaAuditoria");
  ul.innerHTML = estado.auditoria
    .map((item) => `<li><strong>[${item.horario}] ${item.origem}:</strong> ${item.detalhe}</li>`)
    .join("");
}

function salvarPreferenciasLgpd(e) {
  e.preventDefault();
  const msg = document.getElementById("msgLgpd");
  if (!estado.usuario) {
    msg.textContent = "Identifique-se em 'Minha Conta' antes de gravar as opções do seu perfil.";
    msg.style.color = "var(--terracota)";
    return;
  }
  estado.usuario.consentimentoLgpd.fidelidadeHistorico = document.getElementById("chkLgpdFidelidade").checked;
  estado.usuario.consentimentoLgpd.campanhasMarketing = document.getElementById("chkLgpdMarketing").checked;
  registrarLog("LGPD", "Cliente alterou permissões de uso de dados pessoais.");
  msg.textContent = "Suas preferências de privacidade foram salvas.";
  msg.style.color = "var(--verde)";
  atualizarTela();
}

function exportarDadosJson() {
  const pacote = {
    geradoEm: new Date().toLocaleString("pt-BR"),
    titular: estado.usuario,
    pedidosRealizados: estado.pedidos,
    historicoAuditoria: estado.auditoria
  };
  const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "dados_titular_raizes_nordeste.json";
  link.click();
  URL.revokeObjectURL(url);
  registrarLog("LGPD", "Exportação de dados pessoais (.json) solicitada pelo cliente.");
  montarPrivacidade();
}

function anonimizarConta() {
  if (!estado.usuario) return;
  estado.usuario.nome = "Cliente Anonimizado";
  estado.usuario.email = "anonimizado@privacidade.local";
  estado.usuario.faixaEtaria = "nao-informado";
  estado.usuario.consentimentoLgpd.fidelidadeHistorico = false;
  estado.usuario.consentimentoLgpd.campanhasMarketing = false;
  registrarLog("LGPD", "Titular solicitou anonimização dos dados cadastrais.");
  atualizarTela();
}

function montarPainelOperacao() {
  const totalVendido = estado.pedidos
    .filter((p) => p.status !== "Cancelado")
    .reduce((acc, p) => acc + p.valorPago, 0);

  document.getElementById("resumoOperacao").innerHTML = `
    <div class="cartao">
      <h4>Pedidos registrados</h4>
      <p class="preco">${estado.pedidos.length}</p>
    </div>
    <div class="cartao">
      <h4>Total movimentado</h4>
      <p class="preco">${moeda(totalVendido)}</p>
    </div>
    <div class="cartao">
      <h4>Eventos auditados</h4>
      <p class="texto-apoio">${estado.auditoria.length} registros no log</p>
    </div>
  `;

  const fila = document.getElementById("filaCozinha");
  if (estado.pedidos.length === 0) {
    fila.innerHTML = `<p class="texto-vazio">Nenhum pedido aguardando preparo.</p>`;
    return;
  }

  fila.innerHTML = "";
  estado.pedidos.forEach((ped) => {
    const idx = ETAPAS_PEDIDO.indexOf(ped.status);
    const proximo = idx >= 0 && idx < ETAPAS_PEDIDO.length - 1 ? ETAPAS_PEDIDO[idx + 1] : null;
    const linha = document.createElement("div");
    linha.className = "linha-sacola";
    linha.innerHTML = `
      <div>
        <strong>${ped.codigo}</strong> (${ped.canalOrigem}) &mdash; Situação: <strong>${ped.status}</strong>
        <div class="texto-apoio">${ped.lojaNome} &bull; ${moeda(ped.valorPago)}</div>
      </div>
      <div class="grupo-botoes" style="margin-top:0;">
        ${proximo ? `<button class="botao botao-primario botao-pequeno" data-acao="avancar" type="button">Mudar p/ ${proximo}</button>` : ""}
        ${ped.status !== "Cancelado" && ped.status !== "Entregue" ? `<button class="botao botao-perigo botao-pequeno" data-acao="cancelar" type="button">Cancelar pedido</button>` : ""}
      </div>
    `;
    linha.querySelector('[data-acao="avancar"]')?.addEventListener("click", () => {
      ped.status = proximo;
      registrarLog("Cozinha/Balcão", `Status do pedido ${ped.codigo} atualizado para "${proximo}".`);
      atualizarTela();
    });
    linha.querySelector('[data-acao="cancelar"]')?.addEventListener("click", () => {
      ped.status = "Cancelado";
      registrarLog("Gerência", `Cancelamento do pedido ${ped.codigo} registrado para auditoria da matriz.`);
      atualizarTela();
    });
    fila.appendChild(linha);
  });
}

iniciar();
