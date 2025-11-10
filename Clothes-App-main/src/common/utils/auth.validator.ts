const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

export const validEmail = (email: string) => {
    return emailRegex.test(email);
}