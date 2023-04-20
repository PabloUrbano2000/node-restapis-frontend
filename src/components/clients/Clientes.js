import React from "react";
import { Link, withRouter } from "react-router-dom";

import clienteAxios from "../../config/axios";
import Cliente from "./Cliente";
import Spinner from "../layout/Spinner";
import { CRMContext } from "../../context/CRMContext";

function Clientes({ history }) {
  const [auth] = React.useContext(CRMContext);

  const [clientes, setClientes] = React.useState([]);
  const [refresh, setRefresh] = React.useState(true);

  const consultarAPI = async () => {
    try {
      const clientesConsulta = await clienteAxios.get("/clientes", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setClientes(clientesConsulta.data);
      setRefresh(false);
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        history.replace("/iniciar-sesion");
      }
    }
  };

  React.useEffect(() => {
    if (auth.token !== "") {
      if (refresh === true) {
        consultarAPI();
      }
    } else {
      history.replace("/iniciar-sesion");
    }
  }, [refresh]);

  if (!auth.auth) return history.replace("/iniciar-sesion");

  if (!clientes.length) return <Spinner />;

  return (
    <>
      <h2>Clientes</h2>
      <Link to={"/clientes/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Cliente
      </Link>
      <ul className="listado-clientes">
        {clientes.map((c, index) => (
          <Cliente key={index + ""} cliente={c} refresh={setRefresh} />
        ))}
      </ul>
    </>
  );
}

export default withRouter(Clientes);
