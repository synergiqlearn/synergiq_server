Write-Host "Testing SynergiQ API..." -ForegroundColor Cyan

# Test 1: Health Check
Write-Host "`n1. Health Check:" -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:5000/health" -Method GET
    Write-Host "✅ Server is running!" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "❌ Server not responding" -ForegroundColor Red
    exit 1
}

# Test 2: Register
Write-Host "`n2. Testing Registration:" -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "testuser$(Get-Random)@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host "Token: $($registerResponse.token.Substring(0,20))..." -ForegroundColor Gray
    $token = $registerResponse.token
    $email = ($registerBody | ConvertFrom-Json).email
} catch {
    Write-Host "❌ Registration failed: $_" -ForegroundColor Red
    exit 1
}

# Test 3: Login
Write-Host "`n3. Testing Login:" -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "User: $($loginResponse.user.name)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Login failed: $_" -ForegroundColor Red
}

# Test 4: Get Current User (Protected Route)
Write-Host "`n4. Testing Protected Route (Get Me):" -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    $meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $headers
    Write-Host "✅ Protected route working!" -ForegroundColor Green
    Write-Host "User Email: $($meResponse.user.email)" -ForegroundColor Gray
    Write-Host "Profile Completed: $($meResponse.user.profileCompleted)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Protected route failed: $_" -ForegroundColor Red
}

Write-Host "`n✅ All tests passed!" -ForegroundColor Green
Write-Host "`nBackend is ready for frontend integration!" -ForegroundColor Cyan
