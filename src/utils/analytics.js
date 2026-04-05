// ============================================================
// Akupy Analytics — Google Analytics 4 event helpers
// GA4 Measurement ID: G-REPLACE_ME
// → Replace G-REPLACE_ME in index.html with your real GA4 ID
//   from https://analytics.google.com
// ============================================================

/**
 * Fire a GA4 event. Safe to call even if gtag is not loaded.
 * @param {string} eventName - GA4 event name
 * @param {object} params - event parameters
 */
export function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

/** Track a page view (called on route change) */
export function trackPageView(path, title) {
  trackEvent('page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/** Track successful user signup */
export function trackSignup(method = 'email') {
  trackEvent('sign_up', { method });
}

/** Track successful user login */
export function trackLogin(method = 'email') {
  trackEvent('login', { method });
}

/** Track product detail page view */
export function trackProductView(productId, productName, category, price) {
  trackEvent('view_item', {
    currency: 'INR',
    value: price,
    items: [{
      item_id: productId,
      item_name: productName,
      item_category: category,
      price,
    }],
  });
}

/** Track add-to-cart action */
export function trackAddToCart(productId, productName, price, quantity = 1) {
  trackEvent('add_to_cart', {
    currency: 'INR',
    value: price * quantity,
    items: [{
      item_id: productId,
      item_name: productName,
      price,
      quantity,
    }],
  });
}

/** Track purchase completion */
export function trackPurchase(orderId, orderTotal, items = []) {
  trackEvent('purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: orderTotal,
    items: items.map((item) => ({
      item_id: item._id || item.productId,
      item_name: item.name || item.productTitle,
      price: item.price,
      quantity: item.quantity || 1,
    })),
  });
}

/** Track search */
export function trackSearch(searchTerm) {
  trackEvent('search', { search_term: searchTerm });
}
