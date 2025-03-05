"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Cambia useRouter de next/router a next/navigation
import { getCharacterById } from "../../../services/marvelApis";
import { FaSpinner } from "react-icons/fa";

export default function CharacterDetailPage() {
  const params = useParams();
  const id = params?.charactersId;
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/");
      return;
    }

    if (!id) {
      setError("ID de personaje no proporcionado");
      setLoading(false);
      return;
    }

    const fetchCharacter = async () => {
      try {
        const data = await getCharacterById(id);
        setCharacter(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id, router]); // Añade router como dependencia

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <FaSpinner
          className="text-primary"
          size={50}
          style={{ animation: "spin 1s linear infinite" }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>{error}</p>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <p>Personaje no encontrado</p>
      </div>
    );
  }

  return (
    <div
      className="container-fluid d-flex flex-column align-items-center justify-content-center vh-100 p-4"
      style={{ backgroundColor: "#000", color: "#fff" }}
    >
      <div
        className="card p-4"
        style={{
          maxWidth: "600px",
          width: "100%",
          backgroundColor: "#000",
          border: "1px solid #6a0dad",
          boxShadow: "0 0 10px #6a0dad, 0 0 20px #6a0dad, 0 0 30px #6a0dad",
        }}
      >
        <h1
          className="text-center display-4 font-weight-bold mb-4"
          style={{ color: "#fff" }}
        >
          {character.name}
        </h1>

        <div className="d-flex justify-content-center mb-4">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="img-fluid rounded-circle"
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              border: "2px solid #6a0dad",
              boxShadow: "0 0 10px #6a0dad, 0 0 20px #6a0dad, 0 0 30px #6a0dad",
            }}
          />
        </div>

        <p className="text-center lead" style={{ color: "#fff" }}>
          {character.description || "Sin descripción"}
        </p>
      </div>
    </div>
  );
}