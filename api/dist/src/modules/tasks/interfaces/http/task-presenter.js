const colombiaDate = (value) => {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(value);
    const result = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
    return `${result.year}-${result.month}-${result.day}`;
};
export const presentTask = (task) => ({
    ...task,
    createdAt: colombiaDate(task.createdAt),
    updatedAt: colombiaDate(task.updatedAt),
});
