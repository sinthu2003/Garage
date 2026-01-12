import { motion } from 'framer-motion';
import { Shield, Lock, FileText, ArrowLeft, Home } from 'lucide-react';
import { useContent } from '../admin-portal';
import { Link } from 'react-router-dom';

export const PrivacyPolicyPage = () => {
    const { content } = useContent();
    const DEFAULT_PRIVACY_CONTENT = {
        title: "Privacy Policy",
        description: "At Addax, we value your trust & respect your privacy. This Privacy Policy provides you with details about the manner in which your data is collected, stored & used by us. You are advised to read this Privacy Policy carefully. By downloading and using the Addax application/ website/WAP site you expressly give us consent to use & disclose your personal information in accordance with this Privacy Policy. If you do not agree to the terms of the policy, please do not use or access Addax.",
        lastUpdated: "January 01, 2024",
        sections: [
            {
                title: "General",
                content: "We will not sell, share or rent your personal information to any 3rd party or use your email address/mobile number for unsolicited emails and/or SMS. Any emails and/or SMS sent by Addax will only be in connection with the provision of agreed services & products and this Privacy Policy. Periodically, we may reveal general statistical information about Addax & its users, such as number of visitors, number and type of goods and services purchased, etc. We reserve the right to communicate your personal information to any third party that makes a legally-compliant request for its disclosure."
            },
            {
                title: "Personal Information",
                content: "Personal Information means and includes all information that can be linked to a specific individual or to identify any individual, such as name, address, mailing address, telephone number, email ID, credit card number, cardholder name, card expiration date, information about your mobile phone, DTH service, data card, electricity connection, Smart Tags and any details that may have been voluntarily provide by the user in connection with availing any of the services on Addax."
            },
            {
                title: "Use of Personal Information",
                content: "We use personal information to provide you with services & products you explicitly requested for, to resolve disputes, troubleshoot concerns, help promote safe services, collect money, measure consumer interest in our services, inform you about offers, products, services, updates, customize your experience, detect & protect us against error, fraud and other criminal activity, enforce our terms and conditions, etc. We also use your contact information to send you offers based on your previous orders and interests."
            },
            {
                title: "Cookies",
                content: "A \"cookie\" is a small piece of information stored by a web server on a web browser so it can be later read back from that browser. Addax uses cookie and tracking technology depending on the features offered. No personal information will be collected via cookies and other tracking technology; however, if you previously provided personally identifiable information, cookies may be tied to such information. Aggregate cookie and tracking information may be shared with third parties."
            },
            {
                title: "Security",
                content: "Addax has stringent security measures in place to protect the loss, misuse, and alteration of the information under our control. Whenever you change or access your account information, we offer the use of a secure server. Once your information is in our possession we adhere to strict security guidelines, protecting it against unauthorized access."
            },
            {
                title: "Consent",
                content: "By using Addax and/or by providing your information, you consent to the collection and use of the information you disclose on Addax in accordance with this Privacy Policy, including but not limited to your consent for sharing your information as per this privacy policy."
            }
        ]
    };

    const privacyContent = content.pages?.privacyPolicy || DEFAULT_PRIVACY_CONTENT;

    if (!privacyContent) return null;

    return (
        <div className="min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-300">

            {/* Animated Background (Same as NotFoundPage) */}
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
                {[Shield, Lock, FileText].map((Icon, i) => (
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
                        <Shield size={18} />
                        <span className="text-sm font-semibold tracking-wide uppercase">Trust & Security</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 leading-tight">
                        {privacyContent.title || 'Privacy Policy'}
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {privacyContent.description}
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
                        {privacyContent.sections?.map((section, idx) => (
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
                            <span>Last Updated: {privacyContent.lastUpdated}</span>
                        </div>

                        <p className="text-sm max-w-lg">
                            If you have any questions or concerns about this policy, please contact our Grievance Officer at <strong>support@addaxautomotive.in</strong>.
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

export default PrivacyPolicyPage;