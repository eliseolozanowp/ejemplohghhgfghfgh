var db;
const funcdb = ()=>{
    let indexDB = indexedDB.open('db_alumnos',1);
    indexDB.onupgradeneeded = e=>{
        let req = e.target.result,
            tblmatricula = req.createObjectStore('matriculas',{keyPath:'idMatricula'}),
            tblinscripcion = req.createObjectStore('inscripciones',{keyPath:'idInscripcion'}),
            tblalumno = req.createObjectStore('alumnos',{keyPath:'idAlumno'});
        tblmatricula.createIndex('idMatricula','idMatricula',{unique:true});
        tblmatricula.createIndex('codigo','codigo',{unique:true});
        tblinscripcion.createIndex('idInscripcion','idInscripcion',{unique:true});
        tblinscripcion.createIndex('codigo','codigo',{unique:true});
        tblalumno.createIndex('idAlumno','idAlumno',{unique:true});
        tblalumno.createIndex('codigo','codigo',{unique:true});
    };
    indexDB.onsuccess = e=>{
        db = e.target.result;
    };
    indexDB.onerror = e=>{
        console.error('Error al crear la base de datos', e.message());
    };
}, abrirStore = (store, modo)=>{
    let ltx = db.transaction(store, modo);
    return ltx.objectStore(store);
};
funcdb();