<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col w-full">
    <div class="w-full max-w-2xl mx-auto p-3 mobiledesktop:p-6">
      <h1 class="text-2xl font-bold text-primary text-center mb-3 mobiledesktop:text-4xl mobiledesktop:mb-4">À propos</h1>
      
      <!-- H1 -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-xl font-semibold text-primary text-center mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3 italic">
          Deux âmes, une marmite
        </h2>
      </div>

      <!-- Notre histoire -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">Notre histoire</h2>
        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">👩‍🍳</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">Viviana</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                Née au <strong>Mexique</strong>, biberonnée au <strong>pozole rouge</strong>, diplômée en <strong>commerce international</strong> et chef en herbe depuis qu'elle tient une louche. Depuis 2024, elle est titulaire du prestigieux titre de <strong>"Meilleure Chef de l'Univers"</strong> décerné par la Revue Culinaire de Samuel.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">🚚</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">Samuel</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                Né à <strong>Marseille</strong>, il a grandi à la <strong>campagne</strong> et est revenu sous la protection de la <strong>bonne mère</strong> pour faire ses études. Il tombe par la suite éperdument amoureux de Viviana… et du <strong>Mexique</strong>.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">💕</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">Rencontre</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                <strong>France 2023</strong>. Coup de foudre pimenté (<strong>Habanero</strong>).
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-2xl mobiledesktop:text-3xl">👨‍👩‍👧‍👧</span>
            <div>
              <h3 class="font-semibold text-primary text-base mobiledesktop:text-lg mb-1">Aujourd'hui</h3>
              <p class="text-primary/90 text-sm mobiledesktop:text-base leading-relaxed">
                <strong>Fiancés</strong>, parents de <strong>jumelles</strong> (futures dégustatrices officielles). <strong>Lui code, elle cuisine</strong>. Ensemble, ils servent l'<strong>âme du Mexique</strong> dans des bols.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Notre mission -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">Notre mission</h2>
        <p class="text-base text-primary/90 leading-relaxed mobiledesktop:text-lg italic text-center">
          Partager un caldito qui rassemble : une gorgée, et les frontières fondent.
        </p>
      </div>

      <!-- Nos valeurs -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <h2 class="text-lg font-semibold text-primary mb-2 mobiledesktop:text-2xl mobiledesktop:mb-3">Nos valeurs</h2>
        <div class="flex flex-wrap justify-center gap-3 mobiledesktop:gap-4">
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">Authenticité</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">Générosité</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">Convivialité</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">Slow Food</span>
          <span class="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium text-sm mobiledesktop:text-base">Famille avant tout</span>
        </div>
      </div>

      <!-- Call to action -->
      <div class="bg-white border border-primary/10 rounded-xl p-4 shadow-md mb-4 mobiledesktop:p-6 mobiledesktop:mb-6">
        <div class="text-center">
          <p class="text-base text-primary/90 leading-relaxed mobiledesktop:text-lg mb-4">
            Prêt à goûter l'âme du Mexique ?
          </p>
          <NuxtLink to="/commander" class="inline-block px-6 py-3 bg-primary text-crema rounded-xl font-semibold hover:bg-accent transition-colors duration-300 focus:outline-none">
            Commander maintenant
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour cette page
</script> 