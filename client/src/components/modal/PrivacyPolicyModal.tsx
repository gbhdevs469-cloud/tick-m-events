import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from "@mui/material";

interface PrivacyPolicyModalProps {
    open: boolean;
    onClose: () => void;
}

export function PrivacyPolicyModal({ open, onClose }: PrivacyPolicyModalProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            scroll="paper"
            sx={{
                '& .MuiDialog-paper': {
                    borderRadius: 2,
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{ bgcolor: "#002D5B", color: "white" }}>
                <Typography variant="h5" fontWeight="bold" textAlign="center">
                    🛡 Privacy Policy – TICK-M EVENTS
                </Typography>
                <Typography variant="subtitle1" textAlign="center" sx={{ mt: 1 }}>
                    Last updated: 10/31/2025
                </Typography>
            </DialogTitle>

            <DialogContent dividers sx={{ p: 3 }}>
                <Box sx={{ py: 1 }}>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        Welcome to TICK-M EVENTS.
                        We place great importance on protecting your personal data.
                        This Privacy Policy explains how we collect, use, share, and protect your information when
                        you use our mobile application, website, and services related to online ticketing and the B2B
                        event marketplace.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        1. 📋 Data We Collect
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        We collect several types of data to ensure the proper functioning of TICK-M EVENTS:
                    </Typography>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        a. Identification Data
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • First and last name
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Email address
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Phone number
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Profile photo (optional)
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Login credentials (username, encrypted password)
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        b. Event-Related Data
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Information about created or published events (title, description, location, date, price, category)
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Ticket sales data (number of tickets, buyers, QR codes, validation codes)
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Event statistics (number of participants, conversion rates, revenue)
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        c. Financial Data
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Information related to Mobile Money payments (MTN, Orange, etc.)
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                            (TICK-M EVENTS never stores bank card information or Mobile Money PIN codes.)
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        d. B2B Marketplace Data
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Provider profiles (DJs, caterers, photographers, etc.)
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Service contracts and bookings
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Reviews, comments, and messages exchanged through the internal chat system
                        </Typography>
                    </Box>

                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                        e. Technical Data
                    </Typography>
                    <Box sx={{ pl: 2, mb: 3 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • IP address, device type, operating system
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Geolocation data (if authorized by the user)
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Activity logs and cookies (for the website)
                        </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        2. 🎯 Purpose of Data Collection
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        We use your data to:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 3 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Manage your user accounts and profiles
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Enable the creation, publication, and management of events
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Facilitate the sale and validation of digital tickets
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Process and secure payments via Mobile Money
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Connect providers and clients within the B2B marketplace
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Provide real-time statistics and reports
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Send notifications, promotional emails, and personalized offers
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Ensure security, fraud detection, and technical support
                        </Typography>
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        3. 🤝 Data Sharing
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        We may share certain information with:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • <strong>Partner providers:</strong> only for the purpose of managing a contract or booking.
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • <strong>Payment services:</strong> to process transactions (Mobile Money, banking operators).
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • <strong>Legal authorities:</strong> only upon legitimate request and in accordance with the law.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • <strong>Technical subcontractors:</strong> for hosting, maintenance, or statistical analysis (under strict confidentiality agreements).
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
                        We never sell your personal data to third parties.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        4. 💳 Data Security and Retention
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        We implement strict technical and organizational measures to protect your data:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Encryption of sensitive data (SSL, HTTPS)
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Secure storage on servers compliant with international standards
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Limited access to authorized personnel only
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Regular backups and recovery procedures in case of incidents
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        Data is retained for as long as necessary to fulfill the purpose for which it was collected or as required by law.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        5. 🔐 Your Rights
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        In accordance with data protection laws (including GDPR and African privacy regulations), you have the following rights:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Access your personal data
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Correct inaccurate or incomplete information
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Delete your data (&quot;right to be forgotten&quot;)
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Object to the processing of your data for marketing purposes
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Transfer your data to another service
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        To exercise your rights, please contact us at:
                        <br />
                        📧 tickmevents@gmail.com or via the app under the &quot;Help Center&quot; section.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        6. 🍪 Cookies and Similar Technologies
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                        When browsing our website or using our app, we use cookies to:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Improve your user experience
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            • Analyze traffic and performance
                        </Typography>
                        <Typography variant="body1" paragraph>
                            • Personalize content and advertisements
                        </Typography>
                    </Box>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        You can disable cookies at any time in your browser settings.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        7. 👶 Minor Users
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        Our services are not intended for individuals under 16 years old.
                        If we discover that an account was created by a minor without parental consent, we will immediately delete it.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        8. 🌍 International Data Transfer
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        Your data may be transferred to and stored on servers located outside your country but always in jurisdictions providing an adequate level of data protection.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        9. ⚖️ Policy Updates
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                        We may update this policy at any time.
                        The date of the latest update will always be displayed.
                        We will notify you of any significant changes by email or via an in-app notification.
                    </Typography>

                    <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
                        10. 📞 Contact
                    </Typography>
                    <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                        For any questions regarding this Privacy Policy or the processing of your data, please contact us at:
                    </Typography>
                    <Box sx={{ pl: 2, mb: 2 }}>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            <strong>📧 Email:</strong> tickmevents@gmail.com
                        </Typography>
                        <Typography variant="body1" paragraph sx={{ mb: 1 }}>
                            <strong>🌐 Website:</strong> https://tick-m.cloud
                        </Typography>
                        <Typography variant="body1" paragraph>
                            <strong>📍 Head Office:</strong> Douala - Nyalla, near ZZ Hotel
                        </Typography>
                    </Box>

                    <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                        ✅ By using TICK-M EVENTS, you agree to this Privacy Policy.
                    </Typography>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    size="large"
                    sx={{
                        bgcolor: "#002D5B",
                        px: 4,
                        '&:hover': {
                            bgcolor: "#001F3F"
                        }
                    }}
                >
                    I Understand
                </Button>
            </DialogActions>
        </Dialog>
    );
};