from django.core.management.base import BaseCommand
from django.core.cache import cache
from utils.cache_decorators import get_cache_stats


class Command(BaseCommand):
    help = 'Show cache statistics and health'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('\n📊 Redis Cache Statistics\n'))
        self.stdout.write('=' * 60)
        
        stats = get_cache_stats()
        
        if stats is None:
            self.stdout.write(self.style.ERROR('\n❌ Unable to connect to Redis cache'))
            self.stdout.write('Make sure Redis is running and configured correctly.\n')
            return
        
        # Display stats
        self.stdout.write(f"\n🔌 Connected clients:     {stats['connected_clients']}")
        self.stdout.write(f"💾 Memory used:           {stats['used_memory_human']}")
        self.stdout.write(f"📈 Peak memory:           {stats['used_memory_peak_human']}")
        self.stdout.write(f"🔑 Total keys:            {stats['total_keys']}")
        
        self.stdout.write(f"\n📊 Performance Metrics:")
        self.stdout.write(f"   ✅ Cache hits:         {stats['keyspace_hits']:,}")
        self.stdout.write(f"   ❌ Cache misses:       {stats['keyspace_misses']:,}")
        self.stdout.write(f"   📊 Hit rate:           {stats['hit_rate']}%")
        
        # Interpret hit rate
        hit_rate = stats['hit_rate']
        if hit_rate >= 80:
            status = self.style.SUCCESS(f"Excellent! 🎉")
        elif hit_rate >= 60:
            status = self.style.SUCCESS(f"Good 👍")
        elif hit_rate >= 40:
            status = self.style.WARNING(f"Fair ⚠️ ")
        else:
            status = self.style.ERROR(f"Poor - consider increasing cache TTLs ⚠️ ")
        
        self.stdout.write(f"\n🎯 Cache Efficiency:      {status}")
        
        # Test cache operations
        self.stdout.write(f"\n🧪 Testing cache operations...")
        try:
            cache.set('test_key', 'test_value', 60)
            result = cache.get('test_key')
            if result == 'test_value':
                self.stdout.write(self.style.SUCCESS('   ✅ Write/Read operations working'))
                cache.delete('test_key')
            else:
                self.stdout.write(self.style.ERROR('   ❌ Cache read failed'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'   ❌ Cache test failed: {e}'))
        
        self.stdout.write('\n' + '=' * 60)
        self.stdout.write(self.style.SUCCESS('\n✅ Cache health check complete\n'))
