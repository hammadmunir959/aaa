"""
Management command to populate default chatbot context entries.
This command creates default context entries for all sections that can be modified via the context page.
"""

from django.core.management.base import BaseCommand

from chatbot.models import ChatbotContext


class Command(BaseCommand):
    """Populate default chatbot context entries."""

    help = "Populates default chatbot context entries for all sections. Only creates missing entries."

    def add_arguments(self, parser):
        parser.add_argument(
            "--force",
            action="store_true",
            help="Force update existing contexts with default values",
        )
        parser.add_argument(
            "--section",
            type=str,
            help="Only populate a specific section",
        )

    def handle(self, *args, **options):
        """Execute the command."""
        force = options.get("force", False)
        section_filter = options.get("section")

        self.stdout.write("Populating default chatbot contexts...\n")

        # Default context entries for all sections
        default_contexts = {
            "intro": {
                "title": "Chatbot Introduction",
                "content": """Welcome to **AAA Accident Solutions LTD**. We are a premier accident claims management and car hire company.
We specialize in helping drivers involved in non-fault accidents by providing:
• **Like-for-like replacement vehicles** (delivered same-day)
• **Comprehensive accident claim management**
• **Vehicle recovery and secure storage**
• **Legal support for personal injury claims**
• **Premium vehicle sales and acquisition**

Our goal is to keep you mobile and stress-free while we handle the complexities of your claim.
How can I assist you today? You can ask about our **services**, **fleet**, **claim process**, **buying a car**, or **contact details**.""",
                "keywords": "welcome, hello, hi, help, introduction, start, begin",
                "display_order": 0,
            },
            "company": {
                "title": "Company Information",
                "content": """**About AAA Accident Solutions LTD**
We are a leading accident claims management company with over 15 years of experience. We provide nationwide coverage, ensuring that wherever you are in the UK, we can support you.

**Why Choose Us:**
• **No Win No Fee**: You only pay if we successfully recover compensation.
• **No Upfront Costs**: We recover all costs from the at-fault party's insurer.
• **Dedicated Claim Handler**: A personal agent to guide you from start to finish.
• **Same-Day Replacement**: Get back on the road immediately with a like-for-like vehicle.
• **24/7 Support**: We are always available to assist you.
• **Nationwide Coverage**: Serving clients across the entire UK.""",
                "keywords": "company, about, information, who, what, business, organization",
                "display_order": 1,
            },
            "services": {
                "title": "Services Overview",
                "content": """We offer a complete suite of services for drivers and fleet operators:

**1. PCO / Taxi Replacement**
If you're a PCO driver in a non-fault accident, we provide:
• **Like-for-Like Vehicles**: Tax-compliant PCO vehicles (e.g., Mercedes E-Class, Toyota Prius) matched to your needs.
• **Same-Day Delivery**: Delivered to your door.
• **Loss of Earnings Claim**: We help you recover income lost while off the road.
• **No Upfront Cost**: Costs are claimed from the at-fault insurer.

*-> How to Avail:*
1. **Contact Us**: Call +44 345 565 1332 or use the "Start Your Claim" form on our site.
2. **Assessment**: We verify the accident details and liability.
3. **Delivery**: A replacement vehicle is delivered to you (often within 24 hours).
4. **Resolution**: We manage the claim and vehicle repairs until you're back in your own car.

**2. Accident Claim Management**
We handle the entire claims process:
• **Vehicle Recovery & Storage**: Transporting your car to a safe location/bodyshop.
• **Repairs**: Using manufacturer-approved repairers.
• **Personal Injury Claims**: Legal support for compensation if you were injured.

*-> How to Avail:*
1. **Report**: Notify us immediately after the accident.
2. **Manage**: We assign a dedicated handler to deal with insurers.
3. **Settle**: We negotiate the best possible settlement for repairs and injury.

**3. Car Sales & Acquisition**
We buy and sell premium vehicles:
• **Buy**: Curated selection of accident-free, well-maintained luxury cars (BMW 5 Series, Mercedes E-Class, etc.).
• **Sell**: We offer competitive prices for your premium vehicle.
• **Concierge**: We can source specific vehicles for you.

*-> How to Avail:*
1. **Browse/Enquire**: View our "Our Fleet" or "Car Sales" page and request info on a car.
2. **Consultation**: A sales specialist will contact you with details/viewing options.
3. **Purchase**: We assist with financing (if needed) and handover.""",
                "keywords": "services, what do you offer, what services, help, assistance, support, fleet, cars",
                "display_order": 2,
            },
            "working": {
                "title": "How We Work",
                "content": """**Working Hours:**
• **Monday - Friday**: 09:00 AM - 06:00 PM
• **Saturday**: 10:00 AM - 04:00 PM
• **Sunday**: Closed

**24/7 Emergency Support**:
Our accident helpline +44 345 565 1332 is available 24 hours day, 7 days a week for urgent assistance, vehicle recovery, and claim reporting.

**General Process**:
1. **Contact**: Reach out via phone, WhatsApp, or website.
2. **Verification**: We confirm details (insurance, accident info).
3. **Action**: We deploy recovery/hire vehicle or schedule viewing.
4. **Support**: Continuous updates from your dedicated handler.""",
                "keywords": "how it works, process, procedure, steps, workflow, how do I",
                "display_order": 3,
            },
            "faqs": {
                "title": "Frequently Asked Questions",
                "content": """**Frequently Asked Questions:**

**Q: Do I need to pay anything upfront?**
A: No. For non-fault accidents, all costs (hire, recovery, storage) are recovered from the at-fault party's insurer. We work on a No Win No Fee basis.

**Q: How long can I keep the replacement vehicle?**
A: You keep the vehicle for as long as your own car is being repaired, or until your claim is settled/pay-out received (if your car is a total loss).

**Q: What if the other driver is uninsured?**
A: We can still help! We will pursue the claim through the Motor Insurers' Bureau (MIB).

**Q: Can I claim for loss of earnings?**
A: Yes, especially for PCO/Taxi drivers. We will document your lost income and include it in the claim against the at-fault insurer.

**Q: What vehicles do you have?**
A: We have a premium fleet including Mercedes E-Class, S-Class, V-Class, Audi A8, Range Rover Sport, Land Rover Discovery, VW Tiguan, and Kia Niro.""",
                "keywords": "faq, questions, answers, help, common, frequently asked, fleet, cars",
                "display_order": 4,
            },
            "pricing": {
                "title": "Pricing Information",
                "content": """**Pricing Information:**

**Accident Claims & Replacement Vehicles**:
• **Non-Fault Claims**: FREE to you. Costs are recovered from the third-party insurer.
• **Fault Claims**: We can still provide competitively priced hire vehicles. Please contact us for a quote.

**Car Hire & Sales**:
• We offer **highly competitive daily rates** for all our vehicles, from standard to premium luxury models.
• Our prices are tailored to your specific needs and duration of hire.
• **Car Sales**: We offer excellent value on our range of premium ex-fleet and sourced vehicles.

**Contact us today for a personalized quote!**
• Call: +44 345 565 1332
• WhatsApp: +44 79 4377 0119""",
                "keywords": "price, pricing, cost, rates, fees, how much, quote, quotation",
                "display_order": 5,
            },
            "contact": {
                "title": "Contact Details",
                "content": """**Contact Us:**

• **Address**: First Floor, Urban Building, 3-9 Albert St, Slough SL1 2BE, United Kingdom
• **Phone (24/7)**: +44 345 565 1332
• **WhatsApp**: +44 79 4377 0119
• **Email**: info@aaa-as.co.uk
• **Website**: www.aaa-as.co.uk

**Office Hours**: 
• Monday to Friday: 9:00 AM - 6:00 PM
• Saturday: 10:00 AM - 4:00 PM
• Sunday: Closed""",
                "keywords": "contact, email, phone, address, location, office, reach, get in touch, whatsapp, number",
                "display_order": 6,
            },
            "policies": {
                "title": "Company Policies",
                "content": """**Policies:**
• **Privacy Policy**: We respect your data and only share it with relevant parties (insurers, legal team) to process your claim.
• **Terms of Service**: By using our services, you agree to our terms. For non-fault claims, you must cooperate with us to recover costs from the third party.""",
                "keywords": "policy, policies, terms, conditions, rules, regulations, cancellation, refund",
                "display_order": 7,
            },
            "emergency": {
                "title": "Emergency Services",
                "content": """**Emergency Assistance (24/7):**
If you have just had an accident:
1. **Ensure Safety**: Stop the vehicle in a safe place.
2. **Call Us**: Dial **+44 345 565 1332** immediately.
3. **Do not admit liability**: Exchange details with the other driver but do not say the accident was your fault until liability is established.
4. **Gather Evidence**: Take photos of the scene, damage, and get witness details.""",
                "keywords": "emergency, urgent, accident, breakdown, help, assistance, roadside, support, number",
                "display_order": 8,
            },
        }

        # Filter by section if specified
        if section_filter:
            if section_filter not in default_contexts:
                self.stdout.write(
                    self.style.ERROR(f"Invalid section: {section_filter}")
                )
                self.stdout.write(
                    f'Valid sections: {", ".join(default_contexts.keys())}'
                )
                return
            default_contexts = {section_filter: default_contexts[section_filter]}

        created_count = 0
        updated_count = 0
        skipped_count = 0

        for section, context_data in default_contexts.items():
            try:
                context, created = ChatbotContext.objects.get_or_create(
                    section=section,
                    defaults={
                        "title": context_data["title"],
                        "content": context_data["content"],
                        "keywords": context_data["keywords"],
                        "is_active": True,
                        "display_order": context_data["display_order"],
                    },
                )

                if created:
                    created_count += 1
                    self.stdout.write(
                        self.style.SUCCESS(f"✓ Created context for section: {section}")
                    )
                elif force:
                    # Update existing context
                    context.title = context_data["title"]
                    context.content = context_data["content"]
                    context.keywords = context_data["keywords"]
                    context.display_order = context_data["display_order"]
                    context.is_active = True
                    context.save()
                    updated_count += 1
                    self.stdout.write(
                        self.style.WARNING(f"↻ Updated context for section: {section}")
                    )
                else:
                    skipped_count += 1
                    self.stdout.write(
                        self.style.NOTICE(
                            f"- Skipped section: {section} (already exists)"
                        )
                    )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f"✗ Error processing section {section}: {str(e)}")
                )

        self.stdout.write("\n" + "=" * 50)
        self.stdout.write(self.style.SUCCESS(f"\nSummary:"))
        self.stdout.write(f"  Created: {created_count}")
        if force:
            self.stdout.write(f"  Updated: {updated_count}")
        self.stdout.write(f"  Skipped: {skipped_count}")
        self.stdout.write(f"  Total: {len(default_contexts)}")
        self.stdout.write("\n" + "=" * 50)

        if created_count > 0 or updated_count > 0:
            self.stdout.write(
                self.style.SUCCESS("\n✓ Default contexts populated successfully!")
            )
            self.stdout.write(
                "You can now modify these contexts via the Chatbot Context page in the admin panel."
            )
        else:
            self.stdout.write(
                self.style.NOTICE(
                    "\nAll contexts already exist. Use --force to update existing entries."
                )
            )
