<script>

const artikel = [
  {name:"🍺 UrPils",preis:2.8},
  {name:"📦 Bierkasten",preis:35},

  {name:"🍺 Weizenbier",preis:3.8},
  {name:"🍺 Pils alkoholfrei",preis:2.8},
  {name:"🍺 Radler",preis:2.8},

  {name:"🍺 Mixery Cola",preis:2.8},
  {name:"🍺 Mixery Blue",preis:2.8},
  {name:"🍺 Mixery Cola Orange",preis:2.8},

  {name:"🥤 Coca-Cola",preis:2.3},
  {name:"🥤 Fanta",preis:2.3},
  {name:"🥤 Sprite",preis:2.3},

  {name:"💧 Sprudel",preis:1.8},
  {name:"🍎 Apfelschorle",preis:1.8},
  {name:"🍏 Gründels Fresh",preis:2.3},
  {name:"🥤 Isogetränk",preis:1.8},
  {name:"🍺 Malzbier",preis:1.8},
  {name:"🍺 Eistee Pfirsich",preis:1.8},
  {name:"🍺 Eistee Zitrone",preis:1.8},
  
  {name:"⚡ Energy",preis:2.5},
  {name:"🧃 Capri-Sonne",preis:1.0},

  {name:"☕ Kaffee",preis:1.5}
];

let daten =
JSON.parse(localStorage.getItem("vereinskasse"))
|| {};

artikel.forEach(a=>{
 if(!daten[a.name]) daten[a.name]=0;
});

  <div style="
background:white;
padding:10px;
margin:10px;
border-radius:10px;
">

<h2>🧾 Deckel</h2>

<select id="deckelListe"
onchange="deckelWechsel()">

<option value="">Kein Deckel</option>

</select>

<button onclick="neuerDeckel()">
➕ Neuer Deckel
</button>

</div>
  
  let warenkorb = {};

  let deckel = JSON.parse(
  localStorage.getItem("deckel")
) || {};

let aktiverDeckel = "";
  
  let warenkorbGesamt = 0;
 
  function speichern(){
 localStorage.setItem(
   "vereinskasse",
   JSON.stringify(daten)
 );
 render();
}

  let optionen =
'<option value="">Kein Deckel</option>';

for(const name in deckel){

  optionen +=
  `<option value="${name}">
     ${name}
   </option>`;
}

document.getElementById(
  "deckelListe"
).innerHTML =
optionen;
function render(){

 let html="";
 let umsatz=0;

 artikel.forEach(a=>{

   umsatz += daten[a.name]*a.preis;

   html += `
<div class="card">
  <div class="name">${a.name}</div>
  <div class="price">${a.preis.toFixed(2)} €</div>

  <div style="margin-top:10px;">
    <button onclick="minus('${a.name}')">➖</button>

    <span style="
      font-size:28px;
      font-weight:bold;
      margin:0 15px;
    ">
      ${daten[a.name]}
    </span>

    <button onclick="verkauf('${a.name}')">➕</button>
  </div>
</div>
`;
 });

 document.getElementById("grid").innerHTML=html;

 document.getElementById("umsatz")
 .innerText=umsatz.toFixed(2)+" €";

 document.getElementById("kasse")
 .innerText=(150+umsatz).toFixed(2)+" €";

 document.getElementById("entnahme")
 .innerText=umsatz.toFixed(2)+" €";

  let warenkorbHTML = "";
warenkorbGesamt = 0;

for(const name in warenkorb){

  const artikelInfo =
    artikel.find(a => a.name === name);

  const menge =
    warenkorb[name];

  const summe =
    menge * artikelInfo.preis;

  warenkorbGesamt += summe;

 warenkorbHTML += `
<div style="
display:flex;
justify-content:space-between;
margin:5px 0;
">

<span>
${name} x${menge}
</span>

<button
onclick="warenkorbMinus('${name}')"
>
➖
</button>

</div>
`;
}

if(warenkorbHTML === ""){
  warenkorbHTML =
    "Noch keine Artikel";
}

document.getElementById(
  "warenkorbAnzeige"
).innerHTML =
  warenkorbHTML;

document.getElementById(
  "warenkorbGesamt"
).innerText =
  warenkorbGesamt.toFixed(2)
  + " €";

  let historieHTML = "";

historie
.slice()
.reverse()
.forEach((eintrag)=>{

  historieHTML += `
  <div style="
    background:white;
    padding:10px;
    margin:10px;
    border-radius:10px;
  ">
    <b>${eintrag.datum}</b><br>
    ${eintrag.veranstaltung}<br>
    Umsatz: ${eintrag.umsatz} €
  </div>
  `;
});

  function neuerDeckel(){

  let name =
    prompt("Name des Deckels");

  if(!name) return;

  if(!deckel[name]){

    deckel[name]=[];

  }

  localStorage.setItem(
    "deckel",
    JSON.stringify(deckel)
  );

  render();
}

function deckelWechsel(){

  aktiverDeckel =
    document.getElementById(
      "deckelListe"
    ).value;

}
document.getElementById("historieAnzeige").innerHTML = historieHTML;

}
  
  function verkauf(name){

  if(!warenkorb[name]){
    warenkorb[name] = 0;
  }

  warenkorb[name]++;

  render();
}

function warenkorbMinus(name){

  if(!warenkorb[name]){
    return;
  }

  warenkorb[name]--;

  if(warenkorb[name] <= 0){
    delete warenkorb[name];
  }

  render();
}

function verkaufAbschliessen(){

  if(Object.keys(warenkorb).length === 0){
    alert("Warenkorb ist leer");
    return;
  }

  let bezahlt =
    parseFloat(
      document.getElementById("bezahlt").value
    ) || 0;

  if(bezahlt < warenkorbGesamt){

    alert(
      "Bezahlt kleiner als Gesamtbetrag"
    );

    return;
  }

  for(const name in warenkorb){

    if(!daten[name]){
      daten[name] = 0;
    }

    daten[name] += warenkorb[name];
  }

  warenkorb = {};

  speichern();

  document.getElementById(
    "bezahlt"
  ).value = "";

  document.getElementById(
    "rueckgeld"
  ).innerText = "0,00 €";

  alert("Verkauf abgeschlossen");
}

  function setBezahlt(betrag){

  document.getElementById(
    "bezahlt"
  ).value = betrag;

  berechneRueckgeld();
}

function berechneRueckgeld(){

  let bezahlt =
    parseFloat(
      document.getElementById("bezahlt").value
    ) || 0;

  let rueckgeld =
    bezahlt - warenkorbGesamt;

  document.getElementById(
    "rueckgeld"
  ).innerText =
    rueckgeld.toFixed(2) + " €";
}  
 
  function minus(name){

  if(daten[name] > 0){
    daten[name]--;
    speichern();
  }

}
let historie =
JSON.parse(localStorage.getItem("historie"))
|| [];

function tagesabschluss(){
if(!confirm("Tagesabschluss durchführen?")){
  return;
}
  let umsatz = 0;

  artikel.forEach(a=>{
    umsatz += daten[a.name] * a.preis;
  });

  historie.push({
    datum:new Date().toLocaleDateString("de-DE"),
    veranstaltung:
      document.getElementById("veranstaltung").value,
    umsatz:umsatz.toFixed(2),
    daten:{...daten}
  });

  localStorage.setItem(
    "historie",
    JSON.stringify(historie)
  );

  if(confirm("Tagesabschluss speichern und Tageszähler zurücksetzen?")){

  alert("Tagesabschluss gespeichert");

  artikel.forEach(a=>{
    daten[a.name] = 0;
  });

  speichern();
}
  render();
}render();

</script>
