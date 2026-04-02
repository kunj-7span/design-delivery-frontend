import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({ children, type = 'button', className = '', isLoading = false, disabled = false, ...props }) => {
    const baseStyles = 'font-semibold rounded-xl shadow flex items-center justify-center transition-all disabled:opacity-70 disabled:cursor-not-allowed';
    const combinedClassName = `${baseStyles} ${className}`;

    return (
        <button
            type={type}
            className={combinedClassName}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait...
                </>
            ) : (
                children
            )}
        </button>
    );
}

export default Button;