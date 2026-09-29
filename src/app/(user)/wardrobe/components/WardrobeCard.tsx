import { WardrobeCardV2, WardrobeCardV2Props } from "./WardrobeCardV2";

export type WardrobeCardProps = WardrobeCardV2Props;

export function WardrobeCard(props: WardrobeCardProps) {
  return <WardrobeCardV2 {...props} />;
}

export { WardrobeCardV2 };

