-- ============================================================================
-- 012_seed_stream_modules.sql
-- Seed 4 stream-specific financial literacy modules (20 lessons total)
-- Streams: trade, uni, early-leaver, military
-- ============================================================================


-- ===========================================================================
-- MODULE 8: Apprentice Money (trade stream)
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'apprentice-money',
  'Apprentice Money',
  'Money skills built for the trades — budgeting on apprentice wages, financing tools, ACC, contracting, and building long-term wealth as a tradie.',
  '🔧',
  'orange',
  8,
  ARRAY['trade'],
  30,
  500,
  5,
  'stream',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 8.1: Budgeting on Apprentice Wages
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'apprentice-money'),
  'budgeting-on-apprentice-wages',
  'Budgeting on Apprentice Wages',
  'Lower pay during training years, living costs while learning, tool expenses, and travel to site costs.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Budgeting on Apprentice Wages"
    },
    {
      "type": "text",
      "text": "Here''s the deal with apprenticeships: the pay is lower while you''re training, but the payoff once you''re qualified is massive. The trick is surviving the lean years without stacking up debt. Let''s figure out how to make apprentice wages actually work."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Most first-year apprentices in NZ earn between $18-$23 per hour depending on the trade and employer. That''s below the average wage, but remember — you''re getting paid to learn a skill that''ll earn you $30-$50+/hr once you''re qualified."
    },
    {
      "type": "text",
      "text": "**The real costs of being an apprentice:**\n\n- **Travel to site** — You might be driving 30-60 minutes each way. Petrol, vehicle costs, or bus fares add up fast\n- **Tools** — Most trades require you to supply your own basic tools. A starter kit can cost $500-$2,000\n- **Work clothes & PPE** — Steel-cap boots ($100-$250), hi-vis, work pants — these wear out and need replacing\n- **Food on site** — No staff kitchen at a building site. Packed lunches save you heaps vs the bakery run\n- **Training costs** — Some block courses require travel and accommodation"
    },
    {
      "type": "stat-card",
      "label": "Average 1st-year apprentice wage",
      "value": "$40,000-$45,000/yr",
      "description": "That''s roughly $700-$800/week after tax. Tight, but manageable with a good budget."
    },
    {
      "type": "text",
      "text": "**A realistic weekly budget on apprentice wages ($750/week take-home):**\n\n- **Board/rent**: $200-$280\n- **Petrol/transport**: $60-$100\n- **Food & groceries**: $80-$100\n- **Phone & subscriptions**: $30-$40\n- **Tool fund**: $20-$30 (save for upcoming tool purchases)\n- **Savings**: $50-$80\n- **Fun money**: $50-$80\n\nIt''s tight but doable — especially if you''re still living at home and paying board instead of full rent."
    },
    {
      "type": "mini-quiz",
      "question": "As a first-year plumbing apprentice earning $750/week take-home, roughly what percentage should you try to save?",
      "options": ["0% — apprentices can''t afford to save", "5-10% ($37-$75)", "50% ($375)", "It depends on your living costs, but aim for at least 10%"],
      "correct_index": 3,
      "explanation": "There''s no one-size-fits-all number, but aiming for at least 10% is a solid goal. If you''re living at home paying minimal board, you can save even more. The key is having SOME savings — even $40/week adds up to $2,000 a year.",
      "xp_bonus": 15
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The apprentice money hack most people miss",
      "reveal_text": "Many employers offer tool allowances ($500-$1,500/year) and vehicle allowances for travel to site. Some pay for your block courses too. ALWAYS ask about these during your interview or review — heaps of apprentices don''t know they exist and miss out on free money.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Save on Commuting Costs",
      "text": "If you''re driving to site, find other apprentices or tradies going the same direction and carpool. Splitting petrol costs 2-3 ways can save you $40-$60/week. That''s over $2,000 a year back in your pocket. Also check if your employer offers a fuel card."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Avoid financing a brand-new ute on apprentice wages. The repayments ($150-$250/week) can eat half your disposable income. A reliable older vehicle gets you to site just the same. We''ll cover ute finance properly in the next lesson."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "The apprenticeship years are temporary — the skills and earning power are permanent. Budget smart now and you''ll be laughing all the way to the bank once you''re qualified. Ka pai!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 8.2: Tools & Ute Finance
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'apprentice-money'),
  'tools-and-ute-finance',
  'Tools & Ute Finance',
  'Financing trade tools, ute loans vs saving, hire purchase traps, insurance for tools, and tool allowances.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Tools & Ute Finance"
    },
    {
      "type": "text",
      "text": "Two of the biggest expenses for any tradie: tools and a vehicle. Getting these right can set you up financially. Getting them wrong can put you in a debt hole before your career even starts. Let''s break it down."
    },
    {
      "type": "text",
      "text": "**Building your tool kit — the smart way:**\n\n- **Start with the essentials** — Buy only what you need for your current stage of training. Don''t splash out on pro-level gear in year one\n- **Quality over quantity** — Good tools last decades. Cheap tools break and cost more in the long run\n- **Buy second-hand** — Trade Me, Facebook Marketplace, and garage sales are goldmines for quality used tools\n- **Use your tool allowance** — If your employer offers one (typically $500-$1,500/yr), use it wisely\n- **Insure your tools** — A full tool kit can be worth $5,000-$20,000+. If they get stolen from your ute, you need cover"
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Hire purchase (HP) from tool trucks is one of the biggest debt traps for apprentices. That $3,000 tool set at $25/week sounds easy — but you''ll pay $4,500+ by the end with interest. Always check the total cost, not just the weekly payment."
    },
    {
      "type": "stat-card",
      "label": "Hire purchase typical interest",
      "value": "18-29% p.a.",
      "description": "A $2,000 tool set on hire purchase at 25% over 2 years costs you $2,550 total — an extra $550 for the privilege of paying weekly."
    },
    {
      "type": "mini-quiz",
      "question": "A tool truck offers a $1,500 kit on hire purchase: $20/week for 2 years. What''s the total cost?",
      "options": ["$1,500", "$1,820", "$2,080", "$2,400"],
      "correct_index": 2,
      "explanation": "$20 x 52 weeks x 2 years = $2,080. That''s $580 more than the cash price. If you saved $20/week instead, you''d have the cash in 75 weeks and save that $580.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**The ute question — NZ''s favourite tradie debate:**\n\n- **New ute** ($55,000-$80,000+): Reliable, warranty, nice to drive. But repayments of $200-$350/week will crush an apprentice budget\n- **Used ute** ($15,000-$30,000): Way more affordable. A 5-7 year old Hilux or Ranger still has plenty of life left\n- **Employer vehicle**: Some employers provide work vehicles. This saves you thousands — always ask!\n- **No ute yet**: If you can get to site without one, delay the purchase until you''re earning qualified rates"
    },
    {
      "type": "sort-order",
      "instruction": "Rank these ute finance options from BEST to WORST for an apprentice:",
      "items": ["Save up and buy a used ute with cash", "Use employer''s work vehicle", "Personal loan from bank at 9%", "Car dealer finance at 15-20%"],
      "correct_order": ["Use employer''s work vehicle", "Save up and buy a used ute with cash", "Personal loan from bank at 9%", "Car dealer finance at 15-20%"],
      "explanation": "An employer vehicle costs you nothing. Cash means no interest. A bank loan has the lowest borrowing rate. Dealer finance usually has the highest rates and sneaky fees — avoid it if you can.",
      "xp_bonus": 20
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "Before buying ANY vehicle on finance, use the sorted.org.nz car calculator to work out the TRUE total cost including interest. A $25,000 ute at 13% over 5 years actually costs you over $33,000."
    },
    {
      "type": "tip-box",
      "title": "Insure Your Tools",
      "text": "Trade tool insurance typically costs $200-$500/year and covers theft, damage, and loss. If your tools get stolen from your ute overnight (happens more than you''d think), you''re covered. Check if your employer''s insurance covers tools on-site, and get your own policy for tools in your vehicle and at home."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Smart tradies build their tool kit and vehicle situation gradually — no need to have the flashest gear on day one. Patience now means financial freedom later."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 8.3: ACC & Contractor Basics
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'apprentice-money'),
  'acc-and-contractor-basics',
  'ACC & Contractor Basics',
  'What ACC covers for tradies, levies, lump-sum vs weekly payments, and the contractor vs employee difference.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "ACC & Contractor Basics"
    },
    {
      "type": "text",
      "text": "Trades are physical jobs, and injuries happen. That''s where ACC (Accident Compensation Corporation) comes in. Every Kiwi is covered by ACC, but as a tradie you need to understand exactly what it does — and doesn''t — cover. Plus, we''ll cover the big question: employee vs contractor."
    },
    {
      "type": "text",
      "text": "**What ACC covers for tradies:**\n\n- **Work injuries** — Fall off scaffolding, nail gun accident, cut yourself on site. ACC covers treatment costs and lost income\n- **Non-work injuries** — Hurt yourself playing rugby on the weekend? Also covered\n- **Treatment costs** — Physio, doctor visits, surgery, prescriptions related to your injury\n- **Weekly compensation** — If you can''t work due to injury, ACC pays 80% of your income (after a week-long stand-down period)\n- **Rehabilitation** — Help getting back to work, including retraining if you can''t return to your trade"
    },
    {
      "type": "callout",
      "style": "info",
      "text": "ACC is NOT health insurance — it only covers injuries from accidents, not illnesses. If you get the flu, that''s your regular healthcare. If you slip on a wet floor at work and break your wrist, that''s ACC."
    },
    {
      "type": "stat-card",
      "label": "ACC weekly compensation",
      "value": "80% of income",
      "description": "If you''re injured and can''t work, ACC pays 80% of your pre-injury earnings after a one-week stand-down. On a $900/week wage, that''s $720/week."
    },
    {
      "type": "mini-quiz",
      "question": "You earn $1,000/week and injure your back on site. After the stand-down period, how much does ACC pay you weekly?",
      "options": ["$500 (50%)", "$800 (80%)", "$1,000 (100%)", "Nothing — you need private insurance"],
      "correct_index": 1,
      "explanation": "ACC pays 80% of your pre-injury income. That''s $800/week on a $1,000 wage. Not your full pay, but enough to cover most bills while you recover.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**ACC levies — what you pay:**\n\n- **Employees**: Your employer pays your ACC levy. It comes out of their pocket, not yours\n- **Self-employed/contractors**: You pay your own ACC levies, invoiced by ACC each year. The rate depends on your trade — higher-risk trades pay more\n- **Typical levy**: Ranges from $0.50 to $3.00+ per $100 of income depending on the industry risk level\n\nThe construction industry has some of the highest ACC levies because of the higher injury risk. Budget for this if you go contracting."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Employee vs Contractor — what''s the difference?",
      "reveal_text": "An EMPLOYEE works set hours for one boss, gets PAYE deducted, gets holiday pay and sick leave, and the employer handles ACC levies.\n\nA CONTRACTOR works for multiple clients, invoices for their work, handles their own tax (including GST and provisional tax), pays their own ACC, and gets no holiday or sick leave.\n\nSome dodgy employers try to call you a ''contractor'' to avoid paying your entitlements. If you work set hours for one company and they control how you work — you''re likely an employee, regardless of what they call you. Contact Employment NZ if this happens.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Watch out for ''sham contracting'' — where an employer calls you a contractor to dodge paying your holiday pay, sick leave, and KiwiSaver. If you work like an employee (set hours, one boss, they provide tools), you''re probably an employee by law. Check with Employment NZ if you''re unsure."
    },
    {
      "type": "tip-box",
      "title": "ACC Claim Tips for Tradies",
      "text": "If you get injured on site: 1) Report it to your employer immediately, 2) See a doctor or visit an urgent care clinic, 3) Tell the doctor it was an accident so they lodge an ACC claim, 4) Keep all receipts for treatment, 5) Follow up with ACC if you need time off work. Don''t tough it out — a small injury that gets worse because you ignored it can become a major problem."
    },
    {
      "type": "fill-blanks",
      "sentence": "ACC pays _____% of your income if you can''t work due to injury. Employees have ACC levies paid by their _____, while contractors pay their _____.",
      "blanks": ["80", "employer", "own"],
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Understanding ACC and the employee vs contractor distinction will protect you throughout your trade career. Knowledge is your best safety gear!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 8.4: Going Solo — Contracting 101
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'apprentice-money'),
  'going-solo-contracting',
  'Going Solo: Contracting 101',
  'GST registration, invoicing basics, setting your hourly rate, and provisional tax for contractors.',
  4, 7, 75,
  '[
    {
      "type": "heading",
      "text": "Going Solo: Contracting 101"
    },
    {
      "type": "text",
      "text": "Lots of qualified tradies eventually go contracting or start their own business. The money can be great — but the financial admin is real. If you''re thinking about going solo one day, here''s what you need to know about the money side."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "You don''t need to go contracting straight away. Most tradies work as employees for a few years after qualifying to build experience and a reputation. But understanding this stuff early means you''ll be ready when the time comes."
    },
    {
      "type": "text",
      "text": "**GST (Goods and Services Tax) — the basics:**\n\n- If your business earns over $60,000/year, you MUST register for GST\n- GST is 15% on top of your services — you charge it to clients and pass it on to IRD\n- You can claim back GST on business expenses (tools, materials, vehicle costs)\n- You file GST returns either monthly, two-monthly, or six-monthly\n- Keep ALL receipts — you need them to claim GST back"
    },
    {
      "type": "text",
      "text": "**Setting your hourly rate as a contractor:**\n\nThis is where most new contractors get it wrong. As an employee earning $35/hr, you might think charging $35/hr as a contractor is the same. It''s NOT. As a contractor you also need to cover:\n\n- GST (15%)\n- ACC levies\n- Your own KiwiSaver\n- Vehicle costs\n- Tool replacement\n- No paid holidays or sick leave\n- Quiet periods with no work\n- Business insurance"
    },
    {
      "type": "stat-card",
      "label": "Contractor rate vs employee rate",
      "value": "$65-$95/hr",
      "description": "A qualified tradie earning $35/hr as an employee typically needs to charge $65-$95/hr as a contractor to take home the same amount after all costs."
    },
    {
      "type": "mini-quiz",
      "question": "You earned $35/hr as an employed electrician. As a contractor, what should your minimum hourly rate be?",
      "options": ["$35/hr — same as before", "$40-$45/hr — just add a bit", "$65-$80/hr — to cover all your own costs", "$150/hr — go big or go home"],
      "correct_index": 2,
      "explanation": "As a contractor you need to cover GST, ACC, no holiday pay, no sick leave, vehicle, tools, insurance, and quiet periods. $65-$80/hr is a realistic minimum to match your old $35/hr employee take-home.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**Provisional tax — paying tax before you owe it:**\n\n- As a contractor, no one deducts PAYE from your pay. You''re responsible for your own income tax\n- IRD wants you to pay tax in instalments throughout the year (provisional tax) — not one huge lump sum\n- You can pay in 3 instalments (August, January, May) based on your estimated income\n- The AIM method lets you pay as you earn via your accounting software — more accurate and less stressful\n- Get an accountant. Seriously. A good one saves you more than they cost"
    },
    {
      "type": "sort-order",
      "instruction": "Put these steps for going contracting in the correct order:",
      "items": ["Get qualified in your trade", "Register for GST with IRD", "Build experience as an employee", "Set your hourly rate covering all costs"],
      "correct_order": ["Get qualified in your trade", "Build experience as an employee", "Set your hourly rate covering all costs", "Register for GST with IRD"],
      "explanation": "First qualify, then build experience and reputation as an employee, then figure out your rate, and finally register for GST when you''re ready to go solo.",
      "xp_bonus": 20
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "The #1 mistake new contractors make: spending their GST money. That 15% you charge on top of your rate belongs to IRD, not you. Open a separate bank account and put all GST straight in there. Do NOT touch it."
    },
    {
      "type": "tip-box",
      "title": "Invoicing 101",
      "text": "Every invoice needs: your name/business name, IRD number, GST number (if registered), invoice number, date, description of work done, hours and rate, GST amount, and total. Use free software like Invoice Ninja or Xero''s free plan to make this easy. Always invoice promptly — late invoicing means late payment."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now know the financial foundations of contracting. When the time comes to go solo, you''ll be ready. For now, focus on getting qualified and building your skills!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 8.5: Trade Career Money Paths
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'apprentice-money'),
  'trade-career-money-paths',
  'Trade Career Money Paths',
  'Qualified tradie salaries by trade, business ownership, property investing on tradie income, and long-term wealth.',
  5, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Trade Career Money Paths"
    },
    {
      "type": "text",
      "text": "Here''s the part where the apprenticeship grind pays off. Qualified tradies in NZ are in massive demand, and the earning potential is seriously good. Let''s look at where a trade career can take you financially."
    },
    {
      "type": "text",
      "text": "**Qualified tradie salaries in NZ (2024/25):**\n\n- **Electrician**: $55,000-$85,000/yr (more with overtime and call-outs)\n- **Plumber/Gasfitter**: $55,000-$90,000/yr\n- **Builder/Carpenter**: $50,000-$80,000/yr\n- **Diesel Mechanic**: $55,000-$85,000/yr\n- **Sparkie (industrial)**: $70,000-$100,000+/yr\n- **Contractor/Self-employed**: $80,000-$150,000+/yr\n\nAnd those figures go UP with experience, specialisation, and overtime."
    },
    {
      "type": "stat-card",
      "label": "Top-earning NZ tradies",
      "value": "$100,000-$150,000+",
      "description": "Experienced contractors, project managers, and tradies with specialist tickets regularly earn six figures in NZ. That''s more than many university graduates."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Tradies have a head start on wealth building. While uni students spend 3-4 years studying and accumulating student debt, apprentices are earning, saving, and building KiwiSaver from age 16-17. That early start compounds massively over time."
    },
    {
      "type": "mini-quiz",
      "question": "A tradie starts KiwiSaver at 17 and a uni grad starts at 22. Both contribute the same amount. Who ends up with more at 65?",
      "options": ["The uni grad — they earn more", "About the same", "The tradie — 5 extra years of compound interest is huge", "Impossible to say"],
      "correct_index": 2,
      "explanation": "Five extra years of compound interest can mean $100,000+ more by retirement. Starting early is one of the biggest advantages tradies have. Time in the market beats almost everything else.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Wealth-building paths for tradies:**\n\n1. **Specialist tickets** — Certifications in areas like gas fitting, restricted electrical, or welding inspection boost your pay\n2. **Own your business** — Move from sole trader to employing others. Your income is no longer capped by your hours\n3. **Property investing** — Tradies can save on renovations and maintenance. Banks love lending to employed tradies with steady income\n4. **Project management** — Step off the tools and manage jobs. Site managers earn $90,000-$130,000+\n5. **Diversify** — Use your trade income to invest in shares, property, or other businesses"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The tradie property advantage",
      "reveal_text": "Tradies have a massive edge in property investing. You can do your own renovations (saving $20,000-$50,000+ on a house flip), spot undervalued properties that need work, and maintain your rentals yourself. Many of NZ''s wealthiest self-made people are tradies who invested in property early.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these trade career progressions by typical income (lowest to highest):",
      "items": ["First-year apprentice", "Qualified employee", "Experienced contractor", "Trade business owner (5+ staff)"],
      "correct_order": ["First-year apprentice", "Qualified employee", "Experienced contractor", "Trade business owner (5+ staff)"],
      "explanation": "Your earning potential grows at every stage. An apprentice might earn $42k, a qualified tradie $65k, an experienced contractor $100k+, and a business owner with staff can earn $150k-$300k+.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Your 10-Year Trade Plan",
      "text": "Years 1-4: Complete apprenticeship, build tool kit, save hard. Years 4-7: Gain experience, get specialist tickets, start contracting or stay employed on higher rates. Years 7-10: Consider starting a business, invest in property, build multiple income streams. The tradies who plan ahead are the ones who end up wealthy."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now have a complete financial roadmap for your trade career — from budgeting as an apprentice to building serious wealth. The tools and knowledge are yours. Ka pai, tradie!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 9: Student Money (uni stream)
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'student-money',
  'Student Money',
  'Navigate student loans, allowances, flat budgets, and working while studying — your complete guide to surviving and thriving financially at uni.',
  '🎓',
  'purple',
  9,
  ARRAY['uni'],
  30,
  500,
  5,
  'stream',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 9.1: Student Loans & Allowances
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'student-money'),
  'student-loans-allowances',
  'Student Loans & Allowances',
  'StudyLink breakdown, loan components, allowances vs loans, and interest-free while in NZ.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Student Loans & Allowances"
    },
    {
      "type": "text",
      "text": "If you''re heading to uni or polytech, chances are you''ll need financial help. StudyLink is the government agency that handles student loans and allowances. Understanding how this works BEFORE you start studying will save you a heap of stress and money."
    },
    {
      "type": "text",
      "text": "**The three parts of a student loan:**\n\n1. **Compulsory fees** — Tuition fees paid directly to your institution. Typically $6,000-$8,000/year for most degrees (up to $15,000+ for some)\n2. **Living costs** — Up to $321.58/week ($16,401.36/year for 51 weeks) borrowed to help you live while studying. This goes into YOUR bank account\n3. **Course-related costs** — Up to $1,000/year for things like textbooks, a laptop, stationery, and course materials\n\nAll three are optional — you only borrow what you need. But most students use all three."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "NZ student loans are interest-free as long as you stay in New Zealand. This is a massive deal — in the US and UK, student loan interest can double the total amount owed. Take advantage of this by staying in NZ after graduating (or at least until it''s paid off)."
    },
    {
      "type": "stat-card",
      "label": "Average NZ student loan debt",
      "value": "$23,000-$30,000",
      "description": "For a 3-year degree. That''s manageable on a graduate salary — about $50-$70/week in repayments."
    },
    {
      "type": "mini-quiz",
      "question": "What''s the interest rate on a NZ student loan while you live in New Zealand?",
      "options": ["5%", "2%", "0% — interest-free!", "It depends on your income"],
      "correct_index": 2,
      "explanation": "NZ student loans are interest-free while you live in NZ. This is one of the best student loan deals in the world. If you move overseas, interest starts at about 3-4% per year — so plan accordingly.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Student Allowance vs Student Loan living costs — what''s the difference?**\n\n- **Student Allowance**: Free money from the government (you don''t pay it back). Up to $321.58/week depending on your situation. But it''s income-tested based on your PARENTS'' income (until you''re 24)\n- **Student Loan living costs**: Same weekly amount, but it''s a LOAN — you pay it back after you graduate\n- **You can get both**: If your allowance is less than $321.58/week, you can top up with loan living costs\n\nAlways apply for the allowance first. Any free money you can get means less debt later."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Hidden StudyLink tips",
      "reveal_text": "1) Apply 4-6 weeks before your course starts — processing takes time. 2) The course-related costs ($1,000/yr) are great for buying a laptop in your first year. 3) If your parents'' income changes, you might become eligible for the allowance mid-year — reapply! 4) You can reduce your living costs amount if you don''t need the full $321.58/week — less borrowing = less debt.",
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Living costs feel like free money landing in your account each week. They''re not. Every dollar you borrow is a dollar you''ll repay from your future salary at 12 cents per dollar over the $24,128 threshold. Only borrow what you actually need."
    },
    {
      "type": "tip-box",
      "title": "Reduce Your Total Debt",
      "text": "If you can work part-time and cover some living costs yourself, reduce your loan living costs amount with StudyLink. Even lowering it by $50/week saves you $2,400/year in debt. Over a 3-year degree, that''s $7,200 less to repay after graduating."
    },
    {
      "type": "fill-blanks",
      "sentence": "A student loan has three parts: compulsory _____, living _____, and course-related _____. The loan is interest-_____ while you live in NZ.",
      "blanks": ["fees", "costs", "costs", "free"],
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand the NZ student finance system better than most first-year students. Apply smart, borrow only what you need, and you''ll graduate with way less debt. Ka pai!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 9.2: Flat Budgeting
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'student-money'),
  'flat-budgeting',
  'Flat Budgeting',
  'Splitting rent, bills, internet, bond requirements, and flatting costs in different NZ cities.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Flat Budgeting"
    },
    {
      "type": "text",
      "text": "Moving into a flat is one of the biggest financial steps you''ll take as a student. Suddenly you''re responsible for rent, power, internet, food, and all the stuff your parents used to handle. Getting your flat budget right is the difference between a chill year and a stressful one."
    },
    {
      "type": "text",
      "text": "**Typical weekly flatting costs by city (per person, 2024/25):**\n\n- **Auckland**: $220-$320/week rent + $40-$60 bills = $260-$380 total\n- **Wellington**: $200-$300/week rent + $40-$55 bills = $240-$355 total\n- **Christchurch**: $160-$240/week rent + $35-$50 bills = $195-$290 total\n- **Dunedin**: $140-$200/week rent + $30-$45 bills = $170-$245 total\n- **Hamilton/Palmerston North**: $150-$220/week rent + $30-$45 bills = $180-$265 total\n\nDunedin and smaller cities are significantly cheaper — something to consider when choosing where to study."
    },
    {
      "type": "stat-card",
      "label": "Average Auckland student rent",
      "value": "$250-$300/week",
      "description": "In Auckland, rent alone can eat 80-90% of your student loan living costs ($321.58/week). That''s why most Auckland students need to work part-time."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Before you move in, you need a BOND — usually 2-4 weeks'' rent upfront. On a $200/week room, that''s $400-$800 you need before you even start paying rent. Plus you''ll need to cover the first week or two of rent in advance. Plan for this!"
    },
    {
      "type": "mini-quiz",
      "question": "Your flat has 4 people. The power bill is $280/month and internet is $90/month. What''s your share per week?",
      "options": ["$18.50/week", "$23.13/week", "$46.25/week", "$92.50/week"],
      "correct_index": 1,
      "explanation": "($280 + $90) / 4 people = $92.50/month each. $92.50 x 12 / 52 = $21.35/week, or roughly $23/week when you round up for fluctuations. Always budget slightly over to be safe.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**How to split bills fairly:**\n\n- **Rent**: Split evenly, OR adjust for room size (bigger room pays more). Agree this BEFORE moving in\n- **Power**: Split evenly. Use Powershop, Electric Kiwi, or Flick for cheaper rates. Turn off heaters when you leave\n- **Internet**: Split evenly. One person pays, others reimburse. Set up automatic payments\n- **Groceries**: Two options — either buy communal basics together (milk, bread, butter) and split, or go fully separate. Decide upfront\n- **Household supplies**: Toilet paper, cleaning products, dish soap — keep a kitty (everyone puts in $5/week)"
    },
    {
      "type": "sort-order",
      "instruction": "Order these NZ cities from CHEAPEST to MOST EXPENSIVE for student rent:",
      "items": ["Dunedin", "Christchurch", "Wellington", "Auckland"],
      "correct_order": ["Dunedin", "Christchurch", "Wellington", "Auckland"],
      "explanation": "Dunedin is the cheapest main university city for rent, followed by Christchurch, then Wellington, and Auckland is the most expensive by far.",
      "xp_bonus": 20
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: How to get your bond back",
      "reveal_text": "Your bond is lodged with Tenancy Services (not your landlord). To get it back when you leave: 1) Clean the flat thoroughly — better than when you moved in, 2) Fix any damage you caused, 3) Take photos of everything on move-out day, 4) Both you and the landlord sign a bond refund form. If the landlord tries to keep your bond unfairly, you can apply to the Tenancy Tribunal for free.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Flat Money Rules",
      "text": "Set these up from day one: 1) One flat bank account for bills — everyone auto-pays their share into it weekly, 2) A shared spreadsheet tracking who paid what, 3) A house meeting once a month to sort any money issues, 4) Written agreement on how you split costs. It sounds over the top, but it prevents 90% of flat dramas."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Flatting is an amazing crash course in real-world budgeting. Get it right from the start and it''ll be one of the best experiences of your student years!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 9.3: Surviving on a Student Budget
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'student-money'),
  'surviving-student-budget',
  'Surviving on a Student Budget',
  'Cheap eats, student discounts, free stuff at uni, meal prepping, sharing subscriptions, and op shopping.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Surviving on a Student Budget"
    },
    {
      "type": "text",
      "text": "Student life is famously broke — but it doesn''t have to be miserable. There are heaps of ways to stretch your dollars further and still have a good time. Here are the money hacks that experienced students swear by."
    },
    {
      "type": "text",
      "text": "**Food — your biggest controllable expense:**\n\n- **Meal prepping** is the single biggest money saver. Cook a big batch on Sunday — curries, stir-fries, pasta bakes — and eat all week. Cost: $5-$8 per meal vs $12-$18 buying lunch\n- **PAK''nSAVE over Countdown/New World** — Seriously, the price difference is 15-25% on the same groceries\n- **Buy in bulk** — Rice, oats, pasta, frozen veges, canned goods. Split bulk buys with flatmates\n- **Reduced sticker hunting** — Most supermarkets mark down food near its use-by date. Go shopping in the evening for the best deals\n- **Eat before you go out** — Pre-drinking and pre-eating saves a fortune on town nights"
    },
    {
      "type": "stat-card",
      "label": "Meal prep vs buying lunch",
      "value": "$3,000+/yr saved",
      "description": "Packing lunch 5 days a week instead of buying saves roughly $50-$70/week. That''s $2,600-$3,600 per year — almost a semester''s rent in Dunedin."
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "Get your student ID sorted in week one. It unlocks discounts at cinemas, restaurants, retailers, transport, and tech stores. Apple and Spotify both offer massive student discounts. A Spotify Student plan includes Spotify Premium for $8.49/month instead of $16.99."
    },
    {
      "type": "mini-quiz",
      "question": "Which of these is NOT typically free for university students?",
      "options": ["The campus gym", "Microsoft Office 365", "Counselling services", "Textbooks"],
      "correct_index": 3,
      "explanation": "Most unis offer free gym access, free Microsoft Office, and free counselling. Textbooks, however, are NOT free and can cost $100-$300 each. Check the library for free copies, buy second-hand, or find PDF versions through your uni''s online resources.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Free stuff at uni that students don''t use enough:**\n\n- **Library** — Textbooks, quiet study spaces, free printing (often a set amount per semester)\n- **Campus gym** — Included in your fees at most unis. No need for a Les Mills membership\n- **Counselling & wellbeing** — Free and confidential. Mental health support included in your fees\n- **Career services** — Free CV reviews, interview prep, and job connections\n- **Software** — Microsoft Office, Adobe Creative Cloud (some unis), MATLAB, SPSS — all free while you''re enrolled\n- **Hardship funds** — Most unis have emergency grants if you''re genuinely struggling financially"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The subscription sharing hack",
      "reveal_text": "Share subscriptions with flatmates and split the cost: Netflix Standard ($23.99 / 2 people = $12/each), Spotify Duo or Family ($10-$4.50/each), Disney+ ($17.99 / 4 = $4.50/each). That''s about $20/month instead of $60+. Just make sure you''re sharing with people you trust!",
      "xp_bonus": 10
    },
    {
      "type": "text",
      "text": "**More money-saving hacks:**\n\n- **Op shops** — Seriously, the Salvation Army, Hospice, and SPCA shops have amazing clothes for $5-$15. It''s also better for the planet\n- **Student deals apps** — Download StudentCard NZ, UNiDAYS, and Student Beans for ongoing discounts\n- **Transport** — Get a student bus/train pass. In many cities, it''s 50% off regular fares\n- **Entertainment** — Free events on campus, cheap Tuesday movies, BYO restaurants, potluck dinners with mates\n- **Buy nothing groups** — Facebook groups where people give away free stuff. Furniture, kitchenware, textbooks — absolute goldmine when setting up a flat"
    },
    {
      "type": "fill-blanks",
      "sentence": "Meal _____ can save over $3,000 per year. Always shop at _____ for the cheapest groceries. Check your uni''s _____ fund if you''re struggling financially.",
      "blanks": ["prepping", "PAK''nSAVE", "hardship"],
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Student Budget Formula",
      "text": "After rent and bills, aim to live on $80-$120/week for everything else (food, transport, fun). It''s tight but doable with meal prepping and student discounts. Track every dollar for your first month to see where it actually goes."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Being resourceful with money is a life skill that''ll serve you long after uni. Plus, there''s something satisfying about living well on less. You''ve got this!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 9.4: Working While Studying
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'student-money'),
  'working-while-studying',
  'Working While Studying',
  'Balancing hours and grades, tax codes for students with loans, campus jobs, holiday work, and tutoring income.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Working While Studying"
    },
    {
      "type": "text",
      "text": "Most NZ students work part-time while studying — it''s almost a necessity, especially in Auckland and Wellington where the cost of living is high. But balancing work and study is an art. Get it right and you''ll graduate with less debt and actual work experience."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Research suggests that working 10-15 hours per week while studying full-time doesn''t hurt your grades — and can actually improve time management skills. But going over 20 hours/week often leads to lower grades and more stress."
    },
    {
      "type": "text",
      "text": "**Best jobs for students:**\n\n- **Campus jobs** — Library assistant, lab demonstrator, student ambassador. Flexible hours, understanding bosses, and no commute\n- **Hospitality** — Cafes, bars, restaurants. Weekend and evening shifts fit around classes\n- **Tutoring** — Tutor first-year papers you aced. Pays $25-$45/hr and reinforces your own knowledge\n- **Retail** — Consistent hours, often with employee discounts\n- **Holiday work** — Go hard during semester breaks. Summer jobs can fund an entire semester"
    },
    {
      "type": "stat-card",
      "label": "10 hours/week at minimum wage",
      "value": "$200+/week",
      "description": "Working just 10 hours/week at $23.15/hr gives you roughly $200/week after tax — enough to significantly reduce your loan living costs."
    },
    {
      "type": "mini-quiz",
      "question": "You''re a full-time student with a student loan and a part-time job. What tax code should you use?",
      "options": ["M", "ME", "S", "SL"],
      "correct_index": 1,
      "explanation": "ME is for your main job when you have a student loan. The ''E'' stands for the student loan deduction. This ensures 12% of income over the threshold goes to your loan repayment. If you have a second job, use SE.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Tax tips for working students:**\n\n- **Tax code ME** — Use this if you have a student loan and this is your main/only job\n- **Loan repayments kick in** at 12% on every dollar earned over $24,128/year ($464/week). Part-time students usually stay under this\n- **End of year tax refund** — If you only worked part of the year (just during semester breaks), you might have been over-taxed. Check myIR after 31 March for an automatic refund\n- **Side hustle income** — Tutoring, selling on Trade Me, freelancing — all taxable. Declare it to IRD"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The holiday work strategy",
      "reveal_text": "The smartest student money move: work as many hours as possible during the 3-4 month summer break and save aggressively. Many students earn $5,000-$10,000 over summer. Bank that money and use it to reduce your loan living costs during the semester. Some students fund their entire semester this way and graduate with significantly less debt.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "If your grades are suffering because of work, it''s time to reassess. A failed paper costs you $800-$1,500 in fees and a semester of time. That''s way more expensive than the shifts you worked. Study comes first — that''s what you''re paying for."
    },
    {
      "type": "sort-order",
      "instruction": "Rank these student income sources from highest potential hourly rate to lowest:",
      "items": ["Tutoring NCEA/first-year papers", "Retail (part-time)", "Campus library assistant", "Holiday full-time work"],
      "correct_order": ["Tutoring NCEA/first-year papers", "Holiday full-time work", "Retail (part-time)", "Campus library assistant"],
      "explanation": "Tutoring can pay $25-$45/hr. Holiday work varies but often includes overtime. Retail and campus jobs tend to be closer to minimum wage, though campus jobs offer better flexibility.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "The Ideal Student Work Schedule",
      "text": "Aim for 10-15 hours per week during semester, ideally on weekends or evenings that don''t clash with lectures. Use a calendar to block out study, class, and work time. Treat your degree like a full-time job (40hrs/week of class + study) and fit work around it, not the other way around."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Working while studying builds both your bank account and your CV. Employers love graduates who can demonstrate they balanced multiple responsibilities. You''re building two assets at once!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 9.5: Postgrad ROI
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'student-money'),
  'postgrad-roi',
  'Postgrad ROI',
  'Is a masters worth it, salary premiums by field, loan repayment reality, and industry entry vs further study.',
  5, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Postgrad ROI — Is Further Study Worth It?"
    },
    {
      "type": "text",
      "text": "ROI means Return On Investment. When it comes to postgrad study, the question is simple: will the extra time, fees, and delayed earnings actually pay off? The honest answer is — it depends entirely on what you study and what field you''re in."
    },
    {
      "type": "text",
      "text": "**Where postgrad study has a clear financial payoff:**\n\n- **Medicine/Dentistry** — You literally can''t practise without the qualification. Salary: $100,000-$300,000+\n- **Law (LLB + Profs)** — Professional qualification required. Starting salary: $55,000-$75,000, senior: $150,000+\n- **Engineering (with Masters)** — Salary premium of $10,000-$20,000 over bachelor''s grads\n- **Clinical Psychology** — Postgrad required. Salary: $80,000-$130,000\n- **Data Science/AI** — Masters grads are in huge demand. Salary: $80,000-$140,000\n\n**Where postgrad has less financial payoff:**\n\n- **Arts/Humanities MA** — Unless you want to be an academic, the salary premium is minimal\n- **MBA straight out of undergrad** — Most valuable with 5+ years work experience first\n- **Any field where experience matters more than qualifications**"
    },
    {
      "type": "stat-card",
      "label": "NZ Masters salary premium",
      "value": "$10,000-$25,000/yr",
      "description": "On average, a Masters graduate earns $10,000-$25,000 more per year than a Bachelor''s grad — but this varies wildly by field. In some areas, the premium is near zero."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "A Masters degree adds 1-2 years of study and $15,000-$35,000 in extra fees and living costs. If the salary premium in your field is only $5,000/year, it''ll take 3-7 years just to break even. Run the numbers BEFORE enrolling."
    },
    {
      "type": "mini-quiz",
      "question": "A Masters costs $30,000 extra (fees + lost income). The salary premium is $10,000/year. How long to break even?",
      "options": ["1 year", "3 years", "5 years", "You never break even"],
      "correct_index": 1,
      "explanation": "$30,000 cost / $10,000 per year premium = 3 years to break even. After that, the extra $10k/year is pure benefit. But remember — this only works if your field actually has a salary premium for postgrad.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Loan repayment reality after graduation:**\n\n- Repayments are 12% of every dollar over $24,128/year\n- On a $55,000 graduate salary: ~$70/week in loan repayments\n- On a $75,000 salary: ~$117/week\n- A typical $25,000 student loan takes about 5-8 years to repay\n- A $40,000 loan (with postgrad): about 7-12 years\n\nLoan repayments are automatic through your employer (like PAYE). You don''t even see the money — it just comes off your pay."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: Alternatives to postgrad study",
      "reveal_text": "Before committing to postgrad, consider these alternatives: 1) Enter industry and let your employer fund further study part-time (many NZ companies do this), 2) Professional certifications — often faster and cheaper than a full degree, 3) Graduate programmes — structured entry with on-the-job training at major NZ companies, 4) Work overseas for 1-2 years — international experience is often valued as much as a postgrad degree.",
      "xp_bonus": 15
    },
    {
      "type": "fill-blanks",
      "sentence": "ROI stands for Return On _____. Student loan repayments are _____% of income over $24,128. Always consider the _____ premium of postgrad before enrolling.",
      "blanks": ["Investment", "12", "salary"],
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "The Postgrad Decision Framework",
      "text": "Ask yourself these 4 questions: 1) Is postgrad REQUIRED for my career? (If yes, do it), 2) What''s the salary premium in my specific field? 3) Can I get the same outcome through work experience or professional certs? 4) Am I doing postgrad because I love the subject, or because I''m avoiding the real world? Be honest with yourself."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You now have a full financial toolkit for uni life — from loans and allowances to flat budgets, working while studying, and making smart decisions about further study. Go crush it, scholar!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 10: First Paycheck Life (early-leaver stream)
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'first-paycheck-life',
  'First Paycheck Life',
  'Going straight into full-time work? Navigate your first paycheck, renting, bills, career paths without uni, and building wealth early.',
  '💵',
  'green',
  10,
  ARRAY['early-leaver'],
  30,
  500,
  5,
  'stream',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 10.1: Your First Full-Time Paycheck
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'first-paycheck-life'),
  'first-full-time-paycheck',
  'Your First Full-Time Paycheck',
  'Understanding full-time deductions, KiwiSaver + tax + ACC, budgeting on real wages, and a payslip walkthrough.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Your First Full-Time Paycheck"
    },
    {
      "type": "text",
      "text": "Congrats — you''re earning a full-time wage! Whether it''s retail, hospitality, a call centre, or any other entry-level role, that first proper paycheck is a big milestone. But it''s also the moment where a lot of young Kiwis get confused by deductions. Let''s sort that out."
    },
    {
      "type": "text",
      "text": "**Full-time payslip walkthrough — where your money goes:**\n\nSay you''re earning $23.15/hr, 40 hours/week:\n\n- **Gross weekly pay**: $926.00\n- **PAYE tax**: -$131.46 (based on M tax code)\n- **ACC earner levy**: -$13.24\n- **KiwiSaver (3%)**: -$27.78\n- **Net pay (take-home)**: ~$753.52\n\nThat''s about $172 in deductions. Feels like a lot, but most of it is working for you — tax funds public services you use, KiwiSaver is saving for YOUR future, and ACC covers you if you get injured."
    },
    {
      "type": "stat-card",
      "label": "Full-time minimum wage (40hrs)",
      "value": "$753/week take-home",
      "description": "That''s roughly $39,000/year after tax and deductions. A solid starting point to build from."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "Your KiwiSaver deduction isn''t money lost — it''s money saved. Plus your employer adds another 3% on top. On $926/week gross, that''s an extra $27.78/week your employer puts in for you. Free money!"
    },
    {
      "type": "mini-quiz",
      "question": "On a $926/week gross pay, approximately how much lands in your bank account?",
      "options": ["$926 — you get the full amount", "$850 — just a bit comes off", "$753 — about 81% of gross", "$500 — half goes to tax"],
      "correct_index": 2,
      "explanation": "After PAYE, ACC levy, and KiwiSaver, you take home about 81% of your gross pay. That''s normal. The rest is tax (for public services) and KiwiSaver (for your future).",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Budgeting on a full-time minimum wage ($753/week):**\n\n- **Rent/board**: $200-$280 (26-37%)\n- **Groceries & food**: $80-$120 (11-16%)\n- **Transport**: $40-$80 (5-11%)\n- **Phone & internet**: $25-$40 (3-5%)\n- **Savings**: $75-$100 (10-13%)\n- **Fun & personal**: $60-$100 (8-13%)\n- **Buffer/unexpected**: $30-$50 (4-7%)\n\nIt''s tight in Auckland but very doable in smaller cities. The key is setting up your budget BEFORE your first payday."
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The pay rise you can give yourself",
      "reveal_text": "By setting up automatic transfers on payday — rent to landlord, savings to savings account, bills money to bills account — you remove the temptation to overspend. It''s like giving yourself a forced pay rise because the money you save actually stays saved. Set this up in your banking app on day one.",
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Lifestyle creep is REAL. When you start earning full-time, it''s tempting to upgrade everything — new clothes, eating out more, better phone plan. Try to keep your expenses close to what they were before and bank the difference for the first 3 months. Build your safety net first."
    },
    {
      "type": "tip-box",
      "title": "First Paycheck Action Plan",
      "text": "Week 1 of your new job: 1) Check your payslip matches your employment agreement, 2) Set up automatic savings transfer, 3) Set up a separate bills account, 4) Confirm your KiwiSaver is active and at 3% minimum, 5) Log into myIR to check your tax code is correct (should be M for your main job)."
    },
    {
      "type": "fill-blanks",
      "sentence": "Gross pay minus PAYE, ACC levy, and _____ equals your net take-home pay. At minimum wage full-time, you take home roughly $_____/week.",
      "blanks": ["KiwiSaver", "753"],
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand exactly where every dollar of your paycheck goes. No more surprises on payday. Knowledge is power — and in this case, knowledge is money!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 10.2: Renting Basics
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'first-paycheck-life'),
  'renting-basics',
  'Renting Basics',
  'Bond, tenancy agreements, Tenancy Tribunal, flatting rights, what landlords can and cannot do, and getting your bond back.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Renting Basics"
    },
    {
      "type": "text",
      "text": "Moving out of home is exciting but also a minefield of costs and rights you need to know about. Whether you''re flatting with mates or renting solo, understanding tenancy law in NZ protects your money and your sanity."
    },
    {
      "type": "text",
      "text": "**The costs of moving into a rental:**\n\n- **Bond**: Maximum 4 weeks'' rent. On $300/week rent, that''s up to $1,200 upfront\n- **Rent in advance**: Usually 1-2 weeks paid before you move in\n- **Letting fee**: Banned in NZ since December 2018 — landlords can''t charge you one\n- **Moving costs**: Van hire, boxes, cleaning supplies — budget $200-$500\n- **Setting up**: Bedding, kitchenware, cleaning products if it''s your first flat — $300-$800\n\nTotal to move in: $2,000-$3,500. Start saving for this well before you plan to move out."
    },
    {
      "type": "stat-card",
      "label": "Average NZ weekly rent (2025)",
      "value": "$550-$600",
      "description": "The national median is around $580/week for a whole property. For a room in a flat, expect $180-$320/week depending on the city."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "Your bond MUST be lodged with Tenancy Services within 23 working days. If your landlord keeps it themselves instead of lodging it, that''s illegal. You can check if your bond is lodged at tenancy.govt.nz."
    },
    {
      "type": "mini-quiz",
      "question": "Your landlord wants to inspect the property. How much notice must they give you?",
      "options": ["They can come anytime — it''s their property", "24 hours", "48 hours (2 working days)", "1 week"],
      "correct_index": 2,
      "explanation": "Landlords must give at least 48 hours'' (2 working days'') written notice before an inspection. They can only inspect between 8am and 7pm, and no more than once every 4 weeks. It''s YOUR home — they can''t just rock up.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Your rights as a tenant:**\n\n- **Quiet enjoyment** — The landlord can''t harass you, enter without notice, or interfere with your use of the property\n- **Repairs** — The landlord must maintain the property in a reasonable condition and fix things promptly\n- **Healthy homes** — Rental properties must meet insulation, heating, ventilation, moisture, and drainage standards\n- **No unfair rent increases** — Rent can only be increased once every 12 months with 60 days'' written notice\n- **Flatmate disputes** — If a flatmate leaves, the landlord can''t make you cover their share (unless you signed a joint tenancy)"
    },
    {
      "type": "text",
      "text": "**Things your landlord CANNOT do:**\n\n- Enter without 48 hours'' notice (except genuine emergencies)\n- Raise rent more than once a year\n- Charge a letting fee\n- Ask for more than 4 weeks'' bond\n- Evict you without proper legal process\n- Withhold your bond without your agreement or a Tenancy Tribunal order\n- Discriminate against you based on age, ethnicity, gender, or having children"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What is the Tenancy Tribunal?",
      "reveal_text": "The Tenancy Tribunal is a government service that resolves disputes between tenants and landlords. It''s quick, cheap (filing fee is $20.44), and you don''t need a lawyer. Common issues: bond disputes, repairs not being done, illegal rent increases, or unfair eviction. Apply online at tenancy.govt.nz. It''s there to protect you — don''t be afraid to use it.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Put these moving-in steps in the correct order:",
      "items": ["Sign tenancy agreement", "Save for bond + moving costs", "Take photos of everything on move-in day", "Check bond is lodged with Tenancy Services"],
      "correct_order": ["Save for bond + moving costs", "Sign tenancy agreement", "Take photos of everything on move-in day", "Check bond is lodged with Tenancy Services"],
      "explanation": "Save first, then sign the agreement, photograph any existing damage on move-in day (critical for getting your bond back later), and then verify the bond was properly lodged.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Getting Your Full Bond Back",
      "text": "When moving out: 1) Give proper notice (21 days for periodic, or as per fixed term), 2) Clean EVERYTHING — oven, walls, carpets, windows, 3) Fix any damage you caused, 4) Take dated photos of every room, 5) Do a final inspection with the landlord, 6) Complete the bond refund form together. If the landlord unfairly withholds bond, apply to the Tenancy Tribunal."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Knowing your rights as a tenant is worth hundreds, even thousands of dollars. You''re now equipped to rent with confidence and stand up for yourself if things go wrong."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 10.3: Bills & Utilities
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'first-paycheck-life'),
  'bills-and-utilities',
  'Bills & Utilities',
  'Power, internet, phone plans — what to expect monthly in NZ, comparing providers, and splitting bills fairly.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Bills & Utilities"
    },
    {
      "type": "text",
      "text": "Welcome to adulting — where you actually have to pay for electricity, internet, and phone plans yourself. The good news is that once you understand what''s normal and how to compare providers, you can save hundreds a year without changing your lifestyle."
    },
    {
      "type": "text",
      "text": "**What to expect monthly in a NZ flat (shared between 3-4 people):**\n\n- **Electricity**: $150-$350/month total (higher in winter with heating). Your share: $40-$90/month\n- **Internet**: $75-$100/month total. Your share: $20-$30/month\n- **Water**: Often included in rent, but some areas charge separately ($30-$60/month total)\n- **Gas** (if connected): $50-$120/month total. Your share: $15-$30/month\n- **Contents insurance**: $15-$30/month per person (optional but smart)\n\nTotal per person: roughly $100-$180/month for all utilities."
    },
    {
      "type": "stat-card",
      "label": "Average NZ power bill",
      "value": "$200-$250/month",
      "description": "For a 3-bedroom flat. In winter it can spike to $350+ with heating. Electric blankets and heat pumps are way cheaper than portable heaters."
    },
    {
      "type": "callout",
      "style": "tip",
      "text": "Use Powerswitch (powerswitch.org.nz) to compare electricity providers. Switching can save $200-$500 per year on the exact same electricity. It takes 10 minutes and the new provider handles the changeover."
    },
    {
      "type": "mini-quiz",
      "question": "Which appliance typically uses the MOST electricity in a NZ home?",
      "options": ["The TV", "The fridge", "A portable electric heater", "The washing machine"],
      "correct_index": 2,
      "explanation": "Portable electric heaters (fan heaters, oil columns) are electricity guzzlers. A single 2kW heater running 5 hours a day costs about $3/day — that''s $90/month from ONE heater. Heat pumps are 3x more efficient.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Phone plans — cutting through the marketing:**\n\n- **Prepay vs postpay**: Prepay means you pay upfront and can''t overspend. Postpay bills you monthly and it''s easy to rack up charges\n- **Best value NZ providers**: Skinny, Warehouse Mobile, and Kogan Mobile often beat Spark, Vodafone, and One NZ on price for the same network coverage\n- **How much data do you actually need?** Most people use 3-8GB/month if they have WiFi at home. Don''t pay for 40GB if you use 5GB\n- **Don''t finance a phone through your plan** — You''ll pay hundreds more over 24 months. Buy outright or get a refurbished phone"
    },
    {
      "type": "text",
      "text": "**Internet — what speed do you actually need?**\n\n- **Fibre 100/20**: Good enough for most flats (streaming, gaming, general use). $65-$85/month\n- **Fibre 300/100**: Great if you have 4+ people streaming and gaming simultaneously. $80-$100/month\n- **Fibre Max (900+)**: Overkill for most homes. Save your money unless you''re serious about gaming or content creation\n- **Compare providers** at broadbandcompare.co.nz — same fibre, different prices"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: 5 ways to slash your power bill",
      "reveal_text": "1) Switch to LED bulbs (use 80% less power than old bulbs), 2) Use a heat pump instead of portable heaters, 3) Wash clothes in cold water (most of the energy goes to heating), 4) Turn off appliances at the wall — standby power costs $50-$100/year, 5) Shower for 5 minutes instead of 10 — saves on both water heating AND water bills.",
      "xp_bonus": 10
    },
    {
      "type": "sort-order",
      "instruction": "Rank these monthly expenses from MOST expensive to LEAST for a typical NZ flat (total):",
      "items": ["Electricity", "Internet", "Contents insurance", "Water"],
      "correct_order": ["Electricity", "Internet", "Water", "Contents insurance"],
      "explanation": "Electricity is usually the biggest utility bill ($200-$350/month), followed by internet ($75-$100), water ($30-$60 where charged), and contents insurance ($15-$30/person).",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Bills Setup Checklist",
      "text": "When moving into a new flat: 1) Set up power BEFORE move-in day (takes 1-2 days), 2) Compare providers on Powerswitch first, 3) Set up internet (can take 1-2 weeks for new connections), 4) Create a flat bills account — everyone auto-pays their share weekly, 5) Put one person''s name on each bill and share responsibility."
    },
    {
      "type": "fill-blanks",
      "sentence": "Use _____ to compare electricity providers. A heat pump is _____ times more efficient than a portable heater. Check broadbandcompare.co.nz for _____ deals.",
      "blanks": ["Powerswitch", "3", "internet"],
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now know what bills to expect, how to compare providers, and how to keep costs down. That knowledge will save you thousands over your lifetime. Savvy!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 10.4: Career Money Paths Without Uni
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'first-paycheck-life'),
  'career-money-paths',
  'Career Money Paths Without Uni',
  'Upskilling without uni, on-the-job training, industry certs, NZQA micro-credentials, and apprenticeship pathways.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Career Money Paths Without Uni"
    },
    {
      "type": "text",
      "text": "Let''s get one thing straight: not going to uni does NOT limit your earning potential. Some of the highest-earning and most successful people in NZ don''t have degrees. What matters is building skills, gaining experience, and being strategic about your career. Here''s how."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "In NZ, 60% of jobs don''t require a university degree. Industries like construction, hospitality, tech, logistics, retail management, and public services all offer strong career paths through on-the-job training and industry certifications."
    },
    {
      "type": "text",
      "text": "**Pathways to higher income without a degree:**\n\n1. **Apprenticeships** — Earn while you learn a trade. After 3-4 years you''re qualified with zero student debt and earning $55,000-$90,000+\n2. **Industry certifications** — Forklift licence ($300), first aid ($200), site safety ($150-$400), barista course ($200). Quick to get, boost your pay immediately\n3. **NZQA micro-credentials** — Short, recognised qualifications in specific skills. Growing rapidly in NZ\n4. **On-the-job training** — Many employers train and promote from within. Retail assistant to store manager. Kitchen hand to sous chef\n5. **Government jobs** — Corrections, Police, Fire Service, Council roles often don''t require degrees and have excellent pay and benefits"
    },
    {
      "type": "stat-card",
      "label": "NZ Police starting salary",
      "value": "$66,000-$72,000",
      "description": "No degree required. Full training provided. Plus benefits like subsidised housing, health insurance, and a defined benefit super scheme."
    },
    {
      "type": "mini-quiz",
      "question": "Which of these careers does NOT typically require a university degree in NZ?",
      "options": ["Doctor", "Software developer", "Lawyer", "Pharmacist"],
      "correct_index": 1,
      "explanation": "Many successful software developers are self-taught or completed bootcamps and short courses. Tech companies often care more about your portfolio and skills than a degree. Dev Academy in NZ offers a 15-week bootcamp that leads to developer jobs paying $55,000-$75,000.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**High-earning careers you can enter without a degree:**\n\n- **Real estate agent**: Average $70,000-$120,000+/yr (commission-based)\n- **Recruitment consultant**: $55,000-$100,000+/yr\n- **Insurance broker**: $60,000-$90,000/yr\n- **Tech (dev, UX, data)**: $55,000-$130,000/yr with bootcamp or self-teaching\n- **Sales roles**: $50,000-$120,000+/yr with commission\n- **Transport/logistics**: $55,000-$85,000/yr (truck drivers are in huge demand)\n- **Project management**: $70,000-$120,000/yr with experience and certifications"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The experience > degree hack",
      "reveal_text": "Here''s a strategy that works: enter a company at entry level, work hard, ask for more responsibility, upskill on the job, and get promoted. After 3-5 years you''ll have a track record that beats a fresh graduate''s degree. Many companies also offer to pay for your further education once you''re working there — you get the qualification AND the pay AND no student debt.",
      "xp_bonus": 15
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "The one trap to avoid: staying in a minimum-wage job with no growth path. If your current role has no opportunity to learn new skills or advance, it''s time to look for one that does. Always be moving towards higher-value skills."
    },
    {
      "type": "sort-order",
      "instruction": "Put these upskilling options in order from quickest to complete to longest:",
      "items": ["Forklift licence (2 days)", "NZQA micro-credential (4-12 weeks)", "Industry certification like real estate (3-6 months)", "Full apprenticeship (3-4 years)"],
      "correct_order": ["Forklift licence (2 days)", "NZQA micro-credential (4-12 weeks)", "Industry certification like real estate (3-6 months)", "Full apprenticeship (3-4 years)"],
      "explanation": "You can start upskilling immediately with quick certifications and build up to bigger qualifications over time. Each step boosts your earning potential.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Your Career Growth Plan",
      "text": "Every 6 months, ask yourself: 1) Am I learning new skills in my current role? 2) Is there a clear path to earn more? 3) What certification could I get that would boost my pay? 4) Who in my industry earns what I want to earn, and what path did they take? Then take ONE action to move forward."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Your career path is yours to build. Uni is just one option — not the only one. With the right strategy, you can earn just as much (or more) without a degree. Keep levelling up!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 10.5: Building Wealth Early
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'first-paycheck-life'),
  'building-wealth-early',
  'Building Wealth Early',
  'The head start advantage of starting at 17-18, compound interest, investing young, home ownership path, and KiwiSaver boost.',
  5, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Building Wealth Early"
    },
    {
      "type": "text",
      "text": "Here''s your secret weapon: TIME. By entering the workforce at 17 or 18 instead of 21-22 (after uni), you have a 3-5 year head start on saving, investing, and building wealth. That head start is worth more than you think — way more."
    },
    {
      "type": "text",
      "text": "**The compound interest advantage:**\n\nCompound interest means you earn interest on your interest. Over time, this snowballs into serious money. The earlier you start, the bigger the snowball gets.\n\n- **Start investing $50/week at age 17** (7% return): By 65 you have ~$1,050,000\n- **Start investing $50/week at age 22** (7% return): By 65 you have ~$720,000\n- **The difference**: $330,000 — just from starting 5 years earlier with the SAME weekly amount\n\nThat''s the power of time in the market."
    },
    {
      "type": "stat-card",
      "label": "5-year head start value",
      "value": "$330,000+",
      "description": "Starting to invest at 17 instead of 22 with just $50/week can mean $330,000 more by retirement. Time is literally your greatest asset."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "While your mates are at uni accumulating $25,000-$40,000 in student debt, you could be debt-free with $10,000+ in savings and a growing KiwiSaver balance. That''s a $50,000+ advantage before they even start earning."
    },
    {
      "type": "mini-quiz",
      "question": "You save $100/week from age 18 in an account earning 6% per year. Roughly how much do you have at age 25?",
      "options": ["$36,400 (just the cash)", "$42,000", "$48,500", "$55,000"],
      "correct_index": 2,
      "explanation": "$100/week for 7 years at 6% compounds to roughly $48,500. That''s $12,100 more than just saving cash in a jar ($36,400). Compound interest did the extra work for you!",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**Your wealth-building roadmap (ages 17-25):**\n\n1. **Age 17-18**: Start KiwiSaver, open a savings account, build emergency fund ($2,000-$3,000)\n2. **Age 18-19**: Grow emergency fund to 3 months'' expenses, start a \"goals\" savings account\n3. **Age 19-20**: Learn about investing, consider opening a Sharesies or Hatch account with small amounts\n4. **Age 20-22**: Ramp up KiwiSaver contributions, explore property saving goals\n5. **Age 22-25**: Seriously save for a house deposit. With a 5-year head start, you could buy your first home while your uni mates are still renting"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: KiwiSaver first home hack",
      "reveal_text": "If you''ve been in KiwiSaver for 3+ years, you can use your balance (minus $1,000) for a first home deposit. Starting at 17, by age 20 you''re already eligible. Plus you might qualify for the Kainga Ora First Home Grant — up to $5,000 for existing homes or $10,000 for new builds. Combined with your savings, you could have a deposit sorted in your early 20s.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Simple investing for beginners:**\n\n- **KiwiSaver** — Your first investment. Make sure you''re in a growth fund if you won''t need it for 10+ years\n- **Sharesies** — Start investing in NZ and international shares with as little as $5. Great for learning\n- **Kernel or InvestNow** — Low-fee index funds that track the overall market. Set and forget\n- **Term deposits** — Zero risk, lower returns. Good for money you''ll need in 1-3 years (like a house deposit)\n\nRule of thumb: invest in what you understand, diversify, and think long-term."
    },
    {
      "type": "fill-blanks",
      "sentence": "Compound interest means earning interest on your _____. Starting to invest 5 years earlier can mean $_____ more by retirement. You can withdraw KiwiSaver for a first home after _____ years.",
      "blanks": ["interest", "330,000", "3"],
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Start This Week",
      "text": "Open a Sharesies account (free, takes 5 minutes) and set up a $5-$10/week automatic investment into a diversified fund. It''s not about the amount — it''s about building the habit. In 12 months you''ll have $260-$520 invested plus returns, and more importantly, you''ll understand how investing works."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! You have a massive advantage — time. Use it wisely and you''ll build wealth that most people don''t achieve until their 40s or 50s. Your future self is going to be so grateful. Ka pai rawa atu!"
    }
  ]'::jsonb
);


-- ===========================================================================
-- MODULE 11: Military Money (military stream)
-- ===========================================================================
INSERT INTO public.modules (slug, title, description, icon_emoji, color, module_order, streams, estimated_minutes, total_xp, lesson_count, category, prerequisite_module_id)
VALUES (
  'military-money',
  'Military Money',
  'Financial literacy built for the NZDF — military pay, deployment savings, service benefits, transition planning, and long-term wealth as a service member.',
  '🎖️',
  'blue',
  11,
  ARRAY['military'],
  30,
  500,
  5,
  'stream',
  (SELECT id FROM public.modules WHERE slug = 'money-basics')
);

-- ---------------------------------------------------------------------------
-- Lesson 11.1: NZDF Pay & Allowances
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'military-money'),
  'nzdf-pay-allowances',
  'NZDF Pay & Allowances',
  'Military pay scales, trade pay, allowances, subsidised accommodation, mess fees, and uniform allowances.',
  1, 6, 50,
  '[
    {
      "type": "heading",
      "text": "NZDF Pay & Allowances"
    },
    {
      "type": "text",
      "text": "Joining the New Zealand Defence Force is a unique career path with a pay structure unlike any civilian job. Your income isn''t just your base salary — there are allowances, subsidies, and benefits stacked on top that make the total package much more valuable than the headline number."
    },
    {
      "type": "text",
      "text": "**NZDF base pay (approximate, 2024/25):**\n\n- **Recruit (basic training)**: ~$39,000-$42,000/yr\n- **Private/Able Rating/Aircraftman**: ~$50,000-$58,000/yr\n- **Lance Corporal/Leading Hand**: ~$55,000-$63,000/yr\n- **Corporal/Petty Officer**: ~$63,000-$73,000/yr\n- **Sergeant/Chief Petty Officer**: ~$73,000-$85,000/yr\n- **Officer Cadet**: ~$42,000-$48,000/yr\n- **2nd Lieutenant/Ensign**: ~$58,000-$68,000/yr\n\nPlus allowances that can add $5,000-$20,000+ on top."
    },
    {
      "type": "stat-card",
      "label": "NZDF total package value",
      "value": "$60,000-$90,000+",
      "description": "When you add subsidised housing, free medical/dental, uniform allowance, and trade pay to the base salary, the total package value is significantly higher than the base pay alone."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The NZDF pays you from day one of basic training. While you''re learning to be a soldier, sailor, or aviator, you''re already earning and building KiwiSaver. That''s a big advantage over uni students who are accumulating debt."
    },
    {
      "type": "mini-quiz",
      "question": "Which of these is typically included in an NZDF member''s pay package on top of base salary?",
      "options": ["Free car", "Subsidised accommodation and uniform allowance", "Free phone plan", "Overseas holiday allowance"],
      "correct_index": 1,
      "explanation": "NZDF members get subsidised on-base accommodation (much cheaper than civilian rent), plus a uniform allowance to maintain your service dress. Free medical and dental care are also included.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Key allowances and extras:**\n\n- **Trade pay** — Extra pay for specialist qualifications (technicians, medics, communications). Can add $3,000-$10,000+/yr\n- **Accommodation subsidy** — On-base housing at well below market rent ($50-$120/week vs $200-$300+ civilian rent)\n- **Rations** — Meals in the mess are subsidised. Budget $40-$80/week for food vs $100-$150 civilian\n- **Uniform allowance** — Clothing and boots provided or subsidised\n- **Deployment allowances** — Significant extra pay when deployed overseas\n- **Relocation assistance** — Help with moving costs when posted to a new base"
    },
    {
      "type": "text",
      "text": "**Understanding your military payslip:**\n\n- **Base salary** — Your rank-based pay\n- **Trade pay** — Additional pay for your specialisation\n- **Allowances** — Various extras (accommodation, deployment, etc.)\n- **PAYE** — Income tax, same as civilian jobs\n- **KiwiSaver** — Your contribution (3-10%) plus NZDF employer contribution\n- **NZDF Superannuation** — The military super scheme (we''ll cover this in a later lesson)\n- **Mess fees** — Deducted for mess membership and meals. Usually $20-$40/week"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: What are mess fees?",
      "reveal_text": "The mess is your dining and social facility on base. Mess fees cover meals and membership. They''re automatically deducted from your pay. While it might feel annoying to see the deduction, mess meals are heavily subsidised — you''re paying $6-$10 for meals that would cost $15-$25 at a restaurant. It''s actually a great deal.",
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Maximise Your Military Pay",
      "text": "1) Get qualified for trade pay ASAP — it''s one of the fastest ways to boost your income, 2) Use subsidised accommodation to save aggressively on rent, 3) Set up automatic savings from day one of basic training, 4) Take advantage of the free medical and dental — get everything checked, 5) Read your payslip every fortnight and make sure all allowances are correct."
    },
    {
      "type": "fill-blanks",
      "sentence": "NZDF members receive base _____ plus additional _____ for specialist qualifications. On-base accommodation is heavily _____ compared to civilian rents.",
      "blanks": ["salary", "trade pay", "subsidised"],
      "xp_bonus": 10
    },
    {
      "type": "callout",
      "style": "success",
      "text": "You now understand how NZDF pay works beyond just the base salary. The total package — including housing, medical, and allowances — makes military service a financially smart career choice."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 11.2: Deployment Savings
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'military-money'),
  'deployment-savings',
  'Deployment Savings',
  'Saving while deployed, reduced expenses on base, tax-free allowances on deployment, and lump-sum saving strategies.',
  2, 6, 50,
  '[
    {
      "type": "heading",
      "text": "Deployment Savings"
    },
    {
      "type": "text",
      "text": "Deployment is one of the biggest financial opportunities in the military. Your pay goes up, your expenses go down, and if you play it smart, you can come back from a deployment with a serious chunk of savings. Let''s make sure you''re set up to take full advantage."
    },
    {
      "type": "text",
      "text": "**Why deployments are a savings goldmine:**\n\n- **Higher pay** — Deployment allowances can significantly increase your take-home pay. Overseas deployments include daily allowances that can add $50-$150+/day on top of your base pay\n- **Lower expenses** — Food, accommodation, and most daily costs are covered on deployment. Your normal expenses (rent, food, entertainment) drop to nearly zero\n- **Tax benefits** — Some deployment allowances are tax-free, meaning more money in your pocket\n- **Fewer spending temptations** — No shopping malls, restaurants, or online shopping temptation (well, less of it)"
    },
    {
      "type": "stat-card",
      "label": "Potential deployment savings",
      "value": "$10,000-$30,000+",
      "description": "A 6-month overseas deployment with reduced expenses and deployment allowances can result in $10,000-$30,000+ in savings, depending on your rank and the deployment type."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "The biggest deployment money mistake: coming home with savings and blowing it all in the first month. Seriously, it''s so common there''s a name for it — ''deployment splurge.'' Have a plan for your savings BEFORE you come home."
    },
    {
      "type": "mini-quiz",
      "question": "You''re deployed for 6 months and save $20,000. What''s the smartest move when you get home?",
      "options": ["Buy a brand-new car — you''ve earned it", "Put it all in a savings account and forget about it", "Split it: emergency fund, investment, and a small treat", "Shout your mates a massive night out"],
      "correct_index": 2,
      "explanation": "The smart play is to split your deployment savings: top up your emergency fund, invest a portion (KiwiSaver top-up, shares, or house deposit fund), and allow yourself a small reward. Balance is key — you HAVE earned a treat, just not the whole $20k worth.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**Pre-deployment financial checklist:**\n\n1. **Set up automatic savings** — Have your deployment pay automatically transferred to a high-interest savings account\n2. **Reduce your recurring expenses** — Pause subscriptions, downgrade your phone plan, put gym membership on hold\n3. **Sort your bills** — Set up auto-payments for any bills that continue while you''re away\n4. **Update your will** — Not fun to think about, but essential. NZDF legal can help with this for free\n5. **Set savings goals** — Decide BEFORE you deploy what the money is for: house deposit, car, investments, emergency fund"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The deployment savings formula",
      "reveal_text": "Here''s a proven system: 1) Put 60-70% of deployment pay straight into savings (you don''t need it while deployed), 2) Keep 20-30% accessible for any expenses and to send home if needed, 3) Allow 10% as ''deployment pocket money'' for welfare activities and small purchases. This way you save aggressively without feeling completely deprived.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**What to do with deployment savings when you''re home:**\n\n- **Emergency fund** — If it''s not at 3 months'' expenses yet, top it up first\n- **House deposit** — Deployment savings can fast-track your property goals by years\n- **KiwiSaver voluntary contribution** — Top up to get the full government contribution ($521.43/yr)\n- **Invest** — Index funds through platforms like Sharesies, Kernel, or InvestNow for long-term growth\n- **Debt payoff** — If you have any consumer debt (car loan, hire purchase), smash it out\n- **Treat yourself (10%)** — A holiday, a new gadget, something you enjoy. You deserve it"
    },
    {
      "type": "fill-blanks",
      "sentence": "During deployment, your _____ go up while your _____ go down. Set up automatic _____ transfers before you deploy so money saves itself.",
      "blanks": ["allowances", "expenses", "savings"],
      "xp_bonus": 10
    },
    {
      "type": "tip-box",
      "title": "Post-Deployment Rule",
      "text": "When you get home, give yourself a 2-week cooling off period before making any big financial decisions. The excitement of being home plus having a big savings balance is a recipe for impulse purchases. Wait, plan, then act. Your bank balance will thank you."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Deployment is a rare opportunity to accelerate your financial goals. Plan ahead, save smart, and you''ll come home wealthier in every sense. Ka pai, soldier!"
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 11.3: Military-Specific Benefits
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'military-money'),
  'military-benefits',
  'Military-Specific Benefits',
  'Subsidised housing, free medical and dental, NZDF superannuation, education funding, and resettlement grants.',
  3, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Military-Specific Benefits"
    },
    {
      "type": "text",
      "text": "One of the best financial aspects of NZDF service is the benefits package. When you add up everything you get beyond your base salary — housing, healthcare, education, and super — the total value is often $15,000-$30,000+ per year MORE than your payslip shows."
    },
    {
      "type": "text",
      "text": "**Subsidised housing:**\n\n- **On-base accommodation**: Single service members can live in barracks or single quarters for $50-$120/week — way below civilian rent\n- **Service housing**: Families can access NZDF housing at below-market rents, typically 20-40% less than equivalent civilian rentals\n- **The savings**: On $200-$300/week in reduced rent alone, that''s $10,000-$15,000/year you save compared to renting on the civilian market\n- **Use this advantage**: Bank the rent savings, don''t inflate your lifestyle to match"
    },
    {
      "type": "stat-card",
      "label": "Value of free military healthcare",
      "value": "$3,000-$5,000/yr",
      "description": "Free GP visits, dental, physio, eye checks, and prescriptions would cost a civilian $3,000-$5,000+ per year. You get it all included in your service."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The NZDF provides free medical and dental care for all serving personnel. This includes GP visits, specialist referrals, dental check-ups and treatment, physiotherapy, mental health support, and prescriptions. Take full advantage of this — many civilians skip medical care because of cost."
    },
    {
      "type": "mini-quiz",
      "question": "The NZDF Superannuation scheme employer contribution rate is significantly higher than the standard KiwiSaver minimum. Why does this matter?",
      "options": ["It doesn''t matter — super is boring", "Higher employer contributions mean your retirement savings grow faster", "You have to pay it back when you leave", "It only matters if you stay for 20 years"],
      "correct_index": 1,
      "explanation": "The NZDF super scheme has a higher employer contribution rate than the standard 3% KiwiSaver minimum. This means your retirement savings grow significantly faster. Over a 20-year career, this can mean tens of thousands more in retirement savings.",
      "xp_bonus": 15
    },
    {
      "type": "text",
      "text": "**NZDF Superannuation:**\n\n- The NZDF offers its own superannuation scheme for service members\n- The employer contribution rate is higher than standard KiwiSaver minimums\n- You can also remain in KiwiSaver alongside the NZDF scheme\n- The longer you serve, the more valuable the super benefit becomes\n- If you leave before a certain period, you may only receive a portion of the employer contributions"
    },
    {
      "type": "text",
      "text": "**Education and training benefits:**\n\n- **On-the-job training** — Trades, technical skills, leadership — all free and NZQA-recognised\n- **Study assistance** — NZDF may fund part or all of tertiary study while you serve\n- **Transferable qualifications** — Electrical, mechanical, medical, IT, project management — all valued in civilian life\n- **Leadership development** — Military leadership training is highly regarded by civilian employers\n- **Resettlement training** — When you eventually leave, NZDF helps fund retraining for civilian careers"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The hidden value of military service",
      "reveal_text": "Add it all up: subsidised housing ($10,000-$15,000/yr), free healthcare ($3,000-$5,000/yr), free training and qualifications ($5,000-$15,000/yr), higher super contributions ($3,000-$8,000/yr), and various allowances ($5,000-$15,000/yr). The total benefit package can be worth $25,000-$60,000+ per year ON TOP of your salary. No civilian job offers this level of support.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these military benefits by estimated annual value (highest to lowest):",
      "items": ["Subsidised housing", "Free medical and dental", "Uniform allowance", "Education funding"],
      "correct_order": ["Subsidised housing", "Education funding", "Free medical and dental", "Uniform allowance"],
      "explanation": "Housing savings are typically the biggest benefit ($10,000-$15,000/yr), followed by education/training value ($5,000-$15,000/yr), medical ($3,000-$5,000/yr), and uniform allowance ($1,000-$2,000/yr).",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Maximise Your Benefits",
      "text": "1) Live on base and bank the rent savings, 2) Use every free training opportunity — qualifications are like money in the bank, 3) Get regular dental and medical check-ups (they''re free!), 4) Understand your superannuation scheme and contribute at the optimal rate, 5) Keep records of all qualifications earned — you''ll need them when transitioning to civilian life."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "The military benefits package is one of the most generous in New Zealand. Understanding and using every benefit available to you is like giving yourself a massive pay rise. Smart service members build serious wealth this way."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 11.4: Transition to Civilian Life
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'military-money'),
  'transition-planning',
  'Transition to Civilian Life',
  'Leaving the military, transferable skills, civilian pay expectations, resettlement grants, and upskilling options.',
  4, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Transition to Civilian Life"
    },
    {
      "type": "text",
      "text": "Whether you serve for 5 years or 25, eventually most NZDF members transition to civilian life. The financial side of this transition is massive — and planning ahead makes all the difference between a smooth landing and a rough one."
    },
    {
      "type": "callout",
      "style": "warning",
      "text": "The biggest financial shock when leaving the military: suddenly paying full price for housing, healthcare, and all the things that were subsidised. Your take-home pay might be higher in a civilian job, but your expenses will jump significantly. Plan for this."
    },
    {
      "type": "text",
      "text": "**The financial reality of transition:**\n\n- **Housing costs jump** — From $50-$120/week on base to $250-$400+/week for civilian rent. That''s $7,000-$15,000+ more per year\n- **Healthcare costs start** — GP visits ($50-$80), dentist ($150-$300 for a check-up), prescriptions ($5 per item)\n- **No more allowances** — Deployment pay, trade pay, ration subsidies — all gone\n- **Superannuation changes** — Your NZDF super transitions, and you need to understand what happens to your balance\n- **Lifestyle adjustment** — You may need to reduce spending to match new financial reality"
    },
    {
      "type": "stat-card",
      "label": "NZDF resettlement grant",
      "value": "Up to $15,000+",
      "description": "Depending on length of service, the NZDF provides a resettlement grant to help with the transition to civilian life. Longer service = higher grant."
    },
    {
      "type": "mini-quiz",
      "question": "You leave the NZDF after 8 years earning $75,000/yr. A civilian employer offers $80,000/yr. Are you better off?",
      "options": ["Yes — $80,000 is more than $75,000", "Not necessarily — you lose subsidised housing, free healthcare, and other benefits worth $20,000+/yr", "Definitely — civilian jobs always pay better", "It doesn''t matter as long as you have a job"],
      "correct_index": 1,
      "explanation": "When you factor in the lost benefits (housing subsidy, healthcare, super contributions, allowances), an $80,000 civilian salary might actually leave you with LESS disposable income than $75,000 in the military. Always compare total packages, not just base salary.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**Your transferable skills are worth gold:**\n\n- **Leadership** — Military leadership experience is highly valued. Management and team leader roles are a natural fit\n- **Technical skills** — Electricians, mechanics, communications, IT, medics — all directly transferable\n- **Project management** — Running military operations translates perfectly to civilian project management\n- **Security clearance** — If you held clearance, government and defence contractor roles are open to you\n- **Discipline and reliability** — Employers love hiring ex-military because of work ethic and punctuality"
    },
    {
      "type": "text",
      "text": "**Resettlement support from NZDF:**\n\n- **Resettlement grant** — A lump sum based on your length of service to help with transition costs\n- **Career transition support** — CV writing, interview preparation, job matching services\n- **Retraining funding** — NZDF may fund further education or certifications to help you enter a new field\n- **Transition leave** — Paid time off to prepare for civilian employment\n- **Veterans'' Affairs** — Ongoing support for veterans, including health and wellbeing services"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: When to start planning your transition",
      "reveal_text": "Ideally, start planning 2 years before you intend to leave. This gives you time to: upskill or get civilian certifications, save a bigger transition fund (aim for 6 months'' civilian living expenses), research civilian salary expectations in your field, network with ex-military contacts already in civilian roles, and mentally prepare for a very different work culture.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Put these transition planning steps in the correct order:",
      "items": ["Start saving a transition fund", "Research civilian job options and salaries", "Get civilian certifications for your skills", "Hand in your notice and use resettlement support"],
      "correct_order": ["Research civilian job options and salaries", "Start saving a transition fund", "Get civilian certifications for your skills", "Hand in your notice and use resettlement support"],
      "explanation": "First research what''s out there and what it pays. Then save accordingly. Then upskill to close any gaps. Finally, use all the NZDF resettlement support available before you leave.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Transition Fund Target",
      "text": "Before leaving the NZDF, aim to have 6 months'' worth of CIVILIAN living expenses saved — not military living expenses. Civilian costs are significantly higher. For a single person in a mid-sized NZ city, that''s roughly $15,000-$25,000. Your resettlement grant can help, but don''t rely on it alone."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "A well-planned military transition sets you up for the next chapter of your life. Your service has given you incredible skills, discipline, and financial advantages. Use them wisely in the civilian world."
    }
  ]'::jsonb
);

-- ---------------------------------------------------------------------------
-- Lesson 11.5: Long-Term Military Wealth
-- ---------------------------------------------------------------------------
INSERT INTO public.lessons (module_id, slug, title, description, lesson_order, estimated_minutes, xp_reward, content_blocks)
VALUES (
  (SELECT id FROM public.modules WHERE slug = 'military-money'),
  'long-term-military-wealth',
  'Long-Term Military Wealth',
  '20-year career financial planning, NZDF super vs KiwiSaver, post-military career options, and property investing while serving.',
  5, 6, 75,
  '[
    {
      "type": "heading",
      "text": "Long-Term Military Wealth"
    },
    {
      "type": "text",
      "text": "A long military career is one of the most reliable paths to financial security in NZ. Steady pay increases, excellent super, subsidised living, and unique opportunities to save make the NZDF an exceptional wealth-building platform — IF you''re intentional about it."
    },
    {
      "type": "text",
      "text": "**The 20-year military career financial advantage:**\n\n- **Year 1-5**: Build foundation — emergency fund, start investing, learn financial discipline. Living on base keeps costs low\n- **Year 5-10**: Accelerate — promotions boost pay, deployment savings add lump sums, consider buying property\n- **Year 10-15**: Compound growth — your super and investments are growing significantly, pursue specialist qualifications for more trade pay\n- **Year 15-20**: Peak earning — senior NCO or officer pay, strong super balance, investments maturing, multiple income streams\n- **Post-military**: Transition with a substantial financial cushion, transferable skills, and potential civilian career for another 20-30 years"
    },
    {
      "type": "stat-card",
      "label": "20-year NZDF super + investments",
      "value": "$300,000-$600,000+",
      "description": "A disciplined service member who maximises super contributions and invests deployment savings over a 20-year career can accumulate $300,000-$600,000+ in retirement savings and investments."
    },
    {
      "type": "callout",
      "style": "info",
      "text": "The NZDF Superannuation scheme is one of the most generous retirement schemes available in NZ. Understanding whether to prioritise NZDF Super, KiwiSaver, or both is one of the most important financial decisions you''ll make in service. Speak to the NZDF financial advisors — they''re free for serving personnel."
    },
    {
      "type": "mini-quiz",
      "question": "What''s the main advantage of buying an investment property while serving in the NZDF?",
      "options": ["Military members get cheaper mortgages", "Subsidised on-base housing means you can rent out a property you own while living cheaply", "The NZDF buys the property for you", "There''s no advantage — property is risky"],
      "correct_index": 1,
      "explanation": "If you live on base at $80/week and own a rental property bringing in $450/week — that''s a massive difference. Your cheap military housing allows you to become a landlord while paying minimal living costs yourself. Many long-serving military members build property portfolios this way.",
      "xp_bonus": 20
    },
    {
      "type": "text",
      "text": "**Property investing while serving:**\n\n- **The advantage**: You live cheaply on base while your property earns rental income\n- **Deposit**: Use deployment savings and KiwiSaver first home withdrawal for your deposit\n- **Management**: Use a property manager ($30-$50/week) since you might be posted or deployed\n- **Posting considerations**: When posted to a new base, you can rent out your property instead of selling\n- **Multiple properties**: Some long-serving members build portfolios of 2-4 properties over a 20-year career\n- **Tax benefits**: Rental income is taxable but expenses (mortgage interest, insurance, maintenance, management fees) are deductible"
    },
    {
      "type": "text",
      "text": "**Post-military career options:**\n\n- **Defence contractor roles**: $80,000-$150,000+/yr using your military expertise\n- **Government agencies**: MBIE, MPI, Customs, Corrections, NZSIS — value military experience highly\n- **Corporate leadership**: Management consulting, project management, operations — $90,000-$150,000+\n- **Emergency services**: Fire, Police, Ambulance — natural transitions with military skills\n- **Start a business**: Military discipline and leadership are excellent foundations for business ownership\n- **Semi-retirement**: With a strong financial base from military service, you might not need to work full-time at all"
    },
    {
      "type": "tap-reveal",
      "prompt": "Tap to reveal: The dual income strategy",
      "reveal_text": "Here''s the power move: complete a 20-year military career, building super and investments the whole time. Then start a civilian career at age 37-40, earning a full salary on top of your existing assets. While your non-military peers are still paying off student loans and mortgages, you could be mortgage-free with a strong investment portfolio AND a civilian income. That''s the long game.",
      "xp_bonus": 15
    },
    {
      "type": "sort-order",
      "instruction": "Rank these wealth-building priorities for a serving NZDF member (most important first):",
      "items": ["Emergency fund (3-6 months expenses)", "Maximise super contributions", "Save deployment income", "Invest in property or shares"],
      "correct_order": ["Emergency fund (3-6 months expenses)", "Maximise super contributions", "Save deployment income", "Invest in property or shares"],
      "explanation": "Safety net first (emergency fund), then maximise the free employer super contributions, then save windfalls from deployment, then invest in growth assets. Each step builds on the last.",
      "xp_bonus": 20
    },
    {
      "type": "tip-box",
      "title": "Your Military Wealth Playbook",
      "text": "1) Live on base and bank the savings from years 1-5, 2) Start a regular investment (even $50/week) from your first year, 3) Save 50-70% of every deployment income, 4) Buy your first property by year 5-7, 5) Max out super contributions, 6) Get free financial advice from NZDF advisors annually. The military gives you every tool to build wealth — use them."
    },
    {
      "type": "callout",
      "style": "success",
      "text": "Module complete! Whether you serve 5 years or 25, the NZDF gives you an incredible platform for financial success. The discipline you learn in service is the same discipline that builds wealth. Ka pai, and thank you for your service!"
    }
  ]'::jsonb
);
