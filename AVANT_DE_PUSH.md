# ✅ Checklist AVANT de Push vers GitHub

## Ce que j'ai fait pour vous:

1. ✅ Nettoyé `src/.env.local` (retiré la nouvelle clé)
2. ✅ Ajouté `src/.env.local` au `.gitignore`
3. ✅ Vérifié que `server/.env` est dans `.gitignore`

## IMPORTANT: Architecture de Sécurité

### ❌ NE JAMAIS mettre la clé API dans le frontend!

```
src/.env.local          ← ❌ NON! Variables VITE_ sont publiques
.env.local              ← ❌ NON! Même avec VITE_ c'est public
```

### ✅ La clé API doit être UNIQUEMENT:

1. **Sur Vercel** (Environment Variables)
   - Pour la production
   - Variables backend (sans VITE_)

2. **Dans `server/.env`** (local seulement)
   - Pour le dev local avec le serveur Express
   - Jamais committé à git

### 📁 Structure Correcte:

```
Développement Local:
├── server/.env              ← Clé API ici (gitignored)
└── Frontend appelle → http://localhost:3001/api/chat/message

Production Vercel:
├── Vercel Env Vars          ← Clé API ici (dans dashboard)
└── Frontend appelle → /api/chat/message (même domaine)
```

## Avant de Push - Vérifications:

### 1. Vérifier qu'aucune clé n'est trackée par git:

```bash
# Voir ce qui sera commité
git status

# Vérifier qu'aucun fichier .env n'apparaît
# Si vous voyez .env ou .env.local → STOP!

# Vérifier le contenu avant commit
git diff --cached
```

### 2. Si vous voyez des fichiers .env dans git status:

```bash
# Retirer du staging
git reset HEAD server/.env
git reset HEAD src/.env.local
git reset HEAD .env.local

# Vérifier qu'ils sont bien ignorés
git status
```

### 3. Vérifier qu'aucune clé n'est dans le code:

```bash
# Chercher les clés API dans le code
grep -r "sk-ant-api" --exclude-dir=node_modules --exclude-dir=.git .

# Si vous trouvez des clés → les retirer!
```

### 4. Push en sécurité:

```bash
# Commit les changements (sans les .env)
git add .
git commit -m "Fix: Security cleanup and Vercel migration"

# Force push (car BFG a réécrit l'historique)
git push --force origin main
```

## Après le Push - Vérifications:

### 1. Vérifier sur GitHub:

- Allez sur votre repo GitHub
- Cherchez "sk-ant" dans la recherche GitHub
- Vérifiez qu'aucune clé n'apparaît

### 2. Tester Vercel:

```bash
# Test health endpoint
curl https://votre-app.vercel.app/api/health
```

Devrait afficher:
```json
{
  "hasAnthropicKey": true,
  "keyPrefix": "sk-ant-api..."
}
```

### 3. Tester l'application:

- Ouvrir https://votre-app.vercel.app
- Charger un article Wikipedia
- Poser une question
- ✅ Ça doit fonctionner!

## Configuration des Clés - Récap:

### Pour le Développement Local:

Éditez `server/.env` (PAS commité):
```bash
ANTHROPIC_API_KEY=sk-ant-api03-VOTRE-NOUVELLE-CLE
```

Puis lancez:
```bash
# Terminal 1: Backend Express
cd server
npm run dev

# Terminal 2: Frontend Vite
npm run dev
```

### Pour Vercel (Production):

1. Vercel Dashboard → Settings → Environment Variables
2. Variable: `ANTHROPIC_API_KEY`
3. Valeur: Votre nouvelle clé
4. Cocher: Production, Preview, Development
5. Redeploy

## ⚠️ Rappels Importants:

1. **VITE_ = PUBLIC**: Tout ce qui commence par `VITE_` est exposé dans le navigateur
2. **API Keys = Backend ONLY**: Les clés API ne vont JAMAIS dans le frontend
3. **Vercel = Serverless**: Sur Vercel, la clé est dans les env vars, pas dans le code
4. **.gitignore = Protection**: Vérifiez toujours avant de commit

## Si Vous Avez Déjà Push une Clé par Erreur:

1. **Révoquer immédiatement** la clé sur Anthropic
2. Créer une nouvelle clé
3. Nettoyer l'historique git avec BFG (comme vous avez fait)
4. Force push
5. Vérifier sur GitHub qu'elle n'apparaît plus

---

## Prêt à Push?

- [ ] Vérifié `git status` (pas de .env)
- [ ] Vérifié `git diff --cached` (pas de clé)
- [ ] Nouvelle clé dans Vercel
- [ ] Nouvelle clé dans `server/.env` (local)
- [ ] `src/.env.local` nettoyé
- [ ] BFG nettoyage effectué
- [ ] Prêt pour `git push --force origin main`

**Allez-y!** 🚀
