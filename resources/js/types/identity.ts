export type StudentMaster = {
    id: number;
    nipd: string;
    name: string;
    class_name: string;
    is_registered: boolean;
    student: {
        id: number;
        user_id: number;
        email: string | null;
    } | null;
    form_default: {
        nipd: string;
        name: string;
        class_name: string;
    };
};

export type Teacher = {
    id: number;
    user_id: number;
    name: string;
    email: string;
    nik: string;
    avatar_url: string | null;
    form_default: {
        name: string;
        email: string;
        nik: string;
    };
};