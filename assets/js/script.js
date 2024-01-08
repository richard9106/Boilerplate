const API_KEY = "0GmXJEge4fotE0dRzpcQpbHhwk8";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModel = new bootstrap.Modal(
  document.getElementById("resultsModal")
);

document
  .getElementById("status")
  .addEventListener("click", (e) => getStatus(e));
document.getElementById("submit").addEventListener("click", (e) => postForm(e));

function proccessOptions(form){
  let optArray=[];
  
  for(let entry of form.entries()){
    if(entry[0] === "options"){
      optArray.push(entry[1])
    }
  }
  form.delete("options");
  form.append("options", optArray.join());
  return form
}



async function postForm(e) {
  const form = proccessOptions(new FormData(document.getElementById("checksform")));
 

  const response = await fetch(API_URL,{
    method: "POST",
    headers: {
      Authorization: API_KEY,
    },
    body: form,
  });

  const data = await response.json();

  if (response.ok) {
    displayErrors(data);
  } else {
    throw new Error(data.error);
  }
}

async function getStatus(e) {
  //creamos una constante con la direccion url y la api key conunta
  const queryString = `${API_URL}?api_key=${API_KEY}`;
  //pedimos una respuesta el servidor y la guardamos en una constante
  const response = await fetch(queryString);
  //pasamos los datos de la respuesta a JSON y los guardamos en otra constante que contiene los datos
  const data = await response.json();
  // si la respuesta es TRUE  los mostramos por consola
  if (response.ok) {
    displayData(data);
  } else {
    throw new Error(data.error);
  }
}

function displayData(data) {
  let heading = "APY key status:";
  let result = `<div>Your key is valid until:</div>`;
  result += `<div class="key-status">${data.expiry}</div>`;
  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = result;

  resultsModel.show();
}

function displayErrors(data) {
  let heading = `JSHint Results for : ${data.file}`;

  if (data.total_errors === 0) {
    results = `<div class="no_errors">No errors reported!!</div>`;
  } else {
    results = `<div class="errors">Total errors:<span class="error_count">${data.total_errors}</span></div>`;
    for (let error of data.error_list) {
      results += `<div>At line <span class="line">${error.line}</span>,`;
      results += `column <span class="column">${error.col}</span></div>`;
      results += `<div class="error">${error.error}</div>`;
    }

  }
  document.getElementById("resultsModalTitle").innerText = heading;
  document.getElementById("results-content").innerHTML = results;
  resultsModel.show();
}
