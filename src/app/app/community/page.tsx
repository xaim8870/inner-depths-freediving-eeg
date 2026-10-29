import FutureFeatureState from "@/components/app/future-feature-state";

// The Cove (community meet-ups) is outside the MVP scope; the page holds its place in the navigation.
export default function CommunityPage() {
  return (
    <FutureFeatureState
      status="Community · coming later"
      title="The Cove"
      description="Find your people in the water: meet-ups and buddy matching between divers. It isn't part of this first version — your log, training and progress come first."
      dependency="Community safety review, moderation and buddy-matching design."
    />
  );
}
