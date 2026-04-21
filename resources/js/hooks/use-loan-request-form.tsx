import { router, useForm } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import type { LoanRequest } from "@/types/transaction";

export function useLoanRequestForm() {
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejecting, setRejecting] = useState<LoanRequest | null>(null);

    const rejectForm = useForm({
        note: '',
    });

    const openReject = (loanRequest: LoanRequest) => {
        rejectForm.reset();
        rejectForm.clearErrors();
        setRejecting(loanRequest);
        setRejectOpen(true);
    };

    const closeReject = () => {
        rejectForm.reset();
        rejectForm.clearErrors();
        setRejecting(null);
        setRejectOpen(false);
    };

    const submitReject = () => {
        if (!rejecting) return;
        rejectForm.patch(route('loan-requests.reject', { loanRequest: rejecting.id }), {
            preserveScroll: true,
            onSuccess: closeReject,
        });
    };

    const approve = (loanRequest: LoanRequest) => {
        if (!confirm(`Approve loan request from "${loanRequest.user.name}"?`)) return;
        router.patch(route('loan-requests.approve', { loanRequest: loanRequest.id }), {}, {
            preserveScroll: true,
        });
    };

    return { rejectOpen, rejecting, rejectForm, openReject, closeReject, submitReject, approve };
}