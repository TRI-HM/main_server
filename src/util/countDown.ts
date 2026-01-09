const countDown = (seconds: number) => {
    let intervalId: NodeJS.Timeout;
    const promise = new Promise<number>((resolve) => {
        let result = seconds;
        intervalId = setInterval(() => {
            result--;
            if (result < 0) {
                clearInterval(intervalId);
                resolve(0);
            }
        }, 1000);
    });

    return {
        promise,
        cancel: () => clearInterval(intervalId)
    };
};

export default countDown;