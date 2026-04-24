import { useEffect } from "react";
import { Link, NavLink, Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import {
  aboutHighlights,
  contactLinks,
  featuredProjects,
  focusAreas,
  projectMap,
  recruiterSignals,
  siteMeta,
  stats,
} from "./data/portfolio";
import { crawlStats, sourcePageGroups, sourcePageMap, sourcePages } from "./data/sourcePages";
import { localAssetCollections, localAssetStats } from "./data/localAssets";

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

const sourceSlugToLocalKey = {
  "sol-lamp": "sol-lamp-system",
  s01: "sol-lamp-system",
  s01test: "sol-lamp-system",
  "s01-shop": "sol-lamp-system",
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

const featuredProjectSourceSlugs = {
  "sol-lamp-system": ["sol-lamp", "s01", "s01test", "sol"],
  "sol-seven-studios": ["sol-seven-studios", "solshop"],
  plastivista: ["old-revo-chair-page"],
  "revo-chair": ["old-revo-chair-page", "3d-printing-service"],
  "sol-wheel": ["sol-wheel"],
  "autodesk-origin": ["autodesk-origin"],
};

function getLocalAssetsForSlug(slug) {
  return localAssetCollections[sourceSlugToLocalKey[slug] || slug] || null;
}

function getFeaturedSourcePages(slug) {
  return (featuredProjectSourceSlugs[slug] || [slug])
    .map((sourceSlug) => sourcePageMap[sourceSlug])
    .filter(Boolean);
}

function getSourcePageLead(page) {
  return (
    page.summary ||
    page.sections?.flatMap((section) => section.items || []).find((item) => item.length > 42) ||
    "A redesigned page from the live Squarespace portfolio with cleaner hierarchy and responsive presentation."
  );
}

function cleanPageTitle(title) {
  return title
    .replace(/\s+-\s+Ethan Solodukhin\s*$/i, "")
    .replace(/\s+-\s+Sol Shop\s*$/i, "")
    .trim();
}

const archivePages = sourcePages.filter(
  (page) => !["home-2", "home-3"].includes(page.slug),
);

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
    ["/about", "About"],
    ["/contact", "Contact"],
  ];

  return (
    <header className="site-header">
      <Link className="wordmark" to="/">
        Ethan Solodukhin
      </Link>
      <nav className="nav">
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
        <p className="eyebrow">Portfolio</p>
        <p className="footer-copy">
          Industrial design focused on modular product systems, additive manufacturing,
          circular design, and physical product development.
        </p>
      </div>
      <div className="footer-links">
        <a href={contactLinks.portfolio} target="_blank" rel="noreferrer">
          Current portfolio
        </a>
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

function Hero() {
  const heroProjects = featuredProjects.slice(0, 4);

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="eyebrow">Industrial Design Portfolio</p>
        <h1>
          Ethan Solodukhin is an industrial designer focused on modular product systems,
          additive manufacturing, circular design, and physical product development.
        </h1>
        <p className="lede">
          Built for recruiters, hiring managers, and design leads: six flagship case
          studies up front, plus a full More Projects system for every public portfolio
          page, project asset, and deeper process trail.
        </p>
        <div className="hero-actions">
          <Link className="button button-primary" to="/work">
            View featured work
          </Link>
          <Link className="button button-secondary" to="/more-projects">
            Explore More Projects
          </Link>
          <a className="button button-secondary" href={contactLinks.resume} target="_blank" rel="noreferrer">
            Download resume
          </a>
        </div>
      </div>
      <div className="hero-stack">
        {heroProjects.map((project, index) => (
          <Link
            className={`hero-card${index === 0 ? " hero-card-wide" : ""}`}
            key={project.slug}
            to={`/work/${project.slug}`}
          >
            <img src={project.cardImage} alt={project.cardAlt} />
          </Link>
        ))}
      </div>
    </section>
  );
}

function HomePage() {
  return (
    <>
      <Seo pathname="/" />
      <Shell>
        <Hero />

        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Hiring Snapshot</p>
            <h2>Immediate signals for recruiters and design leads.</h2>
          </div>
          <div className="signal-grid">
            {recruiterSignals.map((signal) => (
              <article className="signal-card" key={signal.title}>
                <span>{signal.label}</span>
                <h3>{signal.title}</h3>
                <p>{signal.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Focus Areas</p>
            <h2>Consistent through-lines across the work.</h2>
          </div>
          <div className="pill-grid">
            {focusAreas.map((area) => (
              <article className="pill-card" key={area.title}>
                <h3>{area.title}</h3>
                <p>{area.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Featured Projects</p>
            <h2>Six strongest case studies for hiring review.</h2>
          </div>
          <div className="project-grid">
            {featuredProjects.map((project) => (
              <Link className="project-card" key={project.slug} to={`/work/${project.slug}`}>
                <div className="project-card-media">
                  <img src={project.cardImage} alt={project.cardAlt} />
                </div>
                <div className="project-card-body">
                  <div className="project-meta">
                    <span>{project.year}</span>
                    <span>{project.category}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p>{project.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="section section-split">
          <div className="section-header">
            <p className="eyebrow">At A Glance</p>
            <h2>What the public portfolio now communicates faster.</h2>
          </div>
          <div className="stats-grid">
            {stats.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <strong>{stat.value}</strong>
                <p>{stat.label}</p>
                <span>{stat.context}</span>
              </article>
            ))}
          </div>
        </section>
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
        description="Featured industrial design case studies by Ethan Solodukhin."
      />
      <Shell>
        <section className="page-intro">
          <p className="eyebrow">Featured Work</p>
          <h1>Flagship case studies selected for hiring impact.</h1>
          <p className="lede">
            Each project is structured for a fast first read and a deeper second pass on
            process, prototyping, and design decisions.
          </p>
        </section>
        <div className="project-list">
          {featuredProjects.map((project) => (
            <Link className="feature-row" key={project.slug} to={`/work/${project.slug}`}>
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
                <span className="inline-link">Open case study</span>
              </div>
            </Link>
          ))}
        </div>
      </Shell>
    </>
  );
}

function SourceArchivePage() {
  const groupedPages = Object.entries(sourcePageGroups).map(([group, pages]) => [
    group,
    pages.filter((page) => archivePages.some((archivePage) => archivePage.slug === page.slug)),
  ]);

  return (
    <>
      <Seo
        title="More Projects"
        pathname="/more-projects"
        description="Complete rebuilt More Projects page with every crawled public page from ethansolodukhin.com."
      />
      <Shell>
        <section className="page-intro">
          <p className="eyebrow">More Projects</p>
          <h1>Every public portfolio page, redesigned into one clean system.</h1>
          <p className="lede">
            This full project index preserves the depth of the original site: process pages,
            final renders, shop objects, experiments, motion assets, and older studies, all
            reorganized for faster reading.
          </p>
        </section>

        <section className="section archive-metrics">
          <div className="stat-card">
            <strong>{crawlStats.recreatedPageCount}</strong>
            <p>recreated pages</p>
            <span>Rebuilt from the live portfolio structure and internal project links.</span>
          </div>
          <div className="stat-card">
            <strong>{crawlStats.downloadedAssetCount}</strong>
            <p>public assets pulled</p>
            <span>Organized into deployable media for the GitHub Pages build.</span>
          </div>
          <div className="stat-card">
            <strong>{localAssetStats.publishedImages}</strong>
            <p>expanded media assets</p>
            <span>Additional render exports, process images, videos, and source files.</span>
          </div>
        </section>

        {groupedPages.map(([group, items]) => (
          <section className="section more-projects-section" key={group}>
            <div className="section-header">
              <p className="eyebrow">{items.length} Pages</p>
              <h2>{group}</h2>
            </div>
            <div className="source-grid">
              {items.map((page) => (
                <Link className="source-card" key={`${page.slug}-${page.sourceUrl}`} to={`/more-projects/${page.slug}`}>
                  {page.heroImage ? (
                    <div className="mini-card-media">
                      <img src={page.heroImage} alt={page.images[0]?.alt || page.title} loading="lazy" />
                    </div>
                  ) : (
                    <div className="mini-card-fallback">
                      <p className="eyebrow">{page.group}</p>
                      <strong>{page.imageCount}</strong>
                    </div>
                  )}
                  <div className="mini-card-body">
                    <div className="project-meta">
                      <span>{page.imageCount} images</span>
                      <span>{page.mediaCount} media</span>
                    </div>
                    <h2>{cleanPageTitle(page.title)}</h2>
                    <p>{getSourcePageLead(page)}</p>
                    <span className="inline-link">Open project page</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </Shell>
    </>
  );
}

function AboutPage() {
  return (
    <>
      <Seo
        title="About"
        pathname="/about"
        description="About Ethan Solodukhin, an industrial designer focused on modular systems, additive manufacturing, and circular products."
      />
      <Shell>
        <section className="page-intro">
          <p className="eyebrow">About</p>
          <h1>Industrial designer building products, systems, and prototypes into clear decisions.</h1>
          <p className="lede">
            Ethan Solodukhin is an RIT industrial design student whose public work spans
            independent product launches, circular material systems, fabrication-heavy
            prototyping, and employer-facing concept development.
          </p>
        </section>
        <section className="section section-split">
          <div className="bio-card">
            <img src={featuredProjects[1].cardImage} alt="Ethan Solodukhin seated on the Revo chair." />
          </div>
          <div className="bio-copy">
            <p>
              This rebuild pulls from the current Squarespace portfolio, the public Sol Seven
              Studios site, and the public 2026 resume. The writing was tightened for speed,
              but no projects, awards, clients, or metrics were invented.
            </p>
            <p>
              The strongest through-line is the overlap between design intent and physical
              proof: additive-manufactured parts, fabrication workflows, mechanism updates,
              circular material systems, and product stories that stay grounded in how things
              would actually be made.
            </p>
            <div className="hero-actions">
              <a className="button button-secondary" href={contactLinks.resume} target="_blank" rel="noreferrer">
                View resume
              </a>
              <Link className="button button-secondary" to="/contact">
                Contact Ethan
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="section-header">
            <p className="eyebrow">Selected Highlights</p>
            <h2>Current public signals from the portfolio and resume.</h2>
          </div>
          <div className="mini-grid">
            {aboutHighlights.map((item) => (
              <article className="mini-card text-only-card" key={item.title}>
                <div className="mini-card-body">
                  <div className="project-meta">
                    <span>{item.label}</span>
                  </div>
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
        description="Contact details and portfolio links for Ethan Solodukhin."
      />
      <Shell>
        <section className="page-intro">
          <p className="eyebrow">Contact</p>
          <h1>Reach out for internships, full-time roles, freelance work, and design conversations.</h1>
          <p className="lede">
            Contact details are pulled from the live portfolio and public 2026 resume so
            hiring teams can reach Ethan without hunting through the old site.
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

function ProjectPage() {
  const { slug } = useParams();
  const project = projectMap[slug];

  if (!project) {
    return <Navigate to="/work" replace />;
  }

  const sourceDepthPages = getFeaturedSourcePages(project.slug);

  return (
    <>
      <Seo
        title={project.title}
        pathname={`/work/${project.slug}`}
        description={project.shortDescription}
        image={project.cardImage}
      />
      <Shell>
        <article className="case-study">
          <section className="case-hero">
            <div className="case-hero-copy">
              <p className="eyebrow">{project.category}</p>
              <h1>{project.title}</h1>
              <p className="lede">{project.oneLiner}</p>
            </div>
            <div className="case-hero-media">
              <img src={project.heroImage} alt={project.heroAlt} />
            </div>
          </section>

          <section className="facts-grid">
            <Fact label="Role" value={project.role} />
            <Fact label="Timeline" value={project.timeline} />
            <Fact label="Tools" value={project.tools.join(", ")} />
            <Fact label="Skills" value={project.skills.join(", ")} />
          </section>

          <section className="story-grid">
            <StorySection title="Problem" body={project.sections.problem} />
            <StorySection title="Research / Insight" body={project.sections.research} />
            <StorySection title="Concept Development" body={project.sections.concept} />
            <StorySection title="Iteration / Process" body={project.sections.iteration} />
            <StorySection title="Prototyping / Testing" body={project.sections.prototyping} />
            <StorySection title="Design Decisions" body={project.sections.decisions} />
            <StorySection title="Final Outcome" body={project.sections.outcome} />
            <StorySection title="What I Learned" body={project.sections.learned} />
          </section>

          <ProjectSourceDepth pages={sourceDepthPages} />

          <section className="gallery-grid">
            {project.gallery.map((asset) => (
              <figure className="gallery-card" key={asset.src}>
                <img src={asset.src} alt={asset.alt} />
                <figcaption>{asset.caption}</figcaption>
              </figure>
            ))}
          </section>

          <LocalAssetSection collection={getLocalAssetsForSlug(project.slug)} />
          <NextProjectNav items={featuredProjects} currentSlug={project.slug} basePath="/work" />
        </article>
      </Shell>
    </>
  );
}

function SourcePage() {
  const { slug } = useParams();
  const page = sourcePageMap[slug];

  if (!page) {
    return <Navigate to="/more-projects" replace />;
  }

  const localCollection = getLocalAssetsForSlug(page.slug);
  const primarySections = page.sections.filter((section) => section.items?.length);
  const galleryImages = page.images;

  return (
    <>
      <Seo
        title={cleanPageTitle(page.title)}
        pathname={`/more-projects/${page.slug}`}
        description={getSourcePageLead(page)}
        image={page.heroImage}
      />
      <Shell>
        <article className="source-page">
          <section className="source-hero">
            <div className="source-hero-copy">
              <p className="eyebrow">{page.group}</p>
              <h1>{cleanPageTitle(page.title)}</h1>
              <p className="lede">{getSourcePageLead(page)}</p>
              <div className="project-meta source-meta">
                <span>{page.imageCount} page images</span>
                <span>{page.mediaCount} media files</span>
                {page.lastmod ? <span>Updated {page.lastmod}</span> : null}
              </div>
              <div className="hero-actions">
                <a className="button button-secondary" href={page.sourceUrl} target="_blank" rel="noreferrer">
                  View original page
                </a>
                <Link className="button button-secondary" to="/more-projects">
                  Back to More Projects
                </Link>
              </div>
            </div>
            {page.heroImage ? (
              <div className="source-hero-media">
                <img src={page.heroImage} alt={page.images[0]?.alt || page.title} />
              </div>
            ) : null}
          </section>

          {primarySections.length ? (
            <section className="section source-story">
              <div className="section-header">
                <p className="eyebrow">Original Case Study Flow</p>
                <h2>Project text with cleaner pacing and hierarchy.</h2>
              </div>
              <div className="source-section-stack">
                {primarySections.map((section, index) => (
                  <article className="source-section" key={`${section.title}-${index}`}>
                    <h2>{section.title}</h2>
                    <div>
                      {section.items.map((item, itemIndex) => (
                        <p key={`${item}-${itemIndex}`}>{item}</p>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {galleryImages.length ? (
            <section className="section">
              <div className="section-header">
                <p className="eyebrow">Visual Story</p>
                <h2>Real imagery pulled from the original page.</h2>
              </div>
              <div className="source-gallery">
                {galleryImages.map((image, index) => (
                  <figure className={index % 7 === 0 ? "gallery-card gallery-card-wide" : "gallery-card"} key={`${image.src}-${index}`}>
                    <img src={image.src} alt={image.alt || page.title} loading="lazy" />
                    {image.caption || image.title ? <figcaption>{image.caption || image.title}</figcaption> : null}
                  </figure>
                ))}
              </div>
            </section>
          ) : null}

          {page.media.length ? (
            <section className="section">
              <div className="section-header">
                <p className="eyebrow">Motion + Embedded Media</p>
                <h2>Videos, animation data, and linked project media.</h2>
              </div>
              <div className="asset-link-grid">
                {page.media.map((item) => (
                  <MediaTile item={item} key={item.url} />
                ))}
              </div>
            </section>
          ) : null}

          <LocalAssetSection collection={localCollection} />
          <NextProjectNav items={archivePages} currentSlug={page.slug} basePath="/more-projects" />
        </article>
      </Shell>
    </>
  );
}

function ProjectSourceDepth({ pages }) {
  const sourcePagesWithContent = pages.filter(
    (page) => page.sections.some((section) => section.items?.length) || page.images.length || page.media.length,
  );

  if (!sourcePagesWithContent.length) return null;

  return (
    <section className="section project-source-depth">
      <div className="section-header">
        <p className="eyebrow">Full Source Story</p>
        <h2>Original project flow preserved with stronger pacing.</h2>
        <p>
          These sections carry the deeper page structure, process notes, visuals, and motion
          assets from the public portfolio so the case study does not collapse into a short
          summary.
        </p>
      </div>

      <div className="source-depth-stack">
        {sourcePagesWithContent.map((page) => {
          const sections = page.sections.filter((section) => section.items?.length);

          return (
            <article className="source-depth-page" key={page.slug}>
              <div className="source-depth-heading">
                <div>
                  <p className="eyebrow">{page.group}</p>
                  <h3>{cleanPageTitle(page.title)}</h3>
                  <p>{getSourcePageLead(page)}</p>
                </div>
                <Link className="inline-link" to={`/more-projects/${page.slug}`}>
                  Open full page
                </Link>
              </div>

              {sections.length ? (
                <div className="source-section-stack">
                  {sections.map((section, index) => (
                    <article className="source-section" key={`${page.slug}-${section.title}-${index}`}>
                      <h2>{section.title}</h2>
                      <div>
                        {section.items.map((item, itemIndex) => (
                          <p key={`${page.slug}-${index}-${itemIndex}`}>{item}</p>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              {page.images.length ? (
                <div className="source-gallery source-gallery-compact">
                  {page.images.map((image, index) => (
                    <figure
                      className={index % 9 === 0 ? "gallery-card gallery-card-wide" : "gallery-card"}
                      key={`${page.slug}-${image.src}-${index}`}
                    >
                      <img src={image.src} alt={image.alt || page.title} loading="lazy" />
                      {image.caption || image.title ? <figcaption>{image.caption || image.title}</figcaption> : null}
                    </figure>
                  ))}
                </div>
              ) : null}

              {page.media.length ? (
                <div className="asset-link-grid">
                  {page.media.map((item) => (
                    <MediaTile item={item} key={`${page.slug}-${item.url}`} />
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function MediaTile({ item }) {
  if (item.kind === "video") {
    return (
      <article className="media-tile">
        <video src={item.src} controls muted playsInline preload="metadata" />
        <span>{item.kind}</span>
      </article>
    );
  }

  return (
    <a className="media-tile media-link" href={item.src} target="_blank" rel="noreferrer">
      <span>{item.kind || "asset"}</span>
      <strong>{item.url.split("/").pop()?.split("?")[0] || "Project media"}</strong>
    </a>
  );
}

function LocalAssetSection({ collection }) {
  if (!collection) return null;
  const hasAssets = collection.images.length || collection.videos.length || collection.models.length;
  if (!hasAssets) return null;

  return (
    <section className="section local-source-section">
      <div className="section-header">
        <p className="eyebrow">Expanded Project Media</p>
        <h2>Additional process assets, render exports, and source files.</h2>
        <p>
          Selected high-resolution project media is included here when it adds useful context
          beyond the original public page.
        </p>
      </div>

      {collection.images.length ? (
        <div className="source-gallery local-gallery">
          {collection.images.slice(0, 18).map((image, index) => (
            <figure className={index % 6 === 0 ? "gallery-card gallery-card-wide" : "gallery-card"} key={image.src}>
              <img src={image.src} alt={image.alt} loading="lazy" />
              <figcaption>{image.name}</figcaption>
            </figure>
          ))}
        </div>
      ) : null}

      {collection.videos.length || collection.models.length ? (
        <div className="asset-link-grid">
          {collection.videos.map((video) => (
            <article className="media-tile" key={video.src}>
              <video src={video.src} controls muted playsInline preload="metadata" />
              <span>Local video</span>
              <strong>{video.name}</strong>
            </article>
          ))}
          {collection.models.map((model) => (
            <a className="media-tile media-link" href={model.src} target="_blank" rel="noreferrer" key={model.src}>
              <span>Model/source file</span>
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

  return (
    <nav className="next-project-nav" aria-label="Project navigation">
      <Link to={`${basePath}/${previous.slug}`}>
        <span>Previous</span>
        <strong>{cleanPageTitle(previous.title)}</strong>
      </Link>
      <Link to={`${basePath}/${next.slug}`}>
        <span>Next</span>
        <strong>{cleanPageTitle(next.title)}</strong>
      </Link>
    </nav>
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

function StorySection({ title, body }) {
  return (
    <section className="story-card">
      <h2>{title}</h2>
      <p>{body}</p>
    </section>
  );
}

function ArchiveRedirect() {
  const { slug } = useParams();
  return <Navigate to={slug ? `/more-projects/${slug}` : "/more-projects"} replace />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<ProjectPage />} />
        <Route path="/archive" element={<ArchiveRedirect />} />
        <Route path="/archive/:slug" element={<ArchiveRedirect />} />
        <Route path="/more-projects" element={<SourceArchivePage />} />
        <Route path="/more-projects/:slug" element={<SourcePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </>
  );
}
