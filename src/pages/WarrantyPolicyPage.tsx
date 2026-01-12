import { motion } from 'framer-motion';
import { ShieldCheck, FileText, ArrowLeft, Home, BadgeCheck } from 'lucide-react';
import { useContent } from '../admin-portal';
import { Link } from 'react-router-dom';

export const WarrantyPolicyPage = () => {
    const { content } = useContent();
    const DEFAULT_WARRANTY_CONTENT = {
        title: "Warranty Policy",
        description: "Our commitment to quality service and parts.",
        lastUpdated: "January 01, 2026",
        sections: [
            {
                title: "Service Warranty",
                content: "We provide a 6-month or 10,000 km warranty (whichever comes first) on all mechanical workmanship performed by our certified technicians."
            },
            {
                title: "Parts Warranty",
                content: "Spare parts replaced during service carry a warranty as per the respective manufacturer's policy. We only use genuine or OES (Original Equipment Supplier) parts."
            },
            {
                title: "Exclusions",
                content: "Warranty does not cover normal wear and tear items like brake pads, clutch plates, wipers, bulbs, etc., unless there is a manufacturing defect."
            }
        ]
    };

    const warrantyContent = content.pages?.warrantyPolicy || DEFAULT_WARRANTY_CONTENT;

    if (!warrantyContent) return null;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">

            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none">
                <motion.div
                    className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
                    animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
                    transition={{ duration: 15, repeat: Infinity }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15 blur-3xl"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)' }}
                    animate={{ scale: [1.2, 1, 1.2] }}
                    transition={{ duration: 12, repeat: Infinity }}
                />

                {/* Floating Icons */}
                {[ShieldCheck, BadgeCheck, FileText].map((Icon, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-muted-foreground/10"
                        style={{ left: `${10 + i * 40}%`, top: `${15 + i * 30}%` }}
                        animate={{
                            y: [0, -30, 0],
                            rotate: [0, 15, -15, 0]
                        }}
                        transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
                    >
                        <Icon size={100 + i * 20} />
                    </motion.div>
                ))}

                <motion.div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                             linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                    animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                {/* Header Section */}
                <motion.div
                    className="max-w-4xl mx-auto text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                        <ShieldCheck size={18} />
                        <span className="text-sm font-semibold tracking-wide uppercase">Warranty Coverage</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 leading-tight">
                        {warrantyContent.title || 'Warranty Policy'}
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {warrantyContent.description}
                    </p>

                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Link to="/">
                            <motion.button
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground border border-border font-semibold rounded-full hover:bg-secondary/80 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft size={18} />
                                Back to Home
                            </motion.button>
                        </Link>
                    </div>
                </motion.div>

                {/* Content Section */}
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        className="space-y-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {warrantyContent.sections?.map((section, idx) => (
                            <motion.section
                                key={idx}
                                className="p-8 rounded-3xl bg-secondary/30 backdrop-blur-md border border-border/50 hover:border-primary/30 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                {section.title && (
                                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-foreground">
                                        <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-sm font-mono">
                                            {(idx + 1).toString().padStart(2, '0')}
                                        </span>
                                        {section.title}
                                    </h2>
                                )}
                                <div className="text-muted-foreground leading-relaxed space-y-4 whitespace-pre-line">
                                    {section.content}
                                </div>
                            </motion.section>
                        ))}
                    </motion.div>

                    {/* Footer Info */}
                    <motion.div
                        className="mt-16 pt-8 border-t border-border/50 text-center text-muted-foreground flex flex-col items-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="flex items-center gap-2">
                            <FileText size={16} />
                            <span>Last Updated: {warrantyContent.lastUpdated}</span>
                        </div>

                        <p className="text-sm max-w-lg">
                            If you have specific questions about our warranty coverage, please contact our support team.
                        </p>

                        <Link to="/" className="text-primary hover:underline flex items-center gap-1 font-medium">
                            <Home size={16} />
                            Return to Homepage
                        </Link>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default WarrantyPolicyPage;
