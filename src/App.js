import './App.css';
import { useState } from 'react';
import Axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

// IMPORTACIONES PARA LAS ALERTAS
import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
// const noti = withReactContent(Swal)

function App() {
  // AQUI SE COLOCA LOS DATOS DE LOS INPUTS
  const [codigo, setCodigo] = useState("");
  const [pedido, setPedido] = useState();
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaE, setFechaE] = useState();
  const [id, setId] = useState();

  //CONSTANTE PARA LA FUNCION EDITAR
  const [editar, setEditar] = useState(false);

  //CONSTANTE PARA LA FUNCION DE LISTAR DE PRODUCTOS
  const [productosLista, setProductos] = useState([]);

  //FUNCION DEL BOTON AGREGAR PRODUCTO
  const add = () => {
    Axios.post("http://localhost:3001/create", {
      codigo: codigo,
      pedido: pedido,
      categoria: categoria,
      descripcion: descripcion,
      fechaE: fechaE
    }).then(() => {
      getProductos();
      limpiarCampos();
      //RESPUESTA DE SWEETALERT
      Swal.fire({
        title: "<strong>Creacion de producto Exitoso..!!</strong>",
        html: "<i>El "+categoria+" "+descripcion+" fue registrado con el CODIGO: "+codigo+"</i>",
        icon: 'success',
        timer: 13000
      })
    }).catch(function(error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Problemas para agregar nuevo producto a la base de datos",
        footer: '<a href="#">Contactar con el administrador de inventario?</a>'
      });   
    }());;
  };

  //CONSTANTE PARA OBTENER LOS PODUCTOS Y COLOCARLOS EN SUS IMPUT PARA DESPUES ACTUALIZARLOS
  const editarProductos = (val) => {
      setEditar(true);
  
      setCodigo(val.codigo);
      setPedido(val.pedido);
      setCategoria(val.categoria);
      setDescripcion(val.descripcion);
      setFechaE(val.fechaE);
      setId(val.id);
      // Desplaza la página al inicio de manera suave
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };
    
  //FUNCION DEL BOTON PARA ACTUALIZAR EL BOTON, ESTO DESPUES QUE SE OBTUVIERON LOS DATOS DEL CODIGO DE ARRIBA
  const update = () => {
      Axios.put("http://localhost:3001/actualizar", {
        id: id,
        codigo: codigo,
        pedido: pedido,
        categoria: categoria,
        descripcion: descripcion,
        fechaE: fechaE
      }).then(() => {
        getProductos();
        limpiarCampos();
        Swal.fire({
          title: "<strong>Actualizacion de producto Exitoso..!!</strong>",
          html: "<i>El <strong>"+categoria+"</strong> <strong>"+descripcion+"</strong> con el <strong>CODIGO:</strong> "+codigo+" fue actualizado.</i>",
          icon: 'success',
          background: '#00000',
          timer: 17000
        })
      }).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Problemas para actualizar el producto!.",
          footer: '<a href="#">Contactar con el administrador de inventario?</a>'
        });   
      }());;
  };

  //FUNCION PARA LIMPIAR CAMPOS DEL FORMULARIO
  const limpiarCampos = () => {
      setCodigo("");
      setPedido("");
      setCategoria("");
      setDescripcion("");
      setFechaE("");
      setEditar(false);
  };

  //FUNCION PARA OBTENER LAS LISTA DE PRODUCTOS DESDE LA RUTA CON EL METODO GET
  const getProductos = () => {
      Axios.get("http://localhost:3001/productos").then((response) => {setProductos(response.data);}).catch(function(error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Problemas para conectar con el servidor.",
          footer: '<a href="#">Contactar con el administrador de inventario?</a>'
        });   
      }());
  };
    // getProductos();

  //FUNCION DEL BOTON AGREGAR PRODUCTO
  const deleteProducto = (val) => {
    //REALIZO LAS PREGUNTAS CON SWEETALERT2 ANTES DE ELIMINAR EL PRODUCTO
    Swal.fire({
      title: "<strong>Eliminar Producto!!..</strong>",
      html: "<i>Quieres eliminar el producto con el CODIGO: <strong>"+val.codigo+"</strong>?</i>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        //METODO DELETE DE AXIOS PATA ELIMINAR
        Axios.delete(`http://localhost:3001/eliminar/${val.codigo}`).then(() => {
          getProductos();
          limpiarCampos();
          //RESPUESTA CON SWEETALERT
          Swal.fire({
            title: "Elminado!",
            html: "<i>El producto con el CODIGO: <strong>"+val.codigo+"</strong> fue eliminado exitosamente</i>",
            icon: "success",
            showConfirmButton: false,
            timer: 5000
          });
          // Desplaza la página al inicio de manera suave
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }).catch(function(error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "No se logro elimar el producto",
            footer: '<a href="#">Contactar con el administrador de inventario?</a>'
          });   
        }());
      }
    });
  };  
    
  //HTML CON REACT
  return (
    <div className="body"> 
        {/* ENCABEZADO DE LA PAGINA */}
        <header>
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark">
          <div className="container-fluid">
            <h2 className="navbar-brand">Muebles Bellagio - INVETARIO</h2>
            <form className="d-flex" role="search">
              <input className="form-control me-2" type="search" placeholder="Productos" aria-label="Search" />
              <button className="btn btn-outline-secondary" type="" onClick={(event) => {event.preventDefault();getProductos();}}>🔍</button>
            </form>
          </div>
        </nav>
        </header>
        {/* CONTAINER DE FORMULARIO Y TABLA */}
        <div className="container">
            {/* FORMULARIO INGRESO NUEVO PRODUCTO */}
            <div className="card text-center formulario"  >
              <div id='header-form' className="card-header p-2 fw-bold">
                {/* VALIDACION PARA CAMBIAR EL TITULO DEL FORMULARIO */}
                {
                      editar === true? <div>ACTUALIZAR PRODUCTO</div>
                                    :<div>NUEVO PRODUCTO</div>
                }
              </div>
              <div className="card-body inputs">
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text" id="inputGroup-sizing-sm">CODIGO:</span>
                  <input type="text" 
                    onChange={(event) => {
                      setCodigo(event.target.value)
                    }} 
                    className="form-control" value={codigo} placeholder='Ingrese codigo' aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-sm" 
                  />
                </div>
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text" id="inputGroup-sizing-sm">PEDIDO:</span>
                  <input type="text" 
                    onChange={(event) => {
                      setPedido(event.target.value)
                    }} 
                    className="form-control" value={pedido} placeholder='Ingrese pedido'  aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-sm" 
                  />
                </div>
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text" id="inputGroup-sizing-sm">CATEGORIA:</span>
                  <input type="text" 
                    onChange={(event) => {
                      setCategoria(event.target.value)
                    }} 
                    className="form-control" value={categoria} placeholder='Ingrese categoria'  aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-sm" 
                  />
                </div>
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text" id="inputGroup-sizing-sm">DESCRIPCION:</span>
                  <input type="text" 
                    onChange={(event) => {
                      setDescripcion(event.target.value)
                    }} 
                    className="form-control" value={descripcion} placeholder='Ingrese la descripcion del producto'  aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-sm" 
                  />
                </div>
                <div className="input-group input-group-sm mb-1">
                  <span className="input-group-text" id="inputGroup-sizing-sm">FEGHA ENTRADA:</span>
                  <input type="text" 
                    onChange={(event) => {
                      setFechaE(event.target.value)
                    }} 
                    className="form-control" value={fechaE} placeholder='Ingrese la fecha de entrada' aria-label="Sizing example input" 
                    aria-describedby="inputGroup-sizing-sm" 
                  />
                </div>
              </div>
              <div id='footer-form' className="card-footer text-body-secondary">
                {/* CONDICION PARA ELEGIR QUE BOTON APARECE EN EL FORMILARIO DEPENDIENDO LA ACCION QUE SE REALICE EN LA TABLA */}
                {
                    editar === true? 
                      /* BOTONE DE ACTUALIZAR PRODUCTO Y LIMPIAR CAMPOS */
                      <div className="">
                        <button type='buton' className="btn btn-dark m-1" onClick={update}>Actualizar Producto</button>
                        <button type='buton' className="btn btn-dark m-1" onClick={limpiarCampos}>Cancelar</button>
                      </div>
                       /* BOTON DE AGG PRODUCTO */
                      :<button type='buton' className="btn btn-dark" onClick={add}>Agregar Producto</button>  
                }    
               
              </div>
            </div> 
         
            {/* TABLA DE PRODUCTOS DISPONIBLES */}
            <div className="table-responsive">
              <table className="table table-sm mt-1">
                {/* ENCABEZADO DE LA TABLA */}
                <thead className="table-dark">
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">CODIGO</th>
                    <th scope="col">PEDIDO</th>
                    <th scope="col">CATEGORIA</th>
                    <th scope="col">DESCRIPCION</th>
                    <th scope="col">FEGHA ENTRADA</th>
                    <th scope="col">FUNCION</th>
                  </tr>
                </thead>
                <tbody className="table-group-divider">
                  {/* TABLA DE PRODUCTOS */}
                  {
                      productosLista.map((val, key) => {
                        //EMPIEZA LA LISTA DE PRODUCTOS EN INVENTARIO
                        return <tr key={val.id}>
                                  <th className="table-light">{val.id}</th>
                                  <td>{val.codigo}</td>
                                  <td>{val.pedido}</td>
                                  <td>{val.categoria}</td>
                                  <td>{val.descripcion}</td>
                                  <td>{val.fechaE}</td>
                                  {/* INYECTA EL BOTON AL LADO DE LOS PRODUCTO */}
                                  <td>
                                  <div className="btn-toolbar mb-2" role="toolbar" aria-label="Toolbar with button groups">
                                    <div className="btn-group me-1" role="group" aria-label="First group">
                                      {/* BOTON DE EDITAR PRODUCTO */}
                                      <button type="button" onClick={()=>{editarProductos(val);}} className="btn btn-outline-dark">EDITAR</button>
                                      {/* BOTON DE ELIMINAR PRODUCTO */}
                                      <button type="button" onClick={()=>{deleteProducto(val);}} className="btn btn-outline-danger">ELIMINAR</button>
                                    </div>
                                  </div>
                                  </td>
                                </tr>
                      })
                    }
                </tbody>
              </table>
            </div>
        </div>
    </div>
  );
}

export default App;


//  [] {} <div className="App"></div>  ()=>{}