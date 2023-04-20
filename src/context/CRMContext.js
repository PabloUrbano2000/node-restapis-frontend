import React from "react";

const CRMContext = React.createContext([{}, () => {}]);

const CRMProvider = (props) => {
  const [auth, setAuth] = React.useState({
    token: "",
    auth: false,
  });

  return (
    <CRMContext.Provider value={[auth, setAuth]}>
      {props.children}
    </CRMContext.Provider>
  );
};

export { CRMContext, CRMProvider };
