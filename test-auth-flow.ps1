# Script de test du flux authentification Kyndex (Windows PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File .\test-auth-flow.ps1

Write-Host "🧪 Tests du flux d'authentification Kyndex" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$baseURL = "http://localhost:3000"

# Test baseURL
Write-Host "📍 Vérification du serveur..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseURL" -ErrorAction Stop
    Write-Host "✅ Serveur accessible" -ForegroundColor Green
} catch {
    Write-Host "❌ Le serveur n'est pas accessible à $baseURL" -ForegroundColor Red
    Write-Host "   Assurez-vous que le serveur frontend est démarré." -ForegroundColor Red
    Write-Host "   Commande pour démarrer: npm run dev (dans le dossier frontend)" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Test 1: Page d'accueil accessible
Write-Host "Test 1️⃣ : Page d'accueil accessible" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseURL/" -ErrorAction Stop
    if ($response.Content -match "Se connecter") {
        Write-Host "✅ PASS: Bouton de connexion trouvé" -ForegroundColor Green
    } else {
        Write-Host "⚠️ WARNING: Bouton de connexion pas trouvé en HTML" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ FAIL: Impossible d'accéder à la page d'accueil" -ForegroundColor Red
}
Write-Host ""

# Test 2: Routes de redirection
Write-Host "Test 2️⃣ : Routes de redirection" -ForegroundColor Cyan
@("/auth/login", "/auth/register") | ForEach-Object {
    $route = $_
    try {
        $response = Invoke-WebRequest -Uri "$baseURL$route" -ErrorAction SilentlyContinue -MaximumRedirection 0
        $status = $response.StatusCode
    } catch {
        $status = $_.Exception.Response.StatusCode.Value
    }
    
    Write-Host "   Vérification de $route..." -ForegroundColor Gray
    if ($status -eq 200 -or $status -eq 301 -or $status -eq 302) {
        Write-Host "   ✅ Route accessible (HTTP $status)" -ForegroundColor Green
    } else {
        Write-Host "   Status HTTP: $status" -ForegroundColor Yellow
    }
}
Write-Host ""

# Test 3: Dashboard protégé
Write-Host "Test 3️⃣ : Dashboard protégé (sans authentification)" -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$baseURL/dashboard" -ErrorAction SilentlyContinue -MaximumRedirection 0
    $status = $response.StatusCode
} catch {
    $status = $_.Exception.Response.StatusCode.Value
}

if ($status -eq 302 -or $status -eq 307) {
    Write-Host "✅ PASS: Dashboard redirige les non-authentifiés (HTTP $status)" -ForegroundColor Green
} else {
    Write-Host "⚠️ WARNING: Status HTTP $status (attendu 302/307)" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Vérification localStorage
Write-Host "Test 4️⃣ : Vérification du système de stockage" -ForegroundColor Cyan
Write-Host "   localStorage est utilisé pour:" -ForegroundColor Gray
Write-Host "   • kyndex_currentUser: L'utilisateur actuellement connecté" -ForegroundColor Gray
Write-Host "   • userMode_{userId}: Mode client/provider" -ForegroundColor Gray
Write-Host "   • kyndex_users: Base de données des utilisateurs" -ForegroundColor Gray
Write-Host "   • accessToken: Token JWT (si intégration backend)" -ForegroundColor Gray
Write-Host "   • refreshToken: Token de renouvellement (si intégration backend)" -ForegroundColor Gray
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "📋 TESTS MANUELS À EFFECTUER:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "1️⃣ TEST: Connexion valide" -ForegroundColor Yellow
Write-Host "   ├─ Visiter: http://localhost:3000" -ForegroundColor Gray
Write-Host "   ├─ Cliquer sur: 'Se connecter ou s'inscrire'" -ForegroundColor Gray
Write-Host "   ├─ Onglet: 'Se connecter'" -ForegroundColor Gray
Write-Host "   ├─ Données:" -ForegroundColor Gray
Write-Host "   │  ├─ Email: test@example.com" -ForegroundColor Gray
Write-Host "   │  └─ Password: password123" -ForegroundColor Gray
Write-Host "   ├─ Cliquer: 'Se connecter'" -ForegroundColor Gray
Write-Host "   └─ ✅ Résultat attendu: Redirection vers /dashboard" -ForegroundColor Green
Write-Host ""

Write-Host "2️⃣ TEST: Connexion invalide (email inexistant)" -ForegroundColor Yellow
Write-Host "   ├─ Remesseger email: noexist@example.com" -ForegroundColor Gray
Write-Host "   ├─ Cliquer: 'Se connecter'" -ForegroundColor Gray
Write-Host "   └─ ✅ Résultat attendu: Message d'erreur affiché" -ForegroundColor Green
Write-Host ""

Write-Host "3️⃣ TEST: Inscription valide" -ForegroundColor Yellow
Write-Host "   ├─ Cliquer sur: 'S'inscrire'" -ForegroundColor Gray
Write-Host "   ├─ Remplir:" -ForegroundColor Gray
Write-Host "   │  ├─ Prénom: Jean" -ForegroundColor Gray
Write-Host "   │  ├─ Nom: Dupont" -ForegroundColor Gray
Write-Host "   │  ├─ Email: jean.dupont@example.com" -ForegroundColor Gray
Write-Host "   │  ├─ Téléphone: +33 6 12 34 56 78" -ForegroundColor Gray
West-Host "   │  ├─ Localisation: Paris" -ForegroundColor Gray
Write-Host "   │  └─ Mot de passe: Password123" -ForegroundColor Gray
Write-Host "   ├─ Cliquer: 'Créer mon compte'" -ForegroundColor Gray
Write-Host "   └─ ✅ Résultat attendu: Redirection vers /dashboard (nouvel utilisateur)" -ForegroundColor Green
Write-Host ""

Write-Host "4️⃣ TEST: Accès au dashboard" -ForegroundColor Yellow
Write-Host "   └─ Vérifier affichage du menu:" -ForegroundColor Gray
Write-Host "      ├─ Mode CLIENT doit montrer:" -ForegroundColor Gray
Write-Host "      │  • Accueil, Parcourir, Commandes, Messages, Compte" -ForegroundColor Gray
Write-Host "      └─ Mode PROVIDER doit montrer:" -ForegroundColor Gray
Write-Host "         • Aperçu, Services, Commandes, Revenus, Messages, Analytics, Compte" -ForegroundColor Gray
Write-Host ""

Write-Host "5️⃣ TEST: Mode utilisateur" -ForegroundColor Yellow
Write-Host "   ├─ Vérifier localStorage.getItem('userMode_' + userId)" -ForegroundColor Gray
Write-Host "   ├─ Doit retourner: 'client' ou 'provider'" -ForegroundColor Gray
Write-Host "   └─ Si provider: doit rediriger vers /dashboard/provider-overview" -ForegroundColor Gray
Write-Host ""

Write-Host "6️⃣ TEST: Déconnexion" -ForegroundColor Yellow
Write-Host "   ├─ Cliquer sur le bouton de déconnexion (🚪 icon en bas)" -ForegroundColor Gray
Write-Host "   ├─ localStorage doit être effacé" -ForegroundColor Gray
Write-Host "   └─ Redirection vers /" -ForegroundColor Gray
Write-Host ""

Write-Host "7️⃣ TEST: Accès dashboard sans authentification" -ForegroundColor Yellow
Write-Host "   ├─ Après déconnexion, aller à: http://localhost:3000/dashboard" -ForegroundColor Gray
Write-Host "   └─ ✅ Résultat attendu: Redirection vers /" -ForegroundColor Green
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🛠️ VÉRIFICATIONS DEVTOOLS (F12):" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "➡️ Ouvrez DevTools (F12) → Application → Storage → Local Storage" -ForegroundColor Gray
Write-Host ""

Write-Host "Après connexion, vérifier:" -ForegroundColor Yellow
@(
    @("kyndex_currentUser", "Doit contenir: {id, firstname, lastname, email, phone, location}"),
    @("userMode_{id}", "Doit être: 'client' ou 'provider'"),
    @("kyndex_users", "Doit contenir tableau de tous les users"),
    @("accessToken", "[OPTIONNEL] Si intégration backend"),
    @("refreshToken", "[OPTIONNEL] Si intégration backend")
) | ForEach-Object {
    Write-Host "   • $_[0]" -ForegroundColor Cyan
    Write-Host "     └─ $_[1]" -ForegroundColor Gray
}
Write-Host ""

Write-Host "Console (F12 → Console):" -ForegroundColor Yellow
Write-Host "   ✅ Aucune erreur JavaScript" -ForegroundColor Green
Write-Host "   ✅ Logs de redirection (console.log)" -ForegroundColor Green
Write-Host "   ❌ Pas de 401/403 errors" -ForegroundColor Red
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "⚠️ PROBLÈMES CONNUS À VÉRIFIER:" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "🔴 CRITIQUES:" -ForegroundColor Red
Write-Host "   • Mots de passe en clair dans localStorage (SÉCURITÉ!)" -ForegroundColor Red
Write-Host "   • Pas d'intégration backend pour l'authentification" -ForegroundColor Red
Write-Host "   • Mode utilisateur peut être manipulé" -ForegroundColor Red
Write-Host ""

Write-Host "⚠️ À AMÉLIORER:" -ForegroundColor Yellow
Write-Host "   • Validation d'email (format)" -ForegroundColor Yellow
Write-Host "   • Validation de téléphone" -ForegroundColor Yellow
Write-Host "   • Délai de redirection court (100ms)" -ForegroundColor Yellow
Write-Host ""

Write-Host "✅ À TESTER:" -ForegroundColor Green
Write-Host "   • Redirection /auth/login vers /" -ForegroundColor Green
Write-Host "   • Redirection /auth/register vers /" -ForegroundColor Green
Write-Host "   • Protection du dashboard sans authentification" -ForegroundColor Green
Write-Host "   • Nettoyage localStorage après déconnexion" -ForegroundColor Green
Write-Host ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "✨ Pour plus de détails, voir:" -ForegroundColor Cyan
Write-Host "   VERIFICATION_AUTH_REDIRECTIONS.md" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
