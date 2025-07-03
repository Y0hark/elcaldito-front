# Configuration du modèle UserInfo dans Strapi

## Problème actuel

Le système d'enregistrement en deux étapes essaie de créer des `UserInfo` mais l'endpoint `/api/user-infos` n'existe pas encore dans votre backend Strapi, ce qui cause les erreurs 404/405.

## Solution : Créer le modèle UserInfo dans Strapi

### 1. Accéder à l'admin Strapi

1. Ouvrez votre navigateur et allez sur `http://localhost:1337/admin`
2. Connectez-vous à votre compte admin Strapi

### 2. Créer le Content-Type UserInfo

1. Dans le menu de gauche, cliquez sur **"Content-Type Builder"**
2. Cliquez sur **"Create new collection type"**
3. Nommez-le **"UserInfo"** (sensible à la casse)

### 3. Ajouter les champs

Ajoutez les champs suivants :

#### Champ "phone"
- **Type** : Text
- **Name** : `phone`
- **Required** : ✅ Oui
- **Unique** : ✅ Oui (optionnel, pour éviter les doublons)

#### Champ "address"
- **Type** : Long text
- **Name** : `address`
- **Required** : ❌ Non

#### Champ "user"
- **Type** : Relation
- **Name** : `user`
- **Target** : User (from Users & Permissions)
- **Type of relation** : One-to-one
- **Required** : ✅ Oui

### 4. Sauvegarder et redémarrer

1. Cliquez sur **"Save"**
2. Strapi va redémarrer automatiquement
3. Attendez que le redémarrage soit terminé

### 5. Configurer les permissions

1. Allez dans **"Settings"** → **"Users & Permissions"** → **"Roles"**
2. Cliquez sur **"Authenticated"**
3. Trouvez **"UserInfo"** dans la liste
4. Activez les permissions suivantes :
   - ✅ **find** (pour récupérer les UserInfo)
   - ✅ **findOne** (pour récupérer un UserInfo spécifique)
   - ✅ **create** (pour créer un UserInfo)
   - ✅ **update** (pour mettre à jour un UserInfo)
   - ✅ **delete** (pour supprimer un UserInfo)

5. Cliquez sur **"Save"**

### 6. Vérifier les permissions pour Public (optionnel)

Si vous voulez permettre la création de UserInfo sans authentification (non recommandé) :

1. Dans **"Settings"** → **"Users & Permissions"** → **"Roles"**
2. Cliquez sur **"Public"**
3. Trouvez **"UserInfo"** dans la liste
4. Activez uniquement **create** si nécessaire
5. Cliquez sur **"Save"**

### 7. Tester l'API

Vous pouvez tester l'API avec curl ou Postman :

```bash
# D'abord, obtenir un token d'authentification
curl -X POST http://localhost:1337/api/auth/local \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "votre_email@example.com",
    "password": "votre_mot_de_passe"
  }'

# Créer un UserInfo (remplacez YOUR_TOKEN par le token obtenu)
curl -X POST http://localhost:1337/api/user-infos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "data": {
      "phone": "06 12 34 56 78",
      "address": "123 Rue de la Paix, 75001 Paris",
      "user": 1
    }
  }'

# Récupérer les UserInfo
curl -X GET "http://localhost:1337/api/user-infos?populate=*" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Diagnostic des erreurs

### Erreur 401 (Unauthorized)
- **Cause** : Token d'authentification invalide ou manquant
- **Solution** : Vérifier que l'utilisateur est bien connecté et que le token est valide

### Erreur 400 (Bad Request)
- **Cause** : Format de données invalide
- **Solutions possibles** :
  1. Vérifier que tous les champs requis sont présents
  2. Vérifier le format des données envoyées
  3. Vérifier que la relation avec l'utilisateur est correcte

### Erreur 403 (Forbidden)
- **Cause** : Permissions insuffisantes
- **Solution** : Vérifier les permissions dans Strapi (étape 5)

## Alternative temporaire

Si vous ne voulez pas créer le modèle UserInfo immédiatement, le système actuel est conçu pour gérer cette situation :

- Les erreurs 404/405 sont capturées et traitées gracieusement
- L'inscription se termine avec succès même si les UserInfo ne peuvent pas être créés
- L'utilisateur peut ajouter ses informations plus tard via la page de compte

## Vérification

Après avoir créé le modèle, testez le processus d'enregistrement :

1. Allez sur `/register`
2. Créez un compte en deux étapes
3. Vérifiez dans l'admin Strapi que le UserInfo a été créé
4. Vérifiez que vous pouvez modifier les informations depuis `/compte`

## Structure finale attendue

Le modèle UserInfo devrait avoir cette structure dans Strapi :

```json
{
  "id": 1,
  "phone": "06 12 34 56 78",
  "address": "123 Rue de la Paix, 75001 Paris",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com"
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Debugging

Pour diagnostiquer les problèmes :

1. **Vérifier les logs Strapi** dans la console où Strapi tourne
2. **Vérifier les logs du navigateur** (F12 → Console)
3. **Tester l'API directement** avec curl ou Postman
4. **Vérifier les permissions** dans l'admin Strapi
5. **Vérifier que le token est valide** en testant un endpoint protégé 