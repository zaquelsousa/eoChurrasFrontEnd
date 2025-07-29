const url = "http://localhost:8081/comandas";
const urlProdutos = "http://localhost:8081/produtos";
const urlPedidos = "http://localhost:8081/pedidos";


async function loadData(){
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


    let todosProdutos = [];

    async function getProdutos(){
        await fetch(urlProdutos, {
            method: "GET"
        }).then((r) => r.json()).then((json) => {
            json.forEach(e => {
                todosProdutos.push(e);
            })
        })
    }

    await getProdutos();

    let todosComandas = [];

    async function getComandas(){
        await fetch(url, {
            method: "GET"
        }).then((r) => r.json()).then((json) => {
            json.forEach(e => {
                todosComandas.push(e);
            })
        })
    }

    await getComandas();

    const pedidos = document.getElementById('Pedidos');
    const conteinerPedidos = document.createElement("div");

    fetch(urlPedidos,  {
        method: "GET"
    }).then((r) => r.json()).then((json) => {
        console.log(json)
        json.forEach(e => {
            const pedidosDiv = document.createElement("div");
            let comanda = document.createElement("h3");
            let comandaIdentificacao = todosComandas.find(c => c.ID === e.ComandaID)
            comanda.textContent = "Comanda: " + comandaIdentificacao.Identificacao;
            let ulProdutos = document.createElement("ul");
            e.Produtos.forEach(p => {
                let li = document.createElement("li");
                let produtoName = todosProdutos.find(prod => prod.ID === p.ProdutoID);
                console.log("produtoName", produtoName);
                li.textContent = "Produdo: " + produtoName.Name + " Quantidade: " + p.Quantidade
                ulProdutos.appendChild(li);
            })
            let btnConcluir = document.createElement("button")
            btnConcluir.textContent = "Feito" 
            let btnCancelar = document.createElement("button");
            btnCancelar.textContent = "Cancelar"
            
            let conteinerBtns = document.createElement("div");
            conteinerBtns.classList.add("conteiner-bts");
            conteinerBtns.append(btnConcluir, btnCancelar);
            pedidosDiv.append(comanda, ulProdutos, conteinerBtns);
            conteinerPedidos.appendChild(pedidosDiv);
        })
        pedidos.appendChild(conteinerPedidos);
    })

    const socket = new WebSocket("ws://localhost:8081/ws");

    socket.onopen = () => {
        console.log("concectado parsa");
    };

    socket.onmessage = (event) => {
        const novoPedido = JSON.parse(event.data);
        console.log("novo pediudo", novoPedido);

        const pedidosDiv = document.createElement("div");
        let comanda = document.createElement("h3");
        comanda.textContent = "Comanda: " + novoPedido.ComandaID;

        let ulProdutos = document.createElement("ul");
        novoPedido.Produtos.forEach(p => {
            let li = document.createElement("li");
            let produtoName = todosProdutos.find(prod => prod.ID === p.ProdutoID);
            li.textContent = "Produdo: " + produtoName.Name + " Quantidade: " + p.Quantidade
            ulProdutos.appendChild(li);
        });
        
        let btnConcluir = document.createElement("button")
        btnConcluir.textContent = "Feito" 
        let btnCancelar = document.createElement("button");
        btnCancelar.textContent = "Cancelar"

        let conteinerBtns = document.createElement("div");
        conteinerBtns.classList.add("conteiner-bts");
        conteinerBtns.append(btnConcluir, btnCancelar);

        pedidosDiv.append(comanda, ulProdutos, conteinerBtns);

        // adiciona o novo pedido ao container que já existe na página
        conteinerPedidos.appendChild(pedidosDiv);
    };
}

loadData()
