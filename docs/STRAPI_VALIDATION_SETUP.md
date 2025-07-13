# Configuration de la Validation Côté Strapi

## Ajout du Champ PaymentMethod

### 1. Modifier le Content-Type Commande

Dans l'admin Strapi, allez dans **Content-Type Builder** → **Commande** et ajoutez un nouveau champ :

- **Type** : Enumeration
- **Name** : `paymentMethod`
- **Values** :
  - `liquide`
  - `stripe`
- **Required** : ✅ Oui
- **Default value** : `liquide`

### 2. Sauvegarder et Redémarrer

Cliquez sur **Save** et attendez le redémarrage de Strapi.

## Configuration des Permissions

### 1. Permissions pour les Utilisateurs Authentifiés

Allez dans **Settings** → **Users & Permissions** → **Roles** → **Authenticated** :

- ✅ **find** (pour récupérer les commandes)
- ✅ **findOne** (pour récupérer une commande)
- ✅ **create** (pour créer une commande)
- ✅ **update** (pour modifier une commande)
- ✅ **delete** (pour supprimer une commande)

### 2. Permissions pour Public (optionnel)

Si vous voulez permettre la création de commandes sans authentification :

- ✅ **create** uniquement

## Lifecycle Hooks

### 1. Créer le Fichier de Validation

Créez le fichier `./src/api/commande/content-types/commande/lifecycles.js` :

```javascript
module.exports = {
  beforeCreate(event) {
    const { data } = event.params;
    
    // Validation de la commande
    validateCommande(data);
  },
  
  beforeUpdate(event) {
    const { data } = event.params;
    
    // Validation lors de la mise à jour
    validateCommande(data);
  }
};

async function validateCommande(data) {
  const { event, quantite, paymentMethod, user } = data;
  
  // Si pas d'utilisateur, on ne peut pas valider
  if (!user) {
    return;
  }
  
  try {
    // Récupérer toutes les commandes de l'utilisateur pour cet événement
    const existingOrders = await strapi.entityService.findMany('api::commande.commande', {
      filters: {
        event: event,
        user: user
      },
      populate: ['event', 'user']
    });
    
    // Calculer le total des commandes existantes
    const totalExistingOrders = existingOrders.reduce((sum, order) => {
      return sum + (order.quantite || 0);
    }, 0);
    
    // Calculer le total après la nouvelle commande
    const totalAfterNewOrder = totalExistingOrders + (quantite || 0);
    
    // Règle 1: Maximum 6 bols par utilisateur par marmite
    if (totalAfterNewOrder > 6) {
      throw new Error(`Limite de 6 bols par personne dépassée. Vous avez déjà commandé ${totalExistingOrders} bols pour cette marmite.`);
    }
    
    // Règle 2: Paiement en liquide limité à 2 bols par utilisateur par marmite
    if (paymentMethod === 'liquide') {
      const existingLiquideOrders = existingOrders.filter(order => order.paymentMethod === 'liquide');
      const totalLiquideOrders = existingLiquideOrders.reduce((sum, order) => {
        return sum + (order.quantite || 0);
      }, 0);
      
      if (totalLiquideOrders + (quantite || 0) > 2) {
        throw new Error(`Le paiement en liquide est limité à 2 bols par utilisateur par marmite. Vous avez déjà commandé ${totalLiquideOrders} bols en liquide pour cette marmite. Veuillez utiliser le paiement par carte.`);
      }
    }
    
  } catch (error) {
    // Log l'erreur pour le debugging
    console.error('Erreur de validation de commande:', error);
    
    // Rejeter la création/mise à jour avec l'erreur
    throw new Error(error.message);
  }
}
```

### 2. Gestion des Erreurs

Pour une meilleure gestion des erreurs, vous pouvez créer un middleware personnalisé :

```javascript
// ./src/middlewares/error-handler.js
module.exports = (config, { strapi }) => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      // Log l'erreur
      strapi.log.error('Error in API:', error);
      
      // Retourner une réponse d'erreur formatée
      ctx.status = error.status || 400;
      ctx.body = {
        error: {
          message: error.message,
          details: error.details || null
        }
      };
    }
  };
};
```

## API Endpoints

### 1. Endpoint de Validation

Créez un endpoint personnalisé pour la validation en temps réel :

```javascript
// ./src/api/commande/controllers/commande.js
module.exports = {
  async validatePayment(ctx) {
    const { eventId, quantite, paymentMethod, userId } = ctx.request.body;
    
    try {
      // Récupérer les commandes existantes
      const existingOrders = await strapi.entityService.findMany('api::commande.commande', {
        filters: {
          event: eventId,
          user: userId
        }
      });
      
      // Calculer les totaux
      const totalOrders = existingOrders.reduce((sum, order) => sum + (order.quantite || 0), 0);
      const totalLiquideOrders = existingOrders
        .filter(order => order.paymentMethod === 'liquide')
        .reduce((sum, order) => sum + (order.quantite || 0), 0);
      
      // Validation
      const canPayInCash = paymentMethod === 'liquide' && (totalLiquideOrders + quantite) <= 2;
      const isValid = (totalOrders + quantite) <= 6;
      
      return {
        isValid,
        canPayInCash,
        totalOrders,
        totalLiquideOrders,
        message: isValid ? 'Commande valide' : 'Limite dépassée'
      };
      
    } catch (error) {
      ctx.throw(500, 'Erreur lors de la validation');
    }
  }
};
```

### 2. Routes

Ajoutez la route dans `./src/api/commande/routes/commande.js` :

```javascript
module.exports = {
  routes: [
    // Routes existantes...
    {
      method: 'POST',
      path: '/commandes/validate-payment',
      handler: 'commande.validatePayment',
      config: {
        auth: {
          scope: ['authenticated']
        }
      }
    }
  ]
};
```

## Tests de la Validation

### 1. Test avec cURL

```bash
# Test de validation
curl -X POST http://localhost:1337/api/commandes/validate-payment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "eventId": 1,
    "quantite": 2,
    "paymentMethod": "liquide",
    "userId": 1
  }'
```

### 2. Test de Création de Commande

```bash
# Créer une commande
curl -X POST http://localhost:1337/api/commandes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "quantite": 2,
      "paymentMethod": "liquide",
      "event": 1,
      "user": 1,
      "state": "En attente"
    }
  }'
```

## Monitoring et Logs

### 1. Configuration des Logs

Dans `./config/logger.js` :

```javascript
module.exports = {
  settings: {
    logger: {
      level: 'debug',
      requests: true
    }
  }
};
```

### 2. Logs de Validation

Les erreurs de validation sont automatiquement loggées dans :

- `./logs/error.log` : Erreurs de validation
- `./logs/combined.log` : Tous les logs

## Sécurité

### 1. Validation des Données

- Vérification de l'authentification utilisateur
- Validation des types de données
- Sanitisation des entrées

### 2. Rate Limiting

Ajoutez un middleware de rate limiting :

```javascript
// ./src/middlewares/rate-limit.js
module.exports = (config, { strapi }) => {
  const rateLimit = require('express-rate-limit');
  
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite par IP
    message: 'Trop de requêtes, veuillez réessayer plus tard.'
  });
};
```

## Déploiement

### 1. Variables d'Environnement

Ajoutez dans votre `.env` :

```env
# Configuration de la validation
VALIDATION_ENABLED=true
MAX_ORDERS_PER_USER=6
MAX_CASH_ORDERS_PER_USER=2
```

### 2. Migration des Données

Si vous avez des commandes existantes sans `paymentMethod`, créez une migration :

```javascript
// ./src/migrations/add-payment-method.js
module.exports = async (knex) => {
  await knex('commandes').update({ paymentMethod: 'liquide' }).whereNull('paymentMethod');
};
```

## Support

Pour toute question ou problème :

1. Vérifiez les logs Strapi
2. Testez avec les endpoints cURL
3. Vérifiez la configuration des permissions
4. Consultez la documentation Strapi officielle 