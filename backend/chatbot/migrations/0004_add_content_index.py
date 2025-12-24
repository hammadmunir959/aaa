# Generated manually for ContentIndex model

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chatbot", "0003_contactinfo_simplify_conversation"),
    ]

    operations = [
        migrations.CreateModel(
            name="ContentIndex",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "content_type",
                    models.CharField(
                        choices=[
                            ("page", "Static Page"),
                            ("blog", "Blog Post"),
                            ("service", "Service Page"),
                            ("vehicle", "Vehicle Listing"),
                            ("testimonial", "Customer Testimonial"),
                            ("faq", "FAQ Item"),
                            ("gallery", "Gallery Image"),
                            ("cms", "CMS Content"),
                            ("contact", "Contact Information"),
                            ("pricing", "Pricing Information"),
                        ],
                        max_length=20,
                    ),
                ),
                ("object_id", models.PositiveIntegerField()),
                (
                    "content_object",
                    models.CharField(
                        help_text="Model instance identifier", max_length=200
                    ),
                ),
                ("title", models.CharField(max_length=500)),
                ("slug", models.CharField(blank=True, max_length=500)),
                ("url", models.URLField(max_length=1000)),
                (
                    "content_text",
                    models.TextField(help_text="Full text content for search"),
                ),
                (
                    "summary",
                    models.TextField(
                        blank=True, help_text="Brief summary for quick reference"
                    ),
                ),
                (
                    "keywords",
                    models.TextField(blank=True, help_text="Comma-separated keywords"),
                ),
                ("category", models.CharField(blank=True, max_length=100)),
                (
                    "tags",
                    models.TextField(blank=True, help_text="Comma-separated tags"),
                ),
                (
                    "priority",
                    models.IntegerField(
                        default=5, help_text="Importance for search (1-10)"
                    ),
                ),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "content_updated_at",
                    models.DateTimeField(
                        help_text="When the original content was last updated"
                    ),
                ),
                ("is_active", models.BooleanField(default=True)),
                ("is_searchable", models.BooleanField(default=True)),
            ],
            options={
                "ordering": ["-priority", "-content_updated_at"],
            },
        ),
        migrations.AddIndex(
            model_name="contentindex",
            index=models.Index(
                fields=["content_type", "-content_updated_at"],
                name="content_type_updated_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="contentindex",
            index=models.Index(
                fields=["is_active", "is_searchable", "-priority"],
                name="active_searchable_priority_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="contentindex",
            index=models.Index(
                fields=["category", "-content_updated_at"], name="category_updated_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="contentindex",
            index=models.Index(fields=["url"], name="url_idx"),
        ),
        migrations.AddIndex(
            model_name="contentindex",
            index=models.Index(fields=["title"], name="title_idx"),
        ),
        migrations.AlterUniqueTogether(
            name="contentindex",
            unique_together={("content_type", "object_id")},
        ),
    ]
