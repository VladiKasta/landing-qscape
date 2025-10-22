document.addEventListener("DOMContentLoaded", function () {
    const orderForms = document.querySelectorAll(".order-form form");
    const popups = Array.from(document.querySelectorAll(".popup-overlay"));
    const ORIGIN_KEY = 'lead_origin_source';
    const ORIGIN_TS_KEY = 'lead_origin_ts';
    const ORIGIN_TTL_MS = 30 * 60 * 1000;

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

    function captureTrigger(e) {
        const trigger = e.target.closest && e.target.closest('[data-source]');
        if (!trigger) return;

        if (trigger.closest && trigger.closest('.popup-overlay')) return;

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

    function getFormType(form) {
        const overlay = form.closest('.popup-overlay');
        if (!overlay) return 'unknown';

        const popupType = overlay.dataset.popup;
        switch(popupType) {
            case 'calculate': return 'calculate';
            case 'basic': return 'basic';
            case 'optimal': return 'optimal';
            case 'premium': return 'premium';
            default: return 'unknown';
        }
    }

    function fallbackSourceFromDOM(button, form) {
        if (button && button.dataset && button.dataset.source) {
            return normalizeSource(button.dataset.source);
        }

        const formType = getFormType(form);
        const formParent = form.closest('[data-theme], .popup-overlay, .title__section, .order__section, .price__tile, .results__section');
        let section = 'unknown';
        let action = 'form_submit';
        let detail = formType;

        if (form.closest('.popup-overlay')) {
            section = 'popup';
        } else if (formParent) {
            if (formParent.classList.contains('title__section')) {
                section = 'hero';
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

    orderForms.forEach((form) => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitButton = this.querySelector('button[type="submit"]');
            const formData = new FormData(this);

            // const contactMethods = Array.from(this.querySelectorAll('input[type="checkbox"]:checked'))
            //     .map(el => (el.closest('li') ? el.closest('li').textContent.trim() : '').replace(/\s+/g, ' '))
            //     .filter(Boolean).join(', ');

            let contactMethods = "";

            if (!contactMethods && getFormType(this) === "unknown") {
            const selectedRadio = this.querySelector('input[type="radio"][name="choice"]:checked');
            if (selectedRadio) {
                const label = this.querySelector(`label[for="${selectedRadio.id}"] .radio-text`);
                contactMethods = label ? label.textContent.trim() : selectedRadio.value;
            }
        }

            const utmData = getStoredUTM();
            const formType = getFormType(this);
            const userName = formData.get("name") || "Гость";

            // формировани TITLE и кастомных полей(реализую через switch - case, т.к. более читаемо)
            let title = "";
            let customFields = {};

            switch (formType) {
                case "calculate":
                    title = `Заявка на рассчет стоимости от ${userName}`;
                    break;
                case "basic":
                    title = `Заявка на создание сайта (тариф: Базовый) от ${userName}`;
                    customFields = { UF_CRM_TARIFF: "Базовый" };
                    break;
                case "optimal":
                    title = `Заявка на создание сайта (тариф: Оптимальный) от ${userName}`;
                    customFields = { UF_CRM_TARIFF: "Оптимальный" };
                    break;
                case "premium":
                    title = `Заявка на создание сайта (тариф: Премиум) от ${userName}`;
                    customFields = { UF_CRM_TARIFF: "Премиум" };
                    break;
                default:
                    title = `Заявка на консультацию от ${userName}`;
                    if (contactMethods) {
                        customFields = { UF_CRM_CONTACT_METHOD: contactMethods };
                    }
                    break;
            }

            const comments = [];
            if (contactMethods && formType === "unknown") {
                comments.push("Предпочитаемый способ связи: " + contactMethods);
            }
            comments.push("Источник: форма обратной связи на сайте");

            const formOverlayEl = this.closest('.popup-overlay');
            let finalSource = '';

            if (formOverlayEl) {
                const mapped = popupSourceMap.get(formOverlayEl);
                if (mapped) {
                    finalSource = mapped;
                    // console.log('[lead-origin] used popupSourceMap ->', finalSource);
                } else if (popupLeadSource) {
                    finalSource = popupLeadSource;
                    // console.log('[lead-origin] used popupLeadSource ->', finalSource);
                } else {
                    const stored = getOriginStore();
                    if (stored) {
                        finalSource = stored;
                        // console.log('[lead-origin] used sessionStorage ->', finalSource);
                    } else {
                        finalSource = fallbackSourceFromDOM(null, this);
                        // console.log('[lead-origin] used fallback DOM for popup form ->', finalSource);
                    }
                }
            } else {
                if (submitButton && submitButton.dataset && submitButton.dataset.source) {
                    finalSource = normalizeSource(submitButton.dataset.source);
                    // console.log('[lead-origin] used submit button dataset ->', finalSource);
                } else {
                    finalSource = fallbackSourceFromDOM(submitButton, this);
                    // console.log('[lead-origin] used fallback DOM for normal form ->', finalSource);
                }
            }

            finalSource = normalizeSource(finalSource || '');
            const sourceString = `${finalSource || 'unknown'}`;

            const leadData = {
                fields: {
                    TITLE: title,
                    NAME: userName,
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
                    UF_CRM_1493286595: 'www.shop.qscape.ru',
                    UF_CRM_FORMNAME: sourceString,
                    EMAIL: formData.get("email") ? [{ VALUE: formData.get("email"), VALUE_TYPE: "WORK" }] : [],
                    PHONE: formData.get("phone") ? [{ VALUE: formData.get("phone"), VALUE_TYPE: "WORK" }] : [],
                    WEB: [{ VALUE: "www.shop.qscape.ru", VALUE_TYPE: "WORK" }],
                    COMMENTS: comments.join("\n"),
                    ...customFields
                },
                params: { REGISTER_SONET_EVENT: "Y" }
            };

            // console.log('Form type:', formType);
            // console.log('FINAL sourceString:', sourceString);
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
                        if (formOverlayEl) popupSourceMap.delete(formOverlayEl);
                        clearOriginStore();

                        // Для формы в .order-form
                        const orderFormContainer = this.closest('.order-form');
                        const currentOverlay = this.closest('.popup-overlay');

                        let contextType = '';

                        if (orderFormContainer && !currentOverlay) {
                            contextType = 'order-form'
                        } else if (currentOverlay) {
                            contextType = 'popup-overlay';
                        } else {
                            contextType = 'unknown';
                        }

                        switch (contextType) {
                            case 'order-form':
                                // Для статических форм
                                const popupOverlay = orderFormContainer.querySelector('.popup-overlay-order');
                                const mainForm = orderFormContainer.querySelector('form');

                                if (popupOverlay && mainForm) {
                                    popupOverlay.style.display = 'flex';
                                    console.log('Success overlay shown for order-form');
                                }
                                break;

                            case 'popup-overlay':
                                // Для форм в попапах (calculate, basic, optimal, premium)
                                const popupSuccess = currentOverlay.querySelector('.popup__success');
                                const mainPopup = currentOverlay.querySelector('.popup');

                                if (popupSuccess && mainPopup) {
                                    mainPopup.style.display = 'none';
                                    popupSuccess.style.display = 'flex';
                                    console.log('Success popup shown for:', getFormType(this));
                                }
                                break;

                            case 'unknown':
                                // Резервный вариант для непредвиденных случаев
                                console.warn('Unknown form context, cannot show success popup');
                                break;

                            default:
                                console.warn('Unhandled context type:', contextType);
                                break;
                        }
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
        if (e.target.closest('#popup-close') || e.target.closest('.popup-close__order') || e.target.classList.contains('popup-overlay-order')) {
            const overlay = e.target.closest('.popup-overlay-order');
            if (overlay) {
                overlay.style.display = 'none';
            }
        }

        const close = e.target.closest && e.target.closest('.popup-close, .popup-overlay, [data-popup-close]');
        if (close) {
            console.log('[lead-origin] popup close detected');
        }
    });
});
