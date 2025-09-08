# Desafio de Votação 2.0

Sistema de votação de pautas, com back-end em Node.js/Express e front-end em Angular.

- **Back-end:** Node.js 20.12.0 com Express.js  
- **Front-end:** Angular 20.2.0

---

## Estrutura do Projeto

```
desafio-votacao-2.0/
├── Back-end/          # API Node.js + Express
│   ├── src/
│   ├── package.json
│   ├── docker-compose.yml
│   └── ...
└── Front-end/         # Aplicação Angular
    ├── src/
    ├── angular.json
    └── package.json
```

---

## Configuração do Ambiente Local

### Back-end

1. Entre na pasta do back-end:

```bash
cd Back-end
```

2. Execute o Docker Compose para criar a base de dados:

```bash
docker-compose up -d
```

> Observação: Este comando cria automaticamente o login do usuário admin:
>
> - **Username:** `admin`
> - **Senha:** `Admin@123`

3. Instale as dependências do Node.js:

```bash
npm install
```

### Front-end

1. Entre no diretório do front-end:

```bash
cd Front-end
```

2. Instale as dependências do Angular:

```bash
npm install
```

---

## Executando o Sistema

### Back-end

1. Inicie o servidor:

```bash
npm start
```

- O back-end estará disponível em: [http://localhost:3000](http://localhost:3000/)
- Documentação Swagger das APIs: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

#### Testes Back-end (Jest)

- Executar testes:

```bash
npm run test
```

- Gerar cobertura de testes:

```bash
npm run test:coverage
```

---

### Front-end

1. Inicie o servidor Angular:

```bash
npm start
```

- O front-end estará disponível em: [http://localhost:4200](http://localhost:4200/)
- Faça login com o usuário admin criado:
  - **Username:** `admin`
  - **Senha:** `Admin@123`

#### Testes Front-end (Karma)

- Executar testes:

```bash
npm run test
```

- Gerar cobertura de testes:

```bash
npm run test:coverage
```

---

## Rotas Principais da API

- `GET /api/pautas` — Lista todas as pautas
- `POST /api/pautas` — Cria uma nova pauta
- `GET /api/pautas/:id` — Detalhe de uma pauta
- `POST /api/pautas/:id/votar` — Registrar voto em uma pauta
- `GET /api/categorias` — Lista todas as categorias
- `POST /api/usuarios` — Cria um usuário
- `GET /api/usuarios` — Lista usuários (admin)
- `POST /api/auth/login` — Autenticação de usuário

---

## Comandos Úteis

| Comando | Descrição |
|---------|-----------|
| `docker-compose up -d` | Cria a base de dados e usuário admin |
| `npm install` | Instala dependências (back-end ou front-end) |
| `npm start` | Inicia servidor (back-end ou front-end) |
| `npm run test` | Executa testes |
| `npm run test:coverage` | Gera cobertura de testes |

