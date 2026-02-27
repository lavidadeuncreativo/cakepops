// script.js — Kpops Landing Page
gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("premium", "0.32, 0.72, 0, 1");

// ═══ HERO IMAGE CYCLING WITH FLIP ══════════════════════
const heroImages = [
    'images/hero.jpg',
    'images/product4.jpg',
    'images/product5.jpg',
    'images/gallery1.jpg',
    'images/gallery2.jpg',
];
let heroIdx = 0;
const heroImg = document.getElementById('hero-img');
const heroDots = document.querySelectorAll('#hero-dots .dot');

function updateHeroDots(idx) {
    heroDots.forEach((d, i) => {
        d.style.opacity = i === idx ? '1' : '0.4';
        d.style.width = i === idx ? '20px' : '6px';
        d.style.borderRadius = '999px';
    });
}

function cycleHeroImage() {
    heroIdx = (heroIdx + 1) % heroImages.length;
    const nextSrc = heroImages[heroIdx];
    // 3D flip: scaleX 1→0 (half flip), swap, scaleX 0→1
    gsap.timeline()
        .to(heroImg, { scaleX: 0, duration: 0.35, ease: "power2.in" })
        .call(() => {
            heroImg.src = nextSrc;
            updateHeroDots(heroIdx);
        })
        .to(heroImg, { scaleX: 1, duration: 0.35, ease: "power2.out" });
}

// Start cycling every 3.5 seconds, but wait for page to fully load
let heroInterval;

// ═══ REVIEW MARQUEE DATA ════════════════════════════════
const reviewsData = [
    { initial: "A", name: "Andrea M.", stars: 5, text: "¡Los más bonitos de Pachuca! Los pedí para el baby shower de mi hermana y todos quedaron encantados. 10/10", photo: null },
    { initial: "M", name: "Mariana R.", stars: 5, text: "El brownie se derrite en la boca. Literal el mejor que he probado y eso que soy MUY exigente 😂", photo: "images/ugc1.jpg" },
    { initial: "K", name: "Karol V.", stars: 5, text: "Los pedí para boda y todos preguntaron quién los hizo. Presentación IMPECABLE y sabor increíble.", photo: null },
    { initial: "P", name: "Pao G.", stars: 5, text: "Pedí para la oficina y en 5 min se acabaron jajaja. El empaque es súper lindo también.", photo: "images/ugc2.jpg" },
    { initial: "S", name: "Sofía L.", stars: 5, text: "Hechos con todo el amor del mundo. Decoración hermosa y sabor espectacular. ¡Ya son mis favoritos!", photo: null },
    { initial: "D", name: "Daniela C.", stars: 5, text: "Perfectos para mi XV. Mis invitados no dejaban de pedirme el contacto. Mil gracias Kpops! 🎀", photo: null },
    { initial: "I", name: "Isa T.", stars: 5, text: "Súper frescos, muy ricos y creo que son los más bonitos que he visto. Me enamoré de los de Red Velvet.", photo: null },
    { initial: "R", name: "Rebeca S.", stars: 5, text: "Me sorprendió muchísimo la calidad. El packaging está de película. Definitivamente repetiré el pedido.", photo: "images/ugc3.jpg" },
    { initial: "C", name: "Cris A.", stars: 5, text: "Los de limón son de otro mundo. Pedí 24 para graduación y cero sobras. ¡Todos felices!", photo: null },
    { initial: "J", name: "Jimena F.", stars: 5, text: "Textura perfecta, cantidad abundante y precio muy justo. Son los mejores de la ciudad sin duda.", photo: null },
    { initial: "V", name: "Valeria O.", stars: 5, text: "Pedí el combo surtido y estuvo perfecto. Demasiado buenos, ya quiero otro pedido pronto! 🍭", photo: null },
    { initial: "N", name: "Nadia P.", stars: 5, text: "El servicio es increíble. Super atentos y el resultado final fue exactamente lo que pedí. Top.", photo: null },
];

function buildReviewCard(r) {
    const stars = '★'.repeat(r.stars);
    const card = document.createElement('div');
    card.className = 'rm-card';
    card.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
            <div style="display:flex;align-items:center;gap:8px;">
                <div style="width:26px;height:26px;border-radius:50%;background:#f24a69;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;">${r.initial}</div>
                <span class="rm-name">${r.name}</span>
            </div>
            <span class="rm-stars">${stars}</span>
        </div>
        <p class="rm-text">"${r.text}"</p>
        ${r.photo ? `<img src="${r.photo}" class="rm-photo" alt="foto" loading="lazy"/>` : ''}
    `;
    return card;
}

function buildReviewStrip(rowEl, items) {
    // Create cards × 2 for seamless loop
    const cards = [...items, ...items];
    cards.forEach(r => rowEl.appendChild(buildReviewCard(r)));
}

function initReviewStrips() {
    const row1 = document.getElementById('rv-row-1');
    const row2 = document.getElementById('rv-row-2');
    const row3 = document.getElementById('rv-row-3');
    if (!row1 || !row2 || !row3) return;

    buildReviewStrip(row1, reviewsData.slice(0, 6));
    buildReviewStrip(row2, reviewsData.slice(6, 12));
    buildReviewStrip(row3, reviewsData.slice(0, 6).reverse());
}

// ═══ MODAL SYSTEM ═══════════════════════════════════════
const sys = {
    appContainer: document.getElementById('app-container'),
    backdrop: document.getElementById('backdrop-overlay'),
    modalsContainer: document.getElementById('modals-container'),
    menuSheet: document.getElementById('menu-sheet'),
    orderSheet: document.getElementById('order-sheet'),
    reviewSheet: document.getElementById('review-sheet'),
};

let activeModal = null;

function openModal(el) {
    if (!el || activeModal === el) return;

    if (activeModal) {
        // Fix 2: slower, smoother slide out
        gsap.to(activeModal, { y: "100%", duration: 0.5, ease: "power3.inOut", onComplete: () => gsap.set(activeModal, { display: "none" }) });
    } else {
        gsap.to(sys.appContainer, { scale: 0.94, y: 6, borderRadius: "28px", filter: "brightness(0.6) blur(2px)", duration: 0.65, ease: "premium" });
        gsap.to(sys.backdrop, { opacity: 1, duration: 0.45, pointerEvents: 'auto' });
        sys.modalsContainer.style.pointerEvents = 'auto';
    }

    activeModal = el;
    gsap.set(el, { display: 'flex' });
    // Fix 2: slower, smoother slide up
    gsap.fromTo(el, { y: "100%" }, { y: "0%", duration: 0.75, ease: "premium" });

    const animEls = el.querySelectorAll('.modal-animate-in');
    if (animEls.length) {
        gsap.fromTo(animEls, { y: 24, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, duration: 0.8, ease: "power3.out", delay: 0.25 });
    }
}

function closeModal() {
    if (!activeModal) return;
    const toClose = activeModal;
    activeModal = null;

    // Fix 2: smoother close
    gsap.to(toClose, { y: "100%", duration: 0.55, ease: "power3.inOut", onComplete: () => gsap.set(toClose, { display: 'none' }) });
    gsap.to(sys.appContainer, { scale: 1, y: 0, borderRadius: "0px", filter: "brightness(1) blur(0px)", duration: 0.6, ease: "premium", delay: 0.08 });
    gsap.to(sys.backdrop, { opacity: 0, duration: 0.45, pointerEvents: 'none', delay: 0.08, onComplete: () => { sys.modalsContainer.style.pointerEvents = 'none'; } });
}

// ═══ MENU TABS ══════════════════════════════════════════
function initMenuTabs() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.dataset.tab;

            // Update tab styles
            tabLinks.forEach(l => {
                l.classList.toggle('border-primary', l.dataset.tab === target);
                l.classList.toggle('text-primary', l.dataset.tab === target);
                l.classList.toggle('border-transparent', l.dataset.tab !== target);
                l.classList.toggle('text-slate-400', l.dataset.tab !== target);
            });

            // Show correct panel
            tabPanels.forEach(p => {
                const isActive = p.dataset.panel === target;
                p.classList.toggle('active', isActive);
                if (isActive) {
                    gsap.from(p, { opacity: 0, y: 15, duration: 0.4, ease: "power2.out" });
                }
            });
        });
    });
}

// ═══ ORDER FORM ══════════════════════════════════════════
let orderQty = 6;
const selectedFlavors = new Set(['Chocolate']);

function toggleDeliverySection() {
    const method = document.getElementById('order-method')?.value;
    const deliveryEl = document.getElementById('delivery-section');
    const pickupEl = document.getElementById('pickup-section');
    if (!deliveryEl || !pickupEl) return;
    const isDomicilio = method === 'domicilio';
    deliveryEl.style.display = isDomicilio ? 'block' : 'none';
    pickupEl.style.display = isDomicilio ? 'none' : 'block';
    updateMsgPreview();
}

function initOrderForm() {
    // Quantity stepper
    document.getElementById('qty-minus')?.addEventListener('click', () => {
        if (orderQty > 1) { orderQty--; }
        document.getElementById('qty-display').textContent = orderQty;
        updateMsgPreview();
    });
    document.getElementById('qty-plus')?.addEventListener('click', () => {
        orderQty++;
        document.getElementById('qty-display').textContent = orderQty;
        updateMsgPreview();
    });

    // Flavor chips
    document.querySelectorAll('.flavor-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const f = chip.dataset.flavor;
            if (selectedFlavors.has(f)) {
                selectedFlavors.delete(f);
                chip.classList.remove('bg-primary', 'text-white', 'border-primary');
                chip.classList.add('bg-white', 'text-slate-500', 'border-slate-200');
                chip.textContent = f;
            } else {
                selectedFlavors.add(f);
                chip.classList.add('bg-primary', 'text-white', 'border-primary');
                chip.classList.remove('bg-white', 'text-slate-500', 'border-slate-200');
                chip.textContent = f + ' ✓';
            }
            updateMsgPreview();
        });
    });

    // Method toggle → show address or pickup
    document.getElementById('order-method')?.addEventListener('change', toggleDeliverySection);
    document.getElementById('order-pickup')?.addEventListener('change', updateMsgPreview);
    document.getElementById('order-address')?.addEventListener('input', updateMsgPreview);

    // Copy message
    document.getElementById('copy-msg-btn')?.addEventListener('click', () => {
        const msg = document.getElementById('msg-preview')?.textContent || '';
        navigator.clipboard.writeText(msg.trim()).then(() => {
            const btn = document.getElementById('copy-msg-btn');
            if (!btn) return;
            btn.innerHTML = '<span class="material-symbols-outlined text-base">check_circle</span> ¡Copiado!';
            btn.style.background = '#d1fae5';
            setTimeout(() => {
                btn.innerHTML = '<span class="material-symbols-outlined text-base">content_copy</span> Copiar mensaje';
                btn.style.background = '';
            }, 2000);
        });
    });
}

// Fix 3: Google Maps Places Autocomplete for address field
function initAddressAutocomplete() {
    const input = document.getElementById('order-address');
    if (!input) return;

    function tryInit() {
        if (window.google && window.google.maps && window.google.maps.places) {
            const autocomplete = new google.maps.places.Autocomplete(input, {
                componentRestrictions: { country: 'mx' },
                types: ['address'],
                fields: ['formatted_address'],
            });
            autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();
                if (place.formatted_address) {
                    input.value = place.formatted_address;
                    updateMsgPreview();
                }
            });
            // Style the pac-container (dropdown) to match our design
            const style = document.createElement('style');
            style.textContent = '.pac-container { font-family: \'Plus Jakarta Sans\', sans-serif; border-radius: 12px; border: 1px solid rgba(242,74,105,0.2); box-shadow: 0 8px 24px rgba(0,0,0,0.12); margin-top: 4px; } .pac-item { font-size: 11px; padding: 6px 12px; cursor:pointer; } .pac-item:hover { background: #FFF4E8; } .pac-item-query { font-weight: 700; color: #3A241B; } ';
            document.head.appendChild(style);
        } else {
            // Maps not loaded yet, retry after 500ms
            setTimeout(tryInit, 500);
        }
    }
    tryInit();
}

function updateMsgPreview() {
    const flavorsText = [...selectedFlavors].join(', ') || 'varios sabores';
    const cat = document.querySelector('input[name="category"]:checked')?.value || 'Cakepops';
    const method = document.getElementById('order-method')?.value || 'domicilio';
    const date = document.getElementById('order-date')?.value || 'fecha por confirmar';
    const preview = document.getElementById('msg-preview');
    if (!preview) return;

    let deliveryText = '';
    if (method === 'domicilio') {
        const addr = document.getElementById('order-address')?.value.trim();
        deliveryText = addr
            ? `Dirección: ${addr}. Costo de envío $15.`
            : 'Envío a domicilio ($15). Dirección por confirmar.';
    } else {
        const pickup = document.getElementById('order-pickup')?.value || 'Galerías';
        deliveryText = `Punto de encuentro: ${pickup}. Sin costo de envío.`;
    }

    preview.textContent = `"Hola Kpops! 🍩 Quiero ordenar ${orderQty} ${cat} (${flavorsText}) para el ${date}. ${deliveryText} ¿Me confirman disponibilidad? ✨"`;
}

// ═══ STAR RATING ════════════════════════════════════════
let selectedStars = 0;

function initStarRating() {
    const starBtns = document.querySelectorAll('.star-btn');
    starBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            selectedStars = parseInt(btn.dataset.star);
            starBtns.forEach((b, i) => {
                b.classList.toggle('active', i < selectedStars);
            });
            gsap.from(btn, { scale: 1.5, duration: 0.3, ease: "back.out(2)" });
        });
    });
}

// ═══ REVIEW PHOTO UPLOAD ════════════════════════════════
let photoDataURL = null;

function initPhotoUpload() {
    const photoInput = document.getElementById('review-photo-input');
    const photoPreview = document.getElementById('review-photo-preview');
    if (!photoInput) return;
    photoInput.addEventListener('change', () => {
        const file = photoInput.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = e => {
            photoDataURL = e.target.result;
            photoPreview.src = photoDataURL;
            photoPreview.style.display = 'block';
            gsap.from(photoPreview, { scale: 0.8, opacity: 0, duration: 0.4, ease: "back.out(1.5)" });
        };
        reader.readAsDataURL(file);
    });
}

// ═══ SUBMIT REVIEW ══════════════════════════════════════
function initSubmitReview() {
    const btn = document.getElementById('submit-review-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const name = document.getElementById('review-name')?.value.trim();
        const text = document.getElementById('review-text')?.value.trim();
        if (!name || !text || selectedStars === 0) {
            gsap.to(sys.reviewSheet, { x: [-10, 10, -8, 8, 0], duration: 0.4 });
            return;
        }
        const review = { name, text, stars: selectedStars, photo: photoDataURL, date: new Date().toLocaleDateString('es-MX'), initial: name.charAt(0).toUpperCase() };
        const saved = JSON.parse(localStorage.getItem('kpops_reviews') || '[]');
        saved.unshift(review);
        localStorage.setItem('kpops_reviews', JSON.stringify(saved));

        btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> ¡Reseña enviada! 🎉';
        btn.disabled = true;
        gsap.to(btn, { scale: 1.03, duration: 0.2, yoyo: true, repeat: 1 });

        setTimeout(() => {
            renderDynamicReviews();
            closeModal();
            document.getElementById('review-name').value = '';
            document.getElementById('review-text').value = '';
            document.getElementById('review-photo-preview').style.display = 'none';
            photoDataURL = null;
            selectedStars = 0;
            document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active'));
            btn.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Enviar reseña';
            btn.disabled = false;
        }, 1500);
    });
}

// ═══ RENDER DYNAMIC REVIEWS (from localStorage) ══════════
function renderDynamicReviews() {
    const container = document.getElementById('dynamic-reviews');
    if (!container) return;
    const saved = JSON.parse(localStorage.getItem('kpops_reviews') || '[]');
    container.innerHTML = '';
    saved.forEach(r => {
        const stars = '★'.repeat(r.stars) + '☆'.repeat(5 - r.stars);
        const div = document.createElement('div');
        div.className = 'bg-white rounded-2xl p-4 border border-primary/10 shadow-sm';
        div.innerHTML = `
            <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
                <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:28px;height:28px;border-radius:50%;background:#f24a69;color:white;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:900;">${r.initial}</div>
                    <span style="font-size:12px;font-weight:800;">${r.name}</span>
                    <span style="font-size:10px;color:#9ca3af;">${r.date}</span>
                </div>
                <span style="color:#facc15;font-size:13px;">${stars}</span>
            </div>
            <p style="font-size:11px;line-height:1.6;color:rgba(58,36,27,0.75);font-style:italic;">"${r.text}"</p>
            ${r.photo ? `<img src="${r.photo}" style="width:48px;height:48px;object-fit:cover;border-radius:8px;margin-top:8px;border:1.5px solid rgba(242,74,105,0.3);" alt="foto"/>` : ''}
        `;
        container.appendChild(div);
        gsap.from(div, { y: 20, opacity: 0, duration: 0.5, ease: "back.out(1.2)" });
    });
}

// ═══ PAGE LOAD ANIMATIONS ═══════════════════════════════
function wrapWords() {
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) return;
    const words = heroTitle.textContent.split(' ');
    heroTitle.innerHTML = '';
    words.forEach((w, i) => {
        if (!w) return;
        const span = document.createElement('span');
        span.className = 'hero-title-word inline-block';
        span.textContent = w;
        heroTitle.appendChild(span);
        if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });
}

function initPageAnimations() {
    gsap.set('.hero-title-word', { y: 50, opacity: 0 });
    gsap.set('.hero-image', { scale: 1.12, filter: "blur(10px)" });
    gsap.set('.hero-chip', { scale: 0.8, opacity: 0, y: 20 });
    gsap.set('.hero-action', { opacity: 0, y: 25 });

    const tl = gsap.timeline({ delay: 0.1 });
    tl.to('.hero-image', { scale: 1, filter: "blur(0px)", duration: 1.4, ease: "premium" })
        .to('.hero-title-word', { y: 0, opacity: 1, stagger: 0.05, duration: 1, ease: "premium" }, "-=1.2")
        .to('.hero-chip', { scale: 1, opacity: 1, y: 0, stagger: 0.07, ease: "back.out(1.5)", duration: 0.7 }, "-=0.9")
        .to('.hero-action', { opacity: 1, y: 0, stagger: 0.1, duration: 0.7, ease: "premium" }, "-=0.7");
}

function initScrollAnimations() {
    // Cards near the top — no scroll-reveal on favoritos (caused opacity:0 stuck on mobile).
    // Just a lightweight entrance on the reviews section instead.
    ScrollTrigger.create({
        trigger: '.reviews-section',
        start: 'top bottom',
        onEnter: () => {
            gsap.from('.rm-card', {
                y: 20, opacity: 0, stagger: 0.05, duration: 0.6, ease: 'power2.out'
            });
        },
        once: true
    });
}

// ═══ MAGNETIC BUTTONS ═══════════════════════════════════
function initMagnetic() {
    document.querySelectorAll('.magnetic-btn').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) * 0.25;
            const y = (e.clientY - rect.top - rect.height / 2) * 0.25;
            gsap.to(btn, { x, y, duration: 0.6, ease: "power3.out" });
            const txt = btn.querySelector('.magnetic-text');
            if (txt) gsap.to(txt, { x: x * 0.4, y: y * 0.4, duration: 0.6, ease: "power3.out" });
        });
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
            const txt = btn.querySelector('.magnetic-text');
            if (txt) gsap.to(txt, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
        });
    });
}

// ═══ WIRE ALL BUTTONS ═══════════════════════════════════
function wireButtons() {
    document.querySelectorAll('.open-menu-btn').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(sys.menuSheet); }));
    document.querySelectorAll('.open-order-btn').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(sys.orderSheet); }));
    document.querySelectorAll('.open-review-btn').forEach(b => b.addEventListener('click', e => { e.preventDefault(); openModal(sys.reviewSheet); }));
    document.querySelectorAll('.close-modal-btn').forEach(b => b.addEventListener('click', e => { e.preventDefault(); closeModal(); }));
    sys.backdrop.addEventListener('click', closeModal);

    // Category radios update preview
    document.querySelectorAll('input[name="category"]').forEach(r => r.addEventListener('change', updateMsgPreview));
    document.getElementById('order-date')?.addEventListener('change', updateMsgPreview);
    document.getElementById('order-method')?.addEventListener('change', updateMsgPreview);
}

// ═══ Fix 5: SOCIAL PROOF TOAST ══════════════════════════
const socialProofData = [
    { name: 'Andrea M.', initial: 'A', product: 'Cakepops Red Velvet 🍭', time: 'hace 2 min' },
    { name: 'Pao G.', initial: 'P', product: 'Brownie Bites 🍫', time: 'hace 5 min' },
    { name: 'Karol V.', initial: 'K', product: 'Combo Especial 🎉', time: 'hace 8 min' },
    { name: 'Sofía L.', initial: 'S', product: 'Caja 6 Cakepops 🍭', time: 'hace 12 min' },
    { name: 'Daniela C.', initial: 'D', product: 'Cakepops Vainilla ✨', time: 'hace 15 min' },
    { name: 'Mariana R.', initial: 'M', product: 'Brownie Nutella 🤎', time: 'hace 18 min' },
    { name: 'Isa T.', initial: 'I', product: 'Pack 12 Cakepops 🍭', time: 'hace 20 min' },
    { name: 'Rebeca S.', initial: 'R', product: 'Combo Surtido M 🎀', time: 'hace 23 min' },
];

function initSocialProofToast() {
    const toast = document.getElementById('social-proof-toast');
    const avatarEl = document.getElementById('toast-avatar');
    const nameEl = document.getElementById('toast-name');
    const detailEl = document.getElementById('toast-detail');
    if (!toast) return;

    let idx = 0;

    function showToast() {
        const entry = socialProofData[idx % socialProofData.length];
        idx++;
        avatarEl.textContent = entry.initial;
        nameEl.textContent = entry.name;
        detailEl.textContent = `acaba de pedir ${entry.product} ${entry.time}`;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // First toast after 6 seconds, then every 10-14 seconds randomly
    setTimeout(() => {
        showToast();
        setInterval(() => {
            const delay = 10000 + Math.random() * 4000;
            setTimeout(showToast, delay);
        }, 14000);
    }, 6000);
}

// ═══ INIT ════════════════════════════════════════════════
window.addEventListener('load', () => {
    // Set initial modal state
    gsap.set([sys.menuSheet, sys.orderSheet, sys.reviewSheet], { y: "100%", display: 'none' });

    wrapWords();
    initPageAnimations();
    initScrollAnimations();
    initMagnetic();
    initMenuTabs();
    initOrderForm();
    initAddressAutocomplete();
    initStarRating();
    initPhotoUpload();
    initSubmitReview();
    wireButtons();
    initReviewStrips();
    renderDynamicReviews();
    toggleDeliverySection(); // set initial state of delivery vs pickup
    initSocialProofToast();

    // Start hero image cycling after a short delay
    setTimeout(() => {
        updateHeroDots(0);
        heroInterval = setInterval(cycleHeroImage, 3500);
    }, 2000);
});
