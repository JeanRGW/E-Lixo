"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let list = null;
let selectedItems = [];
function getList() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (list === null) {
                const response = yield fetch("http://localhost:3000/lista");
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                list = yield response.json();
            }
            return list;
        }
        catch (error) {
            console.error("Error fetching or storing data:", error);
            return [];
        }
    });
}
function updateTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const data = yield getList();
            const tableBody = document.getElementById("tableBody");
            tableBody.innerHTML = "";
            console.log(data);
            data.forEach((item, index) => {
                const row = document.createElement("tr");
                row.className = index % 2 == 0 ? "tEven" : "tOdd";
                const categoriaCell = document.createElement("td");
                categoriaCell.textContent = item.item.categoria;
                const tipoCell = document.createElement("td");
                tipoCell.textContent = item.item.tipo;
                const modeloCell = document.createElement("td");
                modeloCell.textContent = item.item.modelo;
                row.setAttribute("objectId", item._id);
                row.appendChild(categoriaCell);
                row.appendChild(tipoCell);
                row.appendChild(modeloCell);
                tableBody.appendChild(row);
                row.addEventListener("click", () => {
                    const objectId = row.getAttribute("objectId");
                    row.classList.toggle("selected");
                    var index = selectedItems.indexOf(objectId);
                    if (index != -1) {
                        selectedItems.splice(index, 1);
                    }
                    else {
                        selectedItems.push(objectId);
                    }
                    console.log("Row clicked - objectId:", objectId);
                });
            });
        }
        catch (error) {
            console.error("Error updating table:", error);
        }
    });
}
function reservar(nome) {
    return __awaiter(this, void 0, void 0, function* () {
        selectedItems.forEach((item) => {
            let data = {
                nome: nome,
                objectId: item,
            };
            fetch("http://localhost:3000/reservar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            }).then((response) => {
                if (response.ok) {
                    window.alert("Reservado com sucesso!");
                    var index = selectedItems.indexOf(item);
                    if (index != -1) {
                        selectedItems.splice(index, 1);
                    }
                    list = null;
                    updateTable();
                }
                else {
                    window.alert("Erro ao reservar");
                }
            });
        });
    });
}
updateTable();
