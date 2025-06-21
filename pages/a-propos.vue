<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-12">Deux âmes, une marmite</h1>

      <!-- Notre histoire -->
      <section class="mb-16">
        <div class="grid md:grid-cols-2 gap-8 mb-12">
          <!-- Viviana -->
          <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl">
            <h2 class="text-2xl font-semibold text-primary mb-4">Viviana</h2>
            <p class="text-primary/90 leading-relaxed space-y-3">
              <span class="block">Née au Mexique, biberonnée au pozole rouge, diplômée en commerce international et chef en herbe depuis qu'elle tient une louche.</span>
              <span class="block italic text-primary/80">Depuis 2024, elle est titulaire du prestigieux titre de "Meilleure Chef de l'Univers" décerné par la Revue Culinaire de Samuel.</span>
            </p>
          </div>
          <!-- Samuel -->
          <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl">
            <h2 class="text-2xl font-semibold text-primary mb-4">Samuel</h2>
            <p class="text-primary/90 leading-relaxed space-y-3">
              <span class="block">Né à Marseille, il a grandit à la campagne et est revenu sous la protection de la bonne mère pour faire ses études.</span>
              <span class="block italic text-primary/80">Il tombe par la suite éperduement amoureux de Viviana… et du Mexique.</span>
            </p>
          </div>
        </div>

        <!-- Rencontre & Aujourd'hui -->
        <div class="grid md:grid-cols-2 gap-8">
          <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl">
            <h2 class="text-2xl font-semibold text-primary mb-4">Rencontre</h2>
            <p class="text-primary/90 leading-relaxed">
              <span class="block font-medium">France 2023.</span>
              <span class="block italic text-primary/80 mt-2">Coup de foudre pimenté <span class="text-accent">(Habanero)</span>.</span>
            </p>
          </div>
          <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl">
            <h2 class="text-2xl font-semibold text-primary mb-4">Aujourd'hui</h2>
            <p class="text-primary/90 leading-relaxed space-y-3">
              <span class="block">Fiancés, parents de jumelles <span class="text-accent">(futures dégustatrices officielles)</span>.</span>
              <span class="block">Lui code, elle cuisine.</span>
              <span class="block italic text-primary/80">Ensemble, ils servent l'âme du Mexique dans des bols.</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Notre mission -->
      <section class="mb-16">
        <div class="bg-white border border-primary/10 rounded-xl p-8 shadow-xl text-center">
          <h2 class="text-2xl font-semibold text-primary mb-4">Notre mission</h2>
          <p class="text-xl text-primary/90 italic leading-relaxed">
            <span class="block">Partager un caldito qui rassemble :</span>
            <span class="block text-primary mt-2">une gorgée, et les frontières fondent.</span>
          </p>
        </div>
      </section>

      <!-- Nos valeurs -->
      <section class="mb-16">
        <h2 class="text-2xl font-semibold text-primary mb-8 text-center">Nos valeurs</h2>
        <div class="flex flex-wrap justify-center gap-4">
          <span class="px-6 py-3 bg-white border border-primary/10 text-primary rounded-full text-lg font-medium shadow-sm">Authenticité</span>
          <span class="px-6 py-3 bg-white border border-primary/10 text-primary rounded-full text-lg font-medium shadow-sm">Générosité</span>
          <span class="px-6 py-3 bg-white border border-primary/10 text-primary rounded-full text-lg font-medium shadow-sm">Convivialité</span>
          <span class="px-6 py-3 bg-white border border-primary/10 text-primary rounded-full text-lg font-medium shadow-sm">Slow Food</span>
          <span class="px-6 py-3 bg-white border border-primary/10 text-primary rounded-full text-lg font-medium shadow-sm">Famille avant tout</span>
        </div>
      </section>

      <!-- CTA -->
      <div class="text-center">
        <NuxtLink to="/commander" class="inline-block bg-primary text-crema font-bold px-8 py-4 rounded-xl hover:bg-accent hover:text-crema transition-colors duration-300 shadow-lg hover:shadow-xl btn-transition">
          Commander notre prochain Caldito !
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour cette page
</script> 