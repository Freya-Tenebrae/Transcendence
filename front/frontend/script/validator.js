// validators.js
export function validateEmail(email) {
    // utiliser une expression régulière pour valider l'adresse e-mail
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  export function validatePassword(password) {
    // doit contenir au moins 8 caractères, une lettre majuscule, une lettre minuscule et un chiffre
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+])[a-zA-Z\d!@#$%^&*()\-+]{8,}$/;
    return re.test(password);
  }
  
  export function validateNickname(nickname) {
    // Autorise les lettres (minuscules et majuscules), les chiffres, les tirets (-) et les underscores (_)
    // et exige une longueur minimale de 3 caractères
    const re = /^[a-zA-Z0-9_-]{3,}$/;
    return re.test(nickname);
  }