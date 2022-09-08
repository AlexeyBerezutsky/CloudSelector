export const populateValue = <T extends object = object>(value: T, length: number) => Array.from({ length }, () => ({ ...value }));

export const expectArrayEquivalence = <T extends any>(actual: T[], expected: T[]) => {
    expect(actual).toMatchObject(expect.arrayContaining(expected));
    expect(expected).toMatchObject(expect.arrayContaining(actual));
};

export const shuffle = <T extends any>(array: T[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};

export const getArrayOfStrings = (size: number) => [...Array(size)].map(() => [...Array(~~(Math.random() * 10 + 3))].map(() => String.fromCharCode(Math.random() * (123 - 97) + 97)).join(''));
