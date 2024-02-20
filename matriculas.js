Vue.component('v-select-alumno', VueSelect.VueSelect);
Vue.component('componente-matriculas', {
    data() {
        return {
            valor:'',
            matriculas:[],
            alumnos:[],
            accion:'nuevo',
            matricula:{
                alumno:{
                    id:'',
                    label:''
                },
                idMatricula: new Date().getTime(),
                codigo:'',
                nombre:'',
                foto:'',
            }
        }
    },
    methods:{
        buscarMatricula(e){
            this.listar();
        },
        eliminarMatricula(idMatricula){
            if( confirm(`Esta seguro de elimina el matricula?`) ){
                let store = abrirStore('matriculas', 'readwrite'),
                query = store.delete(idMatricula);
            query.onsuccess = e=>{
                this.nuevoMatricula();
                this.listar();
            };
            }
        },
        modificarMatricula(matricula){
            this.accion = 'modificar';
            this.matricula = matricula;
        },
        guardarMatricula(){
            //almacenamiento del objeto matriculas en indexedDB
            if( this.matricula.alumno.id=='' ||
                this.matricula.alumno.label=='' ){
                console.error("Por favor seleccione un alumno");
                return;
            }
            let store = abrirStore('matriculas', 'readwrite'),
                query = store.put({...this.matricula});
            query.onsuccess = e=>{
                this.nuevoMatricula();
                this.listar();
            };
            query.onerror = e=>{
                console.error('Error al guardar en matriculas', e.message());
            };
        },
        nuevoMatricula(){
            this.accion = 'nuevo';
            this.matricula = {
                alumno:{
                    id:'',
                    label:''
                },
                idMatricula: new Date().getTime(),
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
            let store = abrirStore('matriculas', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.matriculas = data.result
                    .filter(matricula=>matricula.codigo.includes(this.valor) || 
                    matricula.nombre.toLowerCase().includes(this.valor.toLowerCase()));
            };
        }
    },
    template: `
        <div class="row">
            <div class="col col-md-6">
                <div class="card">
                    <div class="card-header text-bg-dark">REGISTRO DE MATRICULAS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">ALUMNO</div>
                            <div class="col col-md-4">
                                <v-select-alumno required v-model="matricula.alumno" 
                                    :options="alumnos">Por favor seleccione un alumno</v-select-alumno>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO MATRICULA</div>
                            <div class="col col-md-3">
                                <input v-model="matricula.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">CICLO</div>
                            <div class="col col-md-5">
                                <input v-model="matricula.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">
                                <img :src="matricula.foto" width="50"/>
                            </div>
                            <div class="col col-md-4">
                                <div class="mb-3">
                                    <label for="formFile" class="form-label">COMPROBANTE DE PAGO</label>
                                    <input class="form-control" type="file" id="formFile" 
                                        accept="image/*" onChange="seleccionarFoto(this)">
                                </div>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col">
                                <button @click.prevent.default="guardarMatricula" class="btn btn-success">GUARDAR</button>
                                <button @click.prevent.default="nuevoMatricula" class="btn btn-warning">NUEVO</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col-md-6">
                <div class="card text-bg-dark">
                    <div class="card-header">LISTADO DE MATRICULAS</div>
                    <div class="card-body">
                        <form id="frmMatricula">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="6">
                                            <input placeholder="" type="search" v-model="valor" @keyup="buscarMatricula" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>ALUMNO</th>
                                        <th>CODIGO</th>
                                        <th>CICLO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarMatricula(matricula)" v-for="matricula in matriculas" :key="matricula.idmatricula">
                                        <td>{{matricula.alumno.label}}</td>
                                        <td>{{matricula.codigo}}</td>
                                        <td>{{matricula.nombre}}</td>
                                        <td><button @click.prevent.default="eliminarMatricula(matricula.idMatricula)" class="btn btn-danger">del</button></td>
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