const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

async function verificarLogin() {
  const { data } = await supabaseClient.auth.getSession();

  if (data.session === null) {
    window.location.href = "login.html";
    return;
  }

  console.log("Usuário logado:", data.session.user.email);

  carregarProdutosPainel();
}

verificarLogin();

console.log("Painel conectado ao Supabase!");

const nomeProduto = document.getElementById("nomeProduto");
const descricaoProduto = document.getElementById("descricaoProduto");
const precoProduto = document.getElementById("precoProduto");
const categoriaProduto = document.getElementById("categoriaProduto");
const imagemProduto = document.getElementById("imagemProduto");

const btnSalvar = document.getElementById("btnSalvar");
const listaProdutosPainel = document.getElementById("listaProdutosPainel");

const btnSair = document.getElementById("btnSair");

let produtoEditandoId = null;

async function salvarProduto() {
  const produto = {
    nome: nomeProduto.value,
    descricao: descricaoProduto.value,
    preco: Number(precoProduto.value),
    categoria: categoriaProduto.value,
    imagem_url: imagemProduto.value
  };

   if (produtoEditandoId === null) {
    const { error } = await supabaseClient
      .from("produtos")
      .insert([produto]);

    if (error) {
      console.log("Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto!");
      return;
    }

    alert("Produto cadastrado com sucesso!");
  } else {
    const { error } = await supabaseClient
      .from("produtos")
      .update(produto)
      .eq("id", produtoEditandoId);

    if (error) {
      console.log("Erro ao editar produto:", error);
      alert("Erro ao editar produto!");
      return;
    }

    alert("Produto atualizado com sucesso!");

    produtoEditandoId = null;
    btnSalvar.textContent = "Cadastrar Produto";
    btnSalvar.classList.remove("btn-primary");
    btnSalvar.classList.add("btn-success");
  }

  limparFormulario();
  carregarProdutosPainel();
}



function limparFormulario() {
  nomeProduto.value = "";
  descricaoProduto.value = "";
  precoProduto.value = "";
  categoriaProduto.value = "";
  imagemProduto.value = "";
}

btnSalvar.addEventListener("click", salvarProduto);

async function carregarProdutosPainel() {
  const { data, error } = await supabaseClient
    .from("produtos")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.log("Erro ao carregar produtos:", error);
    return;
  }

  mostrarProdutosPainel(data);
}

function mostrarProdutosPainel(produtos) {
  listaProdutosPainel.innerHTML = "";

  produtos.forEach(function (produto) {
    const item = document.createElement("div");

    item.classList.add(
      "border",
      "rounded",
      "p-3",
      "m-2",
      "col-3",
    );

    item.innerHTML = `
      <h5>${produto.nome}</h5>
      <img src="${produto.imagem_url}" 
        class="card-img-top" 
        style="height: 200px; width: 100%; object-fit: cover; border-radius: 5px;" 
        alt="${produto.nome}">
      <p style="height: 80px; overflow: hidden;">${produto.descricao}</p>
      <p><strong>Categoria:</strong> ${produto.categoria}</p>
      <p><strong>Preço:</strong> R$ ${produto.preco}</p>
      
      <button
        class="btn btn-warning btn-sm"
        onclick="editarProduto(
          ${produto.id},
          '${produto.nome}',
          '${produto.descricao}',
          ${produto.preco},
          '${produto.categoria}',
          '${produto.imagem_url}'
        ); location.href='#topo';"
      >
        Editar
      </button>

      <button
        class="btn btn-danger btn-sm"
        onclick="excluirProduto(${produto.id})"
      >
        Excluir
      </button>
    `;

    listaProdutosPainel.appendChild(item);
  });
}

//carregarProdutosPainel();

function editarProduto(id, nome, descricao, preco, categoria, imagem_url) {
  produtoEditandoId = id;

  nomeProduto.value = nome;
  descricaoProduto.value = descricao;
  precoProduto.value = preco;
  categoriaProduto.value = categoria;
  imagemProduto.value = imagem_url;

  btnSalvar.textContent = "Salvar Alterações";
  btnSalvar.classList.remove("btn-success");
  btnSalvar.classList.add("btn-primary");
}

async function excluirProduto(id) {
  const confirmar = confirm("Tem certeza que deseja excluir este produto?");

  if (confirmar === false) {
    return;
  }

  const { error } = await supabaseClient
    .from("produtos")
    .delete()
    .eq("id", id);

  if (error) {
    console.log("Erro ao excluir produto:", error);
    alert("Erro ao excluir produto!");
    return;
  }

  alert("Produto excluído com sucesso!");

  carregarProdutosPainel();
}

btnSair.addEventListener("click", async function () {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.log("Erro ao sair:", error);
    return;
  }

  window.location.href = "login.html";
});

