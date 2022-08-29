const inputSearch = document.querySelector("input");
const inputContainer = document.querySelector(".dropdown-container");
const chosens = document.querySelector(".chosens");

function removeRepositories() {
  inputContainer.innerHTML = "";
}

function showRepositories(repositories) {
  removeRepositories();
  for (let repositoryIndex = 0; repositoryIndex < 5; repositoryIndex++) {
    let name = repositories.items[repositoryIndex].name;
    let owner = repositories.items[repositoryIndex].owner.login;
    let stars = repositories.items[repositoryIndex].stargazers_count;
    let dropdownContent = `<div class="dropdown-content" data-owner="${owner}" data-stars="${stars}">${name}</div>`;
    inputContainer.innerHTML += dropdownContent;
  }
}

function addChosen(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;
  chosens.innerHTML += `<div class="chosen">Name: ${name}<br>Owner: ${owner}<br>Stars: ${stars}<button class="btn-close"></button></div>`;
}

async function findRepositories() {
  const urlSearchRepositories = new URL(
    "https://api.github.com/search/repositories"
  );
  let repositoriesPart = inputSearch.value;
  if (repositoriesPart == "") {
    removeRepositories();
    return;
  }

  urlSearchRepositories.searchParams.append("q", repositoriesPart);
  try {
    let response = await fetch(urlSearchRepositories);
    if (response.ok) {
      let repositories = await response.json();
      showRepositories(repositories);
    } else return null;
  } catch (error) {
    return null;
  }
}

const debounce = (fn, debounceTime) => {
  let timeout;
  return function () {
    const func = () => {
      fn.apply(this, arguments);
    };
    clearTimeout(timeout);
    timeout = setTimeout(func, debounceTime);
  };
};

chosens.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("btn-close")) return;

  target.parentElement.remove();
});

inputContainer.addEventListener("click", function (event) {
  let target = event.target;
  if (!target.classList.contains("dropdown-content")) {
    return;
  }
  addChosen(target);
  inputSearch.value = "";
  removeRepositories();
});

inputSearch.addEventListener("input", debounce(findRepositories, 1000));
