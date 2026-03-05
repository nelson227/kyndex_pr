#!/usr/bin/env pwsh
<#
.SYNOPSIS
  Test Phase 3: Vérific que l'intégration API backend fonctionne
.DESCRIPTION
  Teste les endpoints d'authentification Phase 3
.NOTES
  Assurez-vous que le backend tourne sur http://localhost:3001/api/v1
#>

$apiBase = "http://localhost:3001/api/v1"
$testEmail = "phase3-test-$(Get-Random 10000)@kyndex.test"
$testPassword = "TestPhase@123"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "PHASE 3 AUTHENTICATION API TESTS" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health check
Write-Host "[1/4] Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$apiBase/auth/me" -Method GET -ErrorAction Stop
    Write-Host "❌ Endpoint réponse sans auth (should be 401)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Backend répond (401 Unauthorized as expected)" -ForegroundColor Green
    } else {
        Write-Host "❌ Error: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# Test 2: Register user
Write-Host "[2/4] Register User..." -ForegroundColor Yellow
try {
    $registerPayload = @{
        firstName = "Test"
        lastName = "Phase3"
        email = $testEmail
        password = $testPassword
        phone = "+33 6 12 34 56 78"
        location = "Paris"
    } | ConvertTo-Json

    $registerResponse = Invoke-WebRequest `
        -Uri "$apiBase/auth/register" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $registerPayload `
        -ErrorAction Stop

    $registerData = $registerResponse.Content | ConvertFrom-Json
    
    if ($registerData.accessToken) {
        Write-Host "✅ User créé: $($registerData.user.email)" -ForegroundColor Green
        Write-Host "   - ID: $($registerData.user.id)" -ForegroundColor Green
        Write-Host "   - AccessToken: $($registerData.accessToken.Substring(0, 20))..." -ForegroundColor Green
        Write-Host "   - RefreshToken: $($registerData.refreshToken.Substring(0, 20))..." -ForegroundColor Green
    } else {
        Write-Host "❌ Pas de token retourné" -ForegroundColor Red
        Write-Host "Response: $($registerResponse.Content)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur registration: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Response: $($_.Exception.Response.Content)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 3: Login
Write-Host "[3/4] Login User..." -ForegroundColor Yellow
try {
    $loginPayload = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $loginResponse = Invoke-WebRequest `
        -Uri "$apiBase/auth/login" `
        -Method POST `
        -Headers @{"Content-Type" = "application/json"} `
        -Body $loginPayload `
        -ErrorAction Stop

    $loginData = $loginResponse.Content | ConvertFrom-Json
    
    if ($loginData.accessToken) {
        Write-Host "✅ Login réussie: $($loginData.user.email)" -ForegroundColor Green
        Write-Host "   - Tokens générés par le backend" -ForegroundColor Green
        $accessToken = $loginData.accessToken
    } else {
        Write-Host "❌ Pas de token retourné" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Test 4: Get Profile with token
Write-Host "[4/4] Get Profile (with JWT token)..." -ForegroundColor Yellow
try {
    $meResponse = Invoke-WebRequest `
        -Uri "$apiBase/auth/me" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $accessToken"
            "Content-Type" = "application/json"
        } `
        -ErrorAction Stop

    $meData = $meResponse.Content | ConvertFrom-Json
    Write-Host "✅ Profile reçu:" -ForegroundColor Green
    Write-Host "   - Email: $($meData.email)" -ForegroundColor Green
    Write-Host "   - Role: $($meData.role)" -ForegroundColor Green
    Write-Host "   - ID: $($meData.id)" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur GET /me: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "=====================================" -ForegroundColor Green
Write-Host "✅ TOUS LES TESTS PHASE 3 RÉUSSIS!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Tester le flux frontend: http://localhost:3002" -ForegroundColor Cyan
Write-Host "2. Cliquer sur 'S''inscrire' ou 'Se connecter'" -ForegroundColor Cyan
Write-Host "   Exemple: email=$testEmail, password=$testPassword" -ForegroundColor Cyan
Write-Host "3. Vérifier que les tokens sont stockés dans localStorage" -ForegroundColor Cyan
Write-Host "4. Vérifier la redirection vers /dashboard" -ForegroundColor Cyan
Write-Host ""
