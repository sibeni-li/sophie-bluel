//Récupération des données de l'API
const response = await fetch("http://localhost:5678/api/works/");
const works = await response.json();

const respbis = await fetch("http://localhost:5678/api/categories/");
const categories = await respbis.json();

//Récupération du token dans le Local Storage
const token = window.localStorage.getItem("token");

//Si le token est présent, mise à jour du html pour passer en mode édition. Si non, création des filtres
if(token){

    const body = document.querySelector("body");
    const header = document.querySelector("header");
    const div = document.createElement("div");
    div.setAttribute("class", "editMode");
    const icon = document.createElement("i");
    icon.setAttribute("class", "fa-regular fa-pen-to-square");
    const p = document.createElement("p");
    p.innerText = "Mode édition";
    body.appendChild(div);
    div.appendChild(icon);
    div.appendChild(p);
    header.before(div);
    
    const navEdit = document.querySelector("nav .login");
    navEdit.style.display = "none";
    const logout = document.createElement("li");
    const logOut = document.createElement("a");
    logOut.setAttribute("href", "index.html");
    logOut.innerText = "logout";
    const nav = document.querySelector("nav ul");
    const insta = document.querySelector(".insta");
    nav.appendChild(logout);
    logout.appendChild(logOut);
    insta.before(logout);

    logout.addEventListener("click", () =>{
        window.localStorage.removeItem("token");
    });

    const portfolio = document.querySelector("#portfolio h2");
    const span = document.createElement("span");
    const a = document.createElement("a");
    a.setAttribute("href", "#modal");
    a.setAttribute("class", "js-modal");
    a.innerText = "modifier";
    const iconn = document.createElement("i");
    iconn.setAttribute("class", "fa-regular fa-pen-to-square");
    portfolio.appendChild(span);
    span.appendChild(iconn);
    span.appendChild(a);
    
} else {
    
    //Fonction qui crée les boutons "filtres" et qui active l'écouteur d'évènement
    function createFilterButton(value, isAll) {
        const filterI = document.createElement("input");
        filterI.setAttribute("type", "button");
        filterI.setAttribute("value", value);
        filterI.classList.add("noClick");
        
        if (isAll) {
            filterI.addEventListener("click", () => {
                document.querySelector(".gallery").innerHTML = "";
                generWorks(works);
                filterClass(filterI);
            });
        } else {
            const id = categories.find((cat) => cat.name === value).id;
            filterI.addEventListener("click", () => {
                const filterCategory = works.filter((work) => work.categoryId === id);
                document.querySelector(".gallery").innerHTML = "";
                generWorks(filterCategory);
                filterClass(filterI);
            });
        };
        
        return filterI;
    };
    
    //Fonction qui ajoute la classe .click et enlève la classe .noClick sur le filtre sélectionné et inversément sur les filtres non sélectionnés
    function filterClass(filterElement) {
        const allFilters = document.querySelectorAll(".filter input");
        allFilters.forEach((filter) => {
            filter.classList.remove("click");
            filter.classList.add("noClick");
        });
        
        filterElement.classList.remove("noClick");
        filterElement.classList.add("click");
    };
    
    //Fonction qui crée les filtres
    function createFilters(categories) {
        const filters = document.querySelector(".filter");
        const filterAll = createFilterButton("Tous", true);
        filters.appendChild(filterAll);
        
        categories.forEach((input) => {
            const filter = createFilterButton(input.name, false);
            filters.appendChild(filter);
        });
    };
    
    createFilters(categories);
    
};

//Fonction qui va générer les travaux
function generWorks(works) {
    works.forEach((figure) => {
        //Récupère l'élément du DOM qui va accueillir les travaux de l'architecte
        const divGallery = document.querySelector(".gallery");
        //Crée une balise dédiée à un des travaux
        const worksElement = document.createElement("figure");
        worksElement.setAttribute("data-id", figure.id)
        
        const imageElement = document.createElement("img");
        imageElement.src = figure.imageUrl;
        imageElement.alt = figure.title;
        
        const titleElement = document.createElement("figcaption");
        titleElement.innerText = figure.title;
        //Rattache la balise figure à la div .gallery
        divGallery.appendChild(worksElement);
        //Rattache l'image et le titre à la balise figure
        worksElement.appendChild(imageElement);
        worksElement.appendChild(titleElement);
    });
};

generWorks(works);

// Fonction qui génère les images de la modale qui permettent de supprimer des travaux
function generImg(works) {
    works.forEach((image) =>{
        const divImages = document.querySelector(".images");
    
        const workImg = document.createElement("div");
        workImg.setAttribute("class", "work-img");
        workImg.setAttribute('data-id', image.id);


        const deleteWork = document.createElement("div");
        deleteWork.setAttribute("class", "delete-work");

        const trash = document.createElement("i");
        trash.setAttribute("class", "fa-solid fa-trash-can");

        const workImgElement = document.createElement("img");
        workImgElement.src = image.imageUrl;
        workImgElement.alt = image.title;

        divImages.appendChild(workImg);
        workImg.appendChild(deleteWork);
        workImg.appendChild(workImgElement);
        deleteWork.appendChild(trash);
    });
};

generImg(works);

// Fonction qui génère les différentes options de catégories dans la partie "Ajouter photo" de la modale
function generModalCategory(categories){

    const selectCategory = document.querySelector(".category");

    const nameEmpty = document.createElement("option");
    selectCategory.appendChild(nameEmpty);

    categories.forEach((categ) => {
        const nameCategory = document.createElement("option");
        nameCategory.innerText = categ.name;
        nameCategory.setAttribute("value", categ.id);

        selectCategory.appendChild(nameCategory);
    });
};

generModalCategory(categories);

let modal = null;
const modal1 = document.querySelector("#modal1");
const modal2 = document.querySelector("#modal2");
const focusableSelector= "button, a, input, textarea";
let focusables =[];
let previouslyFocusElement = null;

// Fonction qui gère l'ouverture de la modale et son comportement une fois celle-ci ouverte
const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal");
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusElement = document.querySelector(":focus");
    modal.style.display = null;
    focusables[0].focus();
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
};

// Fonction qui gère la fermeture de la modale
const closeModal = function (e) {
    if (modal === null) return;
    if (previouslyFocusElement !== null) {
        previouslyFocusElement.focus();
    }
    e.preventDefault();
    modal.style.display = "none";
    modal2.style.display = "none";
    modal1.style.display = "flex";
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    
};

// Fonction qui stoppe la propagation des évènements afin que ceux-ci ne sétendent pas en dehors de la modale
const stopPropagation = function (e) {
    e.stopPropagation();
};

// Fonction qui gère le déplacement du focus dans la modale avec shift
const focusInModal = function (e){
    e.preventDefault();
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"));
    if (e.shiftKey === true){
        index --;
    }else{
        index ++;
    };
    if (index >= focusables.length) {
        index = 0;
    };
    if (index < 0){
        index = focusables.length -1;
    };
    focusables[index].focus();
};

document.querySelectorAll(".js-modal").forEach(link => {
    link.addEventListener("click", openModal);
});

document.querySelectorAll(".js-close-modal").forEach(button => {
    button.addEventListener("click", closeModal);
});

document.querySelectorAll(".js-modal2").forEach(button => {
    button.addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "flex";
    });
});

document.querySelectorAll(".js-show-vue-1").forEach(button => {
    button.addEventListener("click", () => {
        modal1.style.display = "flex";
        modal2.style.display = "none";
    });
});

window.addEventListener("click", function (event) {
    if (event.target === document.querySelector(".modal")) {
        closeModal(event);
    };
});

window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e);
    };
    if (e.key === "Tab" && modal !== null){
        focusInModal(e);
    };
});

// Fonction qui appelle l'API et qui génère les travaux et les images de la modale
async function respReload() {
    const responseReload = await fetch("http://localhost:5678/api/works/");
    const workReload = await responseReload.json();

    generWorks(workReload);
    generImg(workReload);
    deleteWorks();
};

// Fonction qui va supprimer le projet au click sur la poubelle associée
function deleteWorks(){
    const deleteElement = document.querySelectorAll(".fa-trash-can");
    deleteElement.forEach(element => {
        element.addEventListener("click", async function (e) {
            e.preventDefault();
            const workId = this.closest(".work-img").dataset.id;
            fetch("http://localhost:5678/api/works/" + workId, {
                method: "DELETE",
                headers: {
                    "accept": "*/*",
                    "Authorization": "Bearer " + token
                }
            })
            .then(respDelete => {
                if(respDelete.ok) {
                    // Mise à jour dynamique du DOM
                    document.querySelector(".images").innerHTML = "";
                    document.querySelector(".gallery").innerHTML = "";
                    respReload();
                } else {
                    alert("Une erreur s'est produite lors de la suppression du projet.");
                };
            })
            .catch(error => console.error("Erreur lors de la suppression :", error));
        });
    });
};

deleteWorks();

const form = document.querySelector(".add-work");
// Ecouteur d'évènement qui va créer un objet formData et l'envoyer en BD via l'API si l'objet est correctement envoyé
form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const formData = new FormData(form);

    try{
        const fetchAdd = await fetch("http://localhost:5678/api/works/", {
            method: "POST",
            headers: {
                "accept" : "application/json",
                "Authorization" : "Bearer " + token 
            },
            body: formData
        });
        if(fetchAdd.ok) {
            closeModal(e);
            document.querySelector(".images").innerHTML = "";
            document.querySelector(".gallery").innerHTML = "";
            respReload();
            
        }else{
            alert("Une erreur s'est produite lors de l'ajout du nouveau projet.");
        };  
    }
    catch
    {error => console.error("Erreur lors de l'ajout :", error)};
    
    document.querySelector(".file").files = undefined;
    document.getElementById("validation").setAttribute("disabled", "true");
    preview.setAttribute("hidden", "true");
    inputFile.removeAttribute("hidden");
    label.removeAttribute("hidden");
    iconImage.style.display = "block";
    p.removeAttribute("hidden");
    form.reset();
});

// Activation ou désactivation du bouton valider en fonction de la valeur du champs titre
function buttonValidateOn(){
    if(document.querySelector(".title").value !== "" && document.querySelector(".file").files[0] !== undefined){
        document.getElementById("validation").removeAttribute("disabled");
    }else{
        document.getElementById("validation").setAttribute("disabled", "true");
    };
};

form.addEventListener("keydown", (e) =>{
    buttonValidateOn();
});

form.addEventListener("click", (e) =>{
    buttonValidateOn();
});

const inputFile = document.getElementById('file-input');
const label = document.querySelector(".files");
const iconImage = document.querySelector(".p i");
const p = document.querySelector(".p p");
const preview = document.getElementById('file-preview');

// Fonction qui va afficher la preview de la photo avant l'envoie via l'API
const previewPhoto = () => {
    const file = inputFile.files;
    if (file && document.getElementById('file-preview').src !== "#") {
        const fileReader = new FileReader();
        fileReader.onload = function (event) {
            preview.setAttribute('src', event.target.result);
        };
        fileReader.readAsDataURL(file[0]);
        preview.removeAttribute("hidden");
        inputFile.setAttribute("hidden", "true");
        label.setAttribute("hidden", "true");
        iconImage.style.display = "none";
        p.setAttribute("hidden", "true");
    };
};
inputFile.addEventListener("change", previewPhoto);