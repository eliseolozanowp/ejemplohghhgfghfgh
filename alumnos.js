Vue.component('componente-alumnos', {
    data() {
        return {
            valor:'',
            alumnos:[],
            accion:'nuevo',
            alumno:{
                idAlumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                direccion:'',
                municipio:'',
                departamento:'',
                telefono:'',
                nacimiento:'',
                sexo:''
            }
        }
    },
    methods:{
        buscarAlumno(e){
            this.listar();
        },
        eliminarAlumno(idAlumno){
            if( confirm(`Esta seguro de elimina el Alumno?`) ){
                let store = abrirStore('alumnos', 'readwrite'),
                query = store.delete(idAlumno);
            query.onsuccess = e=>{
                this.nuevoAlumno();
                this.listar();
            };
            }
        },
        modificarAlumno(alumno){
            this.accion = 'modificar';
            this.alumno = alumno;
        },
        guardarAlumno(){
            //almacenamiento del objeto alumnos en indexedDB
            let store = abrirStore('alumnos', 'readwrite'),
                query = store.put({...this.alumno});
            query.onsuccess = e=>{
                this.nuevoAlumno();
                this.listar();
            };
            query.onerror = e=>{
                console.error('Error al guardar en alumnos', e.message());
            };
        },
        nuevoAlumno(){
            this.accion = 'nuevo';
            this.alumno = {
                idAlumno: new Date().getTime(),
                codigo:'',
                nombre:'',
                direccion:'',
                municipio:'',
                departamento:'',
                telefono:'',
                nacimiento:'',
                sexo:''
            }
        },
        listar(){
            let store = abrirStore('alumnos', 'readonly'),
                data = store.getAll();
            data.onsuccess = resp=>{
                this.alumnos = data.result
                    .filter(alumno=>alumno.codigo.includes(this.valor) || 
                    alumno.nombre.toLowerCase().includes(this.valor.toLowerCase()) || 
                    alumno.direccion.toLowerCase().includes(this.valor.toLowerCase()) || 
                    alumno.municipio.toLowerCase().includes(this.valor.toLowerCase()) || 
                    alumno.departamento.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.telefono.toLowerCase().includes(this.valor.toLowerCase()) ||
                    alumno.nacimiento.toLowerCase().includes(this.valor.toLowerCase())) ||
                    alumno.sexo.toLowerCase().includes(this.valor.toLowerCase());
            };
        }
    },
    template: `
        <div class="row">
            <div class="col col-md-8">
                <div class="card text-bg-dark">
                    <div class="card-header">REGISTRO DE ALUMNOS</div>
                    <div class="catd-body">
                        <div class="row p-1">
                            <div class="col col-md-2">CODIGO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.codigo" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">NOMBRE</div>
                            <div class="col col-md-5">
                                <input v-model="alumno.nombre" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">DIRECCION</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.direccion" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">MUNICIPIO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.municipio" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">DEPARTAMENTO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.departamento" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">TELEFONO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.telefono" type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">FECHA DE NACIMIENTO</div>
                            <div class="col col-md-3">
                                <input v-model="alumno.nacimiento" type="date" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">SEXO</div>
                            <div class="col col-md-3">
                                <select v-model="alumno.sexo" name="sexo" id="sexo" class="form-control">
                                    <option value="Masculino">Masculino</option>
                                    <option value="Femenino">Femenino</option>
                                </select>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col">
                                <button @click.prevent.default="guardarAlumno" class="btn btn-success">GUARDAR</button>
                                <button @click.prevent.default="nuevoAlumno" class="btn btn-warning">NUEVO</button>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            <div class="col col-md-10">
                <div class="card text-bg-dark">
                    <div class="card-header">LISTADO DE ALUMNOS</div>
                    <div class="card-body">
                        <form id="frmAlumno">
                            <table class="table table-dark table-hover">
                                <thead>
                                    <tr>
                                        <th>BUSCAR</th>
                                        <th colspan="5">
                                            <input placeholder="Busqueda..." type="search" v-model="valor" @keyup="buscarAlumno" class="form-control">
                                        </th>
                                    </tr>
                                    <tr>
                                        <th>CODIGO</th>
                                        <th>NOMBRE</th>
                                        <th>DIRECCION</th>
                                        <th>MUNICIPIO</th>
                                        <th>DEPARTAMENTO</th>
                                        <th>TELEFONO</th>
                                        <th>FECHA NACIMIENTO</th>
                                        <th>SEXO</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr @click="modificarAlumno(alumno)" v-for="alumno in alumnos" :key="alumno.idAlumno">
                                        <td>{{alumno.codigo}}</td>
                                        <td>{{alumno.nombre}}</td>
                                        <td>{{alumno.direccion}}</td>
                                        <td>{{alumno.municipio}}</td>
                                        <td>{{alumno.departamento}}</td>
                                        <td>{{alumno.telefono}}</td>
                                        <td>{{alumno.nacimiento}}</td>
                                        <td>{{alumno.sexo}}</td>
                                        <td><button @click.prevent.default="eliminarAlumno(alumno.idAlumno)" class="btn btn-danger">del</button></td>
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