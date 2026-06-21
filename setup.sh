#!/bin/bash
set -e

echo "🚀 Setting up ServiceHub BD..."
echo ""

echo "📦 Installing dependencies..."
npm install

echo ""
echo "🗄️  Setting up database..."
npx prisma db push

echo ""
echo "🌱 Seeding sample data..."
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

echo ""
echo "✅ Setup complete!"
echo ""
echo "Demo Accounts:"
echo "  🛡️  Admin:     admin@marketplace.com"
echo "  🧹  Vendor 1:  rahim@vendor.com"
echo "  🔧  Vendor 2:  karim@vendor.com"
echo "  👩  End-User:  fatema@user.com"
echo ""
echo "Run: npm run dev"
echo "Open: http://localhost:3000/login"
