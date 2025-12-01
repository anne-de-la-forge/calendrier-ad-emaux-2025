// ═══════════════════════════════════════════════════════════════════════════════
// CALENDRIER DE L'AVENT AD ÉMAUX - OPTION B : SEUL LE JOUR ACTUEL ACCESSIBLE
// ═══════════════════════════════════════════════════════════════════════════════
// Comportement : Si un jour n'est pas répondu, il devient INACCESSIBLE
// ═══════════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════════
// ⚙️ MODE TEST - ACTIVATION/DÉSACTIVATION
// ═══════════════════════════════════════════════════════════════════════════════
const TEST_MODE = false; // ⚠️ Mettre à false pour le lancement !
const TEST_DATE = "2025-12-12";

const APP_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxWrdi9dEkmfFFgSnLRYuJpEgM-oTB3Zq3Z6WVrrvV3MgSUo-qtZXpN976-A4iAOcBs/exec'; 

console.log("🎄 Calendrier de l'Avent AD Émaux chargé - Mode : Une chance par jour !");

// ═══════════════════════════════════════════════════════════════════════════════
// 📅 FONCTION DE GESTION DES DATES
// ═══════════════════════════════════════════════════════════════════════════════

function getCurrentDate() {
    if (TEST_DATE !== null) {
        console.log(`🧪 MODE TEST DATE : ${TEST_DATE}`);
        return new Date(TEST_DATE);
    }
    return new Date();
}

function getCurrentDay() {
    const now = getCurrentDate();
    const day = now.getDate();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    
    if (month === 12 && year === 2025) {
        return day;
    }
    else if (year > 2025 || (year === 2025 && month > 12)) {
        return 26;
    }
    else {
        return 0;
    }
}

// 🆕 NOUVELLE LOGIQUE : Une porte est accessible SEULEMENT si :
// 1. C'est le jour actuel ET elle n'a pas été répondue
// 2. OU elle a déjà été répondue (pour afficher l'image)
function isDoorUnlocked(doorDay) {
    if (TEST_MODE) {
        return true; // Mode test : toutes les portes ouvertes
    }
    
    const currentDay = getCurrentDay();
    const hasBeenSubmitted = localStorage.getItem(`door_${doorDay}_submitted`) === 'true';
    
    // Une porte est déverrouillée si :
    // - C'est le jour actuel (peu importe si répondue ou non)
    // - OU elle a déjà été répondue (pour afficher l'image)
    if (doorDay === currentDay) {
        return true; // Le jour actuel est toujours accessible
    }
    
    if (hasBeenSubmitted) {
        return true; // Les portes répondues restent visibles (pour afficher l'image)
    }
    
    // Tous les autres cas : verrouillée
    return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS DE TRAITEMENT (NE PAS TOUCHER - Ça marche déjà)
// ═══════════════════════════════════════════════════════════════════════════════

async function submitToGSheet(dayNumber, userEmail, userResponse, isCorrect, rgpdConsent) {
    const formData = new FormData();
    formData.append('dayNumber', dayNumber);
    formData.append('userEmail', userEmail);
    formData.append('userAnswer', userResponse);
    formData.append('correct', isCorrect ? 'Oui' : 'Non');
    formData.append('rgpd_consent', rgpdConsent ? 'Oui' : 'Non'); 

    try {
        await fetch(APP_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', 
            body: formData
        });
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de l'envoi des données à Google Sheets :", error);
        return { success: false, error: error.message };
    }
}

async function handleFormSubmit(e, data) {
    e.preventDefault();
    const form = e.target;
    
    const email = form.querySelector('input[name="email"]').value;
    const selectedOption = form.querySelector(`input[name="reponse_jour_${data.day}"]:checked`);
    const rgpd = form.querySelector('input[name="rgpd_consent"]').checked;
    
    if (!rgpd) {
        alert("Veuillez cocher la case pour accepter d'être recontacté(e) et recevoir la newsletter afin de valider votre participation.");
        return;
    }
    
    if (!selectedOption) {
        alert("Veuillez sélectionner une réponse pour valider votre participation.");
        return;
    }

    if (!email || email.trim() === '') {
        alert("Veuillez entrer une adresse e-mail.");
        return;
    }
    
    const hp = form.querySelector('input[name="hp_field"]').value;
    if (hp) {
        console.warn("Honeypot activé. Soumission ignorée.");
        return; 
    }

    const userResponse = selectedOption.value;
    const isCorrect = (userResponse === data.correctAnswer);

    const submitBtn = form.querySelector('.btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';

    const submissionResult = await submitToGSheet(data.day, email, userResponse, isCorrect, rgpd);
    
    submitBtn.disabled = false;
    submitBtn.textContent = 'Je valide et participe';

    if (!submissionResult.success) {
        alert("Une erreur de connexion est survenue. Votre participation n'a peut-être pas été enregistrée. Veuillez réessayer.");
        return; 
    }

    localStorage.setItem(`door_${data.day}_submitted`, 'true');
    const door = document.getElementById(`day-${data.day}`);
    if (door) {
        door.classList.add('submitted');
        
        const doorFront = door.querySelector('.door-front');
        doorFront.innerHTML = `
            <div class="submitted-content">
                <img src="${data.image}" alt="Aperçu jour ${data.day}" class="submitted-preview-img">
                <small>Répondu</small>
            </div>
        `;
        
        const doorBack = door.querySelector('.door-back');
        doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${data.day}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    const correctAnswerValue = data.correctAnswer;
    const correctOption = data.options.find(opt => opt.value === correctAnswerValue);
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

    mainPopupContent.innerHTML = `
        <a href="#" class="close-btn" onclick="closePopup()" style="position: absolute; top: 15px; right: 25px;">&times;</a>
        <div style="padding: 40px; text-align: center;">
            ${messageContent}
            <button onclick="closePopup()" class="cta-button" style="margin-top: 30px;">Fermer</button>
        </div>
    `;
}

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS DE POP-UP (NE PAS TOUCHER - Ça marche déjà)
// ═══════════════════════════════════════════════════════════════════════════════

function openPopupWithData(data) {
    const popupContent = document.getElementById('popup-quiz-content');
    const overlay = document.getElementById('door-overlay');

    if (data.day === 25) {
        popupContent.innerHTML = `
            <a href="#" class="close-btn" onclick="closePopup()">&times;</a>
            <div class="winner-announcement" style="text-align: center; padding: 40px;">
                <h2 style="color: var(--accent-gold); font-family: 'Playfair Display', serif; font-size: 2.5em; margin-bottom: 0;">Joyeux Noël ! ✨</h2>
                <h1 style="color: var(--primary-marine); font-family: 'Playfair Display', serif; font-size: 3em; margin-top: 5px; margin-bottom: 30px;">Jour du Grand Tirage au Sort</h1>
                
                <p style="font-size: 1.2em; margin-bottom: 20px; font-weight: bold;">
                    Merci à tous d'avoir participé à notre Calendrier de l'Avent
                </p>
                
                <div style="padding: 20px; background-color: var(--light-bg); border: 2px solid var(--accent-gold); border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
                    <p style="font-size: 1.2em; margin: 5px 0;">Le tirage au sort aura lieu ce 25 décembre.</p>
                    <p style="font-size: 1.2em; margin: 5px 0; font-weight: 700; color: var(--primary-marine);">Le gagnant sera contacté personnellement par e-mail début janvier !</p>
                </div>
                
                <p style="margin-top: 30px; font-style: italic; font-size: 0.9em;">Bonnes fêtes de fin d'année à tous.</p>
                
                <button onclick="closePopup()" class="cta-button" style="margin-top: 30px;">Fermer</button>
            </div>
        `;
        overlay.classList.add('active');
        return; 
    }
    
    let optionsHTML = '';
    data.options.forEach((opt) => {
        optionsHTML += `
            <label>
                <input type="radio" name="reponse_jour_${data.day}" value="${opt.value}" required>
                ${opt.text}
            </label>
        `;
    });

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
                <input type="checkbox" id="rgpd_check" name="rgpd_consent" value="true">
                <label for="rgpd_check">J'accepte d'être recontacté(e) et de recevoir la newsletter.</label>
            </div>

            <button type="submit" class="btn-submit">Je valide et participe</button>
            <small>Réponse correcte = 1 chance de gagner.</small>
        </form>
    `;

    overlay.classList.add('active');

    const form = document.getElementById('current-quiz-form');
    form.addEventListener('submit', async function(e) {
        await handleFormSubmit(e, data); 
    });
}

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTION DE CLIC - AVEC GESTION STRICTE DU VERROUILLAGE
// ═══════════════════════════════════════════════════════════════════════════════

window.handleDoorClick = function(day) {
    console.log(`🚪 Clic sur la porte ${day}`);
    
    const doorElement = document.getElementById(`day-${day}`);
    
    if (!doorElement) {
        console.error(`❌ Porte introuvable : day-${day}`);
        return;
    }
    
    if (doorElement.classList.contains('locked')) {
        console.log(`🔒 Porte ${day} verrouillée`);
        
        const currentDay = getCurrentDay();
        
        // Message différent selon si c'est un jour futur ou passé
        if (day > currentDay) {
            alert(`Cette porte s'ouvrira le ${day} décembre ! 🎄`);
        } else {
            alert(`Cette porte du ${day} décembre est maintenant fermée. ⏰\n\nUne seule chance par jour ! Rendez-vous à la date du jour pour participer.`);
        }
        return;
    }
    
    if (doorElement.classList.contains('submitted')) {
        console.log(`✅ Porte ${day} déjà soumise`);
        alert('Vous avez déjà participé à ce jour ! 😊');
        return;
    }

    if (typeof qcmData === 'undefined') {
        console.error('❌ qcmData non chargé !');
        alert('Erreur: Les données du quiz ne sont pas chargées. Rechargez la page.');
        return;
    }
    
    const data = qcmData.find(d => d.day === day);

    if (data) {
        console.log(`✅ Ouverture de la porte ${day}`);
        openPopupWithData(data);
    } else {
        console.error(`❌ Aucune donnée trouvée pour le jour ${day}`);
        alert('Erreur: Données manquantes pour ce jour.');
    }
};

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALISATION - MODE STRICT : SEUL LE JOUR ACTUEL EST ACCESSIBLE
// ═══════════════════════════════════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 Initialisation du Calendrier de l\'Avent...');
    console.log('⚠️  Mode STRICT : Une seule chance par jour !');
    
    const doors = document.querySelectorAll('.door');
    const currentDay = getCurrentDay();
    
    if (TEST_MODE) {
        console.log('%c🧪 MODE TEST ACTIVÉ - TOUTES LES PORTES OUVERTES', 'background: #ff9800; color: white; padding: 10px; font-size: 14px; font-weight: bold;');
    } else {
        console.log(`📅 Mode Production - Jour actuel : ${currentDay}`);
        if (TEST_DATE) {
            console.log(`🗓️ Date simulée : ${TEST_DATE}`);
        }
    }

    doors.forEach(door => {
        const day = parseInt(door.dataset.day);
        
        // GESTION DES SOUMISSIONS (portes déjà répondues)
        const hasBeenSubmitted = localStorage.getItem(`door_${day}_submitted`) === 'true';
        
        if (hasBeenSubmitted) {
            door.classList.add('submitted');
            door.classList.add('unlocked'); // Pour que isDoorUnlocked retourne true
            
            const data = qcmData.find(d => d.day === day);
            if (data) {
                const doorFront = door.querySelector('.door-front');
                doorFront.innerHTML = `
                    <div class="submitted-content">
                        <img src="${data.image}" alt="Aperçu jour ${day}" class="submitted-preview-img">
                        <small>Répondu</small>
                    </div>
                `;
                const doorBack = door.querySelector('.door-back');
                doorBack.innerHTML = `<img src="${data.image}" alt="Image du jour ${day}" style="width:100%; height:100%; object-fit:cover;">`;
            }
            console.log(`✅ Porte ${day} : RÉPONDUE`);
        }
        // GESTION DES ÉTATS : SEUL LE JOUR ACTUEL EST OUVERT (sauf si déjà répondu)
        else {
            if (isDoorUnlocked(day)) {
                door.classList.add('unlocked');
                door.classList.remove('locked');
                console.log(`✅ Porte ${day} : OUVERTE (jour actuel)`);
            } else {
                door.classList.add('locked');
                door.classList.remove('unlocked');
                
                if (day < currentDay) {
                    console.log(`🔒 Porte ${day} : VERROUILLÉE (jour passé non répondu)`);
                } else {
                    console.log(`🔒 Porte ${day} : VERROUILLÉE (jour futur)`);
                }
            }
        }

        // AJOUT DU GESTIONNAIRE DE CLIC
        door.onclick = function() {
            handleDoorClick(day);
        };
    });
    
    if (TEST_MODE) {
        console.log('%c✅ Calendrier initialisé - MODE TEST', 'background: #4caf50; color: white; padding: 10px; font-size: 14px; font-weight: bold;');
    } else {
        console.log('✅ Calendrier initialisé - Mode Production STRICT');
        console.log('⚠️  Rappel : Une seule chance par jour !');
    }
}); 

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS GLOBALES - NE PAS TOUCHER (Ça marche déjà)
// ═══════════════════════════════════════════════════════════════════════════════

window.closePopup = function() {
    document.getElementById('door-overlay').classList.remove('active');
};

window.closePopupIfClickedOutside = function(e) {
    if (e.target.id === 'door-overlay') {
        window.closePopup();
    } else if (e.target.id === 'reglement-overlay') {
        window.closeReglement();
    } else if (e.target.id === 'gdpr-info-overlay') {
        window.closeGdprInfo();
    }
};

window.openReglement = function() {
    document.getElementById('reglement-overlay').classList.add('active');
};

window.closeReglement = function() {
    document.getElementById('reglement-overlay').classList.remove('active');
};

window.openGdprInfo = function() {
    document.getElementById('gdpr-info-overlay').classList.add('active');
};

window.closeGdprInfo = function() {
    document.getElementById('gdpr-info-overlay').classList.remove('active');
};

window.acceptGdprInfo = function() {
    localStorage.setItem('gdpr_info_accepted', 'true');
    window.closeGdprInfo();
};

// ═══════════════════════════════════════════════════════════════════════════════
// FONCTIONS DE DEBUG ET TEST
// ═══════════════════════════════════════════════════════════════════════════════

window.resetCalendar = function() {
    if (confirm("⚠️ Réinitialiser le calendrier ?\n\nCela effacera toutes vos réponses locales.\n(Les données sur Google Sheets ne seront pas supprimées)")) {
        localStorage.clear();
        console.log('🔄 Calendrier réinitialisé');
        location.reload();
    }
};

window.showCalendarStatus = function() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('📊 ÉTAT DU CALENDRIER - MODE STRICT');
    console.log('═══════════════════════════════════════════════════════════');
    console.log(`Mode : ${TEST_MODE ? '🧪 TEST (toutes portes ouvertes)' : '📅 PRODUCTION STRICT (une chance par jour)'}`);
    
    if (!TEST_MODE) {
        const currentDay = getCurrentDay();
        console.log(`Jour actuel : ${currentDay}`);
        if (TEST_DATE) {
            console.log(`Date simulée : ${TEST_DATE}`);
        }
        console.log(`Porte accessible aujourd'hui : ${currentDay}`);
        
        let submittedDays = [];
        let missedDays = [];
        
        for (let i = 1; i < currentDay; i++) {
            if (localStorage.getItem(`door_${i}_submitted`) === 'true') {
                submittedDays.push(i);
            } else {
                missedDays.push(i);
            }
        }
        
        console.log(`Portes répondues : ${submittedDays.length > 0 ? submittedDays.join(', ') : 'Aucune'}`);
        console.log(`Portes manquées (fermées) : ${missedDays.length > 0 ? missedDays.join(', ') : 'Aucune'}`);
    }
    
    console.log('═══════════════════════════════════════════════════════════');
};

if (TEST_MODE) {
    console.log('%c🧪 MODE TEST ACTIVÉ', 'background: #ff9800; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('%cToutes les portes sont ouvertes pour les tests !', 'background: #4caf50; color: white; padding: 5px;');
} else {
    console.log('%c📅 MODE PRODUCTION STRICT', 'background: #2196F3; color: white; padding: 10px; font-size: 16px; font-weight: bold;');
    console.log('%c⚠️ Une seule chance par jour !', 'background: #ff5722; color: white; padding: 5px;');
}
console.log('Commandes disponibles : resetCalendar() | showCalendarStatus()');
