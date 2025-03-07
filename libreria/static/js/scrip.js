document.addEventListener("DOMContentLoaded", function() {
    // Manejar el formulario de creación 
    document.getElementById("formCrearLibro").addEventListener("submit", async function(event) {
        event.preventDefault();

        let formData = new FormData();
        formData.append("titulo", document.getElementById("titulo").value);
        formData.append("descripcion", document.getElementById("descripcion").value);
        formData.append("imagen", document.getElementById("imagen").files[0]);

        //Aquí se usa la Fetch API para hacer una solicitud POST al servidor con 
        // los datos del nuevo libro (título, descripción, imagen).
        const response = await fetch("{% url 'crear' %}", {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
            }
        });

        if (response.ok) {
            const nuevoLibro = await response.json();

            // Crear una nueva fila en la tabla sin recargar
            let nuevaFila = document.createElement("tr");
            nuevaFila.id = `fila-libro-${nuevoLibro.id}`;
            nuevaFila.innerHTML = `
                <td>${nuevoLibro.id}</td>
                <td>${nuevoLibro.titulo}</td>
                <td><img src="${nuevoLibro.imagen}" height="100" /></td>
                <td>${nuevoLibro.descripcion}</td>
                <td>
                    <button class="btn btn-info btn-editar"
                        data-id="${nuevoLibro.id}"
                        data-titulo="${nuevoLibro.titulo}"
                        data-descripcion="${nuevoLibro.descripcion}"
                        data-imagen="${nuevoLibro.imagen}">
                        Editar
                    </button> |
                    <button class="btn btn-danger btn-eliminar" data-id="${nuevoLibro.id}">Borrar</button>
                </td>
            `;

            document.getElementById("libros-list").appendChild(nuevaFila);

            // Cerrar el modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("crearLibroModal"));
            modal.hide();

            // Resetear formulario
            document.getElementById("formCrearLibro").reset();
        } else {
            alert("Error al agregar el libro");
        }
    });

    // Manejar la apertura del modal de edición
    document.addEventListener("click", function(event) {
    if (event.target.classList.contains("btn-editar")) {
        const libroId = event.target.getAttribute("data-id");
        const libroTitulo = event.target.getAttribute("data-titulo");
        const libroDescripcion = event.target.getAttribute("data-descripcion");
        const libroImagen = event.target.getAttribute("data-imagen");

        // Llenar los campos del formulario de edición
        document.getElementById("editLibroId").value = libroId;
        document.getElementById("editTitulo").value = libroTitulo;
        document.getElementById("editDescripcion").value = libroDescripcion;

        // Abre el modal
        new bootstrap.Modal(document.getElementById("editarLibroModal")).show();
    }
});


    // Manejar la edición de un libro 
    document.getElementById("formEditarLibro").addEventListener("submit", async function(event) {
        event.preventDefault();

        const libroId = document.getElementById("editLibroId").value;
        let formData = new FormData();
        formData.append("titulo", document.getElementById("editTitulo").value);
        formData.append("descripcion", document.getElementById("editDescripcion").value);
        if (document.getElementById("editImagen").files.length > 0) {
            formData.append("imagen", document.getElementById("editImagen").files[0]);
        }

        //Fetch API se utiliza para realizar una solicitud POST 
        // con los datos editados de un libro al servidor.
        const response = await fetch(`/libros/editar/${libroId}/`, {
            method: "POST",
            body: formData,
            headers: {
                "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
            }
        });

        if (response.ok) {
            const libroActualizado = await response.json();

            // Actualizar la fila 
            const fila = document.getElementById(`fila-libro-${libroActualizado.id}`);
            fila.innerHTML = `
                <td>${libroActualizado.id}</td>
                <td>${libroActualizado.titulo}</td>
                <td><img src="${libroActualizado.imagen}" height="100" /></td>
                <td>${libroActualizado.descripcion}</td>
                <td>
                    <button class="btn btn-info btn-editar"
                        data-id="${libroActualizado.id}"
                        data-titulo="${libroActualizado.titulo}"
                        data-descripcion="${libroActualizado.descripcion}"
                        data-imagen="${libroActualizado.imagen}">
                        Editar
                    </button> |
                    <button class="btn btn-danger btn-eliminar" data-id="${libroActualizado.id}">Borrar</button>
                </td>
            `;

            // Cerrar el modal
            let modal = bootstrap.Modal.getInstance(document.getElementById("editarLibroModal"));
            modal.hide();

            // Resetear formulario
            document.getElementById("formEditarLibro").reset();
        } else {
            alert("Error al editar el libro");
        }
    });

    // Manejar la eliminación de libros sin recargar la página
    document.addEventListener("click", async function(event) {
        if (event.target.classList.contains("btn-eliminar")) {
            const libroId = event.target.getAttribute("data-id");

            //Fetch API para hacer una solicitud DELETE al servidor y eliminar un libro.
            const response = await fetch(`/libros/eliminar/${libroId}/`, {
                method: "DELETE",
                headers: {
                    "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]").value,
                }
            });

            if (response.ok) {
                // Eliminar la fila del DOM si la eliminación fue exitosa
                const fila = document.getElementById(`fila-libro-${libroId}`);
                fila.remove();
            } else {
                alert("Error al eliminar el libro");
            }
        }
    });
});