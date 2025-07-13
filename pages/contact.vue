<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="max-w-4xl mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold text-primary text-center mb-4">{{ $t('home.contact.pageTitle') }}</h1>
      <p class="text-lg text-primary/80 text-center mb-8">{{ $t('home.contact.subtitle') }} contact@elcaldito.fr.</p>

      <div class="md:grid md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-xl shadow-md border border-primary/10">
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label for="firstName" class="block text-sm font-medium text-primary">{{ $t('home.contact.form.firstName') }}</label>
              <input type="text" id="firstName" v-model="form.firstName" required :placeholder="$t('home.contact.form.firstNamePlaceholder')" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
              <p v-if="errors.firstName" class="text-sm text-red-500 mt-1">{{ errors.firstName }}</p>
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-primary">{{ $t('home.contact.form.email') }}</label>
              <input type="email" id="email" v-model="form.email" required :placeholder="$t('home.contact.form.emailPlaceholder')" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
              <p v-if="errors.email" class="text-sm text-red-500 mt-1">{{ errors.email }}</p>
            </div>
            <div>
              <label for="subject" class="block text-sm font-medium text-primary">{{ $t('home.contact.form.subject') }}</label>
              <input type="text" id="subject" v-model="form.subject" :placeholder="$t('home.contact.form.subjectPlaceholder')" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1" />
            </div>
            <div>
              <label for="message" class="block text-sm font-medium text-primary">{{ $t('home.contact.form.message') }}</label>
              <textarea id="message" v-model="form.message" rows="5" :placeholder="$t('home.contact.form.messagePlaceholder')" class="w-full border border-primary/20 rounded-lg p-3 focus:border-primary outline-none mt-1"></textarea>
            </div>
            <button type="submit" :disabled="isLoading" class="w-full py-3 bg-primary text-crema rounded-xl font-semibold shadow hover:bg-accent hover:text-crema transition-colors duration-300 btn-transition focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed">
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ $t('home.contact.form.sending') || 'Envoi...' }}
              </span>
              <span v-else>{{ $t('home.contact.form.send') }}</span>
            </button>
          </form>
          <p v-if="successMessage" class="text-green-600 mt-4">{{ successMessage }}</p>
        </div>

        <div class="bg-white p-8 rounded-xl shadow-md border border-primary/10 mt-8 md:mt-0">
          <h2 class="text-2xl font-semibold text-primary mb-4">{{ $t('home.contact.info.title') }}</h2>
          <p class="text-lg text-primary/80">{{ $t('home.contact.info.description') }}</p>
          <ul class="space-y-4 mt-6">
            <li class="flex items-center">
              <span class="text-2xl mr-3">📍</span>
              <span>{{ $t('home.contact.info.location') }}</span>
            </li>
                          <li class="flex items-center">
                <span class="text-2xl mr-3">📧</span>
                <span>contact@elcaldito.fr</span>
              </li>
            <li class="flex items-center">
              <span class="text-2xl mr-3">📱</span>
              <span>{{ $t('home.contact.info.whatsapp') }}</span>
            </li>
            <li class="flex items-center">
              <span class="text-2xl mr-3">📷</span>
              <span>{{ $t('home.contact.info.instagram') }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p class="text-lg text-primary/80 text-center italic">
      {{ $t('home.contact.footer') }}
      </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { t } = useI18n();

const form = ref({
  firstName: '',
  email: '',
  subject: '',
  message: ''
});

const errors = ref({});
const successMessage = ref('');
const isLoading = ref(false);

const { postToStrapi } = useStrapi();

const submitForm = async () => {
  errors.value = {};
  if (!form.value.firstName) errors.value.firstName = t('home.contact.form.firstNameRequired');
  if (!form.value.email) errors.value.email = t('home.contact.form.emailRequired');
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errors.value.email = t('home.contact.form.emailInvalid');

  if (Object.keys(errors.value).length === 0) {
    isLoading.value = true;
    try {
      // Préparer les données selon le schéma Strapi
      const messageData = {
        name: form.value.firstName,
        email: form.value.email,
        sujet: form.value.subject || 'Message de contact',
        content: [
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                text: form.value.message
              }
            ]
          }
        ]
      };

      // Envoyer à Strapi
      const { data, error } = await postToStrapi('/messages', messageData);
      
      if (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        successMessage.value = t('home.contact.form.error') || 'Erreur lors de l\'envoi du message';
      } else {
        successMessage.value = t('home.contact.form.success');
        form.value = { firstName: '', email: '', subject: '', message: '' };
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi:', err);
      successMessage.value = t('home.contact.form.error') || 'Erreur lors de l\'envoi du message';
    } finally {
      isLoading.value = false;
    }
  }
};
</script> 