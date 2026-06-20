export function logo() {
  return `
    <a
      href="#/"
      aria-label="FureverHome home page"
      class="inline-flex items-center gap-2 text-decoration-none"
    >
      <span class="text-4xl font-bold tracking-tight">
        <span class="text-[#2d6a6a]">Furever</span>
        <span class="text-[#2c2c2c]">Home</span>
      </span>

      <span class="relative h-8 w-10 shrink-0">
        <iconify-icon
          icon="mdi:paw"
          class="absolute left-0 top-[-6px] rotate-[-12deg] text-2xl text-[#f4c95d]"
        ></iconify-icon>

        <iconify-icon
          icon="mdi:paw"
          class="absolute left-4 top-2 rotate-[12deg] text-2xl text-[#f4c95d]"
        ></iconify-icon>
      </span>
    </a>
  `;
}
