import React from "react";
import { withRouter } from "react-router-dom";
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { CRMContext } from "../../context/CRMContext";

function EditarCliente(props) {
  const [auth] = React.useContext(CRMContext);

  const { history } = props;
  const { id } = props.match.params;

  const [cliente, setCliente] = React.useState({
    _id: "",
    nombre: "",
    apellido: "",
    empresa: "",
    email: "",
    telefono: "",
  });

  async function getClient(id) {
    try {
      const response = await clienteAxios.get("/clientes/" + id);
      setCliente(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  React.useEffect(() => {
    if (!auth.token) {
      history.replace("/iniciar-sesion");
    } else {
      if (id) {
        getClient(id);
      } else {
        console.log("no existe el id");
      }
    }
  }, []);

  const { nombre, apellido, empresa, email, telefono } = cliente;

  const isValidClient = () => {
    let valido =
      nombre?.length &&
      apellido?.length &&
      email?.length &&
      empresa?.length &&
      telefono?.length;

    return valido;
  };

  const handleChange = (e) => {
    setCliente({
      ...cliente,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidClient()) return;

    try {
      const response = await clienteAxios.put("/clientes/" + id, cliente);
      if (response.data.code === 0) {
        Swal.fire(
          "Se actualizó el cliente",
          "Se actualizó el cliente correctamente",
          "success"
        );

        // edireccionar
        history.push("/");
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
      Swal.fire("Hubo un error", error, "error");
    }
  };

  return (
    <>
      <h2>Nuevo Cliente</h2>
      <form action="/clientes" method="POST" onSubmit={handleSubmit}>
        <legend>Llena todos los campos</legend>

        <div className="campo">
          <label>Nombre:</label>
          <input
            type="text"
            onChange={handleChange}
            value={nombre}
            placeholder="Nombre Cliente"
            name="nombre"
          />
        </div>

        <div className="campo">
          <label>Apellido:</label>
          <input
            type="text"
            onChange={handleChange}
            value={apellido}
            placeholder="Apellido Cliente"
            name="apellido"
          />
        </div>

        <div className="campo">
          <label>Empresa:</label>
          <input
            type="text"
            onChange={handleChange}
            value={empresa}
            placeholder="Empresa Cliente"
            name="empresa"
          />
        </div>

        <div className="campo">
          <label>Email:</label>
          <input
            type="email"
            onChange={handleChange}
            value={email}
            placeholder="Email Cliente"
            name="email"
          />
        </div>

        <div className="campo">
          <label>Teléfono:</label>
          <input
            type="text"
            onChange={handleChange}
            value={telefono}
            placeholder="Teléfono Cliente"
            name="telefono"
          />
        </div>

        <div className="enviar">
          <input
            type="submit"
            className="btn btn-azul"
            value="Guardar Cambios"
            disabled={!isValidClient()}
          />
        </div>
      </form>
    </>
  );
}

// HOC
export default withRouter(EditarCliente);
