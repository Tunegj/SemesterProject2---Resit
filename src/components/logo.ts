export function logo() {
  return `
    <a href="#/" class="inline-flex items-center gap-3" aria-label="FureverHome home page">
        <span class=text=2xl font-bold tracking-tight">
            <span class="text-[#2d6a6a]">Furever</span><span class="text-[#2c2c2c]">Home</span>
        </span>

        <span class="flex items-center gap-1 text-[#f4c95d]" aria-hidden="true">
            <iconify-icon icon="mdi:paw" class=text-xl -rotate-12></iconify-icon>
            <iconify-icon icon="mdi:paw" class=text-lg rotate-12 translate-y-2></iconify-icon>
        </span>
    </a>
    `;
}
