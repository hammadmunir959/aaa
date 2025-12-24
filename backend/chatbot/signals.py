"""
Signals to automatically index content when website data changes.
Ensures chatbot always has access to current information.
"""

import logging
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils import timezone

from .models import ContentIndex
from .services import (
    ContentIndexer,
    invalidate_context_sections_cache,
    invalidate_content_search_cache,
)

logger = logging.getLogger(__name__)

# Content indexer instance
content_indexer = ContentIndexer()


def update_content_index(sender, instance, **kwargs):
    """
    Generic function to update content index when model instances change.
    """
    try:
        model_name = sender.__name__
        content_type = get_content_type_for_model(model_name)

        if content_type:
            # Create or update the content index
            content_index, created = ContentIndex.objects.update_or_create(
                content_type=content_type,
                object_id=instance.id,
                defaults={
                    'content_object': f'{sender._meta.app_label}.{model_name}.{instance.id}',
                    'title': get_title_for_instance(instance, content_type),
                    'slug': get_slug_for_instance(instance, content_type),
                    'url': get_url_for_instance(instance, content_type),
                    'content_text': get_content_text_for_instance(instance, content_type),
                    'summary': get_summary_for_instance(instance, content_type),
                    'keywords': get_keywords_for_instance(instance, content_type),
                    'category': get_category_for_instance(instance, content_type),
                    'tags': get_tags_for_instance(instance, content_type),
                    'priority': get_priority_for_instance(instance, content_type),
                    'content_updated_at': timezone.now(),
                    'is_active': get_active_status_for_instance(instance, content_type),
                    'is_searchable': True,
                }
            )

            action = "Created" if created else "Updated"
            logger.info(f"{action} content index for {content_type}:{instance.id} - {instance}")
            invalidate_content_search_cache()

    except Exception as e:
        logger.error(f"Error updating content index for {sender.__name__}.{instance.id}: {e}")


def remove_content_index(sender, instance, **kwargs):
    """
    Remove content from index when instances are deleted.
    """
    try:
        model_name = sender.__name__
        content_type = get_content_type_for_model(model_name)

        if content_type:
            deleted_count, _ = ContentIndex.objects.filter(
                content_type=content_type,
                object_id=instance.id
            ).delete()

            if deleted_count > 0:
                logger.info(f"Removed content index for {content_type}:{instance.id}")
                invalidate_content_search_cache()

    except Exception as e:
        logger.error(f"Error removing content index for {sender.__name__}.{instance.id}: {e}")


def _refresh_context_cache(sender, **kwargs):
    """Clear cached context sections when contexts change."""
    invalidate_context_sections_cache()


# Helper functions to extract information from different model types

def get_content_type_for_model(model_name):
    """Map Django model names to content types."""
    mapping = {
        'BlogPost': 'blog',
        'Vehicle': 'vehicle',
        'Testimonial': 'testimonial',
        'FAQ': 'faq',
        'GalleryImage': 'gallery',
        'LandingPageConfig': 'cms',
    }
    return mapping.get(model_name)


def get_title_for_instance(instance, content_type):
    """Get appropriate title for different content types."""
    if hasattr(instance, 'title'):
        return instance.title
    elif hasattr(instance, 'name'):
        return instance.name
    elif hasattr(instance, 'question'):
        return instance.question
    elif content_type == 'cms':
        return instance.hero_title or 'Homepage'
    else:
        return f"{content_type.title()} {instance.id}"


def get_slug_for_instance(instance, content_type):
    """Get URL slug for different content types."""
    if hasattr(instance, 'slug') and instance.slug:
        return instance.slug
    elif content_type == 'blog':
        return f"blog-{instance.id}"
    elif content_type == 'vehicle':
        return f"vehicle-{instance.id}"
    elif content_type == 'testimonial':
        return f"testimonial-{instance.id}"
    elif content_type == 'faq':
        return f"faq-{instance.id}"
    elif content_type == 'gallery':
        return f"gallery-{instance.id}"
    elif content_type == 'cms':
        return 'homepage'
    else:
        return f"{content_type}-{instance.id}"


def get_url_for_instance(instance, content_type):
    """Get URL for different content types."""
    if content_type == 'blog':
        return f'/blog/{instance.slug}' if hasattr(instance, 'slug') else f'/blog/{instance.id}'
    elif content_type == 'vehicle':
        return f'/vehicles/{instance.id}'
    elif content_type == 'testimonial':
        return f'/testimonials/{instance.id}'
    elif content_type == 'faq':
        return f'/faq/{instance.id}'
    elif content_type == 'gallery':
        return f'/gallery/{instance.id}'
    elif content_type == 'cms':
        return '/'
    else:
        return f'/{content_type}/{instance.id}'


def get_content_text_for_instance(instance, content_type):
    """Extract full content text for indexing."""
    if content_type == 'blog':
        return f"{instance.title}\n\n{instance.content}\n\n{instance.excerpt or ''}"
    elif content_type == 'vehicle':
        return f"""
        {instance.name} - {instance.manufacturer} {instance.model}

        Type: {instance.get_type_display()}
        Transmission: {instance.get_transmission_display()}
        Fuel: {instance.get_fuel_type_display()}
        Seats: {instance.seats}
        Daily Rate: £{instance.daily_rate}

        {instance.description or ''}
        """
    elif content_type == 'testimonial':
        return f"""
        Customer Testimonial from {instance.name}

        Rating: {instance.rating}/5 stars
        Service: {instance.get_service_type_display() if instance.service_type else 'General'}

        "{instance.feedback}"
        """
    elif content_type == 'faq':
        return f"""
        FAQ: {instance.question}

        Category: {instance.get_category_display()}

        Answer: {instance.answer}
        """
    elif content_type == 'gallery':
        return f"""
        Gallery Image: {instance.title}

        Category: {instance.get_category_display()}
        Description: {instance.description or 'No description available'}
        """
    elif content_type == 'cms':
        return f"""
        {instance.hero_title or ''}
        {instance.hero_subtitle or ''}
        {instance.about_title or ''}
        {instance.about_content or ''}
        {instance.services_title or ''}
        {instance.contact_title or ''}
        {instance.contact_content or ''}
        """
    else:
        return str(instance)


def get_summary_for_instance(instance, content_type):
    """Get brief summary for different content types."""
    if hasattr(instance, 'excerpt') and instance.excerpt:
        return instance.excerpt
    elif hasattr(instance, 'description') and instance.description:
        return instance.description
    elif content_type == 'blog':
        return instance.content[:300] + '...' if len(instance.content) > 300 else instance.content
    elif content_type == 'vehicle':
        return f"{instance.name} - {instance.get_type_display()} available for hire"
    elif content_type == 'testimonial':
        return f'"{instance.feedback[:100]}..." - {instance.name}'
    elif content_type == 'faq':
        return f"FAQ: {instance.question[:100]}..."
    elif content_type == 'gallery':
        return instance.description or f"Gallery image: {instance.title}"
    elif content_type == 'cms':
        return instance.hero_subtitle or 'Welcome to AAA Accident Solutions LTD'
    else:
        return f"{content_type.title()}: {get_title_for_instance(instance, content_type)}"


def get_keywords_for_instance(instance, content_type):
    """Extract keywords for better searchability."""
    keywords = []

    if content_type == 'blog':
        keywords.extend(['blog', 'article', 'news'])
        if hasattr(instance, 'tags') and instance.tags:
            keywords.extend(instance.tags.split(','))
    elif content_type == 'vehicle':
        keywords.extend([
            instance.manufacturer, instance.model, instance.get_type_display(),
            instance.get_transmission_display(), instance.get_fuel_type_display(),
            'vehicle', 'car', 'hire', 'rental'
        ])
    elif content_type == 'testimonial':
        keywords.extend(['testimonial', 'review', 'feedback', 'customer'])
        if instance.service_type:
            keywords.append(instance.get_service_type_display())
    elif content_type == 'faq':
        keywords.extend(['faq', 'question', 'help', 'support', instance.get_category_display()])
    elif content_type == 'gallery':
        keywords.extend(['gallery', 'image', 'photo', instance.get_category_display()])
    elif content_type == 'cms':
        keywords.extend(['homepage', 'landing', 'about', 'services', 'contact'])

    return ','.join(keywords)


def get_category_for_instance(instance, content_type):
    """Get category for content organization."""
    if content_type == 'blog':
        return 'blog'
    elif content_type == 'vehicle':
        return 'vehicles'
    elif content_type == 'testimonial':
        return 'testimonials'
    elif content_type == 'faq':
        return instance.get_category_display() if hasattr(instance, 'category') else 'faq'
    elif content_type == 'gallery':
        return instance.get_category_display() if hasattr(instance, 'category') else 'gallery'
    elif content_type == 'cms':
        return 'cms'
    else:
        return content_type


def get_tags_for_instance(instance, content_type):
    """Get tags for content classification."""
    tags = [content_type]

    if content_type == 'vehicle':
        tags.extend([instance.get_type_display(), instance.get_fuel_type_display()])
    elif content_type == 'testimonial':
        tags.append(f"{instance.rating}stars")
        if instance.service_type:
            tags.append(instance.get_service_type_display())
    elif content_type == 'faq':
        tags.append(instance.get_category_display())
    elif content_type == 'gallery':
        tags.append(instance.get_category_display())

    return ','.join(tags)


def get_priority_for_instance(instance, content_type):
    """Get priority score for search ranking."""
    base_priorities = {
        'vehicle': 9,      # High priority - core business
        'blog': 8,         # Important for SEO
        'cms': 10,         # Homepage is most important
        'faq': 7,          # Helpful for users
        'testimonial': 6,  # Social proof
        'gallery': 4,      # Visual content
    }

    priority = base_priorities.get(content_type, 5)

    # Adjust based on instance attributes
    if hasattr(instance, 'status') and instance.status == 'published':
        priority += 1
    if hasattr(instance, 'is_active') and instance.is_active:
        priority += 1
    if hasattr(instance, 'featured') and instance.featured:
        priority += 2

    return min(priority, 10)  # Cap at 10


def get_active_status_for_instance(instance, content_type):
    """Determine if content should be active in search."""
    if hasattr(instance, 'is_active'):
        return instance.is_active
    elif hasattr(instance, 'status'):
        return instance.status in ['published', 'active']
    else:
        return True


# Signal registrations - these will be connected in apps.py

# Blog posts
try:
    from blog.models import BlogPost
    post_save.connect(update_content_index, sender=BlogPost)
    post_delete.connect(remove_content_index, sender=BlogPost)
except ImportError:
    pass

# Vehicles
try:
    from vehicles.models import Vehicle
    post_save.connect(update_content_index, sender=Vehicle)
    post_delete.connect(remove_content_index, sender=Vehicle)
except ImportError:
    pass

# Testimonials
try:
    from testimonials.models import Testimonial
    post_save.connect(update_content_index, sender=Testimonial)
    post_delete.connect(remove_content_index, sender=Testimonial)
except ImportError:
    pass

# FAQs
try:
    from faq.models import FAQ
    post_save.connect(update_content_index, sender=FAQ)
    post_delete.connect(remove_content_index, sender=FAQ)
except ImportError:
    pass

# Gallery
try:
    from gallery.models import GalleryImage
    post_save.connect(update_content_index, sender=GalleryImage)
    post_delete.connect(remove_content_index, sender=GalleryImage)
except ImportError:
    pass

# CMS
try:
    from cms.models import LandingPageConfig
    post_save.connect(update_content_index, sender=LandingPageConfig)
    post_delete.connect(remove_content_index, sender=LandingPageConfig)
except ImportError:
    pass

# Chatbot contexts
try:
    from .models import ChatbotContext
    post_save.connect(_refresh_context_cache, sender=ChatbotContext)
    post_delete.connect(_refresh_context_cache, sender=ChatbotContext)
except ImportError:
    pass
