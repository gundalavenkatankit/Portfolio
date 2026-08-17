const projects = [
  {
    number: "01",
    title: "CivicConnect",
    category: "UX / UI · Frontend engineering",
    description:
      "A clearer, more accessible way for residents to find city services, apply for permits, and track requests.",
    tags: ["Information architecture", "Accessibility", "Next.js"],
    tone: "civic",
    eyebrow: "City services, without the runaround",
    stat: "12 service categories",
  },
  {
    number: "02",
    title: "Disaster Resource Coordinator",
    category: "Public safety · Full stack development",
    description:
      "An accessible emergency resource experience that brings official alerts, trusted assistance, and practical preparation into one place.",
    tags: ["Live public data", "Accessibility", "Next.js"],
    tone: "retail",
    eyebrow: "Clear information when every minute matters",
    stat: "Official alert data",
  },
  {
    number: "03",
    title: "Healthcare Cost Navigator",
    category: "Healthcare access · Data experience",
    description:
      "A patient focused experience for understanding procedure costs, comparing providers, and finding financial assistance.",
    tags: ["Healthcare data", "Cost comparison", "Data UX"],
    tone: "ai",
    eyebrow: "Understand costs before care",
    stat: "Upcoming project",
  },
];

const capabilities = [
  ["01", "Backend systems", "Designing reliable APIs, workflows, data models, and distributed services."],
  ["02", "AI products", "Building controlled agentic workflows, RAG systems, forecasting, and human approval paths."],
  ["03", "Full stack delivery", "Taking products from system design through accessible React and Next.js interfaces."],
  ["04", "Cloud & reliability", "Testing, monitoring, automating, and shipping production systems on AWS."],
];

const experience = [
  {
    period: "2024 to Present",
    company: "FoodSupply.ai",
    role: "Software Engineer",
    summary: "Building AI inventory and operations systems across backend services, forecasting workflows, full stack interfaces, and cloud infrastructure.",
    skills: "Agentic AI · TypeScript · Python · AWS",
  },
  {
    period: "2021 to 2022",
    company: "Accenture · Bank of America",
    role: "Software Engineer",
    summary: "Developed high volume rewards services, configurable campaign rules, reconciliation workflows, and reliability controls for transaction processing.",
    skills: "Java · Spring Boot · Redis · AWS",
  },
  {
    period: "2020 to 2021",
    company: "Radcube",
    role: "Software Developer",
    summary: "Built configurable payment SDKs and scalable payment services, improving integration flexibility, checkout responsiveness, and transaction reliability.",
    skills: "Python · Django · GraphQL · PostgreSQL",
  },
];

const education = {
  period: "August 2022 to May 2024",
  company: "University of Texas at Arlington",
  role: "Master of Science in Computer Science",
  summary: "Completed graduate study in computer science while expanding my foundation in software engineering, data systems, and applied computing.",
  skills: "Graduate education · Arlington, Texas",
};

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4 10h11M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Venkat Ankit Gundala, home">
          Venkat Ankit Gundala
        </a>
        <nav aria-label="Main navigation">
          <a href="#work">Work</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="mailto:gundalavenkatankit@gmail.com?subject=Portfolio%20conversation">Let&apos;s talk <ArrowIcon /></a>
      </header>

      <main id="main">
        <section className="hero" id="top">
          <div className="hero-kicker"><span /> Full stack software engineer · AI systems</div>
          <h1>I build reliable systems that make <em>complex work</em> feel simple.</h1>
          <div className="hero-bottom">
            <p>I design and deliver AI products, backend platforms, and accessible interfaces, from system architecture through production support.</p>
            <a className="text-link" href="#work">Explore selected work <ArrowIcon /></a>
          </div>
          <div className="hero-orbit" aria-hidden="true">
            <span className="orbit-dot dot-one" /><span className="orbit-dot dot-two" />
            <span className="orbit-label">DESIGN<br />BUILD<br />REFINE</span>
          </div>
        </section>

        <section className="work-section" id="work">
          <div className="section-heading">
            <span>Selected work</span>
            <h2>Built to solve real problems.</h2>
            <p>Two completed projects and one upcoming exploration show how I think, from structure and interaction through implementation and testing.</p>
          </div>

          <div className="project-list">
            {projects.map((project) => (
              <article className="project" key={project.title}>
                <div className={`project-visual ${project.tone}`}>
                  <div className="visual-top"><span>{project.title}</span><span>{project.number} / 03</span></div>
                  <p>{project.eyebrow}</p>
                  <strong>{project.stat}</strong>
                  <div className="visual-lines"><i /><i /><i /></div>
                </div>
                <div className="project-copy">
                  <span className="project-number">{project.number}</span>
                  <p className="project-category">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <ul>{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  {project.title === "CivicConnect" ? <div className="projectLinks"><a className="coming-soon" href="/work/civicconnect">Read case study →</a><a href="/civicconnect">Open live project →</a></div> : project.title === "Disaster Resource Coordinator" ? <div className="projectLinks"><a href="/work/reliefready">Read case study →</a><a href="/disaster-resource-coordinator">Open live project →</a></div> : <span className="coming-soon">Upcoming project · Research stage</span>}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="capabilities-section">
          <div className="section-heading compact">
            <span>How I work</span>
            <h2>Strategy through shipping.</h2>
          </div>
          <div className="capability-list">
            {capabilities.map(([number, title, description]) => (
              <article key={number}>
                <span>{number}</span><h3>{title}</h3><p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="experience-section" id="experience">
          <div className="section-heading compact">
            <span>Experience and education</span>
            <h2>Production experience grounded in computer science.</h2>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article key={item.company}>
                <p className="experience-period">{item.period}</p>
                <div><h3>{item.company}</h3><span>{item.role}</span></div>
                <p>{item.summary}</p>
                <p className="experience-skills">{item.skills}</p>
              </article>
            ))}
            <article key={education.company}>
              <p className="experience-period">{education.period}</p>
              <div><h3>{education.company}</h3><span>{education.role}</span></div>
              <p>{education.summary}</p>
              <p className="experience-skills">{education.skills}</p>
            </article>
          </div>
        </section>

        <section className="about-section" id="about">
          <p className="side-label">A little about me</p>
          <div>
            <h2>I work across architecture, AI, and interface design.</h2>
            <div className="about-copy">
              <p>I&apos;m Venkat Ankit Gundala, a software engineer with an MS in Computer Science from the University of Texas at Arlington. I turn operational and business problems into reliable software systems.</p>
              <p>My experience spans Java and Spring services, Python and Node.js backends, React and Next.js interfaces, AI workflows, data systems, AWS infrastructure, and the testing and monitoring needed to keep products dependable.</p>
            </div>
            <div className="about-links">
              <a href="/venkat-ankit-gundala-resume.pdf" target="_blank">View résumé <ArrowIcon /></a>
              <a href="https://www.linkedin.com/in/gundalankit" target="_blank" rel="noreferrer">LinkedIn <ArrowIcon /></a>
              <a href="https://github.com/gundalavenkatankit" target="_blank" rel="noreferrer">GitHub <ArrowIcon /></a>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact">
          <span>Have a project or opportunity in mind?</span>
          <h2>Let&apos;s make something <em>useful.</em></h2>
          <a href="mailto:gundalavenkatankit@gmail.com?subject=Portfolio%20conversation">Start a conversation <ArrowIcon /></a>
          <p>gundalavenkatankit@gmail.com</p>
        </section>
      </main>
    </>
  );
}
