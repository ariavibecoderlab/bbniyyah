export const DIMENSIONS = [
  { id: 'spiritual', label: 'Spiritual (Ruhani)', icon: '🕌', color: '#059669' },
  { id: 'physical', label: 'Physical (Jasadi)', icon: '💪', color: '#dc2626' },
  { id: 'academic', label: 'Academic (Ilmi)', icon: '📚', color: '#2563eb' },
  { id: 'skills', label: 'Skills (Maharah)', icon: '🛠️', color: '#7c3aed' },
  { id: 'financial', label: 'Financial (Mali)', icon: '💰', color: '#d97706' },
  { id: 'leadership', label: 'Leadership (Qiyadi)', icon: '🎤', color: '#0891b2' },
  { id: 'service', label: 'Service (Khidmah)', icon: '🤲', color: '#e11d48' },
  { id: 'character', label: 'Character (Akhlaq)', icon: '⭐', color: '#4f46e5' },
] as const

export type DimensionId = typeof DIMENSIONS[number]['id']

export const AGE_BANDS = [
  { id: 'buds', label: 'Buds', age: '7-9', emoji: '🌱' },
  { id: 'shoots', label: 'Shoots', age: '10-12', emoji: '🌿' },
  { id: 'branches', label: 'Branches', age: '13-15', emoji: '🌳' },
  { id: 'fruits', label: 'Fruits', age: '16-17', emoji: '🍎' },
] as const

export type AgeBand = typeof AGE_BANDS[number]['id']

export const CHECKIN_QUESTIONS: Record<AgeBand, { id: string; text: string }[]> = {
  buds: [
    { id: 'prayer', text: 'Did I pray on time?' },
    { id: 'quran', text: 'Did I read Quran?' },
    { id: 'doa_parents', text: 'Did I doa for my parents?' },
    { id: 'exercise', text: 'Did I exercise?' },
    { id: 'kind', text: 'Was I kind today?' },
    { id: 'learn', text: 'Did I learn something?' },
    { id: 'help', text: 'Did I help someone?' },
    { id: 'grateful', text: 'Am I grateful?' },
  ],
  shoots: [
    { id: 'prayer', text: 'Prayed all 5 on time?' },
    { id: 'quran', text: 'Read Quran today?' },
    { id: 'selawat', text: 'Did selawat?' },
    { id: 'doa_parents', text: 'Doa for parents?' },
    { id: 'exercise', text: 'Exercised today?' },
    { id: 'teach', text: 'Taught someone something?' },
    { id: 'dakwah', text: 'Did dakwah or sadaqah?' },
    { id: 'learn', text: 'Learned something new?' },
    { id: 'anger', text: 'Handled my anger well?' },
    { id: 'grateful', text: '3 things I\'m grateful for?' },
  ],
  branches: [
    { id: 'prayer', text: 'All prayers on time + sunnah?' },
    { id: 'quran', text: 'Quran reading (page)?' },
    { id: 'selawat', text: 'Selawat 100x?' },
    { id: 'doa_parents', text: 'Doa for parents (morning + evening)?' },
    { id: 'dhikr', text: 'Dhikr complete?' },
    { id: 'exercise', text: 'Exercise today?' },
    { id: 'teach', text: 'Taught / helped someone?' },
    { id: 'dakwah', text: 'Dakwah or sadaqah act?' },
    { id: 'mandarin', text: 'Mandarin practice?' },
    { id: 'financial', text: 'Financial discipline today?' },
  ],
  fruits: [
    { id: 'prayer', text: 'All prayers + sunnah rawatib?' },
    { id: 'quran', text: 'Quran + reflection?' },
    { id: 'selawat', text: 'Selawat 100x?' },
    { id: 'doa_parents', text: 'Doa for parents (2x)?' },
    { id: 'dhikr', text: 'Full adhkar?' },
    { id: 'exercise', text: 'Exercise (type + duration)?' },
    { id: 'teach', text: 'Taught / mentored someone?' },
    { id: 'dakwah', text: 'Dakwah or sadaqah act?' },
    { id: 'mandarin', text: 'Mandarin / Arabic practice?' },
    { id: 'financial', text: 'Financial discipline today?' },
  ],
}

export const ASSESSMENT_QUESTIONS: Record<AgeBand, Record<DimensionId, string[]>> = {
  buds: {
    spiritual: ['Do you pray on time?', 'Do you read Quran?', 'Do you fast sometimes?', 'Do you do selawat?'],
    physical: ['Do you exercise?', 'Do you eat healthy food?', 'Do you drink enough water?', 'Do you sleep early?'],
    academic: ['Do you like learning?', 'Can you read well?', 'Do you do your homework?', 'Do you ask questions?'],
    skills: ['Can you help cook?', 'Can you draw or build things?', 'Can you use a computer?', 'Do you try new things?'],
    financial: ['Do you save money?', 'Do you know what halal money is?', 'Do you share with others?', 'Do you count your savings?'],
    leadership: ['Do you speak in front of class?', 'Do you help organise things?', 'Do you show others what to do?', 'Do you lead prayers?'],
    service: ['Do you help people?', 'Do you give sadaqah?', 'Do you say kind words?', 'Do you smile at people?'],
    character: ['Do you say please and thank you?', 'Do you listen to your parents?', 'Do you control your anger?', 'Do you dress neatly?'],
  },
  shoots: {
    spiritual: ['Do you pray all 5 on time?', 'Do you read Quran daily?', 'Do you fast Sunnah days?', 'Do you do selawat 50x?', 'Do you doa for parents daily?'],
    physical: ['Can you run 1.6km?', 'How many push-ups can you do?', 'Do you eat according to Sunnah (1/3 rule)?', 'Do you exercise 3x/week?'],
    academic: ['Can you teach what you learned?', 'Do you understand or just memorise?', 'How\'s your Mandarin progress?', 'How\'s your Arabic progress?'],
    skills: ['Can you cook 3 dishes?', 'Have you tried coding?', 'Can you do basic woodworking?', 'Do you practice public speaking?'],
    financial: ['Do you budget your allowance?', 'Do you understand what riba is?', 'Can you explain halal earning?', 'Do you save regularly?'],
    leadership: ['Have you led prayer?', 'Can you speak for 3 minutes?', 'Do you take initiative in group work?', 'Do you mentor younger students?'],
    service: ['Do you do dakwah weekly?', 'Do you give sadaqah regularly?', 'Do you help at home/school?', 'Do you volunteer?'],
    character: ['Do you control your anger?', 'Are you a good listener?', 'Do you dress and groom well?', 'Do you show gratitude daily?'],
  },
  branches: {
    spiritual: ['Do you pray all 5 + sunnah?', 'Do you read 1 page Quran daily?', 'Do you fast Mon/Thu?', 'Do you do selawat 100x?', 'Do you attempt tahajjud?'],
    physical: ['Can you run 3km?', 'Can you do 30 push-ups?', 'Do you follow a fitness routine?', 'Do you understand nutrition basics?'],
    academic: ['Can you teach any subject to others?', 'What\'s your weakest subject?', 'HSK 3 Mandarin progress?', 'Arabic conversation level?'],
    skills: ['Can you cook 7+ dishes?', 'Have you built a web app?', 'Can you wire a plug/switch?', 'Can you deliver a speech?'],
    financial: ['Do you understand halal investing?', 'Can you explain why riba is haram?', 'Do you have a savings plan?', 'Have you started a mini-business?'],
    leadership: ['Have you led congregation prayer?', 'Can you speak 5 min impromptu?', 'Do you mentor younger students?', 'Have you organised an event?'],
    service: ['Do you do dakwah regularly?', 'Do you have a sadaqah budget?', 'Community service hours this term?', 'Have you helped organise charity?'],
    character: ['Are you known for calm under pressure?', 'Do people come to you to talk?', 'Is your daily grooming consistent?', 'Do you practice muhasabah?'],
  },
  fruits: {
    spiritual: ['All 5 + sunnah + tahajjud?', 'Quran: 1 page + tafsir daily?', 'Mon/Thu fasting + monthly detox?', 'Selawat 100x + muraja\'ah?', 'Hifz progress?'],
    physical: ['5km run time?', '50 push-ups achievable?', 'CPR/First Aid certified?', 'Monthly fitness test results?'],
    academic: ['IGCSE subject mastery?', 'Teach-back capability?', 'HSK 4 progress?', 'Arabic B1+ conversation?'],
    skills: ['Can you cook 10 meals?', 'Shipped an app?', 'Furniture building?', 'Sewing, gardening, survival skills?'],
    financial: ['Running a business with revenue?', 'Zakat calculation capability?', 'Halal investing portfolio?', 'Financial independence plan?'],
    leadership: ['Delivered khutbah?', 'Lead jumu\'ah prayer?', 'Mentoring multiple students?', 'Led team project to completion?'],
    service: ['Weekly dakwah practice?', '100+ community service hours?', 'Organised a community event?', 'Sadaqah as % of income?'],
    character: ['Calm under pressure consistently?', 'Active listener reputation?', 'Professional presentation always?', 'Digital discipline maintained?'],
  },
}

export const BADGES = [
  { type: 'fajr_warrior', label: 'Fajr Warrior', icon: '🌅', description: 'Pray Fajr on time consistently' },
  { type: 'quran_habit', label: 'Quran Habit', icon: '📖', description: 'Daily Quran reading streak' },
  { type: 'runner', label: 'Runner', icon: '🏃', description: 'Meet running distance goal' },
  { type: 'strong', label: 'Strong Believer', icon: '💪', description: 'Meet push-up standard' },
  { type: 'chef', label: 'Chef', icon: '🍳', description: 'Cook required dishes' },
  { type: 'coder', label: 'Coder', icon: '💻', description: 'Build a working app' },
  { type: 'speaker', label: 'Speaker', icon: '🎤', description: 'Deliver a speech/khutbah' },
  { type: 'mandarin_star', label: 'Mandarin Star', icon: '🇨🇳', description: 'Reach HSK level' },
  { type: 'arabic_star', label: 'Arabic Star', icon: '🇸🇦', description: 'Arabic proficiency milestone' },
  { type: 'giver', label: 'Giver', icon: '🤲', description: 'Sadaqah and dakwah acts' },
  { type: 'money_smart', label: 'Money Smart', icon: '💰', description: 'Financial literacy mastery' },
  { type: 'consistent', label: 'Consistent', icon: '🔥', description: 'Check-in streak' },
  { type: 'all_rounder', label: 'All-Rounder', icon: '⭐', description: 'Score 4+ in all dimensions' },
  { type: 'graduate', label: 'Graduate', icon: '🎓', description: 'Meet all graduation standards' },
]
