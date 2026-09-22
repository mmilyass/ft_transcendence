import SummaryCard from "./SummaryCard";
interface ApplicationsSummaryProps {
  stats: {
    newSubmissions: number;
    averageResponseTime: number;
    verifiedRate: number;
  };
}

export default function ApplicationsSummary({
  stats,
}: ApplicationsSummaryProps) {
  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="New Submissions"
        value={`+${stats.newSubmissions}`}
        description="Applications received this week"
        icon="pending_actions"
        bg="bg-primary-fixed-dim/20"
      />

      <SummaryCard
        title="Response Time"
        value={`${stats.averageResponseTime}d`}
        description="Average time to initial review"
        icon="timer"
        bg="bg-secondary-fixed/30"
      />

      <SummaryCard
        title="Verified Rate"
        value={`${stats.verifiedRate}%`}
        description="Credentialing success rate"
        icon="verified_user"
        bg="bg-surface-container-low"
      />
    </div>
  );
}