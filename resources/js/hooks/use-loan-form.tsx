import { useForm } from "@inertiajs/react";
import axios from 'axios';
import { useState } from "react";
import { route } from "ziggy-js";
import type { LoanRequest } from "@/types/transaction";

export function useLoanForm() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<'token' | 'confirm'>('token');
    const [loanRequest, setLoanRequest] = useState<LoanRequest | null>(null);
    const [tokenError, setTokenError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const tokenForm = useForm({ token: '' });
    const form = useForm({ token: '' });

    const openCreate = () => {
        tokenForm.reset();
        tokenForm.clearErrors();
        form.reset();
        setLoanRequest(null);
        setTokenError(null);
        setStep('token');
        setOpen(true);
    };

    const close = () => {
        tokenForm.reset();
        tokenForm.clearErrors();
        form.reset();
        setLoanRequest(null);
        setTokenError(null);
        setStep('token');
        setOpen(false);
    };

    const validateToken = async () => {
        if (!tokenForm.data.token || tokenForm.data.token.length !== 8) return;
        setIsLoading(true);
        setTokenError(null);
        try {
            const response = await axios.get(route('loans.validate-token'), {
                params: { token: tokenForm.data.token }
            });
            setLoanRequest(response.data);
            form.setData('token', tokenForm.data.token);
            setStep('confirm');
        } catch (e: any) {
            setTokenError(e.response?.data?.message ?? 'Token is invalid or has expired.');
        } finally {
            setIsLoading(false);
        }
    };

    const submit = () => {
        form.post(route('loans.store'), {
            preserveScroll: true,
            onSuccess: close,
        });
    };

    return { open, step, loanRequest, tokenForm, tokenError, isLoading, form, openCreate, close, validateToken, submit };
}