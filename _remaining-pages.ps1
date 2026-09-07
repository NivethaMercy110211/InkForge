
# This script generates all remaining InkForge HTML pages
# Run from d:\InkForge\InkForge directory

$pages = @(
  "checkout.html",
  "creator-profile.html",
  "creator-signup.html",
  "seller-login.html",
  "seller-register.html",
  "dashboard-orders.html",
  "dashboard-designs.html",
  "dashboard-upload.html",
  "dashboard-earnings.html",
  "dashboard-analytics.html",
  "dashboard-reports.html",
  "dashboard-profile.html",
  "dashboard-payout.html",
  "how-to-order.html",
  "about.html",
  "contact.html"
)

foreach ($page in $pages) {
  Write-Host "Need to create: $page"
}
