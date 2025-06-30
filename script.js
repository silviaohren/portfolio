// ============================================
//   CONFIGURAZIONE
// ============================================
const CONFIG = {
    // Password per l'area riservata (in produzione, usare un sistema più sicuro)
    UPLOAD_PASSWORD: 'bastacinema42'
};

// ============================================
//   GESTIONE NAVIGAZIONE
// ============================================
function showPage(pageId, clickedLink) {
    // Nascondi tutte le pagine
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    
    // Mostra la pagina selezionata
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        if (pageId === 'wavetable-page') {
            initWavetable();
        }
    }
    
    // Se è stato passato un link (non per il bottone alieno)
    if (clickedLink) {
        updateNavigation(clickedLink);
        updateURL(clickedLink.getAttribute('href'));
    }
    
    return false; // Previene l'azione predefinita del link
}

function updateNavigation(activeLink) {
    // Rimuovi classe active da tutti i link ma preserva menu-green
    const links = document.querySelectorAll('.nav-menu a');
    links.forEach(link => {
        const isGreen = link.classList.contains('menu-green');
        link.classList.remove('active');
        // Ripristina la classe menu-green se necessario
        if (isGreen && !link.classList.contains('menu-green')) {
            link.classList.add('menu-green');
        }
    });
    
    // Aggiungi classe active al link cliccato
    activeLink.classList.add('active');
}

function updateURL(hash) {
    // Aggiorna URL senza causare refresh della pagina
    if (history.pushState) {
        history.pushState(null, null, hash);
    } else {
        location.hash = hash;
    }
}

// ============================================
//   GESTIONE POSTER STRAPPATI
// ============================================
function initTornPosters() {
    // Aggiungi interazione di click per ogni poster strappato
    const tornPosters = document.querySelectorAll('.torn-poster');
    tornPosters.forEach(poster => {
        poster.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

// ============================================
//   GESTIONE AREA RISERVATA
// ============================================
function checkPassword() {
    const passwordInput = document.getElementById('access-password');
    const password = passwordInput.value;
    
    if (password === CONFIG.UPLOAD_PASSWORD) {
        showUploadContent();
        saveAuthentication();
    } else {
        showPasswordError();
    }
}

function showUploadContent() {
    // Nascondi il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'none';
    }
    
    // Mostra il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'block';
    }
}

function showPasswordError() {
    alert('Password non corretta. Riprova.');
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
        passwordInput.focus();
    }
}

function saveAuthentication() {
    // Salva un flag in sessionStorage
    sessionStorage.setItem('authenticated', 'true');
}

function checkAuthentication() {
    if (sessionStorage.getItem('authenticated') === 'true') {
        const passwordForm = document.getElementById('password-form-container');
        const uploadContent = document.getElementById('upload-content');
        
        if (passwordForm && uploadContent) {
            passwordForm.style.display = 'none';
            uploadContent.style.display = 'block';
        }
    }
}

// ============================================
//   LOGOUT FUNCTIONALITY
// ============================================
function logout() {
    // Rimuovi l'autenticazione
    sessionStorage.removeItem('authenticated');
    
    // Nascondi il contenuto protetto
    const uploadContent = document.getElementById('upload-content');
    if (uploadContent) {
        uploadContent.style.display = 'none';
    }
    
    // Mostra di nuovo il form di accesso
    const passwordForm = document.getElementById('password-form-container');
    if (passwordForm) {
        passwordForm.style.display = 'block';
    }
    
    // Pulisci il campo password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.value = '';
    }
    
    // Torna alla pagina principale
    showPage('film-page', document.querySelector('.nav-menu a[href="#film"]'));
}

// ============================================
//   FILE UPLOAD FUNCTIONALITY
// ============================================
function initFileUpload() {
    const fileUpload = document.getElementById('file-upload');
    const fileUploadContainer = document.querySelector('.file-upload-container');
    
    if (fileUpload && fileUploadContainer) {
        // Drag and drop functionality
        fileUploadContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = 'var(--accent-color)';
            this.style.backgroundColor = 'rgba(255, 77, 109, 0.1)';
        });
        
        fileUploadContainer.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
        });
        
        fileUploadContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 77, 109, 0.3)';
            this.style.backgroundColor = 'transparent';
            
            const files = e.dataTransfer.files;
            handleFileUpload(files);
        });
        
        // Click to upload
        fileUpload.addEventListener('change', function(e) {
            const files = e.target.files;
            handleFileUpload(files);
        });
    }
}

function handleFileUpload(files) {
    if (files.length === 0) return;
    
    // Simulate file upload (in a real app, you'd upload to a server)
    console.log('Files to upload:', files);
    
    // Show upload progress
    showUploadProgress(files);
    
    // In a real application, you would:
    // 1. Create FormData
    // 2. Send to server via fetch/XMLHttpRequest
    // 3. Show real progress
    // 4. Handle success/error responses
}

function showUploadProgress(files) {
    // Create a simple progress notification
    const uploadArea = document.querySelector('.upload-area');
    if (uploadArea) {
        const progressDiv = document.createElement('div');
        progressDiv.className = 'upload-progress';
        progressDiv.innerHTML = `
            <div style="background: rgba(255, 77, 109, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <p style="margin: 0; color: var(--accent-color);">📤 Caricamento ${files.length} file...</p>
                <div style="background: rgba(255, 255, 255, 0.1); height: 4px; border-radius: 2px; margin-top: 0.5rem;">
                    <div style="background: var(--accent-color); height: 100%; width: 0%; border-radius: 2px; transition: width 0.3s ease;" id="progress-bar"></div>
                </div>
            </div>
        `;
        
        uploadArea.appendChild(progressDiv);
        
        // Simulate progress
        let progress = 0;
        const progressBar = progressDiv.querySelector('#progress-bar');
        const interval = setInterval(() => {
            progress += 10;
            progressBar.style.width = progress + '%';
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressDiv.innerHTML = `
                        <div style="background: rgba(16, 185, 129, 0.1); padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                            <p style="margin: 0; color: #10b981;">✅ File caricati con successo!</p>
                        </div>
                    `;
                    setTimeout(() => progressDiv.remove(), 3000);
                }, 500);
            }
        }, 200);
    }
}

// ============================================
//   GESTIONE FORM CONTATTO
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

function handleContactSubmit(event) {
    // Qui puoi aggiungere validazione aggiuntiva se necessario
    // Il form viene inviato automaticamente a Web3Forms
    console.log('Form di contatto inviato');
}

// ============================================
//   UTILITY FUNCTIONS
// ============================================
function handleHashNavigation() {
    const hash = window.location.hash;
    if (hash) {
        const targetLink = document.querySelector(`.nav-menu a[href="${hash}"]`);
        if (targetLink) {
            const pageId = targetLink.getAttribute('href').replace('#', '') + '-page';
            showPage(pageId, targetLink);
        }
    }
}

// ============================================
//   INIZIALIZZAZIONE
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Inizializza la navigazione basata sull'URL
    handleHashNavigation();
    
    // Inizializza i poster strappati
    initTornPosters();
    
    // Controlla se l'utente è già autenticato
    checkAuthentication();
    
    // Inizializza il form di contatto
    initContactForm();
    
    // Inizializza i form di upload
    initUploadForms();
    
    // Aggiungi event listener per il tasto Enter nel form password
    const passwordInput = document.getElementById('access-password');
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                checkPassword();
            }
        });
    }
    
    // Nuova inizializzazione per i player circolari
    initializeCircularPlayers();
    
    // Re-inizializza i player quando si cambia pagina
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            setTimeout(() => {
                initializeCircularPlayers();
            }, 100);
        });
    });
});

// ============================================
//   GESTIONE BROWSER BACK/FORWARD
// ============================================
window.addEventListener('popstate', function() {
    handleHashNavigation();
});

// ============================================
//   GESTIONE FORM UPLOAD
// ============================================
function showCategoryForm() {
    const categorySelect = document.getElementById('project-category');
    const selectedCategory = categorySelect.value;
    
    // Nascondi tutti i form
    const allForms = document.querySelectorAll('.upload-form');
    allForms.forEach(form => {
        form.style.display = 'none';
    });
    
    // Mostra il form selezionato
    if (selectedCategory) {
        const targetForm = document.getElementById(selectedCategory + '-form');
        if (targetForm) {
            targetForm.style.display = 'block';
            
            // Scroll smooth al form
            targetForm.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }
}

function resetForm(formId) {
    const form = document.getElementById(formId);
    if (form) {
        // Reset del form
        form.querySelector('form').reset();
        
        // Reset del dropdown principale
        const categorySelect = document.getElementById('project-category');
        if (categorySelect) {
            categorySelect.value = '';
        }
        
        // Nascondi il form
        form.style.display = 'none';
        
        // Scroll in cima alla pagina
        window.scrollTo({ 
            top: 0, 
            behavior: 'smooth' 
        });
    }
}

// ============================================
//   GESTIONE SUBMIT FORM
// ============================================
function initUploadForms() {
    const forms = document.querySelectorAll('.project-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleFormSubmit(this);
        });
    });
}

function handleFormSubmit(form) {
    // Raccogli i dati del form
    const formData = new FormData(form);
    const projectData = {};
    
    // Converti FormData in oggetto
    for (let [key, value] of formData.entries()) {
        projectData[key] = value;
    }
    
    // Determina la categoria dal form
    const formId = form.closest('.upload-form').id;
    const category = formId.replace('-form', '');
    projectData.category = category;
    
    // Simula l'upload (in una vera app, invieresti al server)
    console.log('Dati progetto da caricare:', projectData);
    
    // Mostra messaggio di successo
    showUploadSuccess(category);
    
    // Reset del form
    form.reset();
    
    // Reset del dropdown principale
    const categorySelect = document.getElementById('project-category');
    if (categorySelect) {
        categorySelect.value = '';
    }
    
    // Nascondi il form
    const formContainer = form.closest('.upload-form');
    if (formContainer) {
        formContainer.style.display = 'none';
    }
}

function showUploadSuccess(category) {
    // Crea un messaggio di successo
    const successDiv = document.createElement('div');
    successDiv.className = 'upload-success';
    successDiv.innerHTML = `
        <div style="
            background: rgba(16, 185, 129, 0.1); 
            border: 1px solid #10b981; 
            border-radius: 8px; 
            padding: 1.5rem; 
            margin: 2rem 0;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 1rem;">✅</div>
            <h4 style="color: #10b981; margin-bottom: 0.5rem;">Progetto ${category.toUpperCase()} caricato con successo!</h4>
            <p style="color: rgba(255, 255, 255, 0.8); margin: 0;">Il progetto è stato aggiunto al tuo portfolio.</p>
        </div>
    `;
    
    // Inserisci il messaggio dopo il dropdown
    const categorySection = document.querySelector('.category-selector');
    if (categorySection) {
        categorySection.parentNode.insertBefore(successDiv, categorySection.nextSibling);
    }
    
    // Rimuovi il messaggio dopo 5 secondi
    setTimeout(() => {
        if (successDiv.parentNode) {
            successDiv.parentNode.removeChild(successDiv);
        }
    }, 5000);
}

// ============================================
// PLAYER AUDIO CIRCOLARE PER LIBRARIES
// ============================================
function initializeCircularPlayers() {
    const players = document.querySelectorAll('.player-circle');
    
    players.forEach(player => {
        player.addEventListener('click', function(e) {
            e.stopPropagation(); // Previene l'apertura della scheda
            
            const isPlaying = this.classList.contains('playing');
            
            if (isPlaying) {
                // Pausa
                this.classList.remove('playing');
                this.querySelector('.play-icon').textContent = '▶';
            } else {
                // Play
                // Ferma tutti gli altri player
                players.forEach(p => {
                    p.classList.remove('playing');
                    p.querySelector('.play-icon').textContent = '▶';
                });
                
                // Avvia questo player
                this.classList.add('playing');
                this.querySelector('.play-icon').textContent = '⏸';
                
                // Simula la riproduzione audio (qui potresti integrare un vero player audio)
                console.log('Playing audio for:', this.closest('.library-card').querySelector('.scheda-titolo').textContent);
            }
        });
    });
}

// ============================================
//   INIZIALIZZAZIONE WAVETABLE PAGE
// ============================================
function initWavetable() {
    console.log('initWavetable called');
    const waveContainer = document.getElementById('waveContainer');
    const mouseCursor = document.getElementById('mouseCursor');
    if (!waveContainer || !mouseCursor) return;

    // Rimuovi eventuali nodi precedenti
    const nodesToRemove = waveContainer.querySelectorAll('.wave-node');
    nodesToRemove.forEach(node => node.remove());

    // Rimuovi vecchi event listener (clona il nodo per rimuovere tutti i listener)
    const newWaveContainer = waveContainer.cloneNode(true);
    waveContainer.parentNode.replaceChild(newWaveContainer, waveContainer);

    // Aggiorna i riferimenti
    const waveContainerRef = document.getElementById('waveContainer');
    const mouseCursorRef = document.getElementById('mouseCursor');

    const nodeSpacing = 20;
    const waveSpeed = 80;
    const maxWaveRadius = 200;
    const waveIntensity = 2;
    const wavePause = 150;
    const asciiChars = [
        '·', ':', '·', ':', '·', ':', '·', ':', '·', ':',
        '▁', '▂', '▃', '▄', '▅', '▆', '▇', '█', '▇', '▆', '▅', '▄', '▃', '▂', '▁',
        '░', '▒', '▓', '█', '▓', '▒', '░',
        '⠁', '⠉', '⠋', '⠛', '⠟', '⠿', '⠟', '⠛', '⠋', '⠉', '⠁',
        '○', '◎', '●', '◎', '○'
    ];
    let nodes = [];
    let gridWidth, gridHeight;
    let lastWaveTime = 0;
    let isMouseOver = false;
    let mouseX = 0, mouseY = 0;
    let waveInterval = null;

    function createGrid() {
        const nodesToRemove = waveContainerRef.querySelectorAll('.wave-node');
        nodesToRemove.forEach(node => node.remove());
        nodes = [];
        gridWidth = waveContainerRef.clientWidth;
        gridHeight = waveContainerRef.clientHeight;
        const numCols = Math.floor(gridWidth / nodeSpacing);
        const numRows = Math.floor(gridHeight / nodeSpacing);
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                const x = j * nodeSpacing + nodeSpacing / 2;
                const y = i * nodeSpacing + nodeSpacing / 2;
                const node = document.createElement('div');
                node.className = 'wave-node';
                node.style.left = `${x}px`;
                node.style.top = `${y}px`;
                const charIndex = Math.floor(Math.random() * asciiChars.length);
                node.textContent = asciiChars[charIndex];
                waveContainerRef.appendChild(node);
                nodes.push({
                    element: node,
                    x: x,
                    y: y,
                    originalChar: node.textContent,
                    charIndex: charIndex
                });
            }
        }
    }
    function createWave(centerX, centerY) {
        const now = Date.now();
        if (now - lastWaveTime < wavePause) return;
        lastWaveTime = now;
        nodes.forEach(node => {
            const dx = node.x - centerX;
            const dy = node.y - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance <= maxWaveRadius) {
                const delay = distance * waveSpeed / 100;
                setTimeout(() => {
                    const wavePhase = (distance / 30) * Math.PI * waveIntensity;
                    const amplitude = Math.cos(wavePhase) * Math.max(0, 1 - distance / maxWaveRadius);
                    if (Math.abs(amplitude) > 0.7) {
                        node.element.className = 'wave-node active-1';
                        node.element.textContent = asciiChars[(node.charIndex + 15) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.4) {
                        node.element.className = 'wave-node active-2';
                        node.element.textContent = asciiChars[(node.charIndex + 10) % asciiChars.length];
                    } else if (Math.abs(amplitude) > 0.1) {
                        node.element.className = 'wave-node active-3';
                        node.element.textContent = asciiChars[(node.charIndex + 5) % asciiChars.length];
                    }
                    setTimeout(() => {
                        node.element.className = 'wave-node';
                        node.element.textContent = node.originalChar;
                    }, 300);
                }, delay);
            }
        });
    }
    function handleMouseMove(e) {
        const rect = waveContainerRef.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseCursorRef.style.left = `${mouseX}px`;
        mouseCursorRef.style.top = `${mouseY}px`;
    }
    function handleMouseEnter() {
        isMouseOver = true;
        if (!waveInterval) {
            waveInterval = setInterval(() => {
                if (isMouseOver) {
                    createWave(mouseX, mouseY);
                }
            }, wavePause);
        }
        mouseCursorRef.style.display = 'block';
    }
    function handleMouseLeave() {
        isMouseOver = false;
        mouseCursorRef.style.display = 'none';
        if (waveInterval) {
            clearInterval(waveInterval);
            waveInterval = null;
        }
    }
    createGrid();
    window.addEventListener('resize', createGrid);
    waveContainerRef.addEventListener('mousemove', handleMouseMove);
    waveContainerRef.addEventListener('mouseenter', handleMouseEnter);
    waveContainerRef.addEventListener('mouseleave', handleMouseLeave);
    waveContainerRef.style.cursor = 'none';
    mouseCursorRef.style.display = 'none';
} 