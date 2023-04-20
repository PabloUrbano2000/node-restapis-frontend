import React from "react";
import { Link } from "react-router-dom";

import clienteAxios from "../../config/axios";
import Producto from "./Producto";
import Spinner from "../layout/Spinner";
import { withRouter } from "react-router-dom";
import { CRMContext } from "../../context/CRMContext";

function Productos({ history }) {
  const [auth] = React.useContext(CRMContext);

  const [productos, setProductos] = React.useState([]);
  const [refresh, setRefresh] = React.useState(true);

  const consultarAPI = async () => {
    try {
      const productosConsulta = await clienteAxios.get("/productos", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setProductos(productosConsulta.data);
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

  if (!productos.length) return <Spinner />;

  return (
    <>
      <h2>Productos</h2>

      <Link to={"/productos/nuevo"} className="btn btn-verde nvo-cliente">
        {" "}
        <i className="fas fa-plus-circle"></i>
        Nuevo Producto
      </Link>

      <ul className="listado-productos">
        {productos.map((p, index) => (
          <Producto key={index + ""} producto={p} refresh={setRefresh} />
        ))}
      </ul>
    </>
  );
}

export default withRouter(Productos);
