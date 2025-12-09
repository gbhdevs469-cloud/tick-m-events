import React from 'react';
import { Box, keyframes } from '@mui/material';

// Define types for our promotions
interface Promotion {
  _id: string;
  promotionType: string;
  eventId: string;
  discountValue: string;
  ticketSelection: string;
  validityPeriodStart: string;
  validityPeriodEnd: string;
  promoCode: string;
  createdBy: string;
  status: string;
}

// Helper function to check if promotion is active
const isPromotionActive = (promotion: Promotion): boolean => {
  if (!promotion || promotion.status !== 'active') return false;
  
  const currentDate = new Date();
  const startDate = new Date(promotion.validityPeriodStart);
  const endDate = new Date(promotion.validityPeriodEnd);
  endDate.setHours(23, 59, 59, 999); // Set to end of day
  
  return currentDate >= startDate && currentDate <= endDate;
};

// Define the type mapping with index signature
type PromotionTypeMap = {
  [key: string]: string;
  earlyBuyerDiscount: string;
  percentageDiscount: string;
  fixedValueDiscount: string;
};

// Helper function to format promotion type for display
const formatPromotionType = (promotionType: string): string => {
  const typeMap: PromotionTypeMap = {
    earlyBuyerDiscount: 'Early Bird',
    percentageDiscount: 'Discount',
    fixedValueDiscount: 'Fixed Off',
  };
  
  return typeMap[promotionType] || promotionType;
};

// Filter and sort promotions by priority
const filterAndSortPromotions = (promotions: Promotion[]): Promotion[] => {
  const allowedTypes = ['earlyBuyerDiscount', 'percentageDiscount', 'fixedValueDiscount'];
  
  return promotions
    .filter(promotion => allowedTypes.includes(promotion.promotionType))
    .sort((a, b) => {
      // Sort by priority: earlyBuyerDiscount > percentageDiscount > fixedValueDiscount
      const priority: { [key: string]: number } = {
        earlyBuyerDiscount: 1,
        percentageDiscount: 2,
        fixedValueDiscount: 3,
      };
      return priority[a.promotionType] - priority[b.promotionType];
    });
};

// Define marquee animation using keyframes
const marquee = keyframes`
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
`;

// Promotion Badge Component
export function PromotionBadge({ promotions }: { promotions?: Promotion[] }) {
  console.log(promotions);
  
  // Filter active promotions and only allow specified types
  const activePromotions = promotions?.filter(isPromotionActive) || [];
  const filteredPromotions = filterAndSortPromotions(activePromotions);
  
  // If no active promotions, don't render anything
  if (filteredPromotions.length === 0) return null;
  
  // Get unique promotion types (after filtering)
  const promotionTypes = [...new Set(filteredPromotions.map((p: Promotion) => p.promotionType))];
  
  // Format text for display
  const badgeText = promotionTypes.map(formatPromotionType);
  
  // Determine if we need marquee effect (more than 2 promotions)
  const needsMarquee = badgeText.length > 2;
  const displayText = badgeText.join(' | ');

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 90,
        height: 90,
        overflow: 'hidden',
        borderTopLeftRadius: 24,
        zIndex: 1,
        backgroundColor: 'transparent',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 26,
          left: -25,
          backgroundColor: '#0B2E4C',
          color: '#fff',
          px: 2,
          py: '2px',
          fontSize: '10px',
          fontWeight: 600,
          transform: 'rotate(-45deg)',
          width: '120px',
          textAlign: 'center',
          boxShadow: 2,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'inline-block',
            whiteSpace: 'nowrap',
            animation: needsMarquee ? `${marquee} 8s linear infinite` : 'none',
            paddingLeft: needsMarquee ? '100%' : '0',
          }}
        >
          {displayText}
        </Box>
      </Box>
    </Box>
  );
}