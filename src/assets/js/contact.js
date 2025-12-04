import { supabase } from './auth.js';

const contactForm = document.querySelector('#contact-form');
const feedback = document.querySelector('#contact-feedback');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.querySelector('#contact-name').value;
    const email = document.querySelector('#contact-email').value;
    const message = document.querySelector('#contact-message').value;

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in all fields.';
      return;
    }

    const { error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message }]);

    if (error) {
      feedback.textContent = 'Failed to send message. Try again.';
      console.error(error);
      return;
    }

    feedback.textContent = 'Message sent! Thank you for reaching out.';
    contactForm.reset();
  });
}
