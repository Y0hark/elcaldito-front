<template>
  <div class="min-h-screen bg-crema font-sans text-primary flex flex-col">
    <div class="max-w-4xl mx-auto p-6">
      <h1 class="text-4xl font-bold text-primary text-center mb-8">À propos de nous</h1>

      <section class="md:flex md:items-center gap-8 mb-12">
        <div class="flex-1">
          <img src="/public/favicon.ico" alt="Viviana & Samuel" class="w-full h-64 object-cover rounded-xl shadow-md" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-semibold text-primary mb-4">Notre histoire</h2>
          <p class="text-lg text-primary/80">
            Viviana, Mexicaine passionnée de cuisine depuis toujours, et Samuel, Marseillais amoureux de la bouffe mexicaine (et de sa femme ❤️), ont un rêve commun : partager un vrai goût du Mexique à Marseille. Leur cuisine est un mélange savoureux de racines et d'amour.
          </p>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-primary mb-4">Pourquoi ce nom ? Pourquoi ce plat ?</h2>
        <p class="text-lg text-primary/80">
          "Caldito" est un mot affectif qui évoque la chaleur et la convivialité. Le pozole, plat emblématique mexicain, est généreux et rassembleur. Nous souhaitons partager ce moment de culture et de cuisine ensemble.
        </p>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-primary mb-4">Nos valeurs</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-crema rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-2">🌶️</span>
            <h3 class="text-xl font-semibold text-primary mb-2">Authentique</h3>
            <p class="text-primary/80">Nous respectons les traditions culinaires mexicaines.</p>
          </div>
          <div class="bg-crema rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-2">🤝</span>
            <h3 class="text-xl font-semibold text-primary mb-2">Fait maison & local</h3>
            <p class="text-primary/80">Nous utilisons des ingrédients locaux et frais.</p>
          </div>
          <div class="bg-crema rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-2">❤️</span>
            <h3 class="text-xl font-semibold text-primary mb-2">En famille</h3>
            <p class="text-primary/80">Chaque plat est préparé avec amour et passion.</p>
          </div>
          <div class="bg-crema rounded-xl p-6 shadow-md">
            <span class="text-3xl mb-2">📦</span>
            <h3 class="text-xl font-semibold text-primary mb-2">Éthique & engagé</h3>
            <p class="text-primary/80">Nous nous engageons pour une cuisine responsable.</p>
          </div>
        </div>
      </section>

      <section class="mb-12">
        <h2 class="text-2xl font-semibold text-primary mb-4">Ce n'est que le début</h2>
        <p class="text-lg text-primary/80">
          Pour l'instant, nos événements sont ponctuels, à la maison, avec amour. Mais qui sait ? Peut-être un jour, un restaurant... 🌍❤️🌽
        </p>
      </section>

      <div class="text-center">
        <NuxtLink to="/commander" class="bg-secondary text-primary font-bold px-6 py-3 rounded-xl hover:bg-accent hover:text-crema transition">
          Commander notre prochain Caldito !
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
// Aucun script nécessaire pour cette page
</script> 