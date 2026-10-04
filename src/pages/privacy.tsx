import type { ReactNode } from "react";
import { Link } from "react-router";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
    <section className="space-y-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        {children}
    </section>
);

const Privacy = () => (
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-12 text-sm leading-relaxed">
        <Link to="/sign-in" className="text-muted-foreground hover:underline">← Back</Link>

        <div>
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: October 4, 2026</p>
        </div>

        <Section title="What Collar PL is">
            <p>
                Collar PL is a tool for powerlifting coaches to manage their athletes, payments,
                training blocks, and meet entries. It is built for coaches, not for athletes or children.
            </p>
        </Section>

        <Section title="What we collect">
            <ul className="list-disc space-y-1 pl-5">
                <li>
                    <strong>Your account:</strong> name, email, and a hashed password (we never store your
                    password in readable form). Each sign-in session also records your IP address and browser details.
                </li>
                <li>
                    <strong>Athlete information you enter:</strong> names, dates of birth, contact details,
                    location, weight class, equipment, lifting records, meet entries, payment due dates and
                    status, training block dates, and notes.
                </li>
            </ul>
            <p>
                Collar PL does not process payments or store card numbers. Payment records are notes kept by the coach.
            </p>
        </Section>

        <Section title="Cookies and local storage">
            <p>We use only what is needed to run the app. We do not use analytics or advertising cookies.</p>
            <ul className="list-disc space-y-1 pl-5">
                <li><strong>Session cookie</strong> keeps you signed in.</li>
                <li><strong>Sidebar cookie</strong> remembers whether the sidebar is open.</li>
                <li><strong>Theme setting</strong> (stored in your browser) remembers light or dark mode.</li>
            </ul>
        </Section>

        <Section title="How we use it">
            <p>
                To run the service (sign you in, show your roster, send password reset emails) and keep it
                secure (rate limiting and abuse prevention). We do not sell your data or use it for advertising.
            </p>
        </Section>

        <Section title="Who can see it">
            {/* keep this paragraph only once per-coach access is actually enforced on every route */}
            <p>Athlete information is visible only to the coach account that entered it.</p>
            <p>We use these service providers to run Collar PL:</p>
            <ul className="list-disc space-y-1 pl-5">
                <li>Neon (database hosting)</li>
                <li>Railway (backend hosting) and Vercel (frontend hosting)</li>
                <li>Resend (email delivery)</li>
                <li>Arcjet (abuse prevention, which sees request details such as your IP address)</li>
            </ul>
            <p>These providers may store data outside Canada.</p>
        </Section>

        <Section title="Athletes under 18">
            <p>
                Coaches may record information about athletes under 18. If you do, you are responsible for
                having permission from the athlete or their parent or guardian to keep that information here.
            </p>
        </Section>

        <Section title="Keeping and deleting data">
            <p>
                We keep your data while your account is active. Sign-in sessions expire after 1 day.
                To have your account or any athlete record permanently deleted, email [CONTACT EMAIL].
                Removing an athlete in the app hides it but may not erase it immediately, so ask us if you
                need it permanently erased.
            </p>
        </Section>

        <Section title="Changes and contact">
            <p>If this policy changes, the date at the top will be updated. Questions: [CONTACT EMAIL].</p>
        </Section>
    </div>
);

export default Privacy;