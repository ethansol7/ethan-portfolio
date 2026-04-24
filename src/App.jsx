import { useEffect } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  aboutHighlights,
  contactLinks,
  featuredProjects,
  projectMap,
  siteMeta,
} from "./data/portfolio";
import { sourcePageGroups, sourcePageMap, sourcePages } from "./data/sourcePages";
import { localAssetCollections } from "./data/localAssets";

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

const originalPageAliases = {
  "sol-lamp-system": "s01",
  "sol-seven-studios": "sol-seven-studios",
  plastivista: "old-revo-chair-page",
  "revo-chair": "3d-printing-service",
  "sol-wheel": "sol-wheel",
  "autodesk-origin": "autodesk-origin",
};

const sourceSlugToLocalKey = {
  "sol-lamp": "sol-lamp-system",
  s01: "sol-lamp-system",
  s01test: "sol-lamp-system",
  "s01-shop": "sol-lamp-system",
  sol: "sol-lamp-system",
  "sol-seven-studios": "sol-seven-studios",
  "3d-printing-service": "revo-chair",
  "old-revo-chair-page": "revo-chair",
  "sol-wheel": "sol-wheel",
  "autodesk-origin": "autodesk-origin",
  nomad: "nomad",
  "et-03": "et-03",
  "shelf-mate-2024": "shelf-mate",
  arizonaconcept: "arizona-can-redesign",
  "arizona-can-redesign": "arizona-can-redesign",
  furniture: "furniture",
  "every-day-render-challenge": "render-challenge",
};

const hiddenGallerySlugs = new Set(["home-2", "home-3"]);

const portfolioPages = sourcePages.filter((page) => !hiddenGallerySlugs.has(page.slug));

const boilerplatePattern =
  /^(www\.ethansolodukhin\.com|\(c\)\s*\d{4}\s*ethan solodukhin\.?\s*all rights reserved\.?|©\s*\d{4}\s*ethan solodukhin\.?\s*all rights reserved\.?|all rights reserved\.?|home|work|more projects|about|contact|shop|cart|filters|no results found|no results match your search\.?\s*try removing a few filters\.?)$/i;

function projectPath(slug) {
  if (!slug || slug === "home") return "/";
  return `/${slug}`;
}

function featuredProjectPath(project) {
  return projectPath(originalPageAliases[project.slug] || project.slug);
}

function cleanPageTitle(title = "") {
  return title
    .replace(/\s+-\s+Ethan Solodukhin\s*$/i, "")
    .replace(/\s+-\s+Sol Shop\s*$/i, "")
    .trim();
}

function cleanGroupName(group = "") {
  if (group === "Legacy + Utility") return "Resume + Contact";
  if (group === "Project Archive") return "Projects";
  return group;
}

function isBoilerplateText(value = "") {
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (boilerplatePattern.test(trimmed)) return true;
  return false;
}

function isFallbackSummary(value = "") {
  return value.trim().toLowerCase() === "project notes and visuals.";
}

function getCleanBlocks(page) {
  const seen = new Set();

  return (page?.textBlocks || []).filter((block) => {
    const text = block.text?.trim();
    if (!text || isBoilerplateText(text)) return false;
    const key = `${block.level}:${text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getPageLead(page, fallback = "") {
  if (page?.summary && !isFallbackSummary(page.summary) && !isBoilerplateText(page.summary)) {
    return page.summary;
  }

  const firstBody = getCleanBlocks(page).find(
    (block) => block.type !== "heading" && block.text.length > 34,
  );
  if (firstBody) return firstBody.text;

  const firstHeading = getCleanBlocks(page).find((block) => block.type === "heading");
  if (firstHeading) return firstHeading.text;

  return fallback || "Industrial design work by Ethan Solodukhin.";
}

function getLocalAssetsForSlug(slug) {
  return localAssetCollections[sourceSlugToLocalKey[slug] || slug] || null;
}

function groupBlocksIntoSections(blocks, fallbackTitle) {
  const sections = [];
  let current = null;

  for (const block of blocks) {
    if (block.type === "heading") {
      if (current && (current.title || current.items.length)) sections.push(current);
      current = { title: block.text, level: block.level, items: [] };
    } else {
      if (!current) current = { title: fallbackTitle || "", level: "p", items: [] };
      if (!current.items.includes(block.text)) current.items.push(block.text);
    }
  }

  if (current && (current.title || current.items.length)) sections.push(current);

  if (!sections.length && fallbackTitle) {
    sections.push({ title: fallbackTitle, level: "h1", items: [] });
  }

  return sections;
}

function distributeImages(images, sectionCount) {
  const buckets = Array.from({ length: Math.max(sectionCount, 1) }, () => []);
  if (!images.length) return buckets;

  images.forEach((image, index) => {
    const bucketIndex = sectionCount
      ? Math.min(sectionCount - 1, Math.floor((index / images.length) * sectionCount))
      : 0;
    buckets[bucketIndex].push(image);
  });

  return buckets;
}

function imageAlt(image, fallback) {
  return image.alt || image.caption || image.title || fallback || "Portfolio image";
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
      <Link className="wordmark" to="/">
        Ethan Solodukhin
      </Link>
      <nav className="nav" aria-label="Primary navigation">
        {links.map(([to, label]) => (
          <NavLink
            key={to}
            className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}
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
        <p className="eyebrow">Industrial Design</p>
        <p className="footer-copy">
          Furniture, lighting, digital fabrication, circular products, and founder-led studio work.
        </p>
      </div>
      <div className="footer-links">
        <Link to="/shop">Shop</Link>
        <Link to="/design-language">Design Language</Link>
        <Link to="/process">Process</Link>
        <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={contactLinks.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
    </footer>
  );
}

function HomePage() {
  const homePage = sourcePageMap.home;
  const homeBlocks = getCleanBlocks(homePage);
  const heroQuote = homeBlocks.find((block) => block.type === "heading")?.text;
  const homeCards = buildHomeCards(homePage);

  return (
    <>
      <Seo pathname="/" />
      <Shell>
        <section className="home-hero">
          <div className="home-hero-copy">
            <p className="eyebrow">Industrial Design Portfolio</p>
            <h1>Ethan Solodukhin</h1>
            <p className="home-statement">
              Industrial designer working across furniture, lighting, circular products,
              digital fabrication, and hands-on product development.
            </p>
            {heroQuote ? <p className="lede">{heroQuote}</p> : null}
            <div className="hero-actions">
              <Link className="button button-primary" to="/work">
                View Work
              </Link>
              <Link className="button button-secondary" to="/studio">
                Sol Seven Studios
              </Link>
              <Link className="button button-secondary" to="/contact">
                Contact
              </Link>
            </div>
          </div>
          <div className="home-hero-media" aria-label="Selected portfolio imagery">
            {(homePage?.images || []).slice(0, 5).map((image, index) => (
              <Link
                className={`home-media-tile home-media-tile-${index + 1}`}
                key={`${image.src}-${index}`}
                to={inferProjectPathFromImage(image, index)}
              >
                <img src={image.src} alt={imageAlt(image, "Selected Ethan Solodukhin project")} />
              </Link>
            ))}
          </div>
        </section>

        <section className="portfolio-section">
          <div className="section-header section-header-row">
            <div>
              <p className="eyebrow">Home</p>
              <h2>Selected projects</h2>
            </div>
            <Link className="inline-link" to="/more-projects">
              More Projects
            </Link>
          </div>
          <div className="original-home-grid">
            {homeCards.map((card, index) => (
              <Link className="portfolio-card original-home-card" to={card.path} key={`${card.title}-${index}`}>
                <div className="portfolio-card-media">
                  {card.image ? <img src={card.image.src} alt={imageAlt(card.image, card.title)} /> : null}
                </div>
                <div className="portfolio-card-body">
                  {card.meta ? <span className="portfolio-kicker">{card.meta}</span> : null}
                  <h3>{card.title}</h3>
                  {card.description ? <p>{card.description}</p> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Shell>
    </>
  );
}

function buildHomeCards(homePage) {
  const blocks = getCleanBlocks(homePage);
  const cards = [];
  let current = null;

  for (const block of blocks) {
    if (block.type === "heading") {
      if (current) cards.push(current);
      current = { title: block.text.replace(/^['"]|['"]$/g, ""), text: [] };
    } else if (current) {
      current.text.push(block.text);
    }
  }
  if (current) cards.push(current);

  return cards
    .filter((card) => card.title && !/^bold comfort/i.test(card.title))
    .slice(0, 14)
    .map((card, index) => ({
      title: card.title,
      meta: card.text.find((item) => /\d{4}|present|semester|created/i.test(item)) || "",
      description: card.text.find((item) => item.length > 8 && !/\d{4}/.test(item)) || "",
      image: homePage?.images?.[index + 1] || homePage?.images?.[index],
      path: inferProjectPathFromTitle(card.title),
    }));
}

function inferProjectPathFromTitle(title = "") {
  const value = title.toLowerCase();
  if (value.includes("revo") || value.includes("plasti")) return "/old-revo-chair-page";
  if (value.includes("sol wheel") || value.includes("steam")) return "/sol-wheel";
  if (value.includes("logo")) return "/logo-development";
  if (value.includes("9ine")) return "/the-9ine-light";
  if (value.includes("bungis") || value.includes("danish")) return "/denmark-summer-2024";
  if (value.includes("collection") || value.includes("furniture")) return "/furniture";
  if (value.includes("apartment")) return "/concept-room";
  if (value.includes("sol")) return "/sol";
  return "/more-projects";
}

function inferProjectPathFromImage(image, index) {
  const path = image.localPath || image.src || "";
  if (path.includes("autodesk-origin")) return "/autodesk-origin";
  if (path.includes("sol-wheel")) return "/sol-wheel";
  if (path.includes("3d-printing-service") || path.includes("old-revo")) return "/old-revo-chair-page";
  if (path.includes("furniture")) return "/furniture";
  if (index === 0) return "/about";
  return "/more-projects";
}

function WorkPage() {
  return (
    <>
      <Seo
        title="Work"
        pathname="/work"
        description="Selected industrial design projects by Ethan Solodukhin."
      />
      <Shell>
        <section className="page-intro editorial-intro">
          <p className="eyebrow">Work</p>
          <h1>Selected industrial design projects.</h1>
          <p className="lede">
            Furniture, lighting, product development, circular materials, fabrication, and
            visual design work.
          </p>
        </section>
        <div className="work-gallery">
          {featuredProjects.map((project, index) => (
            <Link
              className={`feature-row feature-row-${index % 3}`}
              key={project.slug}
              to={featuredProjectPath(project)}
            >
              <div className="feature-row-media">
                <img src={project.cardImage} alt={project.cardAlt} />
              </div>
              <div className="feature-row-copy">
                <div className="project-meta">
                  <span>{project.year}</span>
                  <span>{project.category}</span>
                </div>
                <h2>{project.title}</h2>
                <p>{project.oneLiner}</p>
                <span className="inline-link">Open Project</span>
              </div>
            </Link>
          ))}
        </div>
      </Shell>
    </>
  );
}

function MoreProjectsPage() {
  const groupedPages = Object.entries(sourcePageGroups)
    .map(([group, pages]) => [
      cleanGroupName(group),
      pages.filter((page) => portfolioPages.some((item) => item.slug === page.slug)),
    ])
    .filter(([, pages]) => pages.length);

  return (
    <>
      <Seo
        title="More Projects"
        pathname="/more-projects"
        description="Additional industrial design, furniture, lighting, visualization, and studio work by Ethan Solodukhin."
      />
      <Shell>
        <section className="page-intro editorial-intro">
          <p className="eyebrow">More Projects</p>
          <h1>Additional work, objects, studies, and collections.</h1>
          <p className="lede">
            A broader view of Ethan&apos;s product, furniture, lighting, visual design, and
            studio explorations.
          </p>
        </section>

        {groupedPages.map(([group, items]) => (
          <section className="portfolio-section more-projects-section" key={group}>
            <div className="section-header">
              <p className="eyebrow">{group}</p>
              <h2>{group}</h2>
            </div>
            <div className="portfolio-grid">
              {items.map((page) => (
                <PortfolioPageCard page={page} key={`${page.slug}-${page.sourceUrl}`} />
              ))}
            </div>
          </section>
        ))}
      </Shell>
    </>
  );
}

function PortfolioPageCard({ page }) {
  return (
    <Link className="portfolio-card" to={projectPath(page.slug)}>
      <div className="portfolio-card-media">
        {page.heroImage ? (
          <img src={page.heroImage} alt={imageAlt(page.images?.[0] || {}, cleanPageTitle(page.title))} loading="lazy" />
        ) : (
          <div className="portfolio-card-empty">
            <span>{cleanGroupName(page.group)}</span>
          </div>
        )}
      </div>
      <div className="portfolio-card-body">
        <span className="portfolio-kicker">{cleanGroupName(page.group)}</span>
        <h3>{cleanPageTitle(page.title)}</h3>
        <p>{getPageLead(page)}</p>
      </div>
    </Link>
  );
}

function FeaturedCaseRoute() {
  const { slug } = useParams();
  const project = projectMap[slug];
  const pageSlug = originalPageAliases[slug];
  const page = pageSlug ? sourcePageMap[pageSlug] : null;

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  if (!page) {
    return <ProjectOnlyPage project={project} />;
  }

  return <PortfolioPageView page={page} project={project} canonicalPath={`/work/${slug}`} />;
}

function ProjectOnlyPage({ project }) {
  return (
    <>
      <Seo
        title={project.title}
        pathname={`/work/${project.slug}`}
        description={project.oneLiner}
        image={project.cardImage}
      />
      <Shell>
        <article className="portfolio-page">
          <section className="portfolio-hero">
            <div className="portfolio-hero-copy">
              <p className="eyebrow">{project.category}</p>
              <h1>{project.title}</h1>
              <p className="lede">{project.oneLiner}</p>
            </div>
            <div className="portfolio-hero-media">
              <img src={project.heroImage} alt={project.heroAlt} />
            </div>
          </section>
          <section className="fact-strip">
            <Fact label="Role" value={project.role} />
            <Fact label="Timeline" value={project.timeline} />
            <Fact label="Tools" value={project.tools.join(", ")} />
            <Fact label="Skills" value={project.skills.join(", ")} />
          </section>
          <div className="project-gallery">
            {project.gallery.map((asset) => (
              <figure className="media-figure" key={asset.src}>
                <img src={asset.src} alt={asset.alt} />
                <figcaption>{asset.caption}</figcaption>
              </figure>
            ))}
          </div>
        </article>
      </Shell>
    </>
  );
}

function OriginalSlugRoute() {
  const { slug } = useParams();
  const page = sourcePageMap[slug];

  if (!page) return <Navigate to="/more-projects" replace />;
  if (slug === "sol-seven-studios") return <StudioPage canonicalPath="/sol-seven-studios" />;
  if (slug === "shop" || slug === "solshop") return <ShopPage page={page} />;

  return <PortfolioPageView page={page} />;
}

function PortfolioPageView({ page, project, canonicalPath }) {
  const cleanTitle = cleanPageTitle(page.title);
  const localCollection = getLocalAssetsForSlug(page.slug);
  const heroImage = page.heroImage || project?.heroImage || page.images?.[0]?.src;
  const pagePath = canonicalPath || projectPath(page.slug);

  return (
    <>
      <Seo
        title={project?.title || cleanTitle}
        pathname={pagePath}
        description={getPageLead(page, project?.oneLiner)}
        image={heroImage}
      />
      <Shell>
        <article className="portfolio-page">
          <section className="portfolio-hero">
            <div className="portfolio-hero-copy">
              <p className="eyebrow">{project?.category || cleanGroupName(page.group)}</p>
              <h1>{project?.title || cleanTitle}</h1>
              <p className="lede">{getPageLead(page, project?.oneLiner)}</p>
              {project ? (
                <div className="fact-strip compact-facts">
                  <Fact label="Role" value={project.role} />
                  <Fact label="Timeline" value={project.timeline} />
                  <Fact label="Tools" value={project.tools.join(", ")} />
                </div>
              ) : null}
            </div>
            {heroImage ? (
              <Link className="portfolio-hero-media" to={pagePath}>
                <img src={heroImage} alt={imageAlt(page.images?.[0] || {}, cleanTitle)} />
              </Link>
            ) : null}
          </section>

          <OriginalFlow page={page} currentPath={pagePath} fallbackTitle={project?.title || cleanTitle} />
          <ProjectMedia media={page.media} />
          <ProcessMediaSection collection={localCollection} currentPath={pagePath} />
          <NextProjectNav items={portfolioPages} currentSlug={page.slug} basePath="" />
        </article>
      </Shell>
    </>
  );
}

function OriginalFlow({ page, currentPath, fallbackTitle }) {
  const sections = groupBlocksIntoSections(getCleanBlocks(page), fallbackTitle);
  const images = (page.images || []).filter((image, index) => index !== 0 || page.images.length < 3);
  const buckets = distributeImages(images, sections.length);

  if (!sections.length && !images.length) return null;

  if (!sections.length) {
    return (
      <section className="project-gallery">
        <MediaGroup images={images} currentPath={currentPath} title={fallbackTitle} />
      </section>
    );
  }

  return (
    <div className="original-flow">
      {sections.map((section, index) => (
        <section
          className={`flow-section flow-section-${index % 4}${buckets[index]?.length ? " has-media" : ""}`}
          key={`${section.title || fallbackTitle}-${index}`}
        >
          <div className="flow-copy">
            {section.title ? <h2>{section.title}</h2> : null}
            {section.items.map((item, itemIndex) => (
              <p key={`${item}-${itemIndex}`}>{item}</p>
            ))}
          </div>
          {buckets[index]?.length ? (
            <MediaGroup images={buckets[index]} currentPath={currentPath} title={section.title || fallbackTitle} />
          ) : null}
        </section>
      ))}
    </div>
  );
}

function MediaGroup({ images, currentPath, title }) {
  if (!images?.length) return null;

  return (
    <div className={`media-group media-count-${Math.min(images.length, 6)}`}>
      {images.map((image, index) => (
        <Link
          className={`media-figure ${index === 0 && images.length > 2 ? "media-figure-large" : ""}`}
          key={`${image.src}-${index}`}
          to={currentPath}
        >
          <img src={image.src} alt={imageAlt(image, title)} loading="lazy" />
          {image.caption || image.title ? <span>{image.caption || image.title}</span> : null}
        </Link>
      ))}
    </div>
  );
}

function ProjectMedia({ media }) {
  if (!media?.length) return null;

  return (
    <section className="portfolio-section">
      <div className="section-header">
        <p className="eyebrow">Motion</p>
        <h2>Video and interactive studies</h2>
      </div>
      <div className="asset-link-grid">
        {media.map((item) => (
          <MediaTile item={item} key={item.url} />
        ))}
      </div>
    </section>
  );
}

function MediaTile({ item }) {
  if (item.kind === "video") {
    return (
      <article className="media-tile">
        <video src={item.src} controls muted playsInline preload="metadata" />
        <span>Video</span>
      </article>
    );
  }

  return (
    <a className="media-tile media-link" href={item.src} target="_blank" rel="noreferrer">
      <span>{item.kind === "animation" ? "Motion Study" : "Project File"}</span>
      <strong>{item.url.split("/").pop()?.split("?")[0] || "Open file"}</strong>
    </a>
  );
}

function ProcessMediaSection({ collection, currentPath }) {
  if (!collection) return null;
  const hasAssets = collection.images.length || collection.videos.length || collection.models.length;
  if (!hasAssets) return null;

  return (
    <section className="portfolio-section process-media-section">
      <div className="section-header">
        <p className="eyebrow">Process Media</p>
        <h2>Sketches, renders, prototypes, and model files.</h2>
      </div>

      {collection.images.length ? (
        <MediaGroup
          images={collection.images.slice(0, 18)}
          currentPath={currentPath}
          title={collection.title}
        />
      ) : null}

      {collection.videos.length || collection.models.length ? (
        <div className="asset-link-grid">
          {collection.videos.map((video) => (
            <article className="media-tile" key={video.src}>
              <video src={video.src} controls muted playsInline preload="metadata" />
              <span>Video</span>
              <strong>{video.name}</strong>
            </article>
          ))}
          {collection.models.map((model) => (
            <a className="media-tile media-link" href={model.src} target="_blank" rel="noreferrer" key={model.src}>
              <span>3D Model</span>
              <strong>{model.name}</strong>
            </a>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function NextProjectNav({ items, currentSlug, basePath }) {
  const currentIndex = items.findIndex((item) => item.slug === currentSlug);
  if (currentIndex < 0 || items.length < 2) return null;

  const previous = items[(currentIndex - 1 + items.length) % items.length];
  const next = items[(currentIndex + 1) % items.length];
  const makePath = (item) => (basePath ? `${basePath}/${item.slug}` : projectPath(item.slug));

  return (
    <nav className="next-project-nav" aria-label="Project navigation">
      <Link to={makePath(previous)}>
        <span>Previous</span>
        <strong>{cleanPageTitle(previous.title)}</strong>
      </Link>
      <Link to={makePath(next)}>
        <span>Next</span>
        <strong>{cleanPageTitle(next.title)}</strong>
      </Link>
    </nav>
  );
}

function StudioPage({ canonicalPath = "/studio" }) {
  const studio = sourcePageMap["sol-seven-studios"];
  const sol = sourcePageMap.s01 || sourcePageMap.sol;
  const shop = sourcePageMap.shop || sourcePageMap.solshop;
  const revo = sourcePageMap["old-revo-chair-page"];
  const heroImage = studio?.heroImage || studio?.images?.[0]?.src;

  return (
    <>
      <Seo
        title="Sol Seven Studios"
        pathname={canonicalPath}
        description="Sol Seven Studios by Ethan Solodukhin."
        image={heroImage}
      />
      <Shell>
        <article className="portfolio-page studio-page">
          <section className="portfolio-hero studio-hero">
            <div className="portfolio-hero-copy">
              <p className="eyebrow">Studio</p>
              <h1>Sol Seven Studios</h1>
              <p className="lede">Bold comfort, playful purpose, lasting impact.</p>
              <div className="hero-actions">
                <Link className="button button-primary" to="/design-language">
                  Design Language
                </Link>
                <Link className="button button-secondary" to="/shop">
                  Shop
                </Link>
              </div>
            </div>
            {heroImage ? (
              <Link className="portfolio-hero-media" to="/sol-seven-studios">
                <img src={heroImage} alt="Sol Seven Studios" />
              </Link>
            ) : null}
          </section>

          <section className="portfolio-section studio-values">
            {["Bold comfort", "Playful purpose", "Lasting impact"].map((value) => (
              <article className="glass-panel" key={value}>
                <h2>{value}</h2>
              </article>
            ))}
          </section>

          <section className="portfolio-section">
            <div className="section-header">
              <p className="eyebrow">Approach</p>
              <h2>Products with a clear point of view.</h2>
              <p>
                Sol Seven Studios connects lighting, furniture, printed objects, and circular
                material experiments through a shared visual language and hands-on production.
              </p>
            </div>
            <div className="portfolio-grid">
              {[sol, revo, shop].filter(Boolean).map((page) => (
                <PortfolioPageCard page={page} key={page.slug} />
              ))}
            </div>
          </section>

          {studio ? <OriginalFlow page={studio} currentPath="/sol-seven-studios" fallbackTitle="Sol Seven Studios" /> : null}
        </article>
      </Shell>
    </>
  );
}

function DesignLanguagePage() {
  const s01 = sourcePageMap.s01;
  const s01test = sourcePageMap.s01test;
  const studio = sourcePageMap["sol-seven-studios"];
  const images = [
    ...(s01?.images || []),
    ...(s01test?.images || []),
    ...(studio?.images || []),
    ...(localAssetCollections["sol-lamp-system"]?.images || []),
  ].slice(0, 16);

  return (
    <>
      <Seo
        title="Design Language"
        pathname="/design-language"
        description="SOL design language by Ethan Solodukhin."
        image={images[0]?.src}
      />
      <Shell>
        <article className="portfolio-page">
          <section className="page-intro editorial-intro">
            <p className="eyebrow">Design Language</p>
            <h1>SOL objects are built around modularity, shared parts, and a soft sculptural glow.</h1>
            <p className="lede">
              A concise look at the SOL family: magnetic shade changes, repeated silhouettes,
              sustainable PETG, and calm lighting forms that can expand across products.
            </p>
          </section>
          <section className="language-grid">
            {[
              ["Modularity", "Shades and bases are treated as interchangeable pieces rather than fixed forms."],
              ["Shared Components", "Repeated proportions, ribs, and connection details make the family feel related."],
              ["SOL X Logic", "Future electrical layouts can support clearer assembly, repair, and product variation."],
              ["Visual Family", "Rounded forms, soft diffusion, and subtle texture keep the work calm and recognizable."],
            ].map(([title, body]) => (
              <article className="glass-panel" key={title}>
                <h2>{title}</h2>
                <p>{body}</p>
              </article>
            ))}
          </section>
          <section className="portfolio-section">
            <MediaGroup images={images} currentPath="/design-language" title="SOL design language" />
          </section>
        </article>
      </Shell>
    </>
  );
}

function ProcessPage() {
  const processSteps = [
    {
      title: "Sketch",
      page: sourcePageMap["old-revo-chair-page"],
      image: localAssetCollections["sol-lamp-system"]?.images?.[0],
    },
    {
      title: "CAD",
      page: sourcePageMap["autodesk-origin"],
      image: sourcePageMap["autodesk-origin"]?.images?.[8],
    },
    {
      title: "Prototype",
      page: sourcePageMap["sol-wheel"],
      image: sourcePageMap["sol-wheel"]?.images?.[10],
    },
    {
      title: "Iteration",
      page: sourcePageMap["et-03"],
      image: sourcePageMap["et-03"]?.images?.[9],
    },
    {
      title: "Final",
      page: sourcePageMap["s01"] || sourcePageMap["sol-wheel"],
      image: sourcePageMap["s01"]?.images?.[0] || sourcePageMap["sol-wheel"]?.images?.[0],
    },
  ];

  return (
    <>
      <Seo
        title="Process"
        pathname="/process"
        description="Design process across Ethan Solodukhin's portfolio."
        image={processSteps[0].image?.src}
      />
      <Shell>
        <article className="portfolio-page">
          <section className="page-intro editorial-intro">
            <p className="eyebrow">Process</p>
            <h1>Sketch, CAD, prototype, iterate, finish.</h1>
            <p className="lede">
              A cross-project look at how Ethan moves from early ideas into physical products,
              renders, mechanisms, and presentation-ready outcomes.
            </p>
          </section>
          <section className="process-timeline">
            {processSteps.map((step) => (
              <Link className="process-step" to={step.page ? projectPath(step.page.slug) : "/work"} key={step.title}>
                <div className="process-step-media">
                  {step.image ? <img src={step.image.src} alt={imageAlt(step.image, step.title)} /> : null}
                </div>
                <div className="process-step-copy">
                  <span>{step.title}</span>
                  <h2>{step.page ? cleanPageTitle(step.page.title) : step.title}</h2>
                </div>
              </Link>
            ))}
          </section>
        </article>
      </Shell>
    </>
  );
}

function ShopPage({ page = sourcePageMap.shop || sourcePageMap.solshop }) {
  if (!page) return <Navigate to="/more-projects" replace />;
  return <PortfolioPageView page={page} canonicalPath="/shop" />;
}

function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        pathname="/about"
        description="About Ethan Solodukhin, industrial designer."
      />
      <Shell>
        <section className="page-intro editorial-intro">
          <p className="eyebrow">About</p>
          <h1>Industrial designer working between concept, prototype, and product.</h1>
          <p className="lede">
            Ethan Solodukhin studies Industrial Design at RIT and works across furniture,
            lighting, circular products, fabrication, CAD, rendering, and physical prototyping.
          </p>
        </section>
        <section className="section section-split">
          <div className="bio-card">
            <img src={featuredProjects[1].cardImage} alt="Ethan Solodukhin seated on the Revo chair." />
          </div>
          <div className="bio-copy">
            <p>
              The work moves between independent product launches, studio experiments,
              competition projects, and fabrication-heavy development. Across the portfolio,
              the focus is on making objects that can be built, tested, refined, and presented
              clearly.
            </p>
            <p>
              Ethan has worked with digital fabrication, additive manufacturing, product
              visualization, circular materials, packaging concepts, furniture, and lighting.
            </p>
            <div className="hero-actions">
              <a className="button button-secondary" href={contactLinks.resume} target="_blank" rel="noreferrer">
                View Resume
              </a>
              <Link className="button button-secondary" to="/contact">
                Contact
              </Link>
            </div>
          </div>
        </section>
        <section className="portfolio-section">
          <div className="section-header">
            <p className="eyebrow">Highlights</p>
            <h2>Selected experience and recognition.</h2>
          </div>
          <div className="mini-grid">
            {aboutHighlights.map((item) => (
              <article className="mini-card text-only-card" key={item.title}>
                <div className="mini-card-body">
                  <span className="portfolio-kicker">{item.label}</span>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </Shell>
    </>
  );
}

function ContactPage() {
  return (
    <>
      <Seo
        title="Contact"
        pathname="/contact"
        description="Contact Ethan Solodukhin."
      />
      <Shell>
        <section className="page-intro editorial-intro">
          <p className="eyebrow">Contact</p>
          <h1>Reach out for industrial design roles, studio work, and project conversations.</h1>
          <p className="lede">
            Portfolio, resume, email, phone, and LinkedIn are collected here for easy contact.
          </p>
        </section>
        <div className="contact-grid">
          <article className="contact-card">
            <span>Portfolio</span>
            <a href={contactLinks.portfolio} target="_blank" rel="noreferrer">
              ethansolodukhin.com
            </a>
          </article>
          <article className="contact-card">
            <span>LinkedIn</span>
            <a href={contactLinks.linkedin} target="_blank" rel="noreferrer">
              ethan-solodukhin
            </a>
          </article>
          <article className="contact-card">
            <span>Email</span>
            <a href={contactLinks.email}>{contactLinks.emailLabel}</a>
          </article>
          <article className="contact-card">
            <span>Phone</span>
            <a href={contactLinks.phone}>{contactLinks.phoneLabel}</a>
          </article>
        </div>
      </Shell>
    </>
  );
}

function Fact({ label, value }) {
  return (
    <article className="fact-card">
      <span>{label}</span>
      <p>{value}</p>
    </article>
  );
}

function MoreProjectRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? projectPath(slug) : "/more-projects"} replace />;
}

function ArchiveRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? projectPath(slug) : "/more-projects"} replace />;
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
        <Route path="/more-projects/:slug" element={<MoreProjectRedirect />} />
        <Route path="/studio" element={<StudioPage />} />
        <Route path="/design-language" element={<DesignLanguagePage />} />
        <Route path="/process" element={<ProcessPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/archive" element={<ArchiveRedirect />} />
        <Route path="/archive/:slug" element={<ArchiveRedirect />} />
        <Route path="/:slug" element={<OriginalSlugRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
