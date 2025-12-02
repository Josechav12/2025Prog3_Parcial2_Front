const contenedorCarrito = document.getElementById("contenedor-carrito");

let carrito = [];

async function obtenerProductos(){
    let respuesta = await fetch("http://localhost:3000/api/products");
    console.log(respuesta);
    data = await respuesta.json();

    if (respuesta.ok) {
        console.log(data.message);

        let productos = data.payload;

        console.table(productos);

        return productos;

    } else {
        alert("Error obteniendo productos")
        return [];
    }
}

/* Esta función la llaman los botones que pertenecen a los items del carrito.
    Recibe por parámetro el id del producto que se quiere quitar, como puede haber
    varios con el mismo id, se realiza una búsqueda para obtener el index del primer
    caso donde los id coincidan, luego se remueve el elemento.
    Luego se lo guarda en el storage local y finalmente se muestra el carrito actual
 */
function eliminarProducto(idProducto){
    index = carrito.findIndex(item => item.id == idProducto);
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
}

/* Esta función le asigna al carrito un array vacío. De esta forma se borran todos los objetos que posee. 
    Luego se lo guarda en el localstorage para también vaciar el mismo.*/
function vaciarCarrito(){
    carrito = [];
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

/* Carga el carrito desde el localstorage. Como este se encuentra
en formato texto, luego hay que parsearlo a objeto JSON. */
function cargarCarritoDesdeLocalStorage(){
    let textoCarrito = sessionStorage.getItem("carrito");

    if (textoCarrito) {
        carrito = JSON.parse(textoCarrito);
    }
}

/* Función para guardar el carrito en el localstorage.
Lo guarda en formate texto con el nombre de "carrito" */
function guardarCarritoEnLocalStorage(){
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Esta función introduce html en la sección contenedor-carrito.
Recorre el array carrito e introduce el string html con la información requerida.
Muestra el botón de vaciar carrito y, además, suma los precios del los productos del carrito y los muestra en el nav.*/
function mostrarCarrito(){
    console.log(carrito);
    contenedorCarrito.innerHTML = `<h1>Carrito</h1><ul id="listado-carrito">`;
    
    carrito.forEach(prod => {
        contenedorCarrito.innerHTML += `
            <li class="bloque-item">
                <img class="carrito-img" src="${prod.imagen}" alt="${prod.nombre}">
                <p class="nombre-item">${prod.nombre} - $${prod.precio}</p>
                <button class="boton-ordenar" onClick="eliminarProducto(${prod.id})">Eliminar</button>
            </li>
        `    
    })

    contenedorCarrito.innerHTML += "</ul>";

    
    if(carrito.length > 0){
        contenedorCarrito.innerHTML += `
            <div id="div-botones-carrito"> 
                <button id="boton-vaciar-carrito" class="boton-carrito" onClick="vaciarCarrito()">Vaciar Carrito</button>
                <button id="boton-comprar" class="boton-carrito" onClick="comprar()">Comprar</button> 
            </div>`;
        contenedorCarrito.innerHTML += `<h4 id="total-precio-carrito">Total: $${calcularPrecioTotal()}</h4>`;
    }
}

function calcularPrecioTotal() {
    let precioTotal = 0;
    precioTotal = carrito.reduce((precioTotal, item) => { return precioTotal + item.precio;}, 0);
    return precioTotal;
}

/* Esta función la llaman los botones que pertenecen a los items del carrito.
    Recibe por parámetro el id del producto que se quiere quitar, como puede haber
    varios con el mismo id, se realiza una búsqueda para obtener el index del primer
    caso donde los id coincidan, luego se remueve el elemento.
    Luego se lo guarda en el storage local y finalmente se muestra el carrito actual
 */
function eliminarProducto(idProducto){
    index = carrito.findIndex(item => item.id == idProducto);
    carrito.splice(index, 1);
    guardarCarritoEnLocalStorage();
    mostrarCarrito();
}

async function comprar() {

    let data = {}

    data['nombre'] = sessionStorage.getItem("userName");
    data['precio'] = calcularPrecioTotal();
    data['productos'] = [];

    carrito.forEach(prod => {
        data['productos'].push(prod.id);
    });

    console.log(JSON.stringify(data))

    let respuesta = await fetch("http://localhost:3000/api/tickets/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    data = await respuesta.json();
    console.log(data)

    if (respuesta.ok) {
        console.log(data.message);

        window.location.href = "ticket.html"

    } else {
        alert("Error creando ticket")
        return [];
    }

}
function checkUserSession(){
    if(!sessionStorage.getItem("userName")){
        window.location.href = "bienvenida.html"
    }
}

/* Función que llama a todas la funciones necesariar para mostra la página por primera vez. */
async function initCarrito(){
    productos = await obtenerProductos();
    cargarCarritoDesdeLocalStorage();
    mostrarCarrito();
}

checkUserSession();
initCarrito();