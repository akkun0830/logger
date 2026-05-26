# 1. npmの初期化
Write-Host "--- Initializing npm ---" -ForegroundColor Cyan
npm init -y

# 2. 厳選した3パッケージのみインストール
Write-Host "--- Installing TS, tsx, esbuild ---" -ForegroundColor Cyan
npm install --save-dev typescript tsx esbuild

# 3. tsconfig.json の作成 (esbuildと整合性を取る設定)
$tsconfig = @{
  compilerOptions = @{
    target           = "ESNext"
    module           = "ESNext"
    moduleResolution = "Bundler"
    strict           = $true
    skipLibCheck     = $true
    isolatedModules  = $true
    esModuleInterop  = $true
    outDir           = "dist" # distへの出力を明示
    rootDir          = "src"
  }
  include         = @("src/**/*")
} | ConvertTo-Json -Depth 10
$tsconfig | Out-File -FilePath "tsconfig.json" -Encoding utf8

# 4. ディレクトリとソースの作成
New-Item -ItemType Directory -Path "src" -Force
New-Item -ItemType Directory -Path "dist" -Force
$indexContent = @"
console.log("Hello, World!");
"@
$indexContent | Out-File -FilePath "src/index.ts" -Encoding utf8

# 5. scripts の書き換え (tsxでの即実行と、esbuildでのビルド)
Write-Host "--- Setting up scripts ---" -ForegroundColor Cyan
$packageJson = Get-Content -Raw package.json | ConvertFrom-Json
$packageJson.scripts = @{
  "dev"   = "tsx watch src/index.ts"
  "build" = "esbuild src/index.ts --bundle --outfile=dist/index.js --platform=neutral"
  "check" = "tsc --noEmit"
}
$packageJsonContent = $packageJson | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText((Join-Path (Get-Location) "package.json"), $packageJsonContent)

Write-Host "`n--- Setup Completed! ---" -ForegroundColor Green
Write-Host "1. development start: npm run dev"
Write-Host "2. build dist:        npm run build"
Write-Host "3. type check:        npm run check"

Pause