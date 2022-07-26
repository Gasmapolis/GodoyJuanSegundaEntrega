//////CLASES/////
class Producto {
    constructor(id, nombre, precio, foto, cantidad) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.foto = foto;
        this.cantidad = cantidad;
    }
}
class Carrito {
    constructor(id) {
        this.id = id;
        this.producto = [];
    }

    calcularTotal() {
        let total = 0;
        for (let i = 0; i < this.producto.length; i++) {
            total = total + this.producto[i].precio;
        }
        return total;
    }
}
// VARIABLES//
let producto1 = new Producto(1, "Pulsera", 450, "Pulsera.jpg", 0);
let producto2 = new Producto(2, "Mochila", 2200, "Mochila.jpg", 0);
let producto3 = new Producto(3, "Reloj Digital", 3100, "Reloj-Digital.jpg", 0);
let producto4 = new Producto(4, "Reloj Analog", 2000, "Reloj-Analogico.jpg", 0);
let producto5 = new Producto(5, "Gorra", 800, "Gorras.jpg", 0);
let carrito = new Carrito(1);

let listaProductos = [];
let catalogo = [];

catalogo.push(producto1);
catalogo.push(producto2);
catalogo.push(producto3);
catalogo.push(producto4);
catalogo.push(producto5);
console.log(listaProductos)

function empujando(){
    listaProductos.push(producto1);
    listaProductos.push(producto2);
    listaProductos.push(producto3);
    listaProductos.push(producto4);
    listaProductos.push(producto5);
}


const cardsDiv = document.querySelector("#catalogo");
catalogo.forEach((producto) => {
    cardsDiv.innerHTML += `    
    <div class=" tarjeta card m-4 col-6 col-md-3 col-sm-4 p-4" style="width:13rem;">
        <img src="./images/${producto.foto}" class="card-img-top" alt="...">
        <div class="card-body text-center">
            <h5 class="card-title">${producto.nombre}</h5>
            <p class="card-text">$ ${producto.precio}</p>
            <a class="btn btn-primary botonCompra" id="${producto.id}">COMPRAR</a>
        </div>
    </div>
    `;
});



const botones = document.querySelectorAll(".botonCompra");
const arrayDeBotones = Array.from(botones);
arrayDeBotones.forEach((boton) => {
    
    boton.addEventListener("click", (e) => {
        const productoSeleccionado = listaProductos.find(
            (producto) => producto.id == e.target.id
        );
        const enCarrito = carrito.producto.find((producto) => producto.id == e.target.id)
        const revisarCarrito = carrito.producto.some((producto) => producto.id == e.target.id)
        Toastify({
            
            text: `${productoSeleccionado.nombre} a sido agregado al carrito`,
            
            duration: 1500
            
            }).showToast();

        revisarCarrito ? sumar(enCarrito) && actualizarCarrito(carrito) : carrito.producto.push(productoSeleccionado) && sumar(productoSeleccionado)
        limpiarCarrito();
        actualizarCarrito(carrito);
        total();
    });
});
// BOTON VACIAR CARRITO DENTRO DEL MODAL //
const botonVaciar = document.getElementById("vaciar-carrito");
botonVaciar.addEventListener("click", () => {
    Swal.fire({
        icon: 'warning',
        title: 'ESTAS SEGURO DE VACIAR CARRITO?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'VACIAR',
        denyButtonText: `NO GRACIAS`,
      }).then((result) => {
        if (result.isConfirmed) {
            vaciarCarrito()
            limpiarCarrito();
            total();
            renovarStorage();
          Swal.fire('CARRITO VACIO', '', 'success')
        } else if (result.isDenied) {
          Swal.fire('TE SALVASTE WEY', '', 'info')
        }
      })

});

function vaciarCarrito(){
    listaProductos.forEach((producto) => {
        producto.cantidad = 0
    })
    carrito.producto.length = 0;
}

function totales(){
    let totalTotal = 0 
    carrito.producto.forEach((producto)=> {
        const total = producto.precio * producto.cantidad
        totalTotal += total
        
    })
    console.log(totalTotal)
        return totalTotal
}

function actualizarCarrito(carrito) {
    const divCarrito = document.querySelector("#carrito-contenedor");
    carrito.producto.forEach((producto) => {
        divCarrito.innerHTML += `
        <td>${producto.nombre}</td>
        <td>$${producto.precio}</td>
        <td><button id="${producto.id}" class="botonSumar btn btn-success"><i id="${producto.id}" class="fa-solid fa-plus"></i></button></td>
        <td class="text-center"><span>${producto.cantidad}</span></td>        
        <td><button id="${producto.id}" class="botonRestar btn btn-danger"><i id="${producto.id}" class="fa-solid fa-minus"></i></button></td>
        <td>${totalProducto(producto.precio,producto.cantidad)}</td>        
        <td class=""><button id="${producto.id}" class="botonBorrar btn btn-danger"><i  id="${producto.id}" class="fa-regular fa-trash-can"></i></button></td>`;
    });
    const botonSumar = document.querySelectorAll(".botonSumar");
    const arrayDeBotonSumar = Array.from(botonSumar);
    arrayDeBotonSumar.find((boton) => {
        boton.addEventListener("click", (e) => {
            const item = carrito.producto.find((producto) => producto.id == e.target.id);
            const revisarCarrito = carrito.producto.some((producto) => producto.id == e.target.id)

            revisarCarrito ? sumar(item) && actualizarCarrito(carrito) : console.log(item)

            limpiarCarrito();
            actualizarCarrito(carrito);
            total();
        })   
    })

    const botonBorrar = document.querySelectorAll(".botonBorrar");
    const arrayDeBotonBorrar = Array.from(botonBorrar);
    arrayDeBotonBorrar.find((boton) => {
        boton.addEventListener("click", (e) => {
            const item = carrito.producto.find((producto) => producto.id == e.target.id);
            item.cantidad = 0
            eliminar(item)
            limpiarCarrito()
            actualizarCarrito(carrito)
            total()
        })
    })

    const botonRestar = document.querySelectorAll(".botonRestar");
    const arrayDeBotonRestar = Array.from(botonRestar);
    arrayDeBotonRestar.find((boton) => {
        boton.addEventListener("click", (e) => {
            const item = carrito.producto.find((producto) => producto.id == e.target.id);
            const revisarCarrito = carrito.producto.some((producto) => producto.id == e.target.id)
            revisarCarrito ? restar(item) && actualizarCarrito(carrito) : eliminar(item)
            item.cantidad == 0 ? eliminar(item) : console.log(carrito)


            console.log(item);

            limpiarCarrito();
            actualizarCarrito(carrito);
            total();
        });
    });
    renovarStorage()
}

function eliminar(item){
    const indice = carrito.producto.indexOf(item);
    carrito.producto.splice(indice, 1);
}
function sumar(item){
    item.cantidad += 1
    return
}
function restar(item){
    item.cantidad -= 1
    return
}
function totalProducto(a,b){
    let valor = a*b
    return valor
}

function limpiarCarrito() {
    const divCarrito = document.querySelector("#carrito-contenedor");
    divCarrito.innerHTML = "";
    renovarStorage();
}

function total() {
    const precioTotal = document.getElementById(`precioTotal`);
    precioTotal.innerHTML = `
    Precio Total: $<span>${totales()}</span>`;
}

function renovarStorage() {
    localStorage.removeItem("carrito");
    localStorage.removeItem("catalogo");
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("catalogo", JSON.stringify(listaProductos));
    console.log(carrito)
}

function listaActualizada(storage2){
    storage2.forEach((producto) => {
        listaProductos.push(producto)
    }) 
}

window.addEventListener("DOMContentLoaded", (e) => {

    const storage = JSON.parse(localStorage.getItem("carrito"));
    const storage2= JSON.parse(localStorage.getItem("catalogo"));
    
    storage == null ? renovarStorage() : storage.producto.forEach((producto) => {
        carrito.producto.push(producto);
    });
    
    const permiso = (carrito.producto.length == 0) ? true : false
    permiso ? empujando() : listaActualizada(storage2)
    console.log(carrito)
    actualizarCarrito(carrito);
    total();
    
});