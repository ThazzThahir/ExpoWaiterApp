export const validateUsername = (username: string): string | null => {
    if (!username) {
        return "Username is required";
    }

    if (username.length < 3) {
        return "Username must be at least 3 characters";
    }

    return null;
};

export const validatePassword = (password: string): string | null => {
    if (!password) {
        return "Password is required";
    }

    if (password.length < 5) {
        return "Password must be at least 6 characters";
    }

    return null;
};

export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const formatDuration = (startDateString: string): string => {
    const startDate = new Date(startDateString);
    const now = new Date();

    const diffMs = now.getTime() - startDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) {
        return `${diffMins}m`;
    } else {
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    }
};
