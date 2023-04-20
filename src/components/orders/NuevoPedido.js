import React from "react";
import { withRouter } from "react-router-dom";
import clienteAxios from "../../config/axios";
import BuscarProducto from "./BuscarProducto";
import Swal from "sweetalert2";
import CantidadProducto from "./CantidadProducto";
import { CRMContext } from "../../context/CRMContext";

function NuevoPedido(props) {
  const [auth] = React.useContext(CRMContext);
  const { history } = props;
  const { idCliente } = props.match.params;

  const [cliente, setCliente] = React.useState({});

  const [busqueda, setBusqueda] = React.useState("");
  const [productos, setProductos] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  const consultarAPI = async (id) => {
    try {
      const response = await clienteAxios.get("/clientes/" + id);

      setCliente(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (!auth.token) {
      history.replace("/iniciar-sesion");
    } else {
      if (idCliente) {
        consultarAPI(idCliente);
      }
    }
  }, []);

  const buscarProducto = async (e) => {
    e.preventDefault();

    try {
      const response = await clienteAxios.post(
        "/productos/busqueda/" + busqueda
      );
      if (response.data[0]) {
        let productoResultado = response.data[0];

        productoResultado.producto = response.data[0]._id;
        productoResultado.cantidad = 0;

        const hasProduct = productos.find(
          (p) => p.producto === response.data[0]._id
        );

        if (hasProduct) return;

        setProductos([...productos, productoResultado]);
      } else {
        Swal.fire({
          title: "No Resultados",
          icon: "error",
          text: "No hay resultados",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Ocurrió un error",
        icon: "error",
        text: "Ocurrió un error inesperado, inténtelo más tarde",
      });
    }
  };

  const leerDatosBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const calculateTotal = (products) => {
    let sum = 0;
    products.map((p) => {
      sum = sum + p.precio * p.cantidad;
    });
    setTotal(sum);
  };

  const restarProductos = (id) => {
    const newProducts = productos.map((p) =>
      p.producto === id
        ? { ...p, cantidad: p.cantidad <= 0 ? 0 : p.cantidad - 1 }
        : p
    );

    setProductos(newProducts);
    calculateTotal(newProducts);
  };

  const aumentarProductos = (id) => {
    const newProducts = productos.map((p) =>
      p.producto === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setProductos(newProducts);
    calculateTotal(newProducts);
  };

  const eliminarProducto = (id) => {
    const newProducts = productos.filter((p) => p.producto !== id);
    setProductos(newProducts);
    calculateTotal(newProducts);
  };

  const realizarPedido = async (e) => {
    e.preventDefault();

    const { idCliente } = props.match.params;
    const pedido = {
      cliente: idCliente,
      productos,
      total,
    };

    try {
      const response = await clienteAxios.post(
        `/pedidos/nuevo/${idCliente}`,
        pedido
      );

      if (response.data.code === 0) {
        Swal.fire("Pedido Realizado", response.data.mensaje, "success");
        history.push("/pedidos");
      } else {
        Swal.fire({
          icon: "error",
          title: response.data.mensaje
            ? response.data.mensaje
            : ' "Hubo un Error Inesperado"',
          text: "Vuelva a intentarlo",
        });
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Hubo un Error Inesperado",
        text: "Vuelva a intentarlo",
      });
    }
  };

  return (
    <>
      <h2>Nuevo Pedido</h2>

      <div className="ficha-cliente">
        <h3>Datos de Cliente</h3>
        <p>
          {cliente.nombre} {cliente.apellido}
        </p>
        <p>Teléfono: {cliente.telefono}</p>
      </div>

      <BuscarProducto
        buscarProducto={buscarProducto}
        leerDatosBusqueda={leerDatosBusqueda}
      />

      <ul className="resumen">
        {productos.map((p) => (
          <CantidadProducto
            key={p.producto}
            producto={p}
            restarProductos={restarProductos}
            aumentarProductos={aumentarProductos}
            eliminarProducto={eliminarProducto}
          />
        ))}
      </ul>
      <p className="total">
        Total a Pagar: <span>$ {total}</span>
      </p>
      {total > 0 ? (
        <form onSubmit={realizarPedido}>
          <input
            type="submit"
            className="btn btn-verde btn-block"
            value="Realizar Pedido"
          />
        </form>
      ) : null}
    </>
  );
}

export default withRouter(NuevoPedido);
