export function formatCurrency(amount: number) {
   return new Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'}).format(amount)
}

export function formatDate(date: string) : string {
   const dateObj = new Date(date);
   const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
   }
   return new Intl.DateTimeFormat('es-ES', options).format(dateObj);
}