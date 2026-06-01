/**
 * Load certifications from JSON and render them dynamically
 */

async function loadCertifications() {
    try {
        // Fetch the certifications data
        const response = await fetch('../assets/data/certifications.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const certifications = await response.json();
        
        // Get the container element
        const container = document.getElementById('certificationsContainer');
        
        if (!container) {
            console.warn('Certifications container not found');
            return;
        }
        
        // Clear any existing content
        container.innerHTML = '';
        
        // Render each certification
        certifications.forEach((cert) => {
            const certCard = createCertificationCard(cert);
            container.appendChild(certCard);
        });
        
    } catch (error) {
        console.error('Error loading certifications:', error);
        const container = document.getElementById('certificationsContainer');
        if (container) {
            container.innerHTML = '<p style="color: var(--color-text-secondary); text-align: center;">Error loading certifications. Please try again later.</p>';
        }
    }
}

/**
 * Create a certification card element
 * @param {Object} cert - Certification data object
 * @returns {HTMLElement} - The certification card element
 */
function createCertificationCard(cert) {
    const article = document.createElement('article');
    article.className = 'certification-card';
    article.setAttribute('data-cert-id', cert.id);
    
    article.innerHTML = `
        <div class="cert-card__header">
            <img class="cert-card__logo" src="${cert.logo}" alt="${cert.issuer}"
                width="64" height="64" loading="lazy" />
            <div class="cert-card__info">
                <h2 class="cert-card__title">${cert.title}</h2>
                <p class="cert-card__issuer">${cert.issuer}</p>
            </div>
        </div>

        <div class="cert-card__details">
            <p class="cert-card__date"><strong>Issued:</strong> ${cert.issuedDate}</p>
            <p class="cert-card__credential"><strong>Credential ID:</strong> ${cert.credentialId}</p>
            <div class="cert-card__buttons">
                <a href="${cert.credentialUrl}" class="cert-card__link" target="_blank" rel="noopener noreferrer">
                    Show credential
                    <svg class="cert-card__link-icon" viewBox="0 0 24 24" width="16" height="16" fill="none"
                        stroke="currentColor">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </a>
                <a href="${cert.downloadUrl}" class="cert-card__download" target="_blank" rel="noopener noreferrer" download>
                    Download
                    <svg class="cert-card__download-icon" viewBox="0 0 24 24" width="16" height="16" fill="none"
                        stroke="currentColor">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke-width="2" stroke-linecap="round"
                            stroke-linejoin="round" />
                    </svg>
                </a>
            </div>
        </div>

        <div class="cert-card__image">
            <img src="${cert.image}" alt="${cert.altText}" loading="lazy" />
        </div>
    `;
    
    return article;
}

// Load certifications when the DOM is ready
document.addEventListener('DOMContentLoaded', loadCertifications);
