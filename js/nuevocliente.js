(function(){ // IIFE -> Permite que las variables solo se utilicen en este archivo, de forma local. 


    // EVENTOS //
    document.addEventListener('DOMContentLoaded', () => {
        
        conectarDB();

        formulario.addEventListener('submit', validarCliente);
    });


    // FUNCIONES //
    function validarCliente(e){

        e.preventDefault();

        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){

            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        // Se crea objeto con la informacion del formulario
        const cliente = {
            nombre, 
            email,
            telefono,
            empresa,
            id: Date.now()
        };

        crearNuevoCliente(cliente);
    }

    function crearNuevoCliente(cliente){
        const transaction = DB.transaction(['crm'], 'readwrite');
        
        const objectStore = transaction.objectStore('crm');

        objectStore.add(cliente);

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }

        transaction.oncomplete = function(){
            console.log('Cliente agregado');

            imprimirAlerta('El cliente se agregó correctamente')
        }

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
})();
