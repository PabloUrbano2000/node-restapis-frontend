import React from "react";
import clienteAxios from "../../config/axios";
import Spinner from "../layout/Spinner";
import DetallesPedido from "./DetallesPedido";
import { withRouter } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";

function Pedidos({ history }) {
  const [auth] = React.useContext(CRMContext);

  const [pedidos, setPedidos] = React.useState([]);

  const consultarAPI = async () => {
    try {
      const clientesConsulta = await clienteAxios.get("/pedidos", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setPedidos(clientesConsulta.data);
    } catch (error) {
      console.log(error);
      if (error.response.status == 500) {
        history.replace("/iniciar-sesion");
      }
    }
  };

  React.useEffect(() => {
    if (auth.token !== "") {
      consultarAPI();
    } else {
      history.replace("/iniciar-sesion");
    }
  }, []);

  if (!auth.auth) return history.replace("/iniciar-sesion");

  if (pedidos.length <= 0) return <Spinner />;

  return (
    <ul className="listado-pedidos">
      {pedidos.map((p) => (
        <DetallesPedido pedido={p} key={p._id} />
      ))}
    </ul>
  );
}

export default withRouter(Pedidos);
