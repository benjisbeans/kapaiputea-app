-- ============================================================================
-- 013_seed_explore_modules.sql
-- Seed 2 "explore" category modules: Hustle Empire & Money Confidence Builder
-- 10 lessons total with full content blocks
-- ============================================================================

-- ===========================================================================
-- MODULE 12: Hustle Empire
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'hustle-empire',
  'Hustle Empire',
  'Build your own business empire from scratch — learn entrepreneurship, get funded, and run the numbers like a boss.',
  '🏢',
  'pink',
  12,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  35,
  600,
  5,
  'explore',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 12.1: The Entrepreneurial Mindset
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'hustle-empire'),
  'entrepreneurial-mindset',
  'The Entrepreneurial Mindset',
  'Discover what it takes to think like an entrepreneur — and why some of NZ''s biggest companies started in a garage.',
  1, 6, 100,
  '[
    {
      "type": "heading",
      "text": "The Entrepreneurial Mindset"
    },
    {
      "type": "text",
      "text": "You don''t need a suit, an MBA, or a million dollars to start a business. Some of the most successful companies in New Zealand started with nothing more than an idea, a laptop, and a whole lot of hustle. **Entrepreneurship is a mindset** — and anyone can develop it."
    },
    {
      "type": "text",
      "text": "**NZ success stories that started small:**\n\n- **Xero** — Rod Drury started this accounting software company in Wellington in 2006. Today it''s worth over $10 billion and used by millions of businesses worldwide.\n- **Rocket Lab** — Peter Beck built his first rocket in his garage in Invercargill. Now Rocket Lab launches satellites into space from Mahia Peninsula.\n- **Allbirds** — Tim Brown, a former All Whites captain, co-founded a shoe company using NZ merino wool. Now a global brand.\n- **Whittaker''s** — A family chocolate business started in Christchurch in 1896. They stuck to quality over quantity and now outsell Cadbury in NZ."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "What do all these founders have in common? They didn''t wait for permission. They spotted a problem, came up with a solution, and just started. You don''t need to be a genius — you need to be willing to have a crack."
    },
    {
      "type": "text",
      "text": "**The 5 traits of an entrepreneurial mindset:**\n\n1. **Curiosity** — Always asking \"why?\" and \"what if?\"\n2. **Resilience** — Getting knocked down and getting back up. Every successful founder has failed multiple times.\n3. **Risk tolerance** — Being comfortable with uncertainty. Not reckless gambling, but calculated bets.\n4. **Resourcefulness** — Making the most of what you''ve got. You don''t need everything to be perfect to start.\n5. **Action bias** — Doing something instead of just planning forever. Done is better than perfect."
    },
    {
      "type": "stat-card",
      "label": "NZ business startups per year",
      "value": "~50,000",
      "description": "Around 50,000 new businesses are registered in New Zealand every year. Kiwis are some of the most entrepreneurial people on earth."
    },
    {
      "type": "mini-quiz",
      "question": "What''s the most important trait for a new entrepreneur?",
      "options": ["Having lots of money to invest", "Being willing to take calculated risks and learn from failure", "Having a university degree in business", "Knowing famous people who can help you"],
      "correct_index": 1,
      "explanation": "Money, education, and connections can help — but resilience and willingness to take smart risks are what actually separate successful entrepreneurs from everyone else. Peter Beck didn''t have a degree. He had determination.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What''s the #1 reason businesses fail?",
      "reveal_text": "It''s not lack of money or bad products. The #1 reason businesses fail is that they build something nobody actually wants. That''s why validating your idea with real people BEFORE spending money is so important. We''ll cover that in the next lesson.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Start Thinking Like an Entrepreneur Today",
      "text": "This week, look around and notice problems. Long queues, annoying processes, things that could be better. Write down 3 problems you notice. For each one, brainstorm a potential solution. Congratulations — you''ve just come up with 3 business ideas. That''s literally how it starts."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Ka pai! You''ve just taken the first step toward thinking like an entrepreneur. The rest of this module will give you the practical skills to turn ideas into action — and maybe even profit."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 12.2: Your First Business Idea
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'hustle-empire'),
  'first-business-idea',
  'Your First Business Idea',
  'Learn how to validate a business idea, understand costs vs revenue, and figure out if your hustle can actually make money.',
  2, 7, 120,
  '[
    {
      "type": "heading",
      "text": "Your First Business Idea"
    },
    {
      "type": "text",
      "text": "Having a business idea is easy. Having a GOOD business idea that people will actually pay for? That takes a bit more work. In this lesson, you''ll learn how to take a raw idea and figure out if it''s worth pursuing — before you spend a single dollar."
    },
    {
      "type": "text",
      "text": "**Business ideas that work for NZ teens:**\n\n- **Food trucks / market stalls** — NZ''s weekend market scene is massive. A good food stall at a Saturday market can pull $500-1,500 in a day.\n- **Online stores** — Sell on Trade Me, Shopify, or Instagram. Dropshipping, handmade goods, or reselling.\n- **Lawn mowing & gardening** — Low startup cost, high demand, recurring customers. A ride-on mower and some flyers = instant business.\n- **Tutoring** — Charge $25-40/hr helping younger students with NCEA. Your recent experience with the material is actually an advantage.\n- **Car detailing** — A bucket, some cleaning products, and hard work. Mobile car detailing charges $80-150 per car."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The best first businesses are ones with LOW startup costs and HIGH demand. You don''t need to invent the next iPhone. You just need to solve a real problem for real people in your area."
    },
    {
      "type": "text",
      "text": "**How to validate your idea (before spending money):**\n\n1. **Talk to 10 people** — Would they actually pay for this? How much? Be specific.\n2. **Check the competition** — Are others doing it? That''s actually a GOOD sign — it means there''s demand. How can you do it better or differently?\n3. **Calculate your costs** — What do you need to spend to get started? What are your ongoing costs?\n4. **Calculate potential revenue** — How much can you charge? How many customers can you realistically serve?\n5. **Does the maths work?** — Revenue minus costs = profit. If it''s positive, you might have a winner."
    },
    {
      "type": "stat-card",
      "label": "Lawn mowing startup cost",
      "value": "~$300-500",
      "description": "A second-hand push mower, fuel, flyers, and basic tools. You could earn that back in your first weekend with 4-5 lawns at $40-60 each."
    },
    {
      "type": "sort-order",
      "instruction": "Rank these business ideas from LOWEST startup cost to HIGHEST:",
      "items": ["Tutoring service", "Food truck", "Lawn mowing round", "Online Shopify store"],
      "correct_order": ["Tutoring service", "Lawn mowing round", "Online Shopify store", "Food truck"],
      "explanation": "Tutoring needs almost zero startup cost (just your brain). Lawn mowing needs a mower ($300-500). An online store needs products and a subscription (~$500-1,000). A food truck needs a vehicle, equipment, and permits ($10,000+).",
      "xp_bonus": 20
    },
    {
      "type": "mini-quiz",
      "question": "You want to start a tutoring business. You charge $30/hr and tutor 5 students per week for 1 hour each. What''s your weekly revenue?",
      "options": ["$30", "$100", "$150", "$200"],
      "correct_index": 2,
      "explanation": "$30 x 5 students = $150 per week. With almost zero expenses (maybe a few bucks for printing worksheets), nearly all of that is profit. Not bad for 5 hours of work!",
      "xp_bonus": 15
    },
    {
      "type": "tip-box",
      "title": "The Minimum Viable Product (MVP)",
      "text": "Don''t try to build the perfect business on day one. Start with the simplest possible version — the MVP. If you want a lawn mowing business, don''t buy a $2,000 ride-on mower. Borrow a push mower, do 3 lawns, and see if you enjoy it and people want more. THEN invest in better equipment."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now know how to spot, validate, and evaluate a business idea. Next up: how to get the money to actually make it happen."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 12.3: Getting Funded
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'hustle-empire'),
  'getting-funded',
  'Getting Funded',
  'Explore your options for funding a business — from bootstrapping with savings to business loans and grants.',
  3, 8, 130,
  '[
    {
      "type": "heading",
      "text": "Getting Funded"
    },
    {
      "type": "text",
      "text": "You''ve got a solid business idea. Now you need money to make it real. The good news? There are more options than you think — and not all of them involve going to a bank and begging for a loan."
    },
    {
      "type": "text",
      "text": "**Your funding options:**\n\n- **Bootstrapping** — Using your own savings or income to fund the business. No debt, no investors, full control. This is how most teen businesses start.\n- **Friends & whānau** — Borrowing from people you know. Be careful though — money can make relationships messy. Always write down the terms.\n- **Business loans** — Banks like ANZ, ASB, BNZ, and Kiwibank offer small business loans. You''ll need a solid plan and usually some form of security.\n- **Government grants** — Callaghan Innovation offers grants for innovative businesses. Regional councils sometimes have startup grants too.\n- **Crowdfunding** — Platforms like PledgeMe (a NZ crowdfunding site) let you raise money from the public."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Before you borrow ANY money, make sure you understand: the interest rate, the repayment schedule, what happens if you can''t pay it back, and whether you''re putting up any personal assets as security. Never sign anything you don''t fully understand."
    },
    {
      "type": "stat-card",
      "label": "Average NZ small business loan rate",
      "value": "8-14%",
      "description": "Business loan interest rates in NZ typically range from 8-14% depending on the bank, loan amount, and your credit history. That''s significantly higher than a home loan."
    },
    {
      "type": "text",
      "text": "**Bootstrapping vs borrowing — the trade-off:**\n\n| | Bootstrapping | Business Loan |\n|---|---|---|\n| **Speed** | Slower — limited by your savings | Faster — get a lump sum upfront |\n| **Risk** | Lower — you only lose what you put in | Higher — you owe the money regardless |\n| **Control** | Full control — no one to answer to | Bank may want oversight |\n| **Growth** | Can be limited by cash flow | Can accelerate growth |\n\nFor most teen businesses, **bootstrapping is the way to go**. Start small, prove it works, then consider borrowing to scale."
    },
    {
      "type": "mini-quiz",
      "question": "You need $5,000 to start a food truck. Which funding approach has the LOWEST risk?",
      "options": ["Take out a bank loan for the full amount", "Bootstrap — save up and start smaller", "Borrow from 5 different friends", "Max out a credit card"],
      "correct_index": 1,
      "explanation": "Bootstrapping means you only risk money you''ve already saved. If the business doesn''t work out, you don''t owe anyone anything. Starting smaller also lets you test the idea before going all in.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What is Callaghan Innovation?",
      "reveal_text": "Callaghan Innovation is a New Zealand government agency that supports businesses with research and development. They offer grants, funding, and mentorship for innovative Kiwi businesses. While most of their grants target established businesses, they also run student and youth programs. Check out callaghaninnovation.govt.nz to see what''s available.",
      "xp_bonus": 10
    },
    {
      "type": "business-sim",
      "scenario_id": "apply-for-business-loan",
      "title": "Apply for a Business Loan",
      "description": "You want to start a food truck serving loaded fries at weekend markets. You''ve saved $3,000 but need more capital. Time to explore your loan options and see how different terms affect your bottom line.",
      "starting_cash": 3000,
      "decisions": [
        {
          "id": "loan-amount",
          "prompt": "How much do you want to borrow for your food truck setup?",
          "options": [
            {"label": "Borrow $8,000 — full commercial setup with quality equipment", "cost": 8000, "revenue_per_turn": 3500, "risk": 0.15, "explanation": "More equipment means more capacity and better food, but the repayments are hefty. High reward if it works, painful if it doesn''t."},
            {"label": "Borrow $5,000 — solid setup with essential equipment", "cost": 5000, "revenue_per_turn": 2500, "risk": 0.08, "explanation": "A balanced approach. You get decent equipment without overextending yourself. Most new food vendors start here."},
            {"label": "Borrow $2,000 — bare minimum setup, keep it lean", "cost": 2000, "revenue_per_turn": 1500, "risk": 0.03, "explanation": "Low risk, low debt. You''ll have basic equipment and can upgrade later from profits. Smart if you''re not 100% sure about the idea."}
          ]
        },
        {
          "id": "interest-rate-negotiation",
          "prompt": "The bank offers you a loan. Which terms do you choose?",
          "options": [
            {"label": "12% interest, 6-month repayment — get it over with fast", "cost": 600, "revenue_per_turn": 500, "risk": 0.12, "explanation": "Higher monthly repayments but you clear the debt faster and pay less total interest. Puts pressure on cash flow early on."},
            {"label": "10% interest, 12-month repayment — steady and manageable", "cost": 400, "revenue_per_turn": 400, "risk": 0.06, "explanation": "A good middle ground. Manageable monthly payments that won''t cripple your cash flow while you''re finding your feet."},
            {"label": "9% interest, 24-month repayment — lowest monthly payments", "cost": 250, "revenue_per_turn": 300, "risk": 0.04, "explanation": "Easiest on monthly cash flow but you pay more interest over time. Good if you want breathing room while building the business."}
          ]
        }
      ],
      "turns": 3,
      "success_threshold": 6000,
      "xp_bonus": 25
    },
    {
      "type": "tip-box",
      "title": "Funding Golden Rule",
      "text": "Only borrow what you can afford to pay back even if the business fails. A good test: could you repay this from your part-time job if everything went wrong? If yes, the risk is manageable. If no, borrow less or save more first."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Nice work! You now understand the funding landscape for NZ businesses. Whether you bootstrap or borrow, you know the trade-offs. Next: let''s get into the numbers that make or break a business."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 12.4: Running the Numbers
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'hustle-empire'),
  'running-the-numbers',
  'Running the Numbers',
  'Learn about business tax, GST, expenses tracking, and profit margins — the stuff that keeps your hustle alive.',
  4, 8, 130,
  '[
    {
      "type": "heading",
      "text": "Running the Numbers"
    },
    {
      "type": "text",
      "text": "A business that makes money but doesn''t track it properly will still fail. **Profit isn''t what you earn — it''s what you keep.** This lesson is about the numbers side of running a business: tax, GST, expenses, and margins."
    },
    {
      "type": "text",
      "text": "**Business income tax basics:**\n\nWhen you run a business in NZ (even a side hustle), you pay income tax on your **profit** — that''s revenue minus expenses. The tax rate depends on your business structure:\n\n- **Sole trader** — Taxed at your personal income tax rates (10.5% to 39%). Most teen businesses are sole traders.\n- **Company** — Flat 28% tax rate. More complex to set up but can be better as you grow.\n- **Partnership** — Each partner pays tax on their share of the profit."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "If your business earns over **$60,000 per year in revenue**, you MUST register for GST (Goods and Services Tax). That means adding 15% GST to your prices and paying it to IRD. Below $60k, registration is optional but sometimes beneficial."
    },
    {
      "type": "stat-card",
      "label": "GST registration threshold",
      "value": "$60,000/yr",
      "description": "If your business turns over more than $60,000 in any 12-month period, GST registration is mandatory. You charge 15% on top of your prices and send it to IRD."
    },
    {
      "type": "text",
      "text": "**Understanding profit margins:**\n\nYour profit margin tells you how much of every dollar you actually keep.\n\n- **Revenue**: $1,000 (total money coming in)\n- **Cost of goods**: -$400 (ingredients, supplies, materials)\n- **Overheads**: -$200 (fuel, phone, market stall fee)\n- **Profit**: $400\n- **Profit margin**: 40% ($400 / $1,000)\n\nA 40% margin is solid for a food business. Some businesses run on 5-10% margins (supermarkets), others on 60-80% (software). Know your numbers!"
    },
    {
      "type": "mini-quiz",
      "question": "Your food truck makes $2,000 in revenue this week. Ingredients cost $600, fuel is $100, and the market fee is $200. What''s your profit?",
      "options": ["$2,000", "$1,400", "$1,100", "$900"],
      "correct_index": 2,
      "explanation": "$2,000 - $600 - $100 - $200 = $1,100. That''s your profit before tax. Your profit margin is 55% — which is excellent for a food business. Now you need to set aside some for tax!",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "Profit equals _____ minus _____. If your business earns over $_____ per year, you must register for GST.",
      "blanks": ["revenue", "expenses", "60,000"],
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What expenses can you claim?",
      "reveal_text": "As a business owner, you can deduct legitimate expenses from your revenue before paying tax. This includes: ingredients and supplies, fuel and vehicle costs (for business use), equipment and tools, phone and internet (business portion), market fees and rent, advertising costs, accounting software. Keep EVERY receipt and record EVERY expense. Apps like Xero or Hnry make this easy in NZ.",
      "xp_bonus": 10
    },
    {
      "type": "business-sim",
      "scenario_id": "run-food-truck-6-months",
      "title": "Run Your Food Truck for 6 Months",
      "description": "Your loaded fries food truck is ready to roll. You''ve got $8,000 in the bank. Now you need to make smart decisions about pricing, location, and staffing to turn a profit over the next 6 months.",
      "starting_cash": 8000,
      "decisions": [
        {
          "id": "pricing-strategy",
          "prompt": "How do you price your loaded fries?",
          "options": [
            {"label": "Premium pricing — $16 per serve, gourmet toppings, smaller portions", "cost": 800, "revenue_per_turn": 3200, "risk": 0.15, "explanation": "Higher price means bigger margins per serve, but fewer customers. Works if your food is genuinely next-level and you''re in a high-income area."},
            {"label": "Mid-range pricing — $12 per serve, generous portions, quality toppings", "cost": 600, "revenue_per_turn": 2800, "risk": 0.06, "explanation": "The sweet spot for most food trucks. Good margins, good value for customers. Most people are comfortable spending $12 on market food."},
            {"label": "Budget pricing — $8 per serve, large portions, simple toppings", "cost": 400, "revenue_per_turn": 2200, "risk": 0.03, "explanation": "You''ll sell more serves but make less per serve. Good for high-traffic areas where volume matters. Risk is lower because more people will buy."}
          ]
        },
        {
          "id": "location-choice",
          "prompt": "Where do you set up your food truck?",
          "options": [
            {"label": "CBD lunch spots — high foot traffic, Monday to Friday", "cost": 1500, "revenue_per_turn": 3000, "risk": 0.12, "explanation": "Busy office workers want quick lunch options. High fees for CBD permits but massive foot traffic. Weather and competition are your biggest risks."},
            {"label": "Weekend markets — Saturday & Sunday farmers markets", "cost": 800, "revenue_per_turn": 2400, "risk": 0.06, "explanation": "Weekend markets are the bread and butter of NZ food trucks. Lower costs, loyal customer base, good vibes. Less revenue than CBD but more consistent."},
            {"label": "Events & festivals — concerts, sports events, night markets", "cost": 500, "revenue_per_turn": 2000, "risk": 0.08, "explanation": "Events can be huge money makers but they''re irregular. Some weekends you''ll smash it, others you''ll have no bookings. Feast or famine."}
          ]
        },
        {
          "id": "staffing-decision",
          "prompt": "Do you hire help or go solo?",
          "options": [
            {"label": "Hire 2 part-time staff — serve more customers, work less yourself", "cost": 2000, "revenue_per_turn": 1500, "risk": 0.10, "explanation": "Staff let you serve double the customers and take days off. But payroll is your biggest ongoing cost. Training and reliability are challenges."},
            {"label": "Hire 1 helper for busy days — backup when you need it", "cost": 1000, "revenue_per_turn": 800, "risk": 0.05, "explanation": "A balanced approach. You handle quiet days solo and bring in help on weekends and events. Keeps costs manageable while covering peak times."},
            {"label": "Solo operation — keep all the profit, do all the work", "cost": 0, "revenue_per_turn": 400, "risk": 0.02, "explanation": "Zero staffing costs mean more profit per serve. But you''re limited by how fast one person can cook and serve. You also can''t take a sick day."}
          ]
        }
      ],
      "turns": 4,
      "success_threshold": 12000,
      "xp_bonus": 25
    },
    {
      "type": "tip-box",
      "title": "Track Everything From Day One",
      "text": "Get a simple spreadsheet or use an app like Hnry (designed for NZ self-employed people) to track every dollar in and out. At the end of each week, check your numbers. If you''re not making a profit, you need to either increase revenue or cut costs. The numbers don''t lie."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You''re thinking like a real business owner now. Understanding your numbers is the difference between a hobby and a real business. Next up: scaling your empire."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 12.5: Scale or Fail
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'hustle-empire'),
  'scale-or-fail',
  'Scale or Fail',
  'Learn when to grow, when to pivot, and when to cut your losses — the decisions that separate empires from failures.',
  5, 8, 130,
  '[
    {
      "type": "heading",
      "text": "Scale or Fail"
    },
    {
      "type": "text",
      "text": "Your food truck is making money. Customers love your loaded fries. Now comes the hardest question in business: **do you grow, stay the same, or try something new?** Scaling too fast can kill a business just as easily as not growing at all."
    },
    {
      "type": "text",
      "text": "**Three paths when your business is working:**\n\n1. **Scale up** — Open a second location, hire more staff, increase capacity. More revenue but more risk and complexity.\n2. **Stay steady** — Keep doing what works, maximise profit from your current setup. Lower risk, but competitors might overtake you.\n3. **Pivot** — Change direction based on what you''ve learned. Maybe loaded fries aren''t the future, but your catering contacts are gold."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Most successful NZ businesses didn''t get big overnight. Whittaker''s was a small Christchurch operation for nearly 100 years before becoming the country''s favourite chocolate. Patience and consistency beat rapid growth almost every time."
    },
    {
      "type": "text",
      "text": "**Signs you''re ready to scale:**\n\n- You''re consistently profitable (not just one good week)\n- You''re turning away customers because you can''t keep up\n- You have reliable systems that work without you doing everything\n- You have enough cash reserves to survive 3 months if the expansion doesn''t work\n- You''ve tested the new market/location and there''s genuine demand"
    },
    {
      "type": "stat-card",
      "label": "NZ business failure rate",
      "value": "~30% in year 1",
      "description": "About 30% of new NZ businesses don''t survive their first year. The most common reason? Running out of cash because they grew too fast."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Top 5 reasons NZ businesses fail",
      "reveal_text": "1. Running out of cash — growing too fast or not managing cash flow\n2. No market need — building something nobody wants\n3. Wrong team — hiring the wrong people or doing everything alone\n4. Getting outcompeted — not adapting to what customers want\n5. Pricing problems — charging too little (or too much) and not adjusting\n\nNotice that \"bad idea\" isn''t even in the top 5. Execution and cash management matter more than the idea itself.",
      "xp_bonus": 15
    },
    {
      "type": "mini-quiz",
      "question": "Your food truck made $4,000 profit last month. A friend wants to open a second truck in another city. You should:",
      "options": ["Immediately say yes — double the trucks, double the money!", "Say yes but use a credit card to fund it for speed", "Wait until you have 3-6 months of consistent profits and enough cash reserves", "Never expand — one truck is enough forever"],
      "correct_index": 2,
      "explanation": "One good month doesn''t mean you''re ready to double. Smart scaling means proving consistency first, building cash reserves, and expanding from a position of strength — not hope.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Reinvesting profits is how empires are built. But reinvesting ALL your profits is how businesses collapse. Always keep a cash buffer. The rule of thumb: reinvest 50% of profits, save 30% as a buffer, and take 20% as personal income."
    },
    {
      "type": "business-sim",
      "scenario_id": "expand-your-empire",
      "title": "Expand Your Empire",
      "description": "Your food truck has been crushing it for 6 months. You''ve got $15,000 in the business account. It''s time to make some big decisions about the future of your loaded fries empire.",
      "starting_cash": 15000,
      "decisions": [
        {
          "id": "expansion-strategy",
          "prompt": "How do you expand your business?",
          "options": [
            {"label": "Open a second food truck in a different city", "cost": 12000, "revenue_per_turn": 5000, "risk": 0.18, "explanation": "A second truck means double the revenue potential but also double the costs and complexity. You''ll need to hire someone you trust to run it. If it works, it''s a game-changer."},
            {"label": "Launch a catering arm — corporate events and parties", "cost": 5000, "revenue_per_turn": 3500, "risk": 0.08, "explanation": "Catering uses your existing skills and equipment but targets a higher-paying market. Corporate events can pay $2,000-5,000 per gig. Less risky than a second location."},
            {"label": "Build an online brand — bottled sauces and meal kits", "cost": 3000, "revenue_per_turn": 2000, "risk": 0.05, "explanation": "Product-based revenue that isn''t limited by your physical presence. Lower upfront cost and you can sell nationally. Takes time to build but creates passive income."}
          ]
        },
        {
          "id": "marketing-investment",
          "prompt": "How much do you invest in marketing?",
          "options": [
            {"label": "Go big — $3,000 on professional social media, influencer partnerships, and local ads", "cost": 3000, "revenue_per_turn": 2500, "risk": 0.12, "explanation": "Big marketing spend can supercharge growth but there''s no guarantee it''ll work. Influencer marketing in NZ is hit or miss. Could be your best investment or money down the drain."},
            {"label": "Smart spend — $1,000 on targeted Instagram/TikTok ads and local flyers", "cost": 1000, "revenue_per_turn": 1500, "risk": 0.05, "explanation": "A focused approach that puts money where your customers actually are. TikTok food content does incredibly well in NZ. Good balance of reach and cost."},
            {"label": "Organic only — $0, rely on word of mouth and your own social media", "cost": 0, "revenue_per_turn": 800, "risk": 0.02, "explanation": "Word of mouth is the most powerful marketing and it''s free. But it''s slow. Great if your food speaks for itself, but you might miss out on growth opportunities."}
          ]
        },
        {
          "id": "risk-management",
          "prompt": "How do you protect your business?",
          "options": [
            {"label": "Full insurance package — public liability, equipment, and business interruption", "cost": 2500, "revenue_per_turn": 500, "risk": -0.10, "explanation": "Comprehensive cover means if something goes wrong (fire, injury, equipment failure), you''re protected. Peace of mind has real value. This actually REDUCES your risk."},
            {"label": "Basic insurance — just public liability and equipment", "cost": 1200, "revenue_per_turn": 300, "risk": -0.05, "explanation": "Covers the essentials. If a customer gets sick or your truck breaks down, you''re covered. Not as comprehensive but hits the key risks."},
            {"label": "No insurance — keep the cash, take the risk", "cost": 0, "revenue_per_turn": 0, "risk": 0.15, "explanation": "Saves money short-term but one accident or lawsuit could wipe out everything you''ve built. In food service, this is an especially risky gamble."}
          ]
        }
      ],
      "turns": 4,
      "success_threshold": 25000,
      "xp_bonus": 25
    },
    {
      "type": "tip-box",
      "title": "The Empire Builder''s Mindset",
      "text": "The best entrepreneurs aren''t the ones who take the biggest risks. They''re the ones who take SMART risks. Before every big decision, ask: what''s the best case, worst case, and most likely case? If you can survive the worst case and the most likely case is profitable, go for it."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You''ve gone from entrepreneurial mindset to running and scaling a business. Whether your empire is a food truck, a tutoring service, or the next Xero — you''ve got the foundations. Ka pai rawa atu, future mogul!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 13: Money Confidence Builder
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'money-confidence',
  'Money Confidence Builder',
  'Feel stressed about money? You''re not alone. This gentle module helps you build confidence with your finances — no pressure, just support.',
  '💛',
  'yellow',
  13,
  ARRAY['trade','uni','early-leaver','military','unsure'],
  30,
  500,
  5,
  'explore',
  NULL
);

-- ---------------------------------------------------------------------------
-- Lesson 13.1: Money Anxiety is Normal
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-confidence'),
  'money-anxiety-normal',
  'Money Anxiety is Normal',
  'If money stresses you out, you''re in good company. Let''s talk about why it happens and what you can do about it.',
  1, 6, 100,
  '[
    {
      "type": "heading",
      "text": "Money Anxiety is Normal"
    },
    {
      "type": "text",
      "text": "Let''s start with something important: **if money makes you feel stressed, anxious, or overwhelmed, that''s completely normal.** You''re not bad with money. You''re not broken. You''re just human — and money is genuinely stressful for most people."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "You''re not alone. A 2023 survey by the Financial Services Council found that 62% of New Zealanders aged 18-30 feel stressed about their financial situation. Among teens, the number is even higher. This is a normal response to a genuinely complicated topic."
    },
    {
      "type": "text",
      "text": "**Why does money cause so much anxiety?**\n\n- **Nobody taught us** — Schools barely cover personal finance. Most of us learn about money from our parents'' habits (good or bad), social media, or trial and error.\n- **It''s everywhere** — Rent, food, transport, subscriptions, social pressure... money decisions are constant and unavoidable.\n- **Social comparison** — Seeing mates on social media with new clothes, trips, and gadgets can make you feel like you''re falling behind. But remember: you''re seeing their spending, not their bank balance.\n- **Uncertainty** — Not knowing what''s coming (job loss, unexpected costs) creates a low-level background stress that''s hard to shake."
    },
    {
      "type": "stat-card",
      "label": "NZ youth financial stress",
      "value": "62%",
      "description": "of young New Zealanders aged 18-30 report feeling stressed about money. If you feel it too, you''re in the majority — not the minority."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Common money worries (and some reassurance)",
      "reveal_text": "\"I don''t earn enough\" — You''re starting out. Your income will grow. Focus on the habits, not the numbers right now.\n\n\"I''ll never afford a house\" — The housing market is tough, but it''s not impossible. Many paths lead to homeownership and the landscape changes over time.\n\n\"I''m behind everyone else\" — You''re not. Most people your age are in the same boat. Social media shows highlight reels, not reality.\n\n\"I don''t understand any of this\" — That''s exactly why you''re here. Understanding comes from learning, and you''re doing that right now.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**What money anxiety feels like:**\n\n- Avoiding looking at your bank balance\n- Feeling guilty every time you buy something\n- Worrying about money late at night\n- Comparing yourself to others financially\n- Feeling overwhelmed by financial decisions\n\nIf any of these sound familiar — that''s OK. Recognising it is the first step. You''re already making progress just by being here."
    },
    {
      "type": "mini-quiz",
      "question": "Which of these is the BEST first step when you feel anxious about money?",
      "options": ["Ignore it and hope it goes away", "Compare your situation to friends to see where you stand", "Acknowledge the feeling and take one small action (like checking your balance)", "Make a massive life change immediately"],
      "correct_index": 2,
      "explanation": "Small, gentle steps work best. Acknowledge the anxiety without judging yourself, then take one tiny action. Even just checking your balance is a win. You don''t need to fix everything at once.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "Money anxiety is not a character flaw. It''s your brain trying to protect you from a perceived threat. The antidote isn''t \"just stop worrying\" — it''s building understanding and confidence one small step at a time. That''s exactly what this module is for."
    },
    {
      "type": "tip-box",
      "title": "Your One Thing This Week",
      "text": "Just do one thing: open your banking app and look at your balance. That''s it. No judgement, no action required. Just look. Getting comfortable with seeing your numbers is a huge first step. If you already do this, try looking at your last 5 transactions and noticing how you feel about them."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You showed up. That takes courage. Money anxiety is real, but it doesn''t have to control you. Every lesson in this module is designed to help you feel a little more confident, a little more in control. You''ve got this."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 13.2: Your Money Personality
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-confidence'),
  'your-money-personality',
  'Your Money Personality',
  'Discover your money personality type — and learn that every type has strengths, not just weaknesses.',
  2, 6, 100,
  '[
    {
      "type": "heading",
      "text": "Your Money Personality"
    },
    {
      "type": "text",
      "text": "Everyone has a different relationship with money. There''s no single \"right\" way to handle your finances — but understanding your natural tendencies helps you play to your strengths and watch out for your blind spots."
    },
    {
      "type": "text",
      "text": "**The 4 Money Personality Types:**\n\n**The Spender** — You enjoy using money. Shopping feels good, treating friends feels great, and you live in the moment.\n- Strength: You''re generous, enjoy life, and good at spending on what matters\n- Watch out for: Impulse purchases and not having a safety net\n\n**The Saver** — You love seeing your balance grow. Spending money makes you a bit uncomfortable.\n- Strength: You''re disciplined, future-focused, and naturally build wealth\n- Watch out for: Being too restrictive and not enjoying the money you''ve earned\n\n**The Avoider** — Money stresses you out, so you... just don''t think about it. Bills pile up, you don''t check your balance.\n- Strength: You''re great at living in the moment and not letting money consume your life\n- Watch out for: Surprises. Ignoring money doesn''t make problems go away\n\n**The Dreamer** — You love big ideas and big goals. You''re always thinking about the future — the house, the trip, the business.\n- Strength: You''re visionary, ambitious, and motivated by goals\n- Watch out for: Not having a plan to actually get there"
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Most people are a mix of two types. And your type can change over time! There''s no \"bad\" money personality — each one has real strengths. The key is self-awareness."
    },
    {
      "type": "stat-card",
      "label": "Most common Kiwi money type",
      "value": "Avoider",
      "description": "Research suggests that the most common money personality among young New Zealanders is the Avoider. It makes sense — we''re not taught about money, so we avoid it. But you''re already changing that by being here."
    },
    {
      "type": "mini-quiz",
      "question": "You receive $200 for your birthday. Your first instinct is to:",
      "options": ["Immediately think of something to buy (Spender)", "Transfer it straight to savings (Saver)", "Leave it in your account and not think about it (Avoider)", "Start planning a big goal it could contribute to (Dreamer)"],
      "correct_index": 0,
      "explanation": "There''s no wrong answer here! This question is about self-awareness, not judgement. Whatever your instinct is, that''s your money personality showing. The goal isn''t to change who you are — it''s to understand yourself better so you can make intentional choices.",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**Making your personality work FOR you:**\n\n- **Spenders**: Set up a \"fun money\" account with a set amount. Spend it guilt-free, knowing your savings are sorted separately.\n- **Savers**: Schedule a monthly \"treat yourself\" budget. You''ve earned the right to enjoy your money.\n- **Avoiders**: Automate everything — savings, bills, investments. If it''s automatic, you don''t have to think about it.\n- **Dreamers**: Break big goals into tiny milestones. Instead of \"save $10,000\", start with \"save $100 this month\"."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Why money personalities matter in relationships",
      "reveal_text": "Money is the #1 thing couples argue about in NZ. If you''re a Spender dating a Saver, there will be friction unless you understand each other''s perspective. Same with flatmates — if one person is an Avoider and bills pile up, it affects everyone. Knowing your type (and theirs) makes these conversations so much easier.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Advice for Every Type",
      "text": "No matter your personality: automate your savings (so willpower isn''t required), check your balance at least weekly (awareness reduces anxiety), and have at least one money conversation with someone you trust this month. These three habits work for every personality type."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Now you know your money personality — and more importantly, you know it''s not a flaw. It''s just how you''re wired. Work with it, not against it, and you''ll find managing money gets so much easier."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 13.3: Small Wins Strategy
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-confidence'),
  'small-wins-strategy',
  'Small Wins Strategy',
  'Build money confidence through tiny, achievable actions. Big changes start small.',
  3, 6, 100,
  '[
    {
      "type": "heading",
      "text": "Small Wins Strategy"
    },
    {
      "type": "text",
      "text": "Here''s a secret that financial advisors know but rarely say out loud: **the amount of money you have matters way less than the habits you build.** A person earning $30,000 with great habits will be better off than someone earning $100,000 with terrible habits. And habits are built through small wins."
    },
    {
      "type": "text",
      "text": "**What''s a small win?**\n\nIt''s any tiny financial action that moves you in the right direction. It doesn''t have to be big or impressive. Examples:\n\n- Checking your bank balance (1 minute)\n- Setting up a $5 automatic weekly transfer to savings (2 minutes)\n- Cancelling one subscription you don''t use (3 minutes)\n- Packing lunch instead of buying it — just once (10 minutes)\n- Reading one article about money (5 minutes)\n\nEach small win builds confidence, and confidence builds momentum."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Research from Massey University found that Kiwis who take even one small financial action per week report significantly lower money stress after just 4 weeks. It''s not about the money saved — it''s about feeling in control."
    },
    {
      "type": "stat-card",
      "label": "$5/week for a year",
      "value": "$260",
      "description": "Saving just $5 a week — less than a coffee — adds up to $260 in a year. It''s not about the amount. It''s about proving to yourself that you CAN save. That confidence is priceless."
    },
    {
      "type": "text",
      "text": "**The 7-Day Money Confidence Challenge:**\n\n- **Day 1**: Check your bank balance. Just look. No judgement.\n- **Day 2**: Write down 3 things you spent money on this week. Were they needs or wants?\n- **Day 3**: Find one subscription or recurring payment you can cancel or reduce.\n- **Day 4**: Transfer $1-5 to a savings account (or create one if you don''t have one).\n- **Day 5**: Pack a lunch or make a coffee at home instead of buying one.\n- **Day 6**: Tell someone about one money thing you learned this week.\n- **Day 7**: Check your balance again. Notice how different it feels compared to Day 1."
    },
    {
      "type": "mini-quiz",
      "question": "What''s the most important thing about small financial wins?",
      "options": ["The amount of money you save", "How impressive it looks to others", "The confidence and momentum they build", "That you do them every single day without fail"],
      "correct_index": 2,
      "explanation": "It''s all about momentum. Each small win teaches your brain that you CAN manage money. That confidence is what leads to bigger and better financial decisions over time. Miss a day? No worries — just pick it up again.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these money actions from EASIEST to HARDEST:",
      "items": ["Check your bank balance", "Set up automatic savings", "Create a monthly budget", "Negotiate a better phone plan"],
      "correct_order": ["Check your bank balance", "Set up automatic savings", "Create a monthly budget", "Negotiate a better phone plan"],
      "explanation": "Checking your balance takes 10 seconds. Auto-savings takes 2 minutes to set up. A budget takes 15-30 minutes. Negotiating a phone plan requires research and a phone call — the most effort. Start with the easy ones!",
      "xp_bonus": 20
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: The compound effect of tiny habits",
      "reveal_text": "If you saved $5/week and increased it by just $1 every month, after a year you''d have saved over $450. After two years, over $1,200. This is the compound effect — small, consistent actions that build on each other. The same principle applies to every financial habit. Start tiny, stay consistent, and watch it grow.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Your Small Win Right Now",
      "text": "Before you finish this lesson, do one small thing: open your banking app and check your balance. That''s your small win for today. Done? Amazing. You''re already building momentum. Tomorrow, try the next step in the 7-day challenge."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Every expert was once a beginner. Every big achievement started with a small step. You''re building the foundation right now, one small win at a time. Keep going — you''re doing brilliantly."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 13.4: Exploring Your Options
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-confidence'),
  'exploring-your-options',
  'Exploring Your Options',
  'An overview of career paths, financial implications, and reassurance that it''s completely OK to not have it all figured out.',
  4, 6, 100,
  '[
    {
      "type": "heading",
      "text": "Exploring Your Options"
    },
    {
      "type": "text",
      "text": "One of the biggest sources of money anxiety for young people is the future: **what am I going to do? How will I earn a living? Am I making the right choice?** Deep breath. Let''s talk about this."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Here''s something no one tells you: most adults didn''t have it figured out at your age either. The average person changes careers 5-7 times in their lifetime. Your first choice doesn''t have to be your forever choice. The pressure to \"pick the right path\" at 16 or 17 is honestly unfair."
    },
    {
      "type": "text",
      "text": "**Career paths and what they mean financially:**\n\nEvery path has different financial trade-offs. None of them is \"the best\" — it depends on what matters to you.\n\n- **University** — Higher earning potential long-term, but 3-5 years of study and student loan debt first. Average graduate salary in NZ: $50,000-55,000.\n- **Trades** — Earn while you learn through an apprenticeship. Electricians, plumbers, and builders are in massive demand in NZ. Qualified tradies often earn $70,000-100,000+.\n- **Early employment** — Start earning and building experience right away. Plenty of successful people never went to uni.\n- **Military** — Structured career, good pay, training, and housing support. Starting salary around $50,000 with quick progression.\n- **Not sure yet** — And that''s genuinely fine. Taking a gap year, trying different jobs, or just exploring is a perfectly valid option."
    },
    {
      "type": "stat-card",
      "label": "NZ trades shortage",
      "value": "50,000+",
      "description": "New Zealand needs over 50,000 more tradies in the next decade. Qualified electricians and plumbers can earn $80,000-120,000+. Trades are one of the best-kept financial secrets in NZ."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Salary ranges for different NZ careers",
      "reveal_text": "Here''s a realistic look at NZ salaries (with experience):\n\n- Electrician: $70,000 - $100,000+\n- Software developer: $80,000 - $130,000+\n- Nurse: $55,000 - $85,000\n- Teacher: $55,000 - $90,000\n- Builder/carpenter: $60,000 - $95,000\n- Accountant: $60,000 - $110,000\n- Chef: $45,000 - $70,000\n- Marketing: $50,000 - $90,000\n\nRemember: these are ranges. Your actual earnings depend on experience, location, and how good you are at what you do.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**It''s OK to not know yet.**\n\nSeriously. If you''re reading this thinking \"I have no idea what I want to do\" — that is completely, 100% normal. Here''s what you CAN do right now:\n\n- **Explore** — Try different jobs, volunteer, talk to people in careers that interest you\n- **Build transferable skills** — Communication, teamwork, problem-solving, and basic financial literacy (hey, that''s what you''re doing right now!) work in ANY career\n- **Keep your options open** — Don''t close doors unnecessarily. Stay curious.\n- **Talk to people** — A 15-minute conversation with someone working in a field you''re curious about is worth more than hours of googling"
    },
    {
      "type": "mini-quiz",
      "question": "Which of these statements is TRUE about career choices?",
      "options": ["You have to decide your career path by age 18", "University is the only path to a good income", "Most people change careers 5-7 times in their lifetime", "Once you start a path, you can''t change direction"],
      "correct_index": 2,
      "explanation": "The idea that you pick one career and stick with it forever is outdated. Most people change careers multiple times. Your 20s are for exploring, learning, and figuring out what you enjoy. There''s no rush and no wrong answer.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Free career exploration resources in NZ",
      "reveal_text": "These are all free and really helpful:\n\n- **careers.govt.nz** — The best NZ career exploration tool. Take quizzes, explore industries, check salaries.\n- **Vocational Pathways** — NZQA''s tool for connecting what you''re learning at school to real career options.\n- **MBIE labour market data** — See which jobs are in demand and what they pay.\n- **Your school careers advisor** — They literally get paid to help you figure this stuff out. Use them!\n- **Gateway/STAR programmes** — Free work experience through your school.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Best Career Advice No One Gives",
      "text": "Don''t optimise for the highest salary. Optimise for the intersection of what you''re good at, what you enjoy, and what pays enough to live comfortably. A $120k job you hate will make you miserable. A $65k job you love will make you rich in ways that matter. And you can always upskill later."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Wherever you end up, the financial skills you''re learning right now will serve you. Every career path needs someone who understands money. You''re building that foundation right now, and that''s something to be proud of."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 13.5: Your Safety Net Plan
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'money-confidence'),
  'your-safety-net',
  'Your Safety Net Plan',
  'Build your personal safety net — emergency savings, free NZ resources, and a plan for when life throws curveballs.',
  5, 6, 100,
  '[
    {
      "type": "heading",
      "text": "Your Safety Net Plan"
    },
    {
      "type": "text",
      "text": "Life is unpredictable. Cars break down, phones get dropped in toilets, jobs end unexpectedly, and costs come out of nowhere. A **safety net** is your plan for handling these moments without spiralling into stress or debt. And the good news? You can start building one today — even if you don''t have much money."
    },
    {
      "type": "text",
      "text": "**Your safety net has two parts:**\n\n1. **An emergency fund** — Cash set aside specifically for unexpected expenses. This is your financial cushion.\n2. **A support network** — People and organisations you can turn to when things get tough. You don''t have to figure everything out alone."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The ideal emergency fund is 3 months of expenses. But don''t let that big number put you off. Even $200 is a safety net. Even $50 is better than nothing. Start where you are and build from there. Every dollar in your emergency fund is a dollar of stress you''ve removed from your future."
    },
    {
      "type": "stat-card",
      "label": "Emergency fund starting goal",
      "value": "$500",
      "description": "A $500 emergency fund covers most common surprises — a car repair, a vet bill, a phone replacement, or a week of expenses if work falls through. It''s achievable and life-changing."
    },
    {
      "type": "text",
      "text": "**How to build your emergency fund:**\n\n- **Start with $5-10 per week** — Automatic transfer on payday, separate savings account\n- **Round up your savings** — Some bank apps round up every purchase and save the difference\n- **Redirect windfalls** — Birthday money, tax refunds, unexpected cash — put half into your emergency fund\n- **Cut one thing** — Cancel one subscription or skip one takeaway per week and redirect that money\n- **Don''t touch it** — This money is for EMERGENCIES only. Not sales, not holidays, not \"treats\""
    },
    {
      "type": "mini-quiz",
      "question": "Which of these counts as a legitimate emergency fund expense?",
      "options": ["A 50% off sale at your favourite store", "Your car breaking down and needing repairs to get to work", "A new game that just came out", "A friend''s birthday dinner at a fancy restaurant"],
      "correct_index": 1,
      "explanation": "An emergency is something unexpected that you genuinely NEED to deal with — like a car repair, medical bill, or sudden essential expense. Sales, entertainment, and social events aren''t emergencies, no matter how tempting they are.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to see: Free NZ support when you need financial help",
      "reveal_text": "These are all free and confidential:\n\n- **MoneyTalks** — 0800 345 123 — Free financial helpline. They''ll help you make a plan, deal with debt, and navigate tough situations. No judgement.\n- **Citizens Advice Bureau** — cab.org.nz — Free advice on benefits, rights, and financial problems. Offices in most towns.\n- **Sorted.org.nz** — Free NZ Government financial tools, calculators, and guides. Brilliant resource.\n- **WINZ/Work and Income** — If you''re really struggling, they can help with emergency grants, food parcels, and benefit payments.\n- **Youthline** — 0800 376 633 — Not just for mental health. They help young people with all kinds of stress, including financial.\n- **Community Law Centres** — Free legal advice if you''re dealing with debt collectors, employment issues, or tenancy problems.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "A good starting goal for an emergency fund is $_____ . For free financial help, you can call MoneyTalks on _____ . The website _____ has free NZ government money tools.",
      "blanks": ["500", "0800 345 123", "sorted.org.nz"],
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "If you''re in a tough financial spot right now, please reach out. MoneyTalks (0800 345 123) is free, confidential, and genuinely helpful. There is no shame in asking for help — it''s actually one of the smartest financial moves you can make."
    },
    {
      "type": "tip-box",
      "title": "Your Safety Net Starter Plan",
      "text": "This week, do two things:\n1. Open a separate savings account (or set up a savings goal in your banking app) and label it \"Emergency Fund\". Set up an automatic transfer of $5-10 per week.\n2. Save these numbers in your phone contacts:\n   - MoneyTalks: 0800 345 123\n   - Youthline: 0800 376 633\n   - Citizens Advice: 0800 367 222\nJust having these ready gives you a safety net before you even save a dollar."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You''ve done something incredible — you''ve completed the Money Confidence Builder. You now know that money anxiety is normal, you understand your money personality, you have a small wins strategy, you know your options, and you have a safety net plan. That''s more financial preparation than most adults have. Be proud of yourself. You''ve absolutely got this. Ka pai rawa atu!"
    }
  ]'::jsonb
);
