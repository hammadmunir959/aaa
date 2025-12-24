# Generated migration for ContactInfo model and Conversation simplification

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("chatbot", "0002_chatbotsettings"),
    ]

    operations = [
        # Add ContactInfo model
        migrations.CreateModel(
            name="ContactInfo",
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
                ("name", models.CharField(blank=True, max_length=200)),
                ("email", models.EmailField(blank=True, max_length=254)),
                ("phone", models.CharField(blank=True, max_length=20)),
                ("collected_at", models.DateTimeField(auto_now_add=True)),
                (
                    "source_message",
                    models.TextField(
                        blank=True,
                        help_text="Original message that contained this contact info",
                    ),
                ),
                ("is_lead", models.BooleanField(default=False)),
                (
                    "lead_score",
                    models.IntegerField(
                        default=0, help_text="Lead quality score (0-100)"
                    ),
                ),
                (
                    "conversation",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="contact_info",
                        to="chatbot.conversation",
                    ),
                ),
            ],
            options={
                "ordering": ["-collected_at"],
            },
        ),
        # Remove complex fields from Conversation
        migrations.RemoveField(
            model_name="conversation",
            name="collected_data",
        ),
        migrations.RemoveField(
            model_name="conversation",
            name="intent_classification",
        ),
        migrations.RemoveField(
            model_name="conversation",
            name="confidence_score",
        ),
        # Add indexes
        migrations.AddIndex(
            model_name="contactinfo",
            index=models.Index(
                fields=["is_lead", "-collected_at"],
                name="chatbot_con_is_lead_c_ac5a0a_idx",
            ),
        ),
        migrations.AddIndex(
            model_name="contactinfo",
            index=models.Index(fields=["email"], name="chatbot_con_email_idx"),
        ),
        migrations.AddIndex(
            model_name="contactinfo",
            index=models.Index(fields=["phone"], name="chatbot_con_phone_idx"),
        ),
        migrations.AddIndex(
            model_name="conversation",
            index=models.Index(
                fields=["is_lead", "-started_at"],
                name="chatbot_con_is_lead_s_ac5a0a_idx",
            ),
        ),
    ]
