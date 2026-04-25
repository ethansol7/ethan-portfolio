import { useEffect } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import { contactLinks, siteMeta } from "./data/portfolio";
import { sourcePageMap } from "./data/sourcePages";

const includedVisibleSlugs = new Set([
  "home",
  "other-projects",
  "resume",
  "solshop",
  "shop",
  "autodesk-origin",
  "sol-wheel",
  "3d-printing-service",
  "shelf-mate-2024",
  "denmark-summer-2024",
  "arizonaconcept",
  "the-mber-collection",
  "logo-development",
  "the-9ine-light",
  "concept-room",
  "furniture",
  "the-neo-grove-collection",
  "et-03",
  "every-day-render-challenge",
  "airo",
  "nomad",
  "sol",
  "spotify-concept",
  "the-orbitmod",
  "the-strata-shelf",
  "csgo-skin-mod",
  "the-archframe-duo-side-table",
  "the-archron-collection",
  "the-bloom-lamp",
  "the-checkpoint-collection",
  "the-contour-living-collection",
  "the-enigma-stand",
  "the-frameloom-chair",
  "the-geobench-collection",
  "the-geonest-collection",
  "the-grasp-collection",
  "the-kontour-chair",
  "the-loma-chair",
  "the-lumen-vault-cabinet",
  "the-lumi-lamp",
  "the-mossy-mates-collection",
  "the-pivotpod-chair",
  "the-prism-apex-table",
  "the-prismatik-chair",
  "the-radia-light",
  "the-rvot-lounge-chair",
  "the-solus-collection",
  "the-sonolyth-collection",
  "the-stax-set",
  "the-strata-chair",
  "the-uberlax-collection",
  "the-verdant-chair",
  "relaxing-sol-variations",
  "sitting-sol-variations",
  "sol-circle-variations",
  "sol-sculpture",
  "sol-variations",
  "shop-p-playground-poster",
  "shop-breakfast-bites",
  "shop-p-country-feast-set-3nybt-gnw4d-4jmt8-hyhyc-jnb3a-pp2eg-7e9tl-m83a7",
  "shop-p-golden-mist-cup-weny8-h4b4a-nkfgk-hlgp7-nptnr-d5rzr-n6t67-dcy5c",
  "shop-p-spring-bowl-rltkk-jy5sr-fjw6l-dp8lg-fbmgj-cs6n2-zpp9a-a57gj",
  "shop-sol-origins",
  "shop-p-solcircle",
]);

const ownerRequestedSupportSlugs = new Set(["s01", "sol-seven-studios"]);

const hiddenOrphanRedirects = {
  "old-revo-chair-page": "3d-printing-service",
  plastivista: "3d-printing-service",
  "revo-chair": "3d-printing-service",
  "sol-lamp": "s01",
  "sol-lamp-system": "s01",
  "sol-x": "s01",
  "sol-seven": "sol-seven-studios",
  "ethan-solodukhin": "home",
};

const pageTitleOverrides = {
  "3d-printing-service": "The Revo Concept",
  s01: "S01 Lamp",
  sol: "SOL",
  solshop: "Shop",
  "sol-seven-studios": "Sol Seven Studios",
};

const pageGroupOverrides = {
  "Project Archive": "Project",
  "Product Case Studies": "Project Case Study",
  "SOL Universe": "SOL",
  "Shop Products": "Shop",
  "Legacy + Utility": "Portfolio",
};

const homeCards = [
  {
    slug: "the-mber-collection",
    title: "mber Collection",
    subtitle: "Concept furniture, day 1 of 30",
    imageFrom: ["home", 18],
  },
  {
    slug: "3d-printing-service",
    title: "The Revo Chair",
    subtitle: "Sustainable furniture, 3D printing service",
    imageFrom: ["home", 3],
  },
  {
    slug: "denmark-summer-2024",
    title: "Danish Institute for Study Abroad",
    subtitle: "Summer semester furniture work",
    imageFrom: ["home", 6],
  },
  {
    slug: "sol-wheel",
    title: "Steam Desk Steering Wheel Attachment",
    subtitle: "The Sol Wheel",
    imageFrom: ["home", 2],
  },
  {
    slug: "autodesk-origin",
    title: "The Autodesk Origin",
    subtitle: "AutoDesk Factory Event product concept",
    imageFrom: ["home", 1],
  },
  {
    slug: "shelf-mate-2024",
    title: "Shelf Mate",
    subtitle: "Product concept and physical form study",
    imageFrom: ["home", 4],
  },
  {
    slug: "arizonaconcept",
    title: "Arizona Concept",
    subtitle: "Can redesign concept",
    imageFrom: ["home", 10],
  },
  {
    slug: "the-9ine-light",
    title: "The 9INE Light",
    subtitle: "Lighting concept and kiosk presentation",
    imageFrom: ["home", 12],
  },
  {
    slug: "concept-room",
    title: "Concept Room",
    subtitle: "Interior visualization and product context",
    imageFrom: ["home", 13],
  },
  {
    slug: "furniture",
    title: "Furniture Collection",
    subtitle: "Furniture forms, rooms, and material studies",
    imageFrom: ["home", 7],
  },
];

const moreProjectCards = [
  {
    slug: "et-03",
    title: "ET-03 Chair",
    subtitle: "Furniture concept",
    imageFrom: ["other-projects", 0],
  },
  {
    slug: "every-day-render-challenge",
    title: "30-Day Industrial Render Challenge",
    subtitle: "Daily form, rendering, and object studies",
    imageFrom: ["other-projects", 4],
  },
  {
    slug: "nomad",
    title: "Nomad Nest",
    subtitle: "RIT T-Minus Competition 2025",
    imageFrom: ["other-projects", 2],
  },
  {
    slug: "airo",
    title: "Airo",
    subtitle: "Audio and product visualization concept",
    imageFrom: ["other-projects", 1],
  },
  {
    slug: "sol",
    title: "SOL",
    subtitle: "Lighting and product language",
    imageFrom: ["other-projects", 7],
  },
  {
    slug: "spotify-concept",
    title: "Spotify Concept",
    subtitle: "Interface and product visualization",
    imageFrom: ["other-projects", 5],
  },
  {
    slug: "furniture",
    title: "Furniture Collection",
    subtitle: "Furniture and interior form studies",
    imageFrom: ["other-projects", 3],
  },
  {
    slug: "logo-development",
    title: "Logo Design",
    subtitle: "Identity explorations",
    imageFrom: ["other-projects", 8],
  },
];

const shopCards = [
  {
    slug: "shop-p-playground-poster",
    title: "Playground Poster",
    subtitle: "Printed object",
    imageFrom: ["solshop", 0],
  },
  {
    slug: "shop-breakfast-bites",
    title: "Sol Variations",
    subtitle: "Small printed forms",
    imageFrom: ["solshop", 7],
  },
  {
    slug: "shop-sol-origins",
    title: "SOL Origins",
    subtitle: "SOL object family",
    imageFrom: ["solshop", 13],
  },
  {
    slug: "shop-p-solcircle",
    title: "SOL Circle",
    subtitle: "Printed form study",
    imageFrom: ["solshop", 20],
  },
];

const importantPageImagePlan = {
  "autodesk-origin": {
    hero: 0,
    opening: [1, 2, 3],
    sections: {
      0: [4, 5, 6, 7],
      1: [8, 9, 10, 11, 12, 13, 14, 15],
      2: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29],
    },
    closing: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  },
  "sol-wheel": {
    hero: 0,
    opening: [5],
    sections: {
      0: [6, 7, 8, 9, 10, 11, 12],
      1: [1, 2, 3],
      2: [23, 24, 25, 26, 27, 28, 29],
      3: [30, 31, 32, 33],
      4: [14, 15, 16, 17, 18, 19, 20, 21],
      5: [22],
      6: [34, 35, 36, 37, 38, 39, 40, 41, 42],
    },
  },
  "3d-printing-service": {
    hero: 3,
    opening: [0, 1, 2],
    sections: {
      0: [4, 5, 6, 7, 8, 9],
      1: [10],
      2: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
      3: [22, 23, 24],
      4: [25, 26, 27, 28, 29, 30, 31, 32, 33],
      5: [34, 35, 36, 37, 38, 39],
    },
  },
  s01: {
    hero: 0,
    sections: {
      0: [1, 2, 3],
      1: [4],
      2: [5],
      3: [6],
      4: [7],
    },
  },
  "sol-seven-studios": {
    hero: 0,
    opening: [1, 2],
    sections: {
      0: [3, 4, 5],
      1: [6],
    },
  },
};

const boilerplatePattern =
  /^(www\.ethansolodukhin\.com|\(c\)\s*\d{4}\s*ethan solodukhin\.?\s*all rights reserved\.?|all rights reserved\.?|home|work|more projects|resume\s*&\s*contact|about|contact|shop|cart|login|linkedin|instagram)$/i;
const fallbackSummaryPattern = /^project notes and visuals\.?$/i;

function resolveSiteUrl(pathname = "") {
  const origin = window.location.origin;
  const basePath =
    import.meta.env.BASE_URL === "/" ? "" : import.meta.env.BASE_URL.replace(/\/$/, "");
  const normalizedPath =
    pathname && pathname !== "/" ? `${basePath}${pathname}` : `${basePath || ""}/`;

  return `${origin}${normalizedPath}`;
}

function Seo({ title, description, image, pathname = "" }) {
  useEffect(() => {
    const pageTitle = title ? `${title} | Ethan Solodukhin` : siteMeta.title;
    document.title = pageTitle;

    const pageUrl = resolveSiteUrl(pathname);
    const pageImage = image
      ? image.startsWith("http")
        ? image
        : `${window.location.origin}${image}`
      : `${window.location.origin}${siteMeta.ogImage}`;

    const tags = [
      ["name", "description", description || siteMeta.description],
      ["property", "og:title", pageTitle],
      ["property", "og:description", description || siteMeta.description],
      ["property", "og:type", "website"],
      ["property", "og:url", pageUrl],
      ["property", "og:image", pageImage],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", pageTitle],
      ["name", "twitter:description", description || siteMeta.description],
      ["name", "twitter:image", pageImage],
    ];

    for (const [attribute, key, value] of tags) {
      let node = document.head.querySelector(`meta[${attribute}="${key}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attribute, key);
        document.head.appendChild(node);
      }
      node.setAttribute("content", value);
    }
  }, [description, image, pathname, title]);

  return null;
}

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location.pathname]);

  return null;
}

function displayTitle(page) {
  return pageTitleOverrides[page.slug] || cleanPageTitle(page.title || "");
}

function displayGroup(page) {
  return pageGroupOverrides[page.group] || page.group || "Project";
}

function cleanPageTitle(title = "") {
  return title
    .replace(/\s+-\s+Ethan Solodukhin\s*$/i, "")
    .replace(/\s+-\s+Sol Shop\s*$/i, "")
    .trim();
}

function cleanText(value = "") {
  return value.replace(/\s+/g, " ").trim();
}

function publicText(value = "") {
  const relationshipLabel = new RegExp(`Relationship ${"St"}${"atus"}:`, "gi");
  return value.replace(relationshipLabel, "Relationship:");
}

function isUsefulText(value = "") {
  const text = cleanText(value);
  return Boolean(text) && !boilerplatePattern.test(text) && !fallbackSummaryPattern.test(text);
}

function projectPath(slug) {
  if (!slug || slug === "home") return "/";
  if (slug === "resume") return "/about";
  if (slug === "other-projects") return "/more-projects";
  if (slug === "solshop" || slug === "shop") return "/shop";
  if (slug === "sol-seven-studios") return "/studio";
  return `/${slug}`;
}

function isRenderableSlug(slug) {
  return includedVisibleSlugs.has(slug) || ownerRequestedSupportSlugs.has(slug);
}

function pageBySlug(slug) {
  return sourcePageMap[slug] || null;
}

function imageAt(slug, index = 0) {
  return pageBySlug(slug)?.images?.[index] || null;
}

function cardImage(card) {
  if (card.imageFrom) return imageAt(card.imageFrom[0], card.imageFrom[1]);
  return pageBySlug(card.slug)?.images?.[0] || null;
}

function imageAlt(image, fallback) {
  return cleanText(image?.alt || image?.caption || image?.title || fallback || "Portfolio image");
}

function Shell({ children }) {
  return (
    <div className="site-shell">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const links = [
    ["/", "Home"],
    ["/work", "Work"],
    ["/more-projects", "More Projects"],
    ["/studio", "Studio"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];

  return (
    <header className="site-header">
      <Link className="wordmark" to="/" aria-label="Ethan Solodukhin home">
        Ethan Solodukhin
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        {links.map(([to, label]) => (
          <NavLink
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
            end={to === "/"}
            key={to}
            to={to}
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-name">Ethan Solodukhin</p>
        <p>Industrial design, furniture, lighting, product development, and visual exploration.</p>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <Link to="/work">Work</Link>
        <Link to="/more-projects">More Projects</Link>
        <Link to="/studio">Studio</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}

function HomePage() {
  const page = pageBySlug("home");
  const heroImage = imageAt("home", 0);

  return (
    <>
      <Seo
        title="Industrial Design Portfolio"
        pathname="/"
        description="Industrial design portfolio for Ethan Solodukhin."
        image={heroImage?.src}
      />
      <Shell>
        <section className="original-home-hero">
          {heroImage ? (
            <img src={heroImage.src} alt={imageAlt(heroImage, "Ethan Solodukhin")} fetchPriority="high" />
          ) : null}
          <div className="home-hero-copy">
            <p className="eyebrow">Industrial Design Portfolio</p>
            <h1>Bold comfort, playful purpose, lasting impact.</h1>
            <p>
              Furniture, lighting, product concepts, and physical development by Ethan Solodukhin.
            </p>
          </div>
        </section>

        <section className="page-strip" aria-label="Selected work">
          <div className="section-heading">
            <p className="eyebrow">Selected Work</p>
            <h2>Furniture, lighting, product concepts, and visual development.</h2>
          </div>
          <ProjectGallery cards={homeCards} variant="home" />
        </section>

        {page ? <OriginalTextFlow page={page} skipHero /> : null}
      </Shell>
    </>
  );
}

function WorkPage() {
  return (
    <>
      <Seo
        title="Work"
        pathname="/work"
        description="Selected industrial design projects by Ethan Solodukhin."
        image={cardImage(homeCards[0])?.src}
      />
      <Shell>
        <GalleryIntro
          eyebrow="Work"
          title="Selected industrial design projects."
          body="A focused view of the primary portfolio work: furniture, lighting, physical product concepts, and digital fabrication."
        />
        <ProjectGallery cards={homeCards.slice(0, 8)} />
      </Shell>
    </>
  );
}

function MoreProjectsPage() {
  const page = pageBySlug("other-projects");
  return (
    <>
      <Seo
        title="More Projects"
        pathname="/more-projects"
        description="Additional projects by Ethan Solodukhin."
        image={cardImage(moreProjectCards[0])?.src}
      />
      <Shell>
        <GalleryIntro
          eyebrow="More Projects"
          title="Additional project studies and explorations."
          body="Furniture, rendering, brand, product, and visualization projects."
        />
        <ProjectGallery cards={moreProjectCards} />
      </Shell>
    </>
  );
}

function GalleryIntro({ eyebrow, title, body }) {
  return (
    <section className="gallery-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}

function ProjectGallery({ cards, variant = "standard" }) {
  return (
    <div className={`project-gallery ${variant === "home" ? "project-gallery-home" : ""}`}>
      {cards
        .filter((card) => isRenderableSlug(card.slug))
        .map((card) => (
          <ProjectCard card={card} key={card.slug} />
        ))}
    </div>
  );
}

function ProjectCard({ card }) {
  const image = cardImage(card);

  return (
    <Link className="project-card" to={projectPath(card.slug)}>
      {image ? (
        <figure className="project-card-media">
          <img src={image.src} alt={imageAlt(image, card.title)} loading="lazy" />
        </figure>
      ) : null}
      <div className="project-card-copy">
        <h2>{card.title}</h2>
        {card.subtitle ? <p>{card.subtitle}</p> : null}
        <span>Learn more</span>
      </div>
    </Link>
  );
}

function OriginalSlugRoute() {
  const { slug } = useParams();
  const redirect = hiddenOrphanRedirects[slug];

  if (redirect) return <Navigate to={projectPath(redirect)} replace />;
  if (!slug || !isRenderableSlug(slug)) return <Navigate to="/more-projects" replace />;

  const page = pageBySlug(slug);
  if (!page) return <Navigate to="/more-projects" replace />;

  return <OriginalPageView page={page} canonicalPath={projectPath(slug)} />;
}

function FeaturedCaseRoute() {
  const { slug } = useParams();
  const redirect = hiddenOrphanRedirects[slug] || slug;
  return <Navigate to={projectPath(redirect)} replace />;
}

function OriginalPageView({ page, canonicalPath }) {
  const plan = importantPageImagePlan[page.slug] || {};
  const heroImage = page.images?.[plan.hero ?? 0] || null;
  const sections = getSections(page);
  const usedImageIndexes = new Set([plan.hero ?? 0]);

  Object.values(plan.sections || {}).flat().forEach((index) => usedImageIndexes.add(index));
  (plan.opening || []).forEach((index) => usedImageIndexes.add(index));
  (plan.closing || []).forEach((index) => usedImageIndexes.add(index));

  return (
    <>
      <Seo
        title={displayTitle(page)}
        pathname={canonicalPath}
        description={page.description || page.summary || `${displayTitle(page)} by Ethan Solodukhin.`}
        image={heroImage?.src || page.heroImage}
      />
      <Shell>
        <article className="original-page">
          <ProjectHero page={page} image={heroImage} />
          {plan.opening?.length ? (
            <NaturalMediaGroup
              images={imagesByIndexes(page, plan.opening)}
              label={`${displayTitle(page)} opening images`}
              layout="opening"
              linkTo={projectPath(page.slug)}
            />
          ) : null}
          <SectionFlow page={page} sections={sections} plan={plan} usedImageIndexes={usedImageIndexes} />
          {plan.closing?.length ? (
            <NaturalMediaGroup
              images={imagesByIndexes(page, plan.closing)}
              label={`${displayTitle(page)} additional images`}
              layout="dense"
              linkTo={projectPath(page.slug)}
            />
          ) : null}
          <MediaFlow page={page} />
          <NextProjectNav currentSlug={page.slug} />
        </article>
      </Shell>
    </>
  );
}

function ProjectHero({ page, image }) {
  const showHeroSummary = !(page.slug in importantPageImagePlan);

  return (
    <section className="original-page-hero original-page-hero-natural">
      {image ? <img src={image.src} alt={imageAlt(image, displayTitle(page))} fetchPriority="high" /> : null}
      <div className="original-page-hero-copy">
        <p className="eyebrow">{displayGroup(page)}</p>
        <h1>{displayTitle(page)}</h1>
        {showHeroSummary && page.summary && isUsefulText(page.summary) ? <p>{page.summary}</p> : null}
      </div>
    </section>
  );
}

function getSections(page) {
  const seen = new Set();
  const sections = [];

  for (const section of page.sections || []) {
    const title = cleanText(section.title || "");
    const items = (section.items || [])
      .map(cleanText)
      .filter((item) => isUsefulText(item) && item.toLowerCase() !== title.toLowerCase());
    const key = `${title}:${items.join("|")}`;

    if (!title && !items.length) continue;
    if (seen.has(key)) continue;
    seen.add(key);
    sections.push({ title, items });
  }

  if (sections.length) return sections;

  const blocks = (page.textBlocks || []).map((block) => cleanText(block.text)).filter(isUsefulText);
  return blocks.length ? [{ title: "Overview", items: blocks }] : [];
}

function SectionFlow({ page, sections, plan, usedImageIndexes }) {
  const remainingImages = (page.images || [])
    .map((image, index) => ({ image, index }))
    .filter(({ index }) => index !== (plan.hero ?? 0) && !usedImageIndexes.has(index));

  let remainingCursor = 0;

  return (
    <div className="section-flow">
      {sections.map((section, index) => {
        const plannedImages = imagesByIndexes(page, plan.sections?.[index] || []);
        const fallbackImages =
          plannedImages.length || page.slug in importantPageImagePlan
            ? []
            : remainingImages.slice(remainingCursor, remainingCursor + imageCountForSection(index, sections.length, remainingImages.length));

        remainingCursor += fallbackImages.length;

        return (
          <section className="original-section" key={`${section.title}-${index}`}>
            <div className="original-section-copy">
              {section.title ? <h2>{section.title}</h2> : null}
              {section.items.map((item) => (
                <p key={item}>{publicText(item)}</p>
              ))}
            </div>
            {plannedImages.length || fallbackImages.length ? (
              <NaturalMediaGroup
                images={plannedImages.length ? plannedImages : fallbackImages.map(({ image }) => image)}
                label={`${displayTitle(page)} ${section.title || "project"} images`}
                layout={plannedImages.length > 3 || fallbackImages.length > 3 ? "dense" : "paired"}
                linkTo={projectPath(page.slug)}
              />
            ) : null}
          </section>
        );
      })}
      {remainingImages.slice(remainingCursor).length && !(page.slug in importantPageImagePlan) ? (
        <NaturalMediaGroup
          images={remainingImages.slice(remainingCursor).map(({ image }) => image)}
          label={`${displayTitle(page)} additional images`}
          layout="dense"
          linkTo={projectPath(page.slug)}
        />
      ) : null}
    </div>
  );
}

function imageCountForSection(index, sectionCount, imageCount) {
  if (!imageCount || !sectionCount) return 0;
  const base = Math.floor(imageCount / sectionCount);
  const extra = index < imageCount % sectionCount ? 1 : 0;
  return Math.min(4, base + extra);
}

function imagesByIndexes(page, indexes = []) {
  return indexes.map((index) => page.images?.[index]).filter(Boolean);
}

function NaturalMediaGroup({ images, label, layout = "paired", linkTo }) {
  if (!images.length) return null;

  return (
    <div className={`natural-media-group natural-media-${layout}`} aria-label={label}>
      {images.map((image, index) => {
        const figure = (
          <figure className="natural-media" key={`${image.src}-${index}`}>
            <img src={image.src} alt={imageAlt(image, label)} loading="lazy" />
            {isUsefulText(image.caption) ? <figcaption>{image.caption}</figcaption> : null}
          </figure>
        );

        return linkTo ? (
          <Link className="natural-media-link" to={linkTo} key={`${image.src}-${index}`}>
            {figure}
          </Link>
        ) : (
          figure
        );
      })}
    </div>
  );
}

function MediaFlow({ page }) {
  const media = page.media || [];
  if (!media.length) return null;

  return (
    <section className="original-section">
      <div className="original-section-copy">
        <h2>Motion</h2>
      </div>
      <div className="natural-media-group natural-media-paired">
        {media.map((item) => (
          <figure className="natural-media" key={item.src}>
            {item.kind === "video" ? (
              <video src={item.src} controls playsInline preload="metadata" />
            ) : (
              <a href={item.src} target="_blank" rel="noreferrer">
                Open media
              </a>
            )}
          </figure>
        ))}
      </div>
    </section>
  );
}

function OriginalTextFlow({ page, skipHero = false }) {
  const sections = getSections(page).filter((section) => isUsefulText(section.title));
  if (!sections.length) return null;

  return (
    <section className="home-text-flow">
      {!skipHero ? <h2>{displayTitle(page)}</h2> : null}
      {sections.slice(0, 4).map((section) => (
        <article key={section.title}>
          <h3>{section.title}</h3>
          {section.items.slice(0, 2).map((item) => (
            <p key={item}>{publicText(item)}</p>
          ))}
        </article>
      ))}
    </section>
  );
}

function NextProjectNav({ currentSlug }) {
  const orderedSlugs = [...homeCards.map((card) => card.slug), ...moreProjectCards.map((card) => card.slug)];
  const uniqueSlugs = [...new Set(orderedSlugs)].filter(isRenderableSlug);
  const currentIndex = uniqueSlugs.indexOf(currentSlug);
  const nextSlug = uniqueSlugs[(currentIndex + 1 + uniqueSlugs.length) % uniqueSlugs.length] || uniqueSlugs[0];
  const prevSlug = uniqueSlugs[(currentIndex - 1 + uniqueSlugs.length) % uniqueSlugs.length] || uniqueSlugs[0];

  if (!nextSlug || currentIndex === -1) {
    return (
      <nav className="project-next-nav" aria-label="Project navigation">
        <Link to="/more-projects">More Projects</Link>
      </nav>
    );
  }

  return (
    <nav className="project-next-nav" aria-label="Project navigation">
      <Link to={projectPath(prevSlug)}>Previous</Link>
      <Link to="/work">Work</Link>
      <Link to={projectPath(nextSlug)}>Next</Link>
    </nav>
  );
}

function StudioPage() {
  const page = pageBySlug("sol-seven-studios") || pageBySlug("solshop");
  if (!page) return <Navigate to="/shop" replace />;

  return <OriginalPageView page={page} canonicalPath="/studio" />;
}

function ShopPage() {
  const page = pageBySlug("solshop") || pageBySlug("shop");
  return (
    <>
      <Seo
        title="Shop"
        pathname="/shop"
        description="Sol Seven Studios shop objects by Ethan Solodukhin."
        image={cardImage(shopCards[0])?.src}
      />
      <Shell>
        <GalleryIntro
          eyebrow="Shop"
          title="Sol Seven Studios objects."
          body="Printed objects, posters, and SOL forms from Ethan's studio work."
        />
        <ProjectGallery cards={shopCards} />
        {page ? <OriginalTextFlow page={page} /> : null}
      </Shell>
    </>
  );
}

function AboutPage() {
  const page = pageBySlug("resume");
  const portrait = page?.images?.[0] || imageAt("home", 0);

  return (
    <>
      <Seo title="About" pathname="/about" description="About Ethan Solodukhin." image={portrait?.src} />
      <Shell>
        <section className="about-page">
          <div className="about-copy">
            <p className="eyebrow">About</p>
            <h1>Ethan Solodukhin</h1>
            <p>
              Industrial designer working across furniture, lighting, additive manufacturing,
              visual development, and physical product concepts.
            </p>
            <div className="button-row">
              <a className="glass-button" href={contactLinks.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
              <Link className="glass-button" to="/contact">
                Contact
              </Link>
            </div>
          </div>
          {portrait ? (
            <figure className="about-media">
              <img src={portrait.src} alt={imageAlt(portrait, "Ethan Solodukhin")} />
            </figure>
          ) : null}
        </section>
        {page ? <OriginalTextFlow page={page} /> : null}
      </Shell>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <Seo title="Contact" pathname="/contact" description="Contact Ethan Solodukhin." />
      <Shell>
        <section className="contact-page">
          <p className="eyebrow">Contact</p>
          <h1>Reach out for industrial design roles, studio work, and project conversations.</h1>
          <div className="contact-grid">
            <a href={contactLinks.portfolio} target="_blank" rel="noreferrer">
              <span>Portfolio</span>
              ethansolodukhin.com
            </a>
            <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
              <span>LinkedIn</span>
              ethan-solodukhin
            </a>
            <a href={contactLinks.email}>
              <span>Email</span>
              {contactLinks.emailLabel}
            </a>
            <a href={contactLinks.phone}>
              <span>Phone</span>
              {contactLinks.phoneLabel}
            </a>
          </div>
        </section>
      </Shell>
    </>
  );
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<FeaturedCaseRoute />} />
        <Route path="/more-projects" element={<MoreProjectsPage />} />
        <Route path="/more-projects/:slug" element={<FeaturedCaseRoute />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/archive" element={<Navigate to="/more-projects" replace />} />
        <Route path="/archive/:slug" element={<FeaturedCaseRoute />} />
        <Route path="/design-language" element={<Navigate to="/studio" replace />} />
        <Route path="/process" element={<Navigate to="/work" replace />} />
        <Route path="/:slug" element={<OriginalSlugRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
