// Fichier : calendrier.js (Version corrigée et fonctionnelle)

console.log("Script Calendrier AD Émaux chargé.");

document.addEventListener('DOMContentLoaded', () => {
    const doors = document.querySelectorAll('.door');
    
    // -------------------------------------------------------------------------------------------------------
    // 🟢 MODE TEST ACTIF : Mettre 25 pour tout ouvrir.
    const currentDay = 25; 
    // POUR LA MISE EN PRODUCTION (Décembre), REMPLACEZ 25 PAR :
    // const currentDay = new Date().getDate();
    // -------------------------------------------------------------------------------------------------------

    // Initialisation : Vérifie l'état des portes (soumises ou verrouillées)
    doors.forEach(door => {
        const day = parseInt(door.dataset.day);
        
        // 1. GESTION DU VERROUILLAGE/DEVERROUILLAGE
        if (day > currentDay) {
             door.classList.add('locked');
        }

        // 2. GESTION DES SOUMISSIONS
        if (localStorage.getItem(`door_${day}_submitted`) === 'true') {
            door.classList.add('submitted');
            
            // Récupère l'image pour l'afficher au verso
            const data = qcmData.find(d => d.day === day);
            if (data) {
                const doorBack = door.querySelector('.door-back');
                doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${day}" style="width:100%; height:100%; object-fit:cover;">`;
            }
            
            // Texte "Répondu" réduit
            door.querySelector('.door-front').innerHTML = '✅ Répondu';
            door.style.pointerEvents = 'none'; 
        }
    });

    // FONCTION DE CLIC PRINCIPALE
    const doorClickHandler = function(e) {
        const doorElement = e.currentTarget; 
        const day = parseInt(doorElement.dataset.day);

        // Sécurité : ne rien faire si verrouillé ou déjà soumis
        if (doorElement.classList.contains('locked') || doorElement.classList.contains('submitted')) {
            return;
        }

        // Si c'est le jour 25 (Cadeau / Message final)
        if (day === 25) {
            alert("Joyeux Noël ! Le tirage au sort aura lieu bientôt.");
            return;
        }

        // Récupération des données depuis qcm_data.js
        const data = qcmData.find(d => d.day === day);

        if (data) {
            openPopupWithData(data); // Appel de la fonction qui construit le contenu
        } else {
            console.error("Aucune donnée trouvée pour le jour " + day);
        }
    };

    // Ajout des écouteurs
    doors.forEach(door => {
        door.addEventListener('click', doorClickHandler);
    });


    // FONCTION : Construire et ouvrir la Pop-up
    function openPopupWithData(data) {
        const popupContent = document.getElementById('popup-quiz-content');
        const overlay = document.getElementById('door-overlay');

        // Génération des boutons radio HTML
        let optionsHTML = '';
        data.options.forEach((opt) => {
            // Utilisation du 'day' dans le nom du radio pour garantir l'unicité
            optionsHTML += `
                <label>
                    <input type="radio" name="reponse_jour_${data.day}" value="${opt.value}" required>
                    ${opt.text}
                </label>
            `;
        });

        // Injection du HTML dynamique (avec l'image, la question et le formulaire)
        popupContent.innerHTML = `
            <img src="${data.image}" alt="Image jour ${data.day}">
            <h4>${data.title} (Jour ${data.day})</h4>
            <p style="font-weight:bold; margin-bottom:15px;">${data.question}</p>
            
            <form id="current-quiz-form" class="quiz-form" data-day="${data.day}">
                <div class="quiz-options">
                    ${optionsHTML}
                </div>
                
                <input type="text" name="hp_field" class="honeypot" tabindex="-1" autocomplete="off">
                <input type="email" name="email" placeholder="Votre e-mail (obligatoire)" required>
                
                <div class="rgpd-checkbox-container">
                    <input type="checkbox" id="rgpd_check" name="rgpd_consent" value="true" required>
                    <label for="rgpd_check">J'accepte d'être recontacté(e) et de recevoir la newsletter.</label>
                </div>

                <button type="submit" class="btn-submit">Je valide et participe</button>
                <small>Réponse correcte = 1 chance de gagner.</small>
            </form>
        `;

        // Afficher la pop-up
        overlay.classList.add('active');

        // Gérer la soumission du formulaire généré
        const form = document.getElementById('current-quiz-form');
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(e, data); // Appel de la fonction de soumission
        });
    }

    // FONCTION : Traitement du formulaire (Mis à jour pour afficher l'image)
    function handleFormSubmit(e, data) {
        const form = e.target;
        const email = form.querySelector('input[name="email"]').value;
        const selectedOption = form.querySelector(`input[name="reponse_jour_${data.day}"]:checked`);
        const rgpd = form.querySelector('input[name="rgpd_consent"]').checked;

        if (!selectedOption) {
            alert("Veuillez sélectionner une réponse.");
            return;
        }

        const userResponse = selectedOption.value;
        const isCorrect = (userResponse === data.correctAnswer);

        // --- SIMULATION D'ENVOI AU BACKEND ---
        console.log(`Jour ${data.day} | Email: ${email} | Réponse: ${userResponse} (Correct: ${isCorrect}) | RGPD: ${rgpd}`);

        // Sauvegarde locale et mise à jour visuelle
        localStorage.setItem(`door_${data.day}_submitted`, 'true');
        const door = document.getElementById(`day-${data.day}`);
        if (door) {
            door.classList.add('submitted');
            
            // 1. Mise à jour du recto (texte "Répondu" réduit)
            door.querySelector('.door-front').innerHTML = '✅ Répondu'; 
            
            // 2. Ajout de l'image au verso pour qu'elle s'affiche
            const doorBack = door.querySelector('.door-back');
            doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${data.day}" style="width:100%; height:100%; object-fit:cover;">`;
            
            door.style.pointerEvents = 'none'; 
        }

        // Fermer la pop-up
        window.closePopup();

        // Feedback utilisateur
        if (isCorrect) {
            alert("Bonne réponse ! Votre participation est enregistrée.");
        } else {
            alert("Participation enregistrée. Tentez votre chance demain !");
        }
    }


    // FONCTIONS GLOBALES (Pour les boutons fermer / reset)
    window.closePopup = function() {
        document.getElementById('door-overlay').classList.remove('active');
    };

    window.closePopupIfClickedOutside = function(e) {
        if (e.target.id === 'door-overlay') {
            window.closePopup();
        }
    };

    window.openReglement = function() {
        document.getElementById('reglement-overlay').classList.add('active');
    };

    window.closeReglement = function() {
        document.getElementById('reglement-overlay').classList.remove('active');
    };

    window.resetCalendar = function() {
        if (confirm("Réinitialiser tout le calendrier ?")) {
            localStorage.clear();
            location.reload();
        }
    };
});