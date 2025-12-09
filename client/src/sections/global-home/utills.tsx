import CameraAltIcon from "@mui/icons-material/CameraAlt";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ChatIcon from "@mui/icons-material/Chat";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import CampaignIcon from "@mui/icons-material/Campaign";
import PaymentIcon from "@mui/icons-material/Payment";
import BarChartIcon from "@mui/icons-material/BarChart";

export const flagship = [
  {
    icon: <CameraAltIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Personalized filter for each event",
    description: "Participants can take a photo of themselves with an exclusive filter",
  },
  {
    icon: <QrCodeScannerIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Event Entry",
    description: "Entry via QR Code and/or Manual verification.",
  },
  {
    icon: <ChatIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Contact",
    description: "Chat organizer ↔ providers",
  },
  {
    icon: <LiveTvIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Built-in Live Streaming",
    description: "To stream your physical events online",
  },
  {
    icon: <CampaignIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Integrated marketing",
    description: "Push notifications, email campaigns, etc.",
  },
  {
    icon: <PaymentIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Secure payments",
    description: "Mobile Money, credit card, bank transfer, cash",
  },
  {
    icon: <BarChartIcon sx={{ fontSize: 40, color: "#000" }} />,
    title: "Real-time statistics",
    description: "Sales, attendance, rates.",
  },
];

export const eventTypes = ['All', 'Public', 'Private'];
export const pricingOptions = ['All', 'Free', 'Paid'];