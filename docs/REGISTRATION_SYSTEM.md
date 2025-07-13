# Système d'enregistrement en deux étapes

## Vue d'ensemble

Ce système implémente un processus d'enregistrement utilisateur en deux étapes distinctes, séparant la création du compte de base de la collecte des informations complémentaires (UserInfo).

## Architecture

### Composants principaux

1. **RegistrationProgress.vue** - Indicateur de progression visuel
2. **RegistrationStep1.vue** - Formulaire des informations de base (email, username, password)
3. **RegistrationStep2.vue** - Formulaire des informations complémentaires (téléphone, adresse)
4. **RegistrationSuccess.vue** - Modal de confirmation après inscription réussie

### Composables

1. **useAuth.ts** - Gestion de l'authentification (modifié pour supporter le nouveau processus)
2. **useUserInfo.ts** - Gestion des opérations CRUD sur les UserInfo

### Pages

1. **pages/register.vue** - Page principale orchestrant le processus en deux étapes
2. **pages/compte.vue** - Page de profil avec possibilité de modifier les UserInfo

## Flux d'enregistrement

### Étape 1 : Informations de base
- Email (requis)
- Nom d'utilisateur (requis)
- Mot de passe (requis)
- Confirmation du mot de passe (requis)

**Validation :**
- Format email valide
- Nom d'utilisateur : 3+ caractères, lettres/chiffres/underscores uniquement
- Mot de passe : 6+ caractères
- Correspondance des mots de passe

**Sauvegarde :** Les données sont sauvegardées temporairement dans `localStorage`

### Étape 2 : Informations complémentaires
- Téléphone (requis)
- Adresse (optionnel)

**Validation :**
- Format téléphone français valide
- Possibilité de passer cette étape

**Options :**
- Continuer vers la finalisation
- Revenir à l'étape 1
- Passer cette étape

### Étape 3 : Finalisation
- Création du compte utilisateur via Strapi
- Création/mise à jour des UserInfo
- Nettoyage des données temporaires
- Redirection vers la page de commande

## Gestion des erreurs et cas particuliers

### Sauvegarde temporaire
- Les données de l'étape 1 sont sauvegardées dans `localStorage`
- Reprise automatique si l'utilisateur ferme le navigateur
- Nettoyage automatique après inscription réussie

### Gestion des erreurs
- Validation en temps réel
- Messages d'erreur contextuels
- Retry automatique avec backoff exponentiel pour les API calls
- Gestion des timeouts

### Sécurité
- Validation côté client et serveur
- Token d'authentification pour les opérations UserInfo
- Nettoyage des données sensibles

## API Endpoints utilisés

### Authentification
- `POST /api/auth/local/register` - Création du compte utilisateur

### UserInfo
- `POST /api/user-infos` - Création d'un UserInfo
- `PUT /api/user-infos/:id` - Mise à jour d'un UserInfo
- `GET /api/user-infos?populate=*&filters[user][id][$eq]=:userId` - Récupération des UserInfo

## Middleware

### registration-resume.global.ts
- Vérification automatique des données temporaires
- Redirection si utilisateur déjà connecté
- Nettoyage des données corrompues

## Fonctionnalités avancées

### Retry automatique
Le composable `useUserInfo` implémente un système de retry avec backoff exponentiel :
- 3 tentatives par défaut
- Délais : 2s, 4s, 8s
- Gestion des erreurs réseau et serveur

### Validation robuste
- Validation en temps réel
- Messages d'erreur contextuels
- Formats spécifiques (téléphone français, email, etc.)

### UX optimisée
- Indicateur de progression visuel
- Messages de statut clairs
- Possibilité de revenir en arrière
- Option de passer l'étape 2

## Utilisation

### Pour les développeurs

1. **Modifier le processus d'enregistrement :**
   ```javascript
   // Dans RegistrationStep1.vue ou RegistrationStep2.vue
   // Ajouter de nouveaux champs et validation
   ```

2. **Ajouter de nouveaux champs UserInfo :**
   ```javascript
   // Dans useUserInfo.ts
   export interface UserInfo {
     id?: number
     phone: string
     address?: string
     user?: number
     // Ajouter de nouveaux champs ici
   }
   ```

3. **Modifier la validation :**
   ```javascript
   // Dans les composants d'étape
   const validateForm = () => {
     // Ajouter de nouvelles règles de validation
   }
   ```

### Pour les utilisateurs

1. **Inscription normale :**
   - Remplir les informations de base
   - Compléter les informations complémentaires
   - Finalisation automatique

2. **Reprise après fermeture :**
   - Retour sur `/register`
   - Reprise automatique à l'étape 2
   - Données de l'étape 1 restaurées

3. **Modification post-inscription :**
   - Aller sur `/compte`
   - Cliquer sur "Modifier mes informations"
   - Mettre à jour téléphone et adresse

## Tests recommandés

1. **Flux complet :**
   - Inscription normale en deux étapes
   - Vérification de la création UserInfo
   - Test de connexion

2. **Cas d'erreur :**
   - Fermeture du navigateur entre les étapes
   - Erreurs réseau
   - Données invalides

3. **Modification :**
   - Mise à jour des UserInfo depuis `/compte`
   - Validation des changements

## Maintenance

### Nettoyage des données
- Les données temporaires sont automatiquement nettoyées
- Vérification périodique des données orphelines

### Monitoring
- Logs des erreurs d'API
- Suivi des échecs de création UserInfo
- Métriques de conversion

## Évolutions futures

1. **Validation téléphone :** Intégration d'un service de validation SMS
2. **Adresse :** Intégration d'un service de géocodage
3. **Étapes supplémentaires :** Possibilité d'ajouter d'autres étapes
4. **A/B testing :** Comparaison avec l'ancien processus 