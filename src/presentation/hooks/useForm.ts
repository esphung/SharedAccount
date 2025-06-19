import { useCallback, useRef, useState } from "react";

import type { TextInput } from "react-native";

type FormFields<T> = {
	[K in keyof T]: T[K];
};

type FormErrors<T> = {
	[K in keyof T]?: string;
};

function useForm<T extends object>(initialValues: T) {
	const [values, setValues] = useState<FormFields<T>>(initialValues);
	const [errors, setErrors] = useState<FormErrors<T>>({});

	const inputRefs = useRef<{ [K in keyof T]?: TextInput | null }>({});

	const handleChange = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
		setValues((prev) => ({ ...prev, [key]: value }));
		setErrors((prev) => ({ ...prev, [key]: undefined }));
	}, []);

	const setFieldError = useCallback(<K extends keyof T>(key: K, error: string) => {
		setErrors((prev) => ({ ...prev, [key]: error }));
	}, []);

	const validate = useCallback(
		(validationFn: (values: FormFields<T>) => FormErrors<T>) => {
			const validationErrors = validationFn(values);
			setErrors(validationErrors);
			return Object.keys(validationErrors).length === 0;
		},
		[values]
	);

	const resetForm = useCallback(() => {
		setValues(initialValues);
		setErrors({});
	}, [initialValues]);

	const registerInput = useCallback(<K extends keyof T>(key: K, ref: TextInput | null) => {
		inputRefs.current[key] = ref;
	}, []);

	const focusNextField = useCallback(
		(requiredFields: (keyof T)[]) => {
			for (const field of requiredFields) {
				const value = values[field];
				if (!value || (typeof value === "string" && value.trim() === "")) {
					inputRefs.current[field]?.focus();
					break;
				}
			}
		},
		[values]
	);

	return {
		values,
		errors,
		handleChange,
		setFieldError,
		validate,
		resetForm,
		setValues, // This one is already memoized by React
		registerInput,
		focusNextField,
	};
}

export default useForm;
