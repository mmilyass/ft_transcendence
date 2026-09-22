function Toast({ message, type }: { message: string; type: 'success' | 'error' | 'warning' | 'info' }) {
    const getBackgroundColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'info':
                return 'bg-blue-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div className={`fixed top-4 right-4 p-4 rounded ${getBackgroundColor()} text-white shadow-lg`}>
            {message}
        </div>
    );
}

export default Toast;