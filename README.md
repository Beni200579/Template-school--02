# Kitanda React

Sistema de gestao escolar criado por **Ebenezer Felismino**.

O **Kitanda React** e um template de aplicacao web pensado para servir como base de um painel administrativo escolar moderno. Ele foi criado para ajudar escolas, diretores, coordenadores, professores e equipas administrativas a organizar informacoes importantes num unico lugar, com uma interface clara, rapida e preparada para crescer.

Este projeto nao e apenas uma pagina inicial. Ele ja vem com uma estrutura de sistema pronta, incluindo autenticacao local, painel principal, navegacao lateral, gestao de dados escolares e modulos separados para as principais areas de uma instituicao de ensino.

## Para Que Serve Este Template

O template serve como ponto de partida para criar uma plataforma escolar completa. Com ele, e possivel desenvolver um sistema para controlar alunos, professores, turmas, notas, tarefas, calendario academico, pagamentos, comunicados e configuracoes da escola.

Ele pode ser usado para:

- Criar um sistema interno de gestao escolar.
- Montar um painel administrativo para diretores e secretarias.
- Prototipar uma plataforma educacional antes de ligar a uma API real.
- Estudar boas praticas com React, TypeScript, Vite e Tailwind CSS.
- Servir como base para um produto maior, com backend, base de dados e perfis de usuario.
- Apresentar uma solucao visual e funcional para clientes, escolas ou projetos academicos.

## Visao Geral

O Kitanda React foi desenvolvido com foco em simplicidade, organizacao e experiencia de uso. A aplicacao apresenta uma area de login e, depois da entrada, mostra um painel com os principais indicadores da escola.

A interface inclui menu lateral, cabecalho, modulos independentes e componentes reutilizaveis. A navegacao entre os modulos acontece dentro da propria aplicacao, sem recarregar a pagina, oferecendo uma experiencia fluida e parecida com sistemas profissionais.

Os dados usados no projeto sao guardados localmente no navegador atraves do `localStorage`. Isso significa que o template funciona sem backend, sendo ideal para demonstracoes, testes, aprendizagem e desenvolvimento inicial.

## Principais Funcionalidades

### Painel Principal

O painel principal apresenta uma visao geral da escola, incluindo quantidade de alunos, professores, tarefas pendentes e media geral. Tambem mostra informacoes como horario de aulas, metas do semestre e comunicados recentes.

### Gestao de Alunos

O modulo de alunos permite organizar informacoes dos estudantes, como nome, turma, email, estado, media, frequencia, encarregado de educacao e telefone. E uma base util para controlar a vida academica dos alunos dentro da instituicao.

### Gestao de Professores

O modulo de professores centraliza os dados dos docentes, incluindo disciplina, contacto, email e turmas associadas. Essa parte ajuda a escola a manter uma lista organizada da equipa pedagogica.

### Turmas

A area de turmas serve para acompanhar classes, salas, professores responsaveis e numero de alunos. E uma parte importante para organizar a estrutura academica da escola.

### Notas

O modulo de notas permite trabalhar com avaliacoes por disciplina e trimestre. A aplicacao tambem calcula medias dos alunos com base nas notas registadas, facilitando o acompanhamento do desempenho escolar.

### Tarefas

O sistema inclui uma area de tarefas para acompanhar atividades administrativas e pedagogicas. As tarefas podem ter prioridade, estado, data, professor responsavel e descricao.

### Calendario

O calendario academico permite organizar eventos importantes, como provas, reunioes, entregas de notas e outras atividades escolares. Esse modulo ajuda a equipa a acompanhar datas relevantes.

### Pagamentos

O modulo de pagamentos foi pensado para controlar mensalidades, materiais ou outros valores associados aos alunos. Ele permite distinguir pagamentos pagos, pendentes e atrasados.

### Comunicados

A area de comunicados permite criar e acompanhar avisos internos, eventos e mensagens importantes para a comunidade escolar.

### Configuracoes

O modulo de configuracoes centraliza informacoes gerais do usuario e da escola, permitindo personalizar parte da experiencia dentro do sistema.

## Tecnologias Utilizadas

Este projeto foi construido com tecnologias modernas do ecossistema frontend:

- **React**: biblioteca principal para construir a interface.
- **TypeScript**: adiciona tipagem ao JavaScript e ajuda a evitar erros durante o desenvolvimento.
- **Vite**: ferramenta rapida para desenvolvimento e build do projeto.
- **Tailwind CSS**: usado para criar estilos modernos, responsivos e consistentes.
- **React DOM**: responsavel por renderizar a aplicacao no navegador.
- **ESLint**: ajuda a manter o codigo mais limpo e padronizado.

## Documentacao Do Projeto

O Kitanda React foi pensado como um template de painel escolar moderno. A estrutura visual segue uma linha limpa, administrativa e profissional, com bastante espaco em branco, bordas suaves, textos bem definidos e cores usadas para orientar o utilizador.

A interface nao foi desenhada apenas para parecer bonita. Cada cor, modulo e componente tem uma funcao dentro da experiencia. O objetivo e permitir que a pessoa que usa o sistema encontre rapidamente alunos, professores, turmas, notas, pagamentos, comunicados e tarefas sem se perder.

## Paleta De Cores

A paleta principal esta definida em `src/index.css`, dentro do bloco `@theme`. Essas cores sao usadas pelo Tailwind CSS atraves de classes como `text-kitanda-deep`, `bg-kitanda-light`, `border-kitanda-border`, `bg-kitanda-emerald` e outras.

### Cores Principais

| Nome no projeto | Codigo HEX | Funcao |
|---|---:|---|
| `kitanda-deep` | `#0F172A` | Cor principal para textos fortes, titulos e elementos de destaque escuro. |
| `kitanda-emerald` | `#10B981` | Cor principal da marca e das acoes positivas. E usada para estados ativos, botoes, destaques e indicadores de sucesso. |
| `kitanda-light` | `#F8FAFC` | Fundo geral da aplicacao. Cria uma base clara, leve e confortavel para leitura. |
| `kitanda-border` | `#E5E7EB` | Cor das bordas dos cards, caixas, tabelas e separadores. Ajuda a dividir conteudo sem pesar o visual. |
| `kitanda-sky` | `#38BDF8` | Cor secundaria para indicadores, icones e destaques informativos. |
| `kitanda-red` | `#EF4444` | Cor usada para alertas, erros, remocoes e informacoes de perigo. |
| `kitanda-text` | `#334155` | Cor de texto padrao para paragrafos e informacoes importantes. |
| `kitanda-muted` | `#64748B` | Cor de texto secundaria, usada em descricoes, legendas e informacoes menos prioritarias. |

### Cores Preparadas Para Modo Escuro

O projeto tambem possui cores definidas para modo escuro, embora a aplicacao esteja configurada para manter a experiencia clara. Isso aparece no `main.tsx`, onde a classe `dark` e removida do documento.

| Nome no projeto | Codigo HEX | Funcao planejada |
|---|---:|---|
| `kitanda-darkBg` | `#090D16` | Fundo principal para uma versao escura. |
| `kitanda-darkCard` | `#131C2E` | Fundo de cards no modo escuro. |
| `kitanda-darkBorder` | `#1E293B` | Bordas no modo escuro. |
| `kitanda-darkText` | `#F8FAFC` | Texto principal no modo escuro. |
| `kitanda-darkTextMuted` | `#94A3B8` | Texto secundario no modo escuro. |

Mesmo existindo essas cores, o ficheiro `src/index.css` contem regras que forcam varios estilos escuros a voltarem para cores claras. Isso indica que o projeto foi ajustado para funcionar principalmente em tema claro.

## Significado Das Cores Na Interface

### Verde Esmeralda

O verde esmeralda e a cor mais importante da identidade visual do projeto. Ele aparece em estados ativos, indicadores positivos, botoes de confirmacao e elementos que representam progresso ou sucesso.

Exemplos de uso:

- Item ativo no menu lateral.
- Indicadores de metas e aproveitamento.
- Destaques em textos pequenos, como "Visao geral".
- Acoes positivas, como confirmar ou guardar informacoes.

### Azul Ceu

O azul ceu funciona como cor de apoio. Ele ajuda a diferenciar indicadores e deixa a interface mais viva sem competir com o verde principal.

Exemplos de uso:

- Cards de indicadores.
- Icones de apoio.
- Elementos informativos.

### Vermelho

O vermelho e reservado para momentos que exigem atencao. Ele deve ser usado com cuidado, principalmente em acoes destrutivas, erros, remocoes ou estados criticos.

Exemplos de uso:

- Apagar registos.
- Avisos de erro.
- Pagamentos atrasados.
- Alertas importantes.

### Cinzas E Tons Slate

Os tons cinza e slate dao equilibrio ao sistema. Eles aparecem em textos, bordas, fundos secundarios e descricoes. Sao importantes porque permitem que o conteudo principal tenha destaque sem deixar a interface cansativa.

Exemplos de uso:

- Texto secundario.
- Separadores.
- Bordas de cards.
- Fundos de linhas, tabelas e areas internas.

## Tipografia

A fonte principal definida no projeto e:

```text
Plus Jakarta Sans
```

Ela e usada em praticamente toda a interface. E uma fonte moderna, limpa e facil de ler, ideal para dashboards, tabelas, formularios e sistemas administrativos.

A fonte monoespacada definida e:

```text
JetBrains Mono
```

Ela fica preparada para casos onde seja necessario mostrar codigo, valores tecnicos ou dados com alinhamento mais preciso.

## Bordas, Raios E Espacamento

O projeto define um raio personalizado:

```text
--radius-18: 18px
```

Esse valor e usado para deixar cards, paineis e blocos da interface com cantos arredondados. O resultado e uma aparencia suave, moderna e amigavel.

As bordas usam principalmente `kitanda-border`, que e um cinza claro. Essa escolha ajuda a separar os componentes sem criar linhas muito fortes.

O espacamento visual segue uma logica de dashboard:

- Cards com preenchimento interno generoso.
- Distancia clara entre secoes.
- Menu lateral fixo para navegacao rapida.
- Conteudo principal organizado em blocos.

## Componentes Visuais Do Projeto

### Layout Principal

O layout principal fica em `src/components/layout/AppLayout.tsx`. Ele organiza a estrutura geral da aplicacao depois do login.

Esse layout junta:

- Menu lateral.
- Cabecalho.
- Conteudo principal.
- Navegacao entre modulos.
- Comportamento responsivo para dispositivos menores.

### Menu Lateral

O menu lateral fica em `src/components/layout/Sidebar.tsx`. Ele e uma das partes mais importantes da experiencia, porque permite entrar rapidamente nos modulos principais.

Modulos disponiveis no menu:

- Painel.
- Alunos.
- Professores.
- Turmas.
- Notas.
- Tarefas.
- Calendario.
- Pagamentos.
- Comunicados.
- Configuracoes.

O item ativo recebe destaque com verde esmeralda e fundo suave. Isso ajuda o utilizador a saber exatamente em que modulo esta.

### Cabecalho

O cabecalho fica em `src/components/layout/Header.tsx`. Ele serve como area superior da aplicacao, dando suporte a navegacao, pesquisa, acoes rapidas e informacoes do utilizador.

Num sistema real, essa area pode evoluir para incluir notificacoes, perfil do usuario, troca de escola, mensagens e atalhos administrativos.

### Rodape

O rodape fica em `src/components/layout/Footer.tsx`. Ele completa a estrutura visual e pode ser usado para mostrar informacoes da aplicacao, versao, creditos ou direitos reservados.

### Navegacao Mobile

O componente `src/components/layout/MobileNav.tsx` ajuda a experiencia em telas pequenas. Ele permite que o sistema continue utilizavel em telemoveis e tablets.

### Logo

O componente `src/components/ui/AppLogo.tsx` centraliza a apresentacao visual da marca Kitanda. Isso e importante porque evita repetir a mesma estrutura de logo em varias partes do projeto.

### Modal

O componente `src/components/ui/Modal.tsx` serve para mostrar janelas sobrepostas, como formularios, confirmacoes ou detalhes de registos.

### Pesquisa

O componente `src/components/ui/SearchDialog.tsx` prepara uma experiencia de pesquisa dentro do sistema. Em projetos maiores, esse tipo de componente pode procurar alunos, professores, turmas, pagamentos e comunicados.

### Notificacoes

O componente `src/components/ui/ToastContainer.tsx` mostra mensagens rapidas para o utilizador. Essas mensagens sao uteis para confirmar acoes, mostrar erros ou informar que alguma operacao foi concluida.

## Paginas Do Sistema

### Login

Arquivo: `src/pages/LoginPage.tsx`

A pagina de login e a porta de entrada do sistema. Nesta versao, a autenticacao e local e simples, ideal para demonstracao e desenvolvimento inicial.

### Dashboard

Arquivo: `src/pages/DashboardPage.tsx`

O dashboard mostra uma visao geral da escola. Ele apresenta indicadores, resumo de dados, horario de aulas, metas e comunicados recentes. E a pagina principal apos o login.

### Alunos

Arquivo: `src/pages/AlunosPage.tsx`

Esta pagina organiza os dados dos estudantes. Ela serve para consultar, adicionar ou remover alunos, dependendo das funcionalidades ja implementadas no modulo.

### Professores

Arquivo: `src/pages/ProfessoresPage.tsx`

Esta pagina concentra informacoes dos professores, como nome, disciplina, email, telefone e turmas relacionadas.

### Turmas

Arquivo: `src/pages/TurmasPage.tsx`

A pagina de turmas ajuda a organizar salas, classes, professores responsaveis e quantidade de alunos.

### Notas

Arquivo: `src/pages/NotasPage.tsx`

Esta area acompanha as notas dos alunos por disciplina e trimestre. O projeto tambem possui logica para recalcular a media do aluno quando novas notas sao adicionadas.

### Tarefas

Arquivo: `src/pages/TarefasPage.tsx`

A pagina de tarefas ajuda a controlar atividades pendentes, em andamento ou concluidas. Cada tarefa pode ter prioridade, data, disciplina, responsavel e descricao.

### Calendario

Arquivo: `src/pages/CalendarioPage.tsx`

O calendario organiza eventos academicos, como provas, reunioes, entregas e outras datas importantes.

### Pagamentos

Arquivo: `src/pages/PagamentosPage.tsx`

Esta pagina foi pensada para acompanhar mensalidades, materiais e outros pagamentos. Os estados ajudam a identificar o que esta pago, pendente ou atrasado.

### Comunicados

Arquivo: `src/pages/ComunicadosPage.tsx`

Esta area serve para criar e consultar avisos, eventos e mensagens importantes para a comunidade escolar.

### Configuracoes

Arquivo: `src/pages/ConfiguracoesPage.tsx`

A pagina de configuracoes permite ajustar informacoes gerais do usuario e da escola.

## Estado Global E Dados

O estado principal da aplicacao esta em:

```text
src/store.tsx
```

Esse ficheiro guarda:

- Dados iniciais da escola.
- Estado de login.
- Lista de alunos.
- Lista de professores.
- Turmas.
- Tarefas.
- Eventos do calendario.
- Notas.
- Pagamentos.
- Comunicados.
- Funcoes para adicionar, remover e atualizar dados.
- Sistema de mensagens temporarias.

Nesta versao, os dados sao guardados no navegador com `localStorage`. Isso permite fechar e abrir a aplicacao mantendo algumas informacoes salvas localmente.

## Animacoes E Experiencia Visual

O projeto possui animacoes simples em `src/index.css`.

A classe `fade-in-up` faz os elementos entrarem suavemente de baixo para cima. Isso deixa a interface mais fluida sem exagerar nos efeitos.

Tambem existem animacoes para notificacoes:

- `toast-anim-in`: entrada da notificacao.
- `toast-anim-out`: saida da notificacao.

Essas animacoes ajudam o sistema a parecer mais responsivo e vivo.

## Identidade Do Template

O nome Kitanda combina com a ideia de organizacao, gestao e centralizacao. Assim como uma kitanda pode reunir varios produtos num so espaco, este template reune varios setores da escola numa unica plataforma.

O projeto, criado por **Ebenezer Felismino**, pode funcionar como base para um sistema escolar real, portfolio profissional, apresentacao para clientes ou estudo de desenvolvimento frontend moderno.

## Estrutura Do Projeto

```text
kitanda-react/
|-- public/
|-- src/
|   |-- assets/
|   |-- components/
|   |   |-- layout/
|   |   `-- ui/
|   |-- Logo/
|   |-- pages/
|   |-- App.tsx
|   |-- index.css
|   |-- main.tsx
|   |-- store.tsx
|   `-- types.ts
|-- index.html
|-- package.json
|-- vite.config.ts
`-- README.md
```

### Pastas Importantes

- `src/pages`: contem as paginas principais do sistema, como dashboard, alunos, professores, notas e pagamentos.
- `src/components/layout`: contem componentes de estrutura, como cabecalho, menu lateral, rodape e layout geral.
- `src/components/ui`: contem componentes reutilizaveis de interface, como modal, logo, pesquisa e notificacoes.
- `src/store.tsx`: concentra o estado global da aplicacao, os dados iniciais e as funcoes para alterar informacoes.
- `src/types.ts`: define os tipos TypeScript usados nos dados da aplicacao.

## Como Executar O Projeto

Antes de comecar, e necessario ter o **Node.js** instalado na maquina.

Instale as dependencias:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois, abra o endereco mostrado no terminal. Normalmente sera algo parecido com:

```text
http://localhost:5173
```

## Scripts Disponiveis

```bash
npm run dev
```

Inicia o projeto em modo de desenvolvimento.

```bash
npm run build
```

Gera a versao final de producao.

```bash
npm run preview
```

Permite visualizar localmente a versao gerada para producao.

```bash
npm run lint
```

Executa a verificacao de qualidade do codigo com ESLint.

## Sobre O Armazenamento Dos Dados

Nesta versao, os dados ficam guardados no navegador usando `localStorage`. Isso torna o template simples de testar, porque ele nao precisa de servidor, API ou base de dados para funcionar.

Para transformar este template num sistema real de producao, o proximo passo seria ligar a aplicacao a um backend, por exemplo com Node.js, Laravel, Django, Supabase, Firebase ou outra tecnologia de preferencia.

## Possiveis Melhorias Futuras

Algumas ideias para evoluir este projeto:

- Criar backend com autenticacao real.
- Adicionar perfis diferentes, como diretor, professor, aluno e encarregado.
- Guardar dados numa base de dados.
- Criar relatorios em PDF.
- Adicionar filtros avancados nas tabelas.
- Implementar permissao por tipo de usuario.
- Adicionar upload de imagens e documentos.
- Criar graficos financeiros e pedagogicos mais completos.
- Melhorar o sistema de notificacoes.
- Preparar o projeto para publicacao online.

## Autor

Este projeto foi desenvolvido por **Ebenezer Felismino**.

A ideia do Kitanda React e oferecer uma base bonita, organizada e funcional para sistemas escolares. Ele pode ser usado como estudo, portfolio, projeto academico ou ponto de partida para uma solucao profissional de gestao escolar.
