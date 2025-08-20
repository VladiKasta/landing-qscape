document.addEventListener("DOMContentLoaded", function () {
    const orderForms = document.querySelectorAll(".order-form form");
    const popup = document.querySelector(".popup");

    function getSourceIdFromUTM(utmSource) {
        const sourceMapping = {
            'google': 'GOOGLE',
            'yandex': 'YANDEX',
            'facebook': 'FACEBOOK',
            'instagram': 'FACEBOOK',
            'vk': 'VK',
            'telegram': 'TELEGRAM',
            'email': 'EMAIL',
            'newsletter': 'EMAIL',
            'direct': 'OTHER'
        };

        if (!utmSource) return 'WEB';

        const lowerSource = utmSource.toLowerCase();
        return sourceMapping[lowerSource] || utmSource.toUpperCase();
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

        if (Object.values(utmParams).some(value => value !== '')) {
            Object.keys(utmParams).forEach(key => {
                if (utmParams[key]) {
                    sessionStorage.setItem(key, utmParams[key]);
                }
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

            const utmData = getStoredUTM();

            const comments = [];
            if (contactMethods) {
                comments.push("Предпочитаемый способ связи: " + contactMethods);
            }
            comments.push("Источник: форма обратной связи на сайте");

            const leadData = {
                fields: {
                    TITLE:
                        "Заявка с сайта" +
                        (formData.get("name") ? " от " + formData.get("name") : ""),
                    NAME: formData.get("name") || "Гость",
                    ASSIGNED_BY_ID: 667,
                    OPENED: "Y",
                    STATUS_ID: "NEW",
                    ...(utmData.utm_source ? { SOURCE_ID: "ADVERTISING" } : {SOURCE_ID: "NEW"}),
                    ...(utmData.utm_source && { UTM_SOURCE: utmData.utm_source }),
                    ...(utmData.utm_term && { UTM_TERM: utmData.utm_term }),
                    ...(utmData.utm_source && { UF_CRM_1493286245: utmData.utm_source }),
                    ...(utmData.utm_medium && { UF_CRM_1493286437: utmData.utm_medium }),
                    ...(utmData.utm_campaign && { UF_CRM_1493286504: utmData.utm_campaign }),
                    ...(utmData.utm_content && { UF_CRM_1493286561: utmData.utm_content }),
                    UF_CRM_1493286595: "www.shop.qscape.ru",
                    EMAIL: formData.get("email"),
                    PHONE: formData.get("phone")
                        ? [
                            {
                                VALUE: formData.get("phone"),
                                VALUE_TYPE: "WORK",
                            },
                        ]
                        : [],
                    WEB: [
                        {
                            VALUE: "www.shop.qscape.ru",
                            VALUE_TYPE: "WORK",
                        },
                    ],
                    COMMENTS: comments.join("\n"),
                },
                params: {
                    REGISTER_SONET_EVENT: "Y",
                },
            };

            console.log('UTM данные:', utmData);
            console.log('Отправляем данные:', JSON.stringify(leadData, null, 2));

            const webhookUrl =
                "https://quantom.bitrix24.ru/rest/667/tf8b1hmge49yk5f2/crm.lead.add.json";

            const submitButton = this.querySelector('button[type="submit"]');
            console.log(submitButton);
            const originalButtonText = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = "Отправка...";

            fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify(leadData),
            })
                .then((response) => {
                    // console.log('Статус ответа:', response.status);
                    if (!response.ok) {
                        return response.text().then((text) => {
                            throw new Error(`HTTP ${response.status}: ${text}`);
                        });
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.result) {
                        this.reset();
                    } else {
                        submitButton.innerHTML = "Ошибка";
                    }

                    popup.style.display = "none";
                    const popupSuccess = document.querySelector(".popup__success");
                    console.log(popupSuccess);
                    popupSuccess.style.display = "block";
                })
                .catch((error) => {
                    console.error("Fetch Error:", error);
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalButtonText;
                });
        });
    });
});