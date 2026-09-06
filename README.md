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

## حقوق الملكية والترخيص

© 2026 Mohamed Raji. جميع حقوق الملكية محفوظة.

هاد المشروع مرخّص بـ[PolyForm Noncommercial 1.0.0](LICENSE.md). تقدر تستعملو،
تعدّلو وتعاود توزّعو غير لأغراض غير تجارية، وخصّك تبقي إشعار حقوق الملكية
ونسخة من الترخيص مع أي نسخة من المشروع. الاستعمال التجاري كيحتاج ترخيص منفصل
ومكتوب من صاحب الحقوق.

---

# English Instructions

## About the project

MerchIQ × OpenClaw Dashboard is a local control panel for OpenClaw. OpenClaw,
Shopify, Etsy, Telegram, and model credentials are never stored in the browser.

The browser connects to a local bridge at `127.0.0.1:18790`. The bridge uses
your already-authenticated `openclaw` CLI to communicate with the running
Gateway.

## Installation

Make sure you have the following installed:

- Node.js and npm.
- OpenClaw CLI, already configured and authenticated.

From the project folder, install the dependencies:

```powershell
npm install
```

## Start on Windows

Open three PowerShell windows in the project folder.

```powershell
# Window 1 — only if the Gateway is not already running
openclaw gateway
```

```powershell
# Window 2 — start the local dashboard bridge
npm run bridge
```

```powershell
# Window 3 — start the dashboard interface
npm run dev
```

Open the local address printed by Vite, normally `http://localhost:8080`.

## First checks

Run these commands before opening the dashboard:

```powershell
openclaw status --all
openclaw health --json
openclaw agents list --json
```

If the bridge cannot find OpenClaw, copy `.env.example` to `.env`, set
`OPENCLAW_COMMAND` to the full path of `openclaw.cmd`, and restart the bridge.
Never put API tokens in the React app or in `VITE_*` variables.

## Available features

- Dashboard connection status and configured agent list.
- OpenClaw tasks launched from Mission Control, Agents, Niche, Design,
  Trademark, Etsy, and Shopify pages.
- Live task progress and results for the current bridge session.
- A local-only bridge that accepts requests from `localhost` and `127.0.0.1`.

## Validation

```powershell
npm run format
npm run build
npm run lint
```

## Copyright and license

Copyright © 2026 Mohamed Raji. All rights reserved.

This project is licensed under the
[PolyForm Noncommercial License 1.0.0](LICENSE.md). You may use, modify, and
redistribute it only for noncommercial purposes. Every redistributed copy must
keep the copyright notice and a copy of the license. Commercial use requires a
separate written license from the copyright holder.
