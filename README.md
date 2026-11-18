# Projeto Multidisciplinar — Trilha Front-End (Rede Raízes do Nordeste)

**Aluno:** Manoel Barbosa da Silva Neto  
**RU:** 5079070  
**Curso:** CST em Análise e Desenvolvimento de Sistemas — UNINTER (2026)

Repositório com a implementação Front-End (Opção B — Codificação) do estudo de caso da rede de lanchonetes **Raízes do Nordeste**.

## O que foi implementado no protótipo
- **Adaptação Multicanal (App, Totem e Web):** Barra superior permite alternar a visualização entre desktop, celular (Mobile-First) e totem de autoatendimento, mantendo a mesma jornada.
- **Cardápio por Unidade:** Diferenciação entre lojas com *Cozinha Completa* (Recife e Salvador) e *Formato Reduzido* (Caruaru e Fortaleza), além de itens sazonais de São João e controle de estoque local.
- **Fidelidade e Promoções:** Pontuação por item, desconto automático acima de 100 pontos, troca de pontos por produtos e aplicação de cupons (`SAOJOAO10` e `RETIRADA15`).
- **Privacidade e LGPD na interface:** Aceite explícito no cadastro, aba dedicada para ativar/desativar permissões de fidelidade e campanhas, botão para baixar os dados em `.json`, opção de anonimização e histórico de auditoria.
- **Simulação de Pagamento Externo:** Janela que representa o envio da cobrança para uma operadora externa e permite testar três respostas: *Pagamento Aprovado*, *Pagamento Recusado* e *Queda de Conexão / Timeout* (sem apagar a sacola do cliente).
- **Acompanhamento de Status:** Linha do tempo do pedido (*Recebido* -> *Em Preparo* -> *Pronto para Retirada* -> *Entregue*) e aba de simulação da fila da cozinha/gerência.

## Como abrir localmente
Basta servir a pasta com qualquer servidor estático (por usar módulos ES6 no JavaScript):
```bash
python3 -m http.server 8080
```
Depois, acesse `http://localhost:8080` no navegador.
