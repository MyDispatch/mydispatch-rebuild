# 🎯 Quick Reference - Production Go-Live Checklist

## ⏱️ 20 Minute Checklist

### ✅ Done
- [x] Code deployed to GitHub (main branch)
- [x] Vercel auto-deployment triggered
- [x] TypeScript validation: 0 errors
- [x] npm security: 0 vulnerabilities
- [x] 111 Edge Functions ready
- [x] All Stripe Keys extracted

### ⏳ TODO (20 minutes remaining)

#### Step 1: Stripe Webhook Setup (5 min)
```
1. Open: https://dashboard.stripe.com/webhooks
2. Click: "+ Add endpoint"
3. URL: https://ygpwuiygivxoqtyoigtg.supabase.co/functions/v1/stripe-webhook
4. Events: 
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - charge.refunded
   - invoice.payment_succeeded
5. Copy: Signing secret (whsec_...)
```

#### Step 2: Stripe Keys to Supabase (5 min)
```
1. Open: https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/functions
2. Tab: "Secrets"
3. Add 9 Keys:

   STRIPE_SECRET_KEY = sk_live_...
   STRIPE_WEBHOOK_SECRET = whsec_... [from Step 1]
   STRIPE_PUBLISHABLE_KEY = pk_live_...
   
   STRIPE_PRICE_STARTER_MONTHLY = price_1SIBMrLX5M8TT990zBX6gWOm
   STRIPE_PRICE_STARTER_YEARLY = price_1SIbRALX5M8TT990B81vhHPT
   STRIPE_PRICE_BUSINESS_MONTHLY = price_1SIBN9LX5M8TT990mxE8owxm
   STRIPE_PRICE_BUSINESS_YEARLY = price_1SIbRKLX5M8TT990e1vX4ebf
   STRIPE_PRICE_ENTERPRISE_MONTHLY = price_1QkbDcC2Q9bhAGYzYf2YH6bm
   STRIPE_PRICE_ENTERPRISE_YEARLY = price_1QkejZC2Q9bhAGYzIuPMEW3H
```

#### Step 3: Deploy Functions (10 min)
```
Option A: GitHub Actions (RECOMMENDED - No Docker needed)
  URL: https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/deploy-production.yml
  Click: "Run workflow"
  Settings:
    - deploy_functions: YES
    - deploy_secrets: YES
  Wait: ~10 minutes for deployment

Option B: Local (requires Docker)
  Command: npm run deploy:functions
  Time: ~15 minutes
```

#### Step 4: Validate (5 min)
```
✅ Test Checkout
   https://www.my-dispatch.de/register
   Select any plan → Subscribe
   Should show Stripe modal
   
✅ Check Logs
   https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/functions
   No red errors
   create-checkout should have executed
   
✅ Test Email (optional)
   https://www.my-dispatch.de/bookings/new
   Create booking
   Email should arrive
   
✅ Check Frontend
   https://www.my-dispatch.de
   Should load without errors
```

## 🔗 Important Links

| Resource | URL |
|----------|-----|
| **Stripe Dashboard** | https://dashboard.stripe.com |
| **Stripe Webhooks** | https://dashboard.stripe.com/webhooks |
| **Stripe API Keys** | https://dashboard.stripe.com/apikeys |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/ygpwuiygivxoqtyoigtg/settings/functions |
| **GitHub Actions** | https://github.com/MyDispatch/mydispatch-rebuild/actions/workflows/deploy-production.yml |
| **Production URL** | https://www.my-dispatch.de |
| **Vercel Dashboard** | https://vercel.com/mydispatch/mydispatch-rebuild |

## ⚠️ Critical Notes

**PRODUCTION KEYS ONLY:**
- Must start with `sk_live_` (NOT `sk_test_`)
- Must start with `pk_live_` (NOT `pk_test_`)
- Webhook secret: `whsec_*` from production webhook

**DO NOT:**
- ❌ Use test keys in production
- ❌ Share secrets in chat/email
- ❌ Commit secrets to GitHub
- ❌ Skip Step 1 (Webhook is critical)

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Functions won't deploy | Click "Run workflow" in GitHub Actions instead |
| Stripe checkout fails | Check STRIPE_SECRET_KEY and Price IDs in Supabase Secrets |
| Webhook not working | Verify endpoint URL and Signing secret in both Stripe & Supabase |
| Email not sent | Check send-booking-email logs in Supabase Functions |

## ✅ Success Indicators

After Step 4, you should see:
- ✅ Stripe checkout modal appears
- ✅ No errors in function logs
- ✅ Frontend loads at https://www.my-dispatch.de
- ✅ All 9 secrets in Supabase
- ✅ 111 Edge Functions deployed

## 📞 Contact

If stuck, check:
1. `PRODUCTION_DEPLOYMENT_GUIDE.md` (detailed)
2. GitHub Actions logs (failed deployments)
3. Supabase Function logs (runtime errors)

---

**Total Time: ~20 minutes**  
**Difficulty: Easy** ✅  
**Status: PRODUCTION READY** 🚀
