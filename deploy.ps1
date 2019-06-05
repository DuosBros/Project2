param([string]$env)

Write-Host "Started at [" (Get-Date -Format "HH:mm:ss dd.MM.yyyy") "]" -ForegroundColor Yellow
Write-Host "Copying items..."
if($env -eq "prod") {
    Copy-Item -Recurse -Path "./build/*" -Destination "\\Atvp1wwlco101\d$\WWWroot\locov2.prod.env.works" -Force
}
if($env -eq "beta") {
    Copy-Item -Recurse -Path "./build/*" -Destination "\\Atvp1wwlco101\d$\WWWroot\beta-locov2.prod.env.works" -Force
}
Write-Host "Deployed!" -ForegroundColor Green