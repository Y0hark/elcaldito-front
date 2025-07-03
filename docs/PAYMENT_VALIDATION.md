# Validation du Paiement en Liquide

## Objectif

Autoriser le paiement en liquide uniquement si un utilisateur fait au maximum deux réservations sur une même marmite (événement). Si l'utilisateur essaie de faire plus de deux réservations sur une même marmite, il doit passer par Stripe uniquement.

## Règles de Validation

### 1. Limite Globale par Utilisateur
- **Maximum 6 bols par utilisateur par marmite**
- Cette règle s'applique quel que soit le mode de paiement

### 2. Limite Paiement en Liquide
- **Maximum 2 bols en liquide par utilisateur par marmite**
- Au-delà de 2 bols, le paiement par carte (Stripe) est obligatoire

### 3. Contrôle des Commandes Multiples
- Le contrôle porte sur le **total des commandes** d'un utilisateur sur UNE marmite
- Les utilisateurs ne peuvent pas contourner la limite en faisant plusieurs commandes séparées

## Implémentation Technique

### Composable `useCommandeValidation`

Le composable centralise toute la logique de validation :

```typescript
interface CommandeValidationResult {
  isValid: boolean
  error?: string
  requiresStripe?: boolean
}

const validateCommande = async (
  eventId: number,
  quantite: number,
  paymentMethod: 'liquide' | 'stripe',
  userId?: number
): Promise<CommandeValidationResult>
```

### Fonctions Principales

1. **`validateCommande`** : Validation complète d'une commande
2. **`getUserOrdersForEvent`** : Récupération des commandes existantes
3. **`canPayInCash`** : Vérification rapide de la possibilité de paiement en liquide

### Validation Côté Frontend

La validation se fait en temps réel dans `pages/commander.vue` :

- **Vérification automatique** lors du changement de quantité
- **Vérification automatique** lors du changement de méthode de paiement
- **Interface utilisateur réactive** qui désactive les options non disponibles
- **Messages d'erreur explicites** pour guider l'utilisateur

### Validation Côté Backend

La validation doit également être implémentée côté Strapi pour sécuriser les données :

```javascript
// Dans le lifecycle hook beforeCreate de Strapi
const validateCommande = async (data) => {
  const { event, quantite, paymentMethod, user } = data
  
  // Récupérer les commandes existantes
  const existingOrders = await strapi.entityService.findMany('api::commande.commande', {
    filters: {
      event: event.id,
      user: user.id
    }
  })
  
  // Calculer les totaux
  const totalOrders = existingOrders.reduce((sum, order) => sum + order.quantite, 0)
  const totalLiquideOrders = existingOrders
    .filter(order => order.paymentMethod === 'liquide')
    .reduce((sum, order) => sum + order.quantite, 0)
  
  // Validation
  if (totalOrders + quantite > 6) {
    throw new Error('Limite de 6 bols par personne dépassée')
  }
  
  if (paymentMethod === 'liquide' && totalLiquideOrders + quantite > 2) {
    throw new Error('Paiement en liquide limité à 2 bols par personne')
  }
}
```

## Interface Utilisateur

### Sélecteur de Méthode de Paiement

- **Radio buttons** pour choisir entre liquide et carte
- **État désactivé** pour l'option liquide si limite atteinte
- **Messages d'information** sur les règles de paiement
- **Avertissements visuels** quand le paiement liquide n'est pas disponible

### Composant `PaymentWarning`

Affiche les avertissements de manière claire et propose des actions :

```vue
<PaymentWarning
  :show="orderForm.paymentMethod === 'liquide' && !paymentValidation.canPayInCash"
  title="Paiement en liquide non disponible"
  message="Vous avez atteint la limite de 2 bols en liquide pour cette marmite."
  action="Passer au paiement par carte"
  @action="orderForm.paymentMethod = 'stripe'"
/>
```

## Cas d'Usage

### Cas 1 : Première Commande
- Utilisateur peut choisir liquide ou carte
- Aucune restriction

### Cas 2 : Deuxième Commande en Liquide
- Utilisateur peut encore payer en liquide
- Total liquide = 2 bols

### Cas 3 : Troisième Commande
- Paiement liquide désactivé
- Carte obligatoire
- Message explicatif affiché

### Cas 4 : Tentative de Contournement
- L'utilisateur essaie de faire plusieurs commandes séparées
- La validation côté backend bloque la création
- Message d'erreur explicite

## Sécurité

### Double Validation
1. **Frontend** : Pour l'expérience utilisateur
2. **Backend** : Pour la sécurité des données

### Vérification des Données
- Validation de l'authentification utilisateur
- Vérification de l'existence de l'événement
- Contrôle des permissions

### Gestion des Erreurs
- Messages d'erreur explicites
- Fallback vers le paiement par carte
- Logs pour le debugging

## Tests

### Tests Frontend
- Vérification de la désactivation du paiement liquide
- Test des messages d'erreur
- Test de la validation en temps réel

### Tests Backend
- Test de la validation côté serveur
- Test des cas limites
- Test de la sécurité

## Évolution Future

### Améliorations Possibles
- **Cache** des validations pour améliorer les performances
- **Notifications push** pour informer des changements de règles
- **Historique** des validations pour l'audit
- **Configuration** des limites via l'admin Strapi

### Extensions
- **Paiement PayPal** comme alternative
- **Règles par événement** (limites différentes selon la marmite)
- **Système de fidélité** avec avantages sur les limites 