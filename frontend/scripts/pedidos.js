const url = "http://localhost:8081/comandas";
const urlProdutos = "http://localhost:8081/produtos";
const urlPedidos = "http://localhost:8081/pedidos";


fetch(url, {
    method: "GET"
}).then((r) => r.json()).then((json) => {
    const select = document.getElementById("comandas");
    json.forEach(e => {
        let opt = document.createElement('option');
        opt.value = e.ID;
        opt.innerHTML = e.Identificacao;
        select.appendChild(opt);
    })
})


let Allprodutos = []
fetch(urlProdutos, {
    method: "GET"
}).then((r) => r.json()).then((json) => {
    const select = document.getElementById("produtos");
    json.forEach(e => {
        Allprodutos.push(e)
        let opt = document.createElement('option');
        opt.value = e.ID;
        opt.innerHTML = e.Name;
        select.appendChild(opt);
    })
})



const btnAddProduto = document.getElementById("addProduto");
let produtos = [];

btnAddProduto.addEventListener("click", function(e){
    e.preventDefault();
    let opt = parseInt(document.getElementById("produtos").value)
    let qtd = parseInt(document.getElementById("qtd").value)
    let preco = Allprodutos.find(p => p.ID === opt)
    produtos.push({
        ProdutoID: opt,
        Quantidade: qtd,
        Preco: parseFloat(preco.Preco) * qtd
    })

})

document.getElementById("PedidoForm").addEventListener("submit", function(e){
    e.preventDefault()
    const comandaID = parseInt(document.getElementById("comandas").value)
    let pedido = {
        StatusPedido: 0,
        ComandaID: comandaID,
        Produtos: produtos
    }

    console.log(pedido)
    fetch(urlPedidos, {
        method: "POST",
        body: JSON.stringify(pedido),
        headers: {"content-type": "application/json; charset=utf-8"}
    }).then(response => response.text()).then(result => {console.log(result)}).catch(error => {console.error(error)})

})
