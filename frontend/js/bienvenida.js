const formIngresar = document.getElementById("form-nombre-cliente");

formIngresar.addEventListener("submit", async event => {

    event.preventDefault();

    let nombreUsuario = document.getElementById("campo-nombre-cliente").value;

    console.log(nombreUsuario);


    try {
        console.log(`Ingresando como ${nombreUsuario}`);
        sessionStorage.setItem("userName", nombreUsuario);
        window.location.href = "index.html";
    } catch (error) {
        console.error("Error al guardar el dato en session: ", error);
    }
});
