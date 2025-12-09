import { DashboardContent } from "src/layouts/dashboard";
import { PageTitleSection } from "src/components/page-title-section";

import { HeroSection } from "../hero-section";
import { AccountPoints } from "../account-points";
import { AvailableRewards } from "../avalable-rewards";
import { RewardsHistory } from "../reward-history";


export function LoyaltyProgramView() {

    return (
        <DashboardContent>
            <PageTitleSection title="My Loyalty Points" />
            <HeroSection />

            <AccountPoints />

            <AvailableRewards />

            <RewardsHistory />

        </DashboardContent>
    );
};