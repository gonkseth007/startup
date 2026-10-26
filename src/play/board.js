export function createEmptyBoard() {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => ({
            shipID: null,
            shot: null,
        }))
    );
}