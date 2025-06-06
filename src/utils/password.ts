import bcryptjs from "bcryptjs";

export const verifyPassword = async (inputPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcryptjs.compare(inputPassword, hashedPassword);
};

export const hashPassword = async (password: string) => {
    const hashedPassword = await bcryptjs.hash(password, 8);
    return hashedPassword;
};