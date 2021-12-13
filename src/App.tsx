import React, { useState, useEffect, useMemo } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { getProdutos } from "./services/api";
import "./App.css";

type IProduto = {
  id: number;
  name: string;
  price: number;
  available: boolean;
  description: string;
};

type Filtros = {
  _page: number;
  _limit: number;
};

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const [produtos, setProdutos] = useState<IProduto[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({ _page: 1, _limit: 5 });

  const location = useLocation();
  const history = useHistory();

  const urlParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );

  // set os parametros da URL no estado de filtro quando a pagina carregar
  useEffect(() => {
    filtros._page = Number(urlParams.get("page")) || 1;
    filtros._limit = Number(urlParams.get("page_limit")) || 5;

    setFiltros(filtros);
  }, []);

  // faz um get sempre que os url mudar
  useEffect(() => {
    setLoading(true);

    getProdutos(filtros)
      .then((response) => {
        setProdutos(response.data);
      })
      .catch(() => {
        alert("erro");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filtros]);

  // atualiza os filtros na URL
  useEffect(() => {
    urlParams.set("page", String(filtros._page));
    urlParams.set("page_limit", String(filtros._limit));

    updateURL();
  }, [filtros]);

  const updateURL = () => {
    history.push({
      pathname: location.pathname,
      search: `?${urlParams}`,
    });
  };

  // const formatarPreco = (preco: number) =>
  //   preco.toLocaleString("pt-br", { style: "currency", currency: "BRL" });

  const onClickAvancar = () => {
    setFiltros({ ...filtros, _page: filtros._page + 1 });
  };

  const onClickRetornar = () => {
    if (filtros._page <= 1) return;

    setFiltros({ ...filtros, _page: filtros._page - 1 });
  };

  return (
    <div className="App">
      <h2>Lista</h2>

      {!loading && (
        <div className="produtos">
          {produtos.map((produto, index) => (
            <div key={index} className="produto">
              <span>{produto.name}</span>
              <span>{produto.price}</span>
            </div>
          ))}
        </div>
      )}

      {loading && <h3>Carregando</h3>}

      <p>
        {urlParams.get("page")} {urlParams.get("page_limit")}
      </p>

      <div className="actions">
        <button disabled={filtros._page <= 1} onClick={onClickRetornar}>
          Retornar
        </button>
        <button onClick={onClickAvancar}>Avançar</button>
      </div>
    </div>
  );
}

export default App;
