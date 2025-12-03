# Test registration
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Write-Host "Testing Registration..." -ForegroundColor Cyan
$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" -Method POST -Headers $headers -Body $body
$response | ConvertTo-Json -Depth 10

# Save token for next request
$token = $response.token

Write-Host "`nTesting Login..." -ForegroundColor Cyan
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Headers $headers -Body $loginBody
$loginResponse | ConvertTo-Json -Depth 10

Write-Host "`nTesting Get Me (Protected Route)..." -ForegroundColor Cyan
$authHeaders = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$meResponse = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" -Method GET -Headers $authHeaders
$meResponse | ConvertTo-Json -Depth 10

Write-Host "`n✅ All tests passed!" -ForegroundColor Green
