// Referencias a los elementos del DOM
const clienteForm = document.getElementById('clienteForm');
const clientesTable = document.getElementById('clientesTable').querySelector('tbody');

// Cargar la lista de clientes al cargar la página
document.addEventListener('DOMContentLoaded', cargarClientes);

// Función para cargar clientes desde el backend
async function cargarClientes() {
    try {
        const response = await fetch('/api/clientes');
        const clientes = await response.json();

        clientesTable.innerHTML = ''; // Limpiar tabla antes de cargar nuevos datos
        clientes.forEach(cliente => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${cliente.id}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.email}</td>
                <td>${cliente.destino}</td>
                <td>
                    <button class="edit-btn" onclick="editarCliente(${cliente.id})">Editar</button>
                    <button class="delete-btn" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                </td>
            `;
            clientesTable.appendChild(fila);
        });
    } catch (error) {
        console.error('Error al cargar clientes:', error);
    }
}

// Función para agregar un cliente
clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoCliente = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        destino: document.getElementById('destino').value
    };

    try {
        const response = await fetch('/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoCliente)
        });

        if (response.ok) {
            clienteForm.reset();
            cargarClientes(); // Recargar la lista de clientes
        } else {
            console.error('Error al agregar cliente:', response.statusText);
        }
    } catch (error) {
        console.error('Error al agregar cliente:', error);
    }
});

// Función para eliminar un cliente
async function eliminarCliente(id) {
    try {
        const response = await fetch(`/api/clientes/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            cargarClientes(); // Recargar la lista de clientes
        } else {
            console.error('Error al eliminar cliente:', response.statusText);
        }
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
    }
}

// (Opcional) Función para editar un cliente
async function editarCliente(id) {
    // Aquí puedes abrir un modal o actualizar el formulario con los datos del cliente para editarlo.
    // Luego enviar una solicitud PUT similar a la de agregar cliente.
}
