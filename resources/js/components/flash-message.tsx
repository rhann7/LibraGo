import { usePage } from '@inertiajs/react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

type FlashType = 'success' | 'error' | 'warning' | 'info';
type FlashState = { type: FlashType; message: string } | null;

const icons = {
    success: <CheckCircle className="h-4 w-4" />,
    error: <XCircle className="h-4 w-4" />,
    warning: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
};

const styles = {
    success: 'bg-green-500/10 text-green-500 border-green-500/20',
    error: 'bg-red-500/10 text-red-500 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [current, setCurrent] = useState<FlashState>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const flashType = (['success', 'error', 'warning', 'info'] as FlashType[]).find(t => flash[t]);
        if (!flashType) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setCurrent({ type: flashType, message: flash[flashType] as string });
        
        setTimeout(() => setVisible(true), 10);

        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(() => setCurrent(null), 300);
        }, 4000);

        return () => clearTimeout(timer);
    }, [flash]);

    if (!current) return null;

    return (
        <div className={`fixed top-4 right-8 z-50 flex items-center gap-3 rounded-md border px-4 py-3 text-sm shadow-xs transition-all duration-300 ease-in-out ${styles[current.type]} ${
            visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
        }`}>
            {icons[current.type]}
            <span>{current.message}</span>
            <button onClick={() => setCurrent(null)}>
                <X className="h-3.5 w-3.5" />
            </button>
        </div>
    );
}