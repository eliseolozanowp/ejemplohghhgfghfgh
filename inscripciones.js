Vue.component('v-select-alumno', VueSelect.VueSelect);
Vue.component('componente-inscripciones', {
    data() {
        return {
            valor:'',
            inscripciones:[],
            alumnos:[],
            accion:'nuevo',
            inscripcion:{
                alumno:{
                    id:'',
                    label:''
                },
                idInscripcion: new Date().getTime(),
                codigo:'',
                nombre:'',
            }
        }
    },
    methods:{
        buscarInscripcion(e){
            this.listar();
        },
        eliminarInscripcion(idInscripcion){
            if( confirm(`Esta seguro de elimina la inscripcion?`) ){
                let store = abrirStore('inscripciones', 'readwrite'),
                query = store.delete(idInscripcion);
            query.onsuccess = e=>{
                this.nuevoInscripcion();
                this.listar();
            };
            }
        },
        modificarInscripcion(inscripcion){
            this.accion = 'modificar';
            this.inscripcion = inscripcion;
        },
        guardarInscripcion(){
            // Validar si el alumno está matriculado
            let alumnoId = this.inscripcion.alumno.id;
            let alumnoMatriculado = this.matriculas.find(matricula => matricula.alumno.id === alumnoId);
            if (!alumnoMatriculado) {
                console.error("El alumno no está matriculado");
                return;
            }
            let store = abrirStore('inscripciones', 'readwrite'),
                query = store.put({...this.inscripcion});
            query.onsuccess = e=>{
                this.nuevoInscripcion();
                this.listar();
            };
            query.onerror = e=>{
                console.error('Error al guardar en inscripciones', e.message());
            };
        },
        nuevoInscripcion(){
            this.accion = 'nuevo';
            this.inscripcion = {
                alumno:{
                    id:'',
                    label:''
                },
                idInscripcion: new Date().getTime(),
                codigo:'',
                nombre:'',
            }
        },
        listar(){
            let storeCat = abrirStore('alumnos', 'readonly'),
                dataCat = storeCat.getAll();
            dataCat.onsuccess = resp=>{
                this.alumnos = dataCat.result.map(alumno=>{
                    return {
                        id: alumno.idAlumno,
                        label:alumno.codigo
                    }
                });
            };
        
            let storeMatriculas = abrirStore('matriculas', 'readonly');
            let dataMatriculas = storeMatriculas.getAll();
            dataMatriculas.onsuccess = () => {
                this.matriculas = dataMatriculas.result;
            };
        
            let store = abrirStore('inscripciones', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.inscripciones = data.result
                    .filter(inscripcion=>inscripcion.codigo.includes(this.valor) || 
                    inscripcion.nombre.toLowerCase().includes(this.valor.toLowerCase()));
            };
        }
        
    },
    template: `
        <div class="row">
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">REGISTRO DE INSCRIPCIONES</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO</div>
                            <div class="col col-md-3">
                                <input v-model="inscripcion.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">ALUMNO</div>
                            <div class="col col-md-4">
                                <v-select-alumno required v-model="inscripcion.alumno" 
                                    :options="alumnos">Por favor seleccione un alumno</v-select-alumno>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">NOMBRE</div>
                            <div class="col col-md-5">
                                <input v-model="inscripcion.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col">
                                <button @click.prevent.default="guardarInscripcion" class="btn btn-success">GUARDAR</button>
                                <button @click.prevent.default="nuevoInscripcion" class="btn btn-warning">NUEVO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">LISTADO DE INSCRIPCIONES</div>
                    <div class="card-body">
                        <form id="frmInscripcion">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="codigo, nombre" type="search" v-model="valor" @keyup="buscarInscripcion" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>ALUMNO</th>
                                        <th>NOMBRE</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarInscripcion(inscripcion)" v-for="inscripcion in inscripciones" :key="inscripcion.idInscripcion">
                                        <td>{{inscripcion.codigo}}</td>
                                        <td>{{inscripcion.alumno.label}}</td>
                                        <td>{{inscripcion.nombre}}</td>
                                        <td><button @click.prevent.default="eliminarInscripcion(inscripcion.idInscripcion)" class="btn btn-danger">del</button></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `
});
