(function(){

    // VARIABLES //
    let idCliente;

    const nombreinput = document.querySelector('#nombre');
    const emailinput = document.querySelector('#email');
    const telefonoinput = document.querySelector('#telefono');
    const empresainput = document.querySelector('#empresa');


    // EVENTOS //
    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();

        // Actualizar datos modificados
        formulario.addEventListener('submit', actualizarCliente);

        // Buscar el ID en la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id'); // GET: Solo busca el parameto 'id'

        if(idCliente){
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 500);
        }
    })


    // FUNCIONES //
    function obtenerCliente(id){

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm'); // objectStore: Permite interactuar con DB

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){ // En caso de que se haya obtenido correctamente
            const cursor = e.target.result;

            if(cursor){

                if(cursor.value.id === Number(id)){
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }    

    }
    
    function llenarFormulario(datosCliente){
        const {nombre, email, telefono, empresa} = datosCliente;

        nombreinput.value = nombre;
        emailinput.value = email;
        telefonoinput.value = telefono;
        empresainput.value = empresa;

    }

    function actualizarCliente(e){
        e.preventDefault();

        if(nombreinput.value === '' || emailinput.value === '' || telefonoinput.value === '' || empresainput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
        }

        const clienteActualizado = {
            nombre: nombreinput.value,
            email: emailinput.value,
            telefono: telefonoinput.value,
            empresa: empresainput.value,
            id: Number(idCliente)
        };

        console.log(clienteActualizado);

        const transaction = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaction.objectStore('crm');

        console.log(objectStore);

        objectStore.put(clienteActualizado);

        transaction.oncomplete = function(){
            console.log('ok');
            imprimirAlerta('Editado correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }

        transaction.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }
    }

})();