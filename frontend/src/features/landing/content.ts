export const LANDING_CONTENT = {
  hero: {
    eyebrow: 'FREE · NO ACCOUNT · STAYS IN YOUR BROWSER',
    headline: 'A CV that software can read, and people want to.',
    underlinedPhrase: 'software can read',
    sub: 'Fill in your details, choose one of three clean designs, and download a PDF with real, selectable text. No sign-up. No watermark.',
    primary: 'Build my CV',
    returningPrimary: 'Continue editing',
    returningMessage: 'Welcome back. Your draft is saved in this browser.',
    secondary: 'See the designs',
    stamp: 'ATS-FRIENDLY · PLAIN TEXT ·',
  },
  facts: [
    {
      label: 'ONE COLUMN',
      text: 'No tables or sidebars to scramble the reading order.',
    },
    { label: 'REAL TEXT', text: 'Select, copy and search your PDF.' },
    {
      label: 'STANDARD HEADINGS',
      text: 'Experience, Education, Skills, the way parsers expect.',
    },
    {
      label: 'A4, READY TO SEND',
      text: 'Clean margins that attach and print well.',
    },
  ],
  how: {
    title: 'Three steps. No account.',
    steps: [
      {
        title: 'Add your details',
        text: 'Name, email and phone are required. Everything else is optional.',
      },
      {
        title: 'Choose your sections',
        text: 'Switch on only what you need: projects, certifications, languages and more.',
      },
      {
        title: 'Pick a design and download',
        text: 'Preview it live, switch designs without retyping, then download your PDF.',
      },
    ],
    editLabel: 'Edit',
    previewLabel: 'Preview',
  },
  parser: {
    title: 'See what the software sees.',
    sub: 'Some résumé parsers read straight across the page. In a two-column layout, that can mix up your skills and your experience.',
    twoColumnLabel: 'Two-column layout',
    oneTapLabel: 'OneTap CV',
    caption: 'Illustration with sample text. Parsers differ, and no layout can guarantee how every system will read your CV.',
  },
  designs: {
    title: 'Three designs. One rule: plain and readable.',
    templates: [
      {
        id: 'classic',
        name: 'Classic',
        description: 'Centered, serif, formal.',
        bestFor: 'Finance, law, academia, traditional companies',
        action: 'Use Classic',
      },
      {
        id: 'modern',
        name: 'Modern',
        description: 'Left-aligned, clean, with a dark accent.',
        bestFor: 'Tech, startups, marketing, general use',
        action: 'Use Modern',
      },
      {
        id: 'compact',
        name: 'Compact',
        description: 'Dense one-line entries.',
        bestFor: 'Experienced people and long CVs',
        action: 'Use Compact',
      },
    ],
  },
  sections: {
    title: "Everything a CV needs, nothing it doesn't.",
    sub: "Twelve standard sections you can switch on or off. We keep the headings standard on purpose, because that's what parsers look for.",
    alwaysIncluded: 'Contact details are always included.',
  },
  privacy: {
    title: 'Your CV stays yours.',
    steps: [
      {
        label: 'YOUR DEVICE',
        title: 'You type in your browser.',
        text: 'Your draft is saved on your own device.',
      },
      {
        label: 'OUR SERVER',
        title: 'We turn it into a PDF.',
        text: 'When you preview or download, your CV is sent to our server just long enough to make the file.',
      },
      {
        label: 'YOUR PDF',
        title: "Then it's gone.",
        text: "We don't keep your CV. There's no account to delete.",
      },
    ],
    footnote: "Clearing your browser data or switching device starts you fresh, so download your PDF once you're happy with it.",
  },
  faq: {
    title: 'Questions, answered.',
    items: [
      {
        question: 'Is it really free?',
        answer: "Yes. There's no account, no paywall and no watermark.",
      },
      {
        question: 'Do you store my CV?',
        answer: "No. Your draft is saved in your own browser. It is sent to the server only to create the preview and the PDF, and it isn't kept.",
      },
      {
        question: 'What does ATS-friendly mean?',
        answer: 'ATS stands for applicant tracking system, the software many employers use to read and sort applications. ATS-friendly means a simple layout with real text and standard headings that such software can read reliably.',
      },
      {
        question: 'Will this get me through every ATS?',
        answer: 'No layout can promise that, because systems differ. These designs avoid the common problems (tables, columns, images and text trapped in graphics), which is the best foundation you can give your CV. Tailoring your content to each job matters just as much.',
      },
      {
        question: "Why can't I add custom sections?",
        answer: 'Parsers look for familiar headings. Twelve standard sections cover almost every CV, and keeping them standard helps your CV read correctly.',
      },
      {
        question: 'What if I clear my browser data or change device?',
        answer: "Your draft lives in this browser, so you'd start fresh. Download your PDF once you're happy with it.",
      },
      {
        question: 'Does it work on my phone?',
        answer: 'Yes. The builder is designed for small screens first, with an Edit and Preview switch.',
      },
      {
        question: 'Can I get US Letter size?',
        answer: 'Not yet. PDFs are A4 for now.',
      },
    ],
  },
  thanks: {
    title: 'Thank you for using OneTap CV.',
    body: "I'm Shahriar, a software engineer from Dhaka. I built this so that getting a clean, ATS-friendly CV doesn't need an account, a subscription or a watermark. If it helped you, I'd love to hear about it.",
    location: 'Dhaka, Bangladesh',
  },
  feedback: {
    title: 'Found a bug? Want another design? Tell me.',
    sub: "Your message goes straight to my inbox. Add your email only if you'd like a reply.",
    success: 'Thanks, got it.',
    error: "That didn't send. Please try again, or email me directly.",
  },
  finalCta: {
    title: 'Ready when you are.',
    button: 'Build my CV',
    note: 'Free. No sign-up.',
  },
  footer: {
    copyright: 'Built in Dhaka by Shahriar Hasan.',
  },
  builder: {
    steps: [
      {
        title: "Let's start with you",
        intro: 'Recruiters see this first. Name, email and phone are required.',
      },
      {
        title: 'Choose your sections',
        intro: "Turn on what's relevant, then use the arrows to put your sections in the order you want. Anything you remove is kept, in case you add it back.",
      },
      { title: 'Add your details', intro: 'Use the fields that fit your experience.' },
      { title: 'Pick a design and download', intro: 'Choose a clear layout and check your PDF.' },
    ],
    afterDownload: 'Downloaded. Open the PDF and check that you can select the text.',
    tips: [
      'Tailor the keywords to each job.',
      'Name the file with your name and the role.',
    ],
  },
} as const
