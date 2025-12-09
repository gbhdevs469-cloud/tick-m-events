import  { useState } from "react";
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    IconButton,
    Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const faqs = [
    {
        question: "What is TICK-M EVENTS?",
        answer: `TICK-M EVENTS is an all-in-one platform that simplifies the organization, management, and participation in events. It offers online ticketing, a marketplace to find reliable service providers (venues, caterers, artists, etc.), and innovative tools such as customized photo/video filters and much more.`,
    },
    {
        question: "How do I buy a ticket on TICK-M EVENTS?",
        answer: `• Search for the event you’re interested in using the search bar.
• Check the details (location, date, available ticket types).
• Select the ticket type and quantity.
• Enter your personal information.
• Choose a payment method (Mobile Money, bank card, transfer, or cash depending on the organizer).
• Instantly receive your electronic ticket with a QR Code and manual code.`,
    },
    {
        question: "How do I validate my ticket on the event day?",
        answer: `On the event day, simply present your QR Code or manual code (displayed on your phone or printed). The organizing team scans the code to confirm your entry.`,
    },
    {
        question: "I want to organize an event. How do I proceed?",
        answer: `• Create an organizer account on TICK-M EVENTS.
• Set up your event (title, description, date, location, images).
• Define your ticket types (free or paid).
• Customize your settings (visibility, notifications, photo/video filters).
• Publish the event and start selling your tickets immediately.`,
    },
    {
        question: "What are the benefits for organizers?",
        answer: `• Simple management of tickets and participants.
• Integrated marketing tools (promotions, notifications, social media sharing).
• Access to detailed statistics (sales, attendance rate, engagement).
• Secure and transparent payments.
• Ability to recruit service providers via the marketplace.`,
    },
    {
        question: "How does the TICK-M EVENTS marketplace work?",
        answer: `• Organizers post their needs (e.g., venue rental, catering, DJ).
• Interested service providers submit their offers.
• Both parties can discuss through the integrated messaging system.
• Once an agreement is reached, the contract is validated on the platform.
• TICK-M EVENTS charges a 10% commission to secure the transaction.`,
    },
    {
        question: "What are the benefits for service providers?",
        answer: `• Increased visibility among organizers and participants.
• Online messaging and contract management.
• Tracking of services through an integrated calendar.
• Secure payments and automatic invoice generation.`,
    },
    {
        question: "Are payments secure?",
        answer: `Yes, All payments are processed through secure solutions (Mobile Money, bank cards, transfers). In addition, TICK-M EVENTS applies a transparent commission system to protect both organizers and service providers.`,
    },
    {
        question: "How do customized photo/video filters work?",
        answer: `Each organizer can configure an official filter (frame, logo, colors) for their event. Participants can use it to take photos/videos before or during the event and either save them or share them directly on social media (WhatsApp, TikTok, Facebook, etc.).`,
    },
    {
        question: "How much does it cost to use TICK-M EVENTS?",
        answer: `• For participants: Access to the platform is free, you only pay for your tickets.
• For organizers: A commission is applied on each ticket sold.
• For service providers: Registration is free, but TICK-M EVENTS charges a small commission on contracts made via the marketplace.

👉 With TICK-M EVENTS, you get everything in one place: ticketing, event organization, service providers, photo/video tools, secure management, and much more.`,
    },
];

export default function FAQSection() {
    const [expanded, setExpanded] = useState<number | false>(0);

    const handleChange = (panelIndex: number) => {
        setExpanded((prev) => (prev === panelIndex ? false : panelIndex));
    };
    const navigate = useNavigate();

    return (
        <Box sx={{ bgcolor: "#fff" }} id="faq">
            {/* ========== FAQ SECTION ========== */}
            <Box
                sx={{
                    minHeight: "100vh",
                    py: 8,
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Button
                    size="small"
                    variant="contained"
                    sx={{
                        bgcolor: "#183153",
                        borderRadius: "10px",
                        textTransform: "none",
                        fontSize: "12px",
                        mb: 2,
                        px: 2,
                        py: 0.5,
                        "&:hover": {
                            bgcolor: "#183153",
                        },
                    }}
                >
                    Our Support
                </Button>

                <Typography
                    variant="h5"
                    sx={{
                        color: "#000",
                        fontWeight: 900,
                        mb: 4,
                        textAlign: "center",
                        fontSize: "2.4rem",
                    }}
                >
                    Frequently Asked Questions
                </Typography>

                <Box
                    sx={{
                        width: "100%",
                        maxWidth: "800px",
                        bgcolor: "#fff",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    {faqs.map((faq, index) => (
                        <Accordion
                            key={index}
                            expanded={expanded === index}
                            onChange={() => handleChange(index)}
                            disableGutters
                            elevation={0}
                            sx={{
                                borderBottom: "1px solid #eee",
                                bgcolor: expanded === index ? "#f5f7fa" : "#fff",
                            }}
                        >
                            <AccordionSummary
                                expandIcon={
                                    expanded === index ? (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                bgcolor: "#fff",
                                                color: "#000",
                                                border: "1px solid #000",
                                                "&:hover": { bgcolor: "#f0f0f0" },
                                            }}
                                        >
                                            <CloseIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            size="small"
                                            sx={{
                                                bgcolor: "#000",
                                                color: "#fff",
                                                "&:hover": { bgcolor: "#333" },
                                            }}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                    )
                                }
                                aria-controls={`panel${index}-content`}
                                id={`panel${index}-header`}
                                sx={{
                                    display: "flex",
                                    alignItems: "flex-start",
                                    px: 2,
                                    py: 1.5,
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    alignItems="flex-start"
                                    sx={{ width: "100%" }}
                                >
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 700,
                                            color: "#000",
                                            width: "30px",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {`0${index + 1}`}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            fontWeight: 600,
                                            color: "#000",
                                            flexGrow: 1,
                                            fontSize: "16px",
                                        }}
                                    >
                                        {faq.question}
                                    </Typography>
                                </Stack>
                            </AccordionSummary>

                            {faq.answer && (
                                <AccordionDetails
                                    sx={{
                                        pl: 9,
                                        pr: 3,
                                        pb: 3,
                                        color: "#000",
                                        fontSize: "14px",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    {faq.answer}
                                </AccordionDetails>
                            )}
                        </Accordion>
                    ))}
                </Box>

                <Button
                    variant="contained"
                    sx={{
                        mt: 4,
                        bgcolor: "#183153",
                        px: 4,
                        py: 1.5,
                        borderRadius: "6px",
                        fontWeight: 500,
                        textTransform: "none",
                        "&:hover": {
                            bgcolor: "#204470",
                        },
                    }}
                    onClick={() => navigate("/contact-us")}
                >
                    Contact Us →
                </Button>
            </Box>
        </Box>
    );
}
