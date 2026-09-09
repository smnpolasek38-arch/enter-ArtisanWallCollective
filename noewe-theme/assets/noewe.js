/* ============================================================
   Noewe — theme scripts
   ============================================================ */
(function () {
  'use strict';

  var FREE_SHIPPING_THRESHOLD = Number(document.body.dataset.freeShipping || 75);
  var CART_NOTE = document.body.dataset.cartNote || '';

  /* ---------- Helpers ---------- */
  function money(value) {
    var cents = Math.round(Number(value || 0));
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
    }).format(cents / 100);
  }

  function esc(str) {
    var div = document.createElement('div');
    div.textContent = str == null ? '' : String(str);
    return div.innerHTML;
  }

  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ---------- Icons (inline, lucide-style) ---------- */
  var ICONS = {
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    arrowRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  };

  function starIcon() {
    return (
      '<span class="star"><svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"><path d="M12 2.5l3.09 6.26 6.91 1-5 4.87 1.18 6.88L12 17.77l-6.18 3.24L7 14.63l-5-4.87 6.91-1z"/></svg></span>'
    );
  }

  function ratingStars(rating) {
    var out = '';
    for (var i = 1; i <= 5; i++) {
      out += i <= rating ? starIcon() : starIcon().replace('fill="currentColor"', 'fill="none"');
    }
    return out;
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    var openBtn = document.querySelector('[data-menu-open]');
    var menu = document.querySelector('[data-mobile-menu]');
    var closeBtn = menu && menu.querySelector('[data-menu-close]');
    var body = document.body;

    if (!openBtn || !menu) return;

    function openMenu() {
      menu.classList.add('is-open');
      body.classList.add('menu-open');
      document.addEventListener('keydown', onKey);
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      body.classList.remove('menu-open');
      document.removeEventListener('keydown', onKey);
    }

    function onKey(e) {
      if (e.key === 'Escape') closeMenu();
    }

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    menu.querySelectorAll('[data-menu-link]').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------- FAQ accordion ---------- */
  function initAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(function (root) {
      root.querySelectorAll('[data-accordion-button]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var item = btn.closest('.accordion__item');
          var wasOpen = item.classList.contains('is-open');
          // Close siblings (single-open behavior)
          root.querySelectorAll('.accordion__item.is-open').forEach(function (other) {
            if (other !== item) {
              other.classList.remove('is-open');
              other.querySelector('button').setAttribute('aria-expanded', 'false');
            }
          });
          item.classList.toggle('is-open', !wasOpen);
          btn.setAttribute('aria-expanded', String(!wasOpen));
        });
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach(function (el, i) {
      el.style.setProperty('--reveal-delay', (el.dataset.revealDelay || 0) + 'ms');
      io.observe(el);
    });
  }

  /* ---------- Horizontal sliders ---------- */
  function initSliders() {
    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var track = slider.querySelector('[data-slider-track]');
      var prev = slider.querySelector('[data-slider-prev]');
      var next = slider.querySelector('[data-slider-next]');
      if (!track || !next || !prev) return;
      var step = function () {
        var slide = track.querySelector('.slider__slide');
        return slide ? slide.getBoundingClientRect().width + 16 : 300;
      };
      next.addEventListener('click', function () {
        track.scrollBy({ left: step(), behavior: 'smooth' });
      });
      prev.addEventListener('click', function () {
        track.scrollBy({ left: -step(), behavior: 'smooth' });
      });
    });
  }

  /* ---------- Cart drawer ---------- */
  var CartDrawer = {
    el: null,
    backdrop: null,
    body: null,

    init: function () {
      this.el = document.querySelector('[data-cart-drawer]');
      this.backdrop = document.querySelector('[data-cart-backdrop]');
      this.body = document.body;
      if (!this.el) return;

      this.el.querySelector('[data-cart-close]') &&
        this.el.querySelector('[data-cart-close]').addEventListener('click', this.close.bind(this));
      this.backdrop && this.backdrop.addEventListener('click', this.close.bind(this));

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && CartDrawer.el.classList.contains('is-open')) CartDrawer.close();
      });

      document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
          e.preventDefault();
          CartDrawer.open();
        });
      });

      this.refresh();
    },

    open: function () {
      this.el.classList.add('is-open');
      this.backdrop.classList.add('is-visible');
      this.body.classList.add('cart-open');
    },

    close: function () {
      this.el.classList.remove('is-open');
      this.backdrop.classList.remove('is-visible');
      this.body.classList.remove('cart-open');
    },

    fetch: function (url, opts) {
      return fetch(url, opts).then(function (res) {
        if (!res.ok) throw new Error('cart request failed');
        return res.json();
      });
    },

    refresh: function () {
      var self = this;
      self.fetch('/cart.js').then(function (cart) {
        self.render(cart);
      }).catch(function () {
        self.render({ items: [], item_count: 0, total_price: 0 });
      });
    },

    render: function (cart) {
      var items = cart.items || [];
      var container = this.el.querySelector('[data-cart-items]');
      var foot = this.el.querySelector('[data-cart-foot]');
      var progressWrap = this.el.querySelector('[data-cart-progress]');
      var countEls = document.querySelectorAll('[data-cart-count]');
      var count = items.reduce(function (n, i) { return n + i.quantity; }, 0);

      countEls.forEach(function (el) {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
      });

      container.classList.toggle('is-empty', items.length === 0);
      foot.style.display = items.length ? 'block' : 'none';
      progressWrap.style.display = items.length ? 'block' : 'none';

      if (!items.length) {
        container.innerHTML =
          '<p class="cart-drawer__empty-text">' +
          esc(document.body.dataset.cartEmptyText || 'Your cart is empty') +
          '</p>' +
          '<a class="btn btn--primary btn--xl" href="' +
          esc(document.body.dataset.collectionsUrl || '/collections/all') +
          '">' +
          esc(document.body.dataset.cartBrowseText || 'Browse bestsellers') +
          '</a>';
        this.renderProgress(0, 0);
        return;
      }

      container.innerHTML = items
        .map(function (item) {
          var compare =
            item.original_price > item.final_price
              ? '<p class="cart-line__compare">' + money(item.original_price * item.quantity) + '</p>'
              : '';
          var priceClass = item.original_price > item.final_price ? ' cart-line__price--sale' : '';
          return (
            '<div class="cart-line" data-line-key="' + item.key + '">' +
            '<a class="cart-line__media" href="' + esc(item.url || '#') + '">' +
            '<img class="cart-line__img" src="' + esc(item.featured_image ? item.featured_image.url : '') + '" alt="' + esc(item.product_title) + '" loading="lazy">' +
            '</a>' +
            '<div class="cart-line__body">' +
            '<div class="cart-line__top">' +
            '<div>' +
            '<p class="cart-line__name">' + esc(item.product_title) + '</p>' +
            '<p class="cart-line__meta">' + esc(item.variant_title) + '</p>' +
            '</div>' +
            '<button type="button" class="cart-line__remove" data-line-remove aria-label="Remove">' + ICONS.trash + '</button>' +
            '</div>' +
            '<div class="cart-line__bottom">' +
            '<div class="qty-stepper">' +
            '<button type="button" data-line-change="-1" aria-label="Decrease">' + ICONS.minus + '</button>' +
            '<span class="qty-stepper__value">' + item.quantity + '</span>' +
            '<button type="button" data-line-change="1" aria-label="Increase">' + ICONS.plus + '</button>' +
            '</div>' +
            '<div class="cart-line__prices">' + compare +
            '<p class="cart-line__price' + priceClass + '">' + money(item.final_line_price) + '</p>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>'
          );
        })
        .join('');

      var subtotal = cart.total_price;
      this.renderProgress(count, subtotal);

      var subtotalEl = this.el.querySelector('[data-cart-subtotal]');
      if (subtotalEl) subtotalEl.textContent = money(subtotal);

      container.querySelectorAll('[data-line-change]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var line = btn.closest('[data-line-key]');
          var delta = Number(btn.dataset.lineChange);
          var key = line.dataset.lineKey;
          var valueEl = line.querySelector('.qty-stepper__value');
          var next = Math.max(0, Number(valueEl.textContent) + delta);
          self.change(key, next);
        });
      });

      container.querySelectorAll('[data-line-remove]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          self.change(btn.closest('[data-line-key]').dataset.lineKey, 0);
        });
      });
    },

    renderProgress: function (count, subtotal) {
      var wrap = this.el.querySelector('[data-cart-progress]');
      if (!wrap) return;
      var text = wrap.querySelector('[data-cart-progress-text]');
      var bar = wrap.querySelector('[data-cart-progress-bar]');
      var remaining = FREE_SHIPPING_THRESHOLD - subtotal / 100;
      var pct = Math.min(100, Math.max(0, (subtotal / 100 / FREE_SHIPPING_THRESHOLD) * 100));
      bar.style.width = pct + '%';
      text.textContent =
        remaining > 0
          ? document.body.dataset.cartProgressText.replace('{{ amount }}', money(remaining * 100))
          : document.body.dataset.cartProgressReached;
    },

    change: function (key, quantity) {
      var self = this;
      var data = new URLSearchParams();
      data.append('id', key);
      data.append('quantity', String(quantity));
      self
        .fetch('/cart/change.js', {
          method: 'POST',
          body: data,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then(function () {
          self.refresh();
        });
    },

    add: function (id, quantity) {
      var self = this;
      var data = new URLSearchParams();
      data.append('id', id);
      data.append('quantity', String(quantity || 1));
      return self
        .fetch('/cart/add.js', {
          method: 'POST',
          body: data,
          headers: { 'X-Requested-With': 'XMLHttpRequest' },
        })
        .then(function () {
          self.refresh();
          self.open();
        });
    },
  };

  /* ---------- Cart page ---------- */
  function initCartPage() {
    document.querySelectorAll('[data-line-qty-change]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = btn.closest('[data-cart-line-form]');
        var hidden = form.querySelector('[data-line-qty]');
        var valueEl = form.querySelector('.qty-stepper__value');
        var next = Math.max(0, Number(valueEl.textContent) + Number(btn.dataset.lineQtyChange));
        hidden.value = next;
        if (next === 0) {
          window.location.href = form
            .closest('.cart-page__line')
            .querySelector('[data-cart-line-remove]').dataset.removeUrl;
        } else {
          form.submit();
        }
      });
    });

    document.querySelectorAll('[data-cart-line-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        window.location.href = btn.dataset.removeUrl;
      });
    });
  }

  /* ---------- Product page ---------- */
  var ProductPage = {
    init: function () {
      var root = document.querySelector('[data-product-root]');
      if (!root) return;
      this.root = root;
      this.variants = JSON.parse(
        document.getElementById('ProductJson-' + root.dataset.productId).textContent
      );
      this.currentVariant = null;

      this.form = root.querySelector('[data-product-form]');
      this.options = root.querySelectorAll('[data-option-group]');

      var self = this;
      this.options.forEach(function (group) {
        group.querySelectorAll('[data-option-value]').forEach(function (btn) {
          btn.addEventListener('click', function () {
            self.selectOption(group, btn.dataset.optionValue);
          });
        });
      });

      // Gallery thumbs
      root.querySelectorAll('[data-thumb]').forEach(function (thumb) {
        thumb.addEventListener('click', function () {
          var img = thumb.dataset.thumb;
          root.querySelectorAll('[data-thumb]').forEach(function (t) {
            t.classList.toggle('is-active', t === thumb);
          });
          var main = root.querySelector('[data-gallery-main]');
          main.src = img;
          main.alt = thumb.dataset.thumbAlt || main.alt;
        });
      });

      if (this.form) {
        this.form.addEventListener('submit', function (e) {
          e.preventDefault();
          var qty = root.querySelector('[name="quantity"]');
          self.addToCart(qty ? Number(qty.value) || 1 : 1);
        });

        var qtyInput = this.form.querySelector('input[name="quantity"]');
        var down = this.form.querySelector('[data-qty-down]');
        var up = this.form.querySelector('[data-qty-up]');
        if (down) {
          down.addEventListener('click', function () {
            qtyInput.value = Math.max(1, Number(qtyInput.value || 1) - 1);
          });
        }
        if (up) {
          up.addEventListener('click', function () {
            qtyInput.value = Math.max(1, Number(qtyInput.value || 1) + 1);
          });
        }
      }

      this.updateVariant();
    },

    selectOption: function (group, value) {
      group.querySelectorAll('[data-option-value]').forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.optionValue === value);
      });
      this.updateVariant();
    },

    selectedOptions: function () {
      var out = {};
      this.options.forEach(function (group) {
        var active = group.querySelector('[data-option-value].is-active');
        if (active) out[group.dataset.optionName] = active.dataset.optionValue;
      });
      return out;
    },

    findVariant: function (options) {
      return this.variants.find(function (v) {
        return Object.keys(options).every(function (name) {
          return v.options[v.position - 1] === options[name];
        });
      });
    },

    updateVariant: function () {
      var selected = this.selectedOptions();
      var variant = this.findVariant(selected);
      this.currentVariant = variant;

      var root = this.root;
      var priceEl = root.querySelector('[data-price]');
      var compareEl = root.querySelector('[data-compare]');
      var saveEl = root.querySelector('[data-save]');
      var submitBtn = root.querySelector('[data-add-button]');
      var hiddenId = root.querySelector('[name="id"]');

      if (variant) {
        priceEl.textContent = money(variant.price);
        priceEl.classList.toggle('price--sale', variant.compare_at_price > variant.price);
        if (compareEl) {
          compareEl.textContent = variant.compare_at_price > variant.price ? money(variant.compare_at_price) : '';
        }
        if (saveEl) {
          saveEl.textContent =
            variant.compare_at_price > variant.price
              ? 'Save ' + money(variant.compare_at_price - variant.price)
              : '';
          saveEl.style.display = variant.compare_at_price > variant.price ? '' : 'none';
        }
        if (hiddenId) hiddenId.value = variant.id;
        var soldOut = !variant.available;
        submitBtn.textContent = soldOut
          ? document.body.dataset.soldOutText
          : document.body.dataset.addToCartText;
        submitBtn.disabled = soldOut;

        // Swap image to the variant's featured image
        if (variant.featured_image && variant.featured_image.src) {
          var main = root.querySelector('[data-gallery-main]');
          main.src = variant.featured_image.src;
        }
      } else {
        if (hiddenId) hiddenId.value = '';
        submitBtn.textContent = document.body.dataset.unavailableText;
        submitBtn.disabled = true;
      }
    },

    addToCart: function (quantity) {
      var id = this.form.querySelector('[name="id"]').value;
      if (!id) return;
      var btn = this.root.querySelector('[data-add-button]');
      btn.classList.add('btn--disabled');
      var label = btn.textContent;
      btn.textContent = 'Adding…';
      var self = this;
      CartDrawer.add(id, quantity)
        .catch(function () {
          btn.textContent = label;
          btn.classList.remove('btn--disabled');
        })
        .then(function () {
          btn.textContent = label;
          btn.classList.remove('btn--disabled');
        });
    },
  };

  /* ---------- Newsletter (non-ajax fallback) ---------- */
  function initNewsletter() {
    document.querySelectorAll('[data-newsletter-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('input[type="email"]');
        if (!input || !input.value || !input.value.includes('@')) {
          var err = form.parentNode.querySelector('[data-newsletter-error]');
          if (err) err.style.display = 'block';
          return;
        }
        var success = form.parentNode.querySelector('[data-newsletter-success]');
        if (success) {
          success.style.display = 'block';
          form.style.display = 'none';
        }
      });
    });
  }

  /* ---------- Product gallery mobile (native) ---------- */
  function initQuickAdd() {
    document.querySelectorAll('[data-quick-add]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        var id = btn.dataset.quickAdd;
        if (id) CartDrawer.add(id, 1);
      });
    });
  }

  onReady(function () {
    initMobileMenu();
    initAccordions();
    initReveals();
    initSliders();
    initNewsletter();
    initQuickAdd();
    initCartPage();
    CartDrawer.init();
    ProductPage.init();
  });
})();
