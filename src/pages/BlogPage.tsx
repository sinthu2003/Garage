import { motion } from 'framer-motion';
import { BookOpen, User, Calendar, Home, ChevronRight } from 'lucide-react';
import { useContent } from '../admin-portal';
import { Link } from 'react-router-dom';
import Image1 from '../assets/CarInspection.jpg';
import Image2 from '../assets/BatteryService.jpg';

export const BlogPage = () => {
    const { content } = useContent();
    const DEFAULT_BLOG_CONTENT = {
        title: "Latest News & Tips",
        subtitle: "Stay updated with the latest trends and care tips for your vehicle",
        posts: [
            {
                id: 1,
                title: "Top 10 Car Maintenance Tips",
                excerpt: "Keep your car running smoothly with these essential maintenance tips from our experts.",
                date: "Jan 12, 2026",
                author: "Admin",
                category: "Maintenance",
                image: Image1,
                content: "Full content of the article goes here..."
            },
            {
                id: 2,
                title: "Understanding Your Car's Warning Lights",
                excerpt: "Don't ignore those dashboard lights! Here is what they mean and what you should do.",
                date: "Jan 05, 2026",
                author: "Admin",
                category: "Guide",
                image: Image2,
                content: "Full content of the article goes here..."
            }
        ]
    };

    // Fallback to default content if no blog content exists
    const blogContent = content.pages?.blog || DEFAULT_BLOG_CONTENT;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-secondary/30 py-20 px-4">
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                            <BookOpen size={18} />
                            <span className="text-sm font-semibold tracking-wide uppercase">Our Blog</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 leading-tight">
                            {blogContent.title}
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {blogContent.subtitle}
                        </p>
                    </motion.div>
                </div>

                {/* Decorative Background Elements */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.05),transparent_50%)]" />
                    <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_left,hsl(var(--secondary)/0.1),transparent_50%)]" />
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogContent.posts?.map((post: any, idx: number) => (
                        <motion.article
                            key={post.id}
                            className="group flex flex-col bg-card border border-border rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            {/* Image */}
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-background/80 backdrop-blur-sm text-xs font-semibold rounded-full border border-border/50">
                                        {post.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{post.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        <span>{post.author}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                    {post.title}
                                </h3>

                                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                                    {post.excerpt}
                                </p>

                                <div className="mt-auto pt-6 border-t border-border/50 flex items-center justify-between">
                                    <Link
                                        to={`/blog/${post.id}`}
                                        className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all text-primary"
                                    >
                                        Read More <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>

            {/* Footer Info */}
            <div className="max-w-4xl mx-auto text-center py-12 border-t border-border">
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium">
                    <Home size={16} />
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

export default BlogPage;
