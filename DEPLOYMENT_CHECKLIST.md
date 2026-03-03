# 📋 Checklist de Déploiement Kyndex

**Date de création:** 3 mars 2026  
**Version:** 1.0  
**Dépôt:** https://github.com/nelson227/kyndex_pr.git  
**Branche de déploiement:** `develop`

---

## 📌 Vue d'ensemble

Ce document suit le processus complet de déploiement de l'application Kyndex sur **Vercel**. Tous les éléments nécessaires sont documentés pour assurer un déploiement fluide et reproductible.

---

## ✅ Prérequis avant déploiement

- [ ] **Compte GitHub:** https://github.com/nelson227/kyndex_pr
- [ ] **Compte Vercel:** https://vercel.com
- [ ] **Connexion Vercel-GitHub établie**
- [ ] **Repository GitHub visible:** Public ou avec accès approprié
- [ ] **Node.js 18+** installé localement
- [ ] **npm** ou **yarn** disponible

---

## 🔧 Configuration requise

### Variables d'environnement (Frontend)

**Fichier:** `.env.production`

```env
# API Backend
NEXT_PUBLIC_API_BASE_URL=https://kyndex-backend.example.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Socket.IO (messages temps réel)
NEXT_PUBLIC_SOCKET_URL=https://kyndex-backend.example.com

# Analytics (optionnel)
NEXT_PUBLIC_ANALYTICS_ID=

# Feature flags
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false
```

### Variables d'environnement (Backend)

**Fichier:** `.env.production` (backend)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/kyndex_prod

# JWT Secret
JWT_SECRET=your-secure-jwt-secret-key

# API Port
PORT=3001

# Node environment
NODE_ENV=production

# CORS
CORS_ORIGIN=https://kyndex-pr-ussc.vercel.app

# File uploads
UPLOAD_DIR=/app/uploads
UPLOAD_MAX_SIZE=10485760
```

---

## 🚀 Étapes de déploiement

### **Phase 1: Préparation locale**

- [ ] **Cloner/Mettre à jour le dépôt:**
  ```bash
  git clone https://github.com/nelson227/kyndex_pr.git
  cd Kyndex
  git checkout develop
  git pull origin develop
  ```

- [ ] **Installer les dépendances:**
  ```bash
  npm install  # Frontend
  cd backend && npm install  # Backend
  ```

- [ ] **Tester localement:**
  ```bash
  npm run dev  # Frontend sur :3000
  cd backend && npm run dev  # Backend sur :3001
  ```

- [ ] **Vérifier les erreurs de build:**
  ```bash
  npm run build  # Frontend
  cd backend && npm run build  # Backend
  ```

### **Phase 2: Git et versioning**

- [ ] **Vérifier les changements non committés:**
  ```bash
  git status
  ```

- [ ] **Committer les changements:**
  ```bash
  git add .
  git commit -m "Version X.X.X - Description des changements"
  ```

- [ ] **Pousser vers le dépôt:**
  ```bash
  git push origin develop
  ```

- [ ] **Attendre le webhook Vercel** (~30 secondes)

### **Phase 3: Vérification Vercel**

- [ ] **Se connecter à Vercel:** https://vercel.com
- [ ] **Vérifier les déploiements en cours**
- [ ] **Consulter les logs de build:**
  - ✅ Pas d'erreurs TypeScript
  - ✅ Pas d'avertissements critiques
  - ✅ Build time < 5 minutes
- [ ] **Tester l'URL de déploiement**

---

## 🐛 Problèmes connus et solutions

### **Problème 1: "Error: cloning the repo"**
- **Cause:** Repository privé ou accès non configuré
- **Solution:** 
  - Vérifier que le repository est PUBLIC
  - Ou créer un Personal Access Token GitHub
  - Connecter le token à Vercel (Settings → Git)

### **Problème 2: useSearchParams() erreur**
- **Cause:** Hook utilisé sans Suspense boundary
- **Solution:** 
  - ✅ **DÉJÀ CORRIGÉ** dans `/frontend/src/app/messages/page.tsx`
  - Envelopper dans `<Suspense>`

### **Problème 3: Mobile responsive mal affiché**
- **Cause:** Classes Tailwind non responsives (md: vs lg:)
- **Solution:** 
  - ✅ **DÉJÀ CORRIGÉ** 
  - Messages page: `grid-cols-1 lg:grid-cols-3`
  - Dashboard: `grid-cols-2 lg:grid-cols-4`
  - Profile: Tailles adaptées `sm:` breakpoints

### **Problème 4: Backend n'est pas accessible**
- **Cause:** CORS ou URL mal configurée
- **Solution:**
  - Vérifier `.env.production` CORS_ORIGIN
  - Vérifier que backend est déployé
  - Tester l'URL de l'API dans les headers

### **Problème 5: Build timeout**
- **Cause:** Dépendances volumineuses ou lenteur réseau
- **Solution:**
  - Augmenter le timeout dans Vercel Settings
  - Optimiser les imports (tree-shaking)
  - Réduire la taille des bundle

---

## 📊 Performance et monitoring

### **Metrics à surveiller:**
- [ ] **Build time:** < 5 min
- [ ] **Page load speed:** < 3 sec (LCP < 2.5s)
- [ ] **Core Web Vitals:** Tous au vert
- [ ] **Response time API:** < 500ms
- [ ] **Uptime:** 99.9%+

### **Outils de monitoring:**
- Vercel Analytics: https://vercel.com/analytics
- Sentry (erreurs): https://sentry.io
- LogRocket (user experience): https://logrocket.com

---

## 📱 Testing post-déploiement

### **Desktop testing:**
- [ ] Accueil page charge correctement
- [ ] Dashboard stats visibles
- [ ] Messages fonctionnent
- [ ] Profile éditable
- [ ] Navigation fonctionnelle

### **Mobile testing (iPhone/Android):**
- [ ] Messages layout correct
- [ ] Dashboard responsive
- [ ] Bottom nav accessible
- [ ] Avatar upload fonctionne
- [ ] Pas de scroll horizontal non intentionnel

### **Endpoints à tester:**
- [ ] `GET /profile/me` → Info utilisateur
- [ ] `GET /messages/conversations` → List conversations
- [ ] `POST /messages/conversations/{id}/messages` → Send message
- [ ] `GET /dashboard` → Stats chargées

---

## 🔐 Checklist de sécurité

- [ ] **Secrets sécurisés:** JWT_SECRET changé
- [ ] **CORS configuré:** Domaines autorisés uniquement
- [ ] **HTTPS enforced:** Tous les `http://` → `https://`
- [ ] **Rate limiting:** Actif sur les endpoints sensibles
- [ ] **Validation input:** Tous les formulaires validés côté serveur
- [ ] **Dépendances up-to-date:** `npm audit` sans vulnérabilités critiques
- [ ] **API keys:** Non commités dans git

---

## 📝 Fichiers importants de déploiement

| Fichier | Description |
|---------|-------------|
| `.env.production` | Variables d'environnement production |
| `vercel.json` | Configuration Vercel |
| `package.json` | Dépendances et scripts |
| `frontend/next.config.js` | Configuration Next.js |
| `backend/package.json` | Scripts backend |
| `docker-compose.yml` | Configuration Docker (optionnel) |

---

## 🔄 Processus de rollback

Si un déploiement pose problème:

1. **Vercel simple:** Cliquer sur "Redeploy" d'une build précédente
2. **Git rollback:**
   ```bash
   git revert <commit-hash>
   git push origin develop
   ```
3. **Variables d'environnement:** Revenir à la version précédente dans Vercel Settings

---

## 📅 Versions de déploiement

| Version | Date | État | Notes |
|---------|------|------|-------|
| 1.0.0 | 2026-03-03 | ✅ En cours | Déploiement initial |
| | | | |

---

## 📞 Support et escalade

- **Problème technique:** Consulter les logs Vercel
- **Erreur TypeScript:** Vérifier `npm run build` localement
- **Issues GitHub:** Document les bugs rencontrés

---

## ✨ Derniers changements (3 mars 2026)

✅ **Messages page - Fix Suspense boundary**
- Créé `messages-content.tsx` composant client
- Page.tsx enveloppée dans `<Suspense>`
- Résolve l'erreur "useSearchParams() sans suspense boundary"

✅ **Mobile responsiveness amélioré**
- Messages: Grid `lg:grid-cols-3`, conversations cachées sur mobile
- Dashboard: Stats cards 2 colonnes mobile, 4 colonnes desktop
- Profile: Tailles adaptées, avatars responsifs
- Réduction des padding/margin sur appareil petite écran

✅ **Webhook GitHub configuré**
- Déploiement automatique sur push vers `develop`
- Build déclenchée automatiquement

---

**Statut actuel:** ✅ Prêt pour production  
**Dernière mise à jour:** 3 mars 2026  
**Prochain déploiement:** À l'initiative de l'équipe
