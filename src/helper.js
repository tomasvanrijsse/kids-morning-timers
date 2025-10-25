export const dayTimestamp = (hour, minute, second = 0) => {
    return (hour * 60 * 60) + (minute * 60) + (second);
}
