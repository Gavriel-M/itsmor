import photo from "@/assets/cv-photo.jpg";
import { CV_STATS } from "@/lib/cv";
import styles from "./cv.module.css";

/**
 * The CV, rendered as HTML rather than an embedded PDF: iOS Safari shows only
 * the first page of an embedded PDF as a static image, and this document is two
 * pages. HTML is also selectable, indexable, reflows, and needs no JS.
 *
 * The page carries the photo and the primary download does not. That mismatch
 * is deliberate and both halves matter, so do not flatten it:
 *
 *   The page is a showcase on his own site, in a market where the photo is the
 *   convention. Nobody bins a portfolio page, and it is the one place the CV
 *   should look like its best self.
 *
 *   A download enters a company's hiring pipeline, which is where the
 *   discrimination-liability concern actually bites. The asymmetry is the safe
 *   direction: a recruiter who expects a photo and receives none notices
 *   nothing, while one who bins photographed CVs on policy would bin it.
 *
 * No phone number anywhere, and the address is the domain one. This markup is
 * public and served to crawlers, where noindex stops search engines and not
 * scrapers.
 *
 * Every string here is also in the PDFs. They are two copies of one source, so
 * a wording change belongs upstream and lands on both in the same release;
 * editing one side is the drift the port exists to prevent.
 */
export default function CvDocument() {
  return (
    <article className={styles.root} aria-label="Curriculum vitae">
      <header>
        <div className="head-grid">
          <div>
            <h2 className="name">
              Gavriel Mor<span className="stop">.</span>
            </h2>
            <p className="tagline">
              AI Products · Design Systems · Performance
            </p>
            <p className="role">Full-Stack Software Engineer</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="photo"
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt="Gavriel Mor"
          />
        </div>
        <div className="stats">
          {CV_STATS.map((stat) => (
            <span className="s" key={stat.label}>
              <b>{stat.value}</b> {stat.label}
            </span>
          ))}
        </div>
      </header>

      <div className="body">
        <aside className="rail">
          <section>
            <p className="label">Contact</p>
            <div className="contact">
              <div className="row">
                <span className="k">Location</span>
                <span className="v">Munich, Germany · EU citizen</span>
              </div>
              <div className="row">
                <span className="k">Email</span>
                <span className="v">
                  <a href="mailto:gavriel.mor@itsmor.com">
                    gavriel.mor@itsmor.com
                  </a>
                </span>
              </div>
              <div className="row">
                <span className="k">LinkedIn</span>
                <span className="v">
                  <a
                    href="https://linkedin.com/in/gavriel-mor"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gavriel-mor
                  </a>
                </span>
              </div>
              <div className="row">
                <span className="k">GitHub</span>
                <span className="v">
                  <a
                    href="https://github.com/Gavriel-M"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Gavriel-M
                  </a>
                </span>
              </div>
              <div className="row">
                <span className="k">Portfolio</span>
                <span className="v">
                  <a href="https://www.itsmor.com">itsmor.com</a>
                </span>
              </div>
            </div>
          </section>

          <section className="stack">
            <p className="label">Stack</p>
            <div className="grp">
              <span className="h">Core</span>
              <span className="v">
                TypeScript, JavaScript, Node.js, HTML5, CSS and SASS
              </span>
            </div>
            <div className="grp">
              <span className="h">AI &amp; Backend</span>
              <span className="v">
                LLM integration (AWS Bedrock), Node.js microservices and BFF,
                RBAC (AWS Verified Permissions), usage metering and billing,
                Prisma/SQL, OpenSearch
              </span>
            </div>
            <div className="grp">
              <span className="h">React &amp; Frontend</span>
              <span className="v">
                React, TanStack Query and Router, Emotion, @xstyled, Storybook,
                Zod
              </span>
            </div>
            <div className="grp">
              <span className="h">Architecture</span>
              <span className="v">
                Design systems, performance (Web Workers, OPFS), real-time
                streaming UIs (SSE), micro-frontends, monorepos
              </span>
            </div>
            <div className="grp">
              <span className="h">Data Viz</span>
              <span className="v">
                Highcharts, Perses, Monaco (PromQL and Lucene), virtualized
                tables
              </span>
            </div>
            <div className="grp">
              <span className="h">Testing &amp; CI/CD</span>
              <span className="v">
                Jest, RTL, Playwright, Puppeteer, Docker, GitHub Actions, Nx,
                ArgoCD
              </span>
            </div>
          </section>

          <section>
            <p className="label">Education</p>
            <div className="edu">
              <span className="t">Full-Stack Web Development</span>
              <span className="m">HackerU, Tel Aviv · 2021–2022</span>
            </div>
            <div className="edu">
              <span className="t">CS Foundations Coursework</span>
              <span className="m">
                Academic College of Tel Aviv-Yaffo · 2020–2021
              </span>
            </div>
            <div className="edu">
              <span className="t">Self-directed study</span>
              <span className="m">2022 – Oct 2023</span>
            </div>
            <div className="edu">
              <span className="t">Military reserve service</span>
              <span className="m">Oct 2023 – Jan 2024</span>
            </div>
          </section>

          <section>
            <p className="label">Languages</p>
            <div className="lang">
              <b>Hebrew</b>
              <span>Native</span>
            </div>
            <div className="lang">
              <b>English</b>
              <span>Native</span>
            </div>
            <div className="lang">
              <b>German</b>
              <span>A1–A2, learning</span>
            </div>
          </section>
        </aside>

        <main>
          <section>
            <h3 className="sec-title">Profile</h3>
            <p className="summary">
              Full-stack engineer on an agentic observability product, where I
              work across its interface, backend and design system. I have
              shipped LLM features since 2024: agents that investigate an alert,
              answer a question or check a deployment, plus the chat product and
              the metering and billing behind them. I led the rebuild of the
              company&apos;s design system, and led the SIEM platform&apos;s
              move onto Open360 while acting as team lead. I review more code
              than I write, and the architecture goes in a design doc before it
              goes in the editor.
            </p>
          </section>

          <section>
            <h3 className="sec-title">Experience</h3>
            <div className="job-head">
              <span className="co">Logz.io</span>
              <span className="when">OCT 2023 – PRESENT · MUNICH (REMOTE)</span>
            </div>
            <div className="prog">
              <span className="stage">
                <span className="r">Full-Stack Engineer</span>
                <span className="d">Jan 2024</span>
              </span>
              <span className="sep">→</span>
              <span className="stage">
                <span className="r">Acting Team Lead</span>
                <span className="d">Mar 2026</span>
              </span>
              <span className="sep">→</span>
              <span className="stage cur">
                <span className="r">OrionIQ</span>
                <span className="d">Jun 2026</span>
              </span>
            </div>

            <div className="cluster">
              <p className="label">Leadership &amp; Ownership</p>
              <ul className="bullets">
                <li>
                  <strong>Retained through the 2025–26 reduction</strong> that
                  merged two teams into one 7-person full-stack unit.
                </li>
                <li>
                  <strong>
                    Acting lead of the application team, Mar–May 2026, while its
                    lead was away.
                  </strong>{" "}
                  Planned the quarter with KPIs, a capacity model and a risk
                  register, took part in hiring a senior full-stack developer
                  and the team&apos;s next lead, and built the intro-interview
                  framework. Onboarded the new senior full-stack developer and
                  handed the team over to the incoming lead.
                </li>
                <li>
                  Author{" "}
                  <strong>two publication-grade demo recaps a month</strong>,
                  turning a fortnight of cross-repo work into a narrative with
                  verified before-and-after numbers, and have written 30+ design
                  docs and PRDs adopted across teams.
                </li>
              </ul>
            </div>

            <div className="cluster">
              <p className="label">New Products &amp; Platform Migrations</p>
              <ul className="bullets">
                <li>
                  <strong>
                    Brought the SIEM product onto the Open360 platform
                  </strong>{" "}
                  (Apr–May 2026): wrote the epic, the technical design and a
                  three-phase plan, then delivered the workspace infrastructure,
                  the Explore integration, the AI investigation pipeline,
                  security rules, event management, threat feeds and lookups and
                  the dashboard migration, with three teammates on the parallel
                  phases. Released to all users in May 2026.
                </li>
                <li>
                  <strong>On OrionIQ</strong>, spun out as its own product,
                  where I work across its interface, backend and design system,
                  whether a run starts from a conversation, an alert, a
                  dashboard or a deployment, over telemetry that is not always
                  my employer&apos;s. Extracted the <code>orioniq-chat</code>{" "}
                  package and shipped an embeddable chat drawer now live in
                  Open360, and built components for CosmIQ, the design system
                  that grew out of LUI: the select, the tables and DataTable,
                  filter menus, a shared drag-resize primitive and the
                  travelling layer.
                </li>
                <li>
                  <strong>
                    Replaced the legacy AI agent across two applications
                  </strong>
                  , bringing OrionIQ chat into the Classic app behind one drawer
                  and trigger. Deleted 124 legacy files and ~5,400 net lines,
                  and cut the entry point from{" "}
                  <strong>333 KB to 16 KB gz</strong>.
                </li>
                <li>
                  <strong>
                    Built the page-context system the agent reads the product
                    through
                  </strong>
                  , replacing a hardcoded Explore-only path with a generic seam
                  and teaching it five pages. Adding a page went from a sprint
                  to a day.
                </li>
                <li>
                  <strong>Backend on the Agents Hub</strong>: made the actor a
                  required argument on every write so a request body cannot
                  forge it, collapsed{" "}
                  <strong>50 identity lookups per page to 1</strong>, and
                  recovered a customer account stuck in permanent AI failure by
                  making that state self-heal on deploy.
                </li>
              </ul>
            </div>

            <div className="cluster">
              <p className="label">
                Frontend Architecture &amp; Design Systems
              </p>
              <ul className="bullets">
                <li>
                  <strong>Saw the design system had drifted</strong>, made the
                  case for rebuilding it, then led it: LUI, with token-based
                  theming and an adoption-metrics framework.
                </li>
                <li>
                  <strong>
                    Migrated the legacy app onto a new TanStack Router and Zod
                    workspace
                  </strong>{" "}
                  built on LUI, shipping features on the old app the whole time,
                  then added open-source parity pages (Grafana, OSD, Jaeger) so
                  no user was stranded in the transition.
                </li>
                <li>
                  <strong>Core contributor to Explore</strong>, the log-search
                  page: a virtualized table, search and visualizations over very
                  large result sets, with a non-blocking OPFS and Web Workers
                  cache that fixed a cross-browser bug blocking render and
                  multi-tab fetches.
                </li>
                <li>
                  Merged upstream fixes to <strong>xstyled</strong> (2.3k★), the
                  style-props library LUI builds on, after hitting an inference
                  bug while building the design system, plus accessibility and
                  lifecycle fixes to the open-source tour library OrionIQ
                  depends on. Published <code>text-cascade</code>, a
                  per-character React text reveal, to npm.
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>

      <footer>
        <p>
          Munich-based · available for senior full-stack and frontend-platform
          roles
        </p>
      </footer>
    </article>
  );
}
