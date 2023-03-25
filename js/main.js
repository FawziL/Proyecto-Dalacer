    const contenedorProductos = document.querySelector(".productos");
    const listadoFavoritos = document.querySelector('.listado-favoritos');
    let productosFavoritos = [];
    const carritoContador = document.getElementById('carritoContador');
    const precioTotal = document.getElementById('precioTotal');
    const divPago = document.getElementById('seccion-pago');
    const comprar = document.getElementById('comprar');
    const saldo = document.querySelector('.saldo');
    saldoTotal = 20000
    const contenido = document.getElementById('contenido');
    const paypal = document.getElementById('paypal');
    const debito = document.getElementById('debito');
    const credito = document.getElementById('credito');
    const botones = document.getElementById('botones');
    const stock = "../stock.json"
console.log("hola")
    
fetch(stock)
.then(respuesta => respuesta.json())
.then(productos =>{

    productos.forEach(producto =>{

         const casilla = document.createElement('section');
         casilla.classList.add('recomendacion');

         const imagenProducto = document.createElement('img');
         imagenProducto.classList.add('imagen-producto')
         imagenProducto.src = producto.img;

         const tituloProducto = document.createElement('h3');
         tituloProducto.classList.add('titulo-producto')
         tituloProducto.textContent = producto.nombre;

         const precioProducto = document.createElement('h4');
         precioProducto.classList.add('precio-producto')
         precioProducto.textContent = producto.precio  + "$";

         const descripcionProducto = document.createElement('h5')
         descripcionProducto.classList.add('descripcion-producto')
         descripcionProducto.textContent = producto.descripcion;

         const btnFavorito = document.createElement('button');
         btnFavorito.classList.add('btn-favorito');
         btnFavorito.textContent = "Agregar al carrito";
         btnFavorito.onclick =  () => {
            agregarAFavorito(producto.id)
         };

         casilla.appendChild(imagenProducto);
         casilla.appendChild(tituloProducto);
         casilla.appendChild(precioProducto);
         casilla.appendChild(descripcionProducto);
         casilla.appendChild(btnFavorito);
         
         contenedorProductos.appendChild(casilla)

});


    function agregarAFavorito(id) { 

        let repetido = productosFavoritos.find(buscar => buscar.id == id)
        if(repetido){
            repetido.cantidad++ 
            document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">Cantidad: ${repetido.cantidad}</p>`
            actualizarCarrito()
    
        }
        else{
        let productoAgregado = productos.find( producto => producto.id === id );
        productosFavoritos.push(productoAgregado);
        actualizarCarrito()
         

        let div = document.createElement('div')
        div.classList.add('flex');
        div.innerHTML = `
                        <p>|${productoAgregado.nombre} |P</p>
                        <p>recio: ${productoAgregado.precio}$ |</p>
                        <p id="cantidad${productoAgregado.id}">Cantidad: ${productoAgregado.cantidad}</p>
                        <button id="btnEleminar${productoAgregado.id}" class="btn-borrar"><img src="https://icongr.am/entypo/trash.svg?size=128&color=currentColor" alt=""></button>`

        listadoFavoritos.appendChild(div)

        let btnEliminar = document.getElementById(`btnEleminar${productoAgregado.id}`)


        btnEliminar.addEventListener('click',()=>{
            if(productoAgregado.cantidad == 1){
                btnEliminar.parentElement.remove()
                productosFavoritos = productosFavoritos.filter(item => item.id != productoAgregado.id)
                actualizarCarrito()
                localStorage.setItem('carrito', JSON.stringify(productosFavoritos))
            }
            else{
                productoAgregado.cantidad-- 
                document.getElementById(`cantidad${productoAgregado.id}`).innerHTML = `<p id="cantidad${productoAgregado.id}">Cantidad: ${productoAgregado.cantidad}</p>`
                actualizarCarrito()
                localStorage.setItem('carrito', JSON.stringify(productosFavoritos))
            }
            })
        
           
    }
  
    localStorage.setItem('carrito', JSON.stringify(productosFavoritos))
    
    }

    function  actualizarCarrito (){                                   
        carritoContador.innerText = productosFavoritos.reduce((acc,el)=> acc + el.cantidad, 0)
        precioTotal.innerText = "El total es de: " + productosFavoritos.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0) + "$"
        productosFavoritos.length === 0 ? contenido.innerText = "No hay productos en el carrito" : contenido.innerText = "" 
    }
    
    

    function recuperar() {
        let recuperarLS = JSON.parse(localStorage.getItem('carrito'))
        console.log(recuperarLS)
     
        if(recuperarLS){
          recuperarLS.forEach(element => {
            agregarAFavorito(element.id)
         });
       
        } 
     }
    
    recuperar()

    productosFavoritos.length === 0 ? contenido.innerText = "No hay productos en el carrito" : console.log("Hay productos en el carrito") 

    comprar.textContent = "Comprar";
    
    saldo.textContent = "Tu saldo total es de: " + saldoTotal + "$";






comprar.addEventListener('click',()=>{
    if(productosFavoritos.length === 0){
        Swal.fire({
            showConfirmButton: false,
            icon: 'error',
            title: 'Pago no realizado',
            text: 'No hay productos en el carrito!',
            html: `<button data-bs-target="#comprar-producto" data-bs-dismiss="modal" class="ola">Continuar</button>`,
            footer: '<a href="">¿Tuviste algún problema?</a>',
            timer: 2500
          })
    }
    })








    function funcionar(){
        const pagar = document.getElementById('pagar');
        pagar.textContent = "Pagar";
        let datos = document.querySelector(".datos")
        let inputContraseña = document.querySelector(".contrasena")
        let inputUsuario = document.querySelector(".usuario")
        let inputCorreo = document.querySelector(".correo")
        pagar.addEventListener('click',()=>{
    
            user = inputUsuario.value;
            contra = inputContraseña.value;
            email = inputCorreo.value;
            if (user == "" || contra == "" || email == ""){
                datos.innerText = "*Debes completar los datos*"
            } else if(productosFavoritos.length === 0){
                Swal.fire({
                    icon: 'error',
                    title: 'Pago no realizado',
                    text: 'No hay productos en el carrito!',
                    footer: '<a href="">¿Tuviste algún problema?</a>'
                  })
            }else if(productosFavoritos.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0) > saldoTotal){
                Swal.fire({
                    icon: 'error',
                    title: 'Pago no realizado',
                    text: 'No tenes suficiente plata!',
                    footer: '<a href="">¿Tuviste algún problema?</a>'
                    
                  })
                  
            }else if(saldoTotal > parseInt(productosFavoritos.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0))){
                    Swal.fire({
                        icon: 'success',
                        title: 'Pago recibido',
                        text: 'Gracias por comprar con nosotros!',
                        footer: '<a href="">¿Tuviste algún problema?</a>'
                      })
                      saldo.textContent = "Tu saldo total es de: " + (saldoTotal - parseInt(productosFavoritos.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0))) + "$"
                    saldoTotal = (saldoTotal - parseInt(productosFavoritos.reduce((acc,el)=> acc + (el.precio * el.cantidad), 0)))
                     
                }
            
        })
    
         
    }



    paypal.addEventListener('click',()=>{
        botones.textContent = "Pagar con paypal"
        botones.addEventListener('click',()=>{
            Swal.fire({
                showConfirmButton: false,
                html: ` <h2>Datos de pago</h2>
                        <hr>
                        <div class="flex margin"> <p>Correo</p><input type="email" name="nombre" placeholder="tucorreo@email.com" class="correo"></div>
                        <div class="flex margin"> <p>Contraseña</p><input type="password" class="contrasena" placeholder="password"></div>
                        <label class="padding"><input type="checkbox" class="usuario"> ¿Deseas recibir una factura mediante tu correo?</label>
                        <p class="datos"></p>
                        <button id="pagar"></button>
                        `,
                    
              })
              funcionar()
        })
    
    })

    debito.addEventListener('click',()=>{
        botones.textContent = "Pagar con debito";
        botones.addEventListener('click',()=>{
            Swal.fire({
                showConfirmButton: false,
                html: ` <h2>Datos de la tarjeta</h2>
                        <hr>
                        <div class="flex margin"> <p>Documento de identidad</p><input type="text" name="nombre" placeholder="P-xxx-xxx-xxx" class="usuario"></div>
                        <div class="flex margin"> 
                        <p>Mes de vencimiento</p>
                        <select name="Mes de vencimiento">
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                        <option>Abril</option>
                        <option>Mayo</option>
                        <option>Junio</option>
                        <option>Julio</option>
                        <option>Agosto</option>
                        <option>Septiembre</option>
                        <option>Octubre</option>
                        <option>Noviembre</option>
                        <option>Diciembre</option>
                        </select>
                        </div>

                        <div class="flex margin">
                        <p>Año de vencimiento</p>
                        <select name="Año de vencimiento">
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                        </select>
                        </div>

                        <div class="flex margin"> <p>N° de tarjeta de débito</p><input type="text" class="correo" placeholder=" XXXX-XXXX-XXXX-XXXX"></div>
                        <div class="flex margin"> <p>Código de seguridad </p><input type="password" placeholder="xxxx" class="contrasena"></div>
                        <p class="datos"></p>
                        <button id="pagar"></button>
                        `,
              })
              funcionar()
        })
    })

    credito.addEventListener('click',()=>{
        botones.textContent = "Pagar con crédito";
        botones.addEventListener('click',()=>{
            Swal.fire({
                showConfirmButton: false,
                html: ` <h2>Datos de la tarjeta</h2>
                        <hr>
                        <div class="flex margin"> <p>Credit card number </p><input type="text" name="nombre" placeholder=" XXXX-XXXX-XXXX-XXXX" class="usuario"></div>
                        <div class="flex margin"> 
                        <p>Mes de vencimiento</p>
                        <select name="Mes de vencimiento">
                        <option>Enero</option>
                        <option>Febrero</option>
                        <option>Marzo</option>
                        <option>Abril</option>
                        <option>Mayo</option>
                        <option>Junio</option>
                        <option>Julio</option>
                        <option>Agosto</option>
                        <option>Septiembre</option>
                        <option>Octubre</option>
                        <option>Noviembre</option>
                        <option>Diciembre</option>
                        </select>
                        </div>

                        <div class="flex margin">
                        <p>Año de vencimiento</p>
                        <select name="Año de vencimiento">
                        <option>2022</option>
                        <option>2023</option>
                        <option>2024</option>
                        <option>2025</option>
                        <option>2026</option>
                        <option>2027</option>
                        </select>
                        </div>

                        <div class="flex margin"> <p>Cardholder Name </p><input type="text" class="correo"></div>
                        <div class="flex margin"> <p>CVV/CVV2 Code </p><input type="password"  placeholder="xxxx" class="contrasena"></div>
                        <p class="datos"></p>
                        <button id="pagar"></button>
                        `,
              })
              funcionar()
            })

    })


    })

   