const url = "http://localhost:8081/comandas";


const allComandas = document.getElementById('comandas')

fetch(url, {
    method: "GET"
}).then((response) => response.json()).then((json) => {

        const ConteinercomandasDiv = document.createElement("div");
        json.forEach(e => {
            const comandasDiv = document.createElement("div");

            console.log(e)
            console.log(`Preco: ${e.Preco} Fechada ${e.EstaFechada} data ${e.CreatedAt} Identificaçao: ${e.Identificacao}`);
            let title = document.createElement("h3");
            title.textContent = "Identificaçao: " + e.Identificacao;
            let preco = document.createElement("p");
            preco.textContent = "Valor: " + e.Preco;
            let status = document.createElement("p");
            status.textContent = "Status: " + e.EstaFechada;
            let date = document.createElement("p");
            date.textContent = "Data: " + e.CreatedAt;
            
            let btnFechar = document.createElement("button")
                btnFechar.textContent = "Fechar Conta" 
            let btnInfo = document.createElement("button");
            btnInfo.textContent = "mais informaçoes"
            comandasDiv.append(title, preco, status, date, btnFechar, btnInfo);
            ConteinercomandasDiv.appendChild(comandasDiv)
    })

    allComandas.appendChild(ConteinercomandasDiv)
})


document.getElementById("comandaForm").addEventListener("submit", function(event){
    event.preventDefault();
    const formData = document.getElementById("Identificacao"); 
        let _comanda = {
        Identificaçao: formData.value,
        EstaFechada: false,
        UserID: 1,
        Preco: 0
    }
    
    console.log(_comanda);
    fetch(url, {
        method: "POST",
        body: JSON.stringify(_comanda),
        headers: {"content-type": "application/json; charset=utf-8"}
    }).then(response => response.text()).then(result => {console.log(result)}).catch(error => {console.error(error)})
})
