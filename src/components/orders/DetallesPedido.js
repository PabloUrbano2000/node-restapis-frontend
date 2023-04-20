import React from "react";

function DetallesPedido({ pedido }) {
  const { cliente, productos = [] } = pedido || {};
  return (
    <li className="pedido">
      <div className="info-pedido">
        <p className="id">ID: {pedido._id}</p>
        <p className="nombre">
          Cliente: {cliente.nombre} {cliente.apellido}
        </p>

        <div className="articulos-pedido">
          <p className="productos">Artículos Pedido: </p>
          <ul>
            {productos.map((p) => (
              <li key={p.producto._id}>
                <p>{p.producto.nombre}</p>
                <p>Precio: ${p.producto.precio}</p>
                <p>Cantidad: {p.cantidad}</p>
              </li>
            ))}
          </ul>
        </div>
        <p className="total">Total: ${pedido.total} </p>
      </div>
      <div className="acciones">
        <button type="button" className="btn btn-rojo btn-eliminar">
          <i className="fas fa-times"></i>
          Eliminar Pedido
        </button>
      </div>
    </li>
  );
}

export default DetallesPedido;
