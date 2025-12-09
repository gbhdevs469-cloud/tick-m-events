import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider
} from "@mui/material";

interface TermsOfUseModalProps {
  open: boolean;
  onClose: () => void;
}

export function TermsOfUseModal ({ open, onClose }: TermsOfUseModalProps) {
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
          🧾 TICK-M EVENTS Terms and Conditions of Use
        </Typography>
        <Typography variant="subtitle1" textAlign="center" sx={{ mt: 1 }}>
          Last Updated: 10/31/2025
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers sx={{ p: 3 }}>
        <Box sx={{ py: 1 }}>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Welcome to TICK-M EVENTS, an online ticketing service and B2B marketplace for event
            service providers, operated by TICK-M SARL.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontStyle: 'italic', mb: 3 }}>
            By accessing or using our Application, you agree to these Terms and Conditions of Use
            (&quot;Terms&quot;). Please read them carefully before using our services.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            1. Purpose
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            These Terms govern access to and use of the TICK-M EVENTS platform, which includes:
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              <strong>🎟 Online Ticketing:</strong> creation, publication, and management of events; sale and purchase
              of digital tickets; entry validation (QR code or manual code); real-time statistics; and
              integrated marketing tools.
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>🛍 B2B Marketplace:</strong> connecting event organizers with service providers (DJs, caterers,
              photographers, decorators, etc.); service booking; contract management; integrated
              messaging system; reviews and ratings; statistics; and profile management.
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            2. Definitions
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • <strong>User:</strong> any person accessing the platform, whether a visitor, organizer, event
              participant, or service provider.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • <strong>Organizer:</strong> a user who creates and publishes events through the ticketing system.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • <strong>Service Provider:</strong> a professional offering services through the marketplace.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • <strong>Participant:</strong> a user purchasing a ticket.
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • <strong>Account:</strong> a personal space allowing access to the platform&apos;s features.
            </Typography>
            <Typography variant="body1" paragraph>
              • <strong>Service Contract:</strong> an agreement between an organizer and a service provider made
              through the platform.
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            3. Registration and User Account
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Access to certain features requires creating a personal account.
            You agree to provide accurate, complete, and up-to-date information.
            You are solely responsible for maintaining the confidentiality of your login credentials.
            We reserve the right to suspend or delete any account in case of fraudulent use or
            violation of these Terms.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            4. Online Ticketing
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Organizers can create, publish, and manage their events from their dashboard.
            TICK-M EVENTS charges a 10% commission on every ticket sold through the application.
            Buyers can purchase digital tickets using the available payment methods (Mobile Money,
            bank card, cash, etc.).
            Each ticket is linked to a unique QR code and/or manual code for entry validation.
            All ticket sales are final and non-refundable, except in cases of force majeure or if the
            event is canceled by the organizer.
            In case of cancellation, refunds will be processed according to the refund policy defined by
            the organizer and approved by TICK-M EVENTS.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            5. B2B Marketplace
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Service providers can create a professional profile and offer their services.
            Organizers can book or hire service providers through the platform.
            TICK-M EVENTS charges a 10% commission on each contract or confirmed booking made
            through the platform.
            Payments are processed via secure payment methods mutually agreed upon by the
            parties outside the application.
            Contracts and bookings made through the platform are subject to mutual acceptance
            between the organizer and the service provider.
            Reviews and ratings must remain objective, respectful, and based on genuine
            experience.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            6. Payments, Commissions, and Fees
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Transactions are handled by our approved financial partners (Mobile Money operators,
            banks, payment gateways).
            Funds due to organizers or service providers are transferred after deducting the
            applicable 10% commission on each contract or sale.
            In case of a dispute or cancellation, TICK-M EVENTS may temporarily withhold funds
            until resolution.
            TICK-M EVENTS covers the fees of third-party financial partners only in the following
            cases:
          </Typography>
          <Box sx={{ pl: 2, mb: 2 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • When a buyer purchases a ticket through the online ticketing system;
            </Typography>
            <Typography variant="body1" paragraph>
              • When an organizer withdraws funds from their account on the platform.
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            In all other cases (e.g., payments related to the B2B marketplace or exceptional refunds),
            the financial partners&apos; fees are borne by the respective users.
            TICK-M EVENTS shall not be held responsible for additional fees applied by external
            financial institutions.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            7. User Obligations
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Each user agrees to:
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • Use the platform in compliance with the law and these Terms;
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • Not post defamatory, misleading, offensive, or illegal content;
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • Respect intellectual property rights, privacy, and the conditions of other users;
            </Typography>
            <Typography variant="body1" paragraph>
              • Not use the platform for fraudulent or unauthorized activities.
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            8. Intellectual Property
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            All platform content (logos, trademarks, texts, images, design, source code) is the exclusive
            property of TICK-M EVENTS.
            Any reproduction, distribution, or modification without prior authorization is strictly prohibited.
            Organizers and service providers retain ownership of their published content but grant
            TICK-M EVENTS a non-exclusive license to display and promote it on the platform.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            9. Personal Data and Privacy
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            We collect certain personal data as part of the platform&apos;s operation (account creation,
            payments, statistics).
            This data is processed in accordance with applicable data protection laws.
            Users may access, correct, or delete their personal information upon request.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            10. Liability and Limitations
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            TICK-M EVENTS acts solely as an intermediary between parties.
            We are not responsible for the quality of services provided by service providers or the
            conduct of events.
            In the event of a dispute between users, TICK-M EVENTS may act as a mediator, but
            assumes no legal obligation to resolve the dispute.
            We do not guarantee uninterrupted or error-free access to the platform, especially during
            maintenance or in cases of force majeure.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            11. Suspension or Termination
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            TICK-M EVENTS reserves the right to:
          </Typography>
          <Box sx={{ pl: 2, mb: 3 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • Suspend or delete any account in case of non-compliance with these Terms;
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              • Remove any content deemed inappropriate or illegal;
            </Typography>
            <Typography variant="body1" paragraph>
              • Terminate access to all or part of the service without prior notice in cases of serious
              misconduct or abuse.
            </Typography>
          </Box>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            12. Amendments to the Terms
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            TICK-M EVENTS may update these Terms at any time.
            Users will be notified by email or through the application.
            Continued use of the platform constitutes acceptance of the updated Terms.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            13. Governing Law and Jurisdiction
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            These Terms are governed by Cameroonian law.
            Any dispute shall be submitted to the competent court of the registered office of TICK-M
            EVENTS.
          </Typography>

          <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
            14. Contact
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 1 }}>
            For any questions regarding these Terms or the use of the platform:
          </Typography>
          <Box sx={{ pl: 2 }}>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              <strong>📧 Email:</strong> tickmevents@gmail.com
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 1 }}>
              <strong>📞 Phone:</strong> (+237) 697 18 25 51
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>📍 Address:</strong> Douala – Nyalla, near ZZ Hotel
            </Typography>
          </Box>
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