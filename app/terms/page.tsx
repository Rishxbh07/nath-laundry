// File: app/terms/page.tsx
import React from 'react';
import Header from '@/app/components/Header';
import { 
  Mail, Globe, Phone, FileText, Monitor, ShieldAlert, Info, MapPin, Calendar 
} from 'lucide-react';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col pt-24 pb-20 px-4 md:px-6">
      <Header />

      <div className="max-w-3xl mx-auto w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Page Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-slate-900">Terms & Conditions</h1>
          <div className="flex items-center justify-center gap-4 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span className="flex items-center gap-1"><Calendar size={12} /> Last Updated:9/12/2025</span>
            <span className="flex items-center gap-1"><MapPin size={12} /> Pune, Maharashtra, India</span>
          </div>
        </div>

        {/* =====================================================================================
            SECTION III – SUPPORT & DEVELOPER CONTACT (MOVED TO TOP AS REQUESTED)
           ===================================================================================== */}
        <section className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Monitor className="text-blue-200" size={24} /> 
                Developer & Support
              </h2>
              <p className="text-blue-100 text-sm mt-1 opacity-90">
                Technical support and custom development inquiries.
              </p>
            </div>
          </div>

          <div className="bg-white/10 rounded-2xl p-5 border border-white/20 backdrop-blur-sm">
            <p className="text-sm leading-relaxed mb-4 text-blue-50">
              For any technical issues, feedback, or support related to the Platform, or if you wish to develop a similar custom app/website for your own business, you may contact the Developer.
            </p>
            
            <a 
              href="mailto:rishabhpatre69@gmail.com" 
              className="flex items-center gap-3 bg-white text-blue-700 px-4 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors active:scale-95 w-fit"
            >
              <Mail size={18} />
              rishabhpatre69@gmail.com
            </a>
          </div>
        </section>

        {/* =====================================================================================
            SECTION I – CUSTOMER RULES & REGULATIONS
           ===================================================================================== */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="text-blue-600" size={24} />
              Customer Rules & Regulations
            </h2>
            <p className="text-sm text-slate-400 mt-1">Section I — Laundry Services</p>
          </div>

          <div className="space-y-8">
            <RuleBlock number="1" title="Bill / Token Mandatory for Pickup">
              <p>Customers must present the original bill or token at the time of delivery/collection of garments.</p>
              <p>In case of loss of bill/token, delivery will be made only after proper verification and approval by management.</p>
              <p>The laundry reserves the right to deny delivery if satisfactory proof of ownership is not established.</p>
            </RuleBlock>

            <RuleBlock number="2" title="Garment Count & Condition">
              <p>Customers are requested to check and confirm the item count at the time of submitting garments.</p>
              <p>Once the receipt/bill is issued and signed/accepted, the laundry will not be responsible for any claim of missing items.</p>
              <p>Any discrepancy must be reported immediately at the time of submission.</p>
            </RuleBlock>

            <RuleBlock number="3" title="Color Bleeding / Shrinkage / Damage">
              <p>Some garments may bleed color, shrink, loosen stitching, or lose buttons/embroidery during washing, drying, or ironing due to the nature and quality of fabric or manufacturing.</p>
              <p>The laundry shall not be responsible for such damage arising from inherent defects in the garment, fabric, dye, accessories, or manufacturing quality.</p>
              <p>All garments are processed using standard, professional methods; however, results may vary depending on material.</p>
            </RuleBlock>

            <RuleBlock number="4" title="Pre-Damage / Delicate Material">
              <p>The laundry is not responsible for garments that already have tears, holes, loose threads, weak fabric, damaged zips, or other pre-existing defects at the time of submission.</p>
              <p>Garments made from or containing delicate or sensitive materials – including, but not limited to, heavy embroidery, stones, sequins, velvet, silk, wool, rayon, chiffon, organza, delicate prints, or special finishes – are cleaned strictly at the customer’s risk.</p>
              <p>Any damage resulting from the inherent weakness or special nature of such fabrics/accessories will not be the responsibility of the laundry.</p>
            </RuleBlock>

            <RuleBlock number="5" title="Non-Removal of Stains">
              <p>The laundry does not guarantee 100% removal of stains.</p>
              <p>Some stains may be permanent or may require harsh treatment that can damage or lighten the fabric.</p>
              <p>The customer understands and agrees that attempts to remove tough stains may lead to color loss, patchiness, or fabric damage, and the laundry shall not be liable for such outcomes.</p>
            </RuleBlock>

            <RuleBlock number="6" title="Pickup Window / Storage">
              <p>Customers are requested to collect their garments within 15 days from the promised delivery date.</p>
              <p>After this period, the laundry shall not be responsible for any loss, damage, color fade, or deterioration arising from prolonged storage.</p>
              <p>Additional storage or handling charges, if any, may be applied at management’s discretion.</p>
            </RuleBlock>

            <RuleBlock number="7" title="Lost / Unclaimed Garments">
              <p>If garments remain unclaimed for 30 days from the delivery date, the laundry reserves the right to dispose of, donate, or otherwise deal with the items without further notice.</p>
              <p>No compensation shall be payable for garments that are unclaimed beyond this period.</p>
            </RuleBlock>

            <RuleBlock number="8" title="Special Requests">
              <p>Any specific wash, dry, or iron preferences (e.g., “no starch”, “low heat”, “hand wash only”, etc.) must be clearly mentioned and recorded on the bill at the time of booking.</p>
              <p>Verbal instructions that are not written on the bill may not be considered.</p>
              <p>The laundry will make reasonable efforts to follow written instructions but does not guarantee outcomes that go against standard processing methods.</p>
            </RuleBlock>

            <RuleBlock number="9" title="Payment Terms">
              <p>Full payment must be made at the time of delivery/collection of garments unless otherwise agreed in writing.</p>
              <p>The laundry is not responsible for any personal belongings left inside pockets, such as money, cards, jewellery, documents, keys, or other items.</p>
              <p>Customers are requested to check and empty all pockets before handing over garments. Any items found may or may not be returned, depending on discovery and identification.</p>
            </RuleBlock>

            <RuleBlock number="10" title="Disputes">
              <p>In case of any dispute regarding service, quality, or any other matter, the decision of the management will be final and binding.</p>
              <p>Any claim, if at all considered, must be raised within 24 hours of receiving the garments.</p>
            </RuleBlock>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 italic border border-slate-100 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              By using our laundry services, the customer expressly agrees to the above Rules & Regulations and acknowledges that these terms are reasonable and necessary for the operation of the service.
            </div>
          </div>
        </section>

        {/* =====================================================================================
            SECTION II – DIGITAL PLATFORM TERMS
           ===================================================================================== */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="border-b border-slate-100 pb-6 mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="text-indigo-600" size={24} />
              Platform Terms of Use
            </h2>
            <p className="text-sm text-slate-400 mt-1">Section II — For Laundry Business Owners</p>
          </div>

          <div className="space-y-8">
            <p className="text-sm text-slate-600 bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              This section applies to the Laundry Business (“Client”) using the Nath Drycleaner Billing & Management Platform available at <span className="font-bold text-indigo-700">nath-laundry.vercel.app</span>.
            </p>

            <RuleBlock number="1" title="Nature of Service">
              <p>The Platform is provided as a digital tool to assist in billing, order tracking, customer records management, and related administrative functions.</p>
              <p>The arrangement constitutes access to a service and does not amount to sale, transfer, or permanent licensing of the underlying software or intellectual property.</p>
            </RuleBlock>

            <RuleBlock number="2" title="Access & Usage Rights">
              <p>The Client is granted a limited, non-exclusive, non-transferable right to access and use the Platform for internal business use only, for an indefinite period, subject to these Terms.</p>
              <p>This access is akin to a rental/usage arrangement for the digital system and does not create ownership or proprietary rights in favour of the Client over the Platform, its code, or its infrastructure.</p>
              <p className="font-medium mt-1">The Client shall not:</p>
              <ul className="list-disc list-inside pl-2 space-y-1 mt-1">
                <li>Copy, modify, or reverse engineer the Platform.</li>
                <li>Attempt to extract or claim rights over the source code or database structure.</li>
                <li>Sublicence, resell, or repackage the Platform for third parties.</li>
                <li>Migrate the Platform to another server without the express written consent of the Developer.</li>
              </ul>
            </RuleBlock>

            <RuleBlock number="3" title="Ownership & Intellectual Property">
              <p>All rights, title, and interest in and to the Platform, including but not limited to source code, design, UI/UX, workflows, databases, logic, configurations, documentation, hosting setup, and any future enhancements, shall at all times remain the exclusive property of the developer/creator of the Platform (“Developer”).</p>
              <p>No provision in these Terms shall be construed as transferring or assigning any intellectual property rights to the Client. The Client receives a right to use, not a right to own.</p>
            </RuleBlock>

            <RuleBlock number="4" title="Business Data & Storage">
              <p>Operational data entered by the Client (e.g., customer details, orders, bills, pricing, categories, and related records) reflect the business activity of the Client, but are stored and managed within the Platform’s proprietary digital environment.</p>
              <p>The Developer retains control over the manner and location of data storage, database structure, backups, and archival processes.</p>
              <p>While reasonable efforts may be made to preserve data, the Developer does not guarantee perpetual storage, export in any specific format, or compatibility with third-party systems.</p>
            </RuleBlock>

            <RuleBlock number="5" title="Modifications, Updates & Changes">
              <p>The Developer may, at any time and at their sole discretion, modify, update, enhance, or alter the features, layout, appearance, or internal functioning of the Platform.</p>
              <p>Such modifications may include technical upgrades, bug fixes, security updates, addition/removal of features, or changes in hosting infrastructure.</p>
            </RuleBlock>

            <RuleBlock number="6" title="Availability & Downtime">
              <p>The Platform is provided on an “as-is” and “as-available” basis.</p>
              <p>The Developer does not guarantee uninterrupted operation of the Platform and shall not be liable for server downtime, outages, internet connectivity issues, or data syncing issues.</p>
            </RuleBlock>

            <RuleBlock number="7" title="Fees & Commercial Understanding">
              <p>Any amount paid by the Client towards the Platform represents consideration for continued access and usage of the digital service.</p>
              <p>Such fees do not signify transfer of ownership, intellectual property, or perpetual rights.</p>
              <p>The Developer reserves the right to revise pricing or commercial terms by giving reasonable notice.</p>
            </RuleBlock>

            <RuleBlock number="8" title="Termination / Discontinuation">
              <p>The Developer reserves the right, at their absolute discretion, to suspend or discontinue the Client’s access to the Platform, in whole or in part, at any time, with or without prior notice.</p>
              <p>Grounds for suspension include non-payment, misuse, security concerns, or technical restructuring.</p>
              <p>Discontinuation of access does not waive or cancel any financial obligations that arose before such discontinuation.</p>
            </RuleBlock>

            <RuleBlock number="9" title="Limitation of Liability">
              <p>The Platform is intended as an aid to business operations. The Developer shall not be responsible for loss of revenue, profit, business opportunities, or errors arising from incorrect data input.</p>
              <p>The Client remains solely responsible for verifying correctness of bills, data, and reports generated through the Platform.</p>
            </RuleBlock>

            <RuleBlock number="10" title="Governing Law & Jurisdiction">
              <p>These Terms shall be governed by and construed in accordance with the laws of India.</p>
              <p>Any disputes shall fall within the jurisdiction of the competent courts of the location where the Developer is primarily operating.</p>
            </RuleBlock>

            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 italic border border-slate-100 flex gap-2">
              <Info size={16} className="shrink-0 mt-0.5" />
              By accessing, logging into, or using the Platform in any manner, the Client confirms that they have read, understood, and agree to be bound by these Terms related to the Platform and its use.
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center text-[10px] text-slate-400 uppercase tracking-widest pb-10">
          © {new Date().getFullYear()} Nath Drycleaners & Platform Developer
        </div>

      </div>
    </main>
  );
}

// Reusable Component for Individual Rules
function RuleBlock({ number, title, children }: { number: string, title: string, children: React.ReactNode }) {
  return (
    <div className="relative pl-4">
      <div className="absolute left-0 top-1.5 w-1 h-1 bg-slate-300 rounded-full"></div>
      <h3 className="text-sm font-bold text-slate-800 mb-2">
        <span className="text-slate-400 mr-2">{number}.</span>
        {title}
      </h3>
      <div className="text-xs leading-relaxed text-slate-600 space-y-2 pl-6 border-l border-slate-100">
        {children}
      </div>
    </div>
  );
}