import { Box, IconButton, Stack, Tooltip } from "@mui/material";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Helmet } from "react-helmet";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { friends } from "./utills";

export function EventShare({ selectedEvent }: any) {
  const { _id, eventName, description, coverImage } = selectedEvent;
  // Create share URL - replace with your production URL
  const shareUrl = `http://localhost:3039/our-event/${_id}`;

  // Clean description text (remove HTML tags)
  const cleanDescription = description
    ? `${description.replace(/<[^>]*>?/gm, '').substring(0, 200)}...`
    : 'Check out this amazing event!';

  // Format share text for different platforms
  const shareText = `${eventName} - ${cleanDescription}`;

  // Copy URL to clipboard
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    // You can add a toast notification here
    alert('Link copied to clipboard!');
  };

  return (
    <Box p={3} my={3} bgcolor="#fff" borderRadius={3} boxShadow={3}>
      {/* Social Meta Tags for rich sharing previews */}
      <Helmet>
        <meta property="og:title" content={eventName} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={coverImage.url} />
        <meta property="og:url" content={shareUrl} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      {/* Title */}
      <HeadingCommon
        variant="h6"
        title="Share This Event"
        weight={600}
        baseSize="34px"
      />

      <Stack direction="row" spacing={2} alignItems="center">
        {/* Facebook */}
        {/* <Tooltip title="Share on Facebook">
          <FacebookShareButton
            url={shareUrl}
            hashtag="#Event"
          >
            <FacebookIcon size={40} round />
          </FacebookShareButton>
        </Tooltip> */}

        {/* Twitter */}
        <Tooltip title="Share on Twitter">
          <TwitterShareButton
            url={shareUrl}
            title={shareText}
            via="YourAppName"
            hashtags={["Event", eventName.replace(/\s/g, '')]}
          >
            <TwitterIcon size={40} round />
          </TwitterShareButton>
        </Tooltip>

        {/* WhatsApp */}
        <Tooltip title="Share on WhatsApp">
          <WhatsappShareButton
          
            url={shareUrl}
            title={`${eventName} - ${cleanDescription}`}
          >
            <WhatsappIcon size={40} round />
          </WhatsappShareButton>
        </Tooltip>

        

        {/* Copy Link */}
        <Tooltip title="Copy link">
          <IconButton onClick={handleCopyLink} sx={{ ml: 1 }}>
            <ContentCopyIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Friends List */}
      <Box bgcolor='#f0f0f0' p={2} borderRadius={3} mt={3}>
        <HeadingCommon
          title="Friends Who Booked"
          weight={500}
          baseSize="26px"
        />

        {friends.map((name, index) => (
          <Box key={index} boxShadow={3} bgcolor="#fff" p={2} borderRadius={3} my={3}>
            {name}
          </Box>
        ))}
      </Box>
    </Box>
  );
}