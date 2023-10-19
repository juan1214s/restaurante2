let tabla = document.querySelectorAll(".table tbody");
let platilloPed = document.querySelector(".platillo");
let clientePed = document.querySelector(".cliente");
let cantidadPed = document.querySelector(".cantidad");
let precioPed = document.querySelector(".precio");
let observacionesPed= document.querySelector(".observaciones");
let estadoPed = document.querySelector(".estado");
let idPed = document.querySelector(".id");
let botonEnviar = document.querySelector("btn-enviar");
let botonActualizar = document.querySelector(".btn-actualizar");
let tablas = document.querySelectorAll(".tables tbody");

//btn.addEventListener("click", peticionBD);
//evento al navegador cuando la pagina recarga
document.addEventListener("DOMContentLoaded", function(){
    peticionBD();
    peticionesBD();

});



async function peticionBD() {
    let url = "http://localhost/restaurante2/conexion/peticion.php";
    await fetch(url)
    .then((datos)=> datos.json())
    .then((pedidos)=>{
        pedidos.forEach(p =>{
            if(p.estado === "pedido"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
                <td> ${ p.platillo } </td>

                <td> 
                <button type="button" onclick="actualizarPedido(${p.id_pedido}, 'preparando')"> Preparando </button>

                    
                </td> 
            `;
            tabla[0].appendChild(fila);
        }else if(p.estado === "preparando"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
                <td> ${ p.platillo } </td>

                <td> 
                <button type="button" onclick="actualizarPedido(${p.id_pedido}, 'preparado')"> Preparado </button>

                    
                </td> 
            `;
            tabla[1].appendChild(fila);
        }else if(p.estado === "preparado"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
                <td> ${ p.platillo } </td>

                <td> 

                <button type="button" onclick="alertas()"> Finalizado </button>

                    
                </td> 
                

                
            `;
            tabla[2].appendChild(fila);
        }else if(p.estado === "preparado"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
                <td> ${ p.precio } </td>
                <td> ${ p.platillo } </td>

                <td> 

                <button type="button" onclick="alertas()"> Finalizado </button>

                    
                </td> 
                

                
            `;
            tablas[0].appendChild(fila);
        }
        
        
        });
        
    })
    .catch((error)=> console.log(error));
}


async function peticionesBD() {
    let url = "http://localhost/restaurante2/conexion/peticion.php";
    await fetch(url)
    .then((datos)=> datos.json())
    .then((pedidos)=>{
        pedidos.forEach(p =>{
          if(p.estado === "preparado"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
    
                <td> ${ p.platillo } </td>

                <td> 
                <button type="button" onclick="actualizarPedido(${p.id_pedido}, 'entregado')"> Entregar </button>     
                </td> 
                

                
            `;
            tablas[0].appendChild(fila);
        }
          if(p.estado === "entregado"){
            let fila = document.createElement("tr");
            fila.innerHTML = `
        
    
                <td> ${ p.platillo } </td>

                <td> 
                <button type="button" onclick="alertas()"> Finalizado </button>
                </td> 
                

                
            `;
            tablas[1].appendChild(fila);
        }
        
        
        });
        
    })
    .catch((error)=> console.log(error));
}

function alertas(){
    swal("PEDIDO FINALIZADO!!", "Tu pedido esta listo", "success");
}

function obtenerDatos() {
    if (platilloPed.value == "" || clientePed.value == "" || cantidadPed.value == ""
        || precioPed.value == "" || observacionesPed.value == "") {
            alert("Todos los campos son obligatorios");
    }else{
        let datosForm = {
            platillo: platilloPed.value,
            cantidad: cantidadPed.value,
            cliente: clientePed.value,
            precio: precioPed.value,
            observaciones: observacionesPed.value,
            estado: estadoPed.value,
            id_pedido: idPed.value
        }
        console.log(datosForm);
        //limpiamos los campos
        platilloPed.value = "";
        cantidadPed.value = "";
        clientePed.value = "";
        precioPed.value = "";
        observacionesPed.value = "";
        idPed.value = "";

        return datosForm;
    }

    
}

//enviar los datos al servidor
function enviarDatos( datos ) {
    let url = "http://localhost/restaurante2/conexion/peticion.php";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datos)
    })
    .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error('No se pudo enviar los datos');
        }
        return respuesta.text();
    })
    .then(mensaje => {
        // Mostrar la respuesta del servidor
        console.log(mensaje);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    alert("Datos enviados correctamente");
    limpiarTabla();
    peticionBD();

}

//actualizar datos de la tabla
function actualizarPedido(id,estados) {
    let url = "http://localhost/restaurante2/conexion/peticion.php";
    fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_pedido: id, estado: estados })

       // body: JSON.stringify({ id_pedido: id, estado: "preparando" })
        // Cambia 'datos' por el objeto que quieres enviar
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('No se pudo enviar los datos');
        }
        return respuesta.text();
    })
    .then(mensaje => {
        // Mostrar la respuesta del servidor
        console.log(mensaje);
        swal("Pedido Actualizado Correctamente", "", "success");
        // alert("Pedido actualizado correctamente");
        limpiarTabla();
        peticionBD();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}




function actualizarPedidos(id) {
    let url = "http://localhost/apiRestaurante/peticiones.php";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(id)
    })
    .then(respuesta => {
        if (!respuesta.ok) {
          throw new Error('No se pudo enviar el id');
        }
        return respuesta.json();
    })
    .then(platillo => {

        estadoPed.value = platillo.estado;
        idPed.value = platillo.id_pedido;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//limpiar los datos de la tabla
function limpiarTabla() {
    let registros = document.querySelectorAll(".table tbody tr");
    for(let i = 0; i < registros.length; i++){
        registros[i].remove();
    }
}


function openMenu(evt, menuName) {
    var i, x, tablinks;
    x = document.getElementsByClassName("menu");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablink");
    for (i = 0; i < x.length; i++) {
       tablinks[i].className = tablinks[i].className.replace(" w3-red", "");
    }
    document.getElementById(menuName).style.display = "block";
    evt.currentTarget.firstElementChild.className += " w3-red";
  }
  document.getElementById("myLink").click();