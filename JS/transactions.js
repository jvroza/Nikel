const myModal = new bootstrap.Modal(document.getElementById("transaction-modal"));
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let editIndex = null;

let data = { transactions: [] };

document.getElementById("button-logout").addEventListener("click", logout);

document.querySelector(".button-float").addEventListener("click", () => {
    editIndex = null;
    document.getElementById("transaction-form").reset();

    document.getElementById("button-add").innerText = "Adicionar";
    document.getElementById("exampleModalLabel").innerText = "Adicionar Lançamento";

});

// ADICIONAR LANÇAMENTO
document.getElementById("transaction-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector('input[name="type-input"]:checked').value;

    if (editIndex !== null) {
        data.transactions[editIndex] = { value, type, description, date };

        saveData(data);
        getTransactions();
        myModal.hide();

        alert("Lançamento atualizado com sucesso!");

        editIndex = null;

        document.getElementById("transaction-form").reset();

        document.getElementById("button-add").innerText = "Adicionar";
        document.getElementById("exampleModalLabel").innerText = "Adicionar Lançamento";

        return;
    }

    data.transactions.unshift({ value, type, description, date });

    saveData(data);
    event.target.reset();
    myModal.hide();

    getTransactions();

    alert("Lançamento adicionado com sucesso!");
});

checklogged();

function checklogged() {
    if (session) {
        sessionStorage.setItem("logged", session);
        logged = session;
    }

    if (!logged) {
        window.location.href = "index.html";
        return;
    }

    const dataUser = localStorage.getItem(logged);
    if (dataUser) {
        data = JSON.parse(dataUser);
    }

    getTransactions();
}

function logout() {
    sessionStorage.removeItem("logged");
    localStorage.removeItem("session");
    window.location.href = "index.html";
}

function deleteTransaction(index) {
    if (confirm("Deseja realmente excluir este lançamento?")) {
        data.transactions.splice(index, 1);
        saveData(data);
        getTransactions();
    }
}

function editTransaction(index) {
    editIndex = index;

    const item = data.transactions[index];

    document.getElementById("value-input").value = item.value;
    document.getElementById("description-input").value = item.description;
    document.getElementById("date-input").value = item.date;
    document.querySelector(`input[name="type-input"][value="${item.type}"]`).checked = true;

    document.getElementById("exampleModalLabel").innerText = "Editar Lançamento";

    document.getElementById("button-add").innerText = "Atualizar";
    
    myModal.show();

}


function getTransactions() {
    const transactions = data.transactions;
    let transactionsHTML = ``;

    if (transactions.length) {
        transactions.forEach((item, index) => {
            let type = "Entrada";
            
            if (item.type === "2") {
                type = "Saída";
            }

            transactionsHTML += `
                <tr>
                    <th scope="row">${item.date}</th>
                    <th>R$ ${item.value.toFixed(2)}</th>
                    <td>${type}</td>
                    <td>${item.description}</td>
                    <td class="text-center">
                        <button class="button-edit" onclick="editTransaction(${index})">
                            <i class="bi bi-pencil-fill"></i>
                        </button>
                        <button class="button-delete" onclick="deleteTransaction(${index})">
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    document.getElementById("transaction-list").innerHTML = transactionsHTML;
}

function saveData(data) {
    localStorage.setItem(logged, JSON.stringify(data));
}