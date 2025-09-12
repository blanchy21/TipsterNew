import '@testing-library/jest-dom'

declare global {
    namespace jest {
        interface Matchers<R> {
            toBeInTheDocument(): R
            toHaveAttribute(attr: string, value?: string): R
            toHaveTextContent(text: string | RegExp): R
            toHaveStyle(style: string | Record<string, any>): R
            toHaveFocus(): R
            toHaveClass(className: string): R
            toBeVisible(): R
            toBeDisabled(): R
            toBeEnabled(): R
            toHaveValue(value: string | string[] | number): R
            toBeChecked(): R
            toBePartiallyChecked(): R
            toHaveFormValues(expectedValues: Record<string, any>): R
            toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R
            toHaveAccessibleDescription(description?: string | RegExp): R
            toHaveAccessibleName(name?: string | RegExp): R
            toHaveDescription(description?: string | RegExp): R
        }
    }
}
