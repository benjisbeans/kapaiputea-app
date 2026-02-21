-- ============================================================================
-- 011_seed_advanced_modules.sql
-- Seed 4 advanced financial-literacy modules (20 lessons) for NZ teens
-- Modules 4-7 with full JSONB content_blocks in FLAT format
-- ============================================================================


-- ===========================================================================
-- MODULE 4: Credit Scores & Reports
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'credit-scores',
  'Credit Scores & Reports',
  'Understand how credit scores work in NZ, learn to read your credit report, and build a solid credit history from day one.',
  '📊',
  'purple',
  4,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5,
  'advanced',
  (SELECT id FROM public.modules WHERE slug = 'banking-credit')
);

-- ---------------------------------------------------------------------------
-- Lesson 4.1: What is a Credit Score?
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'credit-scores'),
  'what-is-a-credit-score',
  'What is a Credit Score?',
  'How Centrix & Equifax work in NZ, score ranges 0-1000, and why it matters for renting and loans.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "What is a Credit Score?"
    },
    {
      "type": "text",
      "text": "Every time you borrow money or pay a bill in NZ, that info can end up in a big database. Companies called **credit bureaus** track it all and turn it into a single number — your **credit score**. Think of it like an academic report card, but for how you handle money."
    },
    {
      "type": "text",
      "text": "**Who keeps track in NZ?**\n\nThere are three main credit bureaus in Aotearoa:\n\n- **Centrix** — The biggest one. Most NZ lenders check here.\n- **Equifax** — Also widely used. Global company with an NZ office.\n- **illion** — Smaller, but some lenders use them too.\n\nEach one might give you a slightly different score because they use different data and formulas. That''s totally normal."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Your credit score in NZ typically ranges from 0 to 1,000. A higher number = better. Most Kiwis sit between 300 and 700. If you have no credit history yet, your score might be very low or nonexistent — that''s normal for a teenager."
    },
    {
      "type": "stat-card",
      "label": "Average NZ Credit Score",
      "value": "~650",
      "description": "Most Kiwis score between 300-700 on the Centrix scale. Above 500 is considered ''fair'' and above 700 is ''excellent''."
    },
    {
      "type": "text",
      "text": "**Why should you care about your credit score?**\n\nYour credit score affects way more than just loans:\n\n- **Renting a flat** — Many landlords and property managers check your credit score before approving you\n- **Getting a phone plan** — Postpay contracts (like Spark or One NZ) often require a credit check\n- **Car loans** — A better score = lower interest rate = thousands less in repayments\n- **Mortgages** — When you eventually buy a house, your credit score is a big deal\n- **Insurance** — Some insurers use credit data to set premiums"
    },
    {
      "type": "mini-quiz",
      "question": "What range do NZ credit scores typically use?",
      "options": ["0 to 100", "300 to 850", "0 to 1,000", "1 to 10"],
      "correct_index": 2,
      "explanation": "NZ credit scores from Centrix and Equifax typically range from 0 to 1,000. This is different from the US system (300-850). The higher your number, the more trustworthy lenders consider you.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Can a landlord really reject you based on credit?",
      "reveal_text": "Yes, and it happens all the time. In NZ''s competitive rental market, landlords often run credit checks through Centrix or Equifax. Defaults, unpaid bills, or even too many credit applications can show up and hurt your chances. Building good credit early helps you secure a flat later.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Start Caring Now, Not Later",
      "text": "Even if you don''t plan to borrow money anytime soon, your credit file is already being built. Pay every bill on time, avoid unnecessary credit applications, and check your score for free at centrix.co.nz or creditsimple.co.nz at least once a year."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Now you know what a credit score is, who tracks it, and why it matters. Next up — how to actually build your credit from scratch."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 4.2: Building Credit from Scratch
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'credit-scores'),
  'building-credit',
  'Building Credit from Scratch',
  'First credit card tips, becoming an authorised user, paying on time, and credit limit usage.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Building Credit from Scratch"
    },
    {
      "type": "text",
      "text": "Here''s the catch-22 of credit: you need a credit history to get approved for things, but you can''t build a history without getting approved first. Annoying, right? The good news is there are smart ways around this — especially for young Kiwis."
    },
    {
      "type": "text",
      "text": "**5 ways to start building credit when you have none:**\n\n- **Get a phone contract** — A postpay plan from Spark, One NZ, or 2degrees is a form of credit. Pay it on time every month and it builds your history.\n- **Put utilities in your name** — If you''re flatting, having power or broadband in your name and paying on time helps.\n- **Get a low-limit credit card** — Some NZ banks offer cards with $500-$1,000 limits for beginners. Use it for small purchases and pay the FULL balance each month.\n- **Become an authorised user** — Ask a parent or whānau member with good credit if they''ll add you to their credit card as an additional cardholder.\n- **Use Afterpay responsibly** — While we don''t love BNPL, paying on time DOES get reported and can help build a thin credit file."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Getting a credit card to build credit does NOT mean spending money you don''t have. The strategy is: buy something small (like groceries), then pay the FULL balance on the due date. Treat it like a debit card that builds your score."
    },
    {
      "type": "stat-card",
      "label": "Credit Utilisation Sweet Spot",
      "value": "Under 30%",
      "description": "Keep your credit card balance under 30% of your limit. If you have a $1,000 limit, never owe more than $300 at any time. This ratio matters for your score."
    },
    {
      "type": "text",
      "text": "**The #1 factor in your credit score: Payment history**\n\nNothing impacts your score more than whether you pay on time. Even one missed payment can drop your score significantly and stay on your file for up to 5 years.\n\n- Set up **automatic payments** for the minimum amount on every credit account\n- Then manually pay the full balance before the due date\n- This way, you''re never late even if you forget"
    },
    {
      "type": "mini-quiz",
      "question": "You have a credit card with a $1,000 limit. How much should you keep the balance under to maintain a healthy credit utilisation?",
      "options": ["$100", "$300", "$500", "$900"],
      "correct_index": 1,
      "explanation": "Keeping your balance under 30% of your limit ($300 on a $1,000 card) shows lenders you can borrow responsibly without maxing out. This is called ''credit utilisation'' and it''s a big factor in your score.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these credit-building strategies from most effective to least effective:",
      "items": ["Pay all bills on time every month", "Apply for 5 credit cards at once", "Keep credit utilisation under 30%", "Check your credit report yearly"],
      "correct_order": ["Pay all bills on time every month", "Keep credit utilisation under 30%", "Check your credit report yearly", "Apply for 5 credit cards at once"],
      "explanation": "Payment history is king. Low utilisation is second. Regular monitoring is smart. Applying for heaps of credit at once actually HURTS your score because each application creates a ''hard enquiry'' on your file.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "The Autopay Safety Net",
      "text": "Set up an automatic payment for the minimum amount on every credit account you have. Then manually pay the full balance each month. The autopay catches you if you forget — you''ll never accidentally miss a payment and damage your score."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Building credit takes time — there''s no shortcut. But start now and by the time you need to rent a flat or get a car loan, you''ll have a solid history behind you. Ka pai!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 4.3: Reading Your Credit Report
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'credit-scores'),
  'reading-your-report',
  'Reading Your Credit Report',
  'Free reports from Centrix, what each section means, and your rights under the Credit Reporting Privacy Code.',
  3, 7, 75,
  '[
    {
      "type": "heading",
      "text": "Reading Your Credit Report"
    },
    {
      "type": "text",
      "text": "Your credit report is basically your financial CV. Every lender, landlord, and phone company can see a version of it when you apply for something. So you should definitely know what''s on there — and how to read it."
    },
    {
      "type": "text",
      "text": "**How to get your credit report for free:**\n\n- **Centrix** — Go to centrix.co.nz and request your free report. You''re legally entitled to one free copy per year.\n- **Credit Simple** — creditsimple.co.nz gives you free ongoing access to your Equifax score and report.\n- **Equifax** — You can request a free report directly from equifax.co.nz too.\n\nIt takes about 5 minutes to sign up and you''ll usually get your report instantly online."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Under the Credit Reporting Privacy Code 2020, every New Zealander has the right to access their credit information for free. No one can charge you for your own credit report. If a company tries to charge, they''re breaking the rules."
    },
    {
      "type": "text",
      "text": "**What''s actually on your credit report:**\n\n- **Personal details** — Name, date of birth, addresses\n- **Credit accounts** — Every loan, credit card, or hire purchase you have (or had)\n- **Payment history** — Whether you''ve paid on time or missed payments\n- **Credit enquiries** — Every time someone checks your credit (e.g., when you applied for a phone plan)\n- **Defaults** — Bills you didn''t pay that were sent to a collection agency\n- **Court judgments** — If someone took legal action over unpaid debt\n- **Insolvency** — Bankruptcy or No Asset Procedure records"
    },
    {
      "type": "stat-card",
      "label": "Credit Enquiries",
      "value": "Stay Under 5/yr",
      "description": "Each credit application creates a ''hard enquiry'' on your file. Too many in a short period (5+ per year) makes you look desperate for credit and can lower your score."
    },
    {
      "type": "mini-quiz",
      "question": "How often can you get a free credit report from Centrix?",
      "options": ["Once ever", "Once per year", "Once per month", "You have to pay every time"],
      "correct_index": 1,
      "explanation": "Under the Credit Reporting Privacy Code, you''re entitled to a free credit report at least once per year from each bureau. Credit Simple (Equifax) lets you check as often as you want for free. There''s no reason not to check!",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "Your credit report shows your payment _____, credit _____, and any _____. You can get a free report from _____ or Credit Simple.",
      "blanks": ["history", "accounts", "defaults", "Centrix"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Check Your Report Today",
      "text": "Go to creditsimple.co.nz right now and sign up. It takes 5 minutes and it''s completely free. Even if your file is thin or empty, it''s good to know what''s there. Check for any errors — mistakes happen more often than you''d think."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now know how to read your credit report like a pro. Knowledge is power — especially when it comes to your financial reputation. Next: what to do if your credit is damaged."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 4.4: Fixing Bad Credit
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'credit-scores'),
  'fixing-bad-credit',
  'Fixing Bad Credit',
  'Dispute errors, rebuild strategies, how long defaults stay, and hardship applications.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Fixing Bad Credit"
    },
    {
      "type": "text",
      "text": "Maybe you''ve already got some dings on your credit report. Maybe a bill went to collections or you missed some payments. Don''t panic — bad credit isn''t permanent. It takes effort, but you can absolutely rebuild."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "In NZ, most negative information stays on your credit file for a set period:\n\n- Missed payments: up to 2 years\n- Defaults (unpaid debts): up to 5 years\n- Court judgments: up to 5 years\n- Bankruptcy: up to 4 years after discharge\n\nAfter these periods, they drop off automatically."
    },
    {
      "type": "text",
      "text": "**Step 1: Check for errors**\n\nMistakes on credit reports are more common than you''d think. Someone else''s debt might be on your file, or a paid debt might still show as outstanding. Under the Credit Reporting Privacy Code, you have the right to dispute any incorrect information.\n\n**How to dispute:**\n1. Get your free report from Centrix and/or Equifax\n2. Identify the error\n3. Contact the credit bureau directly and explain\n4. They must investigate within 20 working days\n5. If they agree it''s wrong, it gets corrected or removed"
    },
    {
      "type": "text",
      "text": "**Step 2: Start rebuilding**\n\nOnce you''ve fixed any errors, here''s how to rebuild:\n\n- **Pay ALL current bills on time** — Every on-time payment adds a positive mark\n- **Pay off outstanding debts** — Even old ones. Contact the creditor and negotiate a payment plan if you can''t pay it all at once\n- **Keep credit applications minimal** — Only apply for credit you actually need\n- **Get a secured credit card** — Some NZ providers offer cards where you deposit money as collateral. Low risk for the bank, credit-building for you\n- **Be patient** — Rebuilding credit takes 12-24 months of consistent good behaviour"
    },
    {
      "type": "stat-card",
      "label": "Default Removal Period",
      "value": "5 Years",
      "description": "A default stays on your NZ credit file for up to 5 years from the date it was listed. After that, it drops off. Time heals credit wounds."
    },
    {
      "type": "mini-quiz",
      "question": "You find an error on your credit report — a debt that isn''t yours. What should you do?",
      "options": ["Ignore it and hope it goes away", "Pay it to make it disappear", "Contact the credit bureau to dispute it", "Close all your accounts"],
      "correct_index": 2,
      "explanation": "You have the legal right to dispute errors. Contact Centrix or Equifax directly. They must investigate within 20 working days. Never pay a debt that isn''t yours just to ''make it go away'' — that can actually confirm it as yours!",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What is a hardship application?",
      "reveal_text": "If you''re struggling to pay a debt due to illness, job loss, or other hardship, you can apply for a hardship arrangement with your lender. Under the Credit Contracts and Consumer Finance Act (CCCFA), lenders MUST consider your application. They might reduce your payments, pause them, or restructure the debt. Call them and ask — it''s better than defaulting.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Debt Snowball for Rebuilding",
      "text": "List all your debts from smallest to largest. Pay minimums on everything, then throw all extra money at the smallest debt first. When it''s gone, roll that payment into the next one. Each debt you clear is a win for your credit score AND your motivation."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Bad credit is not a life sentence. With patience and the right strategy, you can rebuild your score. Every on-time payment is a step forward. You''ve got this."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 4.5: Credit Hacks for Young Kiwis
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'credit-scores'),
  'credit-hacks-for-teens',
  'Credit Hacks for Young Kiwis',
  'NZ-specific tips, what to avoid, buy-now-pay-later dangers, and long-term strategy.',
  5, 5, 50,
  '[
    {
      "type": "heading",
      "text": "Credit Hacks for Young Kiwis"
    },
    {
      "type": "text",
      "text": "Alright, you''ve learned what credit is, how to build it, how to read your report, and how to fix damage. Now let''s wrap it all up with NZ-specific tips and the stuff young Kiwis specifically need to watch out for."
    },
    {
      "type": "text",
      "text": "**The buy-now-pay-later (BNPL) trap:**\n\nAfterpay, Laybuy, Zip, Klarna — they''re everywhere and they target young people HARD. Here''s what they don''t tell you:\n\n- Late fees add up fast ($8-$68 per missed payment on Afterpay alone)\n- Having multiple BNPL accounts running at once is a form of debt\n- From 2025, BNPL is regulated under the CCCFA in NZ — providers must check if you can actually afford repayments\n- Missed BNPL payments CAN show up on your credit file\n- Using BNPL regularly trains your brain to spend money you don''t have"
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "If you can''t afford to buy something outright with money in your account right now, you can''t afford it on Afterpay either. BNPL isn''t free money — it''s spending your future paycheck today."
    },
    {
      "type": "stat-card",
      "label": "BNPL Usage in NZ (18-24yr olds)",
      "value": "42%",
      "description": "Nearly half of young Kiwis use buy-now-pay-later services. Around 1 in 5 have been charged late fees. Don''t be that 1 in 5."
    },
    {
      "type": "text",
      "text": "**NZ-specific credit hacks:**\n\n- **Start with your phone plan** — A postpay phone contract is one of the easiest ways to start building a credit history\n- **Use your power bill** — If you''re flatting, put the power or internet in your name. Pay on time = free credit building\n- **Avoid store finance** — Harvey Norman, Noel Leeming, etc. offer ''interest free'' deals but they require credit checks and the interest kicks in HARD if you don''t pay on time\n- **Don''t co-sign for mates** — If they don''t pay, YOU''re on the hook and YOUR credit takes the hit\n- **Credit Simple is your friend** — Check your score regularly for free at creditsimple.co.nz"
    },
    {
      "type": "mini-quiz",
      "question": "Your mate asks you to co-sign a car loan because they can''t get approved. What should you do?",
      "options": ["Help them out — that''s what mates are for", "Co-sign but ask them to promise to pay", "Politely decline — if they default, your credit gets damaged", "Ask to share the car in return"],
      "correct_index": 2,
      "explanation": "Co-signing means you''re 100% responsible if your mate doesn''t pay. If they default, it''s YOUR credit score that gets trashed and YOU that gets chased by debt collectors. No friendship is worth risking your financial future.",
      "xp_bonus": 20
    },
    {
      "type": "fill-blanks",
      "sentence": "Buy-now-pay-later services charge _____ fees if you miss a payment. Never _____ a loan for a friend. Check your credit score for free at _____.",
      "blanks": ["late", "co-sign", "Credit Simple"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Your Long-Term Credit Strategy",
      "text": "Ages 16-18: Get an IRD number, open a bank account, start KiwiSaver. Ages 18-20: Get a phone contract in your name, maybe a low-limit credit card ($500). Pay everything on time. Ages 20-25: Your credit history is now 2-5 years old. You''ll have a solid score for renting, car loans, and eventually a mortgage. The earlier you start, the stronger your position."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now understand credit scores better than most adults in NZ. Protect your credit, build it wisely, and it''ll open doors for you. Ka pai rawa atu!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 5: KiwiSaver Investment Levels
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'kiwisaver-investment',
  'KiwiSaver Investment Levels',
  'Go deeper into KiwiSaver — fund types, fees, switching providers, first home withdrawal, and contribution strategies.',
  '🥝',
  'green',
  5,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5,
  'advanced',
  (SELECT id FROM public.modules WHERE slug = 'pay-work')
);

-- ---------------------------------------------------------------------------
-- Lesson 5.1: KiwiSaver Fund Types Deep Dive
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'kiwisaver-investment'),
  'kiwisaver-fund-types',
  'KiwiSaver Fund Types Deep Dive',
  'Conservative vs balanced vs growth vs aggressive — what each actually invests in and the risk/return trade-off.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "KiwiSaver Fund Types Deep Dive"
    },
    {
      "type": "text",
      "text": "You already know KiwiSaver is important. But did you know that the TYPE of fund you''re in can make a difference of **hundreds of thousands of dollars** over your lifetime? Most young Kiwis are in the wrong fund. Let''s fix that."
    },
    {
      "type": "text",
      "text": "**The four main fund types:**\n\n- **Conservative** — Mostly cash and bonds (80%+). Low risk, low returns. Your money barely beats inflation. Best for people withdrawing within 3 years.\n- **Balanced** — A mix of shares (50-60%) and bonds/cash (40-50%). Medium risk. Decent growth with less volatility.\n- **Growth** — Mostly shares (70-90%). Higher risk, higher long-term returns. Might drop 20% in a bad year but historically recovers strongly.\n- **Aggressive** — Almost all shares (90%+). Highest risk AND highest potential returns. Can swing wildly year to year but tends to outperform everything over 10+ year periods."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Here''s the thing most people don''t understand: if you''re a teenager, you have 40-50 YEARS before you retire. That''s heaps of time to ride out market ups and downs. A conservative fund ''protects'' you from short-term drops — but it also ''protects'' you from long-term gains."
    },
    {
      "type": "stat-card",
      "label": "10-Year Average Returns (NZ KiwiSaver)",
      "value": "Growth: ~9% vs Conservative: ~4%",
      "description": "Over the past decade, growth funds have returned roughly 9% per year vs 4% for conservative. On $50,000, that''s the difference between $118k and $74k after 10 years."
    },
    {
      "type": "text",
      "text": "**What each fund actually invests in:**\n\n- **Cash & bonds** — Like lending money to governments and banks. Safe, predictable, low returns (3-5%)\n- **NZ shares** — Owning tiny pieces of NZ companies like Fisher & Paykel Healthcare, a2 Milk, Mainfreight\n- **International shares** — Owning pieces of global giants like Apple, Microsoft, Amazon\n- **Property** — Investing in commercial real estate funds\n- **Alternative investments** — Infrastructure, commodities, private equity"
    },
    {
      "type": "mini-quiz",
      "question": "You''re 17 and won''t touch your KiwiSaver for at least 30 years. Which fund type is generally recommended?",
      "options": ["Conservative — play it safe", "Balanced — middle ground", "Growth or Aggressive — time is on your side", "It doesn''t matter"],
      "correct_index": 2,
      "explanation": "With 30+ years ahead of you, most financial advisors recommend a growth or aggressive fund. You have decades to recover from any short-term drops, and the higher long-term returns make a massive difference over that timeframe.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these KiwiSaver fund types from lowest risk to highest risk:",
      "items": ["Aggressive", "Conservative", "Growth", "Balanced"],
      "correct_order": ["Conservative", "Balanced", "Growth", "Aggressive"],
      "explanation": "Conservative is the safest (but lowest returns), then balanced, then growth, and aggressive has the highest risk AND highest potential returns. Your age and timeline should determine which one you choose.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Check Your Fund Type Right Now",
      "text": "Log into your KiwiSaver provider''s website or app and check what fund type you''re in. If you were auto-enrolled and never changed it, you might be in a conservative or default fund. For a teenager, that could cost you hundreds of thousands over your lifetime. Switching is usually free and takes 5 minutes."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Understanding fund types is one of the highest-value things you''ll ever learn. A simple fund switch as a teenager could be worth $200,000+ by retirement. Knowledge literally pays."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 5.2: Fees That Eat Your Returns
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'kiwisaver-investment'),
  'fees-eating-returns',
  'Fees That Eat Your Returns',
  'Management fees, admin fees, how 0.5% difference compounds over 40 years, and fee comparison examples.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Fees That Eat Your Returns"
    },
    {
      "type": "text",
      "text": "Here''s something KiwiSaver providers don''t love talking about: **fees**. Every KiwiSaver fund charges fees, and even a tiny-looking difference — like 0.5% — can cost you tens of thousands of dollars over your lifetime. This is one of those ''boring'' topics that can literally make you richer."
    },
    {
      "type": "text",
      "text": "**Types of KiwiSaver fees:**\n\n- **Management fee (MER)** — The main one. A percentage of your total balance charged each year. Ranges from 0.2% to over 1.5%.\n- **Admin/member fee** — A fixed dollar amount per year, regardless of balance. Usually $18-$36/year.\n- **Performance fee** — Some funds charge extra when they do well. Can add 0.1-0.5% in good years.\n- **Buy/sell spread** — A tiny fee each time units are bought or sold. Usually very small.\n\nThe management fee is the big one. That''s where you should focus."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "A 1% fee might not sound like much, but on a $100,000 balance that''s $1,000 per year taken from YOUR money. Over 40 years, the difference between a 0.3% fee and a 1.3% fee on the same balance could be over $150,000. Fees matter enormously."
    },
    {
      "type": "stat-card",
      "label": "Impact of 1% Higher Fees Over 40 Years",
      "value": "$150,000+",
      "description": "On a typical KiwiSaver balance with regular contributions, paying 1% more in fees costs you roughly $150,000 by retirement. That money goes to the fund manager, not you."
    },
    {
      "type": "text",
      "text": "**NZ KiwiSaver fee examples (growth funds):**\n\n- **Simplicity Growth** — ~0.31% total fees (one of the cheapest)\n- **Kernel Growth** — ~0.25% total fees\n- **ASB Growth** — ~0.52% total fees\n- **ANZ Growth** — ~0.75% total fees\n- **Fisher Funds Growth** — ~1.14% total fees\n- **Milford Active Growth** — ~1.03% total fees\n\nThe cheapest options are often **index funds** (also called passive funds) because they don''t need expensive fund managers making decisions — they just track the market."
    },
    {
      "type": "mini-quiz",
      "question": "Two funds both return 8% per year before fees. Fund A charges 0.3% and Fund B charges 1.3%. After fees, what does each actually return?",
      "options": ["Both return 8%", "Fund A: 7.7%, Fund B: 6.7%", "Fund A: 8.3%, Fund B: 9.3%", "Fund A: 7%, Fund B: 7%"],
      "correct_index": 1,
      "explanation": "Fees are deducted from your returns. 8% minus 0.3% = 7.7% for Fund A. 8% minus 1.3% = 6.7% for Fund B. That 1% difference compounds over decades into hundreds of thousands of dollars.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Do higher fees mean better performance?",
      "reveal_text": "Nope. Research consistently shows that higher-fee funds do NOT reliably outperform lower-fee funds over the long term. In fact, fees are one of the best predictors of future performance — lower fees = higher net returns for investors. This is why low-cost index funds have become so popular worldwide.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "How to Compare Fees",
      "text": "Go to sorted.org.nz/kiwisaver and use their Smart Investor tool. It compares every KiwiSaver fund in NZ by fees, returns, and risk level. You can also check the fund''s latest quarterly disclosure statement on the Disclose Register (disclose-register.companiesoffice.govt.nz). Look at the total fee figure, not just the management fee."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand one of the most overlooked aspects of investing: fees. A few minutes comparing fees today could literally save you $100,000+ over your lifetime. That''s an amazing hourly rate for your time."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 5.3: Switching Providers Like a Pro
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'kiwisaver-investment'),
  'switching-providers',
  'Switching Providers Like a Pro',
  'How to compare on Sorted.org.nz, actual steps to switch, what to look for, and NZ provider examples.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Switching Providers Like a Pro"
    },
    {
      "type": "text",
      "text": "Here''s a secret the big banks don''t want you to know: **you can switch KiwiSaver providers anytime, for free**. You''re not locked in. And switching to a better provider with lower fees and better returns could be the single best financial decision you make this year."
    },
    {
      "type": "text",
      "text": "**Why you might want to switch:**\n\n- Your current provider charges high fees\n- You''re in a default fund that doesn''t match your age/goals\n- Your fund''s returns have been consistently below average\n- You want more ethical/responsible investment options\n- You found a provider with better tools, app, or customer service\n\nMost people stay with whatever provider their employer enrolled them in. That''s like eating at the first restaurant you see without checking the menu — there might be something way better next door."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Switching KiwiSaver providers is free and you can do it anytime. Your money gets transferred from the old provider to the new one. It usually takes 10-35 business days. You don''t lose any money in the transfer — your balance simply moves."
    },
    {
      "type": "text",
      "text": "**Popular NZ KiwiSaver providers compared:**\n\n- **Simplicity** — Non-profit, very low fees (0.31%), index-based. Great for set-and-forget\n- **Kernel** — Low fees (0.25%), modern app, index funds. Popular with younger investors\n- **Milford** — Actively managed, higher fees (~1%), but historically strong returns\n- **ANZ** — Biggest provider, mid-range fees. Convenient if you bank with ANZ\n- **ASB** — Similar to ANZ. Good app integration if you''re an ASB customer\n- **Generate** — Strong performance, higher fees. Focused investing approach\n- **Pathfinder** — Ethical/responsible investing focus. Good if values matter to you"
    },
    {
      "type": "stat-card",
      "label": "Kiwis Who Never Switch",
      "value": "~70%",
      "description": "About 70% of KiwiSaver members have never switched providers. Many are in default funds with higher fees and lower returns than they could get elsewhere."
    },
    {
      "type": "mini-quiz",
      "question": "You want to switch KiwiSaver providers. What does it cost?",
      "options": ["$50 switching fee", "1% of your balance", "Nothing — it''s free", "You can''t switch — you''re locked in"],
      "correct_index": 2,
      "explanation": "Switching KiwiSaver providers is completely free. You just sign up with the new provider and they handle the transfer. Your old provider cannot charge you an exit fee. It''s your money and your choice.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "Switching KiwiSaver providers is _____ and usually takes 10-35 business _____. Use _____.org.nz to compare providers. About _____% of Kiwis have never switched.",
      "blanks": ["free", "days", "sorted", "70"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "How to Actually Switch (5 Steps)",
      "text": "1. Compare providers at sorted.org.nz/kiwisaver\n2. Pick the provider and fund type that suits your age and goals\n3. Sign up on the new provider''s website (you''ll need your IRD number)\n4. The new provider contacts your old one and arranges the transfer\n5. Check your balance has transferred after 2-5 weeks\n\nThat''s it. No forms to your old provider, no paperwork, no hassle."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "If you do one thing after this lesson, compare your current provider''s fees and returns on Sorted. You might find you''re paying too much for too little. Switching is free — there''s no reason not to check."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 5.4: First Home Withdrawal Strategy
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'kiwisaver-investment'),
  'first-home-withdrawal',
  'First Home Withdrawal Strategy',
  'Kainga Ora First Home Grant, eligibility, how much to withdraw vs leave, and timing tips.',
  4, 7, 75,
  '[
    {
      "type": "heading",
      "text": "First Home Withdrawal Strategy"
    },
    {
      "type": "text",
      "text": "One of the best things about KiwiSaver is that you don''t have to wait until you''re 65 to use it. You can withdraw most of your balance to **buy your first home**. For many young Kiwis, this is the real game-changer — let''s get into the details."
    },
    {
      "type": "text",
      "text": "**KiwiSaver First Home Withdrawal — the rules:**\n\n- You must have been a KiwiSaver member for at least **3 years**\n- You can withdraw everything EXCEPT $1,000 (the minimum balance that must stay)\n- The home must be your primary residence (not an investment property)\n- You must live in the home (or intend to)\n- You can''t have previously withdrawn KiwiSaver for a first home\n- Both partners in a couple can withdraw from their own KiwiSaver accounts"
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The earlier you join KiwiSaver, the earlier your 3-year clock starts ticking. If you join at 16, you''re eligible for a first home withdrawal at 19. Join at 22, and you''re waiting until 25. Starting early literally gives you a head start."
    },
    {
      "type": "text",
      "text": "**Kainga Ora First Home Grant:**\n\nOn top of your KiwiSaver withdrawal, you might also qualify for the First Home Grant from Kainga Ora (formerly Housing NZ):\n\n- **$1,000 for each year** you''ve been contributing to KiwiSaver (up to 5 years = $5,000)\n- **$2,000 per year** if you''re buying a new build (up to 5 years = $10,000)\n- Both partners can claim (couple buying together = up to $10,000 or $20,000 for new build)\n- Income cap: $95,000/year for a single buyer, $150,000 combined for couples\n- House price caps vary by region (e.g., $875,000 in Auckland for existing homes)"
    },
    {
      "type": "stat-card",
      "label": "Maximum First Home Grant (Couple, New Build)",
      "value": "$20,000",
      "description": "A couple who''ve both been in KiwiSaver for 5+ years buying a new build can receive up to $20,000 in free government money. Plus their combined KiwiSaver withdrawals."
    },
    {
      "type": "mini-quiz",
      "question": "You''ve been in KiwiSaver for 4 years and have $25,000 saved. How much can you withdraw for a first home?",
      "options": ["$25,000", "$24,000 (must leave $1,000)", "$20,000", "Nothing — you need 5 years"],
      "correct_index": 1,
      "explanation": "After 3+ years in KiwiSaver, you can withdraw everything except $1,000 which must remain in your account. So from $25,000, you can pull out $24,000 toward your first home. Plus you''d likely qualify for a $4,000 First Home Grant on top.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Should you withdraw ALL your KiwiSaver for a house?",
      "reveal_text": "Just because you CAN withdraw almost all of it doesn''t mean you SHOULD. Consider leaving more than the minimum $1,000 in your KiwiSaver, especially if you''re young. That money keeps growing tax-efficiently for your retirement. A common strategy is to withdraw just enough to hit the 20% deposit threshold, then leave the rest invested for the long term.",
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "First Home Withdrawal Timing",
      "text": "Apply for your KiwiSaver withdrawal as early as possible in the home-buying process. It can take 10-15 business days for the money to be released. Don''t leave it to the last minute before settlement day. Also, talk to your KiwiSaver provider early — they can walk you through the paperwork."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "KiwiSaver + First Home Grant could give you a $30,000-$50,000+ head start on your first home. That''s years of saving accelerated. Future homeowner vibes!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 5.5: KiwiSaver Contribution Calculator
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'kiwisaver-investment'),
  'contribution-calculator',
  'KiwiSaver Contribution Calculator',
  '3% vs 4% vs 6% vs 8% vs 10%, employer match, government contribution $521, and long-term projections.',
  5, 6, 50,
  '[
    {
      "type": "heading",
      "text": "KiwiSaver Contribution Calculator"
    },
    {
      "type": "text",
      "text": "You get to choose how much of your pay goes into KiwiSaver: 3%, 4%, 6%, 8%, or 10%. Most people just pick 3% because it''s the minimum. But is that actually the smartest choice? Let''s crunch some numbers."
    },
    {
      "type": "text",
      "text": "**The contribution rates explained:**\n\n- **3%** — The minimum. Your employer also puts in at least 3%. Total = 6% of your gross pay going to KiwiSaver.\n- **4%** — A small step up. Barely noticeable from your take-home pay but adds up over time.\n- **6%** — A solid middle ground. Your employer still only puts in 3%, so total = 9%.\n- **8%** — Getting serious. Total = 11% of gross pay. Your take-home drops noticeably.\n- **10%** — Maximum employee contribution. Total = 13%. Big impact on your paycheck but massive long-term growth.\n\nRemember: your employer only has to match up to 3%, regardless of what you contribute."
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "A sneaky-good strategy: start at 3% and increase by 1% every time you get a pay rise. You''ll never feel the pinch because the extra goes in before you get used to the higher pay. By the time you''re 25, you might be at 6-8% without ever feeling like you ''lost'' money."
    },
    {
      "type": "stat-card",
      "label": "Government Annual Contribution",
      "value": "$521.43 max",
      "description": "To get the full $521.43/year from the government, you need to contribute at least $1,042.86 per year ($20.05/week). This is a 50% return for free. Don''t leave it on the table."
    },
    {
      "type": "text",
      "text": "**Long-term projections (starting at age 18, $50k salary, 7% returns):**\n\n- **3% contribution** — ~$540,000 by age 65\n- **4% contribution** — ~$630,000 by age 65\n- **6% contribution** — ~$810,000 by age 65\n- **8% contribution** — ~$990,000 by age 65\n- **10% contribution** — ~$1,170,000 by age 65\n\nThe difference between 3% and 6% is roughly **$270,000**. That''s the price of a house in many NZ towns — earned by contributing an extra 3% of your pay."
    },
    {
      "type": "mini-quiz",
      "question": "Your employer matches your KiwiSaver contributions up to:",
      "options": ["Whatever you contribute", "3% minimum", "6%", "10%"],
      "correct_index": 1,
      "explanation": "Your employer must contribute at least 3% of your gross pay, regardless of how much you contribute. Even if you put in 10%, they only have to match 3% (though some generous employers match more). That employer 3% is free money — always make sure you''re getting it.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these KiwiSaver strategies from most impactful to least impactful for a teenager:",
      "items": ["Increase contribution rate gradually", "Switch to a growth fund", "Ensure you get the full $521 govt contribution", "Contribute 3% and forget about it"],
      "correct_order": ["Switch to a growth fund", "Ensure you get the full $521 govt contribution", "Increase contribution rate gradually", "Contribute 3% and forget about it"],
      "explanation": "For a teenager, switching to a growth fund has the biggest long-term impact because of compound returns over 40+ years. Getting the government contribution is free money. Increasing your rate gradually grows your balance significantly. Just doing 3% and forgetting leaves a lot of money on the table.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "The $20/Week Challenge",
      "text": "Make sure you''re contributing at least $20.05 per week to KiwiSaver (from all sources). This gets you the full $521.43 government contribution each year. If your employee contributions already cover this, you''re sweet. If not (e.g., you''re not employed or work very part-time), you can make voluntary contributions directly through your KiwiSaver provider."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now have a deep understanding of KiwiSaver that most Kiwis don''t develop until their 40s. Use this knowledge now and your future self will be genuinely wealthy. Ka pai rawa atu!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 6: Simple Investing Simulation
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'simple-investing',
  'Simple Investing Simulation',
  'Learn the basics of investing — stocks, bonds, index funds, and how to get started with as little as $1 on NZ platforms.',
  '📈',
  'orange',
  6,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5,
  'advanced',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 6.1: What Even is Investing?
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'simple-investing'),
  'what-is-investing',
  'What Even is Investing?',
  'Stocks, bonds, and funds explained simply — the NZX, and platforms like Sharesies, Hatch, and InvestNow.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "What Even is Investing?"
    },
    {
      "type": "text",
      "text": "Investing sounds like something only rich people in suits do. It''s not. **Investing is simply putting your money to work so it grows over time.** Instead of your money sitting in a savings account earning 4%, it could be growing at 7-10% per year. And in NZ, you can start with literally $1."
    },
    {
      "type": "text",
      "text": "**The three main types of investments:**\n\n- **Shares (Stocks)** — You buy a tiny piece of a company. If the company does well, your share goes up in value. Some companies also pay you ''dividends'' (a share of their profits). Example: buying shares in Fisher & Paykel Healthcare on the NZX.\n- **Bonds** — You lend money to a government or company, and they pay you back with interest. Safer than shares but lower returns. Like a term deposit but tradeable.\n- **Funds** — A basket of shares and/or bonds bundled together. Instead of buying one company, you buy a little bit of hundreds or thousands. This is called ''diversification'' and it reduces your risk massively."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The NZX (New Zealand Exchange) is where NZ company shares are traded. It includes companies like Air New Zealand, Spark, Fisher & Paykel Healthcare, a2 Milk, and Mainfreight. The NZX 50 is an index that tracks the top 50 NZ companies."
    },
    {
      "type": "stat-card",
      "label": "Minimum to Start Investing (Sharesies)",
      "value": "$1",
      "description": "On platforms like Sharesies, you can start investing with just $1. There''s no excuse for ''I don''t have enough money to invest.'' Everyone can start somewhere."
    },
    {
      "type": "text",
      "text": "**NZ investing platforms for beginners:**\n\n- **Sharesies** — The most popular for young Kiwis. Start from $1. NZ and international shares, funds, and crypto. Very beginner-friendly app.\n- **Hatch** — Focuses on US shares (Apple, Tesla, Amazon). Good for international investing. Slightly higher fees per trade.\n- **InvestNow** — No fees on most funds. Great for long-term fund investing. Less flashy but very cost-effective.\n- **Kernel** — Low-fee index funds and KiwiSaver. Modern, clean, good for set-and-forget investing.\n- **Stake** — US and Australian shares with low fees. Good currency exchange rates."
    },
    {
      "type": "mini-quiz",
      "question": "What is a ''fund'' in investing?",
      "options": ["A single company you invest in", "A bundle of many investments packaged together", "A savings account with a fancy name", "A type of government bond"],
      "correct_index": 1,
      "explanation": "A fund bundles together many different investments (shares, bonds, etc.) into one package. Instead of picking individual companies, you buy the whole basket. This spreads your risk — if one company does badly, the others might make up for it.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Is investing the same as gambling?",
      "reveal_text": "No. Gambling is a zero-sum game where the house always wins long-term. Investing in diversified funds is backed by real businesses that create value, employ people, and generate profits. The NZ share market has returned an average of ~10% per year over the long term. That''s not luck — that''s the economy growing. However, picking individual ''hot'' stocks or timing the market IS closer to gambling. Stick with diversified funds.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Your First Step",
      "text": "Download the Sharesies app and create an account. You don''t need to invest any money yet — just explore. Look at NZ companies you know (Spark, Air NZ, a2 Milk) and see their share prices. Getting familiar with the platform is the first step."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand the basics of investing. It''s not just for rich people — it''s for anyone who wants their money to grow. Next up: understanding the relationship between risk and return."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 6.2: Risk vs Return
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'simple-investing'),
  'risk-vs-return',
  'Risk vs Return',
  'Why higher returns = higher risk, NZ examples like property vs shares vs savings, and diversification.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Risk vs Return"
    },
    {
      "type": "text",
      "text": "Here''s the fundamental rule of investing that you absolutely must understand: **higher potential returns always come with higher risk.** There is no such thing as a high-return, no-risk investment. Anyone who tells you otherwise is either lying or trying to sell you something."
    },
    {
      "type": "text",
      "text": "**The risk/return spectrum (NZ examples):**\n\n- **Bank savings account** — ~4-5% return, virtually zero risk. Your money is safe but barely beats inflation.\n- **Term deposit** — ~5-6% return, very low risk. Money is locked away but guaranteed.\n- **Government bonds** — ~4-5% return, very low risk. NZ Government bonds are considered one of the safest investments on earth.\n- **NZ property** — Historically ~7-8% long-term (incl. rental income). Medium-high risk. Property can drop 10-20% in downturns.\n- **NZ shares (NZX 50)** — Historically ~10% long-term. High risk short-term. Can drop 30%+ in a crash but historically always recovers.\n- **International shares** — Similar to NZ shares but more diversified. Currency risk is an added factor.\n- **Crypto** — Can go up 100% or down 80% in a year. Extremely high risk. Not investing — more like speculation."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "In 2022, the NZX 50 dropped about 12%. Crypto dropped 60-80%. But savings accounts went up 4%. That''s the risk/return trade-off in action. The key is: shares have ALWAYS recovered over time. The NZX has never had a 10-year period with negative returns."
    },
    {
      "type": "stat-card",
      "label": "NZX 50 Long-Term Average Return",
      "value": "~10% per year",
      "description": "Over the past 20+ years, the NZX 50 has returned roughly 10% per year on average (including dividends). That turns $10,000 into $67,000 over 20 years."
    },
    {
      "type": "text",
      "text": "**Diversification — don''t put all your eggs in one basket:**\n\nIf you buy shares in ONE company and it goes bust, you lose everything. But if you buy a fund that holds 50 or 500 companies, one company going bust barely affects you.\n\nThis is called **diversification** and it''s the closest thing to a free lunch in investing. You reduce risk without necessarily reducing returns. This is why funds and index funds are perfect for beginners."
    },
    {
      "type": "mini-quiz",
      "question": "Which investment has the highest potential return AND the highest risk?",
      "options": ["Bank savings account", "Government bonds", "NZ shares", "Term deposit"],
      "correct_index": 2,
      "explanation": "NZ shares (and shares in general) have the highest historical returns (~10%/year) but also the highest volatility. They can drop 30% in a bad year. The trade-off for higher returns is always higher risk. That''s why diversification and time horizon matter so much.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these investments from lowest risk to highest risk:",
      "items": ["NZ shares", "Bank savings account", "Cryptocurrency", "Government bonds"],
      "correct_order": ["Bank savings account", "Government bonds", "NZ shares", "Cryptocurrency"],
      "explanation": "Bank savings are the safest (government guaranteed up to $100k). Government bonds are very safe. NZ shares are higher risk but historically rewarding. Crypto is extremely volatile and speculative.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "The Time Factor",
      "text": "Risk decreases the longer you invest. NZ shares might drop 30% in one year, but over 10+ years they''ve always gone up. As a teenager, you have the ultimate advantage: TIME. Use it. Invest in growth assets (shares, funds) and let compound returns do the heavy lifting."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Understanding risk vs return is the foundation of smart investing. You now know why diversified funds beat savings accounts long-term, and why time is your greatest asset. Next: index funds — the lazy investor''s best friend."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 6.3: Index Funds — The Lazy Investor's Friend
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'simple-investing'),
  'index-funds-explained',
  'Index Funds: The Lazy Investor''s Friend',
  'How NZ/global index funds work, S&P 500, NZX 50, and why most professionals can''t beat them.',
  3, 7, 75,
  '[
    {
      "type": "heading",
      "text": "Index Funds: The Lazy Investor''s Friend"
    },
    {
      "type": "text",
      "text": "What if I told you there''s an investment strategy that beats 80-90% of professional fund managers, requires almost zero effort, and has very low fees? Sounds too good to be true, but it''s real — and it''s called **index fund investing**."
    },
    {
      "type": "text",
      "text": "**What is an index fund?**\n\nAn index fund simply tracks a market index — a list of companies — by buying every company in that list. Instead of a fund manager picking which companies to buy (and often getting it wrong), an index fund just buys them ALL.\n\n- **NZX 50 index fund** — Buys all 50 top NZ companies. When you invest, you own a tiny piece of every one.\n- **S&P 500 index fund** — Buys the 500 biggest US companies (Apple, Microsoft, Amazon, Google, etc.)\n- **Global index fund** — Buys thousands of companies from all around the world\n\nNo stock picking. No guessing. Just broad market exposure."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Warren Buffett — one of the greatest investors of all time — has said that most people should just buy a low-cost index fund. He even bet $1 million that an S&P 500 index fund would beat a group of hedge fund managers over 10 years. He won the bet."
    },
    {
      "type": "stat-card",
      "label": "% of Active Fund Managers Beaten by Index Funds",
      "value": "~85% (over 15 years)",
      "description": "Over a 15-year period, roughly 85% of actively managed funds fail to beat a simple index fund. The pros can''t consistently beat the market. So why pay them to try?"
    },
    {
      "type": "text",
      "text": "**Where to invest in index funds in NZ:**\n\n- **Kernel Wealth** — Offers NZX 20, S&P 500, and global index funds with fees as low as 0.25%. Modern app, very popular with young Kiwis.\n- **Simplicity** — Non-profit provider with NZ and global index funds. Total fees around 0.31%.\n- **InvestNow** — Access to Vanguard, AMP, and other index funds with zero platform fees.\n- **Sharesies** — Offers Smartshares ETFs (like the NZX 50 ETF and US 500 ETF) from $1.\n- **Smartshares** — NZX''s own range of ETFs (exchange-traded funds) that track various indices."
    },
    {
      "type": "mini-quiz",
      "question": "Why do index funds usually outperform actively managed funds?",
      "options": ["Index funds take more risk", "Index fund managers are smarter", "Index funds have much lower fees and most managers can''t consistently beat the market", "Index funds only invest in tech companies"],
      "correct_index": 2,
      "explanation": "Index funds charge much lower fees (0.1-0.5% vs 1-2% for active funds). Since most fund managers can''t consistently beat the market anyway, the lower fees mean index fund investors keep more of their returns. Simple maths: same returns minus lower fees = more money for you.",
      "xp_bonus": 20
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What is an ETF?",
      "reveal_text": "ETF stands for Exchange-Traded Fund. It''s basically an index fund that trades on the stock exchange like a regular share. You can buy and sell ETFs during market hours just like buying a company''s shares. In NZ, Smartshares offers popular ETFs like the NZ Top 50 ETF (FNZ) and the US 500 ETF (USF). They''re a great way to get diversified exposure with a single purchase.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Set-and-Forget Strategy",
      "text": "Set up an automatic weekly or fortnightly investment into a global index fund. Even $10-$25 per week adds up massively over time thanks to compound returns. Don''t try to time the market — just invest consistently and let time do the work. This strategy is called ''dollar-cost averaging'' and it''s how most millionaires built their wealth."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Index funds are genuinely one of the greatest financial inventions ever. Low cost, low effort, and historically better returns than 85% of the pros. Now that''s smart investing."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 6.4: Your First $100 Investment
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'simple-investing'),
  'your-first-100',
  'Your First $100 Investment',
  'Step-by-step walkthrough concept, what to expect, dollar-cost averaging, and the power of starting small.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Your First $100 Investment"
    },
    {
      "type": "text",
      "text": "Alright, you understand the theory. Now let''s get practical. What does it actually look like to invest your first $100 in NZ? Spoiler: it''s way easier than you think. You can literally do it from your phone in 10 minutes."
    },
    {
      "type": "text",
      "text": "**Step-by-step: investing your first $100 on Sharesies:**\n\n1. **Download the Sharesies app** and sign up (you need to be 16+ or have a parent''s help)\n2. **Verify your identity** — Photo ID and a selfie. Takes about 24 hours to process.\n3. **Link your bank account** and transfer $100\n4. **Choose what to invest in** — For your first investment, we''d suggest a diversified fund like the Smartshares NZ Top 50 ETF (FNZ) or a global fund\n5. **Buy** — Enter $100, review, and confirm. Done.\n6. **Set up auto-invest** — Even $5-10 per week on autopilot builds up fast"
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "You don''t need to wait until you have ''enough'' money. That $100 invested today at 10% average returns could be worth $1,750 in 30 years. And if you add just $10/week? Over $100,000 in 30 years. Starting small IS the strategy."
    },
    {
      "type": "stat-card",
      "label": "$10/Week Invested for 30 Years (10% Return)",
      "value": "$98,000+",
      "description": "Just $10 per week — about the cost of two coffees — invested consistently in a growth fund could grow to nearly $100,000 over 30 years. Compound interest is magical."
    },
    {
      "type": "text",
      "text": "**Dollar-cost averaging (DCA) — your secret weapon:**\n\nDon''t try to buy at the ''perfect'' time. Instead, invest a fixed amount regularly — say $25 per fortnight. This is called dollar-cost averaging.\n\n- When prices are **high**, your $25 buys fewer units\n- When prices are **low**, your $25 buys more units\n- Over time, this **averages out** your purchase price\n- You remove all emotion and guesswork from investing\n\nThis is how most successful long-term investors do it. Set it and forget it."
    },
    {
      "type": "mini-quiz",
      "question": "The market drops 15% the week after you invest your first $100. What should you do?",
      "options": ["Sell immediately to cut your losses", "Panic and never invest again", "Do nothing — short-term drops are normal. Maybe even invest more while it''s cheaper", "Move everything to crypto"],
      "correct_index": 2,
      "explanation": "Short-term market drops are completely normal — they happen every year. If your investment timeline is 10+ years, a 15% drop is actually a buying opportunity. The market has always recovered from every crash in history. Stay calm and stay invested.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "Dollar-cost _____ means investing a fixed amount _____. When prices drop, your money buys _____ units. The key is to invest _____ and not try to time the market.",
      "blanks": ["averaging", "regularly", "more", "consistently"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "What to Expect in Year One",
      "text": "Your first year of investing will feel weird. Your balance will go up and down. Some weeks you''ll be ''up'' $5, other weeks ''down'' $10. This is normal. The market is volatile short-term but grows long-term. Resist the urge to check daily. Set up auto-invest and check monthly at most."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now have a practical roadmap for your first investment. The hardest part is starting — and after this lesson, you know exactly how to do it. Your future self will thank you for taking action today."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 6.5: Investment Mistakes to Avoid
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'simple-investing'),
  'investment-mistakes',
  'Investment Mistakes to Avoid',
  'FOMO, meme stocks, crypto volatility, not researching, panic selling, and time in market vs timing.',
  5, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Investment Mistakes to Avoid"
    },
    {
      "type": "text",
      "text": "Investing is simple, but that doesn''t mean it''s easy. Your biggest enemy isn''t the market — it''s your own brain. Emotions like fear and greed cause most investment losses. Let''s go through the biggest mistakes so you can dodge them."
    },
    {
      "type": "text",
      "text": "**Mistake #1: FOMO Investing**\n\nYou see your mate post about how much they made on some random stock or crypto, and you pile in without researching. By the time something is \"trending\" on social media, you''ve usually already missed the big gains. You''re buying at the top.\n\n**Mistake #2: Meme Stocks**\n\nRemember GameStop? AMC? These ''meme stocks'' made a few people rich and a LOT of people poor. They''re driven by hype, not fundamentals. It''s gambling, not investing.\n\n**Mistake #3: Thinking Crypto is Easy Money**\n\nBitcoin and other crypto can gain or lose 50%+ in months. Some people made fortunes; many more lost everything. If you invest in crypto, only use money you can 100% afford to lose."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "''Time IN the market beats TIMING the market.'' Trying to buy low and sell high sounds smart but almost nobody can do it consistently — not even professionals. The people who do best simply invest regularly and hold for decades."
    },
    {
      "type": "stat-card",
      "label": "Cost of Missing the Best 10 Days",
      "value": "50% Less Returns",
      "description": "If you were invested in the NZX 50 for 20 years but missed just the 10 best days (by trying to time the market), your returns would be roughly HALF what they''d be if you just stayed invested the whole time."
    },
    {
      "type": "text",
      "text": "**Mistake #4: Panic Selling**\n\nThe market drops 20%. Your $1,000 is now worth $800. You panic and sell. Three months later, the market recovers to $1,100. You locked in your loss and missed the recovery. This is the most common mistake and the most expensive.\n\n**Mistake #5: Not Researching**\n\nBuying a stock because your mate said it was \"going to the moon\" is not research. At minimum, understand what the company does, how it makes money, and whether the price is reasonable.\n\n**Mistake #6: Putting All Your Eggs in One Basket**\n\nBuying just one stock means your entire investment depends on one company. If it tanks, you lose everything. Funds spread your money across hundreds of companies."
    },
    {
      "type": "mini-quiz",
      "question": "The market drops 25% in a crash. What does history tell us is the best move?",
      "options": ["Sell everything before it drops more", "Move everything to a savings account", "Stay invested and keep buying — the market has always recovered", "Wait for it to hit zero then buy"],
      "correct_index": 2,
      "explanation": "Every major market crash in history has eventually recovered. The 2008 Global Financial Crisis, the 2020 COVID crash, the 2022 downturn — all recovered. People who stayed invested (and even bought more during the dip) came out ahead. Panic selling is how you turn a temporary drop into a permanent loss.",
      "xp_bonus": 20
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The #1 rule of investing",
      "reveal_text": "Never invest money you might need in the next 3-5 years. If you''re saving for something specific in the next couple of years (a car, a trip), keep that money in a savings account. Only invest money you can leave alone for 5+ years. This way, short-term market drops don''t matter because you have time to recover.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Your Investment Rules",
      "text": "Stick these on your wall:\n1. Invest in diversified funds, not individual hype stocks\n2. Invest regularly (auto-invest) and don''t try to time it\n3. Never invest money you''ll need within 5 years\n4. Ignore the noise — social media, news headlines, mate''s hot tips\n5. When in doubt, do nothing. Time is on your side."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now understand investing from the ground up — what it is, how risk works, why index funds win, how to start, and what mistakes to avoid. You''re officially investment-literate. Ka pai rawa atu!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 7: Tax & GST Basics
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'tax-gst-basics',
  'Tax & GST Basics',
  'Understand how NZ tax actually works — progressive brackets, GST, tax returns, self-employment tax, and tax codes explained.',
  '🧾',
  'blue',
  7,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5,
  'advanced',
  (SELECT id FROM public.modules WHERE slug = 'pay-work')
);

-- ---------------------------------------------------------------------------
-- Lesson 7.1: How NZ Tax Actually Works
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'tax-gst-basics'),
  'how-nz-tax-works',
  'How NZ Tax Actually Works',
  'Progressive tax brackets explained — why you don''t pay 33% on everything and how PAYE really works.',
  1, 7, 75,
  '[
    {
      "type": "heading",
      "text": "How NZ Tax Actually Works"
    },
    {
      "type": "text",
      "text": "Tax is one of those things everyone complains about but very few people actually understand. Here''s the number one myth: **\"If I earn $70,001 I''ll be in the 33% tax bracket so I''ll take home LESS than if I earned $70,000.\"** This is completely wrong. Let''s clear it up once and for all."
    },
    {
      "type": "text",
      "text": "**NZ has a PROGRESSIVE tax system. Here are the brackets:**\n\n- **$0 - $14,000** → 10.5%\n- **$14,001 - $48,000** → 17.5%\n- **$48,001 - $70,000** → 30%\n- **$70,001 - $180,000** → 33%\n- **$180,001+** → 39%\n\n**Progressive means each bracket ONLY applies to income within that range.** If you earn $50,000, you don''t pay 30% on the whole $50,000. You pay 10.5% on the first $14,000, 17.5% on the next $34,000, and 30% on just the final $2,000."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "This is called a ''marginal'' tax system. Your ''marginal rate'' is the rate on your LAST dollar earned. Your ''effective rate'' is the average across all your income. Someone earning $50,000 has a marginal rate of 30% but an effective rate of only about 17.5%. Big difference."
    },
    {
      "type": "text",
      "text": "**Let''s calculate the actual tax on a $50,000 salary:**\n\n- First $14,000 @ 10.5% = $1,470\n- Next $34,000 ($14,001-$48,000) @ 17.5% = $5,950\n- Last $2,000 ($48,001-$50,000) @ 30% = $600\n- **Total tax: $8,020**\n- **Effective tax rate: 16.04%**\n\nSee? You''re paying an average of about 16% — nowhere near the 30% bracket rate that scares people."
    },
    {
      "type": "stat-card",
      "label": "Effective Tax Rate on $50,000",
      "value": "~16%",
      "description": "Even though $50k falls in the 30% bracket, the actual tax paid is only about 16% of total income thanks to the progressive system. You never lose money by earning more."
    },
    {
      "type": "mini-quiz",
      "question": "You earn $15,000 a year from your part-time job. How much tax do you pay on the $1,000 above $14,000?",
      "options": ["10.5% ($105)", "17.5% ($175)", "30% ($300)", "0% (it''s under the threshold)"],
      "correct_index": 1,
      "explanation": "The first $14,000 is taxed at 10.5%. The extra $1,000 above $14,000 falls into the 17.5% bracket, so you pay $175 on that portion. You NEVER pay a higher rate on the money in the lower brackets.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "NZ uses a _____ tax system where each bracket only applies to income within that _____. Your _____ rate is the average tax you actually pay, which is always lower than your marginal rate.",
      "blanks": ["progressive", "range", "effective"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "Never Turn Down a Pay Rise Because of Tax",
      "text": "You will ALWAYS take home more money if you earn more. Getting a raise into a higher bracket only means the EXTRA income is taxed at the higher rate. The rest stays the same. Never turn down more money because of tax — that''s one of the most expensive myths out there."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand how NZ tax actually works better than most adults. The progressive system is fair and you should never be afraid of earning more. Next up: the sneaky tax hiding in everything you buy — GST."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 7.2: GST — The Hidden 15%
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'tax-gst-basics'),
  'gst-hidden-15-percent',
  'GST: The Hidden 15%',
  'What GST is, why NZ prices include it, GST-exempt items, and how NZ compares to other countries.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "GST: The Hidden 15%"
    },
    {
      "type": "text",
      "text": "Every time you buy pretty much anything in New Zealand — a coffee, a hoodie, a phone case — **15% of the price is tax**. It''s called GST (Goods and Services Tax) and it''s baked into every price tag. Unlike income tax, you can''t avoid it. But you should definitely understand it."
    },
    {
      "type": "text",
      "text": "**How GST works:**\n\n- The GST rate in NZ is **15%** (one of the higher rates globally)\n- It''s **included in the sticker price** — what you see on the shelf is what you pay (unlike the US where tax is added at checkout)\n- Businesses collect GST from customers and pass it on to the IRD\n- On a $10 coffee, $1.30 is GST (the formula is price x 3/23)\n- On a $100 purchase, $13.04 is GST\n\nEvery. Single. Purchase. That adds up to a LOT of tax over a year."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "NZ is actually one of the few countries where prices INCLUDE GST on the tag. In the US, Australia, and many other countries, the advertised price is before tax — you get a nasty surprise at the checkout. At least in NZ, the price you see is the price you pay."
    },
    {
      "type": "stat-card",
      "label": "GST on Your Spending",
      "value": "~$3,000-$5,000/yr",
      "description": "If you spend $20,000-$35,000 a year (pretty normal for a young Kiwi), roughly $2,600-$4,500 of that is GST going to the government. It''s the tax you pay the most but think about the least."
    },
    {
      "type": "text",
      "text": "**What''s GST-exempt (zero-rated)?**\n\nMost things have GST, but some don''t:\n\n- **Rent/mortgage** — No GST on residential rent (phew!)\n- **Financial services** — Bank fees, insurance premiums, KiwiSaver fees\n- **Donations to registered charities** — Good news for generous Kiwis\n- **Wages/salaries** — Your pay isn''t a ''good or service''\n- **Exported goods** — If you sell something overseas\n- **Secondhand goods between private sellers** — Your Trade Me sale from one person to another\n\nNotably, NZ does NOT exempt food or children''s clothing from GST (unlike some countries). Everything at the supermarket includes 15% GST."
    },
    {
      "type": "mini-quiz",
      "question": "You buy a laptop for $1,500. How much of that is GST?",
      "options": ["$150", "$195.65", "$225", "$1,500 is all GST"],
      "correct_index": 1,
      "explanation": "GST is 15% of the GST-exclusive price. To find the GST in a GST-inclusive price, multiply by 3/23. $1,500 x 3/23 = $195.65. So $195.65 of your $1,500 laptop goes straight to the IRD as GST.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: How does NZ''s GST compare internationally?",
      "reveal_text": "NZ''s 15% GST is higher than Australia (10%) and the UK (20% VAT). The key difference is NZ applies GST to almost EVERYTHING with very few exemptions. Many countries exempt food, children''s clothing, and medical items. NZ''s broad-base, fewer-exemptions approach is considered simpler but means you pay GST on basics like bread and milk. There''s regular debate about whether food should be GST-exempt.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "GST Awareness Challenge",
      "text": "Next time you get a receipt, look for the GST line. Most receipts show the GST amount separately at the bottom. On a $50 supermarket shop, about $6.52 is GST. Being aware of how much tax you''re paying on everyday purchases is the first step to being financially savvy."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "GST is the tax nobody thinks about but everybody pays — constantly. Now that you understand it, you''ll see that 15% everywhere. Next: how to get money BACK from IRD through tax returns."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 7.3: Tax Returns & Refunds
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'tax-gst-basics'),
  'tax-returns-refunds',
  'Tax Returns & Refunds',
  'When and how to file an IR3, common deductions for students and workers, using myIR, and getting refunds.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Tax Returns & Refunds"
    },
    {
      "type": "text",
      "text": "Here''s the exciting part of tax — sometimes the IRD owes YOU money. If you''ve been overtaxed during the year (which is super common for part-time workers), you can get a refund. Free money that''s rightfully yours. Let''s make sure you never miss out."
    },
    {
      "type": "text",
      "text": "**How the NZ tax year works:**\n\n- The tax year runs from **1 April to 31 March**\n- After 31 March, IRD calculates whether you''ve paid too much or too little tax\n- For most PAYE earners, IRD does an **automatic income tax assessment** — they figure it out for you\n- If you''re owed a refund, they''ll ask you to confirm your bank details and send it to you\n- If you owe tax, they''ll send you a bill (you usually have time to pay)\n- You can check your assessment by logging into **myIR** at ird.govt.nz"
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "If you worked part-time or had irregular hours during the year, there''s a good chance you''ve been overtaxed. PAYE is calculated assuming you earn the same amount every week — if some weeks you earned more and some weeks less, you''ve probably overpaid. That means a refund is coming!"
    },
    {
      "type": "stat-card",
      "label": "Average NZ Tax Refund",
      "value": "$350-$500",
      "description": "Many part-time workers and students receive tax refunds of $350-$500 each year. Some get even more. All you have to do is log into myIR and check."
    },
    {
      "type": "text",
      "text": "**When you need to file an IR3 (individual tax return):**\n\nMost people DON''T need to file a tax return — IRD does it automatically. But you DO need to file an IR3 if:\n\n- You earned **self-employment income** (side hustles, freelancing)\n- You earned **rental income**\n- You received income from **overseas**\n- You want to claim **donation tax credits** (gave to charity)\n- You had income that **didn''t have PAYE deducted**\n\nFiling an IR3 is free and can be done through myIR. It''s not that scary once you''ve done it once."
    },
    {
      "type": "mini-quiz",
      "question": "You worked part-time during uni and IRD says you overpaid $420 in tax. What should you do?",
      "options": ["Nothing — the government keeps it", "Pay a tax agent $100 to claim it", "Log into myIR for free and confirm your refund", "Wait for IRD to send a cheque automatically"],
      "correct_index": 2,
      "explanation": "Log into myIR yourself — it''s free and takes about 5 minutes. NEVER pay a ''tax refund company'' to do this for you. They charge 15-30% of your refund for something that takes 5 minutes and costs nothing.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Tax refund company warning",
      "reveal_text": "Companies like Tax Refunds NZ, Etax, and similar services advertise ''get your refund fast!'' They charge 15-30% of your refund. On a $500 refund, that''s $75-$150 gone. All they do is log into myIR on your behalf — something you can do yourself for free in 5 minutes. Don''t give away your money. Do it yourself at ird.govt.nz.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "myIR Setup Guide",
      "text": "If you haven''t already, set up myIR now:\n1. Go to ird.govt.nz and click ''Log in to myIR''\n2. Register with your IRD number and email\n3. Verify your identity (you may need to call IRD or visit a branch)\n4. Once logged in, check your income summary and tax assessment\n5. Update your bank account details so refunds go straight to you"
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Tax refunds are YOUR money that the government collected too much of. Check myIR every April — you might be sitting on a few hundred dollars without knowing it. Ka pai for learning to claim what''s yours!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 7.4: Self-Employment Tax
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'tax-gst-basics'),
  'self-employment-tax',
  'Self-Employment Tax',
  'Freelance and side hustle tax obligations, provisional tax, claimable expenses, and the GST registration threshold.',
  4, 7, 75,
  '[
    {
      "type": "heading",
      "text": "Self-Employment Tax"
    },
    {
      "type": "text",
      "text": "Got a side hustle? Freelancing? Selling stuff online? Mowing lawns for cash? **You need to know about self-employment tax.** It''s not as scary as it sounds, but ignoring it can get you in trouble with the IRD — and nobody wants that."
    },
    {
      "type": "text",
      "text": "**If you earn money outside of PAYE employment, you''re technically self-employed for tax purposes.** This includes:\n\n- Freelance work (design, writing, tutoring, photography)\n- Selling goods (Trade Me, markets, Etsy)\n- Contracting or gig work (Uber, DoorDash)\n- Side hustles (lawn mowing, dog walking, babysitting)\n- Content creation income (YouTube, TikTok, sponsorships)\n\nAll of this income is taxable. The IRD expects you to declare it and pay tax on it."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "''But it''s just cash, the IRD won''t know!'' — Wrong. The IRD has sophisticated data matching systems. They cross-reference bank deposits, platform payments (Sharesies, Airbnb, etc.), and even social media activity. Getting caught evading tax means penalties, interest, and potentially prosecution. It''s not worth it."
    },
    {
      "type": "text",
      "text": "**How self-employment tax works in NZ:**\n\n1. **Track all income and expenses** throughout the year\n2. **File an IR3** tax return (individual tax return) by 7 July each year\n3. **Pay income tax** at the standard progressive rates on your profit (income minus expenses)\n4. **Provisional tax** — If you owe more than $5,000 in residual tax, you''ll need to pay provisional tax in instalments the following year\n5. **ACC levies** — Self-employed people pay their own ACC levies (about 1.2-1.5% of income)"
    },
    {
      "type": "stat-card",
      "label": "GST Registration Threshold",
      "value": "$60,000/year",
      "description": "If your self-employment income exceeds $60,000 in any 12-month period, you MUST register for GST. Below that, it''s optional. If you register, you charge clients 15% GST and can claim GST back on business expenses."
    },
    {
      "type": "text",
      "text": "**Expenses you can claim (deduct from your income):**\n\n- **Equipment** — Tools, laptop, camera, phone (business-use portion)\n- **Vehicle costs** — Fuel and mileage for business travel (IRD rate: 97c/km)\n- **Home office** — A portion of rent, power, and internet if you work from home\n- **Materials and supplies** — Anything you buy specifically for your business\n- **Software** — Subscriptions like Adobe, Canva, accounting software\n- **Phone and internet** — The business-use percentage\n- **Professional development** — Courses and training related to your work\n\nKeep ALL receipts. Use an app like Hnry or Xero to track everything."
    },
    {
      "type": "mini-quiz",
      "question": "You earned $8,000 from freelance design work this year and had $2,000 in expenses (laptop, software). What do you pay tax on?",
      "options": ["$8,000", "$6,000 (income minus expenses)", "$2,000", "$0 — it''s under the tax threshold"],
      "correct_index": 1,
      "explanation": "You pay tax on your PROFIT, which is income ($8,000) minus allowable expenses ($2,000) = $6,000. This is why tracking expenses is so important — every legitimate expense reduces your tax bill.",
      "xp_bonus": 20
    },
    {
      "type": "fill-blanks",
      "sentence": "Self-employed people file an _____ tax return. You pay tax on _____ (income minus expenses). You must register for GST if you earn over $_____ per year.",
      "blanks": ["IR3", "profit", "60,000"],
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "The 30% Rule for Side Hustlers",
      "text": "Set aside 30% of every dollar you earn from self-employment into a separate ''tax savings'' account. When your tax bill arrives, you''ll have the money ready. Most self-employed people get caught out because they spend all their income and have nothing left for tax. Don''t be that person."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Self-employment tax is totally manageable once you understand the basics. Track your income, save your receipts, claim your expenses, and set aside 30% for tax. You''ve got this."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 7.5: Tax Codes Deep Dive
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'tax-gst-basics'),
  'tax-codes-deep-dive',
  'Tax Codes Deep Dive',
  'M, ME, S, SH, SL, ST — when to use each, multiple jobs, common mistakes, and how to change.',
  5, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Tax Codes Deep Dive"
    },
    {
      "type": "text",
      "text": "Tax codes are those letters you put on your IR330 form when you start a job. Get them right and your tax sorts itself out. Get them wrong and you''ll either overpay tax all year (annoying) or get a surprise bill at the end of the year (worse). Let''s nail this."
    },
    {
      "type": "text",
      "text": "**The main tax codes explained:**\n\n- **M** — Main or only job, NO student loan. The most common code for teens and young workers with one job.\n- **ME** — Main or only job WITH a student loan. The ''E'' stands for ''education'' loan. 12% of income over $24,128 goes to your loan repayment.\n- **S** — Secondary job. If you already use M or ME somewhere else, ALL other jobs use S. Tax rate is higher (17.5% flat) to compensate.\n- **SH** — Secondary job where your combined income from all jobs is $48,001-$70,000. Tax rate: 30%.\n- **ST** — Secondary job where combined income is $70,001-$180,000. Tax rate: 33%.\n- **SL** — Secondary job WITH a student loan and combined income under $48,000."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "The most common mistake: using M at TWO jobs. If you have two jobs and put M on both, you''ll be undertaxed on one of them. At the end of the year, you''ll get a tax bill that could be hundreds of dollars. Always use M for your main job and S (or SH/ST) for any additional jobs."
    },
    {
      "type": "text",
      "text": "**How to pick the right code — decision tree:**\n\n1. Is this your ONLY job? → **M** (or **ME** if you have a student loan)\n2. Is this your main job (you earn the most here)? → **M** or **ME**\n3. Is this a second/third job?\n   - Combined income under $48,000 → **S** (or **SL** with student loan)\n   - Combined income $48,001-$70,000 → **SH**\n   - Combined income $70,001-$180,000 → **ST**"
    },
    {
      "type": "stat-card",
      "label": "NZ Workers With Wrong Tax Codes",
      "value": "~1 in 5",
      "description": "About 20% of workers with multiple jobs have the wrong tax code on at least one job. This leads to surprise tax bills or missed refunds at the end of the year."
    },
    {
      "type": "mini-quiz",
      "question": "You work at a cafe (main job, $25k/year) and tutor on weekends ($5k/year). What tax codes should you use?",
      "options": ["M for both", "M for the cafe, S for tutoring", "S for the cafe, M for tutoring", "ME for both"],
      "correct_index": 1,
      "explanation": "Your cafe job is your main income, so it gets M. Your tutoring is secondary, so it gets S (since your combined income is under $48,000). If you had a student loan, it would be ME for the cafe and SL for tutoring.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: How to change your tax code",
      "reveal_text": "If you realise you''re on the wrong tax code, it''s easy to fix:\n1. Fill out a new IR330 form (available at ird.govt.nz)\n2. Give it to your employer/payroll team\n3. They''ll update your PAYE deductions from the next pay period\n4. You can also update via myIR for some situations\n\nDo this ASAP if your code is wrong — the longer you wait, the bigger the overpayment or underpayment.",
      "xp_bonus": 10
    },
    {
      "type": "sort-order",
      "instruction": "Put these tax codes in order from ''only job'' to ''high-income secondary job'':",
      "items": ["ST", "M", "SH", "S"],
      "correct_order": ["M", "S", "SH", "ST"],
      "explanation": "M is for your main/only job. S is for a secondary job with combined income under $48k. SH is secondary with $48k-$70k combined. ST is secondary with $70k-$180k combined. Each higher code deducts more tax to match the higher bracket.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Starting a New Job Checklist",
      "text": "Every time you start a new job, you need to fill out an IR330 (Tax code declaration). Before you fill it in, ask yourself: Is this my only job? Do I have a student loan? What''s my total expected income from ALL jobs this year? Answer those three questions correctly and you''ll pick the right code every time."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now understand NZ tax from top to bottom — income tax brackets, GST, tax returns, self-employment tax, and tax codes. That''s a massive knowledge advantage. Ka pai rawa atu — you''re officially tax-savvy!"
    }
  ]'::jsonb
);
