export type FormField =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement;

export function clearFieldError(
  field: FormField,
  errorElement: HTMLElement,
): void {
  field.removeAttribute("aria-invalid");
  errorElement.textContent = "";
  errorElement.classList.add("hidden");
}

export function showFieldError(
  field: FormField,
  errorElement: HTMLElement,
  message: string,
): void {
  field.setAttribute("aria-invalid", "true");
  errorElement.textContent = message;
  errorElement.classList.remove("hidden");
}
