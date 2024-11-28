// Configuration EmailJS
const EMAILJS_PUBLIC_KEY = "LMqRXFTDVAGzxgZbz";
const EMAILJS_SERVICE_ID = "service_jlm7vxj";
const EMAILJS_TEMPLATE_ID = "template_c9rjkxp";

// Initialisation d'EmailJS
window.addEventListener('load', function() {
    try {
        emailjs.init(EMAILJS_PUBLIC_KEY);
        console.log('EmailJS initialisé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation d\'EmailJS:', error);
    }
});

// Fonction d'envoi d'email (rendue globale)
window.sendEmail = async function(data) {
    try {
        const response = await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, data);
        console.log('Email envoyé avec succès:', response);
        return response;
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'email:', error);
        throw error;
    }
};
