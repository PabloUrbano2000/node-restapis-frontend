import React from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function Producto({ producto = {}, refresh }) {
  const deleteProduct = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Un producto eliminado no se puede recuperar",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "SÍ, ELIMINAR",
      cancelButtonText: "CANCELAR",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await clienteAxios.delete(
            "/productos/" + producto._id
          );
          if (response.data.code === 0) {
            Swal.fire(
              "Producto eliminado",
              "Se eliminó el producto correctamente",
              "success"
            );
            refresh(true);
          } else {
            let mensaje = "Ocurrió un error inesperado";
            Swal.fire("Hubo un error", mensaje, "error");
          }
        } catch (error) {
          Swal.fire("Hubo un error", error.mensaje, "error");
        }
      }
    });
  };

  return (
    <li className="producto">
      <div className="info-producto">
        <p className="nombre">{producto.nombre}</p>
        <p className="precio">${producto.precio} </p>
        {producto.imagen ? (
          <img
            src={`http://localhost:5000/${producto.imagen}`}
            alt={`ìmagen ${producto.nombre}`}
            width={"100%"}
            className="imagen-listado"
          />
        ) : null}
      </div>
      <div className="acciones">
        <Link to={"/productos/editar/" + producto._id} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Producto
        </Link>

        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={deleteProduct}
        >
          <i className="fas fa-times"></i>
          Eliminar Producto
        </button>
      </div>
    </li>
  );
}

export default Producto;
