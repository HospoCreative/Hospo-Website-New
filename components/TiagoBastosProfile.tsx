import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, Camera, Check, Globe2, Linkedin, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { imageFolders, photoGalleryImageText } from "@/data/images";
import { getPublicImageList } from "@/lib/imageFolders";
import { MosaicGallery } from "./MosaicGallery";

const projects = [
  "Pan Pacific Hanoi",
  "Pullman Danang Beach Resort",
  "Grand Tourane Hotel",
  "YOTEL Porto",
  "Asha’s Birmingham",
  "Beleza Rodizio",
  "Brasa Restaurant",
  "Hotel Casabela",
  "24 Stories",
  "The Evolv Collection"
];

const capabilities = [
  ["Photography", "Hotels, stays, restaurants, food, drink, people, details and campaign imagery."],
  ["Video & short-form", "Brand films, experience video, social cuts, reels and launch-ready edits."],
  ["Production direction", "Briefing, shot planning, styling direction, production coordination and talent guidance."],
  ["Edited asset library", "A considered library of edited assets organised for web, campaigns, social and listings."]
];

const process = [
  ["01", "Brief", "Define the business priority, audience, channels and the role the content needs to play."],
  ["02", "Plan", "Build the shot list, schedule, styling direction and practical preparation around the venue."],
  ["03", "Produce", "Capture the experience with a clear commercial purpose, from atmosphere to the smallest details."],
  ["04", "Edit & deliver", "Select, refine and deliver useful assets ready for the channels where guests decide."]
];

const experience = [
  ["2024–Present", "HOSPO Creative", "Co-Founder, Photographer & Content Creator", "Leading photography, video and hospitality content projects while supporting creative and business development."],
  ["2022–2026", "Orelle / The Evolv Collection", "Bar Manager", "Luxury hospitality operations and guest experience in Birmingham."],
  ["2020–2022", "The Edgbaston Boutique Hotel & Cocktail Lounge", "Assistant Bar Manager / Bar Manager", "Premium hotel and cocktail-bar experience, team leadership and service delivery."],
  ["2016–2020", "VILA VITA Parc Resort & Spa", "Head Bartender", "Five-star resort, luxury events and fine-dining service, including exposure to a two-Michelin-star restaurant environment."],
  ["2014–2016", "Tivoli / Meliá", "Hospitality operations", "Early career experience across hotel and food and beverage operations in Portugal."]
];

const qualifications = [
  "AI Generativa para Profissionais do Turismo | Turismo de Portugal / NEST | 2026",
  "Going Digital: Marketing Digital para o Setor do Turismo | Turismo de Portugal / NEST | 2026",
  "The Fundamentals of Digital Marketing | Google Digital Garage / The Open University | 2023",
  "Branding Estratégico | Turismo de Portugal | 2022",
  "Técnicas de Marketing Digital Avançado: E-commerce, Publicidade e Retargeting | Turismo de Portugal | 2021",
  "Ferramentas de controlo de gestão | Turismo de Portugal | 2021",
  "Digital Marketing | IEFP Portugal | 2020"
];

export function TiagoBastosProfile() {
  const galleryItems = getPublicImageList(imageFolders.photoGallery, {
    text: photoGalleryImageText,
    altPrefix: "Hospitality photography portfolio image"
  }).map(({ src, alt }) => ({ src, alt }));

  return <article className="overflow-hidden bg-white text-ink">
    <header className="border-b border-white/15 bg-ink px-5 py-5 text-white sm:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        <Link href="/" className="font-serif text-xl tracking-[-0.03em] text-white">HOSPO <span className="text-yellow">Creative</span></Link>
        <a href="https://hospocreative.com/services/photography-video" className="inline-flex items-center gap-2 text-[0.65rem] font-black uppercase tracking-[0.14em] text-white/70 transition hover:text-yellow">Photography &amp; Video <ArrowUpRight size={15} aria-hidden="true" /></a>
      </div>
    </header>

    <section className="bg-ink px-5 pb-16 pt-12 text-white sm:px-8 sm:pb-24 sm:pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.15fr_.85fr] lg:gap-20">
        <div>
          <p className="section-eyebrow text-yellow">Private profile</p>
          <h1 className="mt-5 max-w-4xl font-serif text-[clamp(3.5rem,7.2vw,6.8rem)] font-semibold leading-[.88] tracking-[-0.045em]">Tiago<br />Bastos</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl sm:leading-9">Photographer, content creator and hospitality marketer creating visual work that helps hotels, restaurants and food-led brands become easier to choose.</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs font-bold uppercase tracking-[.13em] text-white/63"><span className="inline-flex items-center gap-2"><MapPin size={15} className="text-yellow" />Portugal &amp; UK</span><span className="inline-flex items-center gap-2"><Globe2 size={15} className="text-yellow" />Selected international projects</span></div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row"><a href="#portfolio" className="button-primary group">View selected work <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a><a href="mailto:tiagobastosavr@gmail.com" className="button-secondary group">Get in touch <Mail size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></div>
        </div>
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-white/15 bg-[#123e6f] shadow-2xl">
            <Image src="/images/tiago-bastos-headshot.png" alt="Tiago Bastos, photographer and content creator" fill priority sizes="(min-width: 1024px) 36vw, 85vw" className="object-cover object-center" />
          </div>
          <p className="mt-4 text-right text-[0.62rem] font-black uppercase tracking-[0.16em] text-white/48">Hospitality photography · video · digital content</p>
        </div>
      </div>
    </section>

    <section className="px-5 py-[var(--hc-section-compact)] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-9 lg:grid-cols-[.8fr_1.2fr] lg:gap-16">
          <div><p className="section-eyebrow text-ink/55">Focus</p><h2 className="mt-4 font-serif text-[clamp(2.7rem,4.8vw,4.6rem)] leading-[.92] tracking-[-0.035em]">Hospitality experience, translated into useful content.</h2></div>
          <div className="self-end"><p className="max-w-2xl text-base leading-8 text-ink/70 sm:text-lg">With 15 years in hospitality, Tiago brings an operator’s understanding to the work: the atmosphere guests look for, the details that create confidence and the moments that turn interest into a booking, reservation or enquiry.</p><p className="mt-5 border-l-2 border-yellow pl-4 text-sm leading-7 text-ink/64">At HOSPO Creative, he works across photography, video, content planning and hospitality marketing for brands in Portugal, the UK and beyond.</p></div>
        </div>
      </div>
    </section>

    <section className="bg-[#f5f7fa] px-5 py-[var(--hc-section-compact)] sm:px-8">
      <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-ink/55">Selected clients &amp; projects</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.6rem,4.6vw,4.3rem)] leading-[.94] tracking-[-0.03em]">Visual work for stays, dining and places with a sense of occasion.</h2><p className="mt-5 max-w-2xl text-base leading-7 text-ink/65">Photography, video and content work across selected hospitality projects.</p><div className="mt-10 grid border-l border-t border-ink/15 sm:grid-cols-2 lg:grid-cols-5">{projects.map((project) => <div key={project} className="flex min-h-28 items-end border-b border-r border-ink/15 p-5"><p className="font-serif text-2xl leading-tight">{project}</p></div>)}</div></div>
    </section>

    <section className="px-5 py-[var(--hc-section)] sm:px-8">
      <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-ink/55">Photography &amp; video</p><div className="mt-4 grid gap-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-16"><div><h2 className="font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[.91] tracking-[-0.04em]">Content for the moments people decide if the experience is for them.</h2></div><p className="self-end text-base leading-8 text-ink/70 sm:text-lg">Visual content built for the places guests actually make decisions, from the first image they notice to the page where they book or reserve. The focus is always the real experience: spaces, food, drink, people, atmosphere and the details that make a venue recognisable.</p></div><div className="mt-12 grid gap-4 md:grid-cols-2">{capabilities.map(([title, body], index) => <article key={title} className="rounded-[8px] border border-ink/15 p-6 transition duration-300 hover:-translate-y-1 hover:border-ink/45 hover:shadow-lg sm:p-7"><div className="flex items-center justify-between"><p className="section-eyebrow text-ink/48">0{index + 1}</p>{index < 2 ? <Camera size={19} className="text-yellow" /> : <Sparkles size={19} className="text-yellow" />}</div><h3 className="mt-8 font-serif text-3xl leading-none">{title}</h3><p className="mt-4 text-sm leading-7 text-ink/66">{body}</p></article>)}</div></div>
    </section>

    <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8" id="portfolio">
      <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-yellow">Visual storytelling</p><div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className="max-w-3xl font-serif text-[clamp(2.8rem,5.1vw,5rem)] leading-[.91] tracking-[-0.04em]">A sense of place, before the guest arrives.</h2><a href="https://hospocreative.com/services/photography-video" className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.14em] text-yellow transition hover:text-white">Explore the full HOSPO portfolio <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></a></div><MosaicGallery items={galleryItems} locale="en" /></div>
    </section>

    <section className="bg-white px-5 py-[var(--hc-section)] sm:px-8">
      <div className="mx-auto max-w-7xl"><p className="section-eyebrow text-ink/55">Approach</p><h2 className="mt-4 max-w-3xl font-serif text-[clamp(2.8rem,5vw,4.8rem)] leading-[.92] tracking-[-0.04em]">Thoughtful production, made practical.</h2><div className="mt-12 grid gap-0 border-l border-t border-ink/15 md:grid-cols-2 lg:grid-cols-4">{process.map(([number, title, body]) => <article key={number} className="min-h-64 border-b border-r border-ink/15 p-6 sm:p-7"><p className="section-eyebrow text-ink/45">{number}</p><h3 className="mt-9 font-serif text-3xl">{title}</h3><p className="mt-4 text-sm leading-7 text-ink/65">{body}</p></article>)}</div></div>
    </section>

    <section className="bg-[#f5f7fa] px-5 py-[var(--hc-section)] sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.86fr_1.14fr] lg:gap-20"><div><p className="section-eyebrow text-ink/55">Experience</p><h2 className="mt-4 font-serif text-[clamp(2.8rem,4.8vw,4.6rem)] leading-[.91] tracking-[-0.04em]">From hospitality floor to creative work.</h2><p className="mt-6 max-w-md text-base leading-8 text-ink/66">A commercial creative perspective grounded in the day-to-day reality of luxury hotels, restaurants, bars and guest experiences.</p><div className="mt-10 rounded-[8px] bg-ink p-6 text-white sm:p-8"><BriefcaseBusiness size={22} className="text-yellow" /><p className="mt-6 font-serif text-3xl leading-tight">HOSPO Creative</p><p className="mt-3 text-sm leading-7 text-white/72">Co-Founder, Photographer &amp; Content Creator since 2024.</p><p className="mt-6 border-l-2 border-yellow pl-4 text-sm leading-7 text-white/70">At Beleza Rodizio, content work supported a growing social presence from 1K to 13.5K Instagram followers and more than 460K social reach.</p></div></div><div className="divide-y divide-ink/15 border-y border-ink/15">{experience.map(([period, company, role, detail]) => <article key={company} className="grid gap-3 py-6 sm:grid-cols-[8rem_1fr] sm:gap-7"><p className="text-xs font-black uppercase tracking-[.13em] text-ink/50">{period}</p><div><h3 className="font-serif text-2xl leading-tight">{company}</h3><p className="mt-1 text-sm font-extrabold text-ink/75">{role}</p><p className="mt-3 text-sm leading-7 text-ink/63">{detail}</p></div></article>)}</div></div>
    </section>

    <section className="bg-white px-5 py-[var(--hc-section)] sm:px-8">
      <div className="mx-auto max-w-7xl"><div className="grid gap-12 lg:grid-cols-2 lg:gap-20"><div><p className="section-eyebrow text-ink/55">Skills &amp; tools</p><h2 className="mt-4 font-serif text-[clamp(2.8rem,4.8vw,4.5rem)] leading-[.92] tracking-[-0.04em]">Creative, commercial and production-ready.</h2><div className="mt-10 grid gap-7 sm:grid-cols-2"><div><p className="section-eyebrow text-ink/45">Creative &amp; marketing</p><ul className="mt-4 space-y-3 text-sm leading-6 text-ink/73">{["Hospitality photography", "Videography & short-form video", "Content strategy", "Social media content", "Creative production", "Hospitality marketing", "Business development"].map((item) => <li key={item} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-yellow" />{item}</li>)}</ul></div><div><p className="section-eyebrow text-ink/45">Software &amp; kit</p><ul className="mt-4 space-y-3 text-sm leading-6 text-ink/73">{["Adobe Lightroom", "Adobe Photoshop", "Adobe Premiere Pro", "CapCut", "Sony full-frame cameras", "Professional lighting", "DJI drone & gimbal"].map((item) => <li key={item} className="flex gap-2.5"><Check size={16} className="mt-0.5 shrink-0 text-yellow" />{item}</li>)}</ul></div></div></div><div><p className="section-eyebrow text-ink/55">Professional development</p><div className="mt-5 divide-y divide-ink/15 border-y border-ink/15">{qualifications.map((qualification) => <p key={qualification} className="py-4 text-sm leading-6 text-ink/70">{qualification}</p>)}</div><div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-[8px] bg-[#f5f7fa] p-5"><p className="section-eyebrow text-ink/45">Portuguese</p><p className="mt-3 font-serif text-2xl">Native</p></div><div className="rounded-[8px] bg-[#f5f7fa] p-5"><p className="section-eyebrow text-ink/45">English</p><p className="mt-3 font-serif text-2xl">Fluent</p></div><div className="rounded-[8px] bg-[#f5f7fa] p-5"><p className="section-eyebrow text-ink/45">Spanish</p><p className="mt-3 font-serif text-2xl">Conversational</p></div></div></div></div></div>
    </section>

    <section className="bg-ink px-5 py-[var(--hc-section)] text-white sm:px-8">
      <div className="mx-auto max-w-7xl"><div className="grid gap-10 lg:grid-cols-[.85fr_1.15fr] lg:gap-20"><div><p className="section-eyebrow text-yellow">A straightforward fit</p><h2 className="mt-4 font-serif text-[clamp(2.8rem,4.8vw,4.6rem)] leading-[.92] tracking-[-0.04em]">For teams that need the real experience to be seen, felt and understood online.</h2><p className="mt-6 max-w-lg text-base leading-8 text-white/70">From a one-off campaign shoot to a content library designed around social, web, digital campaigns and listings.</p></div><div className="divide-y divide-white/15 border-y border-white/15">{[["Do you work with hotels and restaurants?", "Yes. The work is focused on hotels, stays, restaurants, bars, food-led venues and wider hospitality brands."], ["Can photography and video be captured in one production?", "Yes. A combined production can be planned around the platform mix and outcomes the brand needs."], ["Can the assets be shaped for social and web?", "Yes. Deliverables can be planned for websites, social media, campaigns, OTAs and Google visibility."], ["Can you support the planning side of a shoot?", "Yes. This can include the brief, shot planning, styling direction and schedule coordination."]].map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-serif text-2xl leading-tight [&::-webkit-details-marker]:hidden">{question}<span className="font-sans text-xl text-yellow transition group-open:rotate-45">+</span></summary><p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">{answer}</p></details>)}</div></div></div>
    </section>

    <section className="bg-yellow px-5 py-16 text-ink sm:px-8 sm:py-20"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end"><div><p className="section-eyebrow text-ink/65">Let’s talk</p><h2 className="mt-4 max-w-4xl font-serif text-[clamp(3rem,5.4vw,5.4rem)] leading-[.89] tracking-[-0.045em]">Discuss your next hospitality content project.</h2></div><div className="flex flex-col gap-3 sm:flex-row md:flex-col"><a href="mailto:tiagobastosavr@gmail.com" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-xs font-black uppercase tracking-[.14em] text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-ink"><Mail size={16} />Email Tiago</a><a href="https://www.linkedin.com/in/tiagobastos93" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/40 px-6 text-xs font-black uppercase tracking-[.14em] transition hover:-translate-y-0.5 hover:border-ink"><Linkedin size={16} />LinkedIn</a></div></div><div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink/20 pt-5 text-sm font-semibold text-ink/75"><a className="inline-flex items-center gap-2 hover:text-white" href="tel:+447887783999"><Phone size={15} />+44 7887 783999</a><a className="inline-flex items-center gap-2 hover:text-white" href="mailto:tiagobastosavr@gmail.com"><Mail size={15} />tiagobastosavr@gmail.com</a></div></section>

    <footer className="bg-ink px-5 py-7 text-white/55 sm:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-[0.65rem] font-black uppercase tracking-[.14em] sm:flex-row"><p>Tiago Bastos · HOSPO Creative</p><a className="transition hover:text-yellow" href="https://hospocreative.com/services/photography-video">hospocreative.com</a></div></footer>
  </article>;
}
