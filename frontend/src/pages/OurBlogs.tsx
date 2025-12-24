import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AnimatedSection from "@/components/AnimatedSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  Star,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { blogApi, type BlogPost } from "@/services/blogApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const OurBlogs = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const reviewData = [
    {
      name: "Rhianna Marshall",
      feedback: "Great service and the whole team are amazing. So helpful getting me a like for like replacement car. I would recommend this company to anyone.",
      rating: 5
    },
    {
      name: "James Anderson",
      feedback: "Excellent experience from start to finish. The team handled my claim professionally and kept me updated throughout the process.",
      rating: 5
    }
  ];

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev + 1) % reviewData.length);
  };

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev - 1 + reviewData.length) % reviewData.length);
  };


  const STATIC_BLOG_POSTS: BlogPost[] = [
    {
      id: "static-1",
      title: "Understanding Credit Hire: Your Right to a Replacement Vehicle",
      slug: "understanding-credit-hire",
      excerpt: "Learn how credit hire allows you to get a like-for-like replacement vehicle after a non-fault accident without upfront costs.",
      content: "<p>If you've been involved in a non-fault accident, being without your vehicle can be a major disruption. <strong>Credit hire</strong> is a service designed to keep you mobile without the financial burden.</p><h3>What is Credit Hire?</h3><p>Credit hire companies provide a replacement vehicle to you on a credit basis. This means you don't pay for the hire upfront; instead, the costs are recovered directly from the at-fault driver's insurance company.</p><h3>Benefits of Credit Hire</h3><ul><li><strong>Like-for-Like Replacement:</strong> You receive a vehicle similar to your own, ensuring your lifestyle isn't compromised.</li><li><strong>No Upfront Fees:</strong> Costs are handled between the credit hire company and the insurer.</li><li><strong>Seamless Process:</strong> We handle the logistics, so you can focus on your recovery.</li></ul><p>At AAA Accident Solutions LTD, we specialize in providing high-end vehicles to ensure you drive away in comfort and style.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2670&auto=format&fit=crop",
      author_name: "AAA Team",
      published_at: "2024-12-01T09:00:00Z",
      created_at: "2024-12-01T09:00:00Z"
    },
    {
      id: "static-2",
      title: "Step-by-Step Guide: What to Do After a Car Accident",
      slug: "what-to-do-after-car-accident",
      excerpt: "A comprehensive guide on the immediate actions to take at the scene of an accident to protect your safety and your claim.",
      content: "<p>Being in a car accident is a shock. Knowing what to do immediately after can make a significant difference to your safety and any future insurance claims.</p><h3>1. Stop and Assess Safety</h3><p>Always stop the vehicle. Check for injuries and call emergency services if necessary. Move to a safe location if possible.</p><h3>2. Exchange Details</h3><p>Legally, you must exchange names, addresses, and registration numbers with the other driver. Do not apologize or admit liability at the scene.</p><h3>3. Collect Evidence</h3><p>Take photos of the vehicles, damage, road conditions, and any injuries. Collect witness contact details.</p><h3>4. Contact AAA</h3><p>Before calling your insurer, contact AAA Accident Solutions LTD. We can manage the entire claims process, ensuring you get a replacement vehicle and proper legal support.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1560252037-33ee4930be62?q=80&w=2670&auto=format&fit=crop",
      author_name: "Claims Expert",
      published_at: "2024-12-05T10:30:00Z",
      created_at: "2024-12-05T10:30:00Z"
    },
    {
      id: "static-3",
      title: "Non-Fault Accidents: Know Your Rights",
      slug: "non-fault-accident-rights",
      excerpt: "Don't let a non-fault accident cost you. Discover your entitlements, including replacement vehicles and injury compensation.",
      content: "<p>If an accident wasn't your fault, English law entitles you to be put back in the position you were in before the incident. This is known as 'Tort Law'.</p><h3>Your Entitlements</h3><ul><li><strong>Replacement Vehicle:</strong> You are entitled to a vehicle of a similar size and standard to your own.</li><li><strong>vehicle Repair:</strong> You can choose your own repairer, ensuring high-quality work rather than a budget fix.</li><li><strong>No Excess:</strong> You shouldn't have to pay your policy excess.</li><li><strong>Compensation:</strong> You may be entitled to compensation for injuries and losses.</li></ul><p>Our team ensures these rights are protected, dealing directly with the third-party insurer on your behalf.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=2669&auto=format&fit=crop",
      author_name: "Legal Team",
      published_at: "2024-12-08T14:15:00Z",
      created_at: "2024-12-08T14:15:00Z"
    },
    {
      id: "static-4",
      title: "PCO & Taxi Drivers: Getting You Back on the Road",
      slug: "pco-taxi-accident-claims",
      excerpt: "Time is money for professional drivers. We provide licenced replacement vehicles for PCO and Taxi drivers involved in non-fault accidents.",
      content: "<p>For taxi and PCO drivers, a vehicle isn't just transport; it's a livelihood. An accident can mean lost income, but AAA Accident Solutions LTD is here to bridge that gap.</p><h3>Specialized PCO Fleet</h3><p>We hold a fleet of PCO-licenced vehicles ready for immediate dispatch. Whether you drive a Prius, a saloon, or an executive car, we can keep you working.</p><h3>Loss of Earnings Claim</h3><p>In addition to a vehicle, we can assist in recovering loss of earnings for the time you were unable to work due to the accident.</p><p>Don't let a non-fault accident stop your income. Contact us immediately for support.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2670&auto=format&fit=crop",
      author_name: "Fleet Manager",
      published_at: "2024-12-10T11:00:00Z",
      created_at: "2024-12-10T11:00:00Z"
    },
    {
      id: "static-5",
      title: "Why 'Like-for-Like' Replacement Matters",
      slug: "importance-of-like-for-like-replacement",
      excerpt: "Driving a small courtesy car when you own a luxury SUV isn't fair. We explain why you deserve a vehicle that matches your own.",
      content: "<p>Many insurance policies only guarantee a small 'courtesy car' (Class A - typically a 1.0L hatchback) while yours is being repaired. If you drive a high-end vehicle, an SUV, or a work van, this simply isn't practical.</p><h3>The AAA Difference</h3><p>We believe in 'Like-for-Like'. If you drive a Mercedes, you shouldn't be forced into a Micra. We continuously invest in our fleet to ensure we can match a wide variety of high-end and standard vehicles.</p><p>This ensures your daily routine, comfort, and professional image remain unaffected by an accident that wasn't your fault.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2670&auto=format&fit=crop",
      author_name: "AAA Team",
      published_at: "2024-12-12T08:45:00Z",
      created_at: "2024-12-12T08:45:00Z"
    },
    {
      id: "static-6",
      title: "Winter Driving Tips: Stay Safe on the Roads",
      slug: "winter-driving-safety-tips",
      excerpt: "UK winters can be treacherous. Follow our essential guide to preparing your vehicle and driving safely in ice and snow.",
      content: "<p>Winter brings challenging driving conditions. Reduced visibility and slippery surfaces increase accident risks significantly.</p><h3>Preparation is Key</h3><ul><li><strong>Check Tyres:</strong> Ensure tread depth is above 3mm for better grip.</li><li><strong>Fluids:</strong> Top up screen wash with antifreeze and check coolant levels.</li><li><strong>Lights:</strong> Clean all lights and check bulbs regularly.</li></ul><h3>Driving in Snow and Ice</h3><p>Accelerate gently, use low gears, and maintain a much larger stopping distance. If you skid, steer into it gently. Remember, it's better to arrive late than not at all.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1483304528321-0674f0040030?q=80&w=2670&auto=format&fit=crop",
      author_name: "Safety Officer",
      published_at: "2024-12-15T09:30:00Z",
      created_at: "2024-12-15T09:30:00Z"
    },
    {
      id: "static-7",
      title: "Tyre Safety: The Only Contact with the Road",
      slug: "tyre-safety-maintenance",
      excerpt: "Your tyres are crucial for safety and performance. Learn how to check them and when to replace them to avoid accidents.",
      content: "<p>Your tyres are the only point of contact between your vehicle and the road. Their condition is critical for braking, handling, and safety.</p><h3>What to Check</h3><ul><li><strong>Pressure:</strong> Check monthly. Incorrect pressure affects handling and fuel economy.</li><li><strong>Tread Depth:</strong> Legal minimum is 1.6mm, but safety experts recommend changing at 3mm.</li><li><strong>Condition:</strong> Look for cuts, bulges, or embedded objects.</li></ul><p>Worn tyres significantly increase stopping distances. Don't compromise on safety—check your tyres regularly.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1578844251758-2f71da64c96f?q=80&w=2671&auto=format&fit=crop",
      author_name: "Maintenance Team",
      published_at: "2024-12-18T13:20:00Z",
      created_at: "2024-12-18T13:20:00Z"
    },
    {
      id: "static-8",
      title: "The Claims Process Explained",
      slug: "claims-process-explained",
      excerpt: "Demystifying the accident claim process. From the first call to settlement, here is how AAA Accident Solutions LTD handles your case efficiently.",
      content: "<p>Navigating an insurance claim can be complex and stressful. Here is how we simplify it:</p><ol><li><strong>Initial Consultation:</strong> You contact us; we assess the accident circumstances.</li><li><strong>Vehicle Provision:</strong> If non-fault, we deliver a replacement vehicle, often same-day.</li><li><strong>Repair Management:</strong> We arrange independent engineer inspections and authorize repairs at approved centers.</li><li><strong>Legal Support:</strong> Our panel solicitors handle injury and loss recovery.</li><li><strong>Settlement:</strong> We deal directly with the insurer to settle all costs.</li></ol><p>We keep you informed at every stage, removing the stress from the situation.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2670&auto=format&fit=crop",
      author_name: "Operations Director",
      published_at: "2024-12-20T10:00:00Z",
      created_at: "2024-12-20T10:00:00Z"
    },
    {
      id: "static-9",
      title: "Vehicle Storage and Recovery Services",
      slug: "vehicle-storage-recovery",
      excerpt: "Safe recovery and secure storage for your damaged vehicle. We ensure your asset is protected while the claim is processed.",
      content: "<p>After an accident, your vehicle may be unroadworthy. Leaving it at the roadside is unsafe and risky.</p><h3>Professional Recovery</h3><p>We provide nationwide recovery services to collect your damaged vehicle from the scene or your home.</p><h3>Secure Storage</h3><p>Your vehicle is stored in our secure, monitored facilities while inspections take place. This prevents further damage or theft and preserves evidence for engineers to assess.</p><p>We handle the logistics so you don't have to worry about where your car is.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1626074961596-cab99c80529c?q=80&w=2670&auto=format&fit=crop",
      author_name: "Logistics Team",
      published_at: "2024-12-21T15:00:00Z",
      created_at: "2024-12-21T15:00:00Z"
    },
    {
      id: "static-10",
      title: "The Importance of Specialist Legal Support",
      slug: "specialist-legal-support-claims",
      excerpt: "Why relying on standard insurance legal cover might not be enough. The benefits of specialized solicitors for road traffic accidents.",
      content: "<p>In personal injury claims, expertise matters. Generic 'legal cover' often routes you to high-volume factories.</p><h3>Why Specialist Solicitors?</h3><ul><li><strong>Maximum Compensation:</strong> They understand the nuances of injuries and long-term impacts.</li><li><strong>Focus:</strong> They specialize in Road Traffic Accidents (RTA), not general law.</li><li><strong>No Win, No Fee:</strong> Most work on a Conditional Fee Agreement, minimizing your financial risk.</li></ul><p>AAA Accident Solutions LTD partners with top-tier RTA solicitors to ensure you receive the compensation and rehabilitation support you deserve.</p>",
      status: "published",
      featured_image_url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2672&auto=format&fit=crop",
      author_name: "Legal Partner",
      published_at: "2024-12-23T09:00:00Z",
      created_at: "2024-12-23T09:00:00Z"
    }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const data = await blogApi.list({ status: 'published' });
        // Combine static posts with API data
        // API data could be appended or prepended. User asked for newly added to appear AFTER static.
        // Assuming 'data' contains the dynamic posts.
        // Type assertion needed if static IDs are strings (as per my design) but API expects numbers.
        // The BlogPost interface has 'id: number', so I should change static IDs to numbers or update interface.
        // Updating interface in a separate file is cleaner but risks breaking other things.
        // Safest: Cast static IDs to any or number if possible, or use negative numbers.
        // Let's use negative numbers for static IDs to be safe and type-compliant.

        const staticWithNumericIds = STATIC_BLOG_POSTS.map((p, i) => ({
          ...p,
          id: -1 * (i + 1) // -1, -2, etc.
        }));

        setPosts([...staticWithNumericIds, ...data]);
      } catch (error) {
        console.error("Failed to load blog posts:", error);
        toast({
          title: "Error loading blogs",
          description: "Could not fetch latest news. Loading default content.",
          variant: "default" // Not destructive since we have static content
        });
        // Fallback to static only on error
        const staticWithNumericIds = STATIC_BLOG_POSTS.map((p, i) => ({
          ...p,
          id: -1 * (i + 1)
        }));
        setPosts(staticWithNumericIds);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [toast]);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  const featuredArticle = useMemo(() => {
    if (posts.length > 0) return posts[0];
    return null;
  }, [posts]);

  // Exclude featured article from the grid list if we have one
  const gridPosts = useMemo(() => {
    if (posts.length > 0) return filteredPosts.filter(p => p.id !== posts[0].id);
    return filteredPosts;
  }, [filteredPosts, posts]);

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 bg-black text-white overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('/car-auto-motor-insurance-reimbursement-vehicle-concept.jpg')"

            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="max-w-4xl">
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 text-gold">OUR BLOGS</h1>
                <p className="text-lg opacity-90">Company / Our Blogs</p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Article Section */}
        {featuredArticle && !searchQuery && (
          <section className="py-16 lg:py-24">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <AnimatedSection>
                  <div className="relative">
                    <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden shadow-xl">
                      <img
                        src={featuredArticle.featured_image_url || "/odinei-ramone-UUGaMVsD63A-unsplash.jpg"}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </AnimatedSection>

                <AnimatedSection delay={200}>
                  <div className="flex flex-col justify-center h-full">
                    <div className="mb-4">
                      <span className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm font-medium">Featured</span>
                      <span className="ml-3 text-muted-foreground text-sm">{formatDate(featuredArticle.published_at || featuredArticle.created_at)}</span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed line-clamp-4">
                      {featuredArticle.excerpt || featuredArticle.content.replace(/<[^>]*>/g, '').slice(0, 200) + '...'}
                    </p>
                    <Button
                      size="lg"
                      className="bg-gold text-black hover:bg-gold/90 h-14 px-8 font-bold border-none w-fit"
                      onClick={() => setSelectedPost(featuredArticle)}
                    >
                      Read More
                    </Button>
                  </div>
                </AnimatedSection>
              </div>
            </div>
          </section>
        )}

        {/* Search and News Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-sm font-semibold text-gold uppercase mb-2 block">ADVICE</span>
                <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                  CAR ADVICE AND NEWS
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Stay informed with the latest advice, news, and insights about car accidents, insurance claims,
                  replacement vehicles, and everything you need to know to navigate the claims process successfully.
                </p>
                <div className="flex gap-4 max-w-2xl mx-auto">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button className="bg-gold text-black hover:bg-gold/90 font-bold h-14 px-8 border-none ml-2">
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading articles...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No articles found matching your search.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {gridPosts.map((post, index) => (
                  <AnimatedSection key={post.id} delay={index * 50}>
                    <Card className="hover:shadow-2xl transition-all duration-300 h-full flex flex-col border-none shadow-md bg-card group cursor-pointer" onClick={() => setSelectedPost(post)}>
                      <div className="relative h-48 overflow-hidden rounded-t-xl">
                        <img
                          src={post.featured_image_url || "/odinei-ramone-UUGaMVsD63A-unsplash.jpg"}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow">
                        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(post.published_at || post.created_at)}</span>
                        </div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground mb-6 line-clamp-3 text-sm flex-grow">
                          {post.excerpt || post.content.replace(/<[^>]*>/g, '').slice(0, 100) + '...'}
                        </p>
                        <Button variant="link" className="p-0 h-auto justify-start text-gold hover:text-gold font-semibold group-hover:translate-x-1 transition-transform">
                          Read Entire Article <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </CardContent>
                    </Card>
                  </AnimatedSection>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Load More Button - Placeholder functionality */}
        {filteredPosts.length > 9 && (
          <section className="py-8">
            <div className="container mx-auto px-4 text-center">
              <Button size="lg" className="bg-gold text-black hover:bg-gold/90 h-14 px-8 font-bold border-none">
                Load More
              </Button>
            </div>
          </section>
        )}

        {/* Custom Blog Modal */}
        <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
            {selectedPost && (
              <>
                <div className="relative h-64 md:h-80 w-full">
                  <img
                    src={selectedPost.featured_image_url || "/odinei-ramone-UUGaMVsD63A-unsplash.jpg"}
                    alt={selectedPost.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6 md:p-8">
                    <span className="text-white/80 text-sm mb-2">{formatDate(selectedPost.published_at || selectedPost.created_at)}</span>
                    <DialogTitle className="text-2xl md:text-4xl font-bold text-white leading-tight">
                      {selectedPost.title}
                    </DialogTitle>
                  </div>
                </div>

                <div className="p-6 md:p-10">
                  <DialogDescription className="text-base md:text-lg leading-relaxed text-foreground/90 prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
                  </DialogDescription>
                </div>

                <div className="p-6 border-t bg-muted/30 flex justify-end">
                  <Button onClick={() => setSelectedPost(null)}>Close Article</Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Customer Reviews Section */}
        <section className="py-16 lg:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl lg:text-4xl font-bold mb-12 text-center">
                  What Our Customers Are Saying
                </h2>

                <div className="flex items-center justify-center gap-8 mb-8">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-6 h-6 fill-yellow-500 text-gold" />
                      ))}
                    </div>
                    <span className="text-lg font-semibold">Rated 4.9 out of 5 stars</span>
                  </div>
                </div>

                <div className="relative">
                  <Card className="max-w-2xl mx-auto transition-all duration-300">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex">
                          {[...Array(reviewData[currentReviewIndex].rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 fill-yellow-500 text-gold" />
                          ))}
                        </div>
                        <div className="text-2xl font-bold text-gray-400">G</div>
                      </div>
                      <p className="text-lg text-muted-foreground mb-6 italic">
                        "{reviewData[currentReviewIndex].feedback}"
                      </p>
                      <p className="font-semibold">{reviewData[currentReviewIndex].name}</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={prevReview}
                    className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
                    aria-label="Previous review"
                  >
                    <ArrowLeft className="w-6 h-6 text-muted-foreground" />
                  </button>
                  <span className="text-muted-foreground">View All Reviews</span>
                  <button
                    onClick={nextReview}
                    className="p-2 hover:bg-muted rounded-full transition-colors cursor-pointer"
                    aria-label="Next review"
                  >
                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default OurBlogs;

