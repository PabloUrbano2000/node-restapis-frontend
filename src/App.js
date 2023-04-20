import React from "react";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";

import Clientes from "./components/clients/Clientes";
import NuevoCliente from "./components/clients/NuevoCliente";
import EditarCliente from "./components/clients/EditarCliente";

import Productos from "./components/products/Productos";
import NuevoProducto from "./components/products/NuevoProducto";
import EditarProducto from "./components/products/EditarProducto";

import Pedidos from "./components/orders/Pedidos";
import NuevoPedido from "./components/orders/NuevoPedido";

import Login from "./components/auth/Login";

import { CRMContext, CRMProvider } from "./context/CRMContext";

function App() {
  const [auth, setAuth] = React.useContext(CRMContext);

  return (
    <Router>
      <CRMProvider value={[auth, setAuth]}>
        <Header />
        <div className="grid contenedor contenido-principal">
          <Navegacion />

          <main className="caja-contenido col-9">
            {/* TODO: ROUTING A LOS DIFERENTES COMPONENTES */}
            <Switch>
              <Route exact path="/" component={Clientes}></Route>
              <Route
                exact
                path="/clientes/nuevo"
                component={NuevoCliente}
              ></Route>
              <Route
                exact
                path="/clientes/editar/:id"
                component={EditarCliente}
              ></Route>

              <Route exact path="/productos" component={Productos}></Route>
              <Route
                exact
                path="/productos/nuevo"
                component={NuevoProducto}
              ></Route>
              <Route
                exact
                path="/productos/editar/:id"
                component={EditarProducto}
              ></Route>

              <Route exact path="/pedidos" component={Pedidos}></Route>
              <Route
                exact
                path="/pedidos/nuevo/:idCliente"
                component={NuevoPedido}
              ></Route>

              <Route exact path="/iniciar-sesion" component={Login} />
            </Switch>
          </main>
        </div>
      </CRMProvider>
    </Router>
  );
}

export default App;
