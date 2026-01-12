import { Shield, FileText, ArrowLeft, Home, BookOpen, AlertCircle } from 'lucide-react';
import { useContent } from '../admin-portal';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DEFAULT_TERMS_CONTENT = {
    title: 'Terms of Service',
    description: 'Please read these terms and conditions carefully before using our services.',
    lastUpdated: 'January 09, 2026',
    sections: [
        {
            title: '1. DEFINITIONS',
            content: `“Addax”, “we”, “our” and “us” shall mean Addax Mobility;

“You”, yourself / yourselves and “your” shall mean a User, who meets the eligibility criteria set out below;

“Application” shall mean the application supplied by Addax and downloaded and installed by you on your single mobile device (smart phone);

“Driver” or ‘’Drivers’’ shall mean the driver engaged by you by using our Website/Application;

“Force Majeure” shall have the meaning as set out in Clause VII;

“Service” or “Services” shall mean the service of providing short-term private Driver solutions via the Application/Website as defined in Clause I;

‘’User’’ or ‘’Users’’ shall have the meaning as set out in Clause III; and

‘’Website’’ shall mean the website www.Addax.in.

These terms and conditions of use (‘’Terms of Use’’) of the Addax website and mobile app, is a legal agreement ("Agreement") between Addax Mobility Solutions Pvt. Ltd. (Erstwhile Humble Mobile Solutions Private limited). (“Addax Mobility”), a company incorporated under the Companies Act, 2013 (India) having its offices at 112/2 KHB Colony, 17th Main, 5th Block, Koramangala, Bengaluru – 560095, Karnataka and yourself/yourselves. If you continue to browse the website and/or use the mobile application you are agreeing to comply with and be bound by the Terms of Use.

If you do not agree with the Terms of Use, please do not access and use this Website / Application (as hereinafter defined) or our Service through all other means.`
        },
        {
            title: '2. SERVICES DESCRIPTION',
            content: `1. Addax Mobility Solutions Private Limited operates a technology based electronic platform service called ‘Addax’ which seeks to provide drivers-on-demand to customers who wish to obtain the services of a driver.

2. Addax enables the hiring of drivers by commuters/ passengers for a point to point pick up and drop off Service, within city limits and outside city limits, through the Application in mobile telecommunications devices and through the Website. The Service is designed to offer you information and a means of obtaining short-term private driver solutions to coordinate point-to-point and round-trip private driver services, at user’s request. As a User, you authorize the opted Driver to operate your vehicle and make decisions on your behalf during a period of time designated by you.

3. The Drivers offering their services on the Addax platform are individuals and independent service providers who have opted to enlist themselves with Addax. The drivers are screened and trained prior to being listed as a driver on the Addax platform. At no point can the driver represent himself to be an employee of Addax Mobility Solutions Private Limited/Addax. The user terms and conditions in here expressly provide that the drivers are independent service providers and are not employees of Addax Mobility Solutions Private Limited/Addax.

4. Further, it is to be noted that Addax, in itself does not provide driving / transportation services. The customer offers the mode of transportation. The terms and conditions clearly state that the provision of services by the driver to the customer is, subject to the agreement entered into between them and Addax shall under no circumstance be a party to such agreement.

5. To elaborate, the modus operandi is as follows:

a. ‘Addax’ aims at bringing drivers/operators (service providers) and customers owning private cars on a common platform by which the said customers can place a request for the services of a professional driver for commute.

b. The e-commerce platform brings the customer into contact with a driver so as to avail the latter’s services, subject to the availability of drivers in or around the customer’s location at the time of registering his request.

c. The request by the customer could be for a point-to-point commute or a round trip is placed by the customer electronically over a mobile based app or through an online website operated by Addax or via phone service.

d. Towards the end of the commute, the customers are charged for the services of the driver, which is intimated to them over the app or mail. The services may be paid for by the customers either:

in cash, directly to the driver or
through online payment options, to Addax
e. Where the customer opts to pay for the drivers’ services through any of the online modes available on the app, Addax remits the proceeds collected from the customers to the respective drivers.

f. In return for the use of the Addax’s electronic platform, the Drivers are charged a convenience fee by Addax. Addax remits any applicable tax to the credit of the respective Governments and regularly files periodic returns as prescribed under the GST laws.`
        },
        {
            title: '3. USE OF SERVICE, APPLICATION AND WEBSITE',
            content: `The Application and the Website allows you to send a request for Service to a Driver. The GPS receiver, which should be installed on the mobile device (smart phone) on which you have downloaded the Application or the Website, shall detect your location and shall send your location information to the relevant Driver. Addax has sole and complete discretion to accept or reject each request for providing the Service. Addax also has sole and complete discretion over whether to use the Application / Website to receive the leads generated through the Application / Website. If Addax accepts a request, the Application / Website notifies you and provides information regarding the Driver - including his name and the ability to contact the Driver by telephone or a message. The Application / Website also allow you to view the Driver’s progress towards the pick-up point, in real time.

Addax shall undertake commercially reasonable efforts to bring you into contact with a Driver in order to avail the Services, subject to the availability of Drivers in or around your location at the moment of your request for the Services.

Addax itself does not provide transportation services. It is up to the User to offer transportation. Addax only acts as intermediary between the Driver and you. The provision of the Services by the Driver to you is, therefore, subject to the agreement (to be) entered into between the Driver and you. Addax shall under no circumstance be a party to such agreement. Addax disclaims any and all liability in respect of the Drivers including any claims of employment or any vicarious liability arising out of the Service or otherwise.`
        },
        {
            title: '4. USER ELIGIBILITY AND AGREEMENT',
            content: `User means any individual or business entity/organization that legally operates in India or in other countries, and uses and has the right to use the Services provided by Addax. Our Services are available only to those individuals or entities who can execute legally binding contracts under the applicable law. Therefore, a User must not be a minor as per Indian Law; i.e. User(s) must be at least 18 years of age to be eligible to use our Services.

Addax advises its Users that while accessing the Website/Application, they must follow/abide by the applicable laws. Addax may, in its sole discretion, refuse the Service to anyone at any time.

This Agreement applies to all Services offered on the Website/Application, collectively with any additional terms and condition that may be applicable.`
        },
        {
            title: '5. REGISTRATION',
            content: `To use the Services, you have to be registered and provide your name, contact number, email address and other details. Please see our Privacy Policy and practices to know more about how your personal information would be used.`
        },
        {
            title: '6. REPRESENTATIONS AND WARRANTIES',
            content: `As a precondition to your use of the Services, you represent and warrant that:

The information you provide to Addax is accurate and complete. Addax service is only available for private cars for non-commercial purposes within the city limits as designated on our Website. Private cars for non-commercial purposes bear license plates with black lettering over white colored background (Commercial vehicles have license plates with black lettering over yellow colored background). You will ensure that Addax service is being utilized only for non-commercial purposes in a private car. Addax is entitled, at all times, to verify the information that you have provided and to refuse the Service or use of the Application / Website without providing reasons.

You will only access the Service using authorized means. You are responsible to check and ensure you download the correct Application for your device or the correct Website in your computer. Addax shall not be liable if you do not have a compatible mobile device or if you download the wrong version of the Application for your mobile device or Website for the computer. Addax reserves the right to terminate the Service and the use of the Application/ Website should you use the Service or Application with an incompatible or unauthorized device.

You have the legal right and authority to possess and operate the vehicle when engaging our Services and you confirm, represent and warrant that the said vehicle is in good operating condition and meets the industry safety standards and all applicable statutory requirements for a motor vehicle of its kind.

You will be solely responsible for any and all liability which results from or is alleged as a result of the condition of your vehicle, legal compliance, etc., including, but not limited to, personal injuries, death and property damages.

You will be solely responsible for the full functionality of your vehicle. If your vehicle fails to function (electrical, mechanical or other) in any way while the Services are being availed of by you, you will be responsible for all storage fees, roadside assistance, alternate transportation and repair of any kind and neither Addax Mobility nor the Driver shall be responsible in any manner whatsoever. You have the legal right to designate the Driver as your agent and delegate actual authority to the Driver to operate your vehicle and make decisions on your behalf for the purposes of providing Services offered through the Addax platform.

You are named or scheduled on the insurance policy covering the vehicle you use when engaging our Services. You have a valid policy of liability insurance (in coverage amounts consistent with all applicable legal requirements) for the operation of your vehicle to cover any anticipated losses related to your participation in the Services or the operation of your vehicle by the Driver. In the event of a motor vehicle accident you will be solely responsible for compliance with any applicable statutory or department of motor vehicles requirements and for all necessary contacts with your insurance provider. Other than any personal criminal liability attaching to the Driver you will be solely responsible for all consequences arising out of the use of the Service or the Driver. In any event Addax shall have no responsibility or liability on this account whatsoever.

You specifically authorize us to use, store or otherwise process your 'Sensitive personal data or information’ (as such term is defined in Information Technology (Reasonable security practices and procedures and sensitive personal data or information) Rules, 2011) in order to provide the Services to you. Subject to applicable law all information provided to us by you shall be deemed to be our information to use as we desire.

You will obey all applicable laws related to the matters set forth herein and will be solely responsible for any violations of the same.`
        },
        {
            title: '7. METER START AND CANCELLATION POLICY',
            content: `Addax drivers will wait no more than 15 minutes from the requested trip start time, before they start the trip timer.

You may cancel the booking within 30 minutes prior to the time of journey, without any cancellation charges for all Services. The customer is liable for Rs 100/- charge if the trip is cancelled thereafter.`
        },
        {
            title: '8. PAYMENT',
            content: `When a trip ends, Addax driver ends the trip on the Addax Partner app on his mobile device. It then calculates the total fare amount due from You and it appears on the Addax app on your mobile device. You may pay the amount via cash or a variety of online payment options available on the app including payment via the Addax Wallet where You may have already pre-loaded funds. The usage of the Addax Wallet shall be subject to the terms and conditions of the third party payment processor providing the mobile payment service on the App. Any payment related issue, except when such issue is due to an error or fault in the Site or Application, shall be resolved between You and the payment processor. Addax shall not be responsible for any unauthorized use of Your Addax Wallet.`
        },
        {
            title: '9. LIMITATION OF LIABILITY',
            content: `The information, recommendations and/or Services provided to you on or through the Website/Application are for general information purposes only and do not constitute advice. Addax will take reasonable steps to keep the Website/Application and its contents correct and up to date but does not guarantee that the contents of the Website/Application are free of errors, defects, malware and viruses or that the Website/Application are correct, up to date and accurate.

Addax shall not be liable for any damages resulting from the use of, or inability to use, the Website/Application, including damages caused by malware, viruses or any incorrectness or incompleteness of the information on the Website/Application.

Addax shall further not be liable for damages resulting from the use of, or the inability to use, electronic means of communication with the Website/Application, including — but not limited to — damages resulting from failure or delay in delivery of electronic communications, interception or manipulation of electronic communications by third parties or by computer programs used for electronic communications and transmission of viruses.

Without prejudice to the foregoing, and insofar as allowed under mandatory applicable law, Addax’s aggregate liability shall in no event exceed the equivalent of the amount for the payment of the Services.

The quality of the Services requested through the use of the Application is entirely the responsibility of the Driver who ultimately provides such transportation services to you. Addax under no circumstance accepts liability in connection with and/or arising from the Services provided by the Driver or any acts, actions, behaviour, conduct, and/or negligence on the part of the Driver.

We shall not be held liable for any failure or delay in performing Services where such failure arises as a result of any act or omission, which is outside our reasonable control such as unprecedented circumstances, overwhelming and unpreventable events caused directly and exclusively by forces of nature that can be neither anticipated, nor controlled, nor prevented by the exercise of prudence, diligence, and care, including but not limited to: war, riot, civil commotion; compliance with any law or governmental order, rule, regulation or direction and acts of third parties ( “Force Majeure” ).

If we have contracted to provide identical or similar Service to more than one User and are prevented from fully meeting our obligations to you by reason of an event of Force Majeure, we may decide at our absolute discretion which booking we will fulfill by providing the Service, and to what extent.

We have taken all reasonable steps to prevent internet fraud and ensure any data collected from you is stored as securely and safely as possible. However, we shall not be held liable in the unlikely event of a breach in our secure computer servers or those of third parties other than as required under applicable law.

In the event we have a reasonable belief that there exists an abuse of vouchers and/or discount codes or suspect an instance of fraud, we may cause the User to be blocked immediately and reserve the right to refuse future Service. Additionally, should there exist an abuse of vouchers or discount codes, Addax reserves the right to seek compensation from any and all such Users.

Addax does not represent or endorse the accuracy or reliability of any information, or advertisements (collectively, the "Content") contained on, distributed through, or linked, downloaded or accessed from or contained on the Website/Application, or the quality of any products, information or other materials displayed, or obtained by you as a result of an advertisement or any other information or offer in or in connection with the Service.

Offers are subject to Addax's discretion and may be withdrawn at any time and without notice.`
        },
        {
            title: '10. INTELLECTUAL PROPERTY RIGHTS',
            content: `Addax is the sole owner or lawful licensee of all the rights to the Website/Application and its content. Website/Application content means its design, layout, text, images, graphics, sound, video etc. The Website/Application content embodies trade secrets and intellectual property rights protected under worldwide copyright and other laws. All title, ownership and intellectual property rights in the Website/Application and its content shall remain with Addax.

All rights, not otherwise claimed under this Agreement or in the Website /Application, are hereby reserved. The information contained in this Website/Application is intended, solely to provide general information for the personal use of the reader, who accepts full responsibility for its use.

You may access the Website/Application, avail of the features, facilities and Services for your personal or internal requirements only. You are not entitled to duplicate, distribute, create derivative works of, display, or commercially exploit the Website/Application Content, features or facilities, directly or indirectly, without our prior written permission of Addax.

Copyright

All content on this Website/Application is the copyright of Addax except the third party content and link to third party website on our Website/Application, if any.

Systematic retrieval of Addax content to create or compile, directly or indirectly, a collection, compilation, database or directory (whether through robots, spiders, automatic devices or manual processes) without written permission from Addax is prohibited.

In addition, use of the content for any purpose not expressly permitted in this Terms of Use is prohibited and may invite legal action. As a condition of your access to and use of Services, you agree that you will not use the Website/Application to infringe the intellectual property rights of others in any way. Addax reserves the right to terminate the account of a User upon any infringement of the rights of others in conjunction with use of the Service, or if Addax believes that User’s conduct is harmful to the interests of Addax, its affiliates, or other Users, or for any other reason in Addax's sole discretion, with or without cause.`
        },
        {
            title: '11. USER ACCOUNTS, OFFERS AND PROMOTIONS',
            content: `Addax reserves the right to collect User data including name, contact information and other details to facilitate Services or use of its platform to avail Services. All information collected from the User are on a bona fide basis. Misuse and misrepresentation of identity or contact details will lead to automatic termination of Services or the use of the platform, without prior notice to such Users.

User accounts bearing contact number and email IDs are created and owned by Addax. Any promotional discounts and offers accumulated can be revoked without prior notice in the event of suspicious account activity or mala fide intent of the User.

In the case where the system is unable to establish unique identity of a User against a valid mobile number or e-mail ID, the account shall be indefinitely suspended. Addax reserves the full discretion to suspend a User's account in the above event and does not have the liability to share any account information whatsoever.

For any other queries on Addax and its services, please write in to us at support@addaxautomotive.in`
        }
    ]
};

export const TermsPage = () => {
    const { content } = useContent();
    const termsContent = content.pages?.termsOfService || DEFAULT_TERMS_CONTENT;

    if (!termsContent) return null;

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
                {[BookOpen, Shield, AlertCircle].map((Icon, i) => (
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
                        <BookOpen size={18} />
                        <span className="text-sm font-semibold tracking-wide uppercase">Legal Information</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 mb-6 leading-tight">
                        {termsContent.title || 'Terms of Service'}
                    </h1>

                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        {termsContent.description}
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
                        {termsContent.sections?.map((section, idx) => (
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
                            <span>Last Updated: {termsContent.lastUpdated}</span>
                        </div>

                        <p className="text-sm max-w-lg">
                            If you have any questions or concerns about these terms, please contact our support team at <strong>support@addaxautomotive.in</strong>.
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

export default TermsPage;
