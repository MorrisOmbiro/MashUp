var most_resent_search = Date.now();

const base_url = "https://wingx038.crabdance.com/";

var search_suggestions = [];

async function get_suggestions(query) {
  let url_query = query.split(' ').join('+');
  let results = [];
  try {
    let req = await fetch(base_url + "search?query=" + url_query);
    let sug_json = await req.json();
    results = sug_json.results;
  } catch (err) {
    return [];
  }

  return results;
}

async function get_body_txt(name) {
  let url_query = name.split(' ').join('+');
  let ret = "";

  try {
    let req = await fetch(base_url + "body?query=" + url_query);
    ret = await req.json();
    ret = ret.about;
  } catch (err) {
    console.log(err);
  }

  return ret;
}

function render_suggestions() {
  let container = document.getElementById("meme_suggestions");
  if (search_suggestions.length > 0) {
    show_suggestions();
  } else {
    hide_suggestions();
  }

  container.innerHTML = '';

  for (let s of search_suggestions) {
    let div = document.createElement("div");

    let img = document.createElement("img");
    img.setAttribute("src", s.icon_url);
    div.appendChild(img);

    let text = document.createTextNode(s.name);
    let span = document.createElement("span");
    span.appendChild(text);
    div.appendChild(span);
    div.addEventListener("click", function(e) {
      render_body(s.name, s.icon_url);
    });
    container.appendChild(div);
  }
}

async function render_body(name, img_link) {
  let e = document.getElementById('meme_results');
  e.innerHTML = '';

  let h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode(`Loading data for ${name}...`));
  e.appendChild(h2);
  hide_suggestions();

  let meme_body = await get_body_txt(name);

  e.innerHTML = '';
  h2 = document.createElement('h2');
  h2.appendChild(document.createTextNode(name));
  
  let p = document.createElement('p');
  let t = document.createTextNode(meme_body);
  p.appendChild(t);

  let img = document.createElement('img');
  img.setAttribute('src', img_link);

  e.appendChild(h2);
  e.appendChild(img);
  e.appendChild(p);
}

function show_suggestions() {
  let e = document.getElementById("meme_suggestions");
  e.style.display = "block";
}

function hide_suggestions() {
  let e = document.getElementById("meme_suggestions");
  e.style.display = "none";
}

async function update_suggestions(search_txt) {
  let sug = await get_suggestions(search_txt);
  let t = Date.now();
  if (most_resent_search > t) { // Make sure we are the most recent search results
    return; // otherwise, we are done;
  }

  most_resent_search = t; // Any calls to this fn that finish their await after us cancel

  // Render those new suggestions out
  search_suggestions = sug;
  render_suggestions();
  return;
}

render_suggestions();

document.getElementById("meme_search").addEventListener("input", function (e) {
  update_suggestions(e.target.value);
});
document.getElementById("meme_search").value = "";
