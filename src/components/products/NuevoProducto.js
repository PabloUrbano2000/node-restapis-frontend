import React from "react";
import { withRouter } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";

function NuevoProducto({ history }) {
  const [auth] = React.useContext(CRMContext);
  const [producto, setProducto] = React.useState({
    nombre: "",
    precio: "",
  });

  const [imagen, setImagen] = React.useState("");

  React.useEffect(() => {
    if (!auth.token) {
      history.replace("/iniciar-sesion");
    }
  }, []);

  const { nombre, precio } = producto;

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    const { files } = e.target;
    if (!files || !files.length) {
      setImagen("");
    } else {
      setImagen(e.target.files[0]);
    }
  };

  const isValidProduct = () => {
    const valid = nombre?.length && precio > 0 && imagen;
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // crear un formData
      const formData = new FormData();
      formData.append("nombre", producto.nombre);
      formData.append("precio", producto.precio);
      formData.append("imagen", imagen);

      const response = await clienteAxios.post("/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.code === 0) {
        Swal.fire("Se agregó el producto", response.data.mensaje, "success");

        // Redireccionar
        history.push("/productos");
      } else {
        let mensaje = "";
        if (response.data.code === 11000) {
          mensaje = "El correo/teléfono es duplicado";
        } else {
          mensaje = "Ocurrió un error inesperado";
        }
        Swal.fire("Hubo un error", mensaje, "error");
      }
    } catch (error) {
      Swal.fire(
        "Hubo un error",
        error?.mensaje ? error.mensaje : error,
        "error"
      );
    }
  };

  return (
    <>
      <h2>Nuevo Producto</h2>

      <form action="/productos" method="POST" onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={handleChange}
            value={nombre}
          />
        </div>

        <div className="campo">
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            min="0.00"
            step="0.01"
            placeholder="Precio"
            onChange={handleChange}
            value={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          <input type="file" name="imagen" onChange={handleFile} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Agregar Producto"
            disabled={!isValidProduct()}
          />
        </div>
      </form>
    </>
  );
}

export default withRouter(NuevoProducto);
