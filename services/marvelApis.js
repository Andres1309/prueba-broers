import { MD5 } from "crypto-js";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MARVEL_PUBLIC_KEY;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_MARVEL_PRIVATE_KEY;

const generateHash = () => {
  const ts = new Date().getTime().toString();
  const hash = MD5(ts + PRIVATE_KEY + PUBLIC_KEY).toString();
  return { ts, hash };
};

export const getCharacters = async (offset = 0, limit = 15) => {
    const { ts, hash } = generateHash();
    const url = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}&offset=${offset}&limit=${limit}`;
  
    try {
      const response = await fetch(url);
      const { data } = await response.json();
      return data.results;
    } catch (error) {
      throw new Error("Error al cargar los personajes");
    }
  };

export const getCharacterById = async (id) => {
  if (!id) {
    throw new Error("ID de personaje no proporcionado");
  }

  const { ts, hash } = generateHash();
  const url = `https://gateway.marvel.com/v1/public/characters/${id}?ts=${ts}&apikey=${PUBLIC_KEY}&hash=${hash}`;

  try {
    const response = await fetch(url);
    const json = await response.json();

    if (json?.data?.results?.length > 0) {
      return json.data.results[0];
    } else {
      throw new Error("Personaje no encontrado");
    }
  } catch (error) {
    throw new Error("Error al cargar el personaje");
  }
};