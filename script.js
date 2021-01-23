/** @format */
let button = document.querySelector(".btn");
let inputValue = document.querySelector(".form-input");
const apiKey = "ad226a44dedb3b77340424c5a27e237d";
const containerApp = document.querySelector(".container");
const containerFondo = document.querySelector(".container-fondo");
const fecha = document.querySelector(".fechayhora");
const menuBtn = document.querySelector(".menu-toggle");
const topNav = document.querySelector(".site-nav");

const containerResultadosCiudad = document.querySelector(
    ".container-resultados__datosciudad"
);
const containerPronosticoFYH = document.querySelector(
    ".container-resultados__pronostico"
);

const containerPronosticoSemanal = document.querySelector(
    ".container-resultados__pronosticosemanal"
);
const containerPronosticos = document.querySelector(
    ".container-resultados__pronosticosemanal--container-pronosticos"
);

const containerError = document.querySelector(".container-error");

//Ubicación actual con geolocation y luego con geocode
const obtenerUbicacionActual = function () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (pos) => resolve(pos),
            (err) => reject(err)
        );
    });
};

//Temperatura en celsius
const kelvinACelsius = function (k) {
    return Math.trunc(k - 273.15);
};

const celciusAFahrenheit = function (c) {
    return Math.trunc((c * 9) / 5) + 32;
};

const fahrenheitACelcius = function (c) {
    return Math.trunc(((c - 32) * 5) / 9);
};

const capitalizarPalabra = function (palabra) {
    const capPalabra = palabra[0].toUpperCase() + palabra.slice(1);
    return capPalabra;
};

//fecha hora y dia
const ahora = new Date();
const opciones = {
    day: "numeric",
    month: "short",
    hour: "numeric",
    year: "numeric",
    minute: "numeric",
};

//idioma

const idiomaLocal = navigator.language;
fecha.textContent = new Intl.DateTimeFormat(idiomaLocal, opciones).format(ahora);

//Mostrar error
const mostrarError = function () {
    containerPronosticoFYH.style.display = "none";
    containerPronosticoSemanal.style.display = "none";
    containerError.style.display = "flex";
    containerResultadosCiudad.style.display = "none";
};

//insertar al DOM la ciudad y la temperatura
const insertarDOM = function (data) {
    const html = `<h3 class="container-resultados__datosciudad--ciudad">${
        data.name
    }, ${data.sys.country}</h3>
      <div class="container-resultados__datosciudad--info">
        <p class="container-resultados__datosciudad--temperatura">${kelvinACelsius(
            data.main.temp
        )}ºC</p>
        
        <img class="container-resultados__datosciudad--icono" src="https://openweathermap.org/img/wn/${
            data.weather[0].icon
        }@2x.png" alt="">
        
        <div class="container-resultados_datosciudad--descripcion">
          <p class="container-resultados__datosciudad--descripcionclima">${capitalizarPalabra(
              data.weather[0].description
          )}</p>
          <button class="container-resultados__datosciudad--descripcionbtn">Ver en Fahrenheit</button>
        </div>
      </div>
  `;

    //anexando info a html
    containerResultadosCiudad.innerHTML = "";
    containerResultadosCiudad.insertAdjacentHTML("beforeend", html);

    cambiarTemperatura(data);
};

const cambiarTemperatura = function (data) {
    //Pasar de celsius a fahrenheit boton
    const celsiusAFahrenheitBtn = document.querySelector(
        ".container-resultados__datosciudad--descripcionbtn"
    );

    const temperaturaCelsius = document.querySelector(
        ".container-resultados__datosciudad--temperatura"
    );

    celsiusAFahrenheitBtn.addEventListener("click", function () {
        let fahrenheitTemp = `${celciusAFahrenheit(
            kelvinACelsius(data.main.temp)
        )} F`;

        const temperaturaCelsiusMax = document.getElementsByClassName(
            "container-resultados__pronosticosemanal--pronosticos-tempmax"
        );
        const temperaturaCelsiusMin = document.getElementsByClassName(
            "container-resultados__pronosticosemanal--pronosticos-tempmin"
        );

        if (temperaturaCelsius.innerHTML !== fahrenheitTemp) {
            temperaturaCelsius.textContent = fahrenheitTemp;
            for (let el of temperaturaCelsiusMax) {
                el.textContent = `${celciusAFahrenheit(
                    el.textContent.split("º")[0]
                )} F`;
            }
            for (let el of temperaturaCelsiusMin) {
                el.textContent = `${celciusAFahrenheit(
                    el.textContent.split("º")[0]
                )} F`;
            }
            celsiusAFahrenheitBtn.textContent = `Ver en Celsius`;
        } else if (temperaturaCelsius.innerHTML === fahrenheitTemp) {
            temperaturaCelsius.textContent = `${kelvinACelsius(data.main.temp)}ºC`;
            for (let el of temperaturaCelsiusMax) {
                el.textContent = `${fahrenheitACelcius(
                    el.textContent.split(" ")[0]
                )}ºC`;
            }
            for (let el of temperaturaCelsiusMin) {
                el.textContent = `${fahrenheitACelcius(
                    el.textContent.split(" ")[0]
                )}ºC`;
            }
            celsiusAFahrenheitBtn.textContent = `Ver en Fahrenheit`;
        }
    });
};

//Mostrar pronostico
const mostrarPronostico = function (data) {
    const html = `
    <div class="container-resultados__pronosticosemanal--pronosticos">
      <p class="container-resultados__pronosticosemanal--pronosticos-dia">${capitalizarPalabra(
          obtenerDia(data.dt)
      )}</p>
      <h2 class="container-resultados__pronosticosemanal--pronosticos-tempmax">${kelvinACelsius(
          data.temp.max
      )}ºC</h2>
      <h5 class="container-resultados__pronosticosemanal--pronosticos-tempmin">${kelvinACelsius(
          data.temp.min
      )}ºC</h5>
      <img class="container-resultados__pronosticosemanal--pronosticos-icono" src="https://openweathermap.org/img/wn/${
          data.weather[0].icon
      }@2x.png">
      <h5 class="container-resultados__pronosticosemanal--pronosticos-preci">Humedad:</h5>
      <h5 class="container-resultados__pronosticosemanal--pronosticos-preci">${
          data.humidity
      } %</h5>
    </div>
    `;

    containerPronosticos.insertAdjacentHTML("beforeend", html);
    const dataHoy = document.querySelector(
        ".container-resultados__pronosticosemanal--pronosticos-dia"
    );

    if (dataHoy.innerHTML === "Hoy") return dataHoy.classList.add("hoy");
};

//obtener dia de la semana
const obtenerDia = function (dia) {
    const ahora = dia * 1000;
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
    const daysPassed = calcDaysPassed(new Date(), ahora);

    if (daysPassed === 0) {
        return "Hoy";
    }
    const opciones = {
        weekday: "long",
    };
    return new Intl.DateTimeFormat(idiomaLocal, opciones).format(ahora);
};

//pronostico
const pronostico5 = async function (lat, lon) {
    try {
        const resPronostico = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
        if (!resPronostico.ok)
            throw new Error("Error en la busqueda del pronostico");
        const dataPronostico = await resPronostico.json();
        containerPronosticos.innerHTML = "";
        const data5 = dataPronostico.daily.splice(0, 5);
        data5.forEach((dataDia) => mostrarPronostico(dataDia));
    } catch (err) {
        mostrarError();
    }
};

//consulta clima
const clima = async function (lat, lon) {
    try {
        const resClima = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=es&appid=${apiKey}`
        );

        if (!resClima.ok) throw new Error("Error en la busqueda del clima");
        const dataClima = await resClima.json();
        insertarDOM(dataClima);
        fondoImg(dataClima.weather[0].description);
    } catch (err) {
        mostrarError();
    }
};

//consulta ciudad
const ciudadDondeEstoy = async function () {
    try {
        const pos = await obtenerUbicacionActual();
        const { latitude: lat, longitude: lon } = pos.coords;
        clima(lat, lon);
        pronostico5(lat, lon);
    } catch (err) {
        mostrarError();
    }
};
ciudadDondeEstoy();

//function backgroud
const setFondoContainer = function (posImg) {
    const resize = () => {
        if (innerWidth < 500) {
            containerFondo.style.backgroundImage = "none";
        } else {
            containerFondo.style.backgroundImage = posImg;
        }
    };
    resize();
    addEventListener("resize", resize);
    addEventListener("DOMContentLoaded", resize);
};

const contenedoresDia = function () {
    containerApp.style.backgroundColor = "#abcdfa";
    containerPronosticoFYH.style.backgroundColor = "#7bb1fa";
    containerResultadosCiudad.style.backgroundColor = "#7bb1fa";
    containerPronosticoSemanal.style.backgroundColor = "#7bb1fa";
};
//Imagen background
const fondoImg = function (data) {
    const ahora = new Date();
    const opciones = {
        hour: "numeric",
        minute: "numeric",
    };

    //idioma
    const idiomaLocal = navigator.language;
    const hora = new Intl.DateTimeFormat(idiomaLocal, opciones).format(ahora);

    //refactorizando codigo ifs

    const imagPalabra = [
        {
            descripcion: ["rotas", "nuboso"],
            url: "url('assets/bkg_images/brokenClouds.png')",
        },
        {
            descripcion: ["niebla", "nieblina", "bruma"],
            url: "url('assets/bkg_images/mist.png')",
        },
        {
            descripcion: ["Algo de", "nubes"],
            url: "url('assets/bkg_images/fewClouds.png')",
        },
        {
            descripcion: ["dispersas", "nubes"],
            url: "url('assets/bkg_images/scatteredClouds.png')",
        },
        {
            descripcion: ["nieve", "nevada"],
            url: "url('assets/bkg_images/snow.png')",
        },
        {
            descripcion: ["despejado", "claro"],
            url: "url('assets/bkg_images/clearSky_dia.png')",
        },
        {
            descripcion: ["despejado", "claro"],
            url: "url('assets/bkg_images/clearSky_noche.png')",
        },
        {
            descripcion: ["lluvia", "llovizna"],
            url: "url('assets/bkg_images/rain.png')",
        },
        {
            descripcion: ["aguacero"],
            url: "url('assets/bkg_images/showerRain.png')",
        },
        { descripcion: ["tormenta"], url: "url('assets/bkg_images/thunder.png')" },
    ];

    imagPalabra.forEach((el) => {
        el["descripcion"].forEach((clima) => {
            if (data.includes(clima) && hora >= "06:00" && hora <= "18:00") {
                setFondoContainer(el["url"]);
                contenedoresDia();
                document
                    .querySelector(".mensaje-error")
                    .classList.remove("mensaje-error-color");
            } else if (data.includes(clima) && (hora > "18:00" || hora < "06:00")) {
                setFondoContainer(el["url"]);
                document
                    .querySelector(".mensaje-error")
                    .classList.add("mensaje-error-color");
                document
                    .querySelector(
                        ".container-resultados__datosciudad--descripcionbtn"
                    )
                    .classList.add("btn_shadow");
                document.querySelector(".btn").classList.add("btn_shadow");
            }
            if (
                (data.includes("despejado") || data.includes("claro")) &&
                hora > "06:00" &&
                hora <= "18:00"
            ) {
                setFondoContainer("url('assets/bkg_images/clearSky_dia.png')");
                contenedoresDia();
            }
            if (
                (data.includes("despejado") || data.includes("claro")) &&
                (hora > "18:00" || hora < "06:00")
            )
                return setFondoContainer(
                    "url('assets/bkg_images/clearSky_noche.png')"
                );
        });
    });
};

//buscador de ciudad
button.addEventListener("click", function () {
    containerPronosticoFYH.style.display = "flex";
    containerPronosticoSemanal.style.display = "block";
    containerResultadosCiudad.style.display = "block";
    containerError.style.display = "none";
    const buscarCiudad = async function () {
        try {
            const resBusquedaCiudad = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${inputValue.value}&lang=es&appid=${apiKey}`
            );
            const response = await resBusquedaCiudad.json();
            insertarDOM(response);
            pronostico5(response.coord.lat, response.coord.lon);
            fondoImg(response.weather[0].description);
        } catch (err) {
            mostrarError();
        }
    };
    buscarCiudad();
});

menuBtn.addEventListener("click", function () {
    topNav.classList.toggle("site-nav-open");
    menuBtn.classList.toggle("menu-open");
});
