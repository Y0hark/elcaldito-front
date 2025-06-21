<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">Vous avez une question ? Un craving ? Écrivez-nous !</h1>
      <p class="text-lg text-primary/80 text-center mb-8">Suggestions, partenariats, envie de réserver pour un événement privé ?
        Remplissez le formulaire ou contactez-nous directement.</p>

      <div class="md:grid md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-xl shadow-md border border-primary/10">
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-primary">Prénom</label>
              <input type="text" id="firstName" v-model="form.firstName" required placeholder="Votre prénom" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
              <p v-if="errors.firstName" class="text-sm text-red-500 mt-1">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-primary">Email</label>
              <input type="email" id="email" v-model="form.email" required placeholder="Votre email" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
              <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-primary">Sujet</label>
              <input type="text" id="subject" v-model="form.subject" placeholder="Sujet de votre message" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-primary">Message</label>
              <textarea id="message" v-model="form.message" rows="5" placeholder="Votre message" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1"></textarea>
            </div>
            <button type="submit" class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition">Envoyer</button>
          </form>
          <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md border border-primary/10 mt-8 md:mt-0">
          <h2 class="text-2xl font-semibold text-primary mb-4">Informations de contact</h2>
          <p class="text-lg text-primary/80">On cuisine depuis notre maison, mais on est toujours à portée de message !</p>
          <ul class="space-y-4 mt-6">
            <li class="flex items-center">
              <span class="text-2xl mr-3">📍</span>
              <span>Marseille (quartier à préciser)</span>
            </li>
            <li class="flex items-center">
              <span class="text-2xl mr-3">📧</span>
              <span>contact@elcaldito.fr</span>
            </li>
            <li class="flex items-center">
              <span class="text-2xl mr-3">📱</span>
              <span>WhatsApp (si disponible)</span>
            </li>
            <li class="flex items-center">
              <span class="text-2xl mr-3">📷</span>
              <span>Instagram</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p class="text-lg text-primary/80 text-center italic">
      On répond entre deux siestes de nos bébés et deux bouillonnements de marmite !
      </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  firstName: '',
  email: '',
  subject: '',
  message: ''
});

const errors = ref({});
const successMessage = ref('');

const submitForm = () => {
  errors.value = {};
  if (!form.value.firstName) errors.value.firstName = 'Le prénom est requis.';
  if (!form.value.email) errors.value.email = 'L\'email est requis.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = 'Veuillez entrer un email valide.';

  if (Object.keys(errors.value).length === 0) {
    // Simuler l'envoi du formulaire
    successMessage.value = 'Merci, votre message a été envoyé 💌';
    form.value = { firstName: '', email: '', subject: '', message: '' };
  }
};
</script> 