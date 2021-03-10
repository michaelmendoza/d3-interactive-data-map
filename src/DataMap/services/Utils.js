
export const range = (start, end) => {
    const length = end - start;
    return Array.from({ length }, (_, i) => start + i);
}

export const arrayFactory = (fn, N) => {
    Array.from({ length:N }, (_, i) => fn());
}