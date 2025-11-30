// ------------------------------------------------------------------------------------------------------
// ⚠️ IMPORTANT : REMPLACEZ CETTE CHAÎNE PAR L'URL DE DÉPLOIEMENT DE VOTRE APPS SCRIPT (Web App URL)
// ------------------------------------------------------------------------------------------------------
const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWrdi9dEkmfFFgSnLRYuJpEgM-oTB3Zq3Z6WVrrvV3MgSUo-qtZXpN976-A4iAOcBs/exec'; 

console.log("Script Calendrier AD Émaux chargé.");

// -------------------------------------------------------------------------------------------------------
// NOUVELLE FONCTION : Envoi de données vers Google Apps Script (avec consentement RGPD)
// -------------------------------------------------------------------------------------------------------
async function submitToGSheet(dayNumber, userEmail, userResponse, isCorrect, rgpdConsent) {
    const formData = new FormData();
    formData.append('dayNumber', dayNumber);
    formData.append('userEmail', userEmail);
    formData.append('userAnswer', userResponse);
    formData.append('correct', isCorrect ? 'Oui' : 'Non');
    formData.append('rgpd_consent', rgpdConsent ? 'Oui' : 'Non'); // 🟢 AJOUT DU CONSENTEMENT

    try {
        const response = await fetch(APP_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Essentiel pour contourner les restrictions CORS
            body: formData
        });

        // Comme nous utilisons 'no-cors', on ne peut pas vérifier response.ok. 
        // Si le fetch réussit sans erreur réseau, on considère l'envoi réussi.
        return { success: true };

    } catch (error) {
        console.error("Erreur lors de l'envoi des données à Google Sheets :", error);
        return { success: false, error: error.message };
    }
}


// FONCTION : Traitement du formulaire
async function handleFormSubmit(e, data) {
    e.preventDefault();
    const form = e.target;
    const email = form.querySelector('input[name="email"]').value;
    // Récupération correcte de la réponse radio
    const selectedOption = form.querySelector(`input[name="reponse_jour_${data.day}"]:checked`);
    const rgpd = form.querySelector('input[name="rgpd_consent"]').checked;

    if (!selectedOption) {
        alert("Veuillez sélectionner une réponse.");
        return;
    }
    
    // Honeypot check
    const hp = form.querySelector('input[name="hp_field"]').value;
    if (hp) {
        console.warn("Honeypot activé. Soumission ignorée.");
        return; // Ignorer la soumission silencieusement si le champ honeypot est rempli
    }


    const userResponse = selectedOption.value;
    const isCorrect = (userResponse === data.correctAnswer);

    // --- GESTION DE L'ATTENTE ---
    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    // --- APPEL DE LA FONCTION D'ENVOI AU GSHEET ---
    const submissionResult = await submitToGSheet(data.day, email, userResponse, isCorrect, rgpd); // 🟢 ENVOI RGPD
    
    // Rétablir le bouton
    submitBtn.disabled = false;
    submitBtn.textContent = 'Je valide et participe';


    if (!submissionResult.success) {
        alert("Une erreur de connexion est survenue. Votre participation n'a peut-être pas été enregistrée. Veuillez réessayer.");
        return; 
    }

    // --- SUCCÈS : GESTION LOCALE ET VISUELLE ---

    // Sauvegarde locale et mise à jour visuelle
    localStorage.setItem(`door_${data.day}_submitted`, 'true');
    const door = document.getElementById(`day-${data.day}`);
    if (door) {
        door.classList.add('submitted');
        
        // 1. Mise à jour du recto (image en aperçu et texte discret)
        const doorFront = door.querySelector('.door-front');
        doorFront.innerHTML = `
            <div class="submitted-content">
                <img src="${data.image}" alt="Aperçu jour ${data.day}" class="submitted-preview-img">
                <small>✅ Répondu</small>
            </div>
        `;
        
        // 2. Ajout de l'image au verso pour qu'elle s'affiche (pour le flip, si actif)
        const doorBack = door.querySelector('.door-back');
        doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${data.day}" style="width:100%; height:100%; object-fit:cover;">`;
        
        // ❌ Retrait de la ligne problématique (on utilise la classe .submitted)
        // door.style.pointerEvents = 'none'; 
    }

    // --- NOUVEAU CODE POUR L'AFFICHAGE DU MESSAGE (Remplacement des alertes) ---
    
    // 1. Trouver la réponse correcte textuelle
    const correctAnswerValue = data.correctAnswer;
    // data.options contient le tableau des options, data.correctAnswer contient 'A', 'B' ou 'C'.
    const correctOption = data.options.find(opt => opt.value === correctAnswerValue);
    // Récupère le texte de l'option (ex: "C. La puissance et le mouvement d'une vague")
    const correctAnswerText = correctOption ? correctOption.text : 'Réponse non trouvée'; 

    const mainPopupContent = document.getElementById('popup-quiz-content');
    let messageContent = '';

    if (isCorrect) {
        messageContent = `
            <h4 style="color: green;">🎉 Bravo ! Bonne Réponse !</h4>
            <p>Votre participation est enregistrée.</p>
            <p style="font-size: 0.9em; margin-top: 20px;">Rendez-vous demain pour une nouvelle question !</p>
        `;
    } else {
        messageContent = `
            <h4 style="color: var(--primary-marine);">Dommage !</h4>
            <p>La bonne réponse était : <strong>${correctAnswerText}</strong></p>
            <p>Votre participation est enregistrée. Tentez à nouveau votre chance demain !</p>
        `;
    }

    // Remplacer le contenu du quiz par le message de confirmation
    mainPopupContent.innerHTML = `
        <a href="#" class="close-btn" onclick="closePopup()" style="position: absolute; top: 15px; right: 25px;">&times;</a>
        <div style="padding: 40px; text-align: center;">
            ${messageContent}
            <button onclick="closePopup()" class="cta-button" style="margin-top: 30px;">Fermer</button>
        </div>
    `;

    // Suppression de l'ancienne logique de fermeture et d'alertes
} // Fin de handleFormSubmit


// FONCTION : Construire et ouvrir la Pop-up
function openPopupWithData(data) {
    const popupContent = document.getElementById('popup-quiz-content');
    const overlay = document.getElementById('door-overlay');

    // --- NOUVEAU BLOC : GESTION SPÉCIFIQUE DU JOUR 25 (MESSAGE DE NOËL ET TIRAGE) ---
    if (data.day === 25) {
        
        popupContent.innerHTML = `
            <a href="#" class="close-btn" onclick="closePopup()">&times;</a>
            <div class="winner-announcement" style="text-align: center; padding: 40px;">
                <h2 style="color: var(--accent-gold); font-family: 'Playfair Display', serif; font-size: 2.5em; margin-bottom: 0;">Joyeux Noël ! 🎉</h2>
                <h1 style="color: var(--primary-marine); font-family: 'Playfair Display', serif; font-size: 3em; margin-top: 5px; margin-bottom: 30px;">Jour du Grand Tirage au Sort</h1>
                
                <p style="font-size: 1.2em; margin-bottom: 20px; font-weight: bold;">
                    Merci à tous d'avoir participé à notre Calendrier de l'Avent !
                </p>
                
                <div style="padding: 20px; background-color: var(--light-bg); border: 2px solid var(--accent-gold); border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <p style="font-size: 1.2em; margin: 5px 0;">Le tirage au sort aura lieu ce **25 décembre**.</p>
                    <p style="font-size: 1.2em; margin: 5px 0; font-weight: 700; color: var(--primary-marine);">Le gagnant sera contacté personnellement par e-mail début janvier !</p>
                </div>
                
                <p style="margin-top: 30px; font-style: italic; font-size: 0.9em;">Bonnes fêtes de fin d'année à tous.</p>
                
                <button onclick="closePopup()" class="cta-button" style="margin-top: 30px;">Fermer</button>
            </div>
        `;
        // Afficher la pop-up et sortir de la fonction
        overlay.classList.add('active');
        return; 
    }
    // Fin de la gestion Jour 25
    
    // Génération des boutons radio HTML
    let optionsHTML = '';
    data.options.forEach((opt) => {
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

            // calendrier.js (Nouveau code de remplacement)

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
    // Ajout de l'écouteur ASYNCHRONE et passage des données QCM
    form.addEventListener('submit', async function(e) {
        await handleFormSubmit(e, data); 
    });
}


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

    // Récupération des données depuis qcm_data.js (doit être globalement accessible)
    // ⚠️ qcmData est supposé être défini dans qcm_data.js et accessible ici.
    const data = qcmData.find(d => d.day === day); 

    if (data) {
        openPopupWithData(data); // Appel de la fonction qui construit le contenu
    } else {
        console.error("Aucune donnée trouvée pour le jour " + day + ". Veuillez vérifier qcm_data.js.");
    }
};


document.addEventListener('DOMContentLoaded', () => {
    const doors = document.querySelectorAll('.door');
    
    // -------------------------------------------------------------------------------------------------------
    // 🟢 MODE TEST ACTIF : Mettre 25 pour tout ouvrir.
    // POUR LA MISE EN PRODUCTION (Décembre), REMPLACEZ 25 PAR :
    const currentDay = 25; // new Date().getDate(); 
    // -------------------------------------------------------------------------------------------------------

    // Initialisation : Vérifie l'état des portes (soumises ou verrouillées)
    doors.forEach(door => {
        const day = parseInt(door.dataset.day);
        
        // 1. GESTION DU VERROUILLAGE/DEVERROUILLAGE
        if (day > currentDay) {
             door.classList.add('locked');
        } else {
             door.classList.add('unlocked'); // Ajout pour le style si nécessaire
        }

        // 2. GESTION DES SOUMISSIONS
        if (localStorage.getItem(`door_${day}_submitted`) === 'true') {
            door.classList.add('submitted');
            
            // Récupère l'image pour l'afficher sur le recto
            const data = qcmData.find(d => d.day === day);
            if (data) {
                // Mise à jour du recto (Image d'aperçu et texte)
                const doorFront = door.querySelector('.door-front');
                doorFront.innerHTML = `
                    <div class="submitted-content">
                        <img src="${data.image}" alt="Aperçu jour ${day}" class="submitted-preview-img">
                        <small>✅ Répondu</small>
                    </div>
                `;
                // Ajout de l'image au verso pour le cas où l'animation flip était prévue
                const doorBack = door.querySelector('.door-back');
                doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${day}" style="width:100%; height:100%; object-fit:cover;">`;
            }
            // ❌ door.style.pointerEvents = 'none'; est géré par la classe .submitted via le CSS et le return dans doorClickHandler.
        }

        // 3. Ajout des écouteurs de clic
        door.addEventListener('click', doorClickHandler);
    });

    // FONCTIONS GLOBALES (Pour les boutons fermer / reset)
    window.closePopup = function() {
        document.getElementById('door-overlay').classList.remove('active');
    };

    window.closePopupIfClickedOutside = function(e) {
        if (e.target.id === 'door-overlay') {
            window.closePopup();
        }
    };
    
    // Fonctionnalité Règlement (déjà dans index.html)
    window.openReglement = function() {
        document.getElementById('reglement-overlay').classList.add('active');
    };

    window.closeReglement = function() {
        document.getElementById('reglement-overlay').classList.remove('active');
    };

    window.resetCalendar = function() {
        if (confirm("Attention : Réinitialiser tout le calendrier ? Cette action ne supprime pas les entrées déjà enregistrées dans le Google Sheet.")) {
            localStorage.clear();
            location.reload();
        }
    };
    
// Fonctionnalité Pop-up d'Information RGPD
    window.openGdprInfo = function() {
        document.getElementById('gdpr-info-overlay').classList.add('active');
    };

    // Fonction appelée par le bouton "J'ai compris"
    window.acceptGdprInfo = function() {
        // Enregistrer l'acceptation (pour ne pas rouvrir si on garde le localStorage)
        localStorage.setItem('hasAcceptedGdprInfo', 'true'); 
        // Fermer la modale
        document.getElementById('gdpr-info-overlay').classList.remove('active');
    };
