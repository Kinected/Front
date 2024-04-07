export function isSameDay(dateStr: string, isTomorrow: boolean) {
    const today = new Date();
    const tomorrow = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
    );

    const compareDate = isTomorrow ? tomorrow : today;

    const date = new Date(dateStr);

    return (
        compareDate.getFullYear() === date.getFullYear() &&
        compareDate.getMonth() === date.getMonth() &&
        compareDate.getDate() === date.getDate()
    );
}
