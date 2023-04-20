import React from "react";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";
import { withRouter } from "react-router-dom";
import Spinner from "../layout/Spinner";

const EditarProducto = (props) => {
  const { history } = props;
  const { id } = props.match.params;
  const [producto, setProducto] = React.useState({
    _id: "",
    nombre: "",
    precio: "",
    imagen: "",
  });

  const [archivo, setArchivo] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  async function getProduct(id) {
    try {
      const response = await clienteAxios.get("/productos/" + id);
      setProducto(response.data);
      console.log(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (id) {
      getProduct(id);
    } else {
      console.log("no existe el id");
    }
  }, []);

  const { nombre, precio, imagen } = producto || {};

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value,
    });
  };

  const handleFile = (e) => {
    const { files } = e.target;
    if (!files || !files.length) {
      setArchivo("");
    } else {
      setArchivo(e.target.files[0]);
    }
  };

  const isValidProduct = () => {
    const valid = nombre?.length && precio > 0;
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidProduct()) return;

    const formData = new FormData();
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("imagen", archivo);

    try {
      const response = await clienteAxios.put("/productos/" + id, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.code === 0) {
        Swal.fire(
          "Se actualizó el producto",
          "Se actualizó el producto correctamente",
          "success"
        );

        // edireccionar
        history.push("/productos");
      } else {
        let mensaje = "Ocurrió un error inesperado";

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

  if (loading) return <Spinner />;

  return (
    <>
      <h2>Editar Producto</h2>

      <form action="/productos" method="POST" onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            placeholder="Nombre Producto"
            name="nombre"
            onChange={handleChange}
            defaultValue={nombre}
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
            defaultValue={precio}
          />
        </div>

        <div className="campo">
          <label>Imagen:</label>
          {imagen ? (
            <img
              src={`http://localhost:5000/${imagen}`}
              alt={`imagen de ${nombre}`}
              width={"300px"}
            />
          ) : null}
          <input type="file" name="imagen" onChange={handleFile} />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={!isValidProduct()}
          />
        </div>
      </form>
    </>
  );
};

export default withRouter(EditarProducto);
