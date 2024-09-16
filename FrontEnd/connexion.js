//Récupère l'élément du DOM qui accueille le formulaire de connexion
const form = document.getElementById("connexion");

//Fonction qui appelle l'API et qui vérifie les identifiants de connexion
function verifyLogin (username, password) {
    const data = {"email": username, "password": password};

    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.token){
            //Redirige vers la page d'accueil si la combinaison utilisateur/mdp est correcte et ajoute le token d'authentification au Local Storage
            window.location.href = "index.html";
            window.localStorage.setItem("token", data.token);
        }else {
            //Affiche un message d'erreur si la combinaison utilisateur/mdp est fausse
            alert("Erreur dans l'identifiant ou le mot de passe");
        }
    })
    .catch(error => console.error('Error:', error));
};

//Récupère la valeur entrée par l'utilisateur et appelle la fonction verifyLogin à l'envoi du formulaire
form.addEventListener("submit", (event) =>{
    event.preventDefault();
    const username = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    verifyLogin(username, password);
    
});
