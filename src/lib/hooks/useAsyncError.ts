import { useCallback, useRef } from 'react';

interface AsyncErrorState {
    error: Error | null;
    isError: boolean;
    retryCount: number;
}

interface UseAsyncErrorOptions {
    onError?: (error: Error) => void;
    maxRetries?: number;
    retryDelay?: number;
}

export function useAsyncError(options: UseAsyncErrorOptions = {}) {
    const { onError, maxRetries = 3, retryDelay = 1000 } = options;
    const retryCountRef = useRef(0);
    const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleError = useCallback((error: Error) => {
        console.error('Async error caught:', error);

        if (onError) {
            onError(error);
        }

        // Reset retry count after successful operation
        retryCountRef.current = 0;
    }, [onError]);

    const handleAsyncOperation = useCallback(async <T>(
        asyncFn: () => Promise<T>,
        onRetry?: () => void
    ): Promise<T | null> => {
        try {
            const result = await asyncFn();
            retryCountRef.current = 0; // Reset on success
            return result;
        } catch (error) {
            const err = error instanceof Error ? error : new Error(String(error));

            if (retryCountRef.current < maxRetries) {
                retryCountRef.current += 1;

                console.warn(`Retrying operation (attempt ${retryCountRef.current}/${maxRetries}):`, err.message);

                if (onRetry) {
                    onRetry();
                }

                // Wait before retrying
                await new Promise(resolve => {
                    retryTimeoutRef.current = setTimeout(resolve, retryDelay);
                });

                // Recursive retry
                return handleAsyncOperation(asyncFn, onRetry);
            } else {
                handleError(err);
                return null;
            }
        }
    }, [maxRetries, retryDelay, handleError]);

    const resetError = useCallback(() => {
        retryCountRef.current = 0;
        if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
            retryTimeoutRef.current = null;
        }
    }, []);

    return {
        handleAsyncOperation,
        resetError,
        retryCount: retryCountRef.current,
    };
}

export default useAsyncError;
