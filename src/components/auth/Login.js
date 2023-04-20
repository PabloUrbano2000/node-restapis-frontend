import React from "react";
import Swal from "sweetalert2";
import { withRouter } from "react-router-dom";
import clienteAxios from "../../config/axios";
import { CRMContext } from "../../context/CRMContext";

function Login({ history }) {
  const [auth, setAuth] = React.useContext(CRMContext);

  const [credenciales, setCredenciales] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value,
    });
  };
  const { email, password } = credenciales;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await clienteAxios.post("/iniciar-sesion", credenciales);
      console.log(response.data);
      if (response.data.code === 0) {
        const token = response?.data?.token;

        localStorage.setItem("token", token);

        setAuth({
          token,
          auth: true,
        });

        Swal.fire("Login Correcto", "Has iniciado Sesión", "success");

        history.push("/");
      } else {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: response?.data?.mensaje
            ? response.data.mensaje
            : "Ocurrió un error inesperado",
        });
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: error?.response?.data?.mensaje
            ? error.response.data.mensaje
            : "Ocurrió un error inesperado",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Hubo un error",
          text: "Ocurrió un error inesperado",
        });
      }
    }
  };

  return (
    <div className="login">
      <h2>Iniciar Sesión</h2>
      <div className="contenedor-formulario">
        <form onSubmit={handleSubmit}>
          <div className="campo">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              name="email"
              placeholder="Email para Iniciar Sesión"
              required
              onChange={handleChange}
              value={email}
            />
          </div>

          <div className="campo">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Password para Iniciar Sesión"
              required
              onChange={handleChange}
              value={password}
            />
          </div>
          <input
            type="submit"
            value="Iniciar Sesión"
            className="btn btn-verde btn-block"
          />
        </form>
      </div>
    </div>
  );
}

export default withRouter(Login);
