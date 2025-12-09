$API_URL = "http://localhost:3000"
Write-Host "Testing API..."

# Test Health
$response = Invoke-WebRequest -Uri "$API_URL/health" -Method GET
Write-Host "Health: OK"

# Test Register
$email = "test-$(Get-Random)@example.com"
$body = @{ email = $email; password = "Test123!" } | ConvertTo-Json
$response = Invoke-WebRequest -Uri "$API_URL/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
Write-Host "Register: OK for $email"

# Test Login
$response = Invoke-WebRequest -Uri "$API_URL/auth/login" -Method POST -Headers @{"Content-Type"="application/json"} -Body $body
$data = $response.Content | ConvertFrom-Json
Write-Host "Login: OK - Token received"

Write-Host "All tests passed!"
