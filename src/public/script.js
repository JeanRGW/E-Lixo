// @ts-nocheck
let list = null; // Initialize list as null initially
let selectedItems = [];

async function getList() {
	try {
		if (list === null) {
			// Check if list has already been fetched
			const response = await fetch("http://localhost:3000/lista");
			if (!response.ok) {
				throw new Error("Network response was not ok");
			}
			list = await response.json(); // Store the fetched data in the global variable
		}
		return list; // Return the stored data
	} catch (error) {
		console.error("Error fetching or storing data:", error);
		return []; // Return an empty array in case of an error
	}
}

async function updateTable() {
	try {
		const data = await getList(); // Wait for the data to be fetched
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

			// Assign "objectId" as a data attribute to the row
			row.setAttribute("objectId", item._id);

			row.appendChild(categoriaCell);
			row.appendChild(tipoCell);
			row.appendChild(modeloCell);

			tableBody.appendChild(row);

			// Add click event listener to each row
			row.addEventListener("click", () => {
				const objectId = row.getAttribute("objectId");
				row.classList.toggle("selected");

				//toggle value
				var index = selectedItems.indexOf(objectId);

				if (index != -1) {
					selectedItems.splice(index, 1);
				} else {
					selectedItems.push(objectId);
				}

				console.log("Row clicked - objectId:", objectId);
				// Use objectId for further operations or processing
			});
		});
	} catch (error) {
		console.error("Error updating table:", error);
	}
}

async function reservar(nome) {
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
			} else {
				window.alert("Erro ao reservar");
			}
		});
	});
}

updateTable(); // Call updateTable directly to populate the table on page load
