/* Add event listener del botón a imprimir ticket */
const contenedorTicket = document.getElementById("contenedor-ticket");

let nombre = sessionStorage.getItem("userName");
let carrito = [];

function cargarCarritoDesdeSessionStorage(){
    let textoCarrito = sessionStorage.getItem("carrito");

    if (textoCarrito) {
        carrito = JSON.parse(textoCarrito);
    }
}


function mostrarTicket(){
    contenedorTicket.innerHTML = `<h1>Ticket</h1><ul id="listado-carrito">`;
    
    carrito.forEach(prod => {
        contenedorTicket.innerHTML += `
            <li class="bloque-item">
                <p class="nombre-item">${prod.nombre} - $${prod.precio}</p>
            </li>
        `    
    })
    contenedorTicket.innerHTML += "</ul>";
}

function checkUserSession(){
    if(!sessionStorage.getItem("userName")){
        window.location.href = "bienvenida.html"
    }
}

function borrarSession(){
    carrito = [];
    sessionStorage.setItem("carrito", carrito);
    sessionStorage.removeItem("userName");
}

function imprimirTicket() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    let y = 10;

    doc.setFontSize(20);
    doc.text("Electroniks - Ticket de compra", 10, y);
    y += 10;

    doc.text(`Nombre: ${nombre}`, 10, y)
    y += 10;

    doc.setFontSize(14);
    carrito.forEach(prod => {
        doc.text(`-    ${prod.nombre} - ${prod.precio}`, 10, y);
        y += 7;
    });

    doc.save("ticket.pdf");
}

function volverABienvenida(){
    borrarSession();
    window.location.href = "bienvenida.html"
}

function init() {
    checkUserSession();
    cargarCarritoDesdeSessionStorage();
    mostrarTicket();
    imprimirTicket();
}

init();
