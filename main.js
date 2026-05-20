const i18n = {
  it: {
    heroLabel:    'UX/UI Designer & Developer',
    heroSub:      'Progetto le esperienze, scrivo il codice.\nNon mi fermo al wireframe — porto il design in produzione.',
    projectLabel: 'Progetto',
    projectSub:   'Scopri il progetto',
    expLabel:     'anni di\nesperienza',
    langLabel:    'Lingua',
  },
  fr: {
    heroLabel:    'Designer UX/UI & Développeur',
    heroSub:      'Je conçois les expériences, j\'écris le code.\nJe ne m\'arrête pas au wireframe — je porte le design en production.',
    projectLabel: 'Projet',
    projectSub:   'Découvrir le projet',
    expLabel:     'ans\nd\'expérience',
    langLabel:    'Langue',
  },
  en: {
    heroLabel:    'UX/UI Designer & Developer',
    heroSub:      'I design experiences, I write code.\nI don\'t stop at the wireframe — I bring design to production.',
    projectLabel: 'Project',
    projectSub:   'Discover the project',
    expLabel:     'years of\nexperience',
    langLabel:    'Language',
  },
}

function applyLang(lang) {
  const t = i18n[lang]
  if (!t) return

  // Aggiorna testi
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n
    if (t[key] !== undefined) {
      el.innerText = t[key]
    }
  })

  // Aggiorna bottoni attivi
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang)
  })

  // Aggiorna lang dell'html per accessibilità
  document.documentElement.lang = lang

  // Salva preferenza
  localStorage.setItem('lang', lang)
}

// Init
const savedLang = localStorage.getItem('lang') || 'it'
applyLang(savedLang)

// Click sui bottoni lingua
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang))
})
