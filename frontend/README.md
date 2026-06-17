# Documentação Técnica — GEA (Gestão Escolar Acadêmica)

Documentação gerada a partir do código-fonte enviado (`app.zip`), cobrindo a pasta `app/` de um projeto Angular standalone (sem NgModules). Não foi incluído `package.json`/`angular.json` no zip, então a versão exata do Angular e demais dependências não pôde ser confirmada — pela sintaxe (`standalone: true`, `inject`/DI por construtor, `provideRouter`, `provideHttpClient`), é compatível com Angular 17+.

---

## 1. Estrutura de pastas

```
app/
├── app.config.ts          # Configuração global da aplicação (providers)
├── app.routes.ts          # Definição das rotas
├── app.ts                 # Componente raiz (root component)
├── app.html               # Template raiz (apenas <router-outlet>)
├── app.scss                # Estilos do componente raiz (vazio)
├── app.spec.ts             # Teste unitário padrão do componente raiz
├── service/
│   ├── api.ts              # Serviço HTTP (Api)
│   └── api.spec.ts
└── pages/
    ├── landing-page/       # Tela inicial de seleção de acesso
    ├── login/               # Tela de login (aluno/professor)
    ├── register/            # Tela de cadastro (aluno/professor)
    ├── home-aluno/           # Dashboard completo do aluno
    ├── home-professor/       # Dashboard completo do professor
    └── not-found/            # Página 404
```

Cada página segue o padrão Angular de 4 arquivos: `.ts` (classe do componente), `.html` (template), `.scss` (estilos) e `.spec.ts` (teste unitário gerado pelo CLI, sem customização além do boilerplate padrão `should create`).

---

## 2. Bootstrap e configuração

### `app.config.ts`
Define o `ApplicationConfig` exportado como `appConfig`, usado no `bootstrapApplication` (arquivo `main.ts`, não incluído no zip). Registra dois providers:

| Provider | Função |
|---|---|
| `provideRouter(routes)` | Habilita o Angular Router usando as rotas definidas em `app.routes.ts` |
| `provideHttpClient()` | Habilita injeção do `HttpClient` em qualquer serviço/componente da aplicação |

### `app.ts` / `app.html` / `app.scss`
Componente raiz `App`, seletor `app-root`, `standalone: true`. Importa apenas `RouterOutlet`. O template (`app.html`) contém só `<router-outlet></router-outlet>` — toda a interface real vem dos componentes de rota. O arquivo `app.scss` está vazio.

### `app.spec.ts`
Teste padrão do Angular CLI: monta o `TestBed`, cria o componente e verifica `expect(app).toBeTruthy()`. Não há testes de lógica customizados.

---

## 3. Roteamento (`app.routes.ts`)

```ts
export const routes: Routes = [
  { path: '',          component: LandingPage },
  { path: 'login',      component: Login },
  { path: 'register',   component: Register },
  { path: 'aluno',      component: HomeAluno },
  { path: 'professor',  component: HomeProfessor },
  { path: '**',         component: NotFound },
];
```

Pontos relevantes:
- Todas as rotas usam carregamento direto (eager), sem `loadComponent` (lazy loading).
- **Não há `canActivate`/route guards.** O acesso a `/aluno` e `/professor` não é protegido pelo roteador; qualquer pessoa pode navegar direto para essas URLs sem estar logada. A única "proteção" é visual: os componentes leem o `localStorage` no `ngOnInit` para preencher nome/tipo de usuário, mas não redirecionam se não houver sessão.
- A diferenciação aluno/professor na tela de login/registro não é feita por rota separada, e sim por `queryParams` (`?tipo=aluno` ou `?tipo=professor`) lidos dentro do próprio componente.

---

## 4. Serviço `Api` (`service/api.ts`)

Serviço injetável (`@Injectable({ providedIn: 'root' })`), classe `Api`, com `baseURL` fixa `http://localhost:3000`.

| Método | Verbo HTTP | Endpoint | Parâmetros | Descrição |
|---|---|---|---|---|
| `register(data)` | POST | `/register` | `data: any` | Envia dados de cadastro |
| `login(data)` | POST | `/login` | `data: any` | Envia credenciais de login |
| `createHero(hero)` | POST | `/heroes` | `hero: any` | Cria um "hero" (CRUD de exemplo) |
| `getHeroes()` | GET | `/heroes` | — | Lista "heroes" |
| `updateHero(id, hero)` | PUT | `/heroes/{id}` | `id: number, hero: any` | Atualiza um "hero" |
| `deleteHero(id)` | DELETE | `/heroes/{id}` | `id: number` | Remove um "hero" |

**Observação:** os métodos de "heroes" são resquício do tutorial oficial *Tour of Heroes* do Angular e não são chamados por nenhum componente do projeto atual. O método `login()` deste serviço também não é usado — o componente `Login` autentica localmente, sem chamar a API. Apenas `register()` poderia ser usado, mas o componente `Register` faz sua própria chamada HTTP direta (ver seção 6.3), sem passar por este serviço.

---

## 5. `LandingPage` (`pages/landing-page/`)

**Seletor:** `app-landing-page` · **Standalone:** sim · **Imports:** nenhum módulo extra (só usa `Router` injetado).

### Propriedades
Nenhuma propriedade de estado — componente puramente de apresentação.

### Métodos

| Método | Descrição |
|---|---|
| `acessarAluno()` | Navega para `/login` com `queryParams: { tipo: 'aluno' }` |
| `acessarProfessor()` | Navega para `/login` com `queryParams: { tipo: 'professor' }` |

### Template (`landing-page.html`)
Layout de duas colunas: lado esquerdo com logo "GEA" e texto institucional ("Gestão Escolar Acadêmica") com três badges (Acadêmico, Desempenho, Gestão); lado direito com dois cartões clicáveis ("Sou Estudante" e "Sou Professor"), cada um disparando a navegação correspondente. Usa ícones Font Awesome (`fa-graduation-cap`, `fa-chalkboard-user`, `fa-arrow-right`) e dois elementos decorativos de fundo (`bg-circle`).

---

## 6. `Login` (`pages/login/`)

**Seletor:** `app-login` · **Standalone:** sim · **Imports:** `FormsModule`, `CommonModule`.

### Propriedades

| Propriedade | Tipo | Valor inicial | Descrição |
|---|---|---|---|
| `ra` | `string` | `''` | Campo de RA/CPF digitado |
| `senha` | `string` | `''` | Campo de senha digitado |
| `tipo` | `'aluno' \| 'professor'` | `'aluno'` | Definido a partir do queryParam `tipo` recebido na rota |
| `mostrarSenha` | `boolean` | `false` | Controla exibição da senha em texto puro |
| `erroRa` | `boolean` | `false` | Flag de erro de validação do campo RA |
| `erroSenha` | `boolean` | `false` | Flag de erro de validação do campo senha |

### Métodos

| Método | Descrição |
|---|---|
| `constructor` | Inscreve-se em `route.queryParams` para definir `tipo` (normaliza para `'professor'` ou `'aluno'`) |
| `voltar()` | Navega para `/` |
| `toggleSenha()` | Inverte `mostrarSenha` (mostrar/ocultar senha) |
| `login()` | Valida campos vazios, depois compara `ra`/`senha` contra credenciais **fixas no código**: `admin/admin123` (vai para `/professor` com `tipo: 'admin'`), `aluno1/aluno123` (vai para `/aluno`), `professor1/prof123` (vai para `/professor`). Em caso de sucesso, grava `localStorage.sessao_usuario` com `{ ra, tipo, nome }`. Em caso de falha, exibe `alert()` |
| `irParaRegistro()` | Navega para `/register` repassando `queryParams: { tipo: this.tipo }` |

### Template (`login.html`)
Card de login com cabeçalho dinâmico (ícone, badge e título mudam entre "Área do Aluno"/"Área do Professor" conforme `tipo`). Formulário com `(ngSubmit)="login()"`: campo de RA ou CPF (label e placeholder mudam conforme `tipo`), campo de senha com botão de mostrar/ocultar (ícones `fa-eye`/`fa-eye-slash`), mensagens de erro inline (`*ngIf="erroRa"` / `*ngIf="erroSenha"`) e link para registro.

**Observação de segurança:** as credenciais válidas estão hardcoded no front-end, visíveis a qualquer pessoa que inspecione o bundle JS compilado. Isso é aceitável para um mock/prototípo, mas não deve ir para produção real.

---

## 7. `Register` (`pages/register/`)

**Seletor:** `app-register` · **Standalone:** sim · **Imports:** `FormsModule`, `CommonModule`. Único componente de página que injeta `HttpClient` diretamente.

### Propriedades

| Propriedade | Tipo | Valor inicial | Descrição |
|---|---|---|---|
| `tipo` | `string` | `'aluno'` | Vem do queryParam `tipo` da rota |
| `ra` | `string` | `''` | RA do aluno (só usado se `tipo === 'aluno'`) |
| `cpf` | `string` | `''` | CPF do professor (campo presente no template, mas **não enviado no `body`** da requisição — ver observação) |
| `email` | `string` | `''` | E-mail do usuário |
| `nome` | `string` | `''` | Nome completo |
| `senha` | `string` | `''` | Senha escolhida |
| `confirmar` | `string` | `''` | Confirmação de senha |
| `erro` | `string` | `''` | Mensagem de erro exibida no formulário |
| `carregando` | `boolean` | `false` | Estado de loading durante a requisição |

### Métodos

| Método | Descrição |
|---|---|
| `constructor` | Lê `route.queryParams` para definir `tipo` |
| `voltar()` | Navega para `/` |
| `irParaLogin()` | Navega para `/login` com `queryParams: { tipo_usuario: this.tipo }` |
| `registrar(event)` | Previne o submit padrão (`event.preventDefault()`), valida campos obrigatórios, RA obrigatório se aluno, senha mínima de 6 caracteres e confirmação de senha. Se válido, monta `body` (`nome`, `email`, `password`, `tipo_usuario`, e `ra` se for aluno) e faz `POST` direto via `HttpClient` para `http://localhost:3000/register`. Em sucesso: `alert()` e navega para `/login`; em erro: grava mensagem em `this.erro` |

### Template (`register.html`)
Dois blocos com `*ngIf` mutuamente exclusivos: bloco "ALUNO" (campos RA, email, nome, senha, confirmar) e bloco "PROFESSOR" (campos CPF, nome, senha, confirmar — sem email). Botão de submit desabilitado durante `carregando`, com texto alternando entre "Registrar" e "Registrando...".

**Observações:**
- O campo `cpf` é capturado no formulário do professor via `[(ngModel)]="cpf"`, mas o método `registrar()` nunca inclui `cpf` no `body` enviado ao backend — só `ra` é adicionado condicionalmente. Isso é provavelmente um bug/pendência.
- O bloco do professor não tem campo de e-mail no formulário, mas a validação em `registrar()` exige `this.email` preenchido (`if (!this.nome || !this.email || !this.senha)`), o que tornaria impossível registrar um professor com sucesso pelo formulário atual, já que `email` nunca é preenchido nesse fluxo.

---

## 8. `HomeAluno` (`pages/home-aluno/`)

**Seletor:** `app-home-aluno` · **Standalone:** sim · **Imports:** `CommonModule`, `FormsModule` · Implementa `OnInit`.

Componente único que concentra **todas** as seções do dashboard do aluno, alternadas via uma flag de página ativa (sem rotas filhas nem lazy loading).

### Propriedades principais

| Propriedade | Descrição |
|---|---|
| `tipoUsuario`, `nomeUsuario` | Preenchidos a partir de `localStorage.sessao_usuario` no `ngOnInit` |
| `paginaAtiva` | Controla qual seção é exibida (`'inicio'`, `'matricula'`, `'boletim'`, `'calendario'`, `'tarefas'`, `'biblioteca'`, `'horario'`, `'comunicados'`, `'downloads'`, `'desempenho'`, `'suporte'`, `'perfil'`) |
| `mediaGeral`, `frequencia`, `proximaAvaliacao`, `avisos` | Dados mockados da seção "Início" |
| `documentos` | Lista de documentos de matrícula (nome, data, status) |
| `disciplinas`, `historicoEscolar` | Notas por disciplina (n1/n2/n3/média/frequência/tendência) e histórico de médias por ano — seção "Boletim" |
| `anoAtual`, `mesAtual`, `diasSemana`, `diasCalendario`, `proximosEventos`, `eventoDias` | Estado do calendário mensal |
| `tarefas` | Lista de tarefas com disciplina, prazo, prioridade e status |
| `buscaBiblioteca`, `livros` | Lista de livros e termo de busca da seção "Biblioteca" |
| `horarioAulas` | Grade de horários por dia da semana, com cor por disciplina |
| `comunicados` | Avisos da escola, com flag `novo` |
| `arquivos` | Lista de materiais para download |
| `mensagemAssunto`, `mensagemTexto`, `faqs` | Estado da seção "Suporte" |
| `historicoAcademico` | Histórico de cursos/médias da seção "Perfil" |

Todos esses arrays são **dados estáticos definidos na própria classe** — não há chamada de API em nenhuma seção do `HomeAluno`.

### Métodos

| Método | Descrição |
|---|---|
| `get mesAtualNome` | Getter que retorna o nome do mês atual em português |
| `gerarCalendario()` | Monta o array `diasCalendario` com os dias do mês atual, marcando dias do mês anterior (preenchimento), dia de hoje e dias com evento |
| `mesAnterior()` / `proximoMes()` | Navegam entre meses, ajustando `mesAtual`/`anoAtual` e regerando o calendário |
| `selecionarDia(dia)` | Vazio — sem implementação (placeholder) |
| `get livrosFiltrados` | Filtra `livros` por título, autor ou categoria conforme `buscaBiblioteca` |
| `toggleFaq(faq)` | Expande/colapsa uma pergunta do FAQ |
| `enviarMensagem()` | Se assunto e texto preenchidos, mostra `alert()` de sucesso e limpa os campos (não envia a nenhum backend) |
| `ngOnInit()` | Lê `sessao_usuario` do `localStorage` para preencher `tipoUsuario`/`nomeUsuario`, e chama `gerarCalendario()` |
| `navegarPara(pagina)` | Define `paginaAtiva = pagina` (troca de seção) |
| `sair()` | Remove `sessao_usuario` do `localStorage` e navega para `/login` |

### Template (`home-aluno.html`)
Menu lateral com 12 itens de navegação (`<a class="nav-item" [class.active]="paginaAtiva==='x'" (click)="navegarPara('x')">`), cada um revelando um bloco `<div *ngIf="paginaAtiva==='x'" class="page-content">` correspondente. Inclui cards de resumo (média, frequência), tabelas (boletim, documentos), grid de calendário, lista de tarefas com badges de prioridade/status, grid de livros com busca, grade de horário colorida por disciplina, lista de comunicados, lista de downloads, gráficos de desempenho e formulário de suporte com FAQ expansível.

---

## 9. `HomeProfessor` (`pages/home-professor/`)

**Seletor:** `app-home-professor` · **Standalone:** sim · **Imports:** `CommonModule`, `FormsModule` · Implementa `OnInit`.

Segue o mesmo padrão do `HomeAluno` (super-componente único com troca de seção via flag), porém mais tipado: define interfaces TypeScript próprias no topo do arquivo.

### Interfaces definidas

| Interface | Campos |
|---|---|
| `Turma` | `id`, `label` |
| `AlunoFrequencia` | `ra`, `nome`, `presente` |
| `AlunoNota` | `nome`, `ra`, `nota1`, `nota2`, `nota3`, `media`, `frequencia` |
| `Evento` | `titulo`, `descricao`, `turma`, `data`, `hora`, `tipo: 'prova' \| 'trabalho' \| 'reuniao'` |
| `Material` | `nome`, `turma`, `tipo`, `tamanho`, `data` |
| `Comunicado` | `titulo`, `data`, `turma`, `texto`, `tag: 'importante' \| 'informacao' \| 'evento'` |
| `Planejamento` | `titulo`, `data`, `horario`, `turma`, `status: 'planejada' \| 'realizada'`, `objetivos`, `metodologia`, `recursos` |
| `AtividadeRecente` | `texto`, `data`, `cor: 'g' \| 'b' \| 'p' \| 'o'` |

### Propriedades principais

| Propriedade | Descrição |
|---|---|
| `activePage` | Controla a seção ativa (`'home'`, `'turmas'`, `'agenda'`, `'notas'`, `'frequencia'`, `'relatorios'`, `'materiais'`, `'comunicados'`, `'planejamento'`, `'painel'`, `'perfil'`) |
| `turmas` | Lista fixa de turmas (3A, 3B, 2A, 2B, 1A, 1B) |
| `turmaSelecionadaNotas`, `turmaSelecionadaFreq` | Turma selecionada nas abas de notas e frequência |
| `dataFrequencia` | Data selecionada para registrar chamada |
| `eventos` | Lista de eventos da agenda escolar |
| `alunosNotas` | Notas mockadas de alunos (3 registros) |
| `chamada` | Lista de alunos com flag `presente` para a chamada |
| `materiais` | Lista de materiais didáticos enviados |
| `novoMaterialTitulo/Turma/Categoria` | Campos do formulário de novo material (sem lógica de submit implementada) |
| `comunicados` | Avisos publicados pelo professor |
| `planejamentos` | Planos de aula |
| `atividadesRecentes` | Feed de atividades exibido no painel/home |
| `resumoTurmas` | Estatísticas agregadas por turma (para relatórios) |
| `calDays`, `eventDays` | Estado do calendário (mês fixo simulando maio/2026) |
| `perfil`, `historicoAcademico` | Dados do perfil do professor logado |

### Métodos

| Método | Descrição |
|---|---|
| `goTo(page)` | Define `activePage` e rola a página para o topo (`window.scrollTo(0,0)`) |
| `isPage(page)` | Retorna se `page` é a seção ativa atual |
| `selectTurmaNotas(id)` / `selectTurmaFreq(id)` | Trocam a turma selecionada nas respectivas abas |
| `setPresente(aluno, presente)` | Atualiza a presença de um aluno na chamada |
| `get presentes` / `get ausentes` | Contam alunos presentes/ausentes na `chamada` |
| `buildCalendar()` | Monta `calDays` com os dias de maio/2026, com o primeiro dia fixado como sexta-feira (`startDay = 5`) — **valor fixo, não calculado dinamicamente a partir da data real** |
| `isToday(day)` | Retorna `true` apenas se `day === 20` (também fixo, não usa a data atual do sistema) |
| `hasEvent(day)` | Verifica se o dia está em `eventDays` |
| `mediaClass(media)` | Retorna `'vg'` (verde) se média ≥ 7, ou `'vb'` (vermelho) caso contrário — usado para colorir células |
| `removerMaterial/Comunicado/Planejamento/Evento(index)` | Removem item do respectivo array via `splice()` — alteração só em memória, não persiste |
| `ngOnInit()` | Chama `buildCalendar()` |
| `sair()` | Remove `sessao_usuario` do `localStorage` e navega para `/` |

### Template (`home-professor.html`)
Menu lateral com 11 itens. A seção `home` exibe cartões de acesso rápido (`qcard`) que chamam `goTo()` para outras seções, cada uma com botão "Voltar" que chama `goTo('home')`. Demais seções incluem: gerenciamento de turmas, agenda com lista de eventos, lançamento de notas em tabela editável por turma, controle de frequência com toggle presente/ausente por aluno, relatórios com resumo por turma, upload/lista de materiais, lista de comunicados, lista de planejamentos de aula, painel com atividades recentes e banner de configurações rápidas, e perfil com histórico acadêmico.

---

## 10. `NotFound` (`pages/not-found/`)

**Seletor:** `app-not-found` · Sem imports adicionais. Classe vazia (`export class NotFound {}`), sem propriedades nem métodos. Template (`not-found.html`) contém apenas o texto estático `"not-found works!"` — é o placeholder padrão gerado pelo Angular CLI e ainda não foi customizado com uma tela de erro 404 real.

---

## 11. Observações gerais e pontos de atenção

1. **Sem guards de rota:** `/aluno` e `/professor` são acessíveis diretamente pela URL, sem verificação de sessão no roteador.
2. **Credenciais fixas no front-end** (`login.ts`): aceitável para protótipo, mas não deve ser usado como autenticação real.
3. **Sem persistência real:** quase todos os dados (notas, materiais, comunicados, frequência, planejamentos) são arrays em memória dentro dos componentes; qualquer alteração (`splice`, `setPresente`, etc.) se perde ao recarregar a página.
4. **Serviço `Api` subutilizado:** os métodos de "heroes" não são usados, e até o `login()`/`register()` do serviço não são chamados pelos componentes reais (o `Register` faz sua própria chamada HTTP).
5. **Bug potencial no cadastro de professor:** o campo `cpf` não é enviado no `body` de `registrar()`, e a validação exige `email`, que não existe no formulário do professor — isso impede o cadastro de professores de funcionar corretamente.
6. **Calendário do professor com data fixa:** `buildCalendar()` e `isToday()` assumem maio de 2026 com o dia 20 como "hoje", em vez de calcular a partir da data real do sistema (diferente do `HomeAluno`, que usa `new Date()`).
7. **Página 404 não customizada:** ainda é o placeholder padrão do Angular CLI.
8. **Página NotFound (`not-found.ts`) não está marcada como `standalone: true`** explicitamente no decorator, embora funcione por herdar o comportamento padrão de componentes standalone do Angular moderno — vale confirmar a versão do Angular usada para garantir compatibilidade.
