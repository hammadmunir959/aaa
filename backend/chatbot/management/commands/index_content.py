"""
Management command to index all website content for chatbot knowledge base.
Run this to populate/update the content index with all current website data.
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import models

from chatbot.services import ContentIndexer


class Command(BaseCommand):
    help = "Index all website content for chatbot knowledge base"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing content index before re-indexing",
        )
        parser.add_argument(
            "--type",
            type=str,
            help="Index only specific content type (blog, vehicle, testimonial, faq, gallery, cms, car_sales, pricing)",
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS(
                "🚀 Starting content indexing for chatbot knowledge base..."
            )
        )

        indexer = ContentIndexer()

        if options["clear"]:
            from chatbot.models import ContentIndex

            deleted_count, _ = ContentIndex.objects.all().delete()
            self.stdout.write(
                self.style.WARNING(
                    f"🗑️  Cleared {deleted_count} existing content index entries"
                )
            )

        if options["type"]:
            # Index specific content type
            content_type = options["type"]
            if content_type == "blog":
                indexer._index_blog_posts()
            elif content_type == "vehicle":
                indexer._index_vehicles()
            elif content_type == "testimonial":
                indexer._index_testimonials()
            elif content_type == "faq":
                indexer._index_faqs()
            elif content_type == "gallery":
                indexer._index_gallery()
            elif content_type == "cms":
                indexer._index_cms_pages()
            elif content_type == "pricing":
                indexer._index_pricing_info()
            elif content_type == "car_sales":
                indexer._index_car_sales()
            else:
                raise CommandError(f"Unknown content type: {content_type}")

            self.stdout.write(
                self.style.SUCCESS(f"✅ Indexed content type: {content_type}")
            )
        else:
            # Index all content
            result = indexer.index_all_content()

            self.stdout.write(
                self.style.SUCCESS(
                    f"📊 Content indexing completed:\n"
                    f'   • Indexed: {result["indexed"]} new entries\n'
                    f'   • Updated: {result["updated"]} existing entries\n'
                    f'   • Errors: {result["errors"]} failed entries'
                )
            )

        # Show content statistics
        from chatbot.models import ContentIndex

        total_content = ContentIndex.objects.count()
        active_content = ContentIndex.objects.filter(is_active=True).count()
        searchable_content = ContentIndex.objects.filter(
            is_active=True, is_searchable=True
        ).count()

        content_types = (
            ContentIndex.objects.values("content_type")
            .annotate(count=models.Count("id"))
            .order_by("content_type")
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"📈 Content Index Statistics:\n"
                f"   • Total entries: {total_content}\n"
                f"   • Active entries: {active_content}\n"
                f"   • Searchable entries: {searchable_content}"
            )
        )

        self.stdout.write("📋 Content by type:")
        for ct in content_types:
            self.stdout.write(f'   • {ct["content_type"]}: {ct["count"]} entries')

        self.stdout.write(
            self.style.SUCCESS(
                "🎉 Content indexing complete! Chatbot now has access to all website data.\n"
                "💡 New content will be automatically indexed when added to the website."
            )
        )
