import type { Metadata } from "next";
import Link from "next/link";
import { InnerDepthsLogo } from "@/components/brand/inner-depths-logo";
import styles from "./privacy.module.css";

export const metadata: Metadata = {
  title: "Privacy Policy | Inner Depths",
  description:
    "Learn how Inner Depths handles account, freediving, training, and optional WHOOP connection information.",
  robots: {
    index: true,
    follow: true,
  },
};

const lastUpdated = "September 29, 2026";

export default function PrivacyPage() {
  const privacyContactEmail = process.env.PRIVACY_CONTACT_EMAIL?.trim();
  const showDevelopmentFallback = !privacyContactEmail && process.env.NODE_ENV === "development";

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.siteHeader}>
          <Link href="/" aria-label="Open Inner Depths">
            <InnerDepthsLogo priority />
          </Link>
          <Link className={styles.appLink} href="/">
            Open app
          </Link>
        </header>

        <article className={styles.policy}>
          <header className={styles.hero}>
            <p className={styles.eyebrow}>Your information</p>
            <h1>Privacy Policy</h1>
            <p className={styles.updated}>Last updated: {lastUpdated}</p>
            <p className={styles.introduction}>
              This policy explains what information Inner Depths handles, why it is used, and
              the choices available to you when using the application or connecting WHOOP.
            </p>
          </header>

          <div className={styles.content}>
            <section>
              <h2>Information you provide</h2>
              <p>Inner Depths may store information that you submit to the application:</p>
              <ul>
                <li>Account information, including your email address.</li>
                <li>
                  Profile and onboarding information, including display name, experience level,
                  and primary freediving discipline.
                </li>
                <li>
                  Freediving records you enter, such as date, discipline, depth, duration,
                  location, perceived effort, comfort, and notes.
                </li>
                <li>
                  Training-session records you enter, including date, session type, duration,
                  difficulty, and notes.
                </li>
              </ul>
            </section>

            <section>
              <h2>Authentication and technical information</h2>
              <p>
                Inner Depths uses Better Auth within the application for email-and-password
                authentication. Passwords are handled through Better Auth&apos;s password-hashing
                system rather than stored as readable passwords. The application stores the
                account, authentication, and session information needed to keep you signed in and
                protect your account.
              </p>
              <p>
                Normal technical and security information may be processed when you use the
                service. For example, session records can include an IP address and browser user
                agent, and security controls use request information to enforce database-backed
                rate limits. Inner Depths uses an authentication cookie to maintain a signed-in
                session. We do not describe these controls as advertising or behavioral tracking.
              </p>
            </section>

            <section className={styles.whoopSection}>
              <p className={styles.sectionLabel}>Optional connection</p>
              <h2>WHOOP Integration</h2>
              <p>
                Connecting WHOOP is optional. If you choose to connect, WHOOP asks you to
                authorize Inner Depths before access is granted. Inner Depths is an independent
                application and is not owned, operated, or endorsed by WHOOP.
              </p>
              <p>Inner Depths currently requests these WHOOP permissions:</p>
              <ul className={styles.scopeList}>
                <li><code>offline</code> — keep the connection available using refresh access.</li>
                <li><code>read:profile</code> — identify the connected WHOOP account.</li>
                <li><code>read:recovery</code> — access Recovery information.</li>
                <li><code>read:sleep</code> — access sleep information.</li>
                <li><code>read:cycles</code> — access physiological Cycle and Strain information.</li>
                <li><code>read:workout</code> — access workout and activity information.</li>
              </ul>
              <p>
                Inner Depths intentionally does not request the <code>read:body_measurement</code>
                permission. WHOOP information is not treated as a diagnosis, and Inner Depths does
                not use it to diagnose health conditions.
              </p>

              <h3>What the WHOOP connection stores</h3>
              <p>
                The current connection record is linked to your Inner Depths user account. It
                stores the WHOOP account identity, granted permissions, access-token expiration,
                encrypted OAuth access and refresh tokens, and connection and update timestamps.
                OAuth tokens are encrypted at rest using AES-256-GCM and are handled server-side.
                They are not intentionally exposed in browser Client Components, URLs, or
                application logs.
              </p>
              <p>
                Inner Depths has not yet implemented historical WHOOP biometric-data persistence
                or synchronization. Recovery, Sleep, Cycle, and Workout history is therefore not
                currently imported and permanently stored in the Inner Depths database. This
                policy will be updated if the integration expands to store that information.
              </p>
            </section>

            <section>
              <h2>How information is used</h2>
              <p>Inner Depths uses information to provide and protect the functions you request:</p>
              <ul>
                <li>Maintaining your account, profile, and authenticated session.</li>
                <li>Displaying the diving and training information you have logged.</li>
                <li>Producing descriptive Home and Progress information from your stored records.</li>
                <li>Connecting to WHOOP when you explicitly choose to authorize the connection.</li>
                <li>Displaying relevant WHOOP information once that feature is enabled.</li>
                <li>Maintaining security, applying rate limits, and preventing abuse.</li>
              </ul>
              <p>
                WHOOP information is not currently used for AI coaching, advanced coaching,
                medical recommendations, readiness-to-dive decisions, research, or advertising.
              </p>
            </section>

            <section>
              <h2>Service providers</h2>
              <p>Inner Depths currently relies on the following services where needed:</p>
              <ul>
                <li><strong>Vercel</strong> for application hosting and deployment.</li>
                <li><strong>Neon</strong> for PostgreSQL database hosting.</li>
                <li>
                  <strong>WHOOP</strong> for the optional, user-authorized fitness integration.
                  Information requested from WHOOP is subject to your authorization and WHOOP&apos;s
                  own terms and privacy practices.
                </li>
              </ul>
              <p>
                Better Auth is used as an application authentication library; it is not presented
                as a separate identity provider for Inner Depths accounts.
              </p>
            </section>

            <section>
              <h2>Sale and advertising</h2>
              <p>
                Inner Depths does not sell personal information. Inner Depths does not use WHOOP
                data for advertising.
              </p>
            </section>

            <section>
              <h2>Security</h2>
              <p>
                Inner Depths uses safeguards appropriate to the current application, including
                authenticated ownership checks that restrict user records to their owner,
                server-side handling of WHOOP credentials, AES-256-GCM encryption for stored WHOOP
                OAuth tokens, secure session handling, and HTTPS in production. No internet service
                can guarantee absolute security.
              </p>
            </section>

            <section>
              <h2>Your choices, retention, and deletion</h2>
              <p>
                Information is retained while it is needed to operate your account and provide the
                application, subject to deletion requests and operational or legal requirements.
                Inner Depths does not yet provide a self-service Delete Account button.
              </p>
              <p>
                You can disconnect WHOOP through <strong>Account → Connections</strong>. The current
                disconnect process attempts to revoke the WHOOP authorization and removes the
                locally stored WHOOP OAuth credentials. Disconnecting WHOOP does not delete your
                Inner Depths account or your manually entered dive and training records.
              </p>
              <p>
                Until self-service account deletion is available, contact Inner Depths using the
                privacy contact below to request deletion of your account and associated data.
              </p>
            </section>

            <section>
              <h2>Children&apos;s privacy</h2>
              <p>
                Inner Depths has not established a separate age-based account policy and is not
                designed specifically for children. If you are a parent or guardian and believe a
                child has provided personal information through Inner Depths, please use the privacy
                contact below so the situation can be reviewed.
              </p>
            </section>

            <section>
              <h2>Changes to this policy</h2>
              <p>
                This policy may be updated as Inner Depths evolves, including when the WHOOP
                integration or data practices change. The Last updated date at the top of this page
                will reflect material revisions.
              </p>
            </section>

            <section className={styles.contactSection}>
              <h2>Privacy contact</h2>
              {privacyContactEmail ? (
                <p>
                  For privacy questions or account and data deletion requests, email{" "}
                  <a href={`mailto:${privacyContactEmail}`}>{privacyContactEmail}</a>.
                </p>
              ) : showDevelopmentFallback ? (
                <p className={styles.contactNotice}>
                  Privacy contact is not configured in this development environment.
                </p>
              ) : (
                <p className={styles.contactNotice}>
                  The privacy contact is being configured. Please check this page again before
                  submitting personal information.
                </p>
              )}
            </section>
          </div>
        </article>

        <footer className={styles.footer}>
          <span>Inner Depths</span>
          <Link href="/">Return to the application</Link>
        </footer>
      </div>
    </main>
  );
}
