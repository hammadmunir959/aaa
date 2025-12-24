"""
Content Indexer Service

Handles indexing all website content for chatbot search capabilities.
Extracted from the monolithic services.py file for better maintainability.
"""

import logging
from typing import Any, Dict

from django.utils import timezone

from ..models import ContentIndex
from .content_search import invalidate_content_search_cache

logger = logging.getLogger(__name__)


class ContentIndexer:
    """
    Comprehensive content indexer for all website data.
    Automatically indexes and updates content for chatbot access.
    """

    def __init__(self):
        self.indexed_count = 0
        self.updated_count = 0
        self.error_count = 0

    def index_all_content(self) -> Dict[str, int]:
        """Index all website content"""
        logger.info("Starting comprehensive content indexing...")
        invalidate_content_search_cache()

        # Reset counters
        self.indexed_count = 0
        self.updated_count = 0
        self.error_count = 0

        # Index all content types
        self._index_blog_posts()
        self._index_vehicles()
        self._index_services()
        self._index_car_sales()
        self._index_testimonials()
        self._index_faqs()
        self._index_gallery()
        self._index_cms_pages()
        self._index_pricing_info()

        logger.info(
            "Content indexing completed. Indexed: %d, Updated: %d, Errors: %d",
            self.indexed_count,
            self.updated_count,
            self.error_count,
        )

        return {
            "indexed": self.indexed_count,
            "updated": self.updated_count,
            "errors": self.error_count,
        }

    def _index_blog_posts(self) -> None:
        """Index blog posts"""
        try:
            from blog.models import BlogPost

            posts = BlogPost.objects.filter(status="published").iterator(chunk_size=500)

            for post in posts:
                self._index_content(
                    content_type="blog",
                    object_id=post.id,
                    content_object=f"blog.BlogPost.{post.id}",
                    title=post.title,
                    slug=post.slug,
                    url=f"/blog/{post.slug}",
                    content_text=f"{post.title}\n\n{post.content}\n\n{post.excerpt or ''}",
                    summary=post.excerpt or post.content[:300] + "...",
                    keywords=post.tags or "",
                    category="blog",
                    tags="blog,article,news",
                    priority=8,
                    content_updated_at=post.updated_at,
                )
        except ImportError:
            logger.warning("Blog app not available for indexing")

    def _index_vehicles(self) -> None:
        """Index vehicle listings"""
        try:
            from vehicles.models import Vehicle

            vehicles = Vehicle.objects.filter(status="available").iterator(
                chunk_size=500
            )

            for vehicle in vehicles:
                content_text = f"""
                {vehicle.name} - {vehicle.manufacturer} {vehicle.model}

                Type: {vehicle.get_type_display()}
                Transmission: {vehicle.get_transmission_display()}
                Fuel: {vehicle.get_fuel_type_display()}
                Seats: {vehicle.seats}
                Daily Rate: £{vehicle.daily_rate}

                {vehicle.description or ''}
                """

                self._index_content(
                    content_type="vehicle",
                    object_id=vehicle.id,
                    content_object=f"vehicles.Vehicle.{vehicle.id}",
                    title=vehicle.name,
                    slug=f"vehicle-{vehicle.id}",
                    url=f"/vehicles/{vehicle.id}",
                    content_text=content_text,
                    summary=f"{vehicle.name} - {vehicle.get_type_display()} available for hire",
                    keywords=f"{vehicle.manufacturer},{vehicle.model},{vehicle.get_type_display()},{vehicle.get_transmission_display()},{vehicle.get_fuel_type_display()}",
                    category="vehicles",
                    tags=f"vehicle,{vehicle.get_type_display()},{vehicle.get_fuel_type_display()}",
                    priority=9,
                    content_updated_at=vehicle.updated_at,
                )
        except ImportError:
            logger.warning("Vehicles app not available for indexing")

    def _index_services(self) -> None:
        """Index service pages and information"""
        # Index static service content
        services_content = [
            {
                "title": "Accident Replacement Vehicles",
                "content": """
                Accident Replacement Vehicle Service

                We provide immediate replacement vehicles when your car is being repaired following an accident, vandalism, or mechanical failure.

                Key Features:
                • Same-day delivery available
                • Coordination with insurance companies
                • Vehicles delivered to your home or office
                • Comprehensive insurance included
                • No hidden fees or excess payments

                Process:
                1. Contact our emergency hotline
                2. Provide insurance details
                3. Vehicle assessment and delivery
                4. Ongoing support during repair period
                5. Seamless return when your car is ready

                Requirements:
                • Valid UK driving license
                • Insurance claim number
                • Vehicle registration details
                • Contact information

                Available 24/7 for emergency situations.
                """,
                "keywords": "accident,replacement,vehicle,insurance,emergency,repair",
                "category": "services",
                "priority": 10,
            },
            {
                "title": "Luxury Car Hire",
                "content": """
                Luxury and Premium Car Hire Service

                Experience the finest vehicles for special occasions, business travel, or personal indulgence.

                Fleet Includes:
                • Mercedes S-Class, E-Class, and C-Class
                • BMW 7-Series, 5-Series, and 3-Series
                • Audi A8, A6, and A4
                • Jaguar XJ and XF
                • Range Rover and other premium SUVs
                • Sports cars and convertibles

                Services:
                • Chauffeur-driven options available
                • Airport transfers and meet & greet
                • Wedding car hire packages
                • Business executive travel
                • Special occasion rentals

                Requirements:
                • Minimum age 25 years
                • Valid UK driving license (3+ years)
                • Clean driving record
                • Credit card security deposit

                Luxury vehicles available from £85 per day with chauffeur service.
                """,
                "keywords": "luxury,premium,chauffeur,executive,wedding,special occasion",
                "category": "services",
                "priority": 9,
            },
            {
                "title": "Car Sales & Purchase",
                "content": """
                Car Sales and Purchase Services

                We offer a comprehensive car sales and purchase service, allowing customers to buy quality vehicles or sell their cars to us.

                Car Purchase Services:
                • Browse our curated collection of quality vehicles
                • All vehicles are vetted and maintained to high standards
                • Wide selection of makes and models available
                • Competitive pricing with transparent costs
                • Financing options available
                • Trade-in options accepted
                • Dedicated sales consultation for each purchase

                Car Selling Services:
                • We buy cars directly from customers
                • Quick evaluation and fair pricing
                • Simple selling process
                • Accept vehicles in various conditions
                • Fast payment processing
                • Professional vehicle assessment

                Forms Available on Car Sales Page:

                1. Purchase Request Form (for buying a car):
                   - Access: Click "Request Purchase Info" or "Request purchase info" button on any vehicle listing
                   - Opens in a dialog/modal window
                   - Required fields: Full name, Email, Phone number
                   - Optional fields: Message about your interest, Proposed offer price, Financing assistance checkbox, Trade-in details
                   - Use this form to express interest in purchasing a specific vehicle from our listings
                   - Our sales team will contact you to arrange a consultation

                2. Sell Your Car Form (for selling a car):
                   - Access: Located on the right side of the Car Sales page, always visible
                   - Title: "Wanna Sell a Car/Vehicle?"
                   - Required fields: Full Name, Vehicle Make, Vehicle Model
                   - Contact information: Email OR Phone (at least one required)
                   - Optional fields: Vehicle Year, Mileage, Vehicle Image, Additional Details
                   - Use this form to submit your vehicle for sale
                   - Our team will contact you to evaluate your vehicle and make an offer

                How to Access Forms:
                - Visit the Car Sales page (/car-sales)
                - For purchasing: Browse vehicles and click "Request Purchase Info" on any listing
                - For selling: Scroll to the right side of the page to find the "Wanna Sell a Car/Vehicle?" form

                Process:
                1. Browse available vehicles or submit your car for sale using the appropriate form
                2. Fill out the required information
                3. Submit the form
                4. Our sales team will contact you for consultation
                5. Vehicle inspection and evaluation (for purchases or sales)
                6. Price negotiation and agreement
                7. Documentation and completion
                8. Vehicle transfer and payment

                Visit our Car Sales page to browse available vehicles or submit a sell request.
                """,
                "keywords": "car sales,buy car,sell car,purchase vehicle,car buying,car selling,purchase form,sell form,request purchase,submit sell,car sales page,how to buy car,how to sell car",
                "category": "services",
                "priority": 9,
            },
        ]

        for service in services_content:
            slug = service["title"].replace(" ", "-").lower()
            self._index_content(
                content_type="service",
                object_id=hash(service["title"]) % 1000000,  # Simple ID generation
                content_object=f'service.{service["title"].replace(" ", "_").lower()}',
                title=service["title"],
                slug=slug,
                url=f"/services/{slug}",
                content_text=service["content"],
                summary=service["content"][:200] + "...",
                keywords=service["keywords"],
                category=service["category"],
                tags=service["category"],
                priority=service["priority"],
                content_updated_at=timezone.now(),
            )

    def _index_car_sales(self) -> None:
        """Index car sales listings"""
        try:
            from car_sales.models import CarListing

            listings = CarListing.objects.filter(status="published").iterator(
                chunk_size=500
            )

            for listing in listings:
                content_text = f"""
                {listing.year} {listing.make} {listing.model} - For Sale

                Registration: {listing.registration}
                Price: £{listing.price}
                Mileage: {listing.mileage:,} miles
                Fuel Type: {listing.get_fuel_type_display()}
                Transmission: {listing.get_transmission_display()}
                Color: {listing.color}
                Condition: {listing.condition}
                Location: {listing.location or 'UK-wide'}

                {listing.description}

                Features: {', '.join(listing.features) if listing.features else 'Standard features'}
                """

                self._index_content(
                    content_type="car_sale",
                    object_id=listing.id,
                    content_object=f"car_sales.CarListing.{listing.id}",
                    title=f"{listing.year} {listing.make} {listing.model}",
                    slug=f"car-sale-{listing.id}",
                    url=f"/car-sales",
                    content_text=content_text,
                    summary=f"{listing.year} {listing.make} {listing.model} - £{listing.price} - {listing.mileage:,} miles",
                    keywords=f"{listing.make},{listing.model},car sale,buy car,purchase vehicle,{listing.get_fuel_type_display()},{listing.get_transmission_display()}",
                    category="car_sales",
                    tags=f"car sale,buy car,{listing.make},{listing.model},{listing.get_fuel_type_display()}",
                    priority=9,
                    content_updated_at=listing.updated_at,
                )

            # Index the car sales forms page information
            forms_content = """
            Car Sales Page Forms - How to Access and Use

            The Car Sales page (/car-sales) provides two forms for different purposes:

            1. Purchase Request Form (for buying a vehicle):
               - Location: Opens in a dialog/modal when you click "Request Purchase Info" or "Request purchase info" button on any vehicle listing
               - Purpose: Express interest in purchasing a specific vehicle from our listings
               - Required Information:
                 * Full name
                 * Email address
                 * Phone number
               - Optional Information:
                 * Message about your interest
                 * Proposed offer price (if you want to negotiate)
                 * Financing assistance (checkbox if you need help with vehicle financing)
                 * Trade-in details (if you have a vehicle to trade in)
               - How to access: Browse the vehicle listings, find a car you're interested in, and click the "Request Purchase Info" button
               - After submission: Our sales team will contact you to arrange a consultation and viewing

            2. Sell Your Car Form (for selling a vehicle):
               - Location: Always visible on the right side of the Car Sales page in a card titled "Wanna Sell a Car/Vehicle?"
               - Purpose: Submit your vehicle for sale to us
               - Required Information:
                 * Full Name
                 * Vehicle Make (e.g., BMW, Audi, Toyota)
                 * Vehicle Model (e.g., X5, Q7, Corolla)
                 * Contact: Email OR Phone (at least one is required)
               - Optional Information:
                 * Vehicle Year
                 * Mileage
                 * Vehicle Image (you can upload a photo)
                 * Additional Details (any other information about your vehicle)
               - How to access: Visit the Car Sales page and scroll to the right side to find the form
               - After submission: Our team will contact you to evaluate your vehicle and make an offer

            Quick Guide:
            - To buy a car: Visit /car-sales, browse vehicles, click "Request Purchase Info" on any listing
            - To sell a car: Visit /car-sales, find the "Wanna Sell a Car/Vehicle?" form on the right side, fill it out and submit
            - Both forms are simple to use and our team responds quickly to all submissions
            """

            self._index_content(
                content_type="car_sales_forms",
                object_id=999999,  # Special ID for forms page
                content_object="car_sales.forms_page",
                title="Car Sales Forms - Purchase and Sell Forms",
                slug="car-sales-forms",
                url="/car-sales",
                content_text=forms_content,
                summary="Information about the purchase request form and sell your car form on the Car Sales page",
                keywords="car sales forms,purchase form,sell form,request purchase,submit sell,car sales page,how to buy car,how to sell car",
                category="car_sales",
                tags="forms,purchase form,sell form,car sales",
                priority=10,  # High priority for form information
                content_updated_at=timezone.now(),
            )
        except ImportError:
            logger.warning("Car sales app not available for indexing")

    def _index_testimonials(self) -> None:
        """Index customer testimonials"""
        try:
            from testimonials.models import Testimonial

            testimonials = Testimonial.objects.filter(status="approved").iterator(
                chunk_size=500
            )

            for testimonial in testimonials:
                content_text = f"""
                Customer Testimonial from {testimonial.name}

                Rating: {testimonial.rating}/5 stars
                Service: {testimonial.get_service_type_display() if testimonial.service_type else 'General'}

                "{testimonial.feedback}"

                Customer: {testimonial.name}
                Service Used: {testimonial.get_service_type_display() if testimonial.service_type else 'Various Services'}
                Rating: {testimonial.rating} out of 5 stars
                """

                self._index_content(
                    content_type="testimonial",
                    object_id=testimonial.id,
                    content_object=f"testimonials.Testimonial.{testimonial.id}",
                    title=f"Testimonial from {testimonial.name}",
                    slug=f"testimonial-{testimonial.id}",
                    url=f"/testimonials/{testimonial.id}",
                    content_text=content_text,
                    summary=f'"{testimonial.feedback[:100]}..." - {testimonial.name}',
                    keywords=f'testimonial,review,feedback,{testimonial.get_service_type_display() if testimonial.service_type else ""}',
                    category="testimonials",
                    tags=f"testimonial,review,customer,feedback,{testimonial.rating}stars",
                    priority=6,
                    content_updated_at=testimonial.updated_at,
                )
        except ImportError:
            logger.warning("Testimonials app not available for indexing")

    def _index_faqs(self) -> None:
        """Index FAQ items"""
        try:
            from faq.models import FAQ

            faqs = FAQ.objects.filter(is_active=True).iterator(chunk_size=500)

            for faq in faqs:
                content_text = f"""
                FAQ: {faq.question}

                Category: {faq.get_category_display()}

                Answer: {faq.answer}

                Question: {faq.question}
                Category: {faq.get_category_display()}
                Last Updated: {faq.updated_at.strftime('%B %Y')}

                Related Topics: {faq.get_category_display()}, help, support, information
                """

                self._index_content(
                    content_type="faq",
                    object_id=faq.id,
                    content_object=f"faq.FAQ.{faq.id}",
                    title=faq.question,
                    slug=f"faq-{faq.id}",
                    url=f"/faq/{faq.id}",
                    content_text=content_text,
                    summary=f"FAQ: {faq.question[:100]}...",
                    keywords=f"faq,question,help,support,{faq.get_category_display()}",
                    category=faq.get_category_display(),
                    tags=f"faq,help,support,{faq.category}",
                    priority=7,
                    content_updated_at=faq.updated_at,
                )
        except ImportError:
            logger.warning("FAQ app not available for indexing")

    def _index_gallery(self) -> None:
        """Index gallery images"""
        try:
            from gallery.models import GalleryImage

            images = GalleryImage.objects.filter(is_active=True).iterator(
                chunk_size=500
            )

            for image in images:
                content_text = f"""
                Gallery Image: {image.title}

                Category: {image.get_category_display()}
                Description: {image.description or 'No description available'}

                Image Details:
                Title: {image.title}
                Category: {image.get_category_display()}
                Description: {image.description or ''}
                Uploaded: {image.uploaded_at.strftime('%B %Y')}
                """

                self._index_content(
                    content_type="gallery",
                    object_id=image.id,
                    content_object=f"gallery.GalleryImage.{image.id}",
                    title=image.title,
                    slug=f"gallery-{image.id}",
                    url=f"/gallery/{image.id}",
                    content_text=content_text,
                    summary=image.description or f"Gallery image: {image.title}",
                    keywords=f"gallery,image,photo,{image.get_category_display()}",
                    category=image.get_category_display(),
                    tags=f"gallery,image,{image.category}",
                    priority=4,
                    content_updated_at=image.uploaded_at,
                )
        except ImportError:
            logger.warning("Gallery app not available for indexing")

    def _index_cms_pages(self) -> None:
        """Index CMS landing pages"""
        try:
            from cms.models import LandingPageConfig

            pages = LandingPageConfig.objects.all().iterator(chunk_size=500)

            for page in pages:
                content_text = f"""
                Landing Page Configuration

                Contact Information:
                Phone: {page.contact_phone or 'Not specified'}
                Email: {page.contact_email or 'Not specified'}
                Address: {page.contact_address or 'Not specified'}
                Business Hours: {page.contact_hours or 'Not specified'}
                """

                if page.google_map_embed_url:
                    content_text += f"\nLocation: Google Maps available"

                self._index_content(
                    content_type="cms",
                    object_id=page.id,
                    content_object=f"cms.LandingPageConfig.{page.id}",
                    title="Homepage",
                    slug="homepage",
                    url="/",
                    content_text=content_text,
                    summary="Welcome to AAA Accident Solutions LTD - Contact information and company details",
                    keywords="homepage,landing,main,contact,address,phone,email",
                    category="cms",
                    tags="homepage,landing,main,contact",
                    priority=10,
                    content_updated_at=page.last_updated,
                )
        except ImportError:
            logger.warning("CMS app not available for indexing")

    def _index_pricing_info(self) -> None:
        """Index pricing information"""
        pricing_content = """
        Car Hire Pricing & Rates

        Our pricing is designed to be transparent and competitive. Rates vary based on:

        Vehicle Categories:
        • Economy Vehicles: From £25/day
        • Standard Vehicles: From £35/day
        • Premium Vehicles: From £55/day
        • Luxury Vehicles: From £85/day

        Additional Services:
        • Insurance coverage included in all rentals
        • GPS navigation systems available
        • Child seats and boosters
        • Additional driver fees
        • One-way rental fees

        Discount Options:
        • Weekly rates: Save up to 15%
        • Monthly rates: Save up to 25%
        • Early booking discounts
        • Corporate accounts available

        Insurance & Excess:
        • Comprehensive insurance included
        • Excess amounts vary by vehicle category (£500-£2000)
        • Reduced excess available for experienced drivers

        Booking Requirements:
        • Valid UK driving license
        • Credit card for security deposit
        • Proof of address (for long-term rentals)
        • Additional documentation may be required for business rentals

        All prices are subject to VAT and may vary based on season and availability.
        """

        self._index_content(
            content_type="pricing",
            object_id=1,
            content_object="pricing.info",
            title="Car Hire Pricing & Rates",
            slug="pricing",
            url="/pricing",
            content_text=pricing_content,
            summary="Complete pricing guide for all vehicle categories and rental options",
            keywords="pricing,rates,costs,fees,insurance,discounts,payment",
            category="pricing",
            tags="pricing,rates,costs,fees",
            priority=9,
            content_updated_at=timezone.now(),
        )

    def _index_content(
        self,
        content_type: str,
        object_id: int,
        content_object: str,
        title: str,
        slug: str,
        url: str,
        content_text: str,
        summary: str,
        keywords: str,
        category: str,
        tags: str,
        priority: int,
        content_updated_at,
    ) -> None:
        """Index a single content item"""
        try:
            content_index, created = ContentIndex.objects.update_or_create(
                content_type=content_type,
                object_id=object_id,
                defaults={
                    "content_object": content_object,
                    "title": title,
                    "slug": slug,
                    "url": url,
                    "content_text": content_text,
                    "summary": summary,
                    "keywords": keywords,
                    "category": category,
                    "tags": tags,
                    "priority": priority,
                    "content_updated_at": content_updated_at,
                    "is_active": True,
                    "is_searchable": True,
                },
            )

            if created:
                self.indexed_count += 1
            else:
                self.updated_count += 1

        except Exception as e:
            logger.error(f"Error indexing content {content_type}:{object_id}: {e}")
            self.error_count += 1
