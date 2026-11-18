// Dados simulados para o protótipo da rede Raízes do Nordeste
// Manoel Neto - RU 5079070

export const UNIDADES = [
  {
    id: "recife-matriz",
    nome: "Recife - Boa Vista (Matriz)",
    cidade: "Recife/PE",
    porte: "Cozinha Completa",
    aceitaSazonal: true,
    tempoMedioMin: 15,
    endereco: "Av. Conde da Boa Vista, 412 - Boa Vista, Recife/PE",
    horario: "06h30 às 21h00",
    observacaoRegional: "Cardápio completo com pratos na chapa e receita original da Dona Francisca."
  },
  {
    id: "caruaru-express",
    nome: "Caruaru - Centro (Express)",
    cidade: "Caruaru/PE",
    porte: "Formato Reduzido",
    aceitaSazonal: true,
    tempoMedioMin: 8,
    endereco: "Av. Agamenon Magalhães, 444 - Maurício de Nassau, Caruaru/PE",
    horario: "08h00 às 21h30",
    observacaoRegional: "Unidade rápida: trabalha com tapiocas, cuscuz individual, bolos e cardápio junino."
  },
  {
    id: "salvador-pituba",
    nome: "Salvador - Pituba",
    cidade: "Salvador/BA",
    porte: "Cozinha Completa",
    aceitaSazonal: false,
    tempoMedioMin: 15,
    endereco: "Rua Paulo VI, 890 - Pituba, Salvador/BA",
    horario: "07h00 às 21h30",
    observacaoRegional: "Adaptação local: opção de banana-da-terra grelhada e pimenta-de-cheiro nos pratos."
  },
  {
    id: "fortaleza-aldeota",
    nome: "Fortaleza - Aldeota (Quiosque)",
    cidade: "Fortaleza/CE",
    porte: "Formato Reduzido",
    aceitaSazonal: false,
    tempoMedioMin: 10,
    endereco: "Av. Santos Dumont, 2100 - Aldeota, Fortaleza/CE",
    horario: "07h00 às 20h00",
    observacaoRegional: "Quiosque focado em café da manhã rápido e pedidos para retirada (pick-up)."
  }
];

export const CARDAPIO = [
  {
    id: "cuscuz-carne-sol",
    nome: "Cuscuz Recheado com Carne de Sol",
    categoria: "Cuscuz",
    preco: 22.90,
    pontos: 22,
    descricao: "Cuscuz de milho cozido no vapor com carne de sol desfiada na manteiga de garrafa e queijo coalho.",
    exigeCozinhaCompleta: false,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express", "salvador-pituba", "fortaleza-aldeota"],
    notaRegional: {
      "recife-matriz": "Acompanha porção extra de nata.",
      "salvador-pituba": "Opção com banana-da-terra na chapa."
    },
    estoque: { "recife-matriz": 18, "caruaru-express": 12, "salvador-pituba": 15, "fortaleza-aldeota": 9 },
    selo: "Mais saída"
  },
  {
    id: "tapioca-coalho",
    nome: "Tapioca de Queijo Coalho na Manteiga",
    categoria: "Tapiocas",
    preco: 16.50,
    pontos: 16,
    descricao: "Goma peneirada na hora com queijo coalho assado e orégano.",
    exigeCozinhaCompleta: false,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express", "salvador-pituba", "fortaleza-aldeota"],
    notaRegional: {},
    estoque: { "recife-matriz": 25, "caruaru-express": 20, "salvador-pituba": 14, "fortaleza-aldeota": 16 },
    selo: "Preparo rápido"
  },
  {
    id: "cafe-completo",
    nome: "Café da Manhã Nordestino Completo",
    categoria: "Combos",
    preco: 34.90,
    pontos: 35,
    descricao: "Cuscuz médio, ovos mexidos, macaxeira cozida, queijo coalho na chapa e café passado na hora.",
    exigeCozinhaCompleta: true,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "salvador-pituba"],
    notaRegional: {
      "salvador-pituba": "Inclui fatias de banana-da-terra."
    },
    estoque: { "recife-matriz": 10, "caruaru-express": 0, "salvador-pituba": 8, "fortaleza-aldeota": 0 },
    selo: "Só Cozinha Completa"
  },
  {
    id: "rubacao-baiao",
    nome: "Baião de Dois com Carne de Sol e Coalho",
    categoria: "Pratos",
    preco: 38.00,
    pontos: 38,
    descricao: "Feijão-de-corda, arroz, queijo coalho em cubos, carne de sol acebolada e coentro.",
    exigeCozinhaCompleta: true,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "salvador-pituba"],
    notaRegional: {},
    estoque: { "recife-matriz": 12, "caruaru-express": 0, "salvador-pituba": 7, "fortaleza-aldeota": 0 },
    selo: "Só Cozinha Completa"
  },
  {
    id: "bolo-macaxeira",
    nome: "Bolo de Macaxeira (Fatia)",
    categoria: "Bolos e Doces",
    preco: 12.90,
    pontos: 13,
    descricao: "Bolo tradicional de macaxeira ralada com coco fresco, assado diariamente.",
    exigeCozinhaCompleta: false,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express", "salvador-pituba", "fortaleza-aldeota"],
    notaRegional: {},
    estoque: { "recife-matriz": 16, "caruaru-express": 10, "salvador-pituba": 11, "fortaleza-aldeota": 8 },
    selo: ""
  },
  {
    id: "combo-sao-joao",
    nome: "Canjica e Pamonha de Milho Verde (São João)",
    categoria: "Sazonais",
    preco: 18.00,
    pontos: 25,
    descricao: "Porção dupla do cardápio junino feita com milho verde, leite de coco e canela.",
    exigeCozinhaCompleta: false,
    sazonal: true,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express"],
    notaRegional: {
      "caruaru-express": "Cardápio especial do São João de Caruaru."
    },
    estoque: { "recife-matriz": 14, "caruaru-express": 22, "salvador-pituba": 0, "fortaleza-aldeota": 0 },
    selo: "Sazonal Junino"
  },
  {
    id: "suco-regional",
    nome: "Suco da Fruta 400ml (Caju ou Acerola)",
    categoria: "Bebidas",
    preco: 10.50,
    pontos: 10,
    descricao: "Feito na hora com polpa natural, água ou leite.",
    exigeCozinhaCompleta: false,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express", "salvador-pituba", "fortaleza-aldeota"],
    notaRegional: {},
    estoque: { "recife-matriz": 30, "caruaru-express": 25, "salvador-pituba": 20, "fortaleza-aldeota": 18 },
    selo: ""
  },
  {
    id: "cafe-passado",
    nome: "Café Passado na Hora (Xícara Grande)",
    categoria: "Bebidas",
    preco: 7.50,
    pontos: 7,
    descricao: "Café torrado moído na loja e coado na hora.",
    exigeCozinhaCompleta: false,
    sazonal: false,
    unidadesDisponiveis: ["recife-matriz", "caruaru-express", "salvador-pituba", "fortaleza-aldeota"],
    notaRegional: {},
    estoque: { "recife-matriz": 40, "caruaru-express": 35, "salvador-pituba": 30, "fortaleza-aldeota": 25 },
    selo: ""
  }
];

export const CAMPANHAS = [
  {
    id: "camp-junina",
    titulo: "Especial São João no Nordeste",
    descricao: "10% de desconto em pedidos com itens juninos nas unidades de Pernambuco.",
    cupom: "SAOJOAO10",
    percentualDesconto: 10,
    publicoAlvo: "Clientes que autorizaram notificações de campanhas na LGPD"
  },
  {
    id: "camp-cafe",
    titulo: "Passadinha antes do Trabalho",
    descricao: "15% de desconto nos pedidos agendados para retirada rápida (pick-up).",
    cupom: "RETIRADA15",
    percentualDesconto: 15,
    publicoAlvo: "Clientes frequentes do programa de fidelidade"
  }
];

export const RECOMPENSAS = [
  { id: "rec-cafe", titulo: "1 Café Passado Grátis", custoPontos: 50, valorAbatimento: 7.50 },
  { id: "rec-bolo", titulo: "1 Fatia de Bolo de Macaxeira", custoPontos: 100, valorAbatimento: 12.90 },
  { id: "rec-vale15", titulo: "Abatimento de R$ 15,00 no pedido", custoPontos: 150, valorAbatimento: 15.00 }
];

export const CLIENTE_EXEMPLO = {
  id: "CLI-5079070",
  nome: "Manoel Barbosa",
  email: "manoel.neto@email.com",
  telefone: "(81) 99812-3456",
  faixaEtaria: "25-34",
  pontos: 120,
  nivel: "Cliente Frequente (5% de desconto automático)",
  consentimentoLgpd: {
    essencialPedido: true,
    fidelidadeHistorico: true,
    campanhasMarketing: false,
    dataAceite: "18/11/2026 18:10"
  }
};
