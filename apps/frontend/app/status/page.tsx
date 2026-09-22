import BackButton from "@/components/BackButton";

type ServiceStatus = {
  name: string;
  healthy: boolean;
  status: string;
};

type StatusResponse = {
  status: string;
  timestamp: string;
  services: Record<string, ServiceStatus>;
};

async function getStatus(): Promise<StatusResponse | null> {
  try {
    const res = await fetch(`${process.env.INTERNAL_API_URL}/status`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function StatusPage() {
  const data = await getStatus();

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>System Status - Maou<span className="text-blue-500">3</span>idy</title>
      <div className="bg-surface text-on-surface antialiased">
        <BackButton />
      </div>
      <main className="max-w-3xl mx-auto px-4 sm:px-10 py-8 sm:py-12 font-inter">
        <h1 className="text-3xl font-headline font-bold mb-2">System Status</h1>

        {!data ? (
          <div className="mt-8 p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700">
            <p className="font-bold">Unable to reach the status service.</p>
            <p className="text-sm mt-1">
              The API Gateway itself did not respond — the whole platform is
              likely down, not just one component.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-on-surface-variant mb-8">
              Last checked: {new Date(data.timestamp).toLocaleString()}
            </p>

            <div
              className={`mb-8 p-4 rounded-2xl font-bold text-center ${
                data.status === "operational"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-amber-50 text-amber-700 border border-amber-200"
              }`}
            >
              {data.status === "operational"
                ? "✓ All systems operational"
                : "⚠ Some systems are degraded"}
            </div>

            <div className="space-y-3">
              {Object.entries(data.services).map(([key, service]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-4 rounded-xl bg-surface-container-lowest"
                >
                  <span className="font-semibold">{service.name}</span>
                  <span
                    className={`flex items-center gap-2 text-sm font-bold ${
                      service.healthy ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        service.healthy ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    {service.healthy ? "Operational" : "Down"}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}

        <p className="text-xs text-on-surface-variant mt-10">
          Checks run every 10 seconds server-side. This page itself is
          server-rendered — refresh to get the latest snapshot.
        </p>
      </main>
    </>
  );
}
