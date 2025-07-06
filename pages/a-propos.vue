<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">{{ $t('order.about.title') }}</h1>
      
      <!-- H1 -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-xl font-semibold text-primary text-center mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3 italic">
          {{ $t('order.about.subtitle') }}
        </h2>
      </div>

      <!-- Notre histoire -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">{{ $t('order.about.story.title') }}</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">👩‍🍳</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">{{ $t('order.about.story.viviana.name') }}</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                {{ $t('order.about.story.viviana.description') }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">🚚</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">{{ $t('order.about.story.samuel.name') }}</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                {{ $t('order.about.story.samuel.description') }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">💕</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">{{ $t('order.about.story.meeting.name') }}</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                {{ $t('order.about.story.meeting.description') }}
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">👨‍👩‍👧‍👧</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">{{ $t('order.about.story.today.name') }}</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                {{ $t('order.about.story.today.description') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notre mission -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">{{ $t('order.about.mission.title') }}</h2>
        <p class="text-base text-primary/90 leading-relaxed mobiledesktop:text-lg italic text-center">
          {{ $t('order.about.mission.description') }}
        </p>
      </div>

      <!-- Nos valeurs -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">{{ $t('order.about.values.title') }}</h2>
        <div class="flex flex-wrap justify-center gap-3 mobiledesktop:gap-4">
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">{{ $t('order.about.values.authenticity') }}</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">{{ $t('order.about.values.generosity') }}</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">{{ $t('order.about.values.conviviality') }}</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">{{ $t('order.about.values.slowFood') }}</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">{{ $t('order.about.values.familyFirst') }}</span>
        </div>
      </div>

      <!-- Call to action -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <div class="text-center">
          <p class="text-base text-primary/90 leading-relaxed mobiledesktop:text-lg mb-4">
            {{ $t('order.about.cta.question') }}
          </p>
          <NuxtLink to="/commander" class="inline-block px-6 py-3 bg-primary text-crema rounded-xl font-semibold hover:bg-accent transition-colors duration-300 focus:outline-none">
            {{ $t('order.about.cta.button') }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour cette page
</script> 