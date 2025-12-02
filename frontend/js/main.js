/* -------------
    Parte 2 
-----------------*/
/* Se crea el objeto alumno */
let alumno = {
    dni: "40479981",
    nombre: "Lautaro",
    apellido: "Dellagiovanna"
};

/* Se guardan las variables del DOM requeridas para luego modificar su innerHTML o añadirle eventos */
const navContadorProductosCarrito = document.getElementById("nav-contador-prod-carrito");
const navNombreAlumno = document.getElementById("nav-nombre-alumno");
const contenedorProductos = document.getElementById("contenedor-productos");
const barraBusqueda = document.getElementById("barra-busqueda");
const contenedorCarrito = document.getElementById("contenedor-carrito");

/* Se añade el evento de keyup a la barra de busqueda, la cual llamará a la función filtrarProductos */
barraBusqueda.addEventListener("keyup", filtrarProductos);

/* Se crea el array vacio de carrito donde se irán añadiendo al presionar el botón correspondiente */
let carrito = [];


/* -------------
    Parte 1  
-----------------*/
/* Esta función muestra el nombre, apellido y dni del alumno en html del elemento navNombreAlumno 
    y en la consola. Primero se concatena en una varible string para luego asignarla al html y realizar
    el console.log*/
function imprimirDatosAlumno(){
    let nombreAlumno = `${alumno.nombre} ${alumno.apellido} - ${alumno.dni}`
    navNombreAlumno.innerHTML = nombreAlumno;
    console.log(nombreAlumno);
}

/* Esta función añade html a la sección de contenedor de productos.
    Primero borra por completo el html asignadoles un string vacío.
    Luego recorre el array de productos y por cada uno añade al string
    un string que representa html con la información de cada producto. */
function mostrarProductos(array){
    contenedorProductos.innerHTML = "";
    
    array.forEach(prod => {
        contenedorProductos.innerHTML += `
            <div class="card-producto">
                <img src="${prod.imagen}" alt="${prod.nombre}">
                <div class="card-producto-info">
                    <h3>${prod.nombre}</h3>
                    <p>$${prod.precio}</p>
                    <button onClick="agregarACarrito(${prod.id})">Agregar al carrito</button>
                </div>
            </div>
        `
    })
    
}

/* Esta función la llama el evento keyup asignado a la barra de busqueda.
    Obtiene el texto que se introdujo en la barra para luego realizar un
    filtrado de productos, lo cual devuelve aquellos un array con aquellos 
    cuyo nombre contenga el texto introducido en la barra. 
    Finalmente los muestra para refrescar el html de la sección de productos
    sólo con el array ya filtrado. */
function filtrarProductos(){
    textoBuscado = barraBusqueda.value.toLowerCase();
    
    prodBuscados = productos.filter(prod => 
        prod.nombre.toLowerCase().includes(textoBuscado)
    );

    mostrarProductos(prodBuscados);
}

/* Esta función la llaman los botones que pertenecen a los productos.
    Recibe por parámetro el id del producto que se quiere añadir, el
    cual se añade luego de buscarlo por id en el array de productos.
    Luego se lo guarda en el storage local y finalmente se muestra el carrito actual
 */
function agregarACarrito(idProducto){
    carrito.push(productos.find(p => p.id == idProducto));
    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();
}


function actualizarContadorCarrito(){
    navContadorProductosCarrito.innerHTML = `Carrito: ${carrito.length} Productos`;
}

/* Función para guardar el carrito en el localstorage.
Lo guarda en formate texto con el nombre de "carrito" */
function guardarCarritoEnLocalStorage(){
    sessionStorage.setItem("carrito", JSON.stringify(carrito));
}

/* Carga el carrito desde el localstorage. Como este se encuentra
en formato texto, luego hay que parsearlo a objeto JSON. */
function cargarCarritoDesdeLocalStorage(){
    let textoCarrito = sessionStorage.getItem("carrito");

    if (textoCarrito) {
        carrito = JSON.parse(textoCarrito);
    }
}


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

function checkUserSession(){
    if(!sessionStorage.getItem("userName")){
        window.location.href = "bienvenida.html"
    }
}

/* Función que llama a todas la funciones necesariar para mostra la página por primera vez. */
async function init(){
    /* Se crea el array de productos con los campos requeridos */
    productos = await obtenerProductos();
    mostrarProductos(productos);
    cargarCarritoDesdeLocalStorage();
    actualizarContadorCarrito();
}

checkUserSession();
init();