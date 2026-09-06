import styles from "./cv.module.css";

/**
 * The CV, rendered as HTML rather than an embedded PDF: iOS Safari shows only
 * the first page of an embedded PDF as a static image, and this document is two
 * pages. HTML is also selectable, indexable, reflows, and needs no JS.
 *
 * This is the no-photo layout. A public URL cannot know who is reading it, and
 * a photo gets a CV binned in several markets on discrimination-liability
 * grounds, so the photographed variant exists only as a download.
 *
 * The phone number is deliberately absent and the address is the domain one:
 * the PDFs carry the full contact block, but this markup lives in a public
 * repository and is served to crawlers, where noindex stops search engines and
 * not scrapers.
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
        </div>
        <div className="stats">
          <span className="s">
            <b>793</b> PRs merged
          </span>
          <span className="s">
            <b>706</b> tickets shipped
          </span>
          <span className="s">
            <b>30+</b> design docs authored
          </span>
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
              <span className="m">Oct 2023 – Feb 2024</span>
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
              <span>A1, studying</span>
            </div>
          </section>
        </aside>

        <main>
          <section>
            <h3 className="sec-title">Profile</h3>
            <p className="summary">
              Full-stack engineer on an agentic observability product, where I
              am the second engineer and own the interface end to end. I have
              shipped LLM features since 2024: agents that investigate an alert,
              answer a question or check a deployment, plus the chat product and
              the metering and billing behind them. I built the company&apos;s
              design system after arguing for it, and moved the SIEM platform
              across single-handed while acting as team lead. I review more code
              than I write, and the architecture goes in a design doc before it
              goes in the editor.
            </p>
          </section>

          <section>
            <h3 className="sec-title">Experience</h3>
            <div className="job-head">
              <span className="co">Logz.io</span>
              <span className="when">
                OCT 2023 – PRESENT · TEL AVIV (REMOTE)
              </span>
            </div>
            <div className="prog">
              <span className="stage">
                <span className="r">Full-Stack Engineer</span>
                <span className="d">Feb 2024</span>
              </span>
              <span className="sep">→</span>
              <span className="stage">
                <span className="r">Design System Lead</span>
                <span className="d">Jul 2025</span>
              </span>
              <span className="sep">→</span>
              <span className="stage">
                <span className="r">Acting Team Lead</span>
                <span className="d">Mar 2026</span>
              </span>
              <span className="sep">→</span>
              <span className="stage cur">
                <span className="r">OrionIQ, 2nd Engineer</span>
                <span className="d">Jun 2026</span>
              </span>
            </div>

            <div className="cluster">
              <p className="label">Leadership &amp; Ownership</p>
              <ul className="bullets">
                <li>
                  <strong>Retained through the December 2025 reduction</strong>{" "}
                  that merged two teams into one 7-person full-stack unit, then
                  hired two engineers into it: built the interview framework and
                  onboarded both, one of whom now leads the team.
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
                    Moved every SIEM customer onto the Open360 platform
                    single-handed while acting as team lead
                  </strong>{" "}
                  (Mar–Jun 2026): scoped with product, then shipped rules
                  management, AI-assisted event analysis, alerting and
                  legacy-URL redirects behind flags, with full E2E coverage.
                </li>
                <li>
                  <strong>Second engineer on OrionIQ</strong>, spun out as its
                  own product on 1 Jan 2026, where I own the one interface its
                  agents answer through, whether a run starts from a
                  conversation, an alert, a dashboard or a deployment, over
                  telemetry that is not always my employer&apos;s. Founded the
                  Artemis repo and CosmIQ (derived from LUI), extracted the{" "}
                  <code>orioniq-chat</code> package, and shipped an embeddable
                  chat drawer now live in Open360.
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
                  <strong>Saw the design system nobody owned</strong>, made the
                  case to leadership until they funded a replacement, then led
                  it: LUI, with token-based theming, 150+ components and an
                  adoption-metrics framework, now the surface every Logz.io
                  product renders through.
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
                  <strong>Core contributor to Explore</strong>, the
                  company&apos;s first in-house observability product: a
                  virtualized table, search and visualizations over very large
                  result sets, with a non-blocking OPFS and Web Workers cache
                  that fixed a cross-browser bug blocking render and multi-tab
                  fetches.
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
