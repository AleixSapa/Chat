// Configuració de Firebase
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "project-id.firebaseapp.com",
  databaseURL: "https://project-id.firebaseio.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "sender-id",
  appId: "app-id",
};

// Inicialitzar Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

var usuariActual = "";

// Funció per iniciar sessió
function iniciarSessio() {
  var inputUsuari = document.getElementById("usuari");
  var nom = inputUsuari.value.trim();

  if (nom !== "") {
    usuariActual = nom;
    document.getElementById("login-container").style.display = "none";
    document.getElementById("xat-container").style.display = "block";

    socket.emit("nou usuari", usuariActual);
  } else {
    alert("Si us plau, escriu un nom!");
  }
}

// Enviar un missatge
function enviarMissatge() {
  var input = document.getElementById("inputMissatge");
  var text = input.value.trim();

  if (text !== "") {
    // Afegir missatge a la base de dades de Firebase
    const missatgesRef = db.ref("missatges");
    missatgesRef.push().set({
      usuari: usuariActual,
      text: text,
      timestamp: Date.now(),
    });
    input.value = "";
  }
}

// Rebre missatges de Firebase
const missatgesRef = db.ref("missatges");
missatgesRef.on("child_added", function (snapshot) {
  var data = snapshot.val();
  var missatge = document.createElement("div");
  missatge.classList.add("missatge");
  missatge.innerHTML = `<span class="nom">${data.usuari}:</span> ${data.text}`;
  document.getElementById("missatges").appendChild(missatge);
  document.getElementById("missatges").scrollTop =
    document.getElementById("missatges").scrollHeight;
});

// Rebre la llista d'usuaris connectats
const usuarisRef = db.ref("usuaris");
usuarisRef.on("value", function (snapshot) {
  var usuaris = snapshot.val();
  var llistaUsuaris = document.getElementById("llista-usuaris");
  llistaUsuaris.innerHTML = ""; // Esborrar la llista actual

  for (var id in usuaris) {
    var usuari = usuaris[id];
    var element = document.createElement("div");
    element.textContent = usuari;
    llistaUsuaris.appendChild(element);
  }
});

// Afegir un usuari a Firebase
function afegirUsuari(usuari) {
  const usuarisRef = db.ref("usuaris");
  usuarisRef.push(usuari);
}
