$key = "AIzaSyDc8SzvOOSfAZ1NxMlnjboiqGnO_yzC244"
$auth = "THGAgent@2026"
$jwt  = "THGJwtSuperSecretCloudflare2026Key_Fulfill!"

Write-Host "Setting GEMINI_API_KEY..."
$key | npx wrangler secret put GEMINI_API_KEY

Write-Host "Setting AUTH_PASSWORD..."
$auth | npx wrangler secret put AUTH_PASSWORD

Write-Host "Setting JWT_SECRET..."
$jwt | npx wrangler secret put JWT_SECRET

Write-Host "All secrets set!"
