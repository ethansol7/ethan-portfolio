const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

export const siteMeta = {
  title: "Ethan Solodukhin | Industrial Design Portfolio",
  description:
    "Industrial design portfolio for Ethan Solodukhin, focused on modular product systems, additive manufacturing, circular design, and physical product development.",
  ogImage: asset("assets/projects/sol-lamp-hero.png"),
};

export const contactLinks = {
  portfolio: "https://www.ethansolodukhin.com",
  linkedin: "https://www.linkedin.com/in/ethan-solodukhin/",
  email: "mailto:ethansol@esol.design",
  emailLabel: "ethansol@esol.design",
  phone: "tel:+19145647062",
  phoneLabel: "+1.914.564.7062",
  resume: "https://www.ethansolodukhin.com/s/Ethan_Solodukhin_Resume_Updated_2026.pdf",
};

export const recruiterSignals = [
  {
    label: "Experience",
    title: "Procter & Gamble Co-op",
    body: "Designed packaging and product concepts for Crest and Oral-B, balancing ergonomics, manufacturability, and fast iteration.",
  },
  {
    label: "Founder",
    title: "Sol Seven Studios",
    body: "Built a public product platform around modular lighting, circular production, additive manufacturing, and independent product release.",
  },
  {
    label: "Fabrication",
    title: "RIT Fabrication Lab",
    body: "Worked across FDM, SLA, CNC, laser cutting, waterjet, and advanced digital fabrication workflows with student and faculty projects.",
  },
  {
    label: "Recognition",
    title: "RIT T-Minus Winner 2025",
    body: "Public resume and project pages show a winning four-day design sprint concept, Nomad Nest, developed under real time pressure.",
  },
];

export const focusAreas = [
  {
    title: "Modular Product Systems",
    body: "Products built as adaptable families, not isolated objects, with clear part logic, shared language, and repeatable components.",
  },
  {
    title: "Additive Manufacturing",
    body: "3D printing used for concept proof, iteration speed, and final-product thinking rather than staying trapped at prototype stage.",
  },
  {
    title: "Circular Design",
    body: "Recycled plastics, repair-minded systems, and local production loops show up repeatedly across furniture, lighting, and studio work.",
  },
  {
    title: "Physical Product Development",
    body: "CAD, prototypes, process refinement, and public testing are treated as one connected loop instead of separate phases.",
  },
];

export const stats = [
  {
    value: "6",
    label: "featured case studies",
    context: "Chosen for hiring relevance, process clarity, and employer-facing depth.",
  },
  {
    value: "82",
    label: "rebuilt source pages",
    context: "Generated from the full public sitemap and internal crawl, then reorganized into a cleaner archive.",
  },
  {
    value: "1,245",
    label: "public assets pulled",
    context: "Real Squarespace images, videos, and animation assets converted or linked for the production site.",
  },
];

const projects = [
  {
    slug: "sol-lamp-system",
    title: "SOL Lamp System",
    year: "2025",
    category: "Lighting / Product System",
    shortDescription:
      "A modular lamp family developed through Sol Seven Studios, using magnetic attachments, PETG construction, and a clearer additive-manufactured product language.",
    oneLiner:
      "A modular lighting system that treats 3D printing as a final product method, not just a prototyping shortcut.",
    role: "Founder, Industrial Designer",
    timeline: "2024-2025",
    tools: ["Fusion 360", "KeyShot", "3D Printing", "Brand Launch"],
    skills: [
      "Modular product architecture",
      "Lighting form development",
      "Additive manufacturing",
      "Product launch storytelling",
    ],
    heroImage: asset("assets/projects/sol-lamp-hero.png"),
    heroAlt: "Rendered family image of the SOL lamp system.",
    cardImage: asset("assets/projects/sol-lamp-hero.png"),
    cardAlt: "SOL lamp system render.",
    gallery: [
      {
        src: asset("assets/projects/sol-lamp-hero.png"),
        alt: "SOL lamp system family render.",
        caption: "Product-family view showing the shared system language across multiple lamp forms.",
      },
      {
        src: asset("assets/projects/sol-lamp-white-1.png"),
        alt: "SOL cylindrical lamp staged in a living room scene.",
        caption: "Public launch imagery tests how the lamp reads in a calm domestic setting.",
      },
      {
        src: asset("assets/projects/sol-lamp-white-2.png"),
        alt: "SOL cylindrical lamp staged on a desk.",
        caption: "A second environment reinforces the lamp as a resolved product, not a studio prototype.",
      },
    ],
    sections: {
      problem:
        "Most printed lamps still look like one-off experiments or low-resolution novelty objects. The public Sol Seven material positions SOL as a response to that problem: bold, modular lighting that feels product-ready and home-ready.",
      research:
        "The strongest public design signal comes from Ethan's Sol Seven writing. He calls out frustration with lamps that feel too plain, too expensive, or visually flat, and points directly to 1970s and 1980s furniture as inspiration for bringing back color, modularity, and personality.",
      concept:
        "SOL is structured as a family, not a single SKU. The public S01 and S02 pages describe a shared 'Swap & Snap' system with magnetically attached shades and bases, stackable configurations, interchangeable diffusion behavior, and secondary uses for spare parts such as planters, storage cups, or sculptural accents.",
      iteration:
        "Public evidence points to system-level iteration rather than one isolated form study. The family evolves through multiple silhouettes, repeatable proportions, launch renders in different rooms, and a consistent interaction model that keeps the product line legible as it expands.",
      prototyping:
        "The public product pages confirm a 40W RGB smart bulb, sustainable plant-based PETG, and SGS certification references tied to UL and CSA. While deeper internal test logs are not public, the launch material clearly frames the lamps as functional end products rather than speculative mockups.",
      decisions:
        "Key decisions include leaning into the ribbed print texture instead of hiding it, keeping the palette restrained so the glow stays central, and making modularity visible in the product architecture rather than burying it behind marketing language.",
      outcome:
        "SOL gives the portfolio a much stronger opening signal: Ethan can define a product language, carry it across a family, and make additive manufacturing feel commercially intentional. It also anchors the broader Sol Seven studio story with a product that is easy for recruiters and design leads to understand quickly.",
      learned:
        "The project shows that additive-manufactured products become far more credible when the system logic is obvious. A clear family structure, believable use contexts, and repeatable parts do more for hiring impact than a single flashy object.",
    },
  },
  {
    slug: "sol-seven-studios",
    title: "Sol Seven Studios",
    year: "2025",
    category: "Founder-Led Design Venture",
    shortDescription:
      "A founder-led studio used to launch products, build a stronger point of view, and connect product development, circular production, and brand presentation.",
    oneLiner:
      "A founder-led studio platform that turns isolated experiments into a clearer design practice and product ecosystem.",
    role: "Founder, Industrial Designer",
    timeline: "2024-Present",
    tools: ["Creative Direction", "Brand System", "3D Printing", "Shop Setup"],
    skills: [
      "Creative direction",
      "Independent product strategy",
      "Brand system building",
      "Circular production storytelling",
    ],
    heroImage: asset("assets/projects/solseven-founder.jpg"),
    heroAlt: "Ethan Solodukhin seated on the Revo chair.",
    cardImage: asset("assets/projects/solseven-founder.jpg"),
    cardAlt: "Ethan Solodukhin seated outdoors on a white printed chair.",
    gallery: [
      {
        src: asset("assets/projects/solseven-founder.jpg"),
        alt: "Founder portrait seated on Revo chair.",
        caption: "Public imagery used to anchor the founder-led nature of the studio.",
      },
      {
        src: asset("assets/projects/sol-lamp-white-1.png"),
        alt: "SOL lamp staged in a living room.",
        caption: "The studio is carried visually through released product photography and room-context renders.",
      },
      {
        src: asset("assets/projects/plastivista-set.png"),
        alt: "PlastiVista set with recycled printed pieces.",
        caption: "Circular furniture experiments help show the studio as more than a single lamp launch.",
      },
    ],
    sections: {
      problem:
        "Strong student and independent projects lose impact when they are scattered across separate pages, disconnected visuals, and one-off experiments. Sol Seven Studios solves that by giving Ethan's work a more coherent public container.",
      research:
        "The public about page is clear about the studio's stance: bold design, playful purpose, and lasting impact. Ethan frames the work around lighting, furniture, experimental forms, and a hands-on process that blends digital tools with physical craft.",
      concept:
        "Sol Seven functions as a product and studio system at the same time. It combines modular lighting, circular furniture experiments, product pages, inquiry flows, and a lightweight brand identity so the work reads like an emerging practice instead of a folder of disconnected assignments.",
      iteration:
        "The visible iteration is editorial as much as physical. Product pages, staged renders, founder language, and supporting furniture experiments all sharpen the studio over time, turning a loose collection of outputs into a more intentional portfolio and business platform.",
      prototyping:
        "The strongest proof comes from Ethan's public resume: Sol Seven is described as a circular production system that transforms plastic waste into functional consumer products by integrating recycling, material processing, additive manufacturing, and proprietary design systems.",
      decisions:
        "The studio identity stays quiet so the products carry the message. That decision keeps the work employer-focused and lets lighting, furniture, and material experimentation communicate the design point of view directly.",
      outcome:
        "Sol Seven gives Ethan a much stronger hiring signal than a standard student portfolio alone. It demonstrates initiative, product release thinking, and the ability to frame work as a consistent independent practice.",
      learned:
        "The studio itself becomes part of the portfolio. Packaging projects into a coherent system raises the perceived maturity of every product inside it.",
    },
  },
  {
    slug: "plastivista",
    title: "PlastiVista",
    year: "2024",
    category: "Circular Service / Furniture System",
    shortDescription:
      "A circular design concept that uses recycled plastic, additive manufacturing, and a service model to turn household waste into useful furniture.",
    oneLiner:
      "A circular furniture service concept that makes recycling more tangible by linking plastic waste directly to product outcomes.",
    role: "Industrial Designer",
    timeline: "2024",
    tools: ["Research Synthesis", "3D Printing", "Rendering", "System Mapping"],
    skills: [
      "Circular design",
      "Service framing",
      "Furniture development",
      "Material storytelling",
    ],
    heroImage: asset("assets/projects/plastivista-set.png"),
    heroAlt: "PlastiVista furniture set with recycled printed products.",
    cardImage: asset("assets/projects/plastivista-set.png"),
    cardAlt: "PlastiVista set with recycled forms.",
    gallery: [
      {
        src: asset("assets/projects/plastivista-set.png"),
        alt: "PlastiVista product set.",
        caption: "A set-based view shows the project as a system, not just one chair.",
      },
      {
        src: asset("assets/projects/plastivista-chair-close.png"),
        alt: "Close-up of the PlastiVista chair.",
        caption: "Close-up imagery emphasizes the synthetic texture and circular material story.",
      },
      {
        src: asset("assets/projects/plastivista-article.png"),
        alt: "Article headline covering the project.",
        caption: "Public press coverage reinforces that the concept resonated beyond the portfolio itself.",
      },
    ],
    sections: {
      problem:
        "The public problem statement is explicit: how can additive manufacturing help bring more sustainability into communities and households? PlastiVista answers that by making recycling participation feel immediately useful instead of abstract.",
      research:
        "The strongest public research thread comes from the older PlastiVista page. Ethan describes interviewing users who liked the idea of sustainability but often disengaged because the process felt restrictive, inconvenient, or too detached from everyday reward.",
      concept:
        "PlastiVista is framed as both a service and a product outcome. Users contribute plastic waste, the system sorts and processes it into filament, and the output returns as bespoke furniture and household objects. The public tag line captures the logic clearly: 'Your Plastic, Our Process, Your Furniture, Donate to Create.'",
      iteration:
        "The project expands from a single seating object into a broader ecosystem that includes stools, recliners, lamps, wall patterns, and storage. That shift matters because it proves the idea can scale as a design language and as a circular service offer.",
      prototyping:
        "Public materials document the workflow concept in practical terms: sorting, shredding, filament production, and large-format printed furniture. The older page also includes public prototype data, such as approximate print weight, multi-day print times, and low-infill structural testing.",
      decisions:
        "A major decision was to make the sustainability model visible instead of hiding it behind generic green language. The project uses speckled material appearance, bold geometry, and service diagrams so the viewer understands both the environmental logic and the product value.",
      outcome:
        "PlastiVista is one of the clearest examples of Ethan's systems thinking. It ties together research, community behavior, material flows, furniture design, and additive manufacturing into a concept that feels larger than one object.",
      learned:
        "Circular design gets stronger when it offers a believable incentive. PlastiVista shows that people engage more easily when the outcome is concrete, desirable, and close to everyday life.",
    },
  },
  {
    slug: "revo-chair",
    title: "Revo Chair",
    year: "2024",
    category: "Furniture / Additive Manufacturing",
    shortDescription:
      "A 100% recycled-plastic chair concept developed through sketching, print-aware form studies, scaled prototypes, and stronger public-facing storytelling.",
    oneLiner:
      "A recycled-plastic chair concept refined through ergonomic sketches, scaled print tests, and a much clearer circular production story.",
    role: "Industrial Designer",
    timeline: "2024",
    tools: ["Fusion 360", "3D Printing", "Rendering", "Photography"],
    skills: [
      "Furniture form development",
      "Print-aware design",
      "Physical prototyping",
      "Public presentation",
    ],
    heroImage: asset("assets/projects/revo-hero.jpg"),
    heroAlt: "Ethan sitting on the white Revo chair outdoors.",
    cardImage: asset("assets/projects/revo-hero.jpg"),
    cardAlt: "Ethan sitting on the white Revo chair.",
    gallery: [
      {
        src: asset("assets/projects/revo-hero.jpg"),
        alt: "Revo chair prototype in use.",
        caption: "In-use photography moves the chair beyond a speculative render and into physical proof.",
      },
      {
        src: asset("assets/projects/revo-prototype.jpg"),
        alt: "Alternate view of the white Revo chair.",
        caption: "A second public prototype image helps confirm full-scale fabrication rather than concept-only styling.",
      },
      {
        src: asset("assets/projects/revo-article.png"),
        alt: "Press coverage for the Revo chair project.",
        caption: "Public press and recognition give the project added external validation.",
      },
    ],
    sections: {
      problem:
        "Revo tackles a familiar challenge in circular furniture: how do you make a printed, recycled object feel desirable and believable rather than heavy-handed or purely conceptual?",
      research:
        "The public process notes show Ethan focusing on minimal, comfortable forms optimized for vertical extrusion so the chair could avoid unnecessary supports. That framing keeps manufacturability tied directly to the form language from the start.",
      concept:
        "Revo uses a folded, monolithic silhouette that feels both sculptural and plausible as a printed object. Public descriptions also suggest an orientation-based versatility, where the single-piece form can work as seating and read differently when repositioned.",
      iteration:
        "The project moved through sketching, Fusion 360 modeling, and printed scale studies, including a 45 percent scale prototype used to test seating functionality. Later public material also improves the project editorially through stronger photography, renders, and a tighter sustainability story.",
      prototyping:
        "The older public page gives useful proof details: approximately 7,800 grams of filament, about three days of print time, and only 8 percent infill, making the chair roughly 92 percent hollow while still reading as surprisingly strong for a prototype.",
      decisions:
        "A key decision was to design for vertical extrusion instead of forcing a conventional furniture silhouette onto an additive process. That keeps the manufacturing logic honest and helps the chair feel like it belongs to its method.",
      outcome:
        "Revo became one of the portfolio's strongest employer-facing projects. The public site ties it to Yanko Design coverage, Trend Hunter coverage, a 2024 IDSA Bronze Award Gala contestant listing, and Rising Design Visionaries visibility.",
      learned:
        "For furniture, real proof matters quickly. A scaled prototype, a full-size photo, and a credible manufacturing story make the concept much easier for hiring teams to trust.",
    },
  },
  {
    slug: "sol-wheel",
    title: "Sol Wheel",
    year: "2024",
    category: "Gaming Accessory / Product Development",
    shortDescription:
      "A steering accessory for the Valve Steam Deck developed across multiple prototype generations, community feedback loops, and a Kickstarter launch attempt.",
    oneLiner:
      "A Steam Deck steering accessory iterated through roughly ten prototypes, community feedback, and a visible push toward more reliable mechanism design.",
    role: "Independent Designer, Prototype Builder",
    timeline: "2022-2024",
    tools: ["Fusion 360", "3D Printing", "Rendering", "Mechanism Testing"],
    skills: [
      "Accessory design",
      "Mechanism refinement",
      "Iteration planning",
      "Community validation",
    ],
    heroImage: asset("assets/projects/sol-wheel-process.png"),
    heroAlt: "Collage of Sol Wheel renders and concept images.",
    cardImage: asset("assets/projects/sol-wheel-process.png"),
    cardAlt: "Sol Wheel concept collage.",
    gallery: [
      {
        src: asset("assets/projects/sol-wheel-process.png"),
        alt: "Sol Wheel concept collage.",
        caption: "The public page combines concept renders, Kickstarter assets, and mechanism studies into one development story.",
      },
      {
        src: asset("assets/projects/sol-wheel-prototype-1.jpg"),
        alt: "Sol Wheel white prototype on a studio background.",
        caption: "One of several public prototypes built to refine the steering mechanism and centering behavior.",
      },
      {
        src: asset("assets/projects/sol-wheel-prototype-2.jpg"),
        alt: "Close-up of Sol Wheel prototype details.",
        caption: "Later detail photography supports the shift from rubber bands to retractable spring mechanisms.",
      },
    ],
    sections: {
      problem:
        "The brief on the public page is direct: create an affordable sim-racing setup that works with the Valve Steam Deck. The challenge was to add a more physical racing experience without forcing users into a full dedicated rig.",
      research:
        "Sol Wheel is the portfolio's clearest public example of feedback-driven development. Ethan documented Steam Deck community outreach, more than 100,000 total views, over 250 comments, and multiple rounds of user response that shaped later revisions.",
      concept:
        "The original concept used a dual-bearing steering setup with the deck docked on a table surface and rubber bands to return the wheel to center. Later versions kept the same overall logic while replacing the centering system with retractable spring mechanisms for more reliable tension.",
      iteration:
        "The public timeline is unusually specific. The original CAD work started in 2022, roughly ten prototypes were made, the project was paused after the Kickstarter push, and then revived in February 2024 with clock-spring-based prototypes, updated deck holders, better wire routing, and smoother movement.",
      prototyping:
        "All parts were publicly described as custom designed and manufactured, including a fully 3D-printed bearing assembly. Ethan notes using calipers and reprints to correct tolerance issues caused by filament expansion, which is exactly the kind of physical iteration detail hiring teams look for.",
      decisions:
        "The strongest decision was staying narrow: solve one compelling use case for one specific platform instead of drifting into a generic controller accessory. That focus made the mechanism and validation story much more believable.",
      outcome:
        "Even though the Kickstarter campaign did not hit its $10,000 goal for injection molding, the project still generated press coverage, community traction, and enough proof to remain one of the most hireable pieces in the portfolio. Public quotes from Boiling Steam and PCGamesN reinforce that external interest.",
      learned:
        "Traction only matters when it feeds the design loop. Sol Wheel works because community response is paired with visible prototype changes, better mechanism decisions, and a willingness to restart the project when the first approach was not strong enough.",
    },
  },
  {
    slug: "autodesk-origin",
    title: "Autodesk Origin",
    year: "2025",
    category: "Measurement Tool Concept",
    shortDescription:
      "A team-developed concept for a portable measurement device that combines distance capture, color sensing, and an approachable hardware-plus-UI experience.",
    oneLiner:
      "A portable measurement-tool concept that packages scanning, color capture, and tactile interface control into one clear object.",
    role: "Industrial Designer, Team Project",
    timeline: "2025",
    tools: ["Fusion 360", "Rapid Prototyping", "UI Concepting", "Rendering"],
    skills: [
      "Form and CMF development",
      "Interface thinking",
      "Product visualization",
      "Cross-functional collaboration",
    ],
    heroImage: asset("assets/projects/origin-hero.png"),
    heroAlt: "Rendered Autodesk Origin concept device.",
    cardImage: asset("assets/projects/origin-hero.png"),
    cardAlt: "Autodesk Origin device render.",
    gallery: [
      {
        src: asset("assets/projects/origin-hero.png"),
        alt: "Rendered Autodesk Origin concept.",
        caption: "Primary hero image showing the hardware architecture and integrated display.",
      },
      {
        src: asset("assets/projects/origin-context.png"),
        alt: "Autodesk Origin concept staged on a work surface next to a laptop.",
        caption: "Context imagery connects the device directly to a digital fabrication workflow.",
      },
      {
        src: asset("assets/projects/origin-ui.png"),
        alt: "Autodesk Origin close-up with visible user interface.",
        caption: "The UI close-up shows how measurement data, color capture, and control hierarchy were packaged visually.",
      },
    ],
    sections: {
      problem:
        "The Autodesk University Factory Event brief asked for a multifunctional measuring device that could streamline digital fabrication by capturing distances, generating color profiles, and giving users an intuitive physical interface.",
      research:
        "The public description frames the opportunity clearly: bridge physical materials and digital creation in a way that works for designers, engineers, and makers. That means the object has to communicate its capabilities quickly through both its controls and its display.",
      concept:
        "Origin combines a laser distance sensor, a high-accuracy color sensor, an integrated display, and a haptic control dial. The concept reads as a hybrid of measuring tool, scanning device, and interface-first hardware product.",
      iteration:
        "The public page shows form variations, physical form variations, and multiple context renders. Even without a full internal process log, it is clear the concept was pressure-tested across appearance, handling, and communication rather than resolved in a single final render.",
      prototyping:
        "The public materials explicitly reference injection molding, CNC milling, and SLA or FDM printing, with partner capabilities from Formlabs, Xometry, Haas, Datron, and Prusa. That gives the concept a more grounded manufacturing frame than a pure visual study.",
      decisions:
        "The strongest design decision is the hierarchy between the screen, the circular control, and the main body. It gives the device an immediate read and helps viewers understand how the product would likely be used before reading any caption.",
      outcome:
        "Autodesk Origin is one of the cleanest portfolio signals for employer-facing concept work. It combines industrial design, UI thinking, and tool-focused ergonomics in a way that feels relevant to real development teams.",
      learned:
        "Speculative hardware becomes more convincing when the workflow is visible. Origin succeeds because the object design, manufacturing context, and interface concept all support the same story.",
    },
  },
];

export const featuredProjects = projects;
export const projectMap = Object.fromEntries(projects.map((project) => [project.slug, project]));

export const moreProjects = [
  {
    group: "Additional Product Work",
    title: "Airo",
    year: "2024",
    category: "Bathroom Product / Visualization",
    description:
      "Plug-and-play mirror defogger concept for renters, combining hot-air clearing, suction-cup mounting, and humidity-sensor automation. Public page credits Ethan with the in-context renderings.",
    image: null,
    imageAlt: "",
    link: "https://www.ethansolodukhin.com/airo",
  },
  {
    group: "Additional Product Work",
    title: "Shelf Mate",
    year: "2024",
    category: "Manufacturing Concept",
    description:
      "Autodesk collaboration concept designed to be manufacturable across 3D printing, SLA, and CNC processes for Autodesk Factory Event and Autodesk University 2024/2025.",
    image: null,
    imageAlt: "",
    link: "https://www.ethansolodukhin.com/shelf-mate-2024",
  },
  {
    group: "Additional Product Work",
    title: "Nomad Nest",
    year: "2025",
    category: "Rapid Design Sprint",
    description:
      "RIT T-Minus Design Sprint winner. The team developed a compact bed-and-storage system for cross-country bus travel, supported by ideation, CAD, rendering, and presentation prototyping.",
    image: asset("assets/projects/nomad-nest-product.jpeg"),
    imageAlt: "Nomad Nest team photo at the RIT T-Minus presentation board.",
    link: "https://www.ethansolodukhin.com/nomad",
  },
  {
    group: "Furniture + Lighting",
    title: "ET-03",
    year: "2025",
    category: "Seating Concept",
    description:
      "Seating project built around the phrase 'Sit. Stay. Simple.' Public documentation shows blueprint development, metal work, welding, leather-and-cushion studies, and several frame revisions.",
    image: asset("assets/projects/et-03-render.png"),
    imageAlt: "Rendered ET-03 seating concept.",
    link: "https://www.ethansolodukhin.com/et-03",
  },
  {
    group: "Furniture + Lighting",
    title: "Bungis Chair",
    year: "2024",
    category: "Furniture / Making",
    description:
      "Chair developed during the DIS Copenhagen furniture studio. Public documentation includes weekly chair ideation, a full-scale drawing, woodshop build process, and the final Bungis Chair.",
    image: asset("assets/projects/bungis-chair.png"),
    imageAlt: "Rendered Bungis chair from the Denmark furniture project.",
    link: "https://www.ethansolodukhin.com/denmark-summer-2024",
  },
  {
    group: "Furniture + Lighting",
    title: "The 9INE Light",
    year: "2024",
    category: "Lighting / Kiosk Concept",
    description:
      "Studio 1 project pairing the 9INE Light with a purpose-built kiosk environment, expanding the product into a fuller spatial presentation.",
    image: asset("assets/projects/nine-light-mini.png"),
    imageAlt: "Poster-style presentation for the 9INE Light concept.",
    link: "https://www.ethansolodukhin.com/the-9ine-light",
  },
  {
    group: "Furniture + Lighting",
    title: "Furniture Collection",
    year: "2022-Present",
    category: "Furniture Archive",
    description:
      "Broader archive of furniture explorations, including stools, chairs, lights, and Denmark studies gathered under the public Sol Collection page.",
    image: null,
    imageAlt: "",
    link: "https://www.ethansolodukhin.com/furniture",
  },
  {
    group: "Brand + Concept Work",
    title: "Arizona Can Redesign",
    year: "2024",
    category: "Packaging Concept",
    description:
      "AriZona CMYK energy-drink redesign that uses circular geometry, bright CMYK flavor coding, and playful typography to refresh the brand language.",
    image: asset("assets/projects/arizona-cmyk.png"),
    imageAlt: "CMYK-themed AriZona can redesign render.",
    link: "https://www.ethansolodukhin.com/arizonaconcept",
  },
  {
    group: "Brand + Concept Work",
    title: "Spotify Mini Speaker Concept",
    year: "2023",
    category: "Branded Product Concept",
    description:
      "Second-year studio concept imagining a Spotify hardware product that aligns with the brand's friendly, human-centered, high-function visual language.",
    image: asset("assets/projects/spotify-mini.png"),
    imageAlt: "Rendered Spotify mini speaker concept.",
    link: "https://www.ethansolodukhin.com/spotify-concept",
  },
  {
    group: "Brand + Concept Work",
    title: "Concept Room",
    year: "2024",
    category: "Spatial Visualization",
    description:
      "Personal room concept created to strengthen 3D concept and visualization skills through an interior-focused scene rather than a standalone product.",
    image: null,
    imageAlt: "",
    link: "https://www.ethansolodukhin.com/concept-room",
  },
  {
    group: "Brand + Concept Work",
    title: "Logo Development",
    year: "2024",
    category: "Identity Study",
    description:
      "Archive of brand-guide and logo-process work preserved from the public site as supporting identity and visual communication material.",
    image: null,
    imageAlt: "",
    link: "https://www.ethansolodukhin.com/logo-development",
  },
  {
    group: "Visualization Archive",
    title: "Every Day Render Challenge",
    year: "2024-2025",
    category: "Visualization Series",
    description:
      "Daily industrial design rendering challenge spanning furniture, lighting, and collection-scale form studies from December 13, 2024 through January 11, 2025.",
    image: asset("assets/projects/every-day-render-challenge.png"),
    imageAlt: "Render from the every day industrial design rendering challenge.",
    link: "https://www.ethansolodukhin.com/every-day-render-challenge",
  },
  {
    group: "Visualization Archive",
    title: "SOL Digital Art & Sculptures",
    year: "2023-2024",
    category: "Digital Art",
    description:
      "Public SOL artwork archive including Playground, Sol Sculpture, Sol Guy, Apartment, and other visual experiments tied to the broader SOL universe.",
    image: asset("assets/projects/sol-playground.png"),
    imageAlt: "Colorful SOL digital artwork composition.",
    link: "https://www.ethansolodukhin.com/sol",
  },
];

export const aboutHighlights = [
  {
    label: "Experience",
    title: "Procter & Gamble",
    body: "Public 2026 resume lists a May to August 2025 co-op in Cincinnati focused on packaging and product concepts for Crest and Oral-B.",
  },
  {
    label: "Experience",
    title: "Fabrication Lab at RIT",
    body: "Public resume highlights hands-on work across FDM, SLA, CNC, laser cutting, waterjet, and fabrication workflow optimization.",
  },
  {
    label: "Founder",
    title: "Sol Seven Studios LLC",
    body: "Public resume and studio site position Ethan as founder, combining circular production, modular lighting, rapid iteration, and independent product development.",
  },
  {
    label: "Recognition",
    title: "Awards + Honors",
    body: "Public resume lists the 2025 RIT T-Minus win, 2024 IDSA Rising Design Visionaries representation, and a 2022 Reddit Innovation Awards finalist placement for SOL Wheel.",
  },
];
