import {
  ComponentSharedCountdownBanner,
  // ComponentSharedCtaFeature,
  ComponentSharedHeroForm,
  ComponentSharedCarousel,
  ComponentSharedRichText,
  ComponentSharedCtaFeature,
  ComponentSharedGrid,
  ComponentSharedSection,
  ComponentSharedFaqSection,
  ComponentSharedTimeline,
  ComponentSharedFeatureSection,
} from "@lib/@generated/graphql";

import dynamic from "next/dynamic";
import cx from "classnames";
import Grid from "./grid";

// const Carousel = dynamic(() => import("./carousel"));
const RichText = dynamic(() => import("@components/molecules/rich-text"));

// const CTAFeature = dynamic(() => import("./cta-feature"));

// const HeroForm = dynamic(() => import("./hero-form"));

// const Grid = dynamic(() => import('./grid'));
const Section = dynamic(() => import("./section"));

const FaqSection = dynamic(() => import("./faq-section"));

// const Timeline = dynamic(() => import("./timeline"));

const FeatureSection = dynamic(() => import("./feature-section"));

// const CountdownBanner = dynamic(() => import("./countdown-banner"), {
//   ssr: false,
// });

// const ProductGrid = dynamic(() => import('./product-grid'));

{
  /* <div className="container mx-auto px-0 md:px-8 lg:px-16"> */
}

const getBlockComponent = (
  { __component, ...props }: any,
  index: number,
  isBlog: boolean,
  isCategory?: boolean
) => {
  switch (__component) {
    case "shared.rich-text":
      const { body } = props as ComponentSharedRichText;
      return (
        <div
          className={cx("overflow-hidden", {
            "container mx-auto px-0 md:px-8 lg:px-10": !isBlog,
          })}
          key={__component + index}
        >
          <RichText
            markup={body || ""}
            className={cx({
              "font-body": isBlog,
              "prose prose-sm lg:prose-sm": isCategory,
              "prose prose-base lg:prose-lg": !isCategory,
            })}
          />
        </div>
      );

    // case "shared.countdown-banner":
    //   return (
    //     <div
    //       className="overflow-hidden container mx-auto px-0 md:px-8 lg:px-10"
    //       key={__component + index}
    //     >
    //       <CountdownBanner {...(props as ComponentSharedCountdownBanner)} />
    //     </div>
    //   );

    case "shared.faq-section":
      return (
        <div
          className="overflow-hidden container mx-auto px-0 md:px-8 lg:px-10"
          key={__component + index}
        >
          <FaqSection {...(props as ComponentSharedFaqSection)} />
        </div>
      );

    case "shared.feature-section":
      return (
        <FeatureSection
          {...(props as ComponentSharedFeatureSection)}
          key={__component + index}
        />
      );

    // case "shared.hero-form":
    //   return (
    //     <HeroForm
    //       key={__component + index}
    //       {...(props as ComponentSharedHeroForm)}
    //     />
    //   );

    // case "shared.cta-feature":
    //   return (
    //     <CTAFeature
    //       key={__component + index}
    //       {...(props as ComponentSharedCtaFeature)}
    //     />
    //   );

    case "shared.grid":
      return (
        <div
          className="container mx-auto px-0 md:px-8 lg:px-10"
          key={__component + index}
        >
          <Grid {...(props as ComponentSharedGrid)} />
        </div>
      );

    case "shared.section":
      return (
        <div
          className="container mx-auto px-0 md:px-8 lg:px-10"
          key={__component + index}
        >
          <Section {...(props as ComponentSharedSection)} />
        </div>
      );

    // case "shared.carousel":
    //   return (
    //     <div
    //       className="container mx-auto px-0 md:px-8 lg:px-10"
    //       key={__component + index}
    //     >
    //       <Carousel {...(props as ComponentSharedCarousel)} />
    //     </div>
    //   );

    // case "shared.timeline":
    //   return (
    //     <div
    //       className="container mx-auto px-2 md:px-8 lg:px-10"
    //       key={__component + index}
    //     >
    //       <Timeline {...(props as ComponentSharedTimeline)} />
    //     </div>
    //   );

    default:
      return;
  }
};

interface BlockManagerProps {
  blocks: any[];

  isBlog?: boolean;
  isCategory?: boolean;
}

export const BlockManager: React.FC<BlockManagerProps> = ({
  blocks,
  isBlog = false,
  isCategory = false,
}) => {
  return (
    <div className="flex flex-col">
      {blocks.map((block, idx) =>
        getBlockComponent(block, idx, isBlog, isCategory)
      )}
    </div>
  );
};
