// import {produtos} from "./produtos.js"
let produtos = [];

const SUPABASE_URL = "https://qhhhtozrfvhefbtrdina.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoaGh0b3pyZnZoZWZidHJkaW5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NTAzMjgsImV4cCI6MjA5NjUyNjMyOH0.S72wfz144zzzNnvAVVLZlZNjr69onv2biuB8l-Zjr3A";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let quantidadeCarrinho = 0; //let == var

const contadorCarrinho = document.getElementById("contador-carrinho");

const mensagemCarrinho = document.getElementById("mensagem-carrinho");
const campoIA = document.getElementById("campo-ia");
const botaoIA = document.getElementById("botao-ia");
const resultadoIA = document.getElementById("resultado-ia");
const listaProdutos = document.getElementById("lista-produtos")
const mensagensPorCategoria = {
  smartphone:"Veja nossão sessão de Smartphones",
  notebook:"Veja nossão sessão de Notebooks",
  fone:"Veja nossão sessão de Acessórios",
  teclado:"Veja nossão sessão de Periféricos", 
  tablet:"Veja nossão sessão de tablets",
  acessorio:"Veja nossão sessão de acessórios",
  videogame:"Veja nossão sessão de Video Games"
}

async function carregarProdutos() {
  const { data, error } = await supabaseClient.from("produtos").select("*");
  produtos = data;
  console.table(produtos)
  mostrarProdutos(produtos);
}

carregarProdutos();

function mostrarProdutos(lista){
  listaProdutos.innerHTML = ""
  lista.forEach(function(produto){
    listaProdutos.innerHTML += `
      <div class="col-md-4 mb-4">
        <div class="card h-100">
          <img src="${produto.imagem_url}" class="card-img-top" alt="${produto.nome}">
          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${produto.nome}</h5>
            <p class="card-text">${produto.descricao}</p>
            <p class="fw-semibold mb-3">R$ ${produto.preco.toFixed(2)}</p>
            <button class="btn btn-primary btn-comprar mt-auto botao-comprar" href="#">Comprar</button>
          </div>
        </div>
      </div>
    `
  })
  ativarBotoesComprar()
}

mostrarProdutos(produtos)

function ativarBotoesComprar(){
  const botoesComprar = document.querySelectorAll(".botao-comprar");
  botoesComprar.forEach(function (botao) {
    botao.addEventListener("click", function () {
      quantidadeCarrinho++;
      contadorCarrinho.textContent = quantidadeCarrinho;

      const card = botao.closest(".card");
      const nomeProduto = card.querySelector(".card-title").textContent;
      mensagemCarrinho.textContent = nomeProduto + " foi adicionado ao carrinho!";
      mensagemCarrinho.classList.remove("d-none");
      setTimeout(() => {
        mensagemCarrinho.classList.add("d-none");
      }, 2000);
    });
  });
}




// Função para simular a resposta da IA
// botaoIA.addEventListener("click",function(){
//   const texto = campoIA.value.toLocaleLowerCase().trim()
//   let resposta = ""

//   if(texto.includes("game") || texto.includes("jogo") || texto.includes("gamer")){
//     resposta = "Recomendamos o notebook Gamer XYZ, com processador Intel i7 e placa de vídeo NVIDIA RTX 3060."
//   }else if(texto.includes("trabalha")||texto.includes("trabalho")||texto.includes("business")){
//     resposta = "Recomendamos o notebook Business ABC, com processador Intel i5 e bateria de longa duração."
//   }else if(texto.includes("estuda")||texto.includes("estudante")||texto.includes("estudar")){
//     resposta = "Recomendamos o notebook Estudante DEF, com processador Intel i3 e preço acessível."
//   }else if(texto == ""){
//     resposta = "Por favor, digite uma descrição do produto que você está procurando."
//   }else{
//     resposta = "Desculpe, não encontrei o produto que você procura."
//   }

//   resultadoIA.textContent = resposta
//   resultadoIA.classList.remove("d-none")
// })

// botaoIA.addEventListener("click", async function () {
//   const pergunta = campoIA.value.trim();

//   try {
//     const resposta = await fetch("http://127.0.0.1:5000/prever", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         texto: pergunta,
//       }),
//     });

//     if (!resposta.ok) {
//       throw new Error(`Erro na requisição: ${resposta.status}`);
//     }

//     const dados = await resposta.json();
//     resultadoIA.textContent = "Categoria Recomendada: " + dados.categoria;
//     resultadoIA.classList.remove("d-none");
//   } catch (error) {
//     resultadoIA.textContent = "Erro ao conectar com o servidor. Verifique se o backend Flask está rodando.";
//     resultadoIA.classList.remove("d-none");
//     console.error(error);
//   }
// });

botaoIA.addEventListener("click", async function () {
  const pergunta = campoIA.value.trim();

  
    const resposta = await fetch("http://127.0.0.1:5000/prever", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto: pergunta,
      }),
    });

    const dados = await resposta.json();
    resultadoIA.classList.remove("d-none");
    let mensagem = ""
    for (const categoria in mensagensPorCategoria){
      if(dados.categoria == categoria){
        mensagem = mensagensPorCategoria[categoria]
        break;
      }
      else{
        mensagem = "Categoria Recomenndada" + dados.categoria
      }
    }
    resultadoIA.textContent = mensagem;
    const categoriaRecomendada = dados.categoria
    const produtosFiltrados = produtos.filter(produto => 
      produto.categoria == categoriaRecomendada )
    mostrarProdutos(produtosFiltrados)
    setTimeout(() => {resultadoIA.classList.add("d-none");
    }, 3000);

});
