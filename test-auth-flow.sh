#!/bin/bash
# Script de test du flux authentification Kyndex
# Usage: bash test-auth-flow.sh

echo "🧪 Tests du flux d'authentification Kyndex"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test baseURL
BASE_URL="http://localhost:3000"

echo "📍 Vérification du serveur..."
if ! curl -s --head --request GET "$BASE_URL" > /dev/null; then
    echo -e "${RED}❌ Le serveur n'est pas accessible à $BASE_URL${NC}"
    echo "   Assurez-vous que le serveur frontend est démarré."
    exit 1
fi
echo -e "${GREEN}✅ Serveur accessible${NC}"
echo ""

# Test 1: Page d'accueil accessible
echo "Test 1️⃣ : Page d'accueil accessible"
if curl -s "$BASE_URL/" | grep -q "Se connecter ou s'inscrire"; then
    echo -e "${GREEN}✅ PASS: Bouton de connexion trouvé${NC}"
else
    echo -e "${RED}❌ FAIL: Bouton de connexion non trouvé${NC}"
fi
echo ""

# Test 2: Modal d'authentification présent
echo "Test 2️⃣ : Modal d'authentification présent"
if curl -s "$BASE_URL/" | grep -q "AuthModal"; then
    echo -e "${GREEN}✅ PASS: AuthModal détecté${NC}"
else
    echo -e "${YELLOW}⚠️ WARNING: AuthModal pas détecté en sources (peut être caché)${NC}"
fi
echo ""

# Test 3: Routes de redirection
echo "Test 3️⃣ : Routes de redirection"
for route in "/auth/login" "/auth/register"; do
    echo "   Vérification de $route..."
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL$route")
    if [ "$STATUS" -eq 200 ] || [ "$STATUS" -eq 301 ] || [ "$STATUS" -eq 302 ]; then
        echo -e "${GREEN}   ✅ Route accessible (HTTP $STATUS)${NC}"
    else
        echo -e "${RED}   ❌ Route non accessible (HTTP $STATUS)${NC}"
    fi
done
echo ""

# Test 4: Dashboard protégé
echo "Test 4️⃣ : Dashboard protégé (sans authentification)"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/dashboard")
if [ "$STATUS" -eq 302 ] || [ "$STATUS" -eq 307 ]; then
    echo -e "${GREEN}✅ PASS: Dashboard redirige les non-authentifiés (HTTP $STATUS)${NC}"
else
    echo -e "${YELLOW}⚠️ WARNING: Status HTTP $STATUS (attendu 302/307)${NC}"
fi
echo ""

echo "=========================================="
echo "📋 Tests d'intégration manuelle requiers:"
echo "=========================================="
echo ""
echo "1. Connexion valide:"
echo "   [ ] Visiter http://localhost:3000"
echo "   [ ] Cliquer sur 'Se connecter'"
echo "   [ ] Entrer: email = test@example.com, password = password123"
echo "   [ ] Vérifier redirection vers /dashboard"
echo ""

echo "2. Connexion invalide:"
echo "   [ ] Entrer email inexistant ou mauvais mot de passe"
echo "   [ ] Vérifier message d'erreur s'affiche"
echo ""

echo "3. Inscription:"
echo "   [ ] Cliquer sur 'S'inscrire' du modal"
echo "   [ ] Remplir tous les champs"
echo "   [ ] Vérifier redirection vers /dashboard"
echo ""

echo "4. Accès au dashboard:"
echo "   [ ] Vérifier que la navigation affiche le menu correct"
echo "   [ ] Si client: Home, Browse, Orders, Messages, Account"
echo "   [ ] Si provider: Overview, Services, Orders, Earnings, Messages, Analytics, Account"
echo ""

echo "5. Déconnexion:"
echo "   [ ] Cliquer sur le bouton de déconnexion"
echo "   [ ] Vérifier redirection vers /"
echo "   [ ] Tenter d'accéder à /dashboard"
echo "   [ ] Vérifier redirection vers /"
echo ""

echo -e "${YELLOW}💡 Conseil: Ouvrez aussi les DevTools (F12) pour vérifier:${NC}"
echo "   - localStorage.kyndex_currentUser (doit contenir l'user)"
echo "   - localStorage.userMode_{userId} (doit être 'client' ou 'provider')"
echo "   - Aucune erreur JavaScript en console"
echo ""
