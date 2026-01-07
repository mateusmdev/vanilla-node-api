vanilla-node-api
================

> REST API construída **exclusivamente com módulos nativos do Node.js**, sem uso de frameworks como Express ou Fastify, com foco em **arquitetura**, **padrões de projeto** e **entendimento profundo do fluxo HTTP**.”

📌 Visão Geral
--------------

O **vanilla-node-api** é um projeto de estudo cujo objetivo é **demonstrar domínio do funcionamento interno de uma API HTTP no Node.js**, abstraindo manualmente responsabilidades que, em frameworks populares, já vêm prontas.

Este projeto foi desenvolvido **intencionalmente sem qualquer framework web**, utilizando apenas o módulo nativo `http` do Node.js, com o propósito de:

*   Entender o ciclo completo de uma requisição HTTP
    
*   Implementar manualmente um sistema de roteamento
    
*   Aplicar padrões clássicos de arquitetura e design
    
*   Demonstrar capacidade de estruturar código escalável e organizado mesmo em baixo nível

### Funcionalidades Implementadas

**Roteamento Dinâmico:** Suporte a parâmetros de URL (ex: /products/:id/) através de conversão para Regex.

**Body Parser Nativo:** Manipulação de streams de dados para captura de payloads POST e PUT.

**Validação de Schema:** Validador genérico que garante a integridade dos dados antes de chegarem à camada de serviço.

**Persistência em Arquivo:** CRUD completo persistido em um arquivo .json com geração de UUIDs.

> ⚠️ **Este projeto não foi projetado para produção.**  
> Ele existe como **demonstração técnica e educacional**, especialmente para fins de portfólio.”

🎯 Objetivo do Projeto
----------------------

*   Compreender o que acontece “por debaixo dos panos” em frameworks como **Express** e **Fastify**
    
*   Demonstrar capacidade de:
    
    *   Modelar arquitetura
        
    *   Criar abstrações consistentes
        
    *   Separar responsabilidades
        
    *   Trabalhar diretamente com HTTP, streams e eventos
        
*   Evidenciar maturidade técnica para **recrutadores técnicos, CTOs e lideranças de engenharia**

* * *

🧠 Principais Conceitos Trabalhados
-----------------------------------

*   API REST sem frameworks
    
*   HTTP nativo (`node:http`)
    
*   Roteamento manual
    
*   Parsing manual de:
    
    *   URL
        
    *   Query params
        
    *   Path params
        
    *   Body
        
*   Arquitetura em camadas (MVC)
    
*   Padrões de projeto clássicos

🏗️ Arquitetura Geral
---------------------

### Fluxo de uma Requisição

```
HTTP Request
   ↓
Node.js HTTP Server
   ↓
ServerApi
   ↓
FactoryRouter
   ↓
RouterContext
   ↓
Router (Strategy)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
HTTP Response
```

### Descrição do Fluxo

1.  O servidor HTTP nativo (`http.createServer`) recebe a requisição.
    
2.  A requisição é delegada para uma camada central (`ServerApi`).
    
3.  O **FactoryRouter** identifica qual router deve tratar a rota com base no prefixo.
    
4.  O **RouterContext** executa o router selecionado (Strategy Pattern).
    
5.  O **Router**:
    
    *   Seleciona a rota correta
        
    *   Extrai parâmetros de path e query
        
    *   Faz o parsing do body
        
6.  O **Controller** executa a ação correspondente.
    
7.  A resposta é construída e enviada manualmente via `response`.

```
src/
 ├─ index.ts
 ├─ server.ts
 ├─ router/                  # Core do roteamento
 │   ├─ Router.ts
 │   ├─ RouterContext.ts
 │   ├─ FactoryRouter.ts
 │   └─ ProductRouter.ts
 ├─ controller/             # Atua como intermediário que recebe a requisição HTTP
 ├─ service/                # Regras de negócio
 ├─ repository/             # Acesso a dados
 ├─ utils/                  # Tipagens e Validadores
 ├─ exception/              # Erros customizados
 └─ db/                     # Arquivo JSON (persistência)
```

### Responsabilidades por Camada

#### `index.ts`

*   Inicializa o servidor HTTP nativo
    
*   Define a porta
    
*   Registra o handler principal da API
    

#### `server.ts`

*   Atua como **entry point lógico** da aplicação
    
*   Centraliza o recebimento da requisição
    
*   Encaminha para o sistema de roteamento”

🛣️ Sistema de Roteamento Customizado
-------------------------------------

### Router

A classe `Router` é responsável por:

*   Registrar rotas HTTP (`GET`, `POST`, `PUT`, `DELETE`)
    
*   Normalizar URLs
    
*   Associar callbacks às rotas
    
*   Resolver dinamicamente:
    
    *   Path params
        
    *   Query params
        
    *   Body da requisição
        

Cada rota armazena:

*   Callback
    
*   Expressão de matching
    
*   Lista de parâmetros dinâmicos
    

> O roteamento é feito sem dependência externa e sem middleware.

* * *

### FactoryRouter (Factory Pattern)

Responsável por:

*   Manter múltiplos routers registrados
    
*   Selecionar dinamicamente o router correto com base no prefixo da rota
    

Isso permite uma arquitetura modular, por exemplo:

*   `/products/*`
    
*   `/users/*`
    
*   `/orders/*`
    

Cada domínio pode ter seu próprio router isolado.

* * *

### RouterContext (Strategy Pattern)

O `RouterContext` implementa o **Strategy Pattern**, permitindo:

*   Trocar dinamicamente a estratégia de roteamento
    
*   Desacoplar a execução da lógica de roteamento da sua implementação concreta
    

* * *

🧱 Arquitetura MVC
------------------

O projeto segue uma separação clara de responsabilidades inspirada no padrão **MVC**, adaptado ao contexto de uma API REST.

### Controller

*   Responsável por:
    
    *   Receber dados já processados
        
    *   Orquestrar chamadas de serviço
        
    *   Retornar respostas HTTP
        

### Service

*   Contém regras de negócio
    
*   Não conhece HTTP
    
*   Atua como camada intermediária entre Controller e Repository
    

### Repository

*   Responsável pelo acesso a dados
    
*   No contexto do projeto:
    
    *   Persistência simples
        
    *   Foco em abstração, não em banco real
        

* * *

🧩 Padrões de Projeto Utilizados
--------------------------------

### ✔ Factory Pattern

*   Usado para seleção dinâmica de routers
    
*   Facilita escalabilidade da API
    

### ✔ Strategy Pattern

*   Permite alternar estratégias de roteamento
    
*   Reduz acoplamento
    

### ✔ MVC (adaptado)

*   Separação clara de responsabilidades
    
*   Código mais legível, testável e manutenível
    

* * *

⚠️ Limitações Conhecidas
------------------------

Este projeto **não tem como objetivo uso em produção**. Algumas limitações intencionais:

*   Sem middlewares
    
*   Sem autenticação
    
*   Sem controle de concorrência
    
*   Sem validação robusta de dados
    
*   Persistência simples
    
*   Sem tratamento avançado de erros
    
*   Sem otimizações de performance
    

Essas decisões foram conscientes para **manter o foco no entendimento do funcionamento interno** de uma API HTTP.

* * *

🧪 Motivação Técnica
--------------------

Frameworks modernos abstraem grande parte da complexidade do HTTP.  
Este projeto demonstra que o autor:

*   Entende essas abstrações
    
*   Sabe reproduzi-las manualmente
    
*   Consegue estruturar código limpo mesmo sem ferramentas prontas
    
*   Tem domínio conceitual além do uso de frameworks
    

* * *

📌 Considerações Finais
-----------------------

Este repositório existe como:

*   Demonstração de conhecimento técnico
    
*   Estudo aprofundado de Node.js
    
*   Material de portfólio
    
*   Prova de compreensão arquitetural
