import React from "react";
import { Link } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";

function Cliente({ cliente = {}, refresh }) {
  const deleteClient = async () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Un cliente eliminado no se puede recuperar",
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
            "/clientes/" + cliente._id
          );
          if (response.data.code === 0) {
            Swal.fire(
              "Cliente eliminado",
              "Se eliminó al cliente correctamente",
              "success"
            );
            refresh(true);
          } else {
            let mensaje = "";
            mensaje = "Ocurrió un error inesperado";
            Swal.fire("Hubo un error", mensaje, "error");
          }
        } catch (error) {
          Swal.fire("Hubo un error", error.mensaje, "error");
        }
      }
    });
  };

  return (
    <li className="cliente">
      <div className="info-cliente">
        <p className="nombre">{cliente.nombre || ""}</p>
        <p className="empresa">{cliente.empresa || ""}</p>
        <p>{cliente.email}</p>
        <p>Tel: {cliente.telefono}</p>
      </div>
      <div className="acciones">
        <Link to={`/clientes/editar/${cliente._id}`} className="btn btn-azul">
          <i className="fas fa-pen-alt"></i>
          Editar Cliente
        </Link>
        <Link to={`/pedidos/nuevo/${cliente._id}`} className="btn btn-amarillo">
          <i className="fas fa-plis"></i>
          Nuevo Pedido
        </Link>
        <button
          type="button"
          className="btn btn-rojo btn-eliminar"
          onClick={deleteClient}
        >
          <i className="fas fa-times"></i>
          Eliminar Cliente
        </button>
      </div>
    </li>
  );
}

export default Cliente;
