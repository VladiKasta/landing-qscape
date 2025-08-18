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

      const leadData = {
        fields: {
          TITLE:
            "Заявка с сайта" +
            (formData.get("name") ? " от " + formData.get("name") : ""),
          NAME: formData.get("name") || "Гость",
          ASSIGNED_BY_ID: 667,
          OPENED: "Y",
          SOURCE_ID: "WEB",
          STATUS_ID: "NEW",
          EMAIL: formData.get("email"),
          PHONE: formData.get("phone")
            ? [
                {
                  VALUE: formData.get("phone"),
                  VALUE_TYPE: "WORK",
                },
              ]
            : [],
          //
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

      // console.log('Отправляем данные:', JSON.stringify(leadData, null, 2));

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
          // console.log('Ответ от Битрикс24:', JSON.stringify(data, null, 2));
          if (data.result) {
            this.reset();
          } else {
            // console.error('API Error:', data);
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

console.log(
  "Найдено форм:",
  document.querySelectorAll(".order-form form").length,
);
