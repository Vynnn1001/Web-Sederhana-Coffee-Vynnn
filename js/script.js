// Panel sosial media responsif

const navbar = document.querySelector(".navbar");
const navbarNav = document.querySelector(".navbar-nav");
const hamburgerMenu = document.getElementById("hamburger-menu");
const sosmedPanel = document.getElementById("sosmed");
const sosmedLink = document.querySelector('.navbar-nav a[href="#sosmed"]');
const sosmedCloseBtn = document.getElementById("sosmed-close-btn");
const sosmedOverlay = sosmedPanel
  ? sosmedPanel.querySelector(".sosmed-sheet__overlay")
  : null;
const cartPanel = document.getElementById("cart-panel");
const cartToggleBtn = document.getElementById("shopping-cart");
const cartCloseBtn = document.getElementById("cart-close-btn");
const cartCheckoutBtn = document.getElementById("cart-checkout-btn");
const cartOverlay = cartPanel
  ? cartPanel.querySelector(".cart-sheet__overlay")
  : null;
const testimonialPanel = document.getElementById("testimonial-panel");
const testimonialToggleBtn = document.getElementById("testimonial-button");
const testimonialCloseBtn = document.getElementById("testimonial-close-btn");
const testimonialOverlay = testimonialPanel
  ? testimonialPanel.querySelector(".testimonial-sheet__overlay")
  : null;
const testimonialListEl = document.getElementById("testimonial-list");
const testimonialEmptyStateEl = document.getElementById(
  "testimonial-empty-state"
);
const testimonialForm = document.getElementById("testimonial-form");
const testimonialNameInput = document.getElementById("testimonial-name");
const testimonialRatingInput = document.getElementById("testimonial-rating");
const testimonialCommentInput = document.getElementById("testimonial-comment");
const testimonialPhotoInput = document.getElementById("testimonial-photo");
const testimonialPhotoPreview = document.getElementById(
  "testimonial-photo-preview"
);
let originalBodyPaddingRight = "";
let originalNavbarPaddingRight = "";
const aboutToggle = document.getElementById("about-toggle");
const aboutDetails = document.getElementById("about-story");
let bodyScrollLocked = false;
const cartListEl = document.getElementById("cart-list");
const cartSubtotalEl = document.getElementById("cart-subtotal");
const cartEmptyStateEl = cartListEl
  ? cartListEl.querySelector("[data-empty-state]")
  : null;
const cartToast = document.getElementById("cart-toast");
const cartToastMessage = document.getElementById("cart-toast-message");
const cartPaymentSelect = document.getElementById("cart-payment-method");
const cartShippingSelect = document.getElementById("cart-shipping-area");
const cartShippingEl = document.getElementById("cart-shipping");
const cartTotalEl = document.getElementById("cart-total");
const qtyModal = document.getElementById("qty-modal");
const qtyModalTitle = document.getElementById("qty-modal-title");
const qtyModalPrice = document.getElementById("qty-modal-price");
const qtyModalTotal = document.getElementById("qty-modal-total");
const qtyModalQty = document.getElementById("qty-modal-qty");
const qtyDecreaseBtn = document.getElementById("qty-modal-decrease");
const qtyIncreaseBtn = document.getElementById("qty-modal-increase");
const qtySubmitBtn = document.getElementById("qty-modal-submit");
const qtyPaymentSelect = document.getElementById("qty-modal-payment");
const qtyShippingSelect = document.getElementById("qty-modal-shipping");
const qtyShippingFeeEl = document.getElementById("qty-modal-shipping-fee");
const qtyGrandTotalEl = document.getElementById("qty-modal-grand-total");
const qtyModalCloseEls = qtyModal
  ? Array.from(qtyModal.querySelectorAll("[data-qty-close]"))
  : [];
const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
});
const whatsappNumber = "6285895779231";
let cartItems = [];
let cartToastTimer = null;
const paymentLabels = {
  COD: "Bayar di Tempat (COD)",
  DIGITAL: "Dompet Digital (Dana/OVO/GoPay)",
  TRANSFER: "Transfer Bank",
};
const shippingLabels = {
  CITY: "Dalam Kota",
  OUTSIDE: "Luar Kota",
};
const shippingFees = {
  CITY: 5000,
  OUTSIDE: 10000,
};
const menuAvailability = {
  Magic: "soldout",
  Affogato: "soldout",
  "Chicken Popcorn": "soldout",
};
const availabilityLabels = {
  available: "Tersedia",
  soldout: "Stok Habis",
};
const AVAILABLE_STATUS = "available";
const SOLD_OUT_STATUS = "soldout";
let selectedPaymentMethod = "COD";
let selectedShippingArea = "CITY";
const qtyModalState = {
  title: "",
  price: 0,
  qty: 1,
};
const testimonialDefaultPhoto = "img/menu/1-card.jpg";
const testimonials = [
  {
    id: "t1",
    name: "Nadia",
    rating: 5,
    comment:
      "Latte VanCafe selalu creamy dan manisnya pas. Tempatnya cozy banget!",
    photo: "img/menu/11-card.jpg",
    createdAt: "2025-01-05T08:10:00.000Z",
  },
  {
    id: "t2",
    name: "Raka",
    rating: 4,
    comment: "Baristanya ramah dan cold brew favoritku selalu konsisten.",
    photo: "img/menu/9-card.jpg",
    createdAt: "2025-01-10T10:00:00.000Z",
  },
];
const testimonialDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const MAX_TESTIMONIAL_PHOTO_SIZE = 2 * 1024 * 1024;

const getCartSubtotal = () =>
  cartItems.reduce((total, item) => total + item.price * item.qty, 0);

const normalizeShippingValue = (value) =>
  Object.prototype.hasOwnProperty.call(shippingFees, value) ? value : "CITY";

const getShippingFee = (value = selectedShippingArea) =>
  shippingFees[normalizeShippingValue(value)];

function updateCartSummaryTotals() {
  const subtotal = getCartSubtotal();
  const hasItems = cartItems.length > 0;
  const shippingFee = hasItems ? getShippingFee() : 0;
  if (cartSubtotalEl) {
    cartSubtotalEl.textContent = formatCurrency(subtotal);
  }
  if (cartShippingEl) {
    cartShippingEl.textContent = formatCurrency(shippingFee);
  }
  if (cartTotalEl) {
    cartTotalEl.textContent = formatCurrency(subtotal + shippingFee);
  }
}

function lockBodyScroll(bodyClass) {
  document.body.classList.add(bodyClass);
  if (bodyScrollLocked) return;
  const scrollbarCompensation =
    window.innerWidth - document.documentElement.clientWidth;
  if (scrollbarCompensation > 0) {
    originalBodyPaddingRight = document.body.style.paddingRight;
    document.body.style.paddingRight = `${scrollbarCompensation}px`;
    if (navbar) {
      originalNavbarPaddingRight = navbar.style.paddingRight;
      const currentNavPadding = parseFloat(
        window.getComputedStyle(navbar).paddingRight
      );
      navbar.style.paddingRight = `${
        (isNaN(currentNavPadding) ? 0 : currentNavPadding) +
        scrollbarCompensation
      }px`;
    }
  }
  bodyScrollLocked = true;
}

function unlockBodyScroll(bodyClass) {
  document.body.classList.remove(bodyClass);
  if (
    document.body.classList.contains("sosmed-open") ||
    document.body.classList.contains("cart-open") ||
    document.body.classList.contains("qty-open") ||
    document.body.classList.contains("testimonial-open")
  ) {
    return;
  }
  document.body.style.paddingRight = originalBodyPaddingRight || "";
  if (navbar) {
    navbar.style.paddingRight = originalNavbarPaddingRight || "";
  }
  bodyScrollLocked = false;
}

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const parsePrice = (text) =>
  Number(String(text || "").replace(/[^0-9]/g, "")) || 0;

const findCardByTitle = (title) => {
  return (
    Array.from(document.querySelectorAll(".menu-card")).find(
      (card) =>
        card.querySelector(".menu-card-title")?.innerText.trim() === title
    ) || null
  );
};

const normalizeAvailability = (value) =>
  value === SOLD_OUT_STATUS ? SOLD_OUT_STATUS : AVAILABLE_STATUS;

const isCardSoldOut = (card) =>
  (card?.dataset?.status || AVAILABLE_STATUS) === SOLD_OUT_STATUS;

function applyAvailabilityBadges() {
  document.querySelectorAll(".menu-card").forEach((card) => {
    const title = card.querySelector(".menu-card-title")?.innerText.trim();
    const normalized = normalizeAvailability(
      (title && menuAvailability[title]) || card.dataset.status
    );
    card.dataset.status = normalized;
    let badge = card.querySelector(".menu-card__badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "menu-card__badge";
      badge.setAttribute("aria-live", "polite");
      card.prepend(badge);
    }
    badge.textContent = availabilityLabels[normalized] || "";
    badge.setAttribute("data-availability", normalized);
    const soldOut = normalized === SOLD_OUT_STATUS;
    card.classList.toggle("menu-card--soldout", soldOut);
    const actionButtons = card.querySelectorAll(".btn-buy, .add-cart");
    actionButtons.forEach((btn) => {
      if (soldOut) {
        btn.setAttribute("disabled", "disabled");
        btn.setAttribute("aria-disabled", "true");
      } else {
        btn.removeAttribute("disabled");
        btn.removeAttribute("aria-disabled");
      }
    });
  });
}

function syncCardState(title) {
  const card = findCardByTitle(title);
  if (!card) return;
  const addBtn = card.querySelector(".add-cart");
  const inCart = cartItems.some((item) => item.title === title);
  card.classList.toggle("in-cart", inCart);
  if (addBtn) {
    addBtn.classList.toggle("added", inCart);
  }
}

const renderTestimonialStars = (ratingValue = 5) => {
  const maxStars = 5;
  let markup = "";
  for (let i = 0; i < maxStars; i += 1) {
    const isFilled = i < ratingValue;
    markup += `<span aria-hidden="true" class="${
      isFilled ? "is-filled" : ""
    }">${isFilled ? "★" : "☆"}</span>`;
  }
  return markup;
};

const formatTestimonialDate = (value) => {
  try {
    return testimonialDateFormatter.format(new Date(value));
  } catch (error) {
    return testimonialDateFormatter.format(new Date());
  }
};

function renderTestimonials() {
  if (!testimonialListEl) return;
  testimonialListEl.innerHTML = "";
  if (!testimonials.length) {
    if (testimonialEmptyStateEl)
      testimonialEmptyStateEl.style.display = "block";
    return;
  }
  if (testimonialEmptyStateEl) testimonialEmptyStateEl.style.display = "none";
  testimonials.forEach((item) => {
    const li = document.createElement("li");
    li.className = "testimonial-card";
    const media = document.createElement("div");
    media.className = "testimonial-card__media";
    const img = document.createElement("img");
    img.src = item.photo || testimonialDefaultPhoto;
    img.alt = `Foto ${item.name}`;
    img.loading = "lazy";
    media.appendChild(img);
    const content = document.createElement("div");
    content.className = "testimonial-card__content";
    const header = document.createElement("div");
    header.className = "testimonial-card__header";
    const nameEl = document.createElement("strong");
    nameEl.textContent = item.name;
    const timeEl = document.createElement("time");
    const createdAt = item.createdAt || new Date().toISOString();
    timeEl.dateTime = createdAt;
    timeEl.textContent = formatTestimonialDate(createdAt);
    header.append(nameEl, timeEl);
    const starsEl = document.createElement("div");
    starsEl.className = "testimonial-stars";
    const ratingValue = Math.round(
      Math.min(5, Math.max(1, Number(item.rating) || 5))
    );
    starsEl.setAttribute("aria-label", `${ratingValue} dari 5 bintang`);
    starsEl.innerHTML = renderTestimonialStars(ratingValue);
    const commentEl = document.createElement("p");
    commentEl.textContent = item.comment;
    content.append(header, starsEl, commentEl);
    li.append(media, content);
    testimonialListEl.appendChild(li);
  });
}

function setTestimonialPreview(src) {
  if (!testimonialPhotoPreview) return;
  if (src) {
    testimonialPhotoPreview.dataset.previewSrc = src;
    testimonialPhotoPreview.innerHTML = `<img src="${src}" alt="Pratinjau foto testimoni" loading="lazy" />`;
  } else {
    delete testimonialPhotoPreview.dataset.previewSrc;
    testimonialPhotoPreview.innerHTML = "<p>Belum ada foto dipilih.</p>";
  }
}

const resetTestimonialPreview = () => setTestimonialPreview("");

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function renderCart() {
  if (!cartListEl) return;
  cartListEl
    .querySelectorAll("li.cart-item")
    .forEach((itemEl) => itemEl.remove());

  if (!cartItems.length) {
    if (cartEmptyStateEl) cartEmptyStateEl.style.display = "block";
  } else if (cartEmptyStateEl) {
    cartEmptyStateEl.style.display = "none";
  }

  cartItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.dataset.id = item.id;
    li.innerHTML = `
      <div class="cart-item__info">
        <strong>${item.title}</strong>
        <small>${formatCurrency(item.price)} / item</small>
      </div>
      <div class="cart-item__controls">
        <div class="cart-item__qty-control">
          <button type="button" class="cart-item__btn" data-action="decrease" aria-label="Kurangi jumlah">-</button>
          <span class="cart-item__qty">${item.qty}</span>
          <button type="button" class="cart-item__btn" data-action="increase" aria-label="Tambah jumlah">+</button>
        </div>
        <div class="cart-item__price">${formatCurrency(
          item.price * item.qty
        )}</div>
        <button type="button" class="cart-item__btn cart-item__btn--remove" data-action="remove" aria-label="Hapus item">&times;</button>
      </div>
    `;
    cartListEl.appendChild(li);
  });

  updateCartSummaryTotals();
}

function upsertCartItem(title, price, qty) {
  const existing = cartItems.find(
    (item) => item.title === title && item.price === price
  );
  if (existing) {
    existing.qty += qty;
  } else {
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    cartItems.push({ id, title, price, qty });
  }
  renderCart();
  syncCardState(title);
}

function removeCartItem(id) {
  const idx = cartItems.findIndex((item) => item.id === id);
  if (idx === -1) return;
  const [removed] = cartItems.splice(idx, 1);
  renderCart();
  if (removed) syncCardState(removed.title);
}

function updateCartItemQuantity(id, delta) {
  const item = cartItems.find((entry) => entry.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeCartItem(id);
    return;
  }
  renderCart();
}

function getMenuCardInfo(card) {
  const title = card.querySelector(".menu-card-title")?.innerText.trim() || "";
  const priceText = card.querySelector(".menu-card-price")?.innerText || "";
  return { title, price: parsePrice(priceText) };
}

function buildWhatsAppMessage(
  lines,
  subtotal,
  heading = "Halo VanCafe! Saya ingin pesan:",
  paymentLabel,
  shippingArea
) {
  const normalizedArea = normalizeShippingValue(
    shippingArea || selectedShippingArea
  );
  const shippingLabel = shippingLabels[normalizedArea];
  const shippingFee = getShippingFee(normalizedArea);
  const grandTotal = subtotal + shippingFee;
  const parts = [heading, "", "Nama :", "Alamat :", "Estimasi tiba :", ""];
  if (paymentLabel) {
    parts.push(`Metode pembayaran: ${paymentLabel}`, "");
  }
  parts.push(
    `Area pengiriman: ${shippingLabel}`,
    `Ongkir: ${formatCurrency(shippingFee)}`,
    ""
  );
  parts.push(
    "Pesanan :",
    ...lines,
    `Subtotal: ${formatCurrency(subtotal)}`,
    `Grand total: ${formatCurrency(grandTotal)}`,
    "",
    "Terima kasih!"
  );
  return parts.join("\n");
}

function openWhatsAppWithOrder(
  lines,
  subtotal,
  heading,
  paymentValue,
  shippingValue
) {
  const methodValue = normalizePaymentValue(
    paymentValue || selectedPaymentMethod
  );
  const normalizedShipping = normalizeShippingValue(
    shippingValue || selectedShippingArea
  );
  const message = buildWhatsAppMessage(
    lines,
    subtotal,
    heading,
    paymentLabels[methodValue],
    normalizedShipping
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
  window.open(waUrl, "_blank");
}

function handleAddToCart(card) {
  if (isCardSoldOut(card)) {
    alert("Maaf, stok menu ini sedang habis. Silakan pilih menu lainnya.");
    return;
  }
  const { title, price } = getMenuCardInfo(card);
  if (!title || price <= 0) {
    alert("Gagal menambahkan menu. Silakan coba lagi.");
    return;
  }
  upsertCartItem(title, price, 1);
  showCartToast(title);
}

function showCartToast(title) {
  if (!cartToast || !cartToastMessage) return;
  cartToastMessage.textContent = `${title} berhasil ditambahkan.`;
  cartToast.classList.add("is-visible");
  if (cartToastTimer) {
    clearTimeout(cartToastTimer);
  }
  cartToastTimer = setTimeout(() => {
    cartToast.classList.remove("is-visible");
  }, 2200);
}

const normalizePaymentValue = (value) =>
  Object.prototype.hasOwnProperty.call(paymentLabels, value) ? value : "COD";

function setSelectedPaymentMethod(value, sourceSelect) {
  const normalized = normalizePaymentValue(value);
  selectedPaymentMethod = normalized;
  if (cartPaymentSelect && sourceSelect !== cartPaymentSelect) {
    cartPaymentSelect.value = normalized;
  }
  if (qtyPaymentSelect && sourceSelect !== qtyPaymentSelect) {
    qtyPaymentSelect.value = normalized;
  }
}

setSelectedPaymentMethod(selectedPaymentMethod);

function setSelectedShippingArea(value, sourceSelect) {
  const normalized = normalizeShippingValue(value);
  selectedShippingArea = normalized;
  if (cartShippingSelect && sourceSelect !== cartShippingSelect) {
    cartShippingSelect.value = normalized;
  }
  if (qtyShippingSelect && sourceSelect !== qtyShippingSelect) {
    qtyShippingSelect.value = normalized;
  }
  updateCartSummaryTotals();
  updateQtyModalDisplay();
}

setSelectedShippingArea(selectedShippingArea);

if (testimonialListEl) {
  renderTestimonials();
}

if (testimonialPhotoPreview) {
  resetTestimonialPreview();
}

if (cartPaymentSelect) {
  cartPaymentSelect.addEventListener("change", (event) => {
    setSelectedPaymentMethod(event.target.value, cartPaymentSelect);
  });
}

if (qtyPaymentSelect) {
  qtyPaymentSelect.addEventListener("change", (event) => {
    setSelectedPaymentMethod(event.target.value, qtyPaymentSelect);
  });
}

if (cartShippingSelect) {
  cartShippingSelect.addEventListener("change", (event) => {
    setSelectedShippingArea(event.target.value, cartShippingSelect);
  });
}

if (qtyShippingSelect) {
  qtyShippingSelect.addEventListener("change", (event) => {
    setSelectedShippingArea(event.target.value, qtyShippingSelect);
  });
}

const isQtyModalOpen = () =>
  Boolean(qtyModal && qtyModal.classList.contains("is-open"));

function updateQtyModalDisplay() {
  const itemsTotal = qtyModalState.price * qtyModalState.qty;
  const shippingFee = getShippingFee();
  const grandTotal = itemsTotal + shippingFee;
  if (qtyModalQty) qtyModalQty.textContent = String(qtyModalState.qty);
  if (qtyModalPrice)
    qtyModalPrice.textContent = formatCurrency(qtyModalState.price);
  if (qtyModalTotal) qtyModalTotal.textContent = formatCurrency(itemsTotal);
  if (qtyShippingFeeEl)
    qtyShippingFeeEl.textContent = formatCurrency(shippingFee);
  if (qtyGrandTotalEl) qtyGrandTotalEl.textContent = formatCurrency(grandTotal);
}

function openQuantityModal(title, price) {
  if (!qtyModal) return;
  if (isCartOpen()) closeCartPanel();
  if (isSosmedOpen()) closeSosmedPanel();
  qtyModalState.title = title;
  qtyModalState.price = price;
  qtyModalState.qty = 1;
  if (qtyModalTitle) qtyModalTitle.textContent = title;
  updateQtyModalDisplay();
  setSelectedPaymentMethod(selectedPaymentMethod);
  qtyModal.classList.add("is-open");
  qtyModal.setAttribute("aria-hidden", "false");
  lockBodyScroll("qty-open");
  setTimeout(() => {
    if (qtySubmitBtn) qtySubmitBtn.focus();
  }, 120);
}

function closeQuantityModal() {
  if (!isQtyModalOpen()) return;
  qtyModal.classList.remove("is-open");
  qtyModal.setAttribute("aria-hidden", "true");
  unlockBodyScroll("qty-open");
}

function adjustQtyModalQty(delta) {
  const nextValue = Math.min(99, Math.max(1, qtyModalState.qty + delta));
  qtyModalState.qty = nextValue;
  updateQtyModalDisplay();
}

function handleBuyNow(card) {
  if (isCardSoldOut(card)) {
    alert("Maaf, stok menu ini sedang habis. Silakan pilih menu lainnya.");
    return;
  }
  const { title, price } = getMenuCardInfo(card);
  if (!title || price <= 0) {
    alert("Gagal menambahkan menu. Silakan coba lagi.");
    return;
  }
  openQuantityModal(title, price);
}

if (qtyDecreaseBtn) {
  qtyDecreaseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    adjustQtyModalQty(-1);
  });
}

if (qtyIncreaseBtn) {
  qtyIncreaseBtn.addEventListener("click", (event) => {
    event.preventDefault();
    adjustQtyModalQty(1);
  });
}

qtyModalCloseEls.forEach((el) => {
  el.addEventListener("click", (event) => {
    event.preventDefault();
    closeQuantityModal();
  });
});

if (qtySubmitBtn) {
  qtySubmitBtn.addEventListener("click", (event) => {
    event.preventDefault();
    if (!qtyModalState.title || qtyModalState.price <= 0) return;
    const qty = qtyModalState.qty;
    const paymentValue = qtyPaymentSelect
      ? qtyPaymentSelect.value
      : selectedPaymentMethod;
    setSelectedPaymentMethod(paymentValue, qtyPaymentSelect);
    const shippingValue = qtyShippingSelect
      ? qtyShippingSelect.value
      : selectedShippingArea;
    setSelectedShippingArea(shippingValue, qtyShippingSelect);
    const line = `${qtyModalState.title} x${qty} - ${formatCurrency(
      qtyModalState.price * qty
    )}`;
    openWhatsAppWithOrder(
      [line],
      qtyModalState.price * qty,
      "Halo VanCafe! Saya ingin pesan langsung:",
      paymentValue,
      shippingValue
    );
    closeQuantityModal();
  });
}

if (cartListEl) {
  cartListEl.addEventListener("click", (event) => {
    const btn = event.target.closest(".cart-item__btn");
    if (!btn) return;
    event.preventDefault();
    const action = btn.dataset.action;
    const cartItemEl = btn.closest(".cart-item");
    if (!action || !cartItemEl) return;
    const { id } = cartItemEl.dataset;
    if (!id) return;
    if (action === "increase") {
      updateCartItemQuantity(id, 1);
    } else if (action === "decrease") {
      updateCartItemQuantity(id, -1);
    } else if (action === "remove") {
      removeCartItem(id);
    }
  });
}

const isSosmedOpen = () =>
  Boolean(sosmedPanel && sosmedPanel.classList.contains("active"));

const isCartOpen = () =>
  Boolean(cartPanel && cartPanel.classList.contains("active"));

const isTestimonialOpen = () =>
  Boolean(testimonialPanel && testimonialPanel.classList.contains("active"));

function openTestimonialPanel() {
  if (!testimonialPanel) return;
  if (isCartOpen()) {
    closeCartPanel();
  }
  if (isSosmedOpen()) {
    closeSosmedPanel();
  }
  if (isQtyModalOpen()) {
    closeQuantityModal();
  }
  testimonialPanel.classList.add("active");
  testimonialPanel.setAttribute("aria-hidden", "false");
  lockBodyScroll("testimonial-open");
  navbarNav.classList.remove("active");
}

function closeTestimonialPanel() {
  if (!isTestimonialOpen()) return;
  testimonialPanel.classList.remove("active");
  testimonialPanel.setAttribute("aria-hidden", "true");
  unlockBodyScroll("testimonial-open");
}

function openCartPanel() {
  if (!cartPanel) return;
  if (isSosmedOpen()) {
    closeSosmedPanel();
  }
  if (isTestimonialOpen()) {
    closeTestimonialPanel();
  }
  cartPanel.classList.add("active");
  cartPanel.setAttribute("aria-hidden", "false");
  lockBodyScroll("cart-open");
  navbarNav.classList.remove("active");
}

function closeCartPanel() {
  if (!isCartOpen()) return;
  cartPanel.classList.remove("active");
  cartPanel.setAttribute("aria-hidden", "true");
  unlockBodyScroll("cart-open");
}

function openSosmedPanel() {
  if (!sosmedPanel) return;
  if (isCartOpen()) {
    closeCartPanel();
  }
  if (isTestimonialOpen()) {
    closeTestimonialPanel();
  }
  sosmedPanel.classList.add("active");
  sosmedPanel.setAttribute("aria-hidden", "false");
  lockBodyScroll("sosmed-open");
  navbarNav.classList.remove("active");
}

function closeSosmedPanel() {
  if (!isSosmedOpen()) return;
  sosmedPanel.classList.remove("active");
  sosmedPanel.setAttribute("aria-hidden", "true");
  unlockBodyScroll("sosmed-open");
}

if (sosmedLink && sosmedPanel) {
  sosmedLink.addEventListener("click", function (e) {
    e.preventDefault();
    if (isSosmedOpen()) {
      closeSosmedPanel();
    } else {
      openSosmedPanel();
    }
  });
}

if (cartToggleBtn && cartPanel) {
  cartToggleBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (isCartOpen()) {
      closeCartPanel();
    } else {
      openCartPanel();
    }
  });
}

if (testimonialToggleBtn && testimonialPanel) {
  testimonialToggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (isTestimonialOpen()) {
      closeTestimonialPanel();
    } else {
      openTestimonialPanel();
    }
  });
}

[sosmedCloseBtn, sosmedOverlay].forEach((el) => {
  if (!el) return;
  el.addEventListener("click", (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    closeSosmedPanel();
  });
});

[cartCloseBtn, cartOverlay].forEach((el) => {
  if (!el) return;
  el.addEventListener("click", (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    closeCartPanel();
  });
});

[testimonialCloseBtn, testimonialOverlay].forEach((el) => {
  if (!el) return;
  el.addEventListener("click", (e) => {
    if (e && typeof e.preventDefault === "function") e.preventDefault();
    closeTestimonialPanel();
  });
});

if (cartCheckoutBtn) {
  cartCheckoutBtn.addEventListener("click", () => {
    if (!cartItems.length) {
      alert("Keranjang masih kosong. Tambahkan item terlebih dahulu.");
      return;
    }
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.qty,
      0
    );
    const paymentValue = cartPaymentSelect
      ? cartPaymentSelect.value
      : selectedPaymentMethod;
    setSelectedPaymentMethod(paymentValue, cartPaymentSelect);
    const shippingValue = cartShippingSelect
      ? cartShippingSelect.value
      : selectedShippingArea;
    setSelectedShippingArea(shippingValue, cartShippingSelect);
    const lines = cartItems.map(
      (item, index) =>
        `${index + 1}. ${item.title} x${item.qty} - ${formatCurrency(
          item.price * item.qty
        )}`
    );
    openWhatsAppWithOrder(
      lines,
      subtotal,
      undefined,
      paymentValue,
      shippingValue
    );
  });
}

if (testimonialPhotoInput) {
  testimonialPhotoInput.addEventListener("change", async () => {
    const file = testimonialPhotoInput.files?.[0];
    if (!file) {
      resetTestimonialPreview();
      return;
    }
    if (file.size > MAX_TESTIMONIAL_PHOTO_SIZE) {
      alert("Ukuran foto maksimal 2MB, ya!");
      testimonialPhotoInput.value = "";
      resetTestimonialPreview();
      return;
    }
    try {
      const previewSrc = await readFileAsDataURL(file);
      setTestimonialPreview(previewSrc);
    } catch (error) {
      console.error("Gagal membaca foto testimoni", error);
      resetTestimonialPreview();
    }
  });
}

if (testimonialForm) {
  testimonialForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const name = testimonialNameInput?.value.trim();
    const comment = testimonialCommentInput?.value.trim();
    const rating = Math.min(
      5,
      Math.max(1, Number(testimonialRatingInput?.value) || 5)
    );
    if (!name || !comment) {
      alert("Lengkapi nama dan komentar terlebih dahulu.");
      return;
    }
    let photoSrc =
      testimonialPhotoPreview?.dataset.previewSrc || testimonialDefaultPhoto;
    const file = testimonialPhotoInput?.files?.[0];
    if (file) {
      if (file.size > MAX_TESTIMONIAL_PHOTO_SIZE) {
        alert("Ukuran foto maksimal 2MB, ya!");
        return;
      }
      try {
        photoSrc = await readFileAsDataURL(file);
      } catch (error) {
        console.error("Gagal memuat foto testimoni", error);
        photoSrc = testimonialDefaultPhoto;
      }
    }
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    testimonials.unshift({
      id,
      name,
      comment,
      rating,
      photo: photoSrc || testimonialDefaultPhoto,
      createdAt: new Date().toISOString(),
    });
    renderTestimonials();
    testimonialForm.reset();
    resetTestimonialPreview();
  });
}

if (aboutToggle && aboutDetails) {
  const updateAboutState = (isOpen) => {
    aboutToggle.setAttribute("aria-expanded", String(isOpen));
    aboutDetails.setAttribute("aria-hidden", String(!isOpen));
    aboutDetails.classList.toggle("is-open", isOpen);
    aboutDetails.classList.toggle("is-collapsed", !isOpen);
    aboutToggle.textContent = isOpen
      ? "Sembunyikan cerita"
      : "Baca cerita kami";
  };

  updateAboutState(false);

  aboutToggle.addEventListener("click", () => {
    const currentlyOpen = aboutDetails.classList.contains("is-open");
    updateAboutState(!currentlyOpen);
  });
}
// toggle class active untuk hamburger menu
// Sudah dideklarasikan di atas
// ketika hamburger menu di klik
document.querySelector("#hamburger-menu").onclick = (e) => {
  e.preventDefault();
  navbarNav.classList.toggle("active");
};

// search (minimalist with suggestions)
const searchForm = document.querySelector(".search-form");
const searchBox = document.querySelector("#search-box");
const searchButton = document.querySelector("#search-button");
const searchClose = document.querySelector("#search-close");
const suggestionsEl = document.getElementById("search-suggestions");

let menuItems = Array.from(
  document.querySelectorAll(".menu-card .menu-card-title")
).map((el) => ({
  text: el.innerText.trim(),
  card: el.closest(".menu-card"),
}));

function openSearch() {
  searchForm.setAttribute("aria-hidden", "false");
  searchForm.classList.add("active");
  setTimeout(() => searchBox.focus(), 80);
}

function closeSearch() {
  searchForm.setAttribute("aria-hidden", "true");
  searchForm.classList.remove("active");
  suggestionsEl.innerHTML = "";
}

searchButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (searchForm.classList.contains("active")) closeSearch();
  else openSearch();
});

searchClose &&
  searchClose.addEventListener("click", function (e) {
    e.preventDefault();
    closeSearch();
  });

// debounce helper
function debounce(fn, wait) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

let currentIndex = -1;

function renderSuggestions(results, query) {
  suggestionsEl.innerHTML = "";
  if (!results.length) {
    suggestionsEl.style.display = "none";
    return;
  }
  suggestionsEl.style.display = "block";
  results.forEach((r, i) => {
    const li = document.createElement("li");
    li.setAttribute("role", "option");
    li.setAttribute("data-index", i);
    // Ambil gambar dari menu-card
    const imgEl = r.card.querySelector(".menu-card-img");
    const imgSrc = imgEl ? imgEl.getAttribute("src") : "";
    const imgAlt = imgEl ? imgEl.getAttribute("alt") : "";
    li.innerHTML =
      `<span class='suggestion-img-wrap'><img src='${imgSrc}' alt='${imgAlt}' class='suggestion-img'></span> ` +
      r.text.replace(new RegExp(query, "ig"), (m) => `<strong>${m}</strong>`);
    li.addEventListener("click", () => {
      r.card.scrollIntoView({ behavior: "smooth", block: "center" });
      r.card.click();
      closeSearch();
    });
    suggestionsEl.appendChild(li);
  });
}

const doSearch = debounce(function () {
  const q = searchBox.value.trim();
  currentIndex = -1;
  if (!q) return renderSuggestions([], q);
  const results = menuItems
    .filter((m) => m.text.toLowerCase().includes(q.toLowerCase()))
    .slice(0, 8);
  renderSuggestions(results, q);
}, 180);

searchBox.addEventListener("input", doSearch);

searchBox.addEventListener("keydown", function (e) {
  const items = Array.from(suggestionsEl.querySelectorAll("li"));
  if (!items.length) return;
  if (e.key === "ArrowDown") {
    e.preventDefault();
    currentIndex = Math.min(currentIndex + 1, items.length - 1);
    items.forEach((it, idx) =>
      it.setAttribute("aria-selected", idx === currentIndex)
    );
    items[currentIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    currentIndex = Math.max(currentIndex - 1, 0);
    items.forEach((it, idx) =>
      it.setAttribute("aria-selected", idx === currentIndex)
    );
    items[currentIndex].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") {
    e.preventDefault();
    if (currentIndex >= 0 && items[currentIndex]) items[currentIndex].click();
  } else if (e.key === "Escape") {
    closeSearch();
  }
});

// klik di luar untuk menutup nav dan search
const hm = document.querySelector("#hamburger-menu");

document.addEventListener("click", function (e) {
  if (hm && !hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove("active");
  }
  if (
    searchForm &&
    !searchForm.contains(e.target) &&
    !searchButton.contains(e.target)
  ) {
    closeSearch();
  }
});

// sosmed feature removed (event handling cleaned up)

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (searchForm && searchForm.classList.contains("active")) {
      closeSearch();
    }
    if (isSosmedOpen()) {
      closeSosmedPanel();
    }
    if (isCartOpen()) {
      closeCartPanel();
    }
    if (isQtyModalOpen()) {
      closeQuantityModal();
    }
    if (isTestimonialOpen()) {
      closeTestimonialPanel();
    }
  }
});

// Popup feature removed: popup HTML/CSS/JS cleaned up to avoid affecting other code

applyAvailabilityBadges();

// Card action handlers: buy and add-to-cart (simple feedback)
document.querySelectorAll(".menu-card").forEach((card) => {
  const buy = card.querySelector(".btn-buy");
  const add = card.querySelector(".add-cart");

  if (buy) {
    buy.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleBuyNow(card);
    });
  }

  if (add) {
    add.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      handleAddToCart(card);
    });
  }
  // spotlight hover: blur background except this card
  card.addEventListener("mouseenter", () => {
    document.body.classList.add("spotlight");
    card.classList.add("spotlight-active");
  });
  card.addEventListener("mouseleave", () => {
    document.body.classList.remove("spotlight");
    card.classList.remove("spotlight-active");
  });
});
