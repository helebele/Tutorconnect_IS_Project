# Script to setup new GitHub repository
# Replace YOUR_NEW_REPO_URL with your actual GitHub repository URL

param(
    [Parameter(Mandatory=$true)]
    [string]$NewRepoUrl
)

Write-Host "`n🔧 Setting up new GitHub repository...`n" -ForegroundColor Cyan

# Step 1: Commit current changes
Write-Host "📦 Step 1: Committing current changes..." -ForegroundColor Yellow
git add .
git commit -m "Add deployment configuration and documentation"

# Step 2: Remove old remote (optional - backup first)
Write-Host "`n🔗 Step 2: Updating remote URL..." -ForegroundColor Yellow
git remote remove origin

# Step 3: Add new remote
git remote add origin $NewRepoUrl

# Step 4: Verify
Write-Host "`n✅ New remote configured:" -ForegroundColor Green
git remote -v

# Step 5: Push to new repository
Write-Host "`n📤 Step 3: Pushing to new repository..." -ForegroundColor Yellow
Write-Host "Choose your branch strategy:`n" -ForegroundColor Cyan
Write-Host "  Option A: Push current branch (temp_abdullah)" -ForegroundColor White
Write-Host "  Option B: Create and push to main branch`n" -ForegroundColor White

$choice = Read-Host "Enter A or B"

if ($choice -eq "B" -or $choice -eq "b") {
    Write-Host "`nCreating and switching to main branch..." -ForegroundColor Yellow
    git checkout -b main
    git push -u origin main
} else {
    Write-Host "`nPushing current branch..." -ForegroundColor Yellow
    git push -u origin temp_abdullah
}

Write-Host "`n🎉 Done! Your repository is ready for Vercel deployment.`n" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Go to vercel.com" -ForegroundColor White
Write-Host "  2. Import your new repository" -ForegroundColor White
Write-Host "  3. Follow DEPLOYMENT_GUIDE.md`n" -ForegroundColor White
