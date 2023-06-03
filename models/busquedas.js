import axios from "axios";
import fs from "fs";

class Busquedas {
  historial = [];

  constructor() {}

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map((p) => p[0].toUpperCase() + p.substring(1));

      return palabras.join(" ");
    });
  }

  async ciudad(lugar = "") {
    // peticion http
    try {
      // console.log("ciudad", lugar);
      const respuesta = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?proximity=ip&types=country%2Cregion%2Cpostcode%2Cdistrict%2Clocality%2Caddress%2Cneighborhood%2Cpoi%2Cplace&language=es&access_token=${process.env.MAPBOX_key}`
      );

      return respuesta.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      return [];
    }
  }

  async climaLugar(lat, lon) {
    try {
      const respuesta = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=a01a5c0fa669ef2b8bd2e71b801fac46&units=metric&lang=es`
      );

      const data = respuesta.data;
      return {
        desc: data.weather[0].description,
        min: data.main.temp_min,
        max: data.main.temp_max,
        temp: data.main.temp,
      };
    } catch (error) {
      return [];
    }
  }

  agregarHistorial(ciudad = "") {
    if (this.historial.includes(ciudad.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0, 5);
    this.historial.unshift(ciudad.toLocaleLowerCase());

    this.guardarCiudad();
  }

  guardarCiudad() {
    fs.writeFileSync("./data/data.json", JSON.stringify(this.historial));
  }

  leerBd() {
    if (!fs.existsSync("./data/data.json")) return;

    const db = fs.readFileSync("./data/data.json", { encoding: "utf-8" });
    const data = JSON.parse(db);
    this.historial = data;
  }
}

export { Busquedas };
