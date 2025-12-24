# Generated migration for adding scrolling_message field to Theme model

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('theming', '0002_theme_background_color_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='theme',
            name='scrolling_message',
            field=models.CharField(blank=True, default='', help_text='Message to display in the scrolling banner at the top of the homepage', max_length=500),
        ),
    ]

