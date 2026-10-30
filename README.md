# 🛍️ SmartStore AI

### Loja Virtual Inteligente com Machine Learning, CRUD e Supabase

O **SmartStore AI** é um projeto educacional que integra três trilhas de desenvolvimento: **criação de uma loja virtual**, **treinamento de um modelo de Inteligência Artificial em Python** e **gerenciamento de produtos com CRUD e banco de dados PostgreSQL**.

O resultado é uma aplicação com vitrine de produtos, recomendação por categoria baseada no texto digitado pelo cliente e um painel administrativo para cadastrar, listar, editar e excluir produtos.

> **Projeto educacional CodeMinds** — desenvolvido para praticar desenvolvimento web, integração de APIs, Machine Learning, banco de dados e autenticação.

## ✨ Funcionalidades

### 🛒 Loja virtual

- Exibição de produtos cadastrados no Supabase.
- Cards com imagem, nome, descrição e preço.
- Interface responsiva com Bootstrap.
- Botão de compra com contador de carrinho demonstrativo.
- Campo para o cliente descrever o que procura.
- Filtragem da vitrine pela categoria retornada pelo modelo de IA.

### 🤖 Inteligência Artificial

- Dados de treinamento no arquivo `dados.csv`.
- Vetorização de textos com `TfidfVectorizer`.
- Classificação de categorias com `LogisticRegression`, do Scikit-learn.
- Treinamento do modelo com `treinar_modelo.py`.
- Persistência de modelo e vetorizador com Joblib, na pasta `modelos/`.
- Teste do modelo pelo terminal com `usar_modelo.py`.
- API Flask com endpoint `POST /prever` para receber o texto e devolver uma categoria prevista.

### 🧰 Painel administrativo

- Página separada para os funcionários.
- Login com e-mail e senha via Supabase Auth.
- Verificação de sessão antes de carregar os produtos no painel.
- Botão de logout.
- CRUD de produtos: cadastrar, consultar, editar e excluir.
- Atualização da lista após alterações.

## 🧱 Tecnologias utilizadas

| Camada | Tecnologias |
| --- | --- |
| Front-end | HTML5, CSS3, JavaScript |
| Interface | Bootstrap 5.3.3 |
| Back-end e API | Python, Flask, Flask-CORS |
| Machine Learning | Scikit-learn, TF-IDF, Regressão Logística |
| Dados e modelo | Pandas, CSV, Joblib |
| Banco de dados | PostgreSQL, Supabase |
| Autenticação | Supabase Auth |
| Integração | Fetch API, JSON, supabase-js v2 |
| Versionamento | Git, GitHub |

## 🗂️ Estrutura do projeto

```text
.
├── api.py                  # API Flask que serve as previsões
├── dados.csv               # Base de treinamento
├── treinar_modelo.py       # Treina e salva o classificador
├── usar_modelo.py          # Testes de previsão no terminal
├── modelos/
│   ├── model.pkl           # Modelo treinado
│   └── vectorizer.pkl      # Vetorizador treinado
└── lojaVirtual/
    ├── index.html          # Vitrine pública
    ├── script.js           # Produtos, carrinho e integração com a IA
    ├── style.css           # Estilos da loja
    ├── login.html          # Tela de login do funcionário
    ├── login.js            # Autenticação no Supabase
    ├── painel.html         # Página administrativa
    ├── painel.js           # CRUD e sessão administrativa
    └── produtos.js         # Lista local legada, mantida como referência
```

## 🔄 Como o sistema funciona

```text
Cliente digita o que procura
             ↓
       Loja (JavaScript)
             ↓ POST /prever
         API Flask
             ↓
  Vetorizador + Modelo de ML
             ↓
      Categoria prevista
             ↓
  Filtragem dos produtos que
      vieram do Supabase
             ↓
     Vitrine recomendada

Funcionário → Login → Painel → CRUD → Supabase/PostgreSQL
                                          ↓
                                   Vitrine da loja
```

O modelo **classifica o texto do cliente** e retorna uma categoria; a loja usa essa categoria para filtrar os produtos carregados do banco. O modelo não gera descrições nem recomenda produtos individualmente por similaridade.

## 🚀 Como executar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/profAndreaFranca/CRUD---Parte-6--Final.git
cd CRUD---Parte-6--Final
```

### 2. Preparar o ambiente Python

Recomenda-se Python 3.10 ou superior e um ambiente virtual:

```bash
python -m venv .venv
```

No Windows (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

No macOS/Linux:

```bash
source .venv/bin/activate
```

Instale as dependências usadas pelo código:

```bash
pip install flask flask-cors pandas scikit-learn joblib
```

### 3. Preparar o modelo de IA

O repositório já contém arquivos de modelo treinado em `modelos/`. Se quiser refazer o treinamento a partir do CSV:

```bash
python treinar_modelo.py
```

Para testar previsões diretamente no terminal:

```bash
python usar_modelo.py
```

### 4. Iniciar a API Flask

A partir da raiz do projeto:

```bash
python api.py
```

O código utiliza o endereço local padrão do Flask: `http://127.0.0.1:5000`. O endpoint de previsão é:

```http
POST http://127.0.0.1:5000/prever
Content-Type: application/json
```

Exemplo de corpo:

```json
{
  "texto": "quero um notebook para estudar"
}
```

A resposta contém a categoria prevista pelo modelo:

```json
{
  "categoria": "notebook"
}
```

A categoria retornada depende do modelo e do conjunto de treinamento.

### 5. Configurar o Supabase

Crie ou utilize um projeto Supabase com uma tabela `produtos` compatível com os campos usados pela aplicação:

| Campo | Tipo sugerido | Finalidade |
| --- | --- | --- |
| `id` | `bigint` / identity | Identificação do produto |
| `nome` | `text` | Nome do produto |
| `descricao` | `text` | Descrição |
| `preco` | `numeric` | Preço |
| `categoria` | `text` | Categoria de classificação |
| `imagem_url` | `text` | URL de imagem |
| `created_at` | `timestamptz` | Data do cadastro (opcional) |

Configure a **URL do projeto** e a **chave pública** nos arquivos `lojaVirtual/script.js`, `lojaVirtual/login.js` e `lojaVirtual/painel.js`. O código atual já traz configurações de um projeto específico; substitua-as pelas de seu ambiente ao reutilizá-lo.

Crie os usuários de teste em **Supabase → Authentication → Users** e configure as políticas de **Row Level Security (RLS)** antes de permitir modificações no banco. Não utilize a chave `service_role` ou outras credenciais secretas no navegador.

> **Importante:** a verificação de sessão implementada no painel é uma etapa didática de autenticação e não substitui autorização no banco. Para impedir gravações por visitantes ou contas que não sejam funcionários, configure políticas RLS que permitam `INSERT`, `UPDATE` e `DELETE` somente para usuários autorizados.

### 6. Abrir a loja

Sirva a pasta `lojaVirtual/` por um servidor local, por exemplo a extensão **Live Server** no VS Code, e abra o `index.html`.

Mantenha a API Flask em execução enquanto testar a busca com IA. Para o uso em outro dispositivo ou hospedagem, será necessário configurar a URL da API adequadamente.

## 🧪 Testes sugeridos

1. Verifique se a vitrine apresenta os produtos salvos no Supabase.
2. Digite uma frase de busca e observe a categoria retornada pela IA e os produtos filtrados.
3. Faça login em `login.html` com uma conta cadastrada.
4. Cadastre um produto no painel e confirme seu aparecimento na loja.
5. Edite e exclua produtos de teste.
6. Faça logout e verifique o redirecionamento ao tentar acessar o painel sem sessão.

## 🔐 Observações de segurança e limitações

- O projeto é educacional e **não implementa checkout ou pagamentos reais**; o carrinho é demonstrativo.
- A API Flask está configurada para execução local com `debug=True`; desative esse modo em produção.
- O login identifica usuários, mas as permissões de funcionários precisam ser reforçadas com RLS e gestão de papéis.
- As categorias retornadas pelo modelo precisam corresponder aos valores usados na tabela de produtos para que a filtragem funcione corretamente.
- Os arquivos de modelo serializado (`.pkl`) devem ser carregados somente de fontes confiáveis.
- Antes de publicar uma versão de produção, revise tratamento de erros, validação de formulários, políticas de acesso e configurações do backend.

## 🎓 Aprendizados do projeto

Este projeto reúne três etapas complementares:

**1. Loja Virtual com IA como copiloto:** construção de interface e lógica de vitrine usando tecnologias web.

**2. Criação de modelo de previsão com IA:** organização de dados, treinamento de classificador de texto e disponibilização de previsões por API.

**3. CRUD e banco de dados real:** persistência no PostgreSQL/Supabase, operações de criação/leitura/edição/exclusão e autenticação para a área administrativa.

A integração mostra o fluxo de uma aplicação: **interface → API de IA → classificação → produtos no banco → experiência personalizada**.

---

**Projeto educacional CodeMinds**  
Repositório: https://github.com/profAndreaFranca/CRUD---Parte-6--Final
