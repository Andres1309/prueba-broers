"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCharacters } from "../../services/marvelApis";
import { FaSpinner } from "react-icons/fa";

const Dashboard = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offset, setOffset] = useState(0);
  const limit = 15;
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const data = await getCharacters(offset, limit);
        setCharacters(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, [offset]);

  const handleNext = () => {
    setOffset(prevOffset => prevOffset + limit);
  };

  const handlePrevious = () => {
    setOffset(prevOffset => Math.max(0, prevOffset - limit));
  };

  const handleLogout = () => {
    // Eliminar el indicador de autenticación del localStorage
    localStorage.removeItem("isAuthenticated");
    // Redirigir al usuario a la página de inicio de sesión
    router.push("/");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-black text-white">
        <FaSpinner
          className="text-white"
          size={50}
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  if (error) return <p className="text-white">{error}</p>;

  return (
    <div className="container-fluid d-flex flex-column justify-content-center p-4 px-5 bg-black text-white">
      {/* Botón de cerrar sesión */}
      <div className="d-flex justify-content-end mb-4">
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          Cerrar Sesión
        </button>
      </div>

      <h1 className="text-2xl text-center font-bold py-4 mb-4">
        Personajes de Marvel
      </h1>
      <div
        className="table-responsive"
        style={{
          border: "1px solid #6a0dad",
          boxShadow: "0 0 10px #6a0dad, 0 0 20px #6a0dad, 0 0 30px #6a0dad",
        }}
      >
        <table className="table table-dark table-striped table-bordered m-0">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Descripción</th>
              <th scope="col">Imagen</th>
            </tr>
          </thead>
          <tbody>
            {characters.map((character) => (
              <tr
                key={character.id}
                onClick={() => router.push(`/characters/${character.id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{character.name}</td>
                <td>{character.description || "Sin descripción"}</td>
                <td style={{ padding: "20px" }}>
                  <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                    className="img-thumbnail rounded-circle"
                    style={{
                      width: "95px",
                      height: "60px",
                      border: "1px solid #fff",
                      boxShadow:
                        "0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff",
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mt-5">
        <button
          onClick={handlePrevious}
          disabled={offset === 0}
          className="btn btn-primary"
        >
          Anterior
        </button>
        <button
          onClick={handleNext}
          className="btn btn-primary"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Dashboard;