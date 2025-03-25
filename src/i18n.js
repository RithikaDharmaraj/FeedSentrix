import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "submit_feedback": "Submit Your Feedback",
        "customer_id": "Customer ID (Optional)",
        "your_feedback": "Your Feedback",
        "analyzing": "Analyzing...",
        "submit": "Submit Feedback",
        "feedback_success": "Feedback submitted and analyzed successfully!"
      }
    },
    fr: {
      translation: {
        "submit_feedback": "Soumettez vos commentaires",
        "customer_id": "ID client (optionnel)",
        "your_feedback": "Votre avis",
        "analyzing": "Analyse en cours...",
        "submit": "Envoyer des commentaires",
        "feedback_success": "Commentaire soumis et analysé avec succès!"
      }
    }
  },
  lng: "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
