const fs = require("fs");
const express = require("express");
const app = express();
const route = "./productos.txt";
const port = 8080;

class Contenedor {
  constructor(route) {
    this.route = route;
  }
  async save(obj) {
    let num = 1;
    for (let i = 0; i < obj.length; i++) {
      if (obj[i].id === undefined) {
        obj[i].id = num;
        num++;
      }
    }
    try {
      let JSONobj = JSON.stringify(obj, null, 2);
      await fs.promises.writeFile(route, JSONobj);
      return num;
    } catch (e) {
      console.log(e);
    }
  }
  async getAll() {
    try {
      let content = await fs.promises.readFile(route, "utf-8");
      let parseContent = JSON.parse(content);
      return parseContent;
    } catch (e) {
      console.log(e);
    }
  }
  async getById(num) {
    try {
      let content = await fs.promises.readFile(route, "utf-8");
      let parseContent = JSON.parse(content);
      if (parseContent[num] === undefined) {
        return null
      } else {
        return parseContent[num];
      }
    } catch (e) {
      console.log(e);
    }
  }
}
const Container = new Contenedor(route);

app.listen(port, () => {
  console.log("server up");
});

const Save = async () => {
  await Container.save([
    // Guarda El array y le da un id a cada uno
    {
      name: "Auto",
      price: 200,
      description: "Auto grande con 4 ruedas",
    },
    {
      name: "Moto",
      price: 400,
      description: "Moto de 2 ruedas para 2 pasajeros",
    },
    {
      name: "Camion",
      price: 600,
      description: "Camion de 6 ruedas para 5 pasajeros",
    },
    {
      name: "Avion",
      price: 1000,
      description: "Avion con capacidad para 60 personas",
    },
  ]);
};

const Home = async () => {
  // Home del port
  app.get("/", (req, res) => {
    res.send("Hola Emiliano! Este es el home");
  });
};

const getAll = async () => {
  // Obtiene todos los productos en un JSON.parse y se coloca en productos
  let content = await Container.getAll();
  app.get("/productos", (req, res) => {
    res.send(content);
  });
};

const randomProduct = async () => {
  // Obtiene un producto random con math.random y se coloca en productoRandom
  let randomN = parseInt(Math.random() * 3 + 1);
  let content = await Container.getById(randomN);
  app.get("/productoRandom", (req, res) => {
    res.send(content);
  });
};

const ejectAll = async () => {
  await Save();
  await Home();
  await getAll();
  await randomProduct();
}

ejectAll()
