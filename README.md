
# <div align="center">🎬 Cineflix - Sua Plataforma de Streaming Personalizada 🍿</div>

<div align="center">
  <img src="public/lovable-uploads/2183c9ac-2cad-400d-8eb9-57cf0ecb233d.png" alt="Cineflix Screenshot" width="100%" />
</div>

## 📋 Sobre o Projeto

Cineflix é uma plataforma de streaming completa que permite aos usuários assistir filmes e séries, interagir com conteúdo através de comentários, criar listas de favoritos, e muito mais! Com uma interface intuitiva inspirada nas melhores plataformas de streaming do mercado, o Cineflix oferece uma experiência rica e personalizada para os amantes de cinema e séries.

### ✨ Recursos Principais

- 🎥 **Catálogo de Filmes e Séries**: Acesso a uma vasta biblioteca de conteúdo organizado por categorias
- 📺 **Player de Vídeo Integrado**: Assista ao conteúdo diretamente na plataforma com player personalizado
- 👤 **Sistema de Autenticação**: Cadastro e login de usuários com Supabase Auth
- ❤️ **Lista de Favoritos**: Marque seus filmes e séries favoritos para assistir mais tarde
- 💬 **Sistema de Comentários**: Interaja com outros usuários através de comentários nos filmes e séries
- 🔔 **Notificações**: Receba atualizações sobre novos conteúdos e interações
- 🔍 **Busca Avançada**: Encontre facilmente o conteúdo que deseja assistir
- 📱 **Design Responsivo**: Experiência otimizada em dispositivos móveis e desktop
- 👑 **Painel de Administração**: Gerenciamento completo de usuários, filmes e séries
- 🌙 **Modo Escuro**: Interface adaptada para visualização noturna

## 🛠️ Tecnologias Utilizadas

O projeto é construído com um stack moderno de tecnologias front-end e back-end:

### Front-end
- ⚛️ **React 18**: Biblioteca JavaScript para construção de interfaces
- 🔄 **React Router**: Gerenciamento de rotas e navegação
- 📝 **TypeScript**: Tipagem estática para desenvolvimento mais seguro
- 🎨 **Tailwind CSS**: Framework CSS utilitário para estilização rápida
- 🧩 **Shadcn UI**: Componentes reutilizáveis e acessíveis
- 📊 **Recharts**: Biblioteca para criação de gráficos (painel admin)
- 🔍 **TanStack Query**: Gerenciamento de estado e cache para dados remotos
- 📦 **Vite**: Build tool rápida para desenvolvimento moderno

### Back-end
- 🔐 **Supabase**: Plataforma completa para back-end com:
  - 🗃️ **Banco de Dados PostgreSQL**: Armazenamento relacional
  - 🔒 **Autenticação e Autorização**: Sistema completo de login
  - 📂 **Storage**: Armazenamento de arquivos e mídia
  - 🔌 **Funções e APIs**: Funções serverless e endpoints RESTful

### Utilitários
- 🔔 **Sonner**: Sistema de notificações toast
- 📅 **date-fns**: Manipulação de datas
- 🎭 **Lucide React**: Biblioteca de ícones
- 📝 **React Hook Form** + **Zod**: Validação de formulários

## 🚀 Como Instalar e Executar

### Pré-requisitos
- Node.js (v16+)
- npm ou yarn
- Conta no Supabase (para o backend)

### Passos para Execução Local

1. **Clone o repositório**
```sh
git clone <URL_DO_REPOSITORIO>
cd cineflix
```

2. **Instale as dependências**
```sh
npm install
# ou
yarn install
```

3. **Configure o Supabase**
   - Crie uma conta no [Supabase](https://supabase.com)
   - Crie um novo projeto
   - Copie as credenciais de API (URL e anon key) para o arquivo .env

4. **Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:
```
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

5. **Execute o projeto em modo de desenvolvimento**
```sh
npm run dev
# ou
yarn dev
```

6. Acesse `http://localhost:8080` no seu navegador

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza o Supabase como backend, que por sua vez usa PostgreSQL. Abaixo está a estrutura das principais tabelas necessárias:

### Tabelas SQL Necessárias

#### `perfis` - Informações de perfil de usuário
```sql
CREATE TABLE perfis (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  nome TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `papeis_usuario` - Papéis de usuário (admin, etc)
```sql
CREATE TABLE papeis_usuario (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES perfis(id) NOT NULL,
  papel TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, papel)
);
```

#### `filmes` - Catálogo de filmes
```sql
CREATE TABLE filmes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  sinopse TEXT,
  ano INTEGER,
  duracao INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  video_url TEXT,
  generos TEXT[],
  classificacao FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  imdb_id TEXT,
  tmdb_id INTEGER
);
```

#### `series` - Catálogo de séries
```sql
CREATE TABLE series (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  titulo TEXT NOT NULL,
  sinopse TEXT,
  ano_inicio INTEGER,
  ano_fim INTEGER,
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  generos TEXT[],
  classificacao FLOAT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  imdb_id TEXT,
  tmdb_id INTEGER
);
```

#### `temporadas` - Temporadas das séries
```sql
CREATE TABLE temporadas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  serie_id UUID REFERENCES series(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  titulo TEXT,
  sinopse TEXT,
  poster_url TEXT,
  ano INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `episodios` - Episódios das temporadas
```sql
CREATE TABLE episodios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  temporada_id UUID REFERENCES temporadas(id) ON DELETE CASCADE,
  numero INTEGER NOT NULL,
  titulo TEXT NOT NULL,
  sinopse TEXT,
  duracao INTEGER,
  video_url TEXT,
  still_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `favoritos` - Lista de favoritos dos usuários
```sql
CREATE TABLE favoritos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES perfis(id) ON DELETE CASCADE,
  filme_id UUID REFERENCES filmes(id) ON DELETE CASCADE,
  serie_id UUID REFERENCES series(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((filme_id IS NULL AND serie_id IS NOT NULL) OR (filme_id IS NOT NULL AND serie_id IS NULL))
);
```

#### `comentarios` - Comentários em filmes e séries
```sql
CREATE TABLE comentarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES perfis(id) ON DELETE CASCADE NOT NULL,
  filme_id UUID REFERENCES filmes(id) ON DELETE CASCADE,
  serie_id UUID REFERENCES series(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK ((filme_id IS NULL AND serie_id IS NOT NULL) OR (filme_id IS NOT NULL AND serie_id IS NULL))
);
```

#### `notificacoes` - Sistema de notificações
```sql
CREATE TABLE notificacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES perfis(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  lida BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Funções RPC

É necessário criar algumas funções RPC no Supabase para auxiliar nas operações comuns:

#### Verificar Papel de Usuário
```sql
CREATE OR REPLACE FUNCTION tem_papel(usuario_id UUID, tipo_papel_param TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM papeis_usuario
    WHERE user_id = usuario_id
    AND papel = tipo_papel_param
  );
END;
$$;
```

### Políticas de Segurança (RLS)

Configure as políticas de Row Level Security no Supabase para proteger seus dados:

1. Ative RLS em todas as tabelas
2. Configure políticas para cada tabela, por exemplo:

```sql
-- Política para perfis (usuários podem ver todos os perfis mas editar apenas o próprio)
CREATE POLICY "Usuários podem ver todos os perfis"
  ON perfis FOR SELECT
  USING (true);

CREATE POLICY "Usuários podem editar apenas o próprio perfil"
  ON perfis FOR UPDATE
  USING (auth.uid() = id);

-- Política para filmes (todos podem ver, apenas admins podem editar)
CREATE POLICY "Todos podem ver filmes"
  ON filmes FOR SELECT
  USING (true);

CREATE POLICY "Apenas admins podem editar filmes"
  ON filmes FOR INSERT
  USING (tem_papel(auth.uid(), 'admin'));
```

## 🚀 Deployment

### Opção 1: Hospedagem via Lovable
A maneira mais simples de implantar o projeto é usando a própria plataforma Lovable:

1. Acesse o projeto no [Lovable](https://lovable.dev/projects/bf6b61d4-6d7d-44bf-940b-eb278188d6a5)
2. Clique em Share -> Publish

### Opção 2: Self-hosting com Netlify ou Vercel

Para hospedar o front-end:

1. Crie uma conta no [Netlify](https://netlify.com) ou [Vercel](https://vercel.com)
2. Conecte seu repositório GitHub
3. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

1. Faça um fork do projeto
2. Crie sua branch de feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT.

## 🙏 Agradecimentos

- [Lovable](https://lovable.dev) - Plataforma usada para desenvolver o projeto
- [Supabase](https://supabase.com) - Backend como serviço
- [Shadcn UI](https://ui.shadcn.com/) - Componentes React
- Todos os desenvolvedores de bibliotecas open source utilizadas neste projeto

---

<div align="center">
  <p>Desenvolvido com ❤️ usando <a href="https://lovable.dev">Lovable</a></p>
  <a href="https://lovable.dev/projects/bf6b61d4-6d7d-44bf-940b-eb278188d6a5">Ver projeto no Lovable</a>
</div>
