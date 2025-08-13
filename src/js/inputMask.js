import Inputmask from "https://cdn.jsdelivr.net/npm/inputmask@5.0.8/dist/inputmask.es6.js";

export default function inputMask() {
  document.querySelectorAll('input[type="tel"]').forEach((input) => {
    Inputmask({ mask: "+7 (999) 999-99-99" }).mask(input);
  });
}
