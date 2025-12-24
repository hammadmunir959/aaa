import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Cookie, Settings, Eye, Shield } from "lucide-react";

const CookiePolicy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40"
            style={{
              backgroundImage: "url('/ABS2GSkXydXnbgyZpBGfuhNf4twTlTIR.png')"
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gold">Cookie Policy</h1>
                </div>
                <p className="text-lg opacity-90">Last updated: {new Date().toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Content Section */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <AnimatedSection>
                <div className="prose prose-lg max-w-none">
                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">1. What Are Cookies?</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
                    </p>
                    <p className="text-muted-foreground">
                      Cookies allow a website to recognise your device and store some information about your preferences or past actions. This helps us provide you with a better experience when you browse our website.
                    </p>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">2. How We Use Cookies</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      AAA Accident Solutions LTD uses cookies for the following purposes:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>To ensure our website functions correctly</li>
                      <li>To remember your preferences and settings</li>
                      <li>To analyse website traffic and user behaviour</li>
                      <li>To improve our website's performance and user experience</li>
                      <li>To provide relevant content and advertisements (with your consent)</li>
                    </ul>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">3. Types of Cookies We Use</h2>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-gold">3.1 Strictly Necessary Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                      </p>
                      <p className="text-muted-foreground text-sm italic">
                        <strong>Legal Basis:</strong> These cookies are necessary for the performance of a contract (use of our website) and do not require consent.
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-gold">3.2 Performance/Analytics Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. They allow us to count visits, identify traffic sources, and understand which pages are most popular.
                      </p>
                      <p className="text-muted-foreground text-sm italic">
                        <strong>Examples:</strong> Google Analytics cookies
                      </p>
                      <p className="text-muted-foreground text-sm italic">
                        <strong>Legal Basis:</strong> Your consent (you can opt-out at any time)
                      </p>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3 text-gold">3.3 Functionality Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies enable the website to provide enhanced functionality and personalisation. They may remember your preferences, such as language or region, to provide a more personalised experience.
                      </p>
                      <p className="text-muted-foreground text-sm italic">
                        <strong>Legal Basis:</strong> Your consent (you can opt-out at any time)
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-3 text-gold">3.4 Marketing/Advertising Cookies</h3>
                      <p className="text-muted-foreground mb-2">
                        These cookies are used to deliver relevant advertisements and track the effectiveness of our marketing campaigns. They may also be used to limit the number of times you see an advertisement.
                      </p>
                      <p className="text-muted-foreground text-sm italic">
                        <strong>Legal Basis:</strong> Your consent (you can opt-out at any time)
                      </p>
                    </div>
                  </div>

                  <div className="mb-12">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-3xl font-bold text-gold">4. Third-Party Cookies</h2>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements. These include:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li><strong>Google Analytics:</strong> To analyse website usage and performance</li>
                      <li><strong>Social Media Platforms:</strong> To enable social sharing and integration</li>
                      <li><strong>Advertising Networks:</strong> To deliver targeted advertisements</li>
                    </ul>
                    <p className="text-muted-foreground">
                      These third parties may use cookies to collect information about your online activities across different websites. We do not control these cookies, and you should refer to the respective privacy policies of these third parties.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">5. Managing Cookies</h2>
                    <p className="text-muted-foreground mb-4">
                      You have the right to accept or reject cookies. Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies if you prefer.
                    </p>
                    <div className="bg-muted p-6 rounded-lg mb-4">
                      <h3 className="text-lg font-semibold mb-3">Browser Settings</h3>
                      <p className="text-muted-foreground mb-2 text-sm">
                        You can control cookies through your browser settings. Here are links to help you manage cookies in popular browsers:
                      </p>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground text-sm ml-4">
                        <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Chrome</a></li>
                        <li><a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Mozilla Firefox</a></li>
                        <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Safari</a></li>
                        <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Microsoft Edge</a></li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      <strong>Note:</strong> Blocking or deleting cookies may affect your ability to use some features of our website. Some parts of the site may not function properly if cookies are disabled.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">6. Cookie Consent</h2>
                    <p className="text-muted-foreground mb-4">
                      When you first visit our website, you will see a cookie consent banner. You can:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4 ml-4">
                      <li>Accept all cookies</li>
                      <li>Reject non-essential cookies</li>
                      <li>Customise your cookie preferences</li>
                      <li>Change your preferences at any time through our cookie settings</li>
                    </ul>
                    <p className="text-muted-foreground">
                      You can withdraw your consent at any time by clearing your browser cookies or adjusting your browser settings.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">7. Cookies We Use</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full border-collapse border border-border">
                        <thead>
                          <tr className="bg-muted">
                            <th className="border border-border p-3 text-left font-semibold">Cookie Name</th>
                            <th className="border border-border p-3 text-left font-semibold">Purpose</th>
                            <th className="border border-border p-3 text-left font-semibold">Duration</th>
                            <th className="border border-border p-3 text-left font-semibold">Type</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-border p-3 text-sm">sessionid</td>
                            <td className="border border-border p-3 text-sm text-muted-foreground">Maintains user session</td>
                            <td className="border border-border p-3 text-sm">Session</td>
                            <td className="border border-border p-3 text-sm">Strictly Necessary</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-sm">csrftoken</td>
                            <td className="border border-border p-3 text-sm text-muted-foreground">CSRF protection</td>
                            <td className="border border-border p-3 text-sm">1 year</td>
                            <td className="border border-border p-3 text-sm">Strictly Necessary</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-sm">cookie_consent</td>
                            <td className="border border-border p-3 text-sm text-muted-foreground">Stores cookie consent preferences</td>
                            <td className="border border-border p-3 text-sm">1 year</td>
                            <td className="border border-border p-3 text-sm">Strictly Necessary</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-sm">_ga</td>
                            <td className="border border-border p-3 text-sm text-muted-foreground">Google Analytics - distinguishes users</td>
                            <td className="border border-border p-3 text-sm">2 years</td>
                            <td className="border border-border p-3 text-sm">Performance</td>
                          </tr>
                          <tr>
                            <td className="border border-border p-3 text-sm">_gid</td>
                            <td className="border border-border p-3 text-sm text-muted-foreground">Google Analytics - distinguishes users</td>
                            <td className="border border-border p-3 text-sm">24 hours</td>
                            <td className="border border-border p-3 text-sm">Performance</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">8. Updates to This Policy</h2>
                    <p className="text-muted-foreground mb-4">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page.
                    </p>
                    <p className="text-muted-foreground">
                      The "Last updated" date at the top of this page indicates when the policy was last revised.
                    </p>
                  </div>

                  <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-gold">9. Contact Us</h2>
                    <p className="text-muted-foreground mb-4">
                      If you have any questions about our use of cookies, please contact us:
                    </p>
                    <div className="bg-muted p-6 rounded-lg">
                      <p className="text-muted-foreground mb-2"><strong>AAA Accident Solutions LTD</strong></p>
                      <p className="text-muted-foreground mb-2">Email: info@aaa-as.co.uk</p>
                      <p className="text-muted-foreground">Website: www.aaa-as.co.uk</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CookiePolicy;

