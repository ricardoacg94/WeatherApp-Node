import "dotenv/config";

import {
  inquirerMenu,
  leerInput,
  listadoLugares,
  pausa,
} from "./helpers/inquirer.js";
import { Busquedas } from "./models/busquedas.js";

const main = async () => {
  let opt;
  const busquedas = new Busquedas();
  do {
    busquedas.leerBd();
    opt = await inquirerMenu();

    switch (opt) {
      case 1:
        //Mostrar mensaje

        const termino = await leerInput("Ciudad:");
        const lugares = await busquedas.ciudad(termino);
        const id = await listadoLugares(lugares);
        if (id === 0) continue;
        const lugarSelec = lugares.find((l) => l.id === id);
        busquedas.agregarHistorial(lugarSelec.nombre);
        const clima = await busquedas.climaLugar(
          lugarSelec.lat,
          lugarSelec.lng
        );

        console.clear();
        console.log("\nInformacion del lugar\n".green);
        console.log("Ciudad:", lugarSelec.nombre.green);

        console.log("lat:", lugarSelec.lat);
        console.log("Lng:", lugarSelec.lng);
        console.log("Temperatura:", clima.temp);
        console.log("Minima:", clima.min);
        console.log("Maxima:", clima.max);
        console.log("Como esta el Clima:", clima.desc.green);

        break;

      case 2:
        console.clear();
        console.log("Informacion del Historial\n");
        busquedas.historialCapitalizado.forEach((ciudad, i) => {
          console.log(`${i + 1}`.green, ciudad);
        });
    }

    if (opt !== 0) await pausa();
  } while (opt != 0);
};

main();
