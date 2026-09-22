export default function BadRequestPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-surface">
            <h1 className="text-6xl font-bold text-on-surface">400</h1>
            <p className="text-xl text-on-surface-variant">Bad Request</p>
            <p className="text-sm text-on-surface-variant mt-2">
                The request could not be understood by the server due to malformed syntax.
            </p>
        </div>
    );
}