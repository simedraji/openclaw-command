# MerchIQ × OpenClaw Dashboard

هاد الـDashboard هو لوحة تحكم محلية ديال OpenClaw. معلومات الدخول ديال OpenClaw
وShopify وEtsy وTelegram ومفاتيح الموديلات ما كيتحطّوش فالمتصفح.

المتصفح كيتاصل بـBridge محلي خدام على `127.0.0.1:18790`، والـBridge كيشغّل
الأمر `openclaw` اللي داخل للحساب من قبل وكيهضر مع الـGateway ديالك.

## كيفاش تشغّلو فـWindows

حلّ 3 ديال نوافذ PowerShell فمجلد المشروع.

```powershell
# النافذة 1 — غير إلا كان الـGateway ما خدامش من قبل
openclaw gateway
```

```powershell
# النافذة 2 — شغّل الـBridge المحلي ديال الـDashboard
npm run bridge
```

```powershell
# النافذة 3 — شغّل واجهة الـDashboard
npm run dev
```

حلّ الرابط المحلي اللي غادي يعطيك Vite، وغالباً غيكون
`http://localhost:8080`.

## أول فحوصات خاصك تدير

شغّل هاد الأوامر قبل ما تحلّ الـDashboard:

```powershell
openclaw status --all
openclaw health --json
openclaw agents list --json
```

إلا الـBridge ما لقاش الأمر ديال OpenClaw، نسخ `.env.example` وسمّيه `.env`،
ومن بعد حطّ فـ`OPENCLAW_COMMAND` المسار الكامل ديال `openclaw.cmd` وعاود شغّل
الـBridge. ما تحطّ حتى API token فـReact ولا فمتغيّرات `VITE_*`.

## شنو خدام دابا

- حالة الاتصال فالـDashboard واللائحة ديال الـAgents الموجدين.
- مهام OpenClaw اللي كتطلق من صفحات Mission Control وAgents وNiche وDesign
  وTrademark وEtsy وShopify.
- تتبّع تقدّم المهام والنتائج ديال جلسة الـBridge الحالية.
- الـBridge كيقبل الطلبات غير من `localhost` و`127.0.0.1`، وكيخدم محلياً
  بشكل افتراضي.

## إعداد الخدمات داخل OpenClaw

وجد مزوّدي الموديلات وEtsy وShopify وTelegram وMCP servers وSkills ديال الـAgents
داخل OpenClaw. الـDashboard كيخلّي هاد الخدمة للـAgent وما كيخزّنش مفاتيح
المنصات الخارجية.

إلا بغيتي خدمة متخصصة، صايب OpenClaw Agents ومن بعد اختارهم من صفحة
**Agents** قبل ما تطلق المهمة:

```powershell
openclaw agents add pod-research --workspace "$env:USERPROFILE\.openclaw\workspace-pod-research" --non-interactive
openclaw agents list --json
```

من الأحسن تكتب فتعليمات الـAgent أنه خاصو ياخذ الموافقة قبل ما ينشر Listings،
يبدّل شي حاجة فالمتجر، يصرف الفلوس، ولا يتاصل بالزبناء.

## التأكد من المشروع

```powershell
npm run format
npm run build
npm run lint
```
