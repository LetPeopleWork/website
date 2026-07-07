import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { EFFECTIVE_DATE } from "@/lib/legal";

interface LegalInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "impressum" | "privacy" | "terms";
}

const LegalInfoDialog: React.FC<LegalInfoDialogProps> = ({
  open,
  onOpenChange,
  defaultTab = "impressum",
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Legal Information</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="impressum">Impressum</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms">Terms & Conditions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="impressum" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <h1 className="text-2xl font-bold mb-4">Impressum</h1>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">LetPeopleWork GmbH</h2>
                <p className="text-muted-foreground">
                  Mühlackerstrasse 108<br />
                  8046 Zürich<br />
                  Schweiz
                </p>
              </div>
              
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Contact</h2>
                <p className="text-muted-foreground">
                  E-Mail: <a href="mailto:contact@letpeople.work" className="text-primary hover:underline">contact@letpeople.work</a><br />
                  Internet: <a href="https://letpeople.work" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://letpeople.work</a>
                </p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">
                  <strong>Handelsregistereintrag:</strong> CHE-475.430.912
                </p>
                <p className="text-muted-foreground">
                  <strong>Vertretungsberechtigte Personen:</strong><br />
                  Benjamin Max Huser, Geschäftsführer<br />
                  Peter Waldemar Zylka-Greger, Geschäftsführer
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <h1 className="text-2xl font-bold mb-4">Privacy Policy</h1>
              
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">1. Data Controller</h2>
                  <p>
                    LetPeopleWork GmbH, Mühlackerstrasse 108, 8046 Zürich, Switzerland, is responsible for processing personal data collected via the website{" "}
                    <a href="https://letpeople.work" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://letpeople.work
                    </a>{" "}
                    and via email at{" "}
                    <a href="mailto:contact@letpeople.work" className="text-primary hover:underline">
                      contact@letpeople.work
                    </a>.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">2. Types of Data Processed</h2>
                  <p className="mb-2">We process personal data that you voluntarily supply to us:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Contact details (e.g., name, email) when you send inquiries.</li>
                    <li>Payment-related data (e.g., credit card details) only through Stripe.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">3. Legal Basis & Purpose</h2>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Contract fulfillment:</strong> We process data to respond to your inquiries, to provide purchased services, and to conduct billing via Stripe.</li>
                    <li><strong>Legitimate interest:</strong> For business communication and service improvement.</li>
                    <li>Stripe processes payment data on our behalf, acting as a data processor. All payment information is handled according to Stripe's privacy policy and agreements.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">4. Data Transfer & International Transfers</h2>
                  <p>
                    Stripe is responsible for cross-border data transfers. They self-certify under the EU/Swiss Data Privacy Framework or use Standard Contractual Clauses as necessary.{" "}
                    <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      stripe.com
                    </a>
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">5. Cookies & Analytics</h2>
                  <p className="mb-2">We set no cookies of our own, and we use no advertising or cross-site tracking.</p>
                  <p className="mb-2">
                    To understand how our website is used, we use Plausible Analytics, a privacy-friendly, cookieless web analytics service hosted in the European Union. Plausible sets no cookies, stores no personal data, and does not track visitors across websites or devices. It collects only aggregated, anonymous statistics such as page views, referring sources, and country (derived from the IP address, which is never stored). The legal basis is our legitimate interest (Art. 6(1)(f) GDPR) in understanding and improving our website. A data processing agreement is in place with the provider.{" "}
                    <a href="https://plausible.io/data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      plausible.io/data-policy
                    </a>
                  </p>
                  <p>
                    Although Stripe may deploy cookies when customers complete checkout, we neither control nor place them from our site.{" "}
                    <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      stripe.com
                    </a>
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">6. Storage Period</h2>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Inquiry data:</strong> Deleted after 2 years unless ongoing business relationship exists.</li>
                    <li><strong>Contract/billing data:</strong> Retained for 10 years as required by Swiss commercial law.</li>
                    <li><strong>Payment data:</strong> Processed and stored by Stripe according to their retention policies.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">7. Your Rights</h2>
                  <p className="mb-2">Under Swiss data protection law, you have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Information:</strong> Request information about data processing</li>
                    <li><strong>Access:</strong> Request access to your data</li>
                    <li><strong>Rectification:</strong> Request correction of incorrect data</li>
                    <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                    <li><strong>Data portability:</strong> Request your data in a structured format</li>
                    <li><strong>Objection:</strong> Object to processing based on legitimate interests</li>
                  </ul>
                  <p className="mt-2">
                    To exercise these rights, contact us at{" "}
                    <a href="mailto:contact@letpeople.work" className="text-primary hover:underline">
                      contact@letpeople.work
                    </a>. We will respond within 30 days.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">8. Data Security</h2>
                  <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, loss, or misuse. All data transmission is encrypted using HTTPS.</p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">9. Changes to This Policy</h2>
                  <p>We may update this document if services change. The version in force is the one published on our website, with the effective date noted.</p>
                  <p className="mt-2 font-semibold">Effective Date: {EFFECTIVE_DATE}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="terms" className="mt-6">
            <div className="prose prose-sm max-w-none">
              <h1 className="text-2xl font-bold mb-4">Terms and Conditions</h1>
              
              <div className="space-y-6 text-muted-foreground">
                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">1. Scope</h2>
                  <p>
                    These Terms and Conditions (T&Cs) govern the contractual relationship between LetPeopleWork GmbH, Mühlackerstrasse 108, 8046 Zürich, Switzerland ("we", "us"), and our customers ("you") for services and products offered via{" "}
                    <a href="https://letpeople.work" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      https://letpeople.work
                    </a>, including training, workshops, consulting, and software licenses.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">2. Services Offered</h2>
                  <p>
                    We offer professional training, workshops, consulting services, and licenses for our proprietary software. Details of each service or product are described on the website or agreed individually in writing.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">3. Contract Conclusion</h2>
                  <p>
                    A contract is formed when you submit an order via the website or in writing and we confirm it. For software licenses or custom consulting, a separate written agreement may apply.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">4. Prices and Payment</h2>
                  <p>
                    Prices are in Swiss Francs (CHF), unless otherwise stated. Payment is due in advance unless otherwise agreed. Payment is processed via Stripe or invoice.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">5. Cancellation and Refund Policy</h2>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Workshops and Training:</strong> Free cancellation up to 7 days before the start. No refunds thereafter.</li>
                    <li><strong>Consulting:</strong> Cancellations must be communicated at least 48 hours in advance. Otherwise, we may charge the agreed rate.</li>
                    <li><strong>Software Licenses:</strong> No refund after delivery or activation unless otherwise agreed.</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">6. Intellectual Property</h2>
                  <p>
                    All materials, documentation, and software are protected by copyright and remain the intellectual property of LetPeopleWork GmbH. No reproduction, distribution, or modification is permitted without our written consent.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">7. Software License Terms</h2>
                  
                  <div className="ml-4 space-y-4">
                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.1 Scope of License</h3>
                      <p>
                        When purchasing a license for our software, you receive a non-exclusive, non-transferable right to use the software within your organization for up to 50 active instances. This includes use across teams or departments within the same legal entity.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.2 Use by Consulting Firms</h3>
                      <p>
                        Consulting firms may purchase licenses for internal use, including when providing services or performing analyses for external clients. However, if the client organization intends to use the software regularly, it must acquire its own license.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.3 Duration and Updates</h3>
                      <p>
                        Each license is valid for 12 months from the purchase date and includes access to all software updates released within the licensed period.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.4 Features and Scope</h3>
                      <p>
                        The scope of premium features may change over time. We reserve the right to add, modify, or remove features during the license term.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.5 No Service Level Agreements (SLAs)</h3>
                      <p>
                        No specific support or uptime guarantees (SLAs) are included with the license. Support may be offered at our discretion or under a separate agreement.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.6 Restrictions and Compliance</h3>
                      <p>
                        Licenses may not be shared, sublicensed, resold, or transferred to third parties. We reserve the right to audit usage and terminate licenses in case of misuse or violations of these terms.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.7 Disclaimer of Warranty</h3>
                      <p>
                        The software is provided "as is" without any warranty of fitness for a particular purpose or uninterrupted availability. To the extent permitted by law, we disclaim all warranties.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-base font-medium mb-1 text-foreground">7.8 Breach and Consequences</h3>
                      <p className="mb-2">
                        In case of a breach of the license terms, including but not limited to exceeding the permitted usage scope, sharing the license across organizations, or sublicensing, we reserve the right to:
                      </p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Terminate the license with immediate effect</li>
                        <li>Disable access to the software and associated services</li>
                        <li>Seek compensation for unlicensed usage or damages</li>
                        <li>Refuse refunds and exclude the customer from future licensing</li>
                      </ul>
                      <p className="mt-2">
                        Deliberate violations may lead to legal action under applicable Swiss civil or criminal law.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">8. Warranty and Liability</h2>
                  <p className="mb-2">
                    We provide our services with professional care. However, we do not guarantee specific outcomes.
                  </p>
                  <p>
                    To the extent permitted by law, we disclaim liability for indirect or consequential damages. Liability for direct damages is limited to the amount paid for the service or license.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">9. Data Protection</h2>
                  <p>
                    We process your personal data in accordance with our Privacy Policy and applicable Swiss data protection law.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">10. Applicable Law and Jurisdiction</h2>
                  <p>
                    These terms are governed by Swiss law. The exclusive place of jurisdiction is Zürich, Switzerland.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">11. Contact</h2>
                  <p>
                    LetPeopleWork GmbH<br />
                    Mühlackerstrasse 108<br />
                    8046 Zürich<br />
                    Switzerland<br />
                    <a href="mailto:contact@letpeople.work" className="text-primary hover:underline">
                      contact@letpeople.work
                    </a>
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-2 text-foreground">12. Football Allegiances (Non-Binding)</h2>
                  <p className="mb-2">
                    By engaging in business with LetPeopleWork GmbH, you tacitly acknowledge the cultural, emotional, and entirely subjective greatness of the following teams:
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Grasshopper Club Zürich</li>
                    <li>VfL Bochum</li>
                    <li>FC Barcelona</li>
                    <li>Dagenham & Redbridge FC</li>
                    <li>Wycombe Wanderers F.C.</li>
                    <li>Philadelphia Eagles</li>
                    <li>Cleveland Browns</li>
                  </ul>
                  <p className="mt-2">
                    This clause is strictly non-binding, has no legal consequences, and does not affect your rights, licenses, or obligations in any way. However, failure to show appropriate enthusiasm for these teams may result in harmless banter or unsolicited memes in future correspondence.
                  </p>
                  <p className="mt-4 font-semibold">Effective Date: {EFFECTIVE_DATE}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LegalInfoDialog;
