// 首頁校正清單：第一階段首頁程式碼「舊版（照舊講義做的）→ 新版（對上設計稿）」的逐處差異。
// 由兩個版本的程式碼逐檔比對自動產生；每一項是 { anchor: 附近一行（用來找位置）, removed: 舊的行, added: 新的行 }。
export const HOMEFIX = [
 {
  "file": "src/components/Navbar.tsx",
  "hunks": [
   {
    "anchor": "    <header className=\"sticky top-0 z-50 bg-white shadow-sm\">",
    "removed": [
     "      <nav className=\"mx-auto flex h-18 max-w-7xl items-center justify-between px-4 lg:h-22\">"
    ],
    "added": [
     "      <nav className=\"mx-auto flex h-18 max-w-332 items-center justify-between px-4 lg:h-22\">"
    ]
   }
  ]
 },
 {
  "file": "src/components/Hero.tsx",
  "hunks": [
   {
    "anchor": "  return (",
    "removed": [
     "    <section className=\"relative h-185 overflow-hidden\">"
    ],
    "added": [
     "    <section className=\"relative h-185 overflow-hidden lg:h-248\">"
    ]
   },
   {
    "anchor": "          <img src={slide.image} alt=\"\" className=\"size-full object-cover\" />",
    "removed": [
     "          <div className=\"absolute inset-0 mx-auto flex max-w-7xl items-end px-3 pb-15 md:items-center md:px-4 md:pb-0\">"
    ],
    "added": [
     "          <div className=\"absolute inset-0 mx-auto flex max-w-332 items-end px-3 pb-15 md:items-center md:px-4 md:pb-0\">"
    ]
   }
  ]
 },
 {
  "file": "src/components/FeatureSection.tsx",
  "hunks": [
   {
    "anchor": "  imageAlt: string",
    "removed": [],
    "added": [
     "  imageClassName?: string"
    ]
   },
   {
    "anchor": "}",
    "removed": [
     "function FeatureSection({ image, imageAlt, reverse = false, leaf, children }: FeatureSectionProps) {"
    ],
    "added": [
     "function FeatureSection({ image, imageAlt, imageClassName, reverse = false, leaf, children }: FeatureSectionProps) {"
    ]
   },
   {
    "anchor": "      >",
    "removed": [
     "        <img src={image} alt={imageAlt} className=\"w-full px-3 pt-8 md:w-1/2 md:p-0\" />"
    ],
    "added": [
     "        <img",
     "          src={image}",
     "          alt={imageAlt}",
     "          className={['w-full px-3 pt-8 md:w-1/2 md:p-0 lg:object-cover', imageClassName].join(' ')}",
     "        />"
    ]
   }
  ]
 },
 {
  "file": "src/components/PromoSections.tsx",
  "hunks": [
   {
    "anchor": "        imageAlt=\"香水與織品\"",
    "removed": [],
    "added": [
     "        imageClassName=\"lg:h-158\""
    ]
   },
   {
    "anchor": "      </FeatureSection>",
    "removed": [
     "      <img src=\"/images/svg/graphic-02.svg\" alt=\"\" className=\"mx-auto w-full max-w-7xl px-3 lg:py-10\" />"
    ],
    "added": [
     "      <img src=\"/images/svg/graphic-02.svg\" alt=\"\" className=\"mx-auto w-full max-w-240 px-3 py-2 lg:py-14\" />"
    ]
   },
   {
    "anchor": "        imageAlt=\"手工皂與刷具\"",
    "removed": [],
    "added": [
     "        imageClassName=\"lg:h-148.75\""
    ]
   }
  ]
 },
 {
  "file": "src/components/ProductCard.tsx",
  "hunks": [
   {
    "anchor": "          alt={product.title}",
    "removed": [
     "          className=\"aspect-4/3 w-full object-cover transition-transform duration-300 group-hover:scale-110\""
    ],
    "added": [
     "          className=\"aspect-3/2 w-full object-cover transition-transform duration-300 group-hover:scale-110\""
    ]
   }
  ]
 },
 {
  "file": "src/components/HotProducts.tsx",
  "hunks": [
   {
    "anchor": "  return (",
    "removed": [
     "    <section className=\"relative py-20 lg:py-30\">",
     "      <div className=\"mx-auto max-w-7xl px-3 md:px-4\">"
    ],
    "added": [
     "    <section className=\"relative py-14 lg:py-24\">",
     "      <div className=\"mx-auto max-w-332 px-3 md:px-4\">"
    ]
   },
   {
    "anchor": "        <h2 className=\"h2 mb-4\">默默熱賣中</h2>",
    "removed": [
     "        <p className=\"t-m mb-8 text-n-60\">用過的人都不想換回去的東西</p>"
    ],
    "added": [
     "        <p className=\"t-m mb-8 text-n-60 lg:mb-14\">用過的人都不想換回去的東西</p>"
    ]
   },
   {
    "anchor": "        )}",
    "removed": [
     "        <div className=\"flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:overflow-visible\">"
    ],
    "added": [
     "        <div className=\"flex gap-4 overflow-x-auto md:grid md:grid-cols-4 md:gap-6 md:overflow-visible\">"
    ]
   }
  ]
 },
 {
  "file": "src/components/Responsibility.tsx",
  "hunks": [
   {
    "anchor": "  return (",
    "removed": [
     "    <section className=\"bg-[url(/images/bgc-img.png)] bg-cover bg-center py-20 lg:py-30\">",
     "      <div className=\"mx-auto max-w-7xl px-3 md:px-4\">",
     "        <h2 className=\"h2 mb-6 lg:mb-10\">企業責任</h2>"
    ],
    "added": [
     "    <section className=\"bg-[url(/images/bgc-img.png)] bg-cover bg-center py-14 lg:py-24\">",
     "      <div className=\"mx-auto max-w-332 px-3 md:px-4\">",
     "        <h2 className=\"h2 mb-6 lg:mb-14\">企業責任</h2>"
    ]
   }
  ]
 },
 {
  "file": "src/components/Footer.tsx",
  "hunks": [
   {
    "anchor": "    <footer className=\"bg-[url(/images/footer-bgc.jpg)] bg-cover bg-center text-white\">",
    "removed": [
     "      <div className=\"mx-auto flex max-w-7xl flex-col gap-10 px-4 py-12 text-center lg:flex-row lg:justify-between lg:text-left\">"
    ],
    "added": [
     "      <div className=\"mx-auto flex max-w-332 flex-col gap-10 px-4 py-12 text-center lg:flex-row lg:justify-between lg:py-14 lg:text-left\">"
    ]
   },
   {
    "anchor": "        <div>",
    "removed": [
     "          <img src=\"/images/svg/logo_on dark.svg\" alt=\"I need this\" className=\"mx-auto h-12 lg:mx-0\" />"
    ],
    "added": [
     "          <img src=\"/images/svg/logo_on dark.svg\" alt=\"I need this\" className=\"mx-auto h-12 lg:mx-0 lg:h-25\" />"
    ]
   },
   {
    "anchor": "        <div>",
    "removed": [
     "          <ul className=\"mt-8 flex justify-center gap-6 lg:justify-start\">"
    ],
    "added": [
     "          <ul className=\"mt-8 flex justify-center gap-6 lg:mt-10 lg:justify-start\">"
    ]
   },
   {
    "anchor": "        </div>",
    "removed": [
     "        <div className=\"flex flex-col gap-8 lg:flex-row lg:gap-20\">"
    ],
    "added": [
     "        <div className=\"flex flex-col gap-8 lg:flex-row lg:gap-40\">"
    ]
   },
   {
    "anchor": "              <h3 className=\"h3 mb-4 lg:mb-6\">{column.title}</h3>",
    "removed": [
     "              <ul className=\"space-y-2 t-m\">"
    ],
    "added": [
     "              <ul className=\"space-y-2 t-m lg:space-y-4\">"
    ]
   }
  ]
 }
];
