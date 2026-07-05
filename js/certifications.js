/**
 * Load certifications from JSON and render them dynamically
 */

async function loadCertifications() {
	try {
		const response = await fetch('../assets/data/certifications.json');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const certifications = await response.json();
		const container = document.getElementById('certificationsContainer');

		if (!container) {
			console.warn('Certifications container not found');
			return;
		}

		container.innerHTML = '';

		certifications.forEach((cert) => {
			container.appendChild(createCertificationCard(cert));
		});

		injectJsonLd(certifications);
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

	const sectionId = `certificate-${String(cert.id || cert.title || 'item')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')}-${cert.issuedDate ? cert.issuedDate.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'cert'}`;

	article.id = sectionId;
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
			<button class="cert-card__imageTrigger" type="button" aria-label="Preview ${cert.title}" data-preview-src="${cert.image}" data-preview-alt="${cert.altText}" data-preview-title="${cert.title}">
				<img src="${cert.image}" alt="${cert.altText}" loading="lazy" />
			</button>
		</div>
	`;

	const previewTrigger = article.querySelector('.cert-card__imageTrigger');
	if (previewTrigger) {
		previewTrigger.addEventListener('click', handlePreviewOpen);
	}

	return article;
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', loadCertifications);
} else {
	loadCertifications();
}

document.addEventListener('DOMContentLoaded', ensureCertificationPreviewModal);

function ensureCertificationPreviewModal() {
	if (document.getElementById('certificationPreviewModal')) return;

	const modal = document.createElement('div');
	modal.id = 'certificationPreviewModal';
	modal.className = 'cert-previewModal';
	modal.setAttribute('role', 'dialog');
	modal.setAttribute('aria-modal', 'true');
	modal.setAttribute('aria-hidden', 'true');
	modal.innerHTML = `
		<div class="cert-previewModal__backdrop" data-preview-close></div>
		<div class="cert-previewModal__panel" role="document">
			<button class="cert-previewModal__close" type="button" aria-label="Close preview" data-preview-close>
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" aria-hidden="true">
					<path d="M6 6l12 12M18 6 6 18" stroke-width="2" stroke-linecap="round" />
				</svg>
			</button>
			<div class="cert-previewModal__mediaWrap">
				<img class="cert-previewModal__image" alt="" />
			</div>
			<div class="cert-previewModal__caption"></div>
		</div>
	`;
	document.body.appendChild(modal);

	modal.addEventListener('click', (event) => {
		if (event.target.closest('[data-preview-close]')) {
			closeCertificationPreview();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			closeCertificationPreview();
		}
	});
}

function handlePreviewOpen(event) {
	const trigger = event.currentTarget;
	const src = trigger.dataset.previewSrc;
	const alt = trigger.dataset.previewAlt || trigger.dataset.previewTitle || 'Certificate preview';
	const title = trigger.dataset.previewTitle || 'Certificate';
	openCertificationPreview({ src, alt, title });
}

function openCertificationPreview({ src, alt, title }) {
	const modal = document.getElementById('certificationPreviewModal');
	if (!modal) return;

	const image = modal.querySelector('.cert-previewModal__image');
	const caption = modal.querySelector('.cert-previewModal__caption');

	if (image) {
		image.src = src;
		image.alt = alt;
	}

	if (caption) {
		caption.textContent = title;
	}

	modal.classList.add('is-open');
	modal.setAttribute('aria-hidden', 'false');
	document.body.classList.add('is-preview-open');

	const closeButton = modal.querySelector('.cert-previewModal__close');
	if (closeButton) {
		closeButton.focus();
	}
}

function closeCertificationPreview() {
	const modal = document.getElementById('certificationPreviewModal');
	if (!modal) return;

	modal.classList.remove('is-open');
	modal.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('is-preview-open');
}

/**
 * Inject JSON-LD (structured data) for search engines using the same certifications data.
 * @param {Array} certs
 */
function injectJsonLd(certs) {
	if (!Array.isArray(certs) || certs.length === 0) return;

	const monthMap = {
		Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
		Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
	};

	const graph = certs.map(cert => {
		let dateIssued = cert.issuedDate || '';
		const m = dateIssued.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})/i);
		if (m) {
			const mm = monthMap[m[1].slice(0, 3)] || '01';
			dateIssued = `${m[2]}-${mm}`;
		} else {
			const y = dateIssued.match(/(\d{4})/);
			if (y) dateIssued = y[1];
		}

		let imageUrl = '';
		try {
			imageUrl = new URL(cert.image, window.location.href).href;
		} catch (error) {
			imageUrl = cert.image || '';
		}

		return {
			'@type': 'EducationalOccupationalCredential',
			name: cert.title,
			issuer: { '@type': 'Organization', name: cert.issuer },
			dateIssued: dateIssued || undefined,
			identifier: cert.credentialId ? { '@type': 'PropertyValue', propertyID: 'credentialId', value: cert.credentialId } : undefined,
			url: cert.credentialUrl || undefined,
			image: imageUrl || undefined
		};
	});

	const script = document.createElement('script');
	script.type = 'application/ld+json';
	script.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph.filter(Boolean) }, null, 2);
	document.head.appendChild(script);
}
