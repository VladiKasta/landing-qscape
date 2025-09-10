document.addEventListener("DOMContentLoaded", function () {
  const orderForms = document.querySelectorAll(".order-form form");
  const popup = document.querySelector(".popup");

  orderForms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const formData = new FormData(this);
      const contactMethods = Array.from(
        this.querySelectorAll('input[type="checkbox"]:checked'),
      )
        .map((el) => {
          const label = el.closest("li")
            ? el.closest("li").textContent.trim()
            : "";
          return label.replace(/\s+/g, " ");
        })
        .filter((method) => method)
        .join(", ");

      const comments = [];
      if (contactMethods) {
        comments.push("Предпочитаемый способ связи: " + contactMethods);
      }
      comments.push("Источник: форма обратной связи на сайте");
    const orderForms = document.querySelectorAll(".order-form form");
    const popups = Array.from(document.querySelectorAll(".popup")); // если несколько попапов
    const ORIGIN_KEY = 'lead_origin_source';
    const ORIGIN_TS_KEY = 'lead_origin_ts';
    const ORIGIN_TTL_MS = 30 * 60 * 1000; // 30 минут

    let popupLeadSource = '';
    const popupSourceMap = new WeakMap();

    function nowTs() { return Date.now(); }

    function normalizeSource(src) {
        if (!src) return '';
        let s = String(src).trim();
        s = s.replace(/_card_click_/g, '_form_submit_');
        s = s.replace(/_card_click$/g, '_form_submit');
        s = s.replace(/_card_click/g, '_form_submit');
        s = s.replace(/_click_/g, '_form_submit_');
        s = s.replace(/_click$/g, '_form_submit');
        s = s.replace(/_request_/g, '_form_submit_');
        s = s.replace(/_request$/g, '_form_submit');
        s = s.replace(/\bclick\b/g, 'form_submit');
        s = s.replace(/_form_submit_form_submit/g, '_form_submit');
        return s;
    }

    function setOriginStore(src) {
        try {
            popupLeadSource = src || '';
            sessionStorage.setItem(ORIGIN_KEY, popupLeadSource);
            sessionStorage.setItem(ORIGIN_TS_KEY, String(nowTs()));
        } catch (e) { /* noop */ }
    }

    function getOriginStore() {
        try {
            const src = sessionStorage.getItem(ORIGIN_KEY) || '';
            const ts = parseInt(sessionStorage.getItem(ORIGIN_TS_KEY) || '0', 10);
            if (!src || !ts) return '';
            if (nowTs() - ts > ORIGIN_TTL_MS) return '';
            return src;
        } catch (e) { return ''; }
    }

    function clearOriginStore() {
        try {
            sessionStorage.removeItem(ORIGIN_KEY);
            sessionStorage.removeItem(ORIGIN_TS_KEY);
        } catch (e) {}
        popupLeadSource = '';
    }

    // Захватываем источник по клику на триггер (pointerdown — надёжнее)
    function captureTrigger(e) {
        const trigger = e.target.closest && e.target.closest('[data-source]');
        if (!trigger) return;

        if (trigger.closest && trigger.closest('.popup')) return; // игнор кликов внутри попапа

        const raw = trigger.getAttribute('data-source') || '';
        if (!raw) return;

        const normalized = normalizeSource(raw);

        if (/^popup[_\-]/i.test(normalized) || normalized.includes('popup_form')) {
            console.debug('[lead-origin] ignored trigger looks like popup source:', normalized);
            return;
        }

        setOriginStore(normalized);
        popups.forEach(p => popupSourceMap.set(p, normalized));
        console.log('[lead-origin] captured trigger:', raw, '->', normalized);
    }

    document.addEventListener('pointerdown', captureTrigger, true);
    document.addEventListener('touchstart', captureTrigger, true);

    function fallbackSourceFromDOM(button, form) {
        if (button && button.dataset && button.dataset.source) {
            return normalizeSource(button.dataset.source);
        }
        const formParent = form.closest('[data-theme], .popup, .title__section, .order__section, .price__tile, .results__section');
        let section = 'unknown';
        let action = 'form_submit';
        let detail = '';

        if (form.closest('.popup')) {
            section = 'popup';
            detail = 'calculate';
        } else if (formParent) {
            if (formParent.classList.contains('title__section')) {
                section = 'hero';
                detail = 'calculate';
            } else if (formParent.classList.contains('order__section')) {
                section = 'contact';
                detail = 'primary';
            } else if (formParent.classList.contains('price__tile')) {
                section = 'pricing';
                const tariffTitle = formParent.querySelector('h3');
                if (tariffTitle) {
                    const tariff = tariffTitle.textContent.toLowerCase();
                    if (tariff.includes('старт')) detail = 'starter';
                    else if (tariff.includes('оптимал')) detail = 'optimal';
                    else if (tariff.includes('премиум')) detail = 'premium';
                }
            } else if (formParent.classList.contains('results__section')) {
                section = 'portfolio';
            } else if (formParent.dataset.theme === 'dark') {
                section = 'contact';
                detail = 'secondary';
            } else if (formParent.dataset.theme === 'light') {
                section = 'footer';
                detail = 'primary';
            }
        }
        if (form.closest('footer') || (form.closest('[data-theme="light"]') && form.closest('[data-theme="light"]').querySelector('footer'))) {
            section = 'footer';
            detail = 'primary';
        }
        return `${section}_${action}${detail ? '_' + detail : ''}`;
    }

    // UTM
    function getUTMParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            utm_source: urlParams.get('utm_source') || '',
            utm_medium: urlParams.get('utm_medium') || '',
            utm_campaign: urlParams.get('utm_campaign') || '',
            utm_term: urlParams.get('utm_term') || '',
            utm_content: urlParams.get('utm_content') || ''
        };
    }
    function saveUTMToSession() {
        const utmParams = getUTMParameters();
        if (Object.values(utmParams).some(v => v !== '')) {
            Object.keys(utmParams).forEach(k => {
                if (utmParams[k]) sessionStorage.setItem(k, utmParams[k]);
            });
            if (!sessionStorage.getItem('utm_first_visit')) {
                sessionStorage.setItem('utm_first_visit', new Date().toISOString());
            }
        }
    }
    function getStoredUTM() {
        return {
            utm_source: sessionStorage.getItem('utm_source') || '',
            utm_medium: sessionStorage.getItem('utm_medium') || '',
            utm_campaign: sessionStorage.getItem('utm_campaign') || '',
            utm_term: sessionStorage.getItem('utm_term') || '',
            utm_content: sessionStorage.getItem('utm_content') || '',
            utm_first_visit: sessionStorage.getItem('utm_first_visit') || ''
        };
    }
    saveUTMToSession();

    // Сабмиты форм
    orderForms.forEach((form, formIndex) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);

            const contactMethods = Array.from(this.querySelectorAll('input[type="checkbox"]:checked'))
                .map(el => (el.closest('li') ? el.closest('li').textContent.trim() : '').replace(/\s+/g, ' '))
                .filter(Boolean).join(', ');

            const utmData = getStoredUTM();
            const comments = [];
            if (contactMethods) comments.push("Предпочитаемый способ связи: " + contactMethods);
            comments.push("Источник: форма обратной связи на сайте");

            const formPopupEl = this.closest('.popup');
            let finalSource = '';

            if (formPopupEl) {
                const mapped = popupSourceMap.get(formPopupEl);
                if (mapped) {
                    finalSource = mapped;
                    console.log('[lead-origin] used popupSourceMap ->', finalSource);
                } else if (popupLeadSource) {
                    finalSource = popupLeadSource;
                    console.log('[lead-origin] used popupLeadSource ->', finalSource);
                } else {
                    const stored = getOriginStore();
                    if (stored) {
                        finalSource = stored;
                        console.log('[lead-origin] used sessionStorage ->', finalSource);
                    } else {
                        finalSource = fallbackSourceFromDOM(null, this);
                        console.log('[lead-origin] used fallback DOM for popup form ->', finalSource);
                    }
                }
            } else {
                if (submitButton && submitButton.dataset && submitButton.dataset.source) {
                    finalSource = normalizeSource(submitButton.dataset.source);
                    console.log('[lead-origin] used submit button dataset ->', finalSource);
                } else {
                    finalSource = fallbackSourceFromDOM(submitButton, this);
                    console.log('[lead-origin] used fallback DOM for normal form ->', finalSource);
                }
            }

            finalSource = normalizeSource(finalSource || '');
            if (orderForms.length > 1) finalSource = `form${formIndex + 1}-${finalSource}`;
            const sourceString = `${finalSource || 'unknown'} | www.shop.qscape.ru`;

            const leadData = {
                fields: {
                    TITLE: "Заявка с сайта" + (formData.get("name") ? " от " + formData.get("name") : ""),
                    NAME: formData.get("name") || "Гость",
                    ASSIGNED_BY_ID: 667,
                    OPENED: "Y",
                    STATUS_ID: "NEW",
                    ...(utmData.utm_source ? { SOURCE_ID: "ADVERTISING" } : { SOURCE_ID: "NEW" }),
                    ...(utmData.utm_source && { UTM_SOURCE: utmData.utm_source }),
                    ...(utmData.utm_term && { UTM_TERM: utmData.utm_term }),
                    ...(utmData.utm_source && { UF_CRM_1493286245: utmData.utm_source }),
                    ...(utmData.utm_medium && { UF_CRM_1493286437: utmData.utm_medium }),
                    ...(utmData.utm_campaign && { UF_CRM_1493286504: utmData.utm_campaign }),
                    ...(utmData.utm_content && { UF_CRM_1493286561: utmData.utm_content }),
                    UF_CRM_1493286595: sourceString,
                    EMAIL: formData.get("email"),
                    PHONE: formData.get("phone") ? [{ VALUE: formData.get("phone"), VALUE_TYPE: "WORK" }] : [],
                    WEB: [{ VALUE: "www.shop.qscape.ru", VALUE_TYPE: "WORK" }],
                    COMMENTS: comments.join("\n")
                },
                params: { REGISTER_SONET_EVENT: "Y" }
            };

            console.log('FINAL sourceString:', sourceString);
            console.log('Lead payload:', JSON.stringify(leadData, null, 2));

            const originalButtonText = submitButton ? submitButton.innerHTML : '';
            if (submitButton) { submitButton.disabled = true; submitButton.innerHTML = 'Отправка...'; }

            const webhookUrl = "https://quantom.bitrix24.ru/rest/667/tf8b1hmge49yk5f2/crm.lead.add.json";
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(leadData)
            })
                .then(resp => {
                    if (!resp.ok) return resp.text().then(t => { throw new Error(`HTTP ${resp.status}: ${t}`); });
                    return resp.json();
                })
                .then(data => {
                    if (data && data.result) {
                        this.reset();
                        if (formPopupEl) popupSourceMap.delete(formPopupEl);
                        clearOriginStore(); // очищаем только после успешного сабмита
                        const popupSuccess = document.querySelector('.popup__success');
                        if (popups.length) popups.forEach(p => p.style && (p.style.display = 'none'));
                        if (popupSuccess) popupSuccess.style.display = 'block';
                    } else if (submitButton) {
                        submitButton.innerHTML = 'Ошибка';
                    }
                })
                .catch(err => {
                    console.error('Fetch Error:', err);
                })
                .finally(() => {
                    if (submitButton) { submitButton.disabled = false; submitButton.innerHTML = originalButtonText; }
                });
        });
    });

    document.addEventListener('click', (e) => {
        const close = e.target.closest && e.target.closest('.popup-close, .popup-overlay, [data-popup-close], #popup-close');
        if (close) {
            console.log('[lead-origin] popup close detected (source kept for pending submit)');
        }
    });
});
